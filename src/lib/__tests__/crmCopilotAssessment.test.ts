import { describe, it, expect } from "vitest";
import { QUESTIONS, assess, summaryRows, type Answers } from "@/lib/crmCopilotAssessment";

const all = (v: Partial<Answers>): Answers => Object.fromEntries(QUESTIONS.map((q) => [q.key, v[q.key] ?? "unknown"])) as Answers;
const text = (a: Answers) => { const r = assess(a); return [...r.observations, ...r.paths.flatMap((p) => [p.title, p.why]), ...r.openQuestions].join(" "); };

const salesforce = all({ goal: "switch", base: "other_crm", m365: "exploring", process: "complex", friction: "info", integration: "basic", maturity: "capable" });
const d365Adoption = all({ goal: "adoption", base: "d365", m365: "pilot", process: "complex", friction: "threshold", integration: "none", maturity: "no_owner" });

describe("crmCopilotAssessment", () => {
  it("har sju frågor och alla har Vet inte", () => {
    expect(QUESTIONS).toHaveLength(7);
    for (const q of QUESTIONS) expect(q.options.some((o) => o.value === "unknown" && o.label === "Vet inte")).toBe(true);
  });
  it("Salesforce-kund får jämförelse, inte utveckla Dynamics", () => {
    const keys = assess(salesforce).paths.map((p) => p.key);
    expect(keys).toContain("compare_alternatives");
    expect(keys).toContain("improve_existing");
    expect(assess(salesforce).paths.find((p) => p.key === "improve_existing")!.title).not.toMatch(/Dynamics/);
  });
  it("Dynamics-kund med acceptansproblem får inte byte eller jämförelse", () => {
    const keys = assess(d365Adoption).paths.map((p) => p.key);
    expect(keys).toEqual(expect.arrayContaining(["improve_existing", "copilot_workspace", "change"]));
    expect(keys).not.toContain("compare_alternatives");
    expect(keys).not.toContain("evaluate_crm");
  });
  it("flera vägar kan visas samtidigt", () => { expect(assess(d365Adoption).paths.length).toBeGreaterThanOrEqual(3); });
  it("bara Vet inte ger begränsat underlag och öppna frågor per fråga", () => {
    const r = assess(all({}));
    expect(r.complete).toBe(true);
    expect(r.limited).toBe(true);
    expect(r.paths.map((p) => p.key)).toContain("clarify");
    expect(r.openQuestions.filter((q) => q.startsWith("Ej besvarat")).length).toBe(7);
  });
  it("inga kategoriska produktval, poäng eller priser", () => {
    for (const a of [salesforce, d365Adoption, all({})]) {
      const t = text(a);
      expect(t).not.toMatch(/%|USD|kr\b|måste köpa|rekommenderar|bästa valet|ersätter CRM/i);
    }
  });
  it("licensfrågan finns alltid och PDF-raderna speglar skärmen", () => {
    const r = assess(salesforce);
    expect(r.openQuestions.some((q) => /licenser/.test(q))).toBe(true);
    const rows = summaryRows(salesforce, r);
    expect(rows["B. Vägar att undersöka"]).toContain(r.paths[0].title);
    expect(rows["C. Frågor att utreda vidare"]).toContain(r.openQuestions.at(-1)!);
  });
});

import { pdfContent } from "@/lib/crmCopilotAssessment";
describe("PDF-innehåll", () => {
  it("A, B och C blir egna avsnitt med en punkt per post och inga beräkningar nämns", () => {
    const r = assess(salesforce);
    const { values, pdf } = pdfContent(salesforce, r);
    expect(Object.keys(values)).toHaveLength(7);
    expect(pdf.sections.map((s) => s.items.length)).toEqual([r.observations.length, r.paths.length, r.openQuestions.length]);
    expect(pdf.note).not.toMatch(/indikativa/);
  });
  it("systemägarskap formuleras nyanserat", () => {
    expect(assess(d365Adoption).observations.join(" ")).toContain("systemägarskapet behöver tydliggöras");
  });
});

import { toggleMulti, QUESTIONS as Q2, assess as assess2 } from "@/lib/crmCopilotAssessment";
describe("flerval (Thomas 2026-11-19)", () => {
  it("fråga 1, 5 och 6 är flerval, övriga enkelval", () => {
    expect(Q2.filter((q) => q.multi).map((q) => q.key)).toEqual(["goal", "friction", "integration"]);
  });
  it("max tre val och Vet inte rensar övriga", () => {
    expect(toggleMulti(["a", "b", "c"], "d")).toEqual(["a", "b", "c"]);
    expect(toggleMulti(["a", "b"], "unknown")).toEqual(["unknown"]);
    expect(toggleMulti(["unknown"], "a")).toEqual(["a"]);
  });
  it("flera mål och friktioner ger vägar för båda", () => {
    const r = assess2({ goal: ["admin", "erp"], base: "d365", m365: "no", process: "complex", friction: ["admin", "data"], integration: ["basic", "marketing"], maturity: "capable" });
    const keys = r.paths.map((p) => p.key);
    expect(keys).toContain("copilot_workspace");
    expect(keys).toContain("integration");
    expect(keys).toContain("change");
  });
});

describe("varför-frågan (Thomas 2026-11-19)", () => {
  it("automatisering leder till Copilot-vägen", () => {
    const r = assess2({ goal: ["automate"], base: "light", m365: "no", process: "simple", friction: ["info"], integration: ["none"], maturity: "standard" });
    expect(r.paths.map((p) => p.key)).toContain("copilot_workspace");
  });
});
