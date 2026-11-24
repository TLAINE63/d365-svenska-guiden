import { createPdfDocument, wrapPdfText } from "@/utils/pdfDocument";
import { drawBrandHeader, drawSectionHeading, finalizePdfWithFooter, PDF_MARGIN } from "@/utils/pdfLayout";
import { PDF_BRAND } from "@/utils/pdfBrand";
import { drawPremiumPriceTable } from "./pdfPremiumPricing";
import { MONTH_PRICE, YEAR_PRICE, ISV_FEES } from "@/lib/budget2027";
import { ORGANIZATION } from "@/data/organization";
import { PARTNER_PROFILE_TERMS, PARTNER_FEE_NOTE, PREMIUM_BENEFITS, PREMIUM_BENEFITS_TITLE, ISV_BENEFITS, ISV_BENEFITS_TITLE } from "./partnerProfileTerms";

export interface AgreementPdfSection { title: string; body: string }

const kr = (n: number) => `${n.toLocaleString("sv-SE")} kr`;
const today = () => new Date().toISOString().slice(0, 10);

/** Prisbilaga från samma priser som Partnerprogram och Budget 2027. */
export function agreementPriceRows(): [string, string][] {
  return [
    ["Premium, 1 produktområde", `${kr(MONTH_PRICE[1])}/mån eller ${kr(YEAR_PRICE[1])}/år`],
    ["Premium, 2 produktområden", `${kr(MONTH_PRICE[2])}/mån eller ${kr(YEAR_PRICE[2])}/år`],
    ["Premium, 3 produktområden", `${kr(MONTH_PRICE[3])}/mån eller ${kr(YEAR_PRICE[3])}/år`],
    ["ISV Presence, grundavgift", `${kr(ISV_FEES.base)}/år`],
    ["Finder’s fee, band 1: Business Central, fristående Power Platform och Copilot", "Mötesavgift 1 000 kr (Premium) / 3 000 kr (Grundprofil)"],
    ["Finder’s fee, band 2: CRM", "Mötesavgift 1 500 kr (Premium) / 4 000 kr (Grundprofil)"],
    ["Finder’s fee, band 3: Finance, SCM, Project Operations, Commerce, Human Resources", "Mötesavgift 2 000 kr (Premium) / 5 000 kr (Grundprofil)"],
    ["Gäller", "Nya projekt, partnerbyte och expertförmedling (per expert, efter intervju)"],
    ["Avgift vid affär", "2,5 % av fakturerat konsult- och projektvärde under de första 12 månaderna, högst 100 000 kr per affär"],
  ];
}

/** Partneravtalet som PDF i samma layout som sajtens övriga rapporter. Avtalstexten kommer från avtalssidans redigerade avsnitt. */
export async function generatePartnerAgreementPdf(opts: { heading: string; intro?: string; sections: AgreementPdfSection[]; partnerName?: string; priceRows?: [string, string][]; priceNote?: string; acceptance?: string; benefits?: "partner" | "isv" | "none" }): Promise<Blob> {
  const doc = await createPdfDocument();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const width = pageW - PDF_MARGIN * 2;
  const bottom = pageH - 20;
  const title = opts.heading || "Partneravtal d365.se";
  let y = drawBrandHeader(doc, title, `Version ${today()} · ${ORGANIZATION.legalName}`);

  const ensure = (h: number) => { if (y + h > bottom) { doc.addPage(); y = drawBrandHeader(doc, title); } };
  const para = (text: string, size = 9.5) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(size); doc.setTextColor(...PDF_BRAND.dark);
    for (const raw of text.split("\n")) {
      const lines = raw.trim() ? wrapPdfText(raw, width, (l) => doc.getTextWidth(l)) : [""];
      for (const line of lines) { ensure(4.8); doc.text(line, PDF_MARGIN, y); y += 4.8; }
    }
    y += 2;
  };
  const heading = (t: string) => { ensure(16); y = drawSectionHeading(doc, t, y + 2); };

  if (opts.partnerName) para(`Avtalspart: ${opts.partnerName}`, 11);
  if (opts.intro) para(opts.intro);
  const isvBenefits = opts.benefits === "isv";
  if (opts.benefits !== 'none') heading(isvBenefits ? ISV_BENEFITS_TITLE : PREMIUM_BENEFITS_TITLE);
  for (const b of opts.benefits === 'none' ? [] : isvBenefits ? ISV_BENEFITS : PREMIUM_BENEFITS) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(...PDF_BRAND.dark);
    const lines = wrapPdfText(b, width - 6, (l) => doc.getTextWidth(l));
    lines.forEach((line, i) => { ensure(4.8); if (i === 0) doc.text("\u2022", PDF_MARGIN + 1, y); doc.text(line, PDF_MARGIN + 6, y); y += 4.8; });
    y += 0.8;
  }
  y += 2;
  const sections = opts.priceRows ? opts.sections : [...PARTNER_PROFILE_TERMS, ...opts.sections];
  const termsName = title.replace(/^Avtalsvillkor:\s*/i, "");
  ensure(24);
  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(...PDF_BRAND.dark);
  doc.text(`Avtalsvillkor för ${termsName}`, PDF_MARGIN, y + 4); y += 10;
  for (const s of sections) { heading(s.title); para(s.body); }

  // Bilagan börjar alltid på en egen sida så att prisrutan inte bryts mitt i.
  doc.addPage(); y = drawBrandHeader(doc, title);
  heading("Bilaga: priser och ersättningar");
  if (opts.benefits !== "isv" && opts.benefits !== "none") y = drawPremiumPriceTable(doc, y);
  doc.setFontSize(9.5);
  for (const [label, value] of opts.priceRows ?? agreementPriceRows()) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
    const valLines = wrapPdfText(value, width * 0.5, (l) => doc.getTextWidth(l));
    doc.setFont("helvetica", "bold");
    const labelLines = wrapPdfText(label, width * 0.46, (l) => doc.getTextWidth(l));
    const h = Math.max(1, valLines.length, labelLines.length) * 4.8 + 3;
    ensure(h);
    doc.setFillColor(...PDF_BRAND.cardBg);
    doc.rect(PDF_MARGIN, y - 4, width, h, "F");
    doc.setFont("helvetica", "bold"); doc.setTextColor(...PDF_BRAND.dark);
    doc.text(labelLines, PDF_MARGIN + 2, y);
    doc.setFont("helvetica", "normal");
    doc.text(valLines, PDF_MARGIN + width * 0.5, y);
    y += h + 1;
  }
  y += 2;
  para(opts.priceNote ?? PARTNER_FEE_NOTE, 8.5);

  heading("Accept");
  para(opts.acceptance ?? "Avtalet accepteras genom bekräftelse via e-post till d365.se. Vid frågor, kontakta oss:");
  para(`Thomas Laine · ${ORGANIZATION.email} · ${ORGANIZATION.telephoneDisplay}`);

  finalizePdfWithFooter(doc, title);
  return doc.output("blob");
}
