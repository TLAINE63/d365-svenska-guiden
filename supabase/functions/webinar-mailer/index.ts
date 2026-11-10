import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "../_shared/branded-resend.ts";
import { webinarEmailHtml, webinarEndsAt, webinarIcsBase64, type WebinarMailRecord } from "../_shared/webinar.ts";

const KINDS = ["confirmation", "reminder_24h", "reminder_15m", "recording"] as const;
type MailKind = typeof KINDS[number];

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const provided = (req.headers.get("x-report-cron-secret") || "").trim();
  const { data: expected } = await db.rpc("report_cron_secret");
  if (!provided || !expected || provided !== expected) return new Response(null, { status: 401 });
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return Response.json({ error: "mail_unavailable" }, { status: 500 });
  const resend = new Resend(resendKey);

  try {
    const { data: registrations, error } = await db.from("webinar_registrations")
      .select("id, webinar_id, email, cancel_token, cancelled_at, webinar_email_log(kind), webinars(id, slug, title, description, starts_at, duration_min, speakers, join_url, recording_url, status)")
      .is("cancelled_at", null)
      .limit(2000);
    if (error) return Response.json({ error: "query_failed" }, { status: 500 });

    let sent = 0;
    for (const registration of registrations || []) {
      const webinar = (registration as any).webinars as (WebinarMailRecord & { status: string }) | null;
      if (!webinar || webinar.status === "installd" || webinar.status === "utkast") continue;
      const logged = new Set(((registration as any).webinar_email_log || []).map((row: { kind: string }) => row.kind));
      const now = Date.now();
      const start = new Date(webinar.starts_at).getTime();
      const end = webinarEndsAt(webinar).getTime();
      const candidates: MailKind[] = [];
      if (!logged.has("confirmation")) candidates.push("confirmation");
      if (now >= start - 24 * 60 * 60_000 && now < start - 15 * 60_000 && !logged.has("reminder_24h")) candidates.push("reminder_24h");
      if (now >= start - 15 * 60_000 && now < start && !logged.has("reminder_15m")) candidates.push("reminder_15m");
      if (webinar.recording_url && now >= end && !logged.has("recording")) candidates.push("recording");

      for (const kind of candidates) {
        const settings = {
          confirmation: {
            subject: `Bekräftelse: ${webinar.title}`,
            heading: "Du är anmäld till webinaret",
            intro: "Här är din bekräftelse med datum, tid och deltagarlänk.",
            join: true,
            recording: false,
          },
          reminder_24h: {
            subject: `Påminnelse i morgon: ${webinar.title}`,
            heading: "Vi ses i morgon",
            intro: "Det är cirka 24 timmar kvar till webinaret. Här är deltagarlänken igen.",
            join: true,
            recording: false,
          },
          reminder_15m: {
            subject: `Börjar om 15 minuter: ${webinar.title}`,
            heading: "Webinaret börjar snart",
            intro: "Det är cirka 15 minuter kvar. Gå med via länken nedan.",
            join: true,
            recording: false,
          },
          recording: {
            subject: `Inspelningen är här: ${webinar.title}`,
            heading: "Nu kan du se webinaret i efterhand",
            intro: "Inspelningen av webinaret du anmälde dig till är publicerad.",
            join: false,
            recording: true,
          },
        }[kind];
        const { error: sendError } = await resend.emails.send({
          from: "Thomas Laine | D365.SE <info@d365.se>",
          to: [registration.email],
          subject: settings.subject,
          html: webinarEmailHtml({
            webinar,
            heading: settings.heading,
            intro: settings.intro,
            cancelToken: registration.cancel_token,
            includeJoinLink: settings.join,
            includeRecordingLink: settings.recording,
          }),
        });
        if (sendError) continue;
        const { error: logError } = await db.from("webinar_email_log").insert({
          registration_id: registration.id, webinar_id: webinar.id, kind,
        });
        if (!logError) sent += 1;
      }
    }
    return Response.json({ ok: true, sent });
  } catch {
    return Response.json({ error: "mailer_failed" }, { status: 500 });
  }
});
