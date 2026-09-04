// Statistikdelen av månadsrapporten (sammanslagen från send-partner-monthly-report).
// Beräknas vid utkastgenerering och sparas på partner_report_drafts.stats.

export interface PeriodStats {
  profileVisits: number;
  compareViews: number;
  websiteClicks: number;
  industryListingViews: number;
  cardClicks?: number;
  guideListingViews?: number;
  otherListingViews?: number;
  newsClicks?: number;
  sitePageViews?: number;
  siteUniqueVisitors?: number;
  /** Nivå 4-händelser: kontakt-, intro- och formulärförfrågningar. */
  contactRequests?: number;
  /** Nivå 3: påbörjade formulär på partnerkortet. */
  formStarts?: number;
}


/**
 * Ytor som redan mäts via partner_filter_exposures. Exponeringar från
 * partner_engagement_events på dessa sidor räknas därför inte igen.
 */
const EXPOSURE_COVERED_PATHS = ["/jamfor-partners", "/valjdynamics365partner", "/valj", "/ai-chat"];

/**
 * Exponeringar (nivå 1) från partner_engagement_events – täcker branschsidor,
 * startsidan, produktsidor och partnerkatalogen som saknas i filter_exposures.
 */
async function fetchImpressionSurfaces(
  supabase: any,
  slug: string | null,
  startIso: string,
  endIso: string,
): Promise<{ industry: number; other: number; industryBySlug: Map<string, number> }> {
  let q = supabase.from("partner_engagement_events").select("page_path")
    .eq("event_level", 1).gte("occurred_at", startIso).lt("occurred_at", endIso).limit(100000);
  if (slug) q = q.eq("partner_slug", slug);
  const { data } = await q;
  let industry = 0;
  let other = 0;
  const industryBySlug = new Map<string, number>();
  for (const r of data || []) {
    const p = String(r.page_path || "").toLowerCase();
    if (EXPOSURE_COVERED_PATHS.some((c) => p.startsWith(c))) continue;
    if (p.startsWith("/branscher")) {
      industry++;
      const s = p.replace(/^\/branscher\/?/, "").replace(/\/.*$/, "").replace(/[?#].*$/, "");
      if (s) industryBySlug.set(s, (industryBySlug.get(s) || 0) + 1);
    } else {
      other++;
    }
  }
  return { industry, other, industryBySlug };
}


export interface DraftStats {
  current: PeriodStats;
  /** Summan för samtliga partners under samma period (jämförelsebas). */
  benchmark?: PeriodStats;
  previous?: PeriodStats;
  topEntryPath: string | null;
  activeEvaluators: number;
  industryPagesListed: { slug: string; name: string; views: number }[];
  partnerNews: { title: string; date: string; url: string }[];
  currentLabel?: string;
  previousLabel?: string;
}

function esc(s: any): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
        // intern trafik – falla tillbaka på landningssidan nedan
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

async function fetchPeriod(supabase: any, partner: any, startIso: string, endIso: string): Promise<PeriodStats> {
  const [viewsRes, clicksRes, exposureRes, sitePvRes, sessionsRes, newsClicksRes, surfaces] = await Promise.all([
    supabase.from("partner_profile_views").select("view_type")
      .eq("partner_slug", partner.slug).gte("viewed_at", startIso).lt("viewed_at", endIso),
    supabase.from("partner_clicks").select("id", { count: "exact", head: true })
      .eq("partner_name", partner.name).gte("clicked_at", startIso).lt("clicked_at", endIso),
    supabase.from("partner_filter_exposures").select("page_path, filter_context")
      .eq("partner_slug", partner.slug).gte("viewed_at", startIso).lt("viewed_at", endIso),
    supabase.from("visitor_analytics").select("id", { count: "exact", head: true })
      .gte("visited_at", startIso).lt("visited_at", endIso),
    supabase.from("visitor_analytics").select("session_id, ip_anonymized, visited_at")
      .gte("visited_at", startIso).lt("visited_at", endIso).limit(50000),
    supabase.from("funnel_events").select("id", { count: "exact", head: true })
      .eq("event_name", "partner_news_card_click")
      .eq("metadata->>partner_slug", partner.slug)
      .gte("occurred_at", startIso).lt("occurred_at", endIso),
    fetchImpressionSurfaces(supabase, partner.slug, startIso, endIso),
  ]);

  const views = viewsRes.data || [];
  const profileVisits = views.filter((v: any) => v.view_type === "profile_visit").length;
  const cardClicks = views.filter((v: any) => v.view_type === "card_click").length;

  let compareViews = 0;
  let industryListingViews = surfaces.industry;
  let guideListingViews = 0;
  for (const e of exposureRes.data || []) {
    const p = (e.page_path || "").toLowerCase();
    if (p.startsWith("/jamfor-partners")) compareViews++;
    else if (p.startsWith("/valjdynamics365partner") || p.startsWith("/valj")) guideListingViews++;
    else if (p.startsWith("/branscher")) industryListingViews++;
  }

  const uniqueKeys = new Set<string>();
  for (const r of sessionsRes.data || []) {
    // Unik besökare = anonymiserad IP + dag (fallback: session-id + dag)
    const day = String(r.visited_at || "").slice(0, 10);
    const base = r.ip_anonymized && r.ip_anonymized !== "unknown" ? r.ip_anonymized : r.session_id;
    if (base) uniqueKeys.add(`${base}|${day}`);
  }

  const { data: engagement } = await supabase.from("partner_engagement_events")
    .select("event_name, event_level")
    .eq("partner_slug", partner.slug)
    .gte("occurred_at", startIso).lt("occurred_at", endIso).limit(100000);
  let contactRequests = 0;
  let formStarts = 0;
  for (const e of engagement || []) {
    if (Number(e.event_level) === 4) contactRequests++;
    if (e.event_name === "formular_paborjat") formStarts++;
  }

  return {
    profileVisits,
    compareViews,
    cardClicks,
    guideListingViews,
    otherListingViews: surfaces.other,
    newsClicks: newsClicksRes?.count || 0,
    websiteClicks: clicksRes.count || 0,
    industryListingViews,
    sitePageViews: sitePvRes.count || 0,
    siteUniqueVisitors: uniqueKeys.size,
    contactRequests,
    formStarts,
  };
}



/** Summan för samtliga partners under samma period (utan partnerfilter). */
async function fetchAllPartnersPeriod(supabase: any, startIso: string, endIso: string): Promise<PeriodStats> {
  const [viewsRes, clicksRes, exposureRes, newsClicksRes, surfaces] = await Promise.all([
    supabase.from("partner_profile_views").select("view_type")
      .gte("viewed_at", startIso).lt("viewed_at", endIso).limit(100000),
    supabase.from("partner_clicks").select("id", { count: "exact", head: true })
      .gte("clicked_at", startIso).lt("clicked_at", endIso),
    supabase.from("partner_filter_exposures").select("page_path, filter_context")
      .gte("viewed_at", startIso).lt("viewed_at", endIso).limit(100000),
    supabase.from("funnel_events").select("id", { count: "exact", head: true })
      .eq("event_name", "partner_news_card_click")
      .gte("occurred_at", startIso).lt("occurred_at", endIso),
    fetchImpressionSurfaces(supabase, null, startIso, endIso),
  ]);


  const views = viewsRes.data || [];
  let compareViews = 0;
  let industryListingViews = surfaces.industry;
  let guideListingViews = 0;
  for (const e of exposureRes.data || []) {
    const p = (e.page_path || "").toLowerCase();
    if (p.startsWith("/jamfor-partners")) compareViews++;
    else if (p.startsWith("/valjdynamics365partner") || p.startsWith("/valj")) guideListingViews++;
    else if (p.startsWith("/branscher")) industryListingViews++;
  }

  return {
    profileVisits: views.filter((v: any) => v.view_type === "profile_visit").length,
    cardClicks: views.filter((v: any) => v.view_type === "card_click").length,
    compareViews,
    guideListingViews,
    otherListingViews: surfaces.other,
    newsClicks: newsClicksRes?.count || 0,
    websiteClicks: clicksRes.count || 0,
    industryListingViews,
  };
}


async function fetchTopEntryPath(supabase: any, partner: any, startIso: string, endIso: string): Promise<string | null> {
  const { data } = await supabase.from("partner_profile_views").select("referrer, page_source")
    .eq("partner_slug", partner.slug).gte("viewed_at", startIso).lt("viewed_at", endIso).limit(2000);
  if (!data?.length) return null;
  const map = new Map<string, number>();
  for (const v of data) {
    const b = bucketReferrer(v.referrer, v.page_source);
    if (b) map.set(b, (map.get(b) || 0) + 1);
  }
  const top = Array.from(map.entries()).sort((a, b) => b[1] - a[1])[0];
  return top ? top[0] : null;
}

async function fetchIndustryPagesListed(supabase: any, partner: any, startIso: string, endIso: string) {
  const [{ data: exposures }, surfaces] = await Promise.all([
    supabase.from("partner_filter_exposures").select("page_path")
      .eq("partner_slug", partner.slug).gte("viewed_at", startIso).lt("viewed_at", endIso),
    fetchImpressionSurfaces(supabase, partner.slug, startIso, endIso),
  ]);
  const bySlug = new Map<string, number>(surfaces.industryBySlug);
  for (const e of exposures || []) {
    const p: string = e.page_path || "";
    if (!p.startsWith("/branscher/")) continue;
    const slug = p.replace(/^\/branscher\//, "").replace(/\/.*$/, "").replace(/[?#].*$/, "");
    if (slug) bySlug.set(slug, (bySlug.get(slug) || 0) + 1);
  }
  if (bySlug.size === 0) return [];

  const slugs = Array.from(bySlug.keys());
  const { data: pages } = await supabase.from("industry_pages").select("slug, name").in("slug", slugs);
  const nameMap = new Map<string, string>((pages || []).map((p: any) => [p.slug, p.name]));
  return slugs
    .map(slug => ({ slug, name: nameMap.get(slug) || slug, views: bySlug.get(slug) || 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);
}

async function fetchPartnerNews(supabase: any, partner: any, startIso: string, endIso: string) {
  const { data } = await supabase.from("partner_news")
    .select("id, editorial_title, published_at, news_date")
    .eq("partner_id", partner.id).eq("status", "published")
    .gte("published_at", startIso).lt("published_at", endIso)
    .order("published_at", { ascending: false }).limit(10);
  return (data || []).map((n: any) => ({
    title: n.editorial_title || "(namnlös)",
    date: (n.published_at || n.news_date || "").slice(0, 10),
    url: `https://www.d365.se/partnernytt/artikel/${n.id}`,
  }));
}

/** Räknar företag som även besökt behovsanalys/kravspec/jämförelse i samma session. */
export function countActiveEvaluators(companies: any[]): number {
  let n = 0;
  for (const c of companies) {
    const urls: string[] = [];
    for (const s of c.sessions || []) {
      for (const u of s.other_urls || []) urls.push(String(u).toLowerCase());
      for (const u of s.profile_urls || []) urls.push(String(u).toLowerCase());
    }
    if (urls.some(u =>
      u.includes("/behovsanalys") || u.includes("/erpbehovsanalys") || u.includes("/crmbehovsanalys") ||
      u.includes("/kravspecifikation") || u.includes("/jamfor-partners")
    )) n++;
  }
  return n;
}

function shiftDays(dateIso: string, days: number): string {
  const d = new Date(`${dateIso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function buildDraftStats(
  supabase: any,
  partner: { id: string; slug: string; name: string },
  start: string,
  end: string,
  companies: any[],
  opts: { skipPrevious?: boolean } = {},
): Promise<DraftStats> {
  const currentStart = `${start}T00:00:00Z`;
  const currentEnd = `${shiftDays(end, 1)}T00:00:00Z`;



  const [current, benchmark, topEntryPath, industryPagesListed, partnerNews] = await Promise.all([
    fetchPeriod(supabase, partner, currentStart, currentEnd),
    fetchAllPartnersPeriod(supabase, currentStart, currentEnd),
    fetchTopEntryPath(supabase, partner, currentStart, currentEnd),
    fetchIndustryPagesListed(supabase, partner, currentStart, currentEnd),
    fetchPartnerNews(supabase, partner, currentStart, currentEnd),
  ]);

  return {
    current,
    benchmark,
    topEntryPath,
    activeEvaluators: countActiveEvaluators(companies),
    industryPagesListed,
    partnerNews,
    currentLabel: `${start} – ${end}`,
  };
}

function share(cur: number, total: number): string {
  if (!total || total <= 0) return `<span style="color:#94a3b8">–</span>`;
  const pct = Math.round((cur / total) * 100);
  return `<span style="color:#334155;font-weight:600">${pct}%</span>`;
}

/** Tabell med nyckeltal + jämförelse mot samtliga partners under samma period. */
export function renderStatsHtml(stats: DraftStats | null): string {
  if (!stats?.current) return "";
  const { current, benchmark } = stats;
  const cmp = !!benchmark;
  const row = (label: string, cur: number, total: number | null) => `
    <tr>
      <td class="cell" style="padding:11px 14px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:14px;font-weight:600">${esc(label)}</td>
      <td class="cell" style="padding:11px 14px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:14px;text-align:right;font-weight:700;white-space:nowrap">${cur}${total == null ? "" : ` <span style="color:#64748b;font-weight:500;font-size:13px">(av ${total})</span>`}</td>
      ${cmp ? `<td class="cell" style="padding:11px 14px;border-bottom:1px solid #eef0f3;font-size:13px;text-align:right;white-space:nowrap">${total == null ? `<span style="color:#94a3b8">–</span>` : share(cur, total)}</td>` : ""}
    </tr>`;

  // Dölj rader där den totala siffran (alla partners) är under 10 – då riskerar
  // raden mest att väcka frågor snarare än ge en meningsfull bild.
  const show = (total: number | null) => total == null || total >= 10;

  const rows: string[] = [];
  if (show(benchmark?.profileVisits ?? null)) rows.push(row("Profilvisningar", current.profileVisits, benchmark?.profileVisits ?? null));
  if ((current.guideListingViews ?? 0) + (benchmark?.guideListingViews ?? 0) > 0 && show(benchmark?.guideListingViews ?? null)) {
    rows.push(row("Visningar i partnerguiden", current.guideListingViews ?? 0, benchmark?.guideListingViews ?? null));
  }
  if (show(benchmark?.compareViews ?? null)) rows.push(row("Visningar i jämförelsevyn", current.compareViews, benchmark?.compareViews ?? null));
  if (current.websiteClicks + (benchmark?.websiteClicks ?? 0) > 0 && show(benchmark?.websiteClicks ?? null)) {
    rows.push(row("Klick till er webbplats", current.websiteClicks, benchmark?.websiteClicks ?? null));
  }
  if (show(benchmark?.industryListingViews ?? null)) rows.push(row("Visningar av er i branschlistor", current.industryListingViews, benchmark?.industryListingViews ?? null));
  if ((current.otherListingViews ?? 0) + (benchmark?.otherListingViews ?? 0) > 0 && show(benchmark?.otherListingViews ?? null)) {
    rows.push(row("Visningar i övriga partnerlistor (start-, produkt- och katalogsidor)", current.otherListingViews ?? 0, benchmark?.otherListingViews ?? null));
  }
  if ((current.newsClicks ?? 0) + (benchmark?.newsClicks ?? 0) > 0 && show(benchmark?.newsClicks ?? null)) {
    rows.push(row("Klick på era nyhetsartiklar", current.newsClicks ?? 0, benchmark?.newsClicks ?? null));
  }
  if (current.sitePageViews != null) rows.push(row("Totalt antal sidvisningar på d365.se", current.sitePageViews, null));
  if (current.siteUniqueVisitors != null) rows.push(row("Unika besökare på d365.se", current.siteUniqueVisitors, null));

  return `
      <h2 style="margin:0 0 8px;font-size:17px;color:#0f172a">Nyckeltal</h2>
      ${stats.currentLabel ? `<p style="margin:0 0 10px;color:#64748b;font-size:12px">Perioden ${esc(stats.currentLabel)}${cmp ? ", jämfört med summan för samtliga partners på d365.se under samma period." : "."}</p>` : ""}
      <table class="stats-tbl" width="100%" style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
        <thead>
          <tr style="background:#f8fafc">
            <th style="padding:9px 14px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px" class="cell">Mätpunkt</th>
            <th style="padding:9px 14px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Er siffra (alla partners)</th>
            ${cmp ? `<th style="padding:9px 14px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Er andel</th>` : ""}
          </tr>
        </thead>
        <tbody>
          ${rows.join("")}
        </tbody>
      </table>
      <p style="margin:10px 2px 22px;color:#64748b;font-size:12px;line-height:1.5">
        Kontaktförfrågningar skickas till er i realtid via e-post. Siffrorna ovan är summan för perioden. Mätpunkter där den totala volymen för alla partners är under 10 visas inte, eftersom de inte ger någon meningsfull jämförelse.
      </p>`;
}

/** "Var ni syntes": vägen in, branschsidor och partnernyheter. */
export function renderVisibilityHtml(stats: DraftStats | null): string {
  if (!stats) return "";
  const items: string[] = [];
  if (stats.topEntryPath) {
    items.push(`Vanligaste vägen in till er profil: <strong>${esc(stats.topEntryPath)}</strong>.`);
  }
  if (stats.activeEvaluators > 0) {
    items.push(`<strong>${stats.activeEvaluators}</strong> av besökarna tittade även på behovsanalysen, kravspecifikationen eller jämförelsevyn – ofta ett tecken på aktiv utvärdering.`);
  }
  for (const p of stats.industryPagesListed || []) {
    items.push(`Branschguiden för <strong>${esc(p.name)}</strong> – ${p.views} visningar med ert kort under perioden.`);
  }
  for (const n of stats.partnerNews || []) {
    items.push(`Partnernytt ${esc(n.date)}: <a href="${esc(n.url)}" style="color:#1e3a5f">${esc(n.title)}</a>`);
  }
  if (items.length === 0) return "";

  return `
      <div style="margin:26px 0 0">
        <h2 style="margin:0 0 8px;font-size:17px;color:#0f172a">Var ni syntes</h2>
        <ul style="margin:6px 0 0;padding-left:20px;color:#334155;font-size:14px">
          ${items.map(i => `<li style="margin:5px 0;line-height:1.55">${i}</li>`).join("")}
        </ul>
      </div>`;
}
