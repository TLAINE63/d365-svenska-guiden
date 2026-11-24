import { describe, it, expect } from "vitest";
import { effectiveMonthly, premiumBreakEvenDealValue } from "../premiumValue";

describe("Premium värdeargument", () => {
  it("effektiv månadskostnad vid årsbetalning: 667 / 875 / 1 000 kr", () => {
    expect([effectiveMonthly(1), effectiveMonthly(2), effectiveMonthly(3)]).toEqual([667, 875, 1000]);
  });
  it("en affär på 320 000 kr täcker årsavgiften för ett produktområde", () => {
    expect(premiumBreakEvenDealValue(1)).toBe(320000);
  });
});
