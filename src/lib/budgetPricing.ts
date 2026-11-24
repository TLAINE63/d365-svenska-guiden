/** Internal budget assumptions only; published program terms never read these. */
export interface DealBand { premiumMeeting: number; basicMeeting: number; percent: number; minimum: number; maximum: number }
export interface SwitchMeetingFee { premium: number; basic: number }
/** Bumped when published prices change; older saved price assumptions are replaced by the defaults. */
export const PRICING_VERSION = "2026-11-24";
export interface BudgetPricing {
  version?: string;
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
  version: PRICING_VERSION,
  units: { year1: 8000, year2: 9000, year3: 10000, month1: 1000, month2: 1150, month3: 1300, isvPresence: 3000, isvExtra: 500 },
  isvAnnual: 5000, isvLicensePercent: 0, isvConsultPercent: 0,
  smallLimit: 250000, largeLimit: 1000000,
  bands: {
    // Finder's fee 2026-11-24: band 1 BC/Power Platform/Copilot, band 2 CRM, band 3 F&SCM m.fl.
    small: { premiumMeeting: 1000, basicMeeting: 3000, percent: 2.5, minimum: 0, maximum: 100000 },
    medium: { premiumMeeting: 1500, basicMeeting: 4000, percent: 2.5, minimum: 0, maximum: 100000 },
    large: { premiumMeeting: 2000, basicMeeting: 5000, percent: 2.5, minimum: 0, maximum: 100000 },
  },
  // Samma mötesavgift gäller för partnerbyte och expertförmedling som för nya projekt.
  switchMeeting: { std: { premium: 1500, basic: 4000 }, fscm: { premium: 2000, basic: 5000 } },
  expertFee: { short: { premium: 1500, basic: 4000 }, long: { premium: 2000, basic: 5000 } },
};
export function budgetPricing(input?: Partial<BudgetPricing>): BudgetPricing {
  // Price assumptions saved before the latest price change are dropped; limits stay.
  const saved: Partial<BudgetPricing> | undefined = input && input.version !== PRICING_VERSION ? { smallLimit: input.smallLimit, largeLimit: input.largeLimit } : input;
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
  isvLicensePercent: 0, isvConsultPercent: 0, version: PRICING_VERSION };
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