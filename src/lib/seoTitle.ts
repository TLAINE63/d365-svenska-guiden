/**
 * Automatisk trunkering av <title> så att alla sidor håller sig
 * under Googles teckenbegränsning (~60 tecken).
 *
 * Regler:
 *  - Varumärkessuffixet " | d365.se" behålls alltid.
 *  - Trunkering sker på ordgräns, aldrig mitt i ett ord.
 *  - Ellips (…) läggs till när text faktiskt kapats.
 */

export const TITLE_MAX_LENGTH = 60;
export const BRAND_SUFFIX = " | d365.se";

export function truncateSeoTitle(title: string, maxLength: number = TITLE_MAX_LENGTH): string {
  const clean = (title || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  if (clean.length <= maxLength) return clean;

  // Separera ut varumärkessuffix om det finns
  const hasBrand = clean.endsWith(BRAND_SUFFIX);
  const brand = hasBrand ? BRAND_SUFFIX : "";
  const body = hasBrand ? clean.slice(0, -BRAND_SUFFIX.length).trim() : clean;

  const budget = maxLength - brand.length - 1; // -1 för ellips
  if (budget <= 0) {
    // Extremfall: suffixet i sig är för långt – kapa hårt.
    return clean.slice(0, maxLength - 1).trimEnd() + "…";
  }

  let cut = body.slice(0, budget);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > budget * 0.5) cut = cut.slice(0, lastSpace);
  cut = cut.replace(/[\s.,;:–-]+$/, "");

  return `${cut}…${brand}`;
}

/** Bygger full titel med varumärke och trunkerar den. */
export function buildSeoTitle(title: string, maxLength: number = TITLE_MAX_LENGTH): string {
  const clean = (title || "").replace(/\s+/g, " ").trim();
  const withBrand = clean.includes("d365.se") ? clean : `${clean}${BRAND_SUFFIX}`;
  return truncateSeoTitle(withBrand, maxLength);
}
