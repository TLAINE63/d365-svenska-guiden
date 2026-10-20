import { describe, it, expect } from "vitest";
import { emptyProfile } from "@/lib/buyerProfile";
import { readKravFromProfile, profileIndustryName } from "@/lib/kravProfile";

const opts = { industries: ["Tillverkningsindustri"], sizes: ["26–50"], areaIds: ["ekonomi", "lager"] };

describe("kravProfile", () => {
  it("översätter branschslug från profilen till branschnamn", () => {
    const p = emptyProfile(); p.company.industry = "tillverkning";
    expect(profileIndustryName(p, opts.industries)).toBe("Tillverkningsindustri");
  });
  it("ignorerar okända branscher, storlekar och områden", () => {
    const p = emptyProfile();
    p.company.industry = "okand";
    p.project.krav_erp_size = "9999";
    p.project.krav_erp_areas = ["ekonomi", "hack"];
    expect(readKravFromProfile(p, "erp", opts)).toEqual({ industry: undefined, size: undefined, areas: ["ekonomi"] });
  });
  it("håller sparade val separata per kravspec", () => {
    const p = emptyProfile(); p.project.krav_sales_size = "26–50";
    expect(readKravFromProfile(p, "erp", opts).size).toBeUndefined();
  });
});
