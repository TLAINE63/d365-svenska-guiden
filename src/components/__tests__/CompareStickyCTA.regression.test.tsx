import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import CompareStickyCTA from "@/components/CompareStickyCTA";

const invokeMock = vi.fn().mockResolvedValue({ data: {}, error: null });

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: (...args: unknown[]) => invokeMock(...args) } },
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const partners = [
  { slug: "acme-consulting", name: "Acme Consulting" },
  { slug: "beta-partner", name: "Beta Partner" },
];

describe("CompareStickyCTA – regression: partner routing payload", () => {
  beforeEach(() => {
    invokeMock.mockClear();
    // Force sticky CTA visible
    Object.defineProperty(window, "scrollY", { configurable: true, value: 1000 });
    sessionStorage.clear();
  });

  it("skickar submit-lead med source_type=compare_partners_intro, assigned_partners och kundens e-post", async () => {
    render(
      <CompareStickyCTA
        partners={partners}
        selectedProduct="Business Central"
        selectedIndustry="Tillverkning"
        sourcePage="compare-partners"
      />,
    );
    act(() => window.dispatchEvent(new Event("scroll")));

    // Open dialog (desktop button)
    fireEvent.click(await screen.findByRole("button", { name: /be om introduktion/i }));

    fireEvent.change(screen.getByLabelText(/Företag \*/i), { target: { value: "Kundbolaget AB" } });
    fireEvent.change(screen.getByLabelText(/Kontaktperson \*/i), { target: { value: "Anna Andersson" } });
    fireEvent.change(screen.getByLabelText(/Jobb-e-post \*/i), { target: { value: "anna@kundbolaget.se" } });

    fireEvent.click(screen.getByRole("button", { name: /Skicka till/i }));

    await waitFor(() => expect(invokeMock).toHaveBeenCalledTimes(1));

    const [fnName, args] = invokeMock.mock.calls[0] as [string, { body: Record<string, unknown> }];
    expect(fnName).toBe("submit-lead");
    expect(args.body).toMatchObject({
      source_type: "compare_partners_intro",
      assigned_partners: ["acme-consulting", "beta-partner"],
      email: "anna@kundbolaget.se",
      company_name: "Kundbolaget AB",
      contact_name: "Anna Andersson",
      selected_product: "Business Central",
      industry: "Tillverkning",
      source_page: "compare-partners",
    });
  });
});

describe("submit-lead edge function – regression: compare_partners_intro routing kontrakt", () => {
  const src = readFileSync(
    resolve(process.cwd(), "supabase/functions/submit-lead/index.ts"),
    "utf-8",
  );

  it("behandlar compare_partners_intro som partnerförfrågan", () => {
    expect(src).toMatch(/source_type\s*===\s*["']compare_partners_intro["']/);
  });

  it("skickar med reply_to = besökarens e-post och d365-adminer som CC", () => {
    expect(src).toContain('ADMIN_EMAILS = ["info@d365.se", "thomas.laine@dynamicfactory.se"]');
    expect(src).toMatch(/cc:\s*ADMIN_EMAILS/);
    expect(src).toMatch(/reply_to:\s*sanitizedData\.email/);
  });
});
