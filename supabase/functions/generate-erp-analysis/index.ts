// Edge function: generate-erp-analysis
// Genererar köparsidig AI-tolkning av ERP behovsanalys via Lovable AI Gateway.

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  if (origin.startsWith("http://localhost:")) return true;
  if (origin.endsWith(".lovable.app")) return true;
  if (origin.endsWith(".lovableproject.com")) return true;
  if (origin === "https://d365.se" || origin === "https://www.d365.se") return true;
  return false;
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : "https://d365-svenska-guiden.lovable.app";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
  };
}

interface Payload {
  companyName?: string;
  contactName?: string;
  summary: Record<string, unknown>;
  recommendation: {
    product: string;
    reasons: string[];
    isCloseCall?: boolean;
    complexityLevel?: number;
    riskLevel?: string;
  };
}

interface AnalysisOutput {
  executiveSummary: string;
  aiInterpretation: string;
  valueHypothesis: string;
  whyPoints: string[];
  risks: string[];
  partnerProfile: string;
  nextSteps: string[];
  confidence: "Låg" | "Medel" | "Hög";
}

const FALLBACK: AnalysisOutput = {
  executiveSummary:
    "Analysen ger en sammanhållen bild av verksamhetens nuläge, drivkrafter och systemmässiga utgångspunkter inför ett kommande ERP-val. " +
    "Underlaget är tillräckligt för att rama in vilken typ av plattform och partnerprofil som bör utvärderas vidare, men det ersätter inte en kravspecifikation. " +
    "Använd analysen som diskussionsunderlag internt och i dialog med 2–3 partners – inte som ett färdigt systembeslut.",
  aiInterpretation:
    "Underlaget räcker för en preliminär indikation men inte för ett definitivt systemval. " +
    "Verksamhetens komplexitet, geografi, transaktionsvolymer och förändringsambition pekar tillsammans i en tydlig riktning, men flera frågor behöver fördjupas innan en plattform kan väljas. " +
    "Använd resultatet som strukturerat diskussionsunderlag inför kravspecifikation, intern förankring och dialog med ERP-partner – inte som ett beslut i sig.",
  valueHypothesis:
    "Den största värdepotentialen ligger sannolikt i att lyfta bort manuella moment, skapa en enhetlig datamodell och ge ledningen tillgång till mer aktuella beslutsunderlag. " +
    "På medellång sikt kan en modern plattform också möjliggöra automatisering, prediktiv analys och Copilot-stöd i de mest tidskrävande processerna – förutsatt att datakvalitet och processägarskap är på plats.",
  whyPoints: [
    "Verksamhetens komplexitet och geografi pekar i en tydlig riktning.",
    "Storlek och antal användare påverkar val av plattform och licensmodell.",
    "Befintliga system och integrationer styr migreringsstrategi.",
  ],
  risks: [
    "Otydlig processägare kan försena beslut och implementation.",
    "Integrationer mot kringsystem kräver tidig arkitekturplan.",
    "Datakvalitet i nuvarande system bör kartläggas innan migrering.",
  ],
  partnerProfile:
    "Köparsidigt rekommenderas en partner med dokumenterad branscherfarenhet, tydlig metodik för förstudie och kravarbete samt referenscase i motsvarande storleksklass. " +
    "Partnern bör kunna kombinera funktionell rådgivning med arkitekturkompetens och ha erfarenhet av förändringsledning i organisationer av er storlek.",
  nextSteps: [
    "Samla intern styrgrupp och utse processägare per huvudprocess.",
    "Genomför en kravworkshop och dokumentera nuläge vs. börläge.",
    "Begär in 2–3 partnerdialoger baserade på kravspecifikationen.",
    "Säkerställ budget, tidsplan och förändringsledning innan val.",
  ],
  confidence: "Medel",
};

Deno.serve(async (req: Request): Promise<Response> => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  try {
    if (!LOVABLE_API_KEY) {
      console.error("Missing LOVABLE_API_KEY");
      return new Response(JSON.stringify({ analysis: FALLBACK, fallback: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    let body: Payload;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const { summary, recommendation, companyName, contactName } = body || ({} as Payload);
    if (!summary || !recommendation) {
      return new Response(JSON.stringify({ error: "summary and recommendation required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const system = [
      "Du är en köparsidig rådgivare som hjälper svenska bolag att tolka en behovsanalys för affärssystem (ERP).",
      "Skriv ALLTID på svenska, neutralt, professionellt och utan säljretorik.",
      "Du ger ALDRIG ett definitivt systemval. Du ger en preliminär tolkning som beslutsunderlag inför kravspec och partnerdialog.",
      "Undvik ordet 'oberoende'. Använd 'köparsidig'.",
      "Om underlaget är tunt – var explicit med osäkerhet och sätt confidence='Låg'.",
      "AI-intresse, AI-mognad eller önskade AI-use cases får ALDRIG ensamt styra valet mellan Business Central och Finance & Supply Chain Management. AI ska påverka datakrav, automationspotential, prioriterade use cases, partnerprofil och nästa steg – inte plattformsindikationen.",
      "Om aiMaturity är 'Låg': betona att data, processer och styrning behöver förbättras innan större AI-initiativ. Om 'Hög' eller 'Avancerad': föreslå konkreta use cases. Reflektera AI-mognaden i partnerProfile (t.ex. behov av Copilot/Power Platform/datakompetens, eller att partnern måste kunna hjälpa med masterdata och processkartläggning vid låg datamognad).",
      "Returnera ENDAST giltig JSON enligt schemat – ingen markdown, inga kodblock.",
    ].join(" ");


    const schemaHint = {
      executiveSummary: "string (180-260 ord, sammanhållen ledningsorienterad sammanfattning som ramar in nuläge, drivkrafter och vad analysen primärt visar – ska kunna läsas fristående)",
      aiInterpretation: "string (350-550 ord, sammanhängande prosa i 3-4 stycken som tolkar verksamhetens profil, komplexitet, geografi, datamognad och AI-mognad och kopplar detta till plattformsindikationen utan att låsa valet)",
      valueHypothesis: "string (150-250 ord, beskriver var den största affärsnyttan sannolikt ligger på 1-3 års sikt – processeffektivitet, datadriven styrning, automation, Copilot/AI – och vilka förutsättningar som krävs)",
      whyPoints: "string[] (4-6 punkter, konkreta skäl till varför analysen lutar åt indikationen, varje punkt 1-2 meningar)",
      risks: "string[] (4-6 risker och frågor att utreda vidare, formulerade köparsidigt)",
      partnerProfile: "string (4-7 meningar om vilken partnerprofil som passar, inklusive metodik, branscherfarenhet, AI/data-kompetens och förändringsledningskapacitet)",
      nextSteps: "string[] (5-7 konkreta nästa steg för köparen, formulerade som handlingsbara åtgärder)",
      confidence: "Låg | Medel | Hög (säkerhet i analysen baserat på hur komplett underlaget är)",
    };

    const userPrompt = [
      `Företag: ${companyName || "Ej angivet"}`,
      `Kontakt: ${contactName || "Ej angivet"}`,
      "",
      "Sammanfattning av svar:",
      "```json",
      JSON.stringify(summary, null, 2),
      "```",
      "",
      "Preliminär systemindikation (från regelbaserad scoring):",
      "```json",
      JSON.stringify(recommendation, null, 2),
      "```",
      "",
      "Generera ett köparsidigt analysunderlag enligt detta schema (returnera ENDAST JSON):",
      "```json",
      JSON.stringify(schemaHint, null, 2),
      "```",
    ].join("\n");

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI gateway error", aiRes.status, errText);
      if (aiRes.status === 429 || aiRes.status === 402) {
        return new Response(
          JSON.stringify({ analysis: FALLBACK, fallback: true, reason: aiRes.status === 429 ? "rate_limited" : "credits_exhausted" }),
          { status: 200, headers: { "Content-Type": "application/json", ...cors } },
        );
      }
      return new Response(JSON.stringify({ analysis: FALLBACK, fallback: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const aiJson = await aiRes.json();
    const content: string = aiJson?.choices?.[0]?.message?.content || "";
    let parsed: AnalysisOutput;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : FALLBACK;
    }

    const safe: AnalysisOutput = {
      executiveSummary: String(parsed.executiveSummary || FALLBACK.executiveSummary).slice(0, 3000),
      aiInterpretation: String(parsed.aiInterpretation || FALLBACK.aiInterpretation).slice(0, 6000),
      valueHypothesis: String(parsed.valueHypothesis || FALLBACK.valueHypothesis).slice(0, 3000),
      whyPoints: (Array.isArray(parsed.whyPoints) ? parsed.whyPoints : FALLBACK.whyPoints)
        .slice(0, 6).map((s) => String(s).slice(0, 500)),
      risks: (Array.isArray(parsed.risks) ? parsed.risks : FALLBACK.risks)
        .slice(0, 6).map((s) => String(s).slice(0, 500)),
      partnerProfile: String(parsed.partnerProfile || FALLBACK.partnerProfile).slice(0, 2000),
      nextSteps: (Array.isArray(parsed.nextSteps) ? parsed.nextSteps : FALLBACK.nextSteps)
        .slice(0, 7).map((s) => String(s).slice(0, 500)),
      confidence: ["Låg", "Medel", "Hög"].includes(String(parsed.confidence)) ? parsed.confidence : "Medel",
    };

    return new Response(JSON.stringify({ analysis: safe }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (err) {
    console.error("generate-erp-analysis error", err);
    return new Response(JSON.stringify({ analysis: FALLBACK, fallback: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
});
