/** Manuellt redigerade sökordsskärpningar per branschsida (rubrik, ingress, underrubriker). */
export interface IndustrySharpening {
  h1?: string;
  lead?: string;
  sections?: { heading: string; text: string }[];
  sectionsHeading?: string;
  /** Egen rubrik/text i rådgivningsrutan längst ned. */
  advisory?: { heading: string; text: string };
}

export const INDUSTRY_SHARPENING: Record<string, IndustrySharpening> = {
  "energi-utilities": {
    h1: "Vilken Dynamics 365-lösning och partner passar energisektorn?",
    lead:
      "För bolag i energisektorn (elnät, fjärrvärme, elhandel och utilities) handlar valet ofta om tillgångsförvaltning, fältservice, kund- och avtalshantering samt rapportering till myndigheter.",
  },
  "bygg-entreprenad": {
    advisory: {
      heading: "Boka 20 minuters kostnadsfri rådgivning kring affärssystem för bygg och entreprenad med Thomas Laine",
      text: "Thomas Laine hjälper er att reda ut kraven på kalkyl, mängdberäkning, projektredovisning och branschsystem, och vilka alternativ som är värda att jämföra. Ingen partner deltar i samtalet.",
    },
  },
  tillverkning: {
    lead:
      "Tillverkande företag har olika behov beroende på om de bedriver diskret tillverkning eller processindustri. Därför skiljer vi på de två nedan.",
    sectionsHeading: "Diskret tillverkning och processindustri",
    sections: [
      {
        heading: "Diskret tillverkning",
        text:
          "Diskret tillverkning gäller produkter som byggs av räknebara komponenter, till exempel maskiner, fordonsdelar och elektronik. Viktiga delar är stycklistor (BOM), operationsföljder, varianter, kundorderstyrd produktion och serienummerspårning. Business Central räcker ofta för mindre och medelstora tillverkare, medan Supply Chain Management passar vid flera fabriker, avancerad planering och större volymer.",
      },
      {
        heading: "Processindustri",
        text:
          "Processindustri gäller produktion med recept och formler, till exempel livsmedel, kemi och läkemedel. Här krävs batch- och partihantering, spårbarhet, kvalitetskontroll, biprodukter och ofta krav från myndigheter. Supply Chain Management har inbyggt stöd för processtillverkning; med Business Central behövs ofta en tilläggslösning.",
      },
    ],
  },
  "logistik-transport": {
    lead:
      "Logistiklösningar och transportlösningar i Dynamics 365 hänger ihop med ekonomi, lager, transportadministration och kundservice. Valet beror på om ni är 3PL, åkeri eller transportföretag, och hur mycket av helheten som ska ligga i samma system.",
    sectionsHeading: "Helhetslösningar för 3PL, åkerier och transportföretag",
    sections: [
      {
        heading: "3PL och tredjepartslogistik",
        text:
          "3PL-företag behöver lagerstyrning per kund, avtals- och aktivitetsbaserad debitering, EDI med kunderna och tydlig spårbarhet. Supply Chain Management passar vid flera lager och höga volymer, medan Business Central med WMS- och TA-tillägg kan räcka för mindre lagerverksamheter.",
      },
      {
        heading: "Åkerier och transportföretag",
        text:
          "Åkerier och transportföretag behöver ofta transportbokning, frakthantering, uppdragsekonomi, fordons- och förarkostnader samt fakturering per uppdrag. Specialiserade TMS- och TA-system integreras normalt med Business Central eller Finance, och Field Service kan stödja service och underhåll av fordon.",
      },
    ],
  },
  "fastighet-forvaltning": {
    h1: "Affärssystem för fastighetsbolag och fastighetsförvaltning: vilken Dynamics 365-lösning och partner passar?",
    lead:
      "Ett affärssystem för fastighetsbolag och fastighetsförvaltning behöver hantera hyresavier och avtal, fastighetsekonomi per objekt, underhåll och felanmälan samt rapportering till ägare och långivare.",
  },
  uthyrning: {
    h1: "Affärssystem för uthyrning, maskinuthyrning och rental",
    lead:
      "För företag inom maskinuthyrning, byggutrustning, event och containeruthyrning ställer uthyrningsverksamheten särskilda krav på affärssystemet. Här går vi igenom hur moderna affärssystem, särskilt Microsoft Dynamics 365 med dedikerade branschlösningar för rental, hanterar tillgänglighet i realtid, maskinindivider, automatiserad hyresfakturering och serviceunderhåll.",
    advisory: {
      heading: "Upphandla eller byta affärssystem för uthyrning?",
      text: "Boka ett kostnadsfritt 20-minuters rådgivningssamtal med Thomas Laine för vägledning kring systemval och partnerkrav. Ingen partner deltar i samtalet och ni förbinder er inte till något.",
    },
  },
};
