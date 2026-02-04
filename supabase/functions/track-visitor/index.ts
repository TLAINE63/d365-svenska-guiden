import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GeoData {
  country: string;
  countryCode: string;
  region: string;
  city: string;
}

async function getGeoData(ip: string): Promise<GeoData | null> {
  try {
    // Use ip-api.com for geo lookup (free, no API key needed)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city`);
    const data = await response.json();
    
    if (data.status === "success") {
      return {
        country: data.country || "Unknown",
        countryCode: data.countryCode || "XX",
        region: data.regionName || "Unknown",
        city: data.city || "Unknown",
      };
    }
    return null;
  } catch (error) {
    console.error("Geo lookup failed:", error);
    return null;
  }
}

function anonymizeIp(ip: string): string {
  // Mask last octet for IPv4, last segments for IPv6
  if (ip.includes(".")) {
    const parts = ip.split(".");
    return `${parts[0]}.${parts[1]}.${parts[2]}.x`;
  }
  return ip.split(":").slice(0, 4).join(":") + ":x:x:x:x";
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    const { page_path, referrer, session_id, time_on_page_seconds, is_bounce } = body;

    if (!page_path) {
      return new Response(
        JSON.stringify({ error: "page_path is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get client IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                     req.headers.get("x-real-ip") ||
                     "unknown";

    // Perform geo lookup before anonymizing
    const geoData = clientIp !== "unknown" ? await getGeoData(clientIp) : null;
    const anonymizedIp = clientIp !== "unknown" ? anonymizeIp(clientIp) : "unknown";

    // Insert visitor record
    const { error } = await supabase.from("visitor_analytics").insert({
      page_path,
      referrer: referrer || null,
      session_id: session_id || null,
      user_agent: req.headers.get("user-agent") || null,
      time_on_page_seconds: time_on_page_seconds || null,
      is_bounce: is_bounce !== undefined ? is_bounce : true,
      geo_country: geoData?.country || null,
      geo_country_code: geoData?.countryCode || null,
      geo_region: geoData?.region || null,
      geo_city: geoData?.city || null,
      ip_anonymized: anonymizedIp,
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
