import { describe, it, expect } from "vitest";
import { contactChainLinks, contactAreasFromAnswers, fieldChainLinks, fieldAreasFromAnswers, serviceChainLinks, readServiceKravPrefill, readServiceRoiPrefill, serviceAreasFromAnswers } from "@/lib/serviceChainLinks";

describe("serviceChainLinks", () => {
  it("ärendehantering alltid med", () => {
    expect(serviceAreasFromAnswers({})).toEqual(["case_mgmt"]);
  });
  it("telefoni ger kontaktcenter, portal ger självservice", () => {
    const a = serviceAreasFromAnswers({ cs3: "yes", cs9: "yes" });
    expect(a).toContain("contact_center");
    expect(a).toContain("self_service");
  });
  it("hög volym ger 50 handläggare och storlek 51–100", () => {
    const l = serviceChainLinks({ cs1: "3", cs10: "yes" }, "strong");
    const roi = readServiceRoiPrefill(l.roi.split("?")[1]);
    expect(roi).toEqual({ agents: 50, integrations: 1 });
    expect(readServiceKravPrefill(l.kravspec.split("?")[1]).size).toBe("51–100");
  });
  it("okända områden filtreras bort", () => {
    expect(readServiceKravPrefill("omraden=case_mgmt,hack").areas).toEqual(["case_mgmt"]);
  });
  it("Field Service: fältservice och schemaläggning alltid med", () => {
    expect(fieldAreasFromAnswers({})).toEqual(["field_service", "scheduling"]);
  });
  it("Field Service: över 100 tekniker ger 150 licenser och storlek 100+", () => {
    const l = fieldChainLinks({ fs1: "3", fs10: "yes" }, "strong");
    expect(l.roi.startsWith("/d365fieldservice/roi-kalkylator/")).toBe(true);
    expect(readServiceRoiPrefill(l.roi.split("?")[1])).toEqual({ agents: 150, integrations: 1 });
    expect(readServiceKravPrefill(l.kravspec.split("?")[1]).size).toBe("100+");
  });
  it("Contact Center: kontaktcenter och kanaler alltid med", () => {
    expect(contactAreasFromAnswers({})).toEqual(["contact_center", "channels"]);
  });
  it("Contact Center: över 200 agenter ger 250 licenser och storlek 100+", () => {
    const l = contactChainLinks({ cc5: "3", cc11: "yes" }, "strong");
    expect(l.roi.startsWith("/d365contactcenter/roi-kalkylator/")).toBe(true);
    expect(readServiceRoiPrefill(l.roi.split("?")[1])).toEqual({ agents: 250, integrations: 1 });
    expect(readServiceKravPrefill(l.kravspec.split("?")[1]).size).toBe("100+");
  });
});
