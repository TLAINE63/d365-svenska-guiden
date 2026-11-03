import { describe, it, expect } from "vitest";
import { isSignalPath, SIGNAL_PATHS, withSignalNoindex } from "../signalPaths";
import { defaultFromDate } from "../adminExports";

describe("signal paths noindex", () => {
  it("matches the four rules", () => {
    expect(isSignalPath("/kom-igang/resultat/")).toBe(true);
    expect(isSignalPath("/tack/radgivning/")).toBe(true);
    expect(isSignalPath("/forfragan/tack/")).toBe(true);
    expect(isSignalPath("/hamtat/kopparguide-2026/")).toBe(true);
    expect(isSignalPath("/kom-igang/")).toBe(false);
    expect(isSignalPath("/tack-nedladdning/")).toBe(false);
  });
  it("lists the verified addresses", () => {
    for (const p of ["/tack/radgivning/", "/forfragan/tack/", "/hamtat/kopparguide-2026/", "/kom-igang/resultat/"]) expect(SIGNAL_PATHS).toContain(p);
  });
  it("injects exactly one noindex, follow", () => {
    const out = withSignalNoindex('<html><head><meta name="robots" content="index" /></head></html>');
    expect(out.match(/name="robots"/g)?.length).toBe(1);
    expect(out).toContain('content="noindex, follow"');
  });
});

describe("admin export default date", () => {
  it("is 7 days back", () => {
    expect(defaultFromDate(new Date("2026-11-03T12:00:00Z"))).toBe("2026-10-27");
  });
});

import { THANKS_KINDS } from "../thanksPages";
describe("signal paths cover all thank-you kinds", () => {
  it("includes every /tack/ kind", () => {
    for (const k of THANKS_KINDS) expect(SIGNAL_PATHS).toContain(`/tack/${k}/`);
  });
});

import { previousMonth } from "../adminExports";
describe("partner stats default month", () => {
  it("is the previous month, rolling over the year", () => {
    expect(previousMonth(new Date("2026-11-03T12:00:00Z"))).toBe("2026-10");
    expect(previousMonth(new Date("2027-01-15T12:00:00Z"))).toBe("2026-12");
  });
});
