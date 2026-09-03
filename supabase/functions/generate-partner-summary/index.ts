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
    if (parts.length !== 3) return { valid: false, error: "Invalid token format" };
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sig = base64UrlDecode(s);
    const ok = await crypto.subtle.verify("HMAC", key, sig as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return { valid: false, error: "Invalid signature" };
    const payload = JSON.parse(atob(base64UrlToBase64(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return { valid: false, error: "Token expired" };
    if (payload.role !== "admin") return { valid: false, error: "Insufficient permissions" };
    return { valid: true, payload };
  } catch (e) {
    return { valid: false, error: "Token verification failed" };
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
  const desc = (p.description || "").slice(0, 1500);

  return `Du skriver en kort, skannbar AI-sammanfattning på svenska om en Microsoft Dynamics 365-partner. Sammanfattningen visas överst på partnerns publika profil och ska ge besökaren en förståelse på cirka 10 sekunder.

REGLER:
- Formulera exakt 5 punkter, varje punkt ska vara max 8 ord.
- Varje punkt ska inledas med "- " (bindestreck + mellanslag).
- Lyft fram: vilka D365-applikationer/typ av partner de är (t.ex. "Svensk specialist på Business Central"), branschfokus, typ av kund de passar för, geografi, och särskilda styrkor/nischkompetenser.
- Skriv i tredje person, neutralt och rådgivande. Ingen säljjargong, inga superlativ ("bäst", "ledande", "premium", "marknadsledande").
- Nämn ALDRIG andra partners/konkurrenter vid namn och gör inga jämförelser med namngivna företag. Påstå inget om certifieringsnivå, designations eller antal certifierade konsulter som inte uttryckligen framgår av underlaget.
- Nämn EJ pris, antal anställda, eller konkurrenter.
- Skriv ALDRIG ut "AI-genererad", "Sammanfattning:" eller liknande meta-text.
- Ingen inledande eller avslutande mening. Endast de 5 punkterna.

PARTNERDATA:
Namn: ${p.name}
Beskrivning från partnern: ${desc || "(saknas)"}
D365-applikationer: ${apps}
Branscher: ${industries}
Geografi: ${geo}
Orter med kontor: ${cities || "ej angett"}
Plattformskompetenser: ${platforms || "ej angett"}
Kundexempel: ${customers || "ej angett"}

Skriv de 5 punkterna nu. Håll varje punkt kort och konkret.`;
}

async function generateSummary(partner: any, apiKey: string): Promise<string> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: `Du är en neutral redaktör som skriver korta, faktabaserade partnerprofiler för en jämförelsesajt.\n\n${D365_MARKET_CONTEXT_SV}\n\nAnvänd marknadskontexten ovan för att placera partnern i rätt kategori (globalt konsulthus, internationell/nordisk systemintegratör, lokal/nischad specialist) när det är relevant. Citera inte rapporten ordagrant.` },
        { role: "user", content: buildPrompt(partner) },
      ],
    }),
  });

  if (resp.status === 429) throw new Error("RATE_LIMIT");
  if (resp.status === 402) throw new Error("PAYMENT_REQUIRED");
  if (!resp.ok) {
    const t = await resp.text();
    console.error("AI gateway error:", resp.status, t);
    throw new Error("AI_GATEWAY_ERROR");
  }

  const data = await resp.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("EMPTY_RESPONSE");
  return text;
}

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { token, partnerId, all, mode, staleDays } = await req.json();

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

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const STALE_DAYS = Math.min(Math.max(Number(staleDays) || 90, 1), 365);
    const staleBefore = new Date(Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000).toISOString();

    let query = supabase.from("partners").select("*");
    if (all) {
      query = query.eq("is_featured", true);
      if (mode === "stale") {
        query = query.or(`ai_summary.is.null,ai_summary_generated_at.lt.${staleBefore}`);
      }
    } else if (partnerId) {
      query = query.eq("id", partnerId);
    } else {
      return new Response(JSON.stringify({ error: "partnerId eller all krävs" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { data: partners, error } = await query;
    if (error) throw error;
    if (!partners || partners.length === 0) {
      if (all && mode === "stale") {
        return new Response(JSON.stringify({ ok: true, results: [], matchedCount: 0 }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      return new Response(JSON.stringify({ error: "Inga partners hittades" }), {
        status: 404, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const results: Array<{ id: string; name: string; ok: boolean; error?: string }> = [];
    for (const p of partners) {
      try {
        const summary = await generateSummary(p, LOVABLE_API_KEY);
        const { error: upErr } = await supabase
          .from("partners")
          .update({ ai_summary: summary, ai_summary_generated_at: new Date().toISOString() })
          .eq("id", p.id);
        if (upErr) throw upErr;
        results.push({ id: p.id, name: p.name, ok: true });
        if (all && partners.length > 1) await new Promise((r) => setTimeout(r, 800));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(`Failed for ${p.name}:`, msg);
        results.push({ id: p.id, name: p.name, ok: false, error: msg });
        if (msg === "RATE_LIMIT" || msg === "PAYMENT_REQUIRED") {
          return new Response(JSON.stringify({ error: msg, results }), {
            status: msg === "RATE_LIMIT" ? 429 : 402,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }
      }
    }

    return new Response(JSON.stringify({ ok: true, results, matchedCount: partners.length }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    console.error("generate-partner-summary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
