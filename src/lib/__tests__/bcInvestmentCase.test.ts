import { describe, it, expect } from "vitest";
import { evaluatePath } from "../bcInvestmentCase";

const base = { currentYearly: 250_000, licenseYearly: 350_000, supportPercent: 0, customImplementation: 300_000, annualBenefit: 250_000, scenario: "normal" as const, years: 5 as const };

describe("bcInvestmentCase", () => {
  it("quickstart costs 50 000 kr one-off", () => {
    expect(evaluatePath("quickstart", base).oneOff).toBe(50_000);
  });
  it("extra cost = one-off + yearly difference vs today", () => {
    // 300 000 + 5 × (350 000 − 250 000) = 800 000
    expect(evaluatePath("custom", base).extraCost).toBe(800_000);
  });
  it("custom ramps benefit 50 % / 80 % / 100 %", () => {
    expect(evaluatePath("custom", base).benefit).toBe(250_000 * 4.3);
  });
  it("cautious scenario reduces benefit by 25 %", () => {
    expect(evaluatePath("quickstart", { ...base, scenario: "cautious" }).benefit).toBe(250_000 * 0.75 * 5);
  });
  it("phased invests quickstart plus remaining scope", () => {
    expect(evaluatePath("phased", base).oneOff).toBe(325_000);
    expect(evaluatePath("phased", base).firstYearInvest).toBe(50_000);
  });
});

import { evaluatePath as ep } from "../bcInvestmentCase";
describe("NPV", () => {
  it("diskonterar med 5 %", () => {
    const r = ep("quickstart", { currentYearly: 0, licenseYearly: 0, supportPercent: 0, customImplementation: 0, annualBenefit: 105_000, scenario: "normal", years: 3 });
    expect(Math.round(r.npv)).toBe(Math.round((105_000 - 50_000) / 1.05 + 105_000 / 1.05 ** 2 + 105_000 / 1.05 ** 3));
  });
});

import { REALIZATION } from "@/lib/bcInvestmentCase";
describe("industry realization", () => {
  it("manufacturing realizes custom benefit slower than services", () => {
    const b = { currentYearly: 0, licenseYearly: 0, supportPercent: 0, customImplementation: 300_000, annualBenefit: 100_000, scenario: "normal" as const, years: 3 as const };
    expect(evaluatePath("custom", { ...b, industry: "Tillverkning" }).benefit).toBeCloseTo(205_000);
    expect(evaluatePath("custom", { ...b, industry: "Tjänster" }).benefit).toBeCloseTo(250_000);
    expect(REALIZATION.Annan.custom).toEqual([0.5, 0.8]);
  });
});
