import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PartnerCardHeader from "../PartnerCardHeader";

const partner = { name: "Testpartner", logo_url: "/test-logo.svg", is_featured: true, logo_dark_bg: false };

describe("PartnerCardHeader", () => {
  it("links the complete name, badge and logo area to the contextual profile", () => {
    const onClick = vi.fn();
    render(<MemoryRouter><PartnerCardHeader partner={partner} to="/partner/testpartner/?industry=Bygg" onClick={onClick} /></MemoryRouter>);
    const link = screen.getByRole("link", { name: "Visa Testpartners partnerprofil" });
    expect(link).toHaveAttribute("href", "/partner/testpartner/?industry=Bygg");
    expect(link).toContainElement(screen.getByRole("heading", { name: "Testpartner" }));
    expect(link).toContainElement(screen.getByAltText("Testpartner logotyp"));
    expect(link.querySelector("button, a")).toBeNull();
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByAltText(/Verifierad Dynamics\s+365-partner på d365.se/)).toHaveAttribute("src", "/badges/verifierad-partner-dark.svg");
  });

  it("selects the light badge for a dark-background logo", () => {
    render(<MemoryRouter><PartnerCardHeader partner={{ ...partner, logo_dark_bg: true }} to="/partner/testpartner/" /></MemoryRouter>);
    expect(screen.getByAltText(/Verifierad Dynamics\s+365-partner på d365.se/)).toHaveAttribute("src", "/badges/verifierad-partner-light.svg");
  });

  it("does not give a basic profile a verified badge", () => {
    render(<MemoryRouter><PartnerCardHeader partner={{ ...partner, is_featured: false }} to="/basic/testpartner/" /></MemoryRouter>);
    expect(screen.queryByAltText(/Verifierad Dynamics\s+365-partner på d365.se/)).toBeNull();
  });
});