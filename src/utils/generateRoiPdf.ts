// Branded ROI/TCO PDF generator – used by both BC and Sales ROI calculators.
// Layout mirrors hero/look (petrol + deep charcoal) and ends with an assumptions appendix.

import { PDF_BRAND } from "./pdfBrand";
import { finalizePdfWithFooter, drawSectionHeading } from "./pdfLayout";
const BRAND_PETROL: [number, number, number] = PDF_BRAND.primary;
const BRAND_DARK: [number, number, number] = [21, 19, 15]; // #15130F
const MUTED: [number, number, number] = [110, 110, 110];

const fmtSek = (n: number) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";

// jsPDF's built-in helvetica uses WinAnsi (cp1252) encoding. Characters outside
// that set (≈, −, →, …, non-breaking hyphen, soft hyphen, etc.) render as
// garbled glyphs or break kerning. Replace them with WinAnsi-safe equivalents.
const safe = (s: string): string =>
  s
    .replace(/\u00A0/g, " ") // non-breaking space
    .replace(/\u00AD/g, "") // soft hyphen
    .replace(/\u200B/g, "") // zero-width space
    .replace(/\u2011/g, "-") // non-breaking hyphen
    .replace(/\u2248/g, "ca. ") // ≈
    .replace(/\u2212/g, "-") // minus
    .replace(/\u2192/g, "->") // →
    .replace(/\u2190/g, "<-") // ←
    .replace(/\u2026/g, "...") // …
    .replace(/\u2022/g, "-"); // •


export interface RoiPdfKpi {
  label: string;
  value: string;
  sub?: string;
}

export interface RoiPdfRow {
  label: string;
  value: string;
  sub?: string;
  strong?: boolean;
  divider?: boolean;
}

export interface RoiPdfDriver {
  label: string;
  annual: number;
  hint?: string;
  detail?: string;
}


export interface RoiPdfInput {
  label: string;
  value: string;
}

export interface RoiPdfAssumption {
  title: string;
  body: string;
}

export interface RoiPdfData {
  productName: string; // "Business Central" | "Dynamics 365 Sales"
  pageUrl: string;
  companyName?: string;
  recipientEmail?: string;
  kpis: RoiPdfKpi[];
  inputs: RoiPdfInput[];
  costRows: RoiPdfRow[];
  drivers: RoiPdfDriver[];
  assumptions: RoiPdfAssumption[];
  fileName: string;
  /** Föreslagna partners att kontakta (max 3). Läggs som avslutande sida. */
  suggestedPartners?: import("./pdfSuggestedPartners").PdfSuggestedPartner[];
  /** Absolut URL till /jamfor-partners?a=... med de förifyllda slugsen. */
  suggestedCompareUrl?: string;
  suggestedIndustry?: string | null;
}

export async function generateRoiPdf(data: RoiPdfData) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = pageW - margin * 2;

  // ---- helpers ----
  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 18) {
      doc.addPage();
      y = margin;
    }
  };
  const sectionTitle = (text: string) => {
    ensureSpace(14);
    doc.setDrawColor(...BRAND_PETROL);
    doc.setLineWidth(0.6);
    doc.line(margin, y, pageW - margin, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...BRAND_DARK);
    doc.text(text, margin, y);
    y += 6;
  };

  // ---- COVER ----
  // Top dark band
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, 0, pageW, 70, "F");
  // Petrol accent stripe
  doc.setFillColor(...BRAND_PETROL);
  doc.rect(0, 70, pageW, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("d365.se · köparsidig vägledning", margin, 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const titleLines = doc.splitTextToSize(
    `ROI & TCO – ${data.productName}`,
    contentW,
  );
  doc.text(titleLines, margin, 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const subtitle = data.companyName
    ? `Indikativ kalkyl för ${data.companyName}`
    : "Indikativ kalkyl";
  doc.text(subtitle, margin, 52);

  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  const dateStr = new Date().toLocaleDateString("sv-SE");
  doc.text(`Genererad ${dateStr}`, margin, 60);

  let y = 86;

  // ---- KPI cards (2x2 grid) ----
  doc.setTextColor(...BRAND_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Sammanfattning", margin, y);
  y += 5;

  const kpiW = (contentW - 6) / 2;
  const kpiH = 26;
  for (let i = 0; i < data.kpis.length; i++) {
    const k = data.kpis[i];
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = margin + col * (kpiW + 6);
    const ky = y + row * (kpiH + 6);
    doc.setFillColor(248, 246, 242);
    doc.setDrawColor(230, 226, 218);
    doc.roundedRect(x, ky, kpiW, kpiH, 2, 2, "FD");
    doc.setFillColor(...BRAND_PETROL);
    doc.rect(x, ky, 2, kpiH, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(k.label.toUpperCase(), x + 6, ky + 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...BRAND_DARK);
    doc.text(k.value, x + 6, ky + 17);
    if (k.sub) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(k.sub, x + 6, ky + 23);
    }
  }
  const kpiRows = Math.ceil(data.kpis.length / 2);
  y += kpiRows * (kpiH + 6) + 4;

  // ---- INPUTS ----
  sectionTitle("Era förutsättningar");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...BRAND_DARK);
  const colW = contentW / 2;
  for (let i = 0; i < data.inputs.length; i += 2) {
    ensureSpace(7);
    const left = data.inputs[i];
    const right = data.inputs[i + 1];
    doc.setTextColor(...MUTED);
    doc.text(left.label, margin, y);
    if (right) doc.text(right.label, margin + colW, y);
    doc.setTextColor(...BRAND_DARK);
    doc.setFont("helvetica", "bold");
    doc.text(left.value, margin, y + 4.8);
    if (right) doc.text(right.value, margin + colW, y + 4.8);
    doc.setFont("helvetica", "normal");
    y += 11;
  }

  // ---- COST BREAKDOWN ----
  y += 2;
  sectionTitle("Kostnader & nytta");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  for (const r of data.costRows) {
    if (r.divider) {
      ensureSpace(4);
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.2);
      doc.line(margin, y, pageW - margin, y);
      y += 3;
      continue;
    }
    ensureSpace(6);
    doc.setFont("helvetica", r.strong ? "bold" : "normal");
    doc.setTextColor(r.strong ? BRAND_DARK[0] : MUTED[0], r.strong ? BRAND_DARK[1] : MUTED[1], r.strong ? BRAND_DARK[2] : MUTED[2]);
    doc.text(r.label, margin, y);
    doc.setTextColor(...BRAND_DARK);
    const valText = r.sub ? `${r.value} ${r.sub}` : r.value;
    doc.text(valText, pageW - margin, y, { align: "right" });
    y += 5.5;
  }

  // ---- DRIVERS ----
  if (data.drivers.length) {
    y += 2;
    sectionTitle("Valda effektiviseringsdrivare");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    for (const d of data.drivers) {
      ensureSpace(d.hint || d.detail ? 18 : 7);
      doc.setFillColor(...BRAND_PETROL);
      doc.circle(margin + 1.2, y - 1.4, 0.9, "F");
      doc.setTextColor(...BRAND_DARK);
      doc.setFont("helvetica", "bold");
      doc.text(d.label, margin + 4.5, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...BRAND_DARK);
      doc.text(`~${fmtSek(d.annual)}/år`, pageW - margin, y, { align: "right" });
      y += 4.8;
      if (d.hint) {
        doc.setFontSize(9);
        doc.setTextColor(...MUTED);
        const hintLines = doc.splitTextToSize(d.hint, contentW - 6);
        doc.text(hintLines, margin + 4.5, y);
        y += hintLines.length * 4 + 1;
        doc.setFontSize(10);
      }
      if (d.detail) {
        doc.setFontSize(9);
        doc.setTextColor(...BRAND_DARK);
        const detailLines = doc.splitTextToSize(d.detail, contentW - 6);
        ensureSpace(detailLines.length * 4 + 2);
        doc.text(detailLines, margin + 4.5, y);
        y += detailLines.length * 4 + 2.5;
        doc.setFontSize(10);
      }
      if (!d.hint && !d.detail) {
        y += 1;
      }
    }

  }

  // ---- APPENDIX: ANTAGANDEN ----
  doc.addPage();
  y = margin;
  doc.setFillColor(...BRAND_DARK);
  doc.rect(0, 0, pageW, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Bilaga: Antaganden", margin, 14);
  y = 32;
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  const introLines = doc.splitTextToSize(
    safe(`Kalkylen för ${data.productName} är medvetet förenklad. Den ska ge en storleksordning – inte ersätta en business case-analys eller offert.`),
    contentW,
  );
  doc.text(introLines, margin, y);
  y += introLines.length * 5 + 4;

  for (const a of data.assumptions) {
    ensureSpace(14);
    doc.setFillColor(...BRAND_PETROL);
    doc.rect(margin, y - 3.5, 2.2, 5.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BRAND_DARK);
    doc.text(safe(a.title), margin + 5, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(safe(a.body), contentW);
    ensureSpace(lines.length * 4.4 + 3);
    doc.text(lines, margin, y);
    y += lines.length * 4.4 + 5;
  }

  // ---- APPENDIX: FÖRESLAGNA PARTNERS ----
  if (data.suggestedPartners && data.suggestedPartners.length > 0 && data.suggestedCompareUrl) {
    const { appendSuggestedPartnersPage } = await import("./pdfSuggestedPartners");
    appendSuggestedPartnersPage(doc, data.suggestedPartners, {
      compareUrl: data.suggestedCompareUrl,
      productLabel: data.productName,
      industry: data.suggestedIndustry ?? null,
    });
  }


  // ---- FOOTER on every page ----
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setDrawColor(...BRAND_PETROL);
    doc.setLineWidth(0.3);
    doc.line(margin, pageH - 13, pageW - margin, pageH - 13);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(data.pageUrl, margin, pageH - 8);
    doc.text(`Sida ${i} av ${total}`, pageW - margin, pageH - 8, { align: "right" });
  }

  doc.save(data.fileName);
}
