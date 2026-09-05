// Teaser-månadsrapport till Basic-partners (ej partnerverifierade profiler).
// Visar partnerns egna (ofta blygsamma) siffror, marknadssiffror för d365.se
// och vad en partnerverifierad profil får – med länk till /partnerprogram.
//
// ─────────────── KANONISKA MÄTPUNKTER (gäller alla rapporter) ───────────────
// unika besökare  = antal DISTINKTA anonymiserade IP-adresser i
//                   visitor_analytics under perioden. Aldrig sessioner,
//                   aldrig sidvisningar.
// sessioner       = distinkta session_id. Redovisas separat, aldrig som
//                   "besökare".
// sidvisningar    = antal rader i visitor_analytics.
// snittid         = medel av time_on_page_seconds > 0 (per sidvisning).
// tillväxt        = (unika besökare 30 d) / (unika besökare föregående 30 d) - 1.
//                   Redovisas endast när båda perioderna har >= 50 besökare,
//                   annars utelämnas siffran (spårningsluckor juni–juli 2026).
// jämförelsetal   = MEDIAN bland partnerverifierade profiler, aldrig medelvärde.
// efterfrågan     = aggregat ur buyer_tool_events, aldrig per besökare.
// Alla besökare räknas, inklusive intern trafik och partners egen trafik.
// ────────────────────────────────────────────────────────────────────────────

import { fetchDemand, renderDemandHtml, type DemandStats } from "./stats.ts";

/** Minsta underlag per period för att våga visa en tillväxtsiffra. */
const GROWTH_MIN_VISITORS = 50;

export interface BasicTeaserStats {
  kind: "basic_teaser";
  periodLabel: string;
  own: {
    cardViews: number;
    filterMatches: number;
    industryPages: number;
  };
  market: {
    visitors30: number;
    visitorsPrev30: number;
    visitors90: number;
    sessions30: number;
    growthPct: number | null;
    avgTimeOnSiteSec: number;
    pagesVisited30: number;
    pagesVisited90: number;
    profileViews90: number;
    engagedSharePct: number;
    partnersListed: number;
    resourcesCount: number;
  };
  /** Median bland partnerverifierade profiler (tidigare medelvärde). */
  verifiedMedian: {
    exposures: number;
    profileVisits: number;
    partners: number;
  };
  demand?: DemandStats;
}


const SITE_ORIGIN = "https://www.d365.se";
const UTM = "?utm_source=basic-teaser&utm_medium=email&utm_campaign=partnerprogram";

export const DEFAULT_TEASER_BENEFITS = [
  "Kontaktperson, e-post och telefon direkt på profilen",
  "Kundcase, verifierade kompetenser och AI-profil",
  "Med i partnerjämförelsen och partnerväljaren",
  "Får förmedlade underlag från behovsanalyser och kravspecifikationer",
  "Egen månadsrapport med full statistik varje månad",
].join("\n");

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function nf(n: number): string {
  return new Intl.NumberFormat("sv-SE").format(Math.round(n));
}

function formatDuration(sec: number): string {
  if (!sec || sec <= 0) return "–";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  if (m === 0) return `${s} sek`;
  return `${m} min ${String(s).padStart(2, "0")} sek`;
}

/** Bygger statistiken för en Basic-partner för en given period (YYYY-MM-DD). */
export async function buildBasicTeaserStats(
  supabase: any,
  partnerSlug: string,
  start: string,
  end: string,
  periodLabel: string,
): Promise<BasicTeaserStats> {
  const startIso = `${start}T00:00:00Z`;
  const endIso = `${end}T23:59:59Z`;
  // 90-dagarsfönster som slutar samma dag som perioden
  const endDate = new Date(`${end}T00:00:00Z`);
  const start90 = new Date(endDate.getTime() - 89 * 24 * 3600 * 1000);
  const start90Iso = `${start90.toISOString().slice(0, 10)}T00:00:00Z`;

  const [engagement, exposures, marketStatsRes, engagementStatsRes, partnersCountRes, resourcesRes, verified] = await Promise.all([
    supabase.from("partner_engagement_events")
      .select("page_path, event_level")
      .eq("partner_slug", partnerSlug)
      .gte("occurred_at", startIso).lte("occurred_at", endIso).limit(50000),
    supabase.from("partner_filter_exposures")
      .select("page_path")
      .eq("partner_slug", partnerSlug)
      .gte("viewed_at", startIso).lte("viewed_at", endIso).limit(50000),
    // Marknadssiffror aggregeras i databasen (API:t returnerar max 1000 rader per anrop,
    // vilket tidigare gav avkortade och missvisande 30/90-dagarsvärden).
    supabase.rpc("teaser_market_stats", { start30: startIso, start90: start90Iso, end_ts: endIso }),
    supabase.rpc("teaser_engagement_stats", { start_ts: start90Iso, end_ts: endIso }),
    supabase.from("partners").select("id", { count: "exact", head: true }),
    // Kunskapsresurser: videoguider + partnernyheter + publicerade branschsidor
    Promise.all([
      supabase.from("d365_videos").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("partner_news").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("industry_pages").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("knowledge_articles").select("id", { count: "exact", head: true }).eq("is_published", true),
    ]),
    buildVerifiedAverage(supabase, startIso, endIso),
  ]);
  const marketStats = (marketStatsRes.data || [])[0] || {};
  const engagementStats = (engagementStatsRes.data || [])[0] || {};
  const resourcesCount = (resourcesRes || []).reduce((sum: number, r: any) => sum + (r?.count || 0), 0);

  // Egna siffror
  const engRows = engagement.data || [];
  const industrySlugs = new Set<string>();
  let cardViews = 0;
  for (const r of engRows) {
    cardViews++;
    const p = String(r.page_path || "").toLowerCase();
    if (p.startsWith("/branscher")) {
      const s = p.replace(/^\/branscher\/?/, "").replace(/[/?#].*$/, "");
      if (s) industrySlugs.add(s);
    }
  }

  // Marknadssiffror hämtas färdigaggregerade från databasfunktionerna ovan
  const num = (v: unknown): number => (Number.isFinite(Number(v)) ? Number(v) : 0);

  return {
    kind: "basic_teaser",
    periodLabel,
    own: {
      cardViews,
      filterMatches: (exposures.data || []).length,
      industryPages: industrySlugs.size,
    },
    market: {
      visitors30: num(marketStats.visitors30),
      visitors90: num(marketStats.visitors90),
      avgTimeOnSiteSec: num(marketStats.avg_time_sec),
      pagesVisited30: num(marketStats.pages30),
      pagesVisited90: num(marketStats.pages90),
      profileViews90: num(engagementStats.profile_views),
      engagedSharePct: num(engagementStats.engaged_share_pct),
      partnersListed: partnersCountRes?.count || 0,
      resourcesCount,
    },
    verifiedAverage: verified,
  };
}

async function buildVerifiedAverage(supabase: any, startIso: string, endIso: string) {
  const { data: verifiedPartners } = await supabase
    .from("partners")
    .select("slug")
    .eq("is_featured", true)
    .not("published_at", "is", null);
  const slugs = new Set<string>((verifiedPartners || []).map((p: any) => p.slug));
  if (slugs.size === 0) return { exposures: 0, profileVisits: 0, partners: 0 };

  const [exp, views] = await Promise.all([
    supabase.from("partner_filter_exposures").select("partner_slug")
      .gte("viewed_at", startIso).lte("viewed_at", endIso).limit(100000),
    supabase.from("partner_profile_views").select("partner_slug, view_type")
      .gte("viewed_at", startIso).lte("viewed_at", endIso).limit(100000),
  ]);

  let exposures = 0;
  for (const r of exp.data || []) if (slugs.has(r.partner_slug)) exposures++;
  let profileVisits = 0;
  for (const r of views.data || []) {
    if (r.view_type === "profile_visit" && slugs.has(r.partner_slug)) profileVisits++;
  }

  return {
    exposures: Math.round(exposures / slugs.size),
    profileVisits: Math.round(profileVisits / slugs.size),
    partners: slugs.size,
  };
}

// ─────────────────────────── HTML ───────────────────────────

function statRow(label: string, value: number | string, hint?: string): string {
  const shown = typeof value === "string" ? value : (value > 0 ? nf(value) : "–");
  return `
  <tr>
    <td class="cell" style="padding:11px 14px;border-bottom:1px solid #eef2f7;font-size:14px;color:#334155">
      ${esc(label)}${hint ? `<div style="font-size:12px;color:#94a3b8;margin-top:2px">${esc(hint)}</div>` : ""}
    </td>
    <td class="cell" style="padding:11px 14px;border-bottom:1px solid #eef2f7;font-size:16px;font-weight:700;color:#0f172a;text-align:right;white-space:nowrap">${shown}</td>
  </tr>`;
}

function sectionTitle(text: string): string {
  return `<h2 style="margin:26px 0 10px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#B23D19;font-weight:700">${esc(text)}</h2>`;
}

export function renderBasicTeaserHtml(opts: {
  partnerName: string;
  partnerSlug: string;
  intro: string;
  benefits: string[];
  stats: BasicTeaserStats;
  contactEmail: string;
  contactName: string;
}): string {
  const { partnerName, partnerSlug, intro, benefits, stats, contactEmail, contactName } = opts;
  const s = stats;
  const m = s.market || ({} as BasicTeaserStats["market"]);
  const noExposure = s.own.cardViews === 0 && s.own.filterMatches === 0;
  const profileUrl = `${SITE_ORIGIN}/basic/${encodeURIComponent(partnerSlug)}${UTM}`;

  const benefitList = benefits.filter(Boolean).map((b) => `
    <li style="margin:7px 0;font-size:14px;color:#334155;line-height:1.55">${esc(b)}</li>`).join("");

  return `<!DOCTYPE html>
<html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><title>Månadsöversikt ${esc(partnerName)}</title>
<style>
  img{max-width:100%}
  a{word-break:break-word}
  @media only screen and (max-width:600px){
    .wrap{padding:12px 8px !important}
    .hd{padding:22px 18px 18px !important}
    .hd h1{font-size:21px !important}
    .pad{padding:20px 18px !important}
    .cell{padding:10px 10px !important;font-size:13px !important}
    .btn{display:block !important;width:100% !important;box-sizing:border-box;text-align:center}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a">
  <div class="wrap" style="max-width:640px;margin:0 auto;padding:24px 16px">

    <div class="hd" style="background:#15130F;color:#ffffff;padding:30px 28px 26px;border-radius:14px 14px 0 0">
      <div style="font-size:12px;color:#F0A88C;letter-spacing:1.4px;text-transform:uppercase;font-weight:700">D365.se · Månadsöversikt</div>
      <h1 style="margin:10px 0 6px;font-size:25px;line-height:1.2;color:#ffffff;font-weight:700">${esc(partnerName)}</h1>
      <div style="font-size:14px;color:#E7E3DC">Period: ${esc(s.periodLabel)}</div>
    </div>
    <div style="height:4px;background:#B23D19;line-height:4px;font-size:0">&nbsp;</div>

    <div class="pad" style="background:#ffffff;padding:28px;border-radius:0 0 14px 14px;box-shadow:0 1px 3px rgba(15,23,42,0.06)">

      <p style="margin:0 0 6px;color:#2A2724;font-size:16px;line-height:1.65">${esc(intro)}</p>

      ${sectionTitle("Era siffror")}
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
        ${statRow("Visningar av er profilrad", s.own.cardViews)}
        ${statRow("Sökningar där ni matchade filtren", s.own.filterMatches)}
        ${statRow("Branschsidor där ni listades", s.own.industryPages)}
      </table>
      ${noExposure ? `
      <p style="margin:10px 0 0;font-size:13px;color:#64748b;line-height:1.6">
        Er profil är i dag en <strong>grundprofil</strong> byggd på offentliga uppgifter. Den visas bara i ett fåtal ytor på sajten
        och saknar kontaktuppgifter, kundcase och kompetenser – därför blir exponeringen begränsad.
      </p>` : `
      <p style="margin:10px 0 0;font-size:13px;color:#64748b;line-height:1.6">
        Siffrorna gäller er grundprofil, som bygger på offentliga uppgifter och visas i ett begränsat antal ytor på sajten.
      </p>`}

      ${sectionTitle("Så ser marknaden ut på d365.se")}
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
        ${statRow("Besökare senaste 30 dagarna", m.visitors30 || 0)}
        ${statRow("Besökare senaste 90 dagarna", m.visitors90 || 0)}
        ${statRow("Besökta sidor senaste 30 dagarna", m.pagesVisited30 || 0)}
        ${statRow("Besökta sidor senaste 90 dagarna", m.pagesVisited90 || 0)}
        ${statRow("Snittid på sajten", formatDuration(m.avgTimeOnSiteSec || 0), "Genomsnittlig tid per sidvisning")}
        ${statRow("Partnerprofiler visade senaste 90 dagarna", m.profileViews90 || 0, "Besökare som öppnat en partners profilsida")}
        ${statRow("Besökare som läser vidare", m.engagedSharePct > 0 ? `${String(m.engagedSharePct).replace(".", ",")} %` : "–", "Andel sidvisningar där besökaren stannar och engagerar sig")}
        ${statRow("Profilerade Dynamics 365-partners", m.partnersListed || 0)}
        ${statRow("Guider, videos & nyheter i arkivet", m.resourcesCount || 0)}
      </table>

      ${sectionTitle("Det här missar ni i dag")}
      <div style="background:#F4FAF8;border:1px solid #BFE0D8;border-radius:10px;padding:16px 18px">
        <ul style="margin:0;padding-left:20px">${benefitList}</ul>
        ${s.verifiedAverage.partners > 0 ? `
        <div style="margin-top:14px;padding-top:12px;border-top:1px dashed #BFE0D8;font-size:13px;color:#0F4F44;line-height:1.6">
          <strong>Jämförelse:</strong> en verifierad partner hade i snitt
          <strong>${nf(s.verifiedAverage.exposures)}</strong> exponeringar och
          <strong>${nf(s.verifiedAverage.profileVisits)}</strong> profilbesök under perioden
          (snitt av ${s.verifiedAverage.partners} verifierade partners).
        </div>` : ""}
      </div>

      <div style="text-align:center;margin:26px 0 6px">
        <a class="btn" href="${profileUrl}" style="display:inline-block;background:#B23D19;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-weight:600;font-size:14px">
          Se er profil här – i jämförelse med andra partners →
        </a>
      </div>
      <p style="margin:8px 0 0;text-align:center;font-size:12px;color:#94a3b8">
        <a href="${profileUrl}" style="color:#94a3b8">d365.se/basic/${esc(partnerSlug)}</a>
        &nbsp;·&nbsp;
        <a href="${SITE_ORIGIN}/partnerprogram${UTM}" style="color:#94a3b8">Partnerprogrammet och priser</a>
      </p>

      <div style="margin:26px 0 0;padding:16px 18px;background:#f8fafc;border-left:4px solid #B23D19;border-radius:6px">
        <div style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px">Vill du se hur er profil ser ut i dag?</div>
        <div style="color:#475569;font-size:13px;line-height:1.6">
          Svara på det här mejlet så går vi igenom profilen tillsammans och visar vad en verifierad profil skulle innebära för er.
        </div>
      </div>

      <div style="margin:24px 0 0;padding-top:18px;border-top:1px solid #e2e8f0;font-size:13px;color:#64748b;line-height:1.6">
        ${esc(contactName)}<br>
        <a href="mailto:${esc(contactEmail)}" style="color:#B23D19;text-decoration:none">${esc(contactEmail)}</a><br>
        <a href="${SITE_ORIGIN}" style="color:#94a3b8;text-decoration:none">d365.se</a>
      </div>

    </div>
  </div>
</body></html>`;
}
