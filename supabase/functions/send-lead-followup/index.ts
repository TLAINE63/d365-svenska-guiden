import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

/**
 * Follow-up email sent ~2 days after a visitor downloaded a guide, PDF or
 * completed an analysis. Suggests 2–3 matching partners with tracked links.
 * Triggered by pg_cron (daily) – no public/browser access.
 */

const FOLLOWUP_TEMPLATE = "lead_followup_partners";

const FOLLOWUP_SOURCE_TYPES = [
  "lead_magnet",
  "ebook_download",
  "requirements_spec",
  "partner_guide",
  "ai_readiness",
  "bc_matchningstest",
];

interface PartnerRow {
  slug: string;
  name: string;
  description: string | null;
  industries: string[] | null;
  product_filters: Record<string, unknown> | null;
  agreement_signed: boolean | null;
}

function esc(v: string): string {
  return v.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));
}

function partnerUrl(slug: string): string {
  return `https://www.d365.se/partner/${slug}/?utm_source=d365&utm_medium=email&utm_campaign=lead_followup`;
}

Deno.serve(async (req) => {
  // Cron/service invocation only – requires the service role key.
  const auth = req.headers.get("authorization") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!serviceKey || auth !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", serviceKey);
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      return new Response(JSON.stringify({ error: "Email not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    const resend = new Resend(resendKey);

    const from = new Date(Date.now() - 3 * 86400000).toISOString();
    const to = new Date(Date.now() - 2 * 86400000).toISOString();

    const { data: leads, error: leadsErr } = await supabase
      .from("leads")
      .select("id, email, contact_name, selected_product, industry, source_type")
      .gte("created_at", from)
      .lt("created_at", to)
      .in("source_type", FOLLOWUP_SOURCE_TYPES)
      .limit(100);
    if (leadsErr) throw leadsErr;

    if (!leads || leads.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: partners } = await supabase
      .from("partners")
      .select("slug, name, description, industries, product_filters, agreement_signed")
      .eq("is_featured", true)
      .limit(200);

    const { data: suppressed } = await supabase.from("suppressed_emails").select("email");
    const blocked = new Set((suppressed || []).map((s) => String(s.email).toLowerCase()));

    let sent = 0;
    for (const lead of leads) {
      const email = String(lead.email || "").toLowerCase();
      if (!email || blocked.has(email)) continue;

      // Skip if a follow-up already went out to this address.
      const { data: already } = await supabase
        .from("email_send_log")
        .select("id")
        .eq("recipient_email", email)
        .eq("template_name", FOLLOWUP_TEMPLATE)
        .limit(1);
      if (already && already.length > 0) continue;

      // Bransch först, därefter produkt – samma prioritering som i guiden.
      const industry = (lead.industry || "").toLowerCase();
      const product = (lead.selected_product || "").toLowerCase();
      const scored = (partners as PartnerRow[] | null || [])
        .map((p) => {
          let score = 0;
          if (industry && (p.industries || []).some((i) => i.toLowerCase() === industry)) score += 40;
          if (product && JSON.stringify(p.product_filters || {}).toLowerCase().includes(product)) score += 30;
          if (p.agreement_signed) score += 5;
          return { p, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((x) => x.p);

      if (scored.length === 0) continue;

      const cards = scored
        .map(
          (p) => `
            <tr><td style="padding:10px 0; border-bottom:1px solid #e7e2dc;">
              <a href="${partnerUrl(p.slug)}" style="color:#B23D19; font-weight:700; font-size:15px; text-decoration:none;">${esc(p.name)}</a>
              <div style="color:#4b5563; font-size:13px; margin-top:4px;">${esc((p.description || "").slice(0, 160))}</div>
            </td></tr>`,
        )
        .join("");

      const html = `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width:640px; margin:0 auto; color:#15130F;">
          <div style="background:#15130F; padding:22px 24px;">
            <div style="color:#ffffff; font-size:18px; font-weight:700;">d365.se</div>
          </div>
          <div style="background:#ffffff; padding:24px; border:1px solid #e7e2dc; border-top:none;">
            <p style="font-size:15px;">Hej,</p>
            <p style="font-size:15px; line-height:1.6;">
              För några dagar sedan hämtade du underlag hos oss. Här är partners som matchar det du tittade på –
              du kan läsa mer om var och en innan du tar kontakt.
            </p>
            <table style="width:100%; border-collapse:collapse; margin:16px 0;">${cards}</table>
            <p style="margin:20px 0;">
              <a href="https://www.d365.se/valjdynamics365partner/?utm_source=d365&utm_medium=email&utm_campaign=lead_followup"
                 style="background:#B23D19; color:#ffffff; padding:12px 20px; border-radius:6px; text-decoration:none; font-weight:700; display:inline-block;">
                Skicka ert underlag till 2–3 partners
              </a>
            </p>
            <p style="font-size:13px; color:#6b7280; line-height:1.6;">
              Vill du hellre bolla först? Svara på det här mejlet, så hjälper vi dig vidare.
            </p>
          </div>
        </div>`;

      try {
        const res = await resend.emails.send({
          from: "D365 Guiden <info@d365.se>",
          to: [email],
          reply_to: "thomas.laine@dynamicfactory.se",
          subject: "3 Dynamics 365-partners som matchar ert behov",
          html,
        });
        const messageId = (res as { data?: { id?: string } })?.data?.id || `followup-${lead.id}`;
        await supabase.from("email_send_log").insert({
          message_id: messageId,
          recipient_email: email,
          template_name: FOLLOWUP_TEMPLATE,
          subject: "3 Dynamics 365-partners som matchar ert behov",
          status: "sent",
          metadata: { lead_id: lead.id, partners: scored.map((p) => p.slug) },
        });
        sent++;
      } catch (sendErr) {
        console.error("followup send failed", lead.id, sendErr);
      }
    }

    return new Response(JSON.stringify({ success: true, sent, candidates: leads.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-lead-followup error", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
