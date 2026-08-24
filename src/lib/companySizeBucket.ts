import { companySizes } from "@/data/partners";

/**
 * Översätter storleksval i kravspecifikations- och behovsanalysflödena till
 * de standardiserade kundstorleks-bucketarna som partners profilerar sig mot
 * (`companySizes` i src/data/partners.ts).
 *
 * Används för att partnerförslagen ska ta hänsyn till företagets storlek och
 * inte bara produkt + bransch.
 */
const ERP_TEAM_SIZE_MAP: Record<string, string> = {
  "1–25": "1-49",
  "26–50": "1-49",
  "51–100": "50-99",
  "101–250": "100-249",
  "251–500": "250-999",
  "500+": "250-999",
};

/** Sälj-/serviceteamets storlek → ungefärlig bolagsstorlek. */
const TEAM_SIZE_MAP: Record<string, string> = {
  "1–5": "1-49",
  "6–10": "1-49",
  "11–20": "50-99",
  "21–50": "100-249",
  "51–100": "250-999",
  "100+": "1.000-4.999",
};

export const toCompanySizeBucket = (value?: string | null): string | null => {
  if (!value) return null;
  if (companySizes.includes(value)) return value;
  const normalized = value.replace(/-/g, "–");
  return ERP_TEAM_SIZE_MAP[normalized] || TEAM_SIZE_MAP[normalized] || null;
};
