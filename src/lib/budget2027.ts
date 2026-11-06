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

/** Basic pays for meetings with credit against deals; Premium pays only the full deal fee. */
export function forecastRevenue(r: PartnerForecast, _b?: Budget) {
  const p = Math.min(3, Math.max(1, r.products));
  const disc = 1 - Math.min(100, Math.max(0, r.discount)) / 100;
  const subscription = r.forecast === "month" ? MONTH_PRICE[p] * 12 * disc : r.forecast === "year" ? YEAR_PRICE[p] * disc : 0;
  const basic = r.forecast === "basic";
  const finders =
    (basic ? r.meetingsStd * FEES.meetingStd : 0) + r.dealsStd * (FEES.dealStd - (basic ? FEES.meetingStd : 0)) +
    (basic ? r.meetingsFscm * FEES.meetingFscm : 0) + r.dealsFscm * (FEES.dealFscm - (basic ? FEES.meetingFscm : 0)) +
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
export interface Category { key: string; label: string; description: string; unit: number; group: "partner" | "isv" }
export const CATEGORIES: Category[] = [
  ...[1, 2, 3].map((p) => ({ key: `year${p}`, label: `Premium år, ${p} produkt${p > 1 ? "er" : ""}`, description: `Antal partners med ${p === 3 ? "minst 3" : p} produktområd${p > 1 ? "en" : "e"} och en hel årsprenumeration. Årspris före rabatt, motsvarande 10 månadsavgifter.`, unit: YEAR_PRICE[p], group: "partner" as const })),
  ...[1, 2, 3].map((p) => ({ key: `month${p}`, label: `Premium månad, ${p} produkt${p > 1 ? "er" : ""}`, description: `Antal partners med ${p === 3 ? "minst 3" : p} produktområd${p > 1 ? "en" : "e"}. ${MONTH_PRICE[p].toLocaleString("sv-SE")} kr/månad × 12 månader, före rabatt.`, unit: MONTH_PRICE[p] * 12, group: "partner" as const })),
  { key: "meetingsStd", label: "Basic: möten BC/CRM och övrigt", description: "Antal genomförda, avgiftsbelagda möten med Basicpartners. Business Central, Customer Engagement (CRM), Power Platform och andra lösningar. Premium har ingen mötesavgift.", unit: FEES.meetingStd, group: "partner" },
  { key: "dealsStd", label: "Basic: avtal BC/CRM och övrigt", description: "Antal tecknade avtal efter ett avgiftsbelagt möte. Här budgeteras resterande 2 500 kr av totalt 5 000 kr; mötesavgiften budgeteras på mötesraden.", unit: FEES.dealStd - FEES.meetingStd, group: "partner" },
  { key: "meetingsFscm", label: "Basic: möten F&SCM", description: "Antal genomförda, avgiftsbelagda möten för Finance & Supply Chain Management med Basicpartners. Premium har ingen mötesavgift.", unit: FEES.meetingFscm, group: "partner" },
  { key: "dealsFscm", label: "Basic: avtal F&SCM", description: "Antal tecknade avtal efter ett avgiftsbelagt möte. Här budgeteras resterande 5 000 kr av totalt 10 000 kr; mötesavgiften budgeteras på mötesraden.", unit: FEES.dealFscm - FEES.meetingFscm, group: "partner" },
  { key: "premiumDealsStd", label: "Premium: avtal BC/CRM och övrigt", description: "Antal tecknade avtal för Business Central, Customer Engagement (CRM), Power Platform och andra lösningar. Hela avtalsersättningen 5 000 kr, utan mötesavdrag.", unit: FEES.dealStd, group: "partner" },
  { key: "premiumDealsFscm", label: "Premium: avtal F&SCM", description: "Antal tecknade avtal för Finance & Supply Chain Management. Hela avtalsersättningen 10 000 kr, utan mötesavdrag.", unit: FEES.dealFscm, group: "partner" },
  { key: "isvPresence", label: "ISV Presence (inkl. en app)", description: "Antal ISV-leverantörer med Solution Presence under ett helt år. Grundavgiften inkluderar en app per leverantör, före rabatt.", unit: ISV_FEES.base, group: "isv" },
  { key: "isvExtra", label: "ISV extra appar", description: "Totalt antal extra appar utöver den app som ingår per ISV-leverantör med Presence. Årspris per extra app, före rabatt.", unit: ISV_FEES.extraApp, group: "isv" },
  { key: "isvIntroStd", label: "ISV-introduktioner BC/CRM", description: "Antal accepterade partnerintroduktioner för Business Central eller CRM med tecknat avtal. Fast ersättning 3 500 kr; success fee tillkommer separat.", unit: ISV_FEES.introStd, group: "isv" },
  { key: "isvIntroFscm", label: "ISV-introduktioner F&SCM", description: "Antal accepterade partnerintroduktioner för Finance & Supply Chain Management med tecknat avtal. Fast ersättning 7 500 kr; success fee tillkommer separat.", unit: ISV_FEES.introFscm, group: "isv" },
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
    if (r.forecast === "basic") {
      add("meetingsStd", r.meetingsStd, r.meetingsStd * FEES.meetingStd);
      add("dealsStd", r.dealsStd, r.dealsStd * (FEES.dealStd - FEES.meetingStd));
      add("meetingsFscm", r.meetingsFscm, r.meetingsFscm * FEES.meetingFscm);
      add("dealsFscm", r.dealsFscm, r.dealsFscm * (FEES.dealFscm - FEES.meetingFscm));
    } else {
      add("premiumDealsStd", r.dealsStd, r.dealsStd * FEES.dealStd);
      add("premiumDealsFscm", r.dealsFscm, r.dealsFscm * FEES.dealFscm);
    }
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
