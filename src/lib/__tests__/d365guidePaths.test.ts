import { describe, it, expect } from "vitest";
import { resolveD365GuidePath } from "../d365guidePaths";

describe("resolveD365GuidePath (adresser från d365guide.com)", () => {
  it("leder /all-partners/ till alla partners på d365.se", () => {
    expect(resolveD365GuidePath("/all-partners/")).toBe("/alla-d365-partners/");
  });

  it("översätter loggade 404-adresser från d365guide.com", () => {
    expect(resolveD365GuidePath("/decision-maturity/")).toBe("/beslutsmognad/");
    expect(resolveD365GuidePath("/kom-i-gang/")).toBe("/kom-igang/");
    expect(resolveD365GuidePath("/compare-partners/")).toBe("/jamfor-partners/");
  });

  it("tar bort språkprefix och översätter norska/danska/finska slugs", () => {
    expect(resolveD365GuidePath("/no/velg-partner/")).toBe("/valjdynamics365partner/");
    expect(resolveD365GuidePath("/dk/brancher/handel")).toBe("/branscher/handel/");
    expect(resolveD365GuidePath("/fi/crm")).toBe("/crm/");
  });

  it("översätter kunskapscentrets hubbar", () => {
    expect(resolveD365GuidePath("/knowledge/procurement/rfp")).toBe("/kunskapscenter/upphandling/rfp/");
  });

  it("lämnar okända svenska adresser orörda så att 404 visas", () => {
    expect(resolveD365GuidePath("/finns-inte/")).toBeNull();
    expect(resolveD365GuidePath("/kunskapscenter/finns-inte/")).toBeNull();
  });
});
