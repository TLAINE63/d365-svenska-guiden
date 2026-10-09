import type { jsPDF } from "jspdf";
import { PDF_BRAND as B, type RGB } from "./pdfBrand";
import { drawBrandHeader, finalizePdfWithFooter, drawSectionHeading, PDF_MARGIN as M } from "./pdfLayout";
import { NAV_PATH_TEXT, NAV_QUESTIONS, NAV_UNSAFE_TEXT, type NavAnswers, type NavResult } from "@/lib/navBcDecision";

/** jsPDF:s standardtypsnitt saknar vissa tecken; ersätt dem säkert. */
const t = (s: string) => s.replace(/→/g, ">").replace(/[“”]/g, '"').replace(/\u00A0/g, " ");

export async function generateNavBcResultPdf(result: NavResult, answers: NavAnswers) {
  const { default: JsPDF } = await import("jspdf");
  const doc: jsPDF = new JsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const CW = W - 2 * M;
  const date = new Date().toISOString().slice(0, 10);
  const path = NAV_PATH_TEXT[result.path];
  let y = drawBrandHeader(doc, "NAV till Business Central – resultat");

  const ensure = (need: number) => {
    if (y + need > H - 20) { doc.addPage(); y = M + 4; }
  };
  const para = (text: string, size = 10, color: RGB = B.text, indent = 0, lh = 4.8) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(size); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(t(text), CW - indent);
    ensure(lines.length * lh);
    doc.text(lines, M + indent, y);
    y += lines.length * lh;
  };

  // Meta-rad
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(...B.textMuted);
  doc.text(`Skapad ${date}`, M, y);
  doc.text("Ett första beslutsunderlag baserat på era egna svar", W - M, y, { align: "right" });
  y += 8;

  // Huvudkort
  doc.setFont("helvetica", "bold"); doc.setFontSize(17);
  const titleLines = doc.splitTextToSize(t(path.title), CW - 16);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10.5);
  const bodyLines = doc.splitTextToSize(t(path.body), CW - 16);
  const nextLines = doc.splitTextToSize(t(path.next), CW - 16);
  const cardH = 22 + titleLines.length * 7.2 + bodyLines.length * 5 + 10 + nextLines.length * 4.8 + 6;
  doc.setFillColor(...B.cardBg); doc.setDrawColor(...B.cardBorder); doc.setLineWidth(0.3);
  doc.roundedRect(M, y, CW, cardH, 3, 3, "FD");
  doc.setFillColor(...B.primary); doc.rect(M, y, 2.2, cardH, "F");
  let cy = y + 9;
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(...B.accent);
  doc.text("ER REKOMMENDERADE VÄG", M + 8, cy);
  // Vägindikator A/B/C
  (["A", "B", "C"] as const).forEach((p, i) => {
    const x = W - M - 8 - (2 - i) * 15 - 12;
    const on = p === result.path;
    doc.setFillColor(...(on ? B.primary : B.cardBorder));
    doc.roundedRect(x, cy - 4, 12, 5.5, 2.7, 2.7, "F");
    doc.setFontSize(8); doc.setTextColor(...(on ? ([255, 255, 255] as RGB) : B.textMuted));
    doc.text(p, x + 6, cy, { align: "center" });
  });
  cy += 9;
  doc.setFont("helvetica", "bold"); doc.setFontSize(17); doc.setTextColor(...B.dark);
  doc.text(titleLines, M + 8, cy); cy += titleLines.length * 7.2 + 1;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); doc.setTextColor(...B.text);
  doc.text(bodyLines, M + 8, cy); cy += bodyLines.length * 5 + 5;
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(...B.primary);
  doc.text("NÄSTA STEG", M + 8, cy); cy += 5;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...B.text);
  doc.text(nextLines, M + 8, cy);
  y += cardH + 8;

  // Vägspecifika tillägg
  if (result.path === "B") {
    const steps = ["Behåll", "Standard", "App", "Avveckla"];
    let x = M;
    doc.setFontSize(9.5);
    steps.forEach((s, i) => {
      const w = doc.getTextWidth(s) + 10;
      doc.setFillColor(255, 255, 255); doc.setDrawColor(...B.accent);
      doc.roundedRect(x, y - 4.5, w, 7, 3.5, 3.5, "FD");
      doc.setFont("helvetica", "bold"); doc.setTextColor(...B.accent);
      doc.text(s, x + w / 2, y, { align: "center" });
      x += w;
      if (i < steps.length - 1) { doc.setTextColor(...B.textMuted); doc.text(">", x + 3, y); x += 8; }
    });
    y += 11;
  }
  if (result.path === "C") {
    const half = (CW - 5) / 2;
    const alts = [["Alternativ A", "Migrera och modernisera befintlig NAV"], ["Alternativ B", "Implementera Business Central utifrån dagens behov och migrera utvald data"]];
    alts.forEach(([h, txt], i) => {
      const x = M + i * (half + 5);
      doc.setFillColor(255, 255, 255); doc.setDrawColor(...B.cardBorder);
      doc.roundedRect(x, y, half, 22, 2, 2, "FD");
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(...B.accent);
      doc.text(h, x + 5, y + 7);
      doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(...B.text);
      doc.text(doc.splitTextToSize(t(txt), half - 10), x + 5, y + 12.5);
    });
    y += 30;
  }

  // Vet inte
  if (result.unknowns.length) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
    const head = result.unsafe ? NAV_UNSAFE_TEXT : "Det finns delar av er NAV-miljö som först behöver kartläggas.";
    const lines = result.unknowns.map((u) => doc.splitTextToSize(t(u), CW - 16));
    const headLines = doc.splitTextToSize(t(head), CW - 12);
    const h = 9 + headLines.length * 5 + lines.reduce((a, l) => a + l.length * 4.6 + 1.5, 0) + 3;
    ensure(h + 4);
    doc.setFillColor(236, 246, 243); doc.setDrawColor(...B.accent);
    doc.roundedRect(M, y, CW, h, 2, 2, "FD");
    let iy = y + 7;
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(...B.dark);
    doc.text(headLines, M + 6, iy); iy += headLines.length * 5 + 1;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(...B.text);
    lines.forEach((l) => { doc.setFillColor(...B.accent); doc.circle(M + 7.5, iy - 1.2, 0.8, "F"); doc.text(l, M + 10, iy); iy += l.length * 4.6 + 1.5; });
    y += h + 8;
  }

  // Utgångsläge
  if (result.situation.length) {
    ensure(20); y = drawSectionHeading(doc, "Ert utgångsläge", y + 2);
    para(result.situation.join(", ").replace(/^./, (c) => c.toUpperCase()) + ".", 10, B.text);
    y += 6;
  }

  // Faktorer som chips
  if (result.factors.length) {
    ensure(22); y = drawSectionHeading(doc, "Det som främst påverkar bedömningen", y + 2);
    let x = M; doc.setFontSize(9.5);
    result.factors.forEach((f) => {
      doc.setFont("helvetica", "normal");
      const w = doc.getTextWidth(t(f)) + 9;
      if (x + w > W - M) { x = M; y += 9; }
      doc.setFillColor(...B.cardBg); doc.setDrawColor(...B.cardBorder);
      doc.roundedRect(x, y - 4.6, w, 7, 3.5, 3.5, "FD");
      doc.setTextColor(...B.dark); doc.text(t(f), x + 4.5, y);
      x += w + 3;
    });
    y += 12;
  }

  const list = (title: string, items: string[], numbered: boolean) => {
    ensure(24); y = drawSectionHeading(doc, title, y + 2);
    items.forEach((it, i) => {
      doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      const lines = doc.splitTextToSize(t(it), CW - 10);
      ensure(lines.length * 4.8 + 3);
      if (numbered) {
        doc.setFillColor(...B.primary); doc.circle(M + 2.6, y - 1.3, 2.6, "F");
        doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
        doc.text(String(i + 1), M + 2.6, y - 0.2, { align: "center" });
      } else {
        doc.setDrawColor(...B.accent); doc.setLineWidth(0.6);
        doc.line(M + 0.8, y - 1.4, M + 2, y - 0.2); doc.line(M + 2, y - 0.2, M + 4.4, y - 3);
      }
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...B.text);
      doc.text(lines, M + 8, y);
      y += lines.length * 4.8 + 2.5;
    });
    y += 5;
  };
  list("Det här bör ni undersöka först", result.investigate, false);
  list("Frågor att ta med till en Business Central-partner", result.partnerQuestions, true);

  // Svarsbilaga
  ensure(30); y = drawSectionHeading(doc, "Era svar", y + 2);
  NAV_QUESTIONS.forEach((q, i) => {
    const v = answers[q.id];
    const vals = Array.isArray(v) ? v : v ? [v] : [];
    const ans = vals.map((x) => q.options.find((o) => o.value === x)?.label ?? x).join(", ") || "Ej besvarad";
    doc.setFontSize(9);
    const ql = doc.splitTextToSize(t(`${i + 1}. ${q.question}`), CW * 0.55);
    const al = doc.splitTextToSize(t(ans), CW * 0.42);
    const rh = Math.max(ql.length, al.length) * 4.3 + 3;
    ensure(rh);
    if (i % 2 === 0) { doc.setFillColor(...B.cardBg); doc.rect(M, y - 4, CW, rh, "F"); }
    doc.setFont("helvetica", "normal"); doc.setTextColor(...B.textMuted); doc.text(ql, M + 2, y);
    doc.setFont("helvetica", "bold"); doc.setTextColor(...B.dark); doc.text(al, M + CW * 0.57, y);
    y += rh;
  });
  y += 6;

  // Friskrivning
  para(
    "Bedömningen bygger enbart på era svar och d365.se:s regler. Den är ett första beslutsunderlag, inte en teknisk förstudie eller offert. Versionskrav och uppgraderingsvägar för en specifik NAV-version bör bekräftas av Microsoft eller en partner.",
    8, B.textMuted, 0, 3.8,
  );
  y += 3;
  doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(...B.primary);
  ensure(5); doc.textWithLink("d365.se/nav-till-business-central/", M, y, { url: "https://d365.se/nav-till-business-central/" });

  finalizePdfWithFooter(doc, "NAV till Business Central");
  doc.save(`nav-till-business-central-resultat-${date}.pdf`);
}
