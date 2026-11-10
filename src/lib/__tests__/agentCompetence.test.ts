import { describe, it, expect } from "vitest";
import { agentCompetenceBasis, matchesAgentCapability } from "@/lib/aiProfile";

describe("agentkompetens", () => {
  it("utan agentuppgift: inget underlag och matchar när inget filter valts", () => {
    expect(agentCompetenceBasis({ capabilities: ["fabric-bi"] }, "verified")).toEqual([]);
    expect(matchesAgentCapability(null, null)).toBe(true);
    expect(matchesAgentCapability(null, "agent-d365")).toBe(false);
  });
  it("partnerns egen kryssruta 'Granskat av d365.se' räknas inte som granskad", () => {
    expect(agentCompetenceBasis({ capabilities: ["agent-d365"], evidence_level: ["reviewed"] }, "compiled")).toEqual(["stated"]);
  });
  it("granskad bara via verifierad informationsstatus, leverans via kundexempel", () => {
    expect(agentCompetenceBasis({ capabilities: ["copilot-studio"], evidence_level: ["public-case"] }, "verified")).toEqual(["stated", "reviewed", "delivery"]);
  });
});
