import type jsPDF from "jspdf";
import { PDF_BRAND } from "./pdfBrand";
import { drawBrandHeader } from "./pdfLayout";

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
  let y = drawBrandHeader(doc, "Tilläggslösningar att utvärdera");

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
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const descLines = doc.splitTextToSize(a.shortDescription || "", contentW - 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const nameLines = doc.splitTextToSize(a.name, contentW - 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const metaLines = doc.splitTextToSize(`${a.vendor} · ${a.category}`, contentW - 10);
    const boxH = 12 + nameLines.length * 5 + metaLines.length * 4 + descLines.length * 4.5;
    if (y + boxH > pageH - 25) {
      doc.addPage();
      y = drawBrandHeader(doc, "Tilläggslösningar att utvärdera");
    }
    doc.setDrawColor(225, 225, 230);
    doc.setFillColor(250, 250, 251);
    doc.roundedRect(margin, y, contentW, boxH, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...PDF_BRAND.primary);
    doc.text(nameLines, margin + 5, y + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    const metaY = y + 7 + nameLines.length * 5;
    doc.text(metaLines, margin + 5, metaY);

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 65);
    doc.text(descLines, margin + 5, metaY + metaLines.length * 4 + 1);

    y += boxH + 5;
  }

  if (y > pageH - 30) {
    doc.addPage();
    y = drawBrandHeader(doc, "Tilläggslösningar att utvärdera");
  }
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  const note = `Urvalet kommer från d365.se:s tilläggskatalog och är redaktionellt. Katalog: ${
    opts.catalogUrl || "https://d365.se/kunskapscenter/dynamics-365-tillagg/"
  }`;
  doc.text(doc.splitTextToSize(note, contentW), margin, y + 4);
}
