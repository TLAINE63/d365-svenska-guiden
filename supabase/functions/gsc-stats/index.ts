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
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

function b64ToBin(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return atob(b);
}
async function verifyAdminJWT(token: string, secret: string) {
  try {
    const [h, p, sig] = token.split(".");
    if (!h || !p || !sig) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"],
    );
    const sigBin = b64ToBin(sig);
    const sigBytes = new Uint8Array(sigBin.length);
    for (let i = 0; i < sigBin.length; i++) sigBytes[i] = sigBin.charCodeAt(i);
    const ok = await crypto.subtle.verify(
      "HMAC", key, sigBytes as unknown as BufferSource, enc.encode(`${h}.${p}`),
    );
    if (!ok) return false;
    const payload = JSON.parse(b64ToBin(p));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    return payload.role === "admin";
  } catch { return false; }
}

const json = (body: unknown, status: number, headers: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITE = "sc-domain:d365.se";
const SITE_ENC = encodeURIComponent(SITE);

serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const auth = req.headers.get("authorization") || "";
    const tok = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!tok || !(await verifyAdminJWT(tok, secret))) {
      return json({ error: "Unauthorized" }, 401, cors);
    }

    const LK = Deno.env.get("LOVABLE_API_KEY");
    const GK = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
    if (!LK || !GK) return json({ error: "GSC not connected" }, 500, cors);

    const gscHeaders = {
      "Authorization": `Bearer ${LK}`,
      "X-Connection-Api-Key": GK,
      "Content-Type": "application/json",
    };

    // Period (dagar) – valbar från admin
    const reqBody = await req.json().catch(() => ({}));
    const allowedDays = [7, 28, 90, 180];
    const days = allowedDays.includes(Number(reqBody?.days)) ? Number(reqBody.days) : 90;

    // Date range: ending 3 days ago (GSC delay)
    const now = new Date();
    const end = new Date(now.getTime() - 3 * 24 * 3600 * 1000);
    const start = new Date(end.getTime() - (days - 1) * 24 * 3600 * 1000);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    // Parallel fetches
    const [sitemapsRes, dailyRes, queryRes, pageRes] = await Promise.all([
      fetch(`${GATEWAY}/webmasters/v3/sites/${SITE_ENC}/sitemaps`, { headers: gscHeaders }),
      fetch(`${GATEWAY}/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query`, {
        method: "POST", headers: gscHeaders,
        body: JSON.stringify({ startDate: fmt(start), endDate: fmt(end), dimensions: ["date"], rowLimit: 100 }),
      }),
      fetch(`${GATEWAY}/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query`, {
        method: "POST", headers: gscHeaders,
        body: JSON.stringify({ startDate: fmt(start), endDate: fmt(end), dimensions: ["query"], rowLimit: 25 }),
      }),
      fetch(`${GATEWAY}/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query`, {
        method: "POST", headers: gscHeaders,
        body: JSON.stringify({ startDate: fmt(start), endDate: fmt(end), dimensions: ["page"], rowLimit: 25 }),
      }),
    ]);

    const sitemaps = sitemapsRes.ok ? await sitemapsRes.json() : { error: await sitemapsRes.text() };
    const daily = dailyRes.ok ? await dailyRes.json() : { error: await dailyRes.text() };
    const queries = queryRes.ok ? await queryRes.json() : { error: await queryRes.text() };
    const pages = pageRes.ok ? await pageRes.json() : { error: await pageRes.text() };

    // ── Unika besökare (egen mätning) för samma period ──
    let visitors: { unique: number; pageviews: number; daily: { date: string; visitors: number }[] } | null = null;
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      );
      const sinceIso = new Date(now.getTime() - days * 86400000).toISOString();
      const rows: { visited_at: string; session_id: string | null; ip_anonymized: string | null; referrer: string | null }[] = [];
      const pageSize = 1000;
      for (let from = 0; from < 200000; from += pageSize) {
        const { data, error } = await supabase
          .from("visitor_analytics")
          .select("visited_at, session_id, ip_anonymized, referrer")
          .gte("visited_at", sinceIso)
          .order("visited_at", { ascending: false })
          .range(from, from + pageSize - 1);
        if (error || !data || data.length === 0) break;
        rows.push(...data);
        if (data.length < pageSize) break;
      }

      // Exkludera interna besök (Lovable-preview + admin/partneruppdaterings-IP)
      const excludedPrefixes = new Set<string>();
      const { data: puVisits } = await supabase
        .from("visitor_analytics")
        .select("ip_anonymized")
        .like("page_path", "%partner-uppdatering%");
      for (const r of puVisits || []) {
        if (r.ip_anonymized && r.ip_anonymized !== "unknown") {
          excludedPrefixes.add(r.ip_anonymized.split(".").slice(0, 2).join("."));
        }
      }

      const perDay = new Map<string, Set<string>>();
      let pageviews = 0;
      for (const r of rows) {
        const ref = (r.referrer || "").toLowerCase();
        if (ref.includes("lovableproject.com") || ref.includes("lovable.dev") || ref.includes("lovable.app")) continue;
        const ip = r.ip_anonymized && r.ip_anonymized !== "unknown" ? r.ip_anonymized : null;
        if (ip && excludedPrefixes.has(ip.split(".").slice(0, 2).join("."))) continue;
        pageviews++;
        const day = (r.visited_at || "").slice(0, 10);
        const key = ip || r.session_id;
        if (!day || !key) continue;
        if (!perDay.has(day)) perDay.set(day, new Set());
        perDay.get(day)!.add(key);
      }
      const daily = Array.from(perDay.entries())
        .map(([date, set]) => ({ date, visitors: set.size }))
        .sort((a, b) => a.date.localeCompare(b.date));
      visitors = {
        unique: daily.reduce((a, d) => a + d.visitors, 0),
        pageviews,
        daily,
      };
    } catch (e) {
      console.error("visitor stats error", e);
    }

    return json({
      site: SITE,
      days,
      visitors,
      range: { startDate: fmt(start), endDate: fmt(end) },
      sitemaps: sitemaps.sitemap || [],
      sitemapsError: sitemaps.error || null,
      daily: daily.rows || [],
      queries: queries.rows || [],
      pages: pages.rows || [],
    }, 200, cors);
  } catch (e) {
    console.error("gsc-stats error", e);
    const msg = e instanceof Error ? e.message : "Unknown";
    return json({ error: msg }, 500, cors);
  }
});
