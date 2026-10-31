import { describe, expect, it } from "vitest";
import { contactLevelFor, CONTACT_LEVEL_EVENTS } from "./contactLevels";

describe("tre kontaktnivåer mäts separat", () => {
  it("Ställ en fråga (artiklar) räknas som nivå 1, fråga", () => {
    expect(contactLevelFor("question")).toBe("question");
  });
  it("övriga d365.se-ingångar räknas som nivå 2, Prata med d365.se", () => {
    for (const p of ["compare", "partner_search", "expert_requirement", "cost_help", "plan"]) expect(contactLevelFor(p)).toBe("advisory");
  });
  it("formulär utan d365.se-ingång är nivå 3, direkt partnerkontakt", () => {
    expect(contactLevelFor(null)).toBe("partner");
  });
  it("öppnat och skickat har egna händelsenamn", () => {
    expect(CONTACT_LEVEL_EVENTS).toEqual({ started: "contact_level_started", submitted: "contact_level_submitted" });
  });
});
