import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_PASSWORD = Deno.env.get("PARTNER_ADMIN_PASSWORD") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function b64urlToBytes(str: string): Uint8Array {
  let b = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  const bin = atob(b);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function verifyAdminJWT(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", enc.encode(SERVICE_ROLE),
      { name: "HMAC", hash: "SHA-256" }, false, ["verify"],
    );
    const ok = await crypto.subtle.verify("HMAC", key, b64urlToBytes(s) as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return false;
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return false;
    return payload.role === "admin";
  } catch { return false; }
}

function esc(s: any): string {
  if (s == null) return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Render simple markdown-lite bullet list from a text block.
// Lines starting with "- " or "* " become <li>; blank lines break lists; other lines become <p>.
function renderRichText(raw: string): string {
  if (!raw) return "";
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let inList = false;
  const flushList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    if (bullet) {
      if (!inList) {
        out.push('<ul style="margin:6px 0 12px 0;padding-left:20px;color:#334155;font-size:14px;line-height:1.6">');
        inList = true;
      }
      out.push(`<li style="margin:4px 0">${esc(bullet[1])}</li>`);
    } else {
      flushList();
      out.push(`<p style="margin:6px 0;color:#334155;font-size:14px;line-height:1.6">${esc(line)}</p>`);
    }
  }
  flushList();
  return out.join("");
}

function fmtIso(iso: string) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date(iso)).replace(/-/g, "/");
}

function stockholmDateStart(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const probe = new Date(Date.UTC(year, month - 1, day, 12));
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(probe);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const representedUtc = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(values.hour), Number(values.minute), Number(values.second));
  return new Date(Date.UTC(year, month - 1, day) - (representedUtc - probe.getTime()));
}

function bucketReferrer(ref: string | null, firstUrl?: string | null): string | null {
  if (ref) {
    try {
      const u = new URL(ref);
      const h = u.hostname.replace(/^www\./, "");
      if (h.includes("google") || h.includes("bing") || h.includes("duckduckgo") || h.includes("yahoo")) return "Organiskt sök";
      if (h.includes("linkedin")) return "LinkedIn";
      if (h.includes("facebook") || h.includes("instagram")) return "Sociala medier";
      if (h.includes("d365.se")) {
        // fall through – treat internal as based on landing page
      } else if (!h.includes("lovable")) {
        return h;
      }
    } catch { /* ignore */ }
  }
  if (firstUrl) {
    const u = firstUrl.toLowerCase();
    if (u.includes("/jamfor-partners")) return "Jämförelsevyn";
    if (u.includes("/branscher")) return "Branschguide";
    if (u.includes("/behovsanalys") || u.includes("/erpbehovsanalys") || u.includes("/crmbehovsanalys")) return "Behovsanalys";
    if (u.includes("/valjdynamics365partner") || u.includes("/valj")) return "Välj partner-guiden";
  }
  return "Direktlänk / okänt";
}

interface PeriodStats {
  profileVisits: number;
  compareViews: number;
  industryListingViews: number;
}

interface PartnerStats {
  partner: any;
  current: PeriodStats;
  previous: PeriodStats;
  identifiedCompanies: number;
  industryBreakdown: { industry: string; count: number }[];
  activeEvaluators: number;
  topEntryPath: string | null;
  industryPagesListed: { slug: string; name: string; views: number }[];
  partnerNews: { title: string; date: string; url: string | null }[];
  engagement: EngagementStats;
  previousEngagement: EngagementStats;
  market: MarketContext;
  trend: TrendPoint[];
  coverage: CoverageInfo;
}

interface CoverageInfo {
  complete: boolean;
  warnings: string[];
  performanceStart: string | null;
}

const FULL_SURFACE_TRACKING_START = "2026-08-27T00:00:00.000Z";

/** Partner Performance – aggregerade nivåer från partner_engagement_events. */
interface EngagementStats {
  exposures: number;
  engagements: number;
  buyingSignals: number;
  leads: number;
  uniqueVisitors: number;
  topSurfaces: { label: string; count: number }[];
  intentTracks: { label: string; count: number }[];
}

const SURFACE_LABELS: { test: RegExp; label: string }[] = [
  { test: /^\/branscher\//, label: "Branschsidor" },
  { test: /^\/branscher/, label: "Branschöversikt" },
  { test: /^\/jamfor-partners/, label: "Jämförelsevyn" },
  { test: /^\/alla-d365-partners/, label: "Partnerkatalogen" },
  { test: /^\/partner\//, label: "Partnerprofilen" },
  { test: /^\/(behovsanalys|erpbehovsanalys|crmbehovsanalys)/, label: "Behovsanalys" },
  { test: /^\/kravspecifikation/, label: "Kravspecifikation" },
  { test: /^\/(businesscentral|erp|affarssystem|crm|finance|copilot)/, label: "Produktsidor" },
  { test: /^\/$/, label: "Startsidan" },
];

function labelForPath(path: string | null): string {
  const p = (path || "").toLowerCase();
  if (!p) return "Övrigt";
  for (const s of SURFACE_LABELS) if (s.test.test(p)) return s.label;
  return "Övriga sidor";
}

const INTENT_LABELS: Record<string, string> = { erp: "ERP", crm: "CRM", ai: "AI & Copilot" };

async function fetchEngagement(supabase: any, partner: any, startIso: string, endIso: string): Promise<EngagementStats> {
  const { data } = await supabase
    .from("partner_engagement_events")
    .select("event_level, page_path, visitor_id, intent_track")
    .eq("partner_slug", partner.slug)
    .gte("occurred_at", startIso)
    .lt("occurred_at", endIso)
    .limit(20000);

  const rows = data || [];
  const visitors = new Set<string>();
  const surfaces = new Map<string, number>();
  const intents = new Map<string, number>();
  let exposures = 0, engagements = 0, buyingSignals = 0, leads = 0;

  for (const r of rows) {
    const lvl = Number(r.event_level || 0);
    if (lvl === 1) exposures++;
    else if (lvl === 2) engagements++;
    else if (lvl === 3) buyingSignals++;
    else if (lvl >= 4) leads++;
    if (r.visitor_id) visitors.add(r.visitor_id);
    const label = labelForPath(r.page_path);
    surfaces.set(label, (surfaces.get(label) || 0) + 1);
    if (r.intent_track) {
      const il = INTENT_LABELS[r.intent_track] || r.intent_track;
      intents.set(il, (intents.get(il) || 0) + 1);
    }
  }

  return {
    exposures,
    engagements,
    buyingSignals,
    leads,
    uniqueVisitors: visitors.size,
    topSurfaces: Array.from(surfaces.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    intentTracks: Array.from(intents.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3),
  };
}

async function fetchCoverage(supabase: any, partner: any, startIso: string, endIso: string): Promise<CoverageInfo> {
  const { data } = await supabase.from("partner_engagement_events").select("occurred_at")
    .eq("partner_slug", partner.slug).gte("occurred_at", startIso).lt("occurred_at", endIso)
    .order("occurred_at", { ascending: true }).limit(1);
  const complete = startIso >= FULL_SURFACE_TRACKING_START;
  const warnings = complete ? [] : [
    "Exponeringar på alla publika partnerytor blev fullt instrumenterade först 2026/08/27. Profilvisningar, klick och äldre filterexponeringar gäller hela den valda perioden, medan Partner Performance-exponeringar bara avser den uppmätta delen. Saknade historiska kortvisningar har inte uppskattats.",
  ];
  return { complete, warnings, performanceStart: data?.[0]?.occurred_at ?? null };
}

async function fetchPeriod(supabase: any, partner: any, startIso: string, endIso: string): Promise<PeriodStats> {
  const [viewsRes, exposureRes] = await Promise.all([
    supabase
      .from("partner_profile_views")
      .select("view_type")
      .eq("partner_slug", partner.slug)
      .gte("viewed_at", startIso)
      .lt("viewed_at", endIso),
    supabase
      .from("partner_filter_exposures")
      .select("page_path, filter_context")
      .eq("partner_slug", partner.slug)
      .gte("viewed_at", startIso)
      .lt("viewed_at", endIso),
  ]);

  const views = viewsRes.data || [];
  const profileVisits = views.filter((v: any) => v.view_type === "profile_visit").length;

  const exposures = exposureRes.data || [];
  let compareViews = 0;
  let industryListingViews = 0;
  for (const e of exposures) {
    const p = (e.page_path || "").toLowerCase();
    if (p.startsWith("/jamfor-partners")) compareViews++;
    else if (p.startsWith("/branscher")) industryListingViews++;
  }

  // Branschsidor loggar exponeringar i partner_engagement_events, inte i
  // partner_filter_exposures – räkna med dem också.
  const { data: impressionRows } = await supabase
    .from("partner_engagement_events")
    .select("page_path")
    .eq("partner_slug", partner.slug)
    .eq("event_level", 1)
    .gte("occurred_at", startIso)
    .lt("occurred_at", endIso)
    .limit(50000);
  for (const r of impressionRows || []) {
    const p = String(r.page_path || "").toLowerCase();
    if (p.startsWith("/branscher")) industryListingViews++;
  }


  return {
    profileVisits,
    compareViews,
    industryListingViews,
  };
}

async function fetchIdentifiedCompanies(supabase: any, partner: any, startIso: string, endIso: string) {
  const profilePath = `/partner/${partner.slug}`;
  const { data } = await supabase
    .from("snitcher_visits")
    .select("company_name, company_industry, partner_slugs, visited_urls")
    .gte("session_started_at", startIso)
    .lt("session_started_at", endIso)
    .limit(3000);

  const companies = new Map<string, { industry: string | null; visitedTools: boolean }>();
  for (const r of data || []) {
    const partnerSlugs: string[] = Array.isArray(r.partner_slugs) ? r.partner_slugs : [];
    const urls: string[] = Array.isArray(r.visited_urls)
      ? r.visited_urls.map((u: any) => (typeof u === "string" ? u : u?.url || u?.path || "")).filter(Boolean)
      : [];
    const matched = partnerSlugs.includes(partner.slug) || urls.some((u) => u.includes(profilePath));
    if (!matched) continue;
    const key = (r.company_name || "").trim().toLowerCase();
    if (!key) continue;
    const visitedTools = urls.some((u) => {
      const s = u.toLowerCase();
      return s.includes("/behovsanalys") || s.includes("/erpbehovsanalys") || s.includes("/crmbehovsanalys")
        || s.includes("/kravspecifikation") || s.includes("/jamfor-partners");
    });
    const existing = companies.get(key);
    if (existing) {
      existing.visitedTools = existing.visitedTools || visitedTools;
    } else {
      companies.set(key, { industry: (r.company_industry || "").trim() || null, visitedTools });
    }
  }

  const industryMap = new Map<string, number>();
  let activeEvaluators = 0;
  for (const c of companies.values()) {
    if (c.industry) industryMap.set(c.industry, (industryMap.get(c.industry) || 0) + 1);
    if (c.visitedTools) activeEvaluators++;
  }
  const industryBreakdown = Array.from(industryMap.entries())
    .map(([industry, count]) => ({ industry, count }))
    .sort((a, b) => b.count - a.count);

  return { identifiedCompanies: companies.size, industryBreakdown, activeEvaluators };
}

async function fetchTopEntryPath(supabase: any, partner: any, startIso: string, endIso: string): Promise<string | null> {
  const { data } = await supabase
    .from("partner_profile_views")
    .select("referrer, page_source")
    .eq("partner_slug", partner.slug)
    .gte("viewed_at", startIso)
    .lt("viewed_at", endIso)
    .limit(2000);
  if (!data?.length) return null;
  const map = new Map<string, number>();
  for (const v of data) {
    const b = bucketReferrer(v.referrer, v.page_source);
    if (!b) continue;
    map.set(b, (map.get(b) || 0) + 1);
  }
  const top = Array.from(map.entries()).sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : null;
}

async function fetchIndustryPagesListed(supabase: any, partner: any, startIso: string, endIso: string) {
  const { data: exposures } = await supabase
    .from("partner_filter_exposures")
    .select("page_path")
    .eq("partner_slug", partner.slug)
    .gte("viewed_at", startIso)
    .lt("viewed_at", endIso);
  const bySlug = new Map<string, number>();
  for (const e of exposures || []) {
    const p: string = e.page_path || "";
    if (!p.startsWith("/branscher/")) continue;
    const slug = p.replace(/^\/branscher\//, "").replace(/\/.*$/, "").replace(/[?#].*$/, "");
    if (!slug) continue;
    bySlug.set(slug, (bySlug.get(slug) || 0) + 1);
  }
  if (bySlug.size === 0) return [];
  const slugs = Array.from(bySlug.keys());
  const { data: pages } = await supabase
    .from("industry_pages")
    .select("slug, name")
    .in("slug", slugs);
  const nameMap = new Map<string, string>((pages || []).map((p: any) => [p.slug, p.name]));
  return slugs
    .map((slug) => ({ slug, name: nameMap.get(slug) || slug, views: bySlug.get(slug) || 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);
}

async function fetchPartnerNews(supabase: any, partner: any, startIso: string, endIso: string) {
  const { data } = await supabase
    .from("partner_news")
    .select("id, editorial_title, published_at, news_date, source_url, status")
    .eq("partner_id", partner.id)
    .eq("status", "published")
    .gte("published_at", startIso)
    .lt("published_at", endIso)
    .order("published_at", { ascending: false })
    .limit(10);
  return (data || []).map((n: any) => ({
    title: n.editorial_title || "(namnlös)",
    date: (n.published_at || n.news_date || "").slice(0, 10),
    url: `https://www.d365.se/partnernytt/artikel/${n.id}`,
  }));
}

/** Marknadskontext – sajtens totala aktivitet under perioden (samma för alla partners). */
interface MarketContext {
  siteVisitors: number;
  sitePageViews: number;
  assessments: number;
  totalExposures: number;
  aiSearches: number;
  aiChatSessions: number;
  aiUsers: number;
  aiBotHits: number;
  aiBotNames: string[];
}

const marketCache = new Map<string, MarketContext>();

/** AI-drivna sökvägar: interna AI-verktyg (chatbot, smart sök, AI-jämförelse) samt externa AI-botars crawl. */
const AI_SEARCH_ENDPOINTS = ["smart-search", "ai-chat", "compare-partners-insights", "match-partners", "generate-requirements"];
const AI_BOT_MATCH = ["gptbot", "claude", "perplexity", "meta ai", "gemini", "applebot", "amazonbot", "bytespider", "youbot", "ccbot"];

async function fetchMarketContext(supabase: any, startIso: string, endIso: string): Promise<MarketContext> {
  const key = `${startIso}|${endIso}`;
  const cached = marketCache.get(key);
  if (cached) return cached;

  const [visitsRes, assessRes, expRes, aiRes, botRes] = await Promise.all([
    supabase
      .from("visitor_analytics")
      .select("session_id")
      .gte("visited_at", startIso)
      .lt("visited_at", endIso)
      .limit(50000),
    supabase
      .from("assessments")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startIso)
      .lt("created_at", endIso),
    supabase
      .from("partner_engagement_events")
      .select("partner_slug")
      .eq("event_level", 1)
      .gte("occurred_at", startIso)
      .lt("occurred_at", endIso)
      .limit(100000),
    supabase
      .from("ai_usage_log")
      .select("endpoint, ip_hash")
      .gte("created_at", startIso)
      .lt("created_at", endIso)
      .limit(50000),
    supabase
      .from("crawler_hits")
      .select("bot_label")
      .gte("hit_at", startIso)
      .lt("hit_at", endIso)
      .limit(50000),
  ]);

  const visits = visitsRes.data || [];
  const sessions = new Set<string>();
  for (const v of visits) if (v.session_id) sessions.add(v.session_id);

  const aiRows = (aiRes.data || []).filter((r: any) => AI_SEARCH_ENDPOINTS.includes(r.endpoint));
  const aiUsers = new Set<string>();
  for (const r of aiRows) if (r.ip_hash) aiUsers.add(r.ip_hash);

  const botRows = (botRes.data || []).filter((r: any) =>
    AI_BOT_MATCH.some((m) => String(r.bot_label || "").toLowerCase().includes(m)),
  );
  const botNames = Array.from(new Set(botRows.map((r: any) => String(r.bot_label))));

  const ctx: MarketContext = {
    siteVisitors: sessions.size,
    sitePageViews: visits.length,
    assessments: assessRes.count || 0,
    totalExposures: (expRes.data || []).length,
    aiSearches: aiRows.length,
    aiChatSessions: aiRows.filter((r: any) => r.endpoint === "ai-chat").length,
    aiUsers: aiUsers.size,
    aiBotHits: botRows.length,
    aiBotNames: botNames.slice(0, 6),
  };
  marketCache.set(key, ctx);
  return ctx;
}

/** Rullande 3-månaderstrend på exponeringar och engagemang. */
interface TrendPoint {
  label: string;
  exposures: number;
  engagements: number;
  buyingSignals: number;
}

const MONTH_NAMES = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

async function fetchTrend(supabase: any, partner: any, currentEnd: string): Promise<TrendPoint[]> {
  const end = new Date(currentEnd);
  const points: TrendPoint[] = [];
  for (let i = 2; i >= 0; i--) {
    const monthEnd = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - i, 1));
    const monthStart = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - i - 1, 1));
    const e = await fetchEngagement(supabase, partner, monthStart.toISOString(), monthEnd.toISOString());
    points.push({
      label: `${MONTH_NAMES[monthStart.getUTCMonth()]} ${monthStart.getUTCFullYear()}`,
      exposures: e.exposures,
      engagements: e.engagements,
      buyingSignals: e.buyingSignals,
    });
  }
  return points;
}

async function fetchSiteSettings(supabase: any) {
  const keys = ["monthly_report_changelog", "monthly_report_next_period", "monthly_report_contact", "monthly_report_video_interview_cta"];
  const { data } = await supabase.from("site_settings").select("key, value").in("key", keys);
  const map = new Map<string, string>();
  for (const r of data || []) map.set(r.key, r.value || "");
  return {
    changelog: map.get("monthly_report_changelog") || "",
    nextPeriod: map.get("monthly_report_next_period") || "",
    contact: map.get("monthly_report_contact") || "",
    videoInterviewCta: map.get("monthly_report_video_interview_cta") || "",
  };
}

async function buildStats(supabase: any, partner: any, currentStart: string, currentEnd: string, previousStart: string, previousEnd: string): Promise<PartnerStats> {
  const [current, previous, ident, entryPath, industryPagesListed, partnerNews, engagement, previousEngagement, market, trend, coverage] = await Promise.all([
    fetchPeriod(supabase, partner, currentStart, currentEnd),
    fetchPeriod(supabase, partner, previousStart, previousEnd),
    fetchIdentifiedCompanies(supabase, partner, currentStart, currentEnd),
    fetchTopEntryPath(supabase, partner, currentStart, currentEnd),
    fetchIndustryPagesListed(supabase, partner, currentStart, currentEnd),
    fetchPartnerNews(supabase, partner, currentStart, currentEnd),
    fetchEngagement(supabase, partner, currentStart, currentEnd),
    fetchEngagement(supabase, partner, previousStart, previousEnd),
    fetchMarketContext(supabase, currentStart, currentEnd),
    fetchTrend(supabase, partner, currentEnd),
    fetchCoverage(supabase, partner, currentStart, currentEnd),
  ]);
  return {
    partner,
    current,
    previous,
    identifiedCompanies: ident.identifiedCompanies,
    industryBreakdown: ident.industryBreakdown,
    activeEvaluators: ident.activeEvaluators,
    topEntryPath: entryPath,
    industryPagesListed,
    partnerNews,
    engagement,
    previousEngagement,
    market,
    trend,
    coverage,
  };
}

function delta(current: number, previous: number): string {
  if (previous === 0 && current === 0) return `<span style="color:#94a3b8">–</span>`;
  if (previous === 0) return `<span style="color:#16a34a">Nytt</span>`;
  const diff = current - previous;
  const pct = Math.round((diff / previous) * 100);
  if (pct === 0) return `<span style="color:#94a3b8">±0%</span>`;
  const color = pct > 0 ? "#16a34a" : "#dc2626";
  const arrow = pct > 0 ? "▲" : "▼";
  return `<span style="color:${color};font-weight:600">${arrow} ${pct > 0 ? "+" : ""}${pct}%</span>`;
}

function buildHtml(stats: PartnerStats, currentLabel: string, previousLabel: string, settings: { changelog: string; nextPeriod: string; contact: string; videoInterviewCta: string }, reportLabel = "Månadsrapport"): string {
  const { partner, current, previous, identifiedCompanies, industryBreakdown, activeEvaluators, topEntryPath, industryPagesListed, partnerNews, engagement, previousEngagement, market, trend, coverage } = stats;
  const profileUrl = `https://www.d365.se/partner/${partner.slug}`;

  const statRow = (label: string, cur: number, prev: number) => `
    <tr>
      <td style="padding:12px 14px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:14px;font-weight:600">${esc(label)}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:14px;text-align:right;font-weight:700">${cur}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #eef0f3;color:#64748b;font-size:14px;text-align:right">${prev}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #eef0f3;font-size:13px;text-align:right;white-space:nowrap">${delta(cur, prev)}</td>
    </tr>`;

  // "Vilka tittade" bullets
  const bullets: string[] = [];
  if (identifiedCompanies > 0) {
    const top2 = industryBreakdown.slice(0, 2);
    const industryStr = top2.length
      ? `, varav ${top2.map((b) => `${b.count} inom ${esc(b.industry)}`).join(" och ")}`
      : "";
    bullets.push(`<strong>${identifiedCompanies}</strong> identifierade företag besökte er profil${industryStr}.`);
    if (activeEvaluators > 0) {
      bullets.push(`<strong>${activeEvaluators}</strong> av dessa besökte även behovsanalysen, kravspecifikationen eller jämförelsevyn – vilket brukar indikera aktiv utvärdering.`);
    }
  } else {
    bullets.push(`Under perioden kunde inga företag identifieras bland besökarna på er profil. Det är inte ovanligt – mobil- och privattrafik förblir anonym.`);
  }
  if (topEntryPath) {
    bullets.push(`Vanligaste vägen in till er profil: <strong>${esc(topEntryPath)}</strong>.`);
  }
  const bulletsHtml = bullets.map((b) => `<li style="margin:6px 0;line-height:1.55">${b}</li>`).join("");

  // "Var ni syntes"
  const industryRows = industryPagesListed
    .map((p) => `<li style="margin:4px 0;line-height:1.55">Branschguiden för <strong>${esc(p.name)}</strong> – ${p.views} visningar med ert kort under perioden.</li>`)
    .join("");
  const newsRows = partnerNews
    .map((n) => `<li style="margin:4px 0;line-height:1.55">Partnernytt ${esc(n.date)}: <a href="${esc(n.url)}" style="color:#0f1f3d">${esc(n.title)}</a></li>`)
    .join("");
  const visibilityHtml = (industryRows || newsRows)
    ? `<ul style="margin:6px 0 0 0;padding-left:20px;color:#334155;font-size:14px">${industryRows}${newsRows}</ul>`
    : `<p style="margin:6px 0 0 0;color:#64748b;font-size:14px">Inga redaktionella exponeringar under perioden.</p>`;

  // Partner Performance – nivåerna från engagemangsspårningen.
  const perfRow = (label: string, help: string, cur: number, prev: number) => `
    <tr>
      <td style="padding:12px 14px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:14px">
        <strong>${esc(label)}</strong><br>
        <span style="color:#64748b;font-size:12px">${esc(help)}</span>
      </td>
      <td style="padding:12px 14px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:15px;text-align:right;font-weight:700">${cur}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #eef0f3;color:#64748b;font-size:14px;text-align:right">${prev}</td>
      <td style="padding:12px 14px;border-bottom:1px solid #eef0f3;font-size:13px;text-align:right;white-space:nowrap">${delta(cur, prev)}</td>
    </tr>`;

  const perfTotal = engagement.exposures + engagement.engagements + engagement.buyingSignals + engagement.leads;
  const surfacesHtml = engagement.topSurfaces.length
    ? `<ul style="margin:10px 0 0 0;padding-left:20px;color:#334155;font-size:14px">${engagement.topSurfaces
        .map((s) => `<li style="margin:4px 0;line-height:1.55">${esc(s.label)} – ${s.count} registrerade visningar/interaktioner</li>`)
        .join("")}</ul>`
    : "";
  const intentHtml = engagement.intentTracks.length
    ? `<p style="margin:10px 0 0;color:#334155;font-size:14px;line-height:1.55">Vanligaste köpspår bland besökarna: ${engagement.intentTracks
        .map((i) => `<strong>${esc(i.label)}</strong> (${i.count})`)
        .join(", ")}.</p>`
    : "";

  const performanceHtml = perfTotal === 0
    ? `<p style="margin:6px 0 0;color:#64748b;font-size:14px;line-height:1.55">Inga registrerade exponeringar eller interaktioner under perioden.</p>`
    : `
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
        <thead>
          <tr style="background:#f8fafc">
            <th style="padding:10px 14px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Nivå</th>
            <th style="padding:10px 14px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Denna period</th>
            <th style="padding:10px 14px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Föregående</th>
            <th style="padding:10px 14px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Utveckling</th>
          </tr>
        </thead>
        <tbody>
          ${perfRow("Exponeringar", "Ert kort visades i listor, filter, branschsidor och jämförelser", engagement.exposures, previousEngagement.exposures)}
          ${perfRow("Engagemang", "Besökaren öppnade profilen eller klickade vidare i den", engagement.engagements, previousEngagement.engagements)}
          ${perfRow("Köpsignaler", "Besökaren sparade, jämförde eller matchade er i en pågående utvärdering", engagement.buyingSignals, previousEngagement.buyingSignals)}
          ${perfRow("Kontaktförfrågningar", "Besökaren lämnade uppgifter eller bad om kontakt", engagement.leads, previousEngagement.leads)}
        </tbody>
      </table>
      <p style="margin:10px 2px 0;color:#64748b;font-size:12px;line-height:1.5">
        ${engagement.uniqueVisitors} unika besökare stod bakom aktiviteten. Alla mätpunkter är anonyma och kan inte kopplas till enskilda personer.
      </p>
      ${surfacesHtml}
      ${intentHtml}`;

  // Marknadskontext + marknadsandel
  const sharePct = coverage.complete && market.totalExposures > 0
    ? Math.round((engagement.exposures / market.totalExposures) * 1000) / 10
    : null;
  const marketHtml = `
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="width:33%;padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;text-align:center">
            <div style="font-size:22px;font-weight:800;color:#0f172a">${market.siteVisitors.toLocaleString("sv-SE")}</div>
            <div style="font-size:12px;color:#64748b;margin-top:4px">besökare på d365.se</div>
          </td>
          <td style="width:8px"></td>
          <td style="width:33%;padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;text-align:center">
            <div style="font-size:22px;font-weight:800;color:#0f172a">${market.sitePageViews.toLocaleString("sv-SE")}</div>
            <div style="font-size:12px;color:#64748b;margin-top:4px">sidvisningar</div>
          </td>
          <td style="width:8px"></td>
          <td style="width:33%;padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;text-align:center">
            <div style="font-size:22px;font-weight:800;color:#0f172a">${market.assessments.toLocaleString("sv-SE")}</div>
            <div style="font-size:12px;color:#64748b;margin-top:4px">genomförda behovsanalyser</div>
          </td>
        </tr>
      </table>
      ${sharePct !== null && engagement.exposures > 0 ? `
      <p style="margin:12px 0 0;padding:12px 14px;background:#ecfdf5;border-left:3px solid #16a34a;border-radius:4px;color:#14532d;font-size:14px;line-height:1.55">
        Ert kort stod för <strong>${sharePct} %</strong> av alla partnerexponeringar på sajten under perioden
        (${engagement.exposures.toLocaleString("sv-SE")} av ${market.totalExposures.toLocaleString("sv-SE")}).
      </p>` : ""}`;

  // Rullande 3-månaderstrend
  const trendMax = Math.max(1, ...trend.map((t) => t.exposures));
  const trendRows = trend
    .map((t) => {
      const w = Math.round((t.exposures / trendMax) * 100);
      return `
      <tr>
        <td style="padding:8px 10px;font-size:13px;color:#0f172a;white-space:nowrap">${esc(t.label)}</td>
        <td style="padding:8px 10px;width:100%">
          <div style="background:#e2e8f0;border-radius:4px;height:10px">
            <div style="background:#ea580c;width:${w}%;height:10px;border-radius:4px;font-size:0">&nbsp;</div>
          </div>
        </td>
        <td style="padding:8px 10px;font-size:13px;color:#0f172a;text-align:right;white-space:nowrap"><strong>${t.exposures}</strong> exp.</td>
        <td style="padding:8px 10px;font-size:13px;color:#64748b;text-align:right;white-space:nowrap">${t.engagements} eng. / ${t.buyingSignals} köpsign.</td>
      </tr>`;
    })
    .join("");
  const trendHtml = trend.some((t) => t.exposures + t.engagements + t.buyingSignals > 0)
    ? `<table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px">${trendRows}</table>`
    : `<p style="margin:6px 0 0;color:#64748b;font-size:14px">Trenden byggs upp allt eftersom mätdata samlas in.</p>`;

  const nextPeriodHtml = settings.nextPeriod
    ? renderRichText(settings.nextPeriod)
    : `<p style="margin:6px 0;color:#64748b;font-size:14px">Inga aviserade publiceringar just nu.</p>`;

  const changelogHtml = settings.changelog
    ? renderRichText(settings.changelog)
    : "";

  const contactLine = settings.contact
    ? esc(settings.contact)
    : "Thomas Laine, thomas.laine@dynamicfactory.se";

  const videoInterviewHtml = `
    <table style="width:100%;border-collapse:collapse;margin:28px 0 0">
      <tr><td style="padding:16px 18px;background:#f0f9ff;border-radius:10px;border-left:4px solid #0284c7">
        <div style="color:#0c4a6e;font-size:15px;font-weight:700;margin-bottom:8px">Videointervju för er partnerprofil?</div>
        <div style="color:#334155;font-size:13px;line-height:1.6;margin-bottom:14px">
          ${settings.videoInterviewCta ? renderRichText(settings.videoInterviewCta) : `
          <p style="margin:6px 0">Jag vill gärna prata med er om er verksamhet och vad ni gör för kunder. En kort videointervju hjälper köpare att förstå er bättre och ger er en mer personlig profil.</p>
          <p style="margin:6px 0"><strong>Kontakta mig för att bestämma tid och vem hos er som kan delta.</strong></p>
          `}
        </div>
        <a href="mailto:thomas.laine@dynamicfactory.se?subject=Videointervju%20f%C3%B6r%20${encodeURIComponent(partner.name)}" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:6px;font-weight:600;font-size:13px">Mejla Thomas och boka tid</a>
      </td></tr>
    </table>
  `;

  const coverageHtml = coverage.warnings.length ? `
    <table role="presentation" width="100%" style="margin:0 0 22px;border-collapse:collapse"><tr><td style="padding:14px 16px;background:#fff7ed;border-left:4px solid #d97706;color:#78350f;font-size:13px;line-height:1.55">
      <strong>Delvis uppmätt period</strong><br>${coverage.warnings.map(esc).join("<br>")}
    </td></tr></table>` : "";

  return `<!DOCTYPE html>
<html lang="sv">
<head><meta charset="utf-8"><title>${esc(reportLabel)} ${esc(partner.name)}</title></head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eef2f7" style="background:#eef2f7">
    <tr><td align="center" style="padding:24px 12px">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(15,23,42,0.08)">

        <!-- Header -->
        <tr>
          <td bgcolor="#0f1f3d" style="background:#0f1f3d;padding:28px 28px 24px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="vertical-align:middle">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                    <td style="background:#ea580c;width:4px;height:28px;line-height:28px;font-size:0">&nbsp;</td>
                    <td style="padding-left:10px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;line-height:1">d365<span style="color:#ea580c">.</span><span style="color:rgba(255,255,255,0.65);font-weight:300">se</span></td>
                  </tr></table>
                </td>
                <td align="right" style="vertical-align:middle;color:#94a3b8;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:600">
                  ${esc(reportLabel)}
                </td>
              </tr>
            </table>
            <div style="height:1px;background:#1e3a5f;margin:20px 0 18px"></div>
            <div style="color:#ffffff;font-size:24px;font-weight:700;line-height:1.2">${esc(partner.name)}</div>
            <div style="color:#cbd5e1;font-size:14px;margin-top:6px">Denna period: ${esc(currentLabel)}</div>
            <div style="color:#94a3b8;font-size:12px;margin-top:2px">Föregående period: ${esc(previousLabel)}</div>
          </td>
        </tr>

        <tr><td bgcolor="#ea580c" style="background:#ea580c;height:4px;line-height:4px;font-size:0">&nbsp;</td></tr>

        <tr><td style="padding:28px">

          ${coverageHtml}

          <!-- Siffror -->
          <h2 style="margin:0 0 12px;font-size:18px;color:#0f172a">Siffror</h2>
          <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
            <thead>
              <tr style="background:#f8fafc">
                <th style="padding:10px 14px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Mätpunkt</th>
                <th style="padding:10px 14px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Denna period</th>
                <th style="padding:10px 14px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Föregående</th>
                <th style="padding:10px 14px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Utveckling</th>
              </tr>
            </thead>
            <tbody>
              ${statRow("Profilvisningar", current.profileVisits, previous.profileVisits)}
              ${statRow("Visningar i jämförelsevyn", current.compareViews, previous.compareViews)}
              ${statRow("Visningar av er i branschlistor", current.industryListingViews, previous.industryListingViews)}
            </tbody>
          </table>
          <p style="margin:10px 2px 0;color:#64748b;font-size:12px;line-height:1.5">
            Kontaktförfrågningar skickas till er i realtid via e-post. Raden ovan är summan för perioden.
          </p>

          <!-- Vilka tittade -->
          <h2 style="margin:28px 0 8px;font-size:18px;color:#0f172a">Vilka tittade</h2>
          <p style="margin:0 0 10px;color:#64748b;font-size:13px;line-height:1.55">
             Aggregerad bild av samtyckta och senast synkroniserade företagsbesökare på er profil under perioden. Vi lämnar aldrig ut enskilda företagsnamn: köpare ska kunna researcha ostört.
          </p>
          <ul style="margin:6px 0 0 0;padding-left:20px;color:#334155;font-size:14px">
            ${bulletsHtml}
          </ul>
          ${identifiedCompanies > 0 ? `
          <p style="margin:12px 0 0;padding:10px 12px;background:#fff7ed;border-left:3px solid #ea580c;border-radius:4px;color:#7c2d12;font-size:13px;line-height:1.5">
            Vill ni ha en aggregerad genomgång av branscher och storlekar bland besökarna? Svara på detta mejl.
          </p>` : ""}

          <!-- Partner Performance -->
          <h2 style="margin:28px 0 8px;font-size:18px;color:#0f172a">Partner Performance</h2>
          <p style="margin:0 0 10px;color:#64748b;font-size:13px;line-height:1.55">
            Köpresan i fyra nivåer – från att ert kort syns till att någon ber om kontakt. Ju längre ner i tabellen aktiviteten sker, desto närmare ett faktiskt affärstillfälle.
          </p>
          ${performanceHtml}

          ${coverage.complete ? `<!-- Rullande trend -->
          <h2 style="margin:28px 0 8px;font-size:18px;color:#0f172a">Utveckling senaste tre månaderna</h2>
          <p style="margin:0 0 10px;color:#64748b;font-size:13px;line-height:1.55">
            Enskilda månader svänger. Trenden ger en stabilare bild av hur ofta ert kort möter köpare.
          </p>
          ${trendHtml}` : ""}

          <!-- Marknadskontext -->
          <h2 style="margin:28px 0 8px;font-size:18px;color:#0f172a">Marknadskontext</h2>
          <p style="margin:0 0 10px;color:#64748b;font-size:13px;line-height:1.55">
             Så här stor var den registrerade köparaktiviteten på d365.se under perioden.${coverage.complete ? " Här visas även er andel av partnerexponeringarna." : " Andelen av partnerexponeringar visas inte när mättäckningen är ofullständig."}
          </p>
          ${marketHtml}

          <!-- AI-sök och chatbot -->
          <h2 style="margin:28px 0 8px;font-size:18px;color:#0f172a">AI-sök och chatbot</h2>
          <p style="margin:0 0 10px;color:#64748b;font-size:13px;line-height:1.55">
            Allt fler köpare inleder sin research i en AI-tjänst i stället för i en sökmotor. Det här mäter vi:
            dels hur ofta besökare använder sajtens egna AI-verktyg (chatbot, smart sök och AI-jämförelse),
            dels hur ofta externa AI-tjänster hämtar innehåll från d365.se för att kunna svara på frågor om
            Dynamics 365-partners i Sverige.
          </p>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="width:33%;padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;text-align:center">
                <div style="font-size:22px;font-weight:800;color:#0f172a">${market.aiSearches.toLocaleString("sv-SE")}</div>
                <div style="font-size:12px;color:#64748b;margin-top:4px">AI-sökningar på sajten</div>
              </td>
              <td style="width:8px"></td>
              <td style="width:33%;padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;text-align:center">
                <div style="font-size:22px;font-weight:800;color:#0f172a">${market.aiChatSessions.toLocaleString("sv-SE")}</div>
                <div style="font-size:12px;color:#64748b;margin-top:4px">frågor till chatboten</div>
              </td>
              <td style="width:8px"></td>
              <td style="width:33%;padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;text-align:center">
                <div style="font-size:22px;font-weight:800;color:#0f172a">${market.aiBotHits.toLocaleString("sv-SE")}</div>
                <div style="font-size:12px;color:#64748b;margin-top:4px">hämtningar av AI-tjänster</div>
              </td>
            </tr>
          </table>
          ${market.aiBotNames.length > 0 ? `
          <p style="margin:10px 2px 0;color:#64748b;font-size:12px;line-height:1.5">
            AI-tjänster som hämtat innehåll under perioden: ${market.aiBotNames.join(", ")}.
            Ju mer komplett er profil är, desto större chans att ni nämns när en köpare frågar en AI-tjänst
            om lämpliga Dynamics 365-partners.
          </p>` : ""}
          <p style="margin:8px 2px 0;color:#94a3b8;font-size:12px;line-height:1.5">
            Siffrorna gäller hela d365.se och är inte partnerspecifika. AI-verktygen använder er publicerade
            profiltext, era produktområden, branscher och leveransprofil som underlag.
          </p>



          <!-- d365guide.com -->
          <table style="width:100%;border-collapse:collapse;margin:28px 0 0">
            <tr><td style="padding:16px 18px;background:#0f1f3d;border-radius:10px">
              <div style="color:#ffffff;font-size:15px;font-weight:700;margin-bottom:6px">Internationell räckvidd – d365guide.com</div>
              <div style="color:#cbd5e1;font-size:13px;line-height:1.6">
                Systersajten <strong style="color:#ffffff">d365guide.com</strong> riktar sig till köpare utanför Sverige
                (engelska och norska). Som verifierad partner på d365.se kommer er profil att synas där också –
                utan extra kostnad. Vi återkommer med mer information när sajten är på plats.
              </div>
            </td></tr>
          </table>

          <!-- Var ni syntes -->
          <h2 style="margin:28px 0 8px;font-size:18px;color:#0f172a">Var ni syntes</h2>
          ${visibilityHtml}

          ${videoInterviewHtml}

          <!-- Nästa period -->
          <h2 style="margin:28px 0 8px;font-size:18px;color:#0f172a">Nästa period</h2>
          ${nextPeriodHtml}

          ${videoInterviewHtml}

          ${changelogHtml ? `
          <!-- Nytt på sajten -->
          <h2 style="margin:28px 0 8px;font-size:18px;color:#0f172a">Nytt på sajten</h2>
          <p style="margin:0 0 8px;color:#64748b;font-size:13px;line-height:1.55">
            Funktioner och förbättringar som lanserats under perioden.
          </p>
          ${changelogHtml}` : ""}

          <div style="text-align:center;margin:28px 0 8px">
            <a href="${esc(profileUrl)}" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:8px;font-weight:600;font-size:14px">
              Öppna er partnerprofil →
            </a>
          </div>

          <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;text-align:center;line-height:1.55">
            Frågor om rapporten eller er profil: ${contactLine}.<br>
            Rapporten skickas månadsvis till er angivna kontaktperson.
          </p>
        </td></tr>

        <tr><td bgcolor="#0f1f3d" style="background:#0f1f3d;padding:18px 28px;text-align:center;color:#94a3b8;font-size:11px;letter-spacing:0.5px">
          D365.se · Guiden till Microsoft Dynamics 365-partners
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function findReport(supabase: any, partnerId: string, currentStart: string) {
  // Match the report by partner + period month derived from the inclusive start.
  const month = currentStart.slice(0, 7) + "-01";
  const { data } = await supabase
    .from("partner_performance_reports")
    .select("id, status, sent_at, metrics")
    .eq("partner_id", partnerId)
    .eq("period_month", month)
    .maybeSingle();
  return data || null;
}

async function sendOne(
  supabase: any,
  partner: any,
  currentStart: string,
  currentEnd: string,
  previousStart: string,
  previousEnd: string,
  settings: { changelog: string; nextPeriod: string; contact: string },
  dryRun: boolean,
  overrideRecipient?: string,
  reportLabel = "Månadsrapport",
  extraRecipients: string[] = [],
  requireApproved = false,
) {
  const primary = overrideRecipient || partner.admin_contact_email || partner.email;
  const recipients: string[] = [];
  if (primary) recipients.push(primary);
  for (const r of extraRecipients) {
    const trimmed = String(r || "").trim();
    if (trimmed && !recipients.includes(trimmed)) recipients.push(trimmed);
  }
  if (recipients.length === 0) {
    return { partner: partner.name, status: "skipped", reason: "no_recipient" };
  }
  const recipient = recipients[0];

  const inclusiveEnd = new Date(new Date(currentEnd).getTime() - 1).toISOString();
  const inclusivePreviousEnd = new Date(new Date(previousEnd).getTime() - 1).toISOString();
  const currentLabel = `${fmtIso(currentStart)} – ${fmtIso(inclusiveEnd)}`;
  const previousLabel = `${fmtIso(previousStart)} – ${fmtIso(inclusivePreviousEnd)}`;

  const stats = await buildStats(supabase, partner, currentStart, currentEnd, previousStart, previousEnd);

  const totalActivity = stats.current.profileVisits + stats.current.compareViews + stats.current.industryListingViews
    + stats.engagement.exposures + stats.engagement.engagements + stats.engagement.buyingSignals + stats.engagement.leads;
  if (!dryRun && totalActivity === 0) {
    return { partner: partner.name, status: "skipped", reason: "no_activity" };
  }

  const html = buildHtml(stats, currentLabel, previousLabel, settings, reportLabel);
  const subject = `${reportLabel} för ${partner.name} – ${currentLabel}`;

  if (dryRun) {
    return { partner: partner.name, status: "preview", recipient, recipients, stats, html };
  }

  // Enforce approval before sending if requested (manual/admin sends).
  const report = await findReport(supabase, partner.id, currentStart);
  if (requireApproved && (!report || report.status !== "approved")) {
    return { partner: partner.name, status: "skipped", reason: "not_approved", reportStatus: report?.status || null };
  }
  if (requireApproved && !stats.coverage.complete && report?.metrics?.coverage_confirmed !== true) {
    return { partner: partner.name, status: "skipped", reason: "coverage_not_confirmed" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "D365 Guiden <info@d365.se>",
      to: recipients,
      bcc: ["info@d365.se"],
      reply_to: "info@d365.se",
      subject,
      html,
    }),
  });

  const body = await res.json();
  const ok = res.ok;

  if (ok && report?.id) {
    await supabase
      .from("partner_performance_reports")
      .update({ sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", report.id);
  }

  await supabase.from("email_send_log").insert({
    template_name: "partner-monthly-report",
    recipient_email: recipients.join(", "),
    subject,
    status: ok ? "sent" : "failed",
    error_message: ok ? null : (body?.message || JSON.stringify(body)),
    metadata: {
      partner_slug: partner.slug,
      partner_name: partner.name,
      period_start: currentStart,
      period_end: currentEnd,
      recipients,
      current: stats.current,
      previous: stats.previous,
      report_status: report?.status || null,
    },
  });

  return {
    partner: partner.name,
    status: ok ? "sent" : "failed",
    recipient,
    recipients,
    stats: { current: stats.current, previous: stats.previous },
    error: ok ? undefined : body,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      adminPassword,
      token: tokenField,
      adminToken: adminTokenField,
      cronSecret,
      partnerSlug,
      dryRun = false,
      days = 30,
      periodStart,      // optional ISO date "YYYY-MM-DD" – overrides `days`
      periodEnd,        // optional ISO date "YYYY-MM-DD"
      reportLabel: reportLabelOverride,
      overrideRecipient,
      extraRecipients,
    } = body || {};

    const bearer = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const adminToken = tokenField || adminTokenField || bearer || "";

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    let isAdmin = !!(ADMIN_PASSWORD && adminPassword === ADMIN_PASSWORD);
    if (!isAdmin && adminToken) isAdmin = await verifyAdminJWT(adminToken);

    let isCron = false;
    if (!isAdmin && cronSecret) {
      const { data: secretRow } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "monthly_report_cron_secret")
        .maybeSingle();
      isCron = !!secretRow?.value && secretRow.value === cronSecret;
    }
    if (!isAdmin && !isCron) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fail-safe: cron runs only when explicitly enabled
    if (isCron) {
      const { data: gate } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "monthly_report_auto_send_enabled")
        .maybeSingle();
      if (!gate || gate.value !== "true") {
        return new Response(JSON.stringify({ error: "Automatisk utskick är avstängt" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Compute period windows
    const now = new Date();
    let currentEndDate: Date;
    let currentStartDate: Date;
    if (periodStart && periodEnd) {
      currentStartDate = stockholmDateStart(periodStart);
      currentEndDate = stockholmDateStart(periodEnd);
    } else {
      currentEndDate = now;
      currentStartDate = new Date(now.getTime() - days * 86400000);
    }
    const currentStart = currentStartDate.toISOString();
    const currentEnd = currentEndDate.toISOString();
    const spanMs = currentEndDate.getTime() - currentStartDate.getTime();
    const previousEnd = currentStart;
    const previousStart = new Date(currentStartDate.getTime() - spanMs).toISOString();

    const reportLabel = reportLabelOverride || "Månadsrapport";
    const settings = await fetchSiteSettings(supabase);

    let query = supabase
      .from("partners")
      .select("id, slug, name, email, admin_contact_email, is_featured")
      .eq("is_featured", true);
    if (partnerSlug) query = query.eq("slug", String(partnerSlug).trim().toLowerCase());

    const { data: partners, error } = await query;
    if (error) throw error;
    if (!partners?.length) {
      return new Response(JSON.stringify({ error: "No partners found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: any[] = [];
    for (const p of partners) {
      try {
        results.push(await sendOne(
          supabase, p,
          currentStart, currentEnd,
          previousStart, previousEnd,
          settings,
          dryRun,
          overrideRecipient,
          reportLabel,
          Array.isArray(extraRecipients) ? extraRecipients : [],
          true, // require approved report before actual send
        ));
      } catch (e: any) {
        console.error("Partner failed:", p.slug, e);
        results.push({ partner: p.name, status: "error", error: e?.message });
      }
    }

    const summary = {
      total: results.length,
      sent: results.filter(r => r.status === "sent").length,
      skipped: results.filter(r => r.status === "skipped").length,
      failed: results.filter(r => r.status === "failed" || r.status === "error").length,
      preview: results.filter(r => r.status === "preview").length,
    };

    return new Response(JSON.stringify({ summary, results }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-partner-monthly-report error:", e);
    return new Response(JSON.stringify({ error: e?.message || "Internal error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
