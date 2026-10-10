import { describe, it, expect } from "vitest";
import partnerData from "@/data/partnerData.json";
import basicPartnerRoutes from "@/data/basicPartnerRoutes.json";
import { IDENTIFIED_PARTNER_COUNT, VERIFIED_PARTNER_COUNT, BASIC_PARTNER_COUNT, VERIFIED_PARTNER_SLUGS } from "@/data/partnerCounts";
import { REPORT_STATS } from "@/data/partnerMarketReport2026";

describe("gemensamma partnerantal", () => {
  it("verifierade och grundprofiler överlappar inte och slugs är unika", () => {
    const basic = (basicPartnerRoutes as { slug: string }[]).map((b) => b.slug);
    expect(new Set(basic).size).toBe(basic.length);
    expect(new Set(VERIFIED_PARTNER_SLUGS).size).toBe(VERIFIED_PARTNER_SLUGS.length);
    expect(VERIFIED_PARTNER_SLUGS.filter((s) => basic.includes(s))).toEqual([]);
    expect(IDENTIFIED_PARTNER_COUNT).toBe(VERIFIED_PARTNER_COUNT + BASIC_PARTNER_COUNT);
    expect(VERIFIED_PARTNER_COUNT).toBe((partnerData as any[]).filter((p) => p.is_featured === true).length);
  });
  it("marknadsrapporten använder samma totalsiffror", () => {
    expect(REPORT_STATS.find((s) => s.label === "Kartlagda partners")?.value).toBe(IDENTIFIED_PARTNER_COUNT);
    expect(REPORT_STATS.find((s) => s.label === "Partnerverifierade profiler")?.value).toBe(VERIFIED_PARTNER_COUNT);
  });
});
