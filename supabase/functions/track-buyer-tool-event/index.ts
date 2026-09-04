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
  /python-/i, /wget\//i, /node-fetch/i, /axios\//i,
  /go-http-client/i, /scrapy/i, /httpclient/i, /okhttp/i, /java\//i,
];

function isBot(ua: string | null): boolean {
  if (!ua) return true;
  return BOT_PATTERNS.some((p) => p.test(ua));
}

const TOOLS = new Set(["behovsanalys", "kravspecifikation", "jamforelse"]);
const STATUSES = new Set(["paborjad", "slutford", "avbruten"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Envägshash av sessionsnyckeln – ingen koppling tillbaka till besökaren. */
async function hashSession(raw: string): Promise<string> {
  const salt = Deno.env.get("SUPABASE_JWKS") ?? "d365-buyer-tool";
  const bytes = new TextEncoder().encode(`${salt}|${raw}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

function clean(value: unknown, max = 120): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim().slice(0, max);
  return v.length > 0 ? v : null;
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const userAgent = req.headers.get("user-agent");
    if (isBot(userAgent)) return json({ success: true, filtered: "bot" });

    const body = await req.json().catch(() => ({}));
    const tool = clean(body?.tool, 40);
    const status = clean(body?.status, 20);
    if (!tool || !TOOLS.has(tool) || !status || !STATUSES.has(status)) {
      return json({ error: "invalid payload" }, 400);
    }

    const matched = Array.isArray(body?.matched_partner_ids)
      ? body.matched_partner_ids
          .filter((v: unknown) => typeof v === "string" && UUID_RE.test(v))
          .slice(0, 20)
      : [];

    const rawSession = clean(body?.session_id, 80);

    const row = {
      tool,
      status,
      product_key: clean(body?.product_key, 40),
      industry: clean(body?.industry, 120),
      company_size: clean(body?.company_size, 60),
      matched_partner_ids: matched,
      session_hash: rawSession ? await hashSession(rawSession) : null,
    };

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { error } = await supabase.from("buyer_tool_events").insert(row);
    if (error) {
      console.error("buyer_tool_events insert failed:", error.message);
      return json({ error: "insert failed" }, 500);
    }

    return json({ success: true });
  } catch (err) {
    console.error("track-buyer-tool-event error:", err instanceof Error ? err.message : err);
    return json({ error: "unexpected error" }, 500);
  }
});
