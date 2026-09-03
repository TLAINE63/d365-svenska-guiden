// Fyll i tomma AI-profiler och beslutsprofilens "När vi inte är rätt val" (not_a_fit)
// för publicerade partners. Använder partnerns egna profildata + valfri webbkontext.
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

// Enum-värden speglade från src/lib/aiProfile.ts
const DELIVERY_MODELS = ["product-teams", "central-team", "combined", "external-team", "advisory"];
const AI_CAPABILITIES = [
  "standard-copilot", "copilot-studio", "power-platform", "azure-ai", "fabric-bi",
  "ai-readiness", "ai-governance", "ai-adoption", "industry-ai",
];
const AI_RELEVANT_AREAS = [
  "Business Central", "Dynamics 365 Finance", "Dynamics 365 Supply Chain Management",
  "Dynamics 365 Sales", "Dynamics 365 Customer Service", "Dynamics 365 Field Service",
  "Dynamics 365 Customer Insights", "Power Platform", "Microsoft 365 Copilot",
  "Azure / Fabric", "ERP-processer", "CRM-processer", "Supply chain-processer",
  "Kundserviceprocesser",
];
const AI_USE_CASES = [
  "readiness", "data-quality", "copilot-studio-agent", "sales-automation", "service-ai",
  "finance-ai", "scm-ai", "forecast", "anomaly", "industry-agent", "fabric-analytics",
  "governance", "training",
];
const AI_EXPERIENCE_LEVELS = ["advisory", "pilot", "delivered", "multiple", "packaged", "established"];
const AI_PROJECT_COUNT_RANGES = ["1-2", "3-5", "6-10", "10+"];
const AI_EVIDENCE_LEVELS = [
  "self-declared", "packaged", "anonymized", "reference-on-request", "public-case", "reviewed",
];

const APP_TO_AREA: Record<string, string[]> = {
  "Business Central": ["Business Central", "ERP-processer"],
  "Finance": ["Dynamics 365 Finance", "ERP-processer"],
  "Supply Chain Management": ["Dynamics 365 Supply Chain Management", "Supply chain-processer"],
  "Sales": ["Dynamics 365 Sales", "CRM-processer"],
  "Customer Insights (Marketing)": ["Dynamics 365 Customer Insights", "CRM-processer"],
  "Customer Service": ["Dynamics 365 Customer Service", "Kundserviceprocesser"],
  "Field Service": ["Dynamics 365 Field Service", "Kundserviceprocesser"],
  "Contact Center": ["Dynamics 365 Customer Service", "Kundserviceprocesser"],
};

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchSnippet(url: string, maxChars = 3500): Promise<string> {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 8000);
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (d365.se ai profile bot)" },
      signal: ctl.signal,
      redirect: "follow",
    });
    clearTimeout(t);
    if (!res.ok) return "";
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html") && !ct.includes("text/plain")) return "";
    const html = await res.text();
    return stripHtml(html).slice(0, maxChars);
  } catch { return ""; }
}

async function gatherWebContext(website: string | null | undefined): Promise<string> {
  if (!website) return "";
  let base = website.trim();
  if (!/^https?:\/\//i.test(base)) base = "https://" + base;
  let origin = "";
  try { origin = new URL(base).origin; } catch { return ""; }
  const candidates = [
    base,
    `${origin}/om-oss`, `${origin}/about`,
    `${origin}/ai`, `${origin}/copilot`, `${origin}/tjanster`, `${origin}/services`,
  ];
  const seen = new Set<string>();
  const snippets: string[] = [];
  for (const u of candidates) {
    if (seen.has(u)) continue;
    seen.add(u);
    const s = await fetchSnippet(u, 3000);
    if (s && s.length > 200) snippets.push(`[${u}]\n${s}`);
    if (snippets.join("\n").length > 8000) break;
  }
  return snippets.join("\n\n").slice(0, 9000);
}

function activeAreasForPartner(p: any): string[] {
  const apps: string[] = p.applications || [];
  const areas = new Set<string>();
  for (const a of apps) for (const area of (APP_TO_AREA[a] || [])) areas.add(area);
  return Array.from(areas);
}

function pickAllowed<T extends string>(list: unknown, allowed: readonly T[], max = 999): T[] {
  if (!Array.isArray(list)) return [];
  const set = new Set<string>(allowed as readonly string[]);
  const out: T[] = [];
  for (const v of list) {
    if (typeof v === "string" && set.has(v) && !out.includes(v as T)) {
      out.push(v as T);
      if (out.length >= max) break;
    }
  }
  return out;
}
function pickOne<T extends string>(v: unknown, allowed: readonly T[]): T | null {
  if (typeof v !== "string") return null;
  return (allowed as readonly string[]).includes(v) ? (v as T) : null;
}

function buildPrompt(p: any, webContext: string): string {
  const industries = [...(p.industries || []), ...(p.secondary_industries || [])].join(", ") || "ej specificerat";
  const geo = (p.geography || []).join(", ") || "ej specificerat";
  const apps = (p.applications || []).join(", ") || "ej specificerat";
  const suggestedAreas = activeAreasForPartner(p).join(", ") || "(inga)";
  const desc = (p.description || "").slice(0, 1500);
  const aiSummary = (p.ai_summary || "").slice(0, 1000);
  const positioning = (p.positioning_statement || "").slice(0, 400);
  const teamSize = p.team_size_sweden || p.employees_sweden || "okänt";

  return `Du hjälper att fylla i två sektioner i en Microsoft Dynamics 365-partners publika profil på d365.se:
1) "AI, Copilot & Automation" (ai_profile) – partnerns AI/automations-kapacitet.
2) "När vi inte är rätt val" (not_a_fit) – 3–5 ärliga situationer där partnern INTE är rätt val.

Basera valen enbart på PARTNERDATA + WEBBKONTEXT nedan. Var konservativ: när det saknas underlag, välj färre alternativ eller lämna fältet tomt.

TILLÅTNA VÄRDEN (använd endast dessa exakta strängar):

delivery_model (välj EN eller null):
${DELIVERY_MODELS.map(v => `- "${v}"`).join("\n")}

capabilities (0–6 st):
${AI_CAPABILITIES.map(v => `- "${v}"`).join("\n")}

relevant_areas (0–8 st – normalt de områden partnern faktiskt jobbar med utifrån sina D365-appar):
${AI_RELEVANT_AREAS.map(v => `- "${v}"`).join("\n")}

use_cases (0–6 st):
${AI_USE_CASES.map(v => `- "${v}"`).join("\n")}

experience_level (välj EN eller null; standard om osäkert: "advisory" eller "pilot"):
${AI_EXPERIENCE_LEVELS.map(v => `- "${v}"`).join("\n")}

project_count_range (välj EN eller null; standard om osäkert: null):
${AI_PROJECT_COUNT_RANGES.map(v => `- "${v}"`).join("\n")}

evidence_level (välj 1–2 st; standard: ["self-declared"]):
${AI_EVIDENCE_LEVELS.map(v => `- "${v}"`).join("\n")}

REGLER för description (ai_profile.description):
- 2–4 meningar, max 500 tecken, svenska.
- Beskriv HUR partnern jobbar med AI/Copilot/automation inom D365.
- Ingen säljjargong ("bäst", "ledande", "experter"), inga superlativ, inte ordet "oberoende".
- Nämn ALDRIG andra partners/konkurrenter vid namn och gör inga jämförelser med namngivna företag. Påstå inget om certifieringsnivå, designations eller antal certifierade konsulter som inte uttryckligen framgår av underlaget.
- Om underlag saknas: skriv en kort, generell beskrivning utifrån deras D365-appar och rådgivningsprofil.

REGLER för not_a_fit:
- 3–5 punkter, en mening per punkt, svenska.
- Ärliga avgränsningar utifrån partnerns storlek, branschfokus, geografi och applikationsfokus.
- Formulera KUNDENS situation (t.ex. "Kunder som söker …", "Bolag som kräver …", "Projekt där …"), inte partnerns aktivitet.
- Inga superlativ, ingen självhävdelse, ingen negativ ton om partnern själv.
- Undvik dubbletter och triviala saker som "kunder utan behov av D365".

PARTNERDATA:
Namn: ${p.name}
Webb: ${p.website || "(ej angiven)"}
D365-applikationer: ${apps}
Branscher: ${industries}
Geografi: ${geo}
Team i Sverige: ${teamSize}
Beskrivning: ${desc || "(saknas)"}
Positioneringsmening: ${positioning || "(saknas)"}
AI-sammanfattning från d365.se: ${aiSummary || "(saknas)"}
Föreslagna relevant_areas utifrån appar: ${suggestedAreas}

WEBBKONTEXT (utdrag från partnerns webbplats, kan vara brus – använd försiktigt):
${webContext ? webContext.slice(0, 6000) : "(ingen webbkontext)"}

Svara med ENDAST giltig JSON i exakt detta schema (inga kommentarer, ingen text runt om, inga markdown-block):
{
  "ai_profile": {
    "delivery_model": string|null,
    "capabilities": string[],
    "relevant_areas": string[],
    "use_cases": string[],
    "experience_level": string|null,
    "project_count_range": string|null,
    "evidence_level": string[],
    "description": string
  },
  "not_a_fit": string[]
}`;
}

async function callAI(prompt: string, apiKey: string): Promise<any> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `Du är en seniorrådgivare som fyller i strukturerad AI-profil och ärliga avgränsningar för svenska D365-partners. Svara alltid med giltig JSON.\n\n${D365_MARKET_CONTEXT_SV}` },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (resp.status === 429) throw new Error("RATE_LIMIT");
  if (resp.status === 402) throw new Error("PAYMENT_REQUIRED");
  if (!resp.ok) { const t = await resp.text(); console.error("AI gateway", resp.status, t); throw new Error("AI_GATEWAY_ERROR"); }
  const data = await resp.json();
  const text: string = (data?.choices?.[0]?.message?.content || "").trim();
  if (!text) throw new Error("EMPTY_RESPONSE");
  // Sanera ev. markdown-fences
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON parse failed:", cleaned.slice(0, 500));
    throw new Error("INVALID_JSON");
  }
}

function sanitizeAiProfile(raw: any, existing: any): any {
  const src = (raw && typeof raw === "object") ? raw : {};
  const ex = (existing && typeof existing === "object") ? existing : {};
  const description = typeof src.description === "string" ? src.description.trim().slice(0, 500) : "";
  const evidence = pickAllowed(src.evidence_level, AI_EVIDENCE_LEVELS, 3);
  return {
    ...ex,
    delivery_model: pickOne(src.delivery_model, DELIVERY_MODELS) ?? ex.delivery_model ?? null,
    capabilities: pickAllowed(src.capabilities, AI_CAPABILITIES, 6),
    relevant_areas: pickAllowed(src.relevant_areas, AI_RELEVANT_AREAS, 8),
    use_cases: pickAllowed(src.use_cases, AI_USE_CASES, 6),
    experience_level: pickOne(src.experience_level, AI_EXPERIENCE_LEVELS) ?? ex.experience_level ?? null,
    project_count_range: pickOne(src.project_count_range, AI_PROJECT_COUNT_RANGES) ?? ex.project_count_range ?? null,
    evidence_level: evidence.length > 0 ? evidence : ["self-declared"],
    description: description || (typeof ex.description === "string" ? ex.description : ""),
    migrated_at: ex.migrated_at || new Date().toISOString(),
    ai_generated: true,
    ai_generated_at: new Date().toISOString(),
  };
}

function sanitizeNotAFit(raw: any): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const v of raw) {
    if (typeof v !== "string") continue;
    const t = v.trim().replace(/^[-*•]\s*/, "").slice(0, 240);
    if (t.length < 10) continue;
    if (out.some((x) => x.toLowerCase() === t.toLowerCase())) continue;
    out.push(t);
    if (out.length >= 5) break;
  }
  return out;
}

function aiProfileIsEmpty(p: any): boolean {
  const a = p?.ai_profile;
  if (!a || typeof a !== "object") return true;
  const hasContent =
    (Array.isArray(a.capabilities) && a.capabilities.length > 0) ||
    (Array.isArray(a.relevant_areas) && a.relevant_areas.length > 0) ||
    (Array.isArray(a.use_cases) && a.use_cases.length > 0) ||
    (typeof a.description === "string" && a.description.trim().length > 0) ||
    (typeof a.delivery_model === "string" && a.delivery_model);
  return !hasContent;
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

    const results: Array<{ id: string; name: string; ok: boolean; updated?: string[]; skipped?: boolean; error?: string }> = [];
    let generatedCount = 0;

    for (const p of partners) {
      try {
        const needAi = overwrite || aiProfileIsEmpty(p);
        const needNotAFit = overwrite || !(Array.isArray(p.not_a_fit) && p.not_a_fit.length > 0);
        if (!needAi && !needNotAFit) {
          results.push({ id: p.id, name: p.name, ok: true, skipped: true });
          continue;
        }

        const webContext = await gatherWebContext(p.website);
        const prompt = buildPrompt(p, webContext);
        const json = await callAI(prompt, LOVABLE_API_KEY);

        const updatePayload: Record<string, any> = {};
        const updated: string[] = [];

        if (needAi) {
          const cleanAi = sanitizeAiProfile(json?.ai_profile, p.ai_profile);
          updatePayload.ai_profile = cleanAi;
          updated.push("ai_profile");
        }
        if (needNotAFit) {
          const cleanNotAFit = sanitizeNotAFit(json?.not_a_fit);
          if (cleanNotAFit.length >= 2) {
            updatePayload.not_a_fit = cleanNotAFit;
            updated.push("not_a_fit");
          }
        }

        if (Object.keys(updatePayload).length > 0) {
          const { error: upErr } = await supabase.from("partners").update(updatePayload).eq("id", p.id);
          if (upErr) throw upErr;
          generatedCount++;
        }
        results.push({ id: p.id, name: p.name, ok: true, updated });
        if (all && partners.length > 1) await new Promise((r) => setTimeout(r, 600));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg === "RATE_LIMIT" || msg === "PAYMENT_REQUIRED") {
          results.push({ id: p.id, name: p.name, ok: false, error: msg });
          return new Response(JSON.stringify({ error: msg, results, generatedCount }), { status: msg === "RATE_LIMIT" ? 429 : 402, headers: { "Content-Type": "application/json", ...corsHeaders } });
        }
        console.error(`Partner ${p.name} failed:`, msg);
        results.push({ id: p.id, name: p.name, ok: false, error: msg });
      }
    }

    return new Response(JSON.stringify({ ok: true, results, generatedCount, partnerCount: partners.length }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (e) {
    console.error("generate-partner-ai-notafit error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
});
