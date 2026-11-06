import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PartnerCompareBar from "../PartnerCompareBar";

const state = vi.hoisted(() => ({ navigate: vi.fn(), selected: [{ slug: "columbus", name: "Columbus Sweden AB" }] }));
vi.mock("react-router-dom", async (importOriginal) => ({ ...await importOriginal<typeof import("react-router-dom")>(), useNavigate: () => state.navigate }));
vi.mock("@/contexts/PartnerCompareContext", () => ({ usePartnerCompare: () => ({ selected: state.selected, remove: vi.fn(), clear: vi.fn(), filterContext: { product: "bc", industry: "Tillverkning" } }) }));
vi.mock("@/components/PartnerRequestDialog", () => ({ default: () => null }));
vi.mock("@/utils/trackFunnelEvent", () => ({ trackFunnelEvent: vi.fn() }));

describe("PartnerCompareBar selection handoff", () => {
  beforeEach(() => { state.navigate.mockClear(); state.selected = [{ slug: "columbus", name: "Columbus Sweden AB" }]; });
  it("allows one partner and preserves it in slot a with context and two empty slots", () => {
    render(<MemoryRouter><PartnerCompareBar /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Jämför partnerna" }));
    const url = new URL(state.navigate.mock.calls[0][0], "https://d365.se");
    expect(url.searchParams.get("a")).toBe("columbus");
    expect(url.searchParams.has("b")).toBe(false);
    expect(url.searchParams.has("c")).toBe(false);
    expect(url.searchParams.get("product")).toBe("bc");
    expect(url.searchParams.get("industry")).toBe("Tillverkning");
  });
  it("keeps all three selected partners in order", () => {
    state.selected.push({ slug: "nexer", name: "Nexer" }, { slug: "fellowmind", name: "Fellowmind" });
    render(<MemoryRouter><PartnerCompareBar /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Jämför partnerna" }));
    const url = new URL(state.navigate.mock.calls[0][0], "https://d365.se");
    expect(["a", "b", "c"].map(key => url.searchParams.get(key))).toEqual(["columbus", "nexer", "fellowmind"]);
  });
});