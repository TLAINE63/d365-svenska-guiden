import { ProductFilters } from "@/hooks/usePartners";

// === AI Capability Tier Definitions ===
// Unified tiers (generic)
export const AI_TIERS = {
  STANDARD: "ai-standard",
  PARTNER: "ai-partner",
  ADVANCED: "ai-advanced",
} as const;

// Map every capability key → tier for scoring
const CAPABILITY_TIER: Record<string, string> = {
  // Generic
  [AI_TIERS.STANDARD]: AI_TIERS.STANDARD,
  [AI_TIERS.PARTNER]: AI_TIERS.PARTNER,
  [AI_TIERS.ADVANCED]: AI_TIERS.ADVANCED,
  // Legacy BC
  "bc-copilot": AI_TIERS.STANDARD,
  "bc-agent": AI_TIERS.PARTNER,
  "bc-azure": AI_TIERS.ADVANCED,
  // Legacy generic
  "ai-assistant": AI_TIERS.STANDARD,
  "ai-automation": AI_TIERS.PARTNER,
  "ai-prediction": AI_TIERS.PARTNER,
  "ai-agents": AI_TIERS.PARTNER,
  "ai-azure": AI_TIERS.ADVANCED,
  // FSC Standard (🟢)
  "fsc-std-analysis": AI_TIERS.STANDARD,
  "fsc-std-forecast": AI_TIERS.STANDARD,
  "fsc-std-planning": AI_TIERS.STANDARD,
  "fsc-std-risk": AI_TIERS.STANDARD,
  // FSC Partner-built (🟡)
  "fsc-partner-finance": AI_TIERS.PARTNER,
  "fsc-partner-scm": AI_TIERS.PARTNER,
  "fsc-partner-automation": AI_TIERS.PARTNER,
  // FSC Advanced (🔴)
  "fsc-adv-predictive": AI_TIERS.ADVANCED,
  "fsc-adv-optimization": AI_TIERS.ADVANCED,
  "fsc-adv-fraud": AI_TIERS.ADVANCED,
  // Sales Standard (🟢)
  "sales-std-copilot": AI_TIERS.STANDARD,
  "sales-std-scoring": AI_TIERS.STANDARD,
  "sales-std-forecast": AI_TIERS.STANDARD,
  "sales-std-segmentation": AI_TIERS.STANDARD,
  // Sales Partner-built (🟡)
  "sales-partner-agent": AI_TIERS.PARTNER,
  "sales-partner-marketing": AI_TIERS.PARTNER,
  "sales-partner-automation": AI_TIERS.PARTNER,
  // Sales Advanced (🔴)
  "sales-adv-predictive": AI_TIERS.ADVANCED,
  "sales-adv-personalization": AI_TIERS.ADVANCED,
  "sales-adv-analytics": AI_TIERS.ADVANCED,
  // Service Standard (🟢)
  "svc-std-copilot": AI_TIERS.STANDARD,
  "svc-std-routing": AI_TIERS.STANDARD,
  "svc-std-fieldservice": AI_TIERS.STANDARD,
  "svc-std-contactcenter": AI_TIERS.STANDARD,
  // Service Partner-built (🟡)
  "svc-partner-agent": AI_TIERS.PARTNER,
  "svc-partner-fieldservice": AI_TIERS.PARTNER,
  "svc-partner-automation": AI_TIERS.PARTNER,
  // Service Advanced (🔴)
  "svc-adv-predictive": AI_TIERS.ADVANCED,
  "svc-adv-chatbot": AI_TIERS.ADVANCED,
  "svc-adv-analytics": AI_TIERS.ADVANCED,
};

// Points per tier
const TIER_POINTS: Record<string, number> = {
  [AI_TIERS.STANDARD]: 1,
  [AI_TIERS.PARTNER]: 4,
  [AI_TIERS.ADVANCED]: 7,
};

// Project count multiplier
function getProjectMultiplier(projectCount?: string): number {
  if (!projectCount) return 1;
  if (projectCount === "6+") return 2;
  if (projectCount === "3–5" || projectCount === "3-5") return 1.5;
  return 1;
}

// Get tier for a capability key
function getTier(cap: string): string {
  return CAPABILITY_TIER[cap] || AI_TIERS.STANDARD;
}

// Calculate max possible raw score for a product key
function getMaxRawScore(productKey: string): number {
  const options = getAiOptionsForProduct(productKey);
  let maxPoints = 0;
  for (const group of options) {
    for (const opt of group.options) {
      const tier = getTier(opt.value);
      maxPoints += TIER_POINTS[tier] || 0;
    }
  }
  // Max multiplier is 2 (6+ projects)
  return maxPoints * 2;
}

// Calculate normalized AI score (0–100) for a single product key
export function calculateProductAiScore(capabilities: string[] | undefined, projectCount: string | undefined, productKey: string): number {
  return scoreProduct(capabilities || [], projectCount, productKey);
}

// Calculate AI score for a single product, normalized to 0–100
function scoreProduct(capabilities: string[], projectCount: string | undefined, productKey: string): number {
  if (!capabilities || capabilities.length === 0) return 0;

  let basePoints = 0;
  for (const cap of capabilities) {
    const tier = getTier(cap);
    basePoints += TIER_POINTS[tier] || 0;
  }

  const raw = basePoints * getProjectMultiplier(projectCount);
  const max = getMaxRawScore(productKey);
  if (max === 0) return 0;

  return (raw / max) * 100;
}

// Calculate total AI score across all products (average of normalized scores, 0–100)
export function calculateAiScore(productFilters?: ProductFilters): number {
  if (!productFilters) return 0;

  const products = ['bc', 'fsc', 'sales', 'service'] as const;
  const scores: number[] = [];

  for (const key of products) {
    const pf = productFilters[key];
    if (pf?.aiCapabilities && pf.aiCapabilities.length > 0) {
      scores.push(scoreProduct(pf.aiCapabilities, pf.aiProjectCount, key));
    }
  }

  if (scores.length === 0) return 0;

  const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  return Math.round(average * 10) / 10;
}

// AI level thresholds
export type AiLevel = "none" | "enabled" | "integration" | "advanced" | "transformation";

export interface AiLevelInfo {
  level: AiLevel;
  label: string;
  emoji: string;
  color: string;
  score: number;
}

export function getAiLevel(score: number): AiLevelInfo {
  if (score >= 60) return {
    level: "transformation", label: "AI Transformation Partner", emoji: "🟣",
    color: "border-purple-500/40 text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30", score,
  };
  if (score >= 35) return {
    level: "advanced", label: "AI Advanced", emoji: "🔴",
    color: "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30", score,
  };
  if (score >= 15) return {
    level: "integration", label: "AI Integration Partner", emoji: "🟠",
    color: "border-orange-500/40 text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/30", score,
  };
  if (score > 0) return {
    level: "enabled", label: "AI Enabled", emoji: "🟡",
    color: "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30", score,
  };
  return { level: "none", label: "", emoji: "", color: "", score: 0 };
}

// Labels for display on cards (short)
export const AI_TIER_LABELS: Record<string, string> = {
  // Unified
  [AI_TIERS.STANDARD]: "Microsoft Standard AI",
  [AI_TIERS.PARTNER]: "Partner-byggd AI",
  [AI_TIERS.ADVANCED]: "Avancerad Azure AI",
  // Legacy
  "bc-copilot": "Microsoft Standard AI",
  "bc-agent": "Partner-byggd AI",
  "bc-azure": "Avancerad Azure AI",
  "ai-assistant": "Microsoft Standard AI",
  "ai-automation": "Partner-byggd AI",
  "ai-prediction": "Partner-byggd AI",
  "ai-agents": "Partner-byggd AI",
  "ai-azure": "Avancerad Azure AI",
  // FSC Standard
  "fsc-std-analysis": "AI-analys & rapportering",
  "fsc-std-forecast": "Efterfrågeprognos",
  "fsc-std-planning": "Planeringsoptimering",
  "fsc-std-risk": "Avvikelse- & riskidentifiering",
  // FSC Partner
  "fsc-partner-finance": "AI-agent för finansprocesser",
  "fsc-partner-scm": "AI-agent för SCM & inköp",
  "fsc-partner-automation": "AI-automatisering planering/risk",
  // FSC Advanced
  "fsc-adv-predictive": "Prediktiv modell (Finance/SCM)",
  "fsc-adv-optimization": "Azure-optimering (produktion/SCM)",
  "fsc-adv-fraud": "Risk- & fraud-detektering",
  // Sales Standard
  "sales-std-copilot": "Sales Copilot",
  "sales-std-scoring": "Lead/opportunity scoring",
  "sales-std-forecast": "Pipeline-prognos",
  "sales-std-segmentation": "AI-kundsegmentering",
  // Sales Partner
  "sales-partner-agent": "AI-agent för säljprocesser",
  "sales-partner-marketing": "AI-agent för marknad/kunddialog",
  "sales-partner-automation": "AI-automatisering Sales",
  // Sales Advanced
  "sales-adv-predictive": "Prediktiv modell (försäljning/churn)",
  "sales-adv-personalization": "Personalisering & rekommendation",
  "sales-adv-analytics": "Avancerad kundanalys (Azure)",
  // Service Standard
  "svc-std-copilot": "AI-assistent för handläggare",
  "svc-std-routing": "Ärenderouting & prioritering",
  "svc-std-fieldservice": "Field Service-optimering",
  "svc-std-contactcenter": "Contact Center AI",
  // Service Partner
  "svc-partner-agent": "AI-agent för kundservice",
  "svc-partner-fieldservice": "AI-agent för Field Service",
  "svc-partner-automation": "AI-automatisering service",
  // Service Advanced
  "svc-adv-predictive": "Prediktivt underhåll",
  "svc-adv-chatbot": "Avancerad AI-chattbot",
  "svc-adv-analytics": "Analysmodell kundbeteende",
};

// Badge styles per capability
export const AI_TIER_BADGE_STYLES: Record<string, string> = {
  // Green tier
  [AI_TIERS.STANDARD]: "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "bc-copilot": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "ai-assistant": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "fsc-std-analysis": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "fsc-std-forecast": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "fsc-std-planning": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "fsc-std-risk": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "sales-std-copilot": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "sales-std-scoring": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "sales-std-forecast": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "sales-std-segmentation": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "svc-std-copilot": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "svc-std-routing": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "svc-std-fieldservice": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "svc-std-contactcenter": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  // Yellow tier
  [AI_TIERS.PARTNER]: "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "bc-agent": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "ai-automation": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "ai-prediction": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "ai-agents": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "fsc-partner-finance": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "fsc-partner-scm": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "fsc-partner-automation": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "sales-partner-agent": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "sales-partner-marketing": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "sales-partner-automation": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "svc-partner-agent": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "svc-partner-fieldservice": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "svc-partner-automation": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  // Red tier
  [AI_TIERS.ADVANCED]: "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
  "bc-azure": "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
  "ai-azure": "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
  "fsc-adv-predictive": "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
  "fsc-adv-optimization": "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
  "fsc-adv-fraud": "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
  "sales-adv-predictive": "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
  "sales-adv-personalization": "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
  "sales-adv-analytics": "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
  "svc-adv-predictive": "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
  "svc-adv-chatbot": "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
  "svc-adv-analytics": "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
};

// Emoji per capability
export function getCapabilityEmoji(cap: string): string {
  const tier = getTier(cap);
  if (tier === AI_TIERS.STANDARD) return "🟢";
  if (tier === AI_TIERS.PARTNER) return "🟡";
  if (tier === AI_TIERS.ADVANCED) return "🔴";
  return "";
}

// === Product-specific form options ===

export interface AiFormOption {
  value: string;
  label: string;
  description: string;
}

export interface AiFormTierGroup {
  tierLabel: string;
  emoji: string;
  pointsLabel: string;
  options: AiFormOption[];
}

// FSC-specific options grouped by tier
export const FSC_AI_OPTIONS: AiFormTierGroup[] = [
  {
    tierLabel: "MICROSOFT STANDARD (Embedded Copilot & AI)",
    emoji: "🟢",
    pointsLabel: "1 poäng styck",
    options: [
      { value: "fsc-std-analysis", label: "AI-assistent för ekonomisk analys och rapportering", description: "t.ex. Finance Copilot som förklarar avvikelser, sammanfattar rapporter, stödjer bokslutsarbete" },
      { value: "fsc-std-forecast", label: "AI-driven efterfrågeprognos och lagerplanering", description: "inbyggd demand forecasting i Supply Chain" },
      { value: "fsc-std-planning", label: "AI-baserad optimering av planering och produktion", description: "t.ex. planeringsförslag, kapacitetsoptimering" },
      { value: "fsc-std-risk", label: "AI-stödd avvikelse- eller riskidentifiering", description: "t.ex. flaggar ovanliga transaktioner eller leveransrisker" },
    ],
  },
  {
    tierLabel: "PARTNER-BYGGD AI (Copilot Studio / Power Platform)",
    emoji: "🟡",
    pointsLabel: "4 poäng styck",
    options: [
      { value: "fsc-partner-finance", label: "Anpassad AI-agent för finansprocesser", description: "t.ex. agent för budgetstöd, leverantörsreskontra, periodstängning" },
      { value: "fsc-partner-scm", label: "Anpassad AI-agent för supply chain eller inköp", description: "t.ex. agent som analyserar inköpsmönster eller föreslår alternativa leverantörer" },
      { value: "fsc-partner-automation", label: "Automatiserad AI-process för planering eller riskhantering", description: "byggd ovanpå F&SCM med Copilot Studio eller Power Platform" },
    ],
  },
  {
    tierLabel: "AVANCERAD AI (Azure AI / Foundry / ML)",
    emoji: "🔴",
    pointsLabel: "7 poäng styck",
    options: [
      { value: "fsc-adv-predictive", label: "Egenutvecklad prediktiv modell integrerad med Finance & SCM", description: "t.ex. avancerad cashflow-modell, custom demand model" },
      { value: "fsc-adv-optimization", label: "AI-baserad optimeringslösning byggd på Azure", description: "t.ex. avancerad produktionsoptimering eller global supply chain-simulering" },
      { value: "fsc-adv-fraud", label: "Avancerad risk- eller fraud-detektering med Azure AI", description: "" },
    ],
  },
];

// Sales-specific options
export const SALES_AI_OPTIONS: AiFormTierGroup[] = [
  {
    tierLabel: "MICROSOFT STANDARD (Embedded AI & Copilot)",
    emoji: "🟢",
    pointsLabel: "1 poäng styck",
    options: [
      { value: "sales-std-copilot", label: "AI-assistent för säljare (Sales Copilot)", description: "t.ex. mötessammanfattningar, förslag på nästa steg, e-postutkast" },
      { value: "sales-std-scoring", label: "AI-driven lead- eller opportunity scoring", description: "automatiskt prioriterar affärsmöjligheter" },
      { value: "sales-std-forecast", label: "Prediktiv pipeline- eller intäktsprognos", description: "" },
      { value: "sales-std-segmentation", label: "AI-baserad kundsegmentering i Customer Insights", description: "" },
    ],
  },
  {
    tierLabel: "PARTNER-BYGGD AI (Copilot Studio / Power Platform)",
    emoji: "🟡",
    pointsLabel: "4 poäng styck",
    options: [
      { value: "sales-partner-agent", label: "Anpassad AI-agent för säljprocesser", description: "t.ex. intern affärscoach, offertstöd, kvalificeringsagent" },
      { value: "sales-partner-marketing", label: "Anpassad AI-agent för marknadsautomation eller kunddialog", description: "" },
      { value: "sales-partner-automation", label: "AI-baserade arbetsflöden eller automatiseringar ovanpå Sales", description: "" },
    ],
  },
  {
    tierLabel: "AVANCERAD AI (Azure AI / Foundry / Custom ML)",
    emoji: "🔴",
    pointsLabel: "7 poäng styck",
    options: [
      { value: "sales-adv-predictive", label: "Egenutvecklad prediktiv modell för försäljning eller churn", description: "" },
      { value: "sales-adv-personalization", label: "Avancerad personalisering eller rekommendationsmotor byggd på Azure", description: "" },
      { value: "sales-adv-analytics", label: "AI-lösning integrerad med externa datakällor för förbättrad kundanalys", description: "" },
    ],
  },
];

// Service-specific options
export const SERVICE_AI_OPTIONS: AiFormTierGroup[] = [
  {
    tierLabel: "MICROSOFT STANDARD (Embedded Copilot & AI)",
    emoji: "🟢",
    pointsLabel: "1 poäng styck",
    options: [
      { value: "svc-std-copilot", label: "AI-assistent för handläggare eller agenter", description: "t.ex. sammanfattar ärenden, föreslår svar, guidar i realtid – Customer Service Copilot" },
      { value: "svc-std-routing", label: "AI-driven ärenderouting eller prioritering", description: "automatiskt skickar ärenden till rätt kö eller agent" },
      { value: "svc-std-fieldservice", label: "AI-baserad schemaläggning och optimering i Field Service", description: "intelligent planering av tekniker och besök" },
      { value: "svc-std-contactcenter", label: "Realtidsstöd i Contact Center", description: "förslag på svar, sammanfattning av samtal, sentiment-analys" },
    ],
  },
  {
    tierLabel: "PARTNER-BYGGD AI (Copilot Studio / Power Platform)",
    emoji: "🟡",
    pointsLabel: "4 poäng styck",
    options: [
      { value: "svc-partner-agent", label: "Anpassad AI-agent för kundserviceprocesser", description: "t.ex. intern AI-assistent för specialiserade flöden" },
      { value: "svc-partner-fieldservice", label: "Anpassad AI-agent för Field Service eller teknikerstöd", description: "" },
      { value: "svc-partner-automation", label: "AI-baserade automatiseringar ovanpå serviceprocesser", description: "t.ex. intelligent eskalering, SLA-stöd, kvalitetskontroll" },
    ],
  },
  {
    tierLabel: "AVANCERAD AI (Azure AI / Foundry / Custom ML)",
    emoji: "🔴",
    pointsLabel: "7 poäng styck",
    options: [
      { value: "svc-adv-predictive", label: "Prediktivt underhåll baserat på egna AI-modeller", description: "t.ex. analys av IoT-data för att förebygga fel" },
      { value: "svc-adv-chatbot", label: "Avancerad AI-baserad röst- eller chattbot", description: "byggd med Azure AI, ej enbart standard Copilot" },
      { value: "svc-adv-analytics", label: "Egenutvecklad analysmodell för kundbeteende eller serviceoptimering", description: "" },
    ],
  },
];

// Generic options (for BC - until it gets its own)
export const GENERIC_AI_OPTIONS: AiFormTierGroup[] = [
  {
    tierLabel: "MICROSOFT STANDARD (Embedded Copilot & AI)",
    emoji: "🟢",
    pointsLabel: "1 poäng",
    options: [
      { value: "ai-standard", label: "Microsoft Copilot eller färdig AI-funktion (Agents)", description: "ex: orderförslag, användarstöd, analys, inbyggda Copilot-funktioner" },
    ],
  },
  {
    tierLabel: "PARTNER-BYGGD AI (Copilot Studio / Power Platform)",
    emoji: "🟡",
    pointsLabel: "4 poäng",
    options: [
      { value: "ai-partner", label: "Anpassad AI-agent (Copilot Studio / Power Platform)", description: "ex: egenutvecklad agent, AI-flöde, skräddarsydda AI-verktyg" },
    ],
  },
  {
    tierLabel: "AVANCERAD AI (Azure AI / Foundry / ML)",
    emoji: "🔴",
    pointsLabel: "7 poäng",
    options: [
      { value: "ai-advanced", label: "Avancerad AI-lösning (Azure AI / AI Foundry / ML)", description: "ex: Azure-baserad AI-modell, prediktiv analys, custom ML" },
    ],
  },
];

// Get the right options for a product key
export function getAiOptionsForProduct(productKey: string): AiFormTierGroup[] {
  switch (productKey) {
    case 'fsc': return FSC_AI_OPTIONS;
    case 'sales': return SALES_AI_OPTIONS;
    case 'service': return SERVICE_AI_OPTIONS;
    default: return GENERIC_AI_OPTIONS;
  }
}
