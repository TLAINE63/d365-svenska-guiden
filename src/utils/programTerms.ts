import { MONTH_PRICE, YEAR_PRICE, FEES, ISV_FEES, EXPERT_FEES } from "@/lib/budget2027";
import type { AgreementPdfSection } from "./generatePartnerAgreementPdf";
import { PARTNER_PROFILE_TERMS, PARTNER_FEE_NOTE } from "./partnerProfileTerms";

export type TermsArea = "partner" | "isv" | "commission";
const kr = (value: number) => `${value.toLocaleString("sv-SE")} kr`;
export const TERMS_DATE = "2026-11-13";
export const TERMS_AREAS: { id: TermsArea; title: string; description: string }[] = [
  { id: "partner", title: "Partner", description: "Grundprofil och Premium, redaktionell granskning inför verifiering, priser och abonnemangsvillkor." },
  { id: "isv", title: "ISV", description: "ISV Presence, extra produkter och villkor för presentation och verifiering." },
  { id: "commission", title: "Förmedlingsavtal (Finder’s fee)", description: "Samma villkor för alla partners: ingen mötesavgift, ersättning vid tecknat kundavtal, success fee och expertförmedling. Separata villkor för ISV:er." },
];

export function termsPriceRows(area: TermsArea): [string, string][] {
  if (area === "partner") return [1, 2, 3].map((n) => [
    `Premium, ${n} produktområde${n > 1 ? "n" : ""}`,
    `${kr(MONTH_PRICE[n])}/mån eller ${kr(YEAR_PRICE[n])}/år`,
  ]);
  if (area === "isv") return [
    ["ISV Presence, inklusive en produkt", `${kr(ISV_FEES.base)}/år`],
    ["Varje extra produkt", `${kr(ISV_FEES.extraApp)}/år`],
    ["ISV Presence, introduktionspris första året (de första 20)", kr(2990)],
  ];
  return [
    ["Kundavtal tecknat (BC, CRM, Power Platform och övrigt)", kr(FEES.dealStd)],
    ["Kundavtal tecknat (F&SCM)", kr(FEES.dealFscm)],
    ["ISV Business Referral: licenser/abonnemang, första 12 månaderna", "5 %"],
    ["ISV Business Referral: förmedlat konsultuppdrag", "2,5 %"],
    ["Success fee", `${(FEES.successRate * 100).toLocaleString("sv-SE")} %`],
    ["Expertförmedling", `${kr(EXPERT_FEES.premiumPerHour)}/debiterad timme`],
  ];
}

export function termsSections(area: TermsArea): AgreementPdfSection[] {
  if (area === "partner") return [
    ...PARTNER_PROFILE_TERMS,
    { title: "Produktområden", body: "CRM-applikationerna räknas som ett produktområde. Upp till tre branscher per produktområde ingår i Premium." },
    { title: "Fakturering och avtalstid", body: "Prislista 2027 gäller från 2026-11-10. Månadsabonnemang faktureras i efterskott med tre månaders uppsägningstid, meddelad i god tid före varje kvartals början. Uppsägning sker skriftligen via e-post. Årsabonnemang faktureras i förskott. Startdatum och individuella villkor anges i överenskommelsen." },
  ];
  if (area === "isv") return [
    { title: "ISV Presence", body: "Grundavgiften gäller per ISV-leverantör och inkluderar en produkt. Varje ytterligare produkt debiteras enligt prisbilagan. Avgiften faktureras årsvis i förskott. Startdatum och övriga individuella villkor fastställs i överenskommelsen." },
    { title: "Presentation och verifiering", body: "Verifiering och ISV Presence är separata. Logotyp, webblänk och kontakt kräver både verifiering och aktiv ISV Presence. Utökad leverantörspresentation kan innehålla bilder, video, fördjupade funktioner och högst tre kundcase när material finns. Abonnemang påverkar aldrig relevans eller rekommendationer. Integrationsbelägg och partnerrelationer kräver dokumentation och redaktionell granskning." },
    { title: "Förmedling", body: "ISV Presence och förmedlingsersättning är separata. Introduktionens kommersiella villkor ska accepteras innan introduktionen genomförs. Se dokumentet Förmedlingsavtal (Finder’s fee)." },
  ];
  return [
    ...PARTNER_PROFILE_TERMS,
    { title: "Accept före introduktion", body: "Partnern eller ISV-leverantören får bedöma affärsmöjligheten och acceptera de kommersiella villkoren innan introduktionen genomförs. Förmedlingen regleras i en separat skriftlig överenskommelse." },
    { title: "Success fee, partners", body: "Success fee är 2,5 procent av konsult- och projektintäkter från första kronan under de första nio månaderna från projektstart, när intäkterna överstiger 100 000 kr. Licenser, molnförbrukning, hårdvara, resor och vidarefakturerade tredjepartskostnader ingår inte i beräkningsunderlaget." },
    { title: "ISV Business Referral", body: "Gäller endast när ISV-leverantören säljer direkt till kunden efter en accepterad introduktion. Ingen fast avgift och ingen mötesavgift. Ersättningen är 5 procent av licens- och abonnemangsintäkterna under de första 12 månaderna och 2,5 procent av förmedlade konsultintäkter, exklusive moms. Säljs lösningen via kundens Dynamics 365-partner gäller partnerns villkor i stället. Beräkningsunderlag och betalningsvillkor fastställs före introduktionen." },
    { title: "Förmedling av expertkonsulter", body: "Dynamic Factory förmedlar en eller flera experter. Partnern tecknar kundavtalet, debiterar kunden och har leveransansvaret. Ersättningen beräknas på faktiskt debiterade timmar: 50 kr per debiterad timme. Samma expertuppdrag dubbelräknas inte med avtalsersättning eller success fee." },
  ];
}

export async function downloadProgramTerms(area: TermsArea) {
  let mod: typeof import("./generatePartnerAgreementPdf");
  try {
    mod = await import("./generatePartnerAgreementPdf");
  } catch {
    // Sidan laddades före senaste publiceringen: ladda om en gång så nya filer hämtas.
    if (!sessionStorage.getItem("terms-reload")) {
      sessionStorage.setItem("terms-reload", "1");
      window.location.reload();
    }
    throw new Error("pdf-module");
  }
  sessionStorage.removeItem("terms-reload");
  const { generatePartnerAgreementPdf } = mod;
  const title = TERMS_AREAS.find((item) => item.id === area)?.title ?? area;
  const blob = await generatePartnerAgreementPdf({
    heading: `Avtalsvillkor: ${title}`,
    intro: `Sammanställning av publicerade kommersiella villkor, uppdaterad ${TERMS_DATE}. Dokumentet ersätter inte ett individuellt undertecknat avtal. Startdatum, eventuella rabatter och kompletterande villkor fastställs separat.`,
    sections: termsSections(area), priceRows: termsPriceRows(area),
    priceNote: area === "isv" ? "Alla belopp anges exklusive moms. Individuella rabatter och överenskommelser framgår av respektive avtal." : PARTNER_FEE_NOTE,
    acceptance: "Bekräfta de individuella villkoren skriftligen innan samarbetet startar. Vid frågor, kontakta oss:",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `d365se-avtalsvillkor-${area}-${TERMS_DATE}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}