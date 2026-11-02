import { createClient } from "npm:@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
import { Resend } from "../_shared/branded-resend.ts";
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

interface NewsletterContent { subject: string; summary: string; body: string; stats_month?: string | null }
const DEFAULT_CONTENT: NewsletterContent = { subject: NEWSLETTER_SUBJECT, summary: DEFAULT_SUMMARY, body: DEFAULT_BODY, stats_month: null };

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
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#0f1f3d">$1</strong>')
    .replaceAll("{partner}", name)
    .replace(/Microsoft Dynamics 365/g, "Microsoft&nbsp;Dynamics&nbsp;365")
    .replace(/Dynamics 365/g, "Dynamics&nbsp;365")
    .replace(/Business Central/g, "Business&nbsp;Central");
}

const NAVY = "#0f1f3d";
const PETROL = "#0e7c86";
const ORANGE = "#d64a1f";
const MUTED = "#5b6b7c";

function renderMarkup(src: string, name: string, button: string, statsHtml = ""): string {
  const p = 'style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#1f2d3a"';
  const h2 = `style="margin:30px 0 12px;padding-top:22px;border-top:1px solid #e6ecf0;font-size:18px;line-height:1.35;font-weight:700;color:${NAVY};letter-spacing:-0.2px"`;
  const li = 'style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#1f2d3a"';
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
      else if (t === "[KNAPP]") { flush(); out.push(`<p style="margin:8px 0 22px">${button}</p>`); }
      else if (t === "[STATISTIK]") { flush(); if (statsHtml) out.push(statsHtml); }
      else if (/^[-*] /.test(t)) { if (para.length) flush(); list.push(inline(t.slice(2), name)); }
      else { if (list.length) flush(); para.push(inline(t, name)); }
    }
    flush();
  }
  return out.join("\n");
}

// ---------- Partnerns egen statistik (månad, Europe/Stockholm) ----------
const MONTHS_SV = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function stockholmMidnightIso(year: number, month: number, day: number): string {
  const normalized = new Date(Date.UTC(year, month - 1, day));
  const y = normalized.getUTCFullYear(), m = normalized.getUTCMonth() + 1, d = normalized.getUTCDate();
  const probe = new Date(Date.UTC(y, m - 1, d, 12));
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(probe);
  const v = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  const represented = Date.UTC(Number(v.year), Number(v.month) - 1, Number(v.day), Number(v.hour), Number(v.minute), Number(v.second));
  return new Date(Date.UTC(y, m - 1, d) - (represented - probe.getTime())).toISOString();
}
function monthRange(month: string) {
  const [y, m] = month.split("-").map(Number);
  return { start: stockholmMidnightIso(y, m, 1), end: stockholmMidnightIso(y, m + 1, 1) };
}
function prevMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 2, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return `${MONTHS_SV[m - 1]} ${y}`;
}

interface MonthStats {
  card_views: number; filter_views: number; comparisons: number; match_recommended: number;
  profile_visits: number; saved: number; onward_clicks: number; unique_visitors: number; site_card_views: number;
}
interface PartnerStats { month: string; cur: MonthStats; prev: MonthStats }

async function fetchMonth(sb: any, slug: string, month: string): Promise<MonthStats> {
  const r = monthRange(month);
  const { data, error } = await sb.rpc("partner_month_stats", { _slug: slug, _start: r.start, _end: r.end });
  if (error) throw error;
  const row = (Array.isArray(data) ? data[0] : data) ?? {};
  const n = (k: string) => Number(row[k] ?? 0) || 0;
  return {
    card_views: n("card_views"), filter_views: n("filter_views"), comparisons: n("comparisons"),
    match_recommended: n("match_recommended"), profile_visits: n("profile_visits"), saved: n("saved"),
    onward_clicks: n("onward_clicks"), unique_visitors: n("unique_visitors"), site_card_views: n("site_card_views"),
  };
}

async function fetchPartnerStats(sb: any, slug: string | null, month: string | null | undefined): Promise<PartnerStats | null> {
  if (!slug || !month || !MONTH_RE.test(month)) return null;
  const [cur, prev] = await Promise.all([fetchMonth(sb, slug, month), fetchMonth(sb, slug, prevMonth(month))]);
  return { month, cur, prev };
}

const fmt = (n: number) => n.toLocaleString("sv-SE").replace(/\u00A0/g, "&nbsp;");

function deltaHtml(cur: number, prev: number, prevShort: string): string {
  let label: string, color = MUTED;
  if (prev === 0 && cur === 0) label = "Oförändrat";
  else if (prev === 0) { label = "Nytt"; color = PETROL; }
  else {
    const pct = Math.round(((cur - prev) / prev) * 100);
    label = pct === 0 ? "Oförändrat" : `${pct > 0 ? "+" : "&minus;"}${Math.abs(pct)}&nbsp;%`;
    if (pct > 0) color = PETROL;
  }
  return `<span style="color:${color};font-weight:700">${label}</span> <span style="color:#8a99a8">(${prevShort}: ${fmt(prev)})</span>`;
}

function statsBlock(s: PartnerStats, name: string): string {
  const { cur, prev } = s;
  const prevShort = MONTHS_SV[Number(prevMonth(s.month).split("-")[1]) - 1].slice(0, 3);
  const tile = (value: number, prevValue: number, label: string, help: string) => `
    <td valign="top" width="50%" style="width:50%;padding:6px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f9fb;border:1px solid #e3eaef;border-radius:10px">
        <tr><td style="padding:16px 16px 14px">
          <div style="font-size:12px;letter-spacing:0.6px;text-transform:uppercase;color:${MUTED};font-weight:700">${label}</div>
          <div style="font-size:28px;line-height:1.15;font-weight:800;color:${NAVY};margin-top:6px">${fmt(value)}</div>
          <div style="font-size:12px;line-height:1.45;margin-top:4px">${deltaHtml(value, prevValue, prevShort)}</div>
          <div style="font-size:12px;line-height:1.45;color:#8a99a8;margin-top:6px">${help}</div>
        </td></tr>
      </table>
    </td>`;
  const total = cur.card_views + cur.profile_visits + cur.saved + cur.onward_clicks;
  const share = cur.site_card_views > 0 && cur.card_views > 0
    ? (Math.round((cur.card_views / cur.site_card_views) * 1000) / 10).toLocaleString("sv-SE")
    : null;
  const empty = total === 0
    ? `<p style="margin:12px 6px 0;font-size:14px;line-height:1.6;color:#1f2d3a">Ert partnerkort registrerade inga visningar i ${monthLabel(s.month)}. Oftast beror det på att profilen saknar produktområden eller branscher som köpare filtrerar på. Komplettera gärna via profileringslänken nedan.</p>`
    : "";
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 8px;background:#ffffff;border:1px solid #d9e3ea;border-radius:14px;overflow:hidden">
    <tr><td style="background:${NAVY};padding:20px 22px">
      <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#9fb3c8;font-weight:700">Er egen statistik</div>
      <div style="font-size:20px;line-height:1.3;font-weight:700;color:#ffffff;margin-top:6px">${name} i ${monthLabel(s.month)}</div>
      <div style="font-size:13px;line-height:1.5;color:#c7d3df;margin-top:4px">Jämfört med ${monthLabel(prevMonth(s.month))}. Alla mätpunkter är anonyma.</div>
    </td></tr>
    <tr><td style="background:${ORANGE};height:3px;line-height:3px;font-size:0">&nbsp;</td></tr>
    <tr><td style="padding:12px 10px 6px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>${tile(cur.card_views, prev.card_views, "Kortvisningar", "Ert partnerkort i listor, filter, matchningar och jämförelser")}${tile(cur.filter_views, prev.filter_views, "Filtreringar", "Visad när köpare filtrerade på produkt, bransch eller storlek")}</tr>
        <tr>${tile(cur.comparisons, prev.comparisons, "Jämförelser", "Visad i eller tillagd till jämförelsevyn")}${tile(cur.match_recommended, prev.match_recommended, "Matchningar", "Föreslagen när köpare matchade sina behov")}</tr>
        <tr>${tile(cur.profile_visits, prev.profile_visits, "Profilbesök", "Klick på kortet och besök på er profil")}${tile(cur.onward_clicks + cur.saved, prev.onward_clicks + prev.saved, "Klick vidare", "Till er webbplats eller kundcase, eller sparad i kortlistan")}</tr>
      </table>
      ${empty}
      ${total > 0 ? `<p style="margin:10px 6px 8px;font-size:13px;line-height:1.6;color:${MUTED}">${fmt(cur.unique_visitors)} unika besökare stod bakom aktiviteten${share ? `, och ert kort stod för <strong style="color:${NAVY}">${share}&nbsp;%</strong> av alla kortvisningar på d365.se` : ""}.</p>` : ""}
    </td></tr>
  </table>`;
}

function newsletterEmail(partnerName: string, token: string, c: NewsletterContent = DEFAULT_CONTENT, stats: PartnerStats | null = null): string {
  const name = escapeHtml(partnerName);
  const url = `${PUBLIC_BASE_URL}/partner-update/${encodeURIComponent(token)}`;
  const button = `<a href="${url}" style="display:inline-block;background:${PETROL};color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 24px;border-radius:8px">Öppna din profileringslänk</a>`;
  const summary = c.summary.replace(/\r/g, "").split("\n").filter((l) => l.trim())
    .map((l, i, a) => `<p style="margin:0 0 ${i === a.length - 1 ? 0 : 8}px;font-size:15px;line-height:1.65;color:#1f2d3a">${inline(l.trim(), name)}</p>`).join("");
  const statsHtml = stats ? statsBlock(stats, name) : "";
  const period = c.stats_month && MONTH_RE.test(c.stats_month) ? monthLabel(c.stats_month) : "";
  return `<!doctype html>
<html lang="sv">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(c.subject)}</title></head>
<body style="margin:0;padding:0;background:#eef2f6;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#1f2d3a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eef2f6" style="background:#eef2f6">
    <tr><td align="center" style="padding:28px 12px">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 20px rgba(15,31,61,0.08)">
        <tr><td bgcolor="${NAVY}" style="background:${NAVY};padding:28px 32px 26px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="vertical-align:middle;font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;line-height:1">d365<span style="color:${ORANGE}">.</span><span style="color:rgba(255,255,255,0.7);font-weight:300">se</span></td>
            <td align="right" style="vertical-align:middle;color:#9fb3c8;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;font-weight:700">Månadsbrev${period ? ` &middot; ${escapeHtml(period)}` : ""}</td>
          </tr></table>
          <div style="height:1px;background:#22385c;margin:22px 0 18px;font-size:0;line-height:1px">&nbsp;</div>
          <div style="color:#ffffff;font-size:24px;font-weight:700;line-height:1.25">Hej ${name},</div>
          <div style="color:#c7d3df;font-size:14px;line-height:1.55;margin-top:6px">Här är det senaste från d365.se och hur ert partnerkort har synts.</div>
        </td></tr>
        <tr><td style="background:${ORANGE};height:4px;line-height:4px;font-size:0">&nbsp;</td></tr>
        <tr><td style="padding:30px 32px 34px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef6f7;border:1px solid #cfe4e6;border-left:4px solid ${PETROL};border-radius:10px">
            <tr><td style="padding:18px 20px">
              ${summary}
              <p style="margin:16px 0 0">${button}</p>
              <p style="margin:10px 0 0;font-size:12px;line-height:1.5;color:${MUTED}">Länken är personlig för ${name} och gäller tills vidare.</p>
            </td></tr>
          </table>
          ${renderMarkup(c.body, name, button, statsHtml)}
        </td></tr>
        <tr><td bgcolor="${NAVY}" style="background:${NAVY};padding:18px 32px;text-align:center;color:#9fb3c8;font-size:11px;letter-spacing:0.5px;line-height:1.6">
          D365.SE Köpguide &middot; Av d365.se-redaktionen<br>
          <a href="${PUBLIC_BASE_URL}/" style="color:#c7d3df;text-decoration:none">www.d365.se</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const ContentSchema = z.object({
  subject: z.string().trim().min(3).max(200),
  summary: z.string().trim().min(1).max(3000),
  body: z.string().trim().min(1).max(30000),
  stats_month: z.string().regex(MONTH_RE).nullable().optional(),
});

async function loadContent(sb: any, id = "current"): Promise<NewsletterContent | null> {
  const { data } = await sb.from("newsletter_content").select("subject,summary,body,stats_month").eq("id", id).maybeSingle();
  return data ?? (id === "current" ? DEFAULT_CONTENT : null);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    const rawBody: any = await req.clone().json().catch(() => ({}));

    // Admin-flöde: lista och skicka expertprofilmejl direkt till partnerna.
    // Månadsbrevet (lista, förhandsgranska, testutskick som endast går till REVIEW_RECIPIENT)
    // är även öppet för redaktörer (/redaktion). Expertutskicken går till partnerna och förblir admin-only.
    const NEWSLETTER_ACTIONS = ["newsletter-send", "newsletter-list", "newsletter-preview", "newsletter-save", "newsletter-archive"];
    if (["expert-list", "expert-send", "expert-mark-sent", ...NEWSLETTER_ACTIONS].includes(rawBody?.action)) {
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      const allowedRoles = NEWSLETTER_ACTIONS.includes(rawBody.action) ? ["admin", "editor"] : ["admin"];
      if (!(await verifyAdminJWT(String(rawBody.token || ""), serviceKey, allowedRoles))) {
        return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: jsonHeaders });
      }
      const sb = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);
      const { data: partners, error: pErr } = await sb
        .from("partners")
        .select("id,name,slug,admin_contact_email,email,partner_invitations(token,status,expires_at,created_at)")
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
          id: p.id, name: p.name, slug: (p.slug as string | null) ?? null,
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
      const content = (await loadContent(sb))!;
      // Statistiken räknas fram vid varje förhandsgranskning/utskick, så ett arkiverat brev
      // visar alltid samma månad som det skrevs för.
      const statsFor = (p: { slug: string | null }, c: NewsletterContent) =>
        /\[STATISTIK\]/.test(c.body) ? fetchPartnerStats(sb, p.slug, c.stats_month) : Promise.resolve(null);

      if (rawBody.action === "newsletter-save") {
        const parsed = ContentSchema.safeParse(rawBody.content);
        if (!parsed.success) return new Response(JSON.stringify({ error: "Ämnesrad, sammanfattning och brevtext måste fyllas i" }), { status: 400, headers: jsonHeaders });
        const { error: sErr } = await sb.from("newsletter_content").upsert({ id: "current", ...parsed.data, stats_month: parsed.data.stats_month ?? null, updated_at: new Date().toISOString() });
        if (sErr) throw sErr;
        return new Response(JSON.stringify({ ok: true }), { headers: jsonHeaders });
      }

      // Arkivera den sparade versionen som en månad (t.ex. 2026-09) för senare jämförelse.
      if (rawBody.action === "newsletter-archive") {
        const month = String(rawBody.month || "");
        if (!MONTH_RE.test(month)) return new Response(JSON.stringify({ error: "Ange månad som ÅÅÅÅ-MM" }), { status: 400, headers: jsonHeaders });
        const { error: aErr } = await sb.from("newsletter_content").upsert({
          id: `arkiv-${month}`, subject: content.subject, summary: content.summary, body: content.body,
          stats_month: content.stats_month ?? null, updated_at: new Date().toISOString(),
        });
        if (aErr) throw aErr;
        return new Response(JSON.stringify({ ok: true }), { headers: jsonHeaders });
      }

      if (rawBody.action === "newsletter-list") {
        const { data: arch } = await sb.from("newsletter_content")
          .select("id,subject,summary,body,stats_month,updated_at").like("id", "arkiv-%").order("id", { ascending: false });
        return new Response(JSON.stringify({
          subject: content.subject,
          content,
          default_content: DEFAULT_CONTENT,
          archives: (arch ?? []).map((a: any) => ({
            month: String(a.id).slice(6), label: monthLabel(String(a.id).slice(6)),
            content: { subject: a.subject, summary: a.summary, body: a.body, stats_month: a.stats_month },
            updated_at: a.updated_at,
          })),
          partners: list.map((p) => ({ id: p.id, name: p.name, has_link: !!p.token })),
        }), { headers: jsonHeaders });
      }

      if (rawBody.action === "newsletter-preview") {
        const p = list.find((x) => x.id === rawBody.partner_id);
        if (!p) return new Response(JSON.stringify({ error: "Partnern hittades inte" }), { status: 404, headers: jsonHeaders });
        if (!p.token) return new Response(JSON.stringify({ error: "Partnern saknar giltig profileringslänk" }), { status: 400, headers: jsonHeaders });
        let c: NewsletterContent = content;
        if (rawBody.archive_month) {
          const m = String(rawBody.archive_month);
          const a = MONTH_RE.test(m) ? await loadContent(sb, `arkiv-${m}`) : null;
          if (!a) return new Response(JSON.stringify({ error: "Arkiverat brev hittades inte" }), { status: 404, headers: jsonHeaders });
          c = a;
        } else if (rawBody.content) {
          const draft = ContentSchema.safeParse(rawBody.content);
          if (draft.success) c = draft.data;
        }
        const stats = await statsFor(p, c);
        return new Response(JSON.stringify({ subject: c.subject, html: newsletterEmail(p.name, p.token, c, stats), stats }), { headers: jsonHeaders });
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
          const stats = await statsFor(p, content);
          const { data, error } = await rsNl.emails.send({
            from: "Thomas Laine via d365.se <info@d365.se>",
            to: [REVIEW_RECIPIENT], reply_to: REVIEW_RECIPIENT, subject,
            html: newsletterEmail(p.name, p.token, content, stats),
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