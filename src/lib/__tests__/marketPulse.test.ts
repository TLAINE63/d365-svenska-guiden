import { describe, it, expect } from "vitest";
import { mapMarketPulse } from "../marketPulse";

describe("mapMarketPulse", () => {
  it("maps live totals and merges Swedish industry names", () => {
    const m = mapMarketPulse({ companies: 346, page_views: 5957, unique_visitors: 1162, profile_views: 499, search_impressions: 75324, size_small: 143, size_mid: 97, size_large: 91, period_start: "2026-08-20", period_end: "2026-11-17", industries: ["Information Technology and Services", "Computer Software", "Unknown X", "Construction"] })!;
    expect(m.companies).toBe(346);
    expect(m.industries).toEqual(["IT och tjänster", "Bygg och entreprenad"]);
  });
  it("rejects malformed data", () => {
    expect(mapMarketPulse({})).toBeNull();
  });
});
