import { describe, expect, it } from "vitest";
import { estimateImplementation, type EstimateInputs } from "../implementationEstimate";
import { IMPLEMENTATION_DEFAULTS } from "../calculatorDefaults";

const defaults: EstimateInputs = { ...IMPLEMENTATION_DEFAULTS, solutions: ["bc"] };
const estimate = (changes: Partial<EstimateInputs> = {}) => estimateImplementation({ ...defaults, ...changes }, () => 765);

describe("implementation selections", () => {
  it("zero integrations have no integration hours or priced phase", () => {
    expect(estimate().phases.some(p => p.name === "Integrationer")).toBe(false);
    expect(estimate({ integrations: 1 }).hours - estimate().hours).toBe(45);
  });
  it("migration is only priced when selected", () => {
    expect(estimate().phases.some(p => p.name === "Datamigrering")).toBe(false);
    expect(estimate({ dataMigration: true }).phases.find(p => p.name === "Datamigrering")?.cost).toBeGreaterThan(0);
  });
  it("training is only priced when selected", () => {
    expect(estimate().phases.some(p => p.name === "Utbildning")).toBe(false);
    expect(estimate({ training: true }).phases.find(p => p.name === "Utbildning")?.cost).toBeGreaterThan(0);
  });
  it("custom development is only priced when selected", () => {
    expect(estimate().phases.some(p => p.name === "Egen utveckling")).toBe(false);
    expect(estimate({ customDevelopment: true }).phases.find(p => p.name === "Egen utveckling")?.cost).toBeGreaterThan(0);
  });
  it("phase totals match the exact calculated hours and price", () => {
    for (const result of [estimate(), estimate({ integrations: 2, training: true, dataMigration: true, customDevelopment: true, legalEntities: 2 })]) {
      expect(result.phases.reduce((s,p) => s+p.hours,0)).toBe(result.hours);
      expect(result.phases.reduce((s,p) => s+p.cost,0)).toBe(result.costMid);
    }
  });
  it("highlights a separate quick-start option for simple BC needs, not complex projects", () => {
    expect(estimate().quickStartRelevant).toBe(true);
    expect(estimate({ integrations: 1 }).quickStartRelevant).toBe(false);
    expect(estimate({ complexity: "komplex" }).quickStartRelevant).toBe(false);
    expect(estimate({ solutions: ["sales"] }).quickStartRelevant).toBe(false);
  });
});