import { describe, it, expect } from "vitest";
import { formatSwedishBand, formatSwedishPhone } from "@/lib/utils";

describe("formatSwedishBand", () => {
  it("byter tusenpunkter mot icke-brytande mellanslag och tankstreck", () => {
    expect(formatSwedishBand("1.000-4.999")).toBe("1\u00A0000–4\u00A0999");
  });
  it("hanterar >5.000 korrekt", () => {
    expect(formatSwedishBand(">5.000")).toBe(">5\u00A0000");
  });
  it("hanterar MSEK-band", () => {
    expect(formatSwedishBand("25-99 MSEK")).toBe("25–99 MSEK");
    expect(formatSwedishBand("1.000-4.999 MSEK")).toBe("1\u00A0000–4\u00A0999 MSEK");
  });
  it("returnerar tom sträng för tomt värde", () => {
    expect(formatSwedishBand("")).toBe("");
  });
});

describe("formatSwedishPhone", () => {
  it("formaterar mobilnummer 3-3-2-2", () => {
    expect(formatSwedishPhone("0706082121")).toBe("070-608 21 21");
  });
  it("formaterar Stockholmsnummer med 08-prefix", () => {
    expect(formatSwedishPhone("081234567")).toBe("08-123 45 67");
  });
  it("bevarar +46 landsprefix", () => {
    expect(formatSwedishPhone("+46706082121")).toBe("+46 070-608 21 21");
  });
  it("normaliserar från 0046-prefix", () => {
    expect(formatSwedishPhone("0046706082121")).toBe("+46 070-608 21 21");
  });
  it("rensar bort separatorer i indata", () => {
    expect(formatSwedishPhone("070-608 21 21")).toBe("070-608 21 21");
    expect(formatSwedishPhone("(070) 608-21-21")).toBe("070-608 21 21");
  });
  it("returnerar tom sträng för tomt värde", () => {
    expect(formatSwedishPhone("")).toBe("");
  });
});
