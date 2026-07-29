import type { BcAnswers } from "@/data/bcMatchningstest";
import { CLASS_ORDER_LABEL, type BcClassification } from "@/lib/bcScoringConstants";
import type { BcResult } from "@/lib/bcScoring";

// Brand colors (consistent with other PDF exports)
import { PDF_BRAND } from "./pdfBrand";
import { drawBrandHeader, finalizePdfWithFooter, drawSectionHeading, PDF_MARGIN } from "./pdfLayout";
const BRAND_PETROL: [number, number, number] = PDF_BRAND.primary;
const BRAND_DARK: [number, number, number] = [21, 19, 15]; // #15130F

const CLASS_RGB: Record<BcClassification, [number, number, number]> = {
  essentials: [16, 122, 87],
  premium: [12, 102, 138],
  config: [161, 98, 7],
  isv: [109, 40, 217],
  outside: [159, 18, 57],
};

import type { PdfSuggestedPartner } from "./pdfSuggestedPartners";

export interface BcPdfExtras {
  suggestedPartners?: PdfSuggestedPartner[];
  suggestedCompareUrl?: string;
}

export async function generateBcResultPdf(result: BcResult, _answers: BcAnswers, extras?: BcPdfExtras) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = PDF_MARGIN;
  let y = drawBrandHeader(doc, "Business Central – Matchningstest");

  doc.setTextColor(...BRAND_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  const headlineLines = doc.splitTextToSize(result.headline, pageW - 2 * margin);
  doc.text(headlineLines, margin, y);
  y += headlineLines.length * 6.5 + 3;

  if (result.segmentLabel) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(110, 110, 110);
    doc.text(`Segment: ${result.segmentLabel}`, margin, y);
    y += 6;
  }

  doc.setTextColor(...BRAND_DARK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const bodyLines = doc.splitTextToSize(result.body, pageW - 2 * margin);
  doc.text(bodyLines, margin, y);
  y += bodyLines.length * 5.2 + 4;

  // Section header
  y = drawSectionHeading(doc, "Identifierade behov per kategori", y + 2);

  // Sections
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  for (const c of Object.keys(CLASS_ORDER_LABEL) as BcClassification[]) {
    const items = result.byClassification[c];
    if (!items?.length) continue;

    if (y > pageH - 40) {
      doc.addPage();
      y = margin;
    }

    doc.setFillColor(...CLASS_RGB[c]);
    doc.rect(margin, y, 3, 5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BRAND_DARK);
    doc.text(CLASS_ORDER_LABEL[c], margin + 6, y + 4);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    for (const s of items) {
      const txt = s.note ? `• ${s.area} – ${s.note}` : `• ${s.area}`;
      const lines = doc.splitTextToSize(txt, pageW - 2 * margin - 4);
      if (y + lines.length * 4.6 > pageH - 20) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines, margin + 4, y);
      y += lines.length * 4.6 + 1;
    }
    y += 3;
  }

  // Suggested partners page
  if (extras?.suggestedPartners?.length && extras.suggestedCompareUrl) {
    const { appendSuggestedPartnersPage } = await import("./pdfSuggestedPartners");
    appendSuggestedPartnersPage(doc, extras.suggestedPartners, {
      compareUrl: extras.suggestedCompareUrl,
      productLabel: "Business Central",
    });
  }

  finalizePdfWithFooter(doc, "Business Central Matchningstest");
  doc.save(`bc-matchningstest-${new Date().toISOString().slice(0, 10)}.pdf`);
}
