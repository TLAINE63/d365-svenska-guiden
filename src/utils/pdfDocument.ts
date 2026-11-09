import type { jsPDF } from "jspdf";
import { ORGANIZATION } from "@/data/organization";

/** Helvetica/WinAnsi-safe copy, preserving Swedish letters and brand spacing. */
export function pdfText(text: string): string {
  return text
    .replace(/\u2014/g, " – ")
    .replace(/[\u200B\u00AD]/g, "")
    .replace(/\u2011/g, "-")
    .replace(/→/g, "->").replace(/←/g, "<-")
    .replace(/≈/g, "ca ").replace(/−/g, "-")
    .replace(/…/g, "...").replace(/•/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF\u2013\u2018\u2019\u201C\u201D]/gu, "")
    .replace(/(Microsoft[\s\u00A0]+)?Dynamics[\s\u00A0]+365/g, (brand) => brand.replace(/[\s\u00A0]+/g, "\u00A0"));
}

/** Word wrapping treats the complete Microsoft brand as one indivisible word. */
export function wrapPdfText(text: string, width: number, measure: (text: string) => number): string[] {
  const lines: string[] = [];
  for (const paragraph of pdfText(text).split("\n")) {
    let line = "";
    for (const word of paragraph.split(/[ \t]+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && measure(candidate) > width) {
        lines.push(line);
        line = word;
      } else line = candidate;
    }
    lines.push(line);
  }
  return lines;
}

/** Shared factory: identical text handling for downloads and emailed attachments. */
export async function createPdfDocument(): Promise<jsPDF> {
  const { jsPDF: Pdf } = await import("jspdf");
  const doc = new Pdf({ unit: "mm", format: "a4", compress: true });
  doc.setProperties({ author: ORGANIZATION.name, creator: ORGANIZATION.name, subject: "Beslutsunderlag från d365.se" });
  doc.setLanguage("sv-SE");
  const text = doc.text.bind(doc);
  doc.text = ((value: string | string[], ...args: unknown[]) =>
    Reflect.apply(text, doc, [Array.isArray(value) ? value.map(pdfText) : pdfText(value), ...args])) as typeof doc.text;
  doc.splitTextToSize = ((value: string | string[], width: number) =>
    wrapPdfText(Array.isArray(value) ? value.join("\n") : String(value), width, (line) => doc.getTextWidth(line))) as typeof doc.splitTextToSize;
  return doc;
}