import type { jsPDF } from "jspdf";
import { premiumPriceComparison } from "@/lib/partnerOrder";
import { PDF_BRAND } from "./pdfBrand";
import { wrapPdfText } from "./pdfDocument";
import { PDF_MARGIN, drawBrandHeader } from "./pdfLayout";

/** Same five-column comparison as the public Premium price list. */
export function drawPremiumPriceTable(doc: jsPDF, y: number): number {
  const width = doc.internal.pageSize.getWidth() - PDF_MARGIN * 2;
  if (y + 58 > doc.internal.pageSize.getHeight() - 22) {
    doc.addPage();
    y = drawBrandHeader(doc, "Premium, prisjämförelse");
  }
  const widths = [0.24, 0.17, 0.18, 0.17, 0.24].map((share) => share * width);
  const kr = (n: number) => `${n.toLocaleString("sv-SE")} kr`;
  const rows = [
    ["Premium", "Per månad", "Månad × 12", "Per år", "Rabatt för årsavtal"],
    ...[1, 2, 3].map(premiumPriceComparison).map((p) => [
      `${p.areas} produktområde${p.areas > 1 ? "n" : ""}`,
      kr(p.monthly), kr(p.monthlyTotal), kr(p.annual), `${kr(p.savings)} (${p.savingsPercent} %)`,
    ]),
  ];
  rows.forEach((row, i) => {
    doc.setFont("helvetica", i === 0 ? "bold" : "normal");
    doc.setFontSize(8);
    const cells = row.map((cell, c) => wrapPdfText(cell, widths[c] - 4, (s) => doc.getTextWidth(s)));
    const height = Math.max(...cells.map((cell) => cell.length)) * 4.2 + 5;
    doc.setFillColor(...PDF_BRAND.cardBg);
    doc.rect(PDF_MARGIN, y - 3.5, width, height, "F");
    doc.setTextColor(...PDF_BRAND.dark);
    let x = PDF_MARGIN;
    cells.forEach((cell, c) => { doc.text(cell, x + 2, y); x += widths[c]; });
    y += height + 1;
  });
  return y + 4;
}