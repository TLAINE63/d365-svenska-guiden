import { ProductFilters } from "@/hooks/usePartners";

// === AI Capability Tier Definitions (unified across all products) ===
// These are the 3 tiers stored in product_filters.aiCapabilities[]

// Tier values stored per product
export const AI_TIERS = {
  STANDARD: "ai-standard",   // 🟢 Microsoft Standard AI (Copilot, built-in agents)
  PARTNER: "ai-partner",     // 🟡 Partner-built (Copilot Studio / Power Platform)
  ADVANCED: "ai-advanced",   // 🔴 Advanced Azure AI / AI Foundry
} as const;

// Legacy BC-specific keys mapped to unified tiers
const LEGACY_TO_TIER: Record<string, string> = {
  "bc-copilot": AI_TIERS.STANDARD,
  "bc-agent": AI_TIERS.PARTNER,
  "bc-azure": AI_TIERS.ADVANCED,
  // Legacy generic keys
  "ai-assistant": AI_TIERS.STANDARD,
  "ai-automation": AI_TIERS.PARTNER,
  "ai-prediction": AI_TIERS.PARTNER,
  "ai-agents": AI_TIERS.PARTNER,
  "ai-azure": AI_TIERS.ADVANCED,
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
  return 1; // "0–2" or unknown
}

// Normalize a capability key to a unified tier
function normalizeTier(cap: string): string {
  if (Object.values(AI_TIERS).includes(cap as any)) return cap;
  return LEGACY_TO_TIER[cap] || cap;
}

// Calculate AI score for a single product
function scoreProduct(capabilities: string[], projectCount?: string): number {
  if (!capabilities || capabilities.length === 0) return 0;

  // Deduplicate tiers (a partner can only score each tier once per product)
  const tiers = new Set(capabilities.map(normalizeTier));
  let basePoints = 0;
  tiers.forEach(tier => {
    basePoints += TIER_POINTS[tier] || 0;
  });

  return basePoints * getProjectMultiplier(projectCount);
}

// Calculate total AI score across all products
export function calculateAiScore(productFilters?: ProductFilters): number {
  if (!productFilters) return 0;

  let total = 0;
  const products = ['bc', 'fsc', 'sales', 'service'] as const;

  for (const key of products) {
    const pf = productFilters[key];
    if (pf?.aiCapabilities && pf.aiCapabilities.length > 0) {
      total += scoreProduct(pf.aiCapabilities, pf.aiProjectCount);
    }
  }

  return Math.round(total * 10) / 10; // clean rounding
}

// AI level thresholds and labels
export type AiLevel = "none" | "enabled" | "integration" | "advanced" | "transformation";

export interface AiLevelInfo {
  level: AiLevel;
  label: string;
  emoji: string;
  color: string; // Tailwind classes
  score: number;
}

export function getAiLevel(score: number): AiLevelInfo {
  if (score >= 26) return {
    level: "transformation",
    label: "AI Transformation Partner",
    emoji: "🟣",
    color: "border-purple-500/40 text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30",
    score,
  };
  if (score >= 16) return {
    level: "advanced",
    label: "AI Advanced",
    emoji: "🔴",
    color: "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
    score,
  };
  if (score >= 6) return {
    level: "integration",
    label: "AI Integration Partner",
    emoji: "🟠",
    color: "border-orange-500/40 text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/30",
    score,
  };
  if (score > 0) return {
    level: "enabled",
    label: "AI Enabled",
    emoji: "🟡",
    color: "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
    score,
  };
  return {
    level: "none",
    label: "",
    emoji: "",
    color: "",
    score: 0,
  };
}

// Labels for the 3 unified tiers (display on cards)
export const AI_TIER_LABELS: Record<string, string> = {
  [AI_TIERS.STANDARD]: "Microsoft Standard AI",
  [AI_TIERS.PARTNER]: "Partner-byggd AI",
  [AI_TIERS.ADVANCED]: "Avancerad Azure AI",
  // Legacy keys still have labels for backwards compat
  "bc-copilot": "Microsoft Standard AI",
  "bc-agent": "Partner-byggd AI",
  "bc-azure": "Avancerad Azure AI",
  "ai-assistant": "Microsoft Standard AI",
  "ai-automation": "Partner-byggd AI",
  "ai-prediction": "Partner-byggd AI",
  "ai-agents": "Partner-byggd AI",
  "ai-azure": "Avancerad Azure AI",
};

// Badge styles per unified tier
export const AI_TIER_BADGE_STYLES: Record<string, string> = {
  [AI_TIERS.STANDARD]: "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  [AI_TIERS.PARTNER]: "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  [AI_TIERS.ADVANCED]: "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
  // Legacy
  "bc-copilot": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "bc-agent": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "bc-azure": "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
  "ai-assistant": "border-green-500/40 text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30",
  "ai-automation": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "ai-prediction": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "ai-agents": "border-yellow-500/40 text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/30",
  "ai-azure": "border-red-500/40 text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30",
};

// Emoji per capability
export function getCapabilityEmoji(cap: string): string {
  const tier = normalizeTier(cap);
  if (tier === AI_TIERS.STANDARD) return "🟢";
  if (tier === AI_TIERS.PARTNER) return "🟡";
  if (tier === AI_TIERS.ADVANCED) return "🔴";
  return "";
}
