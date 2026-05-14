import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  const allowedDomains = [
    "https://d365.se",
    "https://www.d365.se",
    "https://d365-svenska-guiden.lovable.app",
    "http://localhost:5173",
  ];
  if (allowedDomains.includes(origin)) return true;
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/)) return true;
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovable\.app$/)) return true;
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

// Common bot/crawler user-agent patterns
const BOT_PATTERNS = [
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i, /baiduspider/i,
  /yandexbot/i, /sogou/i, /facebot/i, /ia_archiver/i, /crawl/i,
  /spider/i, /bot\b/i, /lighthouse/i, /pagespeed/i, /gtmetrix/i,
  /pingdom/i, /uptimerobot/i, /semrush/i, /ahref/i, /mj12bot/i,
  /dotbot/i, /petalbot/i, /bytespider/i, /gptbot/i, /chatgpt/i,
  /claudebot/i, /anthropic/i, /applebot/i, /twitterbot/i,
  /linkedinbot/i, /whatsapp/i, /telegrambot/i, /discordbot/i,
  /headlesschrome/i, /phantomjs/i, /selenium/i, /puppeteer/i,
  /python-requests/i, /python-urllib/i, /java\//i, /curl\//i,
  /wget\//i, /node-fetch/i, /axios\//i, /go-http-client/i,
  /scrapy/i, /httpclient/i, /okhttp/i,
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true; // No UA = likely bot
  if (userAgent.length < 20) return true; // Very short UA = suspicious
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

interface GeoData {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  org: string | null;
}

async function getGeoData(ip: string): Promise<GeoData | null> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,org`);
    const data = await response.json();
    
    if (data.status === "success") {
      return {
        country: data.country || "Unknown",
        countryCode: data.countryCode || "XX",
        region: data.regionName || "Unknown",
        city: data.city || "Unknown",
        org: data.org || null,
      };
    }
    return null;
  } catch (error) {
    console.error("Geo lookup failed:", error);
    return null;
  }
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

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only count visits from the public production site (d365.se).
    // Preview/staging traffic is dropped so admin statistics always
    // reflect what real users do on d365.se.
    if (!isProductionOrigin(req.headers.get("origin"))) {
      return new Response(
        JSON.stringify({ success: true, filtered: "non_production_origin" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userAgent = req.headers.get("user-agent");

    // Filter out bots and crawlers
    if (isBot(userAgent)) {
      return new Response(
        JSON.stringify({ success: true, filtered: "bot" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    const { page_path, referrer, session_id, time_on_page_seconds, is_bounce, action } = body;

    if (!page_path) {
      return new Response(
        JSON.stringify({ error: "page_path is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle "update" action: update time_on_page for existing row instead of inserting
    if (action === "update" && session_id && time_on_page_seconds !== undefined) {
      // Find the most recent row for this session + page and update it
      const { data: existing } = await supabase
        .from("visitor_analytics")
        .select("id")
        .eq("session_id", session_id)
        .eq("page_path", page_path)
        .order("visited_at", { ascending: false })
        .limit(1);

      if (existing && existing.length > 0) {
        await supabase
          .from("visitor_analytics")
          .update({
            time_on_page_seconds: Math.min(time_on_page_seconds, 600),
            is_bounce: false,
          })
          .eq("id", existing[0].id);
      }

      return new Response(
        JSON.stringify({ success: true, action: "updated" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get client IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                     req.headers.get("x-real-ip") ||
                     "unknown";

    // Perform geo lookup before anonymizing
    const geoData = clientIp !== "unknown" ? await getGeoData(clientIp) : null;
    const anonymizedIp = clientIp !== "unknown" ? anonymizeIp(clientIp) : "unknown";

    // Insert visitor record (only on initial page load)
    const { error } = await supabase.from("visitor_analytics").insert({
      page_path,
      referrer: referrer || null,
      session_id: session_id || null,
      user_agent: userAgent || null,
      time_on_page_seconds: null,
      is_bounce: is_bounce !== undefined ? is_bounce : true,
      geo_country: geoData?.country || null,
      geo_country_code: geoData?.countryCode || null,
      geo_region: geoData?.region || null,
      geo_city: geoData?.city || null,
      ip_anonymized: anonymizedIp,
      geo_org: geoData?.org || null,
    });

    if (error) {
      console.error("Insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to track visit" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
