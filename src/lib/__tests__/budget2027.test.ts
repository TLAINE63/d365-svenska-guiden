import { describe, it, expect } from "vitest";
import { forecastRevenue, type PartnerForecast } from "../budget2027";

const base: PartnerForecast = { forecast: "none", products: 1, discount: 0, meetingsStd: 0, dealsStd: 0, meetingsFscm: 0, dealsFscm: 0, successBasis: 0 };

describe("budget 2027", () => {
  it("Grundprofil credits its BC meeting against 5 000 kr, Premium pays 5 000 kr with no meeting fee", () => {
    expect(forecastRevenue({ ...base, forecast: "basic", meetingsStd: 1, dealsStd: 1 }).finders).toBe(5000);
    expect(forecastRevenue({ ...base, forecast: "month", meetingsStd: 1, dealsStd: 1 }).finders).toBe(5000);
  });
  it("Grundprofil credits its F&SCM meeting against 10 000 kr, Premium pays 10 000 kr with no meeting fee", () => {
    expect(forecastRevenue({ ...base, forecast: "basic", meetingsFscm: 1, dealsFscm: 1 }).finders).toBe(10000);
    expect(forecastRevenue({ ...base, forecast: "year", meetingsFscm: 1, dealsFscm: 1 }).finders).toBe(10000);
  });
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
    expect(isvRevenue({ ...z, presence: true, extraApps: 2, introPrice: false }).subscription).toBe(7980);
  });
  it("ny ISV räknas med 2 990 kr första året", () => {
    expect(isvRevenue({ ...z, presence: true, extraApps: 2 }).subscription).toBe(4980);
  });
  it("Business Referral: 5 % licens, 2,5 % konsult, inga fasta avgifter", () => {
    expect(isvRevenue({ ...z, introsStd: 1, introsFscm: 1, successBasis: 100000, consultBasis: 200000 }).finders).toBe(10000);
  });
  it("monthly amount counts twelve times per year", () => {
    expect(annual({ amount: 1000, period: "month" })).toBe(12000);
  });
});

import { detailByCategory, estimateRevenue, categoryGroupSummary, budgetIsvVendors } from "../budget2027";
describe("category estimates", () => {
  it("funnel finders fee is added to the partner and ISV summaries", () => {
    const summary = categoryGroupSummary({ year1: 2, isvPresence: 1 }, {}, {}, { bc_premium: { deals: 3 }, isvFscm: { deals: 1 } });
    expect(summary.partner.finders.estimate).toBe(15000);
    expect(summary.isv.finders.estimate).toBe(10000);
    expect(estimateRevenue({ year1: 2, isvPresence: 1 }, {}, { bc_premium: { deals: 3 }, isvFscm: { deals: 1 } })).toBe(15980 + 2990 + 15000 + 10000);
  });
  it("old per-category finders estimates are no longer counted", () => {
    expect(estimateRevenue({ premiumDealsStd: 3, expertCvHours: 10, successBc: 2 })).toBe(0);
  });
  it("separates partner and ISV budgets without double counting", () => {
    expect(categoryGroupSummary({ year1: 2, isvPresence: 3, isvExtra: 2 }, { year1: { count: 1, revenue: 7990 }, isvPresence: { count: 1, revenue: 5990 } })).toEqual({
      partner: { estimate: 15980, detail: 7990, subscription: { estimate: 15980, detail: 7990 }, finders: { estimate: 0, detail: 0 } },
      isv: { estimate: 10960, detail: 5990, subscription: { estimate: 10960, detail: 5990 }, finders: { estimate: 0, detail: 0 } },
    });
  });
  it("counts multiple distinct Truvio apps without capping or duplicating them", () => {
    expect(budgetIsvVendors([{ id: "a", vendor: "Truvio", name: "App A" }, { id: "b", vendor: "Truvio", name: "App B" }, { id: "c", vendor: "Truvio", name: "App C" }, { id: "a", vendor: "Truvio", name: "App A" }])).toMatchObject([{ name: "Truvio", apps: 3, products: [{ id: "a", name: "App A" }, { id: "b", name: "App B" }, { id: "c", name: "App C" }] }]);
  });
  it("counts a yearly 2-product partner at 9 990 kr before discount", () => {
    const d = detailByCategory([{ forecast: "year", products: 2, discount: 50, meetingsStd: 2, dealsStd: 0, meetingsFscm: 0, dealsFscm: 0, successBasis: 0 }], []);
    expect(d.year2).toEqual({ count: 1, revenue: 4995 });
    expect(d.meetingsStd).toEqual({ count: 0, revenue: 0 });
  });
  it("estimate: 3 nya ISV Presence = 8 970 kr", () => { expect(estimateRevenue({ isvPresence: 3 })).toBe(8970); });
  it("no partner pays a meeting fee (same terms for all, Thomas 2026-11-12)", () => {
    expect(forecastRevenue({ ...base, forecast: "basic", meetingsStd: 1, meetingsFscm: 1 }).finders).toBe(0);
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
  it("funnel: every BC deal pays 5 000 kr, no meeting fee", () => {
    expect(partnerFunnelRow(FUNNEL_PRODUCTS[0], "basic", { meetings: 1, deals: 1 })).toEqual({ meetings: 0, deals: 5000, wins: 0, total: 5000 });
    const d = detailByCategory([{ ...base, forecast: "basic", meetingsStd: 1, dealsStd: 1 }], []);
    expect(d.meetingsStd.revenue).toBe(0);
    expect(d.dealsStd.revenue).toBe(5000);
    expect(partnerFunnelRow(FUNNEL_PRODUCTS[0], "premium", { meetings: 4, deals: 1 }).total).toBe(5000);
  });
  it("funnel: F&SCM deal 10 000 kr", () => {
    expect(partnerFunnelRow(FUNNEL_PRODUCTS[2], "basic", { meetings: 1, deals: 1 }).total).toBe(10000);
  });
});
import { successUnit, estimateRevenue as est2 } from "../budget2027";
describe("success fee areas", () => {
  it("2,5 % of 400 000 kr = 10 000 kr per BC deal", () => { expect(est2({}, {}, { bc_basic: { wins: 2 } })).toBe(20000); });
  it("no fee at or below 100 000 kr", () => { expect(successUnit(100000)).toBe(0); });
  it("custom F&SCM value 2 000 000 kr gives 50 000 kr", () => { expect(est2({}, { successFscm: 2000000 }, { fscm_premium: { wins: 1 } })).toBe(50000); });
});

import { EXPERT_FEES, EXPERT_FUNNEL, expertFunnelRow, FUNNEL_PRODUCTS, partnerFunnelRow } from "../budget2027";
describe("expert selling fees", () => {
  it("expert brokerage is 50 kr per hour for every partner", () => {
    expect(EXPERT_FEES).toEqual({ premiumPerHour: 50, basicPerHour: 50 });
    expect(expertFunnelRow(EXPERT_FUNNEL[0], { assignments: 1, months: 3, percent: 100 }).total).toBe(495 * 50);
    expect(expertFunnelRow(EXPERT_FUNNEL[1], { assignments: 2, months: 6, percent: 50, rate: 100 }).total).toBe(2 * 495 * 100);
  });
  it("expert hours count as partner finders fee, not subscription", () => {
    const s = categoryGroupSummary({}, {}, {}, { cv: { assignments: 1, months: 1, percent: 100 }, expert: { assignments: 1, months: 1, percent: 50 } });
    expect(s.partner.finders.estimate).toBe(165 * 50 + 83 * 50);
    expect(s.partner.subscription.estimate).toBe(0);
  });
});

import { opexCoverage } from "../budget2027";
describe("opexCoverage", () => {
  it("räknar täckningsgrad och partners som saknas till självfinansiering", () => {
    const r = opexCoverage(60000, 120000);
    expect(r.ratio).toBe(0.5);
    expect(r.gap).toBe(60000);
    expect(r.extraPartners).toBe(6); // 60 000 / (995*12) = 5,03 -> 6
    expect(r.selfFunded).toBe(false);
    expect(opexCoverage(130000, 120000).selfFunded).toBe(true);
  });
});
