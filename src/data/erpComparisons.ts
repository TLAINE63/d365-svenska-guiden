// Konkurrentjämförelser för Microsoft Dynamics 365-produkter.
// Köparsidig ton. Inga betygsättningar – endast strukturerad jämförelse.
// Filnamnet behålls (erpComparisons.ts) av historiska skäl, men strukturen
// är generaliserad och täcker BC, F&SCM, Sales, Customer Service,
// Customer Insights, Contact Center och Field Service.

export type ProductKey =
  | "bc"
  | "fscm"
  | "sales"
  | "customer-service"
  | "customer-insights"
  | "contact-center"
  | "field-service";

export interface ComparisonRow {
  area: string;
  product: string;
  competitor: string;
}

export interface ProductComparison {
  /** /jamfor/{slug}/ */
  slug: string;
  /** Vilken D365-produkt jämförelsen utgår från */
  productKey: ProductKey;
  /** Visningsnamn för D365-produkten (kolumnrubrik m.m.) */
  productName: string;
  /** Kortare alias som används i löpande text */
  productShort: string;
  /** Länk tillbaka till produktsidan */
  productPath: string;
  /** Etikett som visas i breadcrumb-mellansteget */
  productBreadcrumb: string;
  /** Konkurrentens namn */
  competitor: string;
  competitorUrl?: string;
  title: string;
  metaDescription: string;
  intro: string;
  productSummary: string;
  competitorSummary: string;
  bestFor: { product: string[]; competitor: string[] };
  rows: ComparisonRow[];
  productLimits: string[];
  competitorLimits: string[];
  faqs: { q: string; a: string }[];
}

// ── Produkt-metadata (kolumnrubriker, breadcrumbs, CTA-länkar) ─────────

interface ProductMeta {
  name: string;
  short: string;
  path: string;
  breadcrumb: string;
  ctaPrimary?: { label: string; url: string };
  ctaSecondary?: { label: string; url: string };
}

export const PRODUCT_META: Record<ProductKey, ProductMeta> = {
  bc: {
    name: "Business Central",
    short: "Business Central",
    path: "/businesscentral/",
    breadcrumb: "Business Central",
    ctaPrimary: { label: "Matchningstest", url: "/businesscentral/matchningstest/" },
    ctaSecondary: { label: "ROI/TCO-kalkylator", url: "/businesscentral/roi-kalkylator/" },
  },
  fscm: {
    name: "Dynamics 365 Finance & SCM",
    short: "Finance & SCM",
    path: "/finance-supply-chain/",
    breadcrumb: "Finance & SCM",
    ctaPrimary: { label: "Behovsanalys ERP", url: "/ERPbehovsanalys/" },
    ctaSecondary: { label: "Kravspec ERP", url: "/kravspecifikation/" },
  },
  sales: {
    name: "Dynamics 365 Sales",
    short: "D365 Sales",
    path: "/dynamics365-sales/",
    breadcrumb: "Sales",
    ctaPrimary: { label: "Behovsanalys CRM", url: "/CRMbehovsanalys/" },
    ctaSecondary: { label: "ROI-kalkylator Sales", url: "/dynamics365-sales/roi-kalkylator/" },
  },
  "customer-service": {
    name: "Dynamics 365 Customer Service",
    short: "D365 Customer Service",
    path: "/dynamics365-customer-service/",
    breadcrumb: "Customer Service",
    ctaPrimary: { label: "Behovsanalys Kundservice", url: "/kundservice-behovsanalys/" },
    ctaSecondary: { label: "Kravspec Kundservice", url: "/kravspecifikation-kundservice/" },
  },
  "customer-insights": {
    name: "Dynamics 365 Customer Insights",
    short: "Customer Insights",
    path: "/dynamics365-customer-insights/",
    breadcrumb: "Customer Insights",
    ctaPrimary: { label: "Behovsanalys CRM", url: "/CRMbehovsanalys/" },
    ctaSecondary: { label: "Kravspec Marknad", url: "/kravspecifikation-marketing/" },
  },
  "contact-center": {
    name: "Dynamics 365 Contact Center",
    short: "D365 Contact Center",
    path: "/dynamics365-contact-center/",
    breadcrumb: "Contact Center",
    ctaPrimary: { label: "Behovsanalys Kundservice", url: "/kundservice-behovsanalys/" },
  },
  "field-service": {
    name: "Dynamics 365 Field Service",
    short: "D365 Field Service",
    path: "/dynamics365-field-service/",
    breadcrumb: "Field Service",
    ctaPrimary: { label: "Behovsanalys Service", url: "/kundservice-behovsanalys/" },
  },
};

// ── Helper: bygg ett komplett comparison-objekt utan upprepad metadata ─

interface BuildArgs
  extends Omit<
    ProductComparison,
    "productName" | "productShort" | "productPath" | "productBreadcrumb"
  > {}

const build = (args: BuildArgs): ProductComparison => {
  const meta = PRODUCT_META[args.productKey];
  return {
    ...args,
    productName: meta.name,
    productShort: meta.short,
    productPath: meta.path,
    productBreadcrumb: meta.breadcrumb,
  };
};

// ── Tabellrader (standardstruktur för ERP) ─────────────────────────────

const BC_ROWS = (
  comp: {
    arkitektur: string;
    licensModell: string;
    implTid: string;
    implKostnad: string;
    isvEko: string;
    integration: string;
    ai: string;
    lokalRedovisning: string;
    internationell: string;
    partnerEko: string;
  },
): ComparisonRow[] => [
  {
    area: "Arkitektur & drift",
    product:
      "Molnbaserad SaaS (Microsoft-driven). On-prem möjligt men ovanligt i nya projekt.",
    competitor: comp.arkitektur,
  },
  {
    area: "Licensmodell",
    product:
      "Per användare/månad (Microsofts officiella listpris exkl. moms) – Essentials ~765 kr, Premium ~1 050 kr, Team Member ~77 kr.",
    competitor: comp.licensModell,
  },
  {
    area: "Typisk implementationstid",
    product: "8–20 veckor för standardprojekt, längre vid omfattande tillverkning eller integrationer.",
    competitor: comp.implTid,
  },
  {
    area: "Typisk implementationskostnad",
    product: "250 000–1 500 000 kr beroende på komplexitet, antal användare och bransch.",
    competitor: comp.implKostnad,
  },
  {
    area: "ISV- & tilläggsekosystem",
    product:
      "Microsoft Marketplace + över 7 000 certifierade tilläggsappar. Svenska ISV: Continia, Tabellae, Bitlog, BrightCom (Excitec), Storm Commerce m.fl.",
    competitor: comp.isvEko,
  },
  {
    area: "Integration mot Microsoft 365",
    product:
      "Inbyggt: Outlook, Teams, Excel, Power Platform, Copilot. Edge & djup integration är BC:s starkaste sida.",
    competitor: comp.integration,
  },
  {
    area: "AI & Copilot",
    product:
      "Copilot inbyggt: bankavstämning, försäljningsförslag, e-postförslag, rapportförklaring.",
    competitor: comp.ai,
  },
  {
    area: "Svensk redovisning & rapportering",
    product:
      "Klarar svensk redovisning via lokalisering + ISV (Continia, Tabellae). SIE, e-faktura, Skatteverket-rapportering.",
    competitor: comp.lokalRedovisning,
  },
  {
    area: "Internationell skalbarhet",
    product:
      "Stark – flera bolag, valutor, lokalisering i 100+ länder via Microsoft.",
    competitor: comp.internationell,
  },
  {
    area: "Partnerekosystem i Sverige",
    product: "20+ aktiva svenska BC-partners (se /businesscentral#partners).",
    competitor: comp.partnerEko,
  },
];

// ── Tabellrader (F&SCM enterprise ERP) ─────────────────────────────────

interface FscmRowInput {
  arkitektur: string;
  licensModell: string;
  implTid: string;
  implKostnad: string;
  funktion: string;
  branschdjup: string;
  integration: string;
  ai: string;
  lokalRedovisning: string;
  internationell: string;
  partnerEko: string;
}
const FSCM_ROWS = (c: FscmRowInput): ComparisonRow[] => [
  {
    area: "Arkitektur & drift",
    product:
      "Molnbaserad SaaS (Dataverse + Azure). On-prem-stöd avvecklas successivt.",
    competitor: c.arkitektur,
  },
  {
    area: "Licensmodell",
    product:
      "Per användare/månad: Finance ~2 000 kr, SCM ~2 000 kr, kombinerad ~2 500 kr, Activity ~720 kr, Team Members ~77 kr.",
    competitor: c.licensModell,
  },
  {
    area: "Typisk implementationstid",
    product: "9–24 månader för svenska medelstora/stora bolag. Längre vid globala rollouts.",
    competitor: c.implTid,
  },
  {
    area: "Typisk implementationskostnad",
    product:
      "5–50 MSEK beroende på antal länder, bolag, integrationer och branschanpassningar.",
    competitor: c.implKostnad,
  },
  {
    area: "Funktionsdjup (ERP-kärna)",
    product:
      "Mycket brett – ekonomi, lager, tillverkning (DSM/PCM), projekt, HR via Talent-partners, retail (Store Commerce).",
    competitor: c.funktion,
  },
  {
    area: "Branschdjup",
    product:
      "Discreet & process manufacturing, distribution, retail, professional services. Branschmoduler via ISV (To-Increase, DynaRent, Sana m.fl.).",
    competitor: c.branschdjup,
  },
  {
    area: "Integration mot Microsoft 365 & Power Platform",
    product:
      "Nativ – Teams, Excel, Power BI, Power Automate, Copilot Studio. Stark gemensam datamodell via Dataverse.",
    competitor: c.integration,
  },
  {
    area: "AI & Copilot",
    product:
      "Copilot för Finance (collections, periodisering), SCM (leveransrisk, inköp). Snabb roll-out, men mognaden varierar per modul.",
    competitor: c.ai,
  },
  {
    area: "Svensk redovisning & rapportering",
    product:
      "Svensk lokalisering finns. Kompletteras ofta med Continia, Medius, Pagero för AP, e-faktura och Skatteverket-rapportering.",
    competitor: c.lokalRedovisning,
  },
  {
    area: "Internationell skalbarhet",
    product:
      "Mycket stark – byggt för flerbolags-/flerländerskonsolidering. Lokalisering i 40+ länder från Microsoft.",
    competitor: c.internationell,
  },
  {
    area: "Partnerekosystem i Sverige",
    product:
      "Brett – 10+ aktiva F&SCM-partners (Columbus, Stretch, Sopra Steria, Sigma, Hands m.fl.).",
    competitor: c.partnerEko,
  },
];

// ── Tabellrader (CRM/Sales) ────────────────────────────────────────────

interface SalesRowInput {
  arkitektur: string;
  licensModell: string;
  implTid: string;
  implKostnad: string;
  pipeline: string;
  marketing: string;
  integration: string;
  ai: string;
  anpassning: string;
  partnerEko: string;
}
const SALES_ROWS = (c: SalesRowInput): ComparisonRow[] => [
  {
    area: "Arkitektur & drift",
    product:
      "Molnbaserad SaaS på Dataverse + Azure. Multi-tenant, datalokalisering EU/Sverige tillgänglig.",
    competitor: c.arkitektur,
  },
  {
    area: "Licensmodell",
    product:
      "Per användare/månad (officiellt listpris): Sales Professional ~610 kr, Sales Enterprise ~960 kr, Sales Premium ~1 380 kr. Copilot for Sales ~470 kr extra.",
    competitor: c.licensModell,
  },
  {
    area: "Typisk implementationstid",
    product:
      "6–16 veckor för standardprojekt. Längre vid komplex integration mot ERP eller call center.",
    competitor: c.implTid,
  },
  {
    area: "Typisk implementationskostnad",
    product: "150 000–1 200 000 kr beroende på antal användare och integrationer.",
    competitor: c.implKostnad,
  },
  {
    area: "Pipeline, prognos & säljmetodik",
    product:
      "Stark pipeline-hantering, prediktiv lead scoring, opportunity scoring, relationsanalys via Sales Insights.",
    competitor: c.pipeline,
  },
  {
    area: "Marketing-koppling",
    product:
      "Tät koppling till Customer Insights – Journeys (real-time journeys, segmentering, A/B-test) och Data (CDP).",
    competitor: c.marketing,
  },
  {
    area: "Integration mot Microsoft 365 & Teams",
    product:
      "Nativt: Outlook-add-in, Teams-meetings med samtalssummering, Excel-export, SharePoint-dokument, Power Automate.",
    competitor: c.integration,
  },
  {
    area: "AI & Copilot",
    product:
      "Copilot for Sales summerar e-post och möten, genererar uppföljningsförslag, drar in kontextdata i Outlook/Teams.",
    competitor: c.ai,
  },
  {
    area: "Konfiguration & anpassning",
    product:
      "Power Apps + Power Automate ger djup low-code-anpassning. Dataverse är öppen för Power BI och egna appar.",
    competitor: c.anpassning,
  },
  {
    area: "Partnerekosystem i Sverige",
    product:
      "15+ aktiva svenska Sales-partners (Stretch, CGI, Knowit, Crayon, Sopra Steria m.fl.).",
    competitor: c.partnerEko,
  },
];

// ── Tabellrader (Customer Service / ticketing) ────────────────────────

interface ServiceRowInput {
  arkitektur: string;
  licensModell: string;
  implTid: string;
  implKostnad: string;
  omnikanal: string;
  knowledge: string;
  integration: string;
  ai: string;
  branscher: string;
  partnerEko: string;
}
const SERVICE_ROWS = (c: ServiceRowInput): ComparisonRow[] => [
  {
    area: "Arkitektur & drift",
    product:
      "Moln-SaaS på Dataverse + Azure. EU/Sverige-datacenter, samma plattform som Sales och Field Service.",
    competitor: c.arkitektur,
  },
  {
    area: "Licensmodell",
    product:
      "Per användare/månad: Customer Service Professional ~470 kr, Enterprise ~960 kr, Contact Center add-on ~1 010 kr.",
    competitor: c.licensModell,
  },
  {
    area: "Typisk implementationstid",
    product: "8–16 veckor för standardärendehantering. Längre vid omnikanal + CTI.",
    competitor: c.implTid,
  },
  {
    area: "Typisk implementationskostnad",
    product: "300 000–1 500 000 kr beroende på kanaler, integrationer och agentvolym.",
    competitor: c.implKostnad,
  },
  {
    area: "Omnikanal (chat, e-post, sociala, röst)",
    product:
      "Stark – alla kanaler i samma agentdesktop. Röst via D365 Contact Center (separat licens).",
    competitor: c.omnikanal,
  },
  {
    area: "Knowledge & self-service",
    product:
      "Inbyggd knowledge base + Copilot-genererade utkast. Power Pages för kundportal/community.",
    competitor: c.knowledge,
  },
  {
    area: "Integration mot Microsoft 365 & Teams",
    product:
      "Nativ Teams-integration, Outlook, SharePoint. Power Automate för flöden, Power BI för KPI-uppföljning.",
    competitor: c.integration,
  },
  {
    area: "AI & Copilot",
    product:
      "Copilot for Service: ärendesummering, smart response, kunskapsförslag, agent-coachning, AI-agenter via Copilot Studio.",
    competitor: c.ai,
  },
  {
    area: "Bransch- & B2B-djup",
    product:
      "Stark B2B-koppling när Sales och Field Service körs på samma plattform. Asset-koppling via Field Service.",
    competitor: c.branscher,
  },
  {
    area: "Partnerekosystem i Sverige",
    product:
      "10+ aktiva svenska Customer Service-partners (Stretch, CGI, Knowit, Crayon m.fl.).",
    competitor: c.partnerEko,
  },
];

// ── Tabellrader (Customer Insights – Marketing/CDP) ───────────────────

interface CiRowInput {
  arkitektur: string;
  licensModell: string;
  implTid: string;
  implKostnad: string;
  journeys: string;
  cdp: string;
  integration: string;
  ai: string;
  efterlevnad: string;
  partnerEko: string;
}
const CI_ROWS = (c: CiRowInput): ComparisonRow[] => [
  {
    area: "Arkitektur & drift",
    product:
      "Moln-SaaS på Dataverse + Azure. Customer Insights = Journeys (outbound/real-time) + Data (CDP).",
    competitor: c.arkitektur,
  },
  {
    area: "Licensmodell",
    product:
      "Customer Insights – Journeys: från ~16 000 kr/månad (10 000 interagerade personer). Data: från ~16 000 kr/månad. Volym-baserad.",
    competitor: c.licensModell,
  },
  {
    area: "Typisk implementationstid",
    product:
      "8–20 veckor – Journeys snabbare, Data (CDP) tar längre tid p.g.a. datamodellering och unifiering.",
    competitor: c.implTid,
  },
  {
    area: "Typisk implementationskostnad",
    product:
      "400 000–2 500 000 kr beroende på integrationer, datakällor och hur mycket egen segmentering som ska byggas.",
    competitor: c.implKostnad,
  },
  {
    area: "Journeys & kampanjorkestrering",
    product:
      "Real-time journeys med event-trigger, segmentering på live-data, A/B-test, multikanal (e-post, SMS, push, custom channels).",
    competitor: c.journeys,
  },
  {
    area: "CDP & datapsamling",
    product:
      "Customer Insights – Data unifierar profiler från CRM, e-handel, ERP, web. AI-driven matchning och berikning.",
    competitor: c.cdp,
  },
  {
    area: "Integration mot Microsoft-ekosystem",
    product:
      "Nativ koppling till D365 Sales, Service, Fabric/Synapse, Power BI, Azure ML. Direkt från CDP till säljare i Sales.",
    competitor: c.integration,
  },
  {
    area: "AI & Copilot",
    product:
      "Copilot för segmentbyggande på naturligt språk, journey-förslag, nästa-bästa-aktion. Generativ innehållsutkast på e-post.",
    competitor: c.ai,
  },
  {
    area: "GDPR & datalokalisering",
    product:
      "EU-datacenter, datalagring i Sverige tillgänglig. Inbyggt consent-stöd, integration med Microsoft Purview.",
    competitor: c.efterlevnad,
  },
  {
    area: "Partnerekosystem i Sverige",
    product:
      "8–10 aktiva partners med CI-erfarenhet (Stretch, Crayon, CGI, Knowit, Sopra Steria m.fl.).",
    competitor: c.partnerEko,
  },
];

// ── Tabellrader (Contact Center / CCaaS) ──────────────────────────────

interface CcRowInput {
  arkitektur: string;
  licensModell: string;
  implTid: string;
  implKostnad: string;
  rost: string;
  omnikanal: string;
  ai: string;
  integration: string;
  svenskaTeleop: string;
  partnerEko: string;
}
const CC_ROWS = (c: CcRowInput): ComparisonRow[] => [
  {
    area: "Arkitektur & drift",
    product:
      "Moln-SaaS som add-on till Dynamics 365 Customer Service. Använder Azure Communication Services + Nuance för röst och AI.",
    competitor: c.arkitektur,
  },
  {
    area: "Licensmodell",
    product:
      "D365 Contact Center från ~5 250 kr/agent/månad (digital + röst). Standalone-version finns för icke-D365-CRM-miljöer.",
    competitor: c.licensModell,
  },
  {
    area: "Typisk implementationstid",
    product:
      "10–20 veckor. Snabbare om kunden redan kör D365 Customer Service, längre vid komplex IVR/SIP-trunk-uppsättning.",
    competitor: c.implTid,
  },
  {
    area: "Typisk implementationskostnad",
    product:
      "500 000–3 000 000 kr beroende på antal agenter, telefoniintegration och WFM-behov.",
    competitor: c.implKostnad,
  },
  {
    area: "Röst & telefoni",
    product:
      "Inbyggd via Azure Communication Services. Egen SBC eller BYOC (bring your own carrier) – samverkar med svenska teleoperatörer via SIP-trunk.",
    competitor: c.rost,
  },
  {
    area: "Omnikanal",
    product:
      "Röst, chat, SMS, sociala, e-post, Apple Messages for Business, WhatsApp – allt i en agentdesktop.",
    competitor: c.omnikanal,
  },
  {
    area: "AI & automation",
    product:
      "Nuance-baserade voice bots, Copilot-summering, intentdetektion, biometrisk röstidentifiering, conversational IVR via Copilot Studio.",
    competitor: c.ai,
  },
  {
    area: "Integration mot CRM",
    product:
      "Djupast tänkbar mot D365 Customer Service och Sales (samma plattform). Connectors finns för Salesforce, ServiceNow m.fl.",
    competitor: c.integration,
  },
  {
    area: "Svenska teleoperatörsförhållanden",
    product:
      "BYOC-modell – kunden upphandlar SIP-trunk själv (Telia, Tele2, Telenor). Microsoft tillhandahåller inte svenska nummerblock.",
    competitor: c.svenskaTeleop,
  },
  {
    area: "Partnerekosystem i Sverige",
    product:
      "Få men växande – D365 Contact Center lanserades 2024. Drivs primärt av befintliga D365 CS-partners + telefonispecialister.",
    competitor: c.partnerEko,
  },
];

// ── Tabellrader (Field Service) ────────────────────────────────────────

interface FsRowInput {
  arkitektur: string;
  licensModell: string;
  implTid: string;
  implKostnad: string;
  schemalaggning: string;
  mobil: string;
  iot: string;
  ai: string;
  integration: string;
  partnerEko: string;
}
const FS_ROWS = (c: FsRowInput): ComparisonRow[] => [
  {
    area: "Arkitektur & drift",
    product:
      "Moln-SaaS på Dataverse + Azure. Samma plattform som Customer Service, Sales och Customer Insights.",
    competitor: c.arkitektur,
  },
  {
    area: "Licensmodell",
    product:
      "Per resurs/månad: D365 Field Service ~960 kr, Field Service Contractor ~480 kr, Mixed Reality Remote Assist add-on ~660 kr.",
    competitor: c.licensModell,
  },
  {
    area: "Typisk implementationstid",
    product:
      "12–24 veckor för standardprojekt. Längre vid IoT, ERP-integration eller komplex schemalagsoptimering.",
    competitor: c.implTid,
  },
  {
    area: "Typisk implementationskostnad",
    product:
      "500 000–3 000 000 kr beroende på antal tekniker, mobil-anpassning och integration mot ERP/IoT.",
    competitor: c.implKostnad,
  },
  {
    area: "Schemaläggning & optimering",
    product:
      "Resource Scheduling Optimization (RSO) med AI-driven multi-constraint-optimering. Drag-and-drop dispatcher board.",
    competitor: c.schemalaggning,
  },
  {
    area: "Mobil teknikerupplevelse",
    product:
      "Native iOS/Android-app, offline-stöd, vägbeskrivning, signatur, foton, checklistor. Remote Assist via HoloLens/mobil.",
    competitor: c.mobil,
  },
  {
    area: "IoT & connected assets",
    product:
      "Inbyggd IoT-koppling via Azure IoT/Digital Twins. Anomalidetektion triggar work order automatiskt.",
    competitor: c.iot,
  },
  {
    area: "AI & Copilot",
    product:
      "Copilot for Field Service: work order-summering, smart trip-planering, mixed reality för fjärrsupport, prediktivt underhåll.",
    competitor: c.ai,
  },
  {
    area: "Integration mot CRM, ERP & 365",
    product:
      "Nativ till D365 Customer Service, Sales, BC och F&SCM. Outlook/Teams för bokning, Power Automate för flöden.",
    competitor: c.integration,
  },
  {
    area: "Partnerekosystem i Sverige",
    product:
      "5–8 aktiva svenska Field Service-partners (Stretch, Knowit, CGI, Crayon, Sopra Steria m.fl.).",
    competitor: c.partnerEko,
  },
];

// ── BC-jämförelser (oförändrat innehåll) ──────────────────────────────

const BC_COMPARISONS: ProductComparison[] = [
  build({
    slug: "business-central-vs-monitor-erp",
    productKey: "bc",
    competitor: "Monitor ERP",
    competitorUrl: "https://www.monitorerp.com/sv",
    title: "Business Central vs Monitor ERP – jämförelse för svenska tillverkare",
    metaDescription:
      "Jämför Microsoft Dynamics 365 Business Central med Monitor ERP. Funktioner, pris, implementationstid, AI och partnerekosystem för svenska tillverkande bolag.",
    intro:
      "Monitor ERP är ett svenskt affärssystem byggt för diskret tillverkning. Business Central är Microsofts molnbaserade ERP för små och medelstora bolag i alla branscher. Båda är reella val för svenska tillverkare – frågan är vad ni värdesätter mest: bransch-djup eller bredd och Microsoft-ekosystem.",
    productSummary:
      "Business Central är bredare och starkare i ekonomi, integration mot Microsoft 365 och Copilot. Vid komplex tillverkning kompletteras BC ofta med ISV som Bitlog (WMS), Continia (ekonomi) eller branschapp från svensk partner.",
    competitorSummary:
      "Monitor ERP är djupt specialiserat på diskret tillverkning – MPS, kapacitetsplanering, arbetsorderhantering. För svenska verkstadsbolag som vill ha ett komplett tillverkningssystem 'ur lådan' är det ett starkt val.",
    bestFor: {
      product: [
        "Tillverkare som också driver tjänsteförsäljning, e-handel eller flera bolag.",
        "Företag som redan är djupt inne i Microsoft 365 / Azure / Copilot.",
        "Internationella bolag som behöver lokalisering i flera länder.",
      ],
      competitor: [
        "Renodlade svenska verkstadsbolag med fokus på diskret tillverkning.",
        "Bolag som vill ha MPS, kapacitetsplanering och produktionsuppföljning i grunden.",
        "Företag som värdesätter en svenskägd produktleverantör med svensk juridik och produktutveckling i Sverige.",
      ],
    },
    rows: BC_ROWS({
      arkitektur: "Molnbaserat (Monitor G5 SaaS) eller on-prem. Egen plattform.",
      licensModell: "Per användare/månad – publiceras inte öppet. Kontakt med Monitor krävs för offert.",
      implTid: "12–26 veckor är typiskt för svensk tillverkning. Längre vid flera bolag.",
      implKostnad: "Oftast 500 000–2 000 000 kr inkl. anpassningar.",
      isvEko: "Mindre och nationellt. Få tredjepartsappar – Monitor täcker det mesta själva.",
      integration: "Standardintegrationer mot Office finns men inte lika djup som BC:s native-integration.",
      ai: "AI-funktioner finns men begränsade jämfört med Copilot.",
      lokalRedovisning: "Mycket stark – byggt för svensk redovisning och tillverkning från grunden.",
      internationell: "Begränsad – fokus på Norden. Internationella rollouts ovanliga.",
      partnerEko: "Levereras främst av Monitor själva, mindre ekosystem av tredjepartspartners.",
    }),
    productLimits: [
      "Om ni har djup, komplex svensk verkstadstillverkning utan vilja att lägga ISV ovanpå.",
      "Om det är avgörande att hela leverantörskedjan – inklusive produktägaren – är svensk (Business Centrals produktägare är Microsoft, även om svenska partners står för implementation och support).",
    ],
    competitorLimits: [
      "Om ni har process- eller livsmedelstillverkning – Monitor är optimerat för diskret tillverkning.",
      "Om ni har e-handel, B2C eller komplex tjänsteförsäljning utöver tillverkningen.",
      "Om Microsoft 365 / Copilot är centralt i er digitaliseringsstrategi.",
    ],
    faqs: [
      {
        q: "Är Business Central eller Monitor ERP billigare?",
        a: "Total kostnad beror på antal användare och anpassningar. Som tumregel ligger BC:s licensmodell öppet redovisad (765 kr Essentials / 1 050 kr Premium per användare/månad, exkl. moms), medan Monitor är offertbaserad. Implementationen är ofta i samma intervall men Monitor tenderar att bli något dyrare vid komplex svensk tillverkning.",
      },
      {
        q: "Kan Business Central hantera MPS och produktion lika bra som Monitor?",
        a: "BC Premium har grundläggande MPS och produktionsorder, men för djup verkstadsstyrning behövs ofta ISV som Bitlog, Insight Works eller en svensk branschapp. Monitor är mer komplett 'ur lådan' för diskret tillverkning.",
      },
      {
        q: "Vilka partners arbetar med vardera lösningen i Sverige?",
        a: "Monitor levereras främst av Monitor själva. Business Central finns hos 20+ svenska Microsoft-partners – se /businesscentral#partners för aktuell lista per bransch.",
      },
    ],
  }),
  build({
    slug: "business-central-vs-visma-net",
    productKey: "bc",
    competitor: "Visma.net ERP",
    competitorUrl: "https://www.visma.se/erp/visma-net/",
    title: "Business Central vs Visma.net – jämförelse för svenska SMB",
    metaDescription:
      "Jämför Microsoft Dynamics 365 Business Central med Visma.net ERP. Funktioner, pris, implementationstid och AI för svenska små och medelstora bolag.",
    intro:
      "Visma.net ERP riktar sig till svenska små och medelstora bolag som söker ett tydligt, nordiskt affärssystem. Business Central är Microsofts motsvarighet med bredare internationell räckvidd och djupare Microsoft 365-integration.",
    productSummary:
      "Business Central står starkast när bolaget redan kör Microsoft 365, vill ha Copilot, internationell skalbarhet eller mer avancerad lager- och tillverkningsfunktionalitet.",
    competitorSummary:
      "Visma.net är ett rent moln-ERP med stark förankring i Norden, enkelt onboarding och tät koppling till Visma Lön, Visma eEkonomi och övriga Visma-tjänster.",
    bestFor: {
      product: [
        "Bolag i tillväxt som behöver bredd: ekonomi, lager, projekt, tillverkning i samma plattform.",
        "Företag som driver Microsoft 365, Teams och Copilot dagligen.",
        "Bolag som planerar internationell expansion eller flera bolag.",
      ],
      competitor: [
        "Renodlade tjänste- eller handelsbolag med fokus på Sverige/Norden.",
        "Företag som redan använder Vismas löne- och redovisningssystem.",
        "Bolag som vill ha ett enklare, mindre konfigurerbart ERP.",
      ],
    },
    rows: BC_ROWS({
      arkitektur: "Rent moln-SaaS, ingen on-prem-variant. Multi-tenant nordisk drift.",
      licensModell: "Per användare/månad. Prissättning offert, men ofta i samma härad som BC Essentials.",
      implTid: "6–14 veckor är vanligt – mindre konfigurerbart innebär snabbare uppstart.",
      implKostnad: "150 000–600 000 kr för standardimplementationer.",
      isvEko: "Mindre globalt ekosystem men stark integration mot övriga Visma-produkter.",
      integration: "Bra integration mot Visma-familjen, mindre djup mot Microsoft 365.",
      ai: "Visma har egna AI-funktioner (Visma AI Assistant) men ingen Copilot-integration.",
      lokalRedovisning: "Mycket stark svensk/nordisk redovisning, byggt för svensk standard.",
      internationell: "Främst Norden. Begränsad räckvidd utanför Skandinavien.",
      partnerEko: "Egen direktförsäljning + ett mindre nät av nordiska partners.",
    }),
    productLimits: [
      "Om ni vill ha ett enkelt, färdigt system utan stora val eller anpassningar.",
      "Om ni redan kör Visma Lön och vill ha en sömlös lön/ekonomi-koppling.",
    ],
    competitorLimits: [
      "Om ni har internationell verksamhet eller flera bolag i olika valutor.",
      "Om ni behöver tillverkning, projekt eller djup lagerstyrning utöver standardekonomi.",
      "Om Microsoft 365 / Copilot är en strategisk plattform.",
    ],
    faqs: [
      {
        q: "Är Visma.net billigare än Business Central?",
        a: "Licenspriserna ligger ofta i samma härad. Visma.net har lägre implementationskostnad eftersom det är mindre konfigurerbart – men det blir dyrare om ni senare måste byta plattform när ni växer.",
      },
      {
        q: "Vilket system är bäst för internationell expansion?",
        a: "Business Central – Microsoft erbjuder lokalisering i 100+ länder och en global partnerkanal. Visma.net är primärt nordiskt.",
      },
      {
        q: "Kan Visma.net hantera tillverkning?",
        a: "Visma.net har grundläggande produktionsstöd men inte i samma djup som BC Premium med MPS, produktionsorder och kapacitetsplanering.",
      },
    ],
  }),
  build({
    slug: "business-central-vs-jeeves",
    productKey: "bc",
    competitor: "Jeeves ERP",
    competitorUrl: "https://www.jeeves.se/",
    title: "Business Central vs Jeeves ERP – jämförelse för svenska tillverkare & distributörer",
    metaDescription:
      "Jämför Microsoft Dynamics 365 Business Central med Jeeves ERP. Funktioner, pris, implementationstid och svensk branschanpassning för tillverkning och distribution.",
    intro:
      "Jeeves ERP är ett svenskt affärssystem med stark förankring i tillverkning, distribution och tjänstebolag. Business Central är Microsofts molnbaserade ERP med bredare internationell räckvidd och Copilot-integration.",
    productSummary:
      "Business Central står starkast när bolaget vill bygga på en global plattform, ha Copilot inbyggt och nyttja Microsoft 365 fullt ut. Vid tillverkning kompletteras BC ofta med ISV eller en svensk branschpartner.",
    competitorSummary:
      "Jeeves är djupt anpassat för svenska tillverkare och distributörer. Branschmoduler för fordon, livsmedel, läkemedel, grossist och tjänsteproducerande bolag finns inbyggda eller via ekosystemet.",
    bestFor: {
      product: [
        "Bolag som vill bygga på en global plattform med stark molnstrategi.",
        "Bolag som redan kör Microsoft 365 och vill ha Copilot i affärsprocesserna.",
        "Bolag i tjänstebranscher eller med flera bolag i flera länder.",
      ],
      competitor: [
        "Svenska tillverkande och distribuerande bolag som vill ha djup branschfunktionalitet ur lådan.",
        "Bolag som värdesätter en svenskägd produktleverantör med svensk juridik och produktutveckling i Sverige.",
        "Bolag i specifika nischer (livsmedel, läkemedel, grossist) där Jeeves har färdiga branschmoduler.",
      ],
    },
    rows: BC_ROWS({
      arkitektur: "Jeeves Selected (modernare moln) eller Jeeves Universal (etablerad on-prem/hostad). Två spår.",
      licensModell: "Per användare. Prissättning offert – ofta i samma härad som BC Premium.",
      implTid: "16–30 veckor är vanligt för svensk tillverkning/distribution.",
      implKostnad: "600 000–2 500 000 kr beroende på branschmoduler och anpassningar.",
      isvEko: "Mindre och nationellt, men starkt med svenska branschmoduler.",
      integration: "Standardintegrationer mot Office finns. Inte lika djup som BC:s native Microsoft 365-integration.",
      ai: "AI-funktioner är under utveckling men inte i samma djup som Copilot.",
      lokalRedovisning: "Mycket stark – byggt för svensk redovisning och svensk lagstiftning.",
      internationell: "Begränsad – fokus på Sverige och Norden.",
      partnerEko: "Levereras främst av Jeeves själva och ett mindre nät av svenska partners.",
    }),
    productLimits: [
      "Om ni har en mycket specifik svensk branschnisch där Jeeves har färdig modul.",
      "Om det är avgörande att även produktägaren är svensk (Business Centrals produktägare är Microsoft, även om svenska partners står för implementation och support på samma sätt som för Jeeves).",
    ],
    competitorLimits: [
      "Om ni har internationell verksamhet eller flera bolag i olika länder/valutor.",
      "Om Microsoft 365 / Copilot är central plattform i organisationen.",
      "Om ni vill ha stort utbud av globala tilläggsappar via marketplace.",
    ],
    faqs: [
      {
        q: "Är Jeeves dyrare än Business Central?",
        a: "Jeeves tenderar att hamna något högre i total implementationskostnad eftersom branschanpassningarna är mer omfattande. Licenskostnaden ligger ofta i samma härad som BC Premium.",
      },
      {
        q: "Kan Business Central hantera samma branschdjup som Jeeves?",
        a: "BC i sig är bredare men mindre branschspecifikt. För att nå Jeeves-nivå på t.ex. livsmedel eller grossist används ISV och svenska branschpartners ovanpå BC.",
      },
      {
        q: "Vilket system är bäst för internationell expansion?",
        a: "Business Central – Microsoft erbjuder lokalisering i 100+ länder och en global partnerkanal. Jeeves är primärt svenskt/nordiskt.",
      },
    ],
  }),
  build({
    slug: "business-central-vs-sap-business-one",
    productKey: "bc",
    competitor: "SAP Business One",
    competitorUrl: "https://www.sap.com/sweden/products/business-one.html",
    title: "Business Central vs SAP Business One – jämförelse för svenska SMB",
    metaDescription:
      "Jämför Microsoft Dynamics 365 Business Central med SAP Business One. Funktioner, pris, implementationstid, AI och partnerekosystem för svenska små och medelstora bolag.",
    intro:
      "SAP Business One är SAP:s ERP för små och medelstora bolag – inte att förväxla med SAP S/4HANA som riktar sig till storföretag. Business Central är Microsofts motsvarighet och är ofta den tydligaste konkurrenten i SMB-segmentet i Sverige.",
    productSummary:
      "Business Central står starkast när bolaget redan kör Microsoft 365, vill ha Copilot inbyggt och söker en bred, modern molnplattform med stort svenskt partnernätverk.",
    competitorSummary:
      "SAP Business One har djup ekonomi- och lagerfunktionalitet och passar bolag som vill ha SAP-varumärket, internationell SAP-konsolidering eller redan har SAP i moderbolaget.",
    bestFor: {
      product: [
        "Bolag som vill ha Microsoft 365, Teams och Copilot djupt integrerat i affärsprocesserna.",
        "Bolag som söker bred lokalisering i Sverige med många konkurrerande partners.",
        "Bolag i tillväxt som vill kunna växa till F&SCM utan att byta plattform.",
      ],
      competitor: [
        "Dotterbolag till SAP-koncerner som behöver konsolidera mot S/4HANA eller ECC.",
        "Bolag som har starka SAP-kompetenser internt eller via befintlig partner.",
        "Bolag som värdesätter SAP-ekosystemet och dess globala räckvidd.",
      ],
    },
    rows: BC_ROWS({
      arkitektur: "Moln (SAP Business One Cloud) eller on-prem. HANA eller MS SQL Server som databas.",
      licensModell: "Per användare/månad. Professional ~1 600–2 200 kr, Limited ~600–900 kr (offert).",
      implTid: "10–24 veckor för standardprojekt; längre vid SAP-koncernintegration.",
      implKostnad: "400 000–1 800 000 kr beroende på komplexitet och anpassningar.",
      isvEko: "Globalt SAP-ekosystem (Boyum, Beas, Produmex m.fl.). Mindre svenskt utbud än BC.",
      integration: "Standardintegrationer mot Office finns men inte i samma djup som BC:s native-integration.",
      ai: "SAP Joule rullas ut stegvis i Business One. Mindre moget än Microsoft Copilot idag.",
      lokalRedovisning: "Svensk lokalisering finns, men kräver oftare partnerinsats än BC:s standardstöd.",
      internationell: "Stark – SAP har lokalisering i 50+ länder och är ett naturligt val för SAP-koncerner.",
      partnerEko: "Mindre svenskt partnernät (handfull aktiva), större internationellt.",
    }),
    productLimits: [
      "Om ni är dotterbolag i en SAP-koncern där koncernen kräver SAP i hela kedjan.",
      "Om ni har starkt SAP-kompetensberoende internt och vill behålla det.",
    ],
    competitorLimits: [
      "Om Microsoft 365 / Copilot är central plattform i organisationen.",
      "Om ni vill ha brett urval av svenska partners att jämföra och förhandla med.",
      "Om ni söker en modern molnförst-arkitektur utan beroende av on-prem-historik.",
    ],
    faqs: [
      {
        q: "Är SAP Business One samma sak som SAP S/4HANA?",
        a: "Nej. Business One är SAP:s SMB-ERP (10–500 användare). S/4HANA är för storföretag. Det är Business One – inte S/4HANA – som är reell konkurrent till Business Central.",
      },
      {
        q: "Är SAP Business One dyrare än Business Central?",
        a: "Licenspriserna ligger ofta något över BC Premium. Implementationen blir typiskt 20–40 % dyrare i Sverige, främst eftersom partnerutbudet är mindre och timpriserna högre.",
      },
      {
        q: "Vilket system har starkare AI?",
        a: "Microsoft Copilot är idag mer moget i Business Central än SAP Joule i Business One. SAP investerar tungt men ligger 12–24 månader efter Microsoft i SMB-segmentet.",
      },
    ],
  }),
  build({
    slug: "business-central-vs-netsuite",
    productKey: "bc",
    competitor: "Oracle NetSuite",
    competitorUrl: "https://www.netsuite.com/portal/se/home.shtml",
    title: "Business Central vs Oracle NetSuite – jämförelse för svenska bolag",
    metaDescription:
      "Jämför Microsoft Dynamics 365 Business Central med Oracle NetSuite. Funktioner, pris, implementationstid, AI och svensk lokalisering för SaaS-baserade ERP-val.",
    intro:
      "Oracle NetSuite är ett av världens mest etablerade moln-ERP och vanligt val i tech-bolag, e-handel och bolag med USA-kopplingar. Business Central är Microsofts motsvarighet med tydligare svensk förankring och Microsoft 365-integration.",
    productSummary:
      "Business Central står starkast när bolaget vill ha djup Microsoft 365- och Copilot-integration, svensk lokalisering ur lådan och ett brett svenskt partnernät att välja från.",
    competitorSummary:
      "NetSuite är ett moget, multitenancy-baserat moln-ERP med stark funktionalitet för flerbolag, intercompany, revenue recognition och USA-baserade redovisningsregler. Vanligt i scale-ups och bolag med amerikanska investerare.",
    bestFor: {
      product: [
        "Bolag med svenskt huvudkontor som söker stark lokalisering och svenskt partnernät.",
        "Bolag som redan kör Microsoft 365 / Azure / Copilot.",
        "Bolag som vill ha valfrihet mellan många konkurrerande implementationspartners.",
      ],
      competitor: [
        "Bolag med amerikanska ägare eller US-baserad finansieringsstruktur (VC, PE).",
        "Internationella scale-ups med många bolag, valutor och intercompany-flöden.",
        "Bolag som vill ha advanced revenue recognition (ASC 606 / IFRS 15) inbyggt.",
      ],
    },
    rows: BC_ROWS({
      arkitektur: "Rent moln-SaaS (multitenancy). Oracle-driven, ingen on-prem-variant.",
      licensModell: "Per användare/månad – från ca 1 000 kr (Limited) till 1 800+ kr (Full). Plattformsavgift ~10 000–25 000 kr/mån.",
      implTid: "16–36 veckor; ofta längre i Sverige p.g.a. begränsat lokalt partnerutbud.",
      implKostnad: "600 000–3 000 000 kr beroende på antal bolag, integrationer och svensk lokalisering.",
      isvEko: "Stort globalt ekosystem (SuiteApps). Mindre svenskt utbud.",
      integration: "Integrationer mot Microsoft 365 finns via SuiteApps men inte native som i BC.",
      ai: "NetSuite AI och text enhance finns; mindre moget än Microsoft Copilot idag.",
      lokalRedovisning: "Begränsad svensk lokalisering – ofta krävs egen anpassning eller SuiteApp.",
      internationell: "Mycket stark – NetSuite OneWorld är byggt för multinationella koncerner.",
      partnerEko: "Få NetSuite-partners i Sverige (handfull). Direktförsäljning från Oracle vanligt.",
    }),
    productLimits: [
      "Om ni har komplex internationell konsolidering med 20+ bolag i många valutor.",
      "Om amerikansk redovisning (ASC 606) och revenue recognition är kärnkrav.",
    ],
    competitorLimits: [
      "Om ni har svenskt huvudkontor och vill ha stark lokal redovisning ur lådan.",
      "Om Microsoft 365 / Copilot är central plattform i organisationen.",
      "Om ni vill ha brett urval av svenska partners att jämföra och förhandla med.",
    ],
    faqs: [
      {
        q: "Är NetSuite dyrare än Business Central i Sverige?",
        a: "I de flesta fall ja. Plattformsavgiften (10–25 k kr/mån) tillkommer ovanpå användarlicenser. Implementationen blir ofta 30–60 % dyrare än motsvarande BC-projekt eftersom svenskt partnerutbud är begränsat.",
      },
      {
        q: "När är NetSuite ett bättre val än Business Central?",
        a: "Vid amerikanska ägare som kräver NetSuite, vid komplex internationell intercompany-konsolidering, eller om ni behöver advanced revenue recognition (ASC 606) inbyggt.",
      },
      {
        q: "Finns det svensk support för NetSuite?",
        a: "Ja, men begränsat. Ett fåtal svenska partners arbetar med NetSuite och Oracle har svensk säljorganisation. BC har avsevärt fler aktiva svenska partners.",
      },
    ],
  }),
  build({
    slug: "business-central-vs-odoo",
    productKey: "bc",
    competitor: "Odoo",
    competitorUrl: "https://www.odoo.com/sv_SE",
    title: "Business Central vs Odoo – jämförelse för svenska SMB och scale-ups",
    metaDescription:
      "Jämför Microsoft Dynamics 365 Business Central med Odoo. Funktioner, pris, implementationstid, AI, svensk lokalisering och öppen källkod – för köpare i SMB-segmentet.",
    intro:
      "Odoo är ett snabbväxande, modulärt ERP med öppen källkod-historik och låg startkostnad. Business Central är Microsofts molnbaserade ERP med djup Microsoft 365-integration och svenskt partnernät. Två tydligt olika filosofier för samma SMB-segment.",
    productSummary:
      "Business Central står starkast när bolaget värdesätter ett moget Microsoft-ekosystem, stark svensk lokalisering, Copilot och ett brett svenskt partnernät.",
    competitorSummary:
      "Odoo är prisvärt, mycket modulärt och har bred funktionalitet (ERP, CRM, e-handel, HR, MRP, projekt). Passar bolag som vill bygga upp stegvis och har tekniskt mognad internt eller via partner.",
    bestFor: {
      product: [
        "Bolag som vill ha en stabil, etablerad plattform med tydlig roadmap och stark global support.",
        "Bolag som redan kör Microsoft 365 och vill ha Copilot inbyggt.",
        "Bolag som värdesätter stort svenskt partnerutbud och svensk redovisning ur lådan.",
      ],
      competitor: [
        "Bolag med stark teknisk profil eller IT-team som vill ha kontroll på källkod och anpassningar.",
        "Bolag som vill starta smalt (t.ex. bara ekonomi + CRM) och växa stegvis.",
        "Bolag med stark prispress där låg licenskostnad är centralt.",
      ],
    },
    rows: BC_ROWS({
      arkitektur: "Moln (Odoo Online / Odoo.sh) eller on-prem. Open Source Community + kommersiell Enterprise.",
      licensModell: "Per användare/månad – från ~250 kr (One App Free) till ~450–550 kr (Standard) eller ~700–900 kr (Custom).",
      implTid: "6–20 veckor är vanligt; kortare för smala uppstarter, längre för full ERP-svit.",
      implKostnad: "100 000–800 000 kr beroende på moduler, anpassningar och svensk lokalisering.",
      isvEko: "Stort globalt community + Odoo Apps Store. Mindre svenskt utbud av certifierade lösningar.",
      integration: "Integrationer mot Office finns men inte i samma djup som BC:s native Microsoft 365-integration.",
      ai: "Odoo AI-funktioner finns (text/automation) men är mindre mogna än Microsoft Copilot.",
      lokalRedovisning: "Svensk lokalisering finns (BAS-kontoplan, SIE) men kräver ofta partneranpassning för full täckning.",
      internationell: "Stark – global plattform med community-lokalisering i 100+ länder.",
      partnerEko: "Växande svenskt partnernät (handfull aktiva Odoo Gold/Silver-partners). Mindre än BC.",
    }),
    productLimits: [
      "Om ni har stark teknisk profil internt och värdesätter öppen källkod-arkitektur.",
      "Om ni har begränsad budget och vill starta smalt med låg licenskostnad.",
      "Om ni vill ha full kontroll på databas och möjlighet till on-prem-drift.",
    ],
    competitorLimits: [
      "Om Microsoft 365 / Copilot är central plattform i organisationen.",
      "Om ni vill ha brett svenskt partnerutbud och svensk redovisning ur lådan.",
      "Om ni är ett medelstort/större bolag med komplexa krav på revision, kontroll och SLA.",
    ],
    faqs: [
      {
        q: "Är Odoo gratis?",
        a: "Odoo Community är öppen källkod och kan användas gratis, men kräver egen drift och anpassning. Odoo Enterprise (det som de flesta bolag faktiskt kör) är licensierat per användare/månad och tillkommer drift- och implementationskostnader.",
      },
      {
        q: "Vilket är billigare över 5 år – Odoo eller Business Central?",
        a: "Odoo har lägre licenskostnad men ofta högre anpassnings- och förvaltningskostnad i Sverige p.g.a. mindre standardiserad svensk lokalisering. På 5 år hamnar TCO ofta i samma härad för medelstora bolag.",
      },
      {
        q: "Är Odoo mogen nog för svenska SMB?",
        a: "Ja, för många bolag – särskilt tjänste-, handels- och e-handelsbolag. För djup svensk redovisning, lön och tillverkningsstyrning är BC eller svenska alternativ (Visma, Jeeves, Monitor) ofta tryggare val.",
      },
    ],
  }),
];

// ── F&SCM-jämförelser ─────────────────────────────────────────────────

const FSCM_COMPARISONS: ProductComparison[] = [
  build({
    slug: "fscm-vs-sap-s4hana",
    productKey: "fscm",
    competitor: "SAP S/4HANA",
    competitorUrl: "https://www.sap.com/sweden/products/erp/s4hana.html",
    title: "Dynamics 365 Finance & SCM vs SAP S/4HANA – jämförelse för svenska medel- och storbolag",
    metaDescription:
      "Jämför Dynamics 365 Finance & SCM med SAP S/4HANA. Funktionsdjup, licensmodell, implementationstid, AI och svenska partnerförhållanden för stora ERP-upphandlingar.",
    intro:
      "SAP S/4HANA och Dynamics 365 Finance & SCM är de två tydligaste alternativen för svenska medel- och storbolag som ska byta ERP. Båda är globala enterprise-plattformar – valet handlar oftast om ekosystem, AI-strategi och var organisationens befintliga kompetens ligger.",
    productSummary:
      "F&SCM är ett naturligt val för organisationer som redan är djupt inne i Microsoft-ekosystemet (M365, Azure, Power Platform, Copilot) och som värdesätter låg ledtid för rapportering, integration och AI ovanpå ERP-data.",
    competitorSummary:
      "SAP S/4HANA har djupast funktionalitet i processindustri, kemi, läkemedel och tung tillverkning samt världens största ERP-partnernät. Vanligt i svenska industribolag med lång SAP-historik.",
    bestFor: {
      product: [
        "Bolag som standardiserar på Microsoft 365, Azure och Power Platform.",
        "Organisationer som vill ha snabb time-to-value på AI och rapportering.",
        "Bolag med komplex internationell konsolidering där Dataverse + Fabric är strategiskt.",
      ],
      competitor: [
        "Stora processindustri-, kemi- och läkemedelsbolag med djupa SAP-rotade processer.",
        "Koncerner där moderbolaget redan kör SAP och kräver konsolidering på samma plattform.",
        "Bolag som värdesätter SAP:s globala partnernät och stora konsultmarknad.",
      ],
    },
    rows: FSCM_ROWS({
      arkitektur:
        "Moln (RISE with SAP / GROW with SAP) eller on-prem/Private Cloud. HANA in-memory-databas.",
      licensModell:
        "FUE (Full User Equivalent) – komplex modell baserad på användartyp och dokumentvolym. Offertbaserad, sällan publicerad.",
      implTid:
        "12–36 månader för svenska medel-/storbolag; ofta 24 mån+ vid global rollout.",
      implKostnad:
        "20–200 MSEK i svenska medel-/storprojekt. SAP-projekt är som regel dyrare än F&SCM över livscykeln.",
      funktion:
        "Bredast och djupast på marknaden – särskilt stark i processindustri, kemi, läkemedel och tung tillverkning.",
      branschdjup:
        "Mycket djupt via SAP Industry Cloud (50+ branschmoduler). Marknadsledande inom process manufacturing.",
      integration:
        "SAP BTP, Joule, S/4HANA Cloud kopplingar. Integration mot Microsoft 365 finns men är inte nativ.",
      ai:
        "SAP Joule rullas ut stegvis. Joule for Developers, Joule Studio. Mognaden varierar per modul, ofta 12–18 mån efter Copilot.",
      lokalRedovisning:
        "Mycket stark svensk lokalisering – SAP är ofta de facto-standard i stora svenska koncerner.",
      internationell:
        "Världsledande – SAP är installerat i 180+ länder, marknadsledare i Europa.",
      partnerEko:
        "Mycket stort i Sverige – Accenture, Capgemini, IBM, Implema, Sopra Steria, Deloitte m.fl. Större än F&SCM-nätet.",
    }),
    productLimits: [
      "Om er koncern redan har S/4HANA i moderbolaget och kräver konsolidering på SAP.",
      "Om ni har extremt djup processindustri (kemi, läkemedel, raffinaderi) där SAP-modulerna är industristandard.",
      "Om er IT-organisation är byggd kring SAP-kompetens och en plattformsbyte skulle kräva omfattande omskolning.",
    ],
    competitorLimits: [
      "Om ni redan är djupt inne i Microsoft 365, Azure och Power Platform – integrationsvinsten med F&SCM är stor.",
      "Om ni vill ha snabbare time-to-value på Copilot och AI ovanpå ERP-data.",
      "Om ni föredrar en transparent SaaS-licensmodell framför SAP:s FUE-baserade kalkyler.",
    ],
    faqs: [
      {
        q: "Är F&SCM eller SAP S/4HANA dyrare?",
        a: "Båda är enterprise-ERP med liknande licensspann. I svenska projekt blir SAP ofta 20–40 % dyrare över livscykeln p.g.a. större konsultbehov och längre implementation, men det varierar kraftigt med scope och bransch.",
      },
      {
        q: "Vilket har starkare AI – Copilot eller Joule?",
        a: "Microsoft Copilot ligger idag 12–18 månader före SAP Joule i bredd och mognad. SAP investerar tungt och har stark roadmap, men Copilot är mer integrerat i den dagliga användarens arbete i M365.",
      },
      {
        q: "Är SAP fortfarande bättre på processindustri?",
        a: "Ja, i de tyngsta segmenten (kemi, läkemedel, raffinaderi) har SAP fortfarande störst funktionsdjup. F&SCM klarar processindustri väl med rätt ISV men når sällan SAP-djupet i de mest komplexa flödena.",
      },
      {
        q: "Kan vi köra båda system parallellt?",
        a: "Ja, det är vanligt i koncerner där dotterbolag har F&SCM och moderbolaget SAP. Konsolidering sker då via Fabric/Synapse eller en separat konsolideringslösning.",
      },
    ],
  }),
  build({
    slug: "fscm-vs-infor-m3",
    productKey: "fscm",
    competitor: "Infor M3 (CloudSuite)",
    competitorUrl: "https://www.infor.com/sv-se/products/m3",
    title: "Dynamics 365 Finance & SCM vs Infor M3 – jämförelse för svensk industri",
    metaDescription:
      "Jämför Dynamics 365 Finance & SCM med Infor M3 (CloudSuite). Funktionsdjup, licens, implementation, AI och branschpassning för svensk tillverkning och distribution.",
    intro:
      "Infor M3 (CloudSuite) har djupa rötter i svensk industri – framförallt tillverkning, mode, livsmedel och distribution. F&SCM är Microsofts enterprise-ERP med bred bransch- och Microsoft 365-integration. Båda förekommer ofta i samma upphandlingar i Sverige.",
    productSummary:
      "F&SCM är starkast när bolaget vill bygga vidare på Microsoft-ekosystemet, har global expansion och vill ha en gemensam plattform med Customer Insights, Sales och Power Platform.",
    competitorSummary:
      "Infor M3 är specialiserat på branscher där färg, storlek, säsong, recept och spårbarhet är avgörande – mode, livsmedel, kemi, distribution. Branschmodellerna är djupare 'ur lådan' än F&SCM i dessa segment.",
    bestFor: {
      product: [
        "Tillverkare och distributörer som vill standardisera på Microsoft Cloud (Azure, M365, Power Platform).",
        "Bolag med stark CRM-/marknadsambition där samma plattform driver Sales, Service och Customer Insights.",
        "Internationella koncerner som värdesätter Microsofts globala partnernät och Copilot.",
      ],
      competitor: [
        "Mode-, livsmedels- och processdiscretetillverkare där M3:s branschmodell är industristandard.",
        "Bolag med komplex spårbarhet, recept eller säsongsplanering där M3 har funktioner ur lådan.",
        "Företag med befintlig Infor-historik och stark intern kompetens.",
      ],
    },
    rows: FSCM_ROWS({
      arkitektur:
        "Infor CloudSuite (multitenancy SaaS på AWS) eller on-prem för äldre installationer.",
      licensModell:
        "Per användare/månad – offertbaserad, ofta i samma härad som F&SCM. Inkluderar Infor OS-plattform.",
      implTid:
        "12–24 månader för svenska medel-/storbolag.",
      implKostnad:
        "10–80 MSEK beroende på branschmoduler och antal länder.",
      funktion:
        "Mycket djup på mode, livsmedel, distribution, equipment-as-a-service. ERP-kärnan är fullständig men mindre bred än F&SCM utanför industri.",
      branschdjup:
        "Marknadsledande i mode (storlek/färg-matrix), livsmedel (recept/spårbarhet), distribution. F&SCM når dit via ISV.",
      integration:
        "Stark integration via Infor OS. Mot Microsoft 365 finns standardkopplingar men inte native som F&SCM.",
      ai:
        "Infor Coleman AI och GenAI Assistant. Mognadsnivå generellt under Copilot i bredd och adoption.",
      lokalRedovisning:
        "Svensk lokalisering finns. Continia/Pagero används mer sällan – M3 har mer av detta inbyggt.",
      internationell:
        "Mycket stark – Infor har lång historik i svenska och nordiska multinationals (Trelleborg, Husqvarna m.fl. har varit kunder).",
      partnerEko:
        "Aktivt svenskt nät kring M3 (Columbus, Itelligence/NTT, Cinteros, m.fl.). Mindre än F&SCM-nätet men mycket erfaret.",
    }),
    productLimits: [
      "Om er kärnverksamhet är mode/textil med komplex storlek/färg-matrix där M3 är industristandard.",
      "Om ni har djupa receptkrav, säsongsplanering eller spårbarhet där M3-modulen är mer mogen.",
      "Om er befintliga organisation har stark M3-kompetens som skulle kräva fullständig omskolning.",
    ],
    competitorLimits: [
      "Om Microsoft 365, Power Platform och Copilot är strategiska för organisationen.",
      "Om ni vill bygga en gemensam datamodell (Dataverse) över ERP, CRM och AI.",
      "Om ni föredrar Microsofts globala AI-investeringstakt över Infors.",
    ],
    faqs: [
      {
        q: "Är Infor M3 dyrare än F&SCM?",
        a: "Licensmodellerna ligger i samma härad. Implementationen blir ibland snabbare med M3 i etablerade branscher (mode, livsmedel) eftersom branschmodellen är förkonfigurerad. I bredare scope vinner ofta F&SCM på TCO.",
      },
      {
        q: "Vilket är bättre för svensk tillverkning?",
        a: "Beror på segment. För diskret tillverkning är F&SCM mycket konkurrenskraftig. För process-/mode-/livsmedelsindustri har M3 djupare branschstandard 'ur lådan'.",
      },
      {
        q: "Är Infor Coleman AI lika moget som Copilot?",
        a: "Nej, inte i bredd. Copilot är längre framme i M365-integration, naturligt-språk-kommandon och brett tillgänglighet. Coleman har starkare fokus på prediktiv analys för specifika industriprocesser.",
      },
    ],
  }),
];

// ── Sales-jämförelser ─────────────────────────────────────────────────

const SALES_COMPARISONS: ProductComparison[] = [
  build({
    slug: "sales-vs-salesforce-sales-cloud",
    productKey: "sales",
    competitor: "Salesforce Sales Cloud",
    competitorUrl: "https://www.salesforce.com/se/sales/",
    title: "Dynamics 365 Sales vs Salesforce Sales Cloud – köparsidig jämförelse",
    metaDescription:
      "Jämför Dynamics 365 Sales med Salesforce Sales Cloud. Funktioner, pris, AI (Copilot vs Einstein), Microsoft 365-integration och svenska partnerförhållanden.",
    intro:
      "Dynamics 365 Sales och Salesforce Sales Cloud är de två tydligast etablerade CRM-plattformarna för svenska B2B-organisationer. Valet handlar sällan om funktionsbredd – båda är mogna – utan om ekosystem, AI-strategi och var organisationens dagliga arbete sker.",
    productSummary:
      "D365 Sales står starkast när organisationen lever i Microsoft 365: säljarna jobbar i Outlook och Teams, Copilot for Sales drar in CRM-kontext där användaren redan är.",
    competitorSummary:
      "Salesforce Sales Cloud är den mest mogna fristående CRM-plattformen med största globala ekosystem (AppExchange) och starkast varumärke. Naturligt val när organisationen redan är 'Salesforce-first'.",
    bestFor: {
      product: [
        "Organisationer där säljare lever i Outlook, Teams och Microsoft 365.",
        "Bolag som vill bygga gemensam datamodell över Sales, Service, Marketing och ERP.",
        "Företag som värdesätter Copilot:s djupa M365-integration framför ren CRM-bredd.",
      ],
      competitor: [
        "Bolag med befintlig Salesforce-investering, hög adoption eller stark intern Salesforce-kompetens.",
        "Säljorganisationer som vill ha bredast möjliga app-marknadsplats (AppExchange).",
        "Företag i branscher där Salesforce har de starkaste branschmolnen (Financial Services Cloud, Health Cloud m.m.).",
      ],
    },
    rows: SALES_ROWS({
      arkitektur:
        "Moln-SaaS multitenancy. Egen Lightning Platform. Datalokalisering EU/Sverige via Hyperforce.",
      licensModell:
        "Per användare/månad: Pro Suite ~1 100 kr, Enterprise ~1 800 kr, Unlimited ~3 700 kr, Einstein 1 Sales ~5 500 kr.",
      implTid:
        "8–20 veckor; ofta längre vid djup anpassning eller integration med icke-Salesforce-system.",
      implKostnad:
        "300 000–2 500 000 kr i svenska B2B-projekt. Anpassningar tenderar att bli dyrare än D365.",
      pipeline:
        "Marknadsledande pipeline-, prognos- och account engagement-funktionalitet. Stark förankring hos säljchefer.",
      marketing:
        "Salesforce Marketing Cloud / Data Cloud är separata produkter med extra licens. Tät integration internt.",
      integration:
        "Outlook/Teams-integration finns men inte native; Slack ingår i ekosystemet sedan 2021.",
      ai:
        "Einstein GPT / Agentforce – stark roadmap, men de djupaste funktionerna kräver Einstein 1- eller Agentforce-licens utöver Sales-licensen.",
      anpassning:
        "Apex (egen kodspråk) + Lightning Web Components. Mer utvecklarcentrerat än Power Apps/Power Automate.",
      partnerEko:
        "Stort svenskt nät (Capgemini, Sopra Steria, IBM, Deloitte, Fellowmind, Accenture m.fl.).",
    }),
    productLimits: [
      "Om er organisation redan har Salesforce med hög adoption och stora investeringar i AppExchange-appar.",
      "Om ni jobbar i branscher där Salesforce har överlägsen branschmolnsfunktionalitet (t.ex. Financial Services Cloud).",
      "Om er IT-strategi är medvetet Microsoft-oberoende.",
    ],
    competitorLimits: [
      "Om Microsoft 365 är navet i organisationens dagliga arbete – D365 Sales sparar mycket säljartid via Copilot.",
      "Om ni vill köra Sales, Service och ERP på samma plattform (Dataverse).",
      "Om ni vill undvika dubbla licensspår för CDP/marketing automation.",
    ],
    faqs: [
      {
        q: "Är D365 Sales billigare än Salesforce?",
        a: "Listpriset på D365 Sales Enterprise ligger ungefär halva Salesforce Enterprise. Total kostnad beror på add-ons – Copilot for Sales (~470 kr) vs Einstein 1 / Agentforce (~5 500 kr) gör skillnaden stor över tid.",
      },
      {
        q: "Vilken är starkare på AI – Copilot for Sales eller Einstein/Agentforce?",
        a: "Båda är konkurrenskraftiga men ligger på olika ställen: Copilot är djupare integrerat i Outlook/Teams där säljaren redan jobbar; Einstein/Agentforce är djupare inne i CRM-objekten med mer förpaketerade säljscenarier.",
      },
      {
        q: "Kan vi använda Copilot for Sales utan att byta CRM?",
        a: "Ja – Copilot for Sales fungerar både mot D365 Sales och Salesforce. Många bolag testar Copilot for Sales mot befintlig Salesforce innan plattformsbeslut.",
      },
      {
        q: "Vilken plattform har bäst integration mot ERP?",
        a: "D365 Sales – via Dataverse delar Sales, Service, Field Service och Business Central/F&SCM samma datamodell. Salesforce kräver iPaaS (Mulesoft eller Boomi) för djup ERP-integration.",
      },
    ],
  }),
  build({
    slug: "sales-vs-hubspot-sales-hub",
    productKey: "sales",
    competitor: "HubSpot Sales Hub",
    competitorUrl: "https://www.hubspot.com/products/sales",
    title: "Dynamics 365 Sales vs HubSpot Sales Hub – jämförelse för svenska säljorganisationer",
    metaDescription:
      "Jämför Dynamics 365 Sales med HubSpot Sales Hub. Funktioner, pris, AI, Microsoft 365-integration och vilken som passar bäst för svenska SMB och scale-ups.",
    intro:
      "HubSpot har blivit den vanligaste CRM-utmanaren i svenska SMB- och scale-up-segmentet, mycket tack vare snabb onboarding och tät koppling till marknadsföring. D365 Sales är Microsofts enterprise-tunga alternativ med djup M365-integration. De spelar i delvis olika ligor – men möts oftare och oftare i upphandlingar.",
    productSummary:
      "D365 Sales är ett bättre val när organisationen har komplexa säljprocesser, många produkter/affärsenheter, tunga ERP-integrationer eller redan lever i Microsoft 365.",
    competitorSummary:
      "HubSpot Sales Hub är snabbare att komma igång med, har den mest moderna UX-en på marknaden och en mycket stark inbound-/marketing-koppling. Naturligt val för bolag som värdesätter enkelhet och time-to-value.",
    bestFor: {
      product: [
        "Bolag med komplexa B2B-säljprocesser, många produkter eller affärsenheter.",
        "Organisationer som vill köra Sales, Service, Marketing och ERP på en gemensam plattform.",
        "Säljteam som lever i Outlook/Teams och vill ha Copilot inbyggt.",
      ],
      competitor: [
        "Snabbväxande SMB/scale-ups som vill komma igång på veckor, inte månader.",
        "Bolag med tung inbound-/content-marketing där HubSpots marketing-koppling är central.",
        "Säljorganisationer som värdesätter modern UX framför djup konfigurerbarhet.",
      ],
    },
    rows: SALES_ROWS({
      arkitektur:
        "Moln-SaaS på AWS. Multi-tenant. EU-datacenter (Frankfurt) tillgängligt.",
      licensModell:
        "Per användare/månad: Starter ~150 kr, Professional ~1 050 kr, Enterprise ~1 700 kr. Kontaktbaserad prismodell på marketing-delen kan eskalera.",
      implTid:
        "2–8 veckor är vanligt. HubSpot är medvetet enklare att rulla ut än D365/Salesforce.",
      implKostnad:
        "50 000–500 000 kr för standardimplementationer. Märkbart lägre än D365/Salesforce.",
      pipeline:
        "Modern, visuell pipeline med drag-and-drop. Mindre konfigurerbar än D365 Sales i komplexa B2B-scenarier.",
      marketing:
        "Marketing Hub är HubSpots styrka – tät koppling till Sales Hub via samma kontakt-databas.",
      integration:
        "Outlook/Teams-integrationer finns men inte djupa. Bra Slack, Gmail, Google Workspace-stöd.",
      ai:
        "Breeze AI (rebrandad ChatSpot) – AI-assistent, content generation, prospekteringsverktyg. Mognadsnivå växer snabbt men är bredare än djupare.",
      anpassning:
        "Mindre konfigurerbart än D365/Salesforce. Custom Objects och Workflows räcker långt i SMB; enterprise-anpassning når sin gräns snabbare.",
      partnerEko:
        "Växande svenskt partnernät (15+ HubSpot Solution Partners), främst marketing/RevOps-byråer.",
    }),
    productLimits: [
      "Om er säljprocess är enkel, B2C-orienterad eller inbound-driven – HubSpot kommer snabbare till värde.",
      "Om budgeten är begränsad och ni inte är beroende av Microsoft 365.",
      "Om ni vill ha samma verktyg för marknad och sälj utan separat licens för CDP.",
    ],
    competitorLimits: [
      "Om er säljprocess har många produkter, prislistor, affärsenheter eller komplexa territorier.",
      "Om ni vill koppla CRM djupt mot ERP (Business Central / F&SCM).",
      "Om Microsoft 365 + Copilot är strategisk plattform och säljarna lever där.",
    ],
    faqs: [
      {
        q: "Är HubSpot billigare än D365 Sales?",
        a: "På Starter/Pro-nivå ja, men HubSpot Enterprise + Marketing Hub Enterprise blir snabbt dyrare än D365 Sales + Customer Insights. Jämför alltid total kostnad inklusive marketing och kontaktvolym.",
      },
      {
        q: "Kan HubSpot ersätta ett enterprise-CRM som D365 Sales?",
        a: "I många SMB- och scale-up-scenarier ja. I komplexa B2B-organisationer med många affärsenheter, ERP-koppling och tung anpassning når HubSpot ofta sin gräns.",
      },
      {
        q: "Hur skiljer sig AI-funktionerna?",
        a: "Copilot for Sales är djupt integrerat med Outlook/Teams och drar in M365-kontext. HubSpot Breeze är bredare i kampanj/innehåll men ytligare i daglig säljarbete för komplexa scenarier.",
      },
      {
        q: "Kan vi börja i HubSpot och migrera till D365 senare?",
        a: "Ja, det är ett vanligt mönster. HubSpot exporterar väl via API, och flera svenska partners specialiserar sig på HubSpot→D365-migrationer när bolaget växer ur HubSpot.",
      },
    ],
  }),
];

// ── Customer Service-jämförelser ──────────────────────────────────────

const CS_COMPARISONS: ProductComparison[] = [
  build({
    slug: "customer-service-vs-zendesk",
    productKey: "customer-service",
    competitor: "Zendesk",
    competitorUrl: "https://www.zendesk.se/",
    title: "Dynamics 365 Customer Service vs Zendesk – köparsidig jämförelse",
    metaDescription:
      "Jämför Dynamics 365 Customer Service med Zendesk. Funktioner, pris, AI, omnikanal och vilken plattform som passar svenska kundserviceorganisationer bäst.",
    intro:
      "Zendesk är världens mest kända ticketing-plattform och vanlig hos svenska SaaS-bolag, e-handel och konsumentvarumärken. D365 Customer Service är Microsofts svar med djupare B2B-koppling, ERP-/CRM-integration och Copilot. Valet handlar oftast om var ni vill att kundservicen ska 'leva'.",
    productSummary:
      "D365 Customer Service är starkast när kundservice är ett av flera lager (sälj, service, fält, ERP) på samma plattform och när Copilot-effektivisering är viktigt.",
    competitorSummary:
      "Zendesk är snabbare att rulla ut, har den mest älskade agentdesktopen och en mogen self-service/community-funktionalitet. Naturligt val för B2C, SaaS och e-handel.",
    bestFor: {
      product: [
        "B2B-organisationer som vill koppla service mot Sales, Field Service och Customer Insights.",
        "Bolag med komplexa SLA, escalations och kontonivå-historik.",
        "Företag som vill ha Copilot for Service i agentens vardag.",
      ],
      competitor: [
        "SaaS-bolag, e-handel och konsumentvarumärken med stora ärendevolymer per agent.",
        "Organisationer som värdesätter snabb time-to-value och enkel agentupplevelse.",
        "Bolag med stark fokus på self-service / community / help center.",
      ],
    },
    rows: SERVICE_ROWS({
      arkitektur:
        "Moln-SaaS multi-tenant på AWS. EU-datacenter (Frankfurt) tillgängligt.",
      licensModell:
        "Per agent/månad: Suite Team ~600 kr, Growth ~990 kr, Professional ~1 250 kr, Enterprise ~1 700 kr+.",
      implTid:
        "2–8 veckor är vanligt; Zendesk är medvetet enklare att rulla ut än D365.",
      implKostnad:
        "100 000–700 000 kr för standardprojekt. Märkbart lägre än D365 vid enkla scope.",
      omnikanal:
        "Stark omnikanal – chat, e-post, sociala, voice (separat licens), WhatsApp. Branchledande chatbot-historia.",
      knowledge:
        "Mycket stark help center, community och self-service – ofta bästa-i-klassen för B2C.",
      integration:
        "Bra Slack, Salesforce, Jira-koppling. Outlook/Teams finns men inte native.",
      ai:
        "Zendesk AI (tidigare Ultimate.ai), generativ replies, intent detection, agent copilot. Snabb roadmap; mest moget i ticketing.",
      branscher:
        "Stark i SaaS, e-handel, konsumentvarumärken. Svagare i B2B med tung Account-historik.",
      partnerEko:
        "Växande svenskt nät (RevOps-byråer, e-handelskonsulter). Mindre än D365.",
    }),
    productLimits: [
      "Om ni har enkel B2C-ärendehantering med fokus på snabb onboarding.",
      "Om ni inte använder Microsoft 365 eller andra D365-applikationer.",
      "Om ni värdesätter Zendesks bevisade self-service-/community-erbjudande.",
    ],
    competitorLimits: [
      "Om ni vill koppla service mot Sales, Field Service och ERP på samma plattform.",
      "Om ni har komplexa B2B-SLA, kontoplaner och escalation-flöden.",
      "Om Copilot och Microsoft 365 är centralt i organisationen.",
    ],
    faqs: [
      {
        q: "Är D365 Customer Service dyrare än Zendesk?",
        a: "På per-agent-licens är de jämförbara (D365 Enterprise ~960 kr vs Zendesk Enterprise ~1 700 kr+). Skillnaden ligger i AI-add-ons och integrationer – Copilot for Service kostar extra, liksom Zendesk AI.",
      },
      {
        q: "Vilken plattform har bäst AI?",
        a: "Zendesk AI är längst fram i ticket-deflection och self-service. Copilot for Service är djupare i agentens dagliga arbete och drar in M365-kontext (Teams, SharePoint, Outlook). Olika styrkor.",
      },
      {
        q: "Kan vi ha Zendesk för B2C och D365 för B2B?",
        a: "Ja, vanligt mönster i koncerner. Båda har bra API:er; integration mellan dem är vanlig via iPaaS eller Power Automate.",
      },
    ],
  }),
  build({
    slug: "customer-service-vs-servicenow-csm",
    productKey: "customer-service",
    competitor: "ServiceNow Customer Service Management",
    competitorUrl: "https://www.servicenow.com/products/customer-service-management.html",
    title: "Dynamics 365 Customer Service vs ServiceNow CSM – jämförelse för enterprise",
    metaDescription:
      "Jämför Dynamics 365 Customer Service med ServiceNow Customer Service Management. Funktioner, pris, AI och vilken plattform som passar svenska enterprise bäst.",
    intro:
      "ServiceNow Customer Service Management (CSM) är ett naturligt val när organisationen redan kör ServiceNow för IT (ITSM). D365 Customer Service är Microsofts svar med djupare CRM-/sälj-koppling och Microsoft 365-integration. Båda spelar i enterprise-segmentet.",
    productSummary:
      "D365 Customer Service är starkast när service hänger ihop med sälj, marketing och ERP i samma datamodell, och när organisationen lever i Microsoft 365.",
    competitorSummary:
      "ServiceNow CSM är starkast när IT-ärenden, drift och kundservice ska köras på samma plattform – och när workflow-orkestrering mellan back office och front office är central.",
    bestFor: {
      product: [
        "Bolag där service är del av en bredare CRM-strategi (Sales, Service, Field).",
        "Organisationer som vill ha Copilot inbyggt i agentens vardag.",
        "Bolag som föredrar att data lever i Dataverse tillsammans med ERP och CRM.",
      ],
      competitor: [
        "Stora organisationer som redan kör ServiceNow ITSM och vill ha samma plattform för kundservice.",
        "Bolag med tunga workflow-flöden mellan front office, IT och drift.",
        "Företag i regulerade branscher med starka case management- och compliance-krav.",
      ],
    },
    rows: SERVICE_ROWS({
      arkitektur:
        "Moln-SaaS på egen Now Platform. Multi-tenant + dedicated. EU/datacenter tillgängliga.",
      licensModell:
        "Per agent/månad – komplex, oftast offertbaserad. Typiskt 2 500–5 000 kr/agent vid full CSM.",
      implTid:
        "12–24 veckor är vanligt; ofta längre i komplexa scope.",
      implKostnad:
        "800 000–5 000 000 kr i svenska enterprise-projekt. Märkbart över D365 i flesta scope.",
      omnikanal:
        "Stark omnikanal, men kärnstyrkan är workflow/case management snarare än ren ärendehantering.",
      knowledge:
        "Stark knowledge management och self-service via portaler (Service Portal).",
      integration:
        "Stark integration mot IT-system, ITSM, asset management. Microsoft 365/Teams via tillägg.",
      ai:
        "Now Assist – generativ AI integrerad i Now Platform. Stark roadmap men ofta licensierad separat.",
      branscher:
        "Stark i FSI, telekom, offentlig sektor, tillverkning – branscher med tunga workflow-behov.",
      partnerEko:
        "Stort svenskt enterprise-nät (Accenture, Cognizant, NTT, Capgemini, Sopra Steria m.fl.).",
    }),
    productLimits: [
      "Om er IT-organisation redan har ServiceNow och vill ha kundservice på samma plattform.",
      "Om ni har mycket tunga workflow-flöden mellan kundservice, IT och drift.",
      "Om ni har specifika ServiceNow-investeringar (egna apps på Now Platform) ni vill bygga vidare på.",
    ],
    competitorLimits: [
      "Om ni vill ha tät koppling mellan Service, Sales, Marketing och ERP.",
      "Om Microsoft 365 + Copilot är strategisk plattform.",
      "Om budget är begränsad – ServiceNow är som regel märkbart dyrare över livscykeln.",
    ],
    faqs: [
      {
        q: "Är ServiceNow dyrare än D365 Customer Service?",
        a: "Ja, i regel märkbart dyrare – både licens och implementation. ServiceNow positionerar sig som enterprise-plattform och prismässigt också det.",
      },
      {
        q: "När väljer man ServiceNow framför D365 Customer Service?",
        a: "Främst när IT-organisationen redan kör ServiceNow ITSM och vill konsolidera på samma plattform. Workflow-orkestrering är ServiceNows arvtagna styrka.",
      },
      {
        q: "Kan D365 Customer Service hantera enterprise-volymer?",
        a: "Ja. Plattformen klarar 1000+ agenter och miljontals ärenden/år. Det handlar mer om vilket ekosystem som passar er övriga IT-strategi.",
      },
    ],
  }),
  build({
    slug: "customer-service-vs-salesforce-service-cloud",
    productKey: "customer-service",
    competitor: "Salesforce Service Cloud",
    competitorUrl: "https://www.salesforce.com/se/service/",
    title: "Dynamics 365 Customer Service vs Salesforce Service Cloud – jämförelse",
    metaDescription:
      "Jämför Dynamics 365 Customer Service med Salesforce Service Cloud. Funktioner, pris, AI (Copilot vs Einstein/Agentforce) och integration mot CRM och ERP.",
    intro:
      "Service Cloud är Salesforces motsvarighet till D365 Customer Service. Båda är moget enterprise-CRM-service och valet är ofta detsamma som på CRM-sidan: vilken plattform passar in i organisationens befintliga ekosystem och AI-strategi.",
    productSummary:
      "D365 Customer Service är starkast när Microsoft 365 är navet, när Sales också körs på D365, och när Copilot/agent-effektivisering är prioriterat.",
    competitorSummary:
      "Service Cloud är starkast när organisationen redan har Salesforce Sales Cloud, har stora investeringar i AppExchange-appar eller vill ha Salesforce branschmoln.",
    bestFor: {
      product: [
        "Bolag som kör D365 Sales eller överväger gemensam CRM-/service-plattform.",
        "Organisationer som lever i Microsoft 365 och vill ha Copilot for Service.",
        "Företag som vill koppla service till ERP via Dataverse.",
      ],
      competitor: [
        "Befintliga Salesforce-kunder med hög adoption.",
        "Bolag med branscher där Salesforce har överlägsna branschmoln.",
        "Organisationer som vill ha största möjliga app-marknadsplats för service-tillägg.",
      ],
    },
    rows: SERVICE_ROWS({
      arkitektur:
        "Moln-SaaS multitenancy på Lightning Platform/Hyperforce.",
      licensModell:
        "Per agent/månad: Pro Suite ~1 100 kr, Enterprise ~1 800 kr, Unlimited ~3 700 kr, Einstein 1 Service ~5 500 kr.",
      implTid:
        "8–20 veckor; ofta längre vid djup anpassning.",
      implKostnad:
        "400 000–3 000 000 kr. Tenderar att ligga 20–40 % över D365 i jämförbara scope.",
      omnikanal:
        "Stark omnikanal-funktionalitet. Service Cloud Voice (separat add-on) för telefoni.",
      knowledge:
        "Stark – egen Knowledge med versionshantering, community via Experience Cloud.",
      integration:
        "Outlook/Teams finns; Slack ingår i ekosystemet. Native integration mot Sales Cloud.",
      ai:
        "Einstein GPT / Agentforce – stark roadmap, kraftigast i Agentforce-paketet (separat licens).",
      branscher:
        "Stark via branschmoln (Financial Services, Health, Public Sector m.fl.).",
      partnerEko:
        "Stort svenskt nät (Capgemini, IBM, Accenture, Deloitte, Sopra Steria m.fl.).",
    }),
    productLimits: [
      "Om er Salesforce-investering redan är djup och migrering skulle förlora värde.",
      "Om ni jobbar i branscher där Salesforce branschmoln har överlägsen funktionalitet.",
      "Om er IT-strategi medvetet är Microsoft-oberoende.",
    ],
    competitorLimits: [
      "Om Microsoft 365 + Copilot är navet i agentens vardag.",
      "Om ni vill köra Service, Sales och ERP på samma plattform och datamodell.",
      "Om ni vill ha lägre TCO över livscykeln – D365 är ofta märkbart billigare.",
    ],
    faqs: [
      {
        q: "Vilken plattform är billigare?",
        a: "D365 Customer Service är som regel 20–40 % billigare än Salesforce Service Cloud på licens, och oftast billigare även på implementation i svenska medel-/storprojekt.",
      },
      {
        q: "Vilken AI är starkare – Copilot for Service eller Agentforce?",
        a: "Båda är konkurrenskraftiga men kostar olika. Agentforce kräver dyra add-on-licenser; Copilot for Service ligger närmare användarens M365-vardag.",
      },
      {
        q: "Kan vi migrera från Salesforce Service Cloud till D365?",
        a: "Ja, flera svenska partners gör migrationer regelbundet. Den vanligaste drivkraften är konsolidering med M365 + Sales/ERP på samma plattform.",
      },
    ],
  }),
];

// ── Customer Insights-jämförelser ─────────────────────────────────────

const CI_COMPARISONS: ProductComparison[] = [
  build({
    slug: "customer-insights-vs-salesforce-marketing-cloud",
    productKey: "customer-insights",
    competitor: "Salesforce Marketing Cloud / Data Cloud",
    competitorUrl: "https://www.salesforce.com/se/marketing/",
    title: "Customer Insights vs Salesforce Marketing Cloud / Data Cloud – jämförelse",
    metaDescription:
      "Jämför Dynamics 365 Customer Insights (Journeys + Data) med Salesforce Marketing Cloud och Data Cloud. Funktioner, pris, AI och integration mot CRM.",
    intro:
      "Customer Insights är Microsofts marketing- och CDP-plattform – Journeys för kampanjorkestrering, Data för unifierad kundprofil. Salesforce Marketing Cloud + Data Cloud är motsvarigheten i Salesforce-ekosystemet. Båda är enterprise-mogna men prismodellerna är väldigt olika.",
    productSummary:
      "Customer Insights är starkast när organisationen redan kör D365 Sales/Service, vill ha en gemensam datamodell över CRM, ERP och marketing, och söker tydligare prismodell.",
    competitorSummary:
      "Salesforce Marketing Cloud + Data Cloud är marknadens mest etablerade marketing/CDP-stack med starkast B2C-historia – men också mest komplext att implementera och dyrast totalt sett.",
    bestFor: {
      product: [
        "Bolag som redan kör D365 Sales/Service och vill ha gemensam datamodell.",
        "Organisationer som värdesätter Microsoft Copilot + Fabric/Synapse för data och AI.",
        "Bolag som vill ha en transparent och måttligt komplex prismodell.",
      ],
      competitor: [
        "Bolag med befintlig Salesforce-investering och Marketing Cloud-kompetens.",
        "Stora B2C-organisationer med extremt höga kontaktvolymer.",
        "Företag som vill ha bredast möjliga marketing-/CDP-ekosystem (Salesforce + Mulesoft + Tableau).",
      ],
    },
    rows: CI_ROWS({
      arkitektur:
        "Moln-SaaS multitenancy. Marketing Cloud (legacy) + Marketing Cloud Engagement/Account Engagement (Pardot) + Data Cloud som CDP-lager.",
      licensModell:
        "Komplext: kontakt-/sändningsvolym, separata produkter (Engagement/Pardot/Account Engagement). Volym-baserad eskalering – ofta i 100 000-tals kr/månad i enterprise.",
      implTid:
        "12–28 veckor – Marketing Cloud är mer komplext att rulla ut än Customer Insights.",
      implKostnad:
        "800 000–5 000 000 kr i svenska medel-/storprojekt. Ofta märkbart över Customer Insights.",
      journeys:
        "Mycket stark – Journey Builder är industristandard i B2C. Marketing Cloud Engagement, MC Personalization.",
      cdp:
        "Data Cloud (tidigare Customer Data Platform) – modernt CDP-lager med stark Salesforce-integration.",
      integration:
        "Integration mot Microsoft 365 finns men inte native; tät integration med Sales Cloud, Slack, Tableau.",
      ai:
        "Einstein for Marketing / Data Cloud AI – stark men ofta licensierad separat.",
      efterlevnad:
        "GDPR-stöd, EU-datacenter (Hyperforce). Consent-hantering via inbyggda funktioner och tillägg.",
      partnerEko:
        "Stort svenskt enterprise-nät (Capgemini, IBM, Accenture, Sopra Steria m.fl.).",
    }),
    productLimits: [
      "Om ni redan har djup Salesforce-investering med Marketing Cloud i drift.",
      "Om ni har extremt höga kontaktvolymer i ren B2C där Marketing Cloud är industristandard.",
      "Om ni behöver bredd i 'martech-stack' med Mulesoft, Tableau och hela Salesforce-ekosystemet.",
    ],
    competitorLimits: [
      "Om er CRM-plattform är D365 – integrationsvinsten med Customer Insights är stor.",
      "Om ni vill ha en mindre komplex prismodell och snabbare time-to-value.",
      "Om Copilot, Fabric och Microsoft AI-stack är strategiskt.",
    ],
    faqs: [
      {
        q: "Är Customer Insights billigare än Marketing Cloud?",
        a: "I de flesta svenska scope ja, ofta märkbart. Marketing Cloud prissätts på flera dimensioner (kontakter, sändningar, produkter) som tenderar att eskalera över tid.",
      },
      {
        q: "Vilken är starkare på B2C / höga volymer?",
        a: "Marketing Cloud har historiskt sett varit starkast i ren B2C med massiva sändningsvolymer. Customer Insights – Journeys är mycket konkurrenskraftig i B2B och mid-market B2C.",
      },
      {
        q: "Kan vi köra Customer Insights utan att ha D365 Sales?",
        a: "Ja, Customer Insights kan användas fristående. Den största vinsten kommer dock när Sales och Service också körs på Dataverse.",
      },
    ],
  }),
  build({
    slug: "customer-insights-vs-hubspot-marketing-hub",
    productKey: "customer-insights",
    competitor: "HubSpot Marketing Hub",
    competitorUrl: "https://www.hubspot.com/products/marketing",
    title: "Customer Insights vs HubSpot Marketing Hub – jämförelse för svenska B2B",
    metaDescription:
      "Jämför Dynamics 365 Customer Insights med HubSpot Marketing Hub. Funktioner, pris, AI, B2B inbound marketing och integration mot CRM.",
    intro:
      "HubSpot Marketing Hub är den dominerande marketing automation-plattformen i svenska SMB- och mid-market-B2B. Customer Insights är Microsofts svar med starkare enterprise-arvtagna funktioner och CDP via Customer Insights – Data. Två tydligt olika filosofier.",
    productSummary:
      "Customer Insights är starkast i mid-market till enterprise där sälj, service och marketing ska köras på samma plattform, och där CDP/unifierade kundprofiler är ett uttalat krav.",
    competitorSummary:
      "HubSpot Marketing Hub är världsledande på inbound marketing, content och SEO i SMB/scale-up-segmentet. Snabbt att rulla ut och starkast på säljar-marknadssamspel via samma plattform.",
    bestFor: {
      product: [
        "Mid-market och enterprise-B2B med flera affärsenheter och komplexa segment.",
        "Organisationer som vill bygga gemensam datamodell över CRM, ERP och marketing.",
        "Bolag som behöver dedikerad CDP-funktionalitet via Customer Insights – Data.",
      ],
      competitor: [
        "SMB och scale-ups som vill komma igång på dagar/veckor.",
        "Bolag med tung inbound-/content-marketing och SEO-fokus.",
        "Organisationer som vill köra Sales Hub + Marketing Hub som integrerad helhet.",
      ],
    },
    rows: CI_ROWS({
      arkitektur:
        "Moln-SaaS på AWS. EU-datacenter (Frankfurt). Egen contact-databas (inte CDP i strikt mening).",
      licensModell:
        "Kontaktbaserad eskalering: Professional från ~9 000 kr/mån (2 000 kontakter), Enterprise från ~36 000 kr/mån (10 000 kontakter). Stigande snabbt med volym.",
      implTid:
        "2–10 veckor är vanligt. HubSpot är medvetet enklare att rulla ut.",
      implKostnad:
        "100 000–800 000 kr för standardimplementationer. Märkbart lägre än Customer Insights vid enkla scope.",
      journeys:
        "Workflows är HubSpots motsvarighet – stark men mer kampanj- än real-time-orienterad än Customer Insights – Journeys.",
      cdp:
        "Smart Lists + custom objects räcker långt; saknar dedikerat CDP-lager. Breeze Intelligence ger AI-berikning.",
      integration:
        "Stark integration mot Sales Hub, Service Hub, Google Workspace, Slack. Microsoft 365 finns men inte native.",
      ai:
        "Breeze AI (tidigare ChatSpot) – innehållsgenerering, AI-assistent, prospekteringsverktyg. Snabb roadmap.",
      efterlevnad:
        "GDPR-stöd, consent-flöden inbyggda. EU-datacenter standard för svenska kunder.",
      partnerEko:
        "Stort svenskt HubSpot Solution Partner-nät, främst marketing/RevOps-byråer.",
    }),
    productLimits: [
      "Om er organisation är SMB och vill ha snabbast möjliga time-to-value.",
      "Om ni driver tung inbound-/content-marketing och SEO – HubSpots arv där är svårslaget.",
      "Om ni vill ha sälj + marketing i samma agentupplevelse (Sales Hub + Marketing Hub).",
    ],
    competitorLimits: [
      "Om ni har behov av dedikerad CDP-funktionalitet med många datakällor.",
      "Om ni redan kör D365 Sales/Service och vill ha gemensam datamodell.",
      "Om er kontaktvolym är stor – HubSpot blir snabbt dyrt över tid.",
    ],
    faqs: [
      {
        q: "Är HubSpot billigare än Customer Insights?",
        a: "På Starter/Pro-nivå ja, men HubSpot Enterprise + höga kontaktvolymer blir snabbt dyrare än Customer Insights. Jämför alltid TCO över 3 år vid faktisk kontaktvolym.",
      },
      {
        q: "Kan HubSpot ersätta en CDP?",
        a: "För SMB/mid-market i många fall ja. För större organisationer med många datakällor (e-handel, ERP, transaktioner, mobil) är Customer Insights – Data ett mer komplett CDP.",
      },
      {
        q: "Vilken är bäst för B2B-marketing?",
        a: "HubSpot är marknadsledande i SMB/mid-market B2B inbound. Customer Insights vinner i komplexa enterprise-B2B med flera affärsenheter, integration mot ERP och dedikerade CDP-krav.",
      },
    ],
  }),
];

// ── Contact Center-jämförelser ────────────────────────────────────────

const CC_COMPARISONS: ProductComparison[] = [
  build({
    slug: "contact-center-vs-genesys-cloud-cx",
    productKey: "contact-center",
    competitor: "Genesys Cloud CX",
    competitorUrl: "https://www.genesys.com/sv-se",
    title: "Dynamics 365 Contact Center vs Genesys Cloud CX – köparsidig jämförelse",
    metaDescription:
      "Jämför Dynamics 365 Contact Center med Genesys Cloud CX. Funktioner, pris, AI, omnikanal och vilket val passar svenska kontaktcenter bäst.",
    intro:
      "Genesys Cloud CX är marknadsledande CCaaS (Contact Center as a Service) globalt. D365 Contact Center är Microsofts nya satsning (GA 2024) som bygger på Azure Communication Services och Nuance. Båda är seriösa alternativ för svenska enterprise.",
    productSummary:
      "D365 Contact Center är starkast när organisationen redan kör D365 Customer Service eller M365 brett, och vill ha Copilot, Nuance-baserad AI och nativ agentdesktop i samma plattform.",
    competitorSummary:
      "Genesys Cloud CX är den mest mogna CCaaS-plattformen – marknadsledande på röst, WFM, prediktiv routing och AI för kontaktcenter. Naturligt val för rena kontaktcenter med höga volymer.",
    bestFor: {
      product: [
        "Bolag som redan kör D365 Customer Service eller M365 brett.",
        "Organisationer som vill ha Copilot i agentens vardag och samlat CRM-/service-lager.",
        "Företag som värdesätter Microsoft Nuance-AI och Azure-stack.",
      ],
      competitor: [
        "Rena kontaktcenter med 100+ agenter och höga röstvolymer.",
        "Bolag som behöver bästa-i-klassen WFM, kvalitetsuppföljning och prediktiv routing.",
        "Organisationer i bank/försäkring/telekom med extremt höga krav på röstplattform.",
      ],
    },
    rows: CC_ROWS({
      arkitektur:
        "Moln-SaaS multi-tenant på AWS. Egen plattform för röst, video, omnikanal.",
      licensModell:
        "Per agent/månad: CX 1 (digital eller voice) ~750 kr, CX 2 (båda) ~950 kr, CX 3 ~1 550 kr, CX AI Experience ~2 000 kr+.",
      implTid:
        "12–24 veckor är vanligt; ofta längre vid komplex SIP-/telefoniintegration.",
      implKostnad:
        "1 000 000–5 000 000 kr i svenska enterprise-projekt.",
      rost:
        "Bästa-i-klassen röstplattform – inbyggd, mogen, hög samtalskvalitet. Stark SIP-integration mot svenska teleoperatörer.",
      omnikanal:
        "Komplett omnikanal – röst, chat, e-post, SMS, sociala, video. Branschledande på enhetlig agentdesktop.",
      ai:
        "Genesys AI Experience – conversational bots, agent assist, prediktiv routing. Mycket mogen.",
      integration:
        "Connectors för D365, Salesforce, ServiceNow, Zendesk. Microsoft Teams-integration finns.",
      svenskaTeleop:
        "Stark – Genesys har lång historik med svenska teleoperatörer; etablerade SIP-trunk-setuper.",
      partnerEko:
        "Aktivt svenskt nät av Genesys-partners (Telavox, Sigma, Dstny, Aurenav m.fl.).",
    }),
    productLimits: [
      "Om ni driver ett dedikerat enterprise-kontaktcenter där röst är kärnan i affären.",
      "Om ni behöver djup WFM, kvalitetsuppföljning och prediktiv routing 'ur lådan'.",
      "Om ni har komplexa SIP-/teleoperatörsförhållanden där Genesys mognad ger lägre risk.",
    ],
    competitorLimits: [
      "Om CRM/service ska köras på D365 – integration förenklas avsevärt med D365 Contact Center.",
      "Om ni vill ha Copilot inbyggt i agentens vardag.",
      "Om ni redan har M365 + Teams brett utrullat.",
    ],
    faqs: [
      {
        q: "Är D365 Contact Center moget för svensk enterprise?",
        a: "Det är yngre än Genesys (GA 2024) och svenska partnerutbudet är fortfarande växande. Många svenska bolag piloterar 2025–2026; Genesys har kortare riskprofil idag för stora kontaktcenter.",
      },
      {
        q: "Vilken har bäst röst-AI?",
        a: "D365 Contact Center använder Nuance (Microsoft-ägt sedan 2022) – bästa-i-klassen för biometri och röst-AI. Genesys AI Experience är bredast i live-routing och prediktiv styrning.",
      },
      {
        q: "Kan vi börja med Genesys och migrera till D365 senare?",
        a: "Ja, det är ett vanligt mönster för bolag som vill vänta tills D365 Contact Center är mer moget i svenska partnernätet (förmodligen 2026–2027).",
      },
    ],
  }),
  build({
    slug: "contact-center-vs-nice-cxone",
    productKey: "contact-center",
    competitor: "NICE CXone",
    competitorUrl: "https://www.nice.com/se",
    title: "Dynamics 365 Contact Center vs NICE CXone – jämförelse för svenska enterprise",
    metaDescription:
      "Jämför Dynamics 365 Contact Center med NICE CXone. Funktioner, pris, AI, WFM och vilken plattform som passar svenska enterprise-kontaktcenter bäst.",
    intro:
      "NICE CXone är en av de tre största CCaaS-plattformarna globalt – särskilt stark inom workforce management, analytics och AI för kontaktcenter. D365 Contact Center är Microsofts svar med tätare CRM-integration och Copilot.",
    productSummary:
      "D365 Contact Center är starkast när organisationen vill ha CRM + service + kontaktcenter på samma plattform, och när Microsoft 365 + Copilot redan är basen.",
    competitorSummary:
      "NICE CXone är starkast i bolag där WFM, kvalitetsuppföljning, talanalys och AI för agentstyrning är affärskritiska – t.ex. större outsourcers, bank/försäkring och telekom.",
    bestFor: {
      product: [
        "Bolag med D365 Customer Service eller M365 som plattform.",
        "Organisationer som värdesätter Copilot och Nuance-baserad AI.",
        "Företag med moderata kontaktcenter-volymer där tät CRM-koppling väger tyngst.",
      ],
      competitor: [
        "Outsourcing-bolag och BPO med tunga WFM- och kvalitetsuppföljningsbehov.",
        "Stora bank/försäkring-/telekomcenter med strikta compliance- och inspelningskrav.",
        "Organisationer som vill ha bästa-i-klassen talanalys och prediktiv beteendestyrning.",
      ],
    },
    rows: CC_ROWS({
      arkitektur:
        "Moln-SaaS på AWS. CXone-plattform som integrerar röst, omnikanal, WFM, analytics.",
      licensModell:
        "Per agent/månad: Digital Agent från ~850 kr, Voice Agent från ~1 100 kr, CX One Mpower-paket från ~1 800 kr. Add-ons för WFM, QM, Enlighten AI.",
      implTid:
        "12–28 veckor; längre vid full WFM-/QM-installation.",
      implKostnad:
        "1 000 000–6 000 000 kr i svenska enterprise-projekt.",
      rost:
        "Mycket mogen röstplattform; stark inspelnings- och compliance-funktionalitet.",
      omnikanal:
        "Komplett omnikanal i en agentdesktop. Stark på e-post och sociala vid hög volym.",
      ai:
        "Enlighten AI – bransch-tränad AI för agent-assist, sentiment, kvalitetsuppföljning. Marknadsledande inom talanalys.",
      integration:
        "Connectors för D365, Salesforce, ServiceNow, Zendesk. Teams-koppling finns.",
      svenskaTeleop:
        "Stark – etablerade SIP-trunk-setuper med svenska operatörer.",
      partnerEko:
        "Mindre svenskt partnernät än Genesys, men växande. Direktförsäljning vanlig.",
    }),
    productLimits: [
      "Om ni driver outsourcing/BPO med tunga WFM- och QM-krav.",
      "Om ni behöver bästa-i-klassen talanalys och beteendestyrning.",
      "Om compliance/inspelning är affärskritiskt på en nivå där NICE är industristandard.",
    ],
    competitorLimits: [
      "Om CRM ska köras på D365 – tät integration ger värde.",
      "Om Copilot/M365 är basen i organisationens dagliga arbete.",
      "Om budget är begränsad – NICE CXone är som regel märkbart dyrare.",
    ],
    faqs: [
      {
        q: "Varför är NICE CXone så starkt på WFM?",
        a: "NICE är arvtagare till IEX, en av de äldsta och mest mogna WFM-plattformarna. Många svenska BPO/outsourcers kör NICE WFM oavsett vilken CCaaS de har för röst.",
      },
      {
        q: "När väljer man NICE framför D365 Contact Center?",
        a: "Främst när WFM, QM och Enlighten AI är affärskritiska, eller när organisationen redan är 'NICE-first'.",
      },
      {
        q: "Är D365 Contact Center moget nog för enterprise?",
        a: "GA 2024, växande snabbt. Lämpar sig idag bäst för bolag med medelstora volymer som värdesätter CRM-integration över marknadsledande WFM/AI för kontaktcenter.",
      },
    ],
  }),
  build({
    slug: "contact-center-vs-puzzel",
    productKey: "contact-center",
    competitor: "Puzzel",
    competitorUrl: "https://www.puzzel.com/se",
    title: "Dynamics 365 Contact Center vs Puzzel – nordisk jämförelse",
    metaDescription:
      "Jämför Dynamics 365 Contact Center med Puzzel. Funktioner, pris, AI och nordiska partnerförhållanden för svenska kontaktcenter.",
    intro:
      "Puzzel är en norsk CCaaS-plattform med stark förankring i Norden – många svenska kontaktcenter (e-handel, retail, finans, offentlig sektor) kör Puzzel idag. D365 Contact Center är Microsofts nya alternativ med tätare CRM-integration.",
    productSummary:
      "D365 Contact Center är ett naturligt val när organisationen redan kör D365 Customer Service eller vill standardisera på Microsoft-stack med Copilot.",
    competitorSummary:
      "Puzzel är starkast som nordisk CCaaS-leverantör – nära support, etablerade integrationer med svenska teleoperatörer, snabb time-to-value och mindre teknisk komplexitet än de globala enterprise-plattformarna.",
    bestFor: {
      product: [
        "Bolag med D365 Customer Service och Copilot-strategi.",
        "Organisationer som vill ha CRM + kontaktcenter i samma datamodell.",
        "Större bolag som vill bygga på global Microsoft-stack över lång tid.",
      ],
      competitor: [
        "Nordiska kontaktcenter med 20–200 agenter där lokal närvaro och snabb support är viktig.",
        "Bolag som söker enkel, paketerad CCaaS utan stor teknisk komplexitet.",
        "Organisationer som värdesätter nordisk leverantör med kontorsnärvaro i Sverige.",
      ],
    },
    rows: CC_ROWS({
      arkitektur:
        "Moln-SaaS, drift i Norden (datacenter i Norge). Nordisk leverantör med kontor i Stockholm.",
      licensModell:
        "Per agent/månad – offertbaserad. Typiskt 700–1 500 kr/agent beroende på paket.",
      implTid:
        "4–12 veckor är vanligt – Puzzel är medvetet enklare att rulla ut än globala enterprise-plattformar.",
      implKostnad:
        "200 000–1 500 000 kr för svenska standardprojekt.",
      rost:
        "Bra röstplattform med etablerad integration mot Telia, Tele2, Telenor m.fl.",
      omnikanal:
        "Komplett omnikanal – röst, chat, e-post, sociala. Modern agentdesktop.",
      ai:
        "Puzzel AI Agent (chatbot/voicebot), agent assist. Senare i mognaden än NICE/Genesys men växande.",
      integration:
        "Connectors för D365 CRM, Salesforce, ServiceNow. Microsoft Teams-integration.",
      svenskaTeleop:
        "Mycket stark – nordisk leverantör med decennier av samarbete med svenska teleoperatörer.",
      partnerEko:
        "Egen direktförsäljning i Sverige + ett mindre nät av implementationspartners.",
    }),
    productLimits: [
      "Om ni vill ha en nordisk leverantör med svensk lokalpresens och snabb support.",
      "Om ni har 20–200 agenter och söker enkel paketering utan stor teknisk komplexitet.",
      "Om kortare time-to-value är viktigare än bredast möjliga AI-funktionalitet.",
    ],
    competitorLimits: [
      "Om ni vill köra CRM + service + kontaktcenter på samma Microsoft-plattform.",
      "Om Copilot och Nuance-baserad AI är strategiskt.",
      "Om er IT-strategi är global Microsoft-stack över lång tid.",
    ],
    faqs: [
      {
        q: "Är Puzzel bara för Norden?",
        a: "Puzzel har stark nordisk förankring men växer även internationellt. För svenska kontaktcenter är fördelarna lokalpresens, snabb support och etablerade teleoperatörsintegrationer.",
      },
      {
        q: "När väljer man D365 Contact Center framför Puzzel?",
        a: "Främst när CRM-/M365-integration är affärskritisk, när organisationen har global Microsoft-strategi, eller när Copilot är ett uttalat krav.",
      },
      {
        q: "Är Puzzel billigare?",
        a: "I många svenska mid-market-scope ja, både på licens och implementation. Skillnaden minskar i större scope där D365 Contact Centers bundle-effekter med övrig D365 ger värde.",
      },
    ],
  }),
  build({
    slug: "contact-center-vs-telia-ace",
    productKey: "contact-center",
    competitor: "Telia ACE",
    competitorUrl: "https://www.telia.se/foretag/losningar/kontaktcenter/telia-ace",
    title: "Dynamics 365 Contact Center vs Telia ACE – jämförelse för svenska kontaktcenter",
    metaDescription:
      "Jämför Dynamics 365 Contact Center med Telia ACE. Funktioner, pris, AI och svenska teleoperatörsförhållanden för kontaktcenter i Sverige.",
    intro:
      "Telia ACE är en svenskutvecklad kontaktcenterplattform med djupa rötter i svensk telekom och offentlig sektor. D365 Contact Center är Microsofts globala satsning. Båda är reella val i Sverige men vilar på helt olika filosofier.",
    productSummary:
      "D365 Contact Center är starkast när CRM/service ska köras på samma plattform, när Copilot är strategiskt och när organisationen lever i Microsoft 365.",
    competitorSummary:
      "Telia ACE är starkast i svensk offentlig sektor, vårdcentraler, kommuner och bolag där svensk leverantör, svensk juridik och tät teleoperatörsintegration med Telia är viktigt.",
    bestFor: {
      product: [
        "Bolag med D365 Customer Service och Copilot-strategi.",
        "Internationella organisationer som vill konsolidera på Microsoft-stack.",
        "Företag där CRM-integration är affärskritisk.",
      ],
      competitor: [
        "Svensk offentlig sektor, kommuner, vårdcentraler där svensk leverantör och svensk juridik vägs in.",
        "Bolag som redan har Telia som primär telekomleverantör och vill konsolidera leverantörer.",
        "Organisationer som värdesätter svensk produktägare och support på svenska 24/7.",
      ],
    },
    rows: CC_ROWS({
      arkitektur:
        "Moln-SaaS, drift i Sverige (Telia datacenter). Svenskutvecklad plattform.",
      licensModell:
        "Per agent/månad – offertbaserad, ofta paketerad med Telia-telefoni.",
      implTid:
        "8–16 veckor är vanligt; ofta snabbare för organisationer som redan kör Telia-telefoni.",
      implKostnad:
        "300 000–2 000 000 kr för svenska medelstora projekt.",
      rost:
        "Mycket stark integration med Telia-näten – ofta inkluderad i paket med Telia-telefoni.",
      omnikanal:
        "Bra omnikanal – röst, chat, e-post. Mindre bredd än globala plattformar men täcker svenska behov.",
      ai:
        "AI och chatbot finns. Mognadsnivå under NICE/Genesys/D365 i bredd men växer.",
      integration:
        "Connectors för D365, Salesforce. Stark koppling till svenska sektorsystem.",
      svenskaTeleop:
        "Bästa-i-klassen för Telia-kunder. Andra operatörer fungerar men optimeringen är mot Telia-näten.",
      partnerEko:
        "Telia själva + ett mindre nät av svenska systempartners.",
    }),
    productLimits: [
      "Om ni är svensk myndighet, kommun eller vårdcentral där svensk leverantör är viktigt.",
      "Om ni redan kör Telia-telefoni och vill ha en konsoliderad leverantör.",
      "Om ni värdesätter svensk produktägare och svensk support 24/7.",
    ],
    competitorLimits: [
      "Om ni driver internationell verksamhet eller har en global Microsoft-strategi.",
      "Om Copilot och M365 är basen i organisationens dagliga arbete.",
      "Om ni vill ha bredd i AI och CCaaS-funktioner som NICE/Genesys/D365 erbjuder.",
    ],
    faqs: [
      {
        q: "Är Telia ACE bara för Telia-kunder?",
        a: "Nej, plattformen kan köras mot andra operatörer också, men optimeringen och paketeringen är starkast mot Telia-näten.",
      },
      {
        q: "När är D365 Contact Center ett bättre val?",
        a: "När CRM körs på D365, när organisationen är internationell eller när Copilot/M365 är central plattform. ACE vinner i svensk offentlig sektor och Telia-kunder.",
      },
      {
        q: "Kan vi behålla ACE för röst och köra D365 för CRM?",
        a: "Ja, det är en vanlig hybrid – ACE för röst/telefoni och D365 Customer Service som CRM-/agentdesktop med CTI-integration.",
      },
    ],
  }),
];

// ── Field Service-jämförelse ──────────────────────────────────────────

const FS_COMPARISONS: ProductComparison[] = [
  build({
    slug: "field-service-vs-salesforce-field-service",
    productKey: "field-service",
    competitor: "Salesforce Field Service",
    competitorUrl: "https://www.salesforce.com/se/service/field-service-management/",
    title: "Dynamics 365 Field Service vs Salesforce Field Service – jämförelse",
    metaDescription:
      "Jämför Dynamics 365 Field Service med Salesforce Field Service. Funktioner, pris, AI, schemaläggning, mobil och vilket val passar svensk fältservice bäst.",
    intro:
      "D365 Field Service och Salesforce Field Service är de två största enterprise-plattformarna för fältservice. Valet följer ofta CRM-valet i övrigt – men det finns viktiga skillnader i schemaläggning, IoT och Mixed Reality.",
    productSummary:
      "D365 Field Service är starkast när organisationen redan kör D365 Sales/Service eller M365, och när IoT, Mixed Reality och Copilot för tekniker är prioriterat.",
    competitorSummary:
      "Salesforce Field Service är starkast i bolag där Salesforce CRM redan är navet, med tät Service Cloud-integration och stark mobil-app för komplex fältservice.",
    bestFor: {
      product: [
        "Bolag med D365 Sales/Service eller bred M365-strategi.",
        "Organisationer som driver IoT eller connected assets med Azure-stack.",
        "Företag som vill ha Mixed Reality (HoloLens) för fjärrsupport från tekniker.",
      ],
      competitor: [
        "Befintliga Salesforce-kunder med Service Cloud i drift.",
        "Bolag som värdesätter AppExchange-ekosystem för field service-tillägg.",
        "Organisationer som har gjort djup investering i Salesforce mobile SDK.",
      ],
    },
    rows: FS_ROWS({
      arkitektur:
        "Moln-SaaS multitenancy på Lightning Platform.",
      licensModell:
        "Per resurs/månad: Field Service Plus ~1 800 kr, Enterprise (med Service Cloud) ~3 000 kr+. Mobil-app ingår.",
      implTid:
        "12–28 veckor; ofta längre vid IoT-/asset-management-scope.",
      implKostnad:
        "800 000–4 000 000 kr i svenska enterprise-projekt.",
      schemalaggning:
        "Stark schemaläggningsmotor (Field Service Optimization). Mogen men kräver konfiguration.",
      mobil:
        "Native iOS/Android-app, offline-stöd, signatur, foton. Mycket utvecklarvänlig anpassning.",
      iot:
        "IoT via Salesforce IoT Cloud (i utveckling, mindre moget än Azure IoT-stack).",
      ai:
        "Einstein for Field Service – schedule optimization, work order summary, agent assist. Stark men ofta separat licens.",
      integration:
        "Native mot Service Cloud, Sales Cloud. Connectors för D365, ServiceNow, ERP via Mulesoft.",
      partnerEko:
        "Stort svenskt nät (Capgemini, IBM, Accenture, Sopra Steria m.fl.).",
    }),
    productLimits: [
      "Om er Salesforce-investering är djup med Service Cloud i drift.",
      "Om ni har specifika AppExchange-appar för field service som är affärskritiska.",
      "Om ni medvetet driver en Salesforce-first-strategi.",
    ],
    competitorLimits: [
      "Om ni redan kör D365 Customer Service eller Sales – integration är märkbart enklare med D365 Field Service.",
      "Om IoT, Mixed Reality och Azure-stack är strategiska.",
      "Om Copilot för tekniker (mobil) är en uttalad ambition.",
    ],
    faqs: [
      {
        q: "Vilken plattform har bäst schemaläggning?",
        a: "Båda är mogna. D365 Resource Scheduling Optimization (RSO) är extremt stark på multi-constraint-optimering; Salesforce Field Service Optimization är jämbördig men ofta dyrare att licensiera.",
      },
      {
        q: "Vilken har bäst mobil-app?",
        a: "Båda är mogna native iOS/Android-appar. Salesforce mobile-app har lite längre track record; D365 Field Service-mobilen har tagit stora kliv senaste 2 åren.",
      },
      {
        q: "Är Mixed Reality / HoloLens unikt för D365?",
        a: "Microsoft har den mest integrerade lösningen via Remote Assist på HoloLens 2. Salesforce har egna AR-koncept men inte i samma djup.",
      },
      {
        q: "Vilken är billigare?",
        a: "D365 Field Service är som regel märkbart billigare på licens. Implementationskostnaden ligger ofta i samma härad i jämförbara scope.",
      },
    ],
  }),
];

// ── Sammanslagning & export ───────────────────────────────────────────

export const PRODUCT_COMPARISONS: ProductComparison[] = [
  ...BC_COMPARISONS,
  ...FSCM_COMPARISONS,
  ...SALES_COMPARISONS,
  ...CS_COMPARISONS,
  ...CI_COMPARISONS,
  ...CC_COMPARISONS,
  ...FS_COMPARISONS,
];

// Bakåtkompatibilitet: behåll det gamla namnet/exporten så att sitemap-skriptet,
// knowledge hubs m.fl. fortsätter fungera utan följdändringar.
export const ERP_COMPARISONS = PRODUCT_COMPARISONS;
export type ErpComparison = ProductComparison;

export const getErpComparison = (slug: string): ProductComparison | undefined =>
  PRODUCT_COMPARISONS.find((c) => c.slug === slug);

export const getComparisonsByProduct = (
  productKey: ProductKey,
): ProductComparison[] => PRODUCT_COMPARISONS.filter((c) => c.productKey === productKey);

export const PRODUCT_GROUPS: { key: ProductKey; label: string; description: string }[] = [
  {
    key: "bc",
    label: "Business Central",
    description: "ERP för små och medelstora bolag.",
  },
  {
    key: "fscm",
    label: "Finance & Supply Chain",
    description: "Enterprise-ERP för medel- och storbolag.",
  },
  {
    key: "sales",
    label: "Sales",
    description: "B2B-CRM och säljpipeline.",
  },
  {
    key: "customer-service",
    label: "Customer Service",
    description: "Ärendehantering och kundservice.",
  },
  {
    key: "customer-insights",
    label: "Customer Insights",
    description: "Marknadsföring, journeys och CDP.",
  },
  {
    key: "contact-center",
    label: "Contact Center",
    description: "Kontaktcenter med röst, AI och omnikanal.",
  },
  {
    key: "field-service",
    label: "Field Service",
    description: "Fältservice, schemaläggning och tekniker-app.",
  },
];
