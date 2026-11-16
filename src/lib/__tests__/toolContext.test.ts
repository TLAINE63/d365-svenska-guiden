import { describe, it, expect } from "vitest";
import { upsertTool } from "@/lib/toolContext";

describe("upsertTool", () => {
  it("ersätter samma verktyg och behåller högst 8", () => {
    let list = [] as ReturnType<typeof upsertTool>;
    for (let i = 0; i < 10; i++) list = upsertTool(list, { tool: `t${i}`, label: "x", at: "a", values: {} });
    list = upsertTool(list, { tool: "t9", label: "ny", at: "b", values: { A: "1" } });
    expect(list).toHaveLength(8);
    expect(list.filter((t) => t.tool === "t9")).toHaveLength(1);
    expect(list[7].label).toBe("ny");
  });
  it("tar bort tomma värden och ogiltigt användarantal", () => {
    const [e] = upsertTool([], { tool: "a", label: "b", at: "c", users: 0, values: { Tom: "", Kostnad: "100 tkr" } });
    expect(e.values).toEqual({ Kostnad: "100 tkr" });
    expect(e.users).toBeUndefined();
  });
});
