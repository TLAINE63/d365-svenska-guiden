import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { isFreeEmailDomain, FREE_EMAIL_ERROR_SV } from "../_shared/freeEmailDomains.ts";
import { Resend } from "../_shared/branded-resend.ts";
import {
  randomToken, sha256, webinarEmailHtml, webinarIcsBase64, webinarEndsAt,
  WEBINAR_CONSENT_VERSION, type WebinarMailRecord,
} from "../_shared/webinar.ts";

const optionalText = (max: number) => z.string().trim().max(max).optional().nullable();
const registrationSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  company: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(150),
  email: z.string().trim().toLowerCase().email().max(255),
  consent_reminder: z.literal(true),
  consent_followup: z.boolean().default(false),
  source_page: optionalText(300),
  landing_page: optionalText(300),
  session_pages: z.array(z.string().trim().max(300)).max(30).optional().nullable(),
  utm_source: optionalText(200),
  utm_medium: optionalText(200),
  utm_campaign: optionalText(200),
});
const tokenSchema = z.object({ action: z.literal("cancel"), token: z.string().regex(/^[a-f0-9]{64}$/) });
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
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return json({ error: "För många försök. Vänta en minut." }, 429);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return json({ error: "Mejltjänsten är inte tillgänglig." }, 500);
  const resend = new Resend(resendKey);

  try {
    const raw = await req.json();
    if (raw?.action === "cancel") {
      const parsed = tokenSchema.safeParse(raw);
      if (!parsed.success) return json({ error: "Länken är ogiltig." }, 400);
      const tokenHash = await sha256(parsed.data.token);
      await db.from("webinar_registrations")
        .update({ cancelled_at: new Date().toISOString() })
        .eq("cancel_token_hash", tokenHash)
        .is("cancelled_at", null);
      return json({ ok: true });
    }

    const parsed = registrationSchema.safeParse(raw);
    if (!parsed.success) return json({ error: "Fyll i alla obligatoriska fält och godkänn att vi skickar länk och påminnelse." }, 400);
    const input = parsed.data;
    if (isFreeEmailDomain(input.email)) return json({ error: FREE_EMAIL_ERROR_SV }, 400);

    const { data: webinar, error: webinarError } = await db.from("webinars")
      .select("id, slug, title, description, starts_at, duration_min, speakers, join_url, recording_url, status")
      .eq("slug", input.slug)
      .eq("status", "publicerad")
      .maybeSingle();
    if (webinarError || !webinar || webinarEndsAt(webinar).getTime() <= Date.now()) {
      return json({ error: "Anmälan är stängd för detta webinar." }, 400);
    }

    let { data: registration } = await db.from("webinar_registrations")
      .select("id, email, cancel_token, cancelled_at")
      .eq("webinar_id", webinar.id)
      .eq("email", input.email)
      .maybeSingle();

    if (!registration) {
      const cancelToken = randomToken();
      const { data: inserted, error: insertError } = await db.from("webinar_registrations").insert({
        webinar_id: webinar.id,
        first_name: input.first_name,
        last_name: input.last_name,
        company: input.company,
        title: input.title,
        email: input.email,
        consent_reminder: true,
        consent_followup: input.consent_followup,
        consent_text_version: WEBINAR_CONSENT_VERSION,
        source_page: input.source_page || null,
        landing_page: input.landing_page || null,
        session_pages: input.session_pages || null,
        utm_source: input.utm_source || null,
        utm_medium: input.utm_medium || null,
        utm_campaign: input.utm_campaign || null,
        cancel_token: cancelToken,
        cancel_token_hash: await sha256(cancelToken),
      }).select("id, email, cancel_token, cancelled_at").single();
      if (insertError) return json({ error: "Anmälan kunde inte sparas. Försök igen." }, 500);
      registration = inserted;
    }

    const { data: confirmation } = await db.from("webinar_email_log")
      .select("id").eq("registration_id", registration.id).eq("kind", "confirmation").maybeSingle();
    if (!confirmation) {
      const mailWebinar = webinar as WebinarMailRecord;
      const { error: sendError } = await resend.emails.send({
        from: "Thomas Laine | D365.SE <info@d365.se>",
        to: [input.email],
        subject: `Bekräftelse: ${webinar.title}`,
        html: webinarEmailHtml({
          webinar: mailWebinar,
          heading: "Du är anmäld till webinaret",
          intro: "Här är din bekräftelse med datum, tid och deltagarlänk. Kalenderfilen finns bifogad.",
          cancelToken: registration.cancel_token,
          includeJoinLink: true,
        }),
        attachments: [{ filename: `webinar-${webinar.slug}.ics`, content: webinarIcsBase64(mailWebinar) }],
      });
      if (sendError) return json({ error: "Anmälan är sparad men bekräftelsemejlet kunde inte skickas. Försök igen om en stund." }, 500);
      await db.from("webinar_email_log").insert({
        registration_id: registration.id, webinar_id: webinar.id, kind: "confirmation",
      });
    }

    return json({ ok: true, duplicate: Boolean(confirmation), email: input.email, slug: webinar.slug });
  } catch {
    return json({ error: "Anmälan kunde inte genomföras just nu." }, 500);
  }
});
