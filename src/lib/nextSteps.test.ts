import { describe, expect, it } from "vitest";
import { NOT_FOUND_STEPS, TEMPLATE_NEXT_STEPS, nextStepOptions, nextStepPage, type SourceTemplate } from "./nextSteps";

const TEMPLATES: SourceTemplate[] = [
  "home", "article", "guide", "product", "industry", "comparison", "cost", "calculator", "partner_list",
  "partner_profile", "competence", "inside", "isv_vendor", "isv_product", "isv_category", "category",
  "search", "empty_results", "not_found", "event", "partner_news", "aktuellt", "other",
];

describe("No Dead Ends", () => {
  it("ger varje sidtyp ett nästa steg med hjälp från d365.se sist", () => {
    for (const t of TEMPLATES) {
      const opts = nextStepOptions(TEMPLATE_NEXT_STEPS[t]);
      expect(opts.length).toBeGreaterThanOrEqual(2);
      expect(opts.length).toBeLessThanOrEqual(4);
      expect(opts[opts.length - 1].kind).toBe("help");
      expect(opts[opts.length - 1].recipient).toBe("d365");
    }
  });

  it("låter pilotsidornas egna steg gå före sidtypens fallback", () => {
    expect(nextStepPage("/crm/", "article")?.context).toBe("CRM");
    expect(nextStepPage("/artiklar/nagot/", "article")?.context).toBe("Artikel");
    expect(nextStepPage("/artiklar/nagot/")).toBeNull();
  });

  it("visar de fyra huvudvägarna på 404", () => {
    expect(NOT_FOUND_STEPS.map((s) => s.to)).toEqual(["/kom-igang/", "/kostnad/", "/befintlig-kund/", "/kompetens/"]);
    expect(NOT_FOUND_STEPS[0].label).toBe("CRM- eller affärssystem (ERP)");
  });
});
