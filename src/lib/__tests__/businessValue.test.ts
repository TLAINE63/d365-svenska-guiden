import { describe, it, expect } from "vitest";
import { evaluateBusinessValue, EMPTY_BUSINESS_VALUE, workRowValue, leakRowValue } from "../businessValue";

describe("businessValue", () => {
  it("starts at zero", () => {
    expect(evaluateBusinessValue(EMPTY_BUSINESS_VALUE).total).toBe(0);
  });
  it("work: 10 min x 300/month at 600 kr/h and 50 % saves 180 000 kr/year", () => {
    expect(workRowValue({ id: "a", label: "", minutes: 10, perMonth: 300, savingPct: 50 }, 600)).toBe(180_000);
  });
  it("lost revenue counts only contribution margin", () => {
    expect(leakRowValue({ id: "a", label: "", value: 100_000, perYear: 1, savingPct: 100 }, 30)).toBe(30_000);
  });
  it("total includes every part", () => {
    const r = evaluateBusinessValue({ ...EMPTY_BUSINESS_VALUE, challenges: [{ id: "c", label: "", yearly: 10_000, savingPct: 50 }], itFees: [{ id: "i", label: "", yearly: 20_000, savingPct: 100 }] });
    expect(r.total).toBe(25_000);
  });
});

import { BC_EXAMPLE_BUSINESS_VALUE, CRM_EXAMPLE_BUSINESS_VALUE, exampleFor, internalHourlyCost, evaluateBusinessValue as ev } from "../businessValue";
describe("Excel-exempel", () => {
  it("BC 2026: intern timkostnad 458,5 kr", () => expect(internalHourlyCost(40_000)).toBe(458.5));
  it("BC 2026: 3 596 frigjorda timmar per år som i Excel", () => expect(Math.round(ev(BC_EXAMPLE_BUSINESS_VALUE).hoursFreed)).toBe(3596));
  it("BC 2026: ersatta IT-kostnader 160 000 kr/år", () => expect(ev(BC_EXAMPLE_BUSINESS_VALUE).itFees).toBe(160_000));
  it("CRM: 7 120 frigjorda timmar per år som i Excel", () => expect(Math.round(ev(CRM_EXAMPLE_BUSINESS_VALUE).hoursFreed)).toBe(7120));
  it("CRM-produkter får CRM-exemplet", () => { expect(exampleFor("sales")).toBe(CRM_EXAMPLE_BUSINESS_VALUE); expect(exampleFor("business-central")).toBe(BC_EXAMPLE_BUSINESS_VALUE); });
});
