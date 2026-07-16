import type { ProductConfig } from "@/data/crmMatchningstestConfigs";
import type { CrmScoreResult } from "@/lib/crmMatchingScoring";
import { topCrmProfiles } from "@/lib/crmMatchingScoring";

// Brand colors (consistent with other PDF exports)
import { PDF_BRAND } from "./pdfBrand";
import { drawBrandHeader, finalizePdfWithFooter, drawSectionHeading, PDF_MARGIN } from "./pdfLayout";
const BRAND_PETROL: [number, number, number] = PDF_BRAND.primary;
const BRAND_DARK: [number, number, number] = [21, 19, 15]; // #15130F

const LEVEL_LABEL: Record<CrmScoreResult["level"], string> = {
  strong: "Stark matchning",
  partial: "Delvis matchning",
  oversized: "Sannolikt överdimensionerat",
};

const LEVEL_RGB: Record<CrmScoreResult["level"], [number, number, number]> = {
  strong: [16, 122, 87],
  partial: [161, 98, 7],
  oversized: [90, 90, 100],
};

const nextStepsFor = (
  config: ProductConfig,
  level: CrmScoreResult["level"],
): { title: string; body: string; cta: string }[] => {
  if (level === "strong") {
    return [
      {
        title: `Jämför partners för ${config.productName}`,
        body:
          "Ni har en tydlig matchning. Nästa steg är att jämföra 2–3 Microsoft-partners sida vid sida med rätt bransch- och storleksprofil.",
        cta: `d365.se${config.partnerFilterPath}`,
      },
      {
        title: "Bygg en kravspecifikation",
        body:
          "Använd kravspecifikationsgeneratorn för att skapa ett neutralt underlag att skicka till utvalda partners.",
        cta: `d365.se${config.needsAnalysisPath}`,
      },
    ];
  }
  if (level === "partial") {
    return [
      {
        title: "Fördjupa behovsanalysen",
        body:
          "Er profil är blandad. Gör en fördjupad behovsanalys så att ni utvärderar rätt saker och inte betalar för funktioner ni inte behöver.",
        cta: `d365.se${config.needsAnalysisPath}`,
      },
      {
        title: "Prata med 2 partners – och 1 alternativ",
        body:
          "Jämför Microsoft-partners parallellt med minst ett enklare alternativ (t.ex. HubSpot eller Zendesk) för att pressa både pris och funktion.",
        cta: `d365.se${config.partnerFilterPath}`,
      },
    ];
  }
  return [
    {
      title: "Utvärdera enklare alternativ först",
      body:
        config.oversizedAlternative?.body ??
        "Er profil pekar mot att ett enklare verktyg räcker. Utvärdera det innan ni går vidare med Dynamics 365.",
      cta: `d365.se${config.oversizedAlternative?.ctaTo ?? config.productPagePath}`,
    },
    {
      title: "Behöver ni en second opinion?",
      body:
        "Vill ni ändå ha en genomgång av valet, kontakta oss så guidar vi utan agenda.",
      cta: "d365.se/kontakt",
    },
  ];
};

import type { PdfSuggestedPartner } from "./pdfSuggestedPartners";

export interface CrmPdfExtras {
  suggestedPartners?: PdfSuggestedPartner[];
  suggestedCompareUrl?: string;
  suggestedIndustry?: string | null;
}

export async function generateCrmResultPdf(
  score: CrmScoreResult,
  config: ProductConfig,
  extras?: CrmPdfExtras,
) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = PDF_MARGIN;
  const bodyWidth = pageW - 2 * margin;

  const ensureSpace = (need: number, y: number): number => {
    if (y + need > pageH - 20) {
      doc.addPage();
      return margin + 6;
    }
    return y;
  };

  // ---- Header ----
  let y = drawBrandHeader(doc, `${config.productName} – Matchningstest`);

  // ---- Level badge + total ----
  const level = score.level;
  const rgb = LEVEL_RGB[level];
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  doc.roundedRect(margin, y - 4, 62, 8, 1.2, 1.2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(LEVEL_LABEL[level], margin + 3, y + 1.5);

  doc.setTextColor(...BRAND_DARK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Matchningsgrad: ${score.total}/100`, margin + 68, y + 1.5);
  y += 12;

  // Headline
  const levelCopy = config.levelCopy[level];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  const headlineLines = doc.splitTextToSize(levelCopy.headline, bodyWidth);
  doc.text(headlineLines, margin, y);
  y += headlineLines.length * 6 + 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const bodyLines = doc.splitTextToSize(levelCopy.body, bodyWidth);
  doc.text(bodyLines, margin, y);
  y += bodyLines.length * 5 + 6;

  // ---- Profil per behovsområde ----
  doc.setDrawColor(...BRAND_PETROL);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageW - margin, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Profil per behovsområde", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  for (const p of score.perProfile) {
    y = ensureSpace(12, y);
    const isNA = p.score === "not_applicable";
    const label = p.label;
    const valueLabel = isNA ? "Ej aktuellt" : `${p.score}%`;

    doc.setTextColor(...BRAND_DARK);
    doc.text(label, margin, y);
    doc.text(valueLabel, pageW - margin, y, { align: "right" });
    y += 2;

    // Bar
    const barW = bodyWidth;
    doc.setFillColor(232, 232, 235);
    doc.roundedRect(margin, y, barW, 2.2, 1, 1, "F");
    if (!isNA) {
      const fillW = Math.max(0, Math.min(1, (p.score as number) / 100)) * barW;
      doc.setFillColor(...BRAND_PETROL);
      doc.roundedRect(margin, y, fillW, 2.2, 1, 1, "F");
    }
    y += 7;
  }
  y += 2;

  // ---- Kort motivering ----
  const tops = topCrmProfiles(score, 3);
  if (tops.length > 0) {
    y = ensureSpace(14, y);
    doc.setDrawColor(...BRAND_PETROL);
    doc.line(margin, y, pageW - margin, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...BRAND_DARK);
    doc.text("Kort motivering – här matchar ni starkast", margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    for (const t of tops) {
      const p = config.profiles.find((x) => x.key === t.key);
      if (!p) continue;
      const strongLines = doc.splitTextToSize(`• ${p.strongCopy}`, bodyWidth - 2);
      const hintLines = doc.splitTextToSize(p.partnerHint, bodyWidth - 6);
      const needed = strongLines.length * 4.8 + hintLines.length * 4.5 + 4;
      y = ensureSpace(needed, y);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...BRAND_DARK);
      doc.text(strongLines, margin, y);
      y += strongLines.length * 4.8;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(90, 90, 95);
      doc.text(hintLines, margin + 4, y);
      y += hintLines.length * 4.5 + 4;
    }
  }

  // ---- Alternativ vid oversized ----
  if (level === "oversized" && config.oversizedAlternative) {
    y = ensureSpace(20, y);
    doc.setDrawColor(...BRAND_PETROL);
    doc.line(margin, y, pageW - margin, y);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...BRAND_DARK);
    const altHeadLines = doc.splitTextToSize(
      config.oversizedAlternative.heading,
      bodyWidth,
    );
    doc.text(altHeadLines, margin, y);
    y += altHeadLines.length * 5.5 + 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const altBodyLines = doc.splitTextToSize(
      config.oversizedAlternative.body,
      bodyWidth,
    );
    y = ensureSpace(altBodyLines.length * 4.6 + 4, y);
    doc.text(altBodyLines, margin, y);
    y += altBodyLines.length * 4.6 + 6;
  }

  // ---- Nästa steg ----
  const steps = nextStepsFor(config, level);
  y = ensureSpace(14, y);
  doc.setDrawColor(...BRAND_PETROL);
  doc.line(margin, y, pageW - margin, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...BRAND_DARK);
  doc.text("Era nästa steg", margin, y);
  y += 6;

  steps.forEach((s, i) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    const titleLines = doc.splitTextToSize(`${i + 1}. ${s.title}`, bodyWidth);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const bodyLns = doc.splitTextToSize(s.body, bodyWidth - 4);
    const ctaText = `→ ${s.cta}`;
    const need = titleLines.length * 5 + bodyLns.length * 4.6 + 6;
    y = ensureSpace(need, y);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BRAND_DARK);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 70, 75);
    doc.text(bodyLns, margin + 4, y);
    y += bodyLns.length * 4.6 + 1;

    doc.setTextColor(...BRAND_PETROL);
    doc.text(ctaText, margin + 4, y);
    y += 6;
  });

  // Suggested partners page
  if (extras?.suggestedPartners?.length && extras.suggestedCompareUrl) {
    const { appendSuggestedPartnersPage } = await import("./pdfSuggestedPartners");
    appendSuggestedPartnersPage(doc, extras.suggestedPartners, {
      compareUrl: extras.suggestedCompareUrl,
      productLabel: config.productName,
      industry: extras.suggestedIndustry ?? null,
    });
  }

  // ---- Footer ----
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `d365.se – ${config.productName} Matchningstest · Sida ${i} av ${total}`,
      pageW / 2,
      pageH - 8,
      { align: "center" },
    );
  }

  const date = new Date().toISOString().slice(0, 10);
  doc.save(`${config.key}-matchningstest-${date}.pdf`);
}
