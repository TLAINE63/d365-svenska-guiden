import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { assessBuyer, hasAssessmentInput } from "@/lib/buyerAssessment";

describe("Buyer Assessment Light, Sprint 1.7", () => {
  it("kräver inget fält men visar inget resultat utan svar", () => {
    expect(hasAssessmentInput({})).toBe(false);
    expect(hasAssessmentInput({ phase: "Offertfas" })).toBe(true);
  });

  it("ERP och CRM ger frågan om hur systemen delar data, och nuvarande system nämns", () => {
    const r = assessBuyer({ areas: ["ekonomi", "forsaljning"], currentSystem: "Fortnox", size: "50–249 anställda" });
    expect(r.questions).toContain("Hur affärssystem (ERP) och CRM ska dela kund-, order- och artikeldata.");
    expect(r.questions).toContain("Vilken data och vilka integrationer från Fortnox som ska följa med.");
    expect(r.situation).toContain("I dag används Fortnox.");
  });

  it("rekommenderat nästa steg följer projektfasen", () => {
    expect(assessBuyer({ phase: "Offertfas" }).nextStep.to).toBe("/upphandlingsguiden/");
    expect(assessBuyer({ phase: "Förstudie eller kravarbete" }).nextStep.to).toBe("/kravspecifikation/");
    expect(assessBuyer({ phase: "Har redan Dynamics 365" }).nextStep.to).toBe("/befintlig-kund/");
    expect(assessBuyer({ phase: "Tidig utvärdering" }).nextStep.continueGuide).toBe(true);
  });

  it("ger aldrig poäng och alla vägar går till sidor som finns", () => {
    const app = readFileSync("src/App.tsx", "utf8");
    const r = assessBuyer({ areas: ["tillverkning", "service", "projekt"], phase: "Har redan Dynamics 365" });
    expect(JSON.stringify(r)).not.toMatch(/poäng|score|%/i);
    for (const l of r.paths) expect(app).toContain(`path="${l.href.split("#")[0].replace(/\/$/, "")}"`);
    expect(r.paths.length).toBeLessThanOrEqual(6);
  });
});
