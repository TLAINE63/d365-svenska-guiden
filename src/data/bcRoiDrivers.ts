// Branschspecifika effektiviseringsdrivare för BC ROI-kalkylatorn.
// Estimat baserade på Microsofts Business Value Assessment (oktober 2025)
// + svenska partnerbenchmarks. Värden är medvetet konservativa och skalas
// mjukt med omsättning där det är relevant.

export type Industry = "Handel" | "Distribution" | "Tillverkning" | "Tjänster" | "Annan";

export interface RoiDriver {
  id: string;
  label: string;
  hint: string;
  /** Returnerar uppskattad årlig nytta i SEK. */
  savings: (revenue: number) => number;
  /** Engångskostnad som läggs på implementation om drivaren är aktiv. */
  implCost: number;
  /** Vilka ISV-kategorier denna drivare gör mer relevanta (för rekommendationer). */
  isvCategories?: string[];
  defaultOn?: boolean;
}

const flat = (sek: number) => () => sek;
const pctOfRev = (pct: number, cap = Infinity) => (rev: number) =>
  Math.min(cap, Math.max(0, rev) * pct);

export const INDUSTRY_DRIVERS: Record<Industry, RoiDriver[]> = {
  Handel: [
    {
      id: "order-entry",
      label: "Snabbare orderregistrering",
      hint: "Färre manuella order, integrerad webshop & EDI",
      savings: flat(57_000),
      implCost: 60_000,
      isvCategories: ["EDI / e-faktura", "Integration / iPaaS"],
      defaultOn: true,
    },
    {
      id: "ecommerce",
      label: "Integrerad e-handel",
      hint: "Webshop kopplad till BC – färre fel, högre uplift",
      savings: pctOfRev(0.005, 400_000),
      implCost: 150_000,
      isvCategories: ["E-handel", "PIM"],
      defaultOn: true,
    },
    {
      id: "warehouse-light",
      label: "Lager- & plockeffektivitet",
      hint: "Streckkod/handdator, färre felplock",
      savings: pctOfRev(0.003, 250_000),
      implCost: 100_000,
      isvCategories: ["WMS"],
      defaultOn: true,
    },
    {
      id: "ap-automation",
      label: "Automatiserad leverantörsfaktura",
      hint: "OCR + matchning mot inköpsorder",
      savings: flat(80_000),
      implCost: 50_000,
      isvCategories: ["AP automation"],
      defaultOn: true,
    },
    {
      id: "pos",
      label: "Kassa-/POS-integration",
      hint: "Realtidsförsäljning in i BC, snabbare bokslut",
      savings: flat(60_000),
      implCost: 120_000,
      isvCategories: ["POS / Retail"],
      defaultOn: false,
    },
    {
      id: "price-currency",
      label: "Pris- & valutahantering",
      hint: "Lägre marginal-läckage på prisändringar",
      savings: pctOfRev(0.0015, 120_000),
      implCost: 30_000,
      defaultOn: false,
    },
  ],

  Distribution: [
    {
      id: "wms",
      label: "Avancerat lager (WMS)",
      hint: "Plockoptimering, zon-/vågplock, batchhantering",
      savings: pctOfRev(0.006, 600_000),
      implCost: 200_000,
      isvCategories: ["WMS"],
      defaultOn: true,
    },
    {
      id: "edi",
      label: "EDI & e-faktura",
      hint: "Automatiska kundorder, leveransbesked, fakturor",
      savings: flat(120_000),
      implCost: 90_000,
      isvCategories: ["EDI / e-faktura"],
      defaultOn: true,
    },
    {
      id: "tms",
      label: "Transport- & 3PL-integration",
      hint: "Fraktbokning och spårning direkt från BC",
      savings: flat(90_000),
      implCost: 80_000,
      isvCategories: ["Frakt / TMS", "3PL"],
      defaultOn: true,
    },
    {
      id: "ap-automation",
      label: "Automatiserad leverantörsfaktura",
      hint: "OCR + matchning mot inköpsorder",
      savings: flat(80_000),
      implCost: 50_000,
      isvCategories: ["AP automation"],
      defaultOn: true,
    },
    {
      id: "order-entry",
      label: "Snabbare orderregistrering",
      hint: "Mindre manuell handpåläggning, färre felorder",
      savings: flat(57_000),
      implCost: 40_000,
      defaultOn: true,
    },
    {
      id: "forecast",
      label: "Bättre prognos & inköp",
      hint: "Lägre kapitalbindning, färre brister",
      savings: pctOfRev(0.002, 200_000),
      implCost: 60_000,
      defaultOn: false,
    },
  ],

  Tillverkning: [
    {
      id: "production",
      label: "Produktionsplanering",
      hint: "Bättre beläggning, kortare ledtid",
      savings: pctOfRev(0.004, 500_000),
      implCost: 200_000,
      isvCategories: ["Tillverkning (advanced MFG)", "MES"],
      defaultOn: true,
    },
    {
      id: "quality",
      label: "Kvalitet & spårbarhet",
      hint: "Lot/serie-spårning, färre kassationer",
      savings: pctOfRev(0.0025, 250_000),
      implCost: 120_000,
      isvCategories: ["Kvalitet / QA", "Tillverkning (advanced MFG)"],
      defaultOn: true,
    },
    {
      id: "wms",
      label: "Lager (WMS)",
      hint: "Råvaror, mellanlager, färdigvaror",
      savings: pctOfRev(0.003, 300_000),
      implCost: 150_000,
      isvCategories: ["WMS"],
      defaultOn: true,
    },
    {
      id: "mrp",
      label: "MRP & inköp",
      hint: "Bättre materialplanering, lägre brist & överlager",
      savings: pctOfRev(0.003, 300_000),
      implCost: 80_000,
      defaultOn: true,
    },
    {
      id: "ap-automation",
      label: "Automatiserad leverantörsfaktura",
      hint: "OCR + matchning mot inköpsorder",
      savings: flat(80_000),
      implCost: 50_000,
      isvCategories: ["AP automation"],
      defaultOn: true,
    },
    {
      id: "service-after",
      label: "Eftermarknad & service",
      hint: "Reservdelar, garantier, fältservice",
      savings: flat(120_000),
      implCost: 100_000,
      defaultOn: false,
    },
  ],

  Tjänster: [
    {
      id: "project-time",
      label: "Projekt & tidrapportering",
      hint: "Mindre svinn, bättre debiterbarhet",
      savings: pctOfRev(0.008, 600_000),
      implCost: 120_000,
      isvCategories: ["Projekt / PSA", "Tidrapportering"],
      defaultOn: true,
    },
    {
      id: "tm-billing",
      label: "Tid- & materialfakturering",
      hint: "Snabbare fakturering, färre missade timmar",
      savings: pctOfRev(0.004, 300_000),
      implCost: 60_000,
      isvCategories: ["Projekt / PSA"],
      defaultOn: true,
    },
    {
      id: "resource",
      label: "Resursplanering & beläggning",
      hint: "Högre nyttjandegrad konsulter/specialister",
      savings: pctOfRev(0.005, 400_000),
      implCost: 80_000,
      isvCategories: ["Projekt / PSA"],
      defaultOn: true,
    },
    {
      id: "subscription",
      label: "Avtal & abonnemang",
      hint: "Återkommande fakturering, MRR-koll",
      savings: flat(120_000),
      implCost: 80_000,
      isvCategories: ["Subscription / Recurring billing"],
      defaultOn: false,
    },
    {
      id: "ap-automation",
      label: "Automatiserad leverantörsfaktura",
      hint: "OCR + attestflöde",
      savings: flat(60_000),
      implCost: 50_000,
      isvCategories: ["AP automation"],
      defaultOn: true,
    },
    {
      id: "expense",
      label: "Utlägg & reseräkningar",
      hint: "Mobil app, automatisk kontering",
      savings: flat(40_000),
      implCost: 30_000,
      isvCategories: ["Expense"],
      defaultOn: false,
    },
  ],

  Annan: [
    {
      id: "manual-process",
      label: "Automatisering av manuella processer",
      hint: "Order, fakturor, bokföring",
      savings: pctOfRev(0.006, 400_000),
      implCost: 80_000,
      defaultOn: true,
    },
    {
      id: "ap-automation",
      label: "Automatiserad leverantörsfaktura",
      hint: "OCR + matchning",
      savings: flat(70_000),
      implCost: 50_000,
      isvCategories: ["AP automation"],
      defaultOn: true,
    },
    {
      id: "reporting",
      label: "Rapportering & beslutsstöd",
      hint: "Snabbare bokslut, bättre prognoser",
      savings: flat(80_000),
      implCost: 60_000,
      defaultOn: true,
    },
    {
      id: "integration",
      label: "Systemintegration",
      hint: "Färre dubbelregistreringar mellan system",
      savings: flat(60_000),
      implCost: 40_000,
      isvCategories: ["Integration / iPaaS"],
      defaultOn: false,
    },
  ],
};

export const defaultEnabledDrivers = (industry: Industry): string[] =>
  INDUSTRY_DRIVERS[industry].filter((d) => d.defaultOn).map((d) => d.id);
