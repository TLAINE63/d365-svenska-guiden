import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { D365_MARKET_CONTEXT_SV } from "../_shared/market-context.ts";

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
    if (payload.role !== "admin") return { valid: false as const, error: "Insufficient permissions" };
    return { valid: true as const, payload };
  } catch {
    return { valid: false as const, error: "Token verification failed" };
  }
}

const APP_LABELS: Record<string, string> = {
  bc: "Business Central (ekonomi/ERP)",
  fsc: "Finance & Supply Chain Management (stor ERP)",
  sales: "Sales (CRM)",
  service: "Customer Service",
  field_service: "Field Service",
  project_operations: "Project Operations",
  hr: "Human Resources",
  commerce: "Commerce",
};

function buildPrompt(p: any): string {
  const apps = (p.applications || []).map((a: string) => APP_LABELS[a] || a).join(", ") || "okänt";
  const industries = [...(p.industries || []), ...(p.secondary_industries || [])].join(", ") || "ej specificerat";
  const geo = (p.geography || []).join(", ") || "ej specificerat";
  const cities = (p.office_cities || []).join(", ");
  const platforms = (p.platform_capabilities || []).join(", ");
  const customers = (p.customer_examples || []).slice(0, 8).join(", ");
  const desc = (p.description || "").slice(0, 2000);
  const extended = (p.extended_content || "").slice(0, 4000);
  const positioning = (p.positioning_statement || "").slice(0, 600);

  return `Du skriver "d365.se:s analys" om en Microsoft Dynamics 365-partner på svenska. Analysen är redaktionell, neutral och köparsidig – den ska hjälpa en kund att förstå när partnern är relevant.

Svara ENDAST med giltig JSON i exakt detta format:
{
  "ai_summary_full": "2–4 stycken fördjupad analys, separerade med radbrytning (\\n).",
  "best_fit_for": ["4–6 korta punkter, max 12 ord per punkt"],
  "ai_tags": ["5–8 korta taggar, 1–3 ord vardera"]
}

REGLER:
- Skriv i tredje person, faktabaserat, utan superlativ ("bäst", "ledande", "marknadsledande") och utan säljjargong.
- Nämn inte pris, konkurrenter eller exakt antal anställda.
- "best_fit_for" ska beskriva kundtyper/situationer där partnern passar (bransch, storlek, produktområde, projekttyp).
- "ai_tags" ska vara sökbara nyckelord (produktområden, branscher, kompetenser).
- Ingen meta-text, inga rubriker, ingen markdown.

PARTNERDATA:
Namn: ${p.name}
Positionering: ${positioning || "(saknas)"}
Beskrivning från partnern: ${desc || "(saknas)"}
Fördjupningstext: ${extended || "(saknas)"}
D365-applikationer: ${apps}
Branscher: ${industries}
Geografi: ${geo}
Orter med kontor: ${cities || "ej angett"}
Plattformskompetenser: ${platforms || "ej angett"}
Kundexempel: ${customers || "ej angett"}`;
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

async function generateInsights(partner: any, apiKey: string) {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `Du är en neutral redaktör som skriver faktabaserade partneranalyser för en köparsidig jämförelsesajt.\n\n${D365_MARKET_CONTEXT_SV}\n\nAnvänd marknadskontexten för att placera partnern i rätt kategori. Citera inte rapporten ordagrant. Svara endast med JSON.`,
        },
        { role: "user", content: buildPrompt(partner) },
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
  const toArray = (v: unknown): string[] =>
    Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean).slice(0, 12) : [];

  return {
    ai_summary_full: String(parsed.ai_summary_full || "").trim().slice(0, 6000) || null,
    best_fit_for: toArray(parsed.best_fit_for),
    ai_tags: toArray(parsed.ai_tags),
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
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const v = await verifyJWT(token || "", JWT_SECRET);
    if (!v.valid) {
      return new Response(JSON.stringify({ error: "Ogiltig session" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!partnerId || typeof partnerId !== "string") {
      return new Response(JSON.stringify({ error: "partnerId krävs" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: partner, error } = await supabase.from("partners").select("*").eq("id", partnerId).maybeSingle();
    if (error) throw error;
    if (!partner) {
      return new Response(JSON.stringify({ error: "Partnern hittades inte" }), {
        status: 404, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const insights = await generateInsights(partner, LOVABLE_API_KEY);

    const { error: upErr } = await supabase
      .from("partners")
      .update(insights)
      .eq("id", partnerId);
    if (upErr) throw upErr;

    return new Response(JSON.stringify({ ok: true, insights }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("generate-partner-insights error:", msg);
    const status = msg === "RATE_LIMIT" ? 429 : msg === "PAYMENT_REQUIRED" ? 402 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
