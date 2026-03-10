import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Base requirement templates per product
const bcBaseRequirements = {
  ekonomi: [
    { area: "Redovisning & Huvudbok", items: ["Kontoplan och dimensioner", "Periodisering och bokslut", "Momshantering (svensk & EU)", "Valutahantering", "Koncernintern bokföring"] },
    { area: "Leverantörsreskontra", items: ["Fakturamatchning", "Betalningsförslag och bankfiler (ISO 20022)", "Leverantörsutvärdering"] },
    { area: "Kundreskontra", items: ["Fakturering och kravhantering", "Autogiro och direktbetalning", "Räntefakturering"] },
    { area: "Budget & Prognos", items: ["Budgetmallar och versioner", "Kassaflödesprognos", "Koppling till Excel och Power BI"] },
  ],
  lager: [
    { area: "Artikelhantering", items: ["Artikelkategorier och attribut", "Varianter (storlek, färg, etc.)", "Spårning (parti/serienummer)", "Streckkodsstöd"] },
    { area: "Lageroperationer", items: ["Inleverans och utleverans", "Plocklistor och leveransplanering", "Inventering och lagervärdering", "Lagerplatser och zoner"] },
    { area: "Lagerstyrning", items: ["Beställningspunkt och säkerhetslager", "Inköpsförslag", "Disponibelt och reservationer"] },
  ],
  produktion: [
    { area: "Produktionsstruktur", items: ["Produktionsstrukturer (BOM)", "Operationsföljder och kapacitet", "Arbetscenter och maskingrupper"] },
    { area: "Produktionsplanering", items: ["MRP-körningar", "Produktionsorder (planerade, fasta, släppta)", "Finjusterat kapacitetsschema", "Underleverantörshantering"] },
    { area: "Kvalitet & Spårbarhet", items: ["Kvalitetskontrollorder", "Lot- och serienummerspårning genom hela kedjan"] },
  ],
  forsaljning: [
    { area: "Försäljningsprocess", items: ["Offerthantering", "Order och blankett-order", "Direktleverans", "Returhantering"] },
    { area: "Prissättning", items: ["Prislistor och kampanjpriser", "Radrabatter och fakturarabatter", "Kundspecifika priser"] },
    { area: "CRM-grundfunktioner", items: ["Kontakt- och kundhantering", "Möjligheter och pipeline", "Uppgifter och aktiviteter"] },
  ],
  inkop: [
    { area: "Inköpsprocess", items: ["Inköpsrekvisitioner", "Inköpsorder och ramavtal", "Godkännandeflöden", "Leverantörsutvärdering"] },
    { area: "Mottagning & Matchning", items: ["Inleverans och kvalitetskontroll", "Fakturamatchning (2/3-vägs)", "Förbetalningar"] },
  ],
  projekt: [
    { area: "Projekthantering", items: ["Projektstruktur och uppgifter", "Tid- och materialregistrering", "Projektbudget och uppföljning", "Successiv vinstavräkning (WIP)"] },
  ],
  integration: [
    { area: "Systemintegrationer", items: ["E-handelsplattform", "CRM-system", "EDI / Orderhantering", "Lönesystem", "BI och rapportering (Power BI)"] },
    { area: "Teknisk plattform", items: ["API och webbtjänster", "Datamigrering från befintligt system", "Single Sign-On (SSO)", "Power Platform (Power Automate, Power Apps)"] },
  ],
};

const fscBaseRequirements = {
  ekonomi: [
    { area: "Finansiell styrning", items: ["Avancerad kontoplan med finansiella dimensioner (6+)", "Flera juridiska personer och koncernkonsolidering", "Avancerad valutahantering och omvärderingar", "Intäktsredovisning (IFRS 15/ASC 606)", "Anläggningstillgångar och avskrivningsplaner"] },
    { area: "Leverantörsreskontra", items: ["Avancerad fakturamatchning (3-vägs)", "Leverantörssamarbetsportal", "Globala betalningsformat och bankintegration"] },
    { area: "Budget & Planering", items: ["Budgetplanering med arbetsflöden", "Kassaflödesprognos", "Finansiell rapportering (Management Reporter)", "Kostnadsredovisning och internprissättning"] },
  ],
  lager: [
    { area: "Warehouse Management", items: ["Avancerad lagerstyrning (WMS)", "Lagerplatsdirektiv och arbetsmallar", "Vågprocesser och klusterplockningar", "Mobil lagerapp", "Lastvägsmottagning"] },
    { area: "Lagervärdering", items: ["Standardkostnad / Rörligt medelvärde / FIFO", "Lagerstängning och omvärdering", "Lagerredovisning och avstämning"] },
  ],
  produktion: [
    { area: "Tillverkning", items: ["Diskret tillverkning", "Processtillverkning (recept/formler)", "Lean manufacturing (kanban)", "Blandad tillverkning", "Konfigurator för kundanpassade produkter"] },
    { area: "Planering", items: ["Huvudplanering (MRP/MPS)", "Kapacitetsplanering (CRP)", "Planeringsoptimering", "Prognoser och efterfrågeplanering"] },
    { area: "Kvalitet & Efterlevnad", items: ["Kvalitetsorder och karantän", "Avvikelsehantering", "Regulatorisk spårbarhet (FDA, EU-förordningar)"] },
  ],
  forsaljning: [
    { area: "Order till kontant", items: ["Avancerad orderhantering", "Koncerninterna transaktioner", "Allokering och ATP (Available to Promise)", "Returer och kreditnotor"] },
    { area: "Prissättning", items: ["Handelsavtal och rabattstrukturer", "Provisioner och royalties", "Kundspecifika prislistor och hierarkier"] },
  ],
  inkop: [
    { area: "Procurement", items: ["Inköpskategorier och policyer", "Inköpsrekvisitioner med arbetsflöden", "Leverantörsportal och samarbete", "Kontraktshantering", "Leverantörsbedömning och scorecards"] },
    { area: "Sourcing", items: ["RFQ-processer", "Leverantörskvalificering", "Godkända leverantörslistor"] },
  ],
  projekt: [
    { area: "Projekthantering", items: ["Projektstrukturplaner (WBS)", "Resursplanering och kapacitet", "Projektredovisning (intäkt, kostnad, WIP)", "Milstolps- och tidsfakturering", "Integration med Project Operations"] },
  ],
  integration: [
    { area: "Systemintegrationer", items: ["ERP-till-ERP (koncernsystem)", "MES/SCADA-integration", "EDI och B2B-handel", "PLM-integration", "BI och avancerad analys (Azure Synapse, Power BI)"] },
    { area: "Teknisk plattform", items: ["Azure DevOps och ALM", "Lifecycle Services (LCS)", "Dual-write (Dataverse)", "Power Platform-integration", "Data-migrering och cutover-planering"] },
  ],
};

const salesBaseRequirements = {
  lead_mgmt: [
    { area: "Leadhantering", items: ["Leadregistrering från webb, e-post och telefon", "Automatisk lead-scoring och kvalificering", "Lead-routing och tilldelning till säljare", "Konvertering från lead till affärsmöjlighet"] },
    { area: "Prospektering", items: ["Linkedin Sales Navigator-integration", "Prospektlistor och segmentering", "Dubbletthantering och dataförbättring"] },
  ],
  opportunity: [
    { area: "Affärsmöjligheter", items: ["Anpassningsbara säljprocesser och steg", "Sannolikhetsbedömning och viktade pipeline-värden", "Konkurrentspårning per affär", "Samarbete i säljteam (co-selling)"] },
    { area: "Pipeline-hantering", items: ["Pipeline-vyer och Kanban-tavla", "Prognoser (forecast) med AI-stöd", "Säljcoaching-insikter från Copilot", "Win/loss-analys"] },
  ],
  account_contact: [
    { area: "Kundhantering", items: ["360°-kundvy med aktivitetshistorik", "Kundhierarki (koncern/dotterbolag)", "Relationsroller och beslutsfattare", "Kundkategorisering (A/B/C-kund)"] },
    { area: "Kontakthantering", items: ["Kontaktregister med rollbaserad åtkomst", "Koppling till organisationer och affärer", "GDPR-hantering (samtycke, radering)"] },
  ],
  activities: [
    { area: "Aktivitetshantering", items: ["Uppgifter, möten, telefonsamtal och e-post", "Outlook-integration för e-post och kalender", "Teams-integration för möten", "Automatiska påminnelser och uppföljning"] },
    { area: "Tidslinjevy", items: ["Kronologisk aktivitetshistorik per kund", "Anteckningar och intern kommunikation", "Filbilagor kopplade till aktiviteter"] },
  ],
  quotes_orders: [
    { area: "Offerthantering", items: ["Offertmallar och produktkatalog", "Prissättning med rabatter och enheter", "Offert-till-order-konvertering", "Digital signering (e-signatur)"] },
    { area: "Orderhantering", items: ["Orderregistrering och bekräftelse", "Koppling till fakturering och ERP", "Returer och kreditnoter"] },
  ],
  analytics: [
    { area: "Säljrapporter", items: ["Dashboards för pipeline, vunna/förlorade affärer", "Aktivitetsrapporter per säljare", "KPI-uppföljning (konverteringsgrad, säljtid, etc.)", "Power BI-integration för avancerad analys"] },
    { area: "AI-insikter", items: ["Copilot-sammanfattningar av kundinteraktioner", "Prediktiv lead-scoring", "Relationsanalys och sentimentanalys"] },
  ],
  automation: [
    { area: "Processautomatisering", items: ["Automatiska arbetsflöden vid statusändringar", "E-postsekvenser och uppföljningsautomation", "Godkännandeflöden för rabatter och offerter", "Power Automate-koppling"] },
    { area: "Copilot-funktioner", items: ["Automatisk mötessammanfattning", "E-postförslag och svarsutkast", "Säljcoaching-rekommendationer"] },
  ],
  email_marketing: [
    { area: "E-postkampanjer", items: ["Mallar för utgående e-post", "Spårning av öppningsgrad och klick", "Automatiserade drip-kampanjer", "Koppling till Customer Insights (Marketing)"] },
  ],
  integration: [
    { area: "Systemintegrationer", items: ["ERP-integration (Business Central / Finance)", "E-handelsplattform", "Marknadsföringsplattform", "Kundservicesystem (Customer Service)", "Dokumenthantering (SharePoint)"] },
    { area: "Teknisk plattform", items: ["Dataverse och Power Platform", "API:er och webbtjänster", "Datamigrering från befintligt CRM", "Single Sign-On (SSO / Entra ID)"] },
  ],
};

const marketingBaseRequirements = {
  segments: [
    { area: "Segmentering", items: ["Dynamiska segment baserat på kontaktdata och beteende", "Statiska listor för manuell hantering", "Segmentering baserad på engagemang (öppningsgrad, klick)", "Uteslutningssegment och suppressionslistor"] },
    { area: "Kundprofiler", items: ["Enhetlig kundprofil (Customer Data Platform)", "Beteendedata från webb, e-post och events", "Integration med externa datakällor"] },
  ],
  journeys: [
    { area: "Kundresor", items: ["Visuell drag-and-drop-designer för kundresor", "Trigger-baserade resor (formulär, webbbesök, köp)", "Flerkanalsresor (e-post, SMS, push)", "Förgreningar baserade på kundbeteende", "A/B-testning inom kundresor"] },
    { area: "Automation", items: ["Automatiska välkomstflöden", "Nurturing-sekvenser baserat på lead-score", "Re-engagement-kampanjer för inaktiva kontakter", "Händelsebaserad automation (trigger)"] },
  ],
  email: [
    { area: "E-posthantering", items: ["Drag-and-drop e-postdesigner", "Responsiva e-postmallar", "Dynamiskt innehåll baserat på mottagarprofil", "Förhandsvisning och testskick", "Leveransbarhet och SPF/DKIM-konfiguration"] },
    { area: "E-postanalys", items: ["Öppningsgrad, klickfrekvens och avregistreringar", "Heatmaps för klickpositioner", "Jämförelse mellan kampanjer"] },
  ],
  events_mgmt: [
    { area: "Eventhantering", items: ["Skapa och hantera fysiska och digitala events", "Registreringsformulär och deltagarhantering", "Webinarintegration (Teams, Zoom)", "Automatiska påminnelser och uppföljningar", "Check-in och närvarorapportering"] },
  ],
  forms_pages: [
    { area: "Formulär", items: ["Drag-and-drop-formulärdesigner", "Progressiva formulär (smart profiling)", "Fältvalidering och obligatoriska fält", "Dubbel opt-in-stöd", "Inbäddning på extern webbplats"] },
    { area: "Landningssidor", items: ["Mallbaserad sidbyggare", "Personaliserat innehåll", "SEO-grundinställningar", "Konverteringsspårning"] },
  ],
  lead_scoring: [
    { area: "Lead Scoring", items: ["Poängmodeller baserade på demografi och beteende", "Automatisk kvalificering vid tröskelvärde", "Överlämning till säljteam (Sales-integration)", "Flera scoringmodeller för olika produkter/segment"] },
  ],
  consent: [
    { area: "Samtyckeshantering", items: ["Samtyckeregistrering per kanal och syfte", "Preference center för mottagare", "Automatisk efterlevnad av GDPR och e-privacy", "Rätt att bli glömd och dataexport", "Audit trail för samtyckesändringar"] },
  ],
  analytics: [
    { area: "Kampanjanalys", items: ["Dashboards för kampanjprestanda", "ROI-beräkning per kampanj och kanal", "Attribution-modeller (first touch, last touch, multi-touch)", "Power BI-integration för avancerad analys"] },
    { area: "Kundinsikter", items: ["Engagemang-score per kontakt", "Kanalpreferens-analys", "Churn-riskbedömning"] },
  ],
  personalization: [
    { area: "Personalisering", items: ["Dynamiskt innehåll i e-post och på webben", "Produktrekommendationer baserade på beteende", "AI-optimerad sändningstid", "Copilot-assisterad innehållsgenerering"] },
  ],
  integration: [
    { area: "Systemintegrationer", items: ["CRM-integration (Dynamics 365 Sales)", "E-handelsplattform", "Sociala medier (LinkedIn, Facebook)", "Webbanalys (Google Analytics)", "Annonsplattformar (Google Ads, LinkedIn Ads)"] },
    { area: "Teknisk plattform", items: ["Dataverse och Power Platform", "API:er och webbtjänster", "Datamigrering från befintligt marknadsföringsverktyg", "Single Sign-On (SSO / Entra ID)"] },
  ],
};

function getSystemPrompt(product: string) {
  if (product === "marketing") {
    return `Du är en expert på Microsoft Dynamics 365 Customer Insights (Marketing) med djup kunskap om marknadsautomation, kundresor, leadgenerering och kampanjhantering.

Din uppgift är att berika en kravspecifikation med branschspecifika marknadsföringskrav, KPI:er och rekommendationer.

VIKTIGA REGLER:
- Svara ALLTID på svenska
- Var specifik och praktisk - undvik generella floskler
- Fokusera på branschspecifika MARKNADSFÖRINGSBEHOV som INTE finns i standardmallen
- Ge konkreta marknadsförings-KPI:er relevanta för branschen (t.ex. konverteringsgrad, CPL, MQL-till-SQL)
- Nämn relevanta regulatoriska krav (t.ex. GDPR, e-privacy, branschspecifika marknadsföringsregler)
- Begränsa svaret till max 8 branschspecifika krav med 3-5 underpunkter vardera
- Returnera ALLTID som JSON med exakt denna struktur`;
  }

  if (product === "sales") {
    return `Du är en expert på Microsoft Dynamics 365 Sales (CRM) med djup kunskap om säljprocesser, pipeline-hantering och kundrelationer.

Din uppgift är att berika en kravspecifikation med branschspecifika CRM-krav, sälj-KPI:er och rekommendationer.

VIKTIGA REGLER:
- Svara ALLTID på svenska
- Var specifik och praktisk - undvik generella floskler
- Fokusera på branschspecifika SÄLJBEHOV som INTE finns i standardmallen
- Ge konkreta sälj-KPI:er relevanta för branschen (t.ex. konverteringsgrad, säljcykellängd)
- Nämn relevanta regulatoriska krav (t.ex. GDPR, branschspecifika regler)
- Begränsa svaret till max 8 branschspecifika krav med 3-5 underpunkter vardera
- Returnera ALLTID som JSON med exakt denna struktur`;
  }

  return `Du är en expert på Microsoft Dynamics 365 affärssystem med djup kunskap om Business Central och Finance & Supply Chain Management. 

Din uppgift är att berika en kravspecifikation med branschspecifika krav, KPI:er och rekommendationer.

VIKTIGA REGLER:
- Svara ALLTID på svenska
- Var specifik och praktisk - undvik generella floskler
- Fokusera på branschspecifika behov som INTE finns i standardmallen
- Ge konkreta KPI:er relevanta för branschen
- Nämn relevanta regulatoriska krav (t.ex. livsmedelsäkerhet, kemikaliehantering)
- Begränsa svaret till max 8 branschspecifika krav med 3-5 underpunkter vardera
- Returnera ALLTID som JSON med exakt denna struktur`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { product, industry, companySize, areas } = await req.json();

    if (!product || !industry) {
      return new Response(JSON.stringify({ error: "Product and industry are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get base requirements for selected areas
    const baseReqsMap: Record<string, Record<string, any>> = {
      bc: bcBaseRequirements,
      fsc: fscBaseRequirements,
      sales: salesBaseRequirements,
    };
    const baseReqs = baseReqsMap[product] || bcBaseRequirements;
    const selectedAreas = (areas || Object.keys(baseReqs)).filter((a: string) => a in baseReqs);
    const baseRequirements = selectedAreas.map((area: string) => ({
      category: area,
      sections: (baseReqs as Record<string, any>)[area] || [],
    }));

    const productNames: Record<string, string> = {
      bc: "Microsoft Dynamics 365 Business Central",
      fsc: "Microsoft Dynamics 365 Finance & Supply Chain Management",
      sales: "Microsoft Dynamics 365 Sales",
    };
    const userPrompt = `Generera branschspecifika tilläggskrav för en kravspecifikation.

Produkt: ${productNames[product] || product}
Bransch: ${industry}
Företagsstorlek: ${companySize || "Ej angiven"}
Valda funktionsområden: ${selectedAreas.join(", ")}

Returnera JSON med denna exakta struktur:
{
  "industryRequirements": [
    {
      "area": "Branschspecifikt kravområde",
      "items": ["Krav 1", "Krav 2", "Krav 3"],
      "priority": "must|should|could",
      "rationale": "Kort motivering varför detta är viktigt för branschen"
    }
  ],
  "kpis": [
    {
      "name": "KPI-namn",
      "target": "Målvärde",
      "description": "Beskrivning"
    }
  ],
  "regulatoryNotes": ["Regulatoriskt krav 1", "Regulatoriskt krav 2"],
  "integrationSuggestions": ["Branschspecifik integration 1", "Integration 2"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: getSystemPrompt(product) },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_industry_requirements",
              description: "Generate industry-specific requirements for the specification",
              parameters: {
                type: "object",
                properties: {
                  industryRequirements: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        area: { type: "string" },
                        items: { type: "array", items: { type: "string" } },
                        priority: { type: "string", enum: ["must", "should", "could"] },
                        rationale: { type: "string" },
                      },
                      required: ["area", "items", "priority", "rationale"],
                      additionalProperties: false,
                    },
                  },
                  kpis: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        target: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["name", "target", "description"],
                      additionalProperties: false,
                    },
                  },
                  regulatoryNotes: { type: "array", items: { type: "string" } },
                  integrationSuggestions: { type: "array", items: { type: "string" } },
                },
                required: ["industryRequirements", "kpis", "regulatoryNotes", "integrationSuggestions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_industry_requirements" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "AI-tjänsten är tillfälligt överbelastad. Försök igen om en stund." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI-krediter slut. Kontakta administratören." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const aiResult = await response.json();
    
    // Extract structured output from tool call
    let aiEnrichment = {
      industryRequirements: [],
      kpis: [],
      regulatoryNotes: [],
      integrationSuggestions: [],
    };

    try {
      const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        aiEnrichment = typeof toolCall.function.arguments === "string"
          ? JSON.parse(toolCall.function.arguments)
          : toolCall.function.arguments;
      }
    } catch (e) {
      console.error("Error parsing AI response:", e);
    }

    return new Response(
      JSON.stringify({
        product,
        industry,
        companySize,
        baseRequirements,
        aiEnrichment,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("generate-requirements error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
