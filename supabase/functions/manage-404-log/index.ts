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
      ["verify"],
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(s) as unknown as BufferSource,
      enc.encode(`${h}.${p}`),
    );
    if (!valid) return { valid: false, error: "Invalid signature" };
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return { valid: false, error: "Token expired" };
    if (payload.role !== "admin") return { valid: false, error: "Insufficient permissions" };
    return { valid: true, error: null };
  } catch (e) {
    console.error("JWT verify error", e);
    return { valid: false, error: "Token verification failed" };
  }
}

interface AggregatedRow {
  path: string;
  hits: number;
  bot_hits: number;
  last_seen: string;
  first_seen: string;
  resolved: boolean;
  referrers: { referrer: string; count: number }[];
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
        JSON.stringify({
          error: v.error === "Token expired" ? "Sessionen har gått ut. Logga in igen." : "Ogiltig session",
        }),
        { status: 401, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const action = body?.action || "list";

    if (action === "mark_resolved") {
      const path = body?.path;
      if (!path) {
        return new Response(JSON.stringify({ error: "path krävs" }), {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase
        .from("not_found_events")
        .update({ resolved: body?.resolved !== false, resolved_note: body?.note || null })
        .eq("path", path);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_path") {
      const path = body?.path;
      if (!path) {
        return new Response(JSON.stringify({ error: "path krävs" }), {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase.from("not_found_events").delete().eq("path", path);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // ─── list (aggregated per path) ───
    const daysRaw = body?.days;
    const isAllTime = daysRaw === null || daysRaw === "all" || daysRaw === 0;
    const days: number | null = isAllTime ? null : Math.min(Math.max(Number(daysRaw) || 30, 1), 365);
    const includeBots = body?.include_bots === true;

    let query = supabase
      .from("not_found_events")
      .select("path, referrer, occurred_at, is_bot, resolved")
      .order("occurred_at", { ascending: false })
      .limit(20000);

    if (days !== null) {
      query = query.gte("occurred_at", new Date(Date.now() - days * 86400000).toISOString());
    }
    if (!includeBots) query = query.eq("is_bot", false);

    const { data, error } = await query;
    if (error) throw error;

    const map = new Map<string, AggregatedRow & { referrerMap: Map<string, number> }>();
    for (const row of data || []) {
      const key = row.path as string;
      let entry = map.get(key);
      if (!entry) {
        entry = {
          path: key,
          hits: 0,
          bot_hits: 0,
          last_seen: row.occurred_at as string,
          first_seen: row.occurred_at as string,
          resolved: true,
          referrers: [],
          referrerMap: new Map(),
        };
        map.set(key, entry);
      }
      entry.hits++;
      if (row.is_bot) entry.bot_hits++;
      if (!row.resolved) entry.resolved = false;
      if ((row.occurred_at as string) > entry.last_seen) entry.last_seen = row.occurred_at as string;
      if ((row.occurred_at as string) < entry.first_seen) entry.first_seen = row.occurred_at as string;
      const ref = (row.referrer as string | null) || "(direkt/okänd)";
      entry.referrerMap.set(ref, (entry.referrerMap.get(ref) || 0) + 1);
    }

    const rows: AggregatedRow[] = Array.from(map.values())
      .map(({ referrerMap, ...rest }) => ({
        ...rest,
        referrers: Array.from(referrerMap.entries())
          .map(([referrer, count]) => ({ referrer, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
      }))
      .sort((a, b) => b.hits - a.hits);

    return new Response(
      JSON.stringify({
        rows,
        total_hits: (data || []).length,
        unique_paths: rows.length,
        period_days: days,
      }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("manage-404-log error", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
