import { describe, it, expect } from "vitest";
import { budgetPricing, dealPricing, PRICING_VERSION } from "../budgetPricing";
import { DEFAULT_BUDGET, forecastRevenue, isvRevenue, detailByCategory, estimateRevenue, categoryGroupSummary, mergeCosts, annual, partnerFunnelRow, FUNNEL_PRODUCTS, FUNNEL_DEAL_TYPES, dealFunnelRow, funnelMaxValue, migratePartnerFunnel, SWITCH_FUNNEL, switchFunnelRow, funnelTotals, expertFunnelRow, EXPERT_FUNNEL, budgetIsvVendors, type PartnerForecast } from "../budget2027";
const base: PartnerForecast = { forecast: "none", products: 1, discount: 0, meetingsStd: 0, dealsStd: 0, meetingsFscm: 0, dealsFscm: 0, successBasis: 0 };
const isv = { presence: true, extraApps: 2, discount: 0, introsStd: 0, introsFscm: 0, successBasis: 100000, consultBasis: 200000 };

describe("Budget 2027 editable assumptions", () => {
  it("band 1 (BC, Power Platform, Copilot): meeting 1000 Premium / 3000 Grundprofil, 2.5 percent", () => {
    expect(budgetPricing().bands.small).toMatchObject({ premiumMeeting: 1000, basicMeeting: 3000, percent: 2.5, maximum: 100000 });
  });
  it("band 2 (CRM): meeting 1500 Premium / 4000 Grundprofil", () => {
    expect(budgetPricing().bands.medium).toMatchObject({ premiumMeeting: 1500, basicMeeting: 4000, percent: 2.5, maximum: 100000 });
  });
  it("band 3 (F&SCM m.fl.): meeting 2000 Premium / 5000 Grundprofil, commission capped at 100000", () => {
    expect(budgetPricing().bands.large).toMatchObject({ premiumMeeting: 2000, basicMeeting: 5000 });
    expect(dealPricing(5000000, "premium", budgetPricing())).toEqual({ meeting: 2000, commission: 100000 });
  });
  it("price assumptions saved before the price change are replaced by the new defaults", () => {
    const p = budgetPricing({ units: { year1: 9990 }, bands: { small: { premiumMeeting: 1500 } } } as never);
    expect(p.units.year1).toBe(8000);
    expect(p.bands.small.premiumMeeting).toBe(1000);
    expect(p.isvAnnual).toBe(5000);
  });
  it("editable meeting, percentage, minimum and maximum affect funnel", () => {
    const p = budgetPricing(); p.bands.medium = { premiumMeeting: 2000, basicMeeting: 4000, percent: 1, minimum: 6000, maximum: 7000 };
    expect(partnerFunnelRow(FUNNEL_PRODUCTS[0], "premium", { meetings: 2, deals: 10, wins: 1 }, {}, p)).toEqual({ meetings: 4000, deals: 0, wins: 6000, total: 10000 });
    expect(dealPricing(900000, "basic", p).commission).toBe(7000);
  });
  it("agreements are pipeline volume, not another fee", () => {
    expect(partnerFunnelRow(FUNNEL_PRODUCTS[0], "basic", { meetings: 1, deals: 1, wins: 1 }).total).toBe(14000);
    expect(partnerFunnelRow(FUNNEL_PRODUCTS[0], "basic", { deals: 20 }).total).toBe(0);
  });
  it("ISV defaults to zero in detail and funnel even with saved volumes", () => {
    expect(isvRevenue(isv).finders).toBe(0);
    expect(funnelTotals({ isvStd: { deals: 10 }, isvFscm: { deals: 10 } }).isv).toBe(0);
  });
  it("ISV Finder's fee is paused: older saved percentages give 0 kr", () => {
    const p = budgetPricing({ isvLicensePercent: 1, isvConsultPercent: 2 });
    expect(isvRevenue(isv, p).finders).toBe(0);
    expect(funnelTotals({ isvStd: { deals: 2 } }, {}, p).isv).toBe(0);
  });
  it("subscription prices sync estimates and discounted detail rows", () => {
    const pricing = budgetPricing(); pricing.units.year2 = 12000; pricing.units.month1 = 1000;
    expect(estimateRevenue({ year2: 2, month1: 1 }, {}, {}, pricing)).toBe(36000);
    expect(forecastRevenue({ ...base, forecast: "year", products: 2, discount: 50 }, { ...DEFAULT_BUDGET, pricing }).subscription).toBe(6000);
    expect(detailByCategory([{ ...base, forecast: "year", products: 2, discount: 50 }], [], { ...DEFAULT_BUDGET, pricing }).year2.revenue).toBe(6000);
  });
  it("editable ISV base, intro and extra app prices", () => {
    const p = budgetPricing({ isvAnnual: 7000, version: PRICING_VERSION }); p.units.isvPresence = 3000; p.units.isvExtra = 1000;
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
    expect(s.partner.estimate).toBe(16000 + 3000 + 22000);
    expect(s.isv.estimate).toBe(3000);
  });
  it("expert fee follows the meeting fee: 1500/4000 short, 2000/5000 long", () => {
    expect(expertFunnelRow(EXPERT_FUNNEL[0], "premium", { assignments: 2 }).total).toBe(3000);
    expect(expertFunnelRow(EXPERT_FUNNEL[0], "basic", { assignments: 1 }).total).toBe(4000);
    expect(expertFunnelRow(EXPERT_FUNNEL[1], "premium", { assignments: 1 }).total).toBe(2000);
    expect(expertFunnelRow(EXPERT_FUNNEL[1], "basic", { assignments: 1 }).total).toBe(5000);
  });
  it("partner switch: same meeting fee as new projects, 1500/4000 and F&SCM 2000/5000", () => {
    expect(switchFunnelRow(SWITCH_FUNNEL[0], "premium", { meetings: 2 }).total).toBe(3000);
    expect(switchFunnelRow(SWITCH_FUNNEL[0], "basic", { meetings: 2 }).total).toBe(8000);
    expect(switchFunnelRow(SWITCH_FUNNEL[1], "premium", { meetings: 1 }).total).toBe(2000);
    expect(switchFunnelRow(SWITCH_FUNNEL[1], "basic", { meetings: 1 }).total).toBe(5000);
  });
  it("partner switch fees are editable and included in funnel totals", () => {
    const p = budgetPricing(); p.switchMeeting.std.premium = 4000; p.switchMeeting.fscm.basic = 12000;
    expect(funnelTotals({ switchStd_premium: { meetings: 1 }, switchFscm_basic: { meetings: 1 } }, {}, p).partnerSwitch).toBe(16000);
  });
  it("catalog counts distinct products", () => {
    expect(budgetIsvVendors([{ id: "a", vendor: "Truvio", name: "A" }, { id: "a", vendor: "Truvio", name: "A" }, { id: "b", vendor: "Truvio", name: "B" }])[0].apps).toBe(2);
  });
  it("funnel has three deal sizes instead of four products", () => {
    expect(FUNNEL_DEAL_TYPES.map((p) => p.band)).toEqual(["small", "medium", "large"]);
    expect(FUNNEL_DEAL_TYPES.map((p) => funnelMaxValue(p))).toEqual([250000, 1000000, 3000000]);
  });
  it("band 1 Grundprofil: 3000 kr meeting, deal fee credited by the paid meeting", () => {
    expect(dealFunnelRow(FUNNEL_DEAL_TYPES[0], "basic", { meetings: 3, wins: 1 })).toEqual({ meetings: 9000, deals: 0, wins: 3250, total: 12250 });
  });
  it("editable maximum changes commission but keeps the selected band's meeting fee", () => {
    expect(dealFunnelRow(FUNNEL_DEAL_TYPES[1], "premium", { meetings: 2, wins: 1 }, { maxMedium: 800000 }).total).toBe(21500);
    expect(dealFunnelRow(FUNNEL_DEAL_TYPES[2], "basic", { meetings: 1, wins: 1 }, { maxLarge: 5000000 }).total).toBe(100000);
    expect(dealFunnelRow(FUNNEL_DEAL_TYPES[1], "premium", { wins: 1 }, { maxMedium: 0 }).total).toBe(0);
  });
  it("legacy product volumes migrate once without loss or double counting", () => {
    const saved = { bc_basic: { meetings: 3, deals: 1, wins: 1 }, crm_basic: { meetings: 4, deals: 2, wins: 2 }, fscm_premium: { meetings: 6, wins: 2 }, pp_basic: { meetings: 1 } };
    const migrated = migratePartnerFunnel(saved);
    expect(migrated.dealMedium_basic).toEqual({ meetings: 7, deals: 3, wins: 3 });
    expect(migrated.dealSmall_basic.meetings).toBe(1);
    expect(migrated.dealLarge_premium.wins).toBe(2);
    expect(migratePartnerFunnel(migrated)).toEqual(migrated);
    expect(saved.bc_basic.meetings).toBe(3);
    expect(funnelTotals(saved).partner).toBe(funnelTotals(migrated).partner);
  });
});

describe("Partner detail uses deal bands", () => {
  it("CRM Premium: 2 meetings × 1500 + 1 win (2.5% of 1 Mkr − 1500)", () => {
    const r = { ...base, forecast: "month" as const, deals: { medium: { meetings: 2, wins: 1 } } };
    expect(forecastRevenue(r, DEFAULT_BUDGET).finders).toBe(3000 + 23500);
  });
});
