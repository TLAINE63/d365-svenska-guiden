/**
 * Enkel, transparent modell för att uppskatta omfattning och kostnad för en
 * Dynamics 365-implementation. Alla antaganden är medvetet öppna (TAYA) och
 * visas för besökaren i UI:t.
 */

export type SolutionKey =
  | "bc"
  | "fscm"
  | "sales"
  | "customer-service"
  | "field-service"
  | "project-operations";

export interface SolutionOption {
  key: SolutionKey;
  label: string;
  /** Grundtimmar för en liten, standardnära implementation. */
  baseHours: number;
  /** Prisnycklar i product_prices för licensuppskattning. */
  licenseKeys: { standard: string; premium: string };
  standardLabel: string;
  premiumLabel: string;
  /** Publik produktsida för fördjupning. */
  path: string;
}

export const SOLUTIONS: SolutionOption[] = [
  {
    key: "bc",
    label: "Business Central",
    baseHours: 320,
    licenseKeys: { standard: "bc-essentials", premium: "bc-premium" },
    standardLabel: "Essentials",
    premiumLabel: "Premium",
    path: "/businesscentral/",
  },
  {
    key: "fscm",
    label: "Finance & Supply Chain",
    baseHours: 900,
    licenseKeys: { standard: "finance", premium: "finance-premium" },
    standardLabel: "Finance",
    premiumLabel: "Finance Premium",
    path: "/finance-supply-chain/",
  },
  {
    key: "sales",
    label: "Sales (CRM)",
    baseHours: 220,
    licenseKeys: { standard: "sales-professional", premium: "sales-enterprise" },
    standardLabel: "Professional",
    premiumLabel: "Enterprise",
    path: "/d365sales/",
  },
  {
    key: "customer-service",
    label: "Customer Service",
    baseHours: 240,
    licenseKeys: {
      standard: "customer-service-pro",
      premium: "customer-service-enterprise",
    },
    standardLabel: "Professional",
    premiumLabel: "Enterprise",
    path: "/d365customerservice/",
  },
  {
    key: "field-service",
    label: "Field Service",
    baseHours: 320,
    licenseKeys: { standard: "field-service", premium: "field-service" },
    standardLabel: "Field Service",
    premiumLabel: "Field Service",
    path: "/d365fieldservice/",
  },
  {
    key: "project-operations",
    label: "Project Operations",
    baseHours: 340,
    licenseKeys: { standard: "project-operations", premium: "project-operations" },
    standardLabel: "Project Operations",
    premiumLabel: "Project Operations",
    path: "/d365projectoperations/",
  },
];

export type Complexity = "standardnara" | "anpassad" | "komplex";

export const COMPLEXITY_OPTIONS: { key: Complexity; label: string; factor: number; note: string }[] = [
  {
    key: "standardnara",
    label: "Standardnära",
    factor: 1,
    note: "Ni anpassar verksamheten efter systemets standardprocesser.",
  },
  {
    key: "anpassad",
    label: "Viss anpassning",
    factor: 1.35,
    note: "Några egna processer och tillägg utöver standard.",
  },
  {
    key: "komplex",
    label: "Komplex verksamhet",
    factor: 1.85,
    note: "Många särkrav, egen utveckling och tunga processflöden.",
  },
];

export interface EstimateInputs {
  solutions: SolutionKey[];
  users: number;
  premiumLicense: boolean;
  complexity: Complexity;
  integrations: number;
  legalEntities: number;
  dataMigration: boolean;
  customDevelopment: boolean;
  training: boolean;
  hourlyRate: number;
}

export interface PhaseBreakdown {
  name: string;
  share: number;
  hours: number;
  cost: number;
}

/** Ett granskningsbart steg i beräkningen – visas i UI:t så att besökaren kan följa hela kedjan. */
export interface CalculationStep {
  /** Kort rubrik, t.ex. "Grundomfattning per lösning". */
  label: string;
  /** Resultatet efter steget, t.ex. "412 tim". */
  value: string;
  /** Vilken formel/regel som används. */
  formula: string;
  /** Vilka av besökarens val som driver steget. */
  drivers: { label: string; value: string }[];
  /** Fri text som förklarar varför regeln ser ut som den gör. */
  note: string;
  /** Vad steget påverkar: omfattning/timmar, pengar eller tid. */
  impact: "timmar" | "kostnad" | "tid" | "licens";
}

export interface EstimateResult {
  hours: number;
  costMid: number;
  costLow: number;
  costHigh: number;
  months: number;
  phases: PhaseBreakdown[];
  licenseMonthly: number | null;
  licenseYearly: number | null;
  threeYearTotal: number | null;
  supportYearly: number;
  /** Steg-för-steg-spår över hur timmar, kostnad och tid räknas fram. */
  steps: CalculationStep[];
}


const PHASES: { name: string; share: number }[] = [
  { name: "Förstudie & lösningsdesign", share: 0.15 },
  { name: "Konfiguration & uppsättning", share: 0.3 },
  { name: "Integrationer & datamigrering", share: 0.25 },
  { name: "Test & kvalitetssäkring", share: 0.15 },
  { name: "Utbildning & go-live", share: 0.15 },
];

/** Skalfaktor på antal användare – fler användare ger mer, men inte linjärt. */
function userFactor(users: number): number {
  const u = Math.max(1, users);
  return 0.65 + Math.pow(u / 25, 0.55) * 0.5;
}

export function estimateImplementation(
  inputs: EstimateInputs,
  priceLookup: (key: string) => number | null,
): EstimateResult {
  const selected = SOLUTIONS.filter((s) => inputs.solutions.includes(s.key));

  // Fler lösningar samtidigt ger stordriftsfördelar: full vikt på den största,
  // 70 % på övriga.
  const sortedBase = selected.map((s) => s.baseHours).sort((a, b) => b - a);
  const baseHours = sortedBase.reduce(
    (sum, h, i) => sum + (i === 0 ? h : h * 0.7),
    0,
  );

  const complexity =
    COMPLEXITY_OPTIONS.find((c) => c.key === inputs.complexity) ?? COMPLEXITY_OPTIONS[0];

  let hours = baseHours * userFactor(inputs.users) * complexity.factor;
  hours += inputs.integrations * 45;
  hours += Math.max(0, inputs.legalEntities - 1) * 60;
  if (inputs.dataMigration) hours *= 1.12;
  if (inputs.customDevelopment) hours *= 1.2;
  if (inputs.training) hours += Math.min(160, 12 + inputs.users * 1.5);

  hours = Math.round(hours);

  const costMid = hours * inputs.hourlyRate;
  const costLow = costMid * 0.8;
  const costHigh = costMid * 1.3;

  // Ungefärlig kalendertid: ett team levererar ca 130 effektiva timmar/månad.
  const months = Math.max(2, Math.round((hours / 130) * 2) / 2);

  const phases = PHASES.map((p) => ({
    name: p.name,
    share: p.share,
    hours: Math.round(hours * p.share),
    cost: Math.round(costMid * p.share),
  }));

  let licenseMonthly: number | null = 0;
  for (const s of selected) {
    const key = inputs.premiumLicense ? s.licenseKeys.premium : s.licenseKeys.standard;
    const price = priceLookup(key);
    if (price == null) {
      licenseMonthly = null;
      break;
    }
    licenseMonthly += price * inputs.users;
  }

  const licenseYearly = licenseMonthly == null ? null : licenseMonthly * 12;
  const supportYearly = Math.round(costMid * 0.15);
  const threeYearTotal =
    licenseYearly == null ? null : Math.round(costMid + licenseYearly * 3 + supportYearly * 3);

  return {
    hours,
    costMid: Math.round(costMid),
    costLow: Math.round(costLow),
    costHigh: Math.round(costHigh),
    months,
    phases,
    licenseMonthly: licenseMonthly == null ? null : Math.round(licenseMonthly),
    licenseYearly: licenseYearly == null ? null : Math.round(licenseYearly),
    threeYearTotal,
    supportYearly,
  };
}
