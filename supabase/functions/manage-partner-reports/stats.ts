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


export interface PeerMedians {
  /** Antal jämförbara partnerverifierade profiler som medianen bygger på. */
  partnerCount: number;
  profileVisits: number;
  exposures: number;
  contactRequests: number;
  /** Er placering (1 = högst) bland jämförbara partners. */
  rankProfileVisits: number | null;
  rankExposures: number | null;
}

/** Anonymiserat företagsblock: bransch + grov storlek, minst två företag per rad. */
export interface CompanyBlockRow {
  industry: string;
  sizeBucket: string;
  companies: number;
  visits: number;
}

export interface ProfileCompletionItem {
  label: string;
  done: boolean;
}

export interface DraftStats {
  current: PeriodStats;
  /** Summan för samtliga partners under samma period (jämförelsebas). */
  benchmark?: PeriodStats;
  previous?: PeriodStats;
  rolling90?: PeriodStats;
  peers?: PeerMedians;
  companyBlock?: CompanyBlockRow[];
  companyBlockSuppressed?: number;
  profileCompletion?: ProfileCompletionItem[];
  topEntryPath: string | null;
  activeEvaluators: number;
  industryPagesListed: { slug: string; name: string; views: number }[];
  partnerNews: { title: string; date: string; url: string }[];
  currentLabel?: string;
  previousLabel?: string;
  rolling90Label?: string;
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

function median(values: number[]): number {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

/** Medianer och placering bland jämförbara partnerverifierade profiler. */
async function fetchPeerMedians(
  supabase: any,
  slug: string,
  startIso: string,
  endIso: string,
): Promise<PeerMedians | undefined> {
  const { data: peers } = await supabase.from("partners").select("slug").eq("is_featured", true);
  const slugs = (peers || []).map((p: any) => p.slug).filter(Boolean);
  if (slugs.length < 3) return undefined;

  const [viewsRes, exposureRes, eventsRes] = await Promise.all([
    supabase.from("partner_profile_views").select("partner_slug, view_type")
      .gte("viewed_at", startIso).lt("viewed_at", endIso).limit(100000),
    supabase.from("partner_filter_exposures").select("partner_slug")
      .gte("viewed_at", startIso).lt("viewed_at", endIso).limit(100000),
    supabase.from("partner_engagement_events").select("partner_slug, event_level")
      .gte("occurred_at", startIso).lt("occurred_at", endIso).limit(100000),
  ]);

  const visits = new Map<string, number>();
  const exposures = new Map<string, number>();
  const contacts = new Map<string, number>();
  const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) || 0) + 1);
  for (const r of viewsRes.data || []) if (r.view_type === "profile_visit") bump(visits, r.partner_slug);
  for (const r of exposureRes.data || []) bump(exposures, r.partner_slug);
  for (const r of eventsRes.data || []) {
    if (Number(r.event_level) === 1) bump(exposures, r.partner_slug);
    if (Number(r.event_level) === 4) bump(contacts, r.partner_slug);
  }

  const visitSeries = slugs.map((s: string) => visits.get(s) || 0);
  const exposureSeries = slugs.map((s: string) => exposures.get(s) || 0);
  const contactSeries = slugs.map((s: string) => contacts.get(s) || 0);

  const rank = (m: Map<string, number>) => {
    const own = m.get(slug) || 0;
    const higher = slugs.filter((s: string) => (m.get(s) || 0) > own).length;
    return higher + 1;
  };

  return {
    partnerCount: slugs.length,
    profileVisits: median(visitSeries),
    exposures: median(exposureSeries),
    contactRequests: median(contactSeries),
    rankProfileVisits: rank(visits),
    rankExposures: rank(exposures),
  };
}

/** Grovhugget storleksintervall utan att exponera exakt företagsstorlek. */
export function sizeBucket(raw: string | null | undefined): string {
  const m = String(raw || "").match(/\d+/);
  if (!m) return "Okänd storlek";
  const n = parseInt(m[0], 10);
  if (n <= 50) return "1–50 anställda";
  if (n <= 200) return "51–200 anställda";
  if (n <= 1000) return "201–1000 anställda";
  return "1000+ anställda";
}

/**
 * Aggregerar besökande företag till bransch + grov storlek.
 * Rader med färre än två företag slås ihop till "Övriga branscher".
 */
export function buildCompanyBlock(companies: any[]): { rows: CompanyBlockRow[]; suppressed: number } {
  const map = new Map<string, CompanyBlockRow>();
  for (const c of companies || []) {
    const industry = String(c.company_industry || "").trim() || "Bransch ej angiven";
    const bucket = sizeBucket(c.company_size);
    const key = `${industry}|${bucket}`;
    const row = map.get(key) || { industry, sizeBucket: bucket, companies: 0, visits: 0 };
    row.companies += 1;
    row.visits += Number(c.visit_count || 0);
    map.set(key, row);
  }
  const rows: CompanyBlockRow[] = [];
  const other: CompanyBlockRow = { industry: "Övriga branscher", sizeBucket: "Blandat", companies: 0, visits: 0 };
  for (const r of map.values()) {
    if (r.companies >= 2) rows.push(r);
    else { other.companies += r.companies; other.visits += r.visits; }
  }
  rows.sort((a, b) => b.visits - a.visits);
  if (other.companies > 0) rows.push(other);
  return { rows, suppressed: other.companies };
}

/** Vilka delar av profilen som är ifyllda – underlag för komplettering. */
export function buildProfileCompletion(partner: any): ProfileCompletionItem[] {
  const filled = (v: any) => Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim());
  return [
    { label: "Beskrivning av verksamheten", done: filled(partner?.description) },
    { label: "Logotyp", done: filled(partner?.logo_url) },
    { label: "Kontaktperson med bild", done: filled(partner?.contact_person) && filled(partner?.contact_photo_url) },
    { label: "Kundexempel", done: filled(partner?.customer_examples) },
    { label: "Branschinriktning", done: filled(partner?.industries) },
    { label: "Kontorsorter", done: filled(partner?.office_cities) },
    { label: "Positionering", done: filled(partner?.positioning_statement) },
    { label: "Videopresentation", done: filled(partner?.youtube_video_id) },
  ];
}

export async function buildDraftStats(
  supabase: any,
  partner: { id: string; slug: string; name: string },
  start: string,
  end: string,
  companies: any[],
  opts: { skipPrevious?: boolean; partnerRow?: any } = {},
): Promise<DraftStats> {
  const currentStart = `${start}T00:00:00Z`;
  const currentEnd = `${shiftDays(end, 1)}T00:00:00Z`;

  // Föregående period med samma längd samt rullande 90 dagar fram till periodslutet.
  const days = Math.max(
    1,
    Math.round((Date.parse(currentEnd) - Date.parse(currentStart)) / 86400000),
  );
  const prevStartDate = shiftDays(start, -days);
  const previousStart = `${prevStartDate}T00:00:00Z`;
  const previousEnd = currentStart;
  const rolling90Start = `${shiftDays(end, -89)}T00:00:00Z`;

  const [current, benchmark, topEntryPath, industryPagesListed, partnerNews, previous, rolling90, peers] =
    await Promise.all([
      fetchPeriod(supabase, partner, currentStart, currentEnd),
      fetchAllPartnersPeriod(supabase, currentStart, currentEnd),
      fetchTopEntryPath(supabase, partner, currentStart, currentEnd),
      fetchIndustryPagesListed(supabase, partner, currentStart, currentEnd),
      fetchPartnerNews(supabase, partner, currentStart, currentEnd),
      opts.skipPrevious ? Promise.resolve(undefined) : fetchPeriod(supabase, partner, previousStart, previousEnd),
      opts.skipPrevious ? Promise.resolve(undefined) : fetchPeriod(supabase, partner, rolling90Start, currentEnd),
      fetchPeerMedians(supabase, partner.slug, currentStart, currentEnd),
    ]);

  const block = buildCompanyBlock(companies);

  return {
    current,
    benchmark,
    previous,
    rolling90,
    peers,
    companyBlock: block.rows,
    companyBlockSuppressed: block.suppressed,
    profileCompletion: opts.partnerRow ? buildProfileCompletion(opts.partnerRow) : undefined,
    topEntryPath,
    activeEvaluators: countActiveEvaluators(companies),
    industryPagesListed,
    partnerNews,
    currentLabel: `${start} – ${end}`,
    previousLabel: `${prevStartDate} – ${shiftDays(start, -1)}`,
    rolling90Label: `${shiftDays(end, -89)} – ${end}`,
  };

}

function delta(cur: number, prev: number | null | undefined): string {
  if (prev == null) return `<span style="color:#94a3b8">–</span>`;
  const diff = cur - prev;
  if (diff === 0) return `<span style="color:#64748b">${prev} (oförändrat)</span>`;
  const color = diff > 0 ? "#15803d" : "#b45309";
  const sign = diff > 0 ? "+" : "";
  return `<span style="color:#334155">${prev}</span> <span style="color:${color};font-weight:600">(${sign}${diff})</span>`;
}

/** Nyckeltal med föregående period, rullande 90 dagar och median för jämförbara partners. */
export function renderStatsHtml(stats: DraftStats | null): string {
  if (!stats?.current) return "";
  const { current, previous, rolling90, peers } = stats;
  const hasPrev = !!previous;
  const has90 = !!rolling90;
  const hasPeers = !!peers;

  const row = (label: string, cur: number, prev: number | null, r90: number | null, med: number | null) => `
    <tr>
      <td class="cell" style="padding:11px 14px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:14px;font-weight:600">${esc(label)}</td>
      <td class="cell" style="padding:11px 14px;border-bottom:1px solid #eef0f3;color:#0f172a;font-size:14px;text-align:right;font-weight:700;white-space:nowrap">${cur}</td>
      ${hasPrev ? `<td class="cell col-prev" style="padding:11px 14px;border-bottom:1px solid #eef0f3;font-size:13px;text-align:right;white-space:nowrap">${delta(cur, prev)}</td>` : ""}
      ${has90 ? `<td class="cell col-prev" style="padding:11px 14px;border-bottom:1px solid #eef0f3;font-size:13px;text-align:right;white-space:nowrap;color:#334155">${r90 == null ? "–" : r90}</td>` : ""}
      ${hasPeers ? `<td class="cell" style="padding:11px 14px;border-bottom:1px solid #eef0f3;font-size:13px;text-align:right;white-space:nowrap;color:#334155">${med == null ? "–" : med}</td>` : ""}
    </tr>`;

  const exposureOf = (p?: PeriodStats | null) => p
    ? (p.guideListingViews ?? 0) + p.compareViews + p.industryListingViews + (p.otherListingViews ?? 0)
    : null;

  const rows: string[] = [];
  rows.push(row("Profilvisningar", current.profileVisits, previous?.profileVisits ?? null, rolling90?.profileVisits ?? null, peers?.profileVisits ?? null));
  rows.push(row("Visningar i listor, filter och jämförelser", exposureOf(current) ?? 0, exposureOf(previous), exposureOf(rolling90), peers?.exposures ?? null));
  // Kontaktförfrågningar visas alltid, även när värdet är noll.
  rows.push(row("Kontaktförfrågningar via d365.se", current.contactRequests ?? 0, previous?.contactRequests ?? null, rolling90?.contactRequests ?? null, peers?.contactRequests ?? null));
  if ((current.formStarts ?? 0) + (previous?.formStarts ?? 0) > 0) {
    rows.push(row("Påbörjade formulär på er profil", current.formStarts ?? 0, previous?.formStarts ?? null, rolling90?.formStarts ?? null, null));
  }
  if ((current.newsClicks ?? 0) + (previous?.newsClicks ?? 0) > 0) {
    rows.push(row("Klick på era nyhetsartiklar", current.newsClicks ?? 0, previous?.newsClicks ?? null, rolling90?.newsClicks ?? null, null));
  }

  const th = (t: string, align = "right") =>
    `<th style="padding:9px 14px;text-align:${align};font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">${esc(t)}</th>`;

  return `
      <h2 style="margin:0 0 8px;font-size:17px;color:#0f172a">Nyckeltal</h2>
      <p style="margin:0 0 10px;color:#64748b;font-size:12px;line-height:1.5">
        Perioden ${esc(stats.currentLabel || "")}${hasPeers ? `. Medianen avser ${peers!.partnerCount} partnerverifierade profiler under samma period.` : "."}
      </p>
      <table class="stats-tbl" width="100%" style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
        <thead>
          <tr style="background:#f8fafc">
            ${th("Mätpunkt", "left")}
            ${th("Er siffra")}
            ${hasPrev ? th("Föregående period") : ""}
            ${has90 ? th("Rullande 90 dagar") : ""}
            ${hasPeers ? th("Median partners") : ""}
          </tr>
        </thead>
        <tbody>${rows.join("")}</tbody>
      </table>
      <p style="margin:10px 2px 20px;color:#64748b;font-size:12px;line-height:1.5">
        Kontaktförfrågningar redovisas alltid, även när de är noll. Föregående period avser ${esc(stats.previousLabel || "motsvarande föregående intervall")}${has90 ? `, rullande 90 dagar avser ${esc(stats.rolling90Label || "")}` : ""}.
      </p>
      ${renderExposureChart(stats)}
      ${renderInsightsHtml(stats)}`;
}

/** Tabellbaserat stapeldiagram över var ni syntes (inga bilder, ingen SVG). */
export function renderExposureChart(stats: DraftStats | null): string {
  const c = stats?.current;
  if (!c) return "";
  const parts = [
    { label: "Partnerguiden", value: c.guideListingViews ?? 0 },
    { label: "Jämförelsevyn", value: c.compareViews },
    { label: "Branschlistor", value: c.industryListingViews },
    { label: "Start-, produkt- och katalogsidor", value: c.otherListingViews ?? 0 },
  ].filter(p => p.value > 0);
  const total = parts.reduce((s, p) => s + p.value, 0);
  if (!total) return "";
  const max = Math.max(...parts.map(p => p.value));

  const rows = parts.map(p => {
    const pct = Math.max(2, Math.round((p.value / max) * 100));
    return `
      <tr>
        <td style="padding:6px 10px 6px 0;font-size:13px;color:#334155;width:45%">${esc(p.label)}</td>
        <td style="padding:6px 0">
          <table width="100%" style="width:100%;border-collapse:collapse"><tr>
            <td style="background:#B23D19;height:12px;line-height:12px;font-size:0;border-radius:6px;width:${pct}%">&nbsp;</td>
            <td style="width:${100 - pct}%">&nbsp;</td>
          </tr></table>
        </td>
        <td style="padding:6px 0 6px 10px;font-size:13px;color:#0f172a;font-weight:600;text-align:right;white-space:nowrap">${p.value}</td>
      </tr>`;
  }).join("");

  return `
      <h3 style="margin:18px 0 6px;font-size:15px;color:#0f172a">Fördelning av era visningar</h3>
      <table width="100%" style="width:100%;border-collapse:collapse;margin:0 0 18px">${rows}</table>`;
}

/** Regelgenererade tolkningsrader – ingen fritext, inga påhittade slutsatser. */
export function renderInsightsHtml(stats: DraftStats | null): string {
  if (!stats?.current) return "";
  const c = stats.current;
  const prev = stats.previous;
  const peers = stats.peers;
  const lines: string[] = [];

  if (prev && prev.profileVisits > 0) {
    const diff = c.profileVisits - prev.profileVisits;
    const pct = Math.round((diff / prev.profileVisits) * 100);
    if (Math.abs(pct) >= 10) {
      lines.push(`Profilvisningarna ${diff > 0 ? "ökade" : "minskade"} med ${Math.abs(pct)} procent jämfört med föregående period.`);
    } else {
      lines.push("Profilvisningarna ligger på ungefär samma nivå som föregående period.");
    }
  }
  if (peers) {
    if (c.profileVisits > peers.profileVisits) lines.push(`Er profil hade fler visningar än medianen bland jämförbara partnerverifierade profiler (${peers.profileVisits}).`);
    else if (c.profileVisits < peers.profileVisits) lines.push(`Er profil hade färre visningar än medianen bland jämförbara partnerverifierade profiler (${peers.profileVisits}).`);
    if (peers.rankProfileVisits) lines.push(`Placering på profilvisningar: ${peers.rankProfileVisits} av ${peers.partnerCount}.`);
  }
  const contacts = c.contactRequests ?? 0;
  if (contacts === 0 && c.profileVisits > 0) {
    lines.push("Inga kontaktförfrågningar registrerades under perioden trots att profilen visades – en mer komplett profil brukar öka andelen som tar kontakt.");
  } else if (contacts > 0) {
    lines.push(`${contacts} kontaktförfrågning${contacts === 1 ? "" : "ar"} förmedlades via d365.se under perioden.`);
  }
  const missing = (stats.profileCompletion || []).filter(i => !i.done).length;
  if (missing > 0) lines.push(`${missing} fält i er profil är ännu inte ifyllda.`);

  if (!lines.length) return "";
  return `
      <div style="margin:0 0 22px;padding:14px 16px;background:#f8fafc;border-left:4px solid #B23D19;border-radius:6px">
        <div style="font-size:13px;color:#0f172a;font-weight:700;margin-bottom:6px">Så läser ni siffrorna</div>
        <ul style="margin:0;padding-left:18px;color:#334155;font-size:13px;line-height:1.6">
          ${lines.map(l => `<li style="margin:3px 0">${esc(l)}</li>`).join("")}
        </ul>
      </div>`;
}

/** Anonymiserat företagsblock: bransch + grov storlek, minst två företag per rad. */
export function renderCompanyBlockHtml(stats: DraftStats | null): string {
  const rows = stats?.companyBlock || [];
  if (!rows.length) {
    return `
      <h2 style="margin:26px 0 8px;font-size:17px;color:#0f172a">Vilka typer av företag som besökt er profil</h2>
      <p style="margin:0;color:#64748b;font-size:13px">Inga identifierade företagsbesök under perioden.</p>`;
  }
  const body = rows.map(r => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #eef0f3;font-size:14px;color:#0f172a">${esc(r.industry)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #eef0f3;font-size:13px;color:#475569">${esc(r.sizeBucket)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #eef0f3;font-size:14px;color:#0f172a;text-align:right;font-weight:600">${r.companies}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #eef0f3;font-size:14px;color:#0f172a;text-align:right;font-weight:600">${r.visits}</td>
    </tr>`).join("");

  return `
      <h2 style="margin:26px 0 8px;font-size:17px;color:#0f172a">Vilka typer av företag som besökt er profil</h2>
      <p style="margin:0 0 12px;color:#64748b;font-size:12px;line-height:1.55">
        Redovisningen är anonymiserad. Vi lämnar aldrig ut företagsnamn, domän, ort eller besöksdatum – endast bransch, grovt storleksintervall och antal besök. Kombinationer med färre än två företag redovisas som "Övriga branscher".
      </p>
      <table width="100%" style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
        <thead><tr style="background:#f8fafc">
          <th style="padding:9px 14px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Bransch</th>
          <th style="padding:9px 14px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Storlek</th>
          <th style="padding:9px 14px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Företag</th>
          <th style="padding:9px 14px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Besök</th>
        </tr></thead>
        <tbody>${body}</tbody>
      </table>`;
}

/** Profilkomplettering: vad som är ifyllt och vad som saknas. */
export function renderProfileCompletionHtml(stats: DraftStats | null): string {
  const items = stats?.profileCompletion || [];
  if (!items.length) return "";
  const done = items.filter(i => i.done).length;
  const missing = items.filter(i => !i.done);
  return `
      <h2 style="margin:26px 0 8px;font-size:17px;color:#0f172a">Er profil</h2>
      <p style="margin:0 0 10px;color:#334155;font-size:14px;line-height:1.6">
        ${done} av ${items.length} delar av profilen är ifyllda.
      </p>
      ${missing.length ? `
      <table width="100%" style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
        <tbody>${missing.map(i => `
          <tr><td style="padding:9px 14px;border-bottom:1px solid #eef0f3;font-size:13px;color:#475569">Saknas: ${esc(i.label)}</td></tr>`).join("")}
        </tbody>
      </table>` : `<p style="margin:0;color:#15803d;font-size:13px">Profilen är komplett.</p>`}`;
}

/** Ett enda CTA, valt utifrån data. */
export function chooseCta(stats: DraftStats | null, profileUrl: string): { label: string; url: string; text: string } {
  const c = stats?.current;
  const missing = (stats?.profileCompletion || []).filter(i => !i.done);
  if (missing.length >= 3) {
    return {
      label: "Komplettera er profil",
      url: profileUrl,
      text: `Flera fält saknas i er profil. Kompletta profiler ger köpare mer att gå på i jämförelser.`,
    };
  }
  if ((c?.contactRequests ?? 0) === 0 && (c?.profileVisits ?? 0) > 0) {
    return {
      label: "Se er profil som köparen ser den",
      url: profileUrl,
      text: "Profilen visades under perioden men gav inga kontaktförfrågningar. Gå igenom hur erbjudandet presenteras.",
    };
  }
  return {
    label: "Öppna er partnerprofil",
    url: profileUrl,
    text: "Här ser ni samma vy som köpare möter på d365.se.",
  };
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
