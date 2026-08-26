import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const SITE = "https://d365.se";

/** Kända AI-crawlers och söksrobotar som hämtar sajten serverside. */
const BOTS: { id: string; label: string; match: string[] }[] = [
  { id: "gptbot", label: "GPTBot (OpenAI)", match: ["gptbot"] },
  { id: "oai-searchbot", label: "OAI-SearchBot (OpenAI)", match: ["oai-searchbot"] },
  { id: "chatgpt-user", label: "ChatGPT-User (OpenAI)", match: ["chatgpt-user"] },
  { id: "perplexitybot", label: "PerplexityBot", match: ["perplexitybot", "perplexity-user"] },
  { id: "claudebot", label: "ClaudeBot (Anthropic)", match: ["claudebot", "anthropic-ai", "claude-web", "claude-user", "claude-searchbot"] },
  { id: "google-extended", label: "Google-Extended (Gemini)", match: ["google-extended"] },
  { id: "googleother", label: "GoogleOther", match: ["googleother"] },
  { id: "applebot-extended", label: "Applebot-Extended", match: ["applebot-extended"] },
  { id: "applebot", label: "Applebot", match: ["applebot"] },
  { id: "ccbot", label: "CCBot (Common Crawl)", match: ["ccbot"] },
  { id: "meta-ai", label: "Meta AI", match: ["meta-externalagent", "facebookbot"] },
  { id: "bytespider", label: "Bytespider (TikTok)", match: ["bytespider"] },
  { id: "amazonbot", label: "Amazonbot", match: ["amazonbot"] },
  { id: "mistralai", label: "MistralAI-User", match: ["mistralai"] },
  { id: "cohere", label: "Cohere", match: ["cohere-ai", "cohere-training-data-crawler"] },
  { id: "diffbot", label: "Diffbot", match: ["diffbot"] },
  { id: "youbot", label: "YouBot (You.com)", match: ["youbot"] },
  { id: "petalbot", label: "PetalBot (Huawei)", match: ["petalbot"] },
  { id: "timpibot", label: "Timpibot", match: ["timpibot"] },
  // Brave Search – deklarerar normalt ingen egen UA men matchas om den gör det
  { id: "bravebot", label: "Brave Search", match: ["bravebot", "brave-search", "bravesearch"] },
  // Klassiska sökrobotar – med som jämförelse
  { id: "googlebot", label: "Googlebot", match: ["googlebot"] },
  { id: "bingbot", label: "Bingbot", match: ["bingbot", "adidxbot"] },
  { id: "duckduckbot", label: "DuckDuckBot", match: ["duckduckbot", "duckassistbot"] },
  { id: "yandexbot", label: "YandexBot", match: ["yandexbot"] },
  { id: "seznambot", label: "SeznamBot", match: ["seznambot"] },
];


function classifyBot(ua: string): { id: string; label: string } {
  const u = (ua || "").toLowerCase();
  for (const b of BOTS) {
    for (const m of b.match) if (u.includes(m)) return { id: b.id, label: b.label };
  }
  if (!u) return { id: "unknown", label: "Okänd (ingen user-agent)" };
  if (/\bbot\b|crawler|spider|crawl/.test(u)) return { id: "other-bot", label: "Övrig robot" };
  return { id: "human-or-other", label: "Webbläsare/övrigt" };
}

function anonymizeIp(ip: string): string | null {
  if (!ip) return null;
  const first = ip.split(",")[0].trim();
  if (first.includes(":")) return first.split(":").slice(0, 3).join(":") + "::";
  const parts = first.split(".");
  if (parts.length !== 4) return null;
  return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
}

const SITEMAPS = [
  "sitemap-pages.xml",
  "sitemap-partners.xml",
  "sitemap-branscher.xml",
  "sitemap-articles.xml",
  "sitemap-events.xml",
  "sitemap-jamfor.xml",
];

function sitemapIndexXml(): string {
  const entries = SITEMAPS.map((f) => `  <sitemap>\n    <loc>${SITE}/${f}</loc>\n  </sitemap>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const resource = (url.searchParams.get("r") || "sitemap").toLowerCase();
  const ua = req.headers.get("user-agent") || "";
  const bot = classifyBot(ua);

  // Logga alltid (fire and forget – svaret får aldrig blockeras av loggen).
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("cf-connecting-ip") ||
      "";
    await supabase.from("crawler_hits").insert({
      bot_id: bot.id,
      bot_label: bot.label,
      user_agent: ua.slice(0, 500),
      path: `/${resource}`,
      referrer: (req.headers.get("referer") || "").slice(0, 300) || null,
      ip_prefix: anonymizeIp(ip),
    });
  } catch (e) {
    console.error("crawler-log insert failed", e);
  }

  if (resource === "llms") {
    try {
      const res = await fetch(`${SITE}/llms.txt`);
      const text = await res.text();
      return new Response(text, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
      });
    } catch {
      return Response.redirect(`${SITE}/llms.txt`, 302);
    }
  }

  return new Response(sitemapIndexXml(), {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
});
