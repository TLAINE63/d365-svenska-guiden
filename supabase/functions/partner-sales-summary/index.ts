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
  sajt30: { uniqueVisitors: number; pageViews: number };
  sajt90: { uniqueVisitors: number; pageViews: number };
  partner30: SummaryWindow;
  partner90: SummaryWindow;
  topFilterContexts: { label: string; count: number }[];
  topFilterPages: { path: string; count: number }[];
  identifiedCompanies: CompanyHit[];
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
      .select("session_id, page_path", { count: "exact" })
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
  const sessions30 = new Set<string>();
  const analysisSessions30 = new Set<string>();
  for (const r of v30.data || []) {
    if (r.session_id) sessions30.add(r.session_id);
    if (r.session_id && (r.page_path?.includes("behovsanalys") || r.page_path?.includes("ai-readiness"))) {
      analysisSessions30.add(r.session_id);
    }
  }
  const sessions90 = new Set<string>();
  const analysisSessions90 = new Set<string>();
  for (const r of v90.data || []) {
    if (r.session_id) sessions90.add(r.session_id);
    if (r.session_id && (r.page_path?.includes("behovsanalys") || r.page_path?.includes("ai-readiness"))) {
      analysisSessions90.add(r.session_id);
    }
  }
  const isAnalysisLead = (l: any) =>
    (l.source_page || "").includes("behovsanalys") || (l.source_type || "").includes("analys");
  const completed30 = (leads90Res.data || []).filter((l) => isAnalysisLead(l) && (l.created_at || "") >= since30).length;
  const completed90 = (leads90Res.data || []).filter(isAnalysisLead).length;
  const globalProfileViews30 = gpv30.count || 0;
  const globalProfileViews90 = gpv90.count || 0;
  const globalClicks30 = gc30.count || 0;
  const globalClicks90 = gc90.count || 0;

  // ── Per-partner exponering ──────────────────────────────────────────
  const [
    exposures90Res,
    views90Res,
    clicks90Res,
  ] = await Promise.all([
    supabase
      .from("partner_filter_exposures")
      .select("page_path, filter_context, viewed_at")
      .eq("partner_slug", partner.slug)
      .gte("viewed_at", since90),
    supabase
      .from("partner_profile_views")
      .select("view_type, viewed_at")
      .eq("partner_slug", partner.slug)
      .gte("viewed_at", since90),
    partner.name
      ? supabase
          .from("partner_clicks")
          .select("clicked_at")
          .eq("partner_name", partner.name)
          .gte("clicked_at", since90)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const exposures = exposures90Res.data || [];
  const views = views90Res.data || [];
  const clicks = clicks90Res.data || [];

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

  // ── Snitcher identifierade företag (90d) ───────────────────────────
  const relatedPaths = relatedPathsFor(partner);
  const profilePath = `/partner/${partner.slug}`;
  const { data: snitcherRows } = await supabase
    .from("snitcher_visits")
    .select("company_name, company_industry, company_size, company_country, visited_urls, partner_slugs, session_started_at")
    .gte("session_started_at", since90)
    .limit(2000);

  const companyAgg = new Map<string, CompanyHit>();
  for (const r of snitcherRows || []) {
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

  const identifiedCompanies = Array.from(companyAgg.values())
    .sort((a, b) => {
      // Prioritize profile-matchers, then sessions
      if (a.matchedProfile !== b.matchedProfile) return a.matchedProfile ? -1 : 1;
      return b.sessions - a.sessions;
    })
    .slice(0, 50);

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
    lines.push(`IDENTIFIERADE FÖRETAG (Snitcher, 90d) – ${identifiedCompanies.length} st`);
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
    lines.push("IDENTIFIERADE FÖRETAG: Inga identifierade företag i Snitcher-data för denna partner senaste 90 dagarna.");
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
</table>

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

<h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:#475569;margin:22px 0 8px">Identifierade företag (Snitcher, 90d)</h2>
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
    sajt30: { uniqueVisitors: sessions30.size, pageViews: v30.count || 0 },
    sajt90: { uniqueVisitors: sessions90.size, pageViews: v90.count || 0 },
    partner30,
    partner90,
    topFilterContexts,
    topFilterPages,
    identifiedCompanies,
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
