// Anonyma händelser (tool_completed, download) till demand_events. Loggar aldrig IP eller user agent.
import { createClient } from "npm:@supabase/supabase-js@2";

const ORIGINS = new Set(["https://d365.se", "https://www.d365.se"]);
// Verktyg i 1.1 och fria underlag i 1.3; ska matcha src/lib/demandEvents.ts.
const OBJECTS = new Set([
  "kom-igang", "snabbguide", "bc-matchningstest", "fscm-matchningstest", "crm-matchningstest",
  "kostnad", "implementationskalkylator", "kravspec-erp", "kravspec-sales", "kravspec-marketing", "kravspec-kundservice",
  "ai-readiness", "befintlig-kund", "nav-till-business-central",
  "roi-businesscentral", "roi-d365sales", "roi-finance-scm", "roi-customer-service", "roi-customer-insights", "roi-contact-center", "roi-field-service",
  "bc-matchningstest-pdf", "crm-matchningstest-pdf", "nav-till-business-central-pdf", "partnerlandskap-pdf", "partnerlandskap-csv", "e-bok-partnervalet",
]);
// Samma botfilter som track-funnel-event.
const BOT_PATTERNS = [
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i, /baiduspider/i,
  /yandexbot/i, /crawl/i, /spider/i, /bot\b/i, /lighthouse/i,
  /pagespeed/i, /semrush/i, /ahref/i, /headlesschrome/i, /phantomjs/i,
  /selenium/i, /puppeteer/i, /python-requests/i, /curl\//i, /wget\//i,
  /node-fetch/i, /axios\//i, /scrapy/i,
];
const isBot = (ua: string | null) => !ua || ua.length < 20 || BOT_PATTERNS.some((p) => p.test(ua));
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function cors(origin: string): Record<string, string> {
  const h: Record<string, string> = { "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", Vary: "Origin" };
  if (ORIGINS.has(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const h = cors(origin);
  const json = (b: unknown, status: number) => new Response(JSON.stringify(b), { status, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
  if (!ORIGINS.has(origin)) return json({ ok: false, error: "origin" }, 403);
  if (isBot(req.headers.get("user-agent"))) return json({ ok: true, ignored: "bot" }, 202);

  let body: any;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }
  const type = body?.type;
  if (type !== "tool_completed" && type !== "download") return json({ ok: false, error: "invalid_type" }, 400);
  if (typeof body?.event_id !== "string" || !UUID.test(body.event_id)) return json({ ok: false, error: "invalid_id" }, 400);
  if (typeof body?.object !== "string" || !OBJECTS.has(body.object)) return json({ ok: false, error: "unknown_object" }, 400);
  const path = typeof body?.path === "string" ? body.path.split("?")[0].split("#")[0].slice(0, 300) : null;

  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { error } = await sb.from("demand_events").upsert(
      { event_id: body.event_id, site: "d365.se", event_type: type, object: body.object, path, company_domain: null },
      { onConflict: "event_id", ignoreDuplicates: true },
    );
    if (error) return json({ ok: false, error: "store_failed" }, 500);
    return json({ ok: true }, 200);
  } catch {
    return json({ ok: false, error: "store_failed" }, 500);
  }
});
