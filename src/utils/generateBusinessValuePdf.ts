import { createPdfDocument } from "@/utils/pdfDocument";
import { drawBrandHeader, drawSectionHeading, finalizePdfWithFooter, PDF_MARGIN } from "@/utils/pdfLayout";
import { PDF_BRAND } from "@/utils/pdfBrand";
import { formatDateYYYYMMDD } from "@/lib/utils";
import {
  evaluateBusinessValue, workRowValue, capitalRowValue, AREAS_TO_EVALUATE, type CashFlowResult, leakRowValue, challengeRowValue, costRowValue, type BusinessValueInput,
} from "@/lib/businessValue";

const fmt = (n: number) => new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(Math.round(n)) + " kr";

export interface BusinessValuePdfData {
  productName: string;
  industry: string;
  companyName?: string;
  input: BusinessValueInput;
  ramp: number[];
  fiveYear: number;
  cash?: CashFlowResult;
  top?: { id: string; label: string; value: number }[];
}

export async function generateBusinessValuePdf(d: BusinessValuePdfData) {
  const doc = await createPdfDocument();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const w = pageW - PDF_MARGIN * 2;
  const title = `Verksamhetsvärdering - ${d.productName}`;
  let y = drawBrandHeader(doc, title);
  const r = evaluateBusinessValue(d.input);
  const space = (h: number) => { if (y + h > pageH - 20) { doc.addPage(); y = drawBrandHeader(doc, title); } };
  const text = (s: string, size = 10, bold = false, color: [number, number, number] = PDF_BRAND.dark) => {
    doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(size); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(s, w); space(lines.length * size * 0.45 + 2); doc.text(lines, PDF_MARGIN, y); y += lines.length * size * 0.45 + 2;
  };
  const row = (label: string, value: string, bold = false) => {
    space(6); doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(9.5); doc.setTextColor(...PDF_BRAND.dark);
    const lines = doc.splitTextToSize(label, w - 45); doc.text(lines, PDF_MARGIN, y); doc.text(value, pageW - PDF_MARGIN, y, { align: "right" });
    y += lines.length * 4.3 + 1.5;
  };

  text(d.companyName ? `Underlag för ${d.companyName}` : "Indikativt underlag", 14, true);
  text(`Bransch: ${d.industry || "Ej vald"} · Skapad ${formatDateYYYYMMDD(new Date())}`, 9, false, [110, 110, 110]);
  y += 3;
  y = drawSectionHeading(doc, "Sammanfattning", y + 2);
  row("Möjlig nytta per år (full effekt)", fmt(r.total), true);
  row("Frigjord tid per år", `${Math.round(r.hoursFreed)} timmar`);
  row(`Nytta över 5 år med realiseringstakt (${d.ramp.map((f) => Math.round(f * 100) + " %").join(", ")})`, fmt(d.fiveYear), true);
  if (d.cash) {
    row("Nuvärde (NPV, 5 %)", fmt(d.cash.npv));
    row("Internränta (IRR)", d.cash.irr === null ? "-" : `${Math.round(d.cash.irr * 100)} %`);
    row("Återbetalning", d.cash.paybackMonths === null ? "Inte inom 5 år" : `${Math.max(1, Math.round(d.cash.paybackMonths))} mån`);
    y += 2; y = drawSectionHeading(doc, "Kassaflöde år för år", y + 2);
    d.cash.rows.forEach((c) => row(`År ${c.year}: nytta ${fmt(c.benefit)}, projekt ${fmt(c.project)}, licenser ${fmt(c.running)}`, `netto ${fmt(c.net)}`));
  }
  if (d.top?.length) {
    y += 2; space(16); y = drawSectionHeading(doc, "Största affärspotential", y + 2);
    d.top.forEach((t, i) => row(`${i + 1}. ${t.label}${AREAS_TO_EVALUATE[t.id] ? ` (utvärdera: ${AREAS_TO_EVALUATE[t.id]})` : ""}`, `${fmt(t.value)}/år`));
  }

  const section = (h: string, total: number, items: { label: string; value: number }[]) => {
    y += 2; space(16); y = drawSectionHeading(doc, `${h} · ${fmt(total)}/år`, y + 2);
    items.filter((i) => i.value > 0).forEach((i) => row(i.label, fmt(i.value)));
    if (!items.some((i) => i.value > 0)) text("Inga värden ifyllda.", 9, false, [110, 110, 110]);
  };
  section("1. Manuellt arbete", r.work, d.input.work.map((x) => ({ label: `${x.label} (${x.minutes} min × ${x.perMonth}/mån, ${x.savingPct} %)`, value: workRowValue(x, d.input.hourlyCost) })));
  section("2. Förlorade affärer", r.leakage, d.input.leakage.map((x) => ({ label: `${x.label} (${fmt(x.value)} × ${x.perYear}/år, ${x.savingPct} %)`, value: leakRowValue(x, d.input.marginPct) })));
  section("3. Verksamhetsutmaningar", r.challenges, d.input.challenges.map((x) => ({ label: `${x.label} (${fmt(x.yearly)}, ${x.savingPct} %)`, value: challengeRowValue(x) })));
  section("4. Kostnader som ersätts", r.itFees, d.input.itFees.map((x) => ({ label: `${x.label} (${fmt(x.yearly)}, ${x.savingPct} %)`, value: costRowValue(x) })));

  section("5. Rörelsekapital", r.workingCapital, (d.input.workingCapital ?? []).map((x) => ({ label: `${x.label} (${fmt(x.yearly)}, ${x.savingPct} %)`, value: capitalRowValue(x, d.input.capitalRatePct) })));
  section("6. AI, Copilot och agenter", r.ai, [{ label: `${d.input.aiPct ?? 0} % av återstående manuell tid`, value: r.ai }]);
  y += 2; space(30); y = drawSectionHeading(doc, "Antaganden", y + 2);
  text(`Intern kostnad ${fmt(d.input.hourlyCost)} per timme, täckningsgrad ${d.input.marginPct} % på förlorad försäljning.`, 9);
  text("Spärrar: högst 80 % sparad tid per moment, högst 75 % räddade affärer, högst 30 % av en verksamhetsutmaning. Allt utom ersatta kostnader räknas ned med 15 % för införandeförluster. AI räknas bara på tid som återstår efter systembytet (högst 50 %). Rörelsekapital värderas med kapitalkostnaden och högst 30 % minskning. NPV med 5 % kalkylränta.", 9);
  text("Indikativt underlag från d365.se. Verkligt utfall beror på processer, förändringsledning och vald partner.", 9, false, [110, 110, 110]);

  finalizePdfWithFooter(doc, title);
  doc.save(`verksamhetsvardering-${d.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${formatDateYYYYMMDD(new Date())}.pdf`);
}
