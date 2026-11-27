// ISV-statistik per produkt (CSV, eller JSON med format=json) för CRM. Admin-JWT eller x-export-key.
// ?days=90 (1–365). Endast aggregat, inga besökar- eller företagsuppgifter.
import { createClient } from "npm:@supabase/supabase-js@2";
import { exportAuthOk, exportCors } from "../_shared/demandExportAuth.ts";
import { exportHeaders as baseHeaders, toCsv } from "../_shared/demandExport.ts";
import { isvStats, periodFromDays } from "../_shared/isvStats.ts";

const COLUMNS = ["site", "solution_id", "product_name", "vendor_slug", "vendor_name", "category", "period_from", "period_to", "views", "unique_sessions", "web_clicks", "help_requests"];

Deno.serve(async (req) => {
  const headers = { ...baseHeaders, ...exportCors(req) };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "GET") return new Response(null, { status: 405, headers });
  if (!(await exportAuthOk(req))) return new Response(null, { status: 401, headers });
  const json = (b: unknown, status: number) => new Response(JSON.stringify(b), { status, headers: { ...headers, "Content-Type": "application/json; charset=utf-8" } });
  const url = new URL(req.url);
  const period = periodFromDays(url.searchParams.get("days"));
  if (!period) return json({ ok: false, error: "invalid_days" }, 400);
  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
    const stats = await isvStats(sb, period.from, period.to);
    if (url.searchParams.get("format") === "json") return json({ ok: true, ...stats }, 200);
    const f = period.from.slice(0, 10), t = period.to.slice(0, 10);
    const rows = stats.products.map((p) => ({ site: "d365.se", solution_id: p.solution_id, product_name: p.product_name, vendor_slug: p.vendor_slug, vendor_name: p.vendor_name, category: p.category, period_from: f, period_to: t, views: String(p.views), unique_sessions: String(p.unique_sessions), web_clicks: String(p.web_clicks), help_requests: String(p.help_requests) }));
    return new Response(toCsv(COLUMNS, rows), { status: 200, headers: { ...headers, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="d365se-isv-statistik-${t}.csv"` } });
  } catch {
    return json({ ok: false, error: "export_failed" }, 500);
  }
});
