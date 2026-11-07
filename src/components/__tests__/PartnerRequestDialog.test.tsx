import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PartnerRequestDialog from "../PartnerRequestDialog";

const mocks = vi.hoisted(() => ({ invoke: vi.fn(), navigate: vi.fn(), toast: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: mocks.invoke } } }));
vi.mock("react-router-dom", () => ({ useNavigate: () => mocks.navigate }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: mocks.toast }) }));
vi.mock("@/lib/sessionPages", () => ({ formContextBody: () => ({}) }));
vi.mock("@/utils/newsAttribution", () => ({ newsAttributionForLead: () => ({}) }));
vi.mock("@/utils/trackPartnerEvent", () => ({ trackFormStarted: vi.fn(), trackFormSubmitted: vi.fn() }));
vi.mock("@/utils/trackFunnelEvent", () => ({ trackFunnelStep: vi.fn() }));
vi.mock("@/lib/contactLevels", () => ({ trackContactLevel: vi.fn() }));

const partners = [{ slug: "columbus", name: "Columbus" }, { slug: "nexer", name: "Nexer" }, { slug: "fellowmind", name: "Fellowmind" }];
function submit(recipients = partners) {
  render(<PartnerRequestDialog open onOpenChange={vi.fn()} partnerSlug="columbus" partnerName="Columbus" recipients={recipients} />);
  fireEvent.change(screen.getByLabelText("Företag *"), { target: { value: "Testbolaget AB" } });
  fireEvent.change(screen.getByLabelText("Namn *"), { target: { value: "Test Person" } });
  fireEvent.change(screen.getByLabelText("Jobbmejl *"), { target: { value: "test@example.org" } });
  fireEvent.change(screen.getByLabelText("Antal användare *"), { target: { value: "25" } });
  fireEvent.change(screen.getByLabelText("Viktigaste funktioner/behov *"), { target: { value: "Ekonomi och lager" } });
  fireEvent.click(screen.getByRole("button", { name: "Begär första uppskattning" }));
}

describe("PartnerRequestDialog shared confirmation", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.invoke.mockResolvedValue({ data: { success: true }, error: null }); });
  afterEach(cleanup);
  it("submits all three partners once so one lead and confirmation cover all recipients", async () => {
    submit();
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledOnce());
    expect(mocks.invoke).toHaveBeenCalledOnce();
    expect(mocks.invoke).toHaveBeenCalledWith("submit-lead", expect.objectContaining({ body: expect.objectContaining({ assigned_partners: ["columbus", "nexer", "fellowmind"], source_type: "partner_multi_quote_request" }) }));
  });
  it("keeps a single partner in one request", async () => {
    submit([partners[0]]);
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledOnce());
    expect(mocks.invoke).toHaveBeenCalledOnce();
    expect(mocks.invoke.mock.calls[0][1].body.assigned_partners).toEqual(["columbus"]);
  });
  it("does not report success or navigate when the grouped request fails", async () => {
    mocks.invoke.mockResolvedValue({ data: null, error: new Error("Request failed") });
    submit();
    await waitFor(() => expect(mocks.toast).toHaveBeenCalledWith(expect.objectContaining({ variant: "destructive" })));
    expect(mocks.invoke).toHaveBeenCalledOnce();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
  it("rejects more than three partners rather than silently dropping recipients", async () => {
    submit([...partners, { slug: "fourth", name: "Fourth" }]);
    await waitFor(() => expect(mocks.toast).toHaveBeenCalledWith(expect.objectContaining({ variant: "destructive" })));
    expect(mocks.invoke).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});