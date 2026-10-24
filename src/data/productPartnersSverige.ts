// Konfiguration för SEO-landningssidor "Dynamics 365 X-partners i Sverige".
// Varje slug är en egen indexerbar URL och får en egen prerenderad sida.

import type { ProductKey } from "@/hooks/usePartnerFilters";

export interface ProductPartnersSverigeConfig {
  slug: string;                  // URL-segment (utan inledande slash)
  productKey: ProductKey | "ai" | "crm"; // Vilket product_filters-fält som styr listan ("ai" = aiCapabilities)
  h1: string;
  metaTitle: string;
  /** Endast när en exakt beslutad titel är något längre än standardgränsen. */
  titleMaxLength?: number;
  metaDescription: string;
  intro: string;
  productLandingPath: string;    // /businesscentral, /d365sales, ...
  productLabel: string;          // Visningsnamn
  faq: { q: string; a: string }[];
  /** Valfri H2-sektion direkt efter hero, manuellt skriven per sida. */
  leadSection?: {
    heading: string;
    intro: string;
    items: { label: string; text: string }[];
    outro?: string;
  };
  /** Valfri H2-sektion efter partnerlistan. */
  closingSection?: { heading: string; text: string };
  /** Internlänkar: första förekomsten av varje fras i sidans texter länkas. */
  links?: { text: string; to: string }[];
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
      "Microsoft Dynamics 365 Business Central-partners i Sverige. Jämför inriktning, branscher och referenser. Vägledning inför partnervalet, utan provisionsmodell.",
    intro:
      "Business Central är Microsofts affärssystem för små och medelstora företag. Valet av partner påverkar ofta projektet mer än valet av system: partnern bestämmer metod, branschtillägg, integrationer och hur förvaltningen fungerar efter driftstart.\n\nHär listas Business Central-partners på den svenska marknaden, utifrån köparens perspektiv. Partners med profileringsavtal har granskat sina uppgifter. Övriga visas med en grundprofil som d365.se har sammanställt från publika källor. Listan är sorterad efter namn och säger inget om kvalitet.\n\nJämför partners på tre punkter: erfarenhet av er bransch, referenser från bolag av er storlek och hur de arbetar med förvaltning efter go-live.",
    faq: [
      {
        q: "Hur väljer jag rätt Business Central-partner?",
        a: "Utgå från bransch, bolagets storlek och hur stor anpassning du behöver. En partner som genomfört flera implementationer i just din bransch hittar fallgroparna snabbare än en generalist. Be om referenser från liknande projekt och om en transparent prismodell.",
      },
      {
        q: "Vad kostar ett Business Central-projekt i Sverige?",
        a: "Licenskostnaden börjar på {{price:bc-team-members:exact}} (Team Member) och {{price:bc-essentials:amount-exact}} för Essentials. Implementationen finns som snabbstart till fast pris från 50 000 kr; annars ligger ett litet projekt på ca 175 000–465 000 kr och ett medelstort på 465 000 kr–1,2 MSEK, beroende på bransch, integrationer och tillägg.",
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
    h1: "Dynamics 365 CRM-partner i Sverige",
    metaTitle: "Dynamics 365 CRM-partner i Sverige – Hitta och jämför experter | d365.se",
    titleMaxLength: 75,
    metaDescription:
      "Hitta rätt Dynamics 365 CRM-partner i Sverige. Jämför partners för Dynamics 365 Sales, Customer Service, implementation, support och vidareutveckling.",
    links: [
      { text: "jämföra Dynamics 365-partners", to: "/valjdynamics365partner/" },
      { text: "Dynamics 365 Sales", to: "/d365sales/" },
      { text: "Dynamics 365 Customer Service", to: "/d365customerservice/" },
      { text: "implementation av Dynamics 365", to: "/crm-koparguiden-2026/" },
    ],
    leadSection: {
      heading: "Så väljer du rätt Dynamics 365 CRM-partner",
      intro:
        "En bra CRM-partner hjälper er inte bara att konfigurera systemet. Partnern ska förstå hur sälj, kundservice, marknad och verksamhetsledning arbetar tillsammans, och omsätta det till processer, data och uppföljning som fungerar i vardagen. När ni vill jämföra Dynamics 365-partners inom CRM bör ni särskilt bedöma:",
      items: [
        { label: "Appar", text: "Erfarenhet av Dynamics 365 Sales och Dynamics 365 Customer Service." },
        { label: "Projektledning", text: "Förmåga att leda implementation av Dynamics 365 och förändringsarbete." },
        { label: "Teknik", text: "Kompetens inom integrationer, datamigrering och rapportering." },
        { label: "Efter go-live", text: "Support, förvaltning och utveckling efter go-live." },
        { label: "Passform", text: "Erfarenhet från er bransch och organisationens storlek." },
      ],
      outro:
        "Här nedan listar och jämför vi partners på den svenska marknaden som arbetar med Dynamics 365 CRM. Be alltid om referenser som styrker erfarenheten inom just ert område.",
    },
    closingSection: {
      heading: "Från CRM-implementation till långsiktig utveckling",
      text: "En Dynamics 365 CRM-implementation är starten, inte slutet. Välj en partner som kan stötta er med prioriteringar, utbildning, kvalitet i kunddata och löpande förbättringar. Då blir CRM-systemet ett verktyg för bättre säljprocesser, högre servicegrad och mer användbar affärsinformation.",
    },
    intro:
      "Letar du efter en Dynamics 365 CRM-partner i Sverige? Här kan du hitta och jämföra partners med erfarenhet av Microsoft Dynamics 365 Sales, Customer Service och andra CRM-lösningar. Jämför kompetens, branscherfarenhet, implementation, support och förmåga att vidareutveckla lösningen över tid.\n\nDynamics 365 CRM (Customer Engagement) är en svit av appar på samma plattform: Sales, Customer Insights (Marketing), Customer Service, Field Service och Contact Center. I praktiken arbetar de flesta CRM-partners med hela sviten, därför jämför vi dem på en gemensam sida i stället för per app. Partnerna listas efter namn, och ordningen säger inget om kvalitet.",
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
