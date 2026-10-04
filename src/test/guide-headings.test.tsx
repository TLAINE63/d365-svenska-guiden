import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buyerSectionHeading, partnerQuestion } from "@/lib/guideHeadings";

describe("Guide heading architecture", () => {
  it("preserves descriptive labels and turns decision labels into meaningful sections", () => {
    expect(buyerSectionHeading("5. Vanliga fallgropar")).toBe("Risker att tänka på");
    expect(buyerSectionHeading("1. Utgå från processen, inte från fälten")).toBe("Vad avgör valet?");
    expect(buyerSectionHeading("2. Specifika integrationskrav")).toBe("Specifika integrationskrav");
    expect(partnerQuestion("Hur hittar ni rätt partner?")).toBe("Hur hittar ni rätt partner?");
    expect(partnerQuestion("Så väljer ni partner")).toBe("Hur väljer ni partner?");
  });
  it.each(["BusinessCentral", "FinanceSupplyChain", "CRM", "ERPOverview"])("puts the existing short answer before assessment in %s", page => {
    const source = readFileSync(`src/pages/${page}.tsx`, "utf8");
    const short = page === "ERPOverview" ? source.indexOf("Kort svar") : source.indexOf("<ShortAnswer>");
    expect(short).toBeGreaterThan(0);
    expect(short).toBeLessThan(source.indexOf("<EditorialAssessment"));
    expect(source).toContain("<SourcesAndMethod");
  });
  it("keeps comparison before the alternative-fit sections and includes a parent for risks", () => {
    const source = readFileSync("src/pages/ErpComparisonPage.tsx", "utf8");
    expect(source.indexOf("COMPARISON TABLE")).toBeLessThan(source.indexOf("SUMMARIES"));
    expect(source).toContain("Risker att tänka på</h2>");
    expect(source).toContain("<ShortAnswer>{data.intro}</ShortAnswer>");
  });
});
