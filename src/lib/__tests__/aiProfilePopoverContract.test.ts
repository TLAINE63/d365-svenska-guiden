/**
 * Integration test: the popover texts inside AiProfileSection.tsx
 * (ScoreBreakdownPopover + LevelInfoPopover) MUST match the numbers that
 * calculatePartnerAiScore actually produces.
 *
 * We parse the source file as text and re-derive every documented number,
 * then assert it against calculatePartnerAiScore for the same inputs.
 * This catches drift in either direction: if the popover copy is edited
 * without updating the scoring – or vice versa – this test fails.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { calculatePartnerAiScore, type AiProfile } from "@/lib/aiProfile";

const SOURCE = fs.readFileSync(
  path.resolve(__dirname, "../../components/partner/AiProfileSection.tsx"),
  "utf8",
);

function score(p: AiProfile) {
  return calculatePartnerAiScore(p);
}

describe("AiProfileSection popover ↔ calculatePartnerAiScore contract", () => {
  // ---------- A. Capabilities ----------
  // "Azure AI 25, Copilot Studio 18, Power Platform-automation 16,
  //  Branschspecifik AI 16, Fabric/Power BI 14, Readiness 12, Governance 12,
  //  Adoption 10, Standard Copilot 8."
  const capabilityClaims: Array<[string, string, number]> = [
    ["Azure AI",                 "azure-ai",         25],
    ["Copilot Studio",           "copilot-studio",   18],
    ["Power Platform-automation","power-platform",   16],
    ["Branschspecifik AI",       "industry-ai",      16],
    ["Fabric/Power BI",          "fabric-bi",        14],
    ["Readiness",                "ai-readiness",     12],
    ["Governance",               "ai-governance",    12],
    ["Adoption",                 "ai-adoption",      10],
    ["Standard Copilot",         "standard-copilot",  8],
  ];

  it.each(capabilityClaims)(
    "A. capability '%s' (%s) documented as %i points matches scoring",
    (label, value, points) => {
      expect(SOURCE).toMatch(new RegExp(`${label}\\s+${points}`));
      expect(score({ capabilities: [value] })).toBe(points);
    },
  );

  it("A. capabilities are capped at 40 as the popover claims (max 40)", () => {
    expect(SOURCE).toMatch(/AI-förmågor \(max 40\)/);
    // azure (25)+studio(18)+pp(16) = 59 → 40
    expect(score({ capabilities: ["azure-ai", "copilot-studio", "power-platform"] })).toBe(40);
  });

  // ---------- B. Experience + projects ----------
  // "Erfarenhetsnivå (5–25) plus projektbonus (1–2: 0, 3–5: 3, 6–10: 5, 10+: 7)"
  it("B. experience range 5–25 and project bonuses match", () => {
    expect(SOURCE).toMatch(/Erfarenhet \+ projekt \(max 25\)/);
    expect(SOURCE).toMatch(/\(5–25\)/);
    expect(SOURCE).toMatch(/1–2:\s*0/);
    expect(SOURCE).toMatch(/3–5:\s*3/);
    expect(SOURCE).toMatch(/6–10:\s*5/);
    expect(SOURCE).toMatch(/10\+:\s*7/);

    expect(score({ experience_level: "advisory" })).toBe(5);
    expect(score({ experience_level: "established" })).toBe(25);
    expect(score({ experience_level: "advisory", project_count_range: "1-2" })).toBe(5);
    expect(score({ experience_level: "advisory", project_count_range: "3-5" })).toBe(8);
    expect(score({ experience_level: "advisory", project_count_range: "6-10" })).toBe(10);
    expect(score({ experience_level: "advisory", project_count_range: "10+" })).toBe(12);
    // cap
    expect(score({ experience_level: "established", project_count_range: "10+" })).toBe(25);
  });

  // Per-level info popovers say "Bidrar med N poäng …"
  const levelClaims: Array<[string, number]> = [
    ["advisory", 5],
    ["pilot", 10],
    ["delivered", 15],
    ["multiple", 20],
    ["packaged", 22],
    ["established", 25],
  ];
  it.each(levelClaims)(
    "B. LevelInfoPopover for '%s' claims %i poäng and matches scoring",
    (level, pts) => {
      // Find e.g.  advisory: { ... points: "Bidrar med 5 poäng ..." }
      const re = new RegExp(
        `${level}:\\s*\\{[^}]*points:\\s*"Bidrar med ${pts} poäng`,
        "s",
      );
      expect(SOURCE).toMatch(re);
      expect(score({ experience_level: level })).toBe(pts);
    },
  );

  // ---------- C. Evidence (highest only, max 15) ----------
  // "Granskat 15, Publikt case 13, Referens på förfrågan 10, Anonymiserat 8,
  //  Paketerat 6, Självdeklarerat 3."
  const evidenceClaims: Array<[string, string, number]> = [
    ["Granskat",              "reviewed",             15],
    ["Publikt case",          "public-case",          13],
    ["Referens på förfrågan", "reference-on-request", 10],
    ["Anonymiserat",          "anonymized",            8],
    ["Paketerat",             "packaged",              6],
    ["Självdeklarerat",       "self-declared",         3],
  ];
  it.each(evidenceClaims)(
    "C. evidence '%s' (%s) documented as %i points matches scoring",
    (label, value, points) => {
      expect(SOURCE).toMatch(new RegExp(`${label}\\s+${points}`));
      expect(score({ evidence_level: [value] })).toBe(points);
    },
  );

  it("C. highest evidence wins (not sum), capped at 15", () => {
    expect(SOURCE).toMatch(/Underlag \(max 15\)/);
    expect(SOURCE).toMatch(/Högsta valda underlag räknas/);
    expect(score({ evidence_level: ["self-declared", "public-case", "anonymized"] })).toBe(13);
  });

  // ---------- D. Relevant areas (max 10) ----------
  // "0 områden = 0 p, 1 = 3 p, 2–3 = 6 p, 4+ = 10 p"
  it("D. relevance breadth thresholds match", () => {
    expect(SOURCE).toMatch(/Relevanta områden \(max 10\)/);
    expect(SOURCE).toMatch(/0 områden = 0 p/);
    expect(SOURCE).toMatch(/1 = 3 p/);
    expect(SOURCE).toMatch(/2–3 = 6 p/);
    expect(SOURCE).toMatch(/4\+ = 10 p/);

    expect(score({ relevant_areas: [] })).toBe(0);
    expect(score({ relevant_areas: ["a"] })).toBe(3);
    expect(score({ relevant_areas: ["a", "b"] })).toBe(6);
    expect(score({ relevant_areas: ["a", "b", "c"] })).toBe(6);
    expect(score({ relevant_areas: ["a", "b", "c", "d"] })).toBe(10);
  });

  // ---------- E. Delivery model (max 10) ----------
  // "Kombination 10, Centralt/externt team 7, Produktteam 5, Rådgivning 4."
  const deliveryClaims: Array<[string, string, number]> = [
    ["Kombination",            "combined",      10],
    ["Centralt/externt team",  "central-team",   7],
    ["Centralt/externt team",  "external-team",  7],
    ["Produktteam",            "product-teams",  5],
    ["Rådgivning",             "advisory",       4],
  ];
  it.each(deliveryClaims)(
    "E. delivery '%s' (%s) documented as %i points matches scoring",
    (label, value, points) => {
      expect(SOURCE).toMatch(new RegExp(`${label}\\s+${points}`));
      expect(score({ delivery_model: value })).toBe(points);
    },
  );

  // ---------- Total ----------
  it("Total is documented and enforced as capped at 100", () => {
    expect(SOURCE).toMatch(/AI-poäng \(intern, 0–100\)/);
    expect(SOURCE).toMatch(/kappat till 100/);
    expect(
      score({
        capabilities: ["azure-ai", "copilot-studio", "power-platform", "fabric-bi"],
        experience_level: "established",
        project_count_range: "10+",
        evidence_level: ["reviewed"],
        relevant_areas: ["a", "b", "c", "d"],
        delivery_model: "combined",
      }),
    ).toBe(100);
  });
});
