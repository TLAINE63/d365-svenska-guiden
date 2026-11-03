import { describe, expect, it } from "vitest";
import { isvPresenceYearlyPrice, isVendorVerified, matchVerifiedPartner, productExposure } from "../isvVisibility";

const partners = [{ slug: "4ps-sweden", name: "4PS Construction Software AB", is_featured: true }];

describe("isv visibility", () => {
  it("unverified product shows no logo, link or contact", () => {
    expect(productExposure("compiled")).toEqual({ showLogo: false, showWebsite: false, showContact: false });
  });
  it("verified product shows logo, link and contact", () => {
    expect(productExposure("verified")).toEqual({ showLogo: false, showWebsite: false, showContact: false });
    expect(productExposure("verified", true)).toEqual({ showLogo: true, showWebsite: true, showContact: true });
    expect(productExposure("compiled", true)).toEqual({ showLogo: false, showWebsite: false, showContact: false });
  });
  it("vendor that is a verified partner (4PS) is verified automatically", () => {
    const m = matchVerifiedPartner("4PS", "4ps", partners);
    expect(m?.slug).toBe("4ps-sweden");
    expect(isVendorVerified("compiled", m)).toBe(true);
  });
  it("unknown vendor without verification is not verified", () => {
    expect(isVendorVerified("compiled", matchVerifiedPartner("Okänd", "okand", partners))).toBe(false);
  });
  it("ISV Presence: 3 990 kr incl one app, +995 kr per extra app", () => {
    expect(isvPresenceYearlyPrice(1)).toBe(3990);
    expect(isvPresenceYearlyPrice(3)).toBe(5980);
  });
});
