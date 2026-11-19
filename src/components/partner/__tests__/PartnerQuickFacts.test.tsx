import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PartnerQuickFacts } from "@/components/partner/PartnerQuickFacts";
import type { DatabasePartner } from "@/hooks/usePartners";

function makePartner(bcOverride: Record<string, unknown> = {}): DatabasePartner {
  return {
    id: "test-id",
    name: "Testpartner",
    slug: "testpartner",
    logo_url: null,
    website_url: null,
    description: "",
    is_featured: true,
    product_filters: {
      bc: {
        industries: ["Tillverkningsindustri", "Grossist & Distribution"],
        secondaryIndustries: [],
        companySize: ["1-49", "50-99", "250-999"],
        revenue: [],
        geography: ["Europa", "Sverige", "Norden"],
        ranking: 0,
        ...bcOverride,
      },
    },
  } as unknown as DatabasePartner;
}

describe("PartnerQuickFacts", () => {

  it("grupperar 1-49 och 50-99 till 1–99 och visar 250–999 separat", () => {
    render(<PartnerQuickFacts partner={makePartner()} activeTab="bc" />);
    const text = screen.getByText(/anställda/).textContent || "";
    expect(text).toContain("1–99");
    expect(text).toContain("250–999");
    expect(text).toContain("anställda");
  });

  it("sorterar geografi Sverige → Norden → Europa", () => {
    render(<PartnerQuickFacts partner={makePartner()} activeTab="bc" />);
    const geo = screen.getByText("Geografi").nextElementSibling;
    expect(geo?.textContent).toBe("Sverige / Norden / Europa");
  });

  it("visar huvudbranscher i partnerfakta", () => {
    render(<PartnerQuickFacts partner={makePartner()} activeTab="bc" />);
    const ind = screen.getByText("Huvudbranscher").nextElementSibling;
    expect(ind?.textContent).toBe("Tillverkningsindustri, Grossist & Distribution");
  });

  it("faller tillbaka till revenue-baserad storleksetikett när companySize saknas", () => {
    const partner = makePartner({
      industries: [],
      companySize: [],
      revenue: ["1.000-4.999 MSEK"],
      geography: ["Sverige"],
    });
    render(<PartnerQuickFacts partner={partner} activeTab="bc" />);
    const size = screen.getByText("Företagsstorlek").nextElementSibling;
    expect(size?.textContent).toMatch(/stora företag/);
  });

  it("visar sammanhängande intervall utan lucka som ett enda spann", () => {
    const partner = makePartner({
      industries: [],
      companySize: ["50-99", "100-249", "250-999"],
      revenue: [],
      geography: ["Sverige"],
    });
    render(<PartnerQuickFacts partner={partner} activeTab="bc" />);
    const text = screen.getByText(/anställda/).textContent || "";
    expect(text).toContain("50–999");
    expect(text).not.toContain(",");
  });
});
