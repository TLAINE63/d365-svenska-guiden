import RelatedPages, { customerServiceRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import ApplicationPartners from "@/components/ApplicationPartners";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

// Breadcrumb items
const customerServiceBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Kundservice", url: "https://d365.se/d365-customer-service" },
  { name: "Dynamics 365 Customer Service", url: "https://d365.se/d365-customer-service" },
];
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Customer Service FAQs for schema
const customerServiceFaqs = [
  { question: "Vad kostar Dynamics 365 Customer Service?", answer: "Dynamics 365 Customer Service finns i två licensnivåer: Professional kostar 553 kr/kundservicemedarbetare/mån och Enterprise kostar 1 160 kr/mån. Enterprise inkluderar Copilot AI, omnikanalstöd och avancerad analys. Implementeringskostnad för ett standardprojekt ligger typiskt på 150 000–400 000 kr." },
  { question: "Vad är Dynamics 365 Customer Service och hur används det?", answer: "Microsoft Dynamics 365 Customer Service är ett molnbaserat ärendehanteringssystem (helpdesk/kundservice-system) för kundservicemedarbetare. Det samlar ärenden från alla kanaler – e-post, chatt, telefon, sociala medier och portal – i ett enhetligt gränssnitt med inbyggd AI via Microsoft Copilot." },
  { question: "Är Dynamics 365 Customer Service ett bra helpdesk-system för Microsoft-miljöer?", answer: "Ja, Dynamics 365 Customer Service är Microsofts egna helpdesk och kundserviceplattform och integreras nativt med Microsoft 365 (Outlook, Teams), Azure och Power Platform. Det är ett ledande alternativ till Zendesk och ServiceNow för organisationer som redan använder Microsoft-ekosystemet." },
  { question: "Vad är skillnaden mellan Customer Service Professional och Enterprise?", answer: "Professional (553 kr/mån) inkluderar ärendehantering, kunskapsdatabas och SLA-hantering via e-post och chatt. Enterprise (1 160 kr/mån) lägger till Copilot AI, multisessions-gränssnitt, omnikanalstöd (telefon, SMS, sociala medier), enhetlig dirigering, avancerad analys och kundsjälvbetjäningsportaler." },
  { question: "Hur fungerar Microsoft Copilot i Dynamics 365 Customer Service?", answer: "Copilot i Customer Service analyserar kundärenden och föreslår automatiskt lösningar från kunskapsdatabasen, sammanfattar konversationshistorik, ger realtidscoaching till kundservicemedarbetare och kan generera svarsutkast. Det minskar genomsnittlig hanteringstid (AHT) och förbättrar kundnöjdhet (CSAT)." },
  { question: "Vilka kanaler stöds i Dynamics 365 Customer Service?", answer: "Dynamics 365 Customer Service stöder ärendehantering via e-post och chatt i Professional-planen. Med Enterprise-planen och Omnichannel-tillägget tillkommer telefoni, SMS, WhatsApp, Facebook Messenger och Twitter/X – allt samordnat i ett enhetligt agentkokpit." },
  { question: "Kan vi skapa självbetjäningsportaler med Dynamics 365 Customer Service?", answer: "Ja, med Enterprise-licensen kan du bygga kundportaler via Power Pages där kunder kan logga in, följa sina ärenden, söka i kunskapsdatabasen och skapa nya supportärenden – vilket minskar behovet av direktkontakt med kundservicemedarbetare." },
  { question: "Hur lång tid tar det att implementera Dynamics 365 Customer Service?", answer: "En standardimplementering med ärendehantering och e-postkanal tar 2–4 månader. Fullständig omnikanalimplementering med telefoni, Copilot och portaler tar 4–8 månader. En erfaren Microsoft-partner är avgörande för att säkerställa korrekt konfiguration och adoption bland kundservicemedarbetare." },
];

const D365CustomerService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const servicePricing = [
    {
      title: "Customer Service Professional",
      description: "Grundläggande kundservice",
      price: "552,50 kr",
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
      price: "1 160,30 kr",
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
        title="Dynamics 365 Customer Service – Helpdesk & Ärendehantering | Priser | d365.se"
        description="Guide till Microsoft Dynamics 365 Customer Service – molnbaserat helpdesk och kundservicesystem. Priser från 553 kr/mån, Copilot AI inbyggt, omnikanalstöd. Hitta certifierad partner i Sverige."
        canonicalPath="/d365-customer-service"
        keywords="Dynamics 365 Customer Service pris, helpdesk system Microsoft, kundservice system, ärendehantering system, Microsoft helpdesk, Dynamics 365 Customer Service Enterprise, CRM kundservice, omnichannel kundservice, Zendesk alternativ Microsoft, kundservice AI Copilot Sverige"
        ogImage="https://d365.se/og-customer-service.png"
      />
      <FAQSchema faqs={customerServiceFaqs} />
      <ServiceSchema 
        name="Microsoft Dynamics 365 Customer Service – Helpdesk & Ärendehantering"
        description="Molnbaserat kundservicesystem och helpdesk med inbyggd Copilot AI, omnikanalstöd (e-post, chatt, telefon, SMS) och självbetjäningsportaler. Licenspriser från 553 kr/kundservicemedarbetare/mån."
      />
      <BreadcrumbSchema items={customerServiceBreadcrumbs} />
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[350px] sm:h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2070" 
            alt="Customer service representative" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <img src={CustomerServiceIcon} alt="Customer Service" className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Dynamics 365 Customer Service
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-4 sm:mb-6">
                Leverera exceptionell kundservice med AI-drivna insikter och intelligenta verktyg
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <ContactFormDialog>
                  <Button 
                    size="lg"
                    className="bg-customer-service hover:bg-customer-service/90 text-customer-service-foreground w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl"
                  >
                    Boka en kostnadsfri rådgivning
                  </Button>
                </ContactFormDialog>
                <Button 
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl"
                  onClick={() => document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Hitta rätt partner
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Microsoft Dynamics 365 Customer Service
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              Intelligent ärendehantering för nöjdare kunder
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              Dynamics 365 Customer Service ger ditt supportteam verktyg för att hantera kundärenden effektivt, bygga upp en omfattande kunskapsdatabas och leverera konsekvent service oavsett kanal.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Med AI-drivna funktioner som Microsoft Copilot får dina agenter realtidshjälp med att hitta rätt information, formulera svar och lösa ärenden snabbare – vilket leder till högre kundnöjdhet och lägre kostnader.
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Se Dynamics 365 Customer Service i aktion
            </h2>
            <VideoCard
              title="Customer Service och Support"
              description="Leverera exceptionell kundservice med AI-drivna insikter"
              videoId="ewtCAkM55Fc"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              Vanliga frågor om Dynamics 365 Customer Service
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
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

              <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
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

              <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vilka kanaler stöds för kundkommunikation?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 space-y-4">
                  <p>Dynamics 365 Customer Service stöder kommunikation via:</p>
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

              <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
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
      <section id="pricing" className="py-12 sm:py-16 md:py-20 bg-secondary/50">
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

      {/* Implementation Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Hur lång tid tar en implementation och vad ligger kostnaden på?
            </h2>
            <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-[var(--shadow-card)]">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">⏱️ Tidsåtgång</h3>
                  <p className="text-muted-foreground mb-4">
                    En typisk implementation av Customer Service tar <strong>2-4 månader</strong> beroende på ärendevolym och kanaler.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande ärendehantering:</strong> 6-10 veckor</li>
                    <li>• <strong>Med kunskapsbas och portal:</strong> 4-6 månader</li>
                    <li>• <strong>Omnikanal implementation:</strong> 8-12 månader</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">💰 Kostnad</h3>
                  <p className="text-muted-foreground mb-4">
                    Implementationskostnaden beror på antal supportagenter, kanaler och integrationsbehov.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande:</strong> 150 000 - 350 000 kr</li>
                    <li>• <strong>Med kunskapsbas:</strong> 350 000 - 700 000 kr</li>
                    <li>• <strong>Komplett omnikanal:</strong> 700 000 - 1 500 000 kr</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-6 italic">
                * Priserna är uppskattningar och varierar beroende på partner, omfattning och specifika krav. Kontakta en partner för en exakt offert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <ApplicationPartners applicationFilter="Customer Service" pageSource="D365 Customer Service" />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-customer-service">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Redo att förbättra din kundservice?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8">
            Boka en kostnadsfri rådgivning med oss så hjälper vi dig skapa en kundservicetlösning som överträffar förväntningar.
          </p>
          <ContactFormDialog>
            <Button 
              size="lg"
              className="bg-white text-customer-service hover:bg-white/90 text-base sm:text-lg h-14 sm:h-16 rounded-xl"
            >
              Boka en kostnadsfri rådgivning
            </Button>
          </ContactFormDialog>
        </div>
      </section>

      <RelatedPages pages={customerServiceRelatedPages} heading="Utforska vidare" />
      <Footer />
    </div>
  );
};

export default D365CustomerService;
