/**
 * Startsidans verksamhetsgenvägar och partnerantal (ersätter testet för de
 * åtta situationskorten som togs bort i sprint 1).
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import partnerData from "@/data/partnerData.json";
import basicPartnerRoutes from "@/data/basicPartnerRoutes.json";

const src = fs.readFileSync(path.resolve(process.cwd(), "src/pages/Index.tsx"), "utf-8");

describe("Startsidan – genvägar och partnerantal", () => {
  it("har separata genvägar för fältservice och kontaktcenter", () => {
    expect(src).toMatch(/t:\s*"Fältservice och tekniker",\s*to:\s*"\/faltservicesystem\/"/);
    expect(src).toMatch(/t:\s*"Kontaktcenter och kunddialog",\s*to:\s*"\/d365contactcenter\/"/);
    expect(src).not.toMatch(/Kontaktcenter och fältservice/);
  });

  it("räknar partners från byggtidens data, utan hårdkodad fallback", () => {
    expect(src).toMatch(/from \"@\/data\/partnerCounts\"/);
    expect(src).not.toMatch(/IDENTIFIED_PARTNER_COUNT_FALLBACK/);
  });

  it("dubbelräknar inga partners mellan profilerade och grundprofiler", () => {
    const featured = new Set((partnerData as any[]).filter((p) => p.is_featured).map((p) => p.slug));
    const basic = (basicPartnerRoutes as any[]).map((b) => b.slug);
    expect(new Set(basic).size).toBe(basic.length);
    expect(basic.filter((s) => featured.has(s))).toEqual([]);
  });
});
