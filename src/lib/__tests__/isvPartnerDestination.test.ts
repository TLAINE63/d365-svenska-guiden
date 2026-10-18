import { describe, expect, it } from "vitest";
import { isvPartnerDestination } from "../isvPartnerDestination";
describe("ISV partner journey", () => {
  it("takes FSC-only apps to FSC partners, not BC", () => { expect(isvPartnerDestination(["Finance & Supply Chain Management"]).to).toBe("/finance-supply-chain-partners-sverige/"); });
  it("keeps BC apps on the BC selection", () => { expect(isvPartnerDestination(["Business Central"]).to).toBe("/valjdynamics365partner/?product=bc"); });
  it("does not assume BC for CRM or multi-product apps", () => { expect(isvPartnerDestination(["Sales"]).to).toBe("/valjdynamics365partner/"); expect(isvPartnerDestination(["Business Central", "Finance & Supply Chain Management"]).to).toBe("/valjdynamics365partner/"); });
});