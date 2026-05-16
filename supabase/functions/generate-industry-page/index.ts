import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const ALLOWED_ORIGINS = [
  "https://d365.se",
  "https://www.d365.se",
  "https://d365-svenska-guiden.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowed =
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith(".lovableproject.com") ||
    origin.endsWith(".lovable.app");
  return {
    "Access-Control-Allow-Origin": allowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function b64UrlToB64(s: string) {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  return b;
}
function b64ToBytes(s: string) {
  const bin = atob(b64UrlToB64(s));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function verifyJWT(token: string, secret: string) {
  try {
    const [h, p, s] = token.split(".");
    if (!h || !p || !s) return false;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64ToBytes(s) as unknown as BufferSource,
      enc.encode(`${h}.${p}`),
    );
    if (!ok) return false;
    const payload = JSON.parse(atob(b64UrlToB64(p)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (payload.role !== "admin") return false;
    return true;
  } catch {
    return false;
  }
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

const SCHEMA = {
  name: "industry_page_content",
  description: "Strukturerad branschsida för Microsoft Dynamics 365.",
  parameters: {
    type: "object",
    properties: {
      meta_title: { type: "string", description: "SEO title, max 60 tecken" },
      meta_description: { type: "string", description: "SEO meta description, max 158 tecken" },
      intro: { type: "string", description: "2-3 stycken intro om branschen i Sverige (drivkrafter, marknadsläge, digitalisering). Markdown tillåten." },
      processes: {
        type: "array",
        description: "5-7 typiska affärsprocesser för branschen",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string", description: "1-2 meningar" },
          },
          required: ["title", "description"],
        },
      },
      challenges: {
        type: "array",
        description: "4-6 typiska utmaningar / smärtpunkter, formulerade neutralt",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
          required: ["title", "description"],
        },
      },
      roles: {
        type: "array",
        description: "5-7 nyckelroller och vad de behöver av systemstöd",
        items: {
          type: "object",
          properties: {
            role: { type: "string" },
            needs: { type: "string", description: "Vad rollen behöver av systemstöd, 1-2 meningar" },
          },
          required: ["role", "needs"],
        },
      },
      applications: {
        type: "array",
        description: "Vilka D365-applikationer som passar branschen och varför. Lista endast de relevanta.",
        items: {
          type: "object",
          properties: {
            app: {
              type: "string",
              enum: [
                "Business Central",
                "Finance & Supply Chain",
                "Sales",
                "Customer Service",
                "Field Service",
                "Contact Center",
                "Customer Insights",
              ],
            },
            relevance: { type: "string", description: "1-2 meningar om varför denna app passar branschen" },
          },
          required: ["app", "relevance"],
        },
      },
      faq: {
        type: "array",
        description: "5-7 vanliga frågor och svar om Dynamics 365 i denna bransch",
        items: {
          type: "object",
          properties: {
            q: { type: "string" },
            a: { type: "string", description: "Neutralt, faktabaserat svar 2-4 meningar" },
          },
          required: ["q", "a"],
        },
      },
    },
    required: ["meta_title", "meta_description", "intro", "processes", "challenges", "roles", "applications", "faq"],
  },
};

function buildPrompt(industryName: string): string {
  return `Skriv en proffsig och neutral branschsida för **${industryName}** på svenska.

Sidan ska beskriva svenska företag i branschen och hur Microsoft Dynamics 365 (ERP och CRM) typiskt används. Mottagare är beslutsfattare som utvärderar affärssystem.

REGLER:
- Skriv på svenska, neutral rådgivande ton (radikal transparens, inga superlativ som "bäst", "ledande", "premium").
- Inga partnernamn, inga konkurrenter, inga prisuppgifter.
- D365-applikationer ska heta exakt: Business Central, Finance & Supply Chain, Sales, Customer Service, Field Service, Contact Center, Customer Insights. Nämn ALDRIG Power Platform eller Power Apps.
- Processer, utmaningar och roller ska vara branschspecifika och igenkännbara för någon som jobbar i branschen.
- FAQ ska besvara de vanligaste frågorna en VD/CFO/IT-chef i branschen ställer om Dynamics 365.
- Meta title: max 60 tecken, ska innehålla branschnamnet och Dynamics 365.
- Meta description: max 158 tecken, ska sälja in sidans värde utan superlativ.

Branschnamn: ${industryName}
Marknad: Sverige`;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!token || !(await verifyJWT(token, secret))) {
      return json({ error: "Unauthorized" }, 401, corsHeaders);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return json({ error: "Servern är inte korrekt konfigurerad" }, 500, corsHeaders);
    }

    const { industry_slug, industry_name } = await req.json();
    if (!industry_slug || !industry_name) {
      return json({ error: "industry_slug och industry_name krävs" }, 400, corsHeaders);
    }

    const callAi = async (model: string) =>
      await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "Du är en oberoende svensk branschexpert på affärssystem och Microsoft Dynamics 365. Du skriver neutralt, faktabaserat och rådgivande. Använd alltid det angivna verktyget för att returnera strukturerad data.",
            },
            { role: "user", content: buildPrompt(industry_name) },
          ],
          tools: [{ type: "function", function: SCHEMA }],
          tool_choice: { type: "function", function: { name: SCHEMA.name } },
        }),
      });

    // Try primary, then fall back through alternates on transient gateway errors (502/503/504).
    const models = ["google/gemini-2.5-flash", "google/gemini-2.5-pro", "google/gemini-3-flash-preview"];
    let aiResp: Response | null = null;
    let lastErrText = "";
    for (const m of models) {
      const r = await callAi(m);
      if (r.status === 429) return json({ error: "RATE_LIMIT" }, 429, corsHeaders);
      if (r.status === 402) return json({ error: "PAYMENT_REQUIRED" }, 402, corsHeaders);
      if (r.ok) { aiResp = r; break; }
      lastErrText = await r.text();
      console.error("AI gateway error", m, r.status, lastErrText.slice(0, 300));
      if (![502, 503, 504].includes(r.status)) {
        return json({ error: "AI_GATEWAY_ERROR" }, 502, corsHeaders);
      }
      await new Promise((res) => setTimeout(res, 800));
    }
    if (!aiResp) {
      return json({ error: "AI_GATEWAY_ERROR" }, 502, corsHeaders);
    }

    const aiData = await aiResp.json();
    const toolCall = aiData?.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr = toolCall?.function?.arguments;
    if (!argsStr) {
      console.error("AI returned no tool call", JSON.stringify(aiData));
      return json({ error: "EMPTY_AI_RESPONSE" }, 502, corsHeaders);
    }
    const content = JSON.parse(argsStr);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Upsert: behåll ev. existerande is_published; default till false
    const { data: existing } = await supabase
      .from("industry_pages")
      .select("id, is_published")
      .eq("slug", industry_slug)
      .maybeSingle();

    const payload = {
      slug: industry_slug,
      name: industry_name,
      meta_title: content.meta_title || null,
      meta_description: content.meta_description || null,
      intro: content.intro || null,
      processes: content.processes || [],
      challenges: content.challenges || [],
      roles: content.roles || [],
      applications: content.applications || [],
      faq: content.faq || [],
      related_industries: [] as string[],
      is_published: existing?.is_published ?? false,
      ai_generated_at: new Date().toISOString(),
    };

    const { data: saved, error: saveErr } = await supabase
      .from("industry_pages")
      .upsert(payload, { onConflict: "slug" })
      .select()
      .single();

    if (saveErr) {
      console.error("Save error", saveErr);
      return json({ error: saveErr.message }, 500, corsHeaders);
    }

    return json({ page: saved }, 200, corsHeaders);
  } catch (e: any) {
    console.error("generate-industry-page error", e);
    return json({ error: e?.message || "Internal error" }, 500, corsHeaders);
  }
});
