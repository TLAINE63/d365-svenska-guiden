import type { ToolEntry } from "@/lib/toolContext";
import { createPdfDocument } from "@/utils/pdfDocument";
import { drawBrandHeader, drawSectionHeading, finalizePdfWithFooter, PDF_MARGIN } from "@/utils/pdfLayout";
import { PDF_BRAND } from "@/utils/pdfBrand";

export function toolPdfFilename(tool: string, date: string): string {
  return `d365-underlag-${tool.replace(/[^a-z0-9_-]/gi, "-")}-${date}.pdf`;
}

export interface PdfBullet { title?: string; text: string }
export interface PdfSection { heading: string; intro?: string; items: PdfBullet[] }
/** Optional structured content: headed bullet sections after the table and a tool-specific note. */
export interface ToolPdfOptions { sections?: PdfSection[]; note?: string; tableHeading?: string }

/** Shared premium layout, with both columns wrapped and long rows continued safely. */
export async function createToolUnderlagPdf(entry: ToolEntry, date: string, opts: ToolPdfOptions = {}) {
  const doc = await createPdfDocument();
  const width = doc.internal.pageSize.getWidth() - PDF_MARGIN * 2;
  const bottom = doc.internal.pageSize.getHeight() - 20;
  let y = drawBrandHeader(doc, "Beslutsunderlag");
  const newPage = () => { doc.addPage(); y = drawBrandHeader(doc, "Beslutsunderlag"); };
  const paragraph = (value: string, size = 10, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...(bold ? PDF_BRAND.dark : PDF_BRAND.textMuted));
    const lines: string[] = doc.splitTextToSize(value, width);
    const lineHeight = size * 0.48;
    for (const line of lines) {
      if (y + lineHeight > bottom) {
        newPage();
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(size);
        doc.setTextColor(...(bold ? PDF_BRAND.dark : PDF_BRAND.textMuted));
      }
      doc.text(line, PDF_MARGIN, y);
      y += lineHeight;
    }
    y += 3;
  };
  paragraph(entry.label, 18, true);
  paragraph(`Skapad ${date}`, 9);
  if (entry.industry) paragraph(`Bransch: ${entry.industry}`);
  if (entry.users) paragraph(`Antal användare: ${entry.users}`);
  y += 3;
  if (y + 24 > bottom) newPage();
  y = drawSectionHeading(doc, opts.tableHeading ?? "Dina val och resultat", y);

  const leftWidth = width * 0.4;
  const padding = 4;
  const lineHeight = 4.8;
  Object.entries(entry.values).forEach(([label, value], index) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const labels: string[] = doc.splitTextToSize(label, leftWidth - padding * 2);
    doc.setFont("helvetica", "bold");
    const values: string[] = doc.splitTextToSize(value, width - leftWidth - padding * 2);
    const count = Math.max(labels.length, values.length);
    let offset = 0;
    while (offset < count) {
      if (y + lineHeight + padding * 2 > bottom) {
        newPage();
        y = drawSectionHeading(doc, `${opts.tableHeading ?? "Dina val och resultat"} (fortsättning)`, y);
      }
      const available = Math.floor((bottom - y - padding * 2) / lineHeight);
      const take = Math.min(count - offset, available);
      const height = take * lineHeight + padding * 2;
      if (index % 2 === 0) {
        doc.setFillColor(...PDF_BRAND.cardBg);
        doc.rect(PDF_MARGIN, y, width, height, "F");
      }
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...PDF_BRAND.textMuted);
      doc.text(labels.slice(offset, offset + take), PDF_MARGIN + padding, y + padding + 3, { lineHeightFactor: lineHeight / (10 * 0.352778) });
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...PDF_BRAND.dark);
      doc.text(values.slice(offset, offset + take), PDF_MARGIN + leftWidth + padding, y + padding + 3, { lineHeightFactor: lineHeight / (10 * 0.352778) });
      doc.setDrawColor(...PDF_BRAND.cardBorder);
      doc.setLineWidth(0.2);
      doc.line(PDF_MARGIN, y + height, PDF_MARGIN + width, y + height);
      y += height;
      offset += take;
    }
  });
  y += 8;
  // Headed bullet sections: a heading always keeps its first bullet, and a bullet is never split
  // across pages when it fits on one, so no section starts at a page foot or breaks mid-sentence.
  const bulletIndent = 6;
  const bulletLines = (b: PdfBullet) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const t: string[] = b.title ? doc.splitTextToSize(b.title, width - bulletIndent) : [];
    doc.setFont("helvetica", "normal");
    const x: string[] = doc.splitTextToSize(b.text, width - bulletIndent);
    return { t, x, h: (t.length + x.length) * 4.8 + 3 };
  };
  const drawBullet = (b: PdfBullet) => {
    const { t, x, h } = bulletLines(b);
    if (y + h > bottom && h < bottom - 40) newPage();
    doc.setFillColor(...PDF_BRAND.primary);
    doc.circle(PDF_MARGIN + 1.5, y - 1.2, 0.9, "F");
    const line = (txt: string, bold: boolean) => {
      if (y + 4.8 > bottom) newPage();
      doc.setFontSize(10);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(...(bold ? PDF_BRAND.dark : PDF_BRAND.textMuted));
      doc.text(txt, PDF_MARGIN + bulletIndent, y);
      y += 4.8;
    };
    t.forEach((l) => line(l, true));
    x.forEach((l) => line(l, false));
    y += 3;
  };
  for (const sec of opts.sections ?? []) {
    // Keep the heading with its first two bullets (or the whole section when it is short).
    const lead = sec.items.slice(0, 2).reduce((h, b) => h + bulletLines(b).h, 0);
    if (y + 14 + (sec.intro ? 10 : 0) + Math.min(lead, 80) > bottom) newPage();
    y = drawSectionHeading(doc, sec.heading, y);
    if (sec.intro) paragraph(sec.intro, 9);
    sec.items.forEach(drawBullet);
    y += 5;
  }
  if (y + 35 > bottom) newPage();
  y = drawSectionHeading(doc, "Om underlaget", y);
  paragraph(opts.note ?? "Underlaget återger dina val och resultat från verktyget på d365.se. Beräkningar är indikativa uppskattningar, inte offerter eller garantier. Bedömningar bygger på dina svar och behöver stämmas av mot verksamhetens krav och vald lösning.", 9);
  finalizePdfWithFooter(doc, entry.label);
  return doc;
}

export async function generateToolUnderlagPdf(entry: ToolEntry, date: string, opts?: ToolPdfOptions) {
  const doc = await createToolUnderlagPdf(entry, date, opts);
  doc.save(toolPdfFilename(entry.tool, date));
}
/** Same PDF as base64 for the e-mail flow (no download). */
export async function toolUnderlagPdfBase64(entry: ToolEntry, date: string, opts?: ToolPdfOptions): Promise<string> {
  const doc = await createToolUnderlagPdf(entry, date, opts);
  return (doc.output("datauristring") as string).split(",")[1] ?? "";
}
