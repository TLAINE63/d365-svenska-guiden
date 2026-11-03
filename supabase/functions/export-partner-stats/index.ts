// Månadsexport av partnerstatistik (CSV). Samma källor och samma räkning som partner-stats-export
// (Site Intelligence), summerat per partner och månad. Inga besökar-, sessions- eller IP-uppgifter.
import { createClient } from "npm:@supabase/supabase-js@2";
import { exportAuthOk, exportCors } from "../_shared/demandExportAuth.ts";
import { exportHeaders as baseHeaders, toCsv } from "../_shared/demandExport.ts";

const COLUMNS = ["site", "partner_slug", "month", "listings", "card_views", "comparisons", "profile_views", "web_clicks", "phone_clicks", "email_clicks"];
const monthOf = (iso: string) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit" }).format(new Date(iso)).slice(0, 7);

// deno-lint-ignore no-explicit-any
async function fetchAll(sb: any, table: string, cols: string, tsCol: string, since: string, until: string, filter?: (q: any) => any) {
  const out: any[] = [];
  for (let off = 0; ; off += 1000) {
    let q = sb.from(table).select(cols).gte(tsCol, since).lt(tsCol, until).order(tsCol, { ascending: true }).range(off, off + 999);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) throw new Error(table);
    out.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return out;
}

Deno.serve(async (req) => {
  const headers = { ...baseHeaders, ...exportCors(req) };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "GET") return new Response(null, { status: 405, headers });
  if (!(await exportAuthOk(req))) return new Response(null, { status: 401, headers });
  const json = (b: unknown, status: number) => new Response(JSON.stringify(b), { status, headers: { ...headers, "Content-Type": "application/json; charset=utf-8" } });

  const month = new URL(req.url).searchParams.get("month") || "";
  const m = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(month);
  if (!m) return json({ ok: false, error: "invalid_month" }, 400);
  // Hämta med marginal och filtrera exakt på Stockholmsmånad.
  const since = new Date(Date.UTC(+m[1], +m[2] - 1, 1) - 3 * 3600_000).toISOString();
  const until = new Date(Date.UTC(+m[1], +m[2], 1) + 3 * 3600_000).toISOString();

  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
    const [views, exposures, comparisons, clicks, outbound, partners] = await Promise.all([
      fetchAll(sb, "partner_profile_views", "partner_slug,view_type,viewed_at", "viewed_at", since, until, (q) => q.in("view_type", ["profile_visit", "card_click"])),
      fetchAll(sb, "partner_filter_exposures", "partner_slug,viewed_at", "viewed_at", since, until),
      fetchAll(sb, "partner_engagement_events", "partner_slug,occurred_at", "occurred_at", since, until, (q) => q.eq("event_name", "partner_comparison_impression")),
      fetchAll(sb, "partner_clicks", "partner_name,clicked_at", "clicked_at", since, until),
      fetchAll(sb, "partner_tracking_events", "partner_slug,event_name,metadata,created_at", "created_at", since, until, (q) => q.in("event_name", ["partner_outbound_click", "partner_contact_click"])),
      sb.from("partners").select("name,slug").then((r: any) => { if (r.error) throw new Error("partners"); return r.data ?? []; }),
    ]);
    const nameToSlug = new Map<string, string>();
    for (const p of partners) if (p.name && p.slug) nameToSlug.set(String(p.name).trim().toLowerCase(), p.slug);

    // Gamla/felaktiga slugs räknas till nuvarande partner; okända slugs utelämnas.
    const ALIASES: Record<string, string> = { "4ps": "4ps-sweden", "vivicta-se": "vivicta", "YjMtY29uc3": "b3-consulting-group", "b3-cons": "b3-consulting-group" };
    const known = new Set<string>(partners.map((p: any) => p.slug).filter(Boolean));
    const canon = (s: string | null | undefined) => { if (!s) return null; const c = ALIASES[s] ?? s; return known.has(c) ? c : null; };
    type Agg = { listings: number; comparisons: number; profile_views: number; web_clicks: number; phone_clicks: number; email_clicks: number };
    const agg = new Map<string, Agg>();
    const bump = (slug: string | null | undefined, ts: string, key: keyof Agg) => {
      slug = canon(slug); if (!slug || monthOf(ts) !== month) return;
      const a = agg.get(slug) ?? { listings: 0, comparisons: 0, profile_views: 0, web_clicks: 0, phone_clicks: 0, email_clicks: 0 };
      a[key]++;
      agg.set(slug, a);
    };
    // Samma klassning som partner-stats-export: kortklick och filtervisningar = visningar i listor.
    for (const v of views) bump(v.partner_slug, v.viewed_at, v.view_type === "profile_visit" ? "profile_views" : "listings");
    for (const e of exposures) bump(e.partner_slug, e.viewed_at, "listings");
    for (const c of comparisons) bump(c.partner_slug, c.occurred_at, "comparisons");
    for (const c of clicks) bump(nameToSlug.get(String(c.partner_name ?? "").trim().toLowerCase()), c.clicked_at, "web_clicks");
    for (const o of outbound) {
      if (o.event_name === "partner_outbound_click") bump(o.partner_slug, o.created_at, "web_clicks");
      else { const t = (o.metadata as any)?.type; if (t === "phone") bump(o.partner_slug, o.created_at, "phone_clicks"); else if (t === "email") bump(o.partner_slug, o.created_at, "email_clicks"); }
    }

    // card_views mäts inte separat: tomt, aldrig 0.
    const rows = [...agg.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([slug, a]) => ({
      site: "d365.se", partner_slug: slug, month, listings: String(a.listings), card_views: "", comparisons: String(a.comparisons),
      profile_views: String(a.profile_views), web_clicks: String(a.web_clicks), phone_clicks: String(a.phone_clicks), email_clicks: String(a.email_clicks),
    }));
    return new Response(toCsv(COLUMNS, rows), { status: 200, headers: { ...headers, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="d365se-partnerstatistik-${month}.csv"` } });
  } catch {
    return json({ ok: false, error: "export_failed" }, 500);
  }
});
