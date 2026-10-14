import { describe, it, expect } from "vitest";
import { answer, deriveState, emptyInput, type DialogInput } from "../engine";
import { Q, type ErpResult } from "../modules/erp";
import { buildSolutionPicture } from "../solutions";
import { DEEP_MAX, DEEP_QUESTIONS, deepContext, deriveDeep, evaluateDeep, resolveDeepOptions } from "../deep";

function base(script: Record<string, string[]>) {
  let i: DialogInput = emptyInput();
  for (let n = 0; n < 15; n++) { const next = deriveState(i).nextQuestionId; if (!next) break; i = answer(i, next, script[next] ?? ["unknown"]); }
  const s = deriveState(i); const erp = s.moduleResults.erp as ErpResult | undefined;
  return { s, erp, p: buildSolutionPicture(s, erp) };
}
function deep(b: ReturnType<typeof base>, script: Record<string, string[]>) {
  const ans: Record<string, string[]> = {}; const asked: string[] = [];
  for (let n = 0; n < 20; n++) { const d = deriveDeep(b.p, b.s, ans); if (!d.next) break; asked.push(d.next); const q = DEEP_QUESTIONS.find((x) => x.id === d.next)!; const opts = resolveDeepOptions(q, deepContext(b.p, b.s, ans)).map((o) => o.id); ans[d.next] = script[d.next] ?? [opts.includes("unknown") ? "unknown" : opts[0]]; }
  return { asked, r: evaluateDeep(b.p, b.s, b.erp, deriveDeep(b.p, b.s, ans).answers) };
}

describe("Fördjupning (Sprint 4)", () => {
  it("BC + lager ger lagerfråga, inga produktionsfrågor", () => {
    const b = base({ entry: ["needs"], needs_areas: ["erp"], [Q.ERP1]: ["finance", "warehouse"], [Q.ERP2]: ["basic"], [Q.ERP3]: ["simple"] });
    const { asked } = deep(b, { bc_focus: ["warehouse"], bc_warehouse: ["zones"] });
    expect(asked).toContain("bc_warehouse");
    expect(asked).not.toContain("bc_production");
    expect(asked).not.toContain("sales_process");
  });

  it("Bara Sales: inga ERP- eller kombinationsfrågor om kundägarskap", () => {
    const b = base({ entry: ["needs"], needs_areas: ["sales"] });
    const { asked } = deep(b, {});
    expect(asked).toContain("sales_process");
    expect(asked).not.toContain("customer_master");
    expect(asked.some((q) => q.startsWith("bc_") || q.startsWith("fscm_"))).toBe(false);
  });

  it("BC + Sales + CI: helhetsfrågor, inte tre fullständiga intervjuer", () => {
    const b = base({ entry: ["needs"], needs_areas: ["erp", "sales", "marketing"], priority: ["erp"], [Q.ERP1]: ["finance", "sales_orders"], [Q.ERP2]: ["basic"] });
    const { asked, r } = deep(b, { customer_master: ["both"], crm_handover: ["quote_to_order"] });
    expect(asked).toContain("customer_master");
    expect(asked).not.toContain("ci_scope");
    expect(asked.length).toBeLessThanOrEqual(DEEP_MAX);
    expect(r.decisions).toContain("Bestäm vilket system som ska äga kundinformationen.");
  });

  it("Beslut 3–5, tillägg endast när det motiveras, överlämning fylld", () => {
    const b = base({ entry: ["needs"], needs_areas: ["sales"] });
    const { r } = deep(b, { role: ["sales_marketing"], stage: ["evaluating"], integrations: ["none"], ai_use: ["assist"], impl_concerns: ["adoption"], sales_adoption: ["excel"], sales_process: ["pipeline"] });
    expect(r.decisions.length).toBeGreaterThanOrEqual(3);
    expect(r.decisions.length).toBeLessThanOrEqual(5);
    expect(r.addOns).toEqual([]);
    expect(r.handover.role).toBe("sales_marketing");
    expect(r.handover.recommended).toEqual(["sales"]);
    expect(r.handover.aiNeeds).toEqual(["assist"]);
    expect(r.aiNote).toMatch(/försäljningen/);
  });

  it("Tillägg kategoriseras och CTA varierar", () => {
    const b = base({ entry: ["needs"], needs_areas: ["erp"], [Q.ERP1]: ["finance", "warehouse"], [Q.ERP2]: ["basic"], [Q.ERP3]: ["simple"] });
    const { r } = deep(b, { bc_focus: ["warehouse"], bc_warehouse: ["zones"], integrations: ["documents", "ecommerce"] });
    expect(r.addOns.map((a) => a.category)).toEqual(expect.arrayContaining(["warehouse", "documents", "ecommerce"]));
    expect(r.nextStep.kind).toBe("addons");
  });
});
