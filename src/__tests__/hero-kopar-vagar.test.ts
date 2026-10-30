import { describe, it, expect } from "vitest";
import { HERO_NODES } from "@/components/home/DecisionModel";

// Sprint 0.9 (Thomas 2026-10-30): fyra köparvägar i startsidans hero,
// var och en med fast kort-id, intern klassificering och befintlig destination.
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

  it("kompetens leder till kompetensöversikten och klassas ExpertRequirement", () => {
    expect(byId("hero_competence")).toMatchObject({ to: "/kompetens/", intentType: "ExpertRequirement" });
  });

  it("inget kort leder direkt till partnerväljaren", () => {
    expect(HERO_NODES.some((n) => n.to.startsWith("/valjdynamics365partner"))).toBe(false);
  });
});
