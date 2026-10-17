// Aggregated partner statistics for the internal Site Intelligence tool.
// Protected by x-export-secret (SITE_INTELLIGENCE_EXPORT_SECRET). No PII is returned.
import { createClient } from "npm:@supabase/supabase-js@2";

const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

function safeEqual(a: string, b: string) {
  const ea = new TextEncoder().encode(a), eb = new TextEncoder().encode(b);
  if (ea.length !== eb.length) return false;
  let d = 0;
  for (let i = 0; i < ea.length; i++) d |= ea[i] ^ eb[i];
  return d === 0;
}

const fmt = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit" });
const stockholmDate = (iso: string) => fmt.format(new Date(iso));

// Approximate start of a Stockholm day in UTC (pad 2h back, filter precisely by local date after).
function fromBoundUtc(date: string) {
  return new Date(new Date(`${date}T00:00:00Z`).getTime() - 2 * 3600_000).toISOString();
}

// deno-lint-ignore no-explicit-any
async function fetchAll(sb: any, table: string, cols: string, tsCol: string, since: string, filter?: (q: any) => any) {
  const out: any[] = [];
  const page = 1000;
  for (let off = 0; ; off += page) {
    let q = sb.from(table).select(cols).gte(tsCol, since).order(tsCol, { ascending: true }).range(off, off + page - 1);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...(data ?? []));
    if (!data || data.length < page) break;
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const secret = Deno.env.get("SITE_INTELLIGENCE_EXPORT_SECRET") ?? "";
  const given = req.headers.get("x-export-secret") ?? "";
  if (!secret || !safeEqual(given, secret)) return json({ error: "Unauthorized" }, 401);

  const url = new URL(req.url);
  const today = stockholmDate(new Date().toISOString());
  let from = url.searchParams.get("from");
  if (from) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || isNaN(Date.parse(from))) return json({ error: "from must be YYYY-MM-DD" }, 400);
  } else {
    from = stockholmDate(new Date(Date.now() - 180 * 86400_000).toISOString());
  }
  const since = fromBoundUtc(from);

  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

    const [views, exposures, comparisons, clicks, partners] = await Promise.all([
      fetchAll(sb, "partner_profile_views", "partner_slug,view_type,viewed_at", "viewed_at", since,
        (q) => q.in("view_type", ["profile_visit", "card_click"])),
      fetchAll(sb, "partner_filter_exposures", "partner_slug,viewed_at", "viewed_at", since),
      fetchAll(sb, "partner_engagement_events", "partner_slug,occurred_at", "occurred_at", since,
        (q) => q.eq("event_name", "partner_comparison_impression")),
      fetchAll(sb, "partner_clicks", "partner_name,clicked_at", "clicked_at", since),
      sb.from("partners").select("name,slug").then((r: any) => { if (r.error) throw new Error(r.error.message); return r.data ?? []; }),
    ]);

    const nameToSlug = new Map<string, string>();
    for (const p of partners) if (p.name && p.slug) nameToSlug.set(String(p.name).trim().toLowerCase(), p.slug);

    type Row = { slug: string; date: string; profile_views: number; card_impressions: number; comparison_impressions: number; website_clicks: number };
    const rows = new Map<string, Row>();
    const bump = (slug: string | null | undefined, ts: string, key: keyof Omit<Row, "slug" | "date">) => {
      if (!slug) return;
      const date = stockholmDate(ts);
      if (date < from! || date > today) return;
      const k = `${slug}|${date}`;
      let r = rows.get(k);
      if (!r) { r = { slug, date, profile_views: 0, card_impressions: 0, comparison_impressions: 0, website_clicks: 0 }; rows.set(k, r); }
      r[key]++;
    };

    for (const v of views) bump(v.partner_slug, v.viewed_at, v.view_type === "profile_visit" ? "profile_views" : "card_impressions");
    for (const e of exposures) bump(e.partner_slug, e.viewed_at, "card_impressions");
    for (const c of comparisons) bump(c.partner_slug, c.occurred_at, "comparison_impressions");
    for (const c of clicks) bump(nameToSlug.get(String(c.partner_name ?? "").trim().toLowerCase()), c.clicked_at, "website_clicks");

    const out = [...rows.values()].sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
    return json({ from, to: today, timezone: "Europe/Stockholm", rows: out });
  } catch (e) {
    console.error("partner-stats-export failed:", (e as Error).message);
    return json({ error: "Internal error" }, 500);
  }
});
