import { createClient } from "npm:@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
import { Resend } from "npm:resend@4";
import { z } from "npm:zod@3";
import { verifyAdminJWT } from "../_shared/isvAuth.ts";

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

const NEWSLETTER_SUBJECT = "Din partnerprofil på d365.se: nya besökare, ny synlighet och en uppdatering i oktober";

const DEFAULT_SUMMARY = `**Sammanfattat: det händer mycket just nu.**
Besökarstatistiken stiger stadigt, AI-sökmotorer hittar er profil i ökande takt, och i oktober lanseras nya köparunderlag som gör era profilfält ännu viktigare. **Det viktigaste du kan göra nu: öppna din personliga profileringslänk och komplettera profilen.**`;

const DEFAULT_BODY = `## September 2026 på d365.se
- 409 unika besökare (+25 % mot augusti)
- 798 besök (+31 %)
- 1 752 sidvisningar (+20 %)
- 216 interaktioner med partnerkort och partnerprofiler (+28 %)
- 19 olika partners fick besök på sina sidor
- Över 4 minuter i genomsnitt per besök
- 32 % av trafiken kommer från Google och Bing
- 28 nya inlägg i Partnernytt publicerade i september (57 totalt publicerade), som delas i sociala medier och indexeras av Google och AI-sökmotorer

## businesscentral.se
Vår specialiserade sajt för Business Central hade i september 688 unika besökare, 718 besök och 1 970 sidvisningar. Mätningen startade i september, så månadsjämförelser kommer från oktober. Era Business Central-uppgifter visas där automatiskt från d365.se, så en uppdatering på ett ställe räcker.

## d365guide.com
Vi har lanserat d365guide.com, en ny nordisk sajt som hjälper köpare att hitta vägledning och partnerkompetens på flera språk.

## AI-synlighet ökar snabbt
- 178 besök från AI-crawlers i september (+180 %)
- ClaudeBot +166 %, GPTBot +288 %, dessutom Meta AI, Perplexity och Amazonbot
- I vårt första AI-synlighetstest nämnde Copilot d365.se vid frågan om bästa Dynamics 365-partner i Sverige

## Nyheter sedan sist
- **Era egna ändringar publiceras direkt.** Publicerade partners behöver inte längre vänta på granskning av egna profiluppdateringar.
- **Förenklad profilering.** Vi har tagit bort frågor som alla kryssade i och slagit ihop Power Platform till ett val.
- **Nya köparunderlag (oktober).** Besökare skapar anonyma behovsanalyser som matchas mot era profiler. Varje tomt fält i er profil visas som "saknas" för köparen, så en komplett profil syns bättre.
- **Shortlist och "Be om introduktion".** Köpare kan stjärnmarkera upp till tre partners och be om introduktion direkt.
- **Expertkompetensprofiler.** Max tre per partner, med konsultroller och uppdrag. Håll "senast kontrollerat"-datumet aktuellt.
- **ISV-katalogen** har 192 publicerade lösningar, och vår nya **rollguide** hjälper VD, CFO, COO och IT-chefer att hitta rätt innehåll.

## Det här kan du göra nu
- Granska och komplettera era produktområden via profileringslänken
- Beskriv typiska kunder och projekt per produkt. Det väger tyngst vid matchning.
- Lägg in kundexempel, events och webbinarier
- Publicera nyheter och kundcase i Partnernytt

[KNAPP]

Frågor? Svara gärna på detta mejl.

Vänliga hälsningar,
**Thomas Laine och Michael Uhman**
d365.se`;

interface NewsletterContent { subject: string; summary: string; body: string }
const DEFAULT_CONTENT: NewsletterContent = { subject: NEWSLETTER_SUBJECT, summary: DEFAULT_SUMMARY, body: DEFAULT_BODY };

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Enkel, säker markup: escape först, sedan **fet**, {partner} och varumärken på en rad.
function inline(s: string, name: string): string {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replaceAll("{partner}", name)
    .replace(/Dynamics 365/g, "Dynamics&nbsp;365")
    .replace(/Business Central/g, "Business&nbsp;Central");
}

function renderMarkup(src: string, name: string, button: string): string {
  const p = 'style="margin:0 0 16px;font-size:15px;line-height:1.6"';
  const h2 = 'style="margin:26px 0 10px;font-size:18px;line-height:1.35;font-weight:700"';
  const li = 'style="margin:0 0 6px;font-size:15px;line-height:1.55"';
  const out: string[] = [];
  for (const block of src.replace(/\r/g, "").split(/\n\s*\n/)) {
    const lines = block.split("\n").map((l) => l.trimEnd()).filter((l) => l.trim());
    if (!lines.length) continue;
    let para: string[] = [];
    let list: string[] = [];
    const flush = () => {
      if (para.length) out.push(`<p ${p}>${para.join("<br>")}</p>`);
      if (list.length) out.push(`<ul style="margin:0 0 16px;padding-left:20px">${list.map((x) => `<li ${li}>${x}</li>`).join("")}</ul>`);
      para = []; list = [];
    };
    for (const l of lines) {
      const t = l.trim();
      if (t.startsWith("## ")) { flush(); out.push(`<h2 ${h2}>${inline(t.slice(3), name)}</h2>`); }
      else if (t === "[KNAPP]") { flush(); out.push(`<p ${p}>${button}</p>`); }
      else if (/^[-*] /.test(t)) { if (para.length) flush(); list.push(inline(t.slice(2), name)); }
      else { if (list.length) flush(); para.push(inline(t, name)); }
    }
    flush();
  }
  return out.join("\n");
}

function newsletterEmail(partnerName: string, token: string, c: NewsletterContent = DEFAULT_CONTENT): string {
  const name = escapeHtml(partnerName);
  const url = `${PUBLIC_BASE_URL}/partner-update/${encodeURIComponent(token)}`;
  const button = `<a href="${url}" style="display:inline-block;background:#0e7c86;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;padding:13px 20px;border-radius:6px">Öppna din profileringslänk</a>`;
  const summary = c.summary.replace(/\r/g, "").split("\n").filter((l) => l.trim())
    .map((l, i, a) => `<p style="margin:0 0 ${i === a.length - 1 ? 0 : 8}px;font-size:15px;line-height:1.6">${inline(l.trim(), name)}</p>`).join("");
  return `<!doctype html>
<html lang="sv">
  <body style="margin:0;background:#f4f7f8;font-family:Arial,Helvetica,sans-serif;color:#17212b">
    <div style="max-width:640px;margin:0 auto;padding:32px 20px">
      <div style="background:#ffffff;border:1px solid #dce4e7;border-radius:8px;padding:32px">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6">Hej ${name},</p>
        <div style="background:#eef6f7;border:1px solid #cfe4e6;border-radius:6px;padding:16px 18px;margin:0 0 20px">
          ${summary}
          <p style="margin:14px 0 0">${button}</p>
          <p style="margin:10px 0 0;font-size:13px;line-height:1.5;color:#52606d">Länken är personlig för ${name} och gäller tills vidare.</p>
        </div>
        ${renderMarkup(c.body, name, button)}
      </div>
    </div>
  </body>
</html>`;
}

const ContentSchema = z.object({
  subject: z.string().trim().min(3).max(200),
  summary: z.string().trim().min(1).max(3000),
  body: z.string().trim().min(1).max(30000),
});

async function loadContent(sb: any): Promise<NewsletterContent> {
  const { data } = await sb.from("newsletter_content").select("subject,summary,body").eq("id", "current").maybeSingle();
  return data ?? DEFAULT_CONTENT;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    const rawBody: any = await req.clone().json().catch(() => ({}));

    // Admin-flöde: lista och skicka expertprofilmejl direkt till partnerna.
    // Månadsbrevet (lista, förhandsgranska, testutskick som endast går till REVIEW_RECIPIENT)
    // är även öppet för redaktörer (/redaktion). Expertutskicken går till partnerna och förblir admin-only.
    const NEWSLETTER_ACTIONS = ["newsletter-send", "newsletter-list", "newsletter-preview", "newsletter-save"];
    if (["expert-list", "expert-send", "expert-mark-sent", ...NEWSLETTER_ACTIONS].includes(rawBody?.action)) {
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      const allowedRoles = NEWSLETTER_ACTIONS.includes(rawBody.action) ? ["admin", "editor"] : ["admin"];
      if (!(await verifyAdminJWT(String(rawBody.token || ""), serviceKey, allowedRoles))) {
        return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: jsonHeaders });
      }
      const sb = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);
      const { data: partners, error: pErr } = await sb
        .from("partners")
        .select("id,name,admin_contact_email,email,partner_invitations(token,status,expires_at,created_at)")
        .eq("is_featured", true)
        .order("name");
      if (pErr) throw pErr;
      const now = Date.now();
      const { data: logs } = await sb.from("email_send_log")
        .select("metadata,created_at,status")
        .eq("template_name", "partner-expert-profile")
        .order("created_at", { ascending: false });
      const list = (partners ?? []).map((p: any) => {
        const inv = (p.partner_invitations ?? [])
          .filter((i: any) => i.status === "approved" && new Date(i.expires_at).getTime() > now)
          .sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))[0];
        const last = (logs ?? []).find((l: any) => l.metadata?.partner_id === p.id && l.status === "sent");
        return {
          id: p.id, name: p.name,
          email: (p.admin_contact_email || p.email || "").trim() || null,
          token: inv?.token ?? null,
          last_sent_at: last?.created_at ?? null,
        };
      });

      if (rawBody.action === "expert-list") {
        return new Response(JSON.stringify({
          partners: list.map(({ token, ...r }) => ({
            ...r,
            has_link: !!token,
            link: token ? `${PUBLIC_BASE_URL}/partner-update/${token}` : null,
          })),
        }), { headers: jsonHeaders });
      }

      // Manuellt utskick från egen inkorg: logga som skickat utan att mejla via sajten.
      if (rawBody.action === "expert-mark-sent") {
        const ids = z.array(z.string().uuid()).min(1).max(100).safeParse(rawBody.partner_ids);
        if (!ids.success) return new Response(JSON.stringify({ error: "Välj minst en partner" }), { status: 400, headers: jsonHeaders });
        const subject = "Lägg upp era expertkompetensprofiler på d365.se";
        const results: Array<{ partner: string; status: string; reason?: string }> = [];
        for (const p of list.filter((x) => ids.data.includes(x.id))) {
          if (!p.email || !z.string().email().safeParse(p.email).success) { results.push({ partner: p.name, status: "skipped", reason: "saknar e-post" }); continue; }
          await sb.from("email_send_log").insert({
            recipient_email: p.email, template_name: "partner-expert-profile", subject, status: "sent",
            metadata: { partner_id: p.id, partner_name: p.name, manual: true },
          });
          results.push({ partner: p.name, status: "sent" });
        }
        return new Response(JSON.stringify({ results }), { headers: jsonHeaders });
      }

      // Testutskick av nyhetsbrevet: ett personligt mejl per publicerad partner,
      // men alla levereras till granskningsmottagaren.
      const content = await loadContent(sb);

      if (rawBody.action === "newsletter-save") {
        const parsed = ContentSchema.safeParse(rawBody.content);
        if (!parsed.success) return new Response(JSON.stringify({ error: "Ämnesrad, sammanfattning och brevtext måste fyllas i" }), { status: 400, headers: jsonHeaders });
        const { error: sErr } = await sb.from("newsletter_content").upsert({ id: "current", ...parsed.data, updated_at: new Date().toISOString() });
        if (sErr) throw sErr;
        return new Response(JSON.stringify({ ok: true }), { headers: jsonHeaders });
      }

      if (rawBody.action === "newsletter-list") {
        return new Response(JSON.stringify({
          subject: content.subject,
          content,
          default_content: DEFAULT_CONTENT,
          partners: list.map((p) => ({ id: p.id, name: p.name, has_link: !!p.token })),
        }), { headers: jsonHeaders });
      }

      if (rawBody.action === "newsletter-preview") {
        const p = list.find((x) => x.id === rawBody.partner_id);
        if (!p) return new Response(JSON.stringify({ error: "Partnern hittades inte" }), { status: 404, headers: jsonHeaders });
        if (!p.token) return new Response(JSON.stringify({ error: "Partnern saknar giltig profileringslänk" }), { status: 400, headers: jsonHeaders });
        const draft = rawBody.content ? ContentSchema.safeParse(rawBody.content) : null;
        const c = draft?.success ? draft.data : content;
        return new Response(JSON.stringify({ subject: c.subject, html: newsletterEmail(p.name, p.token, c) }), { headers: jsonHeaders });
      }

      if (rawBody.action === "newsletter-send") {
        const resendKeyNl = Deno.env.get("RESEND_API_KEY");
        if (!resendKeyNl) throw new Error("E-posttjänsten är inte konfigurerad");
        const rsNl = new Resend(resendKeyNl);
        const resultsNl: Array<{ partner: string; status: string; reason?: string }> = [];
        const onlyIds: string[] | null = Array.isArray(rawBody.partner_ids) ? rawBody.partner_ids.map(String) : null;
        for (const p of list.filter((x) => !onlyIds || onlyIds.includes(x.id))) {
          if (!p.token) { resultsNl.push({ partner: p.name, status: "skipped", reason: "saknar giltig profileringslänk" }); continue; }
          const subject = `[Granskning: ${p.name}] ${content.subject}`;
          const { data, error } = await rsNl.emails.send({
            from: "Thomas Laine via d365.se <info@d365.se>",
            to: [REVIEW_RECIPIENT], reply_to: REVIEW_RECIPIENT, subject,
            html: newsletterEmail(p.name, p.token, content),
          });
          const status = error ? "failed" : "sent";
          resultsNl.push({ partner: p.name, status });
          await sb.from("email_send_log").insert({
            recipient_email: REVIEW_RECIPIENT, template_name: "partner-newsletter-review", subject, status,
            message_id: data?.id ?? null,
            error_message: error ? JSON.stringify(error).slice(0, 1000) : null,
            metadata: { partner_id: p.id, partner_name: p.name },
          });
          await new Promise((r) => setTimeout(r, 600));
        }
        const failedNl = resultsNl.filter((r) => r.status === "failed");
        return new Response(JSON.stringify({
          ok: failedNl.length === 0,
          sent: resultsNl.filter((r) => r.status === "sent").length,
          skipped: resultsNl.filter((r) => r.status === "skipped").length,
          failed: failedNl.length,
          results: resultsNl,
        }), { status: failedNl.length ? 502 : 200, headers: jsonHeaders });
      }

      const ids = z.array(z.string().uuid()).min(1).max(100).safeParse(rawBody.partner_ids);
      if (!ids.success) return new Response(JSON.stringify({ error: "Välj minst en partner" }), { status: 400, headers: jsonHeaders });
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (!resendKey) throw new Error("E-posttjänsten är inte konfigurerad");
      const rs = new Resend(resendKey);
      const results: Array<{ partner: string; status: string; reason?: string }> = [];
      for (const p of list.filter((x) => ids.data.includes(x.id))) {
        if (!p.email || !z.string().email().safeParse(p.email).success) { results.push({ partner: p.name, status: "skipped", reason: "saknar e-post" }); continue; }
        if (!p.token) { results.push({ partner: p.name, status: "skipped", reason: "saknar giltig profileringslänk" }); continue; }
        const subject = "Lägg upp era expertkompetensprofiler på d365.se";
        const { data, error } = await rs.emails.send({
          from: "Thomas Laine via d365.se <info@d365.se>",
          to: [p.email], reply_to: REVIEW_RECIPIENT, subject,
          html: expertProfileEmail(p.name, p.token),
        });
        const status = error ? "failed" : "sent";
        results.push({ partner: p.name, status });
        await sb.from("email_send_log").insert({
          recipient_email: p.email, template_name: "partner-expert-profile", subject, status,
          message_id: data?.id ?? null,
          error_message: error ? JSON.stringify(error).slice(0, 1000) : null,
          metadata: { partner_id: p.id, partner_name: p.name },
        });
        await new Promise((r) => setTimeout(r, 600));
      }
      return new Response(JSON.stringify({ results }), { headers: jsonHeaders });
    }

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

    const { to, subject, html } = parsed.data;
    // Enstaka mejl går endast till granskningsmottagaren – aldrig till godtyckliga adresser.
    if (to.trim().toLowerCase() !== REVIEW_RECIPIENT.toLowerCase()) {
      return new Response(JSON.stringify({ error: "Mottagaren är inte tillåten" }), { status: 400, headers: jsonHeaders });
    }
    const result = await resend.emails.send({
      from: "Thomas Laine via d365.se <info@d365.se>",
      to: [REVIEW_RECIPIENT],
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