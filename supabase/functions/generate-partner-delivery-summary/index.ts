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

const PRODUCT_SECTIONS: { key: string; label: string }[] = [
  { key: "bc", label: "Dynamics 365 Business Central" },
  { key: "fsc", label: "Dynamics 365 Finance & Supply Chain Management" },
  { key: "sales", label: "Dynamics 365 Sales & Customer Insights" },
  { key: "service", label: "Dynamics 365 Customer Service, Field Service och Contact Center" },
];

const FIELD_LABELS: Record<string, string> = {
  typicalCustomers: "Typiska kunder",
  typicalProjects: "Typiska projekt",
  deliveryModel: "Leveransprofil",
  managedServices: "Förvaltning",
  furtherDevelopment: "Vidareutveckling",
  aiAutomation: "AI och automation",
};

function hasContent(dp: Record<string, unknown> | null | undefined): boolean {
  if (!dp || typeof dp !== "object") return false;
  return Object.keys(FIELD_LABELS).some((k) => typeof dp[k] === "string" && (dp[k] as string).trim().length > 0);
}

function buildPrompt(partnerName: string, sectionLabel: string, dp: Record<string, string>): string {
  const blocks = Object.keys(FIELD_LABELS)
    .filter((k) => (dp[k] || "").trim())
    .map((k) => `${FIELD_LABELS[k]}:\n${(dp[k] || "").trim()}`)
    .join("\n\n");

  return `Partner: ${partnerName}
Produktområde: ${sectionLabel}

Partnerns egna beskrivningar:
${blocks}

Skriv en neutral sammanfattning av partnerns leveransprofil inom detta produktområde.
Regler:
- Exakt en till två meningar, max 45 ord totalt.
- Neutral, beskrivande ton. Inga superlativ, inga säljord, inget "ledande", "bäst" eller "oberoende".
- Nämn ALDRIG andra partners/konkurrenter vid namn och gör inga jämförelser med namngivna företag. Påstå inget om certifieringsnivå, designations eller antal certifierade konsulter som inte uttryckligen framgår av underlaget.
- Beskriv hur partnern engageras: uppdragstyper, kundtyper och roll före/efter go-live.
- Utgå enbart från texten ovan. Hitta inte på siffror eller referenser.
- Skriv på svenska i tredje person och inled med "Profilen indikerar att partnern".
Exempel på ton: "Profilen indikerar att partnern främst arbetar som livscykelpartner inom Dynamics 365 Finance & Supply Chain Management, med fokus på implementation, vidareutveckling och långsiktigt stöd efter go-live."

Svara med endast sammanfattningen som ren text.`;
}

async function callAI(prompt: string, apiKey: string): Promise<string> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "Du skriver korta, neutrala och faktabaserade sammanfattningar om svenska Dynamics 365-partners. Du använder aldrig marknadsföringsspråk." },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (resp.status === 429) throw new Error("RATE_LIMIT");
  if (resp.status === 402) throw new Error("PAYMENT_REQUIRED");
  if (!resp.ok) { console.error("AI gateway", resp.status, await resp.text()); throw new Error("AI_GATEWAY_ERROR"); }
  const data = await resp.json();
  const text: string = (data?.choices?.[0]?.message?.content || "").trim();
  if (!text) throw new Error("EMPTY_RESPONSE");
  return text.replace(/^["'`]+|["'`]+$/g, "").replace(/\s+/g, " ").trim().slice(0, 400);
}

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...corsHeaders } });

  try {
    const body = await req.json().catch(() => ({}));
    const { token, partnerId, sectionKey, all, overwrite } = body || {};

    const JWT_SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!JWT_SECRET || !LOVABLE_API_KEY) return json({ error: "Servern är inte korrekt konfigurerad" }, 500);

    const v = await verifyJWT(token || "", JWT_SECRET);
    if (!v.valid) return json({ error: "Ogiltig session" }, 401);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, JWT_SECRET);
    let q = supabase.from("partners").select("id,name,product_filters").eq("is_featured", true);
    if (!all && partnerId) q = supabase.from("partners").select("id,name,product_filters").eq("id", partnerId);
    const { data: partners, error } = await q;
    if (error) throw error;
    if (!partners?.length) return json({ ok: true, results: [], generatedCount: 0 });

    const results: Array<{ id: string; name: string; ok: boolean; updatedSections?: string[]; error?: string }> = [];
    let totalGenerated = 0;

    for (const p of partners) {
      try {
        const pf = { ...((p.product_filters as Record<string, any>) || {}) };
        const sections = PRODUCT_SECTIONS.filter((s) => {
          if (sectionKey && s.key !== sectionKey) return false;
          const dp = pf[s.key]?.deliveryProfile;
          if (!hasContent(dp)) return false;
          if (!overwrite && typeof dp.aiSummary === "string" && dp.aiSummary.trim()) return false;
          return true;
        });
        if (sections.length === 0) { results.push({ id: p.id, name: p.name, ok: true, updatedSections: [] }); continue; }

        const updatedSections: string[] = [];
        for (const s of sections) {
          try {
            const dp = { ...(pf[s.key].deliveryProfile as Record<string, string>) };
            const summary = await callAI(buildPrompt(p.name, s.label, dp), LOVABLE_API_KEY);
            dp.aiSummary = summary;
            dp.aiSummaryGeneratedAt = new Date().toISOString();
            pf[s.key] = { ...pf[s.key], deliveryProfile: dp };
            updatedSections.push(s.key);
            totalGenerated++;
            await new Promise((r) => setTimeout(r, 400));
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            if (msg === "RATE_LIMIT" || msg === "PAYMENT_REQUIRED") {
              if (updatedSections.length) await supabase.from("partners").update({ product_filters: pf }).eq("id", p.id);
              results.push({ id: p.id, name: p.name, ok: false, updatedSections, error: msg });
              return json({ error: msg, results, generatedCount: totalGenerated }, msg === "RATE_LIMIT" ? 429 : 402);
            }
            console.error(`Failed ${p.name}/${s.key}:`, msg);
          }
        }

        if (updatedSections.length) {
          const { error: upErr } = await supabase.from("partners").update({ product_filters: pf }).eq("id", p.id);
          if (upErr) throw upErr;
        }
        results.push({ id: p.id, name: p.name, ok: true, updatedSections });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`Partner ${p.name} failed:`, msg);
        results.push({ id: p.id, name: p.name, ok: false, error: msg });
      }
    }

    return json({ ok: true, results, generatedCount: totalGenerated, partnerCount: partners.length });
  } catch (e) {
    console.error("generate-partner-delivery-summary error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
