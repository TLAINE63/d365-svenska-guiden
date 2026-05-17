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
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : "https://d365.se",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

function b64u(s: string) { let b = s.replace(/-/g, "+").replace(/_/g, "/"); while (b.length % 4) b += "="; return b; }
async function verifyAdminJWT(token: string, secret: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const [h, p, s] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sig = Uint8Array.from(atob(b64u(s)), c => c.charCodeAt(0));
    const ok = await crypto.subtle.verify("HMAC", key, sig as unknown as BufferSource, enc.encode(`${h}.${p}`));
    if (!ok) return false;
    const payload = JSON.parse(atob(b64u(p)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return false;
    return payload.role === "admin";
  } catch { return false; }
}

function buildPrompt(args: {
  partner: any;
  industry: string;
  product: string | null;
  industryIntro?: string | null;
}): string {
  const { partner: p, industry, product, industryIntro } = args;
  const apps = (p.applications || []).join(", ") || "okänt";
  const customers = (p.customer_examples || []).slice(0, 8).join(", ");
  const cases = (p.industry_apps || [])
    .filter((a: any) => a.industry === industry)
    .map((a: any) => `${a.name} (${a.application}): ${a.description}`)
    .slice(0, 5)
    .join("; ");
  const desc = (p.description || "").slice(0, 1200);
  const productLine = product
    ? `\nFokusera texten specifikt på partnerns leverans av ${product} till denna bransch.`
    : `\nSkriv en allmän branschtext som täcker partnerns relevanta erbjudande för branschen (kan omfatta flera Dynamics 365-applikationer).`;

  return `Du skriver en kort, neutral och faktabaserad branschtext på svenska för en Microsoft Dynamics 365-partner. Texten visas på branschsidan ${industry} när partnern listas.

REGLER:
- MAX 280 ord, gärna kortare (150-220 är bra).
- Neutral och rådgivande ton. Inga superlativ ("bäst", "ledande", "premium", "marknadsledande").
- Konkret: nämn relevanta erfarenheter, kompetenser, branschmoduler eller kundtyper när det går.
- Anta att läsaren kan sin egen bransch — förklara inte branschen i sig.
- Skriv i tredje person ("Partnern levererar...", "De har...") eller med partnernamnet.
- Inga emojis, inga rubriker, ingen meta-text om att texten är AI-genererad.${productLine}

KONTEXT:
Bransch: ${industry}${industryIntro ? `\nBranschkontext (allmän): ${industryIntro.slice(0, 500)}` : ""}
Partner: ${p.name}
Partnerns generella beskrivning: ${desc || "(saknas)"}
Dynamics 365-applikationer partnern jobbar med: ${apps}
${product ? `Aktuell produkt för denna text: ${product}` : ""}
Branschspecifika appar/moduler: ${cases || "(inga registrerade)"}
Kundexempel: ${customers || "(ej angett)"}

Skriv branschtexten nu, utan rubrik och utan inledande fraser som "Branschtext:" eller "Sammanfattning:".`;
}

async function callAI(prompt: string, apiKey: string): Promise<string> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "Du är en neutral redaktör som skriver korta, faktabaserade branschtexter för Microsoft Dynamics 365-partners på en svensk jämförelsesajt." },
        { role: "user", content: prompt },
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
  return text;
}

serve(async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { adminToken, invitationToken, partnerId, industry, product } = body || {};

    if (!industry || typeof industry !== "string" || industry.length > 200) {
      return new Response(JSON.stringify({ error: "industry krävs" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (product !== undefined && product !== null && (typeof product !== "string" || product.length > 100)) {
      return new Response(JSON.stringify({ error: "product ogiltig" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, SECRET);

    // Auth: either admin JWT or valid partner invitation token
    let authedPartnerId: string | null = null;
    let isAdmin = false;

    if (adminToken) {
      isAdmin = await verifyAdminJWT(adminToken, SECRET);
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Ogiltig admin-session" }), {
          status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } else if (invitationToken) {
      const { data: inv } = await supabase
        .from("partner_invitations")
        .select("partner_id, expires_at, status")
        .eq("token", invitationToken)
        .maybeSingle();
      if (!inv || !inv.partner_id) {
        return new Response(JSON.stringify({ error: "Ogiltig inbjudan" }), {
          status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      if (inv.status === "pending" && new Date(inv.expires_at) < new Date()) {
        return new Response(JSON.stringify({ error: "Inbjudan har gått ut" }), {
          status: 410, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      authedPartnerId = inv.partner_id;
    } else {
      return new Response(JSON.stringify({ error: "Auth krävs" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const effectivePartnerId = isAdmin ? partnerId : authedPartnerId;
    if (!effectivePartnerId) {
      return new Response(JSON.stringify({ error: "partnerId krävs" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { data: partner, error: pErr } = await supabase
      .from("partners")
      .select("*")
      .eq("id", effectivePartnerId)
      .maybeSingle();
    if (pErr || !partner) {
      return new Response(JSON.stringify({ error: "Partner hittades inte" }), {
        status: 404, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Optional: fetch industry page intro for richer context
    const { data: indPage } = await supabase
      .from("industry_pages")
      .select("intro")
      .ilike("name", industry)
      .maybeSingle();

    // Rate limit (per partner-day, 30/day)
    const today = new Date().toISOString().slice(0, 10);
    const { count } = await supabase
      .from("ai_usage_log")
      .select("*", { count: "exact", head: true })
      .eq("endpoint", "generate-partner-industry-pitch")
      .eq("usage_day", today)
      .eq("ip_hash", `partner:${effectivePartnerId}`);
    if ((count || 0) >= 30) {
      return new Response(JSON.stringify({ error: "Dagsgräns nådd" }), {
        status: 429, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const prompt = buildPrompt({
      partner,
      industry,
      product: product || null,
      industryIntro: indPage?.intro || null,
    });

    const text = await callAI(prompt, LOVABLE_API_KEY);

    await supabase.from("ai_usage_log").insert({
      endpoint: "generate-partner-industry-pitch",
      ip_hash: `partner:${effectivePartnerId}`,
    });

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("generate-partner-industry-pitch:", msg);
    const status = msg === "RATE_LIMIT" ? 429 : msg === "PAYMENT_REQUIRED" ? 402 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
