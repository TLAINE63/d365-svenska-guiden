import { describe, it, expect } from "vitest";
import { resolveNotFoundAlias as r } from "@/lib/notFoundAliases";

describe("404-alias", () => {
  it("felstavat partnerprogram leder till /partnerprogram/", () => {
    for (const p of ["/Partnerprogrma/", "/partnerpgoram/", "/partnerprogam/", "/partnerprogram."]) expect(r(p)).toBe("/partnerprogram/");
  });
  it("versaler i ISV-programmet", () => { expect(r("/ISVprogram/")).toBe("/isvprogram/"); });
  it("gammal kostnadsadress och partnerkortnamn", () => {
    expect(r("/businesscentral/kostnad/")).toBe("/kostnad/");
    expect(r("/vivicta/")).toBe("/partner/vivicta/");
    expect(r("/4ps/")).toBe("/partner/4ps-sweden/");
  });
  it("okända adresser förblir 404", () => {
    for (const p of ["/ledning/", "/YnVzaW5lc3/", "/businesscentral.se:", "/partner/", "/program/"]) expect(r(p)).toBeNull();
  });
});
