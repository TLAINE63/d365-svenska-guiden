import { createClient } from "npm:@supabase/supabase-js@2";
import { getCorsHeaders, json, verifyAdminJWT, cleanText } from "../_shared/isvAuth.ts";
import { Resend } from "../_shared/branded-resend.ts";
import {
  ADVISOR_BCC, UNDERLAG_PDF_BUCKET, buyerConfirmationHtml, isValidEmail, labelFor, partnerEmailHtml,
  type ForwardRequestRow,
} from "../_shared/underlagForward.ts";

/**
 * Admin: granska underlag som köpare vill skicka till partners.
 * Inget mejl går till partners eller köparen förrän en administratör godkänner här.
 */

const isUuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v);

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(bin);
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!token || !(await verifyAdminJWT(token, secret, ["admin"]))) return json({ error: "Unauthorized" }, 401, cors);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, secret);
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* tom */ }
  const action = String(body.action || "list");

  try {
    if (action === "list") {
      const { data, error } = await sb
        .from("underlag_forward_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw error;
      const slugs = Array.from(new Set((data || []).flatMap((r) => r.partner_slugs || [])));
      const { data: partners } = slugs.length
        ? await sb.from("partners").select("slug, name, email, is_featured").in("slug", slugs)
        : { data: [] as { slug: string; name: string; email: string | null; is_featured: boolean | null }[] };
      return json({
        requests: data || [],
        partners: (partners || []).map((p) => ({ slug: p.slug, name: p.name, has_email: !!p.email && isValidEmail(p.email), is_featured: !!p.is_featured })),
      }, 200, cors);
    }

    if (!isUuid(body.id)) return json({ error: "Ogiltigt id" }, 400, cors);
    const { data: row, error: rowErr } = await sb.from("underlag_forward_requests").select("*").eq("id", body.id).single();
    if (rowErr || !row) return json({ error: "Förfrågan finns inte" }, 404, cors);
    if (row.status !== "pending") return json({ error: "Förfrågan är redan hanterad" }, 400, cors);

    if (action === "reject") {
      const { error } = await sb.from("underlag_forward_requests")
        .update({ status: "rejected", reviewed_at: new Date().toISOString(), review_note: cleanText(body.note, 1000) })
        .eq("id", row.id).eq("status", "pending");
      if (error) throw error;
      return json({ ok: true }, 200, cors);
    }

    if (action !== "approve") return json({ error: "Okänd åtgärd" }, 400, cors);

    // Administratören kan välja bort partners innan utskick.
    const chosen = Array.isArray(body.partner_slugs)
      ? (body.partner_slugs as unknown[]).filter((s): s is string => typeof s === "string" && (row.partner_slugs || []).includes(s))
      : row.partner_slugs || [];
    if (chosen.length === 0) return json({ error: "Välj minst en partner" }, 400, cors);

    const { data: partnerRows, error: pErr } = await sb.from("partners").select("slug, name, email, contact_person").in("slug", chosen);
    if (pErr) throw pErr;
    const partners = (partnerRows || []).filter((p) => p.email && isValidEmail(p.email));
    if (partners.length === 0) return json({ error: "Ingen av de valda partnerna har en giltig e-postadress" }, 400, cors);

    // Lås förfrågan innan utskick så att den inte kan skickas två gånger.
    const { data: locked, error: lockErr } = await sb.from("underlag_forward_requests")
      .update({ status: "approved", reviewed_at: new Date().toISOString(), review_note: cleanText(body.note, 1000) })
      .eq("id", row.id).eq("status", "pending").select("id");
    if (lockErr) throw lockErr;
    if (!locked || locked.length === 0) return json({ error: "Förfrågan är redan hanterad" }, 400, cors);

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) return json({ error: "E-posttjänsten är inte konfigurerad" }, 500, cors);
    const resend = new Resend(resendKey);

    let attachments: { filename: string; content: string }[] | undefined;
    if (row.pdf_path) {
      const { data: file, error: dlErr } = await sb.storage.from(UNDERLAG_PDF_BUCKET).download(row.pdf_path);
      if (dlErr) console.error("PDF download error:", dlErr);
      else attachments = [{ filename: row.pdf_filename || "underlag.pdf", content: toBase64(new Uint8Array(await file.arrayBuffer())) }];
    }

    const r = row as unknown as ForwardRequestRow;
    const label = labelFor(row.assessment_type);
    let delivered = 0;
    const sentNames: string[] = [];
    for (const p of partners) {
      let ok = false;
      let errMsg: string | null = null;
      try {
        const resp = await resend.emails.send({
          from: "d365.se <info@d365.se>",
          to: [p.email!],
          bcc: ADVISOR_BCC,
          reply_to: row.email,
          subject: `Nytt underlag från d365.se: ${row.company_name} (${label})`,
          html: partnerEmailHtml(r, p.name || "", (p.contact_person as string | null) ?? null, !!attachments),
          attachments,
          tags: [
            { name: "type", value: "analysis_forward" },
            { name: "assessment", value: String(row.assessment_type).slice(0, 60) },
            { name: "partner", value: p.slug.slice(0, 60) },
          ],
        });
        ok = !resp.error;
        if (resp.error) errMsg = String(resp.error);
      } catch (err) {
        errMsg = String(err);
      }
      if (ok) { delivered++; sentNames.push(p.name || p.slug); }
      else console.error("Send failed for", p.slug, errMsg);
      await sb.from("email_send_log").insert({
        message_id: `analysis_forward-${row.lead_id || row.id}-${p.slug}`,
        template_name: "analysis_forward",
        recipient_email: p.email!,
        status: ok ? "sent" : "failed",
        error_message: errMsg,
        metadata: { assessment_type: row.assessment_type, partner_slug: p.slug, lead_id: row.lead_id, request_id: row.id },
      });
    }

    if (delivered > 0) {
      try {
        await resend.emails.send({
          from: "d365.se <info@d365.se>",
          to: [row.email],
          bcc: ADVISOR_BCC,
          subject: `Ert underlag är skickat till ${delivered} Microsoft-partners`,
          html: buyerConfirmationHtml(r, sentNames),
          tags: [
            { name: "type", value: "analysis_forward_confirmation" },
            { name: "assessment", value: String(row.assessment_type).slice(0, 60) },
          ],
        });
      } catch (err) {
        console.error("Buyer confirmation failed:", err);
      }
    }

    await sb.from("underlag_forward_requests").update({ delivered, total: partners.length }).eq("id", row.id);
    if (row.pdf_path) await sb.storage.from(UNDERLAG_PDF_BUCKET).remove([row.pdf_path]);
    return json({ ok: true, delivered, total: partners.length }, 200, cors);
  } catch (e) {
    console.error("manage-underlag-forwards error:", e);
    return json({ error: "Något gick fel" }, 500, cors);
  }
});
