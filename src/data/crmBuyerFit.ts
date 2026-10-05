/**
 * Manuellt underhållen köparbedömning per CRM-område.
 * Visas direkt efter "Kort svar" så att besökaren ser om lösningstypen
 * är relevant innan produktbeskrivningen. Genereras aldrig av AI vid körning.
 */
export interface CrmBuyerFit {
  /** Köparens begrepp för området, visas som rubrikens kontext. */
  category: string;
  fits: string[];
  notFits: string[];
  alternatives: { label: string; to?: string }[];
  decisive: string[];
}

export type CrmBuyerFitKey = "sales" | "service" | "field" | "insights" | "contact";

export const crmBuyerFit: Record<CrmBuyerFitKey, CrmBuyerFit> = {
  sales: {
    category: "säljsystem och CRM för B2B-försäljning",
    fits: [
      "B2B-försäljning med längre säljcykler, flera beslutsfattare och offerter som behöver följas upp i en pipeline.",
      "Säljteam som redan arbetar i Outlook, Teams och Excel och vill att aktiviteter loggas där de arbetar.",
      "Organisationer som behöver prognoser, territorier eller godkännandeflöden och vill koppla CRM till affärssystemet.",
    ],
    notFits: [
      "Ett litet team som främst behöver en kontaktlista och enkel uppföljning av affärer.",
      "Verksamheter utan definierad säljprocess, där verktyget förväntas skapa processen åt dem.",
      "Bolag som saknar intern ägare för CRM efter driftstart.",
    ],
    alternatives: [
      { label: "Dynamics 365 Sales vs Salesforce Sales Cloud", to: "/jamfor/sales-vs-salesforce-sales-cloud/" },
      { label: "Dynamics 365 Sales vs HubSpot Sales Hub", to: "/jamfor/sales-vs-hubspot-sales-hub/" },
      { label: "Nordiska säljsystem som Lime och SuperOffice (se CRM-guiden)", to: "/crm/" },
    ],
    decisive: [
      "Hur komplex säljprocessen är: antal steg, offerter, avtal och godkännanden.",
      "Vilka system CRM ska integreras med, särskilt affärssystem och Microsoft 365.",
      "Om säljarna kommer att använda systemet dagligen, inte bara registrera i efterhand.",
      "Partnerns erfarenhet av säljprocesser i er bransch.",
    ],
  },
  service: {
    category: "kundservicesystem och ärendehantering",
    fits: [
      "Kundservice som hanterar ärenden i flera kanaler (e-post, chatt, telefon, portal) och behöver gemensam ärendehistorik.",
      "Organisationer med SLA:er, eskaleringar och kunskapsbas som ska styra hur ärenden prioriteras.",
      "Bolag som vill dela kunddata mellan kundservice, sälj och fältservice i samma plattform.",
    ],
    notFits: [
      "En liten supportfunktion som främst behöver en delad inkorg.",
      "Ren IT-servicedesk för interna användare, där ITSM-verktyg ofta passar bättre.",
      "Verksamheter som vill komma igång på dagar utan anpassning eller integration.",
    ],
    alternatives: [
      { label: "Dynamics 365 Customer Service vs Zendesk", to: "/jamfor/customer-service-vs-zendesk/" },
      { label: "Dynamics 365 Customer Service vs ServiceNow CSM", to: "/jamfor/customer-service-vs-servicenow-csm/" },
      { label: "Dynamics 365 Customer Service vs Salesforce Service Cloud", to: "/jamfor/customer-service-vs-salesforce-service-cloud/" },
    ],
    decisive: [
      "Antal kanaler och ärendevolym, och om telefoni ska ingå.",
      "Hur viktigt det är att kundservice ser sälj- och orderhistorik.",
      "Krav på SLA, routing och kunskapsbas.",
      "Om ni behöver ett kontaktcenter med telefoni, se Contact Center.",
    ],
  },
  field: {
    category: "fältservicesystem och teknikerplanering",
    fits: [
      "Serviceverksamheter med tekniker ute hos kund, där schemaläggning, reservdelar och arbetsorder ska hänga ihop.",
      "Bolag med serviceavtal, förebyggande underhåll eller IoT-larm från installerad utrustning.",
      "Organisationer som vill koppla fältservice till kundservice och affärssystemets lager och fakturering.",
    ],
    notFits: [
      "Ett fåtal tekniker som klarar sig med enkel arbetsorderhantering i affärssystemet.",
      "Verksamheter där planeringen inte är en flaskhals och kunddata inte behöver delas.",
      "Bolag som saknar resurser att hålla artiklar, resurser och kompetenser uppdaterade.",
    ],
    alternatives: [
      { label: "Dynamics 365 Field Service vs Salesforce Field Service", to: "/jamfor/field-service-vs-salesforce-field-service/" },
      { label: "Hur väljer ni fältservicesystem?", to: "/faltservicesystem/" },
    ],
    decisive: [
      "Antal tekniker och hur komplex planeringen är (kompetenser, geografi, akuta jobb).",
      "Integration mot affärssystemets lager, inköp och fakturering.",
      "Mobilappens användbarhet för teknikerna, även offline.",
      "Partnerns erfarenhet av serviceprocesser i er bransch.",
    ],
  },
  insights: {
    category: "marketing automation, kundresor och CDP",
    fits: [
      "B2B- eller B2C-marknadsföring med kundresor över flera kanaler och leads som ska lämnas över till sälj.",
      "Bolag som vill samla kunddata från flera källor i en kunddataplattform (CDP) för segmentering.",
      "Organisationer som redan använder Dynamics 365 Sales eller Customer Service och vill dela samma kunddata.",
    ],
    notFits: [
      "Ett marknadsteam som främst skickar nyhetsbrev och inte behöver CRM-integration.",
      "Verksamheter utan fungerande kunddata, där en CDP inte har något att bygga på ännu.",
      "Team utan tid att bygga och underhålla kundresor och segment.",
    ],
    alternatives: [
      { label: "Customer Insights vs HubSpot Marketing Hub", to: "/jamfor/customer-insights-vs-hubspot-marketing-hub/" },
      { label: "Customer Insights vs Salesforce Marketing Cloud", to: "/jamfor/customer-insights-vs-salesforce-marketing-cloud/" },
    ],
    decisive: [
      "Om ni behöver marketing automation, CDP eller båda.",
      "Hur väl kunddatan hänger ihop mellan marknad, sälj och service i dag.",
      "Krav på samtycke och GDPR-hantering i utskick.",
      "Vem som ska äga och utveckla kundresorna efter införandet.",
    ],
  },
  contact: {
    category: "kontaktcentersystem och CCaaS",
    fits: [
      "Kontaktcenter med telefoni, chatt och meddelanden där samtal ska routas efter kompetens och kö.",
      "Organisationer som vill ha AI-stöd för självbetjäning, samtalssammanfattningar och agentstöd.",
      "Bolag som använder Dynamics 365 Customer Service eller Teams och vill samla kanalerna där.",
    ],
    notFits: [
      "En mindre kundtjänst där telefonin redan fungerar och ärendehantering är det verkliga behovet.",
      "Verksamheter som är nöjda med en befintlig CCaaS-plattform och bara behöver bättre CRM-koppling.",
      "Bolag utan resurser för att hantera telefoninummer, köer och bemanningsplanering.",
    ],
    alternatives: [
      { label: "Dynamics 365 Contact Center vs Genesys Cloud CX", to: "/jamfor/contact-center-vs-genesys-cloud-cx/" },
      { label: "Dynamics 365 Contact Center vs NICE CXone", to: "/jamfor/contact-center-vs-nice-cxone/" },
      { label: "Dynamics 365 Contact Center vs Puzzel", to: "/jamfor/contact-center-vs-puzzel/" },
      { label: "Dynamics 365 Contact Center vs Telia ACE", to: "/jamfor/contact-center-vs-telia-ace/" },
    ],
    decisive: [
      "Samtalsvolym, antal agenter och hur viktig telefonin är jämfört med digitala kanaler.",
      "Om kontaktcentret ska bygga på samma plattform som kundservice och CRM.",
      "Krav på svensk telefoni, nummerportering och inspelning.",
      "Partnerns erfarenhet av kontaktcenter, inte bara av CRM.",
    ],
  },
};
