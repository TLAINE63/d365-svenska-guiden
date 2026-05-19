// Edge function: weekly GSC-uppföljning för pelarsidorna /, /erp, /affarssystem, /businesscentral
// Returnerar clicks, impressions, CTR och avg. position per vecka, per sida, för senaste 6 veckorna.
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
const json = (b: unknown, s: number, h: Record<string, string>) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...h, "Content-Type": "application/json" } });

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITE = "sc-domain:d365.se";
const SITE_ENC = encodeURIComponent(SITE);

// De fyra pelarsidorna. Filter: GSC `page` är full-URL → matchar trailing slash också.
const PILLARS: { label: string; path: string; intent: string }[] = [
  { label: "Hub (Partner)",     path: "/",                intent: "BOFU / partnerval" },
  { label: "Affärssystem (TOFU)", path: "/affarssystem/", intent: "TOFU – vad är affärssystem" },
  { label: "ERP (MOFU)",         path: "/erp/",            intent: "MOFU – BC vs F&SCM" },
  { label: "Business Central",   path: "/businesscentral/", intent: "BOFU – produkt" },
];

interface GscRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

function fmt(d: Date) { return d.toISOString().slice(0, 10); }
function addDays(d: Date, n: number) { return new Date(d.getTime() + n * 86400000); }

/** Bygg 6 veckors-buckets som slutar 3 dagar tillbaka (GSC har ~3 dygns delay). */
function weekBuckets() {
  const end = addDays(new Date(), -3);
  const buckets: { start: string; end: string; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const wEnd = addDays(end, -i * 7);
    const wStart = addDays(wEnd, -6);
    buckets.push({ start: fmt(wStart), end: fmt(wEnd), label: `v${i === 0 ? "0 (nu)" : `-${i}`}` });
  }
  return buckets;
}

async function queryPage(pagePath: string, startDate: string, endDate: string, headers: Record<string, string>) {
  const pageUrl = `https://www.d365.se${pagePath}`;
  const res = await fetch(`${GATEWAY}/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query`, {
    method: "POST", headers,
    body: JSON.stringify({
      startDate, endDate,
      dimensions: ["page"],
      dimensionFilterGroups: [{
        filters: [{ dimension: "page", operator: "equals", expression: pageUrl }],
      }],
      rowLimit: 1,
    }),
  });
  if (!res.ok) return null;
  const j = await res.json();
  const row: GscRow | undefined = j.rows?.[0];
  return row ? {
    clicks: row.clicks, impressions: row.impressions,
    ctr: row.ctr * 100, position: row.position,
  } : { clicks: 0, impressions: 0, ctr: 0, position: 0 };
}

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
    if (!LK || !GK) return json({ error: "GSC inte ansluten" }, 500, cors);

    const headers = {
      "Authorization": `Bearer ${LK}`,
      "X-Connection-Api-Key": GK,
      "Content-Type": "application/json",
    };

    const buckets = weekBuckets();

    // Parallellt: alla (page x week)-kombinationer.
    const results = await Promise.all(
      PILLARS.map(async (p) => {
        const weeks = await Promise.all(
          buckets.map(async (w) => {
            const stats = await queryPage(p.path, w.start, w.end, headers);
            return { ...w, ...stats };
          }),
        );
        return { ...p, weeks };
      }),
    );

    return json({
      generatedAt: new Date().toISOString(),
      buckets: buckets.map((b) => ({ start: b.start, end: b.end, label: b.label })),
      pages: results,
    }, 200, cors);
  } catch (e) {
    console.error("pillar-seo-followup error", e);
    return json({ error: e instanceof Error ? e.message : "Okänt fel" }, 500, cors);
  }
});
