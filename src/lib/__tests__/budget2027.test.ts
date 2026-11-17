import { describe, it, expect } from "vitest";
import { budgetPricing, dealPricing } from "../budgetPricing";
import { DEFAULT_BUDGET, forecastRevenue, isvRevenue, detailByCategory, estimateRevenue, categoryGroupSummary, mergeCosts, annual, partnerFunnelRow, FUNNEL_PRODUCTS, SWITCH_FUNNEL, switchFunnelRow, funnelTotals, expertFunnelRow, EXPERT_FUNNEL, budgetIsvVendors, type PartnerForecast } from "../budget2027";
const base: PartnerForecast = { forecast: "none", products: 1, discount: 0, meetingsStd: 0, dealsStd: 0, meetingsFscm: 0, dealsFscm: 0, successBasis: 0 };
const isv = { presence: true, extraApps: 2, discount: 0, introsStd: 0, introsFscm: 0, successBasis: 100000, consultBasis: 200000 };

describe("Budget 2027 editable assumptions", () => {
  it("small deal: no meeting fee, 2.5 percent and minimum 3000", () => {
    expect(dealPricing(50000, "basic", budgetPricing())).toEqual({ meeting: 0, commission: 3000 });
    expect(dealPricing(200000, "premium", budgetPricing())).toEqual({ meeting: 0, commission: 5000 });
  });
  it("250000–1000000: Premium meeting 3000, Basic 5000, 2.5 percent", () => {
    expect(dealPricing(250000, "premium", budgetPricing())).toEqual({ meeting: 3000, commission: 6250 });
    expect(dealPricing(1000000, "basic", budgetPricing())).toEqual({ meeting: 5000, commission: 25000 });
  });
  it("over 1000000: Premium meeting 6000, Basic 9000, commission capped at 100000", () => {
    expect(dealPricing(5000000, "premium", budgetPricing())).toEqual({ meeting: 6000, commission: 100000 });
    expect(dealPricing(1000001, "basic", budgetPricing()).meeting).toBe(9000);
  });
  it("editable meeting, percentage, minimum and maximum affect funnel", () => {
    const p = budgetPricing(); p.bands.medium = { premiumMeeting: 2000, basicMeeting: 4000, percent: 1, minimum: 6000, maximum: 7000 };
    expect(partnerFunnelRow(FUNNEL_PRODUCTS[0], "premium", { meetings: 2, deals: 10, wins: 1 }, {}, p)).toEqual({ meetings: 4000, deals: 0, wins: 6000, total: 10000 });
    expect(dealPricing(900000, "basic", p).commission).toBe(7000);
  });
  it("agreements are pipeline volume, not another fee", () => {
    expect(partnerFunnelRow(FUNNEL_PRODUCTS[0], "basic", { meetings: 1, deals: 1, wins: 1 }).total).toBe(15000);
    expect(partnerFunnelRow(FUNNEL_PRODUCTS[0], "basic", { deals: 20 }).total).toBe(0);
  });
  it("ISV defaults to zero in detail and funnel even with saved volumes", () => {
    expect(isvRevenue(isv).finders).toBe(0);
    expect(funnelTotals({ isvStd: { deals: 10 }, isvFscm: { deals: 10 } }).isv).toBe(0);
  });
  it("ISV percentages remain editable", () => {
    const p = budgetPricing({ isvLicensePercent: 1, isvConsultPercent: 2 });
    expect(isvRevenue(isv, p).finders).toBe(5000);
    expect(funnelTotals({ isvStd: { deals: 2 } }, {}, p).isv).toBe(4000);
  });
  it("subscription prices sync estimates and discounted detail rows", () => {
    const pricing = budgetPricing(); pricing.units.year2 = 12000; pricing.units.month1 = 1000;
    expect(estimateRevenue({ year2: 2, month1: 1 }, {}, {}, pricing)).toBe(36000);
    expect(forecastRevenue({ ...base, forecast: "year", products: 2, discount: 50 }, { ...DEFAULT_BUDGET, pricing }).subscription).toBe(6000);
    expect(detailByCategory([{ ...base, forecast: "year", products: 2, discount: 50 }], [], { ...DEFAULT_BUDGET, pricing }).year2.revenue).toBe(6000);
  });
  it("editable ISV base, intro and extra app prices", () => {
    const p = budgetPricing({ isvAnnual: 7000 }); p.units.isvPresence = 3000; p.units.isvExtra = 1000;
    expect(isvRevenue(isv, p).subscription).toBe(5000);
    expect(isvRevenue({ ...isv, introPrice: false }, p).subscription).toBe(9000);
  });
  it("zero price and zero project value are retained", () => {
    const p = budgetPricing(); p.units.year1 = 0;
    expect(estimateRevenue({ year1: 2 }, {}, {}, p)).toBe(0);
    expect(partnerFunnelRow(FUNNEL_PRODUCTS[0], "basic", { wins: 1 }, { successBc: 0 }).total).toBe(0);
  });
  it("cost names and amounts survive reload without duplicate default rows", () => {
    const saved = DEFAULT_BUDGET.costs.map((r, i) => ({ ...r, name: i === 0 ? "Ny tjänst" : r.name, amount: i === 0 ? 4000 : 0, period: "month" as const }));
    const reloaded = mergeCosts(JSON.parse(JSON.stringify(mergeCosts(saved))));
    expect(reloaded).toHaveLength(saved.length);
    expect(reloaded[0].name).toBe("Ny tjänst");
    expect(annual(reloaded[0])).toBe(48000);
  });
  it("partner and ISV group totals never double-count legacy estimates", () => {
    const s = categoryGroupSummary({ year1: 2, isvPresence: 1, premiumDealsStd: 9 }, {}, {}, { bc_premium: { meetings: 1, deals: 4, wins: 1 } });
    expect(s.partner.estimate).toBe(15980 + 3000 + 10000);
    expect(s.isv.estimate).toBe(2990);
  });
  it("expert rate remains editable", () => {
    expect(expertFunnelRow(EXPERT_FUNNEL[0], { assignments: 1, months: 1, percent: 100, rate: 90 }).total).toBe(14850);
  });
  it("partner switch: meeting fee only, 0 under 250 tkr, 3000/5000 medium and 6000/9000 large", () => {
    expect(switchFunnelRow(SWITCH_FUNNEL[0], "premium", { meetings: 2 }).total).toBe(0);
    expect(switchFunnelRow(SWITCH_FUNNEL[0], "basic", { meetings: 2 }).total).toBe(0);
    expect(switchFunnelRow(SWITCH_FUNNEL[1], "premium", { meetings: 2 }).total).toBe(6000);
    expect(switchFunnelRow(SWITCH_FUNNEL[1], "basic", { meetings: 2 }).total).toBe(10000);
    expect(switchFunnelRow(SWITCH_FUNNEL[2], "premium", { meetings: 1 }).total).toBe(6000);
    expect(switchFunnelRow(SWITCH_FUNNEL[2], "basic", { meetings: 1 }).total).toBe(9000);
  });
  it("partner switch fees are editable and included in funnel totals", () => {
    const p = budgetPricing(); p.switchMeeting.medium.premium = 4000; p.switchMeeting.large.basic = 12000;
    expect(switchFunnelRow(SWITCH_FUNNEL[1], "premium", { meetings: 3 }, p).total).toBe(12000);
    expect(funnelTotals({ switchMedium_premium: { meetings: 1 }, switchLarge_basic: { meetings: 1 } }, {}, p).partnerSwitch).toBe(16000);
    expect(funnelTotals({ switchMedium_premium: { meetings: 1 }, switchLarge_basic: { meetings: 1 } }, {}, p).total).toBe(16000);
  });
  it("catalog counts distinct products", () => {
    expect(budgetIsvVendors([{ id: "a", vendor: "Truvio", name: "A" }, { id: "a", vendor: "Truvio", name: "A" }, { id: "b", vendor: "Truvio", name: "B" }])[0].apps).toBe(2);
  });
});
