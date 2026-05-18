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
    if (parts.length !== 3) return { valid: false, error: "Invalid token format", payload: null as any };
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
    if (!valid) return { valid: false, error: "Invalid signature", payload: null };
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return { valid: false, error: "Token expired", payload: null };
    if (payload.role !== "admin") return { valid: false, error: "Insufficient permissions", payload: null };
    return { valid: true, payload };
  } catch (e) {
    console.error("JWT verify error", e);
    return { valid: false, error: "Token verification failed", payload: null };
  }
}

interface FunnelRow {
  key: string;
  label: string;
  count: number;
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const token = body?.token || "";
    const daysRaw = body?.days;
    const isAllTime = daysRaw === null || daysRaw === "all" || daysRaw === 0;
    const days: number | null = isAllTime ? null : Math.min(Math.max(Number(daysRaw) || 30, 1), 365);
    const pageFilter: string | null = body?.page_filter || null; // e.g. "/business-central"

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

    const since: string | null = days === null ? null : new Date(Date.now() - days * 86400000).toISOString();
    const gte = <T extends { gte: (col: string, v: string) => T }>(q: T, col: string): T =>
      since ? q.gte(col, since) : q;

    // ─── 1. Page visits (visitor_analytics) ───
    let visitQuery = supabase
      .from("visitor_analytics")
      .select("session_id, page_path", { count: "exact", head: false })
      .limit(50000);
    visitQuery = gte(visitQuery, "visited_at");
    if (pageFilter) visitQuery = visitQuery.like("page_path", `${pageFilter}%`);
    const { data: visits, error: visitsErr } = await visitQuery;
    if (visitsErr) console.error("visits err", visitsErr);

    const visitSessions = new Set<string>();
    let visitRows = 0;
    for (const v of visits || []) {
      visitRows++;
      if (v.session_id) visitSessions.add(v.session_id);
    }

    // ─── 2. Funnel events ───
    let feQuery = supabase
      .from("funnel_events")
      .select("event_type, event_name, page_path, session_id")
      .limit(50000);
    feQuery = gte(feQuery, "occurred_at");
    if (pageFilter) feQuery = feQuery.like("page_path", `${pageFilter}%`);
    const { data: feRows, error: feErr } = await feQuery;
    if (feErr) console.error("funnel events err", feErr);

    const ctaViewSessions = new Set<string>();
    const ctaClickSessions = new Set<string>();
    const analysisStartSessions = new Set<string>();
    const analysisCompleteSessions = new Set<string>();
    const pdfSessions = new Set<string>();

    // Per-name breakdowns
    const byEventName: Record<string, Record<string, number>> = {};

    for (const r of feRows || []) {
      const sid = r.session_id || `__no_session_${Math.random()}`;
      const t = r.event_type as string;
      switch (t) {
        case "cta_view": ctaViewSessions.add(sid); break;
        case "cta_click": ctaClickSessions.add(sid); break;
        case "analysis_start": analysisStartSessions.add(sid); break;
        case "analysis_complete": analysisCompleteSessions.add(sid); break;
        case "pdf_download": pdfSessions.add(sid); break;
      }
      if (!byEventName[t]) byEventName[t] = {};
      const name = r.event_name || "(unknown)";
      byEventName[t][name] = (byEventName[t][name] || 0) + 1;
    }

    // ─── 3. Partner profile views & website clicks ───
    const { data: profileViews } = await gte(
      supabase.from("partner_profile_views").select("id").limit(50000),
      "viewed_at",
    );
    const { data: partnerClicks } = await gte(
      supabase.from("partner_clicks").select("id").limit(50000),
      "clicked_at",
    );

    // ─── 4. Leads ───
    const { data: leads } = await gte(
      supabase.from("leads").select("id, source_page, source_type").limit(50000),
      "created_at",
    );

    let leadCount = leads?.length || 0;
    if (pageFilter) {
      leadCount = (leads || []).filter((l) =>
        (l.source_page || "").startsWith(pageFilter)
      ).length;
    }

    // ─── 5. Time series (daily) for last N days ───
    const dailyMap = new Map<string, { visits: number; clicks: number; analyses: number; leads: number }>();
    const dayKey = (iso: string) => iso.slice(0, 10);
    for (let i = 0; i < days; i++) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      dailyMap.set(d, { visits: 0, clicks: 0, analyses: 0, leads: 0 });
    }

    const { data: dailyVisits } = await supabase
      .from("visitor_analytics")
      .select("visited_at")
      .gte("visited_at", since)
      .limit(50000);
    for (const r of dailyVisits || []) {
      const k = dayKey(r.visited_at as string);
      const cur = dailyMap.get(k);
      if (cur) cur.visits++;
    }
    const { data: dailyClicks } = await supabase
      .from("funnel_events")
      .select("occurred_at")
      .eq("event_type", "cta_click")
      .gte("occurred_at", since)
      .limit(50000);
    for (const r of dailyClicks || []) {
      const k = dayKey(r.occurred_at as string);
      const cur = dailyMap.get(k);
      if (cur) cur.clicks++;
    }
    const { data: dailyAnal } = await supabase
      .from("funnel_events")
      .select("occurred_at")
      .eq("event_type", "analysis_complete")
      .gte("occurred_at", since)
      .limit(50000);
    for (const r of dailyAnal || []) {
      const k = dayKey(r.occurred_at as string);
      const cur = dailyMap.get(k);
      if (cur) cur.analyses++;
    }
    for (const l of leads || []) {
      // Use created_at would require selecting it; re-query lightweight
    }
    const { data: dailyLeads } = await supabase
      .from("leads")
      .select("created_at")
      .gte("created_at", since)
      .limit(50000);
    for (const r of dailyLeads || []) {
      const k = dayKey(r.created_at as string);
      const cur = dailyMap.get(k);
      if (cur) cur.leads++;
    }

    const timeseries = Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, v]) => ({ date, ...v }));

    // ─── Funnel rows ───
    const funnel: FunnelRow[] = [
      { key: "visits", label: "Sidvisningar", count: visitRows },
      { key: "cta_view", label: "Sett CTA", count: ctaViewSessions.size },
      { key: "cta_click", label: "Klickat CTA", count: ctaClickSessions.size },
      { key: "analysis_start", label: "Startat analys", count: analysisStartSessions.size },
      { key: "analysis_complete", label: "Slutfört analys", count: analysisCompleteSessions.size },
      { key: "pdf_download", label: "Laddat ner PDF", count: pdfSessions.size },
      { key: "lead", label: "Skickat lead", count: leadCount },
      { key: "partner_profile", label: "Besökt partnerprofil", count: profileViews?.length || 0 },
      { key: "partner_click", label: "Klickat till partner", count: partnerClicks?.length || 0 },
    ];

    return new Response(
      JSON.stringify({
        success: true,
        days,
        page_filter: pageFilter,
        funnel,
        by_event_name: byEventName,
        timeseries,
        unique_visitors: visitSessions.size,
      }),
      { headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("funnel-stats error", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
