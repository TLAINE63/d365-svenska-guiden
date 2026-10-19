import { describe, it, expect } from "vitest";
import { salesChainLinks, salesAreasFromAnswers, readSalesRoiPrefill, readSalesKravPrefill } from "@/lib/salesChainLinks";

describe("salesChainLinks", () => {
  const a = { s1: "3", s2: "2", s4: "yes", s5: "2", s8: "3", s9: "yes", s10: "yes", s11: "1" };
  it("for over testsvar till kalkylatorn", () => {
    const p = readSalesRoiPrefill(salesChainLinks(a, "strong").roi.split("?")[1]);
    expect(p).toEqual({ sellers: 25, complexity: "Hög", license: "Premium", integrations: 2 });
  });
  it("for over storlek och områden till kravspecen", () => {
    const p = readSalesKravPrefill(salesChainLinks(a, "partial").kravspec.split("?")[1]);
    expect(p.size).toBe("21–50");
    expect(p.areas).toEqual(["account_contact", "activities", "lead_mgmt", "opportunity", "quotes_orders", "automation", "integration"]);
  });
  it("kryssar inte analys vid lågt svar", () => {
    expect(salesAreasFromAnswers({ s11: "1" })).not.toContain("analytics");
  });
  it("ignorerar okända värden", () => {
    expect(readSalesRoiPrefill("saljare=-1&licens=X")).toEqual({});
    expect(readSalesKravPrefill("storlek=999&omraden=hack").areas).toEqual([]);
  });
});
