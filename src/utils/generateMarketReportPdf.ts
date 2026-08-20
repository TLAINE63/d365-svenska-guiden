// Branded PDF- och CSV-export av rapporten
// "Dynamics 365 Partner Landscape Sweden 2026" (/rapporter/dynamics-365-partnersverige-2026/).

import { PDF_BRAND } from "./pdfBrand";
import {
  drawBrandHeader,
  drawSectionHeading,
  finalizePdfWithFooter,
  PDF_MARGIN,
} from "./pdfLayout";
import {
  REPORT_STATS,
  REPORT_FAQ,
  REPORT_UPDATED,
  type ReportStat,
} from "@/data/partnerMarketReport2026";

const GROUP_TITLES: Record<ReportStat["group"], string> = {
  overblick: "Överblick",
  produkt: "Partners per produktområde",
  bransch: "Partners per bransch",
  storlek: "Partners per storlek",
};

const GROUP_ORDER: ReportStat["group"][] = [
  "overblick",
  "produkt",
  "bransch",
  "storlek",
];

// jsPDF:s inbyggda helvetica använder WinAnsi – ersätt tecken utanför uppsättningen.
const safe = (s: string): string =>
  s
    .replace(/\u00A0/g, " ")
    .replace(/\u00AD/g, "")
    .replace(/\u200B/g, "")
    .replace(/\u2011/g, "-")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2248/g, "ca ")
    .replace(/\u2026/g, "...")
    .replace(/\u2022/g, "-");

const REPORT_TITLE = "Dynamics 365 Partner Landscape Sweden 2026";

/** Laddar ner rapportens statistik som CSV (semikolon = Excel sv-SE). */
export function downloadMarketReportCsv(
  stats: ReportStat[] = REPORT_STATS,
): void {
  const esc = (v: string | number) =>
    `"${String(v).replace(/"/g, '""')}"`;

  const rows: string[] = [
    ["Kategori", "Nyckeltal", "Antal", "Kommentar"].map(esc).join(";"),
    ...stats.map((s) =>
      [GROUP_TITLES[s.group], s.label, s.value, s.note].map(esc).join(";"),
    ),
    "",
    [esc("Källa"), esc(`d365.se – ${REPORT_TITLE}`)].join(";"),
    [esc("Uppdaterad"), esc(REPORT_UPDATED)].join(";"),
  ];

  const blob = new Blob(["\uFEFF" + rows.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dynamics-365-partner-landscape-sweden-2026.csv";
  a.click();
  URL.revokeObjectURL(url);
}

/** Genererar och laddar ner rapporten som brandad PDF. */
export async function generateMarketReportPdf(
  stats: ReportStat[] = REPORT_STATS,
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - PDF_MARGIN * 2;

  let y = drawBrandHeader(doc, safe(REPORT_TITLE));

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = drawBrandHeader(doc, safe(REPORT_TITLE));
    }
  };

  // Ingress
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...PDF_BRAND.textMuted);
  const intro = safe(
    `Rapport från d365.se om den svenska Dynamics 365-partnermarknaden. Uppdaterad ${REPORT_UPDATED}. ` +
      "En partner kan räknas i flera kategorier eftersom många täcker både flera produktområden och flera branscher.",
  );
  const introLines = doc.splitTextToSize(intro, contentW) as string[];
  doc.text(introLines, PDF_MARGIN, y);
  y += introLines.length * 4.6 + 6;

  const max = Math.max(...stats.map((s) => s.value), 1);

  for (const group of GROUP_ORDER) {
    const rows = stats.filter((s) => s.group === group);
    if (rows.length === 0) continue;

    ensureSpace(20);
    y = drawSectionHeading(doc, safe(GROUP_TITLES[group]), y);

    for (const s of rows) {
      ensureSpace(18);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...PDF_BRAND.text);
      doc.text(safe(s.label), PDF_MARGIN, y);
      doc.text(String(s.value), pageW - PDF_MARGIN, y, { align: "right" });

      // Stapel
      const barY = y + 2;
      doc.setFillColor(...PDF_BRAND.cardBorder);
      doc.rect(PDF_MARGIN, barY, contentW, 1.6, "F");
      doc.setFillColor(...PDF_BRAND.accent);
      doc.rect(PDF_MARGIN, barY, (contentW * s.value) / max, 1.6, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...PDF_BRAND.textMuted);
      const noteLines = doc.splitTextToSize(safe(s.note), contentW) as string[];
      doc.text(noteLines, PDF_MARGIN, barY + 5.5);
      y = barY + 5.5 + noteLines.length * 3.9 + 4;
    }

    y += 2;
  }

  // FAQ
  ensureSpace(24);
  y = drawSectionHeading(doc, "Vanliga fragor", y);
  for (const f of REPORT_FAQ) {
    ensureSpace(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...PDF_BRAND.text);
    const qLines = doc.splitTextToSize(safe(f.q), contentW) as string[];
    doc.text(qLines, PDF_MARGIN, y);
    y += qLines.length * 4.4 + 1.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...PDF_BRAND.textMuted);
    const aLines = doc.splitTextToSize(safe(f.a), contentW) as string[];
    doc.text(aLines, PDF_MARGIN, y);
    y += aLines.length * 3.9 + 5;
  }

  // Källa / CTA
  ensureSpace(24);
  doc.setFillColor(...PDF_BRAND.cardBg);
  doc.setDrawColor(...PDF_BRAND.cardBorder);
  doc.roundedRect(PDF_MARGIN, y, contentW, 18, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...PDF_BRAND.text);
  doc.text("Hitta ratt partner for ert projekt", PDF_MARGIN + 5, y + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...PDF_BRAND.textMuted);
  doc.text(
    safe(
      "Gör en kostnadsfri behovsanalys på d365.se/valjdynamics365partner/ och jämför svenska Dynamics 365-partners.",
    ),
    PDF_MARGIN + 5,
    y + 13,
  );

  finalizePdfWithFooter(doc, safe(`d365.se · ${REPORT_TITLE}`));
  doc.save("dynamics-365-partner-landscape-sweden-2026.pdf");
}
