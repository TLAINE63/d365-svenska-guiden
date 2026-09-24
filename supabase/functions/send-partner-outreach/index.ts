import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { Resend } from "npm:resend@4";
import { z } from "npm:zod@3";

const PUBLIC_BASE_URL = "https://www.d365.se";
const REVIEW_RECIPIENT = "thomas.laine@dynamicfactory.se";

const SingleEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  html: z.string().min(1).max(100_000),
  from: z.string().min(3).max(200).optional(),
});

const BulkReviewSchema = z.object({
  action: z.literal("send-expert-profile-review"),
  recipient: z.literal(REVIEW_RECIPIENT),
});

function expertProfileEmail(partnerName: string, token: string): string {
  const escapedName = partnerName
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  const invitationUrl = `${PUBLIC_BASE_URL}/partner-update/${encodeURIComponent(token)}`;

  return `<!doctype html>
<html lang="sv">
  <body style="margin:0;background:#f4f7f8;font-family:Arial,Helvetica,sans-serif;color:#17212b">
    <div style="max-width:640px;margin:0 auto;padding:32px 20px">
      <div style="background:#ffffff;border:1px solid #dce4e7;border-radius:8px;padding:32px">
        <p style="margin:0 0 18px;font-size:16px;line-height:1.6">Hej ${escapedName},</p>
        <p style="margin:0 0 20px;font-size:16px;line-height:1.6">Vi har lanserat en ny funktion på d365.se.</p>
        <p style="margin:0 0 12px;font-size:21px;line-height:1.35;font-weight:700">Expertkompetensprofiler</p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.6">Besökare som söker kompetens inom Dynamics&nbsp;365 kan nu hitta partners utifrån den roll de behöver. De kan även filtrera på produkt, bransch, geografiskt täckningsområde och distansarbete.</p>
        <p style="margin:0 0 18px;font-size:16px;line-height:1.6">Ni kan beskriva de funktioner ni erbjuder, till exempel applikationskonsult, utvecklare eller lösningsarkitekt. Profilerna ska beskriva kompetensen, inte namngivna personer.</p>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.6">Alla profiler granskas av d365.se innan de publiceras.</p>
        <p style="margin:0 0 24px"><a href="${invitationUrl}" style="display:inline-block;background:#0e7c86;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:13px 20px;border-radius:6px">Lägg upp era expertkompetensprofiler</a></p>
        <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#52606d">Länken är personlig för ${escapedName}.</p>
        <p style="margin:24px 0 0;font-size:16px;line-height:1.6">Frågor? Svara gärna på detta mejl.</p>
        <p style="margin:18px 0 0;font-size:16px;line-height:1.6">Vänliga hälsningar,<br><strong>Thomas Laine</strong><br>d365.se</p>
      </div>
    </div>
  </body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    const suppliedKey = req.headers.get("x-outreach-key");
    const allowedKeys = [Deno.env.get("OUTREACH_KEY"), Deno.env.get("OUTREACH_TEST_KEY")].filter(Boolean);
    if (!suppliedKey || !allowedKeys.includes(suppliedKey)) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: jsonHeaders });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!resendApiKey || !supabaseUrl || !serviceRoleKey) throw new Error("E-posttjänsten är inte konfigurerad");

    const body: unknown = await req.json();
    const bulk = BulkReviewSchema.safeParse(body);
    const resend = new Resend(resendApiKey);
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    if (bulk.success) {
      const { data: partners, error: partnerError } = await supabase
        .from("partners")
        .select("id,name,partner_invitations(token,status,expires_at,created_at)")
        .eq("is_featured", true)
        .order("name");
      if (partnerError) throw partnerError;

      const now = Date.now();
      const deliveries: Array<{ partner: string; status: "sent" | "failed" }> = [];

      for (const partner of partners ?? []) {
        const invitations = (partner.partner_invitations ?? [])
          .filter((invitation: { status: string; expires_at: string }) =>
            invitation.status === "approved" && new Date(invitation.expires_at).getTime() > now)
          .sort((a: { created_at: string }, b: { created_at: string }) =>
            b.created_at.localeCompare(a.created_at));
        const invitation = invitations[0];
        if (!invitation) continue;

        const subject = `[Granskning: ${partner.name}] Lägg upp era expertkompetensprofiler på d365.se`;
        const { data, error } = await resend.emails.send({
          from: "Thomas Laine via d365.se <info@d365.se>",
          to: [REVIEW_RECIPIENT],
          reply_to: REVIEW_RECIPIENT,
          subject,
          html: expertProfileEmail(partner.name, invitation.token),
        });

        const status = error ? "failed" : "sent";
        deliveries.push({ partner: partner.name, status });
        await supabase.from("email_send_log").insert({
          recipient_email: REVIEW_RECIPIENT,
          template_name: "partner-expert-profile-review",
          subject,
          status,
          message_id: data?.id ?? null,
          error_message: error ? JSON.stringify(error).slice(0, 1000) : null,
          metadata: { partner_name: partner.name },
        });
      }

      const failed = deliveries.filter((delivery) => delivery.status === "failed");
      return new Response(JSON.stringify({
        ok: failed.length === 0,
        sent: deliveries.length - failed.length,
        failed: failed.length,
        partners: deliveries.map(({ partner, status }) => ({ partner, status })),
      }), { status: failed.length ? 502 : 200, headers: jsonHeaders });
    }

    const parsed = SingleEmailSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), { status: 400, headers: jsonHeaders });
    }

    const { to, subject, html, from } = parsed.data;
    const result = await resend.emails.send({
      from: from || "Thomas Laine via d365.se <info@d365.se>",
      to: [to],
      subject,
      html,
      reply_to: REVIEW_RECIPIENT,
    });
    if (result.error) {
      return new Response(JSON.stringify({ error: "resend_error", details: result.error }), { status: 502, headers: jsonHeaders });
    }

    await supabase.from("email_send_log").insert({
      recipient_email: to,
      template_name: "partner-outreach",
      subject,
      status: "sent",
      message_id: result.data?.id ?? null,
    });
    return new Response(JSON.stringify({ ok: true, id: result.data?.id }), { headers: jsonHeaders });
  } catch (error) {
    console.error("Partner outreach failed:", error);
    return new Response(JSON.stringify({ error: "Kunde inte genomföra utskicket" }), { status: 500, headers: jsonHeaders });
  }
});