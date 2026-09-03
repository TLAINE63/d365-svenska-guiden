import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";

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
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/)) return true;
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovable\.app$/)) return true;
  return false;
}

function corsHeadersFor(req: Request): Record<string, string> {
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
  const bin = atob(base64UrlToBase64(str));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function verifyJWT(token: string, secret: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false, error: "Invalid token format" };
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("HMAC", key, base64UrlDecode(s) as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return { valid: false, error: "Invalid signature" };
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return { valid: false, error: "Token expired" };
    if (payload.role !== "admin") return { valid: false, error: "Insufficient permissions" };
    return { valid: true };
  } catch (e) {
    console.error("JWT verify failed", e);
    return { valid: false, error: "Token verification failed" };
  }
}

const PRODUCT_AREAS = [
  "business-central",
  "finance-scm",
  "crm-sales",
  "crm-service",
  "power-platform",
  "microsoft-ai",
  "ovrigt",
] as const;
const NEWS_TYPES = [
  "kundcase",
  "event",
  "webinar",
  "erbjudande",
  "artikel",
  "rapport",
  "branschlosning",
  "produktnyhet",
  "analys",
] as const;
const SOURCE_TYPES = ["linkedin", "partner_web", "blog", "press", "webinar", "event", "other"] as const;

const INDUSTRIES = [
  "Jordbruk & Skogsbruk",
  "Livsmedel & Processindustri",
  "Tillverkningsindustri",
  "Life Science / Medtech",
  "Energi & Utilities",
  "Bygg, Entreprenad & Installation",
  "Grossist & Distribution",
  "Retail & E-handel",
  "Mode, Sport & Textil",
  "Transport & Logistik",
  "Media & Publishing",
  "Telekom & IT-tjänster",
  "Finans & Försäkring",
  "Fastighet & Förvaltning",
  "Konsulttjänster",
  "Uthyrningsverksamhet",
  "Offentlig sektor",
  "Utbildning",
  "Hälsa- & sjukvård",
  "Non-profit / Organisationer",
  "Medlemsorganisationer",
];

const BodySchema = z.object({
  token: z.string().min(10),
  url: z.string().trim().url().max(2000).optional().or(z.literal("")),
  pasted_text: z.string().trim().max(20000).optional(),
});

// ---------- HTML extraction (no rewriting – verbatim text only) ----------
function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function meta(html: string, prop: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${prop}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1]).trim();
  }
  return null;
}

function extractBodyText(html: string): string {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ");
  const article = cleaned.match(/<article\b[\s\S]*?<\/article>/i)?.[0] ?? cleaned;
  const paragraphs = [...article.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => decodeEntities(m[1].replace(/<[^>]+>/g, " ")).replace(/[ \t]+/g, " ").trim())
    .filter((t) => t.length > 30);
  if (paragraphs.length > 0) return paragraphs.join("\n\n");
  return decodeEntities(article.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function toISODate(input?: string | null): string {
  if (!input) return new Date().toISOString().slice(0, 10);
  const d = new Date(input);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function guessSourceType(url: string): typeof SOURCE_TYPES[number] {
  const u = url.toLowerCase();
  if (u.includes("linkedin.com")) return "linkedin";
  if (u.includes("/blog") || u.includes("/blogg")) return "blog";
  if (u.includes("webinar") || u.includes("webinarium")) return "webinar";
  if (u.includes("event") || u.includes("kalender")) return "event";
  if (u.includes("press") || u.includes("nyhet")) return "press";
  return "partner_web";
}

// ---------- AI: categorisation only (never rewrites the text) ----------
async function categorise(text: string, title: string, apiKey: string): Promise<{
  product_areas: string[];
  news_type: string;
  industry: string | null;
} | null> {
  const prompt = `Du klassificerar ett inlägg från en Microsoft Dynamics 365-partner.
Du får INTE skriva om, sammanfatta eller kommentera texten. Svara enbart med JSON.

Tillåtna produktområden: ${PRODUCT_AREAS.join(", ")}
Tillåtna nyhetstyper: ${NEWS_TYPES.join(", ")}
Tillåtna branscher (eller null om inget tydligt): ${INDUSTRIES.join(" | ")}

Svara med exakt: {"product_areas":["..."],"news_type":"...","industry":"..." eller null}

RUBRIK: ${title}
TEXT: ${text.slice(0, 4000)}`;

  try {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-lite",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!resp.ok) {
      const body = await resp.text();
      console.error(`AI categorise failed [${resp.status}]: ${body}`);
      return null;
    }
    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim());
    const areas = Array.isArray(parsed.product_areas)
      ? parsed.product_areas.filter((a: string) => (PRODUCT_AREAS as readonly string[]).includes(a))
      : [];
    const newsType = (NEWS_TYPES as readonly string[]).includes(parsed.news_type) ? parsed.news_type : "artikel";
    const industry = typeof parsed.industry === "string" && INDUSTRIES.includes(parsed.industry) ? parsed.industry : null;
    return { product_areas: areas.length ? areas : ["ovrigt"], news_type: newsType, industry };
  } catch (e) {
    console.error("AI categorise error", e);
    return null;
  }
}

serve(async (req) => {
  const cors = corsHeadersFor(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const json = (payload: unknown, status = 200) =>
    new Response(JSON.stringify(payload), { status, headers: { "Content-Type": "application/json", ...cors } });

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Ogiltig begäran", details: parsed.error.flatten().fieldErrors }, 400);

    const jwtSecret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!jwtSecret) return json({ error: "Serverfel: autentisering ej konfigurerad" }, 500);
    const v = await verifyJWT(parsed.data.token, jwtSecret);
    if (!v.valid) {
      return json({ error: v.error === "Token expired" ? "Sessionen har gått ut. Logga in igen." : "Ogiltig session" }, 401);
    }

    const url = (parsed.data.url || "").trim();
    const pasted = (parsed.data.pasted_text || "").trim();
    if (!url && !pasted) return json({ error: "Ange en länk eller klistra in texten." }, 400);

    let title = "";
    let text = pasted;
    let image: string | null = null;
    let date: string | null = null;
    let blocked = false;

    if (url && !pasted) {
      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; d365.se-news-import/1.0; +https://d365.se)",
            Accept: "text/html,application/xhtml+xml",
          },
          redirect: "follow",
          signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        title = meta(html, "og:title") || decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
        image = meta(html, "og:image");
        date = meta(html, "article:published_time") || meta(html, "og:updated_time") || meta(html, "datePublished");
        const body = extractBodyText(html);
        const ogDesc = meta(html, "og:description") || meta(html, "description") || "";
        text = body.length > ogDesc.length ? body : ogDesc;
        if (text.length < 80) blocked = true;
      } catch (e) {
        console.error("fetch failed", (e as Error).message);
        blocked = true;
      }
    }

    if (blocked && !pasted) {
      return json({
        success: false,
        needs_paste: true,
        message:
          "Sidan kunde inte läsas automatiskt (LinkedIn kräver ofta inloggning). Klistra in inläggets text i fältet nedan så fylls resten i automatiskt.",
        source_url: url,
        source_type: url ? guessSourceType(url) : "linkedin",
      });
    }

    if (!title) {
      const firstLine = text.split("\n").map((l) => l.trim()).find((l) => l.length > 0) ?? "";
      title = firstLine.slice(0, 200);
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    const suggestion = apiKey ? await categorise(text, title, apiKey) : null;

    return json({
      success: true,
      needs_paste: false,
      draft: {
        editorial_title: title.slice(0, 200),
        // Ordagrann text från partnern – aldrig omskriven av AI.
        summary: text.replace(/\n{3,}/g, "\n\n").trim().slice(0, 600),
        full_text: text.slice(0, 6000),
        truncated: text.trim().length > 600,
        source_url: url || "",
        source_type: url ? guessSourceType(url) : "linkedin",
        image_url: image,
        news_date: toISODate(date),
        product_areas: suggestion?.product_areas ?? ["ovrigt"],
        news_type: suggestion?.news_type ?? "artikel",
        industry: suggestion?.industry ?? null,
        ai_categorised: !!suggestion,
      },
    });
  } catch (err) {
    console.error("import-partner-news-url error", err);
    return json({ error: (err as Error).message || "Serverfel" }, 500);
  }
});
