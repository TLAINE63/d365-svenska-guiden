import { describe, expect, it } from "vitest";
import { ROI_DEFAULTS, IMPLEMENTATION_DEFAULTS, canonicalCalculatorIndustry, bcIndustryModel, salesIndustryModel } from "../calculatorDefaults";
import { INDUSTRY_NAMES } from "@/data/standardIndustries";
import { calcToKravLink } from "../calcToKrav";

describe("calculator starting rules", () => {
  it("starts ROI at lowest complexity and zero integrations", () => {
    expect(ROI_DEFAULTS.complexity).toBe("Låg");
    expect(ROI_DEFAULTS.integrations).toBe(0);
  });
  it("starts without additional features or users", () => {
    expect(ROI_DEFAULTS.enabledDrivers).toEqual([]);
    expect(ROI_DEFAULTS.additionalUsers).toBe(0);
    expect(ROI_DEFAULTS.users).toBe(1);
  });
  it("starts implementation with every optional feature off", () => {
    expect(IMPLEMENTATION_DEFAULTS.dataMigration).toBe(false);
    expect(IMPLEMENTATION_DEFAULTS.customDevelopment).toBe(false);
    expect(IMPLEMENTATION_DEFAULTS.training).toBe(false);
    expect(IMPLEMENTATION_DEFAULTS.premiumLicense).toBe(false);
  });
  it("uses minimum allowed implementation inputs", () => {
    expect(IMPLEMENTATION_DEFAULTS.complexity).toBe("standardnara");
    expect(IMPLEMENTATION_DEFAULTS.integrations).toBe(0);
    expect(IMPLEMENTATION_DEFAULTS.legalEntities).toBe(1);
    expect(IMPLEMENTATION_DEFAULTS.hourlyRate).toBe(900);
  });
  it("accepts every one of the site's 21 industries without collapsing its name", () => {
    expect(INDUSTRY_NAMES).toHaveLength(21);
    for (const name of INDUSTRY_NAMES) expect(canonicalCalculatorIndustry(name)).toBe(name);
    expect(canonicalCalculatorIndustry("Unknown")).toBeUndefined();
  });
  it("reuses existing models for manufacturing and general branches", () => {
    expect(bcIndustryModel("Tillverkningsindustri")).toBe("Tillverkning");
    expect(salesIndustryModel("Finans & Försäkring")).toBe("Finans & försäkring");
    expect(bcIndustryModel("Medlemsorganisationer")).toBe("Annan");
  });
  it("carries each exact industry from calculator to requirement specification", () => {
    for (const name of INDUSTRY_NAMES) {
      const link = calcToKravLink({ product: "bc", drivers: [], integrations: 0, calcIndustry: name });
      expect(new URLSearchParams(link.href.split("?")[1]).get("bransch")).toBe(name);
    }
  });
});