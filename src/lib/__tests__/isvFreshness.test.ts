import { describe, expect, it } from "vitest";
import { isvFreshnessRows } from "@/lib/isvFreshness";

describe("ISV-aktualitet", () => {
  it("flaggar verifierad produkt som leverantören uppdaterat efter verifieringsdatumet", () => {
    const [r] = isvFreshnessRows([{ id: "a", name: "A", information_status: "verified", last_verified_date: "2026-10-01", vendor_updated_at: "2026-10-31T08:00:00Z" }], "needs_check");
    expect(r.needsCheck).toBe(true);
    expect(r.vendorUpdatedAt).toBe("2026-10-31");
  });

  it("flaggar inte verifierad post som uppdaterats före verifieringen", () => {
    const [r] = isvFreshnessRows([{ id: "a", name: "A", information_status: "verified", last_verified_date: "2026-10-31", vendor_updated_at: "2026-10-01T08:00:00Z" }], "needs_check");
    expect(r.needsCheck).toBe(false);
  });

  it("flaggar aldrig leverantörsbekräftade eller automatiskt sammanställda poster", () => {
    const rows = isvFreshnessRows([
      { id: "a", name: "A", information_status: "vendor_confirmed", vendor_updated_at: "2026-10-31" },
      { id: "b", name: "B", information_status: "compiled", vendor_updated_at: "2026-10-31" },
    ], "needs_check");
    expect(rows.every((r) => !r.needsCheck)).toBe(true);
  });

  it("sorterar senaste leverantörsuppdatering först", () => {
    const rows = isvFreshnessRows([
      { id: "a", name: "A", vendor_updated_at: "2026-09-01" },
      { id: "b", name: "B", vendor_updated_at: "2026-10-30" },
      { id: "c", name: "C" },
    ], "partner_updated_desc");
    expect(rows.map((r) => r.id)).toEqual(["b", "a", "c"]);
  });
});
