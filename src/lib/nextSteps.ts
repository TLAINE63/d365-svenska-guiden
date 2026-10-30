/**
 * Sprint 1.6: "Fortsätt er utvärdering". Manuellt underhållna nästa steg per pilotsida, med
 * metadata för mätning. Högst fyra alternativ: kunskap, jämförelse, verktyg/funnel och personlig hjälp.
 * Kommersiell status påverkar aldrig vilka steg som visas.
 */
export type BuyerStage = "Learn" | "Explore" | "Compare" | "Plan" | "Select" | "Act";
export type IntentType = "BuyerProject" | "PartnerSearch" | "ExpertRequirement" | "PartnerChange" | "ISVRequirement" | "ExistingDynamics" | "General";
export type CtaType = "informational" | "journey" | "hand_raise";
export type ConversionType = "selfservice" | "journey" | "contact_d365" | "contact_supplier";
export type Recipient = "none" | "d365" | "partner" | "isv";
export type NextStepKind = "knowledge" | "comparison" | "tool" | "help";

export interface NextStepOption {
  kind: NextStepKind;
  label: string;
  text: string;
  /** Länk inom sajten. Saknas för hjälp och för kompetensvalet som öppnar en dialog. */
  to?: string;
  /** Öppnar Sprint 1.0-valet "Vad söker ni?" i stället för en länk. */
  opensCompetenceChoice?: boolean;
  ctaType: CtaType;
  conversionType: ConversionType;
  recipient: Recipient;
}

export interface NextStepPage {
  buyerStage: BuyerStage;
  intentType: IntentType;
  /** Kort beskrivning av sidans sammanhang, följer med i hjälpärendet. */
  context: string;
  steps: NextStepOption[];
}

/** Standardiserade hand raises på sajten (alla går till d365.se, aldrig direkt till partner). */
export const STANDARD_HAND_RAISES = [
  "Prata med d365.se",
  "Få en första bedömning",
  "Få hjälp att välja partner",
  "Beskriv ert kompetensbehov",
  "Få hjälp att bedöma kostnadsbilden",
] as const;

export const HELP_STEP: NextStepOption = {
  kind: "help",
  label: "Få hjälp att bedöma nästa steg",
  text: "Beskriv kort var ni står, så hjälper d365.se er att välja nästa steg.",
  ctaType: "hand_raise",
  conversionType: "contact_d365",
  recipient: "d365",
};

const info = (label: string, text: string, to: string): NextStepOption => ({ kind: "knowledge", label, text, to, ctaType: "informational", conversionType: "selfservice", recipient: "none" });
const compare = (label: string, text: string, to: string): NextStepOption => ({ kind: "comparison", label, text, to, ctaType: "informational", conversionType: "selfservice", recipient: "none" });
const tool = (label: string, text: string, to: string): NextStepOption => ({ kind: "tool", label, text, to, ctaType: "journey", conversionType: "journey", recipient: "none" });

/** Pilotsidor. Lägg till fler först när piloten har utvärderats. */
export const NEXT_STEP_PAGES: Record<string, NextStepPage> = {
  "/vad-ar-dynamics-365/": {
    buyerStage: "Learn", intentType: "General", context: "Vad är Dynamics 365?",
    steps: [
      info("Förstå affärssystem (ERP)", "Business Central och Finance & Supply Chain Management, och när vilket passar.", "/affarssystem/"),
      compare("Jämför alternativ", "Se hur Dynamics 365 står sig mot andra CRM- och affärssystem (ERP).", "/jamfor/"),
      tool("Starta behovsguiden", "Börja med ert verksamhetsbehov och se vad som kan vara relevant.", "/kom-igang/"),
    ],
  },
  "/affarssystem/": {
    buyerStage: "Explore", intentType: "BuyerProject", context: "Affärssystem (ERP)",
    steps: [
      info("Vad kostar ett affärssystem?", "Licens, införande och förvaltning över tre år.", "/kostnad/"),
      compare("Jämför affärssystem", "Business Central och Finance & SCM mot andra affärssystem (ERP).", "/jamfor/"),
      tool("Starta behovsguiden", "Några frågor om era processer ger en mer underbyggd bild.", "/kom-igang/"),
    ],
  },
  "/crm/": {
    buyerStage: "Explore", intentType: "BuyerProject", context: "CRM",
    steps: [
      info("Vad kostar CRM?", "Licens, införande och förvaltning över tre år.", "/kostnad/"),
      compare("Dynamics 365 jämfört med Salesforce", "Skillnader i funktion, licensmodell och införande.", "/jamfor/dynamics-365-vs-salesforce/"),
      tool("Starta behovsguiden", "Några frågor om er process ger en mer underbyggd bild.", "/kom-igang/"),
    ],
  },
  "/jamfor/dynamics-365-vs-salesforce/": {
    buyerStage: "Compare", intentType: "BuyerProject", context: "Dynamics 365 jämfört med Salesforce",
    steps: [
      info("Förstå Dynamics 365 CRM", "Sälj, marknad och kundservice i Dynamics 365.", "/crm/"),
      compare("Fler jämförelser", "Andra CRM- och affärssystem (ERP) sida vid sida.", "/jamfor/"),
      tool("Räkna på kostnaden", "Få ett kostnadsspann för licens och införande.", "/kostnad/#snabb-offertfraga"),
    ],
  },
  "/guider/valja-dynamics-365-partner/": {
    buyerStage: "Select", intentType: "PartnerSearch", context: "Välja Dynamics 365-partner",
    steps: [
      info("Så jämför ni offerter", "Vad partnerns offert bör visa och hur ni jämför den.", "/upphandlingsguiden/"),
      compare("Jämför partners", "Ställ upp till tre partners sida vid sida.", "/jamfor-partners/"),
      { kind: "tool", label: "Hitta rätt kompetens", text: "Välj om ni söker en partner eller en specifik expert eller konsult.", opensCompetenceChoice: true, ctaType: "journey", conversionType: "journey", recipient: "none" },
    ],
  },
  "/guider/byta-dynamics-partner/": {
    buyerStage: "Plan", intentType: "PartnerChange", context: "Utvärdera eller byta Dynamics 365-partner",
    steps: [
      info("Support och förvaltning", "Vad avtalet ska omfatta och hur ansvaret fördelas.", "/guider/dynamics-365-support-forvaltning/"),
      compare("Second opinion", "En extra genomgång av lösning, offert eller partner innan ni beslutar.", "/second-opinion/"),
      tool("Utvärdera partnersamarbetet", "Beskriv vad som fungerar och vad som behöver förbättras.", "/befintlig-kund/#utvardera-partnersamarbetet"),
    ],
  },
};

const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);

/**
 * Sprint 2.1 No Dead Ends: sidtyper. Sidor utan egen pilotkonfiguration får sin sidtyps
 * fallback_next_step, så att ingen relevant publik sida slutar utan ett begripligt nästa steg.
 * No Dead Ends betyder relevanta nästa steg, inte formulär överallt: hjälp är alltid bara ett av alternativen.
 */
export type SourceTemplate =
  | "home" | "article" | "guide" | "product" | "industry" | "comparison" | "cost" | "calculator"
  | "partner_list" | "partner_profile" | "competence" | "inside" | "isv_vendor" | "isv_product" | "isv_category"
  | "category" | "search" | "empty_results" | "not_found" | "event" | "partner_news" | "aktuellt" | "other";

const KOM_IGANG = tool("Starta behovsguiden", "Börja med ert verksamhetsbehov och se vad som kan vara relevant.", "/kom-igang/");
const KOSTNAD = info("Vad kostar det?", "Licens, införande och förvaltning för CRM- och affärssystem (ERP).", "/kostnad/");
const JAMFOR = compare("Jämför alternativ", "Dynamics 365 sida vid sida med andra CRM- och affärssystem (ERP).", "/jamfor/");
const PARTNER = tool("Hitta relevanta partners", "Filtrera på produkt, bransch och behov.", "/valjdynamics365partner/");
const JAMFOR_PARTNERS = compare("Jämför partners", "Ställ upp till tre partners sida vid sida.", "/jamfor-partners/");
const KOMPETENS: NextStepOption = { kind: "tool", label: "Hitta rätt kompetens", text: "Välj om ni söker en partner eller en specifik expert eller konsult.", opensCompetenceChoice: true, ctaType: "journey", conversionType: "journey", recipient: "none" };
const TILLAGG = info("Tilläggslösningar", "Tillägg och ISV-lösningar för Dynamics 365, med informationsstatus.", "/kunskapscenter/dynamics-365-tillagg/");
const UPPHANDLING = info("Så jämför ni offerter", "Vad partnerns offert bör visa och hur ni jämför den.", "/upphandlingsguiden/");

const tpl = (buyerStage: BuyerStage, intentType: IntentType, context: string, steps: NextStepOption[]): NextStepPage => ({ buyerStage, intentType, context, steps });

/** fallback_next_step per sidtyp. Manuellt underhållna, aldrig styrda av kommersiell status. */
export const TEMPLATE_NEXT_STEPS: Record<SourceTemplate, NextStepPage> = {
  home: tpl("Learn", "General", "Startsidan", [KOM_IGANG, KOSTNAD, PARTNER]),
  article: tpl("Learn", "General", "Artikel", [KOM_IGANG, JAMFOR, KOSTNAD]),
  guide: tpl("Learn", "General", "Guide", [KOM_IGANG, JAMFOR, KOSTNAD]),
  product: tpl("Explore", "BuyerProject", "Produktsida", [KOSTNAD, JAMFOR, PARTNER]),
  industry: tpl("Explore", "BuyerProject", "Branschsida", [PARTNER, KOSTNAD, KOM_IGANG]),
  comparison: tpl("Compare", "BuyerProject", "Jämförelse", [KOSTNAD, KOM_IGANG, PARTNER]),
  cost: tpl("Plan", "BuyerProject", "Kostnad", [JAMFOR, PARTNER, UPPHANDLING]),
  calculator: tpl("Plan", "BuyerProject", "Kalkylator", [JAMFOR, PARTNER, UPPHANDLING]),
  partner_list: tpl("Select", "PartnerSearch", "Partnerlista", [JAMFOR_PARTNERS, UPPHANDLING, KOMPETENS]),
  partner_profile: tpl("Select", "PartnerSearch", "Partnerprofil", [JAMFOR_PARTNERS, PARTNER, UPPHANDLING]),
  competence: tpl("Select", "ExpertRequirement", "Kompetens", [PARTNER, JAMFOR_PARTNERS, UPPHANDLING]),
  inside: tpl("Learn", "General", "d365.se INSIDE", [KOM_IGANG, PARTNER, KOSTNAD]),
  isv_vendor: tpl("Explore", "ISVRequirement", "ISV-leverantör", [TILLAGG, PARTNER, KOM_IGANG]),
  isv_product: tpl("Explore", "ISVRequirement", "ISV-produkt", [TILLAGG, PARTNER, KOM_IGANG]),
  isv_category: tpl("Explore", "ISVRequirement", "Tilläggskategori", [TILLAGG, PARTNER, KOM_IGANG]),
  category: tpl("Learn", "General", "Kategori", [KOM_IGANG, JAMFOR, KOSTNAD]),
  search: tpl("Learn", "General", "Sök", [KOM_IGANG, KOSTNAD, PARTNER]),
  empty_results: tpl("Explore", "General", "Tomt resultat", [KOM_IGANG, PARTNER, KOSTNAD]),
  not_found: tpl("Learn", "General", "Sidan hittades inte", [KOM_IGANG, KOSTNAD, PARTNER]),
  event: tpl("Learn", "General", "Event", [KOM_IGANG, JAMFOR, PARTNER]),
  partner_news: tpl("Learn", "General", "Partnernytt", [PARTNER, KOM_IGANG, JAMFOR]),
  aktuellt: tpl("Learn", "General", "Aktuellt", [KOM_IGANG, JAMFOR, KOSTNAD]),
  other: tpl("Learn", "General", "Sida", [KOM_IGANG, KOSTNAD, PARTNER]),
};

/** Klassificering enligt sprintens köparsteg (LEARN … ACT). */
export const STAGE_CLASS: Record<BuyerStage, "LEARN" | "EXPLORE" | "COMPARE" | "PLAN" | "SELECT" | "ACT"> = {
  Learn: "LEARN", Explore: "EXPLORE", Compare: "COMPARE", Plan: "PLAN", Select: "SELECT", Act: "ACT",
};

/** 404: fasta vägar till de fyra huvudvägarna plus sök. */
export const NOT_FOUND_STEPS: { label: string; text: string; to: string; type: string }[] = [
  { label: "CRM- eller affärssystem (ERP)", text: "Börja med ert verksamhetsbehov.", to: "/kom-igang/", type: "journey" },
  { label: "Vad kostar det?", text: "Licens, införande och förvaltning.", to: "/kostnad/", type: "cost" },
  { label: "Använder redan Dynamics 365", text: "Utveckla lösningen, support eller partnersamarbete.", to: "/befintlig-kund/", type: "existing" },
  { label: "Dynamics 365-kompetens", text: "Partner, expert eller konsult.", to: "/kompetens/", type: "competence" },
];

export function nextStepPage(path: string, template?: SourceTemplate): NextStepPage | null {
  return NEXT_STEP_PAGES[norm(path)] ?? (template ? TEMPLATE_NEXT_STEPS[template] : null);
}

/** Mätning för No Dead Ends. Bara sidtyp, sökväg, typ och mål; aldrig fritext. */
export function deadEndMeta(sourceTemplate: SourceTemplate, sourcePage: string, nextStepType?: string, destination?: string) {
  return {
    source_template: sourceTemplate,
    source_page: sourcePage,
    ...(nextStepType ? { next_step_type: nextStepType } : {}),
    ...(destination ? { destination } : {}),
  };
}

/** Högst fyra alternativ: upp till tre egna steg och alltid personlig hjälp sist. */
export function nextStepOptions(page: NextStepPage): NextStepOption[] {
  return [...page.steps.filter((s) => s.kind !== "help").slice(0, 3), HELP_STEP];
}
