import { describe, it, expect } from "vitest";
import { commonExampleRank } from "@/lib/isvCommonExamples";

describe("isvCommonExamples", () => {
  it("Business Central shows Swebase, ExFlow, Continia and Golden EDI first, in that order", () => {
    const ids = ["golden-edi", "continia-document-capture", "exflow", "swebase"];
    expect([...ids].sort((a, b) => commonExampleRank("Business Central", a) - commonExampleRank("Business Central", b)))
      .toEqual(["swebase", "exflow", "continia-document-capture", "golden-edi"]);
  });
  it("ExFlow AP leads for Finance & Supply Chain Management", () => {
    expect(commonExampleRank("Finance & Supply Chain Management", "truvio-exflow-ap")).toBe(0);
  });
  it("solutions outside the list are not boosted", () => {
    expect(commonExampleRank("Business Central", "edi-studio")).toBe(Infinity);
  });
});
