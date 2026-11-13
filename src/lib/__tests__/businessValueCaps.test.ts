import { describe, it, expect } from "vitest";
import { workRowValue, leakRowValue, challengeRowValue, costRowValue, realizedBenefit, exampleFor, CRM_INDUSTRY_EXAMPLES } from "../businessValue";

describe("spärrar mot orimlig nytta", () => {
  it("tidsbesparing tas max 80 % och dämpas med 0,85", () =>
    expect(workRowValue({ id: "a", label: "", minutes: 60, perMonth: 10, savingPct: 100 }, 500)).toBeCloseTo(120 * 500 * 0.8 * 0.85));
  it("räddade affärer max 75 %", () =>
    expect(leakRowValue({ id: "a", label: "", value: 100_000, perYear: 1, savingPct: 100 }, 100)).toBeCloseTo(100_000 * 0.75 * 0.85));
  it("verksamhetsutmaningar max 30 %", () =>
    expect(challengeRowValue({ id: "a", label: "", yearly: 100_000, savingPct: 90 })).toBeCloseTo(100_000 * 0.3 * 0.85));
  it("ersatta kostnader räknas fullt", () => expect(costRowValue({ id: "a", label: "", yearly: 50_000, savingPct: 100 })).toBe(50_000));
  it("realiseringstakt 50/80 % ger 3,3 årsnyttor på 5 år", () => expect(realizedBenefit(100, 5, [0.5, 0.8])).toBeCloseTo(430));
  it("Sales får branschanpassat CRM-exempel", () => expect(exampleFor("sales", "Tjänster")).toBe(CRM_INDUSTRY_EXAMPLES.Tjänster));
});
