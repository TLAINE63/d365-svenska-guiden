import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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
    if (parts.length !== 3) return { valid: false, error: "Invalid token format" };
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(s) as unknown as BufferSource,
      enc.encode(`${h}.${p}`)
    );
    if (!valid) return { valid: false, error: "Invalid signature" };
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return { valid: false, error: "Token expired" };
    if (payload.role !== "admin") return { valid: false, error: "Insufficient permissions" };
    return { valid: true };
  } catch (e) {
    console.error("JWT verify error", e);
    return { valid: false, error: "Token verification failed" };
  }
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const token = body?.token || "";

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
        JSON.stringify({ error: v.error === "Token expired" ? "Sessionen har gått ut. Logga in igen." : "Ogiltig session" }),
        { status: 401, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = Date.now();
    const since90 = new Date(now - 90 * 86400000).toISOString();
    const since30 = new Date(now - 30 * 86400000).toISOString();
    const since7 = new Date(now - 7 * 86400000).toISOString();

    // Pull last 90 days, paginated to bypass 1000-row default
    const all: { page_path: string; session_id: string | null; visited_at: string }[] = [];
    const pageSize = 1000;
    for (let from = 0; from < 100000; from += pageSize) {
      const { data, error } = await supabase
        .from("visitor_analytics")
        .select("page_path, session_id, visited_at")
        .gte("visited_at", since90)
        .order("visited_at", { ascending: false })
        .range(from, from + pageSize - 1);
      if (error) {
        console.error("query error", error);
        return new Response(JSON.stringify({ error: "query failed" }), {
          status: 500,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      if (!data || data.length === 0) break;
      all.push(...data);
      if (data.length < pageSize) break;
    }

    function totals(rows: typeof all) {
      const s = new Set<string>();
      for (const r of rows) if (r.session_id) s.add(r.session_id);
      return { pageViews: rows.length, uniqueVisitors: s.size };
    }
    function topPages(rows: typeof all, limit = 20) {
      const map = new Map<string, { views: number; sessions: Set<string> }>();
      for (const r of rows) {
        const key = r.page_path || "(okänd)";
        let m = map.get(key);
        if (!m) {
          m = { views: 0, sessions: new Set() };
          map.set(key, m);
        }
        m.views++;
        if (r.session_id) m.sessions.add(r.session_id);
      }
      return Array.from(map.entries())
        .map(([path, v]) => ({ path, views: v.views, uniqueVisitors: v.sessions.size }))
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    }

    const r7 = all.filter((r) => r.visited_at >= since7);
    const r30 = all.filter((r) => r.visited_at >= since30);
    const r90 = all;

    return new Response(
      JSON.stringify({
        totals: { d7: totals(r7), d30: totals(r30), d90: totals(r90) },
        topPages: { d7: topPages(r7), d30: topPages(r30), d90: topPages(r90) },
      }),
      { headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("error", e);
    return new Response(JSON.stringify({ error: "internal" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
