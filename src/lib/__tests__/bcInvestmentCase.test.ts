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
  it("custom gives half benefit year 1", () => {
    expect(evaluatePath("custom", base).benefit).toBe(250_000 * 4.5);
  });
  it("cautious scenario reduces benefit by 25 %", () => {
    expect(evaluatePath("quickstart", { ...base, scenario: "cautious" }).benefit).toBe(250_000 * 0.75 * 5);
  });
  it("phased invests quickstart plus remaining scope", () => {
    expect(evaluatePath("phased", base).oneOff).toBe(300_000);
  });
});
