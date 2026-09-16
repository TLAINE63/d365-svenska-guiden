function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  const allowed = [
    "https://d365.se",
    "https://www.d365.se",
    "https://d365-svenska-guiden.lovable.app",
    "http://localhost:5173",
    "http://localhost:8080",
  ];
  if (allowed.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

function base64UrlToBase64(str: string): string {
  let b = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function base64UrlDecode(str: string): Uint8Array {
  const binary = atob(base64UrlToBase64(str));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
async function verifyJWT(token: string, secret: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false, error: "Invalid token format", payload: null as any };
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(s) as unknown as BufferSource,
      enc.encode(`${h}.${p}`),
    );
    if (!valid) return { valid: false, error: "Invalid signature", payload: null };
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return { valid: false, error: "Token expired", payload: null };
    if (payload.role !== "admin" && payload.role !== "editor") {
      return { valid: false, error: "Insufficient permissions", payload: null };
    }
    return { valid: true, payload };
  } catch (e) {
    console.error("JWT verify error", e);
    return { valid: false, error: "Token verification failed", payload: null };
  }
}

const API_HOST = (Deno.env.get("POSTHOG_REGION") || "eu").toLowerCase() === "us"
  ? "https://us.posthog.com"
  : "https://eu.posthog.com";

async function hogql(query: string, apiKey: string, projectId: string): Promise<any[][]> {
  const res = await fetch(`${API_HOST}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`PostHog query failed [${res.status}]: ${text}`);
    throw new Error(`[${res.status}]: ${text}`);
  }
  const json = await res.json();
  return (json?.results ?? []) as any[][];
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const token = body?.token || "";
    const days = [7, 30, 90].includes(Number(body?.days)) ? Number(body.days) : 30;

    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!JWT_SECRET) {
      return new Response(JSON.stringify({ error: "Auth not configured" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const v = await verifyJWT(token, JWT_SECRET);
    if (!v.valid) {
      return new Response(
        JSON.stringify({
          error: v.error === "Token expired" ? "Sessionen har gått ut. Logga in igen." : "Ogiltig session",
        }),
        { status: 401, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("POSTHOG_PERSONAL_API_KEY");
    const projectId = Deno.env.get("POSTHOG_PROJECT_ID");
    if (!apiKey || !projectId) {
      return new Response(
        JSON.stringify({ error: "PostHog är inte konfigurerat (läsnyckel eller projekt saknas)." }),
        { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const since = `now() - INTERVAL ${days} DAY`;
    const base = `FROM events WHERE event = '$pageview' AND timestamp >= ${since}`;

    const safe = (q: string) => hogql(q, apiKey, projectId).catch(() => [] as any[][]);

    const [totals, pages, referrers, channels, countries, daily] = await Promise.all([
      safe(
        `SELECT count() AS views, count(DISTINCT person_id) AS visitors, count(DISTINCT $session_id) AS sessions ${base}`),
      safe(
        `SELECT properties.$pathname AS path, count() AS views, count(DISTINCT person_id) AS visitors ${base} GROUP BY path ORDER BY views DESC LIMIT 25`),
      safe(
        `SELECT coalesce(nullIf(properties.$referring_domain, ''), 'direkt') AS source, count() AS views, count(DISTINCT person_id) AS visitors ${base} GROUP BY source ORDER BY views DESC LIMIT 15`),
      safe(
        `SELECT coalesce(nullIf($channel_type, ''), 'okänd') AS channel, count() AS views, count(DISTINCT person_id) AS visitors ${base} GROUP BY channel ORDER BY views DESC LIMIT 12`),
      safe(
        `SELECT coalesce(nullIf(properties.$geoip_country_name, ''), 'Okänt') AS country, count() AS views, count(DISTINCT person_id) AS visitors ${base} GROUP BY country ORDER BY views DESC LIMIT 12`),
      safe(
        `SELECT toDate(timestamp) AS day, count() AS views, count(DISTINCT person_id) AS visitors ${base} GROUP BY day ORDER BY day ASC`),
    ]);

    const t = totals[0] ?? [0, 0, 0];
    return new Response(
      JSON.stringify({
        days,
        totals: { views: Number(t[0] || 0), visitors: Number(t[1] || 0), sessions: Number(t[2] || 0) },
        topPages: pages.map((r) => ({ path: r[0] || "(okänd)", views: Number(r[1]), visitors: Number(r[2]) })),
        referrers: referrers.map((r) => ({ source: r[0], views: Number(r[1]), visitors: Number(r[2]) })),
        channels: channels.map((r) => ({ channel: r[0], views: Number(r[1]), visitors: Number(r[2]) })),
        countries: countries.map((r) => ({ country: r[0], views: Number(r[1]), visitors: Number(r[2]) })),
        daily: daily.map((r) => ({
          day: String(r[0]).slice(0, 10),
          views: Number(r[1]),
          visitors: Number(r[2]),
        })),
      }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("posthog-stats error", e);
    return new Response(JSON.stringify({ error: `PostHog-anrop misslyckades: ${String(e)}` }), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
