import { describe, it, expect } from "vitest";
import { isoStockholm } from "../../../supabase/functions/_shared/demandExport";

describe("export timestamps in Europe/Stockholm", () => {
  it("winter time is +01:00, never +00:59", () => {
    expect(isoStockholm("2026-11-03 15:24:18.120653+00")).toBe("2026-11-03T16:24:18+01:00");
  });
  it("summer time is +02:00", () => {
    expect(isoStockholm("2026-07-01T23:59:59.900Z")).toBe("2026-07-02T01:59:59+02:00");
  });
  it("handles the DST switch", () => {
    expect(isoStockholm("2026-10-25T00:30:00Z")).toBe("2026-10-25T02:30:00+02:00");
    expect(isoStockholm("2026-10-25T01:30:00Z")).toBe("2026-10-25T02:30:00+01:00");
  });
});
