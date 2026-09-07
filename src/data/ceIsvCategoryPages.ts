// Indexerbara landningssidor för utvalda tilläggskategorier inom Customer Engagement.
// Endast kategorier med tillräckligt innehåll och tydligt köpintresse listas här –
// vi genererar medvetet inte hundratals tunna filterkombinationer.

import type { CeApp } from "@/data/bcIsvSolutions";

export interface CeCategoryPage {
  /** URL-segment under /customer-engagement/tillagg/ */
  slug: string;
  /** Kategorier i katalogen som sidan samlar. */
  categories: string[];
  /** CE-applikation som förväljs i katalogen. */
  ceApp?: CeApp;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Frågor sidan ska kunna svara på (används som rubriker och FAQ). */
  faq: { q: string; a: string }[];
}

export const CE_CATEGORY_PAGES: CeCategoryPage[] = [
  {
    slug: "cpq",
    categories: ["CPQ"],
    ceApp: "Sales",
    h1: "CPQ-lösningar för Dynamics 365 Sales",
    metaTitle: "CPQ för Dynamics 365 Sales – lösningar och urval",
    metaDescription:
      "Vilka CPQ-lösningar finns för Dynamics 365 Sales? Jämför konfigurations-, pris- och offertlösningar, se när de passar och vad du behöver tänka på.",
    intro:
      "CPQ (Configure, Price, Quote) används när produkter och tjänster är för komplexa för standardofferter i Dynamics 365 Sales. Här samlar vi lösningar som hanterar konfiguration, regelstyrd prissättning och offertgenerering.",
    faq: [
      {
        q: "Vilka CPQ-lösningar finns för Dynamics 365 Sales?",
        a: "Det finns både lösningar byggda direkt i Dynamics och externa CPQ-plattformar som integreras mot Sales. Valet styrs oftast av hur komplex konfigurationen är och var produktdata och prislogik ska bo.",
      },
      {
        q: "När räcker inte standardoffert i Dynamics 365 Sales?",
        a: "När produkter konfigureras av regler, när prissättningen har många beroenden eller när offerten behöver kopplas till produktion, ERP eller engineering.",
      },
    ],
  },
  {
    slug: "marketing-automation",
    categories: ["Marketing automation", "Marketing integration"],
    ceApp: "Customer Insights (Marketing)",
    h1: "Marketing automation för Dynamics 365",
    metaTitle: "Marketing automation för Dynamics 365 – alternativ och tillägg",
    metaDescription:
      "Vilka marketing automation-lösningar fungerar med Dynamics 365? Se lösningar som kompletterar eller ersätter Customer Insights – Journeys och vad som skiljer dem åt.",
    intro:
      "Marketing automation kan antingen komplettera Microsoft Customer Insights – Journeys eller i praktiken fungera som ett alternativ inom ett funktionsområde. Vi markerar i varje produkttext om lösningen kompletterar, integrerar med eller ersätter delar av Microsofts egna funktioner.",
    faq: [
      {
        q: "Vilka marketing automation-lösningar fungerar med Dynamics 365?",
        a: "Det finns lösningar som är byggda i Dynamics-plattformen och externa plattformar som integreras via connectorer. Skillnaden märks framför allt i var data ligger och hur segmentering och samtycke hanteras.",
      },
      {
        q: "Behöver jag Customer Insights – Journeys om jag har en annan plattform?",
        a: "Inte alltid. Vissa organisationer väljer en extern plattform för utskick och nurturing och använder Dynamics som CRM-kärna. Det viktiga är att bestämma var kunddata och samtycke ska förvaltas.",
      },
    ],
  },
  {
    slug: "contact-center",
    categories: ["Contact Center / CCaaS"],
    ceApp: "Contact Center",
    h1: "Contact center-lösningar för Dynamics 365 Customer Service",
    metaTitle: "Contact center för Dynamics 365 – CCaaS-lösningar",
    metaDescription:
      "Vilka contact center-lösningar integrerar med Dynamics 365 Customer Service? Jämför CCaaS-plattformar, se när de passar och vad du behöver utvärdera.",
    intro:
      "Contact center är en egen dimension och inte bara en synonym till Customer Service. Här samlar vi CCaaS-plattformar med röst, digitala kanaler, köhantering och agentarbetsyta som integreras med Dynamics 365.",
    faq: [
      {
        q: "Vilka contact center-lösningar integrerar med Dynamics 365 Customer Service?",
        a: "Flera större CCaaS-plattformar har färdiga integrationer mot Dynamics med agentarbetsyta, skärmpopp och samtalsloggning. Omfattningen på integrationen skiljer sig dock mellan plattformarna.",
      },
      {
        q: "Vad skiljer contact center från vanlig telefoni?",
        a: "Telefoni/CTI kopplar samtal till CRM. Ett contact center hanterar dessutom köer, kompetensbaserad routing, flera kanaler, bemanningsplanering och uppföljning.",
      },
    ],
  },
  {
    slug: "telephony-cti",
    categories: ["Telephony / CTI"],
    ceApp: "Sales",
    h1: "Telefoni och CTI för Dynamics 365",
    metaTitle: "Telefoni och CTI för Dynamics 365 – integrationer",
    metaDescription:
      "Telefoni- och CTI-integrationer för Dynamics 365: skärmpopp, klick-att-ringa och samtalsloggning. Se skillnaden mot ett fullt contact center.",
    intro:
      "Alla behöver inte ett fullständigt contact center. Här samlar vi telefoni- och CTI-integrationer som kopplar samtal, klick-att-ringa och samtalshistorik till Dynamics 365.",
    faq: [
      {
        q: "Vilka telefonilösningar kan kopplas till Dynamics 365?",
        a: "Både molntelefoni från de stora leverantörerna och specialiserade CTI-produkter kan integreras. Kontrollera vilken Dynamics-version och vilket gränssnitt integrationen stödjer.",
      },
      {
        q: "När räcker CTI och när behövs contact center?",
        a: "CTI räcker ofta för säljteam och mindre supportgrupper. Behöver du köer, routing, digitala kanaler och bemanningsplanering är CCaaS rätt nivå.",
      },
    ],
  },
  {
    slug: "field-service",
    categories: ["Field Service mobility", "Field Service extensions", "Inspections"],
    ceApp: "Field Service",
    h1: "Tillägg för Dynamics 365 Field Service",
    metaTitle: "Tillägg för Dynamics 365 Field Service – mobilitet och inspektioner",
    metaDescription:
      "Vilka tillägg finns till Dynamics 365 Field Service? Mobilitet, offlineläge, inspektioner och utökade fältserviceflöden – med köparsidiga urvalsråd.",
    intro:
      "Field Service-tillägg löser olika typer av problem: mobilitet och offlineläge, digitala inspektioner och checklistor, samt utökade processer för avtal, planering och service. Vi särskiljer dem så att du kan matcha rätt lösning mot rätt behov.",
    faq: [
      {
        q: "Vilka tillägg finns till Dynamics 365 Field Service?",
        a: "De vanligaste områdena är mobilappar med offlinestöd, inspektions- och checklisteverktyg samt branschanpassade utökningar av serviceflödet.",
      },
      {
        q: "När behövs en extern mobilapp i stället för standardappen?",
        a: "Framför allt vid krav på avancerat offlineläge, omfattande formulär eller specifika fältflöden som standardappen inte täcker.",
      },
    ],
  },
  {
    slug: "territory-maps",
    categories: ["Territory & Maps"],
    ceApp: "Field Service",
    h1: "Kart- och ruttlösningar för Dynamics 365",
    metaTitle: "Kartor, rutter och distrikt för Dynamics 365",
    metaDescription:
      "Vilka kart- och ruttlösningar finns för Dynamics 365 Field Service och Sales? Distriktsplanering, ruttoptimering och geografisk analys direkt i CRM.",
    intro:
      "Kart- och ruttlösningar används för distriktsplanering, ruttoptimering, geografisk analys och besöksplanering – både för säljteam och fältservice.",
    faq: [
      {
        q: "Vilka kart- och ruttlösningar finns för Dynamics 365 Field Service?",
        a: "Det finns flera kartlösningar byggda i Dynamics som hanterar rutter, distrikt och närhetssökningar, samt mer GIS-orienterade alternativ.",
      },
      {
        q: "Vad bör man kontrollera innan man väljer kartlösning?",
        a: "Kontrollera kartunderlag och licens, hur ruttoptimeringen fungerar i praktiken, datakvaliteten på adresser samt hur mobilt arbete stöds.",
      },
    ],
  },
  {
    slug: "crm-datakvalitet",
    categories: ["CRM datakvalitet"],
    ceApp: "Sales",
    h1: "Datakvalitet och dubbletthantering i Dynamics 365 CRM",
    metaTitle: "Dubbletter och datakvalitet i Dynamics 365 CRM",
    metaDescription:
      "Hur hanterar man dubbletter i Dynamics 365 CRM? Se lösningar för dubblettidentifiering, sammanslagning och löpande datakvalitet.",
    intro:
      "Dålig datakvalitet slår igenom i segmentering, rapportering och kundupplevelse. Här samlar vi lösningar för att hitta, slå ihop och förebygga dubbletter samt hålla adress- och kontaktdata korrekt.",
    faq: [
      {
        q: "Hur kan man hantera dubbletter i Dynamics 365 CRM?",
        a: "Standardfunktionen hittar enkla dubbletter. Specialiserade lösningar klarar luddig matchning, massrensning, sammanslagning med regler och kontroll redan vid registrering.",
      },
      {
        q: "När är det värt att köpa ett datakvalitetsverktyg?",
        a: "När databasen växer, när flera källor skriver till CRM eller när marknadsföring och rapportering påverkas av dubbletter.",
      },
    ],
  },
  {
    slug: "e-signatur-avtal",
    categories: ["E-signatur & avtal", "Dokumentautomation"],
    ceApp: "Sales",
    h1: "E-signatur och dokumentautomation för Dynamics 365 Sales",
    metaTitle: "E-signatur och dokument för Dynamics 365 Sales",
    metaDescription:
      "Vilka e-signaturlösningar fungerar med Dynamics 365 Sales? Se lösningar för avtal, dokumentgenerering och signering direkt från CRM.",
    intro:
      "Offert, avtal och signering hör ihop. Här samlar vi lösningar för dokumentgenerering ur Dynamics-data och elektronisk signering som återrapporterar status till CRM.",
    faq: [
      {
        q: "Vilka e-signaturlösningar fungerar med Dynamics 365 Sales?",
        a: "De etablerade signeringstjänsterna har färdiga integrationer där avtalet skapas från CRM-data och signeringsstatus skrivs tillbaka till affären.",
      },
      {
        q: "Behöver jag både dokumentautomation och e-signatur?",
        a: "Ofta ja. Dokumentautomation skapar rätt dokument ur CRM-data, e-signatur hanterar undertecknandet och spårbarheten.",
      },
    ],
  },
];

export const findCeCategoryPage = (slug?: string) =>
  CE_CATEGORY_PAGES.find((p) => p.slug === slug);
