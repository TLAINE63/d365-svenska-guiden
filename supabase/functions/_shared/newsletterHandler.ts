import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import { getCorsHeaders } from "./cors.ts";
import { verifyAdminJWT } from "./isvAuth.ts";
import { exportAuthOk } from "./demandExportAuth.ts";
import { isFreeEmailDomain, FREE_EMAIL_ERROR_SV } from "./freeEmailDomains.ts";
import { Resend } from "./branded-resend.ts";
import { randomToken, sha256, escapeHtml } from "./webinar.ts";
import { toCsv } from "./demandExport.ts";
import { NEWSLETTER_COLUMNS, NEWSLETTER_VERSION, newsletterExportRow, newsletterStats, shouldIssueConfirmation, type Subscriber } from "./newsletterModel.ts";

// Preserve the existing endpoint's ephemeral five-attempts/minute guard.
const rate = new Map<string, { count: number; reset: number }>();
function limited(key: string): boolean {
  const now = Date.now();
  for (const [id, value] of rate) if (value.reset <= now) rate.delete(id);
  const current = rate.get(key);
  if (!current) { rate.set(key, { count: 1, reset: now + 60_000 }); return false; }
  current.count += 1;
  return current.count > 5;
}

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  first_name: z.string().trim().max(100).optional(), company: z.string().trim().max(200).optional(),
  source_page: z.string().trim().max(300).optional().nullable(),
  consent_text_version: z.literal(NEWSLETTER_VERSION).optional(),
  utm_source: z.string().trim().max(200).optional().nullable(),
  utm_medium: z.string().trim().max(200).optional().nullable(),
  utm_campaign: z.string().trim().max(200).optional().nullable(),
});
const fields = NEWSLETTER_COLUMNS.filter(k => k !== "site").concat("id").join(",");
export async function newsletterHandler(req: Request, forced?: "subscribe" | "confirm" | "unsubscribe") {
  const cors = { ...corsHeaders, ...getCorsHeaders(req) };
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const dbUrl = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!dbUrl || !key) return json({ error: "Tjänsten är inte tillgänglig." }, 503);
  const db = createClient(dbUrl, key);
  const url = new URL(req.url);
  try {
    const action = url.searchParams.get("action");
    if (!forced && ["stats", "list", "csv"].includes(action || "")) {
      const token = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
      if (!(await verifyAdminJWT(token, key, ["admin", "editor"])) && !(await exportAuthOk(req))) return json({ error: "Unauthorized" }, 401);
      if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);
      const rows: Subscriber[] = [];
      for (let offset = 0; ; offset += 1000) {
        const { data, error } = await db.from("newsletter_subscribers").select(fields).order("id").range(offset, offset + 999);
        if (error) throw error;
        rows.push(...(data || []) as unknown as Subscriber[]);
        if (!data || data.length < 1000) break;
      }
      if (action === "csv") return new Response(toCsv(NEWSLETTER_COLUMNS, rows.map(newsletterExportRow)), { headers: { ...cors, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="prenumeranter.csv"', "Cache-Control": "no-store" } });
      return json({ rows: action === "list" ? rows : undefined, stats: newsletterStats(rows), count: rows.filter(r => r.status === "aktiv").length });
    }
    if (req.method !== "POST" && !(req.method === "GET" && forced && forced !== "subscribe")) return json({ error: "Method not allowed" }, 405);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (limited(ip)) return json({ error: "För många försök. Vänta en minut." }, 429);
    let raw: Record<string, unknown>;
    try { raw = req.method === "GET" ? { token: url.searchParams.get("token") } : await req.json(); }
    catch { return json({ error: "Ogiltig förfrågan." }, 400); }
    if (!raw || typeof raw !== "object") return json({ error: "Ogiltig förfrågan." }, 400);
    const mode = forced || raw.action || "subscribe";
    if (mode === "confirm" || mode === "unsubscribe") {
      const token = z.string().regex(/^[a-f0-9]{64}$/).safeParse(raw.token);
      if (!token.success) return json({ error: "Länken är ogiltig." }, 400);
      const hash = await sha256(token.data);
      if (mode === "confirm") {
        const { data, error } = await db.rpc("newsletter_confirm_token", { _hash: hash });
        if (error) throw error;
        return data ? json({ ok: true }) : json({ error: "Länken är ogiltig eller har gått ut." }, 400);
      }
      const { data: row, error: readError } = await db.from("newsletter_subscribers").select("id,unsubscribed_at").eq("unsubscribe_token_hash", hash).maybeSingle();
      if (readError) throw readError;
      if (!row) return json({ error: "Länken är ogiltig." }, 400);
      const { error } = await db.from("newsletter_subscribers").update({ status: "avregistrerad", unsubscribed_at: row.unsubscribed_at || new Date().toISOString(), confirmation_expires_at: null, pending_details: null }).eq("id", row.id);
      if (error) throw error;
      return json({ ok: true });
    }
    if (mode !== "subscribe") return json({ error: "Ogiltig förfrågan." }, 400);
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return json({ error: "Ange en giltig e-postadress." }, 400);
    const input = parsed.data;
    if (isFreeEmailDomain(input.email)) return json({ error: FREE_EMAIL_ERROR_SV }, 400);
    const neutral = { ok: true, message: "Tack. Kontrollera din inkorg och bekräfta din anmälan." };
    const { data: suppressed, error: suppressionError } = await db.from("suppressed_emails").select("reason").eq("email", input.email).in("reason", ["bounce", "complaint"]).maybeSingle();
    if (suppressionError) throw suppressionError;
    if (suppressed) return json(neutral);
    const { data: current, error: currentError } = await db.from("newsletter_subscribers").select("status,confirmation_sent_at").eq("email", input.email).eq("list", "kopare").maybeSingle();
    if (currentError) throw currentError;
    if (!shouldIssueConfirmation(current)) return json(neutral);
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) return json({ error: "Mejltjänsten är inte tillgänglig." }, 503);
    const token = randomToken();
    const hash = await sha256(token);
    const { data: claimed, error } = await db.rpc("newsletter_claim_confirmation", { _email: input.email, _hash: hash, _details: input });
    if (error) throw error;
    if (!claimed) return json(neutral);
    const link = `https://d365.se/nyhetsbrev/bekrafta/?t=${token}`;
    const resend = new Resend(resendKey);
    const { data: sent, error: sendError } = await resend.emails.send({
      from: "Thomas Laine | D365.SE <info@d365.se>", reply_to: "thomas.laine@dynamicfactory.se", to: [input.email],
      subject: "Bekräfta månadsbrevet från d365.se",
      html: `<h1>Bekräfta din anmälan</h1><p>Någon har anmält den här adressen till månadsbrevet från d365.se.</p><p><a href="${escapeHtml(link)}">Bekräfta prenumerationen</a></p><p>Länken gäller i 24 timmar. Du får månadsbrevet först efter bekräftelsen. Om du inte har anmält dig kan du bortse från mejlet.</p>`,
    });
    await db.from("email_send_log").insert({ recipient_email: input.email, template_name: "newsletter_double_opt_in", subject: "Bekräfta månadsbrevet från d365.se", status: sendError ? "failed" : "sent", message_id: sent?.id || null, metadata: { source_page: input.source_page || null } });
    if (sendError) {
      // Permit a retry after an actual delivery failure, but never reset a successful link.
      await db.from("newsletter_subscribers").update({ confirmation_sent_at: null }).eq("confirmation_token_hash", hash);
      return json({ error: "Bekräftelsemejlet kunde inte skickas. Försök igen." }, 502);
    }
    return json(neutral);
  } catch {
    return json({ error: "Förfrågan kunde inte genomföras just nu." }, 500);
  }
}
