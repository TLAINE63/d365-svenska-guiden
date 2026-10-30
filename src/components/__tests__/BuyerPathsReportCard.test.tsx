import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const invoke = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: (...a: unknown[]) => invoke(...a) } } }));

import BuyerPathsReportCard from "@/components/BuyerPathsReportCard";

describe("rapport per köpväg", () => {
  it("visar aggregerade klick och inskick, inklusive hero_intent_clicked och competence_help_requested", async () => {
    invoke.mockResolvedValue({ data: { days: 30, since: "2026-09-30", paths: [
      { key: "hero", label: "Startsidans fyra köpvägar", clicks: 7, submits: 0, registered: [], events: [
        { name: "hero_intent_clicked", label: "Klick på kort i startsidans hero", kind: "click", total: 7, sessions: 5, breakdown: [{ value: "hero_cost", count: 4 }] } ] },
      { key: "competence", label: "Kompetens: partner eller expert", clicks: 3, submits: 2, registered: [{ key: "kompetens_behov", count: 2 }], events: [
        { name: "competence_help_requested", label: "Osäker: Beskriv behovet", kind: "submit", total: 2, sessions: 2, breakdown: [] } ] },
    ] }, error: null });
    render(<BuyerPathsReportCard token="t" />);
    await waitFor(() => expect(screen.getByText("Startsidans fyra köpvägar", { selector: "td" })).toBeTruthy());
    expect(invoke).toHaveBeenCalledWith("funnel-stats", { body: { token: "t", action: "buyer_paths", days: 30 } });
    expect(screen.getByText("hero_intent_clicked")).toBeTruthy();
    expect(screen.getByText("competence_help_requested")).toBeTruthy();
    expect(screen.getByText(/Vad det kostar/)).toBeTruthy();
    expect(screen.getByText(/Kompetensbehov \(formulär\) 2/)).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/@/);
  });
});
