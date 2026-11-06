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

import { isvRevenue, annual } from "../budget2027";
describe("ISV budget 2027", () => {
  const z = { presence: false, extraApps: 0, discount: 0, introsStd: 0, introsFscm: 0, successBasis: 0 };
  it("presence with two extra apps is 5 990 + 2 × 995 kr", () => {
    expect(isvRevenue({ ...z, presence: true, extraApps: 2 }).subscription).toBe(7980);
  });
  it("accepted introductions BC/CRM 3 500, F&SCM 7 500 plus 2.5 %", () => {
    expect(isvRevenue({ ...z, introsStd: 1, introsFscm: 1, successBasis: 100000 }).finders).toBe(13500);
  });
  it("monthly amount counts twelve times per year", () => {
    expect(annual({ amount: 1000, period: "month" })).toBe(12000);
  });
});

import { detailByCategory, estimateRevenue } from "../budget2027";
describe("category estimates", () => {
  it("counts a yearly 2-product partner at 15 950 kr after discount", () => {
    const d = detailByCategory([{ forecast: "year", products: 2, discount: 50, meetingsStd: 2, dealsStd: 0, meetingsFscm: 0, dealsFscm: 0, successBasis: 0 }], []);
    expect(d.year2).toEqual({ count: 1, revenue: 7975 });
    expect(d.meetingsStd.revenue).toBe(5000);
  });
  it("estimate: 3 ISV Presence = 17 970 kr", () => { expect(estimateRevenue({ isvPresence: 3 })).toBe(17970); });
});
