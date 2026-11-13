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

import { vendorOfficeText } from "./isvVendorOffice";
describe("vendorOfficeText", () => {
  it("Swedish office shows city only", () => {
    expect(vendorOfficeText({ office_scope: "se", office_city: "Stockholm", office_country: "Sverige" })).toBe("Kontor i Sverige: Stockholm");
  });
  it("HQ shows city and country", () => {
    expect(vendorOfficeText({ office_scope: "hq", office_city: "Köpenhamn", office_country: "Danmark" })).toBe("Huvudkontor: Köpenhamn, Danmark");
  });
  it("empty when not set", () => {
    expect(vendorOfficeText({})).toBe("");
  });
});
