import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  const allowedDomains = [
    "https://d365.se",
    "https://www.d365.se",
    "https://d365-svenska-guiden.lovable.app",
    "http://localhost:5173",
    "http://localhost:8080",
  ];
  if (allowedDomains.includes(origin)) return true;
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/)) return true;
  if (origin.match(/^https:\/\/[a-z0-9-]+\.lovable\.app$/)) return true;
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : "https://d365.se";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
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
    if (parts.length !== 3) return { valid: false as const, error: "Invalid token format" };
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sig = base64UrlDecode(s);
    const ok = await crypto.subtle.verify("HMAC", key, sig as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return { valid: false as const, error: "Invalid signature" };
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return { valid: false as const, error: "Token expired" };
    if (payload.role !== "admin" && payload.role !== "editor") {
      return { valid: false as const, error: "Insufficient permissions" };
    }
    return { valid: true as const, payload };
  } catch {
    return { valid: false as const, error: "Token verification failed" };
  }
}

const APP_LABELS: Record<string, string> = {
  bc: "Business Central",
  fsc: "Finance & Supply Chain Management",
  sales: "Sales",
  service: "Customer Service",
  field_service: "Field Service",
  project_operations: "Project Operations",
  hr: "Human Resources",
  commerce: "Commerce",
};

interface NewsRow {
  editorial_title: string;
  summary: string;
  news_type: string;
  product_areas: string[] | null;
  industry: string | null;
  news_date: string;
  source_url: string;
}

interface EventRow {
  title: string;
  description: string | null;
  event_date: string;
}

function parseJsonLoose(text: string): any {
  const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error("PARSE_ERROR");
  }
}

function buildPrompt(p: any, news: NewsRow[], events: EventRow[]): string {
  const apps = (p.applications || []).map((a: string) => APP_LABELS[a] || a).join(", ") || "okänt";
  const industries = [...(p.industries || []), ...(p.secondary_industries || [])].join(", ") || "ej specificerat";
  const platforms = (p.platform_capabilities || []).join(", ") || "ej angett";
  const customers = (p.customer_examples || []).slice(0, 12).join(", ") || "ej angett";
  const desc = (p.description || "").slice(0, 2000);
  const extended = (p.extended_content || "").slice(0, 4000);

  const newsLines = news
    .slice(0, 40)
    .map(
      (n) =>
        `- [${n.news_date}] (${n.news_type}) ${n.editorial_title}: ${(n.summary || "").slice(0, 300)}${
          n.product_areas?.length ? ` | produktområden: ${n.product_areas.join(", ")}` : ""
        }${n.industry ? ` | bransch: ${n.industry}` : ""}`,
    )
    .join("\n");

  const eventLines = events
    .slice(0, 20)
    .map((e) => `- [${e.event_date}] ${e.title}: ${(e.description || "").slice(0, 200)}`)
    .join("\n");

  return `Du sammanställer sektionen "Kompletterande information baserad på publika källor" om en Microsoft Dynamics 365-partner på svenska för d365.se. Sektionen är ett komplement till partnerns egen profiltext och bygger enbart på observationer i underlaget nedan.

Svara ENDAST med giltig JSON i exakt detta format:
{
  "public_profile_summary": "2 till 3 korta stycken, separerade med radbrytning (\\n).",
  "public_focus_tags": ["6 till 10 taggar, 1 till 3 ord vardera"],
  "public_topics_12m": ["0 till 8 ämnen som återkommer i materialet från senaste 12 månaderna, vanligast först"]
}

REGLER:
- Skriv i tredje person, observerande och faktabaserat. Formulera som "Analys av publika källor visar att ...", "Innehållet indikerar ...".
- Inga superlativ, ingen säljjargong, inga omdömen om kvalitet.
- Nämn aldrig andra partners eller konkurrenter vid namn, inga priser, inga certifieringsnivåer som inte framgår av underlaget.
- Använd aldrig långa tankstreck. Använd komma, punkt eller parentes.
- Taggar ska vara produktområden, teknikområden och branscher som faktiskt syns i underlaget.
- "public_topics_12m" bygger endast på nyheter, inlägg, webbinarier och event i 12-månadersmaterialet. Finns inget sådant material, returnera tom lista.
- Ingen meta-text, inga rubriker, ingen markdown.

PARTNER: ${p.name}
Webbplats: ${p.website || "ej angett"}
D365-applikationer i profilen: ${apps}
Branscher i profilen: ${industries}
Plattformskompetenser: ${platforms}
Kundexempel: ${customers}
Partnerns beskrivning: ${desc || "(saknas)"}
Fördjupningstext: ${extended || "(saknas)"}

PUBLICERADE INLÄGG OCH NYHETER SENASTE 12 MÅNADERNA:
${newsLines || "(inget material)"}

EVENT OCH WEBBINARIER SENASTE 12 MÅNADERNA:
${eventLines || "(inget material)"}`;
}

async function generate(p: any, news: NewsRow[], events: EventRow[], apiKey: string) {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "Du är en neutral redaktör som sammanställer observationer från publika källor om Dynamics 365-partners. Du hittar aldrig på uppgifter som inte finns i underlaget. Svara endast med JSON.",
        },
        { role: "user", content: buildPrompt(p, news, events) },
      ],
    }),
  });

  if (resp.status === 429) throw new Error("RATE_LIMIT");
  if (resp.status === 402) throw new Error("PAYMENT_REQUIRED");
  if (!resp.ok) {
    console.error("AI gateway error:", resp.status, await resp.text());
    throw new Error("AI_GATEWAY_ERROR");
  }

  const data = await resp.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("EMPTY_RESPONSE");

  const parsed = parseJsonLoose(text);
  const toArray = (v: unknown, max: number): string[] =>
    Array.isArray(v)
      ? Array.from(new Set(v.map((x) => String(x).replace(/—/g, ",").trim()).filter(Boolean))).slice(0, max)
      : [];

  return {
    public_profile_summary:
      String(parsed.public_profile_summary || "").replace(/—/g, ",").trim().slice(0, 4000) || null,
    public_focus_tags: toArray(parsed.public_focus_tags, 10),
    public_topics_12m: toArray(parsed.public_topics_12m, 8),
  };
}

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { token, partnerId } = await req.json();

    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!JWT_SECRET || !LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Servern är inte korrekt konfigurerad" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const v = await verifyJWT(token || "", JWT_SECRET);
    if (!v.valid) {
      return new Response(JSON.stringify({ error: "Ogiltig session" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!partnerId || typeof partnerId !== "string") {
      return new Response(JSON.stringify({ error: "partnerId krävs" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: partner, error } = await supabase
      .from("partners")
      .select("*")
      .eq("id", partnerId)
      .maybeSingle();
    if (error) throw error;
    if (!partner) {
      return new Response(JSON.stringify({ error: "Partnern hittades inte" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const since = new Date();
    since.setMonth(since.getMonth() - 12);
    const sinceIso = since.toISOString().slice(0, 10);

    const [newsRes, eventsRes] = await Promise.all([
      supabase
        .from("partner_news")
        .select("editorial_title,summary,news_type,product_areas,industry,news_date,source_url")
        .eq("partner_id", partnerId)
        .gte("news_date", sinceIso)
        .order("news_date", { ascending: false })
        .limit(60),
      supabase
        .from("partner_events")
        .select("title,description,event_date")
        .eq("partner_id", partnerId)
        .gte("event_date", sinceIso)
        .order("event_date", { ascending: false })
        .limit(30),
    ]);

    const news = (newsRes.data || []) as NewsRow[];
    const events = (eventsRes.data || []) as EventRow[];

    const result = await generate(partner, news, events, LOVABLE_API_KEY);

    const sources: string[] = [];
    if (partner.website) sources.push(partner.website);
    for (const n of news) {
      if (n.source_url && !sources.includes(n.source_url)) sources.push(n.source_url);
      if (sources.length >= 20) break;
    }

    const payload = {
      ...result,
      public_profile_sources: sources,
      public_profile_updated_at: new Date().toISOString(),
    };

    const { error: upErr } = await supabase.from("partners").update(payload).eq("id", partnerId);
    if (upErr) throw upErr;

    return new Response(
      JSON.stringify({
        ok: true,
        insights: payload,
        counts: { news: news.length, events: events.length },
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("generate-partner-public-profile error:", msg);
    const status = msg === "RATE_LIMIT" ? 429 : msg === "PAYMENT_REQUIRED" ? 402 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
