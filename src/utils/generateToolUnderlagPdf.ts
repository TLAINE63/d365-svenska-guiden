import type { ToolEntry } from "@/lib/toolContext";
import { createPdfDocument } from "@/utils/pdfDocument";
import { drawBrandHeader, drawSectionHeading, finalizePdfWithFooter, PDF_MARGIN } from "@/utils/pdfLayout";
import { PDF_BRAND } from "@/utils/pdfBrand";

export function toolPdfFilename(tool: string, date: string): string {
  return `d365-underlag-${tool.replace(/[^a-z0-9_-]/gi, "-")}-${date}.pdf`;
}

/** Shared premium layout, with both columns wrapped and long rows continued safely. */
export async function createToolUnderlagPdf(entry: ToolEntry, date: string) {
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
  y = drawSectionHeading(doc, "Dina val och resultat", y);

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
        y = drawSectionHeading(doc, "Dina val och resultat (fortsättning)", y);
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
  if (y + 35 > bottom) newPage();
  y = drawSectionHeading(doc, "Om underlaget", y);
  paragraph("Underlaget återger dina val och resultat från verktyget på d365.se. Beräkningar är indikativa uppskattningar, inte offerter eller garantier. Bedömningar bygger på dina svar och behöver stämmas av mot verksamhetens krav och vald lösning.", 9);
  finalizePdfWithFooter(doc, entry.label);
  return doc;
}

export async function generateToolUnderlagPdf(entry: ToolEntry, date: string) {
  const doc = await createToolUnderlagPdf(entry, date);
  doc.save(toolPdfFilename(entry.tool, date));
}