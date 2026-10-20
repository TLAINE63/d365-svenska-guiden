import { describe, it, expect } from "vitest";
import { calcLinkFor, handoffFor, parseSystemvalContext, readCalcPrefill, toSystemvalContext } from "@/lib/systemvalHandoff";

const result = { primaryTracks: [{ id: "bc" as const }], complementaryTracks: [{ id: "sales" as const }], clarity: "clear" as const };

describe("systemvalHandoff", () => {
  it("visar huvudspår på sin produktsida och komplement på sin", () => {
    const ctx = toSystemvalContext(result, null, "2026-10-20");
    expect(handoffFor(ctx, "bc")?.role).toBe("primary");
    expect(handoffFor(ctx, "sales")?.role).toBe("complement");
    expect(handoffFor(ctx, "cs")).toBeNull();
  });
  it("Finance eller Supply Chain hör till F&SCM-sidan", () => {
    const ctx = toSystemvalContext({ ...result, primaryTracks: [{ id: "scm" }] }, null);
    expect(handoffFor(ctx, "fscm")?.role).toBe("primary");
  });
  it("utan fördjupning öppnas kalkylatorn utan förifyllda värden", () => {
    const ctx = toSystemvalContext(result, null);
    expect(calcLinkFor(ctx, "bc")).toEqual({ url: "/businesscentral/roi-kalkylator/", prefilled: false });
  });
  it("skickar bara värden som kalkylatorn läser", () => {
    const ctx = toSystemvalContext(result, { complexity: "high", integrations: ["bi", "ecommerce"] });
    expect(calcLinkFor(ctx, "cs")?.url).toBe("/d365customerservice/roi-kalkylator/?komplexitet=H%C3%B6g&integrationer=2");
    expect(calcLinkFor(ctx, "fscm")?.url).toBe("/finance-supply-chain/roi-kalkylator/?komplexitet=H%C3%B6g");
  });
  it("okänd komplexitet följer inte med", () => {
    const ctx = toSystemvalContext(result, { complexity: "unknown", integrations: [] });
    expect(ctx.complexity).toBeUndefined();
  });
  it("Project Operations saknar kalkylator", () => {
    expect(calcLinkFor(toSystemvalContext(result, null), "po")).toBeNull();
  });
  it("avvisar manipulerad lokal data", () => {
    expect(parseSystemvalContext('{"clarity":"hack","primary":["bc"]}')).toBeNull();
    expect(parseSystemvalContext('{"clarity":"clear","primary":["bc","evil"],"integrations":99}')).toEqual({ savedAt: "", primary: ["bc"], complementary: [], clarity: "clear" });
  });
  it("kalkylatorn ignorerar ogiltiga värden", () => {
    expect(readCalcPrefill("?komplexitet=Extrem&integrationer=50")).toEqual({});
    expect(readCalcPrefill("?komplexitet=L%C3%A5g&integrationer=0")).toEqual({ complexity: "Låg", integrations: 0 });
  });
});
