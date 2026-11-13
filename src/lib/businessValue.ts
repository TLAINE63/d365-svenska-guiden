/**
 * Business Value Assessment (verksamhetsnytta) enligt Thomas säljcoachningsmodell:
 * nyttan härleds från verksamhetens problem i fyra delar. Produktoberoende (BC, F&SCM, CRM m.fl.).
 * Rättelser mot Excel-förlagan: intäktsförluster räknas på täckningsbidrag, inte hela intäkten,
 * och samtliga delar ingår i totalsumman.
 */
export interface WorkRow { id: string; label: string; minutes: number; perMonth: number; savingPct: number }
export interface LeakRow { id: string; label: string; value: number; perYear: number; savingPct: number }
export interface CostRow { id: string; label: string; yearly: number; savingPct: number }

export interface BusinessValueInput {
  hourlyCost: number; // intern kostnad per timme
  marginPct: number; // täckningsgrad för förlorade intäkter
  work: WorkRow[];
  leakage: LeakRow[];
  challenges: CostRow[];
  itFees: CostRow[];
  /** Bundet kapital (yearly = kapital i kr, savingPct = minskning). Värderas med kapitalkostnad. */
  workingCapital?: CostRow[];
  capitalRatePct?: number;
  /** Andel av kvarvarande manuell tid efter systembytet som AI, Copilot och agenter kan ta (0–50 %). */
  aiPct?: number;
}

export interface BusinessValueResult {
  work: number; leakage: number; challenges: number; itFees: number;
  workingCapital: number; ai: number;
  hoursFreed: number; total: number;
}

const DEFAULT_CAPITAL = (stock: number, receivables: number): CostRow[] => [
  { id: "stock", label: "Lagervärde som kan minskas", yearly: stock, savingPct: 10 },
  { id: "receivables", label: "Kundfordringar (snabbare fakturering och betalning)", yearly: receivables, savingPct: 10 },
];
const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const pct = (n: number, max = 100) => Math.min(max, pos(n)) / 100;

/** Spärrar så att nyttan inte skenar: tak per rad och en försiktighetsfaktor för införandeförluster. */
export const MAX_WORK_SAVING = 80; // % av tiden som kan sparas i ett moment
export const MAX_LEAK_SAVING = 75; // % av förlorade affärer som kan räddas
export const MAX_CHALLENGE_SAVING = 30; // % av en verksamhetsutmaning som systemet påverkar
export const REALISM_FACTOR = 0.85; // allt fungerar inte fullt ut i praktiken
/** Ersatta kostnader räknas fullt (de försvinner), övriga delar dämpas. */

export const workRowValue = (r: WorkRow, hourlyCost: number) =>
  ((pos(r.minutes) * pos(r.perMonth) * 12) / 60) * pos(hourlyCost) * pct(r.savingPct, MAX_WORK_SAVING) * REALISM_FACTOR;
export const leakRowValue = (r: LeakRow, marginPct: number) =>
  pos(r.value) * pos(r.perYear) * pct(marginPct) * pct(r.savingPct, MAX_LEAK_SAVING) * REALISM_FACTOR;
export const challengeRowValue = (r: CostRow) => pos(r.yearly) * pct(r.savingPct, MAX_CHALLENGE_SAVING) * REALISM_FACTOR;
export const costRowValue = (r: CostRow) => pos(r.yearly) * pct(r.savingPct);
export const MAX_CAPITAL_REDUCTION = 30; // % av bundet kapital
export const MAX_AI_PCT = 50; // % av kvarvarande tid
export const capitalRowValue = (r: CostRow, ratePct = 8) => pos(r.yearly) * pct(r.savingPct, MAX_CAPITAL_REDUCTION) * pct(ratePct, 20) * REALISM_FACTOR;
/** AI räknas bara på den tid som återstår efter ERP/CRM-effekten. */
export const aiRowValue = (r: WorkRow, hourlyCost: number, aiPct = 0) => {
  const remainingShare = 1 - pct(r.savingPct, MAX_WORK_SAVING);
  return ((pos(r.minutes) * pos(r.perMonth) * 12) / 60) * remainingShare * pct(aiPct, MAX_AI_PCT) * pos(hourlyCost) * REALISM_FACTOR;
};

export function evaluateBusinessValue(i: BusinessValueInput): BusinessValueResult {
  const work = i.work.reduce((s, r) => s + workRowValue(r, i.hourlyCost), 0);
  const hoursFreed = i.work.reduce((s, r) => s + ((pos(r.minutes) * pos(r.perMonth) * 12) / 60) * pct(r.savingPct, MAX_WORK_SAVING) * REALISM_FACTOR, 0);
  const leakage = i.leakage.reduce((s, r) => s + leakRowValue(r, i.marginPct), 0);
  const challenges = i.challenges.reduce((s, r) => s + challengeRowValue(r), 0);
  const itFees = i.itFees.reduce((s, r) => s + costRowValue(r), 0);
  const workingCapital = (i.workingCapital ?? []).reduce((s, r) => s + capitalRowValue(r, i.capitalRatePct), 0);
  const ai = i.work.reduce((s, r) => s + aiRowValue(r, i.hourlyCost, i.aiPct), 0);
  return { work, leakage, challenges, itFees, workingCapital, ai, hoursFreed, total: work + leakage + challenges + itFees + workingCapital + ai };
}

/** Tomma rader (startvärden noll) med förslag på typiska områden, inklusive AI-agenter. */
export const EMPTY_BUSINESS_VALUE: BusinessValueInput = {
  hourlyCost: 600,
  marginPct: 30,
  work: [
    { id: "order", label: "Manuell orderregistrering", minutes: 0, perMonth: 0, savingPct: 50 },
    { id: "invoice", label: "Fakturering", minutes: 0, perMonth: 0, savingPct: 75 },
    { id: "ap", label: "Leverantörsfakturor (AI-tolkning och kontering)", minutes: 0, perMonth: 0, savingPct: 70 },
    { id: "bank", label: "Bankavstämning (AI-förslag)", minutes: 0, perMonth: 0, savingPct: 70 },
    { id: "web", label: "Webbshop och dubbelregistrering", minutes: 0, perMonth: 0, savingPct: 90 },
    { id: "quote", label: "Offert till order", minutes: 0, perMonth: 0, savingPct: 50 },
    { id: "report", label: "Rapporter och sammanställningar i Excel", minutes: 0, perMonth: 0, savingPct: 60 },
    { id: "search", label: "Leta information mellan system", minutes: 0, perMonth: 0, savingPct: 50 },
  ],
  leakage: [
    { id: "missed", label: "Missade order", value: 0, perYear: 0, savingPct: 90 },
    { id: "wrong", label: "Felleveranser", value: 0, perYear: 0, savingPct: 80 },
    { id: "lost", label: "Förlorade kunder", value: 0, perYear: 0, savingPct: 50 },
  ],
  challenges: [
    { id: "deadline", label: "Missade rapporteringstider", yearly: 0, savingPct: 80 },
    { id: "quality", label: "Kvalitetsbrister", yearly: 0, savingPct: 20 },
    { id: "price", label: "Pris- och valutaförändringar som inte fångas", yearly: 0, savingPct: 33 },
    { id: "margin", label: "Ordermarginaler", yearly: 0, savingPct: 50 },
    { id: "regulatory", label: "Nya regelkrav", yearly: 0, savingPct: 50 },
  ],
  itFees: [
    { id: "server", label: "Servrar och drift", yearly: 0, savingPct: 100 },
    { id: "onprem", label: "Licenser för nuvarande system", yearly: 0, savingPct: 100 },
    { id: "support", label: "Supportavtal", yearly: 0, savingPct: 100 },
    { id: "consult", label: "Konsultkostnad för nuvarande system", yearly: 0, savingPct: 100 },
    { id: "tools", label: "Fristående verktyg (fakturatolkning, rapportverktyg)", yearly: 0, savingPct: 100 },
  ],
  workingCapital: DEFAULT_CAPITAL(0, 0),
  capitalRatePct: 8,
  aiPct: 0,
};

/** Exempelbolag från säljcoachningsmodellen, i kronor. */
export const EXAMPLE_BUSINESS_VALUE: BusinessValueInput = {
  ...EMPTY_BUSINESS_VALUE,
  work: EMPTY_BUSINESS_VALUE.work.map((r) => ({
    ...r,
    ...({ order: { minutes: 10, perMonth: 300 }, invoice: { minutes: 2, perMonth: 600 }, ap: { minutes: 4, perMonth: 300 }, bank: { minutes: 60, perMonth: 4 }, web: { minutes: 5, perMonth: 200 }, quote: { minutes: 5, perMonth: 100 }, report: { minutes: 240, perMonth: 4 }, search: { minutes: 15, perMonth: 100 } } as Record<string, Partial<WorkRow>>)[r.id],
  })),
  leakage: EMPTY_BUSINESS_VALUE.leakage.map((r) => ({ ...r, ...({ missed: { value: 50_000, perYear: 3 }, wrong: { value: 50_000, perYear: 3 }, lost: { value: 150_000, perYear: 1 } } as Record<string, Partial<LeakRow>>)[r.id] })),
  challenges: EMPTY_BUSINESS_VALUE.challenges.map((r) => ({ ...r, yearly: ({ deadline: 50_000, quality: 50_000, price: 50_000, margin: 50_000, regulatory: 50_000 } as Record<string, number>)[r.id] ?? 0 })),
  itFees: EMPTY_BUSINESS_VALUE.itFees.map((r) => ({ ...r, yearly: ({ server: 50_000, onprem: 48_000, support: 30_000, consult: 100_000 } as Record<string, number>)[r.id] ?? 0 })),
};

const w = (id: string, label: string, minutes: number, perMonth: number, savingPct: number): WorkRow => ({ id, label, minutes, perMonth, savingPct });
const l = (id: string, label: string, value: number, perYear: number, savingPct: number): LeakRow => ({ id, label, value, perYear, savingPct });
const c = (id: string, label: string, yearly: number, savingPct: number): CostRow => ({ id, label, yearly, savingPct });

/** Intern timkostnad som i Thomas BC 2026-modell: (lön + 32 % sociala + verktyg + OH) / 1 600 tim. */
export const internalHourlyCost = (monthlySalary: number, tools = 50_000, overhead = 50_000) =>
  (monthlySalary * 12 * 1.32 + tools + overhead) / 1600;

/** Exempelbolag från Thomas Excel "Business Value Assessment – Business Central 2026". */
export const BC_EXAMPLE_BUSINESS_VALUE: BusinessValueInput = {
  workingCapital: DEFAULT_CAPITAL(3_000_000, 2_000_000), capitalRatePct: 8, aiPct: 30,
  hourlyCost: Math.round(internalHourlyCost(40_000) * 2) / 2, // 458,5 kr
  marginPct: 30,
  work: [
    w("order", "Manuell orderregistrering", 10, 200, 70),
    w("invoice", "Fakturering (automatisk/batch)", 2, 300, 80),
    w("web", "Webborder och dubbelregistrering", 10, 100, 90),
    w("quote", "Offert till order", 10, 60, 60),
    w("close", "Månadsbokslut (automatiserat)", 1440, 1, 60),
    w("ap", "Leverantörsfakturor (AI-tolkning och kontering)", 3, 200, 70),
    w("bank", "Bankavstämning (AI-förslag)", 60, 4, 70),
  ],
  leakage: [
    l("missed", "Missade order", 15_000, 4, 100),
    l("wrong", "Felleveranser", 15_000, 6, 80),
    l("lost", "Förlorade kunder", 100_000, 1, 50),
  ],
  challenges: [
    c("forecast", "Brister i prognoser", 10_000, 20),
    c("quality", "Kvalitetsbrister", 5_000, 20),
    c("supply", "Försenade leveranskedjor", 15_000, 20),
    c("price", "Pris- och valutaförändringar", 5_000, 20),
    c("margin", "Ordermarginaler", 5_000, 20),
    c("regulatory", "Nya regelkrav", 5_000, 20),
    c("insight", "Brist på beslutsunderlag", 5_000, 20),
  ],
  itFees: [
    c("server", "Servrar och drift", 30_000, 100),
    c("onprem", "Licenser för nuvarande system", 50_000, 100),
    c("support", "Supportavtal", 30_000, 100),
    c("consult", "Konsultkostnad för nuvarande system", 50_000, 100),
  ],
};

/** Exempelbolag från Thomas Excel "Business Value Assessment SEK – CRM". */
export const CRM_EXAMPLE_BUSINESS_VALUE: BusinessValueInput = {
  workingCapital: DEFAULT_CAPITAL(0, 0), capitalRatePct: 8, aiPct: 30,
  hourlyCost: 750,
  marginPct: 30,
  work: [
    w("lead", "Manuell registrering av leads och affärsmöjligheter", 5, 200, 70),
    w("invoice", "Fakturaunderlag", 2, 200, 70),
    w("sales", "Säljadministration (timmar per månad för hela säljteamet)", 4800, 1, 10),
    w("quote", "Offert till order", 10, 100, 50),
  ],
  leakage: [
    l("missed", "Missade affärer", 75_000, 4, 90),
    l("wrong", "Fel leveranser och åtaganden", 50_000, 4, 80),
    l("lost", "Förlorade kunder", 150_000, 1, 50),
    l("winrate", "Högre vinstfrekvens (fler vunna affärer)", 50_000, 4, 75),
  ],
  challenges: [
    c("forecast", "Brister i prognoser", 100_000, 20),
    c("quality", "Kvalitetsbrister", 50_000, 20),
    c("behavior", "Ändrat kundbeteende", 50_000, 20),
    c("price", "Pris- och valutaförändringar", 50_000, 20),
    c("margin", "Ordermarginaler", 50_000, 20),
    c("regulatory", "Nya regelkrav", 50_000, 20),
    c("insight", "Brist på beslutsunderlag", 50_000, 20),
  ],
  itFees: [
    c("server", "Servrar och drift", 100_000, 90),
    c("onprem", "Licenser för nuvarande CRM", 75_000, 90),
    c("support", "Supportavtal", 50_000, 90),
    c("consult", "Konsultkostnad för nuvarande CRM", 150_000, 90),
  ],
};

const CRM_KEYS = ["sales", "customer-service", "field-service", "contact-center", "customer-insights", "crm"];
/** Rätt exempelbolag per produkt: CRM-produkter får CRM-modellen, övriga ERP-modellen. */
/** Större exempelbolag för Finance & Supply Chain: cirka 500 MSEK, flera bolag och länder, 150 användare. */
export const FSCM_EXAMPLE_BUSINESS_VALUE: BusinessValueInput = {
  hourlyCost: Math.round(internalHourlyCost(48_000) * 2) / 2,
  marginPct: 25,
  work: [
    w("order", "Manuell orderregistrering", 10, 1500, 70),
    w("edi", "EDI-order och leveransaviseringar", 5, 2000, 80),
    w("invoice", "Fakturering och kreditfakturor", 3, 2500, 75),
    w("ap", "Leverantörsfakturor (AI-tolkning och kontering)", 5, 2000, 70),
    w("intercompany", "Koncerninterna transaktioner och elimineringar", 30, 150, 70),
    w("close", "Månads- och koncernbokslut", 9600, 1, 50),
    w("plan", "Material- och kapacitetsplanering", 960, 4, 50),
    w("purchase", "Inköpsförslag och beställningar", 20, 300, 60),
    w("report", "Rapporter och sammanställningar i Excel", 480, 8, 60),
    w("bank", "Bankavstämning (AI-förslag)", 60, 40, 70),
  ],
  leakage: [
    l("missed", "Restorder och missade order", 50_000, 20, 60),
    l("wrong", "Felleveranser och reklamationer", 40_000, 25, 60),
    l("lost", "Förlorade kunder", 1_000_000, 1, 40),
  ],
  challenges: [
    c("forecast", "Brister i prognoser", 500_000, 20),
    c("quality", "Kvalitetsbrister och kassationer", 400_000, 20),
    c("supply", "Försenade leveranskedjor", 500_000, 20),
    c("regulatory", "Regelkrav och revision (flera länder)", 300_000, 25),
    c("insight", "Brist på beslutsunderlag", 200_000, 20),
  ],
  itFees: [
    c("server", "Servrar och drift", 400_000, 100),
    c("onprem", "Licenser för nuvarande system", 600_000, 100),
    c("support", "Supportavtal", 300_000, 100),
    c("consult", "Konsultkostnad för nuvarande system", 500_000, 80),
    c("tools", "Fristående verktyg (konsolidering, fakturatolkning, rapporter)", 200_000, 70),
  ],
  workingCapital: DEFAULT_CAPITAL(60_000_000, 50_000_000),
  capitalRatePct: 8,
  aiPct: 25,
};

export const exampleFor = (productKey?: string, industry?: string): BusinessValueInput =>
  productKey && CRM_KEYS.includes(productKey) ? crmExampleForIndustry(industry) : productKey === "finance-scm" ? FSCM_EXAMPLE_BUSINESS_VALUE : productKey ? bcExampleForIndustry(industry) : EXAMPLE_BUSINESS_VALUE;

const CRM = CRM_EXAMPLE_BUSINESS_VALUE;
const crmCommon = CRM.work.filter((r) => ["lead", "sales"].includes(r.id));
/** CRM-exempelbolag per branschmodell. */
export const CRM_INDUSTRY_EXAMPLES: Record<string, BusinessValueInput> = {
  Tillverkning: { ...CRM, work: [...crmCommon, w("config", "Offert med produktkonfiguration", 30, 40, 50), w("aftersales", "Service- och reservdelsförfrågningar", 10, 100, 50)],
    leakage: [l("missed", "Missade affärer", 150_000, 3, 80), l("renewal", "Missade serviceavtal och eftermarknad", 40_000, 4, 70), l("lost", "Förlorade kunder", 300_000, 1, 50)] },
  Distribution: { ...CRM, work: [...crmCommon, w("reorder", "Uppföljning av återköp", 5, 200, 60), w("quote", "Offert och prisförfrågningar", 10, 150, 50)],
    leakage: [l("missed", "Missade merförsäljningar", 30_000, 10, 70), l("churn", "Kunder som tyst minskar köpen", 100_000, 2, 50), l("lost", "Förlorade kunder", 150_000, 1, 50)] },
  Tjänster: { ...CRM, hourlyCost: 800, work: [...crmCommon, w("proposal", "Anbud och uppdragsförslag", 120, 8, 40), w("crm2proj", "Överlämning från affär till uppdrag", 30, 10, 70)],
    leakage: [l("missed", "Missade uppdrag", 200_000, 2, 70), l("renewal", "Förlängningar som uteblir", 100_000, 2, 60), l("lost", "Förlorade kunder", 250_000, 1, 50)] },
};
export const crmExampleForIndustry = (industry?: string): BusinessValueInput => (industry && CRM_INDUSTRY_EXAMPLES[industry]) || CRM;

/** Nytta över N år med realiseringstakt: [år1, år2] (därefter full) eller en andel per år. */
export const rampYears = (ramp: number[], years: number) =>
  Array.from({ length: years }, (_, i) => (ramp.length > 2 ? ramp[i] ?? 1 : i === 0 ? ramp[0] : i === 1 ? ramp[1] : 1));
export const realizedBenefit = (annual: number, years: number, ramp: number[]) =>
  rampYears(ramp, years).reduce((s, f) => s + annual * Math.min(1, Math.max(0, f)), 0);

export interface CashYear { year: number; benefit: number; project: number; running: number; net: number; cumulative: number }
export interface CashFlowResult { rows: CashYear[]; npv: number; irr: number | null; paybackMonths: number | null; roiPct: number | null }

/** Kassaflöde år för år som i en klassisk investeringskalkyl. Ersatta kostnader följer inte realiseringstakten. */
export function cashFlow(o: { benefit: number; replaced: number; ramp: number[]; implementation: number; licenseYearly: number; supportPct: number; ratePct?: number; years?: number }): CashFlowResult {
  const years = o.years ?? 5, rate = (o.ratePct ?? 5) / 100;
  let cum = 0; let payback: number | null = null;
  const rows = rampYears(o.ramp, years).map((f, i) => {
    const benefit = o.benefit * Math.min(1, Math.max(0, f)) + o.replaced;
    const project = i === 0 ? o.implementation : (o.implementation * o.supportPct) / 100;
    const running = o.licenseYearly;
    const net = benefit - project - running;
    const before = cum; cum += net;
    if (payback === null && cum >= 0 && net > 0) payback = i * 12 + Math.max(0, (-before / net) * 12);
    return { year: i + 1, benefit, project, running, net, cumulative: cum };
  });
  const flows = rows.map((r) => r.net);
  const npvAt = (r: number) => flows.reduce((s, f, i) => s + f / Math.pow(1 + r, i + 1), 0);
  // IRR: investeringen i början, årets nytta minus löpande som inbetalning.
  const irrFlows = [-o.implementation, ...rows.map((r) => r.benefit - r.running - (r.year === 1 ? 0 : r.project))];
  const f = (r: number) => irrFlows.reduce((s, c, i) => s + c / Math.pow(1 + r, i), 0);
  let irr: number | null = null;
  if (o.implementation > 0 && f(-0.99) * f(10) < 0) {
    let lo = -0.99, hi = 10;
    for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid; }
    irr = (lo + hi) / 2;
  }
  const cost = rows.reduce((s, r) => s + r.project + r.running, 0);
  const total = rows.reduce((s, r) => s + r.benefit, 0);
  return { rows, npv: npvAt(rate), irr, paybackMonths: payback, roiPct: cost > 0 ? (total / cost - 1) * 100 : null };
}

/** Största potential: alla rader med värde, sorterade. */
export function topPotential(i: BusinessValueInput, n = 5) {
  const items = [
    ...i.work.map((r) => ({ id: r.id, label: r.label, value: workRowValue(r, i.hourlyCost) })),
    ...i.leakage.map((r) => ({ id: r.id, label: r.label, value: leakRowValue(r, i.marginPct) })),
    ...i.challenges.map((r) => ({ id: r.id, label: r.label, value: challengeRowValue(r) })),
    ...(i.workingCapital ?? []).map((r) => ({ id: r.id, label: r.label, value: capitalRowValue(r, i.capitalRatePct) })),
    { id: "ai", label: "AI, Copilot och agenter", value: i.work.reduce((s, r) => s + aiRowValue(r, i.hourlyCost, i.aiPct), 0) },
  ];
  return items.filter((x) => x.value > 0).sort((a, b) => b.value - a.value).slice(0, n);
}

/** Områden att utvärdera per rad (visas under största potential). */
export const AREAS_TO_EVALUATE: Record<string, string> = {
  order: "Orderautomatisering", web: "Webbshop-integration", edi: "EDI med kunder och leverantörer", quote: "Offert- och prisregler",
  invoice: "Automatiserad fakturering", ap: "Leverantörsfakturor med AI", bank: "Bankintegration och avstämning", close: "Bokslut och rapportering",
  report: "Rapportering och Power BI", stock: "Lagerstyrning och beställningspunkter", pick: "WMS, plock och leverans", purchase: "Inköpsplanering",
  bom: "Produktionsorder och stycklistor", plan: "Material- och kapacitetsplanering", trace: "Spårbarhet och batch", time: "Tidrapportering",
  projinv: "Projektfakturering", proj: "Projektuppföljning", lead: "Lead- och affärsmöjlighetshantering", sales: "Säljprocess och Copilot för säljare",
  missed: "Uppföljning av affärer och order", wrong: "Leveranskvalitet", lost: "Kunduppföljning", receivables: "Kundreskontra och påminnelser",
  ai: "Copilot och agenter för återstående manuella moment", intercompany: "Koncernredovisning och interna transaktioner", renewal: "Avtals- och förnyelsehantering",
};

const BC = BC_EXAMPLE_BUSINESS_VALUE;
const common = BC.work.filter((r) => ["invoice", "close", "ap", "bank"].includes(r.id));
/** BC-exempelbolag per branschmodell: samma ekonomirader, branschtypiska flöden och förluster. */
export const BC_INDUSTRY_EXAMPLES: Record<string, BusinessValueInput> = {
  Handel: { ...BC, work: [w("order", "Manuell orderregistrering", 8, 250, 70), w("web", "Webborder och dubbelregistrering", 10, 200, 90), w("price", "Pris- och kampanjuppdatering", 30, 20, 70), w("stock", "Lagersaldo och inventering", 120, 4, 60), ...common] },
  Distribution: { ...BC, work: [w("order", "Manuell orderregistrering", 10, 250, 70), w("edi", "EDI-order och leveransaviseringar", 6, 200, 85), w("pick", "Plock och utleverans", 5, 300, 40), w("purchase", "Inköpsförslag och beställningar", 20, 40, 70), ...common],
    leakage: [l("missed", "Restorder och missade order", 15_000, 6, 100), l("wrong", "Felleveranser", 15_000, 8, 80), l("lost", "Förlorade kunder", 100_000, 1, 50)] },
  Tillverkning: { ...BC, work: [w("order", "Manuell orderregistrering", 10, 150, 70), w("bom", "Stycklistor och produktionsorder", 20, 60, 60), w("plan", "Material- och kapacitetsplanering", 480, 4, 60), w("trace", "Spårbarhet och batchhantering", 15, 40, 70), w("purchase", "Inköpsförslag och beställningar", 20, 40, 70), ...common],
    leakage: [l("missed", "Försenade leveranser och viten", 25_000, 4, 80), l("wrong", "Kassationer och omarbete", 20_000, 6, 60), l("lost", "Förlorade kunder", 150_000, 1, 50)] },
  Tjänster: { ...BC, hourlyCost: 600, workingCapital: DEFAULT_CAPITAL(0, 3_000_000), work: [w("time", "Tidrapportering och attest", 10, 300, 70), w("projinv", "Projektfakturering", 20, 60, 80), w("proj", "Projektuppföljning och prognos", 240, 4, 60), w("expense", "Utlägg och reseräkningar", 10, 60, 80), ...common],
    leakage: [l("missed", "Ej fakturerad tid", 1_200, 200, 100), l("wrong", "Kreditfakturor och tvister", 10_000, 4, 70), l("lost", "Förlorade kunder", 150_000, 1, 50)] },
};
export const bcExampleForIndustry = (industry?: string): BusinessValueInput => (industry && BC_INDUSTRY_EXAMPLES[industry]) || BC;
