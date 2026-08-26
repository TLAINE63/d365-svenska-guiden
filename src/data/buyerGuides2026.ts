// Innehåll för köparguiderna 2026 (ERP respektive CRM).
// Tonen är köparsidig: vad du behöver veta innan du börjar prata med leverantörer.
// Guiderna innehåller inga sifferpåståenden utan källa – priser och kostnadsspann
// hämtas från /kostnad/ och /priser/ som uppdateras separat.

export type GuideSection = {
  heading: string;
  intro?: string;
  bullets: string[];
};

export type BuyerGuide = {
  key: "erp" | "crm";
  slug: string;
  /** Produktområden som guiden täcker. */
  scope: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  hero: string;
  intro: string;
  /** Vad läsaren får ut av guiden – används både på sidan och i grinden. */
  benefits: string[];
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  /** Vilken jämförelse-/beslutsväg som är mest relevant efter guiden. */
  nextStep: string;
};

const commonPartnerProof = (area: string): string[] => [
  `Referenser från bolag i din storlek och bransch som varit live i minst sex månader med ${area}.`,
  "Namn och roller på konsulterna som faktiskt ska leverera – inte bara säljare.",
  "Konkret metodik för design, test, datamigrering, cutover och hypercare.",
  "Hur förvaltning och vidareutveckling ser ut efter go-live: svarstider, kanaler och vem som äger din lösning.",
  "Vad som händer vid en tvist eller ett avbrott i samarbetet – äger du din kod, data och dokumentation?",
];

export const BUYER_GUIDES: Record<"erp" | "crm", BuyerGuide> = {
  erp: {
    key: "erp",
    slug: "erp-koparguiden-2026",
    scope: "Dynamics 365 Business Central och Finance & Supply Chain Management",
    title: "ERP-köparguiden 2026",
    seoTitle: "ERP-köparguiden 2026 – köp affärssystem rätt",
    seoDescription:
      "Köparsidig guide inför ERP-upphandling 2026: när Business Central räcker, när Finance & Supply Chain behövs, vad kostnaden består av och vilka krav du ska ställa på partnern.",
    hero: "Så köper du affärssystem 2026 – utan att betala för fel scope",
    intro:
      "Guiden är skriven från köparens sida. Den beskriver hur du avgör vilket Dynamics 365-ERP som passar, vad totalkostnaden faktiskt består av och vilka bevis du ska kräva av partnern innan du skriver på.",
    benefits: [
      "Beslutsunderlag för valet mellan Business Central och Finance & Supply Chain",
      "Checklista för vad totalkostnaden består av utöver listpris",
      "De frågor som avslöjar om partnern har levererat i din bransch tidigare",
      "Mall för hur du strukturerar utvärdering och referenstagning",
    ],
    sections: [
      {
        heading: "1. Börja i verksamheten, inte i systemet",
        intro:
          "De flesta ERP-projekt som spårar ur gör det för att scopet sattes utifrån systemet i stället för utifrån processerna.",
        bullets: [
          "Beskriv de fem till tio processer som faktiskt skapar värde hos er, och var det gör ont idag.",
          "Skilj på det som är verksamhetskritiskt och det som bara är vana från det gamla systemet.",
          "Bestäm vilka processer ni är beredda att lägga om till standard – det är den enskilt största kostnadsdrivaren.",
          "Sätt mätbara mål (ledtid, lagerbindning, bokslutstid) innan ni pratar leverantör.",
        ],
      },
      {
        heading: "2. Business Central eller Finance & Supply Chain?",
        bullets: [
          "Business Central passar typiskt små och medelstora bolag med ett fåtal juridiska enheter och rimligt komplex tillverkning eller distribution.",
          "Finance & Supply Chain blir aktuellt vid många bolag och länder, avancerad tillverkning, tung logistik eller omfattande koncernkrav.",
          "Antal användare säger mindre än processkomplexiteten – ett litet bolag med extrem komplexitet kan behöva F&SCM och tvärtom.",
          "Räkna alltid på förvaltningsförmågan internt: F&SCM kräver mer eget ägarskap över tid.",
        ],
      },
      {
        heading: "3. Vad kostnaden faktiskt består av",
        intro: "Listpriset per användare är sällan den avgörande posten.",
        bullets: [
          "Licens per användare och månad, plus eventuella tilläggslicenser och lagringsutrymme.",
          "Implementationsprojektet: design, konfiguration, test, utbildning och cutover.",
          "Datamigrering och datastädning – ofta underskattat och nästan alltid tidskritiskt.",
          "Integrationer, branschapp och rapportplattform (typiskt Power BI).",
          "Intern tid: nyckelpersoner behöver avlastas under projektet.",
          "Förvaltning och vidareutveckling efter go-live, inklusive Microsofts löpande releaser.",
        ],
      },
      {
        heading: "4. Så utvärderar du partners",
        intro: "Produktvalet är viktigt. Partnervalet avgör oftare om projektet lyckas.",
        bullets: commonPartnerProof("Business Central eller Finance & Supply Chain"),
      },
      {
        heading: "5. Vanliga fallgropar",
        bullets: [
          "Att jämföra offerter med olika scope som om de vore samma sak.",
          "Att låta demo styra beslutet – demon visar det systemet är bäst på, inte det du behöver.",
          "Att skjuta datamigreringen framför sig till slutet av projektet.",
          "Att glömma förvaltningsavtalet tills projektet redan är avslutat.",
          "Att bara tala med de största partnerbolagen – specialiserade mindre partners är ofta starkare i en specifik bransch.",
        ],
      },
    ],
    faq: [
      {
        q: "Hur lång tid tar en ERP-upphandling?",
        a: "Det varierar med komplexitet och intern beslutsförmåga. En strukturerad upphandling för ett medelstort bolag löper typiskt över några månader från behovsanalys till partnerval; komplexa koncernprojekt tar längre tid. Den största variabeln är hur snabbt ni själva kan enas om krav och prioriteringar.",
      },
      {
        q: "Hur många partners bör vi utvärdera?",
        a: "Tre till fem partners i en första dialog och två till tre i slutlig utvärdering ger tillräcklig jämförbarhet utan att processen blir för tung. Fler än så gör det svårt att göra rättvisa jämförelser.",
      },
      {
        q: "Vad kostar ett Dynamics 365-affärssystem?",
        a: "Kostnaden består av licens, implementation och förvaltning. Aktuella licenspriser och kostnadsspann för implementationsprojekt finns samlade på kostnadsguiden på d365.se, som uppdateras löpande.",
      },
    ],
    nextStep:
      "När du vet vilket ERP-spår som är rimligt: jämför partners på bransch, storlek och leveransförmåga, spara dem till din shortlist och skicka ditt underlag till dem du vill prata med.",
  },

  crm: {
    key: "crm",
    slug: "crm-koparguiden-2026",
    scope: "Dynamics 365 Sales, Customer Service, Field Service, Contact Center och Customer Insights",
    title: "CRM-köparguiden 2026",
    seoTitle: "CRM-köparguiden 2026 – köp CRM rätt",
    seoDescription:
      "Köparsidig guide inför CRM-upphandling 2026: hur du avgränsar sälj, service, fält och marknad, vad kostnaden består av och vilka krav du ska ställa på Dynamics 365-partnern.",
    hero: "Så köper du CRM 2026 – med adoption som mål, inte funktioner",
    intro:
      "Ett CRM-projekt lyckas när säljare och servicepersonal faktiskt använder systemet. Guiden beskriver hur du avgränsar scope, undviker de vanligaste misstagen och väljer en partner som kan din process – inte bara plattformen.",
    benefits: [
      "Avgränsning mellan Sales, Customer Service, Field Service, Contact Center och Customer Insights",
      "Checklista för vad CRM-kostnaden faktiskt består av",
      "Frågor som avslöjar om partnern förstår din säljprocess",
      "Hur du bygger in adoption i kravbilden i stället för att hoppas på den",
    ],
    sections: [
      {
        heading: "1. Utgå från processen, inte från fälten",
        bullets: [
          "Beskriv säljprocessen som den faktiskt ser ut idag, inte som den står i en presentation.",
          "Definiera vad som ska mätas: pipeline, konvertering, svarstider, återköp.",
          "Bestäm vilka som är primära användare och vad de vinner på systemet – annars blir adoptionen låg.",
          "Skilj tydligt på sälj, service, fältservice och marknad; de har olika krav och olika licensmodeller.",
        ],
      },
      {
        heading: "2. Vilka applikationer behöver du?",
        bullets: [
          "Dynamics 365 Sales för pipeline, offert- och affärshantering.",
          "Customer Service för ärendehantering, kunskapsbas och SLA-styrning.",
          "Field Service när arbetet utförs på plats hos kund med planering och tekniker.",
          "Contact Center när samtal, chatt och digitala kanaler ska hanteras i samma flöde.",
          "Customer Insights (marketing automation) för segmentering, kampanjer och kunddata.",
          "Börja med det område som har tydligast affärsvärde och bygg vidare – allt på en gång ökar risken.",
        ],
      },
      {
        heading: "3. Vad kostnaden faktiskt består av",
        bullets: [
          "Licens per användare och applikation – tilläggslicenser är ofta billigare än fulla licenser.",
          "Konfiguration av process, formulär, automatisering och behörigheter.",
          "Integrationer mot ERP, e-post, telefoni, e-handel och marknadsverktyg.",
          "Datamigrering och datakvalitet – ett CRM med dålig kunddata används inte.",
          "Utbildning och förändringsledning, som är den vanligaste underbudgeterade posten.",
          "Löpande vidareutveckling när processen ändras.",
        ],
      },
      {
        heading: "4. Så utvärderar du partners",
        bullets: commonPartnerProof("Dynamics 365 Sales, Customer Service eller Field Service"),
      },
      {
        heading: "5. Vanliga fallgropar",
        bullets: [
          "Att bygga systemet efter ledningens rapportbehov i stället för användarnas vardag.",
          "Att införa alla applikationer samtidigt utan att första området satt sig.",
          "Att flytta över gammal, ostädad kunddata rakt av.",
          "Att köpa marketing automation utan att ha ägarskap för innehåll och kampanjer internt.",
          "Att sakna en tydlig systemägare efter go-live.",
        ],
      },
    ],
    faq: [
      {
        q: "Ska vi införa CRM och ERP samtidigt?",
        a: "Det går, men det ökar belastningen på samma nyckelpersoner och gör det svårare att styra risk. De flesta bolag vinner på att sekvensera – börja med det område som har störst affärsvärde och tydligast ägarskap.",
      },
      {
        q: "Behöver vi samma partner för CRM och ERP?",
        a: "Inte nödvändigtvis. Vissa partners är starka på båda, andra är specialiserade. Det viktiga är att integrationen mellan systemen har en tydlig ägare och att ansvarsgränserna är skrivna i avtalet.",
      },
      {
        q: "Vad kostar Dynamics 365 Sales?",
        a: "Licenspriset anges per användare och månad och skiljer sig mellan Professional och Enterprise. Aktuella priser finns samlade på prissidan på d365.se, och implementationskostnaden beror på antal processer, integrationer och datamängd.",
      },
    ],
    nextStep:
      "När du vet vilka CRM-applikationer som är aktuella: jämför partners som faktiskt levererat inom ditt område, spara dem till din shortlist och skicka in ditt underlag.",
  },
};
