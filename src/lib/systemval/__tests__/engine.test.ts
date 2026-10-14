import { describe, it, expect } from "vitest";
import { answer, deriveState, emptyInput, toggleMulti, type DialogInput } from "../engine";
import { PROBLEM_OPTIONS, PRODUCTS, QUESTIONS, type NeedModule, type Question } from "../config";

const run = (...steps: [string, string[]][]): DialogInput =>
  steps.reduce((i, [q, v]) => answer(i, q, v), emptyInput());

describe("systemval dialog engine", () => {
  it("starts at entry", () => {
    expect(deriveState(emptyInput()).nextQuestionId).toBe("entry");
  });

  it("needs path: multi select then priority, keeps secondary needs", () => {
    const s = deriveState(run(["entry", ["needs"]], ["needs_areas", ["sales", "customer_service", "erp"]], ["priority", ["customer_service"]]));
    expect(s.needs).toEqual(["sales", "customer_service", "erp"]);
    expect(s.primaryNeed).toBe("customer_service");
    expect(s.secondaryNeeds).toEqual(["sales", "erp"]);
    expect(s.currentPathQuestionCount).toBe(2);
  });

  it("no priority question for a single need; equal keeps several main needs", () => {
    expect(deriveState(run(["entry", ["needs"]], ["needs_areas", ["sales"]])).path).not.toContain("priority");
    const s = deriveState(run(["entry", ["needs"]], ["needs_areas", ["sales", "erp"]], ["priority", ["equal"]]));
    expect(s.primaryNeed).toBeUndefined();
    expect(s.needs).toEqual(["sales", "erp"]);
  });

  it("product path stores starting point only, no needs and no recommendation", () => {
    const s = deriveState(run(["entry", ["product"]], ["product_start", ["fs"]]));
    expect(s.productStart).toBe("fs");
    expect(s.needs).toEqual([]);
    expect(s.result.mainTrack).toEqual([]);
  });

  it("product unsure falls back to needs model without restart", () => {
    const s = deriveState(run(["entry", ["product"]], ["product_start", ["unsure"]]));
    expect(s.nextQuestionId).toBe("needs_areas");
  });

  it("problem path maps problems to the same need areas", () => {
    const s = deriveState(run(["entry", ["problem"]], ["problems", ["pipeline", "cases_email", "technicians"]]));
    expect(s.needs).toEqual(["sales", "customer_service", "field_service"]);
    expect(s.nextQuestionId).toBe("priority");
  });

  it("change intent is configured but not shown unless requested", () => {
    const base = run(["entry", ["needs"]], ["needs_areas", ["erp"]]);
    expect(deriveState(base).path).not.toContain("change_intent");
    expect(deriveState(base).nextQuestionId).toBeNull();
    expect(deriveState({ ...base, debugRequestCommon: ["change_intent"] }).nextQuestionId).toBe("change_intent");
  });

  it("changed answers deactivate irrelevant ones and recount the path", () => {
    let i = run(["entry", ["needs"]], ["needs_areas", ["sales", "erp"]], ["priority", ["sales"]]);
    expect(deriveState(i).currentPathQuestionCount).toBe(2);
    i = answer(i, "needs_areas", ["customer_service"]);
    const s = deriveState(i);
    expect(s.inactiveAnswers.priority).toEqual(["sales"]);
    expect(s.primaryNeed).toBeUndefined();
    expect(s.currentPathQuestionCount).toBe(1);
    expect(s.interactionHistory.length).toBe(4);
  });

  it("switching entry deactivates the other entry's answers", () => {
    let i = run(["entry", ["product"]], ["product_start", ["sales"]]);
    i = answer(i, "entry", ["problem"]);
    const s = deriveState(i);
    expect(s.productStart).toBeUndefined();
    expect(s.inactiveAnswers.product_start).toEqual(["sales"]);
  });

  it("budget caps the current path at 10 questions", () => {
    const qs: Question[] = Array.from({ length: 15 }, (_, n) => ({
      id: `m${n}`, module: "erp", text: "x", type: "single", options: [{ id: "a", label: "a" }],
      showIf: () => true, priority: 100 + n, affects: [], countsTowardBudget: true,
    }));
    const mod: NeedModule = { id: "test", activeIf: (c) => c.needs.includes("erp"), questions: qs };
    let i = run(["entry", ["needs"]], ["needs_areas", ["erp"]]);
    for (const q of qs) i = answer(i, q.id, ["a"]);
    const s = deriveState(i, [mod]);
    expect(s.currentPathQuestionCount).toBe(10);
    expect(s.budgetReached).toBe(true);
  });

  it("exclusive options in multi select", () => {
    const opts = PROBLEM_OPTIONS;
    expect(toggleMulti(["pipeline"], opts.find((o) => o.id === "unsure")!, opts)).toEqual(["unsure"]);
    expect(toggleMulti(["unsure"], opts[0], opts)).toEqual([opts[0].id]);
  });

  it("product universe is limited and contains no AI questions", () => {
    expect(PRODUCTS.map((p) => p.label)).toEqual([
      "Business Central", "Finance & Supply Chain Management", "Sales", "Customer Insights",
      "Customer Service", "Contact Center", "Field Service", "Project Operations",
    ]);
    expect(QUESTIONS.some((q) => /AI|Copilot|agent/i.test(q.text))).toBe(false);
  });
});
