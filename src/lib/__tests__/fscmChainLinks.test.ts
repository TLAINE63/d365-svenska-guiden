import { describe, it, expect } from "vitest";
import { fscmChainLinks, readRoiPrefill } from "@/lib/fscmChainLinks";

describe("fscmChainLinks", () => {
  it("skickar omsättning och komplexitet till kalkylatorn", () => {
    const l = fscmChainLinks({ q2_revenue: "100-500" }, "strong", {} as never);
    expect(readRoiPrefill(l.roi.split("?")[1])).toEqual({ revenue: 300_000_000, complexity: "Hög" });
  });
  it("utelämnar bransch när den saknas", () => {
    expect(fscmChainLinks({}, "partial", {} as never).kravspec).toBe("/kravspecifikation/");
  });
  it("ignorerar ogiltiga värden i kalkylatorn", () => {
    expect(readRoiPrefill("oms=abc&komplexitet=Extrem")).toEqual({});
  });
});
