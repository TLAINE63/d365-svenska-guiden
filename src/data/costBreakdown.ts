// Köparvänlig kostnadsdel per Dynamics 365-produkt.
// Innehåll: prismodell (abonnemang + implementation), implementations­intervall
// (S/M/L), vanliga kostnadsdrivare och löpande kostnader efter go-live.
//
// Intervallen är typiska partner­offerter på den svenska marknaden för
// genomsnittliga införanden. Komplexa branscher, många integrationer eller
// dålig datakvalitet kan flytta projekt över det övre spannet – och tvärtom.

export type CostRange = {
  /** S, M eller L. */
  size: "S" | "M" | "L";
  /** Etikett ovanför kortet, t.ex. "Liten – 5–25 användare". */
  label: string;
  /** Vad som typiskt ingår i denna storlek. */
  scope: string;
  /** Intervall för engångskostnad i SEK (exkl. moms), t.ex. "400 000 – 900 000 kr". */
  oneTime: string;
  /** Typisk projektlängd i veckor. */
  weeks: string;
};

export type CostProjectExample = {
  /** Rubrik, t.ex. "Mindre standardimplementation". */
  title: string;
  /** Kort beskrivning av typfallet. */
  scope: string;
  /** Prisintervall i SEK, t.ex. "150 000 – 400 000 kr". */
  range: string;
  /** Punktlista med typiska förutsättningar. */
  bullets: string[];
};

export type CostBreakdownContent = {
  /** Intro som förklarar prismodellen för just den här produkten. */
  pricingModel: string;
  /** Implementations­intervall (S/M/L). */
  ranges: CostRange[];
  /** Vanliga kostnadsdrivare – checklista. */
  drivers: string[];
  /** Löpande kostnader efter go-live (förvaltning, vidareutveckling, AI-tillägg etc). */
  ongoing: string[];
  /** Valfri fotnot under sektionen. */
  note?: string;
  /** Valfria typexempel på faktiska projekt (visas på /kostnad/). */
  examples?: CostProjectExample[];
};


const SHARED_NOTE =
  "Intervallen är typiska partnerprojekt på svenska marknaden. Komplex bransch, många integrationer eller dålig datakvalitet flyttar projekt över det övre spannet – och tvärtom. Be alltid om en fast­prisad upptäcktsfas innan ni signerar hela projektet.";

export const costBreakdowns: Record<string, CostBreakdownContent> = {
  "business-central": {
    pricingModel:
      "Total­kostnaden består av tre delar: (1) månadslicens per användare (Essentials ~765 kr eller Premium ~1 050 kr), (2) en engångs­kostnad för implementationen hos partnern och (3) löpande förvaltning efter go-live. Räkna med att implementationen första året typiskt är 3–10x årslicensen.",
    ranges: [
      {
        size: "S",
        label: "Liten – 5–25 användare",
        scope: "Standard ekonomi + inköp/försäljning, 1–2 integrationer, mall-baserad migrering.",
        oneTime: "100 000 – 250 000 kr",
        weeks: "8–14 veckor",
      },
      {
        size: "M",
        label: "Medel – 25–75 användare",
        scope: "Lager, produktion eller projekt, 3–5 integrationer, branschapp och Power BI.",
        oneTime: "250 000 – 1 250 000 kr",
        weeks: "14–24 veckor",
      },
      {
        size: "L",
        label: "Stor – 75–200 användare",
        scope: "Flera bolag/valutor, EDI, e-handel, avancerad lager/produktion, flera roll-outs.",
        oneTime: "1 250 000 – 6 000 000+ kr",
        weeks: "24–40 veckor",
      },
    ],
    drivers: [
      "Antal användare, bolag och valutor",
      "Datamigreringens omfång och kvalitet i artiklar/kunder/leverantörer",
      "Antal integrationer (lön, bank, EDI, e-handel, WMS, CRM)",
      "Behov av branschapp eller egna extensions",
      "Rapportering och Power BI-modeller",
      "Change management och utbildning",
    ],
    ongoing: [
      "Förvaltnings­avtal hos partnern: typiskt 15–25 % av implementations­kostnaden per år",
      "Hantering av BC:s två årliga release-vågor (uppgradering, test, ev. ompackning av extensions)",
      "Licens­justeringar vid nyanställning eller fler bolag",
      "Vidareutveckling: nya rapporter, automatiseringar, Copilot-funktioner",
    ],
    note: SHARED_NOTE,
    examples: [
      {
        title: "Mindre standardimplementationer",
        scope: "Standarduppsättning med begränsade anpassningar",
        range: "75 000 – 400 000 kr",
        bullets: [
          "2–4 månaders projekt",
          "Standardprocesser och funktionalitet",
          "Grundläggande utbildning",
          "Datamigration från enklare system",
          "Få eller inga integrationer",
          "5–20 användare",
        ],
      },
      {
        title: "Mer avancerade implementationer",
        scope: "Anpassad lösning med integrationer och komplexitet",
        range: "250 000 – 1 500 000+ kr",
        bullets: [
          "4–8 månaders projekt",
          "Anpassade processer och workflows",
          "Omfattande utbildning",
          "Komplex datamigration",
          "Flera systemintegrationer",
          "20–200 användare",
        ],
      },
    ],
  },

  "finance-scm": {
    pricingModel:
      "F&SCM är Microsofts tunga ERP – både licens­kostnad och implementations­kostnad ligger en bra bit över Business Central. Räkna med licens från ~2 000 kr/användare/månad (Finance eller Supply Chain) plus en engångs­kostnad där implementationen ofta är 2–5x årslicensen.",
    ranges: [
      {
        size: "S",
        label: "Liten – 50–150 användare",
        scope: "1 bolag, standard­processer, 3–5 integrationer, en geografi.",
        oneTime: "1 500 000 – 3 500 000 kr",
        weeks: "20–36 veckor",
      },
      {
        size: "M",
        label: "Medel – 150–500 användare",
        scope: "Flera bolag/länder, WMS eller produktion, 6–12 integrationer, master data-projekt.",
        oneTime: "3 500 000 – 10 000 000 kr",
        weeks: "9–18 månader",
      },
      {
        size: "L",
        label: "Stor – 500+ användare",
        scope: "Global koncern, flera roll-outs, MES/EDI/avancerad lager, omfattande change-program.",
        oneTime: "10 000 000 – 60 000 000+ kr",
        weeks: "18–36 månader",
      },
    ],
    drivers: [
      "Antal juridiska enheter, länder och valutor",
      "Master data-städning (artiklar, BOM, leverantörer, kunder)",
      "Integrationer mot WMS, MES, EDI, e-handel, lön, bank",
      "Branschanpassning (process, läkemedel, livsmedel, försvar)",
      "Antal roll-outs och hur de sekvenseras",
      "Test­arbete (UAT, regressionstester, cutover-rep)",
    ],
    ongoing: [
      "Application Management Services hos partner: typiskt 10–20 % av projekt­kostnaden per år",
      "Egen intern förvaltning (process­ägare, super­users, IT)",
      "Microsofts release-cykel: två stora uppdateringar/år som ska testas",
      "Tillägg över tid: Copilot, agenter, Customer Insights, Project Operations",
    ],
    note: SHARED_NOTE,
    examples: [
      {
        title: "Mindre standardimplementationer",
        scope: "Grundläggande uppsättning med standardfunktionalitet",
        range: "750 000 – 3 000 000 kr",
        bullets: [
          "6–9 månaders projekt",
          "Standardprocesser med mindre anpassningar",
          "Strukturerad utbildning",
          "Datamigration och validering",
          "Grundläggande integrationer",
          "50–200 användare",
        ],
      },
      {
        title: "Mer avancerade implementationer",
        scope: "Globala implementationer med hög komplexitet",
        range: "1 500 000 – 10 000 000+ kr",
        bullets: [
          "9–18+ månaders projekt",
          "Omfattande anpassningar och utveckling",
          "Global rollout och change management",
          "Komplex datamigration",
          "Många systemintegrationer",
          "200–2 000+ användare",
        ],
      },
    ],
  },


  "sales": {
    pricingModel:
      "CRM-kostnaden består av licens (Sales Professional ~620 kr, Enterprise ~1 000 kr eller Premium ~1 435 kr per användare/månad) plus en engångs­kostnad för implementationen. Sales­projekt är typiskt mindre och snabbare än ERP – men 'litet' betyder inte 'gratis'.",
    ranges: [
      {
        size: "S",
        label: "Liten – 10–30 säljare",
        scope: "Standard sales­process, 1–2 integrationer, mall-baserad migrering från befintligt CRM.",
        oneTime: "125 000 – 300 000 kr",
        weeks: "6–12 veckor",
      },
      {
        size: "M",
        label: "Medel – 30–100 säljare",
        scope: "Flera affärs­områden, ERP-integration, säljkår med distrikt och produkt­grupper.",
        oneTime: "300 000 – 750 000 kr",
        weeks: "12–22 veckor",
      },
      {
        size: "L",
        label: "Stor – 100+ säljare",
        scope: "Global säljkår, Copilot for Sales, Sales Premium med samtals­intelligens, omfattande integration.",
        oneTime: "750 000 – 4 000 000+ kr",
        weeks: "20–32 veckor",
      },
    ],
    drivers: [
      "Antal säljare, distrikt och affärs­områden",
      "Hur olika säljprocesserna ser ut mellan team",
      "Integrationer mot ERP, marketing automation och offert­verktyg",
      "Datamigrering från befintligt CRM (Salesforce, HubSpot, Pipedrive)",
      "Adoption: utbildning, coachning, ledningens engagemang",
      "Copilot- och AI-funktioner (samtals­intelligens, leads, sammanfattningar)",
    ],
    ongoing: [
      "Förvaltning hos partner: typiskt 15–20 % av projekt­kostnad per år",
      "Vidareutveckling när säljprocessen ändras (nya produkter, marknader, kanal­strategier)",
      "Power BI och rapport­paket för säljledning",
      "Licens­justering vid expansion eller neddragning",
    ],
    note: SHARED_NOTE,
  },

  "customer-service": {
    pricingModel:
      "Customer Service prissätts per agent och månad (Professional ~480 kr, Enterprise ~1 000 kr, Premium ~1 865 kr – de två sistnämnda har 40 % kampanj­rabatt under perioden okt 2025 – jun 2026). Implementationen är en engångs­kostnad där omnikanal, kunskapsbas och Copilot är de stora drivarna.",
    ranges: [
      {
        size: "S",
        label: "Liten – 5–20 agenter",
        scope: "Ärende­hantering, en kanal (e-post eller chatt), enkel kunskapsbas, enkla SLA:er.",
        oneTime: "125 000 – 300 000 kr",
        weeks: "6–12 veckor",
      },
      {
        size: "M",
        label: "Medel – 20–75 agenter",
        scope: "Omnikanal (e-post, chatt, telefoni), kunskapsbas, SLA, ERP-integration, första Copilot-användning.",
        oneTime: "300 000 – 900 000 kr",
        weeks: "12–22 veckor",
      },
      {
        size: "L",
        label: "Stor – 75+ agenter",
        scope: "Multi-brand, flera språk, integrerad röstkanal, IVR, agentassistent, kund­portal.",
        oneTime: "900 000 – 5 000 000+ kr",
        weeks: "20–36 veckor",
      },
    ],
    drivers: [
      "Antal agenter, team och varumärken",
      "Antal kanaler (e-post, chatt, sociala medier, röst)",
      "Kunskapsbasens storlek och kvalitet (avgör Copilot-värdet)",
      "Integrationer mot ERP, fält­service, fakturering och kund­portal",
      "SLA-modell och rapportering",
      "Telefoni: röst-add-on eller separat Contact Center",
    ],
    ongoing: [
      "Förvaltning hos partner: typiskt 15–20 % av projekt­kostnad per år",
      "Underhåll av kunskapsbasen – annars tappar Copilot och självbetjäning värde",
      "Justering av SLA, köer och kompetens­routning",
      "AI-tillägg (Copilot, agenter, sentiment, sammanfattningar)",
    ],
    note: SHARED_NOTE,
  },

  "contact-center": {
    pricingModel:
      "Contact Center är Microsofts AI-första molnplattform för kund­service med röst-, digital- och self-service-kanaler. Licens från ~908 kr (digital) eller ~1 050 kr (komplett) per agent/månad (40 % kampanj­rabatt okt 2025 – jun 2026). Implementationen är tyngre än ren ärende­hantering eftersom telefoni och AI-routning ska sättas upp.",
    ranges: [
      {
        size: "S",
        label: "Liten – 10–30 agenter",
        scope: "En kanal (röst eller digital), enkel IVR, standard­routning, en geografi.",
        oneTime: "250 000 – 600 000 kr",
        weeks: "10–16 veckor",
      },
      {
        size: "M",
        label: "Medel – 30–100 agenter",
        scope: "Omnikanal (röst + digital + self-service), AI-routning, kunskapsbas, ERP-integration.",
        oneTime: "600 000 – 1 500 000 kr",
        weeks: "16–28 veckor",
      },
      {
        size: "L",
        label: "Stor – 100+ agenter",
        scope: "Flera varumärken/länder, avancerad IVR, agent­assistans, WFM och kvalitetsuppföljning.",
        oneTime: "1 500 000 – 8 000 000+ kr",
        weeks: "24–40 veckor",
      },
    ],
    drivers: [
      "Telefoni­leverantör och hur SIP/numerik hanteras",
      "Antal kanaler och språk",
      "IVR-komplexitet och AI-routning",
      "Kunskapsbas och self-service-flöden",
      "Integrationer mot CRM, fakturering, identifiering (BankID), WFM",
      "Migrering från befintlig kontaktcenter­plattform",
    ],
    ongoing: [
      "Förvaltning + telefoni­minuter (separat från licens)",
      "Trafik­kostnader för röst och SMS",
      "AI-konsumtion (Copilot, agentassistans, sammanfattningar)",
      "Vidareutveckling av self-service och bot-flöden",
    ],
    note: SHARED_NOTE,
  },

  "field-service": {
    pricingModel:
      "Field Service prissätts per tekniker/månad (~1 000 kr, eller ~480 kr för contractor-licens). Implementationen drivs av hur många mobila tekniker, arbets­ordertyper och integrationer (ERP, IoT, inventarie) som ska sättas upp.",
    ranges: [
      {
        size: "S",
        label: "Liten – 10–30 tekniker",
        scope: "Standard arbets­order, schemaläggning, mobil­app, en integration mot ERP.",
        oneTime: "200 000 – 500 000 kr",
        weeks: "10–16 veckor",
      },
      {
        size: "M",
        label: "Medel – 30–100 tekniker",
        scope: "Resurs­optimerad schemaläggning, kontrakts­hantering, lager i bil, IoT-larm.",
        oneTime: "500 000 – 1 250 000 kr",
        weeks: "16–26 veckor",
      },
      {
        size: "L",
        label: "Stor – 100+ tekniker",
        scope: "Flera länder, sub­kontraktörer, avancerad SLA, Remote Assist, Copilot för fältarbete.",
        oneTime: "1 250 000 – 6 000 000+ kr",
        weeks: "24–36 veckor",
      },
    ],
    drivers: [
      "Antal tekniker och hur mobil­appen anpassas per yrkesroll",
      "Schemaläggnings­logik (manuell, semi-automatisk, fullt optimerad)",
      "Lager­hantering i bil/förråd",
      "Integrationer mot ERP, faktura, kund­portal, IoT/SCADA",
      "Kontrakts- och SLA-hantering",
      "Off-line-stöd och mobil hårdvara",
    ],
    ongoing: [
      "Förvaltning + uppdateringar av mobil­appen vid release-vågor",
      "Vidareutveckling av schemaläggnings­regler när verksamheten växer",
      "Integration mot nya IoT-källor eller ERP-uppgraderingar",
      "AI- och Copilot-funktioner för tekniker",
    ],
    note: SHARED_NOTE,
  },

  "commerce": {
    pricingModel:
      "Commerce är en av Microsofts mest omfattande Dynamics 365-applikationer – POS, e-handel, lojalitet och back-office i ett. Licens ~2 000 kr/användare/månad plus en e-handels­tilläggs­licens (~38 000 kr/månad) för nät­handeln. Implementationen är alltid ett större program.",
    ranges: [
      {
        size: "S",
        label: "Liten – 5–20 butiker / mindre e-handel",
        scope: "POS i butik, enkel e-handel, en marknad, standard­lojalitet.",
        oneTime: "750 000 – 1 750 000 kr",
        weeks: "16–28 veckor",
      },
      {
        size: "M",
        label: "Medel – 20–100 butiker / multikanal",
        scope: "POS + e-handel + clienteling, flera marknader, lojalitet, integration mot 3PL/WMS.",
        oneTime: "1 750 000 – 4 500 000 kr",
        weeks: "9–15 månader",
      },
      {
        size: "L",
        label: "Stor – 100+ butiker / global multibrand",
        scope: "Flera varumärken, länder, valutor, avancerad pris/promo, kund­data­plattform.",
        oneTime: "4 500 000 – 25 000 000+ kr",
        weeks: "15–30 månader",
      },
    ],
    drivers: [
      "Antal butiker, marknader och valutor",
      "Hårdvara i butik (POS-terminaler, scanners, scales, drawers)",
      "E-handels­plattformen och hur djupt den ska integreras",
      "Pris- och promo­logik (komplex prissättning är en stor kostnads­drivare)",
      "Integrationer mot WMS, 3PL, betalningar, kund­data, marketing",
      "Lokalisering: skatte­regler, kvitto, betalmetoder per marknad",
    ],
    ongoing: [
      "Application management av butiks­miljön (kritisk under handels­toppar)",
      "Hårdvaru­avtal och butiks­support",
      "Vidareutveckling av e-handel och kampanj­logik",
      "AI: Copilot för säljare i butik, demand forecasting, dynamic pricing",
    ],
    note: SHARED_NOTE,
  },

  "project-operations": {
    pricingModel:
      "Project Operations kostar ~1 290 kr per användare/månad i licens. Implementationen drivs av hur ni säljer och levererar projekt – fastprist, löpande räkning, abonnemang – och hur tätt det ska integreras mot ekonomi och resurs­planering.",
    ranges: [
      {
        size: "S",
        label: "Liten – 20–75 användare",
        scope: "Standard projekt­säljprocess, tidrapport, faktura­underlag, integration mot ekonomi.",
        oneTime: "200 000 – 450 000 kr",
        weeks: "10–16 veckor",
      },
      {
        size: "M",
        label: "Medel – 75–250 användare",
        scope: "Resurs­planering, kontrakts­hantering, intäkts­avräkning, integration mot ERP och HR.",
        oneTime: "450 000 – 1 100 000 kr",
        weeks: "16–28 veckor",
      },
      {
        size: "L",
        label: "Stor – 250+ användare",
        scope: "Global konsultorganisation, multivaluta, IFRS 15-intäkts­avräkning, flera affärs­modeller.",
        oneTime: "1 100 000 – 5 000 000+ kr",
        weeks: "24–36 veckor",
      },
    ],
    drivers: [
      "Antal användare och deras roller (säljare, leveransledare, konsulter)",
      "Affärsmodell: fastpris, T&M, abonnemang, mix",
      "Intäkts­avräknings­regler (IFRS 15, percent of completion)",
      "Integration mot ekonomi, tid, lön och HR",
      "Resurs­planerings­logik och kompetens­katalog",
      "Mobil tidrapport och utlägg",
    ],
    ongoing: [
      "Förvaltning + justering av affärs­regler när nya tjänster eller marknader läggs till",
      "Rapportering till ledning (utnyttjandegrad, marginal per projekt)",
      "Vidareutveckling av Copilot för projekt­ledare",
      "Licens­justering vid expansion",
    ],
    note: SHARED_NOTE,
  },

  "human-resources": {
    pricingModel:
      "Human Resources kostar ~1 290 kr per användare/månad i licens (självbetjänings­licens ~38 kr/användare/månad för medarbetare som bara ska se sin egen profil). Implementationen drivs av integrationer mot lön och kompetens­modellens komplexitet.",
    ranges: [
      {
        size: "S",
        label: "Liten – upp till 500 anställda",
        scope: "Personal­akt, frånvaro, semester, integration mot ett lönesystem.",
        oneTime: "150 000 – 350 000 kr",
        weeks: "8–14 veckor",
      },
      {
        size: "M",
        label: "Medel – 500–2 500 anställda",
        scope: "Rekrytering, onboarding, mål/lön, kompetens, integration mot lön och AD/Entra.",
        oneTime: "350 000 – 750 000 kr",
        weeks: "14–22 veckor",
      },
      {
        size: "L",
        label: "Stor – 2 500+ anställda",
        scope: "Flera länder, kollektiv­avtal, succession, lärande­plattform, integration mot flera lönesystem.",
        oneTime: "750 000 – 3 000 000+ kr",
        weeks: "22–36 veckor",
      },
    ],
    drivers: [
      "Antal anställda, länder och kollektiv­avtal",
      "Antal lönesystem som ska integreras",
      "Komplexitet i kompetens-, mål- och löne­modell",
      "Rekryterings- och onboarding­flöden",
      "Datamigrering från befintligt HRM",
      "Integration mot identitet (Entra) och lärande­plattformar",
    ],
    ongoing: [
      "Förvaltning + justeringar vid avtals­rörelser och lag­ändringar",
      "Underhåll av integrationer mot lön",
      "Vidareutveckling av självbetjäning och chefs­vy",
      "AI: Copilot för rekrytering, kompetens­matchning, sammanfattningar",
    ],
    note: SHARED_NOTE,
  },

  "marketing": {
    pricingModel:
      "Customer Insights – Journeys (det som tidigare hette Marketing) prissätts per tenant (~16 250 kr/månad obegränsade användare), eller som komplettering (~9 560 kr/månad) om ni redan har minst 10 Dynamics 365-licenser. Implementationen drivs av hur många resor, segment och integrationer ni vill ha.",
    ranges: [
      {
        size: "S",
        label: "Liten – 1–2 marknader, enkla utskick",
        scope: "Standard e-postutskick, enkla segment, integration mot CRM, enkel landnings­sida.",
        oneTime: "125 000 – 300 000 kr",
        weeks: "6–12 veckor",
      },
      {
        size: "M",
        label: "Medel – flera resor och kanaler",
        scope: "Triggade kund­resor, lead scoring, event­hantering, integration mot CMS och webb­analys.",
        oneTime: "300 000 – 600 000 kr",
        weeks: "10–18 veckor",
      },
      {
        size: "L",
        label: "Stor – multi-brand, multi-marknad",
        scope: "Avancerad personalisering, Customer Insights – Data, AI-segment, content­ops i stor skala.",
        oneTime: "600 000 – 3 000 000+ kr",
        weeks: "18–28 veckor",
      },
    ],
    drivers: [
      "Antal varumärken, marknader och språk",
      "Antal kund­resor och triggers",
      "Hur många datakällor som ska samlas i Customer Insights – Data",
      "Integrationer mot CMS, webb­analys, ad-plattformar, transaktionellt mail",
      "Compliance: GDPR, samtycken, preferens­center",
      "Content­produktion och mallar (lätt att underskatta)",
    ],
    ongoing: [
      "Förvaltning av kund­resor och segment när erbjudanden ändras",
      "Vidareutveckling av personalisering och AI-segment",
      "Förvaltning av integrationer mot CMS och ad-plattformar",
      "Copilot för innehållsförslag och resor",
    ],
    note: SHARED_NOTE,
  },

  "copilot": {
    pricingModel:
      "Copilot för Dynamics 365 består av två delar: (1) inkluderade funktioner i licensen (sammanfattningar, e-postförslag, sökningar) och (2) konsumtions­baserade agenter och egna Copilots som mäts i meddelanden/credits. Implementationen är typiskt mycket mindre än en ny applikation – men förvaltning och adoption är kritiska för att få värde.",
    ranges: [
      {
        size: "S",
        label: "Pilot – 10–50 användare, 1 use-case",
        scope: "Aktivera inkluderade Copilot-funktioner, en agent eller egen Copilot på avgränsat område.",
        oneTime: "50 000 – 150 000 kr",
        weeks: "4–8 veckor",
      },
      {
        size: "M",
        label: "Utrullning – flera team / use-cases",
        scope: "3–5 use-cases, kunskaps­källor strukturerade, mätning och guardrails på plats.",
        oneTime: "150 000 – 500 000 kr",
        weeks: "8–16 veckor",
      },
      {
        size: "L",
        label: "Enterprise – agenter i produktion",
        scope: "Egna agenter mot processer (service, sälj, ekonomi), integration mot fler system, governance och säkerhets­modell.",
        oneTime: "500 000 – 3 000 000+ kr",
        weeks: "12–28 veckor",
      },
    ],
    drivers: [
      "Antal use-cases och hur väl avgränsade de är",
      "Kvalitet och struktur på kunskaps­källor (SharePoint, kunskapsbas, dokument)",
      "Datasäkerhet: vem får se vad, hur sätts behörigheter",
      "Antal egna agenter och hur djupt de integreras",
      "Konsumtion: meddelanden/credits per agent och månad",
      "Förändrings­ledning och utbildning – annars används Copilot inte",
    ],
    ongoing: [
      "Konsumtion (meddelanden/credits) – kan svänga kraftigt med användning",
      "Förvaltning av prompts, kunskaps­källor och guardrails",
      "Uppföljning av kvalitet: hallucinationer, fel­svar, känsliga ämnen",
      "Vidareutveckling när Microsoft släpper nya funktioner och agent-mallar",
    ],
    note: SHARED_NOTE,
  },
};
