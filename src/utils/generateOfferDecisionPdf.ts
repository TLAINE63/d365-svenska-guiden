import type { jsPDF } from "jspdf";
import { createPdfDocument, pdfText, wrapPdfText } from "@/utils/pdfDocument";
import { drawBrandHeader, drawSectionHeading, finalizePdfWithFooter, PDF_MARGIN } from "@/utils/pdfLayout";
import { PDF_BRAND, type RGB } from "@/utils/pdfBrand";
import { MONTH_PRICE, YEAR_PRICE } from "@/lib/budget2027";
import { ORGANIZATION } from "@/data/organization";
import { PREMIUM_BENEFITS, ISV_BENEFITS } from "./partnerProfileTerms";
import { SUBSCRIPTION_TERMS, MEDIATION_TERMS, ADDON_PRODUCT_NOTE, ORDER_VERSION } from "@/lib/partnerOrder";
import { ISV_SUBSCRIPTION_TERMS, ISV_ORDER_FEES, ISV_ORDER_VERSION } from "@/lib/isvOrder";

export type OfferPdfInput =
  | { kind: "partner"; company: string; contact?: string; premium: boolean; period: "month" | "year"; areas: string[]; mediation: boolean; startDate: string; price: number }
  | { kind: "isv"; company: string; contact?: string; extraApps: number; startDate: string; price: number; regular: number };

const kr = (n: number) => `${n.toLocaleString("sv-SE")} kr`;
const today = () => new Date().toISOString().slice(0, 10);
const ORDER_EMAIL = "thomas.laine@dynamicfactory.se";

/** Offer label shared with the on-page summary. */
export function offerLabel(i: OfferPdfInput): string {
  if (i.kind === "isv") return "ISV Presence";
  if (i.premium && i.mediation) return "Premium + Finder’s fee";
  return i.premium ? "Premium" : "Finder’s fee (utan Premium)";
}

/**
 * Self-contained, 7-section decision document for partner (Premium/Finder’s fee) or ISV (ISV Presence),
 * built from the same prices and terms as the order dialogs. Downloading never creates an order.
 */
export async function generateOfferDecisionPdf(input: OfferPdfInput): Promise<Blob> {
  const doc: jsPDF = await createPdfDocument();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const W = pageW - PDF_MARGIN * 2;
  const bottom = pageH - 18;
  const isv = input.kind === "isv";
  const company = input.company.trim() || "Ert företag";
  const title = `Beslutsunderlag: ${offerLabel(input)}`;
  let y = 0;

  const newPage = (heading: string) => { doc.addPage(); y = drawBrandHeader(doc, heading, `Beslutsunderlag för ${company} · ${today()}`); };
  const ensure = (h: number) => { if (y + h > bottom) { doc.addPage(); y = drawBrandHeader(doc, title, `Beslutsunderlag för ${company} · ${today()}`); } };
  const text = (t: string, o: { size?: number; bold?: boolean; color?: RGB; indent?: number; gap?: number } = {}) => {
    const size = o.size ?? 10; const lh = size * 0.5;
    doc.setFont("helvetica", o.bold ? "bold" : "normal"); doc.setFontSize(size); doc.setTextColor(...(o.color ?? PDF_BRAND.dark));
    for (const raw of t.split("\n")) {
      const lines = raw.trim() ? wrapPdfText(raw, W - (o.indent ?? 0), (l) => doc.getTextWidth(l)) : [""];
      for (const line of lines) { ensure(lh); doc.text(line, PDF_MARGIN + (o.indent ?? 0), y); y += lh; }
    }
    y += o.gap ?? 2.5;
  };
  const heading = (t: string) => { ensure(18); y = drawSectionHeading(doc, t, y + 2); };
  const bullets = (items: string[], color: RGB = PDF_BRAND.accent) => {
    doc.setFontSize(10);
    for (const b of items) {
      doc.setFont("helvetica", "normal");
      const lines = wrapPdfText(b, W - 7, (l) => doc.getTextWidth(l));
      ensure(lines.length * 5 + 1);
      doc.setFillColor(...color); doc.circle(PDF_MARGIN + 1.6, y - 1.3, 0.9, "F");
      doc.setTextColor(...PDF_BRAND.dark);
      lines.forEach((l) => { doc.text(l, PDF_MARGIN + 6, y); y += 5; });
      y += 1.2;
    }
    y += 1.5;
  };
  const table = (rows: [string, string][], opts: { head?: [string, string]; strongLast?: boolean } = {}) => {
    const rowsAll = opts.head ? [opts.head, ...rows] : rows;
    rowsAll.forEach((r, idx) => {
      const isHead = !!opts.head && idx === 0;
      const strong = opts.strongLast && idx === rowsAll.length - 1;
      doc.setFontSize(9.5);
      doc.setFont("helvetica", isHead || strong ? "bold" : "normal");
      const l = wrapPdfText(r[0], W * 0.55 - 4, (s) => doc.getTextWidth(s));
      doc.setFont("helvetica", "bold");
      const v = wrapPdfText(r[1], W * 0.45 - 4, (s) => doc.getTextWidth(s));
      const h = Math.max(l.length, v.length) * 4.8 + 4;
      ensure(h);
      if (isHead) doc.setFillColor(...PDF_BRAND.dark); else doc.setFillColor(...(strong ? [252, 238, 232] as RGB : idx % 2 ? [255, 255, 255] as RGB : PDF_BRAND.cardBg));
      doc.rect(PDF_MARGIN, y - 4.2, W, h, "F");
      doc.setTextColor(...(isHead ? [255, 255, 255] as RGB : PDF_BRAND.dark));
      doc.setFont("helvetica", isHead || strong ? "bold" : "normal"); doc.text(l, PDF_MARGIN + 3, y);
      doc.setFont("helvetica", "bold"); doc.text(v, PDF_MARGIN + W * 0.55, y);
      y += h;
    });
    y += 4;
  };
  const callout = (head: string, body: string, color: RGB = PDF_BRAND.accent) => {
    doc.setFontSize(9.5); doc.setFont("helvetica", "normal");
    const lines = wrapPdfText(body, W - 12, (l) => doc.getTextWidth(l));
    const h = lines.length * 4.8 + 12;
    ensure(h + 2);
    doc.setFillColor(...PDF_BRAND.cardBg); doc.rect(PDF_MARGIN, y - 4, W, h, "F");
    doc.setFillColor(...color); doc.rect(PDF_MARGIN, y - 4, 1.8, h, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); doc.setTextColor(...PDF_BRAND.dark); doc.text(pdfText(head), PDF_MARGIN + 6, y + 1.5);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.text(lines, PDF_MARGIN + 6, y + 7.5);
    y += h + 3;
  };

  // ---- Prices
  const priceRows: [string, string][] = [];
  let headline = "";
  if (input.kind === "partner") {
    if (input.premium) {
      const per = input.period === "year" ? "år" : "månad";
      priceRows.push([`Premium, ${input.areas.length || 1} produktområde${input.areas.length > 1 ? "n" : ""}, betalning per ${per}`, `${kr(input.price)} / ${per}`]);
      if (input.period === "month") priceRows.push(["Motsvarar per år", kr(input.price * 12)]);
      headline = `${kr(input.price)} / ${per}`;
    } else { priceRows.push(["Premiumabonnemang", "Ingår inte (Grundprofil 0 kr)"]); headline = "Ingen fast avgift"; }
    priceRows.push(["Finder’s fee-avtal", input.mediation ? "Ingår, avgift endast per möte, affär eller uppdrag" : "Ej valt"]);
  } else {
    priceRows.push(["ISV Presence inkl. en app, första året (introduktionspris)", kr(ISV_ORDER_FEES.introFirstYear)]);
    if (input.extraApps) priceRows.push([`Extra appar (${input.extraApps} × ${kr(ISV_ORDER_FEES.extraApp)})`, `${kr(input.extraApps * ISV_ORDER_FEES.extraApp)} / år`]);
    priceRows.push(["Totalt första året", kr(input.price)], ["Ordinarie årspris från år två", `${kr(input.regular)} / år`]);
    headline = `${kr(input.price)} första året`;
  }

  // ---- Page 1: cover with personal offer and price overview
  doc.setFillColor(...PDF_BRAND.dark); doc.rect(0, 0, pageW, 118, "F");
  doc.setFillColor(...PDF_BRAND.primary); doc.rect(0, 118, pageW, 2, "F");
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.text("d365.se", PDF_MARGIN, 22);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(200, 200, 200);
  doc.text(isv ? "Offertförslag och beslutsunderlag för ISV-leverantörer" : "Offertförslag och beslutsunderlag för Dynamics 365-partners", PDF_MARGIN, 30);
  doc.setFont("helvetica", "bold"); doc.setFontSize(26); doc.setTextColor(255, 255, 255);
  doc.text(wrapPdfText(offerLabel(input), W, (l) => doc.getTextWidth(l)), PDF_MARGIN, 58);
  doc.setFont("helvetica", "normal"); doc.setFontSize(13);
  doc.text(wrapPdfText(`Erbjudande till ${company}`, W, (l) => doc.getTextWidth(l)), PDF_MARGIN, 74);
  doc.setFontSize(9.5); doc.setTextColor(200, 200, 200);
  doc.text(`Datum ${today()}${input.contact?.trim() ? ` · Kontaktperson ${input.contact.trim()}` : ""} · Villkorsversion ${isv ? ISV_ORDER_VERSION : ORDER_VERSION}`, PDF_MARGIN, 84);
  doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(255, 255, 255); doc.text(headline, PDF_MARGIN, 104);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(200, 200, 200); doc.text("exklusive moms", PDF_MARGIN, 111);
  y = 134;
  heading("Vad beslutet gäller");
  text(isv
    ? `${company} får en utökad, verifierbar presentation av sina Dynamics 365-tilläggslösningar på d365.se, där företag undersöker vilka kompletterande lösningar de behöver.`
    : `${company} får en tydligare presentation av sin kompetens på d365.se, där företag undersöker Dynamics 365 och jämför partners innan de tar kontakt.`);
  table(priceRows, { head: ["Prisöversikt", "Belopp"] });
  const scope: [string, string][] = input.kind === "partner"
    ? [["Produktområden", input.areas.join(", ") || "Ej valda"], ["Önskad start", input.startDate]]
    : [["Appar", `1 ingår${input.extraApps ? ` + ${input.extraApps} extra` : ""}`], ["Önskad start", input.startDate]];
  table(scope, { head: ["Vald omfattning", ""] });
  text("Detta är ett offertförslag, inte en beställning. Nedladdningen är inte bindande.", { size: 8.5, color: PDF_BRAND.textMuted });

  // ---- Page 2: the new buyer journey
  newPage("Den nya köpresan");
  heading("Köparen har kommit långt innan första mötet");
  text("Företag som väljer affärssystem (ERP) eller CRM gör allt mer av utvärderingen på egen hand. De söker information, jämför kostnader, lösningar och leverantörer och diskuterar alternativen internt, ofta långt innan de vill prata med en säljare.");
  bullets([
    "Research: Vad behöver vi förändra, vilka alternativ finns och vad kostar det?",
    "Intern diskussion: behov, prioriteringar och möjliga investeringar.",
    isv ? "Jämförelse: vilka kompletterande lösningar behövs, till exempel för lager, budget, e-handel eller dokumenthantering?" : "Jämförelse: vilka lösningar och partners passar oss?",
    "Rådgivning (frivillig) och möte med utvalda leverantörer.",
    "Beslut, avtal och projekt, där målet är att lyckas med investeringen.",
  ]);
  heading("Vi svarar öppet på köparens frågor");
  text("d365.se ger raka och användbara svar, även om pris, risker, nackdelar och situationer där Dynamics 365 kanske inte är rätt val. Det gör att köpare litar på innehållet och kommer tillbaka när beslutet närmar sig.");
  callout("Varför det spelar roll för er", isv
    ? "ISV-produkter blir ofta relevanta före, under eller efter valet av implementationspartner. Den som tydligt förklarar vilket problem produkten löser, hur integrationen fungerar, vad den kostar och vilka begränsningar som finns, finns med i kundens underlag."
    : "Kunden kan ha undersökt både lösningar och partners långt innan ni får möjlighet att träffas. Därför behöver er kompetens vara tydlig och begriplig redan under kundens research.");

  // ---- Page 3: how d365.se works with buyers
  newPage("Så arbetar d365.se med köpare");
  heading("Självständig research med stöd när kunden vill");
  bullets([
    "Guider, jämförelser, kostnadskalkyler, behovsanalyser och kravspecifikationer, utan krav på kontakt.",
    isv ? "Tilläggskatalog med produktsidor, användningsområden och koppling till Dynamics 365-produkterna." : "Partnerprofiler med branscher, kundcase och experter som köparen kan jämföra.",
    "Kostnadsfritt rådgivningssamtal med d365.se, ca 20 minuter, när kunden själv vill ha stöd.",
    "Kunden väljer själv om och när den vill träffa en leverantör. Ingen kontakt förmedlas utan kundens samtycke.",
  ]);
  heading("Aktivt arbete med relevanta behov");
  text("d365.se kan också arbeta aktivt med att upptäcka och följa upp relevanta behov. En företagssignal, till exempel att ett företag besökt sajten, är inte samma sak som en identifierad person eller ett kvalificerat kundprojekt.");
  callout("Neutral relevans", "Betalning påverkar aldrig relevansordning, rekommendationer eller verifiering. Verifiering beslutas manuellt av d365.se-redaktionen. d365.se lovar inga garanterade leadvolymer.", PDF_BRAND.primary);

  // ---- Page 4: what is included
  newPage(isv ? "Detta ingår i ISV Presence" : "Detta ingår i Premium");
  if (input.kind === "partner" && !input.premium) {
    heading("Grundprofil och Finder’s fee");
    text("Ni behåller den kostnadsfria Grundprofilen och tecknar endast Finder’s fee-avtalet. Premium kan läggas till senare. Så här skiljer sig Premium:");
  } else heading(isv ? "Hjälp kunden att upptäcka och förstå era lösningar" : "Visa varför ni är rätt partner");
  bullets(isv ? ISV_BENEFITS : PREMIUM_BENEFITS);
  if (!isv) callout("Tillägg", `${ADDON_PRODUCT_NOTE} INSIDE, en redaktionell expertintervju, är ett separat tillval för Premiumpartners: 4 900 kr exklusive moms.`);
  else callout("Frågor köpare vill ha svar på", "Vilket problem löser produkten? När behöver vi den? Hur fungerar integrationen? Vad kostar lösningen? Vilka begränsningar finns? Hur skiljer den sig från alternativen?");

  // ---- Page 5: prices and scope
  newPage("Priser och vald omfattning");
  heading("Ert val");
  table(input.kind === "partner" ? [...scope, ["Erbjudande", offerLabel(input)]] : [...scope, ["Erbjudande", "ISV Presence"]]);
  heading("Prisberäkning");
  table(priceRows);
  if (input.kind === "partner") {
    heading("Prislista Premium 2027");
    table([1, 2, 3].map((n) => [`${n} produktområde${n > 1 ? "n" : ""}`, `${kr(MONTH_PRICE[n])}/mån eller ${kr(YEAR_PRICE[n])}/år`] as [string, string]), { head: ["Omfattning", "Pris"] });
    text("Månad faktureras i efterskott med 3 månaders uppsägningstid. År faktureras i förskott. CE/CRM-applikationerna räknas som ett produktområde; upp till tre branscher per område. Alla priser exklusive moms.", { size: 8.5, color: PDF_BRAND.textMuted });
  } else text("Faktureras årsvis i förskott. Introduktionspriset gäller de första 20 nya ISV-leverantörerna. Alla priser exklusive moms.", { size: 8.5, color: PDF_BRAND.textMuted });

  // ---- Page 6: mediation / Finder’s fee
  newPage(isv ? "Kundförmedling" : "Kundförmedling och Finder’s fee");
  if (input.kind === "partner") {
    heading("Så fungerar Finder’s fee");
    text("När en köpare har ett konkret projekt kan d365.se introducera relevanta partners. Ni bedömer möjligheten och accepterar villkoren först, och köparen väljer själv (högst tre partners) och lämnar sitt samtycke. Mötesavgiften räknas av i sin helhet mot avgiften vid affär. Premiumpartners har lägre mötesavgift från 250 tkr och vid partnerbyte.");
    table([
      ["Nya projekt under 250 tkr", "Möte 1 500 kr · 2,5 %, lägst 3 000 kr"],
      ["Nya projekt 250 tkr – 1 Mkr", "Möte 3 000 / 5 000 kr · 2,5 %"],
      ["Nya projekt över 1 Mkr", "Möte 6 000 / 9 000 kr · 2,5 %, högst 100 000 kr"],
      ["Partnerbyte BC, CRM, Power Platform", "Mötesavgift 3 000 / 5 000 kr"],
      ["Partnerbyte Finance & SCM", "Mötesavgift 6 000 / 9 000 kr"],
      ["Expertkonsult, upp till 6 mån eller under halvtid", "7 500 / 12 500 kr per uppdrag"],
      ["Expertkonsult, längre eller minst halvtid", "15 000 / 25 000 kr per uppdrag"],
    ], { head: ["Typ (Premium / Basic)", "Avgift"] });
    text(input.mediation ? "Finder’s fee-avtalet ingår i ert val. Fullständiga villkor finns i bilagan." : "Finder’s fee-avtalet ingår inte i ert val men kan tecknas separat när som helst.", { bold: true });
    text("Introduktioner påverkar aldrig relevansordningen och innebär inga garanterade möten eller affärer.", { size: 9, color: PDF_BRAND.textMuted });
  } else {
    heading("Produktrelaterade kundintroduktioner");
    text("Finder’s fee för ISV-leverantörer är pausad tills vidare och ingår inte i detta erbjudande. Partnervillkoren gäller inte automatiskt för ISV-leverantörer.");
    text("Om ett produktrelaterat samarbete blir aktuellt i framtiden diskuteras villkoren separat, innan någon introduktion sker. ISV Presence innebär inga garanterade leads.");
  }

  // ---- Page 7: summary and next steps
  newPage("Sammanfattning och nästa steg");
  heading("Sammanfattning");
  table([["Erbjudande", offerLabel(input)], ["Pris", `${headline}, exklusive moms`], ...scope]);
  bullets(isv
    ? ["Era produkter presenteras när kunden undersöker kompletterande lösningar.", "Verifierad presentation med logotyp, länk, kontakt och demofilmer.", "Neutral katalogordning och inga garanterade leads."]
    : ["Er kompetens blir tydlig redan under kundens research.", "Köparen får ett bättre underlag för att bedöma er.", "När kunden är redo arbetar d365.se för att hjälpa rätt kund att hitta rätt partner."]);
  heading("Nästa steg");
  bullets([
    "Gå igenom underlaget internt med vd, försäljningschef eller ledningsgrupp.",
    isv ? "Beställ i formuläret på d365.se/isvprogram/ när ni har ett internt godkännande." : `Skicka beställningen via e-post till ${ORDER_EMAIL} när ni har ett internt godkännande.`,
    "Komplettera profilen; redaktionen granskar uppgifterna och beslutar om verifiering.",
  ], PDF_BRAND.primary);
  callout("Frågor?", `Thomas Laine, d365.se · ${ORGANIZATION.email} · ${ORGANIZATION.telephoneDisplay}`, PDF_BRAND.primary);

  // ---- Annex: terms
  newPage("Bilaga: villkor");
  if (input.kind === "partner") {
    if (input.premium) { heading("Abonnemangsvillkor"); text(SUBSCRIPTION_TERMS, { size: 8.5, gap: 1 }); }
    if (input.mediation) { heading("Förmedlingsvillkor (Finder’s fee)"); text(MEDIATION_TERMS, { size: 8.5, gap: 1 }); }
  } else { heading("Abonnemangsvillkor"); text(ISV_SUBSCRIPTION_TERMS, { size: 9 }); }
  text(`Avtalspart: ${ORGANIZATION.legalName}`, { size: 8.5, color: PDF_BRAND.textMuted });

  finalizePdfWithFooter(doc, title);
  return doc.output("blob");
}
