import { describe, expect, it } from "vitest";
import { canonicalJourneyEvent } from "./journeyFunnels";

describe("Funnelmätning", () => {
  it("räknar startsidans kort som start i rätt funnel", () => {
    expect(canonicalJourneyEvent("homepage_journey_selected", { journey_type: "cost" }, "/")?.metadata.journey_type).toBe("cost");
    expect(canonicalJourneyEvent("homepage_journey_selected", { journey_type: "new_system" }, "/")?.name).toBe("journey_started");
  });

  it("väntar med kompetenskortet tills besökaren valt partner eller expert", () => {
    expect(canonicalJourneyEvent("homepage_journey_selected", { journey_type: "competence" }, "/")).toBeNull();
    expect(canonicalJourneyEvent("competence_type_selected", { competence_type: "expert" }, "/")?.metadata.journey_type).toBe("expert");
  });

  it("håller kontakt till d365.se och självservice till leverantör isär", () => {
    const help = canonicalJourneyEvent("isv_product_help_requested", {}, "/x/");
    const self = canonicalJourneyEvent("isv_product_selfservice_clicked", { information_status: "verified" }, "/x/");
    expect(help?.name).toBe("contact_d365_submitted");
    expect(help?.metadata.recipient).toBe("d365");
    expect(self?.name).toBe("supplier_selfservice_clicked");
    expect(self?.metadata.recipient).toBe("isv");
    expect(self?.metadata.verification_status).toBe("verified");
  });

  it("tar med de uppräknade inskicken från underlaget", () => {
    for (const e of ["expert_requirement_submitted", "solution_assessment_requested", "cost_help_requested", "partner_relationship_review_requested", "assessment_contact_requested", "partner_profile_help_requested", "isv_product_help_requested"]) {
      expect(canonicalJourneyEvent(e, {}, "/")?.name).toBe("contact_d365_submitted");
    }
  });

  it("ignorerar händelser utanför funnelmodellen", () => {
    expect(canonicalJourneyEvent("next_step_view", {}, "/")).toBeNull();
  });
});
