import { describe, it, expect } from "vitest";
import { solutionKindOf } from "./isvSolutionKind";

describe("solutionKindOf", () => {
  it("editorial value wins over derived", () => {
    expect(solutionKindOf({ solutionKind: "bransch", category: "AP automation" })).toBe("bransch");
  });
  it("industry package is a branschlösning", () => {
    expect(solutionKindOf({ category: "Branschpaket" })).toBe("bransch");
  });
  it("integration category is teknisk", () => {
    expect(solutionKindOf({ category: "Integration / iPaaS" })).toBe("teknik");
  });
  it("AP automation (Continia Document Capture) is a funktionellt tillägg", () => {
    expect(solutionKindOf({ category: "AP automation", deliveryModel: "integration_layer" })).toBe("funktion");
  });
});
