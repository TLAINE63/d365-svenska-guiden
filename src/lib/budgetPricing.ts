/** Internal budget assumptions only; published program terms never read these. */
export interface DealBand { premiumMeeting: number; basicMeeting: number; percent: number; /** Grundprofilens procent vid affär. */ basicPercent?: number; minimum: number; maximum: number }
export interface SwitchMeetingFee { premium: number; basic: number }
/** Bumped when published prices change; older saved price assumptions are replaced by the defaults. */
export const PRICING_VERSION = "2027-prislista";
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
  units: { year1: 8000, year2: 10500, year3: 12000, month1: 1000, month2: 1300, month3: 1500, isvPresence: 3500, isvExtra: 500 },
  isvAnnual: 5000, isvLicensePercent: 0, isvConsultPercent: 0,
  smallLimit: 250000, largeLimit: 1000000,
  bands: {
    // One product-independent rate; medium and large remain compatibility aliases.
    small: { premiumMeeting: 0, basicMeeting: 3500, percent: 2.5, basicPercent: 5, minimum: 0, maximum: 0 },
    medium: { premiumMeeting: 0, basicMeeting: 3500, percent: 2.5, basicPercent: 5, minimum: 0, maximum: 0 },
    large: { premiumMeeting: 0, basicMeeting: 3500, percent: 2.5, basicPercent: 5, minimum: 0, maximum: 0 },
  },
  // Samma mötesavgift gäller för partnerbyte och expertförmedling som för nya projekt.
  switchMeeting: { std: { premium: 0, basic: 3500 }, fscm: { premium: 0, basic: 3500 } },
  expertFee: { short: { premium: 0, basic: 3500 }, long: { premium: 0, basic: 3500 } },
};
export function budgetPricing(input?: Partial<BudgetPricing>): BudgetPricing {
  // Price assumptions saved before the latest price change are dropped; limits stay.
  const saved: Partial<BudgetPricing> | undefined = input && input.version !== PRICING_VERSION ? { smallLimit: input.smallLimit, largeLimit: input.largeLimit } : input;
  return { ...DEFAULT_PRICING, ...saved, units: { ...DEFAULT_PRICING.units, ...saved?.units }, bands: {
    small: { ...DEFAULT_PRICING.bands.small, ...saved?.bands?.small, maximum: 0 },
    medium: { ...DEFAULT_PRICING.bands.medium, ...saved?.bands?.small, maximum: 0 },
    large: { ...DEFAULT_PRICING.bands.small, ...saved?.bands?.small, maximum: 0 },
  }, switchMeeting: {
    std: { premium: saved?.bands?.small?.premiumMeeting ?? 0, basic: saved?.bands?.small?.basicMeeting ?? 3500 },
    fscm: { premium: saved?.bands?.small?.premiumMeeting ?? 0, basic: saved?.bands?.small?.basicMeeting ?? 3500 },
  }, expertFee: {
    short: { premium: saved?.bands?.small?.premiumMeeting ?? 0, basic: saved?.bands?.small?.basicMeeting ?? 3500 },
    long: { premium: saved?.bands?.small?.premiumMeeting ?? 0, basic: saved?.bands?.small?.basicMeeting ?? 3500 },
  },
  // ISV Finder's fee is paused: always 0 % regardless of older saved budgets.
  isvLicensePercent: 0, isvConsultPercent: 0, version: PRICING_VERSION };
}
export function dealPricing(value: number, tier: "basic" | "premium", pricing: BudgetPricing) {
  return dealBandPricing(value, tier, pricing.bands.small);
}
export function dealBandPricing(value: number, tier: "basic" | "premium", band: DealBand) {
  const percent = tier === "basic" ? (band.basicPercent ?? band.percent) : band.percent;
  const raw = Math.max(0, value) * percent / 100;
  const commission = value > 0 && percent > 0 ? Math.max(band.minimum, raw) : 0;
  return { meeting: tier === "basic" ? band.basicMeeting : band.premiumMeeting, commission };
}