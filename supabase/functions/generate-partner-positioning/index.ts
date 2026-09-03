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

// productSections-mapping speglad från PartnerUpdate.tsx
const PRODUCT_SECTIONS: { key: string; label: string; apps: string[] }[] = [
  { key: "bc", label: "Business Central", apps: ["Business Central"] },
  { key: "fsc", label: "Finance & Supply Chain", apps: ["Finance", "Supply Chain Management"] },
  { key: "sales", label: "Sales & Customer Insights", apps: ["Sales", "Customer Insights (Marketing)"] },
  { key: "service", label: "Customer Service / Field Service / Contact Center", apps: ["Customer Service", "Field Service", "Contact Center"] },
];

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchSnippet(url: string, maxChars = 4000): Promise<string> {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 8000);
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (d365.se positioning bot)" },
      signal: ctl.signal,
      redirect: "follow",
    });
    clearTimeout(t);
    if (!res.ok) return "";
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html") && !ct.includes("text/plain")) return "";
    const html = await res.text();
    const text = stripHtml(html);
    return text.slice(0, maxChars);
  } catch {
    return "";
  }
}

async function gatherWebContext(website: string | null | undefined): Promise<string> {
  if (!website) return "";
  let base = website.trim();
  if (!/^https?:\/\//i.test(base)) base = "https://" + base;
  let origin = "";
  try { origin = new URL(base).origin; } catch { return ""; }
  const candidates = [base, `${origin}/om-oss`, `${origin}/about`, `${origin}/tjanster`, `${origin}/services`];
  const seen = new Set<string>();
  const snippets: string[] = [];
  for (const u of candidates) {
    if (seen.has(u)) continue;
    seen.add(u);
    const s = await fetchSnippet(u, 3500);
    if (s && s.length > 200) snippets.push(`[${u}]\n${s}`);
    if (snippets.join("\n").length > 9000) break;
  }
  return snippets.join("\n\n").slice(0, 10000);
}

function activeAppsForPartner(p: any): string[] {
  const pf = p.product_filters || {};
  const apps: string[] = [];
  for (const sec of PRODUCT_SECTIONS) {
    if (pf[sec.key]) apps.push(...sec.apps);
  }
  return Array.from(new Set(apps));
}

function buildPrompt(p: any, app: string, webContext: string): string {
  const industries = [...(p.industries || []), ...(p.secondary_industries || [])].join(", ") || "ej specificerat";
  const geo = (p.geography || []).join(", ") || "ej specificerat";
  const cities = (p.office_cities || []).join(", ") || "ej angett";
  const desc = (p.description || "").slice(0, 1200);
  const aiSummary = (p.ai_summary || "").slice(0, 800);
  const pf = (p.product_filters || {});
  // Hitta produktsektion för app:en
  const section = PRODUCT_SECTIONS.find((s) => s.apps.includes(app));
  const sectionData = section ? pf[section.key] : null;
  const productDesc = (sectionData?.productDescription || "").slice(0, 1500);
  const productIndustries = (sectionData?.industries || []).join(", ");
  const customerEx = (sectionData?.customerExamples || []).slice(0, 6).join(", ");

  return `Du formulerar en kort, vass och konkret positioneringsmening på svenska för en Microsoft Dynamics 365-partner. Meningen visas i deras publika profil under rubriken "Vi är valet när …" för produkten ${app}.

REGLER (mycket viktigt):
- Skriv EN mening, max 25 ord.
- Inled exakt med "Vi är valet när ".
- Konkret: nämn bransch(er), företagsstorlek/segment ELLER en specifik utmaning där partnern är starka för ${app}.
- Skriv i första person plural (vi/oss).
- Ingen säljjargong, inga superlativ ("bäst", "ledande", "marknadsledande", "premium", "experter").
- Nämn ALDRIG andra partners/konkurrenter vid namn och gör inga jämförelser med namngivna företag. Påstå inget om certifieringsnivå, designations eller antal certifierade konsulter som inte uttryckligen framgår av underlaget.
- Nämn inte pris, antal anställda eller konkurrenter.
- Använd inte ordet "oberoende".
- Skriv inte ut "Vi är valet när vi …" – meningen ska beskriva KUNDENS situation, inte er aktivitet.
- Avsluta med punkt.

PARTNERDATA:
Namn: ${p.name}
Webb: ${p.website || "(ej angiven)"}
Övergripande beskrivning: ${desc || "(saknas)"}
AI-sammanfattning: ${aiSummary || "(saknas)"}
Branscher (övergripande): ${industries}
Geografi: ${geo}
Orter: ${cities}

PRODUKTSPECIFIKT (${app}):
Branscher inom denna produkt: ${productIndustries || "(ej angett)"}
Kundexempel: ${customerEx || "(ej angett)"}
Produktbeskrivning från partnern: ${productDesc || "(saknas)"}

WEBBKONTEXT (utdrag från partnerns webbplats, kan vara brus – använd försiktigt):
${webContext ? webContext.slice(0, 6000) : "(ingen webbkontext)"}

Skriv positioneringsmeningen nu. Endast meningen, ingen rubrik, ingen förklaring, inga citattecken.`;
}

async function callAI(prompt: string, apiKey: string): Promise<string> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: `Du är en seniorrådgivare som skriver vassa, neutrala positioneringsmeningar för D365-partners.\n\n${D365_MARKET_CONTEXT_SV}` },
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
  // Sanering
  text = text.replace(/^["'`]+|["'`]+$/g, "").trim();
  if (!/^vi är valet när/i.test(text)) text = `Vi är valet när ${text.replace(/^[a-zåäö]/i, (c) => c.toLowerCase())}`;
  if (!/[.!?]$/.test(text)) text += ".";
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

    const results: Array<{ id: string; name: string; ok: boolean; updatedApps?: string[]; skippedApps?: string[]; error?: string }> = [];
    let totalGenerated = 0;

    for (const p of partners) {
      try {
        const apps = activeAppsForPartner(p);
        if (apps.length === 0) { results.push({ id: p.id, name: p.name, ok: true, updatedApps: [], skippedApps: [] }); continue; }

        const profiles: Record<string, any> = { ...(p.product_profiles || {}) };
        const missing = apps.filter((a) => overwrite || !(profiles[a]?.positioning && String(profiles[a].positioning).trim()));
        if (missing.length === 0) { results.push({ id: p.id, name: p.name, ok: true, updatedApps: [], skippedApps: apps }); continue; }

        const webContext = await gatherWebContext(p.website);

        const updated: string[] = [];
        for (const app of missing) {
          try {
            const prompt = buildPrompt(p, app, webContext);
            const text = await callAI(prompt, LOVABLE_API_KEY);
            profiles[app] = { ...(profiles[app] || {}), positioning: text, positioning_ai_generated: true, positioning_generated_at: new Date().toISOString() };
            updated.push(app);
            totalGenerated++;
            await new Promise((r) => setTimeout(r, 400));
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            if (msg === "RATE_LIMIT" || msg === "PAYMENT_REQUIRED") {
              if (updated.length > 0) {
                await supabase.from("partners").update({ product_profiles: profiles }).eq("id", p.id);
              }
              results.push({ id: p.id, name: p.name, ok: false, updatedApps: updated, error: msg });
              return new Response(JSON.stringify({ error: msg, results, generatedCount: totalGenerated }), { status: msg === "RATE_LIMIT" ? 429 : 402, headers: { "Content-Type": "application/json", ...corsHeaders } });
            }
            console.error(`Failed ${p.name}/${app}:`, msg);
          }
        }

        if (updated.length > 0) {
          // Fyll även det globala positioning_statement om det är tomt (eller overwrite) —
          // använd första nya texten utan produktnamn så den fungerar generellt.
          const firstNew = profiles[updated[0]]?.positioning as string | undefined;
          const currentTop = (p.positioning_statement || "").trim();
          const updatePayload: Record<string, any> = { product_profiles: profiles };
          if (firstNew && (overwrite || !currentTop)) {
            updatePayload.positioning_statement = firstNew;
          }
          const { error: upErr } = await supabase.from("partners").update(updatePayload).eq("id", p.id);
          if (upErr) throw upErr;
        }
        results.push({ id: p.id, name: p.name, ok: true, updatedApps: updated, skippedApps: apps.filter((a) => !missing.includes(a)) });
        if (all && partners.length > 1) await new Promise((r) => setTimeout(r, 600));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`Partner ${p.name} failed:`, msg);
        results.push({ id: p.id, name: p.name, ok: false, error: msg });
      }
    }

    return new Response(JSON.stringify({ ok: true, results, generatedCount: totalGenerated, partnerCount: partners.length }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (e) {
    console.error("generate-partner-positioning error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
});
