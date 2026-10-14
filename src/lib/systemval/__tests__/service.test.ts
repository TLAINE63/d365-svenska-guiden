import { describe, it, expect } from "vitest";
import { answer, deriveState, emptyInput, type DialogInput } from "../engine";
import { SQ, type SvcResult } from "../modules/service";
import type { ErpResult } from "../modules/erp";
import { buildSolutionPicture } from "../solutions";

function walk(script: Record<string, string[]>, start: DialogInput = emptyInput()) {
  let i = start;
  const asked: string[] = [];
  for (let n = 0; n < 15; n++) {
    const next = deriveState(i).nextQuestionId;
    if (!next) break;
    asked.push(next);
    i = answer(i, next, script[next] ?? ["unknown"]);
  }
  const s = deriveState(i);
  const svc = s.moduleResults.service as SvcResult;
  const p = buildSolutionPicture(s, s.moduleResults.erp as ErpResult | undefined);
  const log = { q: s.currentPathQuestionCount, rules: svc?.activatedRules, outcome: svc?.preliminaryOutcome, primary: p.primary.map((x) => x.id), comp: p.complementary.map((x) => x.id) };
  // Dokumentation av testväg: antal frågor, regler och utfall.
  console.log(JSON.stringify(log));
  return { s, i, svc, p, asked };
}
const ids = (xs: { id: string }[]) => xs.map((x) => x.id);
const N = (...areas: string[]) => ({ entry: ["needs"], needs_areas: areas });

describe("Service & kunddialog (Sprint 4)", () => {
  it("1. Rent Customer Service-behov", () => {
    const { svc, p } = walk({ ...N("customer_service"), [SQ.SV1]: ["cases", "sla"], [SQ.CS1]: ["overview", "knowledge"] });
    expect(svc.tracks).toEqual(["cs"]);
    expect(ids(p.primary)).toEqual(["cs"]);
    expect(ids(p.complementary)).not.toContain("cc");
  });

  it("2. Rent Contact Center-behov", () => {
    const { svc, p } = walk({ ...N("contact_center"), [SQ.SV1]: ["multichannel", "queues"], [SQ.CC1]: ["phone", "chat"], [SQ.CC2]: ["queues", "skills"], [SQ.NOW]: ["email_tools"] });
    expect(svc.tracks).toEqual(["cc"]);
    expect(ids(p.primary)).toEqual(["cc"]);
  });

  it("3. Rent Field Service-behov", () => {
    const { svc, p } = walk({ ...N("field_service"), [SQ.SV1]: ["field_plan"], [SQ.FS1]: ["workorders", "preventive"], [SQ.FS2]: ["match", "geo"] });
    expect(svc.tracks).toEqual(["fs"]);
    expect(ids(p.primary)).toEqual(["fs"]);
  });

  it("4. Customer Service + Contact Center", () => {
    const { svc, p } = walk({ ...N("customer_service", "contact_center"), priority: ["customer_service"], [SQ.SV1]: ["cases", "queues"], [SQ.CS1]: ["sla"], [SQ.CC1]: ["several"], [SQ.CC2]: ["queues"], [SQ.NOW]: ["several"] });
    expect(svc.tracks).toEqual(["cs", "cc"]);
    expect(ids(p.primary)).toEqual(["cs"]);
    expect(ids(p.complementary)).toContain("cc");
  });

  it("5. Customer Service + Field Service med överlämning", () => {
    const { svc, p } = walk({ ...N("customer_service", "field_service"), priority: ["customer_service"], [SQ.SV1]: ["cases", "field_plan"], [SQ.CS1]: ["overview"], [SQ.FS1]: ["workorders"], [SQ.FS2]: ["replan"], [SQ.HO]: ["case_to_wo"] });
    expect(svc.tracks).toEqual(["cs", "fs"]);
    expect(svc.combinationSignals.length).toBe(1);
    expect(ids(p.complementary)).toContain("fs");
  });

  it("6. Alla tre endast med tre separata behov", () => {
    const { svc } = walk({ ...N("customer_service", "contact_center", "field_service"), priority: ["equal"],
      [SQ.SV1]: ["cases", "queues", "field_plan"], [SQ.CS1]: ["sla"], [SQ.CC1]: ["several"], [SQ.CC2]: ["omni"], [SQ.FS1]: ["workorders"], [SQ.HO]: ["cs_sees_status"] });
    expect([...svc.tracks].sort()).toEqual(["cc", "cs", "fs"]);
  });

  it("7. Telefoni utan contact center-behov ger inte Contact Center", () => {
    const { svc } = walk({ ...N("customer_service"), [SQ.SV1]: ["phone"], [SQ.CC1]: ["phone"], [SQ.CC2]: ["unknown"] });
    expect(svc.tracks).not.toContain("cc");
    expect(svc.investigateTracks).toContain("cc");
  });

  it("8. E-post ensamt ger inte Customer Service", () => {
    const { svc } = walk({ entry: ["problem"], problems: ["channels"], [SQ.SV1]: ["multichannel"], [SQ.CC1]: ["email"], [SQ.CC2]: ["unknown"] });
    expect(svc.tracks).not.toContain("cs");
    expect(svc.tracks).not.toContain("cc");
    expect(svc.clarity).toBe("limited");
  });

  it("9. Personal ute hos kund utan planeringsprocess ger inte Field Service", () => {
    const { svc } = walk({ ...N("field_service"), [SQ.SV1]: ["install_repair"], [SQ.FS1]: ["repair"], [SQ.FS2]: ["mobile"] });
    expect(svc.tracks).not.toContain("fs");
    expect(svc.investigateTracks).toContain("fs");
  });

  it("10. Contact Center med befintligt annat CRM", () => {
    const { svc, p } = walk({ ...N("contact_center"), [SQ.SV1]: ["queues"], [SQ.CC1]: ["phone", "chat"], [SQ.CC2]: ["queues", "crm_integration"], [SQ.NOW]: ["other_crm"] });
    expect(svc.tracks).toEqual(["cc"]);
    expect(svc.keepExistingCrm).toBe(true);
    expect(ids(p.complementary)).not.toContain("cs");
  });

  it("11. Field Service med befintligt annat ERP: integration, inget ERP-förslag", () => {
    const { svc, p } = walk({ ...N("field_service"), [SQ.SV1]: ["field_plan"], [SQ.FS1]: ["workorders", "equipment"], [SQ.FS2]: ["geo"], [SQ.FSDATA]: ["erp_other"] });
    expect(svc.tracks).toEqual(["fs"]);
    expect(svc.integrationSignals.some((x) => x.rule === "FS_ERP")).toBe(true);
    expect([...ids(p.primary), ...ids(p.complementary)]).not.toEqual(expect.arrayContaining(["bc"]));
  });

  it("12. Field Service + reservdelar från ERP ger integrationsbehov", () => {
    const { svc, p } = walk({ ...N("field_service"), [SQ.SV1]: ["field_plan"], [SQ.FS1]: ["workorders", "parts"], [SQ.FS2]: ["parts"], [SQ.FSDATA]: ["erp_d365"] });
    expect(svc.integrationSignals.some((x) => x.rule === "FS_PARTS")).toBe(true);
    expect(ids(p.primary)).not.toContain("bc");
    expect(ids(p.primary)).not.toContain("fscm");
  });

  it("13–15. Produktsnabbspår CS/CC/FS är utgångspunkt och kan utmanas", () => {
    const cs = walk({ entry: ["product"], product_start: ["cs"], [SQ.SV1]: ["cases"], [SQ.CS1]: ["sla"], [SQ.NOW]: ["email_tools"] });
    expect(cs.asked[1]).toBe(SQ.SV1);
    expect(cs.svc.tracks).toEqual(["cs"]);
    const cc = walk({ entry: ["product"], product_start: ["cc"], [SQ.SV1]: ["queues"], [SQ.CC1]: ["several"], [SQ.CC2]: ["queues"], [SQ.NOW]: ["other_crm"] });
    expect(cc.svc.tracks).toEqual(["cc"]);
    expect(cc.svc.selectedProductStartingPoint).toBe("cc");
    const fs = walk({ entry: ["product"], product_start: ["fs"], [SQ.SV1]: ["cases", "sla"], [SQ.CS1]: ["overview"], [SQ.FS1]: ["unknown"] });
    expect(fs.svc.tracks).toEqual(["cs"]); // valet utmanas av svaren
  });

  it("16. Många Vet inte ger begränsat underlag", () => {
    const { svc, p } = walk({ ...N("customer_service") });
    expect(svc.clarity).toBe("limited");
    expect(p.primary.length).toBe(0);
    expect(p.nextStep.kind).toBe("deepen_analysis");
  });

  it("17. Ändrat svar tar bort kombinationsbehov utan spöksignaler", () => {
    const first = walk({ ...N("customer_service", "field_service"), priority: ["field_service"], [SQ.SV1]: ["cases", "field_plan"], [SQ.CS1]: ["overview"], [SQ.FS1]: ["workorders"], [SQ.FS2]: ["geo"], [SQ.HO]: ["case_to_wo"] });
    expect(first.svc.tracks).toEqual(["fs", "cs"]);
    const changed = walk({ [SQ.SV1]: ["field_plan"] }, answer(first.i, SQ.SV1, ["field_plan"]));
    expect(changed.svc.tracks).toEqual(["fs"]);
    expect(changed.svc.combinationSignals).toHaveLength(0);
    expect(changed.s.inactiveAnswers[SQ.CS1]).toBeDefined();
    expect(changed.s.inactiveAnswers[SQ.HO]).toBeDefined();
  });

  it("18. Frågebudget nära max respekteras", () => {
    const { s } = walk({ ...N("erp", "customer_service", "contact_center", "field_service"), priority: ["equal"],
      [SQ.SV1]: ["cases", "queues", "field_plan"], [SQ.CS1]: ["sla"], [SQ.CC1]: ["several"], [SQ.CC2]: ["queues"], [SQ.FS1]: ["parts"], [SQ.HO]: ["case_to_wo"] });
    expect(s.currentPathQuestionCount).toBeLessThanOrEqual(10);
  });
});
