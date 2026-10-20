import { describe, it, expect } from "vitest";
import { calcToKravLink, kravSource, readPrefillAreas, usersToTeamSize } from "@/lib/calcToKrav";
import { readKravAreas } from "@/lib/fscmChainLinks";
import { readSalesKravPrefill } from "@/lib/salesChainLinks";
import { readServiceKravPrefill } from "@/lib/serviceChainLinks";

const q = (href: string) => href.split("?")[1] ?? "";

describe("kalkylator → kravspecifikation", () => {
  it("ERP-kalkyler går till ERP-kravspecen för rätt produkt, CRM till sin egen", () => {
    expect(calcToKravLink({ product: "bc", drivers: [], integrations: 0 }).href).toMatch(/^\/kravspecifikation\/\?produkt=bc/);
    expect(calcToKravLink({ product: "finance-scm", drivers: [], integrations: 0 }).href).toMatch(/^\/kravspecifikation\/\?produkt=fsc/);
    expect(calcToKravLink({ product: "sales", drivers: [], integrations: 0 }).href).toMatch(/^\/kravspecifikation-sales\//);
    expect(calcToKravLink({ product: "field-service", drivers: [], integrations: 0 }).href).toMatch(/^\/kravspecifikation-kundservice\//);
    expect(calcToKravLink({ product: "customer-insights", drivers: [], integrations: 0 }).href).toMatch(/^\/kravspecifikation-marketing\//);
  });

  it("valda drivare och integrationer blir förmarkerade områden som kravspecen läser", () => {
    const l = calcToKravLink({ product: "bc", drivers: ["wms", "mrp"], integrations: 2 });
    expect(readKravAreas(q(l.href)).sort()).toEqual(["ekonomi", "inkop", "integration", "lager", "produktion"]);
  });

  it("antal användare blir storlek i CRM-kravspecen men aldrig antal medarbetare i ERP", () => {
    const sales = calcToKravLink({ product: "sales", drivers: ["win-rate"], integrations: 0, users: 17 });
    expect(readSalesKravPrefill(q(sales.href))).toEqual({ size: "11–20", areas: ["account_contact", "opportunity"] });
    const cs = calcToKravLink({ product: "customer-service", drivers: [], integrations: 1, users: 40 });
    expect(readServiceKravPrefill(q(cs.href))).toEqual({ size: "21–50", areas: ["case_mgmt", "integration_cs"] });
    expect(new URLSearchParams(q(calcToKravLink({ product: "bc", drivers: [], integrations: 0, users: 40 }).href)).has("storlek")).toBe(false);
  });

  it("bransch följer bara med när den går att översätta och profilen saknar bransch", () => {
    expect(calcToKravLink({ product: "bc", drivers: [], integrations: 0, calcIndustry: "Tillverkning" }).industry).toBe("Tillverkningsindustri");
    expect(calcToKravLink({ product: "bc", drivers: [], integrations: 0, calcIndustry: "Handel" }).industry).toBeUndefined();
    expect(calcToKravLink({ product: "sales", drivers: [], integrations: 0, calcIndustry: "B2B-tjänster" }).industry).toBeUndefined();
    expect(calcToKravLink({ product: "bc", drivers: [], integrations: 0, calcIndustry: "Tillverkning", profileHasIndustry: true }).industry).toBeUndefined();
  });

  it("källan märks som kalkyl så kravspecen kan säga var förifyllningen kommer ifrån", () => {
    expect(kravSource(q(calcToKravLink({ product: "sales", drivers: [], integrations: 0 }).href))).toBe("kalkyl");
    expect(kravSource("storlek=1–5&omraden=case_mgmt")).toBe("test");
    expect(kravSource("")).toBe("direct");
  });

  it("storleksintervall och okända områden hanteras", () => {
    expect([5, 6, 20, 21, 100, 101].map(usersToTeamSize)).toEqual(["1–5", "6–10", "11–20", "21–50", "51–100", "100+"]);
    expect(usersToTeamSize(0)).toBeUndefined();
    expect(readPrefillAreas("omraden=journeys,okand,journeys", ["journeys", "segments"])).toEqual(["journeys"]);
  });
});
