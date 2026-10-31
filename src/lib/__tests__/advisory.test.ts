import { describe, it, expect } from "vitest";
import { CTA } from "@/data/ctaLabels";
import { ADVISORY_CTA, INTRO_STATUSES, allowedStatuses, caseConversionType, qualificationGaps, sendBlockers } from "@/lib/advisory";

const base = { consent_given: true, consent_at: "2026-10-23", consent_scope: ["kontaktuppgifter"], introduced_at: "2026-10-23T10:00:00Z", partner_response: "accepterad", next_step: "Workshop vecka 45", business_status: "dialog" };

describe("WP1 rådgivning", () => {
  it("de fyra beslutspunkterna har sina egna CTA:er", () => {
    expect(ADVISORY_CTA).toEqual({
      compare: "Prata med d365.se om alternativen",
      partner_switch: "Få en second opinion",
      needs_guide: "Diskutera vår behovsanalys",
      tool_result: "Prata med d365.se om resultatet",
    });
  });

  it("rådgivning erbjuds som samtal med d365.se, inte som mötesbokning", () => {
    expect(CTA.advisoryCta).toBe("Prata med d365.se om ert behov");
    expect(Object.values(ADVISORY_CTA).some((c) => c.startsWith("Boka"))).toBe(false);
  });

  it("statusflödet innehåller Introducerad, Dialog, Kvalificerad, Vunnen, Förlorad och Okänd", () => {
    const v = INTRO_STATUSES.map(([k]) => k);
    for (const s of ["introducerad", "dialog", "kvalificerad", "vunnen", "forlorad", "okand"]) expect(v).toContain(s);
  });

  it("introduktion kan inte skickas utan godkännande, datum och delningsomfång", () => {
    expect(sendBlockers({ consent_given: false, consent_at: null, consent_scope: [] })).toHaveLength(3);
    expect(sendBlockers({ consent_given: true, consent_at: "2026-10-23", consent_scope: [] })).toHaveLength(1);
    expect(sendBlockers({ consent_given: true, consent_at: "2026-10-23", consent_scope: ["kontaktuppgifter"] })).toEqual([]);
  });

  it("ej skickad introduktion kan bara vara förberedd", () => {
    expect(allowedStatuses("Byta ERP", { ...base, introduced_at: null })).toEqual(["forberedd"]);
  });

  it("kvalificerad kräver behov, accepterad partner och nästa steg, men inte budget eller tidplan", () => {
    expect(qualificationGaps("Byta ERP", base)).toEqual([]);
    expect(allowedStatuses("Byta ERP", base)).toContain("kvalificerad");
    expect(allowedStatuses("", base)).not.toContain("kvalificerad");
    expect(allowedStatuses("Byta ERP", { ...base, partner_response: "vantar" })).not.toContain("kvalificerad");
    expect(allowedStatuses("Byta ERP", { ...base, next_step: " " })).not.toContain("kvalificerad");
  });

  it("rådgivning med och utan introduktion hålls isär", () => {
    expect(caseConversionType(0)).toBe("advisory_without_introduction");
    expect(caseConversionType(2)).toBe("advisory_with_introduction");
  });
});
