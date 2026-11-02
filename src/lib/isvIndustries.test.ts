import { describe, it, expect } from "vitest";
import { standardIndustryForTag, standardIndustriesFor } from "./isvIndustries";

describe("isvIndustries", () => {
  it("mappar engelska taggar till samma branscher som /branscher/", () => {
    expect(standardIndustryForTag("Manufacturing")?.slug).toBe("tillverkning");
    expect(standardIndustryForTag("3PL")?.slug).toBe("logistik-transport");
    expect(standardIndustryForTag("Bygg, Entreprenad & Installation")?.slug).toBe("bygg-entreprenad");
  });

  it("mappar aldrig taggar som inte är branscher", () => {
    expect(standardIndustryForTag("Alla")).toBeNull();
    expect(standardIndustryForTag("Enterprise")).toBeNull();
    expect(standardIndustryForTag("SMB")).toBeNull();
  });

  it("slår ihop dubbletter till en bransch", () => {
    expect(standardIndustriesFor(["Wholesale", "Distribution", "B2B"]).map((i) => i.slug)).toEqual([
      "grossist-distribution",
    ]);
  });
});
