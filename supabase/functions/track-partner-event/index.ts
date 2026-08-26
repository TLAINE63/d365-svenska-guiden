import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin.startsWith("http://localhost:")) return true;
  if (origin.endsWith(".lovable.app")) return true;
  if (origin.endsWith(".lovableproject.com")) return true;
  if (origin === "https://d365.se" || origin === "https://www.d365.se") return true;
  return false;
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin! : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

const BOT_PATTERNS = [
  /bot\b/i, /crawl/i, /spider/i, /slurp/i, /lighthouse/i, /pagespeed/i,
  /headlesschrome/i, /phantomjs/i, /selenium/i, /puppeteer/i,
  /python-/i, /curl\//i, /wget\//i, /node-fetch/i, /axios\//i,
  /go-http-client/i, /scrapy/i, /httpclient/i, /okhttp/i, /java\//i,
];

function isBot(ua: string | null): boolean {
  if (!ua || ua.length < 20) return true;
  return BOT_PATTERNS.some((p) => p.test(ua));
}

function anonymizeIp(ip: string): string {
  if (ip === "unknown") return "unknown";
  if (ip.includes(".")) {
    const p = ip.split(".");
    if (p.length === 4) return `${p[0]}.${p[1]}.${p[2]}.x`;
  }
  if (ip.includes(":")) {
    const p = ip.split(":");
    return p.slice(0, 4).join(":") + ":x:x:x:x";
  }
  return "unknown";
}

/** event_name -> nivå (1 exponering, 2 engagemang, 3 köpsignal, 4 lead) */
const EVENT_LEVELS: Record<string, number> = {
  partner_list_impression: 1,
  partner_filter_impression: 1,
  partner_comparison_impression: 1,
  partner_match_impression: 1,
  partner_profile_view: 2,
  partner_profile_return: 2,
  partner_case_click: 2,
  partner_competency_click: 2,
  partner_saved: 2,
  partner_added_to_comparison: 2,
  partner_match_recommended: 3,
  partner_match_selected: 3,
  partner_contact_request: 4,
  partner_intro_request: 4,
};

const INTENT_TRACKS = new Set(["erp", "crm", "ai"]);

function isProductionOrigin(origin: string | null): boolean {
  return origin === "https://d365.se" || origin === "https://www.d365.se";
}

type IncomingEvent = {
  event_name?: string;
  partner_slug?: string;
  partner_id?: string | null;
  visitor_id?: string;
  session_id?: string;
  page_path?: string;
  intent_track?: string;
  metadata?: Record<string, unknown>;
};

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!isProductionOrigin(req.headers.get("origin"))) {
      return new Response(JSON.stringify({ success: true, filtered: "non_production_origin" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userAgent = req.headers.get("user-agent");
    if (isBot(userAgent)) {
      return new Response(JSON.stringify({ success: true, filtered: "bot" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const rawEvents: IncomingEvent[] = Array.isArray(body?.events)
      ? body.events
      : body?.event_name
        ? [body]
        : [];

    if (rawEvents.length === 0 || rawEvents.length > 60) {
      return new Response(JSON.stringify({ error: "invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const anonIp = anonymizeIp(clientIp);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const slugs = new Set<string>();
    const cleaned = rawEvents
      .filter((e) => e && typeof e.event_name === "string" && EVENT_LEVELS[e.event_name])
      .filter((e) => typeof e.partner_slug === "string" && e.partner_slug.length > 0 && e.partner_slug.length <= 200)
      .slice(0, 60)
      .map((e) => {
        const slug = String(e.partner_slug).slice(0, 200);
        slugs.add(slug);
        const intent = e.intent_track && INTENT_TRACKS.has(String(e.intent_track))
          ? String(e.intent_track)
          : null;
        let metadata: Record<string, unknown> = {};
        if (e.metadata && typeof e.metadata === "object") {
          metadata = JSON.parse(JSON.stringify(e.metadata).slice(0, 4000) || "{}");
        }
        return {
          partner_slug: slug,
          partner_id: typeof e.partner_id === "string" ? e.partner_id : null,
          event_name: String(e.event_name),
          event_level: EVENT_LEVELS[String(e.event_name)],
          visitor_id: e.visitor_id ? String(e.visitor_id).slice(0, 64) : null,
          session_id: e.session_id ? String(e.session_id).slice(0, 64) : null,
          page_path: e.page_path ? String(e.page_path).slice(0, 300) : null,
          intent_track: intent,
          metadata,
          ip_anonymized: anonIp,
          user_agent: userAgent?.slice(0, 500) || null,
        };
      });

    if (cleaned.length === 0) {
      return new Response(JSON.stringify({ success: true, inserted: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Resolve missing partner_id from slug in one query
    const missing = cleaned.some((e) => !e.partner_id);
    if (missing) {
      const { data: partnerRows } = await supabase
        .from("partners")
        .select("id, slug")
        .in("slug", Array.from(slugs));
      const map = new Map((partnerRows ?? []).map((p: { id: string; slug: string }) => [p.slug, p.id]));
      for (const e of cleaned) {
        if (!e.partner_id) e.partner_id = map.get(e.partner_slug) ?? null;
      }
    }

    const { error } = await supabase.from("partner_engagement_events").insert(cleaned);
    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: "insert failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, inserted: cleaned.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: "internal" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
