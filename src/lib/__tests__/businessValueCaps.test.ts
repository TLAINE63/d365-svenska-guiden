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

import { aiRowValue, capitalRowValue, cashFlow, EMPTY_BUSINESS_VALUE, evaluateBusinessValue } from "../businessValue";
describe("rörelsekapital, AI och kassaflöde", () => {
  it("AI räknas bara på återstående tid och max 50 %", () =>
    expect(aiRowValue({ id: "a", label: "", minutes: 60, perMonth: 10, savingPct: 80 }, 500, 90)).toBeCloseTo(120 * 0.2 * 0.5 * 500 * 0.85));
  it("rörelsekapital värderas med kapitalkostnad och max 30 % minskning", () =>
    expect(capitalRowValue({ id: "s", label: "", yearly: 1_000_000, savingPct: 50 }, 8)).toBeCloseTo(1_000_000 * 0.3 * 0.08 * 0.85));
  it("tom värdering ger noll även med nya delar", () => expect(evaluateBusinessValue(EMPTY_BUSINESS_VALUE).total).toBe(0));
  it("kassaflöde: projekt år 1, förvaltning därefter, payback och IRR", () => {
    const r = cashFlow({ benefit: 500_000, replaced: 0, ramp: [0.5, 0.8, 1, 1, 1], implementation: 300_000, licenseYearly: 100_000, supportPct: 10 });
    expect(r.rows[0].net).toBe(250_000 - 300_000 - 100_000);
    expect(r.rows[1].project).toBe(30_000);
    expect(r.paybackMonths).toBeGreaterThan(12);
    expect(r.paybackMonths).toBeLessThan(24);
    expect(r.irr).toBeGreaterThan(0.5);
  });
});
