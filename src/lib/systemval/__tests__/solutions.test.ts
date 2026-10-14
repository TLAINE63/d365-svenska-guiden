import { describe, it, expect } from "vitest";
import { answer, deriveState, emptyInput, type DialogInput } from "../engine";
import { Q, type ErpResult } from "../modules/erp";
import { buildSolutionPicture } from "../solutions";

function walk(script: Record<string, string[]>) {
  let i: DialogInput = emptyInput();
  for (let n = 0; n < 15; n++) {
    const next = deriveState(i).nextQuestionId;
    if (!next) break;
    i = answer(i, next, script[next] ?? ["unknown"]);
  }
  const s = deriveState(i);
  return { s, i, p: buildSolutionPicture(s, s.moduleResults.erp as ErpResult | undefined) };
}
const ids = (xs: { id: string }[]) => xs.map((x) => x.id);

describe("Lösningsbild (Sprint 3)", () => {
  it("ERP + försäljning, enkel struktur: BC primärt, Sales kompletterande", () => {
    const { p } = walk({ entry: ["needs"], needs_areas: ["erp", "sales"], priority: ["erp"],
      [Q.ERP1]: ["finance", "sales_orders"], [Q.ERP2]: ["basic"], [Q.ERP5]: ["single"], change_intent: ["replace"], [Q.ERP6]: ["excel"] });
    expect(ids(p.primary)).toEqual(["bc"]);
    expect(ids(p.complementary)).toContain("sales");
    expect(p.openQuestions.length).toBeGreaterThanOrEqual(2);
    expect(p.openQuestions.length).toBeLessThanOrEqual(4);
  });

  it("Försäljning + marknad: Sales och Customer Insights, inget ERP", () => {
    const { p } = walk({ entry: ["needs"], needs_areas: ["sales", "marketing"], priority: ["equal"] });
    expect(ids(p.primary)).toEqual(expect.arrayContaining(["sales", "ci"]));
    expect(ids(p.primary)).not.toContain("bc");
  });

  it("Kundservice + tekniker: Field Service lyfts som korsbehov", () => {
    const { p } = walk({ entry: ["problem"], problems: ["cases_email", "technicians"], priority: ["customer_service"] });
    expect(ids(p.primary)).toEqual(["cs"]);
    expect(ids(p.complementary)).toContain("fs");
  });

  it("Affärssystem med projekt: Project Operations kan lyftas", () => {
    const { p } = walk({ entry: ["needs"], needs_areas: ["erp"], [Q.ERP1]: ["finance", "projects"], [Q.ERP2]: ["basic"] });
    expect([...ids(p.complementary), ...ids(p.investigate)]).toContain("po");
  });

  it("AI blir aldrig en egen primär produkt", () => {
    const { p } = walk({ entry: ["needs"], needs_areas: ["customer_service"] });
    expect(ids(p.primary)).not.toContain("copilot");
    expect(p.aiNotes.length).toBeGreaterThan(0);
  });

  it("Tillägg visas bara när svaren motiverar det", () => {
    const plain = walk({ entry: ["needs"], needs_areas: ["sales"] }).p;
    expect(plain.addOn).toBeNull();
    const batch = walk({ entry: ["needs"], needs_areas: ["production"], [Q.ERP1]: ["production"], [Q.ERP4]: ["process_batch"] }).p;
    expect(batch.addOn?.areas).toContain("process- och batchproduktion");
  });

  it("Nästa steg varierar: jämförelse, fördjupning, plan", () => {
    const sales = walk({ entry: ["needs"], needs_areas: ["sales"] }).p;
    expect(sales.nextStep.kind).toBe("deepen_product");
    const many = walk({ entry: ["needs"], needs_areas: ["sales", "customer_service", "field_service"], priority: ["equal"] }).p;
    expect(many.nextStep.kind).toBe("plan");
    const unsure = walk({ entry: ["needs"], needs_areas: ["erp"], [Q.ERP1]: ["unknown"] }).p;
    expect(unsure.nextStep.kind).toBe("deepen_analysis");
  });

  it("Ändrat svar räknar om lösningsbilden", () => {
    const a = walk({ entry: ["needs"], needs_areas: ["sales"] });
    expect(ids(a.p.primary)).toEqual(["sales"]);
    const changed = deriveState(answer(a.i, "needs_areas", ["customer_service"]));
    const p2 = buildSolutionPicture(changed, undefined);
    expect(ids(p2.primary)).toEqual(["cs"]);
  });

  it("Språket undviker tvärsäkra formuleringar", () => {
    const { p } = walk({ entry: ["needs"], needs_areas: ["erp", "sales"], priority: ["equal"], [Q.ERP1]: ["finance"], [Q.ERP2]: ["basic"] });
    const text = JSON.stringify(p);
    expect(text).not.toMatch(/rätt system för er|Ni behöver|perfekta|definitivt/);
  });
});
