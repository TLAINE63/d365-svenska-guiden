import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { buildDraftStats, renderStatsHtml, renderVisibilityHtml, type DraftStats } from "./stats.ts";

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  const allowed = [
    "https://d365.se", "https://www.d365.se",
    "https://d365-svenska-guiden.lovable.app",
    "http://localhost:5173", "http://localhost:8080",
  ];
  if (allowed.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  return false;
}
function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Endast besök på vår egen svenska sajt räknas. Snitcher-sessioner innehåller ofta
// besök på d365guide.com (internationella sajten) – de ska aldrig ge partnerstatistik här.
const OWN_SITE_RE = /^(https?:\/\/)?(www\.)?(d365\.se|d365-svenska-guiden\.lovable\.app|id-preview--[a-z0-9-]+\.lovable\.app)(\/|$)/i;
function isOwnSiteUrl(url: unknown): boolean {
  const u = typeof url === "string" ? url.trim() : "";
  if (!u) return false;
  if (u.startsWith("/")) return true;
  return OWN_SITE_RE.test(u);
}



function base64UrlToBase64(str: string) {
  let b = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b.length % 4) b += '=';
  return b;
}
function b64UrlDecode(str: string): Uint8Array {
  const bin = atob(base64UrlToBase64(str));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function verifyJWT(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [h, p, sig] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("HMAC", key, b64UrlDecode(sig) as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return false;
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return payload.role === "admin";
  } catch { return false; }
}

function esc(s: any): string {
  if (s == null) return "";
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function monthLabel(d: Date) {
  return d.toLocaleDateString("sv-SE", { year: "numeric", month: "long" });
}

function previousMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
  return { start: start.toISOString().slice(0,10), end: end.toISOString().slice(0,10) };
}

interface CompanyEntry {
  organisation_uuid: string;
  company_name: string | null;
  company_domain: string | null;
  company_industry: string | null;
  company_size: string | null;
  company_country: string | null;
  visit_count: number;
  sessions: {
    started_at: string | null;
    profile_urls: string[];
    other_urls: string[];
  }[];
}

const PRODUCT_LABELS: Record<string, string> = {
  "/business-central": "Business Central",
  "/finance-supply-chain": "Finance & Supply Chain",
  "/d365sales": "Sales (CRM)",
  "/d365customerservice": "Customer Service",
  "/d365fieldservice": "Field Service",
  "/d365marketing": "Customer Insights – Journeys",
  "/d365contactcenter": "Contact Center",
  "/crm": "CRM-översikt",
  "/erp-oversikt": "ERP-översikt",
  "/agents": "AI-agenter",
  "/copilot": "Copilot",
  "/aioversikt": "AI-översikt",
  "/branschlosningar": "Branschlösningar",
  "/valjdynamics365partner": "Välj partner",
  "/kom-igang": "Kom igång",
  "/kunskapscenter": "Kunskapscenter",
  "/": "Startsidan",
};
function labelForPath(path: string): string {
  if (PRODUCT_LABELS[path]) return PRODUCT_LABELS[path];
  const stripped = path.replace(/\/$/, "");
  if (PRODUCT_LABELS[stripped]) return PRODUCT_LABELS[stripped];
  return path;
}

function initials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() || "").join("") || "?";
}

function renderRichText(raw: string): string {
  if (!raw) return "";
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let inList = false;
  const flushList = () => {
    if (inList) { out.push("</ul>"); inList = false; }
  };
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) { flushList(); continue; }
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    if (bullet) {
      if (!inList) {
        out.push('<ul style="margin:6px 0 12px 0;padding-left:20px;color:#334155;font-size:14px;line-height:1.6">');
        inList = true;
      }
      out.push(`<li style="margin:4px 0">${esc(bullet[1])}</li>`);
    } else {
      flushList();
      out.push(`<p style="margin:6px 0 10px;color:#334155;font-size:14px;line-height:1.6">${esc(line)}</p>`);
    }
  }
  flushList();
  return out.join("");
}

async function fetchReportSettings(supabase: any): Promise<{ changelog: string; nextPeriod: string; contact: string }> {
  try {
    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["monthly_report_changelog", "monthly_report_next_period", "monthly_report_contact"]);
    const map = new Map<string, string>();
    for (const r of data || []) map.set(r.key, r.value || "");
    return {
      changelog: map.get("monthly_report_changelog") || "",
      nextPeriod: map.get("monthly_report_next_period") || "",
      contact: map.get("monthly_report_contact") || "",
    };
  } catch {
    return { changelog: "", nextPeriod: "", contact: "" };
  }
}

async function renderDraftEmail(supabase: any, opts: {
  partnerName: string;
  partnerSlug: string;
  intro: string;
  companies: CompanyEntry[];
  periodLabel: string;
  siteOrigin: string;
  stats?: DraftStats | null;
}): Promise<string> {
  const settings = await fetchReportSettings(supabase);
  return buildEmailHtml({ ...opts, settings });
}

function buildEmailHtml(opts: {
  partnerName: string;
  partnerSlug: string;
  intro: string;
  companies: CompanyEntry[];
  periodLabel: string;
  siteOrigin: string;
  stats?: DraftStats | null;
  settings?: { changelog: string; nextPeriod: string; contact: string };
}): string {
  const { partnerName, partnerSlug, intro, companies, periodLabel, siteOrigin } = opts;
  const settings = opts.settings || { changelog: "", nextPeriod: "", contact: "" };
  const stats = opts.stats || null;

  const profileUrl = `${siteOrigin}/partner/${partnerSlug}`;
  const totalVisits = companies.reduce((s, c) => s + c.visit_count, 0);
  const withIndustry = companies.filter(c => c.company_industry).length;

  // Anonymiserat: aldrig företagsnamn eller domän i mejlet till partner.
  const meta = (c: CompanyEntry) =>
    [c.company_size]
      .filter(Boolean)
      .map(v => `<span style="display:inline-block;background:#f1f5f9;color:#475569;font-size:11px;padding:3px 8px;border-radius:999px;margin:2px 4px 0 0">${esc(v as string)}</span>`)
      .join("");


  const rows = companies.map((c, idx) => {
    const allOther = new Set<string>();
    const allProfile = new Set<string>();
    c.sessions.forEach(s => {
      s.other_urls.forEach(u => allOther.add(u));
      s.profile_urls.forEach(u => allProfile.add(u));
    });
    const otherList = Array.from(allOther).slice(0, 6).map(u => {
      try {
        const url = new URL(u);
        const label = url.pathname === "/" ? "Startsidan" : labelForPath(url.pathname);
        return `<li style="margin:3px 0;font-size:13px;color:#475569"><a href="${esc(u)}" style="color:#1e3a5f;text-decoration:none">${esc(label)}</a></li>`;
      } catch { return ""; }
    }).join("");

    const matchedList = Array.from(allProfile).slice(0, 10).map(u => {
      let pathOnly = u;
      try { pathOnly = new URL(u).pathname; } catch {}
      return `<li style="margin:3px 0;font-size:12px;color:#475569;font-family:ui-monospace,SFMono-Regular,Menlo,monospace"><a href="${esc(u)}" style="color:#15803d;text-decoration:none">${esc(pathOnly)}</a></li>`;
    }).join("");

    const anonTitle = (c.company_industry || "").trim() || "Identifierat företag";

    return `
      <tr><td style="padding:0 0 14px">
        <table width="100%" style="width:100%;border-collapse:separate;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
          <tr>
            <td class="card-pad" style="padding:18px 20px;vertical-align:top">
              <table style="width:100%;border-collapse:collapse"><tr>
                <td class="avatar-cell" style="vertical-align:top;width:48px;padding-right:14px">
                  <div style="width:44px;height:44px;border-radius:10px;background:#15130F;color:#fff;font-weight:700;font-size:18px;text-align:center;line-height:44px;font-family:-apple-system,'Segoe UI',sans-serif">&#9679;</div>
                </td>
                <td class="title-cell" style="vertical-align:top">
                  <div style="font-weight:700;font-size:16px;color:#0f172a;line-height:1.3">${esc(anonTitle)}</div>
                  <div style="margin-top:8px">${meta(c)}</div>
                </td>

                <td class="visits-cell" style="vertical-align:top;text-align:right;white-space:nowrap;padding-left:12px">
                  <div style="display:inline-block;background:#fff7ed;color:#9a3412;border-radius:999px;padding:4px 12px;font-weight:600;font-size:12px">${c.visit_count} besök</div>
                </td>
              </tr></table>
              <div style="margin-top:14px;padding:10px 12px;border:1px solid #d1fae5;background:#f0fdf4;border-radius:8px">
                <div style="font-size:11px;color:#15803d;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px;font-weight:600">✓ Matchade profil-URL:er (${allProfile.size})</div>
                ${matchedList ? `<ul style="margin:0;padding-left:18px">${matchedList}</ul>` : `<div style="font-size:12px;color:#64748b">Inga URL:er sparade (äldre data).</div>`}
              </div>
              ${otherList ? `
                <div style="margin-top:10px;padding-top:12px;border-top:1px dashed #e2e8f0">
                  <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px">Andra sidor de tittade på</div>
                  <ul style="margin:0;padding-left:18px">${otherList}</ul>
                </div>` : ""}
            </td>
          </tr>
        </table>
      </td></tr>`;
  }).join("");

  const stat = (label: string, value: string | number, color: string) => `
    <td style="padding:16px 12px;text-align:center;background:#f8fafc;border-radius:10px;width:33%">
      <div style="font-size:28px;font-weight:700;color:${color};line-height:1">${value}</div>
      <div style="font-size:11px;color:#64748b;margin-top:6px;text-transform:uppercase;letter-spacing:0.5px">${label}</div>
    </td>`;

  return `<!DOCTYPE html>
<html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><title>Månadsrapport ${esc(partnerName)}</title>
<style>
  img{max-width:100%}
  table{table-layout:auto}
  a{word-break:break-word}
  @media only screen and (max-width:600px){
    .wrap{padding:12px 8px !important}
    .hd{padding:22px 18px 18px !important}
    .hd h1{font-size:21px !important}
    .pad{padding:20px 18px !important}
    .card-pad{padding:14px 14px !important}
    .avatar-cell{display:none !important}
    .visits-cell{display:block !important;width:100% !important;text-align:left !important;padding:8px 0 0 0 !important}
    .title-cell{display:block !important;width:100% !important}
    .stats-tbl .col-prev{display:none !important}
    .stats-tbl .cell{padding:10px 10px !important;font-size:13px !important}
    .btn{display:block !important;width:100% !important;box-sizing:border-box;text-align:center}
    h1,h2,h3{word-break:break-word}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a">
  <div class="wrap" style="max-width:660px;margin:0 auto;padding:24px 16px">

    <div class="hd" style="background:#15130F;color:#ffffff;padding:30px 28px 26px;border-radius:14px 14px 0 0">
      <div style="font-size:12px;color:#F0A88C;letter-spacing:1.4px;text-transform:uppercase;font-weight:700">D365.se · Månadsrapport</div>
      <h1 style="margin:10px 0 6px;font-size:26px;line-height:1.2;color:#ffffff;font-weight:700">${esc(partnerName)}</h1>
      <div style="font-size:14px;color:#E7E3DC">Period: ${esc(periodLabel)}</div>
    </div>
    <div style="height:4px;background:#B23D19;line-height:4px;font-size:0">&nbsp;</div>


    <div class="pad" style="background:#ffffff;padding:28px;border-radius:0 0 14px 14px;box-shadow:0 1px 3px rgba(15,23,42,0.06)">

      <p style="margin:0 0 22px;color:#2A2724;font-size:16px;line-height:1.65">${esc(intro)}</p>

      ${renderStatsHtml(stats)}

      ${renderVisibilityHtml(stats)}

      <h2 style="margin:26px 0 8px;font-size:17px;color:#0f172a">Företag som besökt er profil</h2>
      <div style="margin:0 0 16px;padding:10px 14px;background:#F4FAF8;border:1px solid #BFE0D8;border-radius:8px;font-size:13px;line-height:1.55;color:#0F4F44">
        <strong>Så här redovisar vi:</strong> vi lämnar aldrig ut enskilda företagsnamn eller domäner. Varje kort nedan visar bara
        bransch och storlek. Urvalet är företag vars session innehåller en URL som matchar
        <code style="background:#DCEFEA;padding:1px 6px;border-radius:4px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace">d365.se/partner/${esc(partnerSlug)}</code>.
      </div>


      <table style="width:100%;border-collapse:collapse">
        ${rows || `<tr><td style="padding:24px;color:#94a3b8;text-align:center;background:#f8fafc;border-radius:10px">Inga identifierade besök denna period.</td></tr>`}
      </table>

      <div style="margin:22px 0 0;padding:16px 18px;background:#f8fafc;border-left:4px solid #B23D19;border-radius:6px">
        <div style="color:#475569;font-size:13px;line-height:1.55">
          <strong style="color:#0f172a">Hur tolkar vi datan?</strong> Listan visar anonymiserade företag som har besökt <em>just er partnerprofil</em> (<code style="background:#e2e8f0;padding:1px 5px;border-radius:4px;font-size:12px">/partner/${esc(partnerSlug)}</code>) på d365.se. Av integritetsskäl redovisas endast bransch och storlek – aldrig företagsnamn eller domän. "Andra sidor" visar vilka produktområden samma besökare tittade på i samma session – ofta en signal om vad de undersöker.
        </div>
      </div>

      <div style="text-align:center;margin:26px 0 8px">
        <a class="btn" href="${esc(profileUrl)}" style="display:inline-block;background:#B23D19;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-weight:600;font-size:14px">
          Öppna er partnerprofil →
        </a>
      </div>

      ${settings.changelog ? `
      <div style="margin:28px 0 0;padding-top:20px;border-top:1px solid #e2e8f0">
        <h3 style="margin:0 0 8px;font-size:16px;color:#0f172a">Nytt på sajten</h3>
        <p style="margin:0 0 8px;color:#64748b;font-size:12px;line-height:1.5">Förbättringar vi genomfört på d365.se som påverkar er synlighet.</p>
        ${renderRichText(settings.changelog)}
      </div>` : ""}

      ${settings.nextPeriod ? `
      <div style="margin:22px 0 0;padding-top:18px;border-top:1px solid #e2e8f0">
        <h3 style="margin:0 0 8px;font-size:16px;color:#0f172a">Nästa period</h3>
        ${renderRichText(settings.nextPeriod)}
      </div>` : ""}

      ${settings.contact ? `
      <p style="margin:18px 0 0;color:#475569;font-size:13px;line-height:1.6">
        Frågor eller önskemål om innehåll? Kontakta ${esc(settings.contact)}.
      </p>` : ""}

      <p style="color:#475569;font-size:13px;line-height:1.6;margin:28px 0 6px">
        Vänliga hälsningar,<br/>
        <strong style="color:#0f172a">Thomas Laine &amp; Michael Uhman</strong><br/>
        d365.se · Den köparsidiga guiden till Microsoft Dynamics 365
      </p>

      <div style="margin:28px 0 8px;padding-top:20px;border-top:1px solid #e2e8f0">
        <h3 style="margin:0 0 6px;font-size:15px;color:#0f172a">Besökarstatistik – d365.se senaste 90 dagar</h3>
        <p style="margin:0 0 14px;color:#64748b;font-size:12px;line-height:1.5">
          Översikt över sajten d365.se så ni ser i vilket sammanhang er profil syns.
        </p>
        <div style="text-align:center">
          <img src="https://vnvphfrrmoaskiwlspeo.supabase.co/storage/v1/object/public/partner-logos/email-assets/besokarstatistik.png"
               alt="Besökarstatistik d365.se senaste 90 dagar"
               width="600"
               style="display:block;width:100%;max-width:600px;height:auto;margin:0 auto;border:1px solid #e2e8f0;border-radius:10px" />
          <a href="${esc(siteOrigin)}/partnerstatistik" style="display:inline-block;margin-top:10px;color:#1e3a5f;font-size:12px;text-decoration:none">
            Se aktuell statistik på d365.se/partnerstatistik →
          </a>
        </div>
      </div>

      <p style="color:#94a3b8;font-size:11px;line-height:1.55;margin:26px 0 0;text-align:center">
        Identifieringen sker via IP-baserad reverse lookup (Snitcher) och är inte 100 % exakt, men ger en god indikation om vilka företag som varit aktiva. Rapporten skickas månadsvis till partners på d365.se.
      </p>
    </div>

    <p style="text-align:center;color:#94a3b8;font-size:11px;margin:16px 0 0">
      D365.se · Den köparsidiga guiden till Microsoft Dynamics 365
    </p>
  </div>
</body></html>`;
}

async function generateDrafts(supabase: any, opts: { period_start?: string; period_end?: string }) {
  const { start, end } = opts.period_start && opts.period_end
    ? { start: opts.period_start, end: opts.period_end }
    : previousMonthRange();

  const { data: partners, error: pErr } = await supabase
    .from("partners")
    .select("id, slug, name, email, admin_contact_email")
    .eq("is_featured", true);
  if (pErr) throw pErr;

  // Fetch all visits active in period (use session_ended_at = Snitcher last_seen,
  // since pages_visited is cumulative per organisation).
  const { data: visits, error: vErr } = await supabase
    .from("snitcher_visits")
    .select("organisation_uuid, company_name, company_domain, company_industry, company_size, company_country, session_uuid, session_started_at, session_ended_at, visited_urls, partner_slugs")
    .gte("session_ended_at", `${start}T00:00:00Z`)
    .lte("session_ended_at", `${end}T23:59:59Z`);
  if (vErr) throw vErr;

  const visitsBySlug = new Map<string, any[]>();
  for (const v of visits || []) {
    for (const slug of v.partner_slugs || []) {
      if (!visitsBySlug.has(slug)) visitsBySlug.set(slug, []);
      visitsBySlug.get(slug)!.push(v);
    }
  }

  const periodLabel = monthLabel(new Date(`${start}T00:00:00Z`));
  let created = 0, skipped = 0;

  for (const partner of partners || []) {
    const partnerVisits = visitsBySlug.get(partner.slug) || [];

    // Group by organisation_uuid
    const byOrg = new Map<string, CompanyEntry>();
    for (const v of partnerVisits) {
      const urls: { url: string }[] = ((v.visited_urls || []) as any[]).filter((u: any) => isOwnSiteUrl(u?.url || u));
      const profileRe = new RegExp(`/partner/${partner.slug}(?:/|$|\\?)`, "i");
      const profile_urls = urls.map(u => u.url).filter(u => profileRe.test(u));
      const other_urls = urls.map(u => u.url).filter(u => !profileRe.test(u));
      if (profile_urls.length === 0) continue;


      let entry = byOrg.get(v.organisation_uuid);
      if (!entry) {
        entry = {
          organisation_uuid: v.organisation_uuid,
          company_name: v.company_name,
          company_domain: v.company_domain,
          company_industry: v.company_industry,
          company_size: v.company_size,
          company_country: v.company_country,
          visit_count: 0,
          sessions: [],
        };
        byOrg.set(v.organisation_uuid, entry);
      }
      entry.visit_count++;
      entry.sessions.push({
        started_at: v.session_started_at,
        profile_urls,
        other_urls,
      });
    }

    const companies = Array.from(byOrg.values()).sort((a,b) => b.visit_count - a.visit_count);

    // Trafikstatistik (sammanslagen rapport: statistik + identifierade företag)
    const stats = await buildDraftStats(supabase, partner, start, end, companies);
    const c = stats.current;
    const hasTraffic = c.profileVisits + c.compareViews + c.websiteClicks + c.industryListingViews
      + (c.cardClicks ?? 0) + (c.guideListingViews ?? 0) > 0;
    if (companies.length === 0 && !hasTraffic) { skipped++; continue; }

    const recipient = partner.admin_contact_email || partner.email;

    const subject = `Månadsrapport ${periodLabel} – d365.se`;
    const exposure = (c.guideListingViews ?? 0) + c.compareViews + c.industryListingViews;
    const intro = `Här kommer din månadsrapport för ${periodLabel}. Under perioden hade din profil på d365.se ${c.profileVisits} visningar och ni visades ${exposure} gånger i partnerguiden, jämförelsevyn och branschlistor.` +
      (companies.length > 0
        ? ` Vi identifierade dessutom ${companies.length} företag som besökt din profil – redovisade anonymiserat med bransch och storlek.`
        : ``);

    const { error: upErr } = await supabase
      .from("partner_report_drafts")
      .upsert({
        partner_id: partner.id,
        partner_slug: partner.slug,
        partner_name: partner.name,
        recipient_email: recipient,
        period_start: start,
        period_end: end,
        subject,
        intro_text: intro,
        companies,
        stats,
        status: "pending_review",
      }, { onConflict: "partner_slug,period_start" });
    if (upErr) console.error("Draft upsert error", partner.slug, upErr);
    else created++;
  }

  return { created, skipped, period_start: start, period_end: end };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, token, ...data } = await req.json();
    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!(await verifyJWT(token || "", JWT_SECRET))) {
      return new Response(JSON.stringify({ error: "Ogiltig session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    switch (action) {
      case "list": {
        const { period_start } = data;
        let query = supabase.from("partner_report_drafts").select("*").order("created_at", { ascending: false });
        if (period_start) query = query.eq("period_start", period_start);
        const { data: drafts, error } = await query;
        if (error) throw error;
        return new Response(JSON.stringify({ drafts }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "partner_engagement": {
        // Aggregates: partners compared in /jamfor-partners, listed in filters, and card-clicked.
        const { period_start, period_end } = data as { period_start?: string; period_end?: string };
        const now = new Date();
        const defaultEnd = now.toISOString().slice(0, 10);
        const defaultStart = new Date(now.getTime() - 30 * 86400000).toISOString().slice(0, 10);
        const start = period_start || defaultStart;
        const end = period_end || defaultEnd;
        const startIso = `${start}T00:00:00Z`;
        const endIso = `${end}T23:59:59Z`;

        const [{ data: partners }, { data: exposures, error: eErr }, { data: views, error: vErr }] = await Promise.all([
          supabase.from("partners").select("id, slug, name, is_featured, agreement_signed"),
          supabase
            .from("partner_filter_exposures")
            .select("partner_slug, page_path, filter_context, session_id, viewed_at")
            .gte("viewed_at", startIso)
            .lte("viewed_at", endIso),
          supabase
            .from("partner_profile_views")
            .select("partner_slug, view_type, page_source, viewed_at")
            .eq("view_type", "card_click")
            .gte("viewed_at", startIso)
            .lte("viewed_at", endIso),
        ]);
        if (eErr) throw eErr;
        if (vErr) throw vErr;

        const partnerBySlug = new Map<string, any>();
        for (const p of partners || []) partnerBySlug.set(p.slug, p);
        const nameOf = (slug: string) => partnerBySlug.get(slug)?.name || slug;
        const isFeatured = (slug: string) => Boolean(partnerBySlug.get(slug)?.is_featured);
        const isSigned = (slug: string) => Boolean(partnerBySlug.get(slug)?.agreement_signed);

        // 1) Compare participation (page_path = /jamfor-partners)
        const compareBySlug = new Map<string, { sessions: Set<string>; count: number; last: string | null }>();
        // 2) Listings in other filter pages
        const listingsBySlug = new Map<string, { total: number; by_path: Record<string, number>; last: string | null }>();
        let compareSessions = new Set<string>();

        for (const e of exposures || []) {
          const slug = e.partner_slug as string;
          if (!slug) continue;
          if (e.page_path === "/jamfor-partners") {
            let b = compareBySlug.get(slug);
            if (!b) { b = { sessions: new Set(), count: 0, last: null }; compareBySlug.set(slug, b); }
            b.count++;
            if (e.session_id) { b.sessions.add(e.session_id); compareSessions.add(e.session_id); }
            if (!b.last || e.viewed_at > b.last) b.last = e.viewed_at;
          } else {
            let b = listingsBySlug.get(slug);
            if (!b) { b = { total: 0, by_path: {}, last: null }; listingsBySlug.set(slug, b); }
            b.total++;
            b.by_path[e.page_path] = (b.by_path[e.page_path] || 0) + 1;
            if (!b.last || e.viewed_at > b.last) b.last = e.viewed_at;
          }
        }

        // 3) Card clicks
        const cardsBySlug = new Map<string, { count: number; by_source: Record<string, number>; last: string | null }>();
        for (const v of views || []) {
          const slug = v.partner_slug as string;
          if (!slug) continue;
          let b = cardsBySlug.get(slug);
          if (!b) { b = { count: 0, by_source: {}, last: null }; cardsBySlug.set(slug, b); }
          b.count++;
          const src = v.page_source || "(okänd)";
          b.by_source[src] = (b.by_source[src] || 0) + 1;
          if (!b.last || v.viewed_at > b.last) b.last = v.viewed_at;
        }

        const compareRows = Array.from(compareBySlug.entries()).map(([slug, v]) => ({
          slug,
          name: nameOf(slug),
          is_featured: isFeatured(slug),
          agreement_signed: isSigned(slug),
          exposures: v.count,
          unique_sessions: v.sessions.size,
          last_seen: v.last,
        })).sort((a, b) => b.exposures - a.exposures);

        const listingRows = Array.from(listingsBySlug.entries()).map(([slug, v]) => ({
          slug,
          name: nameOf(slug),
          is_featured: isFeatured(slug),
          agreement_signed: isSigned(slug),
          total: v.total,
          by_path: Object.entries(v.by_path).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count),
          last_seen: v.last,
        })).sort((a, b) => b.total - a.total);

        const cardRows = Array.from(cardsBySlug.entries()).map(([slug, v]) => ({
          slug,
          name: nameOf(slug),
          is_featured: isFeatured(slug),
          agreement_signed: isSigned(slug),
          card_clicks: v.count,
          by_source: Object.entries(v.by_source).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count),
          last_seen: v.last,
        })).sort((a, b) => b.card_clicks - a.card_clicks);

        return new Response(JSON.stringify({
          period_start: start,
          period_end: end,
          compare: {
            total_partners: compareRows.length,
            total_exposures: (exposures || []).filter((e: any) => e.page_path === "/jamfor-partners").length,
            unique_sessions: compareSessions.size,
            partners: compareRows,
          },
          listings: {
            total_partners: listingRows.length,
            total_exposures: (exposures || []).filter((e: any) => e.page_path !== "/jamfor-partners").length,
            partners: listingRows,
          },
          card_clicks: {
            total_partners: cardRows.length,
            total_clicks: cardRows.reduce((s, r) => s + r.card_clicks, 0),
            partners: cardRows,
          },
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }



      case "explore": {
        // Returns per-partner aggregation of identified companies + URLs for a date range.
        const { period_start, period_end } = data as { period_start?: string; period_end?: string };
        const range = period_start && period_end
          ? { start: period_start, end: period_end }
          : previousMonthRange();

        const { data: visits, error: vErr } = await supabase
          .from("snitcher_visits")
          .select("organisation_uuid, company_name, company_domain, company_industry, company_size, company_country, session_started_at, session_ended_at, visited_urls, partner_slugs")
          .gte("session_ended_at", `${range.start}T00:00:00Z`)
          .lte("session_ended_at", `${range.end}T23:59:59Z`);
        if (vErr) throw vErr;

        const { data: partners, error: pErr } = await supabase
          .from("partners")
          .select("id, slug, name, is_featured");
        if (pErr) throw pErr;
        const partnerBySlug = new Map<string, any>();
        for (const p of partners || []) partnerBySlug.set(p.slug, p);

        const bySlug = new Map<string, { partner_slug: string; partner_name: string; is_featured: boolean; companies: Map<string, any> }>();

        for (const v of visits || []) {
          const urls: { url: string }[] = ((v.visited_urls || []) as any[]).filter((u: any) => isOwnSiteUrl(u?.url || u));
          for (const slug of v.partner_slugs || []) {
            const partner = partnerBySlug.get(slug);
            // Skippa slugs som inte finns som partner i denna databas (t.ex. d365guide.com-profiler)
            if (!partner) continue;
            let bucket = bySlug.get(slug);
            if (!bucket) {
              bucket = {
                partner_slug: slug,
                partner_name: partner?.name || slug,
                is_featured: !!partner?.is_featured,
                companies: new Map(),
              };
              bySlug.set(slug, bucket);
            }
            const profileRe = new RegExp(`/partner/${slug}(?:/|$|\\?)`, "i");
            const profile_urls = urls.map(u => u.url).filter(u => profileRe.test(u));
            const other_urls = urls.map(u => u.url).filter(u => !profileRe.test(u));
            if (profile_urls.length === 0) continue;


            let entry = bucket.companies.get(v.organisation_uuid);
            if (!entry) {
              entry = {
                organisation_uuid: v.organisation_uuid,
                company_name: v.company_name,
                company_domain: v.company_domain,
                company_industry: v.company_industry,
                company_size: v.company_size,
                company_country: v.company_country,
                first_seen: v.session_started_at,
                last_seen: v.session_ended_at,
                profile_urls: new Set<string>(),
                other_urls: new Set<string>(),
              };
              bucket.companies.set(v.organisation_uuid, entry);
            }
            profile_urls.forEach((u: string) => entry.profile_urls.add(u));
            other_urls.forEach((u: string) => entry.other_urls.add(u));
            if (v.session_ended_at && (!entry.last_seen || v.session_ended_at > entry.last_seen)) entry.last_seen = v.session_ended_at;
          }
        }

        const partners_out = Array.from(bySlug.values())
          .map(b => ({
            partner_slug: b.partner_slug,
            partner_name: b.partner_name,
            is_featured: b.is_featured,
            companies: Array.from(b.companies.values()).map((c: any) => ({
              ...c,
              profile_urls: Array.from(c.profile_urls),
              other_urls: Array.from(c.other_urls),
            })).sort((a: any, b: any) => b.profile_urls.length - a.profile_urls.length),
          }))
          .sort((a, b) => b.companies.length - a.companies.length);

        return new Response(JSON.stringify({
          period_start: range.start,
          period_end: range.end,
          partners: partners_out,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "list_all_visitors": {
        // Returns all identified companies (Snitcher) for a date range, regardless of partner visit.
        const { period_start, period_end } = data as { period_start?: string; period_end?: string };
        const range = period_start && period_end
          ? { start: period_start, end: period_end }
          : previousMonthRange();

        const { data: visits, error: vErr } = await supabase
          .from("snitcher_visits")
          .select("organisation_uuid, company_name, company_domain, company_industry, company_size, company_country, company_logo_url, session_started_at, session_ended_at, visited_urls, partner_slugs, synced_at")
          .gte("session_ended_at", `${range.start}T00:00:00Z`)
          .lte("session_ended_at", `${range.end}T23:59:59Z`)
          .order("session_ended_at", { ascending: false })
          .limit(2000);
        if (vErr) throw vErr;

        // Only show slugs that still correspond to a currently published partner.
        const { data: publishedRows } = await supabase
          .from("partners")
          .select("slug")
          .eq("is_featured", true);
        const publishedSlugs = new Set((publishedRows || []).map((r: any) => r.slug));

        // Aggregate per organisation_uuid (one row per company in the range)
        const byOrg = new Map<string, any>();
        for (const v of visits || []) {
          const urls: { url: string }[] = (v.visited_urls || []) as any;
          const urlList = urls.map(u => u.url).filter((u: string) => u && isOwnSiteUrl(u));

          let entry = byOrg.get(v.organisation_uuid);
          if (!entry) {
            entry = {
              organisation_uuid: v.organisation_uuid,
              company_name: v.company_name,
              company_domain: v.company_domain,
              company_industry: v.company_industry,
              company_size: v.company_size,
              company_country: v.company_country,
              company_logo_url: v.company_logo_url,
              first_seen: v.session_started_at,
              last_seen: v.session_ended_at,
              partner_slugs: new Set<string>(),
              urls: new Set<string>(),
              session_count: 0,
            };
            byOrg.set(v.organisation_uuid, entry);
          }
          for (const s of v.partner_slugs || []) {
            if (!publishedSlugs.has(s)) continue;
            // Kräv att profilbesöket faktiskt skedde på d365.se
            if (!urlList.some((u: string) => new RegExp(`/partner/${s}(?:/|$|\\?)`, "i").test(u))) continue;
            entry.partner_slugs.add(s);
          }

          urlList.forEach(u => entry.urls.add(u));
          entry.session_count += 1;
          if (v.session_started_at && (!entry.first_seen || v.session_started_at < entry.first_seen)) entry.first_seen = v.session_started_at;
          if (v.session_ended_at && (!entry.last_seen || v.session_ended_at > entry.last_seen)) entry.last_seen = v.session_ended_at;
        }

        const companies = Array.from(byOrg.values())
          .map(c => ({
            ...c,
            partner_slugs: Array.from(c.partner_slugs),
            urls: Array.from(c.urls),
            url_count: c.urls.size,
            visited_partner: c.partner_slugs.size > 0,
          }))
          .sort((a, b) => (b.last_seen || "").localeCompare(a.last_seen || ""));

        return new Response(JSON.stringify({
          period_start: range.start,
          period_end: range.end,
          total: companies.length,
          companies,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "partner_profile_visits": {
        // Aggregera Snitcher-sessioner per partnerprofil. Endast publicerade partners.
        const { period_start, period_end } = data as { period_start?: string; period_end?: string };
        const range = period_start && period_end
          ? { start: period_start, end: period_end }
          : previousMonthRange();

        const { data: visits, error: vErr } = await supabase
          .from("snitcher_visits")
          .select("organisation_uuid, company_name, partner_slugs, session_started_at, session_ended_at")
          .gte("session_ended_at", `${range.start}T00:00:00Z`)
          .lte("session_ended_at", `${range.end}T23:59:59Z`)
          .not("partner_slugs", "is", null);
        if (vErr) throw vErr;

        const { data: publishedRows } = await supabase
          .from("partners")
          .select("slug, name")
          .eq("is_featured", true);
        const slugToName = new Map<string, string>((publishedRows || []).map((r: any) => [r.slug, r.name]));

        type Agg = {
          slug: string;
          name: string;
          session_count: number;
          unique_companies: Set<string>;
          last_seen: string | null;
          recent_companies: Map<string, string>; // org -> name
        };
        const byPartner = new Map<string, Agg>();
        for (const v of visits || []) {
          for (const slug of v.partner_slugs || []) {
            if (!slugToName.has(slug)) continue;
            let agg = byPartner.get(slug);
            if (!agg) {
              agg = {
                slug,
                name: slugToName.get(slug)!,
                session_count: 0,
                unique_companies: new Set(),
                last_seen: null,
                recent_companies: new Map(),
              };
              byPartner.set(slug, agg);
            }
            agg.session_count += 1;
            agg.unique_companies.add(v.organisation_uuid);
            if (v.company_name) agg.recent_companies.set(v.organisation_uuid, v.company_name);
            if (v.session_ended_at && (!agg.last_seen || v.session_ended_at > agg.last_seen)) {
              agg.last_seen = v.session_ended_at;
            }
          }
        }

        const partners = Array.from(byPartner.values())
          .map(a => ({
            slug: a.slug,
            name: a.name,
            session_count: a.session_count,
            unique_companies: a.unique_companies.size,
            last_seen: a.last_seen,
            companies: Array.from(a.recent_companies.values()).slice(0, 25),
          }))
          .sort((a, b) => b.session_count - a.session_count);

        return new Response(JSON.stringify({
          period_start: range.start,
          period_end: range.end,
          total_partners: partners.length,
          total_sessions: partners.reduce((s, p) => s + p.session_count, 0),
          partners,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "stats_matrix": {
        // Per-partner activity counts for both a primary and comparison window.
        // Used by admin overview (matrix) and embedded in partner edit dialog.
        const { primary_days = 30, comparison_days = 90, partner_slug } = data as {
          primary_days?: number; comparison_days?: number; partner_slug?: string;
        };
        const now = new Date();
        const primaryStartIso = new Date(now.getTime() - primary_days * 86400000).toISOString();
        const comparisonStartIso = new Date(now.getTime() - comparison_days * 86400000).toISOString();

        let partnersQ = supabase.from("partners").select("id, slug, name, is_featured, agreement_signed");
        if (partner_slug) partnersQ = partnersQ.eq("slug", partner_slug);
        else partnersQ = partnersQ.eq("is_featured", true);
        const { data: partners, error: pErr } = await partnersQ;
        if (pErr) throw pErr;

        // Fetch all raw rows once over the comparison (longer) window, then derive primary counts in-memory.
        // Paginate to bypass PostgREST default 1000-row cap
        async function fetchAll<T = any>(builder: () => any, pageSize = 1000): Promise<T[]> {
          const out: T[] = [];
          for (let from = 0; ; from += pageSize) {
            const { data, error } = await builder().range(from, from + pageSize - 1);
            if (error) throw error;
            const rows = (data || []) as T[];
            out.push(...rows);
            if (rows.length < pageSize) break;
          }
          return out;
        }
        const [views, clicks, exposures, snitcher] = await Promise.all([
          fetchAll(() => supabase.from("partner_profile_views").select("partner_slug, view_type, viewed_at").gte("viewed_at", comparisonStartIso)),
          fetchAll(() => supabase.from("partner_clicks").select("partner_name, clicked_at").gte("clicked_at", comparisonStartIso)),
          fetchAll(() => supabase.from("partner_filter_exposures").select("partner_slug, viewed_at").gte("viewed_at", comparisonStartIso)),
          fetchAll(() => supabase.from("snitcher_visits").select("company_name, partner_slugs, visited_urls, session_started_at").gte("session_started_at", comparisonStartIso)),
        ]);




        const partnerNames = new Set((partners || []).map((p: any) => p.name));
        const partnerSlugs = new Set((partners || []).map((p: any) => p.slug));

        type Bucket = { exposures: number; profileVisits: number; cardClicks: number; websiteClicks: number; identified: Set<string> };
        const mk = (): Bucket => ({ exposures: 0, profileVisits: 0, cardClicks: 0, websiteClicks: 0, identified: new Set() });
        const primary = new Map<string, Bucket>();
        const compare = new Map<string, Bucket>();
        for (const p of partners || []) { primary.set(p.slug, mk()); compare.set(p.slug, mk()); }

        const inPrimary = (iso: string | null) => !!iso && iso >= primaryStartIso;

        for (const e of exposures) {
          if (!partnerSlugs.has(e.partner_slug)) continue;
          compare.get(e.partner_slug)!.exposures++;
          if (inPrimary(e.viewed_at)) primary.get(e.partner_slug)!.exposures++;
        }
        for (const v of views) {
          if (!partnerSlugs.has(v.partner_slug)) continue;
          const c = compare.get(v.partner_slug)!;
          const p = primary.get(v.partner_slug)!;
          if (v.view_type === "profile_visit") { c.profileVisits++; if (inPrimary(v.viewed_at)) p.profileVisits++; }
          else if (v.view_type === "card_click") { c.cardClicks++; if (inPrimary(v.viewed_at)) p.cardClicks++; }
        }
        // partner_clicks keyed by partner_name
        const nameToSlug = new Map<string, string>();
        for (const p of partners || []) nameToSlug.set(p.name, p.slug);
        for (const c of clicks) {
          const slug = nameToSlug.get(c.partner_name);
          if (!slug) continue;
          compare.get(slug)!.websiteClicks++;
          if (inPrimary(c.clicked_at)) primary.get(slug)!.websiteClicks++;
        }
        for (const r of snitcher) {
          
          const urls: string[] = Array.isArray(r.visited_urls)
            ? r.visited_urls.map((u: any) => (typeof u === "string" ? u : u?.url || u?.path || "")).filter((u: string) => u && isOwnSiteUrl(u))
            : [];
          const company = (r.company_name || "").trim().toLowerCase();
          if (!company) continue;
          for (const p of partners || []) {
            const matched = urls.some((u) => new RegExp(`/partner/${p.slug}(?:/|$|\\?)`, "i").test(u));

            if (!matched) continue;
            compare.get(p.slug)!.identified.add(company);
            if (inPrimary(r.session_started_at)) primary.get(p.slug)!.identified.add(company);
          }
        }

        const rows = (partners || []).map((p: any) => {
          const a = primary.get(p.slug)!;
          const b = compare.get(p.slug)!;
          return {
            partner_slug: p.slug,
            partner_name: p.name,
            is_featured: p.is_featured,
            agreement_signed: p.agreement_signed,
            primary: {
              exposures: a.exposures,
              profile_visits: a.profileVisits,
              card_clicks: a.cardClicks,
              website_clicks: a.websiteClicks,
              identified_companies: a.identified.size,
            },
            comparison: {
              exposures: b.exposures,
              profile_visits: b.profileVisits,
              card_clicks: b.cardClicks,
              website_clicks: b.websiteClicks,
              identified_companies: b.identified.size,
            },
          };
        }).sort((a: any, b: any) => {
          const av = a.primary.profile_visits + a.primary.card_clicks + a.primary.website_clicks + a.primary.exposures;
          const bv = b.primary.profile_visits + b.primary.card_clicks + b.primary.website_clicks + b.primary.exposures;
          return bv - av;
        });

        return new Response(JSON.stringify({
          primary_days, comparison_days,
          generated_at: now.toISOString(),
          rows,
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }


      case "generate": {
        const result = await generateDrafts(supabase, data);
        return new Response(JSON.stringify({ success: true, ...result }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }


      case "update": {
        const { id, subject, intro_text, recipient_email, excluded_organisation_uuids, status } = data;
        const update: Record<string, unknown> = {};
        if (subject !== undefined) update.subject = subject;
        if (intro_text !== undefined) update.intro_text = intro_text;
        if (recipient_email !== undefined) update.recipient_email = recipient_email;
        if (excluded_organisation_uuids !== undefined) update.excluded_organisation_uuids = excluded_organisation_uuids;
        if (status !== undefined) update.status = status;
        const { error } = await supabase.from("partner_report_drafts").update(update).eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "send": {
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY saknas");
        const resend = new Resend(RESEND_API_KEY);

        const { ids } = data as { ids: string[] };
        if (!Array.isArray(ids) || ids.length === 0) {
          return new Response(JSON.stringify({ error: "Inga utkast valda" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const { data: drafts, error: dErr } = await supabase
          .from("partner_report_drafts").select("*").in("id", ids);
        if (dErr) throw dErr;

        const results: any[] = [];
        for (const d of drafts || []) {
          if (!d.recipient_email) {
            await supabase.from("partner_report_drafts").update({ status: "failed", error_message: "Saknar mottagaradress" }).eq("id", d.id);
            results.push({ id: d.id, ok: false, error: "no_recipient" });
            continue;
          }
          const excluded = new Set<string>(d.excluded_organisation_uuids || []);
          const companies: CompanyEntry[] = (d.companies as any[]).filter((c: any) => !excluded.has(c.organisation_uuid));
          const hasStats = !!(d as any).stats?.current;
          if (companies.length === 0 && !hasStats) {
            await supabase.from("partner_report_drafts").update({ status: "skipped", error_message: "Inget innehåll att rapportera efter exkludering" }).eq("id", d.id);
            results.push({ id: d.id, ok: false, error: "empty_after_exclusions" });
            continue;
          }
          const html = await renderDraftEmail(supabase, {
            partnerName: d.partner_name,
            partnerSlug: d.partner_slug,
            intro: d.intro_text || "",
            companies,
            periodLabel: monthLabel(new Date(`${d.period_start}T00:00:00Z`)),
            siteOrigin: "https://www.d365.se",
            stats: (d as any).stats ?? null,
          });

          try {
            const { error: sendErr } = await resend.emails.send({
              from: "D365.se Rapporter <noreply@d365.se>",
              to: [d.recipient_email],
              subject: d.subject,
              html,
            });
            if (sendErr) throw new Error(sendErr.message || JSON.stringify(sendErr));

            await supabase.from("partner_report_drafts").update({
              status: "sent", sent_at: new Date().toISOString(), error_message: null,
            }).eq("id", d.id);
            await supabase.from("email_send_log").insert({
              recipient_email: d.recipient_email,
              template_name: "partner-monthly-report",
              subject: d.subject,
              status: "sent",
              metadata: { partner_slug: d.partner_slug, period_start: d.period_start, companies: companies.length },
            });
            results.push({ id: d.id, ok: true });
          } catch (e: any) {
            await supabase.from("partner_report_drafts").update({
              status: "failed", error_message: e.message || String(e),
            }).eq("id", d.id);
            results.push({ id: d.id, ok: false, error: e.message });
          }
        }

        return new Response(JSON.stringify({ success: true, results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "delete": {
        const { id } = data;
        const { error } = await supabase.from("partner_report_drafts").delete().eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "preview-html": {
        const { id } = data;
        const { data: d, error } = await supabase.from("partner_report_drafts").select("*").eq("id", id).single();
        if (error || !d) throw error || new Error("Hittades ej");
        const excluded = new Set<string>(d.excluded_organisation_uuids || []);
        const companies = (d.companies as any[]).filter((c: any) => !excluded.has(c.organisation_uuid));
        const html = await renderDraftEmail(supabase, {
          partnerName: d.partner_name,
          partnerSlug: d.partner_slug,
          intro: d.intro_text || "",
          companies,
          periodLabel: monthLabel(new Date(`${d.period_start}T00:00:00Z`)),
          siteOrigin: "https://www.d365.se",
            stats: (d as any).stats ?? null,
        });
        return new Response(JSON.stringify({ html }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Totalrapport: ackumulerad statistik sedan partnern publicerades.
      case "total_report": {
        const { partner_slug, test_email } = data as { partner_slug: string; test_email?: string };
        const { data: partner, error: pErr } = await supabase
          .from("partners")
          .select("id, slug, name, email, admin_contact_email, published_at, created_at")
          .eq("slug", partner_slug).single();
        if (pErr || !partner) throw pErr || new Error("Partner hittades ej");

        const start = String(partner.published_at || partner.created_at).slice(0, 10);
        const end = new Date().toISOString().slice(0, 10);

        const { data: visits } = await supabase
          .from("snitcher_visits")
          .select("organisation_uuid, company_name, company_domain, company_industry, company_size, company_country, session_uuid, session_started_at, session_ended_at, visited_urls, partner_slugs")
          .contains("partner_slugs", [partner.slug])
          .gte("session_ended_at", `${start}T00:00:00Z`)
          .lte("session_ended_at", `${end}T23:59:59Z`);

        const byOrg = new Map<string, CompanyEntry>();
        const profileRe = new RegExp(`/partner/${partner.slug}(?:/|$|\\?)`, "i");
        for (const v of visits || []) {
          const urls: any[] = ((v.visited_urls || []) as any[]).filter((u: any) => isOwnSiteUrl(u?.url || u));
          const profile_urls = urls.map((u: any) => u.url).filter((u: string) => profileRe.test(u));
          const other_urls = urls.map((u: any) => u.url).filter((u: string) => !profileRe.test(u));
          if (profile_urls.length === 0) continue;
          let entry = byOrg.get(v.organisation_uuid);
          if (!entry) {
            entry = {
              organisation_uuid: v.organisation_uuid,
              company_name: v.company_name,
              company_domain: v.company_domain,
              company_industry: v.company_industry,
              company_size: v.company_size,
              company_country: v.company_country,
              visit_count: 0,
              sessions: [],
            };
            byOrg.set(v.organisation_uuid, entry);
          }
          entry.visit_count++;
          entry.sessions.push({ started_at: v.session_started_at, profile_urls, other_urls });
        }
        const companies = Array.from(byOrg.values()).sort((a, b) => b.visit_count - a.visit_count);

        const stats = await buildDraftStats(supabase, partner, start, end, companies, { skipPrevious: true });
        const c = stats.current;
        const exposure = (c.guideListingViews ?? 0) + c.compareViews + c.industryListingViews;
        const periodLabel = `${start} – ${end}`;
        const intro = `Här kommer er totalrapport för hela perioden sedan ni publicerades på d365.se (${periodLabel}). ` +
          `Under perioden har er profil haft ${c.profileVisits} visningar och ni har visats ${exposure} gånger i partnerguiden, jämförelsevyn och branschlistor.` +
          (companies.length > 0
            ? ` Vi har dessutom identifierat ${companies.length} företag som besökt er profil – redovisade anonymiserat med bransch och storlek.`
            : ``);

        const html = await renderDraftEmail(supabase, {
          partnerName: partner.name,
          partnerSlug: partner.slug,
          intro,
          companies,
          periodLabel,
          siteOrigin: "https://www.d365.se",
          stats,
        });

        if (test_email) {
          if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(test_email)) {
            return new Response(JSON.stringify({ error: "Ogiltig e-postadress" }), {
              status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
          if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY saknas");
          const resend = new Resend(RESEND_API_KEY);
          await resend.emails.send({
            from: "D365.se Rapporter <noreply@d365.se>",
            to: [test_email],
            subject: `Totalrapport ${partner.name} – d365.se`,
            html,
          });
        }

        return new Response(JSON.stringify({ html, period_start: start, period_end: end, companies: companies.length, stats }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }



      case "send-test": {
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY saknas");
        const resend = new Resend(RESEND_API_KEY);
        const { id, test_email } = data as { id: string; test_email: string };
        if (!test_email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(test_email)) {
          return new Response(JSON.stringify({ error: "Ogiltig testadress" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const { data: d, error } = await supabase.from("partner_report_drafts").select("*").eq("id", id).single();
        if (error || !d) throw error || new Error("Hittades ej");
        const excluded = new Set<string>(d.excluded_organisation_uuids || []);
        const companies = (d.companies as any[]).filter((c: any) => !excluded.has(c.organisation_uuid));
        const html = await renderDraftEmail(supabase, {
          partnerName: d.partner_name,
          partnerSlug: d.partner_slug,
          intro: d.intro_text || "",
          companies,
          periodLabel: monthLabel(new Date(`${d.period_start}T00:00:00Z`)),
          siteOrigin: "https://www.d365.se",
            stats: (d as any).stats ?? null,
        });
        const subject = `[TEST] ${d.subject}`;
        const { error: sendErr } = await resend.emails.send({
          from: "D365.se Rapporter <noreply@d365.se>",
          to: [test_email],
          subject,
          html,
        });
        if (sendErr) throw new Error(sendErr.message || JSON.stringify(sendErr));
        await supabase.from("email_send_log").insert({
          recipient_email: test_email,
          template_name: "partner-monthly-report-test",
          subject,
          status: "sent",
          metadata: { partner_slug: d.partner_slug, draft_id: d.id, test: true },
        });
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "send-test-batch": {
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY saknas");
        const resend = new Resend(RESEND_API_KEY);
        const { ids, test_email } = data as { ids: string[]; test_email: string };
        if (!Array.isArray(ids) || ids.length === 0) {
          return new Response(JSON.stringify({ error: "Inga utkast valda" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (!test_email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(test_email)) {
          return new Response(JSON.stringify({ error: "Ogiltig testadress" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const { data: drafts, error: dErr } = await supabase
          .from("partner_report_drafts").select("*").in("id", ids);
        if (dErr) throw dErr;

        const results: any[] = [];
        for (const d of drafts || []) {
          const excluded = new Set<string>(d.excluded_organisation_uuids || []);
          const companies = (d.companies as any[]).filter((c: any) => !excluded.has(c.organisation_uuid));
          if (companies.length === 0 && !(d as any).stats?.current) {
            results.push({ id: d.id, ok: false, error: "empty_after_exclusions" });
            continue;
          }
          const html = await renderDraftEmail(supabase, {
            partnerName: d.partner_name,
            partnerSlug: d.partner_slug,
            intro: d.intro_text || "",
            companies,
            periodLabel: monthLabel(new Date(`${d.period_start}T00:00:00Z`)),
            siteOrigin: "https://www.d365.se",
            stats: (d as any).stats ?? null,
          });
          const subject = `[GODKÄNN] ${d.subject} → ${d.recipient_email || "saknar mottagare"}`;
          try {
            const { error: sendErr } = await resend.emails.send({
              from: "D365.se Rapporter <noreply@d365.se>",
              to: [test_email],
              subject,
              html,
            });
            if (sendErr) throw new Error(sendErr.message || JSON.stringify(sendErr));
            await supabase.from("email_send_log").insert({
              recipient_email: test_email,
              template_name: "partner-monthly-report-approval",
              subject,
              status: "sent",
              metadata: { partner_slug: d.partner_slug, draft_id: d.id, intended_recipient: d.recipient_email, approval: true },
            });
            results.push({ id: d.id, partner: d.partner_name, ok: true });
          } catch (e: any) {
            results.push({ id: d.id, partner: d.partner_name, ok: false, error: e.message });
          }
        }
        return new Response(JSON.stringify({ success: true, results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "get_monthly_report_settings": {
        const keys = ["monthly_report_changelog", "monthly_report_next_period", "monthly_report_contact"];
        const { data: rows } = await supabase.from("site_settings").select("key, value").in("key", keys);
        const map: Record<string, string> = {};
        for (const r of rows || []) map[r.key] = r.value || "";
        return new Response(JSON.stringify({ settings: map }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      case "save_monthly_report_setting": {
        const { key, value } = data as { key?: string; value?: string };
        const allowed = new Set(["monthly_report_changelog", "monthly_report_next_period", "monthly_report_contact"]);
        if (!key || !allowed.has(key)) {
          return new Response(JSON.stringify({ error: "Ogiltig nyckel" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key, value: value || "", updated_at: new Date().toISOString() }, { onConflict: "key" });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      default:
        return new Response(JSON.stringify({ error: "Okänd action" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }

  } catch (e: any) {
    console.error("manage-partner-reports error:", e);
    return new Response(JSON.stringify({ error: e.message || String(e) }), {
      status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" }
    });
  }
});
