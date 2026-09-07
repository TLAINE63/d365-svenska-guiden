import type jsPDF from "jspdf";
import { PDF_BRAND } from "./pdfBrand";

export interface PdfIsvAddon {
  name: string;
  vendor: string;
  category: string;
  shortDescription: string;
}

const BRAND_DARK: [number, number, number] = [21, 19, 15];
const MUTED: [number, number, number] = [110, 110, 120];

/**
 * Renderar en sida med de tilläggslösningar besökaren valt att utvärdera.
 * Anropas av kravspecifikationens och behovsanalysens PDF-generatorer.
 */
export function appendIsvAddonsPage(
  doc: jsPDF,
  addons: PdfIsvAddon[],
  opts: { productLabel?: string; catalogUrl?: string } = {},
) {
  if (!addons?.length) return;

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;

  doc.addPage();
  let y = margin;

  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, 0, pageW, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Tilläggslösningar att utvärdera", margin, 14);
  y = 32;

  doc.setTextColor(...BRAND_DARK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const intro = `Följande tillägg har valts ut som relevanta${
    opts.productLabel ? ` för ${opts.productLabel}` : ""
  }. Be partnerna kommentera vilka som behövs, vilka som kan ersättas av standardfunktioner och vad de kostar i licens och införande.`;
  const introLines = doc.splitTextToSize(intro, contentW);
  doc.text(introLines, margin, y);
  y += introLines.length * 5 + 6;

  for (const a of addons) {
    if (y > pageH - 40) {
      doc.addPage();
      y = margin;
    }
    doc.setDrawColor(225, 225, 230);
    doc.setFillColor(250, 250, 251);
    const descLines = doc.splitTextToSize(a.shortDescription || "", contentW - 10);
    const boxH = 18 + descLines.length * 4.5;
    doc.roundedRect(margin, y, contentW, boxH, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...PDF_BRAND.primary);
    doc.text(a.name, margin + 5, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text(`${a.vendor} · ${a.category}`, margin + 5, y + 12.5);

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 65);
    doc.text(descLines, margin + 5, y + 17.5);

    y += boxH + 5;
  }

  if (y > pageH - 30) {
    doc.addPage();
    y = margin;
  }
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  const note = `Urvalet kommer från d365.se:s tilläggskatalog och är redaktionellt. Katalog: ${
    opts.catalogUrl || "https://d365.se/kunskapscenter/dynamics-365-tillagg/"
  }`;
  doc.text(doc.splitTextToSize(note, contentW), margin, y + 4);
}
