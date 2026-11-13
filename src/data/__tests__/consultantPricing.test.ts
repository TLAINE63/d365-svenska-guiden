import { describe, expect, it } from "vitest";
import { CONSULTANT_HOUR_SEK, CONSULTANT_DAY_SEK, BC_IMPLEMENTATION } from "../pricing";
import { BC_DAY_RATE, BC_ROI_IMPLEMENTATION } from "../bcProjectEstimates";

describe("consultant hourly starting assumption", () => {
  it("starts at 1490 SEK per hour", () => {
    expect(CONSULTANT_HOUR_SEK).toBe(1490);
  });
  it("prices day-based estimates at eight hours per day", () => {
    expect(CONSULTANT_DAY_SEK).toBe(11920);
    expect(BC_DAY_RATE).toBe(11920);
    expect(BC_ROI_IMPLEMENTATION.Låg).toBe(327800);
    expect(BC_ROI_IMPLEMENTATION.Medel).toBe(834400);
    expect(BC_ROI_IMPLEMENTATION.Hög).toBe(2086000);
    expect(BC_IMPLEMENTATION.small.low).toBe(178800);
    expect(BC_IMPLEMENTATION.small.high).toBe(476800);
  });
});