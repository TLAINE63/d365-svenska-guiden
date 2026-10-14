import { describe, it, expect } from "vitest";
import { answer, contextFor, deriveState, emptyInput, getQuestion, resolveOptions, type DialogInput } from "../engine";
import { Q, type ErpResult } from "../modules/erp";
import { SQ } from "../modules/service";
import { PQ, type PoResult } from "../modules/projectOperations";
import { buildSolutionPicture } from "../solutions";
import { buildSolutionMap } from "../solutionMap";

function fallback(i: DialogInput, id: string): string[] {
  const opts = resolveOptions(getQuestion(id)!, contextFor(i, id)).map((o) => o.id);
  return [opts.find((o) => o === "unknown" || o.endsWith("_unknown")) ?? opts[opts.length - 1]];
}
function run(i: DialogInput) {
  const s = deriveState(i);
  const p = buildSolutionPicture(s, s.moduleResults.erp as ErpResult | undefined);
  const m = buildSolutionMap(s, p);
  const po = s.moduleResults.projects as PoResult | undefined;
  return { s, p, m, po };
}
function walk(script: Record<string, string[]>, name: string) {
  let i: DialogInput = emptyInput();
  for (let n = 0; n < 15; n++) {
    const next = deriveState(i).nextQuestionId;
    if (!next) break;
    i = answer(i, next, script[next] ?? fallback(i, next));
  }
  const r = run(i);
  const d = r.m.debug;
  // Dokumentation per testväg.
  console.log(JSON.stringify({ test: name, q: r.s.currentPathQuestionCount, modules: d.moduleOutcomes, cross: d.activatedCrossModuleRules,
    start: d.primaryTrack, alt: d.alternativeTracks, comp: d.complementaryTracks, later: d.laterPhaseTracks,
    deps: [...d.integrationDependencies, ...d.processDependencies], open: r.m.openQuestions.length, clarity: r.m.clarity }));
  return { ...r, i };
}
const ids = (xs: { id: string }[]) => xs.map((x) => x.id);
const ERP_SIMPLE = { [Q.ERP1]: ["finance", "sales_orders"], [Q.ERP2]: ["basic"], [Q.ERP5]: ["single"], change_intent: ["replace"], [Q.ERP6]: ["excel"] };
const N = (...areas: string[]) => ({ entry: ["needs"], needs_areas: areas });
const SVC_CS_FS = { [SQ.SV1]: ["cases", "field_plan"], [SQ.CS1]: ["overview"], [SQ.FS1]: ["workorders"], [SQ.HO]: ["case_to_wo"] };
const PO_BROAD = { [PQ.TYPE]: ["consulting", "time_expense"], [PQ.SCOPE]: ["sales_quote", "staffing", "time", "delivery", "billing"], [PQ.RES]: ["skills", "multi_project"], [PQ.NOW]: ["excel"] };

describe("Sprint 5: Project Operations och lösningskarta", () => {
  it("1. ERP + Sales: ERP huvudspår, Sales komplement med integration", () => {
    const { m } = walk({ ...N("erp", "sales"), priority: ["erp"], ...ERP_SIMPLE }, "1");
    expect(ids(m.start)).toEqual(["bc"]);
    expect(ids(m.complements)).toContain("sales");
    expect(m.dependencies.map((d) => d.key)).toContain("erp_sales");
    expect(m.alternatives).toEqual([]);
  });

  it("2. Sales + Customer Insights: två separata behov", () => {
    const { m } = walk({ ...N("sales", "marketing"), priority: ["equal"] }, "2");
    expect(ids(m.start)).toEqual(expect.arrayContaining(["sales", "ci"]));
    expect(m.dependencies.map((d) => d.key)).toContain("sales_ci");
  });

  it("3. Sales utan marknadsbehov: Customer Insights läggs inte till", () => {
    const { m } = walk({ ...N("sales") }, "3");
    expect([...ids(m.start), ...ids(m.complements), ...ids(m.later)]).not.toContain("ci");
  });

  it("4. Customer Service + Field Service: ärende → arbetsorder", () => {
    const { m } = walk({ entry: ["problem"], problems: ["cases_email", "technicians"], priority: ["customer_service"], ...SVC_CS_FS }, "4");
    expect(ids(m.start)).toEqual(["cs"]);
    expect(ids(m.complements)).toContain("fs");
    expect(m.dependencies.find((d) => d.key === "cs_fs")?.kind).toBe("process");
  });

  it("5. Contact Center med befintligt CRM kan behållas", () => {
    const { m } = walk({ ...N("contact_center"), [SQ.SV1]: ["queues", "multichannel"], [SQ.CC1]: ["phone", "chat"], [SQ.CC2]: ["queues", "omni"], [SQ.NOW]: ["other_crm"] }, "5");
    expect(ids(m.start)).toEqual(["cc"]);
    expect(m.dependencies.map((d) => d.key)).toContain("cc_crm");
  });

  it("6. ERP + Field Service: reservdelar och fakturering som beroenden", () => {
    const { m } = walk({ ...N("erp", "field_service"), priority: ["erp"], ...ERP_SIMPLE, [SQ.SV1]: ["field_plan"], [SQ.FS1]: ["workorders", "parts"], [SQ.FSDATA]: ["erp_other"] }, "6");
    expect(ids(m.start)).toEqual(["bc"]);
    expect(ids(m.complements)).toContain("fs");
    expect(m.dependencies.find((d) => d.key === "erp_fs")?.kind).toBe("integration");
  });

  it("7. ERP + enklare projektekonomi: ingen automatisk Project Operations", () => {
    const { m, po } = walk({ ...N("erp", "projects"), priority: ["erp"], ...ERP_SIMPLE, [PQ.TYPE]: ["finance_follow"], [PQ.SCOPE]: ["time", "billing"] }, "7");
    expect(po?.preliminaryOutcome).toBe("erp_scope");
    expect([...ids(m.start), ...ids(m.complements), ...ids(m.later)]).not.toContain("po");
  });

  it("8. ERP + bred projektlivscykel: Project Operations komplement", () => {
    const { m, po } = walk({ ...N("erp", "projects"), priority: ["erp"], ...ERP_SIMPLE, ...PO_BROAD }, "8");
    expect(po?.preliminaryOutcome).toBe("po");
    expect(ids(m.start)).toEqual(["bc"]);
    expect(ids(m.complements)).toContain("po");
    expect(m.dependencies.find((d) => d.key === "erp_po")?.kind).toBe("system_boundary");
  });

  it("9. Sales + Project Operations: vunnen affär → projekt", () => {
    const { m, po } = walk({ ...N("sales", "projects"), priority: ["equal"], ...PO_BROAD, [PQ.SALES]: ["won_to_project"] }, "9");
    expect(po?.projectSalesDependency).toBe(true);
    expect(ids(m.start)).toEqual(expect.arrayContaining(["sales", "po"]));
    expect(m.dependencies.find((d) => d.key === "sales_po")?.kind).toBe("process");
  });

  it("10. Project Operations som huvudspår vid projektintensiv tjänsteverksamhet", () => {
    const { m } = walk({ ...N("projects"), ...PO_BROAD }, "10");
    expect(ids(m.start)).toEqual(["po"]);
    expect(m.clarity).toBe("clear");
  });

  it("11. Interna projekt ger ingen Project Operations-rekommendation", () => {
    const { m, po, s } = walk({ ...N("projects"), [PQ.TYPE]: ["internal"] }, "11");
    expect(po?.preliminaryOutcome).toBe("none");
    expect(s.path).not.toContain(PQ.SCOPE);
    expect([...ids(m.start), ...ids(m.complements)]).not.toContain("po");
  });

  it("12. Befintligt projektverktyg kan behållas och integreras", () => {
    const { m, po } = walk({ ...N("projects"), ...PO_BROAD, [PQ.NOW]: ["separate_tool"] }, "12");
    expect(po?.keepExistingTool).toBe(true);
    expect(m.dependencies.map((d) => d.key)).toContain("po_keep");
  });

  it("13. ERP + Sales + Field Service: huvudspår, komplement och beroenden", () => {
    const { m } = walk({ ...N("erp", "sales", "field_service"), priority: ["erp"], ...ERP_SIMPLE, [SQ.SV1]: ["field_plan"], [SQ.FS1]: ["workorders", "parts"] }, "13");
    expect(ids(m.start)).toEqual(["bc"]);
    expect(ids(m.complements)).toEqual(expect.arrayContaining(["sales", "fs"]));
    expect(m.dependencies.map((d) => d.key)).toEqual(expect.arrayContaining(["erp_sales", "erp_fs"]));
  });

  it("14. Flera lika prioriterade områden ger parallella huvudspår", () => {
    const { m } = walk({ ...N("customer_service", "contact_center", "field_service"), priority: ["equal"],
      [SQ.SV1]: ["cases", "queues", "field_plan"], [SQ.CS1]: ["overview"], [SQ.CC1]: ["phone", "chat"], [SQ.CC2]: ["queues"], [SQ.FS1]: ["workorders"], [SQ.HO]: ["case_to_wo"] }, "14");
    expect(ids(m.start)).toEqual(expect.arrayContaining(["cs", "cc", "fs"]));
    expect(m.clarity).toBe("multiple");
  });

  it("15. Motstridiga modulsignaler redovisas som utredningspunkt", () => {
    const { m } = walk({ ...N("erp"), [Q.ERP1]: ["finance", "projects"], [Q.ERP2]: ["basic"], [Q.ERP8]: ["project_advanced"], change_intent: ["introduce"], [PQ.SCOPE]: ["time", "billing"] }, "15");
    expect(m.debug.detectedConflicts.length).toBeGreaterThan(0);
    expect(m.openQuestions.some((q) => q.includes("Utred om projektbehovet"))).toBe(true);
  });

  it("16. Dubbla signaler från flera moduler visas en gång", () => {
    const { m } = walk({ ...N("erp", "field_service"), priority: ["erp"], ...ERP_SIMPLE, [SQ.SV1]: ["field_plan"], [SQ.FS1]: ["workorders", "parts"], [SQ.FSDATA]: ["erp_other"] }, "16");
    expect(m.dependencies.filter((d) => d.key === "erp_fs")).toHaveLength(1);
    expect(m.debug.detectedDuplicates.length).toBeGreaterThan(0);
    const all = [...ids(m.start), ...ids(m.complements), ...ids(m.later)];
    expect(new Set(all).size).toBe(all.length);
  });

  it("17. Många Vet inte ger begränsat underlag utan gissning", () => {
    const { m, po } = walk({ ...N("projects"), [PQ.TYPE]: ["unknown"] }, "17");
    expect(po?.preliminaryOutcome).toBe("limited");
    expect(m.clarity).toBe("limited");
    expect(ids(m.start)).not.toContain("po");
  });

  it("18. Ändrat projektbehov räknar om signal och karta", () => {
    let { i, m } = walk({ ...N("projects"), ...PO_BROAD }, "18a");
    expect(ids(m.start)).toEqual(["po"]);
    i = answer(i, PQ.SCOPE, ["time", "billing"]);
    const r = run(i);
    expect(r.po?.preliminaryOutcome).not.toBe("po");
    expect(ids(r.m.start)).not.toContain("po");
    expect(r.s.inactiveAnswers[PQ.RES]).toBeDefined();
  });

  it("19. Ändrad prioritering uppdaterar huvudspår och etapp", () => {
    const script = { ...N("customer_service", "projects"), priority: ["customer_service"], [SQ.SV1]: ["cases", "sla"], [SQ.CS1]: ["overview"], ...PO_BROAD };
    let { i, m } = walk(script, "19a");
    expect(ids(m.start)).toEqual(["cs"]);
    expect(ids(m.later)).toContain("po");
    expect(m.phasing).not.toBeNull();
    i = answer(i, "priority", ["projects"]);
    const r = run(i);
    expect(ids(r.m.start)).toEqual(["po"]);
    expect(ids(r.m.later)).toContain("cs");
  });

  it("20. Frågebudget nära max: aldrig fler än 10 frågor", () => {
    const { s } = walk({ entry: ["problem"], problems: ["closing", "inventory", "project_margin", "pipeline"], priority: ["equal"],
      [Q.ERP1]: ["finance", "warehouse", "projects", "multi_company"], [Q.ERP2]: ["multi_country"], [Q.ERP3]: ["multi_warehouse"],
      ...PO_BROAD, [PQ.SALES]: ["won_to_project"] }, "20");
    expect(s.currentPathQuestionCount).toBeLessThanOrEqual(10);
  });

  it("samma svar ger samma lösningskarta", () => {
    const a = walk({ ...N("erp", "projects"), priority: ["erp"], ...ERP_SIMPLE, ...PO_BROAD }, "det-a").m;
    const b = walk({ ...N("erp", "projects"), priority: ["erp"], ...ERP_SIMPLE, ...PO_BROAD }, "det-b").m;
    expect(a).toEqual(b);
  });

  it("produktsnabbspår Project Operations kan utmanas av svaren", () => {
    const { m, s } = walk({ entry: ["product"], product_start: ["po"], [PQ.TYPE]: ["internal"] }, "prod");
    expect(s.activeModules).toContain("projects");
    expect(m.debug.detectedConflicts.some((c) => c.includes("utgångspunkt"))).toBe(true);
  });
});
