import { describe, expect, it } from "vitest";
import { PARTNER_PROFILE_TERMS } from "../partnerProfileTerms";

const premium = PARTNER_PROFILE_TERMS.find((t) => t.title.startsWith("Premium"))?.body ?? "";
const grund = PARTNER_PROFILE_TERMS.find((t) => t.title === "Grundprofil")?.body ?? "";

describe("INSIDE gäller endast Premiumpartners", () => {
  it("premiumpunkten anger att INSIDE köps separat och endast gäller Premiumpartners", () => {
    expect(premium).toContain("INSIDE-produktion köps separat och gäller endast Premiumpartners.");
  });
  it("grundprofilspunkten erbjuder inte INSIDE", () => {
    expect(grund).not.toContain("INSIDE");
  });
});
