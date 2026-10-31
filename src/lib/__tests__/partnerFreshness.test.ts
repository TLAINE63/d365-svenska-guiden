import { describe, it, expect } from "vitest";
import { freshnessRows } from "@/lib/partnerFreshness";

describe("partnerns egna uppdateringar", () => {
  const list = [
    { id: "1", name: "A", information_status: "verified", information_verified_at: "2026-05-01", partner_updated_at: "2026-10-20T10:00:00Z" },
    { id: "2", name: "B", information_status: "verified", information_verified_at: "2026-10-25", partner_updated_at: "2026-10-20T10:00:00Z" },
    { id: "3", name: "C", information_status: "partner_confirmed", information_verified_at: null, partner_updated_at: "2026-10-30T10:00:00Z" },
  ];
  it("verifierad partner som uppdaterat efter verifieringen flaggas för kontroll", () => {
    const rows = freshnessRows(list, "needs_check");
    expect(rows[0].name).toBe("A");
    expect(rows.find((r) => r.name === "A")!.needsCheck).toBe(true);
    expect(rows.find((r) => r.name === "B")!.needsCheck).toBe(false);
    expect(rows.find((r) => r.name === "C")!.needsCheck).toBe(false);
  });
  it("sorterar på senaste partneruppdatering", () => {
    expect(freshnessRows(list, "partner_updated_desc")[0].name).toBe("C");
  });
});
