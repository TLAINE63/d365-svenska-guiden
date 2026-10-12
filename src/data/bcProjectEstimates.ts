/**
 * Gemensam räknemodell för Business Central-införanden.
 *
 * Synkad med businesscentral.se (src/lib/project-size.ts, src/content/bransch/*,
 * src/content/kostnad.ts), kontrollerad 2026-10-12. Beloppen är räkneexempel:
 * konsultdagar × dagspris. Inget listpris och ingen offert.
 */

export const BC_DAY_RATE = 11_600;
export const BC_ESTIMATES_CHECKED = "2026-10-12";

export type BcQuickstart = { partner: string; name: string; price: string; duration: string };

/** Partnerpublicerade fastprispaket (källa: partnernas webbplatser via businesscentral.se). */
export const BC_QUICKSTARTS: BcQuickstart[] = [
  { partner: "Update", name: "Rapid Start", price: "50 000 kr", duration: "cirka 2 veckor" },
  { partner: "NAB Solutions", name: "Business Central Start", price: "från 50 000 kr", duration: "1–3 veckor" },
];

export type BcTier = "small" | "medium" | "large";

export const BC_TIERS: Record<BcTier, { label: string; days: [number, number] }> = {
  small: { label: "Litet projekt", days: [15, 40] },
  medium: { label: "Medelstort projekt", days: [40, 100] },
  large: { label: "Stort projekt", days: [100, 250] },
};

export type BcIndustryEstimate = {
  name: string;
  days: Record<BcTier, [number, number]>;
};

/** Branschspann i konsultdagar per företagsstorlek, enligt businesscentral.se:s branschguider. */
export const BC_INDUSTRY_ESTIMATES: BcIndustryEstimate[] = [
  { name: "Konsult och tjänster", days: { small: [15, 30], medium: [40, 80], large: [90, 180] } },
  { name: "Grossist och distribution", days: { small: [15, 30], medium: [40, 80], large: [100, 200] } },
  { name: "Detaljhandel och e-handel", days: { small: [15, 30], medium: [50, 100], large: [120, 250] } },
  { name: "Fältservice", days: { small: [20, 40], medium: [50, 100], large: [110, 220] } },
  { name: "Mode och textil", days: { small: [20, 40], medium: [50, 110], large: [120, 250] } },
  { name: "Bygg och entreprenad", days: { small: [20, 40], medium: [60, 120], large: [150, 300] } },
  { name: "Livsmedel", days: { small: [20, 40], medium: [60, 120], large: [150, 300] } },
  { name: "Tillverkning", days: { small: [25, 50], medium: [60, 120], large: [150, 300] } },
];

/** Formaterar belopp kort: 174 000 → "175 000 kr", 1 160 000 → "1,2 MSEK". */
export function fmtBcAmount(sek: number): string {
  if (sek >= 1_000_000) {
    return `${(Math.round(sek / 100_000) / 10).toLocaleString("sv-SE")} MSEK`;
  }
  return `${(Math.round(sek / 5_000) * 5_000).toLocaleString("sv-SE")} kr`;
}

export function fmtBcRange([lo, hi]: [number, number]): string {
  const a = lo * BC_DAY_RATE;
  const b = hi * BC_DAY_RATE;
  if (a >= 1_000_000) {
    return `${(Math.round(a / 100_000) / 10).toLocaleString("sv-SE")}–${(Math.round(b / 100_000) / 10).toLocaleString("sv-SE")} MSEK`;
  }
  return `${fmtBcAmount(a).replace(" kr", "")}${b >= 1_000_000 ? " kr" : ""}–${fmtBcAmount(b)}`;
}
