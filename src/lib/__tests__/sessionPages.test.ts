import { describe, it, expect } from "vitest";
import { appendPage, cleanPath, readSessionUtm, recordSessionUtm, SESSION_PAGES_KEY, UTM_KEY, INTERNAL_KEY } from "@/lib/sessionPages";
import { contentThemeForPath, resolveContentInvite, type ContentInviteData } from "@/lib/contentInvite";
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

describe("innehållsinbjudan", () => {
  it("matchar kanoniska temasökvägar och stoppar tack- och formulärsidor", () => {
    expect(contentThemeForPath("/alla-d365-partners/")).toBe("partnerval");
    expect(contentThemeForPath("/businesscentral/roi-kalkylator/")).toBe("pris");
    expect(contentThemeForPath("/kunskapscenter/businesscentral/nav-till-business-central/")).toBe("migrering");
    expect(contentThemeForPath("/finance-supply-chain/")).toBe("fscm");
    expect(contentThemeForPath("/d365sales/")).toBe("crm");
    expect(contentThemeForPath("/copilot/")).toBe("ai");
    expect(contentThemeForPath("/tack/webinar/test/")).toBeNull();
    expect(contentThemeForPath("/ERPbehovsanalys/")).toBeNull();
  });

  it("väljer närmaste webinar före artikel och inget innehåll utan tema", () => {
    const data: ContentInviteData = {
      webinars: [{ id: "1", slug: "test", title: "Testwebinar", description: "Test", body: null, starts_at: "2026-12-01T08:00:00+01:00", duration_min: 45, theme: "partnerval", speakers: null, recording_url: null, status: "publicerad", created_at: "2026-11-10", updated_at: "2026-11-10" }],
      articles: [{ id: "a", title: "Artikel", description: "Första meningen. Andra meningen.", url: "/artiklar/test/", slug: "test", theme: "partnerval", published_at: "2026-11-10", created_at: "2026-11-10" }],
    };
    expect(resolveContentInvite("partnerval", data, new Date("2026-11-10"))?.kind).toBe("webinar");
    expect(resolveContentInvite("pris", data, new Date("2026-11-10"))).toBeNull();
    expect(resolveContentInvite("partnerval", { ...data, webinars: [] }, new Date("2026-11-10"))?.sentence).toBe("Första meningen.");
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
