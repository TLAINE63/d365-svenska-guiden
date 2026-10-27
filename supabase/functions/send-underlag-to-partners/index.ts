import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "../_shared/branded-resend.ts";
import { isFreeEmailDomain, FREE_EMAIL_ERROR_SV } from "../_shared/freeEmailDomains.ts";
import { checkAndLogQuota } from "../_shared/ai-quota.ts";
import { ADVISOR_BCC, UNDERLAG_PDF_BUCKET, isValidEmail, labelFor, sanitize } from "../_shared/underlagForward.ts";

/**
 * Publikt formulär "Skicka underlag till partners".
 * Sparar bara en förfrågan som väntar på godkännande. Inga mejl går till partners eller
 * till köparens angivna adress härifrån; det sker först när en administratör godkänner
 * förfrågan via manage-underlag-forwards. Endast ett internt meddelande går till d365.se.
 */

const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

function decodePdfBase64(b64: string): { ok: true; bytes: Uint8Array } | { ok: false; error: string } {
  const clean = b64.replace(/^data:[^;]+;base64,/, "").replace(/\s/g, "");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(clean)) return { ok: false, error: "Ogiltig bilaga" };
  if (clean.length * 0.75 > MAX_PDF_BYTES) return { ok: false, error: "Bilagan är för stor (max 10 MB)" };
  let bin: string;
  try {
    bin = atob(clean);
  } catch {
    return { ok: false, error: "Ogiltig bilaga" };
  }
  if (bin.length > MAX_PDF_BYTES) return { ok: false, error: "Bilagan är för stor (max 10 MB)" };
  if (!bin.startsWith("%PDF-")) return { ok: false, error: "Endast PDF-filer tillåts som bilaga" };
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { ok: true, bytes };
}

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  if (origin.startsWith("http://localhost:")) return true;
  if (origin.endsWith(".lovable.app")) return true;
  if (origin.endsWith(".lovableproject.com")) return true;
  if (origin === "https://d365.se" || origin === "https://www.d365.se") return true;
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : "https://d365-svenska-guiden.lovable.app";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

const str = (v: unknown, max: number): string | null => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
};

interface Payload {
  contact: { company_name: string; contact_name: string; email: string; phone?: string; message?: string };
  assessment_type: string;
  source_page: string;
  partner_slugs: string[];
  products?: string[];
  industry?: string;
  company_size?: string;
  underlag_summary: string;
  result_url?: string;
  pdf_base64?: string;
  pdf_filename?: string;
  honeypot?: string;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const reply = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const payload = (await req.json()) as Payload;

    // Honeypot – tyst avvisning av botar
    if (payload?.honeypot && String(payload.honeypot).length > 0) return reply({ ok: true, pending_review: true });

    if (
      !payload?.contact?.email ||
      !isValidEmail(payload.contact.email) ||
      !str(payload.contact.company_name, 200) ||
      !str(payload.contact.contact_name, 200) ||
      !Array.isArray(payload.partner_slugs) ||
      payload.partner_slugs.length === 0 ||
      payload.partner_slugs.length > 6 ||
      !payload.partner_slugs.every((s) => typeof s === "string" && /^[a-z0-9-]{1,120}$/i.test(s)) ||
      typeof payload.assessment_type !== "string" ||
      !/^[a-z0-9_-]{1,80}$/i.test(payload.assessment_type) ||
      typeof payload.underlag_summary !== "string" ||
      !payload.underlag_summary.trim() ||
      payload.underlag_summary.length > 20000 ||
      (payload.contact.message !== undefined && typeof payload.contact.message !== "string") ||
      (payload.contact.message && payload.contact.message.length > 4000)
    ) {
      return reply({ error: "Ogiltiga indata" }, 400);
    }

    if (isFreeEmailDomain(payload.contact.email)) return reply({ error: FREE_EMAIL_ERROR_SV }, 400);

    let pdfBytes: Uint8Array | null = null;
    if (payload.pdf_base64) {
      const pdf = decodePdfBase64(payload.pdf_base64);
      if (!pdf.ok) return reply({ error: pdf.error }, 400);
      pdfBytes = pdf.bytes;
    }

    // Rate limiting per IP och dygn
    const quota = await checkAndLogQuota(req, "send-underlag-to-partners", 5);
    if (!quota.allowed) {
      return reply({ error: "För många förfrågningar. Försök igen imorgon eller kontakta oss direkt." }, 429);
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Bara partners som finns i katalogen sparas på förfrågan.
    const slugs = Array.from(new Set(payload.partner_slugs.map((s) => s.toLowerCase())));
    const { data: partnerRows, error: partnersErr } = await supabase
      .from("partners")
      .select("slug, name")
      .in("slug", slugs);
    if (partnersErr) {
      console.error("Partner lookup error:", partnersErr);
      return reply({ error: "Kunde inte slå upp partners" }, 500);
    }
    const partners = partnerRows || [];
    if (partners.length === 0) return reply({ error: "Inga giltiga partners valda" }, 400);

    const contact = payload.contact;
    const label = labelFor(payload.assessment_type);
    const products = Array.isArray(payload.products)
      ? payload.products.filter((p) => typeof p === "string").map((p) => p.slice(0, 80)).slice(0, 12)
      : [];

    // Lead för CRM-uppföljning (status ny, väntar på granskning)
    const { data: leadRow, error: leadErr } = await supabase
      .from("leads")
      .insert({
        company_name: sanitize(contact.company_name).slice(0, 200),
        contact_name: sanitize(contact.contact_name).slice(0, 200),
        email: contact.email.trim().toLowerCase().slice(0, 255),
        phone: contact.phone ? sanitize(contact.phone).slice(0, 40) : null,
        industry: str(payload.industry, 120),
        selected_product: products.join(", ") || null,
        source_page: str(payload.source_page, 300),
        source_type: "analysis_forward",
        message: [
          `[${label}] (väntar på godkännande före utskick)`,
          contact.message ? `Meddelande: ${contact.message}` : null,
          "",
          "Sammanfattning av underlag:",
          payload.underlag_summary,
        ].filter((x) => x !== null).join("\n").slice(0, 8000),
        assigned_partners: partners.map((p) => p.slug),
        status: "new",
        company_size: str(payload.company_size, 80),
      })
      .select("id")
      .single();
    if (leadErr) console.error("Lead insert error:", leadErr);

    const { data: reqRow, error: reqErr } = await supabase
      .from("underlag_forward_requests")
      .insert({
        company_name: str(contact.company_name, 200)!,
        contact_name: str(contact.contact_name, 200)!,
        email: contact.email.trim().toLowerCase().slice(0, 255),
        phone: str(contact.phone, 40),
        message: str(contact.message, 4000),
        assessment_type: payload.assessment_type,
        source_page: str(payload.source_page, 300),
        partner_slugs: partners.map((p) => p.slug),
        products,
        industry: str(payload.industry, 120),
        company_size: str(payload.company_size, 80),
        underlag_summary: payload.underlag_summary.trim(),
        result_url: str(payload.result_url, 500),
        pdf_filename: pdfBytes
          ? (payload.pdf_filename && /\.pdf$/i.test(payload.pdf_filename) ? payload.pdf_filename : "underlag.pdf")
              .replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 120)
          : null,
        lead_id: leadRow?.id || null,
      })
      .select("id")
      .single();
    if (reqErr || !reqRow) {
      console.error("Forward request insert error:", reqErr);
      return reply({ error: "Kunde inte spara underlaget" }, 500);
    }

    if (pdfBytes) {
      const path = `underlag-forward/${reqRow.id}.pdf`;
      const { error: upErr } = await supabase.storage
        .from(UNDERLAG_PDF_BUCKET)
        .upload(path, pdfBytes, { contentType: "application/pdf", upsert: true });
      if (upErr) console.error("PDF upload error:", upErr);
      else await supabase.from("underlag_forward_requests").update({ pdf_path: path }).eq("id", reqRow.id);
    }

    // Internt meddelande till d365.se (fast mottagare, inget köparinnehåll)
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "d365.se <info@d365.se>",
          to: ADVISOR_BCC,
          subject: `Underlag väntar på godkännande (${partners.length} partners)`,
          html: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;">
            <p>Ett nytt underlag (${sanitize(label)}) väntar på godkännande innan det skickas till ${partners.length} partners.</p>
            <p>Granska och godkänn det i admin under Leads &amp; partners → Underlag att godkänna.</p>
            <p style="color:#888;font-size:12px;">Referens: ${reqRow.id}</p></div>`,
          tags: [{ name: "type", value: "analysis_forward_pending" }],
        });
      } catch (err) {
        console.error("Admin notification failed:", err);
      }
    }

    return reply({ ok: true, pending_review: true, total: partners.length, request_id: reqRow.id });
  } catch (err) {
    console.error("send-underlag-to-partners error:", err);
    return reply({ error: "Internt fel" }, 500);
  }
});
