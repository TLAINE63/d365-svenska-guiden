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
