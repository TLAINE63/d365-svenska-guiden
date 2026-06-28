// Branschspecifika effektiviseringsdrivare för Dynamics 365 Sales ROI-kalkylatorn.
// Sales-fokus: pipeline-kvalitet, vinstgrad, säljcykel, prognossäkerhet,
// säljarproduktivitet och ramp-up. Estimaten är konservativa och skalas
// med antal säljare (sublinjärt) i kalkylatorn.

export type SalesIndustry =
  | "B2B-tjänster"
  | "Tillverkning"
  | "Distribution & grossist"
  | "Tech & SaaS"
  | "Finans & försäkring"
  | "Bygg & installation"
  | "Annan";

export interface SalesRoiDriver {
  id: string;
  label: string;
  hint: string;
  /** Returnerar uppskattad årlig nytta i SEK utifrån omsättning och antal säljare. */
  savings: (revenue: number, sellers: number) => number;
  /** Engångskostnad som läggs på implementation om drivaren är aktiv. */
  implCost: number;
  defaultOn?: boolean;
}

const perSeller = (sek: number) => (_rev: number, sellers: number) => sek * sellers;
const pctOfRev = (pct: number, cap = Infinity) => (rev: number) =>
  Math.min(cap, Math.max(0, rev) * pct);
// Blandad: liten andel av omsättning + bonus per säljare, för pipeline/win-rate-effekter.
const revAndSeller = (pct: number, cap: number, perSellerSek: number) =>
  (rev: number, sellers: number) =>
    Math.min(cap, Math.max(0, rev) * pct) + perSellerSek * sellers;

export const SALES_INDUSTRY_DRIVERS: Record<SalesIndustry, SalesRoiDriver[]> = {
  "B2B-tjänster": [
    {
      id: "lead-conversion",
      label: "Högre lead-to-opportunity-konvertering",
      hint: "Lead scoring & strukturerad kvalificering",
      savings: revAndSeller(0.004, 350_000, 18_000),
      implCost: 60_000,
      defaultOn: true,
    },
    {
      id: "win-rate",
      label: "Förbättrad vinstgrad i pipeline",
      hint: "Playbooks, sales stages, Copilot-coaching",
      savings: revAndSeller(0.005, 500_000, 22_000),
      implCost: 90_000,
      defaultOn: true,
    },
    {
      id: "seller-productivity",
      label: "Säljarproduktivitet (Outlook/Teams)",
      hint: "Mindre admin – Copilot & inbox-flow",
      savings: perSeller(45_000),
      implCost: 60_000,
      defaultOn: true,
    },
    {
      id: "forecast",
      label: "Säkrare försäljningsprognos",
      hint: "Pipeline-hygien & predictive forecasting",
      savings: pctOfRev(0.002, 250_000),
      implCost: 70_000,
      defaultOn: true,
    },
    {
      id: "quote-config",
      label: "Snabbare offert & avtal",
      hint: "CPQ, mallar, e-signering",
      savings: perSeller(25_000),
      implCost: 90_000,
      defaultOn: false,
    },
  ],

  Tillverkning: [
    {
      id: "long-cycle",
      label: "Strukturerad hantering av långa säljcykler",
      hint: "Account planning, multi-stakeholder-spår",
      savings: revAndSeller(0.004, 600_000, 25_000),
      implCost: 120_000,
      defaultOn: true,
    },
    {
      id: "quote-config",
      label: "Offert- & konfigurationshantering (CPQ)",
      hint: "Komplex produktstruktur, marginalkontroll",
      savings: revAndSeller(0.003, 400_000, 20_000),
      implCost: 150_000,
      defaultOn: true,
    },
    {
      id: "channel",
      label: "Partner-/återförsäljarstöd",
      hint: "Distributörsportal, deal registration",
      savings: pctOfRev(0.0025, 300_000),
      implCost: 100_000,
      defaultOn: true,
    },
    {
      id: "service-cross-sell",
      label: "Mer-/eftermarknadsförsäljning",
      hint: "Reservdelar, service-kontrakt, garantier",
      savings: perSeller(35_000),
      implCost: 80_000,
      defaultOn: true,
    },
    {
      id: "erp-integration",
      label: "Integration mot ERP (order & marginal)",
      hint: "Realtidspris, lager, kreditstatus i CRM",
      savings: perSeller(20_000),
      implCost: 100_000,
      defaultOn: true,
    },
  ],

  "Distribution & grossist": [
    {
      id: "account-coverage",
      label: "Bättre kundtäckning per säljare",
      hint: "Account-plan & besöksplanering",
      savings: perSeller(40_000),
      implCost: 70_000,
      defaultOn: true,
    },
    {
      id: "cross-sell",
      label: "Korsförsäljning på befintliga kunder",
      hint: "Produktrekommendationer & nästa-bästa-erbjudande",
      savings: pctOfRev(0.003, 400_000),
      implCost: 80_000,
      defaultOn: true,
    },
    {
      id: "quote-speed",
      label: "Snabbare offert mot stort sortiment",
      hint: "Pris-/rabattmatriser direkt i CRM",
      savings: perSeller(22_000),
      implCost: 70_000,
      defaultOn: true,
    },
    {
      id: "field-sales",
      label: "Mobil/fältsäljarstöd",
      hint: "Offline-besök, orderläggning på plats",
      savings: perSeller(30_000),
      implCost: 90_000,
      defaultOn: false,
    },
    {
      id: "erp-integration",
      label: "Integration mot ERP (lager & marginal)",
      hint: "Realtidsdata in i säljdialogen",
      savings: perSeller(18_000),
      implCost: 100_000,
      defaultOn: true,
    },
  ],

  "Tech & SaaS": [
    {
      id: "lead-conversion",
      label: "Marketing-to-Sales-konvertering",
      hint: "Lead scoring, SLA, MQL→SQL-flöde",
      savings: revAndSeller(0.005, 500_000, 25_000),
      implCost: 70_000,
      defaultOn: true,
    },
    {
      id: "win-rate",
      label: "Högre win-rate via Copilot-coaching",
      hint: "Samtalsanalys, deal-rådgivning i realtid",
      savings: revAndSeller(0.006, 800_000, 30_000),
      implCost: 100_000,
      defaultOn: true,
    },
    {
      id: "ramp",
      label: "Snabbare ramp-up av nya säljare",
      hint: "Sales accelerator, playbooks, AI-assistent",
      savings: perSeller(35_000),
      implCost: 80_000,
      defaultOn: true,
    },
    {
      id: "expansion",
      label: "Expansion & upsell på kundbas",
      hint: "Health score, NRR, upsell-signaler",
      savings: pctOfRev(0.005, 700_000),
      implCost: 110_000,
      defaultOn: true,
    },
    {
      id: "churn",
      label: "Lägre kundbortfall (kopplat till CS)",
      hint: "Tidig varning & strukturerad förlängning",
      savings: pctOfRev(0.004, 600_000),
      implCost: 90_000,
      defaultOn: false,
    },
  ],

  "Finans & försäkring": [
    {
      id: "advisor-productivity",
      label: "Rådgivar-/mäklareffektivitet",
      hint: "360°-vy av kund, mindre dubbelarbete",
      savings: perSeller(50_000),
      implCost: 100_000,
      defaultOn: true,
    },
    {
      id: "compliance",
      label: "Strukturerad rådgivning & dokumentation",
      hint: "Spårbarhet & regulatoriska checkar",
      savings: perSeller(25_000),
      implCost: 150_000,
      defaultOn: true,
    },
    {
      id: "cross-sell",
      label: "Korsförsäljning på befintliga kunder",
      hint: "Produktrekommendation utifrån livshändelser",
      savings: pctOfRev(0.0035, 500_000),
      implCost: 100_000,
      defaultOn: true,
    },
    {
      id: "lead-conversion",
      label: "Bättre lead-kvalificering",
      hint: "Scoring, automatiserad fördelning",
      savings: revAndSeller(0.003, 400_000, 18_000),
      implCost: 70_000,
      defaultOn: true,
    },
  ],

  "Bygg & installation": [
    {
      id: "project-pipeline",
      label: "Strukturerad projektpipeline",
      hint: "Anbud, vinst-/förlustanalys, beläggning",
      savings: revAndSeller(0.003, 400_000, 22_000),
      implCost: 100_000,
      defaultOn: true,
    },
    {
      id: "quote-config",
      label: "Anbud & kalkyl",
      hint: "Mallar, marginalkontroll, e-signering",
      savings: perSeller(28_000),
      implCost: 90_000,
      defaultOn: true,
    },
    {
      id: "field-sales",
      label: "Mobil för säljare/projektledare",
      hint: "Besök & uppföljning från fält",
      savings: perSeller(22_000),
      implCost: 80_000,
      defaultOn: true,
    },
    {
      id: "service-cross-sell",
      label: "Service- & underhållsförsäljning",
      hint: "Återkommande intäkt efter leverans",
      savings: pctOfRev(0.002, 250_000),
      implCost: 70_000,
      defaultOn: false,
    },
  ],

  Annan: [
    {
      id: "seller-productivity",
      label: "Säljarproduktivitet",
      hint: "Mindre admin, mer kundtid – Copilot & 365-flöde",
      savings: perSeller(40_000),
      implCost: 60_000,
      defaultOn: true,
    },
    {
      id: "lead-conversion",
      label: "Bättre lead-konvertering",
      hint: "Scoring & strukturerad uppföljning",
      savings: revAndSeller(0.004, 350_000, 15_000),
      implCost: 70_000,
      defaultOn: true,
    },
    {
      id: "forecast",
      label: "Säkrare prognos",
      hint: "Pipeline-hygien & predictive insights",
      savings: pctOfRev(0.002, 200_000),
      implCost: 60_000,
      defaultOn: true,
    },
    {
      id: "win-rate",
      label: "Högre vinstgrad",
      hint: "Playbooks & Copilot-coaching",
      savings: revAndSeller(0.004, 400_000, 18_000),
      implCost: 80_000,
      defaultOn: false,
    },
  ],
};

export const defaultEnabledSalesDrivers = (industry: SalesIndustry): string[] =>
  SALES_INDUSTRY_DRIVERS[industry].filter((d) => d.defaultOn).map((d) => d.id);

/** Implementationsfaktor per bransch (multiplicerar baskostnad). */
export const SALES_INDUSTRY_IMPL_FACTOR: Record<SalesIndustry, number> = {
  Tillverkning: 1.3,
  "Finans & försäkring": 1.3,
  "Distribution & grossist": 1.1,
  "Tech & SaaS": 1.0,
  "B2B-tjänster": 0.9,
  "Bygg & installation": 1.0,
  Annan: 1.0,
};
