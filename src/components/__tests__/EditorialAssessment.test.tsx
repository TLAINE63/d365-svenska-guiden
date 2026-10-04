import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import EditorialAssessment from "../EditorialAssessment";
import { editorialAssessments, type EditorialAssessmentKey } from "@/data/editorialAssessments";

describe("D365.SE:s bedömning", () => {
  it.each(Object.keys(editorialAssessments) as EditorialAssessmentKey[])("attributes %s with 2–5 editorial sentences", (key) => {
    const text = editorialAssessments[key];
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim());
    expect(sentences.length).toBeGreaterThanOrEqual(2);
    expect(sentences.length).toBeLessThanOrEqual(5);
    expect(text).not.toMatch(/oberoende|—/i);
    const html = renderToStaticMarkup(<EditorialAssessment assessment={key} />);
    expect(html).toContain("D365.SE:s bedömning");
    expect(html).toContain("aria-labelledby=");
    expect(html).toContain(`<section`);
    expect(html).toContain(`data-editorial-assessment="${key}"`);
    expect(html).toContain("whitespace-nowrap");
  });

  it.each([
    ["ERPOverview", "erp"], ["BusinessCentral", "bc"], ["FinanceSupplyChain", "fscm"], ["CRM", "crm"], ["Kostnad", "cost"],
  ])("uses the correct assessment for %s", (page, key) => {
    expect(readFileSync(`src/pages/${page}.tsx`, "utf8")).toContain(`<EditorialAssessment assessment="${key}" />`);
  });
});