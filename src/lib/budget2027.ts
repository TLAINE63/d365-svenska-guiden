// Budget 2027: pure calculation helpers, prices from the partner program (excl. VAT).
export const BUDGET_KEY = "budget_2027";
export type Forecast = "none" | "basic" | "month" | "year";

export const MONTH_PRICE: Record<number, number> = { 1: 995, 2: 1595, 3: 1995 };
export const YEAR_PRICE: Record<number, number> = { 1: 9950, 2: 15950, 3: 19950 };
export const FEES = { meetingStd: 2500, dealStd: 5000, meetingFscm: 5000, dealFscm: 10000, successRate: 0.025 };

export interface PartnerForecast {
  forecast: Forecast; products: number; discount: number;
  meetingsStd: number; dealsStd: number; meetingsFscm: number; dealsFscm: number; successBasis: number;
}
export interface CostLine { name: string; amount: number; custom?: boolean }
export interface Budget { partners: Record<string, PartnerForecast>; costs: CostLine[]; ownHours: number; hourlyRate: number }

export const DEFAULT_BUDGET: Budget = {
  partners: {},
  costs: [
    { name: "Lovable", amount: 0 }, { name: "Google Ads", amount: 0 }, { name: "LinkedIn-annonsering", amount: 0 },
    { name: "Riverside", amount: 0 }, { name: "Descript", amount: 0 },
    { name: "", amount: 0, custom: true }, { name: "", amount: 0, custom: true }, { name: "", amount: 0, custom: true },
  ],
  ownHours: 0,
  hourlyRate: 0,
};

export function currentProducts(pf: any): number {
  const has = (k: string) => Array.isArray(pf?.[k]?.industries) && pf[k].industries.length > 0;
  return Math.min(3, (has("bc") ? 1 : 0) + (has("fsc") ? 1 : 0) + (has("sales") || has("service") ? 1 : 0));
}

/** Meeting fee is credited against the deal fee, so a deal adds (deal − meeting). */
export function forecastRevenue(r: PartnerForecast, _b?: Budget) {
  const p = Math.min(3, Math.max(1, r.products));
  const disc = 1 - Math.min(100, Math.max(0, r.discount)) / 100;
  const subscription = r.forecast === "month" ? MONTH_PRICE[p] * 12 * disc : r.forecast === "year" ? YEAR_PRICE[p] * disc : 0;
  const finders =
    r.meetingsStd * FEES.meetingStd + r.dealsStd * (FEES.dealStd - FEES.meetingStd) +
    r.meetingsFscm * FEES.meetingFscm + r.dealsFscm * (FEES.dealFscm - FEES.meetingFscm) +
    (r.successBasis > 100000 ? r.successBasis * FEES.successRate : 0);
  return { subscription, finders, total: subscription + finders };
}

export function totals(rows: PartnerForecast[], b: Budget) {
  let subscription = 0, finders = 0, yearCount = 0, monthCount = 0, products = 0;
  for (const r of rows) {
    const x = forecastRevenue(r);
    subscription += x.subscription; finders += x.finders;
    if (r.forecast === "year") yearCount++;
    if (r.forecast === "month") monthCount++;
    if (r.forecast === "year" || r.forecast === "month") products += r.products;
  }
  const revenue = subscription + finders;
  const externalCosts = b.costs.reduce((s, c) => s + (Number(c.amount) || 0), 0);
  const ownTimeCost = b.ownHours * b.hourlyRate;
  return { subscription, finders, revenue, yearCount, monthCount, products, externalCosts, ownTimeCost, result: revenue - externalCosts - ownTimeCost };
}
