import { describe, it, expect } from "vitest";
import {
  labelForCapability,
  helpForCapability,
  AI_CAPABILITIES,
  AI_CAPABILITY_HELP,
  UNKNOWN_CAPABILITY_LABEL,
  UNKNOWN_CAPABILITY_HELP,
} from "@/lib/aiProfile";
import {
  describeAiCapability,
  describeAiCapabilities,
  helpForAiCapability,
  UNKNOWN_AI_CAPABILITY_LABEL,
  UNKNOWN_AI_CAPABILITY_HELP,
  AI_TIERS,
} from "@/utils/aiScoring";

/**
 * Skyddar den publika översättningen av AI-capability-slugs till svenska
 * etiketter. Regressionsskydd mot att en slug börjar visas rå för besökare.
 */

describe("labelForCapability (AI-profil, AI_CAPABILITIES)", () => {
  const expected: Record<string, string> = {
    "standard-copilot": "Microsoft Standard AI / inbyggd Copilot",
    "copilot-studio": "Copilot Studio / agents",
    "power-platform": "Power Platform-automation med AI",
    "azure-ai": "Azure AI / Foundry / ML",
    "fabric-bi": "Power BI / Fabric och AI-driven analys",
    "ai-readiness": "AI-readiness och datakvalitet",
    "ai-governance": "AI-governance, säkerhet och behörigheter",
    "ai-adoption": "AI-adoption och utbildning",
    "industry-ai": "Branschspecifika AI-lösningar",
  };

  it.each(Object.entries(expected))(
    "översätter %s → %s",
    (slug, label) => {
      expect(labelForCapability(slug)).toBe(label);
    },
  );

  it("täcker alla registrerade AI_CAPABILITIES", () => {
    // Om någon slug läggs till i AI_CAPABILITIES utan att testet uppdateras
    // ska vi få veta det, så alla besökarvyer garanterat får en svensk label.
    for (const opt of AI_CAPABILITIES) {
      expect(expected[opt.value], `saknad label i test för ${opt.value}`).toBeDefined();
      expect(labelForCapability(opt.value)).toBe(opt.label);
    }
  });

  it("returnerar slugen som fallback för okända värden", () => {
    expect(labelForCapability("finns-inte")).toBe("finns-inte");
    expect(labelForCapability("")).toBe("");
  });

  it("har en förklarande hjälptext för varje capability", () => {
    for (const opt of AI_CAPABILITIES) {
      const help = helpForCapability(opt.value);
      expect(help, `saknar hjälptext för ${opt.value}`).toBeTruthy();
      expect(AI_CAPABILITY_HELP[opt.value]).toBe(help);
    }
  });

  it("tom hjälptext för okända capabilities", () => {
    expect(helpForCapability("finns-inte")).toBe("");
  });
});

describe("describeAiCapability (per-produkt slugs → tier-etikett)", () => {
  const STANDARD = "Microsoft Copilot & standard-AI";
  const PARTNER = "Egenbyggda Copilot Studio-agenter";
  const ADVANCED = "Avancerad Azure AI / ML";

  const cases: [string, string][] = [
    // Generiska
    [AI_TIERS.STANDARD, STANDARD],
    [AI_TIERS.PARTNER, PARTNER],
    [AI_TIERS.ADVANCED, ADVANCED],
    // Legacy BC
    ["bc-copilot", STANDARD],
    ["bc-agent", PARTNER],
    ["bc-azure", ADVANCED],
    // Legacy generic
    ["ai-assistant", STANDARD],
    ["ai-automation", PARTNER],
    ["ai-prediction", PARTNER],
    ["ai-agents", PARTNER],
    ["ai-azure", ADVANCED],
    // FSC
    ["fsc-std-analysis", STANDARD],
    ["fsc-std-forecast", STANDARD],
    ["fsc-partner-finance", PARTNER],
    ["fsc-partner-scm", PARTNER],
    ["fsc-adv-predictive", ADVANCED],
    ["fsc-adv-optimization", ADVANCED],
    // Sales
    ["sales-std-copilot", STANDARD],
    ["sales-std-scoring", STANDARD],
    ["sales-partner-agent", PARTNER],
    ["sales-partner-automation", PARTNER],
    ["sales-adv-predictive", ADVANCED],
    ["sales-adv-analytics", ADVANCED],
    // Service
    ["svc-std-copilot", STANDARD],
    ["svc-std-routing", STANDARD],
    ["svc-partner-agent", PARTNER],
    ["svc-partner-fieldservice", PARTNER],
    ["svc-adv-predictive", ADVANCED],
    ["svc-adv-chatbot", ADVANCED],
  ];

  it.each(cases)("mappar %s → %s", (slug, label) => {
    expect(describeAiCapability(slug)).toBe(label);
  });

  it("returnerar en icke-tom hjälptext för varje känd slug", () => {
    for (const [slug] of cases) {
      const help = helpForAiCapability(slug);
      expect(help, `saknar hjälptext för ${slug}`).toBeTruthy();
    }
  });

  it("okänd slug hamnar på Standard-tier som säker fallback", () => {
    // getTier() faller tillbaka till STANDARD för okända värden – detta
    // säkerställer att inga rå slugs läcker till besökaren.
    expect(describeAiCapability("helt-ny-slug")).toBe(STANDARD);
  });
});

describe("describeAiCapabilities (dedup + par av label/help)", () => {
  it("avduplicerar slugs som mappar till samma tier", () => {
    const result = describeAiCapabilities([
      "ai-standard",
      "bc-copilot",
      "sales-std-copilot",
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Microsoft Copilot & standard-AI");
    expect(result[0].help).toBeTruthy();
  });

  it("returnerar alla tre tiers när de förekommer", () => {
    const result = describeAiCapabilities([
      "ai-standard",
      "ai-partner",
      "ai-advanced",
    ]);
    expect(result.map((r) => r.label)).toEqual([
      "Microsoft Copilot & standard-AI",
      "Egenbyggda Copilot Studio-agenter",
      "Avancerad Azure AI / ML",
    ]);
    for (const r of result) {
      expect(r.help).toBeTruthy();
    }
  });

  it("bevarar insättningsordningen (första förekomst vinner)", () => {
    const result = describeAiCapabilities([
      "ai-advanced",
      "ai-standard",
      "ai-partner",
    ]);
    expect(result.map((r) => r.label)).toEqual([
      "Avancerad Azure AI / ML",
      "Microsoft Copilot & standard-AI",
      "Egenbyggda Copilot Studio-agenter",
    ]);
  });

  it("returnerar tom array för tom input", () => {
    expect(describeAiCapabilities([])).toEqual([]);
  });
});
