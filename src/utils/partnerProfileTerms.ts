import { MONTHLY_BILLING_TERMS, PREMIUM_MEETING_TERMS } from "@/lib/partnerOrder";

/** Shared profile terms for every generated partner agreement. */
export const PARTNER_PROFILE_TERMS = [
  { title: "Månadsabonnemang och mötesavgift", body: `${MONTHLY_BILLING_TERMS}\n\n${PREMIUM_MEETING_TERMS}` },
  { title: "Grundprofil", body: "Grundprofil är kostnadsfri och ger en grundläggande presentation av partnerns produktområden och kompetenser. Grundprofil innebär inte att uppgifterna har verifierats av d365.se-redaktionen." },
  { title: "Premium: gör er kompetens tydligare för köparen", body: "Premium ger köparen ett mer utförligt underlag för att bedöma er som partner. Redaktionell granskning, fördjupad presentation och löpande uppföljning ingår.\n\nPremium innehåller inga utlovade möten. Förmånen är lägre mötesavgift när en introduktion blir aktuell." },
  { title: "Granskade uppgifter och märket Verifierad partner", body: "Redaktionell granskning av partneruppgifterna inför verifiering ingår. Efter d365.se-redaktionens godkännande får profilen märket Verifierad partner.\n\nVerifieringen beslutas manuellt och sker aldrig automatiskt genom betalning." },
  { title: "Visa vad ni kan med kundcase, experter och video", body: "En fördjupad presentation med kundcase och experter hjälper köparen att förstå er erfarenhet och kompetens. Möjlighet att visa video på profilen ingår." },
  { title: "Följ upp profilen med statistik och personlig kontakt", body: "Kvartalsvis genomgång, profilstatistik och en namngiven kontaktperson ingår. Det ger er underlag för att följa profilens utveckling och hålla presentationen aktuell." },
  { title: "INSIDE-produktion: separat tillval", body: "INSIDE-produktion ingår inte i Premiumabonnemanget. Den köps separat och erbjuds endast Premiumpartners." },
  { title: "Förmedling och neutral relevans", body: "Finder’s fee-avtalet har samma villkor för alla partners inom respektive nivå. Mötesavgiften är 1 000 kr för Premium eller 3 500 kr för Grundprofil, oavsett produktområde. Den tas ut per kvalificerat möte och räknas av i sin helhet mot avgiften vid affär (2,5 %).\n\nNya projekt, partnerbyte och expertförmedling regleras i förmedlingsavtalet. Partnern får bedöma möjligheten och acceptera de kommersiella villkoren innan introduktionen genomförs.\n\nBetalning påverkar aldrig relevansordning eller rekommendationer." },
];

export const PARTNER_FEE_NOTE = "Samma villkor för alla partners inom respektive nivå. Betald mötesavgift räknas av mot avgiften vid affär och avräkningen blir aldrig negativ. Alla priser exklusive moms.";

/** Every Premium benefit, printed in every agreement PDF so it stands alone when forwarded internally. */
export const PREMIUM_BENEFITS_TITLE = "Detta ingår i Premiumavtalet";
export const PREMIUM_BENEFITS = [
  "Märket Verifierad partner efter redaktionell granskning av d365.se-redaktionen (beslutas manuellt, aldrig automatiskt genom betalning).",
  "Utökad partnerprofil med fördjupad presentation per produktområde, kundcase och namngivna experter.",
  "Knappen \u201dTill partnerns webbplats\u201d och länk till egen landningssida per produktområde, med mätbara klick.",
  "Möjlighet att visa video på profilen samt INSIDE-produktion (endast för Premiumpartners, 4 900 kr exkl. moms).",
  "Commerce, Human Resources och Project Operations ingår kostnadsfritt som tilläggsområden.",
  "Profilstatistik och månadsbrev med partnerns egna siffror jämfört med föregående månad.",
  "Kvartalsvis genomgång och en namngiven kontaktperson på d365.se.",
  "Samma neutrala relevansordning som alla andra: Premium påverkar aldrig ranking eller rekommendationer.",
];

export const ISV_BENEFITS_TITLE = "Detta ingår i ISV Presence";
export const ISV_BENEFITS = [
  "Verifieringsprocessen (grundkontroll) av leverantör och app; märkena Verifierad ISV och Verifierad tilläggslösning med datum efter redaktionens godkännande (aldrig automatiskt genom betalning).",
  "Logotyp, webblänk och kontaktuppgifter för verifierad leverantör och app i tilläggskatalogen.",
  "Upp till tre aktiva demofilmer från YouTube per app, som även visas under Produktdemonstrationer i d365.se INSIDE.",
  "Möjlighet till visning på businesscentral.se för Business Central-appar.",
  "Samma neutrala katalogordning som alla andra: betalning påverkar aldrig ordning eller rekommendationer.",
];
