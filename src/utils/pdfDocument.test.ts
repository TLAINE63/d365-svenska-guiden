import { describe, expect, it } from "vitest";
import { pdfText, wrapPdfText } from "./pdfDocument";

describe("document text quality", () => {
  it("keeps Microsoft Dynamics 365 on one line", () => {
    const lines = wrapPdfText("Val av Microsoft Dynamics 365 för företaget", 26, (s) => s.length);
    expect(lines.some((line) => line.includes("Microsoft\u00A0Dynamics\u00A0365"))).toBe(true);
    expect(lines.some((line) => /Microsoft$|Dynamics$/.test(line))).toBe(false);
  });
  it("keeps Dynamics 365 on one line", () => {
    expect(wrapPdfText("Välj Dynamics 365 idag", 12, (s) => s.length)).toContain("Dynamics\u00A0365");
  });
  it("preserves Swedish text and replaces unsupported symbols", () => {
    expect(pdfText("Åäö, räknat → 40 kr — vägledning 🚀")).toBe("Åäö, räknat -> 40 kr  –  vägledning ");
  });
  it("preserves ISO dates", () => {
    expect(pdfText("2026-11-09")).toBe("2026-11-09");
  });
});