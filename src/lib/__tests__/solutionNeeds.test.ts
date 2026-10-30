import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { BUSINESS_NEEDS, assessmentLines, businessNeedByKey } from "@/lib/solutionNeeds";
import { NEED_AREAS } from "@/lib/systemval/config";

describe("CRM- eller affärssystem (ERP), Sprint 1.4", () => {
  it("börjar med exakt de åtta verksamhetsbehoven", () => {
    expect(BUSINESS_NEEDS.map((n) => n.label)).toEqual([
      "Ekonomi och rapportering",
      "Försäljning och kundrelationer",
      "Supply chain och logistik",
      "Tillverkning",
      "Service och fältservice",
      "Projektverksamhet",
      "Flera områden",
      "Vet inte ännu",
    ]);
  });

  it("förifyller bara behovsområden som behovsguiden känner till", () => {
    const known = new Set(NEED_AREAS.map((a) => a.id));
    for (const n of BUSINESS_NEEDS) for (const s of n.systemvalNeeds) expect(known.has(s)).toBe(true);
    expect(businessNeedByKey("flera")?.systemvalNeeds).toEqual([]);
  });

  it("alla länkar går till sidor som finns i routningen", () => {
    const app = readFileSync("src/App.tsx", "utf8");
    const industries = JSON.parse(readFileSync("src/data/industryPages.json", "utf8")) as { slug: string }[];
    const comparisons = readFileSync("src/data/erpComparisons.ts", "utf8");
    for (const n of BUSINESS_NEEDS) {
      for (const l of [...n.areas, ...n.guides, ...n.comparisons, ...n.industries]) {
        const path = l.href.replace(/\/$/, "");
        if (path.startsWith("/branscher/")) expect(industries.some((i) => `/branscher/${i.slug}` === path)).toBe(true);
        else if (/^\/jamfor\/.+/.test(path) && !app.includes(`path="${path}"`)) expect(comparisons).toContain(`slug: "${path.split("/")[2]}"`);
        else expect(app).toContain(`path="${path}"`);
      }
    }
  });

  it("bedömningsunderlaget skickar bara ifyllda fält", () => {
    expect(assessmentLines({ change: "Samla ekonomi och lager", areas: ["ekonomi", "supply_chain"], horizon: "Inom 6 månader", currentSystem: " " })).toEqual([
      "Vill förändra: Samla ekonomi och lager",
      "Verksamhetsområden: Ekonomi och rapportering, Supply chain och logistik",
      "Tidshorisont: Inom 6 månader",
    ]);
  });
});
