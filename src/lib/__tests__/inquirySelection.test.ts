import { describe, expect, it } from "vitest";
import { addInquiryPartner, articleBuyingStep, cleanInquiryPartners, inquiryHref } from "../inquirySelection";

describe("next-step inquiry selection", () => {
  it("keeps at most three partners, without replacing an existing choice", () => {
    expect(addInquiryPartner(["modia", "nab", "update"], "knowit")).toEqual(["modia", "nab", "update"]);
  });
  it("keeps each partner once", () => {
    expect(addInquiryPartner(["modia", "nab"], "modia")).toEqual(["modia", "nab"]);
  });
  it("rejects malformed partner slugs", () => {
    expect(cleanInquiryPartners(["modia", "../admin", "bad slug", "NAB"])).toEqual(["modia", "nab"]);
  });
  it("passes product, industry, all three partners and the originating page", () => {
    const url = new URL(inquiryHref({ product: "Business Central", industry: "Tillverkningsindustri", partners: ["modia", "nab", "update"], source: "/branscher/tillverkning/" }), "https://d365.se");
    expect(url.searchParams.get("produkt")).toBe("business-central");
    expect(url.searchParams.get("bransch")).toBe("Tillverkningsindustri");
    expect(url.searchParams.getAll("partner")).toEqual(["modia", "nab", "update"]);
    expect(url.searchParams.get("kalla")).toBe("/branscher/tillverkning/");
  });
  it("does not guess a product for mixed CRM or service selections", () => {
    const url = new URL(inquiryHref({ product: "CRM", source: "/alla-d365-partners/" }), "https://d365.se");
    expect(url.searchParams.has("produkt")).toBe(false);
  });
  it("links articles to a buying page, never the inquiry form", () => {
    expect(articleBuyingStep("Business Central").to).toBe("/jamfor/business-central-vs-monitor-erp/");
    expect(articleBuyingStep("Licenser").to).toBe("/priser/");
  });
});