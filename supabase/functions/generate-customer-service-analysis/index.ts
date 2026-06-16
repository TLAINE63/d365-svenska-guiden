// Edge function: generate-customer-service-analysis
// Genererar köparsidig AI-tolkning av behovsanalys för Customer Service /
// Field Service / Contact Center via Lovable AI Gateway.

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
  focusKey: "customer_service" | "field_service" | "contact_center" | "multi";
  focusLabel: string;
  transformationLevel: number;
  transformationLabel: string;
  dataMaturityLevel: string;
  aiPotentialLevel: string;
  recommendAiAssessment: boolean;
  summary: Record<string, unknown>;
  recommendation: { products: string[]; reasons: string[] };
}

interface AnalysisOutput {
  executiveSummary: string;
  serviceInterpretation: string;
  solutionHypothesis: string;
  dataAndAiAnalysis: string;
  whyPoints: string[];
  risks: string[];
  partnerProfile: string;
  nextSteps: string[];
  confidence: "Låg" | "Medel" | "Hög";
}

const FALLBACK: AnalysisOutput = {
  executiveSummary:
    "Analysen ger en sammanhållen bild av er serviceorganisations nuläge, kanalmix, volymer, komplexitet och datamognad inför ett val av Dynamics 365-lösning för kundservice, fältservice eller contact center.\n\nUnderlaget räcker för att rama in vilka funktionella områden som behöver prioriteras och vilken partnerprofil som passar bäst, men det ersätter inte en fördjupad kravspecifikation eller fit-gap. Använd resultatet som diskussionsunderlag internt och i dialog med 2–3 partners – inte som ett färdigt produktbeslut.",
  serviceInterpretation:
    "Er serviceprofil pekar mot en organisation som behöver en mer strukturerad och systemstödd ärendehantering än vad ni har idag. Volymer, kanalmix och komplexitet i kundbasen avgör hur stort behovet av automatisering, routing och omnichannel är.\n\nGeografisk spridning, språk och eventuell fältservice påverkar både licensval och arkitektur. Ju mer komplex bilden är, desto viktigare blir det att tidigt etablera tydligt processägarskap och en gemensam datamodell över sälj, service och eventuellt ERP.\n\nAI och Copilot-stöd kan ge stor effekt på agentproduktivitet och självbetjäning, men förutsätter att grunddata, behörigheter och kunskapsbas håller tillräcklig kvalitet.",
  solutionHypothesis:
    "En preliminär lösningshypotes är att bygga vidare på en kombination av Dynamics 365 Customer Service som ärendekärna, kompletterad med Contact Center vid hög kanal- och röstvolym, samt Field Service om tekniker, installerad bas eller arbetsorder är centralt.\n\nLösningen bör vara skalbar i licensiering, integrerad mot ERP/CRM och möjliggöra Copilot-stöd för agenter och kunskapsbas. Slutligt val bör föregås av kravspecifikation, fit-gap och partnerdialog.",
  dataAndAiAnalysis:
    "Datamognaden avgör hur långt ni kan gå med AI och agenter i första steget. Är data spridd, otydlig i ägarskap eller saknar enhetlig kundvy bör fokus ligga på att bygga datagrund, integrationer och behörighetsmodell innan mer autonoma AI-funktioner införs.\n\nVid god datamognad kan AI och Copilot tidigt ge effekt på agentstöd, sammanfattning av ärenden, kunskapsförslag och självbetjäning. Mer autonoma agenter bör införas stegvis med tydliga kontrollpunkter, loggning och eskaleringsvägar till människa.",
  whyPoints: [
    "Servicemodell, kanalmix och volymer pekar i en tydlig riktning.",
    "Geografi, språk och kundsegmentering påverkar komplexitet och licensval.",
    "Datamognad och integrationer styr hur snabbt AI/agenter kan ge effekt.",
    "Befintliga system och processer påverkar migrerings- och införandestrategi.",
  ],
  risks: [
    "Otydligt processägarskap mellan sälj, service och fältservice kan försena beslut.",
    "Bristande datakvalitet och kundvy försvårar AI- och självbetjäningsinitiativ.",
    "Integrationer mot ERP, telefoni och fältsystem kräver tidig arkitekturplan.",
    "För hög AI-autonomi utan kontrollpunkter ökar risk för felaktig kundkommunikation.",
  ],
  partnerProfile:
    "Köparsidigt rekommenderas en partner med dokumenterad erfarenhet av Dynamics 365 Customer Service och de specifika moduler som er profil kräver (Contact Center, Field Service, Copilot, kunskapsbas).\n\nPartnern bör ha referenscase i motsvarande storleksklass och bransch, kunna kombinera funktionell rådgivning med integrationsarkitektur och ha tydlig metodik för förstudie, datakvalitet, behörigheter och förändringsledning.",
  nextSteps: [
    "Utse intern processägare för kundservice, fältservice och contact center.",
    "Genomför en kravworkshop och dokumentera nuläge mot börläge.",
    "Kartlägg datakällor, integrationer och datakvalitet i kundvyn.",
    "Begär in 2–3 partnerdialoger baserade på kravspecifikationen.",
    "Säkerställ budget, tidsplan och förändringsledning innan val.",
  ],
  confidence: "Medel",
};

Deno.serve(async (req: Request): Promise<Response> => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { "Content-Type": "application/json", ...cors },
    });
  }

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ analysis: FALLBACK, fallback: true }), {
        status: 200, headers: { "Content-Type": "application/json", ...cors },
      });
    }

    let body: Payload;
    try { body = await req.json(); } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400, headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const { summary, recommendation, companyName, contactName, focusKey, focusLabel,
      transformationLevel, transformationLabel, dataMaturityLevel, aiPotentialLevel,
      recommendAiAssessment } = body || ({} as Payload);

    if (!summary || !recommendation) {
      return new Response(JSON.stringify({ error: "summary and recommendation required" }), {
        status: 400, headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const system = [
      "Du är en köparsidig rådgivare som hjälper svenska bolag att tolka en behovsanalys för kundservice, fältservice och contact center med Microsoft Dynamics 365.",
      "Skriv ALLTID på svenska, neutralt, professionellt, rådgivande och utan säljretorik.",
      "Du ger ALDRIG ett definitivt produktval. Du ger en preliminär lösningshypotes som beslutsunderlag inför kravspec och partnerdialog.",
      "Undvik ordet 'oberoende'. Använd hellre 'köparsidig'.",
      "Skriv i sammanhängande prosa med tydliga STYCKEN. Använd ALLTID två radbrytningar (\\n\\n) mellan stycken så att texten blir lätt att läsa. Använd inte markdown, rubriker eller punktlistor i fritextfälten – bara löpande text med blankrader mellan stycken.",
      "Om underlaget är tunt – var explicit med osäkerhet och sätt confidence='Låg'.",
      "Anpassa tonen och fokuset efter focusKey: 'customer_service' = ärendehantering, SLA, kunskapsbas; 'field_service' = teknikerplanering, arbetsorder, reservdelar, IoT; 'contact_center' = volym, kanaler, röst, realtidsstyrning; 'multi' = sammanhängande flöde mellan flera områden.",
      "AI och agenter ska beskrivas balanserat: värdepotential, men också krav på datakvalitet, behörigheter, governance och kontrollpunkter. Om datamognaden är låg ska du tydligt rekommendera att stärka datagrund och processer innan mer autonoma agenter införs.",
      "Returnera ENDAST giltig JSON enligt schemat – ingen markdown, inga kodblock runt JSON.",
    ].join(" ");

    const schemaHint = {
      executiveSummary: "string (220-320 ord, 2-3 stycken separerade med \\n\\n, ledningsorienterad sammanfattning av nuläge, drivkrafter och vad analysen primärt visar)",
      serviceInterpretation: "string (380-560 ord, 3-4 stycken separerade med \\n\\n, tolkning av serviceprofil, komplexitet, kanalmix, geografi och hur dessa hänger ihop med valet av lösning)",
      solutionHypothesis: "string (220-340 ord, 2-3 stycken separerade med \\n\\n, preliminär lösningshypotes anpassad efter focusKey, med tydlig brasklapp att slutligt val kräver kravspec och fit-gap)",
      dataAndAiAnalysis: "string (260-400 ord, 2-3 stycken separerade med \\n\\n, balanserad analys av datamognad, AI-potential, kontrollpunkter och vad som bör göras innan agenter införs)",
      whyPoints: "string[] (4-6 punkter, konkreta skäl till varför analysen lutar åt lösningshypotesen, varje punkt 1-2 meningar)",
      risks: "string[] (4-6 risker och frågor att utreda vidare, köparsidigt formulerade)",
      partnerProfile: "string (140-220 ord, 2 stycken separerade med \\n\\n, vilken partnerprofil som passar inklusive metodik, branscherfarenhet, AI/data-kompetens och förändringsledning)",
      nextSteps: "string[] (5-7 konkreta nästa steg för köparen, handlingsbara åtgärder)",
      confidence: "Låg | Medel | Hög (säkerhet baserat på hur komplett underlaget är)",
    };

    const userPrompt = [
      `Företag: ${companyName || "Ej angivet"}`,
      `Kontakt: ${contactName || "Ej angivet"}`,
      `Fokusområde: ${focusLabel} (focusKey: ${focusKey})`,
      `Servicemognad: Nivå ${transformationLevel} – ${transformationLabel}`,
      `Datamognad: ${dataMaturityLevel}`,
      `AI-/agentpotential: ${aiPotentialLevel}`,
      `Rekommendera separat AI Assessment: ${recommendAiAssessment ? "Ja" : "Nej"}`,
      "",
      "Sammanfattning av svar:",
      "```json",
      JSON.stringify(summary, null, 2),
      "```",
      "",
      "Preliminär lösningsindikation (från regelbaserad scoring):",
      "```json",
      JSON.stringify(recommendation, null, 2),
      "```",
      "",
      "Generera ett köparsidigt analysunderlag enligt detta schema (returnera ENDAST JSON, fritextfält ska ha STYCKEN separerade med \\n\\n):",
      "```json",
      JSON.stringify(schemaHint, null, 2),
      "```",
    ].join("\n");

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
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
      return new Response(JSON.stringify({
        analysis: FALLBACK, fallback: true,
        reason: aiRes.status === 429 ? "rate_limited" : aiRes.status === 402 ? "credits_exhausted" : "ai_error",
      }), { status: 200, headers: { "Content-Type": "application/json", ...cors } });
    }

    const aiJson = await aiRes.json();
    const content: string = aiJson?.choices?.[0]?.message?.content || "";
    let parsed: AnalysisOutput;
    try { parsed = JSON.parse(content); }
    catch {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : FALLBACK;
    }

    const safe: AnalysisOutput = {
      executiveSummary: String(parsed.executiveSummary || FALLBACK.executiveSummary).slice(0, 4000),
      serviceInterpretation: String(parsed.serviceInterpretation || FALLBACK.serviceInterpretation).slice(0, 6000),
      solutionHypothesis: String(parsed.solutionHypothesis || FALLBACK.solutionHypothesis).slice(0, 4000),
      dataAndAiAnalysis: String(parsed.dataAndAiAnalysis || FALLBACK.dataAndAiAnalysis).slice(0, 5000),
      whyPoints: (Array.isArray(parsed.whyPoints) ? parsed.whyPoints : FALLBACK.whyPoints)
        .slice(0, 6).map((s) => String(s).slice(0, 500)),
      risks: (Array.isArray(parsed.risks) ? parsed.risks : FALLBACK.risks)
        .slice(0, 6).map((s) => String(s).slice(0, 500)),
      partnerProfile: String(parsed.partnerProfile || FALLBACK.partnerProfile).slice(0, 2500),
      nextSteps: (Array.isArray(parsed.nextSteps) ? parsed.nextSteps : FALLBACK.nextSteps)
        .slice(0, 7).map((s) => String(s).slice(0, 500)),
      confidence: ["Låg", "Medel", "Hög"].includes(String(parsed.confidence)) ? parsed.confidence : "Medel",
    };

    return new Response(JSON.stringify({ analysis: safe }), {
      status: 200, headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (err) {
    console.error("generate-customer-service-analysis error", err);
    return new Response(JSON.stringify({ analysis: FALLBACK, fallback: true }), {
      status: 200, headers: { "Content-Type": "application/json", ...cors },
    });
  }
});
