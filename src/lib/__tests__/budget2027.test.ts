import { describe, it, expect } from "vitest";
import { forecastRevenue, type PartnerForecast } from "../budget2027";

const base: PartnerForecast = { forecast: "none", products: 1, discount: 0, meetingsStd: 0, dealsStd: 0, meetingsFscm: 0, dealsFscm: 0, successBasis: 0 };

describe("budget 2027", () => {
  it("annual subscription with 3 products is 19 950 kr", () => {
    expect(forecastRevenue({ ...base, forecast: "year", products: 3 }).subscription).toBe(19950);
  });
  it("100 % discount gives zero subscription", () => {
    expect(forecastRevenue({ ...base, forecast: "month", products: 2, discount: 100 }).subscription).toBe(0);
  });
  it("BC meeting + deal totals 5 000 kr (meeting credited)", () => {
    expect(forecastRevenue({ ...base, meetingsStd: 1, dealsStd: 1 }).finders).toBe(5000);
  });
  it("F&SCM meeting + deal totals 10 000 kr", () => {
    expect(forecastRevenue({ ...base, meetingsFscm: 1, dealsFscm: 1 }).finders).toBe(10000);
  });
  it("success fee 2.5 % only above 100 000 kr", () => {
    expect(forecastRevenue({ ...base, successBasis: 100000 }).finders).toBe(0);
    expect(forecastRevenue({ ...base, successBasis: 400000 }).finders).toBe(10000);
  });
});
