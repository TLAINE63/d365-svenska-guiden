import { budgetPricing, dealPricing, dealBandPricing, type BudgetPricing } from "./budgetPricing";
import { FINDERS_FEE_VARIANTS } from "./partnerOrder";
// Budget 2027: pure calculation helpers, prices from the partner program (excl. VAT).
export const BUDGET_KEY = "budget_2027";
export type Forecast = "none" | "basic" | "month" | "year";

export const MONTH_PRICE: Record<number, number> = { 1: 1000, 2: 1300, 3: 1500 };
export const YEAR_PRICE: Record<number, number> = { 1: 8000, 2: 10500, 3: 12000 };
export const FEES = { meetingStd: 0, dealStd: 5000, meetingFscm: 0, dealFscm: 10000, successRate: 0.025 };

export interface PartnerForecast {
  forecast: Forecast; products: number; discount: number;
  meetingsStd: number; dealsStd: number; meetingsFscm: number; dealsFscm: number; successBasis: number;
  /** Möten och vunna affärer per affärsstorlek (samma band som tratten). Ersätter de gamla produktfälten. */
  deals?: Partial<Record<DealBandKey, { meetings?: number; wins?: number }>>;
}
export type DealBandKey = "small" | "medium" | "large";
export const DEAL_BAND_KEYS: DealBandKey[] = ["small"];
/** Merge every legacy product band into one row without mutating saved data. */
export function partnerDeals(r: PartnerForecast, pricing = budgetPricing()): Record<DealBandKey, { meetings: number; wins: number }> {
  const z = (v?: number) => Math.max(0, Number(v) || 0);
  if (r.deals) return {
    small: { meetings: z(r.deals.small?.meetings) + z(r.deals.medium?.meetings) + z(r.deals.large?.meetings), wins: z(r.deals.small?.wins) + z(r.deals.medium?.wins) + z(r.deals.large?.wins) },
    medium: { meetings: 0, wins: 0 },
    large: { meetings: 0, wins: 0 },
  };
  const out = { small: { meetings: z(r.meetingsStd) + z(r.meetingsFscm), wins: z(r.dealsStd) + z(r.dealsFscm) }, medium: { meetings: 0, wins: 0 }, large: { meetings: 0, wins: 0 } };
  const b = z(r.successBasis);
  if (b > 0 && out.small.wins + out.large.wins === 0) out.small.wins += 1;
  return out;
}
/** Finder's fee per partner with the funnel's band rules: meeting fee, deal fee minus paid meeting (never negative). */
export function partnerFinders(r: PartnerForecast, b?: Budget) {
  const pricing = budgetPricing(b?.pricing);
  const tier = r.forecast === "basic" ? "basic" : "premium";
  const d = partnerDeals(r, pricing);
  let meetings = 0, wins = 0;
  for (const t of FUNNEL_DEAL_TYPES) {
    const row = dealFunnelRow(t, tier, d[t.band], b?.successValues ?? {}, pricing);
    meetings += row.meetings; wins += row.wins;
  }
  return { meetings, wins, total: meetings + wins, d };
}
export type Period = "year" | "month";
/** amount is per period; month amounts count ×12 in the annual budget. */
export interface CostLine { name: string; amount: number; id?: string; custom?: boolean; period?: Period }
export interface RevenueLine { name: string; amount: number; period?: Period }
export const annual = (l: { amount: number; period?: Period }) => (Number(l.amount) || 0) * (l.period === "month" ? 12 : 1);

// ISV Presence (per year) and finders fee for accepted partner introductions.
/** ISV Business Referral (Thomas 2026-11-13): 5 % of ISV net licence/subscription revenue first 12 months, 2,5 % of a referred consulting assignment; no fixed fees. Old intro keys kept at 0 so saved budgets survive. */
export const ISV_FEES = { base: 5000, introFirstYear: 3500, includedApps: 3, extraApp: 500, introStd: 0, introFscm: 0, licenseRate: 0.05, consultRate: 0.025, successRate: 0.05 };
/** Expert brokerage: flat fee per placed assignment (Thomas 2026-11-17). Short = up to 6 months or under half-time; long = longer or at least half-time. */
export const EXPERT_FEES = { shortPremium: 0, shortBasic: 3500, longPremium: 0, longBasic: 3500 };
export interface IsvForecast { presence: boolean; extraApps: number; discount: number; introsStd: number; introsFscm: number; successBasis: number; consultBasis?: number; /** New ISV pays the 3 500 kr intro price first year; default true. */ introPrice?: boolean }
export const isvBaseFee = (r: { introPrice?: boolean }, pricing = budgetPricing()) => (r.introPrice === false ? pricing.isvAnnual : pricing.units.isvPresence);
export function isvRevenue(r: IsvForecast, pricing = budgetPricing()) {
  const disc = 1 - Math.min(100, Math.max(0, r.discount)) / 100;
  const subscription = r.presence ? (isvBaseFee(r, pricing) + Math.max(0, r.extraApps) * pricing.units.isvExtra) * disc : 0;
  const finders = Math.max(0, r.successBasis) * pricing.isvLicensePercent / 100 + Math.max(0, r.consultBasis ?? 0) * pricing.isvConsultPercent / 100;
  return { subscription, finders, total: subscription + finders };
}

export interface Budget {
  partners: Record<string, PartnerForecast>; isvs?: Record<string, IsvForecast>; otherRevenue?: RevenueLine[];
  costs: CostLine[]; ownHours: number; hourlyRate: number;
  estimates?: Record<string, number>;
  /** Average eligible revenue per won deal; legacy value keys retained for saved budgets. */
  successValues?: Record<string, number>;
  /** Finders fee funnel per deal band, expert selling and ISV. */
  funnel?: Funnel;
  pricing?: BudgetPricing;
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

/** Grundprofil pays for meetings with credit against deals; Premium pays only the full deal fee. */
export function forecastRevenue(r: PartnerForecast, b?: Budget) {
  const pricing = budgetPricing(b?.pricing);
  const p = Math.min(3, Math.max(1, r.products));
  const disc = 1 - Math.min(100, Math.max(0, r.discount)) / 100;
  const subscription = r.forecast === "month" ? pricing.units[`month${p}`] * 12 * disc : r.forecast === "year" ? pricing.units[`year${p}`] * disc : 0;
  const tier = r.forecast === "basic" ? "basic" : "premium";
  void tier;
  const finders = partnerFinders(r, b).total;
  return { subscription, finders, total: subscription + finders };
}

export function totals(rows: PartnerForecast[], b: Budget, isvRows: IsvForecast[] = []) {
  let subscription = 0, finders = 0, yearCount = 0, monthCount = 0, products = 0;
  for (const r of rows) {
    const x = forecastRevenue(r, b);
    subscription += x.subscription; finders += x.finders;
    if (r.forecast === "year") yearCount++;
    if (r.forecast === "month") monthCount++;
    if (r.forecast === "year" || r.forecast === "month") products += r.products;
  }
  const partnerRevenue = subscription + finders;
  let isvSubscription = 0, isvFinders = 0, isvCount = 0;
  for (const r of isvRows) { const x = isvRevenue(r, budgetPricing(b.pricing)); isvSubscription += x.subscription; isvFinders += x.finders; if (r.presence) isvCount++; }
  const other = (b.otherRevenue ?? []).reduce((s, l) => s + annual(l), 0);
  const revenue = partnerRevenue + isvSubscription + isvFinders + other;
  const externalCosts = b.costs.reduce((s, c) => s + annual(c), 0);
  const ownTimeCost = b.ownHours * b.hourlyRate;
  return { subscription, finders, partnerRevenue, isvSubscription, isvFinders, isvCount, other, revenue, yearCount, monthCount, products, externalCosts, ownTimeCost, result: revenue - externalCosts - ownTimeCost };
}

// Rough top-down estimate per category, compared against the sum of partner/ISV detail rows.
export interface Category { key: string; label: string; description: string; unit: number; group: "partner" | "isv"; income: "subscription" | "finders"; success?: boolean; per?: string }
/** Success fee areas: unit = 2,5 % of the assumed average project value, only when it exceeds 100 000 kr. Default values are editable assumptions. */
export const SUCCESS_AREAS = [
  { key: "successBc", label: "Business Central", value: 400000 },
  { key: "successCrm", label: "CRM (Customer Engagement)", value: 400000 },
  { key: "successFscm", label: "Finance & Supply Chain Management", value: 3000000 },
  { key: "successPp", label: "Power Platform och AI", value: 200000 },
  { key: "successExpert", label: "CV- och expertuppdrag", value: 300000 },
];
export const successUnit = (value: number) => (value > 100000 ? Math.round(value * FEES.successRate) : 0);
export const successValue = (key: string, values: Record<string, number> = {}) => values[key] ?? SUCCESS_AREAS.find((a) => a.key === key)?.value ?? 0;
export const unitFor = (c: Category, values: Record<string, number> = {}, pricing = budgetPricing()) => (c.success ? dealPricing(successValue(c.key, values), "premium", pricing).commission : (pricing.units[c.key] ?? c.unit) * (c.key.startsWith("month") ? 12 : 1));
export const CATEGORIES: Category[] = [
  ...[1, 2, 3].map((p) => ({ key: `year${p}`, label: `Premium år, ${p} produkt${p > 1 ? "er" : ""}`, description: `Antal partners med ${p === 3 ? "minst 3" : p} produktområd${p > 1 ? "en" : "e"} och en hel årsprenumeration. Årspris före rabatt, betalt i förskott.`, unit: YEAR_PRICE[p], group: "partner" as const, income: "subscription" as const })),
  ...[1, 2, 3].map((p) => ({ key: `month${p}`, label: `Premium månad, ${p} produkt${p > 1 ? "er" : ""}`, description: `Antal partners med ${p === 3 ? "minst 3" : p} produktområd${p > 1 ? "en" : "e"}. ${MONTH_PRICE[p].toLocaleString("sv-SE")} kr/månad × 12 månader, före rabatt.`, unit: MONTH_PRICE[p] * 12, group: "partner" as const, income: "subscription" as const })),
  { key: "meetingsStd", label: "Grundprofil: möten BC/CRM och övrigt", description: "Äldre rad: kvalificerat kundmöte kostar nu 3 500 kr för Grundprofil och 0 kr för Premium (räknas i tratten). Raden finns kvar för sparade budgetar.", unit: FEES.meetingStd, group: "partner", income: "finders" },
  { key: "dealsStd", label: "Grundprofil: avtal BC/CRM och övrigt", description: "Antal tecknade kundavtal. Äldre rad: vid vunnen affär gäller nu 5 % av fakturerat värde för Grundprofil. Raden finns kvar för sparade budgetar.", unit: FEES.dealStd - FEES.meetingStd, group: "partner", income: "finders" },
  { key: "meetingsFscm", label: "Grundprofil: möten F&SCM", description: "Äldre rad: kvalificerat kundmöte kostar nu 3 500 kr för Grundprofil och 0 kr för Premium (räknas i tratten). Raden finns kvar för sparade budgetar.", unit: FEES.meetingFscm, group: "partner", income: "finders" },
  { key: "dealsFscm", label: "Grundprofil: avtal F&SCM", description: "Antal tecknade avtal. Äldre rad: vid vunnen affär gäller nu 5 % av fakturerat värde för Grundprofil. Raden finns kvar för sparade budgetar.", unit: FEES.dealFscm - FEES.meetingFscm, group: "partner", income: "finders" },
  { key: "premiumDealsStd", label: "Premium: avtal BC/CRM och övrigt", description: "Antal tecknade avtal för Business Central, Customer Engagement (CRM), Power Platform och andra lösningar. Äldre rad: vid vunnen affär gäller nu 2,5 % av fakturerat värde för Premium.", unit: FEES.dealStd, group: "partner", income: "finders" },
  { key: "premiumDealsFscm", label: "Premium: avtal F&SCM", description: "Antal tecknade avtal för Finance & Supply Chain Management. Äldre rad: vid vunnen affär gäller nu 2,5 % av fakturerat värde för Premium.", unit: FEES.dealFscm, group: "partner", income: "finders" },
  { key: "expertCvHours", label: "Expertförmedling: Premiumpartner", description: "Expertförmedling följer samma villkor som övrig affärsförmedling: 0 kr per möte och 2,5 % vid vunnen affär för Premium. Budgeteras i experttratten. Nyckeln finns kvar för sparade budgetar.", unit: EXPERT_FEES.shortPremium, per: "tillsatt uppdrag", group: "partner", income: "finders" },
  { key: "expertAssignmentHours", label: "Expertförmedling: Grundprofil", description: "Expertförmedling följer samma villkor som övrig affärsförmedling: 3 500 kr per möte och 5 % vid vunnen affär för Grundprofil. Budgeteras i experttratten. Nyckeln finns kvar för sparade budgetar.", unit: EXPERT_FEES.shortBasic, per: "tillsatt uppdrag", group: "partner", income: "finders" },
  { key: "isvPresence", label: "ISV Presence (inkl. tre appar)", description: "Antal ISV-leverantörer med ISV Presence under ett helt år. Nya ISV:er räknas med introduktionspriset 3 500 kr första året inklusive tre appar, före rabatt.", unit: ISV_FEES.introFirstYear, group: "isv", income: "subscription" },
  { key: "isvExtra", label: "ISV extra appar", description: "Totalt antal extra appar utöver de tre appar som ingår per ISV-leverantör med Presence. Årspris per extra app, före rabatt.", unit: ISV_FEES.extraApp, group: "isv", income: "subscription" },
  { key: "isvIntroStd", label: "ISV Business Referral: licenser (5 %)", description: "Business Referral räknas i ISV-tratten som 5 % av ISV:ns nettointäkter från licenser eller abonnemang under affärens första 12 månader. Raden ger 0 kr och finns kvar för sparade budgetar.", unit: ISV_FEES.introStd, group: "isv", income: "finders" },
  { key: "isvIntroFscm", label: "ISV Business Referral: konsult (2,5 %)", description: "Business Referral räknas i ISV-tratten som 2,5 % av nettointäkterna från ett förmedlat konsultuppdrag. Raden ger 0 kr och finns kvar för sparade budgetar.", unit: ISV_FEES.introFscm, group: "isv", income: "finders" },
  ...SUCCESS_AREAS.map((a) => ({ key: a.key, label: `Success fee: ${a.label}`, description: `Antal vunna affärer. Ange ett antaget snittbelopp per affär; Premium betalar 2,5 % och Grundprofil 5 % av fakturerat värde, utan maxbelopp.`, unit: 0, group: "partner" as const, income: "finders" as const, success: true })),
];

/** Count and revenue (after discounts) per category from the detail rows. Success fees are not categories. */
export function detailByCategory(rows: PartnerForecast[], isvRows: IsvForecast[], b?: Budget) {
  const pricing = budgetPricing(b?.pricing);
  const out: Record<string, { count: number; revenue: number }> = {};
  for (const c of CATEGORIES) out[c.key] = { count: 0, revenue: 0 };
  const add = (k: string, n: number, rev: number) => { out[k].count += n; out[k].revenue += rev; };
  for (const r of rows) {
    const p = Math.min(3, Math.max(1, r.products));
    const disc = 1 - Math.min(100, Math.max(0, r.discount)) / 100;
    if (r.forecast === "year") add(`year${p}`, 1, pricing.units[`year${p}`] * disc);
    if (r.forecast === "month") add(`month${p}`, 1, pricing.units[`month${p}`] * 12 * disc);
    const f = partnerFinders(r, b);
    add("meetingsStd", DEAL_BAND_KEYS.reduce((s, k) => s + f.d[k].meetings, 0), f.meetings);
    add("successBc", DEAL_BAND_KEYS.reduce((s, k) => s + f.d[k].wins, 0), f.wins);
  }
  for (const r of isvRows) {
    const disc = 1 - Math.min(100, Math.max(0, r.discount)) / 100;
    if (r.presence) { add("isvPresence", 1, isvBaseFee(r, pricing) * disc); add("isvExtra", r.extraApps, r.extraApps * pricing.units.isvExtra * disc); }
    add("isvIntroStd", r.successBasis > 0 ? 1 : 0, Math.max(0, r.successBasis) * pricing.isvLicensePercent / 100);
    add("isvIntroFscm", (r.consultBasis ?? 0) > 0 ? 1 : 0, Math.max(0, r.consultBasis ?? 0) * pricing.isvConsultPercent / 100);
  }
  return out;
}
/** Subscriptions come from the category estimates; finders fee only from the funnel, so nothing is counted twice. */
export const estimateRevenue = (est: Record<string, number> = {}, values: Record<string, number> = {}, funnel: Funnel = {}, pricing = budgetPricing()) =>
  CATEGORIES.filter((c) => c.income === "subscription").reduce((s, c) => s + (Number(est[c.key]) || 0) * unitFor(c, values, pricing), 0) + funnelTotals(funnel, values, pricing).total;

export function categoryGroupSummary(est: Record<string, number> = {}, details: Record<string, { count: number; revenue: number }> = {}, values: Record<string, number> = {}, funnel: Funnel = {}, pricing = budgetPricing()) {
  const ft = funnelTotals(funnel, values, pricing);
  const funnelFor = (name: Category["group"]) => (name === "partner" ? ft.partner + ft.expert : ft.isv);
  const sum = (name: Category["group"], income?: Category["income"]) => CATEGORIES.filter((c) => c.group === name && (!income || c.income === income)).reduce((s, c) => ({
    estimate: s.estimate + (c.income === "subscription" ? (Number(est[c.key]) || 0) * unitFor(c, values, pricing) : 0),
    detail: s.detail + (details[c.key]?.revenue ?? 0),
  }), { estimate: income === "subscription" ? 0 : funnelFor(name), detail: 0 });
  const group = (name: Category["group"]) => ({ ...sum(name), subscription: sum(name, "subscription"), finders: sum(name, "finders") });
  return { partner: group("partner"), isv: group("isv") };
}

/** Counts distinct catalog products per vendor without merging different brands by guesswork. */
export function budgetIsvVendors(solutions: { id: string; vendor: string; name: string }[]) {
  const vendors = new Map<string, Map<string, string>>();
  for (const s of solutions) {
    const name = (s.vendor || s.name).trim();
    if (!name) continue;
    const ids = vendors.get(name) ?? new Map<string, string>();
    ids.set(s.id, s.name);
    vendors.set(name, ids);
  }
  return [...vendors].map(([name, ids]) => ({
    name,
    apps: ids.size,
    products: [...ids].map(([id, n]) => ({ id, name: n })).sort((a, b) => a.name.localeCompare(b.name, "sv")),
  })).sort((a, b) => a.name.localeCompare(b.name, "sv"));
}

/** Keeps saved cost rows and adds any fixed default rows missing from older saves, before the custom rows. */
export function mergeCosts(saved?: CostLine[]): CostLine[] {
  if (!saved?.length) return DEFAULT_BUDGET.costs;
  // Row identity is independent of its editable display name; never re-add renamed costs.
  return saved.map((row, i) => ({ ...row, id: row.id ?? `cost-${i}` }));
}

// Funnel budget (Thomas 2026-11-09): finders fee is budgeted per product as meetings → deals → won deals.
export interface FunnelRow { meetings?: number; deals?: number; wins?: number; assignments?: number; hours?: number; rate?: number; months?: number; percent?: number }
export type Funnel = Record<string, FunnelRow>;
export const FUNNEL_PRODUCTS = [
  { key: "bc", label: "Business Central", fscm: false, valueKey: "successBc" },
  { key: "crm", label: "CRM (Customer Engagement)", fscm: false, valueKey: "successCrm" },
  { key: "fscm", label: "Finance & Supply Chain Management", fscm: true, valueKey: "successFscm" },
  { key: "pp", label: "Power Platform och AI", fscm: false, valueKey: "successPp" },
];
export const FUNNEL_DEAL_TYPES = [
  { key: "dealSmall", band: "small", valueKey: "maxSmall", label: `Alla produktområden: ${FINDERS_FEE_VARIANTS[0].scope}` },
] as const;
export function funnelMaxValue(p: (typeof FUNNEL_DEAL_TYPES)[number], values: Record<string, number> = {}, pricing = budgetPricing()) {
  return values[p.valueKey] ?? (p.band === "small" ? 400000 : 3000000);
}
/** Convert saved product volumes once; keep the original budget untouched until explicitly saved. */
export function migratePartnerFunnel(f: Funnel = {}, values: Record<string, number> = {}, pricing = budgetPricing()): Funnel {
  const out = { ...f };
  for (const p of FUNNEL_PRODUCTS) for (const tier of ["basic", "premium"] as const) {
    const oldKey = `${p.key}_${tier}`;
    const row = out[oldKey];
    if (!row) continue;
    const target = FUNNEL_DEAL_TYPES[0];
    if (!target) continue;
    const key = `${target.key}_${tier}`;
    const existing = out[key] ?? {};
    out[key] = { ...existing, meetings: n(existing.meetings) + n(row.meetings), deals: n(existing.deals) + n(row.deals), wins: n(existing.wins) + n(row.wins) };
    delete out[oldKey];
  }
  for (const tier of ["basic", "premium"] as const) for (const legacy of ["dealMedium", "dealLarge"]) {
    const oldKey = `${legacy}_${tier}`;
    const row = out[oldKey];
    if (!row) continue;
    const key = `dealSmall_${tier}`;
    const existing = out[key] ?? {};
    out[key] = { ...existing, meetings: n(existing.meetings) + n(row.meetings), deals: n(existing.deals) + n(row.deals), wins: n(existing.wins) + n(row.wins) };
    delete out[oldKey];
  }
  return out;
}
export function dealFunnelRow(p: (typeof FUNNEL_DEAL_TYPES)[number], tier: "basic" | "premium", r: FunnelRow = {}, values: Record<string, number> = {}, pricing = budgetPricing()) {
  const fee = dealBandPricing(funnelMaxValue(p, values, pricing), tier, pricing.bands[p.band]);
  const meetings = n(r.meetings) * fee.meeting;
  // Paid meeting fee is credited in full against the deal fee, never below zero.
  const wins = n(r.wins) * Math.max(0, fee.commission - fee.meeting);
  return { meetings, deals: 0, wins, total: meetings + wins };
}
// Expertförmedling (utkast 2026-11-17): fast avgift per tillsatt uppdrag och omfattning.
export const EXPERT_FUNNEL = [
  { key: "expertShort", scope: "short", label: "Upp till 6 månader eller under halvtid" },
  { key: "expertLong", scope: "long", label: "Längre eller minst halvtid" },
] as const;
// Partnerbytesarvode (Thomas 2026-11-17): mötesavgift per affärsstorlek och nivå, ingen provision.
export const SWITCH_FUNNEL = [
  { key: "switchStd", label: "Partnerbyte: BC, CRM, Power Platform", band: "std" },
  { key: "switchFscm", label: "Partnerbyte: Finance & SCM", band: "fscm" },
] as const;
export const ISV_FUNNEL = [
  { key: "isvStd", label: "ISV: licenser och abonnemang, första 12 mån", rate: ISV_FEES.licenseRate, value: 200000 },
  { key: "isvFscm", label: "ISV: förmedlat konsultuppdrag", rate: ISV_FEES.consultRate, value: 400000 },
];
const n = (v?: number) => Math.max(0, Number(v) || 0);
const val = (key: string, values: Record<string, number>, fallback: number) => Number(values[key]) || fallback;

/** Grundprofil pays meeting fee plus the rest at deal; Premium pays the full deal fee only. Success fee per won deal. */
export function partnerFunnelRow(product: (typeof FUNNEL_PRODUCTS)[number], tier: "basic" | "premium", r: FunnelRow = {}, values: Record<string, number> = {}, pricing = budgetPricing()) {
  const fee = dealBandPricing(successValue(product.valueKey, values), tier, pricing.bands.small);
  const meetings = n(r.meetings) * fee.meeting;
  // Agreements are pipeline volume only; commission is counted once on won business.
  const deals = 0;
  const wins = n(r.wins) * fee.commission;
  return { meetings, deals, wins, total: meetings + wins };
}
/** Billable hours per full-time month. */
export const HOURS_PER_MONTH = 165;
export function expertFunnelRow(e: (typeof EXPERT_FUNNEL)[number], tier: "basic" | "premium", r: FunnelRow = {}, pricing = budgetPricing(), values: Record<string, number> = {}) {
  // Same terms as other brokerage: interview fee (Grundprofil) plus 2,5 % / 5 % of assignment value, fee credited in full.
  const fee = pricing.expertFee[e.scope][tier];
  const value = successValue("successExpert", values);
  const rate = (tier === "premium" ? pricing.bands.small.percent : pricing.bands.small.basicPercent) / 100;
  const commission = Math.round(value * rate);
  const perAssignment = fee + Math.max(0, commission - fee);
  return { fee, commission, value, perAssignment, total: n(r.assignments) * perAssignment };
}
export function isvFunnelRow(i: (typeof ISV_FUNNEL)[number], r: FunnelRow = {}, values: Record<string, number> = {}, pricing = budgetPricing()) {
  const rate = i.key === "isvStd" ? pricing.isvLicensePercent : pricing.isvConsultPercent;
  const fee = Math.round((values[i.key] ?? i.value) * rate / 100);
  const deals = n(r.deals) * fee;
  return { fee, deals, wins: 0, total: deals };
}
/** Partnerbyte debiteras bara per bokat möte; affären ger ingen provision i budgeten. */
export function switchFunnelRow(s: (typeof SWITCH_FUNNEL)[number], tier: "basic" | "premium", r: FunnelRow = {}, pricing = budgetPricing()) {
  const fee = pricing.switchMeeting[s.band][tier];
  const meetings = n(r.meetings) * fee;
  return { fee, meetings, total: meetings };
}
export function funnelTotals(f: Funnel = {}, values: Record<string, number> = {}, pricing = budgetPricing()) {
  let partner = 0, expert = 0, isv = 0, partnerSwitch = 0;
  const partnerRows = migratePartnerFunnel(f, values, pricing);
  for (const p of FUNNEL_DEAL_TYPES) for (const t of ["basic", "premium"] as const) partner += dealFunnelRow(p, t, partnerRows[`${p.key}_${t}`], values, pricing).total;
  for (const e of EXPERT_FUNNEL) for (const t of ["basic", "premium"] as const) expert += expertFunnelRow(e, t, f[`${e.key}_${t}`], pricing, values).total;
  for (const i of ISV_FUNNEL) isv += isvFunnelRow(i, f[i.key], values, pricing).total;
  for (const s of SWITCH_FUNNEL) for (const t of ["basic", "premium"] as const) partnerSwitch += switchFunnelRow(s, t, f[`${s.key}_${t}`], pricing).total;
  return { partner, expert, isv, partnerSwitch, total: partner + expert + isv + partnerSwitch };
}

/** Recurring subscription income vs fixed external costs (OPEX), per year. Extra partners needed are counted at the 1-area monthly Premium price. */
export function opexCoverage(recurring: number, opex: number, monthlyPrice = MONTH_PRICE[1]) {
  const ratio = opex > 0 ? recurring / opex : 0;
  const gap = Math.max(0, opex - recurring);
  return { ratio, gap, selfFunded: opex > 0 && recurring >= opex, extraPartners: monthlyPrice > 0 ? Math.ceil(gap / (monthlyPrice * 12)) : 0 };
}
