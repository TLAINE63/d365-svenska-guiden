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
    "Access-Control-Allow-Credentials": "true",
  };
}

function base64UrlToBase64(str: string): string {
  let b = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function base64UrlDecode(str: string): Uint8Array {
  const binary = atob(base64UrlToBase64(str));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
async function verifyJWT(token: string, secret: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false, error: "Invalid token format", payload: null as any };
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(s) as unknown as BufferSource,
      enc.encode(`${h}.${p}`),
    );
    if (!valid) return { valid: false, error: "Invalid signature", payload: null };
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return { valid: false, error: "Token expired", payload: null };
    if (payload.role !== "admin") return { valid: false, error: "Insufficient permissions", payload: null };
    return { valid: true, payload };
  } catch (e) {
    console.error("JWT verify error", e);
    return { valid: false, error: "Token verification failed", payload: null };
  }
}

/** Kända AI-assistenter som skickar referrer-trafik. */
const AI_SOURCES: { id: string; label: string; hosts: string[] }[] = [
  { id: "chatgpt", label: "ChatGPT", hosts: ["chatgpt.com", "chat.openai.com", "openai.com"] },
  { id: "perplexity", label: "Perplexity", hosts: ["perplexity.ai"] },
  { id: "copilot", label: "Microsoft Copilot", hosts: ["copilot.microsoft.com", "bing.com/chat", "m365.cloud.microsoft"] },
  { id: "gemini", label: "Google Gemini", hosts: ["gemini.google.com", "bard.google.com"] },
  { id: "claude", label: "Claude", hosts: ["claude.ai", "anthropic.com"] },
  { id: "other-ai", label: "Övriga AI-tjänster", hosts: ["you.com", "phind.com", "poe.com", "mistral.ai", "grok.com", "x.ai", "deepseek.com", "kagi.com"] },
];

function classifyAiSource(referrer: string | null): { id: string; label: string } | null {
  if (!referrer) return null;
  const ref = referrer.toLowerCase();
  for (const src of AI_SOURCES) {
    for (const h of src.hosts) {
      if (ref.includes(h)) return { id: src.id, label: src.label };
    }
  }
  return null;
}

/** AI-crawlers som kan dyka upp i user_agent (endast om de kör JS). */
const AI_CRAWLERS: { id: string; label: string; match: string[] }[] = [
  { id: "gptbot", label: "GPTBot (OpenAI)", match: ["gptbot"] },
  { id: "oai-searchbot", label: "OAI-SearchBot", match: ["oai-searchbot"] },
  { id: "chatgpt-user", label: "ChatGPT-User", match: ["chatgpt-user"] },
  { id: "perplexitybot", label: "PerplexityBot", match: ["perplexitybot", "perplexity-user"] },
  { id: "claudebot", label: "ClaudeBot", match: ["claudebot", "anthropic-ai", "claude-web"] },
  { id: "google-extended", label: "Google-Extended", match: ["google-extended"] },
  { id: "bingbot-ai", label: "Bing / Copilot", match: ["bingbot"] },
  { id: "applebot-extended", label: "Applebot-Extended", match: ["applebot"] },
  { id: "ccbot", label: "CCBot (Common Crawl)", match: ["ccbot"] },
  { id: "meta-ai", label: "Meta AI", match: ["meta-externalagent", "facebookbot"] },
];

function classifyCrawler(ua: string | null): { id: string; label: string } | null {
  if (!ua) return null;
  const u = ua.toLowerCase();
  for (const c of AI_CRAWLERS) {
    for (const m of c.match) if (u.includes(m)) return { id: c.id, label: c.label };
  }
  return null;
}

function monthKey(iso: string): string {
  return (iso || "").slice(0, 7);
}

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const token = body?.token || "";
    const action: string = body?.action || "stats";

    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!JWT_SECRET) {
      return new Response(JSON.stringify({ error: "Auth not configured" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const v = await verifyJWT(token, JWT_SECRET);
    if (!v.valid) {
      return new Response(
        JSON.stringify({ error: v.error === "Token expired" ? "Sessionen har gått ut. Logga in igen." : "Ogiltig session" }),
        { status: 401, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // ── Citeringslogg: skriv-operationer ──
    if (action === "save-citation") {
      const c = body?.citation || {};
      if (!c.check_month || !c.engine || !c.query_text) {
        return new Response(JSON.stringify({ error: "check_month, engine och query_text krävs" }), {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      const row = {
        check_month: String(c.check_month).slice(0, 7) + "-01",
        engine: String(c.engine).slice(0, 60),
        query_text: String(c.query_text).slice(0, 300),
        mentioned: !!c.mentioned,
        position_note: c.position_note ? String(c.position_note).slice(0, 200) : null,
        source_url: c.source_url ? String(c.source_url).slice(0, 500) : null,
        notes: c.notes ? String(c.notes).slice(0, 1000) : null,
      };
      const res = c.id
        ? await supabase.from("ai_citation_checks").update(row).eq("id", c.id).select().single()
        : await supabase.from("ai_citation_checks").insert(row).select().single();
      if (res.error) {
        console.error("save-citation failed", res.error);
        return new Response(JSON.stringify({ error: "Kunde inte spara" }), {
          status: 500,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ citation: res.data }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    if (action === "delete-citation") {
      const id = body?.id;
      if (!id) {
        return new Response(JSON.stringify({ error: "id krävs" }), {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase.from("ai_citation_checks").delete().eq("id", id);
      if (error) {
        console.error("delete-citation failed", error);
        return new Response(JSON.stringify({ error: "Kunde inte ta bort" }), {
          status: 500,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // ── Statistik ──
    const since = new Date(Date.now() - 365 * 86400000).toISOString();

    // Interna besök exkluderas: adminens egen IP-prefix + partner-uppdateringssidan.
    const adminIp = (v.payload?.ip as string) || "";
    const adminIpPrefix = adminIp ? adminIp.split(".").slice(0, 2).join(".") : "";
    const excludedPrefixes = new Set<string>();
    if (adminIpPrefix) excludedPrefixes.add(adminIpPrefix);
    const { data: puVisits } = await supabase
      .from("visitor_analytics")
      .select("ip_anonymized")
      .like("page_path", "%partner-uppdatering%");
    for (const r of puVisits || []) {
      if (r.ip_anonymized && r.ip_anonymized !== "unknown") {
        excludedPrefixes.add(r.ip_anonymized.split(".").slice(0, 2).join("."));
      }
    }

    const rows: {
      page_path: string;
      referrer: string | null;
      user_agent: string | null;
      visited_at: string;
      ip_anonymized: string | null;
      session_id: string | null;
    }[] = [];
    const pageSize = 1000;
    for (let from = 0; from < 200000; from += pageSize) {
      const { data, error } = await supabase
        .from("visitor_analytics")
        .select("page_path, referrer, user_agent, visited_at, ip_anonymized, session_id")
        .gte("visited_at", since)
        .order("visited_at", { ascending: false })
        .range(from, from + pageSize - 1);
      if (error) {
        console.error("query error", error);
        return new Response(JSON.stringify({ error: "query failed" }), {
          status: 500,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }
      if (!data || data.length === 0) break;
      rows.push(...data);
      if (data.length < pageSize) break;
    }

    const isExcluded = (ipAnon: string | null) => {
      if (!ipAnon || ipAnon === "unknown") return false;
      return excludedPrefixes.has(ipAnon.split(".").slice(0, 2).join("."));
    };

    const visits = rows.filter((r) => !isExcluded(r.ip_anonymized));

    const byMonth = new Map<string, { month: string; total: number; bySource: Record<string, number> }>();
    const bySourceTotal = new Map<string, { id: string; label: string; visits: number; sessions: Set<string> }>();
    const landingPages = new Map<string, number>();
    const crawlerHits = new Map<string, { id: string; label: string; hits: number; lastSeen: string }>();
    let aiVisitsTotal = 0;
    let aiVisits30 = 0;
    const since30 = new Date(Date.now() - 30 * 86400000).toISOString();

    for (const r of visits) {
      const crawler = classifyCrawler(r.user_agent);
      if (crawler) {
        const c = crawlerHits.get(crawler.id) || { id: crawler.id, label: crawler.label, hits: 0, lastSeen: r.visited_at };
        c.hits++;
        if (r.visited_at > c.lastSeen) c.lastSeen = r.visited_at;
        crawlerHits.set(crawler.id, c);
        continue;
      }
      const src = classifyAiSource(r.referrer);
      if (!src) continue;

      aiVisitsTotal++;
      if (r.visited_at >= since30) aiVisits30++;

      const mk = monthKey(r.visited_at);
      const m = byMonth.get(mk) || { month: mk, total: 0, bySource: {} };
      m.total++;
      m.bySource[src.label] = (m.bySource[src.label] || 0) + 1;
      byMonth.set(mk, m);

      const s = bySourceTotal.get(src.id) || { id: src.id, label: src.label, visits: 0, sessions: new Set<string>() };
      s.visits++;
      const key = r.ip_anonymized && r.ip_anonymized !== "unknown" ? r.ip_anonymized : r.session_id;
      if (key) s.sessions.add(`${key}|${r.visited_at.slice(0, 10)}`);
      bySourceTotal.set(src.id, s);

      const path = r.page_path || "(okänd)";
      landingPages.set(path, (landingPages.get(path) || 0) + 1);
    }

    const { data: citations } = await supabase
      .from("ai_citation_checks")
      .select("*")
      .order("check_month", { ascending: false })
      .order("engine", { ascending: true })
      .limit(500);

    const citationTrend = new Map<string, { month: string; checks: number; mentions: number }>();
    for (const c of citations || []) {
      const mk = String(c.check_month).slice(0, 7);
      const t = citationTrend.get(mk) || { month: mk, checks: 0, mentions: 0 };
      t.checks++;
      if (c.mentioned) t.mentions++;
      citationTrend.set(mk, t);
    }

    return new Response(
      JSON.stringify({
        totals: {
          aiVisits365: aiVisitsTotal,
          aiVisits30: aiVisits30,
          crawlerHits365: Array.from(crawlerHits.values()).reduce((a, c) => a + c.hits, 0),
        },
        byMonth: Array.from(byMonth.values()).sort((a, b) => b.month.localeCompare(a.month)).slice(0, 13),
        bySource: Array.from(bySourceTotal.values())
          .map((s) => ({ id: s.id, label: s.label, visits: s.visits, uniqueVisitors: s.sessions.size }))
          .sort((a, b) => b.visits - a.visits),
        landingPages: Array.from(landingPages.entries())
          .map(([path, views]) => ({ path, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 20),
        crawlers: Array.from(crawlerHits.values()).sort((a, b) => b.hits - a.hits),
        citations: citations || [],
        citationTrend: Array.from(citationTrend.values()).sort((a, b) => b.month.localeCompare(a.month)).slice(0, 13),
      }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("error", e);
    return new Response(JSON.stringify({ error: "internal" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
