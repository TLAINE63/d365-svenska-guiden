// ISV-statistik per produkt och tilläggsområde. Delas av export-isv-stats (CRM) och
// manage-isv-solutions action product_stats (Admin/Redaktion). Endast aggregat: inga
// sessions-id, IP-adresser eller företagsnamn lämnar funktionen.

export interface IsvProductStat { solution_id: string; product_name: string; vendor_slug: string; vendor_name: string; category: string; views: number; unique_sessions: number; web_clicks: number; help_requests: number }
export interface IsvAreaStat { path: string; views: number; unique_sessions: number }
export interface IsvStats { from: string; to: string; products: IsvProductStat[]; areas: IsvAreaStat[]; totals: { product_views: number; area_views: number; unique_sessions: number; web_clicks: number; help_requests: number } }

const clean = (p: string) => { const s = String(p || "").split("?")[0].split("#")[0]; return s.length > 1 ? s.replace(/\/+$/, "") + "/" : s; };

// deno-lint-ignore no-explicit-any
async function pageAll(build: (off: number) => any) {
  // deno-lint-ignore no-explicit-any
  const out: any[] = [];
  for (let off = 0; off < 200000; off += 1000) {
    const { data, error } = await build(off);
    if (error) throw new Error("stats_query");
    out.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return out;
}

// deno-lint-ignore no-explicit-any
export async function isvStats(sb: any, fromIso: string, toIso: string): Promise<IsvStats> {
  const [visits, events, products] = await Promise.all([
    pageAll((o) => sb.from("visitor_analytics").select("page_path,session_id").gte("visited_at", fromIso).lt("visited_at", toIso)
      .or("page_path.like./isv/produkt/%,page_path.ilike.%tillagg%").order("visited_at").range(o, o + 999)),
    pageAll((o) => sb.from("funnel_events").select("event_name,metadata").gte("occurred_at", fromIso).lt("occurred_at", toIso)
      .in("event_name", ["isv_product_viewed", "isv_product_selfservice_clicked", "isv_product_help_requested"]).order("occurred_at").range(o, o + 999)),
    pageAll((o) => sb.from("isv_solutions").select("solution_id,name,vendor,vendor_slug,category").order("solution_id").range(o, o + 999)),
  ]);
  const meta = new Map(products.map((p) => [p.solution_id, p]));
  const prod = new Map<string, { views: number; s: Set<string>; clicks: number; help: number }>();
  const get = (id: string) => { let r = prod.get(id); if (!r) { r = { views: 0, s: new Set(), clicks: 0, help: 0 }; prod.set(id, r); } return r; };
  const areas = new Map<string, { views: number; s: Set<string> }>();
  const all = new Set<string>();
  for (const v of visits) {
    const path = clean(v.page_path);
    if (v.session_id) all.add(v.session_id);
    const m = /^\/isv\/produkt\/([^/]+)\/$/.exec(path);
    if (m) { const id = decodeURIComponent(m[1]); if (!meta.has(id)) continue; const r = get(id); r.views++; if (v.session_id) r.s.add(v.session_id); continue; }
    const a = areas.get(path) ?? { views: 0, s: new Set<string>() };
    a.views++; if (v.session_id) a.s.add(v.session_id); areas.set(path, a);
  }
  for (const e of events) {
    const id = e.metadata?.product_id;
    if (typeof id !== "string" || !meta.has(id)) continue;
    if (e.event_name === "isv_product_selfservice_clicked") get(id).clicks++;
    else if (e.event_name === "isv_product_help_requested") get(id).help++;
  }
  const productRows: IsvProductStat[] = [...prod.entries()].map(([id, r]) => {
    const p = meta.get(id) ?? {};
    return { solution_id: id, product_name: p.name ?? "", vendor_slug: p.vendor_slug ?? "", vendor_name: p.vendor ?? "", category: p.category ?? "", views: r.views, unique_sessions: r.s.size, web_clicks: r.clicks, help_requests: r.help };
  }).sort((a, b) => b.views - a.views || a.solution_id.localeCompare(b.solution_id));
  const areaRows = [...areas.entries()].map(([path, a]) => ({ path, views: a.views, unique_sessions: a.s.size })).sort((a, b) => b.views - a.views);
  const sum = (k: keyof IsvProductStat) => productRows.reduce((n, r) => n + (r[k] as number), 0);
  return { from: fromIso, to: toIso, products: productRows, areas: areaRows, totals: { product_views: sum("views"), area_views: areaRows.reduce((n, r) => n + r.views, 0), unique_sessions: all.size, web_clicks: sum("web_clicks"), help_requests: sum("help_requests") } };
}

/** days (1–365) bakåt från nu. */
export function periodFromDays(raw: string | null): { from: string; to: string } | null {
  const d = Number(raw ?? "90");
  if (!Number.isInteger(d) || d < 1 || d > 365) return null;
  const to = new Date();
  return { from: new Date(to.getTime() - d * 86400000).toISOString(), to: to.toISOString() };
}
