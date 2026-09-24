import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

// Engångsutskick av partnerutskick (t.ex. expertkompetens-mejlet).
// Skyddas med OUTREACH_KEY i headern x-outreach-key.
// Avsändare: Thomas Laine <thomas.laine@dynamicfactory.se>.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-outreach-key",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const key = req.headers.get("x-outreach-key");
    const allowed = [Deno.env.get("OUTREACH_KEY"), Deno.env.get("OUTREACH_TEST_KEY")].filter(Boolean);
    if (!allowed.length || !allowed.includes(key as string)) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: cors });
    }
    const { to, subject, html } = await req.json();
    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: "missing to/subject/html" }), { status: 400, headers: cors });
    }
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY saknas");
    const resend = new Resend(resendApiKey);
    const from = "Thomas Laine <thomas.laine@dynamicfactory.se>";
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
      reply_to: "thomas.laine@dynamicfactory.se",
    });
    if (error) {
      return new Response(JSON.stringify({ error: "resend_error", details: error }), { status: 502, headers: cors });
    }
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await supabase.from("email_send_log").insert({
      recipient_email: to,
      template_name: "partner-outreach",
      status: "sent",
      provider_message_id: data?.id ?? null,
      sent_at: new Date().toISOString(),
    });
    return new Response(JSON.stringify({ ok: true, id: data?.id }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors });
  }
});
