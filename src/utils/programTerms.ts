import { MONTH_PRICE, YEAR_PRICE, FEES, ISV_FEES, EXPERT_FEES } from "@/lib/budget2027";
import type { AgreementPdfSection } from "./generatePartnerAgreementPdf";

export type TermsArea = "partner" | "isv" | "commission";
const kr = (value: number) => `${value.toLocaleString("sv-SE")} kr`;
export const TERMS_DATE = "2026-11-10";
export const TERMS_AREAS: { id: TermsArea; title: string; description: string }[] = [
  { id: "partner", title: "Partner", description: "Partner Presence, produktområden, priser och abonnemangsvillkor." },
  { id: "isv", title: "ISV", description: "ISV Presence, extra produkter och villkor för presentation och verifiering." },
  { id: "commission", title: "Förmedlingsprovision", description: "Kundmöten, tecknade kundavtal, success fee och expertkonsulter för partners och ISV:er." },
];

export function termsPriceRows(area: TermsArea): [string, string][] {
  if (area === "partner") return [1, 2, 3].map((n) => [
    `Premium, ${n} produktområde${n > 1 ? "n" : ""}`,
    `${kr(MONTH_PRICE[n])}/mån eller ${kr(YEAR_PRICE[n])}/år`,
  ]);
  if (area === "isv") return [
    ["ISV Presence, inklusive en produkt", `${kr(ISV_FEES.base)}/år`],
    ["Varje extra produkt", `${kr(ISV_FEES.extraApp)}/år`],
  ];
  return [
    ["Genomfört kundmöte, Basic (BC, CRM, Power Platform och övrigt)", kr(FEES.meetingStd)],
    ["Genomfört kundmöte, Basic (F&SCM)", kr(FEES.meetingFscm)],
    ["Kundavtal tecknat (BC, CRM, Power Platform och övrigt)", kr(FEES.dealStd)],
    ["Kundavtal tecknat (F&SCM)", kr(FEES.dealFscm)],
    ["ISV: kundavtal tecknat (BC/CRM)", kr(ISV_FEES.introStd)],
    ["ISV: kundavtal tecknat (F&SCM)", kr(ISV_FEES.introFscm)],
    ["Success fee", `${(FEES.successRate * 100).toLocaleString("sv-SE")} %`],
    ["Expertförmedling, Premiumpartner", `${kr(EXPERT_FEES.premiumPerHour)}/debiterad timme`],
    ["Expertförmedling, Basicpartner", `${kr(EXPERT_FEES.basicPerHour)}/debiterad timme`],
  ];
}

export function termsSections(area: TermsArea): AgreementPdfSection[] {
  if (area === "partner") return [
    { title: "Partner Presence", body: "Standard (grundprofil) är kostnadsfri. Premium ger utökad presentation. CRM-applikationerna räknas som ett produktområde. Upp till tre branscher per produktområde ingår." },
    { title: "Fakturering och avtalstid", body: "Månadsabonnemang faktureras i efterskott. Avtalet löper initialt i tre månader från startdatum, med tre månaders uppsägningstid. Uppsägning sker skriftligen via e-post. Årsabonnemang faktureras i förskott. Startdatum och individuella villkor anges i överenskommelsen." },
    { title: "Verifiering och relevans", body: "Premium ger inte verifieringsstatus. Verifiering, publicering och kommersiellt avtal hålls isär. Betalning påverkar aldrig relevansordning eller rekommendationer. Förmedling regleras separat." },
  ];
  if (area === "isv") return [
    { title: "ISV Presence", body: "Grundavgiften gäller per ISV-leverantör och inkluderar en produkt. Varje ytterligare produkt debiteras enligt prisbilagan. Avgiften faktureras årsvis i förskott. Startdatum och övriga individuella villkor fastställs i överenskommelsen." },
    { title: "Presentation och verifiering", body: "Verifiering och ISV Presence är separata. Logotyp, webblänk och kontakt kräver både verifiering och aktiv ISV Presence. Utökad leverantörspresentation kan innehålla bilder, video, fördjupade funktioner och högst tre kundcase när material finns. Abonnemang påverkar aldrig relevans eller rekommendationer. Integrationsbelägg och partnerrelationer kräver dokumentation och redaktionell granskning." },
    { title: "Förmedling", body: "ISV Presence och förmedlingsersättning är separata. Introduktionens kommersiella villkor ska accepteras innan introduktionen genomförs. Se dokumentet Förmedlingsprovision." },
  ];
  return [
    { title: "Accept före introduktion", body: "Partnern eller ISV-leverantören får bedöma affärsmöjligheten och acceptera de kommersiella villkoren innan introduktionen genomförs. Förmedlingen regleras i en separat skriftlig överenskommelse." },
    { title: "Kundmöten och kundavtal, partners", body: "Mötesavgift gäller endast Basicpartners. Premiumpartners betalar ingen mötesavgift. För Basic avräknas betald mötesavgift från avtalsersättningen. För Premium gäller hela avtalsersättningen vid tecknat kundavtal." },
    { title: "Success fee, partners", body: "Success fee är 2,5 procent av konsult- och projektintäkter från första kronan under de första nio månaderna från projektstart, när intäkterna överstiger 100 000 kr. Licenser, molnförbrukning, hårdvara, resor och vidarefakturerade tredjepartskostnader ingår inte i beräkningsunderlaget." },
    { title: "ISV-förmedling", body: "Fast ersättning gäller en accepterad introduktion som leder till tecknat avtal: Business Central eller CRM 3 500 kr, Finance & Supply Chain Management 7 500 kr. Success fee på 2,5 procent tillkommer enligt separat förmedlingsavtal. Beräkningsunderlag och betalningsvillkor fastställs före introduktionen." },
    { title: "Förmedling av expertkonsulter", body: "Dynamic Factory förmedlar en eller flera experter. Partnern tecknar kundavtalet, debiterar kunden och har leveransansvaret. Ersättningen beräknas på faktiskt debiterade timmar: 40 kr per timme från Premiumpartner och 80 kr från Basicpartner. Samma expertuppdrag dubbelräknas inte med mötesavgift, avtalsersättning eller success fee." },
  ];
}

export async function downloadProgramTerms(area: TermsArea) {
  const { generatePartnerAgreementPdf } = await import("./generatePartnerAgreementPdf");
  const title = TERMS_AREAS.find((item) => item.id === area)?.title ?? area;
  const blob = await generatePartnerAgreementPdf({
    heading: `Avtalsvillkor: ${title}`,
    intro: `Sammanställning av publicerade kommersiella villkor, uppdaterad ${TERMS_DATE}. Dokumentet ersätter inte ett individuellt undertecknat avtal. Startdatum, eventuella rabatter och kompletterande villkor fastställs separat.`,
    sections: termsSections(area), priceRows: termsPriceRows(area),
    priceNote: "Alla belopp anges exklusive moms. Individuella rabatter och överenskommelser framgår av respektive avtal.",
    acceptance: "Bekräfta de individuella villkoren skriftligen innan samarbetet startar. Vid frågor, kontakta oss:",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `d365se-avtalsvillkor-${area}-${TERMS_DATE}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}