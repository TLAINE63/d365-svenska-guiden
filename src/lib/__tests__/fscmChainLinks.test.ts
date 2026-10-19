import { describe, it, expect } from "vitest";
import { fscmChainLinks, readRoiPrefill, readKravAreas, kravAreasFromAnswers } from "@/lib/fscmChainLinks";

describe("fscmChainLinks", () => {
  it("skickar omsättning och komplexitet till kalkylatorn", () => {
    const l = fscmChainLinks({ q2_revenue: "100-500" }, "strong", {} as never);
    expect(readRoiPrefill(l.roi.split("?")[1])).toEqual({ revenue: 300_000_000, complexity: "Hög" });
  });
  it("utelämnar bransch när den saknas", () => {
    expect(fscmChainLinks({}, "partial", {} as never).kravspec).toBe("/kravspecifikation/?omraden=ekonomi");
  });
  it("ignorerar ogiltiga värden i kalkylatorn", () => {
    expect(readRoiPrefill("oms=abc&komplexitet=Extrem")).toEqual({});
  });
});

describe("kravspec-förifyllning", () => {
  it("skickar bransch, storlek och områden från testet", () => {
    const l = fscmChainLinks({ q3_industry: "tillverkning", q1_employees: "250-1000", q4_legal_entities: "2-5", q13_warehouse: "yes", q15_manufacturing: "discrete" }, "strong", {} as never);
    const sp = new URLSearchParams(l.kravspec.split("?")[1]);
    expect(sp.get("bransch")).toBe("Tillverkningsindustri");
    expect(sp.get("storlek")).toBe("251–500");
    expect(readKravAreas(l.kravspec.split("?")[1])).toEqual(["ekonomi", "koncern", "lager", "produktion"]);
  });
  it("tjänsteföretag får projekt men aldrig lager", () => {
    expect(kravAreasFromAnswers({ q3_industry: "tjanster", q13_warehouse: "yes" })).toEqual(["ekonomi", "projekt"]);
  });
  it("ignorerar okända områden", () => {
    expect(readKravAreas("omraden=lager,hack")).toEqual(["lager"]);
  });
});
