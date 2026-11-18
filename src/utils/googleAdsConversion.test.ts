import { beforeEach, describe, expect, it, vi } from "vitest";

async function setup(marketing: boolean, gpc = false) {
  vi.resetModules();
  localStorage.clear();
  localStorage.setItem("cookie-consent-v2", JSON.stringify({ statistics: true, marketing }));
  Object.defineProperty(navigator, "globalPrivacyControl", { value: gpc, configurable: true });
  const gtag = vi.fn();
  (window as unknown as { gtag: unknown }).gtag = gtag;
  const m = await import("./googleAdsConversion");
  return { m, gtag };
}

describe("Google Ads booking conversion", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("reports a booking click to the d365.se booking conversion with marketing consent", async () => {
    const { m, gtag } = await setup(true);
    m.trackAdsBookingConversion();
    expect(gtag).toHaveBeenCalledWith("event", "conversion", { send_to: "AW-17947547907/8tiiCIPl37odEIOyh-5C", value: 1.0, currency: "SEK" });
  });

  it("sends nothing without marketing consent", async () => {
    const { m, gtag } = await setup(false);
    m.trackAdsBookingConversion();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("sends nothing under Global Privacy Control even with marketing consent", async () => {
    const { m, gtag } = await setup(true, true);
    m.trackAdsBookingConversion();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("counts at most one booking click per page load", async () => {
    const { m, gtag } = await setup(true);
    m.trackAdsBookingConversion();
    m.trackAdsBookingConversion();
    expect(gtag).toHaveBeenCalledTimes(1);
  });
});
