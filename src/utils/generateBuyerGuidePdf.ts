import { jsPDF } from "jspdf";
import { PDF_BRAND } from "./pdfBrand";
import {
  PDF_MARGIN,
  drawBrandHeader,
  drawSectionHeading,
  finalizePdfWithFooter,
} from "./pdfLayout";
import type { BuyerGuide } from "@/data/buyerGuides2026";

/** Genererar och laddar ner köparguiden som brandad PDF. */
export function generateBuyerGuidePdf(guide: BuyerGuide): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - PDF_MARGIN * 2;

  let y = drawBrandHeader(doc, guide.title);

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = drawBrandHeader(doc, guide.title);
    }
  };

  const paragraph = (text: string, size = 10, color = PDF_BRAND.text) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentW);
    ensureSpace(lines.length * (size * 0.42) + 4);
    doc.text(lines, PDF_MARGIN, y);
    y += lines.length * (size * 0.42) + 4;
  };

  const bullet = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...PDF_BRAND.text);
    const lines = doc.splitTextToSize(text, contentW - 6);
    ensureSpace(lines.length * 4.2 + 2);
    doc.setFillColor(...PDF_BRAND.accent);
    doc.circle(PDF_MARGIN + 1.4, y - 1.4, 0.9, "F");
    doc.text(lines, PDF_MARGIN + 6, y);
    y += lines.length * 4.2 + 2.5;
  };

  // Intro
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...PDF_BRAND.dark);
  const heroLines = doc.splitTextToSize(guide.hero, contentW);
  doc.text(heroLines, PDF_MARGIN, y);
  y += heroLines.length * 6.5 + 3;

  paragraph(guide.intro, 10, PDF_BRAND.textMuted);
  paragraph(`Omfattning: ${guide.scope}`, 9, PDF_BRAND.textSubtle);
  y += 2;

  guide.sections.forEach((section) => {
    ensureSpace(20);
    y = drawSectionHeading(doc, section.heading, y);
    if (section.intro) paragraph(section.intro, 9.5, PDF_BRAND.textMuted);
    section.bullets.forEach(bullet);
    y += 3;
  });

  ensureSpace(24);
  y = drawSectionHeading(doc, "Vanliga frågor", y);
  guide.faq.forEach((item) => {
    ensureSpace(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...PDF_BRAND.dark);
    const qLines = doc.splitTextToSize(item.q, contentW);
    doc.text(qLines, PDF_MARGIN, y);
    y += qLines.length * 4.4 + 1.5;
    paragraph(item.a, 9.5, PDF_BRAND.textMuted);
  });

  ensureSpace(26);
  y = drawSectionHeading(doc, "Nästa steg", y);
  paragraph(guide.nextStep, 10, PDF_BRAND.text);
  paragraph(
    "Jämför partners och skicka ditt underlag på d365.se/jamfor-partners/ eller använd partnerväljaren på d365.se/valjdynamics365partner/.",
    9.5,
    PDF_BRAND.textMuted,
  );

  finalizePdfWithFooter(doc, guide.title);
  doc.save(`${guide.slug}.pdf`);
}
