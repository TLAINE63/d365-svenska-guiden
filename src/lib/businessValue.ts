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
}

export interface BusinessValueResult {
  work: number; leakage: number; challenges: number; itFees: number;
  hoursFreed: number; total: number;
}

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const pct = (n: number) => Math.min(100, pos(n)) / 100;

export const workRowValue = (r: WorkRow, hourlyCost: number) =>
  ((pos(r.minutes) * pos(r.perMonth) * 12) / 60) * pos(hourlyCost) * pct(r.savingPct);
export const leakRowValue = (r: LeakRow, marginPct: number) =>
  pos(r.value) * pos(r.perYear) * pct(marginPct) * pct(r.savingPct);
export const costRowValue = (r: CostRow) => pos(r.yearly) * pct(r.savingPct);

export function evaluateBusinessValue(i: BusinessValueInput): BusinessValueResult {
  const work = i.work.reduce((s, r) => s + workRowValue(r, i.hourlyCost), 0);
  const hoursFreed = i.work.reduce((s, r) => s + ((pos(r.minutes) * pos(r.perMonth) * 12) / 60) * pct(r.savingPct), 0);
  const leakage = i.leakage.reduce((s, r) => s + leakRowValue(r, i.marginPct), 0);
  const challenges = i.challenges.reduce((s, r) => s + costRowValue(r), 0);
  const itFees = i.itFees.reduce((s, r) => s + costRowValue(r), 0);
  return { work, leakage, challenges, itFees, hoursFreed, total: work + leakage + challenges + itFees };
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
export const exampleFor = (productKey?: string, industry?: string): BusinessValueInput =>
  productKey && CRM_KEYS.includes(productKey) ? CRM_EXAMPLE_BUSINESS_VALUE : productKey ? bcExampleForIndustry(industry) : EXAMPLE_BUSINESS_VALUE;

const BC = BC_EXAMPLE_BUSINESS_VALUE;
const common = BC.work.filter((r) => ["invoice", "close", "ap", "bank"].includes(r.id));
/** BC-exempelbolag per branschmodell: samma ekonomirader, branschtypiska flöden och förluster. */
export const BC_INDUSTRY_EXAMPLES: Record<string, BusinessValueInput> = {
  Handel: { ...BC, work: [w("order", "Manuell orderregistrering", 8, 250, 70), w("web", "Webborder och dubbelregistrering", 10, 200, 90), w("price", "Pris- och kampanjuppdatering", 30, 20, 70), w("stock", "Lagersaldo och inventering", 120, 4, 60), ...common] },
  Distribution: { ...BC, work: [w("order", "Manuell orderregistrering", 10, 250, 70), w("edi", "EDI-order och leveransaviseringar", 6, 200, 85), w("pick", "Plock och utleverans", 5, 300, 40), w("purchase", "Inköpsförslag och beställningar", 20, 40, 70), ...common],
    leakage: [l("missed", "Restorder och missade order", 15_000, 6, 100), l("wrong", "Felleveranser", 15_000, 8, 80), l("lost", "Förlorade kunder", 100_000, 1, 50)] },
  Tillverkning: { ...BC, work: [w("order", "Manuell orderregistrering", 10, 150, 70), w("bom", "Stycklistor och produktionsorder", 20, 60, 60), w("plan", "Material- och kapacitetsplanering", 480, 4, 60), w("trace", "Spårbarhet och batchhantering", 15, 40, 70), w("purchase", "Inköpsförslag och beställningar", 20, 40, 70), ...common],
    leakage: [l("missed", "Försenade leveranser och viten", 25_000, 4, 80), l("wrong", "Kassationer och omarbete", 20_000, 6, 60), l("lost", "Förlorade kunder", 150_000, 1, 50)] },
  Tjänster: { ...BC, hourlyCost: 600, work: [w("time", "Tidrapportering och attest", 10, 300, 70), w("projinv", "Projektfakturering", 20, 60, 80), w("proj", "Projektuppföljning och prognos", 240, 4, 60), w("expense", "Utlägg och reseräkningar", 10, 60, 80), ...common],
    leakage: [l("missed", "Ej fakturerad tid", 1_200, 200, 100), l("wrong", "Kreditfakturor och tvister", 10_000, 4, 70), l("lost", "Förlorade kunder", 150_000, 1, 50)] },
};
export const bcExampleForIndustry = (industry?: string): BusinessValueInput => (industry && BC_INDUSTRY_EXAMPLES[industry]) || BC;
