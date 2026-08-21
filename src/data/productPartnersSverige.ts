// Konfiguration för SEO-landningssidor "Dynamics 365 X-partners i Sverige".
// Varje slug är en egen indexerbar URL och får en egen prerenderad sida.

import type { ProductKey } from "@/hooks/usePartnerFilters";

export interface ProductPartnersSverigeConfig {
  slug: string;                  // URL-segment (utan inledande slash)
  productKey: ProductKey | "ai"; // Vilket product_filters-fält som styr listan ("ai" = aiCapabilities)
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  productLandingPath: string;    // /businesscentral, /d365sales, ...
  productLabel: string;          // Visningsnamn
  faq: { q: string; a: string }[];
}

export const PRODUCT_PARTNERS_SVERIGE: ProductPartnersSverigeConfig[] = [
  {
    slug: "business-central-partners-sverige",
    productKey: "bc",
    productLabel: "Dynamics 365 Business Central",
    productLandingPath: "/businesscentral/",
    h1: "Business Central-partners i Sverige",
    metaTitle: "Business Central-partners i Sverige – komplett lista | d365.se",
    metaDescription:
      "Microsoft Dynamics 365 Business Central-partners i Sverige. Jämför inriktning, branscher och referenser. Köparsidig vägledning utan provisionsmodell.",
    intro:
      "Här hittar du Microsoft-partners i Sverige som implementerar och förvaltar Dynamics 365 Business Central. Listan visar verifierade partners på d365.se, sorterade efter namn. Klicka på en partner för att läsa om kompetens, branscher, referenser och hur de tar betalt.",
    faq: [
      {
        q: "Hur väljer jag rätt Business Central-partner?",
        a: "Utgå från bransch, bolagets storlek och hur stor anpassning du behöver. En partner som genomfört flera implementationer i just din bransch hittar fallgroparna snabbare än en generalist. Be om referenser från liknande projekt och om en transparent prismodell.",
      },
      {
        q: "Vad kostar ett Business Central-projekt i Sverige?",
        a: "Licenskostnaden börjar på {{price:bc-team-members:exact}} (Team Member) och {{price:bc-essentials:amount-exact}} för Essentials. Implementationskostnaden ligger typiskt på 150 000–800 000 kr beroende på antal användare, integrationer och bransch-tillägg.",
      },
    ],
  },
  {
    slug: "finance-supply-chain-partners-sverige",
    productKey: "fsc",
    productLabel: "Dynamics 365 Finance & Supply Chain Management",
    productLandingPath: "/finance-supply-chain/",
    h1: "Finance & Supply Chain-partners i Sverige",
    metaTitle:
      "Finance & Supply Chain-partners i Sverige – D365 F&SCM | d365.se",
    metaDescription:
      "Microsoft Dynamics 365 Finance & Supply Chain Management-partners i Sverige. För större organisationer med koncernkrav, multi-currency och avancerad logistik.",
    intro:
      "Dynamics 365 Finance & Supply Chain Management används främst av större organisationer med internationell verksamhet, koncernredovisning och avancerade logistikflöden. Här är de partners i Sverige som arbetar med F&SCM, sorterade efter namn.",
    faq: [
      {
        q: "När passar F&SCM bättre än Business Central?",
        a: "F&SCM passar när du har flera bolag i koncern, internationell verksamhet med avancerade valuta- och skatteflöden, eller mycket komplex tillverkning/logistik. Business Central räcker för de flesta svenska medelstora bolag.",
      },
    ],
  },
  {
    slug: "dynamics-365-sales-partners-sverige",
    productKey: "sales",
    productLabel: "Dynamics 365 Sales",
    productLandingPath: "/d365sales/",
    h1: "Dynamics 365 Sales-partners i Sverige",
    metaTitle: "Dynamics 365 Sales-partners i Sverige – CRM-partner | d365.se",
    metaDescription:
      "Microsoft-partners i Sverige för Dynamics 365 Sales – pipeline, prognoser, Copilot for Sales och integration mot Outlook och Teams.",
    intro:
      "Dynamics 365 Sales är Microsofts CRM-plattform för säljteam – pipeline, prognoser, Copilot for Sales och integration mot Outlook och Teams. Här är de partners i Sverige som arbetar med Dynamics 365 Sales.",
    faq: [
      {
        q: "Vad skiljer en CRM-partner från en ERP-partner?",
        a: "En CRM-partner förstår säljprocesser, marketing automation, kunddata och Copilot for Sales på djupet. En ren ERP-partner kan ofta säga 'ja, vi gör Sales också' men har inte samma metodik. Be konkret om en demo av en säljprocess i lösningen.",
      },
    ],
  },
  {
    slug: "dynamics-365-marketing-partners-sverige",
    productKey: "sales",
    productLabel: "Dynamics 365 Customer Insights (Marketing)",
    productLandingPath: "/d365marketing/",
    h1: "Dynamics 365 Customer Insights (Marketing)-partners i Sverige",
    metaTitle:
      "Customer Insights-partners i Sverige – D365 Marketing | d365.se",
    metaDescription:
      "Microsoft-partners i Sverige för Dynamics 365 Customer Insights (tidigare Marketing) – kundresor, AI-segmentering och CDP.",
    intro:
      "Dynamics 365 Customer Insights (tidigare Marketing) är Microsofts plattform för marknadsföringsautomation och Customer Data Platform. Här är de partners i Sverige som arbetar med Customer Insights – sorterade efter namn.",
    faq: [
      {
        q: "Hur skiljer sig Customer Insights från HubSpot eller Marketo?",
        a: "Customer Insights är djupt integrerat med Dynamics 365 Sales och Service och delar samma kunddatamodell (Dataverse). Det är ofta ett naturligt val för bolag som redan kör Microsoft-stacken, medan HubSpot/Marketo kan passa bättre för fristående marknadsteam.",
      },
    ],
  },
  {
    slug: "dynamics-365-customer-service-partners-sverige",
    productKey: "service",
    productLabel: "Dynamics 365 Customer Service",
    productLandingPath: "/d365customerservice/",
    h1: "Dynamics 365 Customer Service-partners i Sverige",
    metaTitle:
      "Dynamics 365 Customer Service-partners i Sverige | d365.se",
    metaDescription:
      "Microsoft-partners i Sverige för Dynamics 365 Customer Service – ärendehantering, omnikanal och Copilot for Service.",
    intro:
      "Dynamics 365 Customer Service är Microsofts plattform för ärendehantering, omnikanal och kundtjänst med Copilot for Service. Här är de partners i Sverige som arbetar med Customer Service.",
    faq: [
      {
        q: "Vad ingår i en typisk Customer Service-implementation?",
        a: "Ärendetyper, SLA-regler, kunskapsbas, omnikanal (e-post/chatt/telefoni), routing och rapportering. Copilot for Service kan automatisera svarsförslag och ärendesammanfattningar.",
      },
    ],
  },
  {
    slug: "dynamics-365-field-service-partners-sverige",
    productKey: "service",
    productLabel: "Dynamics 365 Field Service",
    productLandingPath: "/d365fieldservice/",
    h1: "Dynamics 365 Field Service-partners i Sverige",
    metaTitle:
      "Dynamics 365 Field Service-partners i Sverige | d365.se",
    metaDescription:
      "Microsoft-partners i Sverige för Dynamics 365 Field Service – schemaläggning, mobilitet och integration mot ERP.",
    intro:
      "Dynamics 365 Field Service är Microsofts lösning för fältservice – schemaläggning, mobilapp för tekniker, IoT-larm och integration mot ERP. Här är de partners i Sverige som arbetar med Field Service.",
    faq: [
      {
        q: "Hur viktig är ERP-integrationen för Field Service?",
        a: "Mycket viktig. Order, artiklar, lager och fakturering bör flöda mellan Field Service och ditt ERP (Business Central eller F&SCM). Välj en partner som behärskar båda sidor av integrationen.",
      },
    ],
  },
  {
    slug: "dynamics-365-contact-center-partners-sverige",
    productKey: "service",
    productLabel: "Dynamics 365 Contact Center",
    productLandingPath: "/d365contactcenter/",
    h1: "Dynamics 365 Contact Center-partners i Sverige",
    metaTitle:
      "Dynamics 365 Contact Center-partners i Sverige | d365.se",
    metaDescription:
      "Microsoft-partners i Sverige för Dynamics 365 Contact Center – AI-driven röst, chatt och digital självbetjäning.",
    intro:
      "Dynamics 365 Contact Center är Microsofts AI-drivna kontaktcenter-lösning med röst, chatt, digital självbetjäning och Copilot. Här är de partners i Sverige som arbetar med Contact Center.",
    faq: [
      {
        q: "Behöver vi byta telefoni för att använda Contact Center?",
        a: "Inte alltid. Contact Center kan ofta integreras med befintliga växel- och telefoniplattformar via SIP eller Microsoft Teams, men en plan för röst-routing och inspelning bör tas fram tidigt.",
      },
    ],
  },
  {
    slug: "dynamics-365-ai-copilot-partners-sverige",
    productKey: "ai",
    productLabel: "Dynamics 365 AI & Copilot",
    productLandingPath: "/aioversikt/",
    h1: "Dynamics 365 AI- och Copilot-partners i Sverige",
    metaTitle:
      "Dynamics 365 AI- & Copilot-partners i Sverige | d365.se",
    metaDescription:
      "Microsoft-partners i Sverige som har levererat AI- och Copilot-projekt på Dynamics 365 – från Copilot-aktivering till egna AI-agenter.",
    intro:
      "Här är de Microsoft-partners i Sverige som har levererat AI- och Copilot-projekt på Dynamics 365 – från Copilot-aktivering till egna AI-agenter byggda på Copilot Studio och Azure AI.",
    faq: [
      {
        q: "Vad innebär 'AI-agent' i Dynamics 365-sammanhang?",
        a: "En AI-agent är en autonom funktion (ofta byggd i Copilot Studio) som utför uppgifter åt en användare – t.ex. svara på inkommande ärenden, sammanfatta möten eller skapa offerter. Agenter kan kopplas till Dynamics 365-data och affärsregler.",
      },
    ],
  },
];

export const findProductPartnersSverigeConfig = (slug: string) =>
  PRODUCT_PARTNERS_SVERIGE.find((c) => c.slug === slug);
