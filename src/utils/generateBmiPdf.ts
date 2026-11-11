import { createPdfDocument } from "@/utils/pdfDocument";
import { PDF_BRAND } from "./pdfBrand";
import { drawBrandHeader, drawSectionHeading, PDF_MARGIN } from "./pdfLayout";
import {
  BMI_B0, BMI_B5, BMI_NO_ACTIONS_TEXT, BMI_QUESTIONS, BMI_RESULT_FOOTER, BMI_SECTIONS, bmiQuestionText,
  type BmiArea, type BmiResponse,
} from "@/lib/bmi";

export async function generateBmiPdf(result: BmiResponse, input: { b0: BmiArea; b5: number; answers: Record<string, number> }, date: string) {
  const doc = await createPdfDocument();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const W = pageW - PDF_MARGIN * 2;
  const title = "Beslutsmognadsindex";
  let y = drawBrandHeader(doc, title, `Genomfört ${date}`);

  const ensure = (h: number) => {
    if (y + h > pageH - 18) { doc.addPage(); y = drawBrandHeader(doc, title, `Genomfört ${date}`); }
  };
  const para = (text: string, size = 10, color = PDF_BRAND.dark, indent = 0, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(size); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, W - indent);
    const h = lines.length * size * 0.45;
    ensure(h + 2);
    doc.text(lines, PDF_MARGIN + indent, y);
    y += h + 2;
  };
  const heading = (t: string) => { ensure(16); y += 4; y = drawSectionHeading(doc, t, y); };

  // 1. Index
  doc.setFont("helvetica", "bold"); doc.setFontSize(34); doc.setTextColor(...PDF_BRAND.primary);
  doc.text(String(result.total), PDF_MARGIN, y + 10);
  const tw = doc.getTextWidth(String(result.total));
  doc.setFontSize(11); doc.setTextColor(...PDF_BRAND.textMuted); doc.setFont("helvetica", "normal");
  doc.text("av 100", PDF_MARGIN + tw + 3, y + 10);
  doc.setFont("helvetica", "bold"); doc.setTextColor(...PDF_BRAND.dark);
  doc.text(result.level, PDF_MARGIN + tw + 22, y + 10);
  y += 18;
  para(result.summary);
  const areaLabel = BMI_B0.options.find((o) => o.value === input.b0)?.label ?? "";
  const stageLabel = BMI_B5.options.find((o) => o.value === input.b5)?.label ?? "";
  para(`Område: ${areaLabel}  |  Skede: ${stageLabel}`, 9, PDF_BRAND.textMuted);

  // 2. Profil
  heading("Er profil");
  for (const s of result.sections) {
    ensure(s.note ? 14 : 10);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...PDF_BRAND.dark);
    doc.text(s.name, PDF_MARGIN, y);
    doc.text(String(s.score), pageW - PDF_MARGIN, y, { align: "right" });
    const bx = PDF_MARGIN + 45, bw = W - 45 - 12;
    doc.setFillColor(230, 230, 230); doc.rect(bx, y - 3, bw, 3, "F");
    if (s.counted) doc.setFillColor(...PDF_BRAND.primary); else doc.setFillColor(190, 190, 190);
    doc.rect(bx, y - 3, (bw * s.score) / 100, 3, "F");
    y += 6;
    if (s.note) para(s.note, 8.5, PDF_BRAND.textMuted, 45);
  }

  // 3. Strength
  if (result.strength) {
    heading("Ert starkaste område");
    para(BMI_SECTIONS.find((s) => s.id === result.strength!.id)!.name, 10.5, PDF_BRAND.dark, 0, true);
    para(result.strength.text);
  }

  // 4. Actions
  heading("Tre saker att ta tag i härnäst");
  if (result.actions.length === 0) para(BMI_NO_ACTIONS_TEXT);
  result.actions.forEach((a, i) => { para(`${i + 1}. ${a.title}`, 10.5, PDF_BRAND.dark, 0, true); para(a.text, 10, PDF_BRAND.dark, 5); y += 1; });

  // 5. Warnings
  if (result.warnings.length) {
    heading("Värt att uppmärksamma");
    for (const w of result.warnings) {
      const start = y;
      para(w.text, 10, PDF_BRAND.dark, 4);
      doc.setFillColor(...PDF_BRAND.primary); doc.rect(PDF_MARGIN, start - 3.5, 0.8, y - start, "F");
      y += 1;
    }
  }

  // 6. Partner questions
  heading("Frågor att ställa till partners");
  para("Utifrån era svar är det här frågor som är värda att ställa i kommande möten.", 9.5, PDF_BRAND.textMuted);
  result.partner_questions.forEach((q, i) => para(`${i + 1}. ${q.text}`));

  // 7. Read more
  if (result.read_more.length) {
    heading("Läs vidare");
    for (const r of result.read_more) para(`${r.title}: https://d365.se${r.url}`);
  }

  // 8. Answers
  heading("Era svar");
  for (const s of BMI_SECTIONS) {
    para(s.name, 10.5, PDF_BRAND.dark, 0, true);
    for (const qid of s.questions) {
      const q = BMI_QUESTIONS.find((x) => x.id === qid)!;
      para(bmiQuestionText(q.text, input.b0), 9.5, PDF_BRAND.textMuted);
      para(q.options[input.answers[qid]], 10, PDF_BRAND.dark, 4);
    }
    y += 2;
  }

  // Footer on every page
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setDrawColor(...PDF_BRAND.primary); doc.setLineWidth(0.4);
    doc.line(PDF_MARGIN, pageH - 12, pageW - PDF_MARGIN, pageH - 12);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(...PDF_BRAND.textMuted);
    doc.text(BMI_RESULT_FOOTER, PDF_MARGIN, pageH - 7);
    doc.text(`Sida ${i} av ${total}`, pageW - PDF_MARGIN, pageH - 7, { align: "right" });
  }
  doc.setProperties({ title });
  doc.save(`Beslutsmognadsindex_${date}.pdf`);
}
