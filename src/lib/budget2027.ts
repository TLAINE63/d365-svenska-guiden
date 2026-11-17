import { budgetPricing, dealPricing, dealBandPricing, type BudgetPricing } from "./budgetPricing";
// Budget 2027: pure calculation helpers, prices from the partner program (excl. VAT).
export const BUDGET_KEY = "budget_2027";
export type Forecast = "none" | "basic" | "month" | "year";

export const MONTH_PRICE: Record<number, number> = { 1: 995, 2: 1295, 3: 1495 };
export const YEAR_PRICE: Record<number, number> = { 1: 7990, 2: 9990, 3: 11990 };
export const FEES = { meetingStd: 0, dealStd: 5000, meetingFscm: 0, dealFscm: 10000, successRate: 0.025 };

export interface PartnerForecast {
  forecast: Forecast; products: number; discount: number;
  meetingsStd: number; dealsStd: number; meetingsFscm: number; dealsFscm: number; successBasis: number;
  /** Möten och vunna affärer per affärsstorlek (samma band som tratten). Ersätter de gamla produktfälten. */
  deals?: Partial<Record<DealBandKey, { meetings?: number; wins?: number }>>;
}
export type DealBandKey = "small" | "medium" | "large";
export const DEAL_BAND_KEYS: DealBandKey[] = ["small", "medium", "large"];
/** Per-band volumes; old saved rows map BC/CE to medium and F&SCM to large, and a success basis to one win in its band. */
export function partnerDeals(r: PartnerForecast, pricing = budgetPricing()): Record<DealBandKey, { meetings: number; wins: number }> {
  const z = (v?: number) => Math.max(0, Number(v) || 0);
  if (r.deals) return Object.fromEntries(DEAL_BAND_KEYS.map((k) => [k, { meetings: z(r.deals?.[k]?.meetings), wins: z(r.deals?.[k]?.wins) }])) as any;
  const out = { small: { meetings: 0, wins: 0 }, medium: { meetings: z(r.meetingsStd), wins: z(r.dealsStd) }, large: { meetings: z(r.meetingsFscm), wins: z(r.dealsFscm) } };
  const b = z(r.successBasis);
  if (b > 0 && out.medium.wins + out.large.wins === 0) out[b < pricing.smallLimit ? "small" : b <= pricing.largeLimit ? "medium" : "large"].wins += 1;
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
export const ISV_FEES = { base: 5990, introFirstYear: 2990, extraApp: 995, introStd: 0, introFscm: 0, licenseRate: 0.05, consultRate: 0.025, successRate: 0.05 };
/** Expert brokerage: flat fee per placed assignment (Thomas 2026-11-17). Short = up to 6 months or under half-time; long = longer or at least half-time. */
export const EXPERT_FEES = { shortPremium: 7500, shortBasic: 12500, longPremium: 15000, longBasic: 25000 };
export interface IsvForecast { presence: boolean; extraApps: number; discount: number; introsStd: number; introsFscm: number; successBasis: number; consultBasis?: number; /** New ISV pays the 2 990 kr intro price first year; default true. */ introPrice?: boolean }
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
  /** Editable calculation basis: maximum deal value (kr) per funnel band; legacy product values retained. */
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

/** Basic pays for meetings with credit against deals; Premium pays only the full deal fee. */
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
  { key: "meetingsStd", label: "Basic: möten BC/CRM och övrigt", description: "Mötesavgiften är borttagen (samma villkor för alla). Raden ger 0 kr och finns kvar för sparade budgetar.", unit: FEES.meetingStd, group: "partner", income: "finders" },
  { key: "dealsStd", label: "Basic: avtal BC/CRM och övrigt", description: "Antal tecknade kundavtal. Hela avtalsersättningen 5 000 kr, samma villkor som Premium.", unit: FEES.dealStd - FEES.meetingStd, group: "partner", income: "finders" },
  { key: "meetingsFscm", label: "Basic: möten F&SCM", description: "Mötesavgiften är borttagen (samma villkor för alla). Raden ger 0 kr och finns kvar för sparade budgetar.", unit: FEES.meetingFscm, group: "partner", income: "finders" },
  { key: "dealsFscm", label: "Basic: avtal F&SCM", description: "Antal tecknade avtal. Hela avtalsersättningen 10 000 kr, samma villkor som Premium.", unit: FEES.dealFscm - FEES.meetingFscm, group: "partner", income: "finders" },
  { key: "premiumDealsStd", label: "Premium: avtal BC/CRM och övrigt", description: "Antal tecknade avtal för Business Central, Customer Engagement (CRM), Power Platform och andra lösningar. Hela avtalsersättningen 5 000 kr, utan mötesavdrag.", unit: FEES.dealStd, group: "partner", income: "finders" },
  { key: "premiumDealsFscm", label: "Premium: avtal F&SCM", description: "Antal tecknade avtal för Finance & Supply Chain Management. Hela avtalsersättningen 10 000 kr, utan mötesavdrag.", unit: FEES.dealFscm, group: "partner", income: "finders" },
  { key: "expertCvHours", label: "Expertförmedling: Premiumpartner", description: "Fast avgift per tillsatt uppdrag hos Premiumpartners: 7 500 kr upp till 6 månader eller under halvtid, 15 000 kr vid längre uppdrag eller minst halvtid. Raden räknar korta uppdrag; längre uppdrag budgeteras i experttratten. Nyckeln finns kvar för sparade budgetar.", unit: EXPERT_FEES.shortPremium, per: "tillsatt uppdrag", group: "partner", income: "finders" },
  { key: "expertAssignmentHours", label: "Expertförmedling: Basicpartner", description: "Fast avgift per tillsatt uppdrag hos Basicpartners: 12 500 kr upp till 6 månader eller under halvtid, 25 000 kr vid längre uppdrag eller minst halvtid. Raden räknar korta uppdrag; längre uppdrag budgeteras i experttratten. Nyckeln finns kvar för sparade budgetar.", unit: EXPERT_FEES.shortBasic, per: "tillsatt uppdrag", group: "partner", income: "finders" },
  { key: "isvPresence", label: "ISV Presence (inkl. en app)", description: "Antal ISV-leverantörer med ISV Presence under ett helt år. Nya ISV:er räknas med introduktionspriset 2 990 kr första året inklusive en app, före rabatt.", unit: ISV_FEES.introFirstYear, group: "isv", income: "subscription" },
  { key: "isvExtra", label: "ISV extra appar", description: "Totalt antal extra appar utöver den app som ingår per ISV-leverantör med Presence. Årspris per extra app, före rabatt.", unit: ISV_FEES.extraApp, group: "isv", income: "subscription" },
  { key: "isvIntroStd", label: "ISV Business Referral: licenser (5 %)", description: "Business Referral räknas i ISV-tratten som 5 % av ISV:ns nettointäkter från licenser eller abonnemang under affärens första 12 månader. Raden ger 0 kr och finns kvar för sparade budgetar.", unit: ISV_FEES.introStd, group: "isv", income: "finders" },
  { key: "isvIntroFscm", label: "ISV Business Referral: konsult (2,5 %)", description: "Business Referral räknas i ISV-tratten som 2,5 % av nettointäkterna från ett förmedlat konsultuppdrag. Raden ger 0 kr och finns kvar för sparade budgetar.", unit: ISV_FEES.introFscm, group: "isv", income: "finders" },
  ...SUCCESS_AREAS.map((a) => ({ key: a.key, label: `Success fee: ${a.label}`, description: `Antal avslutade affärer där success fee 2,5 % tas ut. Ange ett antaget snittbelopp per affär; avgiften räknas bara när beloppet överstiger 100 000 kr.`, unit: 0, group: "partner" as const, income: "finders" as const, success: true })),
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
  { key: "dealSmall", band: "small", valueKey: "maxSmall", label: "Under 250 tkr" },
  { key: "dealMedium", band: "medium", valueKey: "maxMedium", label: "250 tkr - 1 Mkr" },
  { key: "dealLarge", band: "large", valueKey: "maxLarge", label: "Över 1 Mkr" },
] as const;
export function funnelMaxValue(p: (typeof FUNNEL_DEAL_TYPES)[number], values: Record<string, number> = {}, pricing = budgetPricing()) {
  return values[p.valueKey] ?? (p.band === "small" ? pricing.smallLimit : p.band === "medium" ? pricing.largeLimit : 3000000);
}
/** Convert saved product volumes once; keep the original budget untouched until explicitly saved. */
export function migratePartnerFunnel(f: Funnel = {}, values: Record<string, number> = {}, pricing = budgetPricing()): Funnel {
  const out = { ...f };
  for (const p of FUNNEL_PRODUCTS) for (const tier of ["basic", "premium"] as const) {
    const oldKey = `${p.key}_${tier}`;
    const row = out[oldKey];
    if (!row) continue;
    const value = successValue(p.valueKey, values);
    const band = value < pricing.smallLimit ? "small" : value <= pricing.largeLimit ? "medium" : "large";
    const target = FUNNEL_DEAL_TYPES.find((d) => d.band === band);
    if (!target) continue;
    const key = `${target.key}_${tier}`;
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

/** Basic pays meeting fee plus the rest at deal; Premium pays the full deal fee only. Success fee per won deal. */
export function partnerFunnelRow(product: (typeof FUNNEL_PRODUCTS)[number], tier: "basic" | "premium", r: FunnelRow = {}, values: Record<string, number> = {}, pricing = budgetPricing()) {
  const fee = dealPricing(successValue(product.valueKey, values), tier, pricing);
  const meetings = n(r.meetings) * fee.meeting;
  // Agreements are pipeline volume only; commission is counted once on won business.
  const deals = 0;
  const wins = n(r.wins) * fee.commission;
  return { meetings, deals, wins, total: meetings + wins };
}
/** Billable hours per full-time month. */
export const HOURS_PER_MONTH = 165;
export function expertFunnelRow(e: (typeof EXPERT_FUNNEL)[number], tier: "basic" | "premium", r: FunnelRow = {}, pricing = budgetPricing()) {
  const fee = pricing.expertFee[e.scope][tier];
  return { fee, total: n(r.assignments) * fee };
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
  for (const e of EXPERT_FUNNEL) for (const t of ["basic", "premium"] as const) expert += expertFunnelRow(e, t, f[`${e.key}_${t}`], pricing).total;
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
