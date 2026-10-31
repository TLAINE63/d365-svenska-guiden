import { describe, expect, it } from "vitest";
import {
  ISV_STATUS_FILTERS,
  isvInformationStatusLabel,
  isvInformationStatusOf,
  matchesIsvStatusFilter,
} from "./isvInformationStatus";

describe("ISV-informationsstatus", () => {
  it("visar de tre publika statusarna med exakta etiketter", () => {
    expect(isvInformationStatusLabel("verified")).toBe("D365 Verifierad");
    expect(isvInformationStatusOf("vendor_confirmed")).toBe("compiled");
    expect(isvInformationStatusLabel("compiled")).toBe("Automatiskt sammanställd");
  });

  it("har Alla som förvalt filter", () => {
    expect(ISV_STATUS_FILTERS[0]).toEqual({ value: "all", label: "Alla" });
  });

  it("behandlar okänd eller premiumliknande status som sammanställd, aldrig verifierad", () => {
    expect(isvInformationStatusOf(null)).toBe("compiled");
    expect(isvInformationStatusOf("premium")).toBe("compiled");
    expect(isvInformationStatusOf("partner_confirmed")).toBe("compiled");
  });

  it("filtrerar bara på vald status", () => {
    expect(matchesIsvStatusFilter("compiled", "all")).toBe(true);
    expect(matchesIsvStatusFilter("compiled", "verified")).toBe(false);
    expect(matchesIsvStatusFilter("vendor_confirmed", "compiled")).toBe(true);
    expect(matchesIsvStatusFilter(undefined, "compiled")).toBe(true);
  });
});
