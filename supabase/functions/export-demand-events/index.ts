// Skyddad export av demand_events till Demand Engine.
import { createClient } from "npm:@supabase/supabase-js@2";
import { exportAuthOk, exportCors } from "../_shared/demandExportAuth.ts";
import { exportHeaders as baseHeaders, isoStockholm, parseRange, str, toCsv } from "../_shared/demandExport.ts";

const COLUMNS = ["event_id", "site", "occurred_at", "event_type", "object", "path", "company_domain"];

Deno.serve(async (req) => {
  const exportHeaders = { ...baseHeaders, ...exportCors(req) };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: exportHeaders });
  if (req.method !== "GET") return new Response(null, { status: 405, headers: exportHeaders });
  if (!(await exportAuthOk(req))) return new Response(null, { status: 401, headers: exportHeaders });
  const url = new URL(req.url);
  const range = parseRange(url);
  const json = (b: unknown, status: number) => new Response(JSON.stringify(b), { status, headers: { ...exportHeaders, "Content-Type": "application/json; charset=utf-8" } });
  if (!range) return json({ ok: false, error: "invalid_date" }, 400);
  const format = url.searchParams.get("format") === "json" ? "json" : "csv";
  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const rows: Record<string, string>[] = [];
    const PAGE = 1000;
    for (let from = 0; ; from += PAGE) {
      let q = sb.from("demand_events").select("event_id, site, occurred_at, event_type, object, path, company_domain")
        .gte("occurred_at", range.start).lt("occurred_at", range.end)
        .order("occurred_at", { ascending: true }).order("event_id", { ascending: true }).range(from, from + PAGE - 1);
      if (url.searchParams.get("company") === "1") q = q.not("company_domain", "is", null).neq("company_domain", "");
      const { data, error } = await q;
      if (error) return json({ ok: false, error: "query_failed" }, 500);
      for (const r of data || []) rows.push({ event_id: str(r.event_id), site: str(r.site), occurred_at: isoStockholm(r.occurred_at), event_type: str(r.event_type), object: str(r.object), path: str(r.path), company_domain: str(r.company_domain) });
      if (!data || data.length < PAGE) break;
    }
    if (format === "json") return json({ ok: true, rows }, 200);
    return new Response(toCsv(COLUMNS, rows), { status: 200, headers: { ...exportHeaders, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="d365se-handelser.csv"` } });
  } catch {
    return json({ ok: false, error: "export_failed" }, 500);
  }
});
