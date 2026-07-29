// Fyll i tomma "Varför välja er" (whyChoose) och 3–4 konkreta punkter (keyPoints)
// i product_filters[section] för publicerade partners. Genererar per aktiv produkt.
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

const PRODUCT_SECTIONS: { key: string; label: string; apps: string[] }[] = [
  { key: "bc", label: "Business Central", apps: ["Business Central"] },
  { key: "fsc", label: "Finance & Supply Chain Management", apps: ["Finance", "Supply Chain Management"] },
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
async function fetchSnippet(url: string, maxChars = 3500): Promise<string> {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 8000);
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (d365.se whyChoose bot)" },
      signal: ctl.signal, redirect: "follow",
    });
    clearTimeout(t);
    if (!res.ok) return "";
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html") && !ct.includes("text/plain")) return "";
    return stripHtml(await res.text()).slice(0, maxChars);
  } catch { return ""; }
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
    const s = await fetchSnippet(u, 3000);
    if (s && s.length > 200) snippets.push(`[${u}]\n${s}`);
    if (snippets.join("\n").length > 8000) break;
  }
  return snippets.join("\n\n").slice(0, 9000);
}

function buildPrompt(p: any, section: { key: string; label: string; apps: string[] }, webContext: string): string {
  const pf = p.product_filters || {};
  const sectionData = pf[section.key] || {};
  const industries = [...(p.industries || []), ...(p.secondary_industries || [])].join(", ") || "ej specificerat";
  const productIndustries = (sectionData.industries || []).join(", ") || industries;
  const geo = (p.geography || []).join(", ") || "ej specificerat";
  const cities = (p.office_cities || []).join(", ") || "ej angett";
  const desc = (p.description || "").slice(0, 1200);
  const aiSummary = (p.ai_summary || "").slice(0, 800);
  const positioning = (p.product_profiles?.[section.apps[0]]?.positioning || p.positioning_statement || "").slice(0, 300);
  const productDesc = (sectionData.productDescription || "").slice(0, 1200);
  const customerEx = (sectionData.customerExamples || []).slice(0, 6).join(", ");
  const teamSize = p.team_size_sweden || p.employees_sweden || "okänt";

  return `Du fyller i två fält i en Microsoft Dynamics 365-partners publika profil på d365.se för produktområdet "${section.label}":
1) whyChoose – kort text "Varför välja er för ${section.label}?" (2–4 meningar, max ~450 tecken).
2) keyPoints – 3–4 konkreta punkter (varje punkt en kort mening, max ~120 tecken per punkt).

Basera enbart på PARTNERDATA + WEBBKONTEXT nedan. Var konservativ – hittar du inte tydligt underlag, håll texten generell men trovärdig utifrån partnerns branscher, geografi och profil. Skriv ALDRIG saker som inte har stöd i datan.

REGLER för whyChoose:
- Svenska, 2–4 meningar.
- Konkret om HUR partnern jobbar med ${section.label}: leveransmodell, branschstyrka, projekttyp, effekter.
- Första person plural (vi/oss/vår).
- Ingen säljjargong ("bäst", "ledande", "marknadsledande", "premium", "experter"), inga superlativ.
- Använd inte ordet "oberoende".
- Nämn inte pris, konkurrenter eller antal anställda.

REGLER för keyPoints:
- Exakt 3–4 punkter.
- En punkt per rad, ingen bullet/prefix ("-", "•", "*").
- Fokus: styrka, typ av projekt, bransch/segment, differentiering, mätbar erfarenhet.
- Kort och konkret (max ~120 tecken per punkt).
- Undvik "vi erbjuder" och generella företagsfraser.
- Inga superlativ, inte ordet "oberoende".

PARTNERDATA:
Namn: ${p.name}
Webb: ${p.website || "(ej angiven)"}
Team i Sverige: ${teamSize}
Övergripande beskrivning: ${desc || "(saknas)"}
AI-sammanfattning från d365.se: ${aiSummary || "(saknas)"}
Positioneringsmening för produkten: ${positioning || "(saknas)"}
Branscher (övergripande): ${industries}
Branscher inom ${section.label}: ${productIndustries}
Geografi: ${geo}
Orter: ${cities}
Kundexempel inom ${section.label}: ${customerEx || "(ej angett)"}
Produktbeskrivning från partnern: ${productDesc || "(saknas)"}

WEBBKONTEXT (utdrag från partnerns webbplats, kan vara brus – använd försiktigt):
${webContext ? webContext.slice(0, 6000) : "(ingen webbkontext)"}

Svara med ENDAST giltig JSON i exakt detta schema (inga kommentarer, ingen markdown):
{
  "whyChoose": string,
  "keyPoints": string[]
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
        { role: "system", content: `Du är en seniorrådgivare som fyller i strukturerade profiltexter för svenska D365-partners. Svara alltid med giltig JSON.\n\n${D365_MARKET_CONTEXT_SV}` },
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
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  try { return JSON.parse(cleaned); }
  catch { console.error("JSON parse failed:", cleaned.slice(0, 500)); throw new Error("INVALID_JSON"); }
}

function sanitizeWhyChoose(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.trim().replace(/\s+/g, " ").slice(0, 500);
}
function sanitizeKeyPoints(v: unknown): string {
  if (!Array.isArray(v)) return "";
  const out: string[] = [];
  for (const raw of v) {
    if (typeof raw !== "string") continue;
    const t = raw.trim().replace(/^[-*•]\s*/, "").replace(/\s+/g, " ").slice(0, 140);
    if (t.length < 6) continue;
    if (out.some((x) => x.toLowerCase() === t.toLowerCase())) continue;
    out.push(t);
    if (out.length >= 4) break;
  }
  if (out.length < 3) return "";
  return out.join("\n");
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

    const results: Array<{ id: string; name: string; ok: boolean; updatedSections?: string[]; error?: string }> = [];
    let totalGenerated = 0;
    let webContextCache: string | null = null;

    for (const p of partners) {
      try {
        const pf = { ...(p.product_filters || {}) } as Record<string, any>;
        const activeSections = PRODUCT_SECTIONS.filter((s) => pf[s.key] && typeof pf[s.key] === "object");
        if (activeSections.length === 0) { results.push({ id: p.id, name: p.name, ok: true, updatedSections: [] }); continue; }

        // Vilka fält saknas (per sektion, per fält)?
        const work: Array<{ section: typeof PRODUCT_SECTIONS[number]; needWhy: boolean; needKp: boolean }> = [];
        for (const s of activeSections) {
          const cur = pf[s.key] || {};
          const needWhy = overwrite || !(typeof cur.whyChoose === "string" && cur.whyChoose.trim().length > 0);
          const needKp = overwrite || !(typeof cur.keyPoints === "string" && cur.keyPoints.trim().length > 0);
          if (needWhy || needKp) work.push({ section: s, needWhy, needKp });
        }
        if (work.length === 0) { results.push({ id: p.id, name: p.name, ok: true, updatedSections: [] }); continue; }

        webContextCache = await gatherWebContext(p.website);
        const updatedSections: string[] = [];

        for (const w of work) {
          try {
            const prompt = buildPrompt(p, w.section, webContextCache);
            const json = await callAI(prompt, LOVABLE_API_KEY);
            const why = sanitizeWhyChoose(json?.whyChoose);
            const kp = sanitizeKeyPoints(json?.keyPoints);
            const current = { ...(pf[w.section.key] || {}) };
            let changed = false;
            if (w.needWhy && why) { current.whyChoose = why; changed = true; }
            if (w.needKp && kp) { current.keyPoints = kp; changed = true; }
            if (changed) {
              current.ai_generated_why_keypoints = true;
              current.ai_generated_why_keypoints_at = new Date().toISOString();
              pf[w.section.key] = current;
              updatedSections.push(w.section.key);
              totalGenerated++;
            }
            await new Promise((r) => setTimeout(r, 400));
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            if (msg === "RATE_LIMIT" || msg === "PAYMENT_REQUIRED") {
              if (updatedSections.length > 0) {
                await supabase.from("partners").update({ product_filters: pf }).eq("id", p.id);
              }
              results.push({ id: p.id, name: p.name, ok: false, updatedSections, error: msg });
              return new Response(JSON.stringify({ error: msg, results, generatedCount: totalGenerated }), { status: msg === "RATE_LIMIT" ? 429 : 402, headers: { "Content-Type": "application/json", ...corsHeaders } });
            }
            console.error(`Failed ${p.name}/${w.section.key}:`, msg);
          }
        }

        if (updatedSections.length > 0) {
          const { error: upErr } = await supabase.from("partners").update({ product_filters: pf }).eq("id", p.id);
          if (upErr) throw upErr;
        }
        results.push({ id: p.id, name: p.name, ok: true, updatedSections });
        if (all && partners.length > 1) await new Promise((r) => setTimeout(r, 500));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`Partner ${p.name} failed:`, msg);
        results.push({ id: p.id, name: p.name, ok: false, error: msg });
      }
    }

    return new Response(JSON.stringify({ ok: true, results, generatedCount: totalGenerated, partnerCount: partners.length }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (e) {
    console.error("generate-partner-why-keypoints error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
});
