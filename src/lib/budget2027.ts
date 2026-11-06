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
export type Period = "year" | "month";
/** amount is per period; month amounts count ×12 in the annual budget. */
export interface CostLine { name: string; amount: number; custom?: boolean; period?: Period }
export interface RevenueLine { name: string; amount: number; period?: Period }
export const annual = (l: { amount: number; period?: Period }) => (Number(l.amount) || 0) * (l.period === "month" ? 12 : 1);

// ISV Solution Presence (per year) and finders fee for accepted partner introductions.
export const ISV_FEES = { base: 5990, extraApp: 995, introStd: 3500, introFscm: 7500, successRate: 0.025 };
export interface IsvForecast { presence: boolean; extraApps: number; discount: number; introsStd: number; introsFscm: number; successBasis: number }
export function isvRevenue(r: IsvForecast) {
  const disc = 1 - Math.min(100, Math.max(0, r.discount)) / 100;
  const subscription = r.presence ? (ISV_FEES.base + Math.max(0, r.extraApps) * ISV_FEES.extraApp) * disc : 0;
  const finders = r.introsStd * ISV_FEES.introStd + r.introsFscm * ISV_FEES.introFscm + r.successBasis * ISV_FEES.successRate;
  return { subscription, finders, total: subscription + finders };
}

export interface Budget {
  partners: Record<string, PartnerForecast>; isvs?: Record<string, IsvForecast>; otherRevenue?: RevenueLine[];
  costs: CostLine[]; ownHours: number; hourlyRate: number;
  estimates?: Record<string, number>;
}

export const DEFAULT_BUDGET: Budget = {
  partners: {},
  costs: [
    { name: "Lovable", amount: 0 }, { name: "Google Ads", amount: 0 }, { name: "LinkedIn-annonsering", amount: 0 },
    { name: "Riverside", amount: 0 }, { name: "Descript", amount: 0 },
    { name: "ChatGPT", amount: 0 }, { name: "Claude", amount: 0 }, { name: "Snitcher", amount: 0 }, { name: "TLDX", amount: 0 },
    { name: "", amount: 0, custom: true }, { name: "", amount: 0, custom: true }, { name: "", amount: 0, custom: true },
  ],
  isvs: {},
  otherRevenue: [{ name: "", amount: 0, period: "month" }, { name: "", amount: 0, period: "month" }, { name: "", amount: 0, period: "year" }],
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

export function totals(rows: PartnerForecast[], b: Budget, isvRows: IsvForecast[] = []) {
  let subscription = 0, finders = 0, yearCount = 0, monthCount = 0, products = 0;
  for (const r of rows) {
    const x = forecastRevenue(r);
    subscription += x.subscription; finders += x.finders;
    if (r.forecast === "year") yearCount++;
    if (r.forecast === "month") monthCount++;
    if (r.forecast === "year" || r.forecast === "month") products += r.products;
  }
  const partnerRevenue = subscription + finders;
  let isvSubscription = 0, isvFinders = 0, isvCount = 0;
  for (const r of isvRows) { const x = isvRevenue(r); isvSubscription += x.subscription; isvFinders += x.finders; if (r.presence) isvCount++; }
  const other = (b.otherRevenue ?? []).reduce((s, l) => s + annual(l), 0);
  const revenue = partnerRevenue + isvSubscription + isvFinders + other;
  const externalCosts = b.costs.reduce((s, c) => s + annual(c), 0);
  const ownTimeCost = b.ownHours * b.hourlyRate;
  return { subscription, finders, partnerRevenue, isvSubscription, isvFinders, isvCount, other, revenue, yearCount, monthCount, products, externalCosts, ownTimeCost, result: revenue - externalCosts - ownTimeCost };
}

// Rough top-down estimate per category, compared against the sum of partner/ISV detail rows.
export interface Category { key: string; label: string; unit: number; group: "partner" | "isv" }
export const CATEGORIES: Category[] = [
  ...[1, 2, 3].map((p) => ({ key: `year${p}`, label: `Premium år, ${p} produkt${p > 1 ? "er" : ""}`, unit: YEAR_PRICE[p], group: "partner" as const })),
  ...[1, 2, 3].map((p) => ({ key: `month${p}`, label: `Premium månad, ${p} produkt${p > 1 ? "er" : ""}`, unit: MONTH_PRICE[p] * 12, group: "partner" as const })),
  { key: "meetingsStd", label: "Finders fee: möten BC/CE", unit: FEES.meetingStd, group: "partner" },
  { key: "dealsStd", label: "Finders fee: avtal BC/CE", unit: FEES.dealStd - FEES.meetingStd, group: "partner" },
  { key: "meetingsFscm", label: "Finders fee: möten F&SCM", unit: FEES.meetingFscm, group: "partner" },
  { key: "dealsFscm", label: "Finders fee: avtal F&SCM", unit: FEES.dealFscm - FEES.meetingFscm, group: "partner" },
  { key: "isvPresence", label: "ISV Presence (inkl. en app)", unit: ISV_FEES.base, group: "isv" },
  { key: "isvExtra", label: "ISV extra appar", unit: ISV_FEES.extraApp, group: "isv" },
  { key: "isvIntroStd", label: "ISV-introduktioner BC/CRM", unit: ISV_FEES.introStd, group: "isv" },
  { key: "isvIntroFscm", label: "ISV-introduktioner F&SCM", unit: ISV_FEES.introFscm, group: "isv" },
];

/** Count and revenue (after discounts) per category from the detail rows. Success fees are not categories. */
export function detailByCategory(rows: PartnerForecast[], isvRows: IsvForecast[]) {
  const out: Record<string, { count: number; revenue: number }> = {};
  for (const c of CATEGORIES) out[c.key] = { count: 0, revenue: 0 };
  const add = (k: string, n: number, rev: number) => { out[k].count += n; out[k].revenue += rev; };
  for (const r of rows) {
    const p = Math.min(3, Math.max(1, r.products));
    const disc = 1 - Math.min(100, Math.max(0, r.discount)) / 100;
    if (r.forecast === "year") add(`year${p}`, 1, YEAR_PRICE[p] * disc);
    if (r.forecast === "month") add(`month${p}`, 1, MONTH_PRICE[p] * 12 * disc);
    add("meetingsStd", r.meetingsStd, r.meetingsStd * FEES.meetingStd);
    add("dealsStd", r.dealsStd, r.dealsStd * (FEES.dealStd - FEES.meetingStd));
    add("meetingsFscm", r.meetingsFscm, r.meetingsFscm * FEES.meetingFscm);
    add("dealsFscm", r.dealsFscm, r.dealsFscm * (FEES.dealFscm - FEES.meetingFscm));
  }
  for (const r of isvRows) {
    const disc = 1 - Math.min(100, Math.max(0, r.discount)) / 100;
    if (r.presence) { add("isvPresence", 1, ISV_FEES.base * disc); add("isvExtra", r.extraApps, r.extraApps * ISV_FEES.extraApp * disc); }
    add("isvIntroStd", r.introsStd, r.introsStd * ISV_FEES.introStd);
    add("isvIntroFscm", r.introsFscm, r.introsFscm * ISV_FEES.introFscm);
  }
  return out;
}
export const estimateRevenue = (est: Record<string, number> = {}) => CATEGORIES.reduce((s, c) => s + (Number(est[c.key]) || 0) * c.unit, 0);

/** Keeps saved cost rows and adds any fixed default rows missing from older saves, before the custom rows. */
export function mergeCosts(saved?: CostLine[]): CostLine[] {
  if (!saved?.length) return DEFAULT_BUDGET.costs;
  const fixed = DEFAULT_BUDGET.costs.filter((c) => !c.custom).map((c) => saved.find((x) => !x.custom && x.name === c.name) ?? c);
  const extra = saved.filter((x) => !x.custom && !fixed.some((f) => f.name === x.name));
  return [...fixed, ...extra, ...saved.filter((x) => x.custom)];
}
