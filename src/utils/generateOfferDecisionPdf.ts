import type { jsPDF } from "jspdf";
import { createPdfDocument, pdfText, wrapPdfText } from "@/utils/pdfDocument";
import { drawBrandHeader, drawSectionHeading, finalizePdfWithFooter, PDF_MARGIN } from "@/utils/pdfLayout";
import { PDF_BRAND, type RGB } from "@/utils/pdfBrand";
import scene1 from "@/assets/journey/scene1-research.jpg";
import scene2 from "@/assets/journey/scene2-discussion.jpg";
import scene4 from "@/assets/journey/scene4-advice.jpg";
import scene7 from "@/assets/journey/scene7-project.jpg";
import { ORGANIZATION } from "@/data/organization";
import { PREMIUM_BENEFITS, ISV_BENEFITS } from "./partnerProfileTerms";
import { SUBSCRIPTION_TERMS, MEDIATION_TERMS, ADDON_PRODUCT_NOTE, ORDER_VERSION, ORDER_PRICES, AGREEMENT_DURATION_TERMS } from "@/lib/partnerOrder";
import { ISV_SUBSCRIPTION_TERMS, ISV_ORDER_FEES, ISV_ORDER_VERSION } from "@/lib/isvOrder";

export type OfferPdfInput =
  | { kind: "partner"; company: string; contact?: string; premium: boolean; period: "month" | "year"; areas: string[]; mediation: boolean; startDate: string; price: number }
  | { kind: "isv"; company: string; contact?: string; extraApps: number; startDate: string; price: number; regular: number };

const kr = (n: number) => `${n.toLocaleString("sv-SE")} kr`;
const today = () => new Date().toISOString().slice(0, 10);
const ORDER_EMAIL = "thomas.laine@dynamicfactory.se";

async function toDataUrl(src: string): Promise<string | null> {
  try {
    const blob = await (await fetch(src)).blob();
    return await new Promise((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => res(null); r.readAsDataURL(blob); });
  } catch { return null; }
}

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
    priceRows.push(["ISV Presence inkl. tre produkter, första året (introduktionspris)", kr(ISV_ORDER_FEES.introFirstYear)]);
    if (input.extraApps) priceRows.push([`Extra produkter (${input.extraApps} × ${kr(ISV_ORDER_FEES.extraApp)})`, `${kr(input.extraApps * ISV_ORDER_FEES.extraApp)} / år`]);
    priceRows.push(["Totalt första året", kr(input.price)], ["Ordinarie årspris från år två", `${kr(input.regular)} / år`]);
    headline = `${kr(input.price)} första året`;
  }

  // ---- Page 1: cover with personal offer and price overview
  doc.setFillColor(...PDF_BRAND.dark); doc.rect(0, 0, pageW, 118, "F");
  doc.setFillColor(...PDF_BRAND.primary); doc.rect(0, 118, pageW, 2, "F");
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.text("d365.se", PDF_MARGIN, 22);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(200, 200, 200);
  doc.text("Offertförslag · beslutsunderlag · inte ett undertecknat avtal", PDF_MARGIN, 30);
  doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(255, 255, 255);
  doc.text("Förslag till partnersamarbete med d365.se", PDF_MARGIN, 50);
  doc.setFont("helvetica", "normal"); doc.setFontSize(13); doc.setTextColor(240, 200, 185);
  doc.text(isv ? "ISV Presence för ISV-leverantörer" : (input.premium ? "Premium för Dynamics-partners" : "Finder’s fee för Dynamics-partners"), PDF_MARGIN, 60);
  doc.setTextColor(255, 255, 255); doc.setFontSize(12);
  doc.text(wrapPdfText(`Till ${company}`, W, (l) => doc.getTextWidth(l)).slice(0, 2), PDF_MARGIN, 74);
  doc.setFontSize(9.5); doc.setTextColor(200, 200, 200);
  doc.text(`Datum ${today()}${input.contact?.trim() ? ` · Kontaktperson ${input.contact.trim()}` : ""} · Villkorsversion ${isv ? ISV_ORDER_VERSION : ORDER_VERSION}`, PDF_MARGIN, 84);
  doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(255, 255, 255); doc.text(headline, PDF_MARGIN, 104);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(200, 200, 200); doc.text("exklusive moms", PDF_MARGIN, 111);
  y = 134;
  callout("Var relevant när kunden undersöker sina alternativ, inte bara när kunden är redo att köpa.", isv
    ? `Era potentiella kunder gör sin research utan er. d365.se finns där och hjälper dem att förstå vilka kompletterande lösningar de behöver. ${company} behöver se till att produkterna är tydligt presenterade när kunden utvärderar alternativen.`
    : `Era potentiella kunder gör sin research utan er. d365.se finns där och hjälper dem att jämföra lösningar och partners. ${company} behöver se till att kompetensen är tydligt presenterad när kunden utvärderar alternativen.`, PDF_BRAND.primary);
  table(priceRows, { head: ["Prisöversikt", "Belopp"] });
  const scope: [string, string][] = input.kind === "partner"
    ? [["Produktområden", input.areas.join(", ") || "Ej valda"], ["Önskad start", input.startDate], ["Avtalsperiod", input.premium ? (input.period === "year" ? "Tills vidare, årsvis betalning i förskott" : "Tills vidare, 3 månaders uppsägningstid") : "Tills vidare"]]
    : [["Appar", `1 ingår${input.extraApps ? ` + ${input.extraApps} extra` : ""}`], ["Önskad start", input.startDate], ["Avtalsperiod", "Tills vidare, årsvis betalning i förskott"]];
  table(scope, { head: ["Vald omfattning", ""] });
  text("Detta är ett offertförslag, inte en beställning. Nedladdningen är inte bindande.", { size: 8.5, color: PDF_BRAND.textMuted });

  // ---- Page 2: the modern buyer journey
  newPage("Den moderna köpresan");
  heading("Köparen gör allt mer själv");
  text("Organisationer som undersöker Dynamics 365 vill ofta förstå sina behov, undersöka lösningar, jämföra kostnader, utvärdera leverantörer och diskutera alternativen internt, och bilda sig en uppfattning innan det första säljsamtalet.");
  text("d365.se är byggt för att besvara de frågor köpare faktiskt ställer, öppet och konkret, även om pris, risker, nackdelar och situationer där Dynamics 365 inte är rätt val. Det hjälper företag att fatta mer välgrundade beslut och gör att de litar på underlaget.");
  const imgs = await Promise.all([scene1, scene2, scene4, scene7].map(toDataUrl));
  const captions = ["Research", "Intern diskussion", "Rådgivning", "Projekt"];
  const iw = (W - 9) / 4, ih = iw * 0.7;
  ensure(ih + 12);
  imgs.forEach((d, i) => {
    const x = PDF_MARGIN + i * (iw + 3);
    if (d) { try { doc.addImage(d, "JPEG", x, y, iw, ih); } catch { /* skip image */ } }
    doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(...PDF_BRAND.dark); doc.text(captions[i], x, y + ih + 4.5);
  });
  y += ih + 10;
  const steps = ["Research", "Intern diskussion", "Jämförelse", "Rådgivning", "Partnermöte", "Avtal", "Projekt"];
  const sw = W / steps.length;
  ensure(16);
  steps.forEach((st, i) => {
    const x = PDF_MARGIN + i * sw;
    doc.setFillColor(...(i === 3 ? PDF_BRAND.primary : PDF_BRAND.accent)); doc.circle(x + sw / 2, y, 2.2, "F");
    if (i < steps.length - 1) { doc.setDrawColor(...PDF_BRAND.cardBorder); doc.setLineWidth(0.5); doc.line(x + sw / 2 + 3, y, x + sw * 1.5 - 3, y); }
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(...PDF_BRAND.dark);
    doc.text(wrapPdfText(st, sw - 2, (l) => doc.getTextWidth(l)), x + sw / 2, y + 6, { align: "center" });
  });
  y += 16;
  text("En illustrativ resa. Alla köpare går inte igenom samtliga steg, och köparen avgör själv när den vill ha kontakt. Bilderna är illustrationer.", { size: 8.5, color: PDF_BRAND.textMuted });
  callout("Varför det spelar roll för er", isv
    ? "ISV-produkter blir ofta relevanta före, under eller efter valet av implementationspartner. Den som tydligt förklarar vilket problem produkten löser, hur integrationen fungerar, vad den kostar och vilka begränsningar som finns, finns med i kundens underlag."
    : "Kunden kan ha undersökt både lösningar och partners långt innan ni får möjlighet att träffas. Därför behöver er kompetens vara tydlig och begriplig redan under kundens research.");

  // ---- Page 3: d365.se active work
  newPage("Så arbetar d365.se");
  heading("Vi hjälper köpare framåt genom hela resan");
  bullets([
    "Redaktionella guider, artiklar och öppna svar på köparens frågor.",
    "Behovsanalyser, kalkylatorer och jämförelser.",
    isv ? "Tilläggskatalog med produktsidor och koppling till Dynamics 365-produkterna." : "Partnerprofiler med branscher, kundcase och experter.",
    "Identifiering av relevanta företagssignaler.",
    "Personlig rådgivning (frivillig för kunden) och kvalificering av möjliga kundprojekt.",
    "Introduktioner till relevanta partners och ISV-leverantörer, alltid med kundens samtycke.",
  ]);
  heading("Från anonym research till godkänd introduktion");
  table([
    ["1. Anonym research", "Köparen läser och jämför på egen hand."],
    ["2. Företagssignal", "Ett företag visar intresse, men ingen person är identifierad."],
    ["3. Uttryckligt intresse", "Köparen kontaktar d365.se eller laddar ned underlag med samtycke."],
    ["4. Kvalificerat kundprojekt", "Behov, tidplan och budget är genomgångna."],
    ["5. Godkänd introduktion", "Köparen väljer partner och samtycker till kontakt."],
  ], { head: ["Nivå", "Vad det betyder"] });
  callout("Aktivt arbete, inga garantier", "d365.se arbetar aktivt med efterfrågan men garanterar inte ett visst antal leads eller affärer. Betalning påverkar aldrig relevansordning, rekommendationer eller verifiering.", PDF_BRAND.primary);

  // ---- Page 4: chosen offer
  newPage(isv ? "ISV Presence" : "Premium");
  if (input.kind === "partner" && !input.premium) {
    heading("Grundprofil och Finder’s fee");
    text("Ni behåller den kostnadsfria Grundprofilen och tecknar endast Finder’s fee-avtalet. Premium kan läggas till senare och innehåller:");
  } else heading(isv ? "ISV Presence – hjälp kunden att upptäcka era lösningar" : "Premium – visa varför ni är rätt Dynamics-partner");
  text("Ingår", { bold: true, gap: 1 });
  bullets(isv ? ISV_BENEFITS : PREMIUM_BENEFITS.filter((b) => !b.includes("INSIDE") && !b.startsWith("Märket")).concat("Möjlighet att visa video på profilen."));
  text("Tillgängligt som tillägg", { bold: true, gap: 1 });
  bullets(isv ? ["Produktion av INSIDE-film, offereras separat."] : ["INSIDE, redaktionell expertintervju: 4 900 kr exklusive moms, endast för Premiumpartners.", ADDON_PRODUCT_NOTE], PDF_BRAND.textMuted);
  text("Kräver separat godkännande eller avtal", { bold: true, gap: 1 });
  bullets(isv
    ? ["Märkena Verifierad ISV och Verifierad tilläggslösning beslutas av redaktionen, aldrig genom betalning.", "Eventuella produktrelaterade kundintroduktioner (för närvarande pausade)."]
    : ["Märket Verifierad partner beslutas av redaktionen, aldrig genom betalning.", "Kundförmedling kräver ett separat Finder’s fee-avtal, med lägre mötesavgifter för Premiumpartners."], PDF_BRAND.primary);

  // ---- Page 5: prices and scope
  newPage("Priser och vald omfattning");
  heading("Ert val");
  table(input.kind === "partner" ? [...scope, ["Erbjudande", offerLabel(input)]] : [...scope, ["Erbjudande", "ISV Presence"]]);
  heading("Prisberäkning");
  table(priceRows);
  if (input.kind === "partner") {
    heading("Prislista Premium 2027");
    table([1, 2, 3].map((n) => [`${n} produktområde${n > 1 ? "n" : ""}`, `${kr(ORDER_PRICES.month[n])}/mån eller ${kr(ORDER_PRICES.year[n])}/år`] as [string, string]), { head: ["Omfattning", "Pris"] });
    text("Månad faktureras i efterskott med 3 månaders uppsägningstid. År faktureras i förskott. CE/CRM-applikationerna räknas som ett produktområde; upp till tre branscher per område. Alla priser exklusive moms. Inga rabatter utöver årspriset.", { size: 8.5, color: PDF_BRAND.textMuted });
  } else text("Faktureras årsvis i förskott. Introduktionspriset gäller de första 20 nya ISV-leverantörerna; d365.se bekräftar platsen vid granskning av beställningen. Alla priser exklusive moms.", { size: 8.5, color: PDF_BRAND.textMuted });
  text(`Avtalsperiod och förnyelse: ${AGREEMENT_DURATION_TERMS}`, { size: 8.5, color: PDF_BRAND.textMuted });

  // ---- Page 6: mediation / Finder’s fee
  newPage("Kundförmedling");
  heading("När kunden är redo hjälper vi till med nästa steg");
  text("d365.se identifierar relevanta kundbehov, erbjuder rådgivning, kvalificerar konkreta projekt, bedömer vilka leverantörer som är relevanta och hjälper kunden i kontakt med rätt kompetens.");
  if (input.kind === "partner") {
    heading("Finder’s fee, separat från Premiumabonnemanget");
    text("Ersättning utlöses först när ni har accepterat en introduktion och köparen har godkänt kontakt: en fast mötesavgift per kvalificerat möte, och en rörlig avgift (2,5%) om det blir affär. Mötesavgiften räknas av i sin helhet mot avgiften vid affär. Premiumpartners har lägre mötesavgift från 250 tkr och vid partnerbyte. Villkoren regleras i ett separat förmedlingsavtal.");
    table([
      ["Nya projekt under 250 tkr", "Möte 1 500 kr · 2,5 %, lägst 3 000 kr"],
      ["Nya projekt 250 tkr – 1 Mkr", "Möte 3 000 / 5 000 kr · 2,5 %"],
      ["Nya projekt över 1 Mkr", "Möte 6 000 / 9 000 kr · 2,5 %, högst 100 000 kr"],
      ["Partnerbyte BC, CRM, Power Platform", "Mötesavgift 3 000 / 5 000 kr"],
      ["Partnerbyte Finance & SCM", "Mötesavgift 6 000 / 9 000 kr"],
      ["Expertkonsult, upp till 6 mån eller under halvtid", "7 500 / 12 500 kr per uppdrag"],
      ["Expertkonsult, längre eller minst halvtid", "15 000 / 25 000 kr per uppdrag"],
    ], { head: ["Typ (Premium / Grundprofil)", "Avgift"] });
    text(input.mediation ? "Finder’s fee-avtalet ingår i ert val. Fullständiga villkor finns i bilagan." : "Finder’s fee-avtalet ingår inte i ert val men kan tecknas separat när som helst.", { bold: true });
    text("Introduktioner påverkar aldrig relevansordningen och innebär inga garanterade möten eller affärer.", { size: 9, color: PDF_BRAND.textMuted });
  } else {
    heading("Produktrelaterade kundintroduktioner");
    text("Finder’s fee för ISV-leverantörer är pausad tills vidare och ingår inte i detta erbjudande. Partnervillkoren gäller inte automatiskt för ISV-leverantörer.");
    text("Om ett produktrelaterat samarbete blir aktuellt i framtiden diskuteras villkoren separat, innan någon introduktion sker. ISV Presence innebär inga garanterade leads.");
  }

  // ---- Page 7: summary and next steps
  newPage("Beslut och nästa steg");
  heading("Ett samarbete som hjälper kunden att välja rätt");
  table([["Erbjudande", offerLabel(input)], ["Pris", `${headline}, exklusive moms`], ...scope]);
  bullets([
    "d365.se hjälper köpare tidigt i köpresan.",
    isv ? "ISV Presence ger bättre möjligheter att presentera era produkter när kunden undersöker kompletterande lösningar." : "Premium ger bättre möjligheter att presentera er kompetens när kunden jämför partners.",
    "d365.se arbetar även med rådgivning och kvalificerade kundintroduktioner.",
    "Samarbetet kan utvecklas över tid.",
  ]);
  heading("Nästa steg");
  bullets([
    "Gå igenom underlaget internt med vd, försäljningschef eller ledningsgrupp.",
    isv ? "Beställ i formuläret på d365.se/isvprogram/ när ni har ett internt godkännande." : `Skicka beställningen via e-post till ${ORDER_EMAIL} när ni har ett internt godkännande.`,
    "Komplettera profilen; redaktionen granskar uppgifterna och beslutar om verifiering.",
  ], PDF_BRAND.primary);
  ensure(16);
  const ctaUrl = isv ? "https://d365.se/isvprogram/#priser-innehall" : `mailto:${ORDER_EMAIL}`;
  doc.setFillColor(...PDF_BRAND.primary); doc.roundedRect(PDF_MARGIN, y - 2, 78, 11, 1.5, 1.5, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(255, 255, 255);
  doc.text("Gå vidare med erbjudandet", PDF_MARGIN + 6, y + 5);
  doc.link(PDF_MARGIN, y - 2, 78, 11, { url: ctaUrl });
  y += 16;
  callout("Kontakt", `Thomas Laine, d365.se · ${ORGANIZATION.email} · ${ORGANIZATION.telephoneDisplay}`, PDF_BRAND.primary);
  text("Dokumentstatus: offertförslag och beslutsunderlag, inte ett undertecknat avtal. Priser enligt gällande prislista; avtalet blir bindande först vid beställning.", { size: 8.5, color: PDF_BRAND.textMuted });

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
