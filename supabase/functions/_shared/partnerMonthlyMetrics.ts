// Shared partner metrics: used by manage-partner-reports (partner_monthly_stats)
// and partner-teaser so the teaser always shows the same numbers as the monthly report.
// deno-lint-ignore-file no-explicit-any
export type PartnerMetrics = { profileViews: number; profileVisitors: number; listed: number; matched: number; compared: number; saved: number; websiteClicks: number };
export type PartnerMetricRow = { slug: string; name: string; is_featured: boolean; current: PartnerMetrics | null; previous: PartnerMetrics | null };

export async function computePartnerMetrics(supabase: any, prevStart: Date, curStart: Date, curEnd: Date): Promise<PartnerMetricRow[]> {
  const iso = (d: Date) => d.toISOString();
  const fetchAll = async (table: string, cols: string, tsCol: string) => {
    const out: any[] = [];
    for (let from = 0; ; from += 1000) {
      const { data: rows, error } = await supabase.from(table).select(cols).gte(tsCol, iso(prevStart)).lt(tsCol, iso(curEnd)).range(from, from + 999);
      if (error) throw error;
      out.push(...(rows || []));
      if (!rows || rows.length < 1000) break;
    }
    return out;
  };
  const [{ data: partners }, views, events, exposures, clicks] = await Promise.all([
    supabase.from("partners").select("slug, name, is_featured"),
    fetchAll("partner_profile_views", "partner_slug, view_type, ip_address_anonymized, viewed_at", "viewed_at"),
    fetchAll("partner_engagement_events", "partner_slug, event_name, visitor_id, session_id, ip_anonymized, occurred_at", "occurred_at"),
    fetchAll("partner_filter_exposures", "partner_slug, page_path, session_id, ip_anonymized, viewed_at", "viewed_at"),
    fetchAll("partner_clicks", "partner_name, clicked_at", "clicked_at"),
  ]);
  const nameBySlug = new Map<string, string>();
  const slugByName = new Map<string, string>();
  for (const p of partners || []) { nameBySlug.set(p.slug, p.name); slugByName.set(String(p.name).toLowerCase(), p.slug); }
  type B = { profileViews: number; profileU: Set<string>; listedU: Set<string>; matchedU: Set<string>; comparedU: Set<string>; saved: number; websiteClicks: number };
  const mk = (): B => ({ profileViews: 0, profileU: new Set(), listedU: new Set(), matchedU: new Set(), comparedU: new Set(), saved: 0, websiteClicks: 0 });
  const buckets = { cur: new Map<string, B>(), prev: new Map<string, B>() };
  const get = (slug: string, ts: string) => {
    const map = new Date(ts) >= curStart ? buckets.cur : buckets.prev;
    let b = map.get(slug); if (!b) { b = mk(); map.set(slug, b); }
    return b;
  };
  const LISTED = new Set(["partner_list_impression", "partner_filter_impression"]);
  const MATCHED = new Set(["partner_match_impression", "partner_match_recommended", "partner_match_selected"]);
  const COMPARED = new Set(["partner_comparison_impression", "partner_added_to_comparison", "lagg_till_jamforelse"]);
  const SAVED = new Set(["partner_saved", "spara_shortlist"]);
  for (const v of views) {
    if (!v.partner_slug || v.view_type !== "profile_visit") continue;
    const b = get(v.partner_slug, v.viewed_at); b.profileViews++; b.profileU.add(v.ip_address_anonymized || "?");
  }
  for (const e of events) {
    if (!e.partner_slug) continue;
    const b = get(e.partner_slug, e.occurred_at);
    const vid = e.visitor_id || e.session_id || e.ip_anonymized || "?";
    if (LISTED.has(e.event_name)) b.listedU.add(vid);
    else if (MATCHED.has(e.event_name)) b.matchedU.add(vid);
    else if (COMPARED.has(e.event_name)) b.comparedU.add(vid);
    else if (SAVED.has(e.event_name)) b.saved++;
    else if (e.event_name === "klick_utgaende_partnersajt") b.websiteClicks++;
  }
  for (const x of exposures) {
    if (!x.partner_slug) continue;
    const b = get(x.partner_slug, x.viewed_at);
    const vid = x.session_id || x.ip_anonymized || "?";
    if (x.page_path === "/jamfor-partners") b.comparedU.add(vid); else b.listedU.add(vid);
  }
  for (const c of clicks) {
    const slug = slugByName.get(String(c.partner_name || "").toLowerCase());
    if (slug) get(slug, c.clicked_at).websiteClicks++;
  }
  const flat = (b?: B): PartnerMetrics | null => b ? {
    profileViews: b.profileViews, profileVisitors: b.profileU.size, listed: b.listedU.size,
    matched: b.matchedU.size, compared: b.comparedU.size, saved: b.saved, websiteClicks: b.websiteClicks,
  } : null;
  const slugs = new Set([...buckets.cur.keys(), ...buckets.prev.keys()]);
  return [...slugs].map((slug) => ({
    slug, name: nameBySlug.get(slug) || slug, is_featured: Boolean((partners || []).find((p: any) => p.slug === slug)?.is_featured),
    current: flat(buckets.cur.get(slug)), previous: flat(buckets.prev.get(slug)),
  })).sort((a, b) => a.name.localeCompare(b.name, "sv"));
}

/** Pages aimed at partners or at d365.se itself; never counted as buyer traffic. */
export const INTERNAL_PATH_PREFIXES = ["/partnerprogram", "/isvprogram", "/redaktion", "/admin", "/partner-update", "/partner-uppdatering", "/partner-performance", "/partnerstatistik", "/isv-profil"];
export function isInternalPath(path: string | null | undefined): boolean {
  const p = String(path || "").toLowerCase();
  return INTERNAL_PATH_PREFIXES.some((x) => p === x || p.startsWith(x + "/") || p.startsWith(x + "?"));
}
