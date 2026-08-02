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

const nf = (n: number, dec = 0) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: dec, minimumFractionDigits: 0 }).format(n);
const sek = (n: number) => `${nf(Math.round(n))} kr`;
const tim = (n: number) => `${nf(Math.round(n))} tim`;

export function estimateImplementation(
  inputs: EstimateInputs,
  priceLookup: (key: string) => number | null,
): EstimateResult {
  const selected = SOLUTIONS.filter((s) => inputs.solutions.includes(s.key));
  const steps: CalculationStep[] = [];

  // Fler lösningar samtidigt ger stordriftsfördelar: full vikt på den största,
  // 70 % på övriga.
  const sortedSelected = [...selected].sort((a, b) => b.baseHours - a.baseHours);
  const baseHours = sortedSelected.reduce(
    (sum, s, i) => sum + (i === 0 ? s.baseHours : s.baseHours * 0.7),
    0,
  );

  steps.push({
    label: "1. Grundomfattning per vald lösning",
    value: tim(baseHours),
    formula:
      sortedSelected
        .map((s, i) => (i === 0 ? `${s.baseHours}` : `${s.baseHours} × 0,7`))
        .join(" + ") + ` = ${tim(baseHours)}`,
    drivers: sortedSelected.map((s) => ({
      label: s.label,
      value: `${s.baseHours} bastimmar`,
    })),
    note:
      sortedSelected.length > 1
        ? "Den mest omfattande lösningen räknas med full vikt. Övriga räknas till 70 % eftersom förstudie, projektledning, testmiljöer och utbildningsupplägg delvis kan återanvändas i ett gemensamt program."
        : "Bastimmarna motsvarar ett typiskt, standardnära införande av lösningen för ca 25 användare – innan hänsyn tagits till era förutsättningar.",
    impact: "timmar",
  });

  const uf = userFactor(inputs.users);
  let hours = baseHours * uf;
  steps.push({
    label: "2. Skalning på antal användare",
    value: tim(hours),
    formula: `${tim(baseHours)} × ${nf(uf, 2)} = ${tim(hours)}`,
    drivers: [
      { label: "Antal användare", value: `${inputs.users} st` },
      { label: "Skalfaktor", value: nf(uf, 2) },
    ],
    note: "Skalfaktorn är 0,65 + (användare / 25)^0,55 × 0,5. Fler användare ger mer arbete med roller, behörigheter, utbildning och test – men inte linjärt, eftersom stora projekt blir effektivare per användare.",
    impact: "timmar",
  });

  const complexity =
    COMPLEXITY_OPTIONS.find((c) => c.key === inputs.complexity) ?? COMPLEXITY_OPTIONS[0];
  const beforeComplexity = hours;
  hours = hours * complexity.factor;
  steps.push({
    label: "3. Grad av anpassning",
    value: tim(hours),
    formula: `${tim(beforeComplexity)} × ${nf(complexity.factor, 2)} = ${tim(hours)}`,
    drivers: [
      { label: "Valt läge", value: complexity.label },
      { label: "Multiplikator", value: nf(complexity.factor, 2) },
    ],
    note: `${complexity.note} Multiplikatorerna är 1,0 (standardnära), 1,35 (viss anpassning) och 1,85 (komplex verksamhet).`,
    impact: "timmar",
  });

  const integrationHours = inputs.integrations * 45;
  const entityHours = Math.max(0, inputs.legalEntities - 1) * 60;
  const beforeAddons = hours;
  hours += integrationHours + entityHours;
  steps.push({
    label: "4. Integrationer och bolagsstruktur",
    value: tim(hours),
    formula: `${tim(beforeAddons)} + ${inputs.integrations} × 45 tim + ${Math.max(
      0,
      inputs.legalEntities - 1,
    )} × 60 tim = ${tim(hours)}`,
    drivers: [
      { label: "Integrationer", value: `${inputs.integrations} st → ${tim(integrationHours)}` },
      {
        label: "Extra bolag utöver det första",
        value: `${Math.max(0, inputs.legalEntities - 1)} st → ${tim(entityHours)}`,
      },
    ],
    note: "45 timmar per integration täcker specifikation, utveckling/uppsättning, felhantering och test. 60 timmar per extra juridisk enhet täcker kontoplan, valuta, moms, rapportering och koncernavstämning.",
    impact: "timmar",
  });

  const beforeOptions = hours;
  if (inputs.dataMigration) hours *= 1.12;
  const afterMigration = hours;
  if (inputs.customDevelopment) hours *= 1.2;
  const afterCustom = hours;
  const trainingHours = inputs.training ? Math.min(160, 12 + inputs.users * 1.5) : 0;
  hours += trainingHours;

  steps.push({
    label: "5. Tillval: migrering, utveckling och utbildning",
    value: tim(hours),
    formula: [
      `${tim(beforeOptions)}`,
      inputs.dataMigration ? `× 1,12 = ${tim(afterMigration)}` : "(ingen datamigrering)",
      inputs.customDevelopment ? `× 1,20 = ${tim(afterCustom)}` : "(ingen egen utveckling)",
      inputs.training ? `+ ${tim(trainingHours)} utbildning = ${tim(hours)}` : "(ingen utbildning)",
    ].join(" "),
    drivers: [
      { label: "Datamigrering", value: inputs.dataMigration ? "Ja (+12 %)" : "Nej" },
      { label: "Egen utveckling", value: inputs.customDevelopment ? "Ja (+20 %)" : "Nej" },
      {
        label: "Utbildning",
        value: inputs.training ? `Ja (${tim(trainingHours)})` : "Nej",
      },
    ],
    note: "Datamigrering läggs på som procent eftersom mängden data följer verksamhetens storlek. Utbildning räknas som 12 timmar + 1,5 timme per användare, med tak på 160 timmar.",
    impact: "timmar",
  });

  hours = Math.round(hours);

  const costMid = hours * inputs.hourlyRate;
  const costLow = costMid * 0.8;
  const costHigh = costMid * 1.3;

  steps.push({
    label: "6. Från timmar till kostnad",
    value: `${sek(costLow)} – ${sek(costHigh)}`,
    formula: `${tim(hours)} × ${sek(inputs.hourlyRate)}/tim = ${sek(costMid)} (spann −20 % / +30 %)`,
    drivers: [
      { label: "Total omfattning", value: tim(hours) },
      { label: "Konsultpris", value: `${sek(inputs.hourlyRate)}/tim` },
      { label: "Mittvärde", value: sek(costMid) },
    ],
    note: "Spannet speglar normal osäkerhet före förstudie: nedsidan förutsätter att ni håller er nära standard, uppsidan att fler krav dyker upp under projektet.",
    impact: "kostnad",
  });

  // Ungefärlig kalendertid: ett team levererar ca 130 effektiva timmar/månad.
  const months = Math.max(2, Math.round((hours / 130) * 2) / 2);
  steps.push({
    label: "7. Tidplan i kalendermånader",
    value: `ca ${String(months).replace(".", ",")} mån`,
    formula: `${tim(hours)} ÷ 130 tim/mån ≈ ${String(months).replace(".", ",")} månader (minst 2)`,
    drivers: [
      { label: "Total omfattning", value: tim(hours) },
      { label: "Antaget leveranstempo", value: "130 effektiva konsulttimmar/månad" },
    ],
    note: "130 timmar per månad motsvarar ett litet team som arbetar deltid i projektet parallellt med er egen verksamhet. Ett större team kortar tiden, men sällan proportionellt.",
    impact: "tid",
  });

  const phases = PHASES.map((p) => ({
    name: p.name,
    share: p.share,
    hours: Math.round(hours * p.share),
    cost: Math.round(costMid * p.share),
  }));

  steps.push({
    label: "8. Fördelning per projektfas",
    value: `${phases.length} faser`,
    formula: PHASES.map((p) => `${p.name} ${Math.round(p.share * 100)} %`).join(" · "),
    drivers: phases.map((p) => ({
      label: p.name,
      value: `${tim(p.hours)} · ${sek(p.cost)}`,
    })),
    note: "Fasfördelningen är en branschtypisk normalkurva. Vid många integrationer förskjuts vikten mot integrationsfasen, vid många användare mot utbildning.",
    impact: "kostnad",
  });

  let licenseMonthly: number | null = 0;
  const licenseDrivers: { label: string; value: string }[] = [];
  for (const s of selected) {
    const key = inputs.premiumLicense ? s.licenseKeys.premium : s.licenseKeys.standard;
    const levelLabel = inputs.premiumLicense ? s.premiumLabel : s.standardLabel;
    const price = priceLookup(key);
    if (price == null) {
      licenseDrivers.push({ label: `${s.label} (${levelLabel})`, value: "Offertpris" });
      licenseMonthly = null;
      continue;
    }
    licenseDrivers.push({
      label: `${s.label} (${levelLabel})`,
      value: `${sek(price)}/användare/mån × ${inputs.users} = ${sek(price * inputs.users)}`,
    });
    if (licenseMonthly != null) licenseMonthly += price * inputs.users;
  }

  const licenseYearly = licenseMonthly == null ? null : licenseMonthly * 12;
  const supportYearly = Math.round(costMid * 0.15);
  const threeYearTotal =
    licenseYearly == null ? null : Math.round(costMid + licenseYearly * 3 + supportYearly * 3);

  steps.push({
    label: "9. Licenskostnad",
    value: licenseMonthly == null ? "Offert" : `${sek(licenseMonthly)}/mån`,
    formula:
      licenseMonthly == null
        ? "Minst en av lösningarna saknar publikt listpris – den delen kräver offert."
        : `Summa listpriser × ${inputs.users} användare = ${sek(licenseMonthly)}/mån (${sek(
            licenseMonthly * 12,
          )}/år)`,
    drivers: licenseDrivers,
    note: "Priserna hämtas från våra publicerade listpriser för Dynamics 365 och antar en licens per användare. Verkligt pris påverkas av avtalsform, bindningstid och mixen av full- och lättanvändare.",
    impact: "licens",
  });

  steps.push({
    label: "10. Förvaltning och total kostnad över 3 år",
    value: threeYearTotal == null ? "Offert" : sek(threeYearTotal),
    formula:
      threeYearTotal == null
        ? `Förvaltning ${sek(supportYearly)}/år (15 % av ${sek(costMid)}). Totalen kräver licenspris.`
        : `${sek(costMid)} + ${sek(licenseYearly ?? 0)} × 3 + ${sek(supportYearly)} × 3 = ${sek(
            threeYearTotal,
          )}`,
    drivers: [
      { label: "Implementation (mittvärde)", value: sek(costMid) },
      { label: "Licens per år", value: licenseYearly == null ? "Offert" : sek(licenseYearly) },
      { label: "Förvaltning per år (15 %)", value: sek(supportYearly) },
    ],
    note: "Förvaltning omfattar support, uppdateringar, mindre förbättringar och löpande rådgivning. 15 % av implementationskostnaden per år är ett vanligt utfall – ambitiösa vidareutvecklingsplaner ger högre siffra.",
    impact: "kostnad",
  });

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
    steps,

  };
}
