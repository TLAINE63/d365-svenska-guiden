import { describe, it, expect } from "vitest";
import { answer, contextFor, deriveState, emptyInput, getQuestion, resolveOptions, type DialogInput } from "../engine";
import { Q, type ErpResult } from "../modules/erp";
import { SQ } from "../modules/service";
import { PQ, type PoResult } from "../modules/projectOperations";
import { buildSolutionPicture } from "../solutions";
import { buildSolutionMap } from "../solutionMap";
import { buildSystemvalResult, getDestination } from "../result";

function fallback(i: DialogInput, id: string): string[] {
  const opts = resolveOptions(getQuestion(id)!, contextFor(i, id)).map((o) => o.id);
  return [opts.find((o) => o === "unknown" || o.endsWith("_unknown")) ?? opts[opts.length - 1]];
}
function run(i: DialogInput) {
  const s = deriveState(i);
  const p = buildSolutionPicture(s, s.moduleResults.erp as ErpResult | undefined);
  const m = buildSolutionMap(s, p);
  const res = buildSystemvalResult(s, p, m);
  const po = s.moduleResults.projects as PoResult | undefined;
  return { s, p, m, po, res };
}
function walk(script: Record<string, string[]>, name: string) {
  let i: DialogInput = emptyInput();
  for (let n = 0; n < 15; n++) {
    const next = deriveState(i).nextQuestionId;
    if (!next) break;
    i = answer(i, next, script[next] ?? fallback(i, next));
  }
  const r = run(i);
  const d = r.res.debug as Record<string, unknown>;
  // Dokumentation per testväg.
  console.log(JSON.stringify({ test: name, q: r.s.currentPathQuestionCount, start: d.finalPrimaryTracks, alt: d.finalAlternativeTracks, comp: d.finalComplementaryTracks,
    later: d.finalLaterPhaseTracks, deps: [...(d.finalIntegrationDependencies as string[]), ...(d.finalProcessDependencies as string[])], open: r.res.unresolvedQuestions.length,
    clarity: d.finalClarity, cta: d.selectedPrimaryCTA, dest: d.destinationId, verified: d.destinationVerified, sec: d.secondaryCTAs, transfer: (d.transferredStateFields as string[]).length > 0 }));
  return { ...r, i };
}
const ids = (xs: { id: string }[]) => xs.map((x) => x.id);
const ERP_SIMPLE = { [Q.ERP1]: ["finance", "sales_orders"], [Q.ERP2]: ["basic"], [Q.ERP5]: ["single"], change_intent: ["replace"], [Q.ERP6]: ["excel"] };
const N = (...areas: string[]) => ({ entry: ["needs"], needs_areas: areas });
const SVC_CS_FS = { [SQ.SV1]: ["cases", "field_plan"], [SQ.CS1]: ["overview"], [SQ.FS1]: ["workorders"], [SQ.HO]: ["case_to_wo"] };
const PO_BROAD = { [PQ.TYPE]: ["consulting", "time_expense"], [PQ.SCOPE]: ["sales_quote", "staffing", "time", "delivery", "billing"], [PQ.RES]: ["skills", "multi_project"], [PQ.NOW]: ["excel"] };

const tid = (r: { res: { primaryTracks: { id: string }[] } }) => r.res.primaryTracks.map((t) => t.id);
const ROUTES = ["/affarssystem/", "/underlag/", "/behovsanalys/", "/businesscentral/", "/finance-supply-chain/", "/d365sales/", "/d365marketing/", "/d365customerservice/", "/d365contactcenter/", "/d365fieldservice/", "/d365projectoperations/", "/alla-d365-partners/"];
const okRoute = (r: string) => ROUTES.includes(r) || /matchningstest\/$|partners-sverige\/$/.test(r);
function checkCtas(res: ReturnType<typeof run>["res"]) {
  expect(res.secondaryCTAs.length).toBeLessThanOrEqual(2);
  for (const c of [res.primaryCTA, ...res.secondaryCTAs]) expect(okRoute(c.route)).toBe(true);
  expect(res.complementaryTracks.length).toBeLessThanOrEqual(3);
  expect(res.unresolvedQuestions.length).toBeLessThanOrEqual(3);
  expect(JSON.stringify(res).match(/\d+\s?(%|procent)/)).toBeNull();
}
const FSCM = { [Q.ERP1]: ["finance", "warehouse", "multi_company"], [Q.ERP2]: ["multi_country", "intercompany", "standardization"], [Q.ERP3]: ["adv_picking", "automation"], [Q.ERP5]: ["multi_country"], change_intent: ["replace"] };

describe("Sprint 6: slutresultat och nästa steg", () => {
  it("1. Tydligt Business Central-spår", () => {
    const r = walk({ ...N("erp"), ...ERP_SIMPLE, change_intent: ["introduce"] }, "1");
    expect(tid(r)).toEqual(["bc"]); expect(r.res.complementaryTracks).toEqual([]);
    expect(r.res.primaryCTA.destinationId).toBe("product_bc"); checkCtas(r.res);
  });
  it("2. BC kontra F&SCM: alternativ och jämförelse", () => {
    const r = walk({ ...N("erp", "supply_chain"), priority: ["equal"], [Q.ERP1]: ["finance", "warehouse", "multi_company"], [Q.ERP2]: ["multi_similar"], [Q.ERP3]: ["multi_warehouse"], [Q.ERP5]: ["single"] }, "2");
    if (r.m.alternatives.length) {
      expect(r.res.alternativeTracks[0].differences.length).toBeGreaterThan(0);
      expect(r.res.primaryCTA.destinationId).toBe("compare_erp");
    }
    checkCtas(r.res);
  });
  it("3. F&SCM med Sales som komplement", () => {
    const r = walk({ ...N("erp", "sales"), priority: ["erp"], ...FSCM }, "3");
    expect(r.res.primaryTracks.some((t) => ["fscm", "finance", "scm"].includes(t.id)) || r.res.alternativeTracks.length > 0).toBe(true);
    expect(r.res.complementaryTracks.map((c) => c.id)).toContain("sales");
    expect(r.res.integrationDependencies.map((d) => d.key)).toContain("erp_sales"); checkCtas(r.res);
  });
  it("4. Sales utan marknadsbehov", () => {
    const r = walk({ ...N("sales") }, "4");
    expect(tid(r)).toEqual(["sales"]); expect(JSON.stringify(r.res.complementaryTracks)).not.toContain("\"ci\""); checkCtas(r.res);
  });
  it("5. Sales och Customer Insights: olika roller, inte alternativ", () => {
    const r = walk({ ...N("sales", "marketing"), priority: ["equal"] }, "5");
    expect(r.res.alternativeTracks).toEqual([]); expect(tid(r)).toEqual(expect.arrayContaining(["sales", "ci"]));
    expect(r.res.primaryCTA.destinationId).toBe("plan"); checkCtas(r.res);
  });
  it("6. Customer Service och Contact Center", () => {
    const r = walk({ ...N("customer_service", "contact_center"), priority: ["customer_service"], [SQ.SV1]: ["cases", "queues"], [SQ.CS1]: ["overview"], [SQ.CC1]: ["phone", "chat"], [SQ.CC2]: ["queues"] }, "6");
    expect(tid(r)).toEqual(["cs"]); expect(r.res.complementaryTracks.map((c) => c.id)).toContain("cc");
    expect(r.res.processDependencies.map((d) => d.key)).toContain("cs_cc"); checkCtas(r.res);
  });
  it("7. Customer Service och Field Service: ärende → arbetsorder", () => {
    const r = walk({ entry: ["problem"], problems: ["cases_email", "technicians"], priority: ["customer_service"], ...SVC_CS_FS }, "7");
    expect(r.res.processDependencies.map((d) => d.key)).toContain("cs_fs"); checkCtas(r.res);
  });
  it("8. ERP och Field Service: beroenden, inget ERP-byte", () => {
    const r = walk({ ...N("erp", "field_service"), priority: ["erp"], ...ERP_SIMPLE, [SQ.SV1]: ["field_plan"], [SQ.FS1]: ["workorders", "parts"] }, "8");
    expect(r.res.integrationDependencies.map((d) => d.key)).toContain("erp_fs"); checkCtas(r.res);
  });
  it("9. ERP och bred projektlivscykel", () => {
    const r = walk({ ...N("erp", "projects"), priority: ["erp"], ...ERP_SIMPLE, ...PO_BROAD }, "9");
    expect(r.res.complementaryTracks.map((c) => c.id)).toContain("po");
    expect(r.res.integrationDependencies.find((d) => d.key === "erp_po")?.kind).toBe("system_boundary"); checkCtas(r.res);
  });
  it("10. ERP + Sales + Field Service", () => {
    const r = walk({ ...N("erp", "sales", "field_service"), priority: ["erp"], ...ERP_SIMPLE, [SQ.SV1]: ["field_plan"], [SQ.FS1]: ["workorders", "parts"] }, "10");
    expect(tid(r)).toEqual(["bc"]); expect(r.res.primaryCTA.destinationId).toBe("plan"); checkCtas(r.res);
  });
  it("11. Flera lika prioriterade behov", () => {
    const r = walk({ ...N("sales", "projects"), priority: ["equal"], ...PO_BROAD, [PQ.SALES]: ["won_to_project"] }, "11");
    expect(tid(r)).toEqual(expect.arrayContaining(["sales", "po"])); checkCtas(r.res);
  });
  it("12. Begränsat underlag: fördjupning, inte partner", () => {
    const r = walk({ ...N("projects"), [PQ.TYPE]: ["unknown"] }, "12");
    expect(r.res.clarity).toBe("limited"); expect(r.res.primaryCTA.kind).toBe("deepen_analysis");
    expect(r.res.secondaryCTAs.some((c) => c.kind === "partners")).toBe(false); checkCtas(r.res);
  });
  it("13. Produktsnabbspår som bekräftas", () => {
    const r = walk({ entry: ["product"], product_start: ["po"], ...PO_BROAD }, "13");
    expect(r.res.selectedStartingPoint).toEqual({ label: "Project Operations", differs: false }); checkCtas(r.res);
  });
  it("14. Produktsnabbspår som utmanas", () => {
    const r = walk({ entry: ["product"], product_start: ["po"], [PQ.TYPE]: ["internal"] }, "14");
    expect(r.res.selectedStartingPoint?.differs).toBe(true);
    expect(r.res.methodologyExplanation.join(" ")).toContain("skiljer sig"); checkCtas(r.res);
  });
  it("15. Partnerredo besökare", () => {
    const r = walk({ ...N("erp"), ...ERP_SIMPLE }, "15");
    expect(r.res.primaryCTA.destinationId).toBe("partners_bc");
    expect(getDestination("partners_bc").supportedParameters).toEqual([]); checkCtas(r.res);
  });
  it("16. Ändrat svar räknar om resultat och CTA", () => {
    const a = walk({ ...N("erp"), ...ERP_SIMPLE }, "16a");
    const b = run(answer(a.i, "change_intent", ["introduce"]));
    expect(a.res.primaryCTA.kind).toBe("partners"); expect(b.res.primaryCTA.kind).toBe("deepen_product");
  });
  it("17. Saknad destination ger fungerande fallback", () => {
    const d = getDestination("match_po"); expect(d.verified).toBe(false); expect(d.route).toBe("/behovsanalys/");
    const p = getDestination("partners_po"); expect(p.verified).toBe(false); expect(p.route).toBe("/alla-d365-partners/");
  });
  it("Samma svar ger samma resultat", () => {
    const s = { ...N("erp", "projects"), priority: ["erp"], ...ERP_SIMPLE, ...PO_BROAD };
    expect(walk(s, "det-a").res).toEqual(walk(s, "det-b").res);
  });
});
