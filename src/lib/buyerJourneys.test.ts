import { describe, expect, it } from "vitest";
import { classifyBuyerJourney } from "./buyerJourneys";

describe("köpresor i admin", () => {
  it("klassar inte behovsguiden som systemval bara utifrån hjälpvägen", () => {
    const r = classifyBuyerJourney({ initial_intent: "BuyerProject", need: "ekonomi" }, {}, "needs_guide");
    expect(r.primary).toBeNull();
    expect(r.basis).toBe("okand");
  });

  it("låter befintlig miljö i projektkontexten vinna över behovsguiden", () => {
    const r = classifyBuyerJourney({ need: "ekonomi" }, { Situation: ["Befintlig Dynamics 365-kund som vill utveckla lösningen"] }, "needs_guide");
    expect(r).toEqual({ primary: "befintlig", secondary: [], basis: "uttryckligt" });
  });

  it("anger flera köpresor när kunden vill både utveckla och se över partnern", () => {
    const r = classifyBuyerJourney({ option: "partnersamarbete", initial_intent: "PartnerChange" }, {}, "partner_relationship_review");
    expect(r.primary).toBe("befintlig");
    expect(r.secondary).toEqual(["partner"]);
  });

  it("använder hjälpvägen bara som ledtråd när val saknas", () => {
    expect(classifyBuyerJourney({}, {}, "isv_product_help")).toEqual({ primary: "isv", secondary: [], basis: "ledtrad" });
  });

  it("visar äldre ärenden utan metadata som ej fastställda", () => {
    expect(classifyBuyerJourney(null, null, null)).toEqual({ primary: null, secondary: [], basis: "okand" });
  });

  it("klassar specialistförfrågningar från både slutkund och partner", () => {
    expect(classifyBuyerJourney({ ordered_by: "end_customer" }, {}, "expert_requirement").primary).toBe("specialist");
    expect(classifyBuyerJourney({ ordered_by: "partner", assignment_role: "delivery" }, {}, "expert_requirement").primary).toBe("specialist");
  });
});
