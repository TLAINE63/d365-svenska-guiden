import SystemvalHandoffNote from "@/components/SystemvalHandoffNote";
import PartnerSwitchCta from "@/components/PartnerSwitchCta";
import AiExamplesEntry from "@/components/ai-examples/AiExamplesEntry";
import SalesDecisionGuide from "@/components/product/SalesDecisionGuide";
import ProductNextSteps from "@/components/product/ProductNextSteps";
import BuyerFitSection from "@/components/BuyerFitSection";
import BasicProfilesDirectory from "@/components/BasicProfilesDirectory";
import EditorialSource from "@/components/EditorialSource";
import EditorialAssessment from "@/components/EditorialAssessment";
import SourcesAndMethod from "@/components/SourcesAndMethod";
import UnprofiledPartnersList from "@/components/UnprofiledPartnersList";
import ProductIsvSection from "@/components/ProductIsvSection";
import FunnelCTA from "@/components/FunnelCTA";
import ProductDeepDiveLink from "@/components/ProductDeepDiveLink";
import ProductHero from "@/components/ProductHero";
import RelatedPages, { salesRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import ShortAnswer from "@/components/ShortAnswer";
import Footer from "@/components/Footer";
import ProductPartnerNewsSection from "@/components/ProductPartnerNewsSection";
import AktuelltContextSection from "@/components/aktuellt/AktuelltContextSection";
import ContactFormDialog from "@/components/ContactFormDialog";
import ApplicationPartners from "@/components/ApplicationPartners";
import BuyerManual from "@/components/BuyerManual";
import CostBreakdown from "@/components/CostBreakdown";
import ComparisonQuickLinks from "@/components/ComparisonQuickLinks";
import ProductRoiCta from "@/components/ProductRoiCta";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import SalesIcon from "@/assets/icons/Sales.svg";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { resolvePriceTokens } from "@/lib/productPriceFormat";

// Breadcrumb items
const salesBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Marknad & Sälj", url: "https://d365.se/d365sales" },
  { name: "Dynamics 365 Sales", url: "https://d365.se/d365sales" },
];
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Sales FAQs for schema – priser hämtas från product_prices via resolvePriceTokens
const salesFaqsRaw = [
  { question: "Vad är guided selling?", answer: "Guided selling betyder att CRM-systemet vägleder säljaren genom säljprocessen steg för steg i stället för att lämna nästa åtgärd till minnet. I Dynamics 365 Sales sker det via Business Process Flows (definierade faser med obligatoriska fält), sekvenser som schemalägger samtal och e-post, samt Copilot-förslag på nästa aktivitet baserat på affärens historik. Effekten är jämnare arbetssätt mellan säljare och mer tillförlitlig pipeline-data – förutsatt att processen är definierad utifrån hur ni faktiskt säljer." },
  { question: "Vad kostar Dynamics 365 Sales?", answer: "Dynamics 365 Sales finns i tre licensnivåer: Sales Professional kostar {{price:sales-professional:short}}, Sales Enterprise {{price:sales-enterprise:short}} och Sales Premium {{price:sales-premium:short}}. Implementeringskostnad för ett standardprojekt med 10–30 användare ligger typiskt på 75 000–300 000 kr." },
  { question: "Vad är Dynamics 365 Sales och vad används det till?", answer: "Microsoft Dynamics 365 Sales är ett molnbaserat CRM-system (Customer Relationship Management) för säljteam. Det hjälper företag hantera leads, affärsmöjligheter, kundkonton och prognoser – med inbyggd AI via Microsoft Copilot som rekommenderar nästa steg och analyserar kunddata i realtid." },
  { question: "Hur jämför sig Dynamics 365 Sales mot Salesforce?", answer: "Dynamics 365 Sales och Salesforce är de två ledande CRM-systemen. Dynamics 365 Sales sticker ut med djup Microsoft 365-integration (Outlook, Teams, Excel), inbyggd Copilot AI utan extrakostnad i Enterprise-planen, och möjligheten att koppla CRM direkt med Microsoft ERP-system som Business Central. Salesforce har ett bredare ekosystem av tredjepartsappar men kräver ofta mer anpassning och har högre total ägandekostnad." },
  { question: "Vad är skillnaden mellan Sales Professional och Sales Enterprise?", answer: "Sales Professional ({{price:sales-professional:short}}) är grundlicensen med lead- och affärshantering, kontakthantering och Microsoft 365-integration. Sales Enterprise ({{price:sales-enterprise:short}}) lägger till inbyggd Copilot AI, förutsägande poängsättning av leads, avancerad försäljningsanalys och anpassningsbar automatisering via Power Automate." },
  { question: "Hur fungerar Microsoft Copilot AI i Dynamics 365 Sales?", answer: "Microsoft Copilot i Dynamics 365 Sales analyserar kunddata och ger realtidsrekommendationer för säljare. Det sammanfattar e-postkonversationer, föreslår nästa bästa åtgärd, prioriterar leads baserat på konverteringssannolikhet och kan skriva uppföljningsmail automatiskt. Copilot ingår i Sales Enterprise och Premium utan extra licensavgift." },
  { question: "Kan Dynamics 365 Sales integreras med vårt ERP-system?", answer: "Ja. Dynamics 365 Sales integreras nativt med Microsoft Business Central och Finance & Supply Chain Management, vilket ger säljarna tillgång till lagerdata, orderstatus och kundreskontro direkt i CRM-systemet. Integration med tredjepartsERP-system görs via Power Platform eller Microsofts standardkopplingar." },
  { question: "Hur lång tid tar det att implementera Dynamics 365 Sales?", answer: "En standardimplementering för 10–30 användare tar normalt 2–3 månader. Större implementeringar med anpassade säljprocesser, systemintegrationer och multipla säljteam tar 4–6 månader. Valet av erfaren Microsoft-partner är avgörande för att hålla tid och budget." },
  { question: "Behöver vi en Microsoft-partner för att implementera Dynamics 365 Sales?", answer: "Ja, Dynamics 365 Sales implementeras via certifierade Microsoft-partners med CRM-specialistkompetens. En bra partner tar fram rätt konfiguration, utbildar säljteamet och säkerställer adoption. På d365.se kan du filtrera och jämföra certifierade Dynamics 365 Sales-partners i Sverige." },
];
const salesFaqs = salesFaqsRaw.map((f) => ({ ...f, answer: resolvePriceTokens(f.answer) }));

const D365Sales = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const salesPricing = [
    {
      title: "Sales Professional",
      description: "För försäljningsteam",
      price: "621 kr",
      features: [
        "Lead- och affärshantering",
        "Kontakt- och kontohantering",
        "E-postintegration",
        "Grundläggande rapporter",
        "Microsoft 365-integration",
      ],
    },
    {
      title: "Sales Enterprise",
      description: "Avancerad försäljning",
      price: "1 003,70 kr",
      features: [
        "Allt i Professional",
        "Integrerad Copilot",
        "Förutsägande insikter med AI",
        "Avancerad analys",
        "Anpassningsbar automatisering",
      ],
    },
    {
      title: "Sales Premium",
      description: "Premium försäljning",
      price: "1 433,80 kr",
      features: [
        "Allt i Enterprise",
        "Conversation Intelligence",
        "Relationship scoring",
        "Avancerad försäljningsanalys",
        "Försäljningsplanering",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Dynamics 365 Sales – CRM för B2B, pris & partners"
        description={resolvePriceTokens("Dynamics 365 Sales är Microsofts CRM för B2B-sälj: pris från {{price:sales-professional:short}}, Copilot, jämförelse mot Salesforce och svenska partners.")}
        canonicalPath="/d365sales"
        keywords="Dynamics 365 Sales pris, Dynamics 365 Sales licens, CRM för sälj, Microsoft CRM system, Salesforce alternativ Sverige, Dynamics 365 Sales vs Salesforce, CRM system säljteam, Dynamics 365 Sales implementering, Sales Enterprise Copilot, Microsoft CRM partner Sverige"
        ogImage="https://d365.se/og-sales.png"
        ogImageAlt="Dynamics 365 Sales – köpguide på d365.se"
      />
      <FAQSchema faqs={salesFaqs} />
      <ServiceSchema 
        name="Microsoft Dynamics 365 Sales – CRM för Säljteam"
        description={resolvePriceTokens("Molnbaserat CRM-system för moderna säljteam med inbyggd Copilot AI, förutsägande leadpoängsättning och sömlös Microsoft 365-integration. Licenspriser från {{price:sales-professional}}. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner.")}
      />
      <BreadcrumbSchema items={salesBreadcrumbs} />
      <Navbar />
      <main>
      
      {/* Header */}
      <ProductHero
        icon={SalesIcon}
        eyebrow="Dynamics 365 Sales"
        title="Dynamics 365 Sales."
        titleAccent="Behöver ni byta eller förbättra ert CRM, och är Sales rätt väg?"
        subhead={"Börja i säljorganisationens problem, inte i funktionslistan. Här får ni hjälp att bedöma behovet, jämföra alternativ, ta fram en kravbild och hitta partners som kan Dynamics\u00A0365 Sales."}
        primary={{ label: "Analysera vårt CRM-behov", to: "/d365sales/matchningstest/" }}
        secondary={{ label: "Bygg vårt beslutsunderlag", href: "#crm-beslutsunderlag", icon: FileText }}
        tertiary={{ label: "Hitta rätt Sales-partner", to: "/dynamics-365-crm-partners-sverige/" }}
      />

      <SystemvalHandoffNote page="sales" />
      <SalesDecisionGuide />
      <ShortAnswer title="Vad är Dynamics 365 Sales">
        <p>Dynamics 365 Sales är Microsofts moderna CRM för B2B-säljorganisationer som vill lyfta sitt sälj från magkänsla och spridda Excel-listor till en gemensam, datadriven affärsprocess.</p>
        <p>Plattformen samlar leads, kontakter, affärsmöjligheter, offerter, order och prognoser i en strukturerad pipeline där varje säljare ser sina viktigaste affärer, nästa-bästa-åtgärd och realtidsinsikter om kundens engagemang.</p>
        <p>Genom djup integration med Outlook, Teams, Excel, SharePoint och LinkedIn Sales Navigator arbetar säljaren kvar i sina vana verktyg samtidigt som all aktivitet automatiskt loggas i CRM:et – inga dubbla registreringar, ingen administrativ friktion.</p>
        <p>Inbyggd AI via Microsoft Copilot och nya autonoma säljagenter sammanfattar mejlkonversationer, förbereder mötesunderlag, föreslår rätt budskap baserat på affärsläge och kan till och med kvalificera inkommande leads och boka in möten på egen hand. Resultatet är mer kvalitativ säljtid, snabbare offertprocesser, bättre prognosprecision och en pipeline som faktiskt speglar verkligheten.</p>
        <p>Det blir riktigt vasst när partnern modellerar din specifika säljprocess, dina kvalificeringskriterier och dina nyckeltal – standardinstallationen ger sällan full effekt på egen hand, men rätt konfigurerad blir Dynamics 365 Sales motorn som skalar hela din säljorganisation.</p>
      </ShortAnswer>
      <BuyerFitSection fitKey="sales" />
      <EditorialAssessment assessment="sales" />


      {/* Video Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Se Dynamics 365 Sales i aktion
            </h2>
            <VideoCard
              title="Dynamics 365 Sales"
              description="Maximera dina försäljningsresultat med intelligent CRM"
              videoId="TMdY77b1TTg"
              uploadDate="2024-07-18"
            />
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              Vanliga frågor om Dynamics 365 Sales
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  Vad är skillnaden mellan Sales Professional och Sales Enterprise?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Sales Professional är grundlicensen som inkluderar lead- och affärshantering, kontakthantering och e-postintegration. Sales Enterprise lägger till avancerade funktioner som AI-drivna insikter via Copilot, förutsägande analys och anpassningsbara automatiseringsflöden. Enterprise passar bättre för organisationer som behöver djupare kundinsikter och mer avancerad säljstyrning.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  Hur fungerar AI och Copilot i Dynamics 365 Sales?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Microsoft Copilot i Dynamics 365 Sales analyserar kunddata och interaktioner för att ge säljarna realtidsrekommendationer. Det kan sammanfatta möten, föreslå nästa steg, identifiera risker i affärer och prioritera leads baserat på sannolikhet att konvertera. Copilot hjälper också till att skriva e-postmeddelanden och förbereda kundmöten.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  Kan Dynamics 365 Sales integreras med vårt befintliga ERP-system?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Ja, Dynamics 365 Sales kan integreras med de flesta ERP-system, både Microsofts egna (Business Central, Finance & Supply Chain Management (F&O)) och mängder av andra moderna ERP-system. Inbyggd integration med Business Central är enkel att konfigurera, medan integrationer med andra system ofta kräver anpassade lösningar via Power Platform eller standardkopplingar.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  Hur lång tid tar det att implementera Dynamics 365 Sales?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  En standardimplementering av Dynamics 365 Sales för 10-30 användare tar normalt 2-4 månader. Tiden kan variera beroende på om du har möjlighet att lägga den interna tiden som ofta krävs och om du har en god bild över hur du vill att säljprocessen skall se ut. Detta inkluderar grundkonfiguration, datamigrering, användarutbildning och integrationer. Större implementeringar för en större verksamhet och med mer omfattande anpassningar kan ta 6-12 månader eller mer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-8 sm:py-12 md:py-16 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={SalesIcon} alt="Dynamics 365 Sales" className="h-12 w-12" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Licenspriser
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {salesPricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
            Observera: Priserna ovan är exempelpriser baserade på Microsofts offentliga prislista vid tidpunkten för sammanställningen. För exakta och aktuella priser, inklusive eventuella rabatter eller volymavtal, rekommenderas att en offert tas fram i samråd med en auktoriserad Microsoft-partner eller direkt via Microsoft.
          </p>
        </div>
      </section>


      {/* Partners Section */}
      <BuyerManual product="sales" />
      <CostBreakdown product="sales" />
      <ComparisonQuickLinks productKeys="sales" />



      <ProductDeepDiveLink product="Dynamics 365 Sales" label="Sales" />


      <ProductIsvSection product="Sales" />

      <ApplicationPartners applicationFilter="Sales" pageSource="D365 Sales" />

      <div className="container mx-auto px-4 sm:px-6">
        <UnprofiledPartnersList variant="teaser" showSeeAllLink />
      </div>

      {/* Sekundärt: relaterat från Partnernytt, långt ned på sidan. */}
      <AktuelltContextSection placement="sales" heading="Aktuellt inom Dynamics 365 Sales" />
      <ProductPartnerNewsSection productArea="crm-sales" heading="Relaterat om Dynamics 365 Sales" />
      <RelatedPages pages={salesRelatedPages} heading="Utforska vidare" />
      <AiExamplesEntry apps={["sales"]} label={"Se hur AI förändrar arbetet i Dynamics\u00A0365 Sales"} source="d365sales" />
<PartnerSwitchCta />
      <ProductNextSteps product="sales" pageSource="D365 Sales" />
</main>
      <BasicProfilesDirectory products={["sales"]} />
      <SourcesAndMethod variant="product" />
      <EditorialSource sourceType="Köpguide" />
      <Footer />
    </div>
  );
};

export default D365Sales;
