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

function b64UrlToB64(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function b64UrlDecode(s: string) {
  const bin = atob(b64UrlToB64(s));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
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
      b64UrlDecode(s) as unknown as BufferSource,
      enc.encode(`${h}.${p}`),
    );
    if (!valid) return { valid: false, error: "Invalid signature" };
    const payload = JSON.parse(atob(b64UrlToB64(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return { valid: false, error: "Token expired" };
    if (payload.role !== "admin") return { valid: false, error: "Insufficient permissions" };
    return { valid: true };
  } catch {
    return { valid: false, error: "Token verification failed" };
  }
}

interface Row {
  news_id: string;
  editorial_title: string | null;
  news_type: string | null;
  news_date: string | null;
  partner_name: string | null;
  partner_slug: string | null;
  views: number;
  card_clicks: number;
  source_clicks: number;
  leads: number;
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const token: string = body?.token || "";
    const daysRaw = body?.days;
    const isAllTime = daysRaw === null || daysRaw === "all" || daysRaw === 0;
    const days: number | null = isAllTime ? null : Math.min(Math.max(Number(daysRaw) || 30, 1), 365);

    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!SERVICE_KEY) {
      return new Response(JSON.stringify({ error: "Auth not configured" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const v = await verifyJWT(token, SERVICE_KEY);
    if (!v.valid) {
      return new Response(
        JSON.stringify({
          error: v.error === "Token expired" ? "Sessionen har gått ut. Logga in igen." : "Ogiltig session",
        }),
        { status: 401, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", SERVICE_KEY);
    const since: string | null = days === null ? null : new Date(Date.now() - days * 86400000).toISOString();

    // Fetch partner news (target set)
    const { data: news, error: newsErr } = await supabase
      .from("partner_news")
      .select("id, editorial_title, news_type, news_date, partner:partners(name, slug)")
      .order("news_date", { ascending: false })
      .limit(500);
    if (newsErr) throw newsErr;

    const rows = new Map<string, Row>();
    for (const n of news || []) {
      rows.set(n.id, {
        news_id: n.id,
        editorial_title: n.editorial_title,
        news_type: n.news_type,
        news_date: n.news_date,
        // deno-lint-ignore no-explicit-any
        partner_name: (n as any).partner?.name ?? null,
        // deno-lint-ignore no-explicit-any
        partner_slug: (n as any).partner?.slug ?? null,
        views: 0,
        card_clicks: 0,
        source_clicks: 0,
        leads: 0,
      });
    }

    // Funnel events: views & clicks (metadata.news_id)
    let feQ = supabase
      .from("funnel_events")
      .select("event_name, metadata")
      .in("event_name", ["partner_news_view", "partner_news_card_click", "partner_news_source_click"])
      .limit(50000);
    if (since) feQ = feQ.gte("occurred_at", since);
    const { data: fe, error: feErr } = await feQ;
    if (feErr) console.error("funnel_events err", feErr);

    for (const r of fe || []) {
      // deno-lint-ignore no-explicit-any
      const nid: string | undefined = (r.metadata as any)?.news_id;
      if (!nid) continue;
      const row = rows.get(nid);
      if (!row) continue;
      if (r.event_name === "partner_news_view") row.views += 1;
      else if (r.event_name === "partner_news_card_click") row.card_clicks += 1;
      else if (r.event_name === "partner_news_source_click") row.source_clicks += 1;
    }

    // Leads attributed to a news article
    let leadsQ = supabase
      .from("leads")
      .select("attribution_news_id")
      .not("attribution_news_id", "is", null)
      .limit(50000);
    if (since) leadsQ = leadsQ.gte("created_at", since);
    const { data: leads, error: leadsErr } = await leadsQ;
    if (leadsErr) console.error("leads err", leadsErr);
    for (const l of leads || []) {
      const row = rows.get(l.attribution_news_id as string);
      if (row) row.leads += 1;
    }

    const result = Array.from(rows.values())
      .filter((r) => r.views + r.card_clicks + r.source_clicks + r.leads > 0)
      .sort((a, b) => b.leads - a.leads || b.card_clicks - a.card_clicks || b.views - a.views);

    return new Response(
      JSON.stringify({
        rows: result,
        totals: {
          articles_with_activity: result.length,
          views: result.reduce((s, r) => s + r.views, 0),
          card_clicks: result.reduce((s, r) => s + r.card_clicks, 0),
          source_clicks: result.reduce((s, r) => s + r.source_clicks, 0),
          leads: result.reduce((s, r) => s + r.leads, 0),
        },
      }),
      { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("partner-news-performance error", e);
    return new Response(JSON.stringify({ error: "Internt fel" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
