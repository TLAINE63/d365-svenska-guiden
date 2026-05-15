import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function isAllowedOrigin(origin: string | null): boolean {
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

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin! : "",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
}

const BOT_PATTERNS = [
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i, /baiduspider/i,
  /yandexbot/i, /crawl/i, /spider/i, /bot\b/i, /lighthouse/i,
  /pagespeed/i, /semrush/i, /ahref/i, /headlesschrome/i, /phantomjs/i,
  /selenium/i, /puppeteer/i, /python-requests/i, /curl\//i, /wget\//i,
  /node-fetch/i, /axios\//i, /scrapy/i,
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  if (userAgent.length < 20) return true;
  return BOT_PATTERNS.some((p) => p.test(userAgent));
}

function anonymizeIp(ip: string): string {
  if (ip.includes(".")) {
    const parts = ip.split(".");
    return `${parts[0]}.${parts[1]}.${parts[2]}.x`;
  }
  return ip.split(":").slice(0, 4).join(":") + ":x:x:x:x";
}

function isProductionOrigin(origin: string | null): boolean {
  return origin === "https://d365.se" || origin === "https://www.d365.se";
}

const ALLOWED_TYPES = new Set([
  "cta_view",
  "cta_click",
  "analysis_start",
  "analysis_step",
  "analysis_complete",
  "pdf_download",
]);

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!isProductionOrigin(req.headers.get("origin"))) {
      return new Response(
        JSON.stringify({ success: true, filtered: "non_production_origin" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userAgent = req.headers.get("user-agent");
    if (isBot(userAgent)) {
      return new Response(
        JSON.stringify({ success: true, filtered: "bot" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const {
      event_type,
      event_name,
      page_path,
      session_id,
      step_number,
      metadata,
    } = body;

    if (!event_type || !ALLOWED_TYPES.has(event_type)) {
      return new Response(
        JSON.stringify({ error: "Invalid event_type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!event_name || typeof event_name !== "string" || event_name.length > 80) {
      return new Response(
        JSON.stringify({ error: "Invalid event_name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const anonIp = clientIp !== "unknown" ? anonymizeIp(clientIp) : null;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error } = await supabase.from("funnel_events").insert({
      event_type,
      event_name: String(event_name).slice(0, 80),
      page_path: page_path ? String(page_path).slice(0, 500) : null,
      session_id: session_id ? String(session_id).slice(0, 80) : null,
      step_number: typeof step_number === "number" ? step_number : null,
      metadata: metadata && typeof metadata === "object" ? metadata : {},
      ip_anonymized: anonIp,
      user_agent: userAgent,
    });

    if (error) {
      console.error("funnel insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to track event" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("track-funnel-event error", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
