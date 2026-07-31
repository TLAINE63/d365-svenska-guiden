import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { isFreeEmailDomain, FREE_EMAIL_ERROR_SV } from "../_shared/freeEmailDomains.ts";
import { checkAndLogQuota } from "../_shared/ai-quota.ts";

const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

/** Validates that a base64 payload is a real PDF within the size cap. */
function validatePdfBase64(b64: string): { ok: true; bytes: Uint8Array } | { ok: false; error: string } {
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


const ADVISOR_BCC = ["thomas.laine@dynamicfactory.se", "info@d365.se"];

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

function sanitize(input: string | undefined | null): string {
  if (!input) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}

interface Payload {
  contact: {
    company_name: string;
    contact_name: string;
    email: string;
    phone?: string;
    message?: string;
  };
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


const ASSESSMENT_LABELS: Record<string, string> = {
  bc_matching: "Behovsanalys – Business Central (ERP)",
  fscm_matching: "Behovsanalys – Finance & Supply Chain (ERP)",
  "crm_matching_sales": "Behovsanalys – Dynamics 365 Sales",
  "crm_matching_customer-service": "Behovsanalys – Dynamics 365 Customer Service",
  "crm_matching_marketing": "Behovsanalys – Customer Insights (Marketing)",
  "crm_matching_field-service": "Behovsanalys – Dynamics 365 Field Service",
  "crm_matching_contact-center": "Behovsanalys – Dynamics 365 Contact Center",
  req_spec_erp: "Kravspecifikation – ERP",
  req_spec_sales: "Kravspecifikation – Sälj (D365 Sales)",
  req_spec_customer_service: "Kravspecifikation – Kundservice",
  req_spec_marketing: "Kravspecifikation – Marknad (Customer Insights)",
};

function labelFor(assessmentType: string): string {
  return ASSESSMENT_LABELS[assessmentType] || "Underlag från d365.se";
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = (await req.json()) as Payload;

    // Honeypot – tyst avvisning av botar
    if (payload?.honeypot && String(payload.honeypot).length > 0) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Basic validation
    if (
      !payload?.contact?.email ||
      !isValidEmail(payload.contact.email) ||
      !payload.contact.company_name ||
      !payload.contact.contact_name ||
      !Array.isArray(payload.partner_slugs) ||
      payload.partner_slugs.length === 0 ||
      payload.partner_slugs.length > 6 ||
      !payload.partner_slugs.every((s) => typeof s === "string" && /^[a-z0-9-]{1,120}$/i.test(s)) ||
      !payload.assessment_type ||
      typeof payload.underlag_summary !== "string" ||
      !payload.underlag_summary ||
      payload.underlag_summary.length > 20000
    ) {
      return new Response(JSON.stringify({ error: "Ogiltiga indata" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Blockera fria/personliga e-postdomäner (samma policy som övriga lead-formulär)
    if (isFreeEmailDomain(payload.contact.email)) {
      return new Response(JSON.stringify({ error: FREE_EMAIL_ERROR_SV }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validera ev. PDF-bilaga (magic bytes + storlek)
    if (payload.pdf_base64) {
      const pdfCheck = validatePdfBase64(payload.pdf_base64);
      if (!pdfCheck.ok) {
        return new Response(JSON.stringify({ error: pdfCheck.error }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!payload.pdf_filename || !/\.pdf$/i.test(payload.pdf_filename)) {
        payload.pdf_filename = "underlag.pdf";
      }
    }

    // Rate limiting per IP och dygn
    const quota = await checkAndLogQuota(req, "send-underlag-to-partners", 5);
    if (!quota.allowed) {
      return new Response(
        JSON.stringify({ error: "För många förfrågningar. Försök igen imorgon eller kontakta oss direkt." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }


    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Look up partners
    const { data: partnerRows, error: partnersErr } = await supabase
      .from("partners")
      .select("slug, name, email, contact_person")
      .in("slug", payload.partner_slugs);

    if (partnersErr) {
      console.error("Partner lookup error:", partnersErr);
      return new Response(JSON.stringify({ error: "Kunde inte slå upp partners" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const partners = (partnerRows || []).filter((p) => p.email && isValidEmail(p.email));
    if (partners.length === 0) {
      return new Response(JSON.stringify({ error: "Inga giltiga partnermail hittades" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const assessmentLabel = labelFor(payload.assessment_type);
    const contact = payload.contact;
    const productsList = (payload.products || []).join(", ");

    // Create a lead row for CRM tracking
    const { data: leadRow, error: leadErr } = await supabase
      .from("leads")
      .insert({
        company_name: sanitize(contact.company_name).slice(0, 200),
        contact_name: sanitize(contact.contact_name).slice(0, 200),
        email: contact.email.trim().toLowerCase().slice(0, 255),
        phone: contact.phone ? sanitize(contact.phone).slice(0, 40) : null,
        industry: payload.industry || null,
        selected_product: productsList || null,
        source_page: payload.source_page || null,
        source_type: "analysis_forward",
        message: [
          `[${assessmentLabel}]`,
          contact.message ? `Meddelande: ${contact.message}` : null,
          "",
          "Sammanfattning av underlag:",
          payload.underlag_summary,
        ]
          .filter(Boolean)
          .join("\n")
          .slice(0, 8000),
        assigned_partners: partners.map((p) => p.slug),
        status: "new",
        company_size: payload.company_size || null,
      })
      .select()
      .single();

    if (leadErr) {
      console.error("Lead insert error:", leadErr);
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      return new Response(JSON.stringify({ error: "Emailtjänst inte konfigurerad" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const resend = new Resend(resendKey);

    // Convert plain-text summary to safe HTML paragraphs
    const summaryHtml = sanitize(payload.underlag_summary)
      .split(/\n{2,}/)
      .map((p) => `<p style="margin:0 0 12px 0;line-height:1.6;color:#1a1a1a;">${p.replace(/\n/g, "<br/>")}</p>`)
      .join("");

    const attachments =
      payload.pdf_base64 && payload.pdf_filename
        ? [
            {
              filename: payload.pdf_filename.replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 120),
              content: payload.pdf_base64,
            },
          ]
        : undefined;

    const resultLinkHtml = payload.result_url
      ? `<p style="margin:16px 0;"><a href="${sanitize(payload.result_url)}" style="color:#D64A1F;">Öppna underlaget online</a></p>`
      : "";

    const contactBlockHtml = `
      <table style="width:100%;border-collapse:collapse;margin:12px 0 20px;">
        <tr><td style="padding:6px 8px;background:#f5f2ec;font-weight:600;width:35%;">Företag</td><td style="padding:6px 8px;background:#faf8f4;">${sanitize(contact.company_name)}</td></tr>
        <tr><td style="padding:6px 8px;background:#f5f2ec;font-weight:600;">Kontaktperson</td><td style="padding:6px 8px;background:#faf8f4;">${sanitize(contact.contact_name)}</td></tr>
        <tr><td style="padding:6px 8px;background:#f5f2ec;font-weight:600;">E-post</td><td style="padding:6px 8px;background:#faf8f4;"><a href="mailto:${sanitize(contact.email)}">${sanitize(contact.email)}</a></td></tr>
        ${contact.phone ? `<tr><td style="padding:6px 8px;background:#f5f2ec;font-weight:600;">Telefon</td><td style="padding:6px 8px;background:#faf8f4;">${sanitize(contact.phone)}</td></tr>` : ""}
        ${payload.industry ? `<tr><td style="padding:6px 8px;background:#f5f2ec;font-weight:600;">Bransch</td><td style="padding:6px 8px;background:#faf8f4;">${sanitize(payload.industry)}</td></tr>` : ""}
        ${payload.company_size ? `<tr><td style="padding:6px 8px;background:#f5f2ec;font-weight:600;">Storlek</td><td style="padding:6px 8px;background:#faf8f4;">${sanitize(payload.company_size)}</td></tr>` : ""}
        ${productsList ? `<tr><td style="padding:6px 8px;background:#f5f2ec;font-weight:600;">Produktområde</td><td style="padding:6px 8px;background:#faf8f4;">${sanitize(productsList)}</td></tr>` : ""}
      </table>`;

    const bodyForPartner = (partnerName: string, contactPerson: string | null) => `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;">
        <div style="background:#15130F;padding:22px 28px;">
          <div style="height:3px;background:#D64A1F;width:60px;margin-bottom:14px;"></div>
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">Nytt underlag från d365.se</h1>
          <p style="margin:6px 0 0 0;color:#c9c4bb;font-size:13px;">${sanitize(assessmentLabel)}</p>
        </div>
        <div style="padding:24px 28px;color:#1a1a1a;">
          <p style="margin:0 0 12px 0;">Hej ${sanitize(contactPerson || partnerName)},</p>
          <p style="margin:0 0 16px 0;line-height:1.6;">
            En köpare på d365.se har just genomfört <strong>${sanitize(assessmentLabel)}</strong>
            och valt att skicka sitt underlag till er. Underlaget har även skickats till upp till två andra matchande partners.
          </p>
          ${contactBlockHtml}
          ${contact.message ? `<p style="margin:0 0 8px 0;"><strong>Meddelande från köparen:</strong></p><blockquote style="margin:0 0 16px 0;padding:10px 14px;background:#faf8f4;border-left:3px solid #D64A1F;color:#333;">${sanitize(contact.message)}</blockquote>` : ""}
          <h2 style="font-size:15px;margin:24px 0 10px 0;color:#0E7C86;">Sammanfattning av underlaget</h2>
          ${summaryHtml}
          ${resultLinkHtml}
          ${attachments ? `<p style="margin:16px 0 0 0;color:#555;font-size:13px;">📎 Fullständigt underlag bifogas som PDF.</p>` : ""}
          <p style="margin:24px 0 0 0;line-height:1.6;">
            Vänligen svara direkt till köparen på <a href="mailto:${sanitize(contact.email)}" style="color:#D64A1F;">${sanitize(contact.email)}</a>.
            Rådgivningsteamet på d365.se är kopierat (BCC) för uppföljning.
          </p>
          <p style="margin:24px 0 0 0;color:#888;font-size:12px;">Referens: ${leadRow?.id || "n/a"}</p>
        </div>
      </div>`;

    // Send to each partner
    const results: Array<{ slug: string; ok: boolean; error?: string }> = [];
    for (const p of partners) {
      try {
        const resp = await resend.emails.send({
          from: "d365.se <info@d365.se>",
          to: [p.email!],
          bcc: ADVISOR_BCC,
          reply_to: contact.email,
          subject: `Nytt underlag från d365.se: ${contact.company_name} (${assessmentLabel})`,
          html: bodyForPartner(p.name || "", p.contact_person as string | null),
          attachments,
          tags: [
            { name: "type", value: "analysis_forward" },
            { name: "assessment", value: payload.assessment_type.slice(0, 60) },
            { name: "partner", value: p.slug.slice(0, 60) },
          ],
        });
        results.push({ slug: p.slug, ok: !resp.error });
        if (resp.error) console.error("Resend error for", p.slug, resp.error);

        // Log in email_send_log (best-effort)
        await supabase.from("email_send_log").insert({
          message_id: `analysis_forward-${leadRow?.id || crypto.randomUUID()}-${p.slug}`,
          template_name: "analysis_forward",
          recipient_email: p.email!,
          status: resp.error ? "failed" : "sent",
          error_message: resp.error ? String(resp.error) : null,
          metadata: {
            assessment_type: payload.assessment_type,
            partner_slug: p.slug,
            lead_id: leadRow?.id || null,
            buyer_email: contact.email,
          },
        });
      } catch (err) {
        console.error("Send failed for", p.slug, err);
        results.push({ slug: p.slug, ok: false, error: String(err) });
      }
    }

    // Buyer confirmation
    const partnerListHtml = partners
      .map((p) => `<li style="margin:0 0 6px 0;">${sanitize(p.name || p.slug)}</li>`)
      .join("");
    try {
      await resend.emails.send({
        from: "d365.se <info@d365.se>",
        to: [contact.email],
        bcc: ADVISOR_BCC,
        subject: `Ditt underlag är skickat till ${partners.length} Microsoft-partners`,
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;">
            <div style="background:#15130F;padding:22px 28px;">
              <div style="height:3px;background:#D64A1F;width:60px;margin-bottom:14px;"></div>
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">Tack – underlaget är skickat</h1>
              <p style="margin:6px 0 0 0;color:#c9c4bb;font-size:13px;">${sanitize(assessmentLabel)}</p>
            </div>
            <div style="padding:24px 28px;color:#1a1a1a;line-height:1.6;">
              <p style="margin:0 0 14px 0;">Hej ${sanitize(contact.contact_name)},</p>
              <p style="margin:0 0 14px 0;">Vi har skickat ert underlag från ${sanitize(assessmentLabel)} till följande matchande Microsoft-partners:</p>
              <ul style="margin:0 0 16px 20px;padding:0;">${partnerListHtml}</ul>
              <p style="margin:0 0 14px 0;">Partnerna återkommer normalt inom 1–3 arbetsdagar direkt till din e-post. Rådgivningsteamet på d365.se följer upp för att säkerställa att ni får svar.</p>
              <p style="margin:0;color:#555;font-size:13px;">Vill du att fler partners får underlaget? Svara på det här mailet så hjälper vi dig.</p>
            </div>
          </div>`,
        tags: [
          { name: "type", value: "analysis_forward_confirmation" },
          { name: "assessment", value: payload.assessment_type.slice(0, 60) },
        ],
      });
    } catch (err) {
      console.error("Buyer confirmation failed:", err);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        delivered: results.filter((r) => r.ok).length,
        total: partners.length,
        lead_id: leadRow?.id || null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("send-underlag-to-partners error:", err);
    return new Response(JSON.stringify({ error: "Internt fel" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
