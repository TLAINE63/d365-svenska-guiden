import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { requestIsEditor } from "../_shared/editorAuth.ts";
import { isFreeEmailDomain, FREE_EMAIL_ERROR_SV } from "../_shared/freeEmailDomains.ts";
import { Resend } from "../_shared/branded-resend.ts";
import { randomToken, sha256, escapeHtml, NEWSLETTER_CONSENT_VERSION } from "../_shared/webinar.ts";
import { str, toCsv } from "../_shared/demandExport.ts";

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  consent: z.literal(true),
  source_page: z.string().trim().max(300).optional().nullable(),
  utm_source: z.string().trim().max(200).optional().nullable(),
  utm_medium: z.string().trim().max(200).optional().nullable(),
  utm_campaign: z.string().trim().max(200).optional().nullable(),
});
const tokenActionSchema = z.object({
  action: z.enum(["confirm", "unsubscribe"]),
  token: z.string().regex(/^[a-f0-9]{64}$/),
});
const CSV_COLUMNS = ["email", "confirmed_at", "consent_text_version", "source_page", "utm_source", "utm_medium", "utm_campaign", "created_at", "unsubscribe_token"];
const rate = new Map<string, { count: number; reset: number }>();

function limited(key: string): boolean {
  const now = Date.now();
  const current = rate.get(key);
  if (!current || now > current.reset) {
    rate.set(key, { count: 1, reset: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
    status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const url = new URL(req.url);
  const adminAction = url.searchParams.get("action");

  if (adminAction === "stats" || adminAction === "csv") {
    if (!(await requestIsEditor(req))) return json({ error: "Unauthorized" }, 401);
    const { data, error } = await db.from("newsletter_subscribers")
      .select(CSV_COLUMNS.join(","))
      .not("confirmed_at", "is", null)
      .is("unsubscribed_at", null)
      .order("confirmed_at", { ascending: false });
    if (error) return json({ error: "Kunde inte hämta prenumeranter." }, 500);
    if (adminAction === "stats") return json({ count: data?.length || 0 });
    const rows = (data || []).map((row) => Object.fromEntries(CSV_COLUMNS.map((column) => [column, str(row[column as keyof typeof row])])));
    return new Response(toCsv(CSV_COLUMNS, rows), {
      status: 200,
      headers: { ...cors, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="d365se-nyhetsbrev.csv"', "Cache-Control": "no-store" },
    });
  }

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return json({ error: "För många försök. Vänta en minut." }, 429);

  try {
    const raw = await req.json();
    if (raw?.action === "confirm" || raw?.action === "unsubscribe") {
      const parsed = tokenActionSchema.safeParse(raw);
      if (!parsed.success) return json({ error: "Länken är ogiltig." }, 400);
      const tokenHash = await sha256(parsed.data.token);
      if (parsed.data.action === "confirm") {
        const { data } = await db.from("newsletter_subscribers")
          .update({ confirmed_at: new Date().toISOString(), unsubscribed_at: null })
          .eq("confirmation_token_hash", tokenHash)
          .is("confirmed_at", null)
          .select("id").maybeSingle();
        return json({ ok: true, already: !data });
      }
      await db.from("newsletter_subscribers")
        .update({ unsubscribed_at: new Date().toISOString() })
        .eq("unsubscribe_token_hash", tokenHash)
        .is("unsubscribed_at", null);
      return json({ ok: true });
    }

    const parsed = subscribeSchema.safeParse(raw);
    if (!parsed.success) return json({ error: "Ange en giltig e-postadress och kryssa i samtycket." }, 400);
    const input = parsed.data;
    if (isFreeEmailDomain(input.email)) return json({ error: FREE_EMAIL_ERROR_SV }, 400);

    const { data: existing } = await db.from("newsletter_subscribers")
      .select("id, confirmed_at, unsubscribed_at")
      .eq("email", input.email)
      .maybeSingle();
    if (existing?.confirmed_at && !existing.unsubscribed_at) return json({ ok: true, pending: false });

    const confirmationToken = randomToken();
    const unsubscribeToken = randomToken();
    const payload = {
      email: input.email,
      confirmed_at: null,
      unsubscribed_at: null,
      consent_text_version: NEWSLETTER_CONSENT_VERSION,
      source_page: input.source_page || null,
      utm_source: input.utm_source || null,
      utm_medium: input.utm_medium || null,
      utm_campaign: input.utm_campaign || null,
      created_at: new Date().toISOString(),
      confirmation_token_hash: await sha256(confirmationToken),
      unsubscribe_token_hash: await sha256(unsubscribeToken),
      unsubscribe_token: unsubscribeToken,
    };
    const { error } = existing
      ? await db.from("newsletter_subscribers").update(payload).eq("id", existing.id)
      : await db.from("newsletter_subscribers").insert(payload);
    if (error) return json({ error: "Anmälan kunde inte sparas." }, 500);

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) return json({ error: "Mejltjänsten är inte tillgänglig." }, 500);
    const resend = new Resend(resendKey);
    const confirmationUrl = `https://d365.se/nyhetsbrev/bekrafta/?t=${confirmationToken}`;
    const { data: sentMessage, error: sendError } = await resend.emails.send({
      from: "Thomas Laine | D365.SE <info@d365.se>",
      to: [input.email],
      subject: "Bekräfta nyhetsbrev från d365.se",
      html: `
        <h1 style="font-size:22px;margin:0 0 14px">Bekräfta din prenumeration</h1>
        <p style="margin:0 0 16px">Någon har anmält den här adressen till nya artiklar och webinarinbjudningar från d365.se, högst två gånger i månaden.</p>
        <p style="margin:0 0 22px"><a href="${escapeHtml(confirmationUrl)}" style="display:inline-block;background:#0E7C86;color:#ffffff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600">Bekräfta prenumerationen</a></p>
        <p style="margin:0;font-size:13px;color:#555">Adressen blir prenumerant först efter ditt klick. Om du inte har anmält dig kan du bortse från mejlet. Obekräftade adresser raderas efter sju dagar.</p>`,
    });
    if (sendError) return json({ error: "Bekräftelsemejlet kunde inte skickas. Försök igen." }, 500);
    return json({ ok: true, pending: true });
  } catch {
    return json({ error: "Förfrågan kunde inte genomföras just nu." }, 500);
  }
});
