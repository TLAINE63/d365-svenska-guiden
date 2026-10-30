import { describe, it, expect } from "vitest";
import { HERO_NODES } from "@/components/home/DecisionModel";
import { COMPETENCE_CHOICES } from "@/components/kompetens/CompetenceChoiceDialog";

// Sprint 0.9 (Thomas 2026-10-30): fyra köparvägar i startsidans hero,
// var och en med fast kort-id, intern klassificering och befintlig destination.
// Sprint 1.0: kompetenskortet förgrenas först till partner eller expert.
const byId = (id: string) => HERO_NODES.find((n) => n.cardId === id);

describe("Hero-korten på startsidan", () => {
  it("har exakt fyra kort med de överenskomna kort-id:na", () => {
    expect(HERO_NODES.map((n) => n.cardId)).toEqual([
      "hero_new_crm_erp",
      "hero_cost",
      "hero_existing_dynamics",
      "hero_competence",
    ]);
  });

  it("nytt CRM- eller affärssystem leder till Systemval och klassas som BuyerProject", () => {
    expect(byId("hero_new_crm_erp")).toMatchObject({ to: "/kom-igang/?source=startsida", intentType: "BuyerProject" });
  });

  it("kostnad leder till kostnadsresan och klassas BuyerProject i steget Plan", () => {
    expect(byId("hero_cost")).toMatchObject({ to: "/kostnad/", intentType: "BuyerProject", buyerStage: "Plan" });
  });

  it("befintliga kunder leder till /befintlig-kund/ utan PartnerChange-klassning", () => {
    const n = byId("hero_existing_dynamics");
    expect(n?.to).toBe("/befintlig-kund/");
    expect(n?.intentType).not.toBe("PartnerChange");
  });

  it("kompetenskortet öppnar valet partner/expert i stället för att gå direkt till expertkompetens", () => {
    const n = byId("hero_competence");
    expect(n?.opensCompetenceChoice).toBe(true);
    expect(n?.intentType).toBeUndefined();
  });

  it("inget kort leder direkt till partnerväljaren", () => {
    expect(HERO_NODES.some((n) => n.to.startsWith("/valjdynamics365partner"))).toBe(false);
  });
});

describe("Valet Vad söker ni?", () => {
  const byType = (t: string) => COMPETENCE_CHOICES.find((c) => c.type === t);

  it("partnervägen använder partnerväljaren och klassas PartnerSearch, inte PartnerChange", () => {
    expect(byType("partner")).toMatchObject({ to: "/valjdynamics365partner/#hitta-partners", intentType: "PartnerSearch", startEvent: "partner_search_started" });
  });

  it("expertvägen använder kompetensöversikten och klassas ExpertRequirement", () => {
    expect(byType("expert")).toMatchObject({ to: "/kompetens/", intentType: "ExpertRequirement", startEvent: "expert_search_started" });
  });

  it("har exakt två huvudval", () => {
    expect(COMPETENCE_CHOICES.map((c) => c.type)).toEqual(["partner", "expert"]);
  });
});
