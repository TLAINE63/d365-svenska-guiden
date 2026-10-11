import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { IsvResellers } from "./BcIsvCatalog";

vi.mock("@/hooks/useAllPartnerNames", () => ({
  useAllPartnerNames: () => ({ data: [
    { slug: "published", name: "Published partner", is_featured: true },
    { slug: "basic", name: "Basic partner", is_featured: false },
    { slug: "unpublished", name: "Unpublished partner", is_featured: false },
  ] }),
}));
vi.mock("@/hooks/useBasicPartners", () => ({
  useBasicPartners: () => ({ data: [{ slug: "basic", name: "Basic partner" }] }),
}));

describe("ISV reseller profile links", () => {
  it("links to existing profile types without inventing destinations", () => {
    render(<MemoryRouter><IsvResellers slugs={["published", "basic", "unpublished", "unknown"]} /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Published partner" })).toHaveAttribute("href", "/partner/published/");
    expect(screen.getByRole("link", { name: "Basic partner" })).toHaveAttribute("href", "/basic/basic/");
    expect(screen.queryByRole("link", { name: "Unpublished partner" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "unknown" })).not.toBeInTheDocument();
    expect(screen.getByText("Angivet av leverantören.")).toBeInTheDocument();
  });
});