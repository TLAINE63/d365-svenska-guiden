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
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin! : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

const BOT_PATTERNS = [
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i, /baiduspider/i,
  /yandexbot/i, /crawl/i, /spider/i, /bot\b/i, /lighthouse/i,
  /semrush/i, /ahref/i, /gptbot/i, /claudebot/i, /anthropic/i,
  /applebot/i, /twitterbot/i, /linkedinbot/i, /facebookexternalhit/i,
  /headlesschrome/i, /python-requests/i, /curl\//i, /wget\//i,
  /node-fetch/i, /axios\//i, /go-http-client/i,
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return BOT_PATTERNS.some((p) => p.test(userAgent));
}

function anonymizeIp(ip: string): string {
  if (ip.includes(".")) {
    const parts = ip.split(".");
    return `${parts[0]}.${parts[1]}.${parts[2]}.x`;
  }
  return ip.split(":").slice(0, 4).join(":") + ":x:x:x:x";
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const origin = req.headers.get("origin");
    if (!isAllowedOrigin(origin)) {
      return new Response(JSON.stringify({ success: true, filtered: "origin" }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const rawPath = typeof body?.path === "string" ? body.path : "";
    if (!rawPath || !rawPath.startsWith("/")) {
      return new Response(JSON.stringify({ error: "path is required" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const path = rawPath.slice(0, 500);
    const userAgent = req.headers.get("user-agent");

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { error } = await supabase.from("not_found_events").insert({
      path,
      full_url: typeof body?.full_url === "string" ? body.full_url.slice(0, 1000) : null,
      referrer: typeof body?.referrer === "string" ? body.referrer.slice(0, 1000) : null,
      user_agent: userAgent ? userAgent.slice(0, 500) : null,
      session_id: typeof body?.session_id === "string" ? body.session_id.slice(0, 100) : null,
      ip_anonymized: clientIp !== "unknown" ? anonymizeIp(clientIp) : null,
      is_bot: isBot(userAgent),
    });

    if (error) {
      console.error("404 log insert failed:", error);
      return new Response(JSON.stringify({ error: "Failed to log 404" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("track-404 error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
