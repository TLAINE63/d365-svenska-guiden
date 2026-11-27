import { describe, it, expect } from "vitest";
import { budgetPricing, dealPricing, PRICING_VERSION } from "../budgetPricing";
import { DEFAULT_BUDGET, forecastRevenue, isvRevenue, detailByCategory, estimateRevenue, categoryGroupSummary, mergeCosts, annual, partnerFunnelRow, FUNNEL_PRODUCTS, FUNNEL_DEAL_TYPES, dealFunnelRow, funnelMaxValue, migratePartnerFunnel, SWITCH_FUNNEL, switchFunnelRow, funnelTotals, expertFunnelRow, EXPERT_FUNNEL, budgetIsvVendors, type PartnerForecast } from "../budget2027";
const base: PartnerForecast = { forecast: "none", products: 1, discount: 0, meetingsStd: 0, dealsStd: 0, meetingsFscm: 0, dealsFscm: 0, successBasis: 0 };
const isv = { presence: true, extraApps: 2, discount: 0, introsStd: 0, introsFscm: 0, successBasis: 100000, consultBasis: 200000 };

describe("Budget 2027 editable assumptions", () => {
  it("band 1 (BC, Power Platform, Copilot): meeting 0 Premium / 0 Grundprofil, 2.5 percent Premium / 5 percent Grundprofil", () => {
    expect(budgetPricing().bands.small).toMatchObject({ premiumMeeting: 0, basicMeeting: 0, percent: 2.5, basicPercent: 5, maximum: 0 });
  });
  it("band 2 (CRM): meeting 0 Premium / 0 Grundprofil", () => {
    expect(budgetPricing().bands.medium).toMatchObject({ premiumMeeting: 0, basicMeeting: 0, percent: 2.5, maximum: 0 });
  });
  it("band 3 (F&SCM m.fl.): meeting 0 Premium / 0 Grundprofil, commission has no cap", () => {
    expect(budgetPricing().bands.large).toMatchObject({ premiumMeeting: 0, basicMeeting: 0 });
    expect(dealPricing(5000000, "premium", budgetPricing())).toEqual({ meeting: 0, commission: 125000 });
    expect(dealPricing(5000000, "basic", budgetPricing())).toEqual({ meeting: 0, commission: 250000 });
  });
  it("price assumptions saved before the price change are replaced by the new defaults", () => {
    const p = budgetPricing({ units: { year1: 9990 }, bands: { small: { premiumMeeting: 1500 } } } as never);
    expect(p.units.year1).toBe(8000);
    expect(p.bands.small.premiumMeeting).toBe(0);
    expect(p.isvAnnual).toBe(5000);
  });
  it("editable meeting, percentage and minimum affect funnel without a cap", () => {
    const p = budgetPricing(); p.bands.small = p.bands.medium = { premiumMeeting: 2000, basicMeeting: 4000, percent: 1, minimum: 6000, maximum: 7000 };
    expect(partnerFunnelRow(FUNNEL_PRODUCTS[0], "premium", { meetings: 2, deals: 10, wins: 1 }, {}, p)).toEqual({ meetings: 4000, deals: 0, wins: 6000, total: 10000 });
    expect(dealPricing(900000, "basic", p).commission).toBe(9000);
  });
  it("agreements are pipeline volume, not another fee", () => {
    expect(partnerFunnelRow(FUNNEL_PRODUCTS[0], "basic", { meetings: 1, deals: 1, wins: 1 }).total).toBe(20000);
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
    expect(s.partner.estimate).toBe(16000 + 0 + 10000);
    expect(s.isv.estimate).toBe(3500);
  });
  it("expert fee follows the single meeting fee regardless of scope", () => {
    expect(expertFunnelRow(EXPERT_FUNNEL[0], "premium", { assignments: 2 }).total).toBe(15000);
    expect(expertFunnelRow(EXPERT_FUNNEL[0], "basic", { assignments: 1 }).total).toBe(15000);
    expect(expertFunnelRow(EXPERT_FUNNEL[1], "premium", { assignments: 1 }).total).toBe(7500);
    expect(expertFunnelRow(EXPERT_FUNNEL[1], "basic", { assignments: 1 }).total).toBe(15000);
  });
  it("partner switch has the same meeting fee regardless of product", () => {
    expect(switchFunnelRow(SWITCH_FUNNEL[0], "premium", { meetings: 2 }).total).toBe(0);
    expect(switchFunnelRow(SWITCH_FUNNEL[0], "basic", { meetings: 2 }).total).toBe(0);
    expect(switchFunnelRow(SWITCH_FUNNEL[1], "premium", { meetings: 1 }).total).toBe(0);
    expect(switchFunnelRow(SWITCH_FUNNEL[1], "basic", { meetings: 1 }).total).toBe(0);
  });
  it("partner switch fees are editable and included in funnel totals", () => {
    const p = budgetPricing(); p.switchMeeting.std.premium = 4000; p.switchMeeting.fscm.basic = 12000;
    expect(funnelTotals({ switchStd_premium: { meetings: 1 }, switchFscm_basic: { meetings: 1 } }, {}, p).partnerSwitch).toBe(16000);
  });
  it("catalog counts distinct products", () => {
    expect(budgetIsvVendors([{ id: "a", vendor: "Truvio", name: "A" }, { id: "a", vendor: "Truvio", name: "A" }, { id: "b", vendor: "Truvio", name: "B" }])[0].apps).toBe(2);
  });
  it("funnel has one product-independent variant", () => {
    expect(FUNNEL_DEAL_TYPES.map((p) => p.band)).toEqual(["small"]);
    expect(FUNNEL_DEAL_TYPES.map((p) => funnelMaxValue(p))).toEqual([400000]);
  });
  it("Grundprofil: meetings are free, 5 % at won deal", () => {
    expect(dealFunnelRow(FUNNEL_DEAL_TYPES[0], "basic", { meetings: 3, wins: 1 })).toEqual({ meetings: 0, deals: 0, wins: 20000, total: 20000 });
  });
  it("average revenue changes commission without a cap or product reclassification", () => {
    expect(dealFunnelRow(FUNNEL_DEAL_TYPES[0], "premium", { meetings: 2, wins: 1 }, { maxSmall: 800000 }).total).toBe(20000);
    expect(dealFunnelRow(FUNNEL_DEAL_TYPES[0], "basic", { meetings: 1, wins: 1 }, { maxSmall: 5000000 }).total).toBe(250000);
    expect(dealFunnelRow(FUNNEL_DEAL_TYPES[0], "premium", { wins: 1 }, { maxSmall: 0 }).total).toBe(0);
  });
  it("saved CRM and F&SCM volumes merge exactly once", () => {
    const saved = { dealSmall_basic: { meetings: 2, wins: 1 }, dealMedium_basic: { meetings: 3, wins: 2 }, dealLarge_basic: { meetings: 4, wins: 3 } };
    const migrated = migratePartnerFunnel(saved);
    expect(migrated.dealSmall_basic).toEqual({ meetings: 9, deals: 0, wins: 6 });
    expect(migrated.dealMedium_basic).toBeUndefined();
    expect(migrated.dealLarge_basic).toBeUndefined();
    expect(migratePartnerFunnel(migrated)).toEqual(migrated);
  });
  it("saved commission caps cannot limit the new budget", () => {
    const p = budgetPricing({ version: PRICING_VERSION, bands: { ...budgetPricing().bands, large: { ...budgetPricing().bands.large, maximum: 100000 } } });
    expect(dealPricing(8000000, "premium", p).commission).toBe(200000);
  });
  it("legacy product volumes migrate once without loss or double counting", () => {
    const saved = { bc_basic: { meetings: 3, deals: 1, wins: 1 }, crm_basic: { meetings: 4, deals: 2, wins: 2 }, fscm_premium: { meetings: 6, wins: 2 }, pp_basic: { meetings: 1 } };
    const migrated = migratePartnerFunnel(saved);
    expect(migrated.dealMedium_basic).toBeUndefined();
    expect(migrated.dealSmall_basic).toEqual({ meetings: 8, deals: 3, wins: 3 });
    expect(migrated.dealSmall_premium.wins).toBe(2);
    expect(migratePartnerFunnel(migrated)).toEqual(migrated);
    expect(saved.bc_basic.meetings).toBe(3);
    expect(funnelTotals(saved).partner).toBe(funnelTotals(migrated).partner);
  });
});

describe("Partner detail uses deal bands", () => {
  it("CRM Premium uses variant 1 including saved medium volumes", () => {
    const r = { ...base, forecast: "month" as const, deals: { medium: { meetings: 2, wins: 1 } } };
    expect(forecastRevenue(r, DEFAULT_BUDGET).finders).toBe(0 + 10000);
  });
});

import { expertFunnelRow as efr, EXPERT_FUNNEL as EF } from "../budget2027";
describe("expertförmedling i budget", () => {
  it("Premium: 0 kr intervju + 2,5 % av uppdragsvärdet", () => {
    expect(efr(EF[0], "premium", { assignments: 1 }, undefined, { successExpert: 300000 }).total).toBe(7500);
  });
  it("Grundprofil: kostnadsfri intervju, 5 % av uppdragsvärdet", () => {
    expect(efr(EF[0], "basic", { assignments: 2 }, undefined, { successExpert: 300000 }).total).toBe(30000);
  });
});

describe("partnerbyte i budget", () => {
  it("Premium: 0 kr möte + 2,5 % av 400 000 kr per affär", () => {
    expect(switchFunnelRow(SWITCH_FUNNEL[0], "premium", { meetings: 2, wins: 1 }).total).toBe(10000);
  });
  it("Grundprofil: kostnadsfritt möte, 5 % av 400 000 kr per affär", () => {
    expect(switchFunnelRow(SWITCH_FUNNEL[0], "basic", { meetings: 1, wins: 1 }).total).toBe(20000);
  });
});
