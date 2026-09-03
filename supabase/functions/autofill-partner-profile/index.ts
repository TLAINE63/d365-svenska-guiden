// Fyller tomma textfält i partnerprofilen med AI.
// Två lägen:
//  - Adminläge:   { token: <admin jwt>, partnerId } eller { token, all: true }  -> skriver direkt till partners
//  - Partnerläge: { inviteToken, draft }                                        -> returnerar förslag till formuläret
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

const PRODUCT_LABELS: Record<string, string> = {
  bc: "Dynamics 365 Business Central",
  fsc: "Dynamics 365 Finance & Supply Chain Management",
  sales: "Dynamics 365 Sales & Customer Insights",
  service: "Dynamics 365 Customer Service, Field Service och Contact Center",
};

const DELIVERY_FIELDS = [
  ["typicalCustomers", "Typiska kunder"],
  ["typicalProjects", "Typiska projekt"],
  ["deliveryModel", "Leveransprofil (arbetsformer, team, metodik)"],
  ["managedServices", "Förvaltning efter go-live"],
  ["furtherDevelopment", "Vidareutveckling över tid"],
  ["aiAutomation", "AI och automation"],
] as const;

const COMPETENCY_FIELDS = [
  ["power_platform", "Power Platform – appar, automation, Dataverse, rapportering"],
  ["copilot_ai", "Copilot & AI – inbyggda Copilot-/AI-funktioner i Dynamics 365"],
  ["copilot_studio_agents", "Copilot Studio & agenter – egna agenter och AI-automation"],
] as const;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const isEmpty = (v: unknown) => !str(v);

const SYSTEM = `Du skriver neutrala, faktabaserade profiltexter om svenska Microsoft Dynamics 365-partners på uppdrag av d365.se.
Regler:
- Skriv på svenska, sakligt och konkret. Inga superlativ, ingen säljjargong.
- Nämn ALDRIG andra partners/konkurrenter vid namn och gör inga jämförelser med namngivna företag. Påstå inget om certifieringsnivå, designations eller antal certifierade konsulter som inte uttryckligen framgår av underlaget.
- Använd ALDRIG orden "oberoende", "ledande" eller "bäst".
- Utgå enbart från underlaget. Hitta aldrig på kundnamn, siffror, certifieringar eller referenser.
- Är underlaget tunt: skriv en generellt hållen men rimlig text utan påhittade fakta.
- Nämn bara Dynamics 365-applikationer som framgår av underlaget. Nämn aldrig Power Platform som egen Dynamics-applikation.
- Ingen emoji, inga rubriker, inga punktlistor utom där fältet uttryckligen ber om punkter.`;

type Suggestion = {
  description: string | null;
  positioning_statement: string | null;
  products: Array<{
    key: string;
    productDescription: string | null;
    whyChoose: string | null;
    keyPoints: string | null;
    typicalCustomers: string | null;
    typicalProjects: string | null;
    deliveryModel: string | null;
    managedServices: string | null;
    furtherDevelopment: string | null;
    aiAutomation: string | null;
  }>;
  competency_input: {
    power_platform: string | null;
    copilot_ai: string | null;
    copilot_studio_agents: string | null;
  };
};

const nullableString = { type: ["string", "null"] };

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    description: nullableString,
    positioning_statement: nullableString,
    products: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          key: { type: "string" },
          productDescription: nullableString,
          whyChoose: nullableString,
          keyPoints: nullableString,
          typicalCustomers: nullableString,
          typicalProjects: nullableString,
          deliveryModel: nullableString,
          managedServices: nullableString,
          furtherDevelopment: nullableString,
          aiAutomation: nullableString,
        },
        required: [
          "key", "productDescription", "whyChoose", "keyPoints",
          "typicalCustomers", "typicalProjects", "deliveryModel",
          "managedServices", "furtherDevelopment", "aiAutomation",
        ],
      },
    },
    competency_input: {
      type: "object",
      additionalProperties: false,
      properties: {
        power_platform: nullableString,
        copilot_ai: nullableString,
        copilot_studio_agents: nullableString,
      },
      required: ["power_platform", "copilot_ai", "copilot_studio_agents"],
    },
  },
  required: ["description", "positioning_statement", "products", "competency_input"],
};

async function callAI(prompt: string, apiKey: string): Promise<Suggestion> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: "openai/gpt-5.6-sol",
      stream: true,
      instructions: SYSTEM,
      input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }],
      text: {
        format: {
          type: "json_schema",
          name: "partner_profile_autofill",
          strict: true,
          schema: SCHEMA,
        },
      },
    }),
  });

  if (resp.status === 429) throw new Error("RATE_LIMIT");
  if (resp.status === 402) throw new Error("PAYMENT_REQUIRED");
  if (!resp.ok) {
    console.error("AI gateway", resp.status, await resp.text());
    throw new Error("AI_GATEWAY_ERROR");
  }

  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, nl).replace(/\r$/, "");
      buf = buf.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload);
        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") text += evt.delta;
        if (evt.type === "response.completed" && !text) {
          const out = evt.response?.output_text;
          if (typeof out === "string") text = out;
        }
      } catch { /* ignorera partiella event */ }
    }
  }

  if (!text.trim()) throw new Error("EMPTY_RESPONSE");
  return JSON.parse(text) as Suggestion;
}

interface PartnerLike {
  name?: string;
  website?: string | null;
  description?: string | null;
  positioning_statement?: string | null;
  applications?: string[] | null;
  industries?: string[] | null;
  secondary_industries?: string[] | null;
  office_cities?: string[] | null;
  team_size_sweden?: string | null;
  implementations_done?: string | null;
  implementations_per_app?: Record<string, unknown> | null;
  extended_content?: string | null;
  extended_summary?: string | null;
  ai_summary?: string | null;
  product_filters?: Record<string, any> | null;
  extended_competency_input?: Record<string, string> | null;
}

/** Räknar ut vilka fält som saknas och bygger prompten. Returnerar null om inget saknas. */
function buildPrompt(p: PartnerLike): { prompt: string; missing: string[] } | null {
  const missing: string[] = [];
  const asks: string[] = [];

  if (isEmpty(p.description)) {
    missing.push("description");
    asks.push('- "description": företagsbeskrivning, 350–550 tecken, vad partnern gör inom Dynamics 365 och för vilka kunder.');
  }
  if (isEmpty(p.positioning_statement)) {
    missing.push("positioning_statement");
    asks.push('- "positioning_statement": en mening som inleds med "Passar särskilt företag som …".');
  }

  const pf = (p.product_filters || {}) as Record<string, any>;
  const productAsks: string[] = [];
  const productKeys: string[] = [];
  for (const key of Object.keys(PRODUCT_LABELS)) {
    const f = pf[key];
    if (!f || typeof f !== "object") continue;
    const dp = (f.deliveryProfile || {}) as Record<string, unknown>;
    const needs: string[] = [];
    if (isEmpty(f.productDescription)) needs.push('"productDescription" (kort beskrivning av erbjudandet, 200–400 tecken)');
    if (isEmpty(f.whyChoose)) needs.push('"whyChoose" (varför kunder väljer partnern inom området, 200–400 tecken)');
    if (isEmpty(f.keyPoints)) needs.push('"keyPoints" (3–4 korta punkter separerade med radbrytning)');
    for (const [fk, label] of DELIVERY_FIELDS) {
      if (isEmpty(dp[fk])) needs.push(`"${fk}" (${label}, 300–500 tecken)`);
    }
    if (!needs.length) continue;
    productKeys.push(key);
    missing.push(`product:${key}`);
    const filled = [
      f.productDescription ? `Befintlig beskrivning: ${str(f.productDescription)}` : "",
      f.whyChoose ? `Varför välja: ${str(f.whyChoose)}` : "",
      Array.isArray(f.industries) && f.industries.length ? `Branscher: ${f.industries.join(", ")}` : "",
      Array.isArray(f.companySize) && f.companySize.length ? `Kundstorlek: ${f.companySize.join(", ")}` : "",
      Array.isArray(f.revenue) && f.revenue.length ? `Kundomsättning: ${f.revenue.join(", ")}` : "",
      Array.isArray(f.customerExamples) && f.customerExamples.length ? `Kundexempel: ${f.customerExamples.join(", ")}` : "",
    ].filter(Boolean).join("\n");
    productAsks.push(
      `### Produktområde "${key}" (${PRODUCT_LABELS[key]})\n${filled || "Inget befintligt underlag."}\nSaknade fält: ${needs.join("; ")}`
    );
  }

  const compNeeds: string[] = [];
  const compInput = (p.extended_competency_input || {}) as Record<string, string>;
  for (const [ck, label] of COMPETENCY_FIELDS) {
    if (isEmpty(compInput[ck])) compNeeds.push(`"${ck}" (${label}, 300–600 tecken)`);
  }
  if (compNeeds.length) missing.push("competency_input");

  if (!missing.length) return null;

  const context = `Partner: ${p.name || "-"}
Webbplats: ${p.website || "-"}
Nuvarande beskrivning: ${str(p.description) || "-"}
Nuvarande positionering: ${str(p.positioning_statement) || "-"}
Applikationer: ${(p.applications || []).join(", ") || "-"}
Branscher: ${(p.industries || []).join(", ") || "-"}
Sekundära branscher: ${(p.secondary_industries || []).join(", ") || "-"}
Kontor: ${(p.office_cities || []).join(", ") || "-"}
Team i Sverige: ${p.team_size_sweden || "-"}
Implementationer: ${JSON.stringify(p.implementations_per_app || p.implementations_done || "-")}
Sammanfattning (d365.se): ${str(p.extended_summary) || str(p.ai_summary) || "-"}
Fördjupat underlag: ${str(p.extended_content).slice(0, 6000) || "-"}`;

  const prompt = `Fyll i saknade profiltexter för nedanstående Dynamics 365-partner.

${context}

Fyll ENDAST de fält som listas som saknade. Sätt alla övriga fält till null.

Fält på partnernivå som saknas:
${asks.length ? asks.join("\n") : "- inga"}

Produktområden:
${productAsks.join("\n\n") || "- inga"}

Kompetensunderlag (partnerns eget underlag inom Power Platform, Copilot & AI, Copilot Studio) som saknas:
${compNeeds.length ? compNeeds.map((c) => `- ${c}`).join("\n") : "- inga"}

Returnera ett objekt där "products" innehåller exakt dessa nycklar: ${productKeys.join(", ") || "(inga)"}.`;

  return { prompt, missing };
}

/** Slår ihop AI-förslag med befintlig data – skriver aldrig över ifyllda fält. */
function applySuggestion(p: PartnerLike, s: Suggestion) {
  let filledCount = 0;
  const patch: Record<string, unknown> = {};

  if (isEmpty(p.description) && str(s.description)) { patch.description = str(s.description); filledCount++; }
  if (isEmpty(p.positioning_statement) && str(s.positioning_statement)) {
    patch.positioning_statement = str(s.positioning_statement);
    filledCount++;
  }

  const pf = JSON.parse(JSON.stringify(p.product_filters || {})) as Record<string, any>;
  let pfChanged = false;
  for (const sp of s.products || []) {
    const key = sp?.key;
    if (!key || !pf[key] || typeof pf[key] !== "object") continue;
    const f = pf[key];
    for (const k of ["productDescription", "whyChoose", "keyPoints"] as const) {
      if (isEmpty(f[k]) && str(sp[k])) { f[k] = str(sp[k]); pfChanged = true; filledCount++; }
    }
    const dp = { ...(f.deliveryProfile || {}) } as Record<string, unknown>;
    let dpChanged = false;
    for (const [fk] of DELIVERY_FIELDS) {
      if (isEmpty(dp[fk]) && str((sp as any)[fk])) { dp[fk] = str((sp as any)[fk]); dpChanged = true; filledCount++; }
    }
    if (dpChanged) { f.deliveryProfile = dp; pfChanged = true; }
  }
  if (pfChanged) patch.product_filters = pf;

  const compInput = { ...((p.extended_competency_input || {}) as Record<string, string>) };
  let compChanged = false;
  for (const [ck] of COMPETENCY_FIELDS) {
    const v = str((s.competency_input || {} as any)[ck]);
    if (isEmpty(compInput[ck]) && v) { compInput[ck] = v; compChanged = true; filledCount++; }
  }
  if (compChanged) patch.extended_competency_input = compInput;

  return { patch, filledCount };
}

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...corsHeaders } });

  try {
    const body = await req.json().catch(() => ({}));
    const { token, partnerId, all, inviteToken, draft } = body || {};

    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!SERVICE_KEY || !LOVABLE_API_KEY) return json({ error: "Servern är inte korrekt konfigurerad" }, 500);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, SERVICE_KEY);

    // ---------- Partnerläge: returnera förslag till formuläret ----------
    if (inviteToken) {
      const { data: invitation } = await supabase
        .from("partner_invitations")
        .select("id, partner_id, partner_name, expires_at, status")
        .eq("token", inviteToken)
        .maybeSingle();
      if (!invitation) return json({ error: "Ogiltig inbjudan" }, 401);
      if (new Date(invitation.expires_at) < new Date() && invitation.status === "pending") {
        return json({ error: "Inbjudan har gått ut" }, 410);
      }

      let base: PartnerLike = {};
      if (invitation.partner_id) {
        const { data: partner } = await supabase
          .from("partners")
          .select("name, website, applications, industries, secondary_industries, office_cities, team_size_sweden, implementations_done, implementations_per_app, extended_content, extended_summary, ai_summary")
          .eq("id", invitation.partner_id)
          .maybeSingle();
        base = (partner || {}) as PartnerLike;
      }

      const d = (draft || {}) as PartnerLike;
      const merged: PartnerLike = {
        ...base,
        name: d.name || base.name || invitation.partner_name,
        website: d.website || base.website,
        description: d.description,
        positioning_statement: d.positioning_statement,
        applications: d.applications?.length ? d.applications : base.applications,
        industries: d.industries?.length ? d.industries : base.industries,
        product_filters: d.product_filters || {},
        extended_competency_input: d.extended_competency_input || {},
      };

      const built = buildPrompt(merged);
      if (!built) return json({ ok: true, filledCount: 0, patch: {} });
      const suggestion = await callAI(built.prompt, LOVABLE_API_KEY);
      const { patch, filledCount } = applySuggestion(merged, suggestion);
      return json({ ok: true, filledCount, patch });
    }

    // ---------- Adminläge ----------
    const v = await verifyJWT(token || "", SERVICE_KEY);
    if (!v.valid) return json({ error: "Ogiltig session" }, 401);

    const columns =
      "id, name, website, description, positioning_statement, applications, industries, secondary_industries, office_cities, team_size_sweden, implementations_done, implementations_per_app, extended_content, extended_summary, ai_summary, product_filters, extended_competency_input";
    let query = supabase.from("partners").select(columns);
    query = partnerId && !all ? query.eq("id", partnerId) : query.eq("is_featured", true);
    const { data: partners, error } = await query;
    if (error) throw error;
    if (!partners?.length) return json({ ok: true, results: [], filledCount: 0, partnerCount: 0 });

    const results: Array<{ id: string; name: string; ok: boolean; filled: number; error?: string }> = [];
    let totalFilled = 0;

    for (const p of partners as any[]) {
      try {
        const built = buildPrompt(p as PartnerLike);
        if (!built) { results.push({ id: p.id, name: p.name, ok: true, filled: 0 }); continue; }
        const suggestion = await callAI(built.prompt, LOVABLE_API_KEY);
        const { patch, filledCount } = applySuggestion(p as PartnerLike, suggestion);
        if (filledCount > 0) {
          const { error: upErr } = await supabase.from("partners").update(patch).eq("id", p.id);
          if (upErr) throw upErr;
        }
        totalFilled += filledCount;
        results.push({ id: p.id, name: p.name, ok: true, filled: filledCount });
        await new Promise((r) => setTimeout(r, 500));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg === "RATE_LIMIT" || msg === "PAYMENT_REQUIRED") {
          results.push({ id: p.id, name: p.name, ok: false, filled: 0, error: msg });
          return json({ error: msg, results, filledCount: totalFilled }, msg === "RATE_LIMIT" ? 429 : 402);
        }
        console.error(`Autofill misslyckades för ${p.name}:`, msg);
        results.push({ id: p.id, name: p.name, ok: false, filled: 0, error: msg });
      }
    }

    return json({ ok: true, results, filledCount: totalFilled, partnerCount: partners.length });
  } catch (e) {
    console.error("autofill-partner-profile error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
