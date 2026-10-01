import { describe, expect, it } from "vitest";
import { emptyProfile } from "@/lib/buyerProfile";
import { deriveCompareFilters, filtersToSearch, matchPartnerToProfile, questionsToTakeForward, relevantCrmApps } from "@/lib/underlag";

describe("deriveCompareFilters", () => {
  it("översätter exemplet från specifikationen", () => {
    const p = emptyProfile();
    p.scope.apps = ["finance", "scm", "sales", "contact_center"];
    p.company.industry = "tillverkning";
    p.company.employees = "250-999";
    p.company.countries = "europe";
    p.current_erp.erp = "ax2012";
    p.fscm.production = "discrete";
    const f = deriveCompareFilters(p);
    expect(f.product).toEqual(["fscm", "sales", "contact_center"]);
    expect(filtersToSearch(f)).toBe("product=fscm%2Csales%2Ccontact_center&industry=tillverkning&size=250-999&geo=sverige%2Ceuropa&underlag=1");
    expect(f.criteria).toEqual(expect.arrayContaining(["migration_ax", "manufacturing", "contact_center", "localization"]));
  });

  it("lämnar flertydiga eller saknade svar tomma", () => {
    const f = deriveCompareFilters(emptyProfile());
    expect(f).toMatchObject({ product: [], industry: undefined, size: undefined, geo: undefined, criteria: [] });
  });
});

describe("matchPartnerToProfile", () => {
  it("delar upp i dokumenterat, ej verifierat och saknas", () => {
    const p = emptyProfile();
    p.scope.apps = ["finance", "contact_center"];
    p.current_erp.erp = "ax2012";
    const items = matchPartnerToProfile(
      { applications: ["Finance & SCM"], description: "Vi migrerar från AX 2012", product_filters: { fsc: { industries: [] } } },
      deriveCompareFilters(p),
    );
    expect(items.find((i) => i.label.startsWith("Finance"))?.status).toBe("documented");
    expect(items.find((i) => i.label === "Migrering från AX")?.status).toBe("unverified");
    expect(items.find((i) => i.label.startsWith("Contact"))?.status).toBe("missing");
  });
});

describe("övrig logik", () => {
  it("visar Contact Center som relevant vid röstbehov", () => {
    const p = emptyProfile();
    p.contact_center.voice = "yes";
    expect(relevantCrmApps(p)).toContain("contact_center");
  });
  it("ger högst fem frågor", () => {
    const p = emptyProfile();
    p.scope.apps = ["finance", "sales", "contact_center"];
    p.current_erp.erp = "sap";
    p.company.countries = "global";
    expect(questionsToTakeForward(p).length).toBeLessThanOrEqual(5);
  });
});
