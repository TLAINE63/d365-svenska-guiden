import { describe, expect, it } from "vitest";
import { orderPrice, premiumPriceComparison, MONTHLY_NOTICE_MONTHS, type OrderSelection } from "../partnerOrder";
import { MONTH_PRICE, YEAR_PRICE } from "../budget2027";
import { DEFAULT_PRICING } from "../budgetPricing";

describe("Premium-priser 2026-11-24", () => {
  it("månadsabonnemang har en månads uppsägningstid", () => {
    expect(MONTHLY_NOTICE_MONTHS).toBe(1);
  });
  const cases = [
    { areas: ["bc"], monthly: 1000, monthlyTotal: 12000, annual: 8000, savings: 4000, savingsPercent: 33 },
    { areas: ["bc", "crm"], monthly: 1300, monthlyTotal: 15600, annual: 10500, savings: 5100, savingsPercent: 33 },
    { areas: ["bc", "crm", "fscm"], monthly: 1500, monthlyTotal: 18000, annual: 12000, savings: 6000, savingsPercent: 33 },
  ];
  for (const { areas, ...expected } of cases) {
    it(`${areas.length} produktområden: månad, årsavtal och rabatt`, () => {
      expect(premiumPriceComparison(areas.length)).toEqual({ areas: areas.length, ...expected });
      const selection: OrderSelection = { level: "premium", period: "month", areas: areas as OrderSelection["areas"], mediation: false, start_date: "2099-01-01" };
      expect(orderPrice(selection)).toBe(expected.monthly);
      expect(orderPrice({ ...selection, period: "year" })).toBe(expected.annual);
      expect(MONTH_PRICE[areas.length]).toBe(expected.monthly);
      expect(YEAR_PRICE[areas.length]).toBe(expected.annual);
      expect(DEFAULT_PRICING.units[`month${areas.length}`]).toBe(expected.monthly);
      expect(DEFAULT_PRICING.units[`year${areas.length}`]).toBe(expected.annual);
    });
  }
});