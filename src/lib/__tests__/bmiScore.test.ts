import { describe, it, expect } from "vitest";
import { bmiScore, bmiValidate, type BmiInput } from "../../../supabase/functions/_shared/bmi";

const run = (b0: string, b5: number, vals: number[]) => {
  const answers = Object.fromEntries(vals.map((v, i) => [`F${i + 1}`, v]));
  const input = { version: 2, b0, b5, answers } as unknown as BmiInput;
  expect(bmiValidate(input)).toBeNull();
  return bmiScore(input);
};
const ids = (xs: { id?: string; question?: string }[]) => xs.map((x) => x.id ?? x.question);

describe("Beslutsmognadsindex v2 scoring", () => {
  it("testfall 1: tidig fas, låga svar", () => {
    const r = run("erp", 1, [1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]);
    expect(r.phase).toBe("tidig");
    expect(r.sections.map((s) => s.score)).toEqual([11, 11, 22, 0, 0]);
    expect(r.sections.map((s) => s.counted)).toEqual([true, true, true, false, false]);
    expect(r.total).toBe(15);
    expect(r.level).toBe("Tidigt skede");
    expect(r.strength).toBeNull();
    expect(ids(r.actions)).toEqual(["F4", "F6", "F3"]);
    expect(ids(r.warnings)).toEqual(["W3", "W7"]);
    expect(ids(r.partner_questions)).toEqual(["F7", "F8", "F9", "F10", "F11"]);
  });
  it("testfall 2: utvärdering, blandade svar", () => {
    const r = run("crm", 5, [1, 2, 0, 0, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1]);
    expect(r.phase).toBe("utvardering");
    expect(r.sections.map((s) => s.score)).toEqual([33, 44, 56, 56, 56]);
    expect(r.total).toBe(49);
    expect(r.level).toBe("Under uppbyggnad");
    expect(r.strength?.id).toBe("S3");
    expect(ids(r.actions)).toEqual(["F4", "F3", "F1"]);
    expect(ids(r.warnings)).toEqual(["W1", "W2", "W3"]);
    expect(ids(r.partner_questions)).toEqual(["F8", "F11", "F12"]);
  });
  it("testfall 3: beslut, högsta svar", () => {
    const r = run("platform", 6, Array(15).fill(3));
    expect(r.phase).toBe("beslut");
    expect(r.total).toBe(100);
    expect(r.level).toBe("Beslutsredo");
    expect(r.strength?.id).toBe("S1");
    expect(r.actions).toEqual([]);
    expect(r.warnings).toEqual([]);
    expect(ids(r.partner_questions)).toEqual(["F11", "F12"]);
  });
  it("testfall 4: analys räknar S4 men inte S5", () => {
    const r = run("service", 3, [2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 3, 3, 3]);
    expect(r.phase).toBe("analys");
    expect(r.sections.map((s) => s.score)).toEqual([67, 67, 67, 0, 100]);
    expect(r.sections[4].counted).toBe(false);
    expect(r.total).toBe(50);
    expect(r.strength?.id).toBe("S1");
    expect(ids(r.actions)).toEqual(["F10", "F11", "F12"]);
    expect(r.warnings).toEqual([]);
    expect(ids(r.partner_questions)).toEqual(["F10", "F11", "F12"]);
  });
  it("avvisar ogiltiga anrop", () => {
    expect(bmiValidate({ version: 2, b0: "erp", b5: 4, answers: { F1: 1 } })).not.toBeNull();
    const all = Object.fromEntries(Array.from({ length: 15 }, (_, i) => [`F${i + 1}`, 1]));
    expect(bmiValidate({ version: 2, b0: "erp", b5: 9, answers: all })).not.toBeNull();
  });
});
