import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PartnerDecisionOverview from "../PartnerDecisionOverview";
import type { DatabasePartner } from "@/hooks/usePartners";

describe("Partner profile buyer overview", () => {
  const partner = {
    slug: "test", name: "Testpartner", geography: [], industries: [],
    best_fit_for: ["Internationella utrullningar"], not_a_fit: ["Små punktprojekt"],
    product_filters: { bc: { companySize: ["50-99"], industries: ["Tillverkning"], geography: ["Sverige"], deliveryProfile: { typicalCustomers: "Vi arbetar med mellanstora bolag och större verksamheter.", typicalProjects: "Implementation av affärssystem." } } },
  } as unknown as DatabasePartner;

  it("prioritizes partner's actual customer text and distinguishes editorial limits", () => {
    render(<PartnerDecisionOverview partner={partner} />);
    expect(screen.getByRole("heading", { name: "Är Testpartner rätt för er?" })).toBeInTheDocument();
    expect(screen.getAllByText("Vi arbetar med mellanstora bolag och större verksamheter.").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "d365.se:s bedömning" })).toBeInTheDocument();
    expect(screen.getByText("Små punktprojekt")).toBeInTheDocument();
  });

  it("keeps deeper project/support information in closed native details", () => {
    const { container } = render(<PartnerDecisionOverview partner={partner} />);
    const summary = screen.getByText("Mer om kunder, projekt och förvaltning");
    expect(summary.closest("details")).not.toHaveAttribute("open");
    expect(container.textContent).toContain("Implementation av affärssystem.");
    expect(container.querySelector(".whitespace-nowrap")?.textContent).toBe("Dynamics 365");
  });
});