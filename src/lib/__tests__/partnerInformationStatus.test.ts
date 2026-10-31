import { describe, it, expect } from "vitest";
import { sortPartners, filterByInformationStatus, informationStatusOf } from "@/lib/partnerInformationStatus";
import { matchesAssignmentType, matchesDeliveryForm, matchesCompetence } from "@/lib/partnerSearchFilters";

const p = (name: string, information_status: string | null, extra: Record<string, unknown> = {}) => ({ name, information_status, ...extra });

describe("informationsstatus", () => {
  it("saknad eller okänd status blir aldrig verifierad", () => {
    expect(informationStatusOf({ information_status: null })).toBe("compiled");
    expect(informationStatusOf({ information_status: "ai_verified" })).toBe("compiled");
  });

  it("filtret visar bara vald status och Alla visar alla", () => {
    const list = [p("A", "verified"), p("B", "partner_confirmed"), p("C", "compiled")];
    expect(filterByInformationStatus(list, "verified").map((x) => x.name)).toEqual(["A"]);
    expect(filterByInformationStatus(list, "compiled").map((x) => x.name)).toEqual(["B", "C"]);
    expect(filterByInformationStatus(list, null)).toHaveLength(3);
  });

  it("kommersiell status (avtal, premium) påverkar inte Mest relevant", () => {
    const list = [
      p("Ingen", "partner_confirmed", { agreement_signed: false, premium: false }),
      p("Avtal", "partner_confirmed", { agreement_signed: true, premium: true }),
    ];
    expect(sortPartners(list, "relevant").map((x) => x.name)).toEqual(["Ingen", "Avtal"]);
  });

  it("status är bara tiebreaker: högre fit vinner över verifiering", () => {
    const list = [p("Verifierad", "verified"), p("Sammanställd", "compiled")];
    const fit = (x: { name: string }) => (x.name === "Sammanställd" ? 2 : 1);
    expect(sortPartners(list, "relevant", fit).map((x) => x.name)).toEqual(["Sammanställd", "Verifierad"]);
    expect(sortPartners(list, "relevant").map((x) => x.name)).toEqual(["Verifierad", "Sammanställd"]);
  });

  it("Senast verifierad och A–Ö", () => {
    const list = [
      p("Öst", "verified", { information_verified_at: "2026-05-01" }),
      p("Ab", "verified", { information_verified_at: "2026-10-17" }),
      p("Mitt", "compiled", { information_verified_at: "2026-10-30" }),
    ];
    expect(sortPartners(list, "latest_verified").map((x) => x.name)).toEqual(["Ab", "Öst", "Mitt"]);
    expect(sortPartners(list, "alpha").map((x) => x.name)).toEqual(["Ab", "Mitt", "Öst"]);
  });
});

describe("uppdragstyp, leveransform och kompetens", () => {
  const long = "x".repeat(50);
  const partner = {
    product_filters: { bc: { deliveryProfile: { typicalProjects: long, managedServices: "", supportLevel: "managed_offering" as const } } },
    extended_competencies: { power_platform: "documented_delivery" as const, copilot_ai: "unverified" as const },
  };
  it("uppdragstyp kräver partnerns egen beskrivning", () => {
    expect(matchesAssignmentType(partner, "projekt", ["bc"])).toBe(true);
    expect(matchesAssignmentType(partner, "forvaltning", ["bc"])).toBe(false);
    expect(matchesAssignmentType(partner, "projekt", ["sales"])).toBe(false);
  });
  it("leveransform är kumulativ", () => {
    expect(matchesDeliveryForm(partner, "project_focus")).toBe(true);
    expect(matchesDeliveryForm(partner, "managed_offering")).toBe(true);
    expect(matchesDeliveryForm(partner, "lifecycle_partner")).toBe(false);
  });
  it("kompetens räknar inte Ej bekräftad", () => {
    expect(matchesCompetence(partner, "power_platform")).toBe(true);
    expect(matchesCompetence(partner, "copilot_ai")).toBe(false);
  });
});

describe("två informationsnivåer", () => {
  it("den gamla mellannivån räknas som automatiskt sammanställd", async () => {
    const m = await import("@/lib/partnerInformationStatus");
    expect(m.INFORMATION_STATUSES.map((s) => s.value)).toEqual(["verified", "compiled"]);
    expect(m.informationStatusOf({ information_status: "partner_confirmed" })).toBe("compiled");
  });
});
