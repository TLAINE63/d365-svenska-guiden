import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const ALLOWED_ORIGINS = [
  "https://d365.se",
  "https://www.d365.se",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowed = ALLOWED_ORIGINS.includes(origin)
    || origin.endsWith(".lovableproject.com")
    || origin.endsWith(".lovable.app");
  return {
    "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };
}

function base64UrlToBase64(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function base64UrlDecode(s: string): Uint8Array {
  const bin = atob(base64UrlToBase64(s));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function verifyJWT(token: string, secret: string) {
  try {
    const [h, p, sig] = token.split(".");
    if (!h || !p || !sig) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
    );
    const ok = await crypto.subtle.verify(
      "HMAC", key, base64UrlDecode(sig) as unknown as BufferSource, enc.encode(`${h}.${p}`)
    );
    if (!ok) return false;
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (payload.role !== "admin") return false;
    return true;
  } catch { return false; }
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...headers, "Content-Type": "application/json" }
  });
}

function normaliseMonth(input: string): string | null {
  if (!input) return null;
  const m = input.match(/^(\d{4})-(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-01`;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!token || !(await verifyJWT(token, secret))) {
      return json({ error: "Unauthorized" }, 401, corsHeaders);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "list";

    if (action === "list" && req.method === "GET") {
      const { data, error } = await supabase
        .from("semrush_monthly_stats")
        .select("*")
        .order("month", { ascending: false });
      if (error) throw error;
      return json({ stats: data || [] }, 200, corsHeaders);
    }

    if (action === "save" && req.method === "POST") {
      const body = await req.json();
      const { id, ...fields } = body;
      const month = normaliseMonth(fields.month || "");
      if (!month) return json({ error: "Månad krävs (YYYY-MM)" }, 400, corsHeaders);

      const toNum = (v: unknown) => (v === "" || v === null || v === undefined ? null : Number(v));
      const toJson = (v: unknown) => {
        if (Array.isArray(v)) return v;
        if (typeof v === "string" && v.trim()) {
          try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
        }
        return [];
      };

      const payload: Record<string, unknown> = {
        month,
        organic_traffic: toNum(fields.organic_traffic),
        organic_keywords: toNum(fields.organic_keywords),
        authority_score: toNum(fields.authority_score),
        backlinks: toNum(fields.backlinks),
        referring_domains: toNum(fields.referring_domains),
        top_keywords: toJson(fields.top_keywords),
        top_pages: toJson(fields.top_pages),
        notes: fields.notes?.trim() || null,
      };

      let result;
      if (id) {
        const { data, error } = await supabase
          .from("semrush_monthly_stats").update(payload).eq("id", id).select().single();
        if (error) return json({ error: error.message }, 400, corsHeaders);
        result = data;
      } else {
        const { data, error } = await supabase
          .from("semrush_monthly_stats")
          .upsert(payload, { onConflict: "month" })
          .select().single();
        if (error) return json({ error: error.message }, 400, corsHeaders);
        result = data;
      }
      return json({ stat: result }, 200, corsHeaders);
    }

    if (action === "delete" && req.method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id krävs" }, 400, corsHeaders);
      const { error } = await supabase.from("semrush_monthly_stats").delete().eq("id", id);
      if (error) return json({ error: error.message }, 400, corsHeaders);
      return json({ success: true }, 200, corsHeaders);
    }

    // Aggregera partner-profilvisningar per slug och månad.
    if (action === "partner-views" && req.method === "GET") {
      const months = Math.max(1, Math.min(24, Number(url.searchParams.get("months") || "6")));
      const since = new Date();
      since.setUTCMonth(since.getUTCMonth() - (months - 1));
      since.setUTCDate(1);
      since.setUTCHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("partner_profile_views")
        .select("partner_slug, viewed_at, view_type")
        .gte("viewed_at", since.toISOString())
        .limit(50000);
      if (error) throw error;

      // Map: slug -> { total, byMonth: { 'YYYY-MM': n }, lastView }
      type Agg = { slug: string; total: number; byMonth: Record<string, number>; lastView: string };
      const map = new Map<string, Agg>();
      for (const r of data || []) {
        const slug = r.partner_slug as string;
        const ym = (r.viewed_at as string).slice(0, 7);
        const cur = map.get(slug) || { slug, total: 0, byMonth: {}, lastView: r.viewed_at as string };
        cur.total += 1;
        cur.byMonth[ym] = (cur.byMonth[ym] || 0) + 1;
        if ((r.viewed_at as string) > cur.lastView) cur.lastView = r.viewed_at as string;
        map.set(slug, cur);
      }

      // Hämta partnernamn för slugs (för läsbarhet).
      const slugs = Array.from(map.keys());
      let nameBySlug: Record<string, string> = {};
      if (slugs.length) {
        const { data: pData } = await supabase
          .from("partners")
          .select("slug, name")
          .in("slug", slugs);
        nameBySlug = Object.fromEntries((pData || []).map((p: any) => [p.slug, p.name]));
      }

      // Bygg månadslista (kronologisk).
      const monthsList: string[] = [];
      const cursor = new Date(since);
      for (let i = 0; i < months; i++) {
        monthsList.push(cursor.toISOString().slice(0, 7));
        cursor.setUTCMonth(cursor.getUTCMonth() + 1);
      }

      const rows = Array.from(map.values())
        .map((a) => ({
          slug: a.slug,
          name: nameBySlug[a.slug] || a.slug,
          total: a.total,
          last_view: a.lastView,
          by_month: monthsList.map((m) => a.byMonth[m] || 0),
        }))
        .sort((a, b) => b.total - a.total);

      const totals = monthsList.map((m) =>
        rows.reduce((sum, r, i) => sum + r.by_month[monthsList.indexOf(m)], 0)
      );

      return json({ months: monthsList, rows, totals }, 200, corsHeaders);
    }

    return json({ error: "Unknown action" }, 400, corsHeaders);
  } catch (e: any) {
    console.error("manage-semrush-stats error", e);
    return json({ error: e?.message || "Internal error" }, 500, corsHeaders);
  }
});
