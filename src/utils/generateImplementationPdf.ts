// Branded PDF-export för pris- och omfattningskalkylatorn på /implementationskalkylator/.
// Följer samma brand-layout som övriga d365.se-PDF:er (mörk header, orange accent).

import { PDF_BRAND } from "./pdfBrand";
import { drawBrandHeader, drawSectionHeading, finalizePdfWithFooter, PDF_MARGIN } from "./pdfLayout";
import type { EstimateResult } from "@/lib/implementationEstimate";

const fmtSek = (n: number) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";

// jsPDF:s inbyggda helvetica använder WinAnsi – ersätt tecken utanför den uppsättningen.
const safe = (s: string): string =>
  s
    .replace(/\u00A0/g, " ")
    .replace(/\u00AD/g, "")
    .replace(/\u200B/g, "")
    .replace(/\u2011/g, "-")
    .replace(/\u2248/g, "ca ")
    .replace(/\u2212/g, "-")
    .replace(/\u2192/g, "->")
    .replace(/\u2026/g, "...")
    .replace(/\u2022/g, "-");

export interface ImplementationPdfData {
  result: EstimateResult;
  /** Rader med besökarens val, t.ex. { label: "Antal användare", value: "25 st" } */
  inputs: { label: string; value: string }[];
  /** Valda lösningar som text, t.ex. "Business Central, Sales (CRM)" */
  solutionsLabel: string;
  assumptions: string[];
  pageUrl: string;
  fileName?: string;
}

export async function generateImplementationPdf(data: ImplementationPdfData): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - PDF_MARGIN * 2;
  const r = data.result;

  let y = drawBrandHeader(doc, "Prisuppskattning: Dynamics 365-implementation");

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = drawBrandHeader(doc, "Prisuppskattning: Dynamics 365-implementation");
    }
  };

  const dateStr = new Intl.DateTimeFormat("sv-SE").format(new Date()).replace(/-/g, "/");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...PDF_BRAND.textMuted);
  doc.text(safe(`Framtagen ${dateStr} - vägledande estimat, inte en offert.`), PDF_MARGIN, y);
  y += 8;

  // ---- Sammanfattning ----
  y = drawSectionHeading(doc, "Sammanfattning", y + 2);

  doc.setFillColor(...PDF_BRAND.cardBg);
  doc.setDrawColor(...PDF_BRAND.cardBorder);
  doc.roundedRect(PDF_MARGIN, y, contentW, 30, 2, 2, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_BRAND.textMuted);
  doc.text("Implementation (engångskostnad)", PDF_MARGIN + 5, y + 8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...PDF_BRAND.dark);
  doc.text(safe(`${fmtSek(r.costLow)} - ${fmtSek(r.costHigh)}`), PDF_MARGIN + 5, y + 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...PDF_BRAND.textMuted);
  doc.text(
    safe(
      `Ca ${new Intl.NumberFormat("sv-SE").format(r.hours)} konsulttimmar (mittvärde ${fmtSek(
        r.costMid,
      )}) - tidplan ca ${String(r.months).replace(".", ",")} månader.`,
    ),
    PDF_MARGIN + 5,
    y + 24,
  );
  y += 38;

  // ---- Lösningar & förutsättningar ----
  ensureSpace(30);
  y = drawSectionHeading(doc, "Era förutsättningar", y);

  const rows: { label: string; value: string }[] = [
    { label: "Valda lösningar", value: data.solutionsLabel },
    ...data.inputs,
  ];

  doc.setFontSize(10);
  for (const row of rows) {
    ensureSpace(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_BRAND.textMuted);
    const labelLines = doc.splitTextToSize(safe(row.label), contentW * 0.5);
    doc.text(labelLines, PDF_MARGIN, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_BRAND.dark);
    const valueLines = doc.splitTextToSize(safe(row.value), contentW * 0.45);
    doc.text(valueLines, pageW - PDF_MARGIN, y, { align: "right" });
    const lines = Math.max(labelLines.length, valueLines.length);
    y += lines * 5 + 2;
    doc.setDrawColor(...PDF_BRAND.cardBorder);
    doc.setLineWidth(0.2);
    doc.line(PDF_MARGIN, y - 2.5, pageW - PDF_MARGIN, y - 2.5);
  }
  y += 6;

  // ---- Kostnadsbild ----
  ensureSpace(40);
  y = drawSectionHeading(doc, "Kostnadsbild", y);

  const costRows: { label: string; value: string; strong?: boolean }[] = [
    {
      label: "Licenskostnad per månad",
      value: r.licenseMonthly == null ? "Offert" : fmtSek(r.licenseMonthly),
    },
    {
      label: "Licenskostnad per år",
      value: r.licenseYearly == null ? "Offert" : fmtSek(r.licenseYearly),
    },
    { label: "Förvaltning per år (ca 15 %)", value: fmtSek(r.supportYearly) },
    { label: "Implementation (mittvärde)", value: fmtSek(r.costMid) },
    {
      label: "Total kostnad över 3 år",
      value: r.threeYearTotal == null ? "Offert" : fmtSek(r.threeYearTotal),
      strong: true,
    },
  ];

  doc.setFontSize(10);
  for (const row of costRows) {
    ensureSpace(8);
    doc.setFont("helvetica", row.strong ? "bold" : "normal");
    doc.setTextColor(...(row.strong ? PDF_BRAND.dark : PDF_BRAND.textMuted));
    doc.text(safe(row.label), PDF_MARGIN, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PDF_BRAND.dark);
    doc.text(safe(row.value), pageW - PDF_MARGIN, y, { align: "right" });
    y += 7;
    doc.setDrawColor(...PDF_BRAND.cardBorder);
    doc.setLineWidth(0.2);
    doc.line(PDF_MARGIN, y - 2.5, pageW - PDF_MARGIN, y - 2.5);
  }
  y += 6;

  // ---- Fasfördelning ----
  ensureSpace(30);
  y = drawSectionHeading(doc, "Fördelning per fas", y);

  doc.setFontSize(10);
  for (const p of r.phases) {
    ensureSpace(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...PDF_BRAND.dark);
    doc.text(safe(p.name), PDF_MARGIN, y);
    doc.setTextColor(...PDF_BRAND.textMuted);
    doc.text(safe(`${p.hours} tim - ${fmtSek(p.cost)}`), pageW - PDF_MARGIN, y, { align: "right" });
    y += 2.5;
    doc.setFillColor(...PDF_BRAND.cardBorder);
    doc.roundedRect(PDF_MARGIN, y, contentW, 1.6, 0.8, 0.8, "F");
    doc.setFillColor(...PDF_BRAND.accent);
    doc.roundedRect(PDF_MARGIN, y, contentW * p.share, 1.6, 0.8, 0.8, "F");
    y += 8;
  }
  y += 4;

  // ---- Antaganden ----
  ensureSpace(30);
  y = drawSectionHeading(doc, "Så räknar vi - helt öppet", y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...PDF_BRAND.textMuted);
  for (const a of data.assumptions) {
    const lines = doc.splitTextToSize(safe(`- ${a}`), contentW);
    ensureSpace(lines.length * 5 + 3);
    doc.text(lines, PDF_MARGIN, y);
    y += lines.length * 5 + 2;
  }
  y += 4;

  // ---- Disclaimer ----
  ensureSpace(26);
  doc.setFillColor(...PDF_BRAND.warningBg);
  doc.setDrawColor(...PDF_BRAND.warningBorder);
  doc.roundedRect(PDF_MARGIN, y, contentW, 20, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...PDF_BRAND.warningText);
  doc.text("Vägledande estimat - inte en offert", PDF_MARGIN + 5, y + 7);
  doc.setFont("helvetica", "normal");
  const disc = doc.splitTextToSize(
    safe(
      `Underlaget bygger på öppna antaganden och publicerade listpriser. Verklig kostnad fastställs först efter en förstudie hos vald partner. Beräknat på ${data.pageUrl}`,
    ),
    contentW - 10,
  );
  doc.text(disc, PDF_MARGIN + 5, y + 12);

  finalizePdfWithFooter(doc, "Pris- och omfattningskalkylator");
  doc.save(data.fileName ?? "d365-prisuppskattning.pdf");
}
