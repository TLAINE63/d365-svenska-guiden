import { describe, it, expect } from "vitest";
import { calculatePartnerAiScore, type AiProfile } from "@/lib/aiProfile";

/**
 * These tests lock down the 0–100 scoring contract that is documented in the
 * popover texts inside src/components/partner/AiProfileSection.tsx
 * (ScoreBreakdownPopover + LevelInfoPopover).
 *
 * Buckets (max points):
 *   A. Capabilities          → 40
 *   B. Experience + projects → 25
 *   C. Evidence (highest)    → 15
 *   D. Relevance breadth     → 10
 *   E. Delivery model        → 10
 *   Total capped at 100.
 */

describe("calculatePartnerAiScore", () => {
  it("returns 0 for null/empty profile", () => {
    expect(calculatePartnerAiScore(null)).toBe(0);
    expect(calculatePartnerAiScore(undefined)).toBe(0);
    expect(calculatePartnerAiScore({})).toBe(0);
  });

  // ---------- A. Capabilities (cap 40) ----------
  describe("A. Capabilities (max 40)", () => {
    const cases: Array<[string, number]> = [
      ["standard-copilot", 8],
      ["copilot-studio", 18],
      ["power-platform", 16],
      ["azure-ai", 25],
      ["fabric-bi", 14],
      ["ai-readiness", 12],
      ["ai-governance", 12],
      ["ai-adoption", 10],
      ["industry-ai", 16],
    ];
    it.each(cases)("%s gives %i points", (cap, pts) => {
      expect(calculatePartnerAiScore({ capabilities: [cap] })).toBe(pts);
    });

    it("sums multiple capabilities", () => {
      expect(
        calculatePartnerAiScore({ capabilities: ["standard-copilot", "copilot-studio"] }),
      ).toBe(26);
    });

    it("caps capability score at 40", () => {
      // azure-ai (25) + copilot-studio (18) + power-platform (16) = 59 → 40
      expect(
        calculatePartnerAiScore({
          capabilities: ["azure-ai", "copilot-studio", "power-platform"],
        }),
      ).toBe(40);
    });

    it("ignores unknown capability values", () => {
      expect(calculatePartnerAiScore({ capabilities: ["bogus"] })).toBe(0);
    });
  });

  // ---------- B. Experience + project bonus (cap 25) ----------
  describe("B. Experience + project bonus (max 25)", () => {
    const expCases: Array<[string, number]> = [
      ["advisory", 5],
      ["pilot", 10],
      ["delivered", 15],
      ["multiple", 20],
      ["packaged", 22],
      ["established", 25],
    ];
    it.each(expCases)("experience %s gives %i", (level, pts) => {
      expect(calculatePartnerAiScore({ experience_level: level })).toBe(pts);
    });

    const projCases: Array<[string, number]> = [
      ["1-2", 0],
      ["3-5", 3],
      ["6-10", 5],
      ["10+", 7],
    ];
    it.each(projCases)("project bonus %s on advisory = 5+%i", (range, bonus) => {
      expect(
        calculatePartnerAiScore({ experience_level: "advisory", project_count_range: range }),
      ).toBe(5 + bonus);
    });

    it("caps experience+projects at 25 (established + 10+ would be 32)", () => {
      expect(
        calculatePartnerAiScore({
          experience_level: "established",
          project_count_range: "10+",
        }),
      ).toBe(25);
    });
  });

  // ---------- C. Evidence (cap 15, highest only) ----------
  describe("C. Evidence (max 15, highest only)", () => {
    const cases: Array<[string, number]> = [
      ["self-declared", 3],
      ["packaged", 6],
      ["anonymized", 8],
      ["reference-on-request", 10],
      ["public-case", 13],
      ["reviewed", 15],
    ];
    it.each(cases)("%s = %i", (lvl, pts) => {
      expect(calculatePartnerAiScore({ evidence_level: [lvl] })).toBe(pts);
    });

    it("uses the highest evidence, not the sum", () => {
      expect(
        calculatePartnerAiScore({
          evidence_level: ["self-declared", "public-case", "anonymized"],
        }),
      ).toBe(13);
    });
  });

  // ---------- D. Relevance breadth (cap 10) ----------
  describe("D. Relevance breadth (max 10)", () => {
    it("0 areas → 0", () => {
      expect(calculatePartnerAiScore({ relevant_areas: [] })).toBe(0);
    });
    it("1 area → 3", () => {
      expect(calculatePartnerAiScore({ relevant_areas: ["Business Central"] })).toBe(3);
    });
    it("2 areas → 6", () => {
      expect(
        calculatePartnerAiScore({ relevant_areas: ["Business Central", "Power Platform"] }),
      ).toBe(6);
    });
    it("3 areas → 6", () => {
      expect(
        calculatePartnerAiScore({
          relevant_areas: ["Business Central", "Power Platform", "Azure / Fabric"],
        }),
      ).toBe(6);
    });
    it("4+ areas → 10", () => {
      expect(
        calculatePartnerAiScore({
          relevant_areas: ["a", "b", "c", "d"],
        }),
      ).toBe(10);
    });
  });

  // ---------- E. Delivery model (cap 10) ----------
  describe("E. Delivery model (max 10)", () => {
    const cases: Array<[string, number]> = [
      ["advisory", 4],
      ["product-teams", 5],
      ["central-team", 7],
      ["external-team", 7],
      ["combined", 10],
    ];
    it.each(cases)("%s = %i", (model, pts) => {
      expect(calculatePartnerAiScore({ delivery_model: model })).toBe(pts);
    });

    it("unknown delivery model → 0", () => {
      expect(calculatePartnerAiScore({ delivery_model: "something-else" })).toBe(0);
    });
  });

  // ---------- Totals & cap ----------
  describe("Total score", () => {
    it("sums all buckets", () => {
      // A: standard-copilot (8) + copilot-studio (18) = 26
      // B: delivered (15) + 3-5 (3) = 18
      // C: anonymized = 8
      // D: 2 areas = 6
      // E: central-team = 7
      // Total = 65
      const profile: AiProfile = {
        capabilities: ["standard-copilot", "copilot-studio"],
        experience_level: "delivered",
        project_count_range: "3-5",
        evidence_level: ["anonymized"],
        relevant_areas: ["Business Central", "Power Platform"],
        delivery_model: "central-team",
      };
      expect(calculatePartnerAiScore(profile)).toBe(65);
    });

    it("caps total at 100 even when buckets max out", () => {
      // A capped 40, B capped 25, C 15, D 10, E 10 = 100
      const profile: AiProfile = {
        capabilities: ["azure-ai", "copilot-studio", "power-platform", "fabric-bi"],
        experience_level: "established",
        project_count_range: "10+",
        evidence_level: ["reviewed", "public-case"],
        relevant_areas: ["a", "b", "c", "d", "e"],
        delivery_model: "combined",
      };
      expect(calculatePartnerAiScore(profile)).toBe(100);
    });

    it("never returns less than 0", () => {
      expect(calculatePartnerAiScore({ capabilities: [] })).toBeGreaterThanOrEqual(0);
    });
  });
});
