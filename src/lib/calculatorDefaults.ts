import { CONSULTANT_HOUR_SEK } from "@/data/pricing";
import { INDUSTRY_NAMES } from "@/data/standardIndustries";
import type { Industry } from "@/data/bcRoiDrivers";
import type { SalesIndustry } from "@/data/salesRoiDrivers";

export const ROI_DEFAULTS = {
  complexity: "Låg" as const,
  integrations: 0,
  enabledDrivers: [] as string[],
  users: 1,
  additionalUsers: 0,
  manualPct: 0,
  currentItCost: 0,
};

export const IMPLEMENTATION_DEFAULTS = {
  users: 5,
  complexity: "standardnara" as const,
  integrations: 0,
  legalEntities: 1,
  premiumLicense: false,
  dataMigration: false,
  customDevelopment: false,
  training: false,
  hourlyRate: CONSULTANT_HOUR_SEK,
};

// Reuse existing broad models; do not invent estimates for newly selectable industries.
export function bcIndustryModel(name: string): Industry {
  if (["Tillverkningsindustri", "Livsmedel & Processindustri"].includes(name)) return "Tillverkning";
  if (name === "Grossist & Distribution") return "Distribution";
  if (["Retail & E-handel", "Mode, Sport & Textil"].includes(name)) return "Handel";
  if (name === "Konsulttjänster") return "Tjänster";
  return "Annan";
}

export function salesIndustryModel(name: string): SalesIndustry {
  if (["Tillverkningsindustri", "Livsmedel & Processindustri"].includes(name)) return "Tillverkning";
  if (name === "Grossist & Distribution") return "Distribution & grossist";
  if (name === "Telekom & IT-tjänster") return "Tech & SaaS";
  if (name === "Finans & Försäkring") return "Finans & försäkring";
  if (name === "Bygg, Entreprenad & Installation") return "Bygg & installation";
  if (name === "Konsulttjänster") return "B2B-tjänster";
  return "Annan";
}

export function canonicalCalculatorIndustry(name: string): string | undefined {
  return INDUSTRY_NAMES.includes(name) ? name : undefined;
}