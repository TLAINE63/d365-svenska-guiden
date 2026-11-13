/** Investeringskalkyl: nuläge mot tre leveransvägar för Business Central. Ren logik, ingen diskontering. */
export type DeliveryPath = "quickstart" | "phased" | "custom";
export type Scenario = "cautious" | "normal" | "optimistic";

export const QUICKSTART_PRICE = 50_000;
export const PHASE_OVERHEAD = 0.1;
export const DISCOUNT_RATE = 0.05; // kalkylränta (WACC) som i Excel-modellen
export const SCENARIO_FACTOR: Record<Scenario, number> = { cautious: 0.75, normal: 1, optimistic: 1.25 };

export interface CaseInput {
  currentYearly: number; // nuvarande IT-kostnad per år
  licenseYearly: number;
  supportPercent: number; // förvaltning från år 2, % av införandet
  customImplementation: number;
  annualBenefit: number;
  scenario: Scenario;
  years: 3 | 5;
}

export interface PathResult {
  path: DeliveryPath;
  firstYearInvest: number;
  oneOff: number; // summa engångsinvesteringar över perioden
  extraCost: number; // merkostnad mot nuläget
  benefit: number;
  net: number;
  roiPct: number | null;
  paybackMonths: number | null;
  npv: number; // nuvärde av årligt nettokassaflöde mot i dag, 5 % ränta
}

/** Kassaflöde per år (kostnad, nytta) för en leveransväg. */
function yearly(path: DeliveryPath, i: CaseInput) {
  const b = i.annualBenefit * SCENARIO_FACTOR[i.scenario];
  const rows: { invest: number; run: number; benefit: number }[] = [];
  for (let y = 1; y <= i.years; y++) {
    let invest = 0, base = 0, share = 1;
    if (path === "quickstart") {
      invest = y === 1 ? QUICKSTART_PRICE : 0;
      base = QUICKSTART_PRICE;
    } else if (path === "custom") {
      invest = y === 1 ? i.customImplementation : 0;
      base = i.customImplementation;
      share = y === 1 ? 0.5 : y === 2 ? 0.8 : 1; // realiseringstakt enligt Excel-modellen
    } else {
      // Etappvis: snabbstart år 1, resterande omfattning år 2.
      // Andra etappen kräver ny uppstart och viss omarbetning: +10 % på resterande omfattning.
      const rest = Math.max(0, i.customImplementation - QUICKSTART_PRICE) * (1 + PHASE_OVERHEAD);
      invest = y === 1 ? QUICKSTART_PRICE : y === 2 ? rest : 0;
      base = y === 1 ? QUICKSTART_PRICE : QUICKSTART_PRICE + rest;
      share = y === 1 ? 0.3 : y === 2 ? 0.7 : 1; // år 1 bara standardflöden
    }
    const support = y === 1 ? 0 : (base * i.supportPercent) / 100;
    rows.push({ invest, run: i.licenseYearly + support, benefit: b * share });
  }
  return rows;
}

export function evaluatePath(path: DeliveryPath, i: CaseInput): PathResult {
  const rows = yearly(path, i);
  let oneOff = 0, extraCost = 0, benefit = 0, cum = 0;
  let paybackMonths: number | null = null;
  let npv = 0;
  rows.forEach((r, idx) => {
    npv += (r.benefit - (r.invest + r.run - i.currentYearly)) / Math.pow(1 + DISCOUNT_RATE, idx + 1);
    oneOff += r.invest;
    const extra = r.invest + r.run - i.currentYearly;
    extraCost += extra;
    benefit += r.benefit;
    const monthly = (r.benefit - extra) / 12;
    if (paybackMonths === null) {
      // investering betalas vid årets start, nytta/löpande jämnt över året
      const start = cum - r.invest;
      const runMonthly = (r.benefit - (r.run - i.currentYearly)) / 12;
      if (start >= 0) paybackMonths = idx * 12;
      else if (runMonthly > 0 && start + runMonthly * 12 >= 0) paybackMonths = idx * 12 + -start / runMonthly;
    }
    cum += monthly * 12;
  });
  const net = benefit - extraCost;
  return { path, firstYearInvest: rows[0]?.invest ?? 0, oneOff, extraCost, benefit, net, roiPct: extraCost > 0 ? (net / extraCost) * 100 : null, paybackMonths, npv };
}

export function evaluateAll(i: CaseInput): PathResult[] {
  return (["quickstart", "phased", "custom"] as DeliveryPath[]).map((p) => evaluatePath(p, i));
}
