import { describe, expect, it } from "vitest";
import { COMPETENCE_CTA, PARTNER_COMPARE_CTA, PARTNER_PROFILE_CTA } from "./conversionCtas";
import { recipientNames } from "@/components/inquiry/InquiryDialog";

describe("CTA-hierarki per sidtyp (Conversion & Trust steg 3)", () => {
  it("partnerprofil: Kontakta partner först, d365.se för den som är osäker", () => {
    expect(PARTNER_PROFILE_CTA).toEqual({ primary: "Kontakta partner", secondary: "Prata med d365.se om du är osäker på valet" });
  });
  it("partnerjämförelse: Kontakta valda partners först, d365.se om alternativen", () => {
    expect(PARTNER_COMPARE_CTA).toEqual({ primary: "Kontakta valda partners", secondary: "Prata med d365.se om alternativen" });
  });
  it("kompetens: Beskriv kompetensbehovet först, Prata med d365.se sekundärt", () => {
    expect(COMPETENCE_CTA).toEqual({ primary: "Beskriv kompetensbehovet", secondary: "Prata med d365.se" });
  });
  it("formuläret namnger exakt vilka partners som kan få förfrågan", () => {
    expect(recipientNames([{ name: "A" }])).toBe("A");
    expect(recipientNames([{ name: "A" }, { name: "B" }])).toBe("A och B");
    expect(recipientNames([{ name: "A" }, { name: "B" }, { name: "C" }])).toBe("A, B och C");
  });
});
