import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { D365_MARKET_CONTEXT_SV } from "../_shared/market-context.ts";

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
function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : "https://d365.se";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

function b64u2b(s: string) { let b = s.replace(/-/g, "+").replace(/_/g, "/"); while (b.length % 4) b += "="; return b; }
function b64uDec(s: string) { const bin = atob(b64u2b(s)); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return a; }
async function verifyJWT(token: string, secret: string) {
  try {
    const [h, p, s] = token.split(".");
    if (!h || !p || !s) return { valid: false };
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("HMAC", key, b64uDec(s) as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return { valid: false };
    const payload = JSON.parse(atob(b64u2b(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return { valid: false };
    if (payload.role !== "admin") return { valid: false };
    return { valid: true };
  } catch { return { valid: false }; }
}

// Label maps (MUST stay in sync with src/lib/aiProfile.ts – canonical source
// of truth for AI-förmågor). Aldrig läcka råa capability-slugs till LLM-prompt,
// JSON-LD eller AI-citat – okända värden faller tillbaka på en generisk svensk
// etikett så att slugs som "ai-partner" eller "bc-agent" aldrig når besökaren.
const UNKNOWN_CAPABILITY_LABEL = "Övrig AI-förmåga";
const CAP_LABELS: Record<string, string> = {
  "standard-copilot": "Microsoft Standard AI / inbyggd Copilot",
  "copilot-studio": "Copilot Studio / agents",
  "power-platform": "Power Platform-automation med AI",
  "azure-ai": "Azure AI / Foundry / ML",
  "fabric-bi": "Power BI / Fabric och AI-driven analys",
  "ai-readiness": "AI-readiness och datakvalitet",
  "ai-governance": "AI-governance, säkerhet och behörigheter",
  "ai-adoption": "AI-adoption och utbildning",
  "industry-ai": "Branschspecifika AI-lösningar",
};
const USE_CASE_LABELS: Record<string, string> = {
  "readiness": "AI-readiness inför Copilot",
  "data-quality": "Datakvalitet och behörigheter inför Copilot",
  "copilot-studio-agent": "Copilot Studio-agent",
  "sales-automation": "Automatisering av säljprocess",
  "service-ai": "AI-stöd för kundservice",
  "finance-ai": "AI-stöd för ekonomi och rapportering",
  "scm-ai": "AI-stöd för inköp, lager eller supply chain",
  "forecast": "Prognos eller prediktiv analys",
  "anomaly": "Avvikelseanalys",
  "industry-agent": "Branschspecifik agent eller automation",
  "fabric-analytics": "Power BI/Fabric-baserad analys",
  "governance": "AI-governance och policy",
  "training": "Utbildning och adoption",
};
const EXP_LABELS: Record<string, string> = {
  "advisory": "Rådgivning/workshops",
  "pilot": "Pilot/PoC",
  "delivered": "Levererat i kundprojekt",
  "multiple": "Flera kundprojekt",
  "packaged": "Paketerat erbjudande finns",
  "established": "Etablerad AI-leveransmodell",
};

// Slug-safe label lookup. Om värdet saknas i vår ordbok returneras en generisk
// svensk fallback – aldrig den råa slug-strängen (den skulle annars kunna
// smyga in i AI-citat, JSON-LD-articleBody eller card-sammanfattningar).
function safeLabel(v: string, map: Record<string, string>): string {
  if (!v) return "";
  return map[v] || UNKNOWN_CAPABILITY_LABEL;
}
function labelList(vals: string[] | undefined, map: Record<string, string>): string {
  return (vals || []).map((v) => safeLabel(v, map)).filter(Boolean).join(", ");
}

const DELIVERY_LABELS: Record<string, string> = {
  "product-teams": "AI-kompetens finns i respektive produktteam",
  "central-team": "AI-kompetens finns i ett centralt/tvärfunktionellt AI-team",
  "combined": "Kombination av produktteam och centralt AI-team",
  "external-team": "Samarbete med koncerninternt eller externt AI-specialistteam",
  "advisory": "Erbjuder främst rådgivning kring AI/Copilot",
};
const PROJECT_COUNT_LABELS: Record<string, string> = {
  "1-2": "1–2 projekt",
  "3-5": "3–5 projekt",
  "6-10": "6–10 projekt",
  "10+": "10+ projekt",
};

function buildPrompt(p: any): string {
  const ai = p.ai_profile || {};
  const caps = labelList(ai.capabilities, CAP_LABELS) || "(ej angett)";
  const cases = labelList(ai.use_cases, USE_CASE_LABELS) || "(ej angett)";
  const areas = (ai.relevant_areas || []).join(", ") || "(ej angett)";
  const exp = safeLabel(ai.experience_level || "", EXP_LABELS) || "(ej angett)";
  const projects = safeLabel(ai.project_count_range || "", PROJECT_COUNT_LABELS) || "(ej angett)";
  const delivery = safeLabel(ai.delivery_model || "", DELIVERY_LABELS) || "(ej angett)";
  const desc = (ai.description || "").slice(0, 800);
  const industries = [...(p.industries || []), ...(p.secondary_industries || [])].join(", ") || "(ej angett)";

  return `Skriv en KORT, köparorienterad AI-sammanfattning för en Microsoft Dynamics 365-partner. Sammanfattningen ska hjälpa en köpare snabbt avgöra: "Är detta en AI-partner som passar oss?"

REGLER:
- Max 2 meningar, totalt 40–55 ord.
- Neutral rådgivande ton – ingen säljjargong, inga superlativ ("bäst", "ledande", "experter"), inget om certifieringar eller antal medarbetare.
- Nämn ALDRIG andra partners/konkurrenter vid namn och gör inga jämförelser med namngivna företag. Påstå inget om certifieringsnivå, designations eller antal certifierade konsulter som inte uttryckligen framgår av underlaget.
- Använd inte ordet "oberoende".
- Fokusera på VAD partnern gör inom AI (t.ex. "praktisk erfarenhet av att införa AI i affärsprocesser" vs "bygger egna AI-modeller") och VILKEN typ av organisation den passar.
- Nämn Microsofts AI-plattform, Copilot, Power Platform, Azure AI eller agenter endast om det speglar partnerns faktiska förmågor nedan.
- Skriv i tredje person ("Partnern...").
- Inga rubriker, inga citattecken, inga punktlistor – bara ren prosa.

PARTNERDATA:
Namn: ${p.name}
Branscher: ${industries}
AI-förmågor: ${caps}
Typiska use cases: ${cases}
Relevanta områden: ${areas}
Erfarenhetsnivå: ${exp}
Antal AI-projekt: ${projects}
Leveransmodell: ${delivery}
Partnerns egen AI-beskrivning: ${desc || "(saknas)"}

Skriv sammanfattningen nu.`;
}

async function callAI(prompt: string, apiKey: string): Promise<string> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: `Du är en seniorrådgivare som skriver korta, köparorienterade AI-sammanfattningar för D365-partners.\n\n${D365_MARKET_CONTEXT_SV}` },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (resp.status === 429) throw new Error("RATE_LIMIT");
  if (resp.status === 402) throw new Error("PAYMENT_REQUIRED");
  if (!resp.ok) { const t = await resp.text(); console.error("AI gateway", resp.status, t); throw new Error("AI_GATEWAY_ERROR"); }
  const data = await resp.json();
  let text: string = (data?.choices?.[0]?.message?.content || "").trim();
  if (!text) throw new Error("EMPTY_RESPONSE");
  text = text.replace(/^["'`]+|["'`]+$/g, "").replace(/\s+/g, " ").trim();
  return text;
}

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const { token, partnerId, all, overwrite } = body || {};

    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!JWT_SECRET || !LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Servern är inte korrekt konfigurerad" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    const v = await verifyJWT(token || "", JWT_SECRET);
    if (!v.valid) return new Response(JSON.stringify({ error: "Ogiltig session" }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    let q = supabase.from("partners").select("*").eq("is_featured", true);
    if (!all && partnerId) q = supabase.from("partners").select("*").eq("id", partnerId);
    const { data: partners, error } = await q;
    if (error) throw error;
    if (!partners || partners.length === 0) {
      return new Response(JSON.stringify({ ok: true, results: [], generatedCount: 0 }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const results: Array<{ id: string; name: string; ok: boolean; skipped?: boolean; error?: string }> = [];
    let totalGenerated = 0;

    for (const p of partners) {
      try {
        const ai = (p.ai_profile as any) || {};
        // Need at least some AI data to summarize
        const hasSignal = (ai.capabilities?.length || 0) + (ai.use_cases?.length || 0) + (ai.description?.length || 0) > 0;
        if (!hasSignal) { results.push({ id: p.id, name: p.name, ok: true, skipped: true }); continue; }
        if (!overwrite && ai.ai_experience_summary && String(ai.ai_experience_summary).trim().length > 0) {
          results.push({ id: p.id, name: p.name, ok: true, skipped: true });
          continue;
        }

        const prompt = buildPrompt(p);
        const text = await callAI(prompt, LOVABLE_API_KEY);
        const updatedAi = {
          ...ai,
          ai_experience_summary: text,
          ai_experience_summary_generated_at: new Date().toISOString(),
        };
        const { error: upErr } = await supabase.from("partners").update({ ai_profile: updatedAi }).eq("id", p.id);
        if (upErr) throw upErr;
        totalGenerated++;
        results.push({ id: p.id, name: p.name, ok: true });
        if (all && partners.length > 1) await new Promise((r) => setTimeout(r, 500));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg === "RATE_LIMIT" || msg === "PAYMENT_REQUIRED") {
          return new Response(JSON.stringify({ error: msg, results, generatedCount: totalGenerated }), { status: msg === "RATE_LIMIT" ? 429 : 402, headers: { "Content-Type": "application/json", ...corsHeaders } });
        }
        console.error(`Partner ${p.name} failed:`, msg);
        results.push({ id: p.id, name: p.name, ok: false, error: msg });
      }
    }

    return new Response(JSON.stringify({ ok: true, results, generatedCount: totalGenerated, partnerCount: partners.length }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (e) {
    console.error("generate-partner-ai-experience-summary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
});
