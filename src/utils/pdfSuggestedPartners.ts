import type jsPDF from "jspdf";

export interface PdfSuggestedPartner {
  name: string;
  slug: string;
  positioning?: string;
  description?: string;
}

import { PDF_BRAND } from "./pdfBrand";
const BRAND_PETROL: [number, number, number] = PDF_BRAND.primary;
const BRAND_DARK: [number, number, number] = [21, 19, 15];
const MUTED: [number, number, number] = [110, 110, 120];

/**
 * Renderar en avslutande sida i en jsPDF-instans:
 *   "Föreslagna partners att kontakta" + jämför-URL.
 * Idempotent – anropas sist i varje PDF-generator.
 */
export function appendSuggestedPartnersPage(
  doc: jsPDF,
  partners: PdfSuggestedPartner[],
  opts: {
    compareUrl: string; // absolut URL till /jamfor-partners?a=...
    productLabel?: string;
    industry?: string | null;
  },
) {
  if (!partners || partners.length === 0) return;

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;

  doc.addPage();
  let y = margin;

  // Header bar
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, 0, pageW, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Nästa steg: föreslagna partners", margin, 14);
  y = 32;

  // Intro
  doc.setTextColor(...BRAND_DARK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const intro = `Baserat på ${
    opts.industry ? `er bransch (${opts.industry}) och ` : ""
  }${opts.productLabel ? `produktvalet ${opts.productLabel}` : "er valda produktinriktning"} har vi valt ut ${partners.length} partnerverifierade profiler som matchar det ni behöver. Ta gärna kontakt med 2–3 av dem parallellt – det ger bäst underlag att pressa både pris och funktion.`;
  const introLines = doc.splitTextToSize(intro, contentW);
  doc.text(introLines, margin, y);
  y += introLines.length * 5 + 6;

  // Partner cards
  for (let i = 0; i < partners.length; i++) {
    const p = partners[i];
    const desc = (p.positioning || p.description || "").trim();
    const descLines = desc
      ? doc.splitTextToSize(desc, contentW - 8)
      : ([] as string[]);
    const cardH = 12 + Math.min(descLines.length, 3) * 4.4 + 4;

    if (y + cardH > pageH - 40) {
      doc.addPage();
      y = margin;
    }

    // Card background
    doc.setFillColor(248, 246, 241);
    doc.roundedRect(margin, y, contentW, cardH, 1.6, 1.6, "F");
    doc.setDrawColor(...BRAND_PETROL);
    doc.setLineWidth(0.4);
    doc.line(margin, y, margin, y + cardH);

    // Number + Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BRAND_DARK);
    doc.text(`${i + 1}. ${p.name}`, margin + 4, y + 6);

    // Description
    if (descLines.length > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(70, 70, 75);
      const shown = descLines.slice(0, 3);
      doc.text(shown, margin + 4, y + 11);
    }

    y += cardH + 4;
  }

  // Compare CTA box
  if (y + 32 > pageH - 20) {
    doc.addPage();
    y = margin;
  }
  y += 4;
  doc.setDrawColor(...BRAND_PETROL);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_DARK);
  doc.text("Jämför dessa partners sida vid sida", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 65);
  const cta = "Vi har redan förifyllt jämförelsesidan med de föreslagna partnerna. Öppna länken nedan för att se dem sida vid sida – applikationer, branscher, storlek, geografi, AI-kompetens och kundexempel.";
  const ctaLines = doc.splitTextToSize(cta, contentW);
  doc.text(ctaLines, margin, y);
  y += ctaLines.length * 4.6 + 3;

  // Link
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...BRAND_PETROL);
  const urlLines = doc.splitTextToSize(`→ ${opts.compareUrl}`, contentW);
  // Make clickable
  const linkText = opts.compareUrl;
  doc.textWithLink(`→ ${linkText}`, margin, y, { url: linkText });
  y += urlLines.length * 5 + 2;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  const disc = "Urvalet baseras på samma köparsidiga rankning som resten av d365.se (bransch- och produktprofil, avtalade partners först). Detta är inte en fullständig lista – jämför gärna med ytterligare partners från vår partnersida.";
  const discLines = doc.splitTextToSize(disc, contentW);
  doc.text(discLines, margin, y);
}
