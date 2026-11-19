import { describe, it, expect } from "vitest";
import { EXPANSION_PATHS, expansionFor, PRODUCT_INFO } from "../productExpansion";

const typical = (p: keyof typeof EXPANSION_PATHS) =>
  expansionFor(p).filter((s) => s.strength === "typisk").map((s) => s.product);

describe("naturliga utvecklingsvägar (paket 2)", () => {
  it("Business Central leder typiskt till Sales och Customer Service", () => {
    expect(typical("business-central")).toEqual(["sales", "customer-service"]);
  });
  it("F&SCM leder typiskt till Sales, Customer Service och Field Service", () => {
    expect(typical("finance-supply-chain")).toEqual(["sales", "customer-service", "field-service"]);
  });
  it("Sales leder typiskt till Customer Insights och Customer Service", () => {
    expect(typical("sales")).toEqual(["marketing", "customer-service"]);
  });
  it("Customer Service leder till Contact Center och Customer Insights, Sales bara vid behov", () => {
    expect(typical("customer-service")).toEqual(["contact-center", "marketing"]);
    expect(expansionFor("customer-service").find((s) => s.product === "sales")?.strength).toBe("vid-behov");
  });
  it("Customer Insights → Sales framställs inte som lika typisk som Sales → Customer Insights", () => {
    expect(expansionFor("marketing").find((s) => s.product === "sales")?.strength).toBe("vid-behov");
  });
  it("CRM leder aldrig till affärssystem (ERP) som standardsteg", () => {
    for (const p of ["sales", "customer-service", "marketing", "contact-center", "field-service"] as const) {
      expect(expansionFor(p).some((s) => s.product === "business-central" || s.product === "finance-supply-chain")).toBe(false);
    }
  });
  it("varje steg har ett affärsbehov och pekar på en befintlig produktsida", () => {
    for (const steps of Object.values(EXPANSION_PATHS)) for (const s of steps) {
      expect(s.need.length).toBeGreaterThan(20);
      expect(PRODUCT_INFO[s.product].href).toMatch(/^\/[a-z0-9-]+\/$/);
    }
  });
});
