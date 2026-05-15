import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

    // Date range: last 90 days, ending 3 days ago (GSC delay)
    const now = new Date();
    const end = new Date(now.getTime() - 3 * 24 * 3600 * 1000);
    const start = new Date(end.getTime() - 89 * 24 * 3600 * 1000);
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

    return json({
      site: SITE,
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
