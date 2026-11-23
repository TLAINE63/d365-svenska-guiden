/** Internal budget assumptions only; published program terms never read these. */
export interface DealBand { premiumMeeting: number; basicMeeting: number; percent: number; minimum: number; maximum: number }
export interface SwitchMeetingFee { premium: number; basic: number }
export interface BudgetPricing {
  units: Record<string, number>;
  isvAnnual: number;
  isvLicensePercent: number;
  isvConsultPercent: number;
  smallLimit: number;
  largeLimit: number;
  bands: { small: DealBand; medium: DealBand; large: DealBand };
  /** Partnerbytesarvode: mötesavgift per affärsstorlek och nivå, ingen provision. */
  switchMeeting: { std: SwitchMeetingFee; fscm: SwitchMeetingFee };
  /** Expertförmedling: fast avgift per tillsatt uppdrag (utkast 2026-11-17). */
  expertFee: { short: SwitchMeetingFee; long: SwitchMeetingFee };
}
export const DEFAULT_PRICING: BudgetPricing = {
  units: { year1: 7990, year2: 9990, year3: 11990, month1: 995, month2: 1295, month3: 1495, isvPresence: 2990, isvExtra: 499 },
  isvAnnual: 4990, isvLicensePercent: 0, isvConsultPercent: 0,
  smallLimit: 250000, largeLimit: 1000000,
  bands: {
    small: { premiumMeeting: 1500, basicMeeting: 1500, percent: 2.5, minimum: 3000, maximum: 0 },
    medium: { premiumMeeting: 3000, basicMeeting: 5000, percent: 2.5, minimum: 0, maximum: 0 },
    large: { premiumMeeting: 6000, basicMeeting: 9000, percent: 2.5, minimum: 0, maximum: 100000 },
  },
  switchMeeting: { std: { premium: 3000, basic: 5000 }, fscm: { premium: 6000, basic: 9000 } },
  expertFee: { short: { premium: 7500, basic: 12500 }, long: { premium: 15000, basic: 25000 } },
};
export function budgetPricing(saved?: Partial<BudgetPricing>): BudgetPricing {
  return { ...DEFAULT_PRICING, ...saved, units: { ...DEFAULT_PRICING.units, ...saved?.units }, bands: {
    small: { ...DEFAULT_PRICING.bands.small, ...saved?.bands?.small },
    medium: { ...DEFAULT_PRICING.bands.medium, ...saved?.bands?.medium },
    large: { ...DEFAULT_PRICING.bands.large, ...saved?.bands?.large },
  }, switchMeeting: {
    std: { ...DEFAULT_PRICING.switchMeeting.std, ...(saved?.switchMeeting as any)?.std },
    fscm: { ...DEFAULT_PRICING.switchMeeting.fscm, ...(saved?.switchMeeting as any)?.fscm },
  }, expertFee: {
    short: { ...DEFAULT_PRICING.expertFee.short, ...saved?.expertFee?.short },
    long: { ...DEFAULT_PRICING.expertFee.long, ...saved?.expertFee?.long },
  },
  // ISV Finder's fee is paused: always 0 % regardless of older saved budgets.
  isvLicensePercent: 0, isvConsultPercent: 0 };
}
export function dealPricing(value: number, tier: "basic" | "premium", pricing: BudgetPricing) {
  const band = value < pricing.smallLimit ? pricing.bands.small : value <= pricing.largeLimit ? pricing.bands.medium : pricing.bands.large;
  return dealBandPricing(value, tier, band);
}
export function dealBandPricing(value: number, tier: "basic" | "premium", band: DealBand) {
  const raw = Math.max(0, value) * band.percent / 100;
  const commission = value > 0 && band.percent > 0 ? Math.min(band.maximum > 0 ? band.maximum : Infinity, Math.max(band.minimum, raw)) : 0;
  return { meeting: tier === "basic" ? band.basicMeeting : band.premiumMeeting, commission };
}