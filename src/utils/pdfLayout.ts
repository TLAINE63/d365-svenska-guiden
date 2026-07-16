// Delad brand-layout för alla d365.se-PDF:er. Säkerställer att alla PDF-exporter
// (matchningstester, ROI, kravspec, partnerguide, suggested partners) delar samma
// header, footer och typografiska rytm som matchar sajtens brand:
//   - Mörk header #15130F (samma som sajtens hero-dark)
//   - Orange accent-stripe #D64A1F (logo-orange / primär CTA)
//   - Wordmark "d365.se" + subtitel-slogan
//   - Diskret footer med sidnumrering och orange accent
//
// Alla generatorer ska anropa drawBrandHeader() först på sidan och
// finalizePdfWithFooter() precis innan doc.save().

import type { jsPDF } from "jspdf";
import { PDF_BRAND } from "./pdfBrand";

export const PDF_HEADER_H = 30; // mm – höjd på dark header-bar
export const PDF_MARGIN = 18;   // mm – standardmarginal
export const PDF_ACCENT_H = 1.8; // mm – tjocklek på orange accent-stripe

/**
 * Ritar den brandade headern överst på nuvarande sida.
 * Returnerar y-position där brödtexten kan börja.
 */
export function drawBrandHeader(
  doc: jsPDF,
  title: string,
  subtitle = "d365.se · köparsidig vägledning för Microsoft Dynamics 365",
): number {
  const pageW = doc.internal.pageSize.getWidth();

  // Dark bar
  doc.setFillColor(...PDF_BRAND.dark);
  doc.rect(0, 0, pageW, PDF_HEADER_H, "F");

  // Wordmark
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("d365.se", PDF_MARGIN, 11);

  // Titel (höger-justerad, medium storlek)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title, PDF_MARGIN, 20);

  // Subtitel
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255, 0.7 as unknown as number);
  // jsPDF's setTextColor alpha stöd är opålitligt – använd ljus grå istället
  doc.setTextColor(180, 180, 180);
  doc.text(subtitle, PDF_MARGIN, 26);

  // Orange accent-stripe under headern (matchar sajtens primary CTA)
  doc.setFillColor(...PDF_BRAND.primary);
  doc.rect(0, PDF_HEADER_H, pageW, PDF_ACCENT_H, "F");

  // Återställ text-färg till dark för brödtext
  doc.setTextColor(...PDF_BRAND.dark);

  return PDF_HEADER_H + PDF_ACCENT_H + 8;
}

/**
 * Ritar en subtil footer på alla sidor. Anropa som sista steg innan doc.save().
 */
export function finalizePdfWithFooter(doc: jsPDF, label: string): void {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const total = doc.getNumberOfPages();

  for (let i = 1; i <= total; i++) {
    doc.setPage(i);

    // Diskret orange accent-line ovanför footer
    doc.setDrawColor(...PDF_BRAND.primary);
    doc.setLineWidth(0.4);
    doc.line(PDF_MARGIN, pageH - 12, pageW - PDF_MARGIN, pageH - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...PDF_BRAND.textMuted);
    doc.text(`d365.se – ${label}`, PDF_MARGIN, pageH - 7);
    doc.text(`Sida ${i} av ${total}`, pageW - PDF_MARGIN, pageH - 7, { align: "right" });
  }
}

/**
 * Ritar en sektions-rubrik med orange accent-block till vänster.
 * Returnerar y-position under rubriken.
 */
export function drawSectionHeading(
  doc: jsPDF,
  text: string,
  y: number,
): number {
  const pageW = doc.internal.pageSize.getWidth();

  // Accent-block (orange)
  doc.setFillColor(...PDF_BRAND.primary);
  doc.rect(PDF_MARGIN, y - 4, 2.5, 5.5, "F");

  // Rubrik-text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...PDF_BRAND.dark);
  doc.text(text, PDF_MARGIN + 5, y);

  // Tunn petrol-linje under
  doc.setDrawColor(...PDF_BRAND.accent);
  doc.setLineWidth(0.3);
  doc.line(PDF_MARGIN, y + 3, pageW - PDF_MARGIN, y + 3);

  return y + 9;
}
