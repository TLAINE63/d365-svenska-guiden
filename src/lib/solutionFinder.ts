// Dynamisk flödeslogik för "Hitta rätt lösning" (/kom-igang/).
// Sprint 2: börja brett (område + situation), förgrena efter svar och
// återanvänd befintlig logik (recommendProducts, matchningstester, analyser).
// Manuellt underhållna regler – ingen AI vid körning.

import { NEED_OPTIONS, recommendProducts, type RecommendationResult, type SituationKey, type StructureKey } from "@/lib/productRecommendation";

export type AreaKey = "sales" | "marketing" | "service" | "erp" | "unsure";
export type StageKey = "understand" | "compare" | "decided" | "know_product" | "existing";

export interface FinderAnswers {
  area?: AreaKey;
  stage?: StageKey;
  /** Satt när köparen redan vet vilken produkt de vill utvärdera. */
  knownProduct?: string;
  /** Befintlig Dynamics-kund: vad de vill utveckla (multi). */
  existingFocus?: string[];
  /** Områdesspecifika behov (multi). För area "unsure" återanvänds NeedKey-värden. */
  focus?: string[];
  /** Kännedom om vald produkt: vad de behöver tänka på (multi). */
  productFocus?: string[];
  ai?: "yes" | "explore" | "no";
  industry?: string;
  size?: string;
  structure?: StructureKey;
}

export interface AreaOption { value: AreaKey; label: string; desc: string }
export const AREA_OPTIONS: AreaOption[] = [
  { value: "sales", label: "Försäljning", desc: "Pipeline, offerter och kundbearbetning" },
  { value: "marketing", label: "Marknad & kunddata", desc: "Kampanjer, segmentering och kundresor" },
  { value: "service", label: "Kundservice & fältservice", desc: "Ärenden, kanaler och tekniker ute hos kund" },
  { value: "erp", label: "ERP & affärssystem", desc: "Ekonomi, order, lager och produktion" },
  { value: "unsure", label: "Osäker / flera områden", desc: "Vi hjälper er ringa in rätt område" },
];

export interface StageOption { value: StageKey; label: string }
export const STAGE_OPTIONS: StageOption[] = [
  { value: "understand", label: "Vi försöker förstå vad vi behöver" },
  { value: "compare", label: "Vi jämför olika lösningar" },
  { value: "decided", label: "Vi har bestämt oss för Dynamics\u00A0365 men inte exakt produkt" },
  { value: "know_product", label: "Vi vet redan vilken Dynamics\u00A0365-produkt vi behöver" },
  { value: "existing", label: "Vi använder redan Dynamics\u00A0365 och vill utveckla eller komplettera lösningen" },
];

export const EXISTING_FOCUS_OPTIONS: { value: string; label: string }[] = [
  { value: "ai", label: "AI, Copilot och agenter" },
  { value: "apps", label: "Fler Dynamics\u00A0365-funktioner/applikationer" },
  { value: "integrations", label: "Integrationer" },
  { value: "process", label: "Effektivare processer" },
  { value: "partner", label: "Partnerbyte eller kompletterande partner" },
  { value: "specialist", label: "Specialistkompetens" },
  { value: "other", label: "Annat" },
];

/** Produkter som kan väljas direkt av den som redan vet vad de behöver. */
export const KNOWN_PRODUCTS: { value: string; label: string }[] = [
  { value: "Business Central", label: "Business Central" },
  { value: "Finance & SCM", label: "Finance & Supply Chain Management" },
  { value: "Sales", label: "Sales" },
  { value: "Customer Insights (Marketing)", label: "Customer Insights" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "Contact Center", label: "Contact Center" },
  { value: "Field Service", label: "Field Service" },
  { value: "Project Operations", label: "Project Operations" },
  { value: "Commerce", label: "Commerce" },
  { value: "Human Resources", label: "Human Resources" },
];

export interface FocusQuestion { id: string; text: string; options: { value: string; label: string }[] }

/** Områdesspecifika behovsfrågor (multi). Affärsbehov före produktnamn. */
export const FOCUS_QUESTIONS: Record<AreaKey, FocusQuestion> = {
  sales: {
    id: "focus_sales",
    text: "Vad vill ni förbättra i säljarbetet?",
    options: [
      { value: "pipeline", label: "Överblick över pipeline och prognoser" },
      { value: "leads", label: "Hantering av leads och affärsmöjligheter" },
      { value: "quotes", label: "Snabbare offerter och avtal" },
      { value: "kam", label: "Key account-arbete och kundrelationer" },
      { value: "reporting", label: "Rapportering och uppföljning" },
      { value: "erp_integration", label: "Koppling till affärssystemet" },
      { value: "marketing_link", label: "Nära samarbete med marknad" },
    ],
  },
  marketing: {
    id: "focus_marketing",
    text: "Vad vill ni förbättra inom marknad och kunddata?",
    options: [
      { value: "customer_data", label: "Samla kunddata på ett ställe" },
      { value: "segmentation", label: "Målgrupper och segmentering" },
      { value: "leadgen", label: "Lead generation" },
      { value: "journeys", label: "Automatiserade kundresor" },
      { value: "nurturing", label: "Lead nurturing och personalisering" },
      { value: "alignment", label: "Samverkan mellan marknad och sälj" },
    ],
  },
  service: {
    id: "focus_service",
    text: "Vad vill ni främst förbättra?",
    options: [
      { value: "cases", label: "Ärendehantering och kundservice" },
      { value: "contactcenter", label: "Contact Center och kundkommunikation via flera kanaler" },
      { value: "field", label: "Service eller tekniker ute hos kund" },
      { value: "selfservice", label: "Self-service och kundportal" },
      { value: "several", label: "Flera av ovanstående" },
      { value: "unsure", label: "Osäker" },
    ],
  },
  erp: {
    id: "focus_erp",
    text: "Vilka delar av affärssystemet är viktigast att förbättra?",
    options: [
      { value: "finance", label: "Fakturering och redovisning" },
      { value: "order", label: "Order, lager, inköp" },
      { value: "production", label: "Tillverkning och produktionsplanering" },
      { value: "projects", label: "Projekt, tidrapportering och timdebitering" },
      { value: "reporting", label: "Rapportering och beslutsunderlag" },
      { value: "integrations", label: "Integrationer mot andra system" },
      { value: "hr", label: "Personal och HR-processer" },
    ],
  },
  unsure: {
    id: "focus_unsure",
    text: "Vilka behov och områden vill ni förbättra?",
    options: NEED_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
  },
};

/** Frågor för den som redan valt produkt – syftet blir "vad behöver ni tänka på?". */
export const PRODUCT_FOCUS_QUESTIONS: Record<string, FocusQuestion> = {
  "Business Central": {
    id: "pf_bc", text: "Vad behöver ni tänka på kring Business Central?",
    options: [
      { value: "users", label: "Antal användare och roller" },
      { value: "entities", label: "Flera bolag eller länder" },
      { value: "processes", label: "Ekonomi, order, lager och eventuell produktion" },
      { value: "integrations", label: "Integrationer (e-handel, EDI, bank)" },
      { value: "addons", label: "Branschspecifika tillägg (ISV)" },
      { value: "ai", label: "AI och Copilot i det dagliga arbetet" },
    ],
  },
  "Finance & SCM": {
    id: "pf_fscm", text: "Vad behöver ni tänka på kring Finance & Supply Chain Management?",
    options: [
      { value: "users", label: "Antal användare och roller" },
      { value: "entities", label: "Flera bolag, länder och valutor" },
      { value: "planning", label: "Avancerad planering och lagerstyrning" },
      { value: "production", label: "Produktion och recept-/strukturhantering" },
      { value: "integrations", label: "Integrationer och datalandskap" },
      { value: "ai", label: "AI och Copilot i det dagliga arbetet" },
    ],
  },
  Sales: {
    id: "pf_sales", text: "Vad behöver ni tänka på kring Sales?",
    options: [
      { value: "sellers", label: "Antal säljare och teamstruktur" },
      { value: "process", label: "Säljprocess och pipeline-steg" },
      { value: "quotes", label: "Offerter och prislistor" },
      { value: "outlook", label: "Integration med Outlook och Teams" },
      { value: "erp", label: "Koppling till affärssystemet" },
      { value: "ai", label: "Copilot och AI i säljarbetet" },
    ],
  },
  "Customer Insights (Marketing)": {
    id: "pf_ci", text: "Vad behöver ni tänka på kring Customer Insights?",
    options: [
      { value: "sources", label: "Kunddata från flera källor" },
      { value: "volumes", label: "Utskicksvolymer och kanaler" },
      { value: "journeys", label: "Komplexa kundresor" },
      { value: "consent", label: "Samtycke och GDPR" },
      { value: "sales_link", label: "Överlämning av leads till försäljning" },
    ],
  },
  "Customer Service": {
    id: "pf_cs", text: "Vad behöver ni tänka på kring Customer Service?",
    options: [
      { value: "volume", label: "Ärendevolym och kanaler" },
      { value: "sla", label: "SLA och tjänstenivåer" },
      { value: "knowledge", label: "Kunskapsbas och self-service" },
      { value: "ai", label: "Copilot och AI-agenter" },
      { value: "erp", label: "Integration mot order och fakturering" },
    ],
  },
  "Contact Center": {
    id: "pf_cc", text: "Vad behöver ni tänka på kring Contact Center?",
    options: [
      { value: "channels", label: "Röst, chatt och fler kanaler" },
      { value: "routing", label: "Köer och routing" },
      { value: "ai", label: "AI-agenter och självbetjäning" },
      { value: "sla", label: "Tjänstenivåer och öppettider" },
    ],
  },
  "Field Service": {
    id: "pf_fs", text: "Vad behöver ni tänka på kring Field Service?",
    options: [
      { value: "techs", label: "Antal tekniker och arbetsorder" },
      { value: "planning", label: "Schemaläggning och ruttoptimering" },
      { value: "mobile", label: "Mobilapp och offline-arbete" },
      { value: "parts", label: "Reservdelar och servicebilar" },
      { value: "iot", label: "IoT och prediktivt underhåll" },
    ],
  },
  "Project Operations": {
    id: "pf_po", text: "Vad behöver ni tänka på kring Project Operations?",
    options: [
      { value: "resources", label: "Resursplanering och beläggning" },
      { value: "time", label: "Tidrapportering och debitering" },
      { value: "profit", label: "Lönsamhet per projekt" },
      { value: "sales_link", label: "Koppling mellan försäljning och leverans" },
    ],
  },
  Commerce: {
    id: "pf_com", text: "Vad behöver ni tänka på kring Commerce?",
    options: [
      { value: "channels", label: "Butik, e-handel och omnichannel" },
      { value: "pos", label: "Kassa och butiksflöden" },
      { value: "b2b", label: "B2B-handel och kundportal" },
    ],
  },
  "Human Resources": {
    id: "pf_hr", text: "Vad behöver ni tänka på kring Human Resources?",
    options: [
      { value: "employees", label: "Antal medarbetare och länder" },
      { value: "payroll", label: "Koppling till lönesystem" },
      { value: "selfservice", label: "Självservice för chefer och medarbetare" },
    ],
  },
};

export const AI_QUESTION: FocusQuestion = {
  id: "ai_interest",
  text: "Är AI, Copilot eller agenter något ni vill utforska i lösningen?",
  options: [
    { value: "yes", label: "Ja, det är ett tydligt behov" },
    { value: "explore", label: "Nyfikna, vill förstå mer" },
    { value: "no", label: "Nej, inte just nu" },
  ],
};

export interface SolutionRec { app: string; label: string; reason: string }
export interface SolutionResult {
  areaLabel: string;
  primary?: SolutionRec;
  complements: SolutionRec[];
  /** Möjliga kompletterande områden – presenteras som att undersöka, inte som säkra rekommendationer. */
  exploreAreas: { label: string; path: string; reason: string }[];
  needsIdentified: string[];
  questionsToAsk: string[];
  nextSteps: { label: string; path: string }[];
  /** True när underlaget inte räcker för att rekommendera en produkt. */
  insufficient: boolean;
  knownProduct?: string;
  existingCustomer?: boolean;
}

const AREA_LABEL: Record<AreaKey, string> = {
  sales: "Försäljning",
  marketing: "Marknad & kunddata",
  service: "Kundservice & fältservice",
  erp: "ERP & affärssystem",
  unsure: "Flera områden",
};

const PRODUCT_PAGE: Record<string, string> = {
  "Business Central": "/business-central/",
  "Finance & SCM": "/finance-supply-chain-management/",
  Sales: "/d365sales/",
  "Customer Insights (Marketing)": "/d365marketing/",
  "Customer Service": "/d365customerservice/",
  "Contact Center": "/d365contactcenter/",
  "Field Service": "/d365fieldservice/",
  "Project Operations": "/d365projectoperations/",
  Commerce: "/d365commerce/",
  "Human Resources": "/d365humanresources/",
};

const MATCHNINGSTEST: Record<string, string> = {
  "Business Central": "/businesscentral/matchningstest/",
  "Finance & SCM": "/finance-supply-chain-management/matchningstest/",
  Sales: "/d365sales/matchningstest/",
  "Customer Insights (Marketing)": "/d365marketing/matchningstest/",
  "Customer Service": "/d365customerservice/matchningstest/",
  "Contact Center": "/d365contactcenter/matchningstest/",
  "Field Service": "/d365fieldservice/matchningstest/",
};

const QUESTIONS_BY_AREA: Record<AreaKey, string[]> = {
  sales: [
    "Hur hanterar systemet er säljprocess och era pipeline-steg?",
    "Hur integrerar det med Outlook, Teams och ert affärssystem?",
    "Vad kostar licenser och implementation för ert antal användare?",
  ],
  marketing: [
    "Hur enas kunddata från era olika källor?",
    "Hur hanteras samtycke och GDPR över kanaler?",
    "Hur fungerar överlämningen av kvalificerade leads till sälj?",
  ],
  service: [
    "Hur hanteras era kanaler och ärendevolymer i praktiken?",
    "Hur fungerar schemaläggning och mobilapp för tekniker?",
    "Vilka AI-funktioner finns för agenter och självbetjäning?",
  ],
  erp: [
    "Hur hanterar systemet era viktigaste processer?",
    "Hur många användare och bolag täcker licensmodellen?",
    "Vilka branschtillägg krävs, och vad kostar de?",
  ],
  unsure: [
    "Vilket område skulle ge störst effekt att börja med?",
    "Hur hänger era behov ihop mellan sälj, service och ekonomi?",
    "Vad kostar en lagom stor första satsning?",
  ],
};

const stageToSituation = (stage?: StageKey): SituationKey =>
  stage === "compare" ? "replace" : stage === "decided" ? "first" : stage === "existing" ? "extend" : "unsure";

/** Bygger resultatet utifrån svaren. Tvingar aldrig fram en rekommendation utan stöd. */
export function buildSolutionResult(a: FinderAnswers): SolutionResult {
  const area: AreaKey = a.area ?? "unsure";
  const focus = a.focus ?? [];
  const needsIdentified = focusLabels(area, focus, a);
  const questionsToAsk = QUESTIONS_BY_AREA[area];
  const exploreAreas: SolutionResult["exploreAreas"] = [];

  // Kompletterande områden identifieras dynamiskt – bara vid stöd i svaren.
  if (focus.includes("projects")) {
    exploreAreas.push({
      label: "Project Operations",
      path: "/d365projectoperations/",
      reason: "Era svar visar projektorienterad verksamhet med tidrapportering och debitering.",
    });
  }
  if (focus.includes("hr")) {
    exploreAreas.push({
      label: "Human Resources",
      path: "/d365humanresources/",
      reason: "Ni har lyft HR-processer som ett behov att undersöka vidare.",
    });
  }
  if (area === "erp" && a.industry === "Retail & E-handel") {
    exploreAreas.push({
      label: "Commerce",
      path: "/d365commerce/",
      reason: "Retail- och handelsbehov kan motivera att även titta på omnichannel-handel.",
    });
  }

  // Befintlig Dynamics-kund som vill utveckla lösningen
  if (a.stage === "existing" && !(a.existingFocus ?? []).includes("apps")) {
    const nextSteps: SolutionResult["nextSteps"] = [];
    const f = a.existingFocus ?? [];
    if (f.includes("ai")) nextSteps.push({ label: "Testa er AI-mognad (AI Readiness)", path: "/ai-readiness/" });
    if (f.includes("integrations") || f.includes("process") || f.includes("other")) nextSteps.push({ label: "Se vägar för befintliga Dynamics-kunder", path: "/befintlig-kund/" });
    if (f.includes("partner")) nextSteps.push({ label: "Hitta och jämför partners", path: "/valjdynamics365partner/" });
    if (f.includes("specialist")) nextSteps.push({ label: "Hitta specialistkompetens", path: "/kompetens/" });
    if (nextSteps.length === 0) nextSteps.push({ label: "Se vägar för befintliga Dynamics-kunder", path: "/befintlig-kund/" });
    return {
      areaLabel: AREA_LABEL[area],
      complements: [],
      exploreAreas,
      needsIdentified,
      questionsToAsk,
      nextSteps,
      insufficient: true,
      existingCustomer: true,
    };
  }

  // Köparen vet redan produkten – analysera vad de behöver tänka på, inte rekommendera samma produkt.
  if (a.knownProduct) {
    const test = MATCHNINGSTEST[a.knownProduct];
    const nextSteps: SolutionResult["nextSteps"] = [];
    if (test) nextSteps.push({ label: `Gör matchningstestet för ${a.knownProduct}`, path: test });
    nextSteps.push({ label: `Läs mer om ${a.knownProduct}`, path: PRODUCT_PAGE[a.knownProduct] ?? "/kom-igang/" });
    return {
      areaLabel: AREA_LABEL[area],
      primary: {
        app: a.knownProduct,
        label: a.knownProduct,
        reason: "Ni har redan valt produkt. Här följer det ni bör tänka på inför implementation och partnerdialog.",
      },
      complements: [],
      exploreAreas,
      needsIdentified: productFocusLabels(a.knownProduct, a.productFocus ?? []),
      questionsToAsk,
      nextSteps,
      insufficient: false,
      knownProduct: a.knownProduct,
    };
  }

  // Behovsdriven rekommendation per område
  let primary: SolutionRec | undefined;
  let complements: SolutionRec[] = [];
  let insufficient = false;

  if (area === "sales") {
    primary = { app: "Sales", label: "Sales", reason: "Era behov kring pipeline, offerter och kundbearbetning pekar på Dynamics\u00A0365 Sales." };
    if (focus.includes("marketing_link")) {
      complements.push({ app: "Customer Insights (Marketing)", label: "Customer Insights", reason: "Nära samarbete med marknad gör Customer Insights relevant som komplement." });
    }
  } else if (area === "marketing") {
    primary = { app: "Customer Insights (Marketing)", label: "Customer Insights", reason: "Behoven kring kunddata, segmentering och kundresor pekar på Dynamics\u00A0365 Customer Insights." };
    if (focus.includes("alignment")) {
      complements.push({ app: "Sales", label: "Sales", reason: "Samverkan mellan marknad och sälj gör Sales relevant att undersöka parallellt." });
    }
  } else if (area === "service") {
    if (focus.includes("several")) {
      primary = { app: "Customer Service", label: "Customer Service", reason: "Ärendehanteringen är kärnan; flera av era behov täcks av Customer Service." };
      complements.push(
        { app: "Contact Center", label: "Contact Center", reason: "Kundkommunikation via flera kanaler kan motivera Contact Center." },
        { app: "Field Service", label: "Field Service", reason: "Tekniker ute hos kund pekar på Field Service som komplement." },
      );
    } else if (focus.includes("field")) {
      primary = { app: "Field Service", label: "Field Service", reason: "Service och tekniker ute hos kund är Field Services kärnområde." };
      complements.push({ app: "Customer Service", label: "Customer Service", reason: "Ärendehanteringen runt fältarbetet hanteras ofta i Customer Service." });
    } else if (focus.includes("contactcenter")) {
      primary = { app: "Contact Center", label: "Contact Center", reason: "Kundkommunikation via flera kanaler pekar på Contact Center." };
      complements.push({ app: "Customer Service", label: "Customer Service", reason: "Ärendehanteringen bakom kanalerna bygger ofta på Customer Service." });
    } else if (focus.includes("cases") || focus.includes("selfservice")) {
      primary = { app: "Customer Service", label: "Customer Service", reason: "Ärendehantering, kunskapsbas och self-service är Customer Services kärnområde." };
    } else {
      insufficient = true;
    }
  } else {
    // erp + unsure: återanvänd den regelbaserade motorn
    const needs = area === "erp"
      ? focus.filter((f) => ["finance", "order", "production", "projects"].includes(f))
      : focus;
    if (needs.length === 0 || (needs.length === 1 && needs[0] === "unsure")) {
      insufficient = true;
    } else {
      const rec: RecommendationResult = recommendProducts({
        needs,
        size: a.size ?? null,
        structure: a.structure ?? null,
        situation: stageToSituation(a.stage),
      });
      primary = rec.primary;
      complements = rec.complements;
    }
  }

  const nextSteps: SolutionResult["nextSteps"] = [];
  if (primary && MATCHNINGSTEST[primary.app]) {
    nextSteps.push({ label: `Gör matchningstestet för ${primary.label}`, path: MATCHNINGSTEST[primary.app] });
  }
  if (area === "erp" || area === "unsure") nextSteps.push({ label: "Fördjupa med ERP-behovsanalysen", path: "/ERPbehovsanalys/" });
  if (area === "sales" || area === "marketing") nextSteps.push({ label: "Fördjupa med behovsanalysen för försäljning & marknad", path: "/CRMbehovsanalys/" });
  if (area === "service") nextSteps.push({ label: "Fördjupa med kundservice-behovsanalysen", path: "/kundservice-behovsanalys/" });
  if (a.ai === "yes" || a.ai === "explore") nextSteps.push({ label: "Utforska AI och Copilot vidare", path: "/ai-readiness/" });

  return {
    areaLabel: AREA_LABEL[area],
    primary,
    complements,
    exploreAreas,
    needsIdentified,
    questionsToAsk,
    nextSteps,
    insufficient,
  };
}

function focusLabels(area: AreaKey, focus: string[], a: FinderAnswers): string[] {
  const q = FOCUS_QUESTIONS[area];
  return focus.map((f) => q.options.find((o) => o.value === f)?.label ?? f);
}

function productFocusLabels(product: string, focus: string[]): string[] {
  const q = PRODUCT_FOCUS_QUESTIONS[product];
  if (!q) return focus;
  return focus.map((f) => q.options.find((o) => o.value === f)?.label ?? f);
}
