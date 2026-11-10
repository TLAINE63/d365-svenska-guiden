import { describe, it, expect } from "vitest";
import { assessSolutionPath } from "@/lib/solutionPath";

describe("assessSolutionPath", () => {
  it("vanlig process ger standard först", () => {
    const r = assessSolutionPath({ areas: ["ekonomi"], processType: "common", criticality: "high", systems: "none" });
    expect(r.primary).toBe("standard");
  });
  it("branschspecifik process ger ISV först", () => {
    const r = assessSolutionPath({ areas: ["supply_chain"], processType: "industry", criticality: "medium", systems: "few" });
    expect(r.primary).toBe("isv");
  });
  it("unik regelstyrd process ger agent/automation", () => {
    const r = assessSolutionPath({ areas: ["service"], processType: "unique", taskType: "repetitive", criticality: "medium", approval: "yes" });
    expect(r.primary).toBe("automation");
  });
  it("unik verksamhetskritisk bedömningsprocess ger egenutveckling", () => {
    const r = assessSolutionPath({ processType: "unique", taskType: "judgement", criticality: "high" });
    expect(r.primary).toBe("custom");
  });
  it("för lite underlag ger ingen rekommendation", () => {
    const r = assessSolutionPath({ processType: "common", criticality: "low" });
    expect(r.sufficient).toBe(false);
    expect(r.primary).toBeNull();
  });
});
