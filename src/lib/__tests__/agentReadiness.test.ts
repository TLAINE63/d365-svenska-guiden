import { describe, it, expect } from "vitest";
import { evaluateReadiness, readinessRelevant } from "@/lib/agentReadiness";
import { assessSolutionPath } from "@/lib/solutionPath";

const base = { processType: "unique", taskType: "repetitive", criticality: "medium", approval: "yes" } as const;

describe("evaluateReadiness", () => {
  it("tydlig process med bra data ger pilot, men jämför först med standard", () => {
    const r = evaluateReadiness({ ...base, ownership: "partner" }, { steps: "yes", data: "yes", followUp: "yes" });
    expect(r.mode).toBe("pilot");
    expect(r.nextSteps[0].href).toBe("/copilot/");
  });
  it("intressant fall men oklart ansvar ger lovande", () => {
    const r = evaluateReadiness({ ...base, ownership: "unknown" }, { steps: "yes", data: "yes", followUp: "partly" });
    expect(r.mode).toBe("promising");
    expect(r.nextSteps[0].label).toMatch(/ägare/);
  });
  it("bristande datakvalitet ger börja med grunden", () => {
    const r = evaluateReadiness({ ...base, ownership: "internal" }, { steps: "yes", data: "no", followUp: "yes" });
    expect(r.mode).toBe("foundation");
  });
  it("många vet inte ger otillräckligt underlag", () => {
    const r = evaluateReadiness({ processType: "unique", taskType: "repetitive", approval: "unknown" }, { data: "unknown" });
    expect(r.insufficient).toBe(true);
  });
  it("visas bara när automation finns i vägvalet", () => {
    expect(readinessRelevant(assessSolutionPath({ ...base }))).toBe(true);
    expect(readinessRelevant(assessSolutionPath({ processType: "industry", criticality: "medium", systems: "few" }))).toBe(false);
  });
  it("högst tre nästa steg", () => {
    const r = evaluateReadiness({}, {});
    expect(r.nextSteps.length).toBeLessThanOrEqual(3);
  });
});
