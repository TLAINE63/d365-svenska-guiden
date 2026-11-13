import { expect, it } from "vitest";
import { roiProjectCosts } from "../roiCostOverrides";

it("uses the selected implementation cost in both support years", () => {
  expect(roiProjectCosts(319000, 50000, 0.08, 10)).toEqual({ implementation: 50000, supportYear1: 4000, supportYearly: 5000 });
});
it("applies the annual percentage only from year two", () => {
  const a = roiProjectCosts(100000, null, 0.08, 0);
  const b = roiProjectCosts(100000, null, 0.08, 20);
  expect(a.supportYear1).toBe(8000);
  expect(b.supportYear1).toBe(8000);
  expect(b.supportYearly).toBe(20000);
  expect(a.supportYearly).toBe(0);
});
it("restores calculated costs and allows an explicit zero override", () => {
  expect(roiProjectCosts(319000, null, 0.08, 10).implementation).toBe(319000);
  expect(roiProjectCosts(319000, 0, 0.08, 10).implementation).toBe(0);
});