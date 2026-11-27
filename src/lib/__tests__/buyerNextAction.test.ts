import { describe, expect, it } from "vitest";
import { resolveBuyerAction } from "@/lib/buyerNextAction";

const now = Date.parse("2026-11-27T11:19:00Z");
const bc = { tool: "roi_bc", label: "Business Central", at: "2026-11-27T10:00:00Z", values: { Kostnad: "100 tkr" } };
describe("Generalplan 2027: nästa steg", () => {
  it("utan underlag är läget okänt och en fråga erbjuds", () => {
    const r = resolveBuyerAction({ path: "/crm/", now });
    expect(r.state).toBe("UNKNOWN"); expect(r.to).toBeUndefined();
  });
  it("BC-underlag får aldrig styra en CRM-rekommendation", () => {
    expect(resolveBuyerAction({ path: "/crm/", tools: [bc], now }).state).toBe("UNKNOWN");
  });
  it("en kalkyl ger en hypotes och kravsteg, aldrig bekräftad projektavsikt", () => {
    const r = resolveBuyerAction({ path: "/businesscentral/", tools: [bc], now });
    expect(r.state).toBe("FRAME"); expect(r.basis).toBe("inferred"); expect(r.to).toBe("/kravspecifikation/");
    expect(r).not.toHaveProperty("qbp");
  });
  it("köparens aktuella val vinner över tidigare kalkyl", () => {
    expect(resolveBuyerAction({ path: "/businesscentral/", tools: [bc], choice: "EXPLORE", now }).state).toBe("EXPLORE");
  });
  it("gamla signaler används inte", () => {
    expect(resolveBuyerAction({ path: "/businesscentral/", tools: [{ ...bc, at: "2026-09-01" }], now }).state).toBe("UNKNOWN");
  });
  it("att vilja agera är ett önskat nästa steg, inte bekräftat kundprojekt", () => {
    const r = resolveBuyerAction({ path: "/crm/", choice: "ACT", now });
    expect(r.state).toBe("ACT"); expect(r.to).toBeUndefined(); expect(r).not.toHaveProperty("qbp");
  });
  it("AI-underlag erbjuder rådgivning utan automatisk partnerintroduktion", () => {
    const r = resolveBuyerAction({ path: "/ai/exempel/", tools: [{ ...bc, tool: "agent_readiness", label: "Agentberedskap" }], now });
    expect(r.to).toBeUndefined(); expect(r.basis).toBe("inferred");
  });
});