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
  REPORT.push({ test: name, path: r.s.path, q: r.s.currentPathQuestionCount, start: d.finalPrimaryTracks, alt: d.finalAlternativeTracks, comp: d.finalComplementaryTracks,
    later: d.finalLaterPhaseTracks, deps: [...(d.finalIntegrationDependencies as string[]), ...(d.finalProcessDependencies as string[])], open: r.res.unresolvedQuestions.length,
    clarity: d.finalClarity, cta: d.selectedPrimaryCTA, dest: d.destinationId, verified: d.destinationVerified, sec: d.secondaryCTAs, transfer: (d.transferredStateFields as string[]).length > 0 });
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


const REPORT: Record<string, unknown>[] = [];
const P = (...ids: string[]) => ({ entry: ["problem"], problems: ids });
const PR = (id: string) => ({ entry: ["product"], product_start: [id] });
const pass = (r: ReturnType<typeof walk>) => { checkCtas(r.res); expect(r.s.currentPathQuestionCount).toBeLessThanOrEqual(10); };
const all = (r: ReturnType<typeof walk>) => [...tid(r), ...r.res.complementaryTracks.map((c) => c.id), ...(r.res.laterPhaseTracks as unknown as { id: string }[]).map((c) => c.id)];

describe("Sprint 7: 30 testpersonas", () => {
  it("1 mindre tjänsteföretag ERP", () => { const r = walk({ ...N("erp"), ...ERP_SIMPLE }, "01"); expect(tid(r)).toEqual(["bc"]); pass(r); });
  it("2 internationellt, enkla processer", () => { const r = walk({ ...N("erp"), [Q.ERP1]: ["finance", "sales_orders", "multi_company"], [Q.ERP2]: ["multi_similar"], [Q.ERP5]: ["intl_uniform"], change_intent: ["replace"] }, "02"); expect(tid(r)).not.toContain("fscm"); pass(r); });
  it("3 komplex tillverkning", () => { const r = walk({ ...N("erp", "production"), priority: ["equal"], [Q.ERP1]: ["finance", "production", "warehouse"], [Q.ERP4]: ["process_batch", "adv_planning", "multi_site", "quality"], [Q.ERP3]: ["traceability", "complex_flows"], change_intent: ["replace"] }, "03"); expect(JSON.stringify(r.res.primaryTracks) + JSON.stringify(r.res.alternativeTracks)).toMatch(/Supply Chain|scm|fscm/); pass(r); });
  it("4 NAV-kund", () => { const r = walk({ ...N("erp"), ...ERP_SIMPLE, [Q.ERP6]: ["nav"] }, "04"); expect(tid(r)).toEqual(["bc"]); pass(r); });
  it("5 AX-kund med enkla krav", () => { const r = walk({ ...N("erp"), ...ERP_SIMPLE, [Q.ERP6]: ["ax"] }, "05"); expect(tid(r)).not.toContain("fscm"); pass(r); });
  it("6 tror F&SCM, enkla krav", () => { const r = walk({ ...PR("fscm"), ...ERP_SIMPLE }, "06"); expect(r.res.selectedStartingPoint).toBeTruthy(); pass(r); });
  it("7 tror BC, avancerade krav", () => { const r = walk({ ...PR("bc"), ...FSCM }, "07"); expect(tid(r)).not.toEqual(["bc"]); pass(r); });
  it("8 ren Sales", () => { const r = walk(N("sales"), "08"); expect(tid(r)).toEqual(["sales"]); pass(r); });
  it("9 Sales + ERP-databehov", () => { const r = walk({ ...N("sales"), change_intent: ["integrate"] }, "09"); expect(all(r)).not.toContain("bc"); expect(all(r)).not.toContain("fscm"); pass(r); });
  it("10 Sales + CI", () => { const r = walk({ ...N("sales", "marketing"), priority: ["equal"] }, "10"); expect(tid(r).sort()).toEqual(["ci", "sales"]); pass(r); });
  it("11 marknad utan CRM", () => { const r = walk(N("marketing"), "11"); expect(all(r)).not.toContain("sales"); pass(r); });
  it("12 ren Customer Service", () => { const r = walk({ ...N("customer_service"), [SQ.SV1]: ["cases", "sla"], [SQ.CS1]: ["overview", "sla"] }, "12"); expect(tid(r)).toEqual(["cs"]); pass(r); });
  it("13 CC med befintligt CRM", () => { const r = walk({ ...N("contact_center"), [SQ.SV1]: ["queues", "multichannel"], [SQ.CC1]: ["phone", "chat", "email"], [SQ.CC2]: ["queues", "crm_integration"], [SQ.NOW]: ["other_crm"] }, "13"); expect(tid(r)).toContain("cc"); expect(all(r)).not.toContain("cs"); pass(r); });
  it("14 CS + CC", () => { const r = walk({ ...N("customer_service", "contact_center"), priority: ["customer_service"], [SQ.SV1]: ["cases", "queues"], [SQ.CS1]: ["overview"], [SQ.CC1]: ["phone", "chat"], [SQ.CC2]: ["queues"] }, "14"); expect(all(r)).toEqual(expect.arrayContaining(["cs", "cc"])); pass(r); });
  it("15 ren Field Service", () => { const r = walk({ ...N("field_service"), [SQ.SV1]: ["field_plan"], [SQ.FS1]: ["workorders", "preventive"], [SQ.FS2]: ["match", "replan"] }, "15"); expect(tid(r)).toEqual(["fs"]); pass(r); });
  it("16 FS med annat ERP", () => { const r = walk({ ...N("field_service"), [SQ.SV1]: ["field_plan"], [SQ.FS1]: ["workorders"], [SQ.FS2]: ["replan"], [SQ.FSDATA]: ["erp_other"] }, "16"); expect(all(r)).not.toContain("bc"); expect(all(r)).not.toContain("fscm"); pass(r); });
  it("17 CS + FS", () => { const r = walk({ ...N("customer_service", "field_service"), priority: ["customer_service"], ...SVC_CS_FS }, "17"); expect(all(r)).toEqual(expect.arrayContaining(["cs", "fs"])); pass(r); });
  it("18 projektintensivt konsultbolag", () => { const r = walk({ ...N("projects"), ...PO_BROAD }, "18"); expect(tid(r)).toEqual(["po"]); pass(r); });
  it("19 ERP + enkel projektekonomi", () => { const r = walk({ ...N("erp", "projects"), priority: ["erp"], ...ERP_SIMPLE, [Q.ERP1]: ["finance", "projects"], [PQ.TYPE]: ["finance_follow"], [PQ.SCOPE]: ["billing"] }, "19"); expect(all(r)).not.toContain("po"); pass(r); });
  it("20 ERP + bred projektlivscykel", () => { const r = walk({ ...N("erp", "projects"), priority: ["erp"], ...ERP_SIMPLE, [Q.ERP1]: ["finance", "projects"], ...PO_BROAD }, "20"); expect(all(r)).toContain("po"); pass(r); });
  it("21 Sales + PO", () => { const r = walk({ ...N("sales", "projects"), priority: ["equal"], ...PO_BROAD, [PQ.SALES]: ["won_to_project"] }, "21"); expect(all(r)).toEqual(expect.arrayContaining(["sales", "po"])); pass(r); });
  it("22 ERP + Sales", () => { const r = walk({ ...N("erp", "sales"), priority: ["erp"], ...ERP_SIMPLE }, "22"); expect(tid(r)).toEqual(["bc"]); expect(r.res.complementaryTracks.map((c) => c.id)).toContain("sales"); pass(r); });
  it("23 ERP + Sales + FS", () => { const r = walk({ ...N("erp", "sales", "field_service"), priority: ["erp"], ...ERP_SIMPLE, [SQ.SV1]: ["field_plan"], [SQ.FS1]: ["workorders"], [SQ.FS2]: ["replan"] }, "23"); expect(tid(r)).toEqual(["bc"]); pass(r); });
  it("24 flera lika prioriterade", () => { const r = walk({ ...N("sales", "customer_service"), priority: ["equal"], [SQ.SV1]: ["cases"], [SQ.CS1]: ["overview"] }, "24"); expect(tid(r).length).toBeGreaterThanOrEqual(2); pass(r); });
  it("25 mycket osäker köpare", () => { const r = walk({ ...N("erp") }, "25"); expect(r.res.clarity).toBe("limited"); expect(r.res.primaryCTA.kind).not.toBe("partners"); pass(r); });
  it("26 snabbspår bekräftas", () => { const r = walk({ ...PR("bc"), ...ERP_SIMPLE }, "26"); expect(tid(r)).toEqual(["bc"]); pass(r); });
  it("27 snabbspår utmanas", () => { const r = walk({ ...PR("fscm"), ...ERP_SIMPLE }, "27"); expect(tid(r)).toEqual(["bc"]); expect(JSON.stringify(r.res)).toMatch(/utgångspunkt|valde/i); pass(r); });
  it("28 ändrar huvudbehov halvvägs", () => {
    let i = answer(answer(answer(emptyInput(), "entry", ["needs"]), "needs_areas", ["erp"]), Q.ERP1, ["finance"]);
    i = answer(i, "needs_areas", ["sales"]);
    const r = run(i); expect(r.s.moduleResults.erp).toBeUndefined(); expect(tid({ res: r.res })).not.toContain("bc");
  });
  it("29 ändrar avgörande komplexitetssvar", () => {
    const a = walk({ ...N("erp"), ...FSCM }, "29a");
    const i = answer(a.i, Q.ERP2, ["basic"]); const b = run(answer(i, Q.ERP1, ["finance", "sales_orders"]));
    expect(JSON.stringify(b.res.primaryTracks)).not.toEqual(JSON.stringify(a.res.primaryTracks));
  });
  it("30 partnerredo, tydligt spår", () => { const r = walk({ ...N("erp"), ...ERP_SIMPLE, change_intent: ["replace"] }, "30"); expect(["partners", "deepen_product"]).toContain(r.res.primaryCTA.kind); pass(r); });
  it("ingångar ger konsistent resultat", () => {
    const a = walk({ ...N("erp"), ...ERP_SIMPLE }, "con-needs"); const b = walk({ ...P("closing", "duplicate_entry"), ...ERP_SIMPLE }, "con-problem");
    expect(tid(b)).toEqual(tid(a));
  });
  it("rapport", () => { for (const x of REPORT) console.log(JSON.stringify(x)); });
});
