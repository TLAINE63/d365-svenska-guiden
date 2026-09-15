// Publik AI-synlighet för en partnerprofil.
// Returnerar dels d365.se:s AI-synlighet totalt, dels robotbesök på just
// den partnerns profilsida. Ingen persondata exponeras.
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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const AI_BOT_IDS = new Set([
  "gptbot",
  "oai-searchbot",
  "chatgpt-user",
  "perplexitybot",
  "claudebot",
  "google-extended",
  "applebot-extended",
  "ccbot",
  "meta-ai",
  "bytespider",
  "amazonbot",
  "mistralai",
  "cohere",
  "diffbot",
  "youbot",
  "timpibot",
]);

const AI_REFERRER_MATCH = [
  "chatgpt",
  "openai",
  "perplexity",
  "copilot.microsoft",
  "gemini.google",
  "bard.google",
  "claude.ai",
  "you.com",
  "phind",
];

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const slug = String(body?.slug || "").trim().toLowerCase().slice(0, 120);
    if (!/^[a-z0-9-]*$/.test(slug)) {
      return new Response(JSON.stringify({ error: "Ogiltig partner" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const since90 = new Date(Date.now() - 90 * 86400000).toISOString();
    const since365 = new Date(Date.now() - 365 * 86400000).toISOString();
    const monthPrefix = new Date().toISOString().slice(0, 4);

    const [hitsRes, refRes, citeRes] = await Promise.all([
      supabase
        .from("crawler_hits")
        .select("bot_id, bot_label, path, hit_at")
        .gte("hit_at", since365)
        .limit(200000),
      supabase
        .from("visitor_analytics")
        .select("referrer")
        .gte("visited_at", since90)
        .not("referrer", "is", null)
        .limit(100000),
      supabase
        .from("ai_citation_checks")
        .select("mentioned, check_month")
        .gte("check_month", `${monthPrefix}-01-01`)
        .limit(5000),
    ]);

    const hits = hitsRes.data || [];
    const partnerPath = slug ? `/partner/${slug}` : "";

    let siteHits90 = 0;
    let siteHits365 = 0;
    let partnerHits90 = 0;
    const siteBots = new Set<string>();
    const partnerBots = new Set<string>();
    const tally = new Map<string, number>();

    for (const h of hits) {
      const botId = String(h.bot_id || "");
      if (!AI_BOT_IDS.has(botId)) continue;
      const label = String(h.bot_label || botId);
      siteHits365++;
      const recent = String(h.hit_at || "") >= since90;
      if (recent) {
        siteHits90++;
        siteBots.add(label);
        tally.set(label, (tally.get(label) || 0) + 1);
        const path = String(h.path || "");
        if (partnerPath && (path === partnerPath || path.startsWith(`${partnerPath}/`))) {
          partnerHits90++;
          partnerBots.add(label);
        }
      }
    }

    let aiReferralVisits = 0;
    for (const r of refRes.data || []) {
      const ref = String(r.referrer || "").toLowerCase();
      if (AI_REFERRER_MATCH.some((m) => ref.includes(m))) aiReferralVisits++;
    }

    const citations = citeRes.data || [];

    return new Response(
      JSON.stringify({
        site: {
          botHits90: siteHits90,
          botHits365: siteHits365,
          botCount: siteBots.size,
          topBots: [...tally.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([label, hits]) => ({ label, hits })),
          aiReferralVisits,
          citationChecks: citations.length,
          citationMentions: citations.filter((c: { mentioned: boolean }) => c.mentioned).length,
        },
        partner: {
          slug,
          botHits90: partnerHits90,
          botCount: partnerBots.size,
        },
      }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("partner-ai-visibility error", e);
    return new Response(JSON.stringify({ error: "internal" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
