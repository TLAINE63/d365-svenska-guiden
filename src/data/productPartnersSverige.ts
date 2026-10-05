// Konfiguration för SEO-landningssidor "Dynamics 365 X-partners i Sverige".
// Varje slug är en egen indexerbar URL och får en egen prerenderad sida.

import type { ProductKey } from "@/hooks/usePartnerFilters";

export interface ProductPartnersSverigeConfig {
  slug: string;                  // URL-segment (utan inledande slash)
  productKey: ProductKey | "ai" | "crm"; // Vilket product_filters-fält som styr listan ("ai" = aiCapabilities)
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
    metaTitle: "Business Central-partners i Sverige: jämför {count} partners | d365.se",
    metaDescription:
      "Microsoft Dynamics 365 Business Central-partners i Sverige. Jämför inriktning, branscher och referenser. Köparsidig vägledning utan provisionsmodell.",
    intro:
      "Business Central är Microsofts affärssystem för små och medelstora företag. Valet av partner påverkar ofta projektet mer än valet av system: partnern bestämmer metod, branschtillägg, integrationer och hur förvaltningen fungerar efter driftstart.\n\nHär listas Business Central-partners på den svenska marknaden, utifrån köparens perspektiv. Partners med profileringsavtal har granskat sina uppgifter. Övriga visas med en grundprofil som d365.se har sammanställt från publika källor. Listan är sorterad efter namn och säger inget om kvalitet.\n\nJämför partners på tre punkter: erfarenhet av er bransch, referenser från bolag av er storlek och hur de arbetar med förvaltning efter go-live.",
    faq: [
      {
        q: "Hur väljer jag rätt Business Central-partner?",
        a: "Utgå från bransch, bolagets storlek och hur stor anpassning du behöver. En partner som genomfört flera implementationer i just din bransch hittar fallgroparna snabbare än en generalist. Be om referenser från liknande projekt och om en transparent prismodell.",
      },
      {
        q: "Vad kostar ett Business Central-projekt i Sverige?",
        a: "Licenskostnaden börjar på {{price:bc-team-members:exact}} (Team Member) och {{price:bc-essentials:amount-exact}} för Essentials. Implementationskostnaden ligger typiskt på 100 000–800 000 kr beroende på antal användare, integrationer och bransch-tillägg.",
      },
      {
        q: "Vilka Business Central-partners hjälper till med migrering från NAV?",
        a: "Migrering från Dynamics NAV till Business Central är ett vanligt uppdrag för partners med lång erfarenhet av NAV. Fråga partnern hur många NAV-uppgraderingar de genomfört, hur de hanterar egna anpassningar och historisk data, och om de rekommenderar en teknisk uppgradering eller en nyimplementation. Partnerprofilerna på sidan visar registrerad implementationskompetens och kundcase. Bekräfta erfarenheten av just NAV-migrering i första samtalet.",
      },
      {
        q: "Hur lång tid tar ett Business Central-projekt?",
        a: "Ett Business Central-projekt tar typiskt 3–6 månader. Mindre företag med standardprocesser kan vara igång på 2–3 månader med ett startpaket. Projekt med många anpassningar, integrationer eller flera bolag tar ofta 6–12 månader. Tiden påverkas mer av datakvalitet, beslutstakt och integrationer än av antalet användare.",
      },
      {
        q: "Hur många Business Central-partners finns i Sverige?",
        a: "d365.se har kartlagt {{bcVerified}} partnerverifierade Business Central-partners och {{bcBasic}} med grundprofil på den svenska marknaden. Antalet ändras när partners tillkommer eller uppdaterar sina profiler. Grundprofilerna bygger på publika uppgifter och är inte granskade av partnern.",
      },
      {
        q: "Vad skiljer en Business Central-partner med branschlösning från en generalist?",
        a: "En partner med branschlösning har ett färdigt tillägg för exempelvis bygg, handel eller tillverkning, med processer och rapporter som redan är anpassade. Det kan korta projektet och minska egna anpassningar, men binder er också till partnerns produkt och utvecklingstakt. En generalist anpassar standardsystemet och kombinerar tillägg från olika leverantörer. Jämför hur väl branschlösningen täcker era kritiska processer och vad det kostar att byta partner senare.",
      },
    ],
  },
  {
    slug: "finance-supply-chain-partners-sverige",
    productKey: "fsc",
    productLabel: "Dynamics 365 Finance & Supply Chain Management",
    productLandingPath: "/finance-supply-chain/",
    h1: "Finance & Supply Chain Management (F&O)-partners i Sverige",
    metaTitle:
      "Finance & Supply Chain Management (F&O)-partners i Sverige – D365 F&SCM | d365.se",
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
    slug: "dynamics-365-crm-partners-sverige",
    productKey: "crm",
    productLabel: "Dynamics 365 CRM (Sales, Customer Insights, Customer Service, Field Service, Contact Center)",
    productLandingPath: "/crm/",
    h1: "Dynamics 365 CRM-partners i Sverige",
    metaTitle: "Dynamics 365 CRM-partners i Sverige: jämför {count} partners | d365.se",
    metaDescription:
      "Jämför Microsoft-partners i Sverige för hela Dynamics 365 CRM-sviten: Sales, Customer Insights, Customer Service, Field Service och Contact Center. Köparsidig vägledning.",
    intro:
      "Dynamics 365 CRM (Customer Engagement) är en svit av appar på samma plattform: Sales, Customer Insights (Marketing), Customer Service, Field Service och Contact Center. I praktiken arbetar de flesta CRM-partners med hela sviten, därför jämför vi dem på en gemensam sida i stället för per app.\n\nHär listas partners på den svenska marknaden som har registrerat Sales eller Customer Service i sin profil, sorterade efter namn. Ordningen säger inget om kvalitet.\n\nJämför partners på tre punkter: erfarenhet av er bransch, referenser från bolag av er storlek och vilken del av CRM-sviten de faktiskt har levererat flest projekt inom. Be om ett kundcase för just den app som är viktigast för er.",
    faq: [
      {
        q: "Varför jämförs CRM-partners på en gemensam sida?",
        a: "Apparna i Dynamics 365 CRM delar plattform och kunddata (Dataverse), och nästan alla CRM-partners erbjuder hela sviten. Skillnaden ligger i var de har störst erfarenhet. Fråga därför efter referenser inom den app som är viktigast för er, till exempel Sales eller Customer Service.",
      },
      {
        q: "Vad skiljer en CRM-partner från en ERP-partner?",
        a: "En CRM-partner förstår säljprocesser, marketing automation, kundtjänst och kunddata på djupet. En ren ERP-partner kan säga att de gör CRM också men har inte alltid samma metodik. Be om en demo av en verklig process i lösningen.",
      },
      {
        q: "Behöver vi olika partners för Sales och Customer Service?",
        a: "Oftast inte. Eftersom apparna delar plattform är det en fördel med en partner som tar helheten. Om ni har mycket specifika behov, till exempel avancerad fältservice eller kontaktcenter med telefoni, kan det vara värt att kontrollera specialistkompetensen särskilt.",
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
