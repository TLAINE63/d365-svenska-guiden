import { describe, it, expect } from "vitest";
import { specialismGroups, draftSummary, requirementsToClarify } from "@/lib/expertRequirement";
import { COMPETENCE_GUIDES } from "@/data/competenceGuides";

describe("Sprint 1.2 expertvägen", () => {
  it("alla sju roller från uppdraget finns i den befintliga taxonomin", () => {
    const titles = COMPETENCE_GUIDES.map((g) => g.title);
    for (const t of ["Solution Architect", "Projektledare", "Testledare", "Applikationskonsult", "Utvecklare/Developer", "Förvaltningsledare", "Support & servicedesk"]) {
      expect(titles).toContain(t);
    }
  });

  it("processpecialiseringar visas bara för affärssystem (ERP)", () => {
    expect(specialismGroups("Business Central").map((g) => g.label)).toContain("Processer i affärssystemet (ERP)");
    expect(specialismGroups("Sales").map((g) => g.label)).not.toContain("Processer i affärssystemet (ERP)");
    expect(specialismGroups("Sales").flatMap((g) => g.options.map((o) => o.label))).toContain("Power BI");
  });

  it("sammanställningen innehåller bara ifyllda fält", () => {
    const s = draftSummary({ role: "dynamics-365-testledare", product: "Sales", delivery: "remote", start: " " });
    expect(s).toEqual([
      { label: "Dynamics-produkt", value: "Sales" },
      { label: "Roll", value: "Testledare" },
      { label: "Leveransform", value: "Distans" },
    ]);
  });

  it("ej ifyllda krav listas som att precisera", () => {
    const full = requirementsToClarify({ product: "Sales", specialism: "Copilot", seniority: "Senior", delivery: "hybrid", start: "2026-12", length: "6 månader" });
    const empty = requirementsToClarify({});
    expect(empty.length - full.length).toBe(6);
  });
});
