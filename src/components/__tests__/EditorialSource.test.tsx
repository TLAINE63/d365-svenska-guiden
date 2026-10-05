import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import EditorialSource, { editorialDate } from "../EditorialSource";

describe("EditorialSource", () => {
  it("renders the publisher and source type as visible semantic HTML without invented provenance", () => {
    const html = renderToStaticMarkup(<EditorialSource sourceType="Partnerguide" />);
    expect(html).toContain("D365.SE Partnerguide");
    expect(html).toContain("Utgivare:");
    expect(html).toContain("Källtyp:");
    expect(html).not.toContain("Senast uppdaterad");
    expect(html).not.toContain("Granskad av");
    expect(html).not.toContain("ej angivet");
    expect(html).not.toContain("ej angiven");
    expect(html).toContain("https://d365.se/#organization");
    expect(html).not.toContain("oberoende");
    expect(html).not.toContain("<time");
    expect(html).toContain("whitespace-nowrap");
  });

  it("uses supplied review metadata and a machine-readable ISO date", () => {
    const html = renderToStaticMarkup(<EditorialSource sourceType="Jämförelse" updatedAt="2026-10-04T12:00:00Z" reviewedBy="Bekräftad granskare" tone="dark" />);
    expect(html).toContain('<time dateTime="2026-10-04">2026-10-04</time>');
    expect(html).toContain("Bekräftad granskare");
    expect(html).toContain("text-primary-foreground");
  });

  it("normalizes stored dates without accepting impossible dates", () => {
    expect(editorialDate("2026/08/20")).toBe("2026-08-20");
    expect(editorialDate("2026-02-30")).toBeUndefined();
    expect(editorialDate("unknown")).toBeUndefined();
    expect(editorialDate(null)).toBeUndefined();
  });

  it.each([
    "PartnerGuidePage", "CompetenceGuidePage", "BuyerGuide2026", "DeepDiveArticle",
    "BlogArticle", "IndustryPage", "Branscher", "Branschlosningar", "IsvCompare", "ComparePartners",
    "ErpComparisonPage", "ErpComparisonsHub", "PartnerMarketReport2026", "GuiderIndex",
    "KunskapscenterHub", "Upphandlingsguiden", "RoleGuidance", "Kostnad", "Priser", "KunskapscenterFaq",
  ])("keeps source attribution in the %s page template", (page) => {
    expect(readFileSync(`src/pages/${page}.tsx`, "utf8")).toContain("<EditorialSource");
  });

  it.each([
    "ERPOverview", "D365ProjectOperations", "D365Marketing", "D365HumanResources",
    "D365FieldService", "D365ContactCenter", "D365Commerce", "D365CustomerService",
    "D365Sales", "CRM", "FinanceSupplyChain", "BusinessCentral", "ValjPartner", "Upphandlingsresan",
  ])("keeps source attribution at the bottom of the %s product page", (page) => {
    expect(readFileSync(`src/pages/${page}.tsx`, "utf8")).toContain("<EditorialSource");
  });
});