import { describe, it, expect } from "vitest";
import { forecastRevenue, type PartnerForecast } from "../budget2027";

const base: PartnerForecast = { forecast: "none", products: 1, discount: 0, meetingsStd: 0, dealsStd: 0, meetingsFscm: 0, dealsFscm: 0, successBasis: 0 };

describe("budget 2027", () => {
  it("annual subscription with 3 products is 11 990 kr", () => {
    expect(forecastRevenue({ ...base, forecast: "year", products: 3 }).subscription).toBe(11990);
  });
  it("100 % discount gives zero subscription", () => {
    expect(forecastRevenue({ ...base, forecast: "month", products: 2, discount: 100 }).subscription).toBe(0);
  });
  it("BC meeting + deal totals 5 000 kr (meeting credited)", () => {
    expect(forecastRevenue({ ...base, forecast: "basic", meetingsStd: 1, dealsStd: 1 }).finders).toBe(5000);
  });
  it("F&SCM meeting + deal totals 10 000 kr", () => {
    expect(forecastRevenue({ ...base, forecast: "basic", meetingsFscm: 1, dealsFscm: 1 }).finders).toBe(10000);
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

import { detailByCategory, estimateRevenue, categoryGroupSummary, budgetIsvVendors } from "../budget2027";
describe("category estimates", () => {
  it("separates subscriptions and fixed finders fees for partners and ISVs while preserving totals", () => {
    const estimates = { year1: 2, premiumDealsStd: 3, isvPresence: 1, isvExtra: 2, isvIntroFscm: 1 };
    const details = detailByCategory([{ ...base, forecast: "year", discount: 50, dealsStd: 1, successBasis: 400000 }], [{ presence: true, extraApps: 2, discount: 0, introsStd: 1, introsFscm: 0, successBasis: 100000 }]);
    const summary = categoryGroupSummary(estimates, details);
    expect(summary.partner.subscription).toEqual({ estimate: 15980, detail: 3995 });
    expect(summary.partner.finders).toEqual({ estimate: 15000, detail: 5000 });
    expect(summary.isv.subscription).toEqual({ estimate: 7980, detail: 7980 });
    expect(summary.isv.finders).toEqual({ estimate: 7500, detail: 3500 });
    expect(summary.partner.estimate + summary.isv.estimate).toBe(46460);
    expect(estimateRevenue(estimates)).toBe(46460);
  });
  it("separates partner and ISV budgets without double counting", () => {
    expect(categoryGroupSummary({ year1: 2, isvPresence: 3, isvExtra: 2 }, { year1: { count: 1, revenue: 7990 }, isvPresence: { count: 1, revenue: 5990 } })).toEqual({
      partner: { estimate: 15980, detail: 7990, subscription: { estimate: 15980, detail: 7990 }, finders: { estimate: 0, detail: 0 } },
      isv: { estimate: 19960, detail: 5990, subscription: { estimate: 19960, detail: 5990 }, finders: { estimate: 0, detail: 0 } },
    });
  });
  it("counts multiple distinct Truvio apps without capping or duplicating them", () => {
    expect(budgetIsvVendors([{ id: "a", vendor: "Truvio", name: "App A" }, { id: "b", vendor: "Truvio", name: "App B" }, { id: "c", vendor: "Truvio", name: "App C" }, { id: "a", vendor: "Truvio", name: "App A" }])).toEqual([{ name: "Truvio", apps: 3 }]);
  });
  it("counts a yearly 2-product partner at 9 990 kr before discount", () => {
    const d = detailByCategory([{ forecast: "year", products: 2, discount: 50, meetingsStd: 2, dealsStd: 0, meetingsFscm: 0, dealsFscm: 0, successBasis: 0 }], []);
    expect(d.year2).toEqual({ count: 1, revenue: 4995 });
    expect(d.meetingsStd).toEqual({ count: 0, revenue: 0 });
  });
  it("estimate: 3 ISV Presence = 17 970 kr", () => { expect(estimateRevenue({ isvPresence: 3 })).toBe(17970); });
  it("only Basic meetings are charged at 2 500 and 5 000 kr", () => {
    expect(forecastRevenue({ ...base, forecast: "basic", meetingsStd: 1, meetingsFscm: 1 }).finders).toBe(7500);
    for (const forecast of ["month", "year"] as const) {
      expect(forecastRevenue({ ...base, forecast, meetingsStd: 1, meetingsFscm: 1 }).finders).toBe(0);
    }
  });
  it("Premium pays full deal fees without meeting deductions", () => {
    for (const forecast of ["month", "year"] as const) {
      const r = { ...base, forecast, meetingsStd: 1, meetingsFscm: 1, dealsStd: 1, dealsFscm: 1 };
      expect(forecastRevenue(r).finders).toBe(15000);
      const d = detailByCategory([r], []);
      expect(d.premiumDealsStd).toEqual({ count: 1, revenue: 5000 });
      expect(d.premiumDealsFscm).toEqual({ count: 1, revenue: 10000 });
      expect(d.dealsStd).toEqual({ count: 0, revenue: 0 });
    }
  });
  it("Basic and Premium estimates sum with their respective deal fees", () => {
    expect(estimateRevenue({ meetingsStd: 1, dealsStd: 1, premiumDealsStd: 1, premiumDealsFscm: 1 })).toBe(20000);
  });
});

import { successUnit, estimateRevenue as est2 } from "../budget2027";
describe("success fee areas", () => {
  it("2,5 % of 400 000 kr = 10 000 kr per BC deal", () => { expect(est2({ successBc: 2 })).toBe(20000); });
  it("no fee at or below 100 000 kr", () => { expect(successUnit(100000)).toBe(0); });
  it("custom F&SCM value 2 000 000 kr gives 50 000 kr", () => { expect(est2({ successFscm: 1 }, { successFscm: 2000000 })).toBe(50000); });
});

import { EXPERT_FEES } from "../budget2027";
describe("expert selling fees", () => {
  it("CV brokerage 40 kr and expert assignment 80 kr per sold hour", () => {
    expect(EXPERT_FEES).toEqual({ cvPerHour: 40, expertPerHour: 80 });
    expect(est2({ expertCvHours: 10, expertAssignmentHours: 5 })).toBe(800);
  });
  it("expert hours count as partner finders fee, not subscription", () => {
    const s = categoryGroupSummary({ expertCvHours: 10, expertAssignmentHours: 5 }, {});
    expect(s.partner.finders.estimate).toBe(800);
    expect(s.partner.subscription.estimate).toBe(0);
  });
});
