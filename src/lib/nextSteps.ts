/**
 * Sprint 1.6: "Fortsätt er utvärdering". Manuellt underhållna nästa steg per pilotsida, med
 * metadata för mätning. Högst fyra alternativ: kunskap, jämförelse, verktyg/funnel och personlig hjälp.
 * Kommersiell status påverkar aldrig vilka steg som visas.
 */
export type BuyerStage = "Learn" | "Explore" | "Compare" | "Plan" | "Select";
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

export function nextStepPage(path: string): NextStepPage | null {
  return NEXT_STEP_PAGES[norm(path)] ?? null;
}

/** Högst fyra alternativ: upp till tre egna steg och alltid personlig hjälp sist. */
export function nextStepOptions(page: NextStepPage): NextStepOption[] {
  return [...page.steps.filter((s) => s.kind !== "help").slice(0, 3), HELP_STEP];
}
