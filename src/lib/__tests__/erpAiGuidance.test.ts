import { describe, it, expect } from "vitest";
import { BC_CAPABILITIES, BC_READINESS_QUESTIONS, FSCM_CONTROL_LEVELS, exampleBySlug, isPreviewExample } from "@/lib/erpAiGuidance";
import { READINESS_QUESTIONS } from "@/lib/agentReadiness";

describe("erpAiGuidance", () => {
  it("every referenced example is a published, verified example", () => {
    const slugs = [...FSCM_CONTROL_LEVELS.flatMap((l) => l.examples), ...BC_CAPABILITIES.map((c) => c.example).filter(Boolean) as string[]];
    for (const s of slugs) expect(exampleBySlug(s), s).toBeDefined();
  });
  it("preview examples are never labelled as plain standard in BC", () => {
    for (const c of BC_CAPABILITIES) {
      const ex = c.example ? exampleBySlug(c.example) : undefined;
      if (ex && isPreviewExample(ex)) expect(c.maturity).toBe("preview");
    }
  });
  it("Sales Order Agent is marked as consumption-billed", () => {
    expect(BC_CAPABILITIES.find((c) => c.example === "bc-sales-order-agent")!.license).toEqual(["credits"]);
  });
  it("bank reconciliation: included, active by default, no unverified maturity label", () => {
    const c = BC_CAPABILITIES.find((x) => x.example === "bc-bankavstamning")!;
    expect(c.license).toEqual(["included"]);
    expect(c.requiresActivation).toBe(false);
    expect(c.maturity).toBeUndefined();
  });
  it("only chat is labelled preview, as Microsoft Learn states explicitly", () => {
    expect(BC_CAPABILITIES.filter((c) => c.maturity === "preview").map((c) => c.example)).toEqual(["bc-hitta-faktura"]);
    expect(BC_CAPABILITIES.find((c) => c.example === "bc-sales-order-agent")!.requiresActivation).toBe(true);
  });
  it("included and Copilot Credits are never combined on a standard feature", () => {
    for (const c of BC_CAPABILITIES) if (c.license.includes("included")) expect(c.license).toHaveLength(1);
  });
  it("no BC capability claims Copilot is free", () => {
    for (const c of BC_CAPABILITIES) expect(c.text).not.toMatch(/gratis|utan extra kostnad|kostnadsfri/i);
  });
  it("reuses the three agent readiness questions unchanged", () => {
    expect(BC_READINESS_QUESTIONS).toEqual(READINESS_QUESTIONS.map((q) => q.label));
    expect(BC_READINESS_QUESTIONS).toHaveLength(3);
  });
  it("F&SCM has four control levels incl. ERP responsibility", () => {
    expect(FSCM_CONTROL_LEVELS.map((l) => l.key)).toEqual(["analyze", "act", "approve", "erp"]);
  });
});
