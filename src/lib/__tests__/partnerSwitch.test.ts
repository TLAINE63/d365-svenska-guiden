import { describe, it, expect } from "vitest";
import { analyse, asksPartnerApps } from "@/lib/partnerSwitch";

describe("partnerbytesanalys", () => {
  it("visar inga områden när kunden har full kontroll", () => {
    expect(analyse({ product: "bc", reasons: ["competence"], scope: "development", licenses: "other", partnerApps: "no", code: "yes", docs: "yes", admin: "yes", timing: "later" })).toEqual([]);
  });
  it("tar med licenser när partnern hanterar CSP", () => {
    expect(analyse({ product: "crm", reasons: [], licenses: "partner" }).map((a) => a.id)).toEqual(["licenses"]);
  });
  it("frågar inte om partnerägda appar för Sales/Customer Service", () => {
    expect(asksPartnerApps({ product: "crm", reasons: [] })).toBe(false);
    expect(analyse({ product: "crm", reasons: [], partnerApps: "yes" }).map((a) => a.id)).not.toContain("partnerApps");
  });
});
