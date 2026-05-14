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

function isProductionOrigin(origin: string | null): boolean {
  return origin === "https://d365.se" || origin === "https://www.d365.se";
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only count traffic from production (d365.se). Preview/staging is ignored
    // so that admin statistics always reflect the public site.
    if (!isProductionOrigin(req.headers.get("origin"))) {
      return new Response(
        JSON.stringify({ success: true, filtered: "non_production_origin" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userAgent = req.headers.get("user-agent");
    if (isBot(userAgent)) {
      return new Response(JSON.stringify({ success: true, filtered: "bot" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { partner_slug, partner_id, view_type, page_source, referrer } = body;

    if (!partner_slug || typeof partner_slug !== "string" || partner_slug.length > 200) {
      return new Response(JSON.stringify({ error: "partner_slug required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (view_type !== "card_click" && view_type !== "profile_visit") {
      return new Response(JSON.stringify({ error: "invalid view_type" }), {
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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Resolve partner_id from slug if not provided
    let resolvedPartnerId: string | null = partner_id || null;
    if (!resolvedPartnerId) {
      const { data } = await supabase
        .from("partners")
        .select("id")
        .eq("slug", partner_slug)
        .maybeSingle();
      resolvedPartnerId = data?.id || null;
    }

    const { error } = await supabase.from("partner_profile_views").insert({
      partner_id: resolvedPartnerId,
      partner_slug: partner_slug.slice(0, 200),
      view_type,
      page_source: page_source ? String(page_source).slice(0, 200) : null,
      referrer: referrer ? String(referrer).slice(0, 500) : null,
      ip_address_anonymized: anonIp,
      user_agent: userAgent?.slice(0, 500) || null,
    });

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: "insert failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
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
