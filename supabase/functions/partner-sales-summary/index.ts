import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

// ── CORS ──────────────────────────────────────────────────────────────
function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  const allowed = [
    "https://d365.se",
    "https://www.d365.se",
    "https://d365-svenska-guiden.lovable.app",
    "http://localhost:5173",
    "http://localhost:8080",
  ];
  if (allowed.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  return false;
}
function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

// ── JWT (admin) ───────────────────────────────────────────────────────
function b64UrlToB64(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function b64UrlDecode(s: string) {
  const bin = atob(b64UrlToB64(s));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function verifyJWT(token: string, secret: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false, payload: null as any };
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64UrlDecode(s) as unknown as BufferSource,
      enc.encode(`${h}.${p}`),
    );
    if (!ok) return { valid: false, payload: null };
    const payload = JSON.parse(atob(b64UrlToB64(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return { valid: false, payload: null };
    if (payload.role !== "admin") return { valid: false, payload: null };
    return { valid: true, payload };
  } catch {
    return { valid: false, payload: null };
  }
}

function esc(s: any): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const fmt = (n: number) => n.toLocaleString("sv-SE");

interface PartnerRow {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  email: string | null;
  admin_contact_email: string | null;
  is_featured: boolean | null;
  agreement_signed: boolean | null;
  applications: string[] | null;
  industries: string[] | null;
}

// Map partner applications/industries to related URL prefixes for Snitcher matching
const APP_TO_PATHS: Record<string, string[]> = {
  "Business Central": ["/business-central"],
  "Finance & Supply Chain": ["/finance-supply-chain", "/affarssystem"],
  "Sales": ["/d365-sales", "/crm"],
  "Customer Service": ["/d365-customer-service"],
  "Field Service": ["/d365-field-service"],
  "Marketing": ["/d365-marketing"],
  "Customer Insights": ["/d365-marketing"],
  "Contact Center": ["/d365-contact-center"],
  "Commerce": ["/d365-commerce"],
  "Human Resources": ["/d365-human-resources"],
  "Project Operations": ["/d365-project-operations"],
};

function relatedPathsFor(partner: PartnerRow): string[] {
  const out = new Set<string>();
  out.add(`/partner/${partner.slug}`);
  for (const app of partner.applications || []) {
    for (const k of Object.keys(APP_TO_PATHS)) {
      if (app.toLowerCase().includes(k.toLowerCase())) {
        APP_TO_PATHS[k].forEach((p) => out.add(p));
      }
    }
  }
  for (const ind of partner.industries || []) {
    if (ind) {
      const slug = ind
        .toLowerCase()
        .replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (slug) out.add(`/branschlosningar/${slug}`);
    }
  }
  return Array.from(out);
}

interface SummaryWindow {
  filterExposures: number;
  cardClicks: number;
  profileVisits: number;
  websiteClicks: number;
}

interface CompanyHit {
  name: string;
  industry: string | null;
  size: string | null;
  country: string | null;
  sessions: number;
  visitedPaths: string[];
  matchedProfile: boolean;
  matchedRelated: boolean;
}

async function buildSummary(
  supabase: any,
  partner: PartnerRow,
): Promise<{
  partner: any;
  sajtAll: { uniqueVisitors: number; pageViews: number; valjPartnerVisits: number; komIgangVisits: number; analysesCompleted: number; partnerProfileVisitsGlobal: number; partnerClicksGlobal: number; avgTimeOnPageSec: number };
  dashboard: {
    uniqueVisitors90d: number;
    pageViews90d: number;
    uniqueVisitors30d: number;
    swedishSharePct: number;
    valjPartner30d: number;
    behovsanalyser30d: number;
    komIgang30d: number;
    leadsTotal: number;
    leads90d: number;
    publishedPartners: number;
    partnerProfileViews90d: number;
    partnerClicks90d: number;
    avgTimeOnPageSec: number;
  };
  site30: { analysesStarted: number; analysesCompleted: number; profileViews: number; partnerClicks: number };
  site90: { analysesStarted: number; analysesCompleted: number; profileViews: number; partnerClicks: number };
  partnerAll: SummaryWindow;
  topFilterContexts: { label: string; count: number }[];
  topFilterPages: { path: string; count: number }[];
  identifiedCompanies: CompanyHit[];
  analysisTrend30: { date: string; started: number; completed: number }[];
  text: string;
  html: string;
}> {
  const now = Date.now();
  const since30 = new Date(now - 30 * 86400000).toISOString();
  const since90 = new Date(now - 90 * 86400000).toISOString();

  // ── Sajttotaler + globala partner-tot + behovsanalyser ──────────────
  const [v30, v90, gpv30, gpv90, gc30, gc90, leads90Res] = await Promise.all([
    supabase
      .from("visitor_analytics")
      .select("session_id, page_path, visited_at", { count: "exact" })
      .gte("visited_at", since30)
      .limit(50000),
    supabase
      .from("visitor_analytics")
      .select("session_id, page_path", { count: "exact" })
      .gte("visited_at", since90)
      .limit(50000),
    supabase.from("partner_profile_views").select("*", { count: "exact", head: true }).gte("viewed_at", since30),
    supabase.from("partner_profile_views").select("*", { count: "exact", head: true }).gte("viewed_at", since90),
    supabase.from("partner_clicks").select("*", { count: "exact", head: true }).gte("clicked_at", since30),
    supabase.from("partner_clicks").select("*", { count: "exact", head: true }).gte("clicked_at", since90),
    supabase.from("leads").select("source_page, source_type, created_at").gte("created_at", since90),
  ]);
  const isAnalysisPath = (p?: string) =>
    !!p && (p.includes("behovsanalys") || p.includes("ai-readiness") || p.includes("kravspec"));
  const sessions30 = new Set<string>();
  const analysisSessions30 = new Set<string>();
  const startedByDay = new Map<string, Set<string>>();
  for (const r of v30.data || []) {
    if (r.session_id) sessions30.add(r.session_id);
    if (r.session_id && isAnalysisPath(r.page_path)) {
      analysisSessions30.add(r.session_id);
      const day = (r.visited_at || "").slice(0, 10);
      if (day) {
        if (!startedByDay.has(day)) startedByDay.set(day, new Set());
        startedByDay.get(day)!.add(r.session_id);
      }
    }
  }
  const sessions90 = new Set<string>();
  const analysisSessions90 = new Set<string>();
  for (const r of v90.data || []) {
    if (r.session_id) sessions90.add(r.session_id);
    if (r.session_id && isAnalysisPath(r.page_path)) {
      analysisSessions90.add(r.session_id);
    }
  }
  const isAnalysisLead = (l: any) =>
    (l.source_page || "").includes("behovsanalys") || (l.source_type || "").includes("analys");
  const completed30 = (leads90Res.data || []).filter((l) => isAnalysisLead(l) && (l.created_at || "") >= since30).length;
  const completed90 = (leads90Res.data || []).filter(isAnalysisLead).length;
  const completedByDay = new Map<string, number>();
  for (const l of leads90Res.data || []) {
    if (!isAnalysisLead(l)) continue;
    if ((l.created_at || "") < since30) continue;
    const day = (l.created_at || "").slice(0, 10);
    if (day) completedByDay.set(day, (completedByDay.get(day) || 0) + 1);
  }
  const analysisTrend30: { date: string; started: number; completed: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 86400000).toISOString().slice(0, 10);
    analysisTrend30.push({
      date: d,
      started: startedByDay.get(d)?.size || 0,
      completed: completedByDay.get(d) || 0,
    });
  }
  const globalProfileViews30 = gpv30.count || 0;
  const globalProfileViews90 = gpv90.count || 0;
  const globalClicks30 = gc30.count || 0;
  const globalClicks90 = gc90.count || 0;

  // ── Sajttotaler all-time (unika sessioner + sidvisningar + nyckelsidor) ──
  const [vAllSessions, vAllPv, valjPartnerRes, komIgangRes, analysesAllRes, pvAllRes, clicksAllGRes] = await Promise.all([
    supabase.from("visitor_analytics").select("session_id, page_path, time_on_page").limit(200000),
    supabase.from("visitor_analytics").select("*", { count: "exact", head: true }),
    supabase.from("visitor_analytics").select("*", { count: "exact", head: true }).like("page_path", "%/valj-partner%"),
    supabase.from("visitor_analytics").select("*", { count: "exact", head: true }).like("page_path", "%/kom-igang%"),
    supabase.from("leads").select("source_type, source_page", { count: "exact", head: true }).or("source_type.ilike.%analys%,source_page.ilike.%behovsanalys%"),
    supabase.from("partner_profile_views").select("*", { count: "exact", head: true }),
    supabase.from("partner_clicks").select("*", { count: "exact", head: true }),
  ]);
  const sessionsAll = new Set<string>();
  let timeSum = 0, timeCount = 0;
  for (const r of vAllSessions.data || []) {
    if (r.session_id) sessionsAll.add(r.session_id);
    if (typeof r.time_on_page === "number" && r.time_on_page > 0 && r.time_on_page < 3600) {
      timeSum += r.time_on_page; timeCount++;
    }
  }
  const avgTimeOnPageSec = timeCount > 0 ? Math.round(timeSum / timeCount) : 0;
  const sajtAll = {
    uniqueVisitors: sessionsAll.size,
    pageViews: vAllPv.count || 0,
    valjPartnerVisits: valjPartnerRes.count || 0,
    komIgangVisits: komIgangRes.count || 0,
    analysesCompleted: analysesAllRes.count || 0,
    partnerProfileVisitsGlobal: pvAllRes.count || 0,
    partnerClicksGlobal: clicksAllGRes.count || 0,
    avgTimeOnPageSec,
  };

  // ── Dashboard-siffror (matchar /admin sales-overview-bilden) ────────
  const [
    swede30Res,
    valj30Res,
    behov30Res,
    komigang30Res,
    leadsAllRes,
    publishedRes,
  ] = await Promise.all([
    supabase.from("visitor_analytics").select("*", { count: "exact", head: true }).eq("geo_country_code", "SE").gte("visited_at", since30),
    supabase.from("visitor_analytics").select("*", { count: "exact", head: true }).like("page_path", "%/valj-partner%").gte("visited_at", since30),
    supabase.from("leads").select("*", { count: "exact", head: true }).or("source_type.ilike.%analys%,source_page.ilike.%behovsanalys%").gte("created_at", since30),
    supabase.from("visitor_analytics").select("*", { count: "exact", head: true }).like("page_path", "%/kom-igang%").gte("visited_at", since30),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("partners").select("*", { count: "exact", head: true }).eq("is_featured", true),
  ]);

  const totalSessions30 = sessions30.size;
  const swedishCount30 = swede30Res.count || 0;
  // approximate Swedish share via page views (since count is on rows, not sessions)
  const pv30 = v30.count || 0;
  const swedishSharePct = pv30 > 0 ? Math.round((swedishCount30 / pv30) * 100) : 0;

  const dashboard = {
    uniqueVisitors90d: sessions90.size,
    pageViews90d: v90.count || 0,
    uniqueVisitors30d: totalSessions30,
    swedishSharePct,
    valjPartner30d: valj30Res.count || 0,
    behovsanalyser30d: analysisSessions30.size,
    komIgang30d: komigang30Res.count || 0,
    leadsTotal: leadsAllRes.count || 0,
    leads90d: (leads90Res.data || []).length,
    publishedPartners: publishedRes.count || 0,
    partnerProfileViews90d: globalProfileViews90,
    partnerClicks90d: globalClicks90,
    avgTimeOnPageSec,
  };


  // ── Per-partner exponering (all-time) ───────────────────────────────
  const [
    exposuresAllRes,
    viewsAllRes,
    clicksAllRes,
  ] = await Promise.all([
    supabase
      .from("partner_filter_exposures")
      .select("page_path, filter_context, viewed_at")
      .eq("partner_slug", partner.slug),
    supabase
      .from("partner_profile_views")
      .select("view_type, viewed_at")
      .eq("partner_slug", partner.slug),
    partner.name
      ? supabase
          .from("partner_clicks")
          .select("clicked_at")
          .eq("partner_name", partner.name)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const exposuresAll = exposuresAllRes.data || [];
  const viewsAll = viewsAllRes.data || [];
  const clicksAll = clicksAllRes.data || [];

  // 90d och 30d slices från all-time-datan
  const exposures = exposuresAll.filter((r: any) => (r.viewed_at || "") >= since90);
  const views = viewsAll.filter((r: any) => (r.viewed_at || "") >= since90);
  const clicks = clicksAll.filter((r: any) => (r.clicked_at || "") >= since90);

  const win = (arr: any[], key: string, since: string) =>
    arr.filter((r) => (r[key] || "") >= since).length;

  const partner30: SummaryWindow = {
    filterExposures: win(exposures, "viewed_at", since30),
    cardClicks: views.filter((v: any) => v.view_type === "card_click" && v.viewed_at >= since30).length,
    profileVisits: views.filter((v: any) => v.view_type === "profile_visit" && v.viewed_at >= since30).length,
    websiteClicks: win(clicks, "clicked_at", since30),
  };
  const partner90: SummaryWindow = {
    filterExposures: exposures.length,
    cardClicks: views.filter((v: any) => v.view_type === "card_click").length,
    profileVisits: views.filter((v: any) => v.view_type === "profile_visit").length,
    websiteClicks: clicks.length,
  };
  const partnerAll: SummaryWindow = {
    filterExposures: exposuresAll.length,
    cardClicks: viewsAll.filter((v: any) => v.view_type === "card_click").length,
    profileVisits: viewsAll.filter((v: any) => v.view_type === "profile_visit").length,
    websiteClicks: clicksAll.length,
  };

  // Top filter pages (where partner shown)
  const pageMap = new Map<string, number>();
  const ctxMap = new Map<string, number>();
  for (const e of exposures) {
    const p = (e.page_path || "").split("?")[0];
    pageMap.set(p, (pageMap.get(p) || 0) + 1);
    const ctx = e.filter_context || {};
    const parts: string[] = [];
    if (ctx.product) parts.push(`Produkt: ${ctx.product}`);
    if (ctx.industry) parts.push(`Bransch: ${ctx.industry}`);
    if (ctx.size) parts.push(`Storlek: ${ctx.size}`);
    if (ctx.geography) parts.push(`Geo: ${ctx.geography}`);
    const label = parts.length ? parts.join(" · ") : "(inga aktiva filter)";
    ctxMap.set(label, (ctxMap.get(label) || 0) + 1);
  }
  const topFilterPages = Array.from(pageMap.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const topFilterContexts = Array.from(ctxMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // ── Identifierade besökande företag (90d) ───────────────────────────
  const relatedPaths = relatedPathsFor(partner);
  const profilePath = `/partner/${partner.slug}`;
  const { data: companyRows } = await supabase
    .from("snitcher_visits")
    .select("company_name, company_industry, company_size, company_country, visited_urls, partner_slugs, session_started_at")
    .gte("session_started_at", since90)
    .limit(2000);

  const companyAgg = new Map<string, CompanyHit>();
  for (const r of companyRows || []) {
    const visitedUrls: string[] = Array.isArray(r.visited_urls)
      ? r.visited_urls.map((u: any) => (typeof u === "string" ? u : u?.url || u?.path || "")).filter(Boolean)
      : [];
    const partnerSlugs: string[] = Array.isArray(r.partner_slugs) ? r.partner_slugs : [];

    const matchedProfile =
      partnerSlugs.includes(partner.slug) ||
      visitedUrls.some((u) => u.includes(profilePath));
    const matchedRelated = visitedUrls.some((u) =>
      relatedPaths.some((p) => p !== profilePath && u.includes(p)),
    );
    if (!matchedProfile && !matchedRelated) continue;

    const name = (r.company_name || "Okänt företag").trim();
    const key = name.toLowerCase();
    const existing = companyAgg.get(key);
    if (existing) {
      existing.sessions += 1;
      for (const u of visitedUrls) {
        const path = u.split("?")[0].split("#")[0];
        if (path && !existing.visitedPaths.includes(path)) existing.visitedPaths.push(path);
      }
      existing.matchedProfile = existing.matchedProfile || matchedProfile;
      existing.matchedRelated = existing.matchedRelated || matchedRelated;
    } else {
      companyAgg.set(key, {
        name,
        industry: r.company_industry || null,
        size: r.company_size || null,
        country: r.company_country || null,
        sessions: 1,
        visitedPaths: visitedUrls.map((u) => u.split("?")[0].split("#")[0]).filter(Boolean).slice(0, 8),
        matchedProfile,
        matchedRelated,
      });
    }
  }

  let identifiedCompanies = Array.from(companyAgg.values())
    .sort((a, b) => {
      if (a.matchedProfile !== b.matchedProfile) return a.matchedProfile ? -1 : 1;
      return b.sessions - a.sessions;
    })
    .slice(0, 50);

  // För ej publicerade partners: maska företagsnamn (visa att det är ett företag, men inte vilket)
  const maskCompanyNames = !partner.is_featured;
  if (maskCompanyNames) {
    identifiedCompanies = identifiedCompanies.map((c, i) => ({
      ...c,
      name: `Företag #${i + 1}`,
      country: null,
      visitedPaths: [],
    }));
  }

  // ── Nyhetsuppdateringar (publicerade artiklar senaste 30 dagar) ─────
  const { data: newsRows } = await supabase
    .from("knowledge_articles")
    .select("title, category, content_type, format, url, published_at")
    .eq("is_published", true)
    .gte("published_at", since30)
    .order("published_at", { ascending: false })
    .limit(30);
  const recentNews = (newsRows || []).map((n: any) => ({
    title: n.title || "",
    label: [n.format, n.category].filter(Boolean).join(" · ") || n.content_type || "",
    url: n.url || "",
    published_at: n.published_at || "",
  }));

  // ── Bygg text-sammanställning ───────────────────────────────────────
  const lines: string[] = [];
  lines.push(`Försäljningsunderlag – ${partner.name}`);
  lines.push(`Period: 30 dagar (90 dagar inom parentes)`);
  lines.push(`Genererat: ${new Date().toISOString().slice(0, 10).replace(/-/g, "/")}`);
  lines.push("");
  lines.push("SAJTEN TOTALT");
  lines.push(`  Unika besökare:                  ${fmt(sessions30.size)} (${fmt(sessions90.size)})`);
  lines.push(`  Sidvisningar:                    ${fmt(v30.count || 0)} (${fmt(v90.count || 0)})`);
  lines.push(`  Behovsanalyser startade:         ${fmt(analysisSessions30.size)} (${fmt(analysisSessions90.size)})`);
  lines.push(`  Behovsanalyser slutförda (lead): ${fmt(completed30)} (${fmt(completed90)})`);
  lines.push(`  Profilvisningar (globalt):       ${fmt(globalProfileViews30)} (${fmt(globalProfileViews90)})`);
  lines.push(`  Klick till partnersajter (glob): ${fmt(globalClicks30)} (${fmt(globalClicks90)})`);
  lines.push("");
  lines.push(`${partner.name.toUpperCase()} – EXPONERING`);
  lines.push(`  Visad i filterresultat: ${fmt(partner30.filterExposures)} (${fmt(partner90.filterExposures)})`);
  lines.push(`  Klick på partnerkort:   ${fmt(partner30.cardClicks)} (${fmt(partner90.cardClicks)})`);
  lines.push(`  Besök på profilsida:    ${fmt(partner30.profileVisits)} (${fmt(partner90.profileVisits)})`);
  lines.push(`  Klick till hemsida:     ${fmt(partner30.websiteClicks)} (${fmt(partner90.websiteClicks)})`);

  if (topFilterPages.length) {
    lines.push("");
    lines.push("VAR PARTNERN VISATS (topp sidor, 90d)");
    for (const p of topFilterPages) lines.push(`  ${p.path}  – ${p.count} ggr`);
  }
  if (topFilterContexts.length) {
    lines.push("");
    lines.push("VANLIGASTE FILTERVAL NÄR PARTNERN VISATS (90d)");
    for (const c of topFilterContexts) lines.push(`  ${c.label}  – ${c.count}`);
  }

  if (identifiedCompanies.length) {
    lines.push("");
    lines.push(`IDENTIFIERADE FÖRETAG (90d) – ${identifiedCompanies.length} st${maskCompanyNames ? " (företagsnamn maskerade)" : ""}`);
    for (const c of identifiedCompanies) {
      const meta = [c.industry, c.size, c.country].filter(Boolean).join(", ");
      const hit = c.matchedProfile ? "[profil]" : "[relaterad sida]";
      lines.push(`  • ${c.name} ${hit} – ${meta || "okänd profil"} – ${c.sessions} sessioner`);
      if (c.visitedPaths.length) {
        lines.push(`      besökt: ${c.visitedPaths.slice(0, 5).join(", ")}`);
      }
    }
  } else {
    lines.push("");
    lines.push("IDENTIFIERADE FÖRETAG: Inga identifierade besökande företag för denna partner senaste 90 dagarna.");
  }

  if (recentNews.length) {
    lines.push("");
    lines.push(`NYHETSUPPDATERINGAR PÅ SAJTEN (senaste 30 dagarna) – ${recentNews.length} st`);
    for (const n of recentNews) {
      const date = n.published_at ? n.published_at.slice(0, 10).replace(/-/g, "/") : "";
      const label = n.label ? ` [${n.label}]` : "";
      lines.push(`  • ${date} – ${n.title}${label}`);
      if (n.url) lines.push(`      ${n.url}`);
    }
  }

  const text = lines.join("\n");

  // ── HTML version ────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="sv"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a">
<div style="max-width:720px;margin:0 auto;background:#fff;padding:24px;border-radius:12px">
<h1 style="margin:0 0 4px;font-size:22px">Försäljningsunderlag – ${esc(partner.name)}</h1>
<div style="color:#64748b;font-size:13px;margin-bottom:18px">Period: 30 dagar (90 dagar inom parentes)</div>

<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:#475569;margin:18px 0 8px">Sajten totalt</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<tr><td style="padding:6px 0">Unika besökare</td><td style="text-align:right;font-weight:600">${fmt(sessions30.size)} <span style="color:#94a3b8;font-weight:400">(${fmt(sessions90.size)})</span></td></tr>
<tr><td style="padding:6px 0">Sidvisningar</td><td style="text-align:right;font-weight:600">${fmt(v30.count || 0)} <span style="color:#94a3b8;font-weight:400">(${fmt(v90.count || 0)})</span></td></tr>
<tr><td style="padding:6px 0">Behovsanalyser startade</td><td style="text-align:right;font-weight:600">${fmt(analysisSessions30.size)} <span style="color:#94a3b8;font-weight:400">(${fmt(analysisSessions90.size)})</span></td></tr>
<tr><td style="padding:6px 0">Behovsanalyser slutförda (lead)</td><td style="text-align:right;font-weight:600">${fmt(completed30)} <span style="color:#94a3b8;font-weight:400">(${fmt(completed90)})</span></td></tr>
<tr><td style="padding:6px 0">Profilvisningar (globalt)</td><td style="text-align:right;font-weight:600">${fmt(globalProfileViews30)} <span style="color:#94a3b8;font-weight:400">(${fmt(globalProfileViews90)})</span></td></tr>
<tr><td style="padding:6px 0">Klick till partnersajter (globalt)</td><td style="text-align:right;font-weight:600">${fmt(globalClicks30)} <span style="color:#94a3b8;font-weight:400">(${fmt(globalClicks90)})</span></td></tr>
  </table>

  ${(() => {
    const W = 640, H = 110, padL = 28, padR = 8, padT = 8, padB = 22;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;
    const n = analysisTrend30.length;
    const max = Math.max(1, ...analysisTrend30.map((d) => Math.max(d.started, d.completed)));
    const groupW = innerW / n;
    const barW = Math.max(2, (groupW - 2) / 2);
    const y = (v: number) => padT + innerH - (v / max) * innerH;
    const bars = analysisTrend30.map((d, i) => {
      const gx = padL + i * groupW + 1;
      const xs = gx;
      const xc = gx + barW + 1;
      const hs = (d.started / max) * innerH;
      const hc = (d.completed / max) * innerH;
      return `<rect x="${xs.toFixed(1)}" y="${y(d.started).toFixed(1)}" width="${barW.toFixed(1)}" height="${hs.toFixed(1)}" fill="#3b82f6"/><rect x="${xc.toFixed(1)}" y="${y(d.completed).toFixed(1)}" width="${barW.toFixed(1)}" height="${hc.toFixed(1)}" fill="#16a34a"/>`;
    }).join("");
    const yTicks = [0, Math.ceil(max / 2), max];
    const yLabels = yTicks.map((t) => `<text x="${padL - 4}" y="${y(t) + 3}" text-anchor="end" font-size="9" fill="#94a3b8">${t}</text><line x1="${padL}" y1="${y(t)}" x2="${W - padR}" y2="${y(t)}" stroke="#e2e8f0" stroke-width="0.5"/>`).join("");
    const firstDate = analysisTrend30[0]?.date.slice(5).replace("-", "/") || "";
    const lastDate = analysisTrend30[n - 1]?.date.slice(5).replace("-", "/") || "";
    return `
<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:#475569;margin:22px 0 8px">Behovsanalyser senaste 30 dagar</h2>
<div style="font-size:11px;color:#64748b;margin-bottom:6px">
  <span style="display:inline-block;width:9px;height:9px;background:#3b82f6;margin-right:4px;vertical-align:middle"></span>Startade
  <span style="display:inline-block;width:9px;height:9px;background:#16a34a;margin:0 4px 0 12px;vertical-align:middle"></span>Slutförda (lead)
</div>
<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;display:block;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px">
  ${yLabels}
  ${bars}
  <text x="${padL}" y="${H - 6}" font-size="9" fill="#94a3b8">${firstDate}</text>
  <text x="${W - padR}" y="${H - 6}" text-anchor="end" font-size="9" fill="#94a3b8">${lastDate}</text>
</svg>`;
  })()}

  <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:#475569;margin:22px 0 8px">${esc(partner.name)} – exponering</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<tr><td style="padding:6px 0">Visad i filterresultat</td><td style="text-align:right;font-weight:600">${fmt(partner30.filterExposures)} <span style="color:#94a3b8;font-weight:400">(${fmt(partner90.filterExposures)})</span></td></tr>
<tr><td style="padding:6px 0">Klick på partnerkort</td><td style="text-align:right;font-weight:600">${fmt(partner30.cardClicks)} <span style="color:#94a3b8;font-weight:400">(${fmt(partner90.cardClicks)})</span></td></tr>
<tr><td style="padding:6px 0">Besök på profilsida</td><td style="text-align:right;font-weight:600">${fmt(partner30.profileVisits)} <span style="color:#94a3b8;font-weight:400">(${fmt(partner90.profileVisits)})</span></td></tr>
<tr><td style="padding:6px 0">Klick till hemsida</td><td style="text-align:right;font-weight:600">${fmt(partner30.websiteClicks)} <span style="color:#94a3b8;font-weight:400">(${fmt(partner90.websiteClicks)})</span></td></tr>
</table>

${topFilterPages.length ? `
<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:#475569;margin:22px 0 8px">Var partnern visats (90d)</h2>
<ul style="margin:0;padding-left:20px;font-size:13px;color:#334155">
${topFilterPages.map((p) => `<li><code>${esc(p.path)}</code> – ${p.count} ggr</li>`).join("")}
</ul>` : ""}

${topFilterContexts.length ? `
<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:#475569;margin:22px 0 8px">Vanligaste filterval (90d)</h2>
<ul style="margin:0;padding-left:20px;font-size:13px;color:#334155">
${topFilterContexts.map((c) => `<li>${esc(c.label)} – ${c.count}</li>`).join("")}
</ul>` : ""}

<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:#475569;margin:22px 0 8px">Identifierade besökande företag (90d)${maskCompanyNames ? ' <span style="color:#94a3b8;font-size:11px;font-weight:400;text-transform:none;letter-spacing:0">(företagsnamn maskerade)</span>' : ""}</h2>
${identifiedCompanies.length ? `
<table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
<thead><tr style="background:#f8fafc">
<th style="padding:8px;text-align:left">Företag</th>
<th style="padding:8px;text-align:left">Bransch / storlek</th>
<th style="padding:8px;text-align:right">Sessioner</th>
<th style="padding:8px;text-align:left">Träff</th>
</tr></thead>
<tbody>
${identifiedCompanies.map((c) => `
<tr style="border-top:1px solid #eef0f3">
<td style="padding:8px"><strong>${esc(c.name)}</strong>${c.country ? `<br><span style="color:#94a3b8;font-size:11px">${esc(c.country)}</span>` : ""}</td>
<td style="padding:8px;color:#475569">${esc([c.industry, c.size].filter(Boolean).join(" · ") || "—")}</td>
<td style="padding:8px;text-align:right;font-weight:600">${c.sessions}</td>
<td style="padding:8px;color:#64748b;font-size:11px">${c.matchedProfile ? "Profil" : "Relaterad"}</td>
</tr>`).join("")}
</tbody></table>
` : `<p style="color:#94a3b8;font-size:13px">Inga identifierade företag senaste 90 dagarna.</p>`}

${recentNews.length ? `
<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:#475569;margin:22px 0 8px">Nyhetsuppdateringar på sajten (senaste 30 dagarna)</h2>
<ul style="margin:0;padding-left:20px;font-size:13px;color:#334155">
${recentNews.map((n) => {
  const date = n.published_at ? n.published_at.slice(0, 10).replace(/-/g, "/") : "";
  const label = n.label ? ` <span style="color:#94a3b8;font-size:11px">[${esc(n.label)}]</span>` : "";
  const titleHtml = n.url
    ? `<a href="${esc(n.url)}" style="color:#0f172a;text-decoration:underline">${esc(n.title)}</a>`
    : esc(n.title);
  return `<li>${esc(date)} – ${titleHtml}${label}</li>`;
}).join("")}
</ul>` : ""}

<p style="margin-top:24px;color:#94a3b8;font-size:11px">Genererat ${new Date().toISOString().slice(0, 16).replace("T", " ")} · D365.se</p>
</div></body></html>`;

  return {
    partner,
    sajtAll,
    dashboard,
    site30: {
      analysesStarted: analysisSessions30.size,
      analysesCompleted: completed30,
      profileViews: globalProfileViews30,
      partnerClicks: globalClicks30,
    },
    site90: {
      analysesStarted: analysisSessions90.size,
      analysesCompleted: completed90,
      profileViews: globalProfileViews90,
      partnerClicks: globalClicks90,
    },
    partnerAll,
    topFilterContexts,
    topFilterPages,
    identifiedCompanies,
    analysisTrend30,
    recentNews,
    text,
    html,
  };
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const token = body?.token || "";
    const partnerSlug: string = body?.partnerSlug || "";
    const mode: "summary" | "send" = body?.mode === "send" ? "send" : "summary";
    const recipient: string = body?.recipient || "thomas.laine@dynamicfactory.se";

    const SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SECRET) {
      return new Response(JSON.stringify({ error: "Auth not configured" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const v = await verifyJWT(token, SECRET);
    if (!v.valid) {
      return new Response(JSON.stringify({ error: "Ogiltig session" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    if (!partnerSlug) {
      return new Response(JSON.stringify({ error: "partnerSlug krävs" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: partner, error: pErr } = await supabase
      .from("partners")
      .select("id, slug, name, website, email, admin_contact_email, is_featured, agreement_signed, applications, industries")
      .eq("slug", partnerSlug)
      .maybeSingle();

    if (pErr || !partner) {
      return new Response(JSON.stringify({ error: "Partner hittades inte" }), {
        status: 404,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const result = await buildSummary(supabase, partner as PartnerRow);

    if (mode === "send") {
      const subject = `Försäljningsunderlag – ${partner.name}`;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "D365 Guiden <info@d365.se>",
          to: [recipient],
          reply_to: "info@d365.se",
          subject,
          html: result.html,
          text: result.text,
        }),
      });
      const sendBody = await res.json().catch(() => ({}));

      await supabase.from("email_send_log").insert({
        template_name: "partner-sales-summary",
        recipient_email: recipient,
        subject,
        status: res.ok ? "sent" : "failed",
        error_message: res.ok ? null : (sendBody?.message || JSON.stringify(sendBody)),
        metadata: {
          partner_slug: partner.slug,
          partner_name: partner.name,
          identified_companies: result.identifiedCompanies.length,
          filter_exposures_90d: result.partner90.filterExposures,
        },
      });

      if (!res.ok) {
        return new Response(JSON.stringify({ error: "send_failed", details: sendBody }), {
          status: 500,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ ok: true, sentTo: recipient, summary: result }),
        { headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ ok: true, summary: result }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("partner-sales-summary error", e);
    return new Response(JSON.stringify({ error: "internal" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
