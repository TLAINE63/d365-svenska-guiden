import { describe, it, expect } from "vitest";
import { exampleFor, evaluateBusinessValue, COMMERCE_EXAMPLE, COMMERCE_B2B_EXAMPLE, PROJECT_OPERATIONS_EXAMPLE } from "../businessValue";

describe("produktspecifika exempelbolag", () => {
  it.each(["customer-service", "field-service", "contact-center", "project-operations", "commerce"])("%s har egen modell med nytta", (k) => {
    const ex = exampleFor(k);
    expect(ex.work[0].id).not.toBe("lead");
    expect(evaluateBusinessValue(ex).total).toBeGreaterThan(0);
  });
  it("Commerce B2B för distribution, B2C annars", () => {
    expect(exampleFor("commerce", "Distribution")).toBe(COMMERCE_B2B_EXAMPLE);
    expect(exampleFor("commerce", "Handel")).toBe(COMMERCE_EXAMPLE);
  });
  it("Debiteringsgrad dämpas av spärrarna: 960 tim × 1 200 kr × 40 % × 60 % × 0,85", () => {
    const row = PROJECT_OPERATIONS_EXAMPLE.leakage.find((r) => r.id === "billable")!;
    expect(Math.round(row.value * row.perYear * 0.4 * 0.6 * 0.85)).toBe(235008);
  });
});
