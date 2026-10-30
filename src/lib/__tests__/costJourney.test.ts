import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { costNextSteps, costHelpLines, orgSizeForUsers, SOLUTION_TO_COST } from "@/lib/costJourney";
import { SOLUTIONS } from "@/lib/implementationEstimate";

describe("kostnadsresan, Sprint 1.5", () => {
  it("visar de fyra nästa stegen och alla går till sidor som finns", () => {
    const steps = costNextSteps("business-central");
    expect(steps.map((s) => s.label)).toEqual(["Jämför lösningar", "Bedöm projektets omfattning", "Förstå implementationen", "Förstå partnerkostnaden"]);
    const app = readFileSync("src/App.tsx", "utf8");
    for (const s of steps) expect(app).toContain(`path="${s.href.split("#")[0].replace(/\/$/, "")}"`);
    expect(steps[2].href).toBe("/kostnad/#business-central");
  });

  it("varje kalkyllösning har ett avsnitt i kostnadsguiden", () => {
    const kostnad = readFileSync("src/pages/Kostnad.tsx", "utf8");
    for (const s of SOLUTIONS) {
      const anchor = SOLUTION_TO_COST[s.key]?.anchor;
      expect(anchor).toBeTruthy();
      expect(kostnad).toContain(`key: "${anchor}"`);
    }
  });

  it("hjälpunderlaget skickar bara ifyllda fält plus kalkylen", () => {
    expect(costHelpLines({ area: "Business Central", phase: "Offertfas" }, ["Snabbkalkyl: x"])).toEqual([
      "Lösningsområde: Business Central",
      "Projektfas: Offertfas",
      "Snabbkalkyl: x",
    ]);
  });

  it("användarantal mappas till rätt storlek", () => {
    expect(orgSizeForUsers(25)).toBe("1–25 användare");
    expect(orgSizeForUsers(26)).toBe("26–50 användare");
    expect(orgSizeForUsers(501)).toBe("Fler än 500 användare");
  });
});
