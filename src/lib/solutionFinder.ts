// Dynamisk flödeslogik för "Hitta rätt lösning" (/kom-igang/).
// Behovsguiden är en snabb triage (5–7 frågor): område → skede → enkel
// omfattning → viktigaste behov → AI → förändring → resultat.
// De fördjupade behovsanalyserna står för djupanalysen; guiden vägleder vidare.
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
  /** Enkel omfattning per område: sellers | marketing_scope | service_character | users/entities/countries (erp). */
  scope?: Record<string, string>;
  /** Områdesspecifika behov (multi). För area "unsure" återanvänds NeedKey-värden. */
  focus?: string[];
  /** Kännedom om vald produkt: vad de behöver tänka på (multi). */
  productFocus?: string[];
  /** Extra följdfråga vid projektorienterad verksamhet. */
  projectCentrality?: string;
  /** AI/automation – områdesanpassat värde, "explore" eller "no". */
  ai?: string;
  /** Införande och arbetssätt: limited | some | common | significant | unsure */
  change?: string;
  industry?: string;
  /** Härledd storleksgrupp (för partnermatchning), sätts från omfattningssvaren. */
  size?: string;
  structure?: StructureKey;
}

export interface AreaOption { value: AreaKey; label: string; desc: string }
export const AREA_OPTIONS: AreaOption[] = [
  { value: "sales", label: "Försäljning", desc: "Pipeline, offerter och kundbearbetning" },
  { value: "marketing", label: "Marknad & kunddata", desc: "Kampanjer, segmentering och kundresor" },
  { value: "service", label: "Kundservice & fältservice", desc: "Ärenden, kanaler och tekniker ute hos kund" },
  { value: "erp", label: "ERP & affärssystem", desc: "Ekonomi, order, lager och produktion" },
  { value: "unsure", label: "Flera områden / vi är osäkra", desc: "Vi hjälper er ringa in rätt område" },
];

export interface StageOption { value: StageKey; label: string }
export const STAGE_OPTIONS: StageOption[] = [
  { value: "understand", label: "Vi försöker förstå vilken typ av lösning vi behöver" },
  { value: "compare", label: "Vi jämför olika alternativ" },
  { value: "decided", label: "Vi har bestämt oss för Dynamics\u00A0365 men inte exakt lösning" },
  { value: "know_product", label: "Vi vet redan vilken Dynamics\u00A0365-produkt vi vill utvärdera" },
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

// ---------------------------------------------------------------------------
// FRÅGA 3 – Enkel omfattning (per område). ERP samlar tre korta fakta i ett steg.
// ---------------------------------------------------------------------------

export const SCOPE_QUESTIONS: Record<Exclude<AreaKey, "erp" | "unsure">, FocusQuestion> = {
  sales: {
    id: "scope_sellers",
    text: "Hur många personer arbetar aktivt med försäljning?",
    options: [
      { value: "1-5", label: "1–5 personer" },
      { value: "6-15", label: "6–15 personer" },
      { value: "16-50", label: "16–50 personer" },
      { value: "51+", label: "Fler än 50 personer" },
    ],
  },
  marketing: {
    id: "scope_marketing",
    text: "Hur ser ert marknadsarbete ut idag?",
    options: [
      { value: "simple", label: "Relativt enkla behov" },
      { value: "several", label: "Flera målgrupper och löpande aktiviteter" },
      { value: "advanced", label: "Omfattande kundresor och datadriven marknadsföring" },
      { value: "unsure", label: "Osäker" },
    ],
  },
  service: {
    id: "scope_service",
    text: "Hur ser er kundservice ut?",
    options: [
      { value: "team", label: "Kundserviceteam" },
      { value: "cc", label: "Contact Center" },
      { value: "field", label: "Fältorganisation / tekniker" },
      { value: "combination", label: "Kombination av flera" },
      { value: "unsure", label: "Osäker" },
    ],
  },
};

/** ERP-omfattning: tre korta fakta i samma steg. */
export const ERP_SCOPE_GROUPS: { key: string; label: string; options: { value: string; label: string }[] }[] = [
  {
    key: "users",
    label: "Ungefärligt antal användare",
    options: [
      { value: "1-25", label: "1–25" },
      { value: "26-100", label: "26–100" },
      { value: "101-500", label: "101–500" },
      { value: "500+", label: "Fler än 500" },
    ],
  },
  {
    key: "entities",
    label: "Antal bolag",
    options: [
      { value: "1", label: "Ett bolag" },
      { value: "2-5", label: "2–5 bolag" },
      { value: "6+", label: "Fler än 5 bolag" },
    ],
  },
  {
    key: "countries",
    label: "Länder",
    options: [
      { value: "se", label: "Bara Sverige" },
      { value: "nordic", label: "Flera nordiska länder" },
      { value: "global", label: "Flera länder / globalt" },
    ],
  },
];

// ---------------------------------------------------------------------------
// FRÅGA 4 – Vad är viktigast? (multi, områdesspecifik)
// ---------------------------------------------------------------------------

export const FOCUS_QUESTIONS: Record<AreaKey, FocusQuestion> = {
  sales: {
    id: "focus_sales",
    text: "Vad vill ni framför allt förbättra?",
    options: [
      { value: "pipeline", label: "Strukturera försäljningsprocess, pipeline och uppföljning" },
      { value: "leads", label: "Effektivare lead- och kundbearbetning" },
      { value: "kam", label: "Bättre kund- och account management" },
      { value: "quotes", label: "Offerter och kommersiella processer" },
      { value: "forecasting", label: "Bättre prognoser och försäljningsanalys" },
      { value: "erp_integration", label: "Integration med ERP och andra system" },
      { value: "adoption", label: "Gemensamt arbetssätt och bättre användning av CRM" },
    ],
  },
  marketing: {
    id: "focus_marketing",
    text: "Vad vill ni framför allt förbättra?",
    options: [
      { value: "customer_data", label: "Samla och förstå kunddata" },
      { value: "segmentation", label: "Segmentera kunder och målgrupper" },
      { value: "journeys", label: "Skapa och automatisera kundresor" },
      { value: "leadgen", label: "Generera och utveckla leads" },
      { value: "personalization", label: "Personalisera kundkommunikation" },
      { value: "alignment", label: "Bättre samverkan mellan marknad och försäljning" },
      { value: "analytics", label: "Mäta och analysera resultat" },
    ],
  },
  service: {
    id: "focus_service",
    text: "Vad vill ni framför allt förbättra?",
    options: [
      { value: "cases", label: "Hantera kundärenden bättre" },
      { value: "selfservice", label: "Self-service och kunskapshantering" },
      { value: "contactcenter", label: "Contact Center och flera kommunikationskanaler" },
      { value: "field", label: "Planera och stödja tekniker ute hos kund" },
      { value: "contracts", label: "Serviceavtal, arbetsorder och servicehistorik" },
      { value: "overview", label: "Kundöverblick och integration mot andra system" },
      { value: "efficiency", label: "Effektivare serviceprocesser" },
    ],
  },
  erp: {
    id: "focus_erp",
    text: "Vad är viktigast att förbättra?",
    options: [
      { value: "finance", label: "Ekonomi och rapportering" },
      { value: "order", label: "Order, inköp och försäljning" },
      { value: "inventory", label: "Lager och logistik" },
      { value: "production", label: "Produktion" },
      { value: "projects", label: "Projektorienterad verksamhet" },
      { value: "complex", label: "Flera bolag/länder och mer komplex verksamhet" },
      { value: "integrations", label: "Integrationer och kompletterande lösningar" },
    ],
  },
  unsure: {
    id: "focus_unsure",
    text: "Vilka behov och områden vill ni förbättra?",
    options: NEED_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
  },
};

/** Extra följdfråga – ställs bara när svaret kan ändra vägledningen. */
export const PROJECT_FOLLOWUP: FocusQuestion = {
  id: "project_centrality",
  text: "Hur central är projektstyrningen för er affär?",
  options: [
    { value: "core", label: "Kärnan i vår affär – vi levererar projekt till kunder" },
    { value: "important", label: "En viktig del av verksamheten" },
    { value: "minor", label: "En mindre del av verksamheten" },
  ],
};

// ---------------------------------------------------------------------------
// FRÅGA 5 – AI och automation (en fråga, anpassade alternativ per område)
// ---------------------------------------------------------------------------

const AI_TAIL = [
  { value: "explore", label: "Vi vill förstå möjligheterna bättre" },
  { value: "no", label: "Inte prioriterat just nu" },
];

export const AI_QUESTIONS: Record<AreaKey, FocusQuestion> = {
  sales: {
    id: "ai_sales",
    text: "Var ser ni störst potential för AI och automation?",
    options: [
      { value: "admin", label: "Minska säljadministration" },
      { value: "meetings", label: "Stöd före och efter kundmöten" },
      { value: "leads", label: "Leads, uppföljning och prioritering" },
      { value: "pipeline", label: "Pipeline och analys" },
      { value: "agents", label: "Automatisera arbetsmoment med agenter" },
      ...AI_TAIL,
    ],
  },
  marketing: {
    id: "ai_marketing",
    text: "Var ser ni störst potential för AI och automation?",
    options: [
      { value: "insights", label: "Kundinsikter och analys" },
      { value: "segmentation", label: "Segmentering" },
      { value: "journeys", label: "Kundresor" },
      { value: "content", label: "Innehåll och personalisering" },
      { value: "agents", label: "Automatisering och agenter" },
      ...AI_TAIL,
    ],
  },
  service: {
    id: "ai_service",
    text: "Var ser ni störst potential för AI och automation?",
    options: [
      { value: "answers", label: "Hjälpa medarbetare hitta svar" },
      { value: "summaries", label: "Sammanfatta ärenden och kunddialoger" },
      { value: "selfservice", label: "Self-service" },
      { value: "routine", label: "Automatisera rutinärenden" },
      { value: "routing", label: "Smart routing eller planering" },
      { value: "field", label: "Stöd för tekniker och arbetsorder" },
      ...AI_TAIL,
    ],
  },
  erp: {
    id: "ai_erp",
    text: "Var ser ni störst potential för AI och automation?",
    options: [
      { value: "finance", label: "Ekonomi och administration" },
      { value: "order", label: "Order och inköp" },
      { value: "inventory", label: "Lager och logistik" },
      { value: "production", label: "Produktion" },
      { value: "projects", label: "Projekt" },
      { value: "analytics", label: "Analys och rapportering" },
      { value: "agents", label: "Automatisera repetitiva processer med agenter" },
      ...AI_TAIL,
    ],
  },
  unsure: {
    id: "ai_unsure",
    text: "Var ser ni störst potential för AI och automation?",
    options: [
      { value: "admin", label: "Minska administration och manuellt arbete" },
      { value: "insights", label: "Bättre insikter och analys" },
      { value: "agents", label: "Automatisera arbetsmoment med agenter" },
      ...AI_TAIL,
    ],
  },
};

/** Filtrerar AI-alternativen för kundservice: fältalternativ bara vid fältbehov. */
export function aiOptionsFor(a: FinderAnswers): { value: string; label: string }[] {
  const area = a.area ?? "unsure";
  const q = AI_QUESTIONS[area];
  if (area !== "service") return q.options;
  const hasField =
    a.scope?.service_character === "field" ||
    a.scope?.service_character === "combination" ||
    (a.focus ?? []).includes("field");
  if (hasField) return q.options;
  return q.options.filter((o) => o.value !== "field" && o.value !== "routing");
}

// ---------------------------------------------------------------------------
// FRÅGA 6 – Införande och arbetssätt (en generell fråga)
// ---------------------------------------------------------------------------

export const CHANGE_QUESTION: FocusQuestion = {
  id: "change",
  text: "Hur stor förändring innebär detta för organisationen och användarna?",
  options: [
    { value: "limited", label: "Begränsad, vi har redan etablerade arbetssätt" },
    { value: "some", label: "Vissa processer och arbetssätt behöver förändras" },
    { value: "common", label: "Vi behöver skapa mer gemensamma arbetssätt" },
    { value: "significant", label: "Detta innebär ett betydande nytt arbetssätt" },
    { value: "unsure", label: "Osäker" },
  ],
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
      { value: "ai", label: "Copilot och AI i försäljningsarbetet" },
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

// ---------------------------------------------------------------------------
// Resultat
// ---------------------------------------------------------------------------

export interface SolutionRec { app: string; label: string; reason: string }
export interface SolutionResult {
  areaLabel: string;
  primary?: SolutionRec;
  complements: SolutionRec[];
  /** Möjliga kompletterande områden – presenteras som att undersöka, inte som säkra rekommendationer. */
  exploreAreas: { label: string; path: string; reason: string }[];
  /** Tillägg/ISV bör undersökas – utan att peka ut en specifik produkt. */
  isvNote?: { text: string; path: string };
  /** Sammanfattning av AI-behovet, bara när användaren faktiskt angett ett. */
  aiSummary?: string;
  /** Införande/arbetssätt tolkat i rätt verksamhetskontext. */
  implementationNote?: string;
  /** Ärliga osäkerheter – visas istället för gissningar. */
  openQuestions: string[];
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
    "Hur fungerar överlämningen av kvalificerade leads till försäljning?",
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

/** Härleder storleksgrupp för partnermatchning ur omfattningssvaren. */
export function deriveSize(a: FinderAnswers): string | undefined {
  const s = a.scope ?? {};
  if (a.area === "erp") {
    const map: Record<string, string> = { "1-25": "1-49", "26-100": "50-99", "101-500": "100-249", "500+": "250-999" };
    return s.users ? map[s.users] : undefined;
  }
  if (a.area === "sales") {
    const map: Record<string, string> = { "1-5": "1-49", "6-15": "1-49", "16-50": "50-99", "51+": "100-249" };
    return s.sellers ? map[s.sellers] : undefined;
  }
  return undefined;
}

/** Härleder bolagsstruktur för ERP-rekommendationen ur omfattningssvaren. */
function deriveStructure(a: FinderAnswers): StructureKey | null {
  const s = a.scope ?? {};
  if (s.entities === "2-5" || s.entities === "6+" || s.countries === "nordic" || s.countries === "global") return "group";
  if (s.entities === "1" && s.countries === "se") return "single";
  return null;
}

/** Införande-/arbetssättskommentar tolkad i rätt verksamhetskontext. */
function implementationNoteFor(area: AreaKey, change?: string): string | undefined {
  if (!change || change === "unsure") return undefined;
  const heavy = change === "significant" || change === "common";
  const some = change === "some";
  if (!heavy && !some) return undefined;
  switch (area) {
    case "sales":
      return heavy
        ? "Gemensam säljmetodik, CRM-användning och user adoption bör beaktas i införandet."
        : "Vissa säljprocesser och arbetssätt behöver anpassas – planera för det i införandet.";
    case "marketing":
      return heavy
        ? "Nya arbetssätt, datadrivet arbete och samverkan mellan marknad och försäljning bör beaktas i införandet."
        : "Vissa arbetssätt i marknadsarbetet behöver anpassas – planera för det i införandet.";
    case "service":
      return heavy
        ? "Serviceprocesser, arbetssätt och user adoption bör beaktas i införandet. Vid fältservice även planering, teknikerns arbetssätt och mobil användning."
        : "Vissa serviceprocesser behöver anpassas – planera för det i införandet.";
    case "erp":
      return heavy
        ? "Processharmonisering, standardisering och förändringsledning bör beaktas i nästa fas."
        : "Vissa processer behöver harmoniseras – planera för förändringsledning i nästa fas.";
    default:
      return heavy
        ? "Förändringsledning och user adoption bör beaktas i nästa fas."
        : "Vissa arbetssätt behöver anpassas – planera för det i nästa fas.";
  }
}

/** Bygger resultatet utifrån svaren. Tvingar aldrig fram en rekommendation utan stöd. */
export function buildSolutionResult(a: FinderAnswers): SolutionResult {
  const area: AreaKey = a.area ?? "unsure";
  const focus = a.focus ?? [];
  const needsIdentified = focusLabels(area, focus);
  const questionsToAsk = QUESTIONS_BY_AREA[area];
  const exploreAreas: SolutionResult["exploreAreas"] = [];
  const openQuestions: string[] = [];
  let isvNote: SolutionResult["isvNote"];

  // AI-sammanfattning – bara det behov användaren faktiskt identifierat
  let aiSummary: string | undefined;
  if (a.ai && a.ai !== "no" && a.ai !== "explore") {
    const opt = AI_QUESTIONS[area].options.find((o) => o.value === a.ai);
    if (opt) aiSummary = `AI och automation bör undersökas vidare inom ${opt.label.toLowerCase()}.`;
  } else if (a.ai === "explore") {
    aiSummary = "Ni vill förstå möjligheterna med AI och automation bättre innan ni bestämmer er.";
  }

  const implementationNote = implementationNoteFor(area, a.change);

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
      openQuestions,
      needsIdentified,
      questionsToAsk,
      nextSteps,
      insufficient: true,
      existingCustomer: true,
      aiSummary: f.includes("ai") ? aiSummary : undefined,
      implementationNote,
    };
  }

  // Köparen vet redan produkten – analysera vad de behöver tänka på, inte rekommendera samma produkt.
  if (a.knownProduct) {
    const test = MATCHNINGSTEST[a.knownProduct];
    const nextSteps: SolutionResult["nextSteps"] = [];
    if (test) nextSteps.push({ label: `Gör matchningstestet för ${a.knownProduct}`, path: test });
    nextSteps.push({ label: `Läs mer om ${a.knownProduct}`, path: PRODUCT_PAGE[a.knownProduct] ?? "/kom-igang/" });
    if (a.ai && a.ai !== "no") nextSteps.push({ label: "Gör AI Readiness-analysen", path: "/ai-readiness/" });
    const pf = a.productFocus ?? [];
    if (pf.includes("addons") || pf.includes("integrations")) {
      isvNote = {
        text: "Ni har lyft integrationer eller branschspecifika tillägg. En relevant tilläggs-/ISV-lösning bör undersökas parallellt.",
        path: a.knownProduct === "Business Central" ? "/business-central/tillagg/" : "/customer-engagement/tillagg/",
      };
    }
    return {
      areaLabel: AREA_LABEL[area],
      primary: {
        app: a.knownProduct,
        label: a.knownProduct,
        reason: "Ni har redan valt produkt. Här följer det ni bör tänka på inför implementation och partnerdialog.",
      },
      complements: [],
      exploreAreas,
      isvNote,
      aiSummary,
      implementationNote,
      openQuestions,
      needsIdentified: productFocusLabels(a.knownProduct, pf),
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
    primary = { app: "Sales", label: "Sales", reason: "Era behov kring försäljningsprocess, pipeline och kundbearbetning pekar på Dynamics\u00A0365 Sales." };
    if (focus.includes("leads")) {
      complements.push({ app: "Customer Insights (Marketing)", label: "Customer Insights", reason: "Behov kring lead nurturing och kundresor gör Customer Insights relevant att undersöka parallellt." });
    }
  } else if (area === "marketing") {
    primary = { app: "Customer Insights (Marketing)", label: "Customer Insights", reason: "Behoven kring kunddata, segmentering och kundresor pekar på Dynamics\u00A0365 Customer Insights." };
    if (focus.includes("alignment")) {
      complements.push({ app: "Sales", label: "Sales", reason: "Samverkan mellan marknad och försäljning gör Sales relevant att undersöka parallellt." });
    }
    if (a.scope?.marketing_scope === "unsure") {
      openQuestions.push("Det behövs mer information om ert marknadsarbete för att avgöra vilken nivå av Customer Insights som är relevant.");
    }
  } else if (area === "service") {
    const char = a.scope?.service_character;
    const wantsCc = focus.includes("contactcenter") || char === "cc";
    const wantsField = focus.includes("field") || focus.includes("contracts") || char === "field";
    const wantsCases = focus.includes("cases") || focus.includes("selfservice") || focus.includes("efficiency") || char === "team";

    if (char === "combination" || char === "unsure" || [wantsCc, wantsField, wantsCases].filter(Boolean).length > 1) {
      // Flera delar relevanta samtidigt
      if (wantsCases || char === "combination" || char === "unsure") {
        primary = { app: "Customer Service", label: "Customer Service", reason: "Ärendehanteringen är kärnan och täcks av Customer Service." };
      }
      if (wantsCc) {
        const rec = { app: "Contact Center", label: "Contact Center", reason: "Kundkommunikation via flera kanaler kan motivera Contact Center." };
        if (primary) complements.push(rec); else primary = rec;
      }
      if (wantsField) {
        const rec = { app: "Field Service", label: "Field Service", reason: "Tekniker ute hos kund pekar på Field Service som komplement." };
        if (primary) complements.push(rec); else primary = rec;
      }
      if (!primary) insufficient = true;
    } else if (wantsField) {
      primary = { app: "Field Service", label: "Field Service", reason: "Service och tekniker ute hos kund är Field Services kärnområde." };
      complements.push({ app: "Customer Service", label: "Customer Service", reason: "Ärendehanteringen runt fältarbetet hanteras ofta i Customer Service." });
    } else if (wantsCc) {
      primary = { app: "Contact Center", label: "Contact Center", reason: "Kundkommunikation via flera kanaler pekar på Contact Center." };
      complements.push({ app: "Customer Service", label: "Customer Service", reason: "Ärendehanteringen bakom kanalerna bygger ofta på Customer Service." });
    } else if (wantsCases) {
      primary = { app: "Customer Service", label: "Customer Service", reason: "Ärendehantering, kunskapsbas och self-service är Customer Services kärnområde." };
    } else {
      insufficient = true;
    }
  } else {
    // erp + unsure: återanvänd den regelbaserade motorn
    const needs = area === "erp"
      ? focus.filter((f) => ["finance", "order", "inventory", "production", "projects"].includes(f))
          .map((f) => (f === "inventory" ? "order" : f))
      : focus;
    if (needs.length === 0 || (needs.length === 1 && needs[0] === "unsure")) {
      insufficient = true;
    } else {
      const rec: RecommendationResult = recommendProducts({
        needs,
        size: deriveSize(a) ?? null,
        structure: deriveStructure(a),
        situation: stageToSituation(a.stage),
      });
      primary = rec.primary;
      complements = rec.complements;

      // Ärlig osäkerhet vid gränsfall BC vs F&SCM
      if (area === "erp" && primary && (a.scope?.users === "26-100" || a.scope?.users === "101-500") && deriveStructure(a) === "group") {
        openQuestions.push("Det behövs mer information för att avgöra om Business Central eller Finance/Supply Chain Management är mest relevant.");
      }

      // Projektorienterad verksamhet: Project Operations när följdfrågan ger stöd
      if (focus.includes("projects") && (a.projectCentrality === "core" || a.projectCentrality === "important")) {
        const poRec: SolutionRec = {
          app: "Project Operations",
          label: "Project Operations",
          reason: a.projectCentrality === "core"
            ? "Projektstyrningen är kärnan i er affär – Project Operations är byggt för projektdriven verksamhet med resursplanering och debitering."
            : "Projekt är en viktig del av verksamheten – Project Operations bör undersökas som komplement.",
        };
        if (a.projectCentrality === "core" && needs.every((n) => n === "projects")) {
          primary = poRec;
          complements = rec.primary ? [rec.primary, ...rec.complements] : complements;
        } else if (!complements.some((c) => c.app === "Project Operations")) {
          complements.push(poRec);
        }
      }

      // Tillägg/ISV: integrationer eller produktion kräver ofta kompletterande lösningar
      if (area === "erp" && (focus.includes("integrations") || focus.includes("production"))) {
        isvNote = {
          text: "Era svar visar behov som kan kräva kompletterande funktionalitet. En relevant tilläggs-/ISV-lösning bör undersökas – vi rekommenderar ingen specifik produkt utan mer underlag.",
          path: "/business-central/tillagg/",
        };
      }
    }
  }

  // Kompletterande områden att undersöka – bara vid stöd i svaren
  if (focus.includes("projects") && a.projectCentrality === "minor") {
    exploreAreas.push({
      label: "Project Operations",
      path: "/d365projectoperations/",
      reason: "Projekt är en mindre del av verksamheten, men kan vara värt att undersöka vidare.",
    });
  }
  if (area === "erp" && a.industry === "Retail & E-handel") {
    exploreAreas.push({
      label: "Commerce",
      path: "/d365commerce/",
      reason: "Retail- och handelsbehov kan motivera att även titta på omnichannel-handel.",
    });
  }

  // Nästa steg – prioriterade och få
  const nextSteps: SolutionResult["nextSteps"] = [];
  if (primary && MATCHNINGSTEST[primary.app]) {
    nextSteps.push({ label: `Gör matchningstestet för ${primary.label}`, path: MATCHNINGSTEST[primary.app] });
  }
  if (area === "erp" || area === "unsure") nextSteps.push({ label: "Fördjupa med ERP-behovsanalysen", path: "/ERPbehovsanalys/" });
  if (area === "sales" || area === "marketing") nextSteps.push({ label: "Fördjupa med behovsanalysen för försäljning & marknad", path: "/CRMbehovsanalys/" });
  if (area === "service") nextSteps.push({ label: "Fördjupa med kundservice-behovsanalysen", path: "/kundservice-behovsanalys/" });
  if (a.ai && a.ai !== "no") nextSteps.push({ label: "Gör AI Readiness-analysen", path: "/ai-readiness/" });

  return {
    areaLabel: AREA_LABEL[area],
    primary,
    complements,
    exploreAreas,
    isvNote,
    aiSummary,
    implementationNote,
    openQuestions,
    needsIdentified,
    questionsToAsk,
    nextSteps: nextSteps.slice(0, 4),
    insufficient,
  };
}

function focusLabels(area: AreaKey, focus: string[]): string[] {
  const q = FOCUS_QUESTIONS[area];
  return focus.map((f) => q.options.find((o) => o.value === f)?.label ?? f);
}

function productFocusLabels(product: string, focus: string[]): string[] {
  const q = PRODUCT_FOCUS_QUESTIONS[product];
  if (!q) return focus;
  return focus.map((f) => q.options.find((o) => o.value === f)?.label ?? f);
}
