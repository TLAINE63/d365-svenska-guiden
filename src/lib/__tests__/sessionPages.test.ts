import { describe, it, expect } from "vitest";
import { appendPage, cleanPath } from "@/lib/sessionPages";
import { downloadSlug, thanksKindForAdvisory } from "@/lib/thanksPages";
import { resultPath } from "@/hooks/useToolResultSignal";

describe("sidhistorik (d365_session_pages)", () => {
  it("sparar sökväg utan query och fragment", () => {
    expect(cleanPath("/kostnad/?a=1#x")).toBe("/kostnad/");
    expect(cleanPath("/kostnad")).toBe("/kostnad/");
  });
  it("sparar två visningar i rad av samma sökväg en gång", () => {
    expect(appendPage(["/"], "/")).toEqual(["/"]);
    expect(appendPage(["/", "/a/"], "/")).toEqual(["/", "/a/", "/"]);
  });
  it("behåller den första och de 29 senaste, högst 30", () => {
    let list: string[] = [];
    for (let i = 0; i < 40; i++) list = appendPage(list, `/p${i}/`);
    expect(list).toHaveLength(30);
    expect(list[0]).toBe("/p0/");
    expect(list[1]).toBe("/p11/");
    expect(list[29]).toBe("/p39/");
  });
});

describe("signaladresser", () => {
  it("rådgivning från second opinion får egen tacksida", () => {
    expect(thanksKindForAdvisory("second_opinion")).toBe("second-opinion");
    expect(thanksKindForAdvisory("home")).toBe("radgivning");
  });
  it("köparguiden och implementationskalkylen får rätt /hamtat/-slug", () => {
    expect(downloadSlug("buyer_guide_erp")).toBe("kopparguide-2026");
    expect(downloadSlug("implementation_calculator_pdf")).toBe("implementationskalkyl");
    expect(downloadSlug("roi_pdf_businesscentral-roi")).toBe("roi-businesscentral");
  });
  it("resultatadressen är {verktyg}/resultat/", () => {
    expect(resultPath("/kostnad")).toBe("/kostnad/resultat/");
  });
});
