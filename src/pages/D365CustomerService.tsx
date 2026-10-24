import SystemvalHandoffNote from "@/components/SystemvalHandoffNote";
import PartnerSwitchCta from "@/components/PartnerSwitchCta";
import ServiceDecisionGuide, { trackServiceJourney } from "@/components/product/ServiceDecisionGuide";
import AiExamplesEntry from "@/components/ai-examples/AiExamplesEntry";
import ProductNextSteps from "@/components/product/ProductNextSteps";
import SourcesAndMethod from "@/components/SourcesAndMethod";
import EditorialAssessment from "@/components/EditorialAssessment";
import BuyerFitSection from "@/components/BuyerFitSection";
import BasicProfilesDirectory from "@/components/BasicProfilesDirectory";
import EditorialSource from "@/components/EditorialSource";
import ProductIsvSection from "@/components/ProductIsvSection";
import ProductDeepDiveLink from "@/components/ProductDeepDiveLink";
import ProductHero from "@/components/ProductHero";
import RelatedPages, { customerServiceRelatedPages } from "@/components/RelatedPages";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import ShortAnswer from "@/components/ShortAnswer";
import Footer from "@/components/Footer";
import ProductPartnerNewsSection from "@/components/ProductPartnerNewsSection";
import AktuelltContextSection from "@/components/aktuellt/AktuelltContextSection";
import ApplicationPartners from "@/components/ApplicationPartners";
import CostBreakdown from "@/components/CostBreakdown";
import { FileText, LifeBuoy } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

// Breadcrumb items
const customerServiceBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Kundservice", url: "https://d365.se/d365customerservice" },
  { name: "Dynamics 365 Customer Service", url: "https://d365.se/d365customerservice" },
];
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Customer Service FAQs for schema
const customerServiceFaqs = [
  { question: "Vad kostar Dynamics 365 Customer Service?", answer: "Dynamics 365 Customer Service finns i två licensnivåer: Professional kostar 478 kr/kundservicemedarbetare/mån och Enterprise kostar 1 004 kr/mån. Enterprise inkluderar Copilot AI, omnikanalstöd och avancerad analys. Implementeringskostnad för ett standardprojekt ligger typiskt på 150 000–400 000 kr." },
  { question: "Vad är Dynamics 365 Customer Service och hur används det?", answer: "Microsoft Dynamics 365 Customer Service är ett molnbaserat ärendehanteringssystem (helpdesk/kundservice-system) för kundservicemedarbetare. Det samlar ärenden från alla kanaler – e-post, chatt, telefon, sociala medier och portal – i ett enhetligt gränssnitt med inbyggd AI via Microsoft Copilot." },
  { question: "Är Dynamics 365 Customer Service ett bra helpdesk-system för Microsoft-miljöer?", answer: "Ja, Dynamics 365 Customer Service är Microsofts egna helpdesk och kundserviceplattform och integreras nativt med Microsoft 365 (Outlook, Teams), Azure och Power Platform. Det är ett ledande alternativ till Zendesk och ServiceNow för organisationer som redan använder Microsoft-ekosystemet." },
  { question: "Vad är skillnaden mellan Customer Service Professional och Enterprise?", answer: "Professional (478 kr/mån) inkluderar ärendehantering, kunskapsdatabas och SLA-hantering via e-post och chatt. Enterprise (1 004 kr/mån) lägger till Copilot AI, multisessions-gränssnitt, omnikanalstöd (telefon, SMS, sociala medier), enhetlig dirigering, avancerad analys och kundsjälvbetjäningsportaler." },
  { question: "Hur fungerar Microsoft Copilot i Dynamics 365 Customer Service?", answer: "Copilot i Customer Service analyserar kundärenden och föreslår automatiskt lösningar från kunskapsdatabasen, sammanfattar konversationshistorik, ger realtidscoaching till kundservicemedarbetare och kan generera svarsutkast. Det minskar genomsnittlig hanteringstid (AHT) och förbättrar kundnöjdhet (CSAT)." },
  { question: "Vilka kanaler stöds i Dynamics 365 Customer Service?", answer: "Dynamics 365 Customer Service stöder ärendehantering via e-post och chatt i Professional-planen. Med Enterprise-planen och Omnichannel-tillägget tillkommer telefoni, SMS, WhatsApp, Facebook Messenger och Twitter/X – allt samordnat i ett enhetligt agentkokpit." },
  { question: "Kan vi skapa självbetjäningsportaler med Dynamics 365 Customer Service?", answer: "Ja, med Enterprise-licensen kan du bygga kundportaler via Power Pages där kunder kan logga in, följa sina ärenden, söka i kunskapsdatabasen och skapa nya supportärenden – vilket minskar behovet av direktkontakt med kundservicemedarbetare." },
  { question: "Hur lång tid tar det att implementera Dynamics 365 Customer Service?", answer: "En standardimplementering med ärendehantering och e-postkanal tar 2–4 månader. Fullständig omnikanalimplementering med telefoni, Copilot och portaler tar 4–8 månader. En erfaren Microsoft-partner är avgörande för att säkerställa korrekt konfiguration och adoption bland kundservicemedarbetare." },
];

const D365CustomerService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const servicePricing = [
    {
      title: "Customer Service Professional",
      description: "Grundläggande kundservice",
      price: "477,90 kr",
      features: [
        "Ärendehantering",
        "Kunskapsdatabas",
        "Service Level Agreements (SLA)",
        "E-post och chatt",
      ],
    },
    {
      title: "Customer Service Enterprise",
      description: "Avancerad kundservice",
      price: "1 003,70 kr",
      features: [
        "Allt i Professional",
        "Copilot",
        "Inbäddad intelligens",
        "Stöd för flera sessioner",
        "Enhetlig dirigering",
        "Analyser och KPI-rapporter",
        "Prognostisering och schemaläggning",
        "Portaler",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Dynamics 365 Customer Service – pris & partners"
        description="Dynamics 365 Customer Service för ärenden och omnikanal (e-post, chatt, telefon): pris från 478 kr/mån, Copilot och svenska partners att jämföra."
        canonicalPath="/d365customerservice"
        keywords="Dynamics 365 Customer Service pris, helpdesk system Microsoft, kundservice system, ärendehantering system, Microsoft helpdesk, Dynamics 365 Customer Service Enterprise, CRM kundservice, omnichannel kundservice, Zendesk alternativ Microsoft, kundservice AI Copilot Sverige"
        ogImage="https://d365.se/og-customer-service.png"
        ogImageAlt="Dynamics 365 Customer Service – köpguide på d365.se"
      />
      <FAQSchema faqs={customerServiceFaqs} />
      <ServiceSchema 
        name="Microsoft Dynamics 365 Customer Service – Helpdesk & Ärendehantering"
        description="Molnbaserat kundservicesystem och helpdesk med inbyggd Copilot AI, omnikanalstöd (e-post, chatt, telefon, SMS) och självbetjäningsportaler. Licenspriser från 478 kr/kundservicemedarbetare/mån."
      />
      <BreadcrumbSchema items={customerServiceBreadcrumbs} />
      <Navbar />
      <main>
      
      {/* Header */}
      <ProductHero
        icon={CustomerServiceIcon}
        eyebrow="Dynamics 365 Customer Service"
        title="Dynamics 365 Customer Service"
        titleAccent="Vilket stöd behöver er kundservice?"
        subhead="Börja med era ärenden, kanaler och kundernas behov. Bedöm om Customer Service passar, jämför alternativ och ta fram krav och kostnadsbild innan ni undersöker partners."
        primary={{ label: "Analysera vårt behov", to: "/d365customerservice/matchningstest/", onClick: () => trackServiceJourney("assess", "/d365customerservice/matchningstest/", "hero") }}
        secondary={{ label: "Bygg vårt beslutsunderlag", href: "#service-beslutsunderlag", icon: FileText }}
        tertiary={{ label: "Hitta rätt Customer Service-partner", href: "#partners" }}
      />
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 mt-6">
        <aside aria-label="Support för befintligt system" className="flex gap-3 rounded-lg border border-border bg-secondary/40 p-4 text-sm leading-relaxed text-muted-foreground">
          <LifeBuoy className="h-5 w-5 shrink-0 text-accent mt-0.5" aria-hidden />
          <p>
            Letar du efter teknisk användarsupport eller förvaltningsavtal för ditt befintliga{" "}
            <span className="whitespace-nowrap">Dynamics{"\u00A0"}365</span>-system? Den här sidan beskriver modulen{" "}
            <span className="whitespace-nowrap">Microsoft Dynamics{"\u00A0"}365</span> Customer Service.{" "}
            <Link to="/guider/dynamics-365-support-forvaltning/" className="font-semibold text-foreground underline underline-offset-4 hover:text-accent">
              Läs vår guide för <span className="whitespace-nowrap">Dynamics{"\u00A0"}365</span> support och förvaltning här
            </Link>.
          </p>
        </aside>
      </div>
      <SystemvalHandoffNote page="cs" />
      <ServiceDecisionGuide />

      <ShortAnswer title="Vad är Dynamics 365 Customer Service">
        <p>
          Dynamics 365 Customer Service är Microsofts plattform för kundservice och support. Den samlar kundärenden, historik, kunskapsbas och uppföljning av serviceåtaganden så att handläggare kan arbeta med samma information.
        </p>
        <p>
          Behov av telefoni, fler kanaler och självservice ska bedömas tillsammans med ärendeflödet. Kontrollera vilka licenser, tillägg och integrationer som behövs för just er lösning, i stället för att utgå från att allt ingår. Copilot och automatisering behöver tillförlitlig information och tydliga kontrollpunkter.
        </p>
      </ShortAnswer>
      <BuyerFitSection fitKey="service" />
      <EditorialAssessment assessment="service" />


      {/* Video Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Se Dynamics 365 Customer Service i aktion
            </h2>
            <VideoCard
              title="Customer Service och Support"
              description="Leverera exceptionell kundservice med AI-drivna insikter"
              videoId="ewtCAkM55Fc"
              uploadDate="2025-02-06"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              Vanliga frågor om Dynamics 365 Customer Service
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vad är skillnaden mellan Professional och Enterprise?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 space-y-4">
                  <p><strong className="text-foreground">Professional</strong> inkluderar grundläggande funktioner:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Ärendehantering</li>
                    <li>Kunskapsdatabas</li>
                    <li>SLA-hantering</li>
                  </ul>
                  <div className="bg-customer-service/10 rounded-lg p-4 mt-4">
                    <p className="font-semibold text-foreground mb-2">🚀 Enterprise lägger till:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong className="text-foreground">Microsoft Copilot</strong> – AI-stöd för agenter</li>
                      <li><strong className="text-foreground">Multisessions-stöd</strong> – Hantera flera ärenden samtidigt</li>
                      <li><strong className="text-foreground">Enhetlig dirigering</strong> – Smart ärendetilldelning</li>
                      <li><strong className="text-foreground">Avancerad analys</strong> – Djupgående rapportering</li>
                      <li><strong className="text-foreground">Kundportaler</strong> – Självbetjäning för kunder</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur fungerar Copilot i Customer Service?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 space-y-4">
                  <p>Microsoft Copilot hjälper agenter genom att:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong className="text-foreground">Analysera kundärenden</strong> och föreslå relevanta lösningar från kunskapsdatabasen</li>
                    <li><strong className="text-foreground">Sammanfatta konversationer</strong> automatiskt för snabbare överblick</li>
                    <li><strong className="text-foreground">Föreslå svar</strong> på kundförfrågningar baserat på tidigare lösningar</li>
                    <li><strong className="text-foreground">Ge realtidscoaching</strong> för att förbättra kundinteraktioner</li>
                  </ul>
                  <div className="bg-secondary/50 rounded-lg p-4 mt-4">
                    <p className="text-sm italic">💡 Copilot lär sig kontinuerligt från framgångsrika lösningar för att bli ännu bättre över tid.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vilka kanaler stöds för kundkommunikation?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 space-y-4">
                  <p>Dynamics 365 Customer Service stöder kommunikation via:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>📧 E-post</li>
                    <li>💬 Chatt</li>
                    <li>📞 Telefon</li>
                    <li>📱 SMS</li>
                    <li>🌐 Sociala medier</li>
                  </ul>
                  <div className="bg-customer-service/10 rounded-lg p-4 mt-4">
                    <p className="font-semibold text-foreground mb-2">🔄 Enterprise Omnichannel:</p>
                    <p>Samlar alla kanaler i ett enhetligt gränssnitt så att agenter kan hantera alla kundinteraktioner från samma ställe.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Kan vi skapa självbetjäningsportaler för kunder?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 space-y-4">
                  <p>Ja, med <strong className="text-foreground">Enterprise-licensen</strong> kan du skapa kundportaler där kunder kan:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Logga in och se sina pågående ärenden</li>
                    <li>Söka i kunskapsdatabasen för snabba svar</li>
                    <li>Skapa nya supportärenden</li>
                  </ul>
                  <div className="bg-secondary/50 rounded-lg p-4 mt-4">
                    <p className="text-sm italic">✅ Detta minskar belastningen på supportteamet och ger kunderna möjlighet att lösa enklare problem själva.</p>
                  </div>
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
              <img src={CustomerServiceIcon} alt="Customer Service" className="h-12 w-12" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Licenspriser
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {servicePricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
            Observera: Priserna ovan är exempelpriser baserade på Microsofts offentliga prislista vid tidpunkten för sammanställningen. För exakta och aktuella priser, inklusive eventuella rabatter eller volymavtal, rekommenderas att en offert tas fram i samråd med en auktoriserad Microsoft-partner eller direkt via Microsoft.
          </p>
        </div>
      </section>

      <CostBreakdown product="customer-service" />


      <ProductDeepDiveLink product="Dynamics 365 Customer Service" label="Customer Service" />




      <ProductIsvSection product="Customer Service" />
      <ApplicationPartners applicationFilter="Customer Service" pageSource="D365 Customer Service" />

      {/* Sekundärt: relaterat från Partnernytt, långt ned på sidan. */}
      <AktuelltContextSection placement="customerService" heading="Aktuellt inom Customer Service" />
      <ProductPartnerNewsSection productArea="crm-service" heading="Relaterat om Customer Service" />
      <RelatedPages pages={customerServiceRelatedPages} heading="Utforska vidare" />

      

</main>
      <BasicProfilesDirectory products={["service"]} />
      <AiExamplesEntry apps={["service"]} label={"Se hur AI förändrar arbetet i Customer Service"} source="d365customerservice" />
      <ProductNextSteps product="customer-service" pageSource="D365 Customer Service" />
      <PartnerSwitchCta />
      <SourcesAndMethod variant="product" />
      <EditorialSource sourceType="Köpguide" />
      <Footer />
    </div>
  );
};

export default D365CustomerService;
