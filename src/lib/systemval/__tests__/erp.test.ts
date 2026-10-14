import { describe, it, expect } from "vitest";
import { answer, deriveState, emptyInput, type DialogInput } from "../engine";
import { Q, type ErpResult } from "../modules/erp";

type Step = [string, string[]];
/** Svarar på exakt de frågor motorn ställer, i ordning. Misslyckas om motorn frågar något oväntat. */
function walk(script: Record<string, string[]>): { s: ReturnType<typeof deriveState>; erp: ErpResult; asked: string[] } {
  let i: DialogInput = emptyInput();
  const asked: string[] = [];
  for (let n = 0; n < 15; n++) {
    const next = deriveState(i).nextQuestionId;
    if (!next) break;
    if (!(next in script)) throw new Error(`Oväntad fråga ${next} efter [${asked.join(", ")}]`);
    asked.push(next);
    i = answer(i, next, script[next]);
  }
  const s = deriveState(i);
  return { s, erp: s.moduleResults.erp as ErpResult, asked };
}
const report: string[] = [];
const log = (name: string, r: ReturnType<typeof walk>) =>
  report.push(`${name}: ${r.erp.preliminaryOutcome}${r.erp.fscmDriver ? `/${r.erp.fscmDriver}` : ""} (${r.erp.clarity}), ${r.s.currentPathQuestionCount} frågor: ${r.s.path.join(" > ")}`);

const needs = (...n: string[]): Record<string, string[]> => ({ entry: ["needs"], needs_areas: n, priority: ["equal"] });

describe("ERP-modulen (Sprint 2)", () => {
  it("T1 sammanhållet ERP-behov ger BC utan lager/produktionsfrågor", () => {
    const r = walk({ ...needs("erp"), [Q.ERP1]: ["finance", "purchasing", "sales_orders"], [Q.ERP2]: ["basic"], change_intent: ["introduce"] });
    log("T1", r);
    expect(r.erp.preliminaryOutcome).toBe("bc");
    expect(r.asked).not.toContain(Q.ERP3);
    expect(r.asked).not.toContain(Q.ERP4);
  });

  it("T2 avancerad ekonomistyrning ger F&SCM drivet av Finance", () => {
    const r = walk({ ...needs("erp"), [Q.ERP1]: ["finance", "multi_company"], [Q.ERP2]: ["multi_different", "adv_control", "intercompany"], change_intent: ["replace"], [Q.ERP6]: ["other"] });
    log("T2", r);
    expect(r.erp.preliminaryOutcome).toBe("fscm");
    expect(r.erp.fscmDriver).toBe("finance");
  });

  it("T3 avancerad produktion ger F&SCM drivet av SCM", () => {
    const r = walk({ ...needs("production"), [Q.ERP1]: ["production"], [Q.ERP4]: ["multi_site", "adv_planning", "capacity"], change_intent: ["introduce"] });
    log("T3", r);
    expect(r.erp.preliminaryOutcome).toBe("fscm");
    expect(r.erp.fscmDriver).toBe("scm");
    expect(r.asked).not.toContain(Q.ERP2);
  });

  it("T4 avancerad ekonomi och operationer ger båda drivkrafterna", () => {
    const r = walk({ ...needs("erp", "production", "supply_chain"), [Q.ERP1]: ["finance", "production", "logistics"], [Q.ERP2]: ["adv_control", "intercompany"], [Q.ERP4]: ["adv_planning", "combination"], [Q.ERP3]: ["complex_flows", "transport"], change_intent: ["consolidate"], [Q.ERP6]: ["several"] });
    log("T4", r);
    expect(r.erp.preliminaryOutcome).toBe("fscm");
    expect(r.erp.fscmDriver).toBe("both");
  });

  it("T5 flera länder med enhetliga processer ger inte automatiskt F&SCM", () => {
    const r = walk({ ...needs("erp"), [Q.ERP1]: ["finance", "sales_orders", "multi_company"], [Q.ERP2]: ["basic", "multi_country"], [Q.ERP5]: ["intl_uniform"], change_intent: ["replace"], [Q.ERP6]: ["other"] });
    log("T5", r);
    expect(r.asked).toContain(Q.ERP5);
    expect(r.erp.preliminaryOutcome).not.toBe("fscm");
  });

  it("T6 enklare produktion utlöser inte SCM", () => {
    const r = walk({ ...needs("production"), [Q.ERP1]: ["finance", "production", "warehouse"], [Q.ERP2]: ["basic"], [Q.ERP4]: ["simple"], [Q.ERP3]: ["simple"], change_intent: ["introduce"] });
    log("T6", r);
    expect(r.erp.scmSignals).toEqual([]);
    expect(r.erp.preliminaryOutcome).toBe("bc");
  });

  it("T7 spårbarhet ensam avgör inte SCM, skiljefråga visas", () => {
    const r = walk({ ...needs("supply_chain"), [Q.ERP1]: ["warehouse", "purchasing"], [Q.ERP3]: ["simple", "traceability"], [Q.ERP8]: ["warehouse_basic"], change_intent: ["introduce"] });
    log("T7", r);
    expect(r.asked).toContain(Q.ERP8);
    expect(r.erp.preliminaryOutcome).toBe("bc");
  });

  it("T8 verkligt gränsfall: BC och F&SCM jämförs, ingen vinnare", () => {
    const r = walk({ ...needs("erp", "production", "supply_chain"), [Q.ERP1]: ["finance", "warehouse", "production", "multi_company"], [Q.ERP2]: ["multi_similar"], [Q.ERP4]: ["discrete"], [Q.ERP3]: ["multi_warehouse"], [Q.ERP8]: ["production_unknown"], change_intent: ["introduce"] });
    log("T8", r);
    expect(r.erp.preliminaryOutcome).toBe("compare");
    expect(r.erp.clarity).toBe("multiple");
    expect(r.erp.openQuestions.length).toBeGreaterThan(0);
  });

  it("T9 NAV-kund ger inte automatiskt BC", () => {
    const r = walk({ ...needs("erp"), [Q.ERP1]: ["finance", "multi_company"], [Q.ERP2]: ["multi_different", "intercompany"], change_intent: ["replace"], [Q.ERP6]: ["nav"] });
    log("T9", r);
    expect(r.erp.preliminaryOutcome).toBe("fscm");
  });

  it("T10 AX-kund ger inte automatiskt F&SCM", () => {
    const r = walk({ ...needs("erp"), [Q.ERP1]: ["finance", "purchasing"], [Q.ERP2]: ["basic"], change_intent: ["replace"], [Q.ERP6]: ["ax"] });
    log("T10", r);
    expect(r.erp.preliminaryOutcome).toBe("bc");
  });

  it("T11 befintlig BC-kund som vill förbättra registrerar utredningspunkt", () => {
    const r = walk({ ...needs("erp"), [Q.ERP1]: ["finance"], [Q.ERP2]: ["basic"], change_intent: ["improve"], [Q.ERP6]: ["bc"] });
    log("T11", r);
    expect(r.erp.existingSolutionInvestigation).toBe(true);
    expect(r.erp.activatedRules).toContain("EXISTING_SOLUTION_FIRST");
  });

  it("T12 snabbspår BC: valideringsfrågor, bedömning kan skilja sig", () => {
    const r = walk({ entry: ["product"], product_start: ["bc"], [Q.ERP1]: ["finance", "multi_company"], [Q.ERP2]: ["multi_different", "adv_control"], change_intent: ["replace"], [Q.ERP6]: ["other"] });
    log("T12", r);
    expect(r.asked).not.toContain("needs_areas");
    expect(r.erp.selectedProductStartingPoint).toBe("bc");
    expect(r.erp.preliminaryOutcome).toBe("fscm");
  });

  it("T13 snabbspår F&SCM bekräftas inte bara för att kunden valde det", () => {
    const r = walk({ entry: ["product"], product_start: ["fscm"], [Q.ERP1]: ["finance", "warehouse"], [Q.ERP2]: ["basic"], [Q.ERP3]: ["simple"], change_intent: ["introduce"], [Q.ERP6]: ["excel"] });
    log("T13", r);
    expect(r.asked).toContain(Q.ERP2);
    expect(r.erp.preliminaryOutcome).toBe("bc");
  });

  it("T14 Project Operations-signal registreras separat", () => {
    const r = walk({ ...needs("erp"), [Q.ERP1]: ["finance", "projects"], [Q.ERP2]: ["basic"], [Q.ERP8]: ["project_advanced"], change_intent: ["introduce"], PO2_PROCESS: ["staffing", "delivery"] });
    log("T14", r);
    expect(r.erp.projectOperationsSignal).toBe(true);
    // Sprint 5: brett projektbehov aktiverar Project Operations-modulen, ERP-modulen är oförändrad.
    expect(r.s.activeModules).toEqual(["erp", "projects"]);
  });

  it("T14b enkel projektekonomi ger ingen Project Operations-signal", () => {
    const r = walk({ ...needs("erp"), [Q.ERP1]: ["finance", "projects"], [Q.ERP2]: ["basic"], [Q.ERP8]: ["project_basic"], change_intent: ["introduce"] });
    expect(r.erp.projectOperationsSignal).toBe(false);
  });

  it("T15 många Vet inte ger begränsat underlag", () => {
    const r = walk({ ...needs("erp"), [Q.ERP1]: ["unknown"], [Q.ERP2]: ["unknown"], [Q.ERP8]: ["finance_unknown"], change_intent: ["unknown"] });
    log("T15", r);
    expect(r.erp.preliminaryOutcome).toBe("limited");
    expect(r.erp.openQuestions.length).toBeGreaterThan(0);
  });

  it("T16 ändrat produktionssvar tar bort SCM-signaler", () => {
    let i = emptyInput();
    const steps: Step[] = [["entry", ["needs"]], ["needs_areas", ["erp", "production"]], ["priority", ["equal"]], [Q.ERP1, ["finance", "production"]], [Q.ERP2, ["basic"]], [Q.ERP4, ["adv_planning", "multi_site"]]];
    for (const [q, v] of steps) i = answer(i, q, v);
    expect((deriveState(i).moduleResults.erp as ErpResult).preliminaryOutcome).toBe("fscm");
    i = answer(i, Q.ERP1, ["finance"]);
    const s = deriveState(i);
    const erp = s.moduleResults.erp as ErpResult;
    expect(s.inactiveAnswers[Q.ERP4]).toBeDefined();
    expect(erp.scmSignals).toEqual([]);
    expect(erp.preliminaryOutcome).toBe("bc");
    expect(s.currentPathQuestionCount).toBe(4);
  });

  it("T17 ingen väg passerar 10 frågor", () => {
    const r = walk({
      entry: ["problem"], problems: ["closing", "inventory", "production_manual", "project_margin"], priority: ["equal"],
      [Q.ERP1]: ["finance", "warehouse", "production", "projects", "multi_company"], [Q.ERP2]: ["multi_country", "dimensions"],
      [Q.ERP4]: ["discrete"], [Q.ERP3]: ["multi_warehouse"], [Q.ERP5]: ["unknown"], [Q.ERP8]: ["finance_unknown"],
      change_intent: ["replace"], [Q.ERP6]: ["several"], PO1_PROJEKTTYP: ["consulting"],
    });
    log("T17", r);
    expect(r.s.currentPathQuestionCount).toBeLessThanOrEqual(10);
    expect(r.erp.uncertainties.length).toBeGreaterThan(0);
  });

  it("aktiveras från behov, produkt och problem; inte för enbart Sales", () => {
    expect(deriveState(answer(answer(emptyInput(), "entry", ["needs"]), "needs_areas", ["sales"])).activeModules).toEqual([]);
    expect(deriveState(answer(answer(emptyInput(), "entry", ["problem"]), "problems", ["duplicate_entry"])).nextQuestionId).toBe(Q.ERP1);
    expect(deriveState(answer(answer(emptyInput(), "entry", ["product"]), "product_start", ["fscm"])).nextQuestionId).toBe(Q.ERP1);
  });

  it("rapport", () => { console.log("\n" + report.join("\n")); expect(report.length).toBeGreaterThan(10); });
});
