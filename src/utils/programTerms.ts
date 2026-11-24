import { MONTH_PRICE, YEAR_PRICE, ISV_FEES } from "@/lib/budget2027";
import type { AgreementPdfSection } from "./generatePartnerAgreementPdf";
import { PARTNER_PROFILE_TERMS, PARTNER_FEE_NOTE } from "./partnerProfileTerms";
import { AGREEMENT_DURATION_TERMS, MONTHLY_BILLING_TERMS, PREMIUM_MEETING_TERMS } from '@/lib/partnerOrder';

export const KVALIFICERAT_MOTE = "Ett kvalificerat möte är ett genomfört möte mellan partnern och en potentiell kund, där d365.se före introduktionen har:\n• identifierat ett konkret affärs-, system- eller förändringsbehov\n• bedömt att behovet är relevant för partnerns erbjudande\n• haft kontakt med en beslutsfattare eller projektansvarig hos kunden\n• dokumenterat kundens nuläge, behov och tidsram, samt en uppskattad omfattning\n• fått kundens önskemål om att träffa partnern\n• fått partnerns accept av de kommersiella villkoren.\n\nMötesavgift debiteras först efter genomfört möte. Avbokade eller uteblivna möten debiteras inte. Ett kvalificerat möte innebär ingen garanti för att kunden genomför ett projekt eller väljer partnern.";
export const KOPARENS_FRIA_VAL = "Köparen träffar högst tre partners per förfrågan och väljer själv vilka. Köparen kan alltid kontakta vilken partner som helst i katalogen direkt, utan att någon avgift tas ut. Finder’s fee gäller endast när d365.se har genomfört behovsanalysen och introduktionen.";
export const UPPFOLJNING = "d365.se följer upp med köparen efter mötet. Partnern lämnar på begäran underlag för rapporterat konsult- och projektvärde.";
export const TIDSGRANSER = [
  "Reklamation av kvalificering: 5 arbetsdagar efter mötet.",
  "Vunnen affär rapporteras inom 14 dagar efter avtal med kund.",
  "Fakturerat konsult- och projektvärde rapporteras kvartalsvis under de första 12 månaderna.",
  "Tidsfönster: 12 månader från mötet. För expertförmedling: 12 månader från intervjun.",
  "Befintlig kundrelation: partnern visar aktiv dialog inom 5 arbetsdagar.",
];

export type TermsArea = "partner" | "isv" | "commission";
const kr = (value: number) => `${value.toLocaleString("sv-SE")} kr`;
export const TERMS_DATE = "2026-11-24";
export const TERMS_AREAS: { id: TermsArea; title: string; description: string }[] = [
  { id: "partner", title: "Partner", description: "Grundprofil och Premium, redaktionell granskning inför verifiering, priser och abonnemangsvillkor." },
  { id: "isv", title: "ISV", description: "ISV Presence, extra produkter och villkor för presentation och verifiering." },
  { id: "commission", title: "Förmedlingsavtal (Finder’s fee)", description: "Samma villkor för alla partners inom respektive nivå: mötesavgift efter produktområde, 2,5 % vid affär med avräkning, för nya projekt, partnerbyte och expertförmedling." },
];

export function termsPriceRows(area: TermsArea): [string, string][] {
  if (area === "partner") return [1, 2, 3].map((n) => [
    `Premium, ${n} produktområde${n > 1 ? "n" : ""}`,
    `${kr(MONTH_PRICE[n])}/mån eller ${kr(YEAR_PRICE[n])}/år`,
  ]);
  if (area === "isv") return [
    ["ISV Presence, inklusive en produkt", `${kr(ISV_FEES.introFirstYear)} första året (ordinarie ${kr(ISV_FEES.base)}/år)`],
    ["Varje extra produkt utöver den som ingår", `${kr(ISV_FEES.extraApp)}/år`],
    ["Introduktionspriset gäller", "De första 20 ISV-leverantörerna, första avtalsåret"],
  ];
  return [
    ["Band 1: Business Central, fristående Power Platform och Copilot", "Mötesavgift 1 000 kr (Premium) / 3 000 kr (Grundprofil)"],
    ["Band 2: CRM", "Mötesavgift 1 500 kr (Premium) / 4 000 kr (Grundprofil)"],
    ["Band 3: Finance, SCM, Project Operations, Commerce, Human Resources", "Mötesavgift 2 000 kr (Premium) / 5 000 kr (Grundprofil)"],
    ["Gäller", "Nya projekt, partnerbyte och expertförmedling (per expert, efter intervju)"],
    ["Avgift vid affär", "2,5 % av fakturerat konsult- och projektvärde under de första 12 månaderna, högst 100 000 kr per affär"],
    ["ISV: Finder’s fee", "Pausad tills vidare"],
  ];
}

export function termsSections(area: TermsArea): AgreementPdfSection[] {
  if (area === "partner") return [
    ...PARTNER_PROFILE_TERMS,
    { title: "Produktområden", body: "CRM-applikationerna räknas som ett produktområde. Upp till tre branscher per produktområde ingår i Premium." },
    { title: "Fakturering och avtalstid", body: `${AGREEMENT_DURATION_TERMS}\n\nPrislista 2027 uppdaterad 2026-11-24.\n\n${MONTHLY_BILLING_TERMS}\n\n${PREMIUM_MEETING_TERMS}\n\nÅrsabonnemang faktureras i förskott. Startdatum och individuella villkor anges i överenskommelsen.` },
  ];
  if (area === "isv") return [
    { title: "Avtalstid och prisjustering", body: AGREEMENT_DURATION_TERMS },
    { title: "ISV Presence", body: "Grundavgiften gäller per ISV-leverantör och inkluderar en produkt. Varje ytterligare produkt debiteras enligt prisbilagan. Avgiften faktureras årsvis i förskott. Startdatum och övriga individuella villkor fastställs i överenskommelsen." },
    { title: "Presentation och verifiering", body: "Verifiering och ISV Presence är separata. Logotyp, webblänk och kontakt kräver både verifiering och aktiv ISV Presence.\n\nUtökad leverantörspresentation kan innehålla bilder, video, fördjupade funktioner och högst tre kundcase när material finns.\n\nAbonnemang påverkar aldrig relevans eller rekommendationer. Integrationsbelägg och partnerrelationer kräver dokumentation och redaktionell granskning." },
    { title: "Förmedling", body: "ISV Presence och förmedlingsersättning är separata. Introduktionens kommersiella villkor ska accepteras innan introduktionen genomförs. Se dokumentet Förmedlingsavtal (Finder’s fee)." },
  ];
  return [
    ...PARTNER_PROFILE_TERMS,
    { title: "Avtalstid och prisjustering", body: AGREEMENT_DURATION_TERMS },
    { title: "Accept före introduktion", body: "Partnern eller ISV-leverantören får bedöma affärsmöjligheten och acceptera de kommersiella villkoren innan introduktionen genomförs. Förmedlingen regleras i en separat skriftlig överenskommelse." },
    { title: "Mötesavgift efter produktområde", body: "Mötesavgiften bestäms av produktområde. Samma belopp gäller för nya projekt, partnerbyte och expertförmedling.\n\nBand 1: Business Central. Power Platform och Copilot som fristående projekt. Mötesavgift 1 000 kr (Premium) / 3 000 kr (Grundprofil).\n\nBand 2: CRM: Sales, Customer Service, Contact Center, Field Service, Customer Insights. Mötesavgift 1 500 kr (Premium) / 4 000 kr (Grundprofil).\n\nBand 3: Finance, Supply Chain Management, Project Operations, Commerce, Human Resources. Mötesavgift 2 000 kr (Premium) / 5 000 kr (Grundprofil).\n\nIngår Power Platform eller Copilot i ett CRM- eller ERP-projekt följer de det produktområdets band. Omfattar affären flera produktområden gäller det högsta bandet.\n\nVid expertförmedling tas mötesavgiften ut när kunden har haft intervju med experten, inte när ett CV skickas. Avgiften gäller per expert." },
    { title: "Premiumpris vid mötet", body: PREMIUM_MEETING_TERMS },
    { title: "Avgift vid affär", body: "Vid affär: 2,5 % av fakturerat konsult- och projektvärde under de första 12 månaderna från kundavtalet, för avtal som tecknas inom 12 månader från mötet. Högst 100 000 kr per affär. Betald mötesavgift räknas av i sin helhet, och avräkningen blir aldrig negativ. Gäller nya projekt, partnerbyte och expertförmedling.\n\nLicenser, molnförbrukning, hårdvara, resor och vidarefakturerade tredjepartskostnader ingår inte. Alla belopp är exklusive moms." },
    { title: "Kvalificerat möte", body: KVALIFICERAT_MOTE },
    { title: "Köparens fria val", body: KOPARENS_FRIA_VAL },
    { title: "Uppföljning", body: UPPFOLJNING },
    { title: "Tidsgränser", body: TIDSGRANSER.join("\n\n") },
    { title: "Förmedling av expertkonsulter", body: "Dynamic Factory förmedlar en eller flera experter. Partnern tecknar kundavtalet, debiterar kunden och har leveransansvaret." },
    { title: "ISV", body: "ISV: Finder’s fee: pausad tills vidare och erbjuds inte just nu." },
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
    sections: termsSections(area), benefits: area === "isv" ? "isv" : area === "commission" ? "none" : "partner", priceRows: termsPriceRows(area),
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