import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import SalesIcon from "@/assets/icons/Sales.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import MarketingIcon from "@/assets/icons/Marketing.svg";
import ContactCenterIcon from "@/assets/icons/ContactCenter.svg";
import FieldServiceIcon from "@/assets/icons/FieldService.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CRM = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ceVideos = [
    {
      title: "Dynamics 365 Sales",
      description: "Maximera dina försäljningsresultat med intelligent CRM",
      videoId: "TMdY77b1TTg",
    },
    {
      title: "Customer Insights Automation",
      description: "Skapa personliga kundresor med Microsoft Dynamics 365 Customer Insights",
      videoId: "41lG3EHo4Lw",
    },
    {
      title: "Customer Service och Support",
      description: "Leverera exceptionell kundservice med AI-drivna insikter",
      videoId: "ewtCAkM55Fc",
    },
    {
      title: "Dynamics 365 Contact Center",
      description: "Modern och innovativ kontaktcenterlösning med Omnichannel, AI och automation",
      videoId: "MYl0lN5_-L8",
    },
    {
      title: "Dynamics 365 Field Service",
      description: "Optimera fältservice med intelligent schemaläggning och mobilitet",
      videoId: "OujvbnyGqDY",
    },
    {
      title: "Dynamics 365 Project Operations",
      description: "Hantera projekt effektivt från försäljning till leverans",
      videoId: "U4fj051TZ90",
    },
  ];

  const salesPricing = [
    {
      title: "Sales Professional",
      description: "För försäljningsteam",
      price: "718,30 kr",
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
      price: "1 160,30 kr",
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
      price: "1 657,60 kr",
      features: [
        "Allt i Enterprise",
        "Conversation Intelligence",
        "Relationship scoring",
        "Avancerad försäljningsanalys",
        "Försäljningsplanering",
      ],
    },
  ];

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

  const customerInsightsPricing = [
    {
      title: "Customer Insights",
      description: "Marknadsföringsautomation",
      price: "18 786,60 kr",
      features: [
        "E-postmarknadsföring",
        "Segmentering & målgrupper",
        "Triggers",
        "Leadgenerering",
        "Event management",
        "Kundresor",
      ],
    },
    {
      title: "Customer Insights Attach",
      description: "Tilläggslicens för befintliga användare",
      price: "11 050,90 kr",
      features: [
        "Alla Customer Insights-funktioner",
        "Kunder med minst 10 Dynamics 365-användarlicenser",
      ],
    },
  ];

  const contactCenterPricing = [
    {
      title: "Contact Center",
      description: "Modern kontaktcenterlösning",
      price: "Från 1 215,60 kr",
      features: [
        "Omnichannel-stöd (telefon, chatt, e-post)",
        "AI-driven samtalsassistent",
        "Real-time analytics",
        "Intelligent routing",
        "Integration med Teams",
      ],
    },
  ];

  const fieldServicePricing = [
    {
      title: "Field Service",
      description: "Fältservicehantering",
      price: "1 160,30 kr",
      features: [
        "Schemaläggning och resursoptimering",
        "Mobil arbetsorder-app",
        "IoT-integration",
        "Lagerhantering",
        "Kundsignatur och fakturering",
      ],
    },
  ];

  const projectOperationsPricing = [
    {
      title: "Project Operations",
      description: "Projekthantering och resursplanering",
      price: "1 491,90 kr",
      features: [
        "Projektplanering och resurshantering",
        "Tid- och kostnadsuppföljning",
        "Fakturering och intäktshantering",
        "Integration med Finance",
        "AI-drivna projektinsikter",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[350px] sm:h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070" 
            alt="Team collaboration and CRM" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                <img src={SalesIcon} alt="Sales" className="h-8 w-8 sm:h-10 sm:w-10" />
                <img src={MarketingIcon} alt="Customer Insights" className="h-8 w-8 sm:h-10 sm:w-10" />
                <img src={CustomerServiceIcon} alt="Customer Service" className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                CRM (Customer Engagement)
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-4 sm:mb-6">
                Microsoft Dynamics 365 Sales, Customer Insights/Marketing, Customer Service, Contact Center, Field Service, Project Operations m.m.
              </p>
              
              <ContactFormDialog>
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl"
                >
                  Boka gratis rådgivning
                </Button>
              </ContactFormDialog>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Microsoft Dynamics 365 Customer Engagement
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              För smartare kundrelationer
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground mb-4 sm:mb-6">
              Skapa starkare kundupplevelser och effektivare service – allt i en integrerad plattform.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Microsoft Dynamics 365 Customer Engagement är en samling intelligenta affärsapplikationer som hjälper företag att bygga långsiktiga kundrelationer och leverera förstklassig service. Lösningen kombinerar CRM och kundtjänst i en modern, molnbaserad plattform.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              Vanliga frågor om Dynamics 365 Customer Engagement
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vad är Dynamics 365 Customer Engagement och vad ingår i det?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Dynamics 365 Customer Engagement är en samling intelligenta affärsapplikationer som hjälper företag att hantera sina kundrelationer. Det inkluderar lösningar för försäljning (Sales), kundservice (Customer Service), marknadsföring (Customer Insights), kontaktcenter (Contact Center), fältservice (Field Service) och projektstyrning (Project Operations). Alla applikationer integreras sömlöst och ger en helhetsbild av varje kund.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Hur skiljer sig Dynamics 365 CE från andra CRM-system?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Dynamics 365 CE sticker ut genom sin djupa integration med Microsoft-ekosystemet (Office 365, Teams, Outlook), kraftfulla AI-funktioner via Copilot, flexibel anpassning utan omfattande programmering, samt möjligheten att kombinera CRM med ERP (Business Central eller Finance & Supply Chain) för en komplett affärslösning. Systemet är också byggt för att växa med din verksamhet – från små team till globala organisationer.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Hur mycket kostar Dynamics 365 Customer Engagement – och vad påverkar priset?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Kostnaden varierar beroende på vilka applikationer ni väljer och hur många användare ni har. Licenspriser börjar från ca 500 kr/användare/månad för Customer Service Professional och går upp till 1 500 kr/månad för Sales Premium. Till detta kommer implementeringskostnader (100-250 tkr för en applikation, upp till 800 tkr-2M kr för en komplett lösning) samt löpande support och anpassningar. Vi hjälper er att hitta rätt paket för era behov och budget.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Hur snabbt kan vi komma igång med Dynamics 365 CE?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Implementeringstiden varierar beroende på omfattning och komplexitet. För en standardimplementering av en enskild applikation (t.ex. Sales) kan ni vara igång på 2-3 månader. Större implementeringar med flera applikationer och omfattande anpassningar tar normalt 4-6 månader. Vi börjar alltid med en noggrann kravanalys för att säkerställa att lösningen möter era verkliga behov.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Hur anpassningsbart är systemet för vår verksamhet?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Dynamics 365 CE är mycket flexibelt och kan anpassas till de flesta branscher och affärsprocesser. Via Power Platform kan ni bygga egna arbetsflöden, formulär och rapporter utan omfattande programmering. Systemet stödjer också branschspecifika lösningar för bland annat tillverkning, detaljhandel, hälsovård och professionella tjänster. Vi hjälper er att konfigurera systemet så att det passar era unika processer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CRM Videos Section */}
      <section id="videos" className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Videoguider
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Upptäck hur Dynamics 365 CRM kan transformera din kundhantering
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ceVideos.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Costs Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Implementationspriser för CRM
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Vad kostar det att implementera Dynamics 365 Customer Engagement?
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VideoCard
              title="CRM-projekt: Kostnader och Genomförande"
              description="En ärlig genomgång av vad det kostar att implementera CRM"
              videoId=""
            />
            <p className="text-center text-sm text-muted-foreground mt-4 italic">
              Lägg in ditt YouTube video-ID för att visa videon
            </p>
          </div>
        </div>
      </section>

      {/* Project Cost Section */}
      <section id="project-cost" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Vad kostar ett CRM-projekt?
              </h2>
              <p className="text-lg text-muted-foreground">
                Kostnaden för ett CRM-projekt med Microsoft Dynamics 365 Customer Engagement (CE) varierar självklart beroende på vilken av applikationerna det gäller, verksamhetens behov, antal användare och graden av anpassning. Nedan är några exempel på implementeringskostnader
              </p>
            </div>
            
            <div className="grid gap-8">
              {/* Implementation Costs */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-6">Implementeringskostnader</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start pb-3 border-b border-border">
                    <div>
                      <p className="font-semibold text-card-foreground">Dynamics 365 Sales Enterprise för 10-30 användare</p>
                      <p className="text-sm text-muted-foreground">Enklare "standard"-konfiguration med några mindre kundanpassningar, utbildning, projektledning, grundmigrering.</p>
                    </div>
                    <p className="text-primary font-bold">100-250 tkr</p>
                  </div>
                  
                  <div className="flex justify-between items-start pb-3 border-b border-border">
                    <div>
                      <p className="font-semibold text-card-foreground">Integrationer mellan Dynamics 365 Sales och exempelvis ett ERP system (inte Business Central)</p>
                    </div>
                    <p className="text-primary font-bold">100-200 tkr</p>
                  </div>
                  
                  <div className="flex justify-between items-start pb-3">
                    <div>
                      <p className="font-semibold text-card-foreground">Dynamics 365 Customer Insights</p>
                      <p className="text-sm text-muted-foreground">Installation, utbildning, användarstöd, skapande av mallar m.m.</p>
                    </div>
                    <p className="text-primary font-bold">100-200 tkr</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Ovan är bara några projektexempel och kan variera mycket beroende på bransch, verksamhet, omfattning och behov
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* License Pricing Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Licenspriser för CRM-lösningar
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Förstå de olika licensmodellerna för Sales, Customer Service, Customer Insights och mer
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VideoCard
              title="CRM Licenspriser: En Komplett Guide"
              description="Vilka licenser finns och vad passar för er organisation?"
              videoId=""
            />
            <p className="text-center text-sm text-muted-foreground mt-4 italic">
              Lägg in ditt YouTube video-ID för att visa videon
            </p>
          </div>
        </div>
      </section>

      {/* Sales Pricing */}
      <section id="pricing" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={SalesIcon} alt="Sales" className="h-12 w-12" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dynamics 365 Sales
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {salesPricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
            Observera: Priserna ovan är exempelpriser baserade på Microsofts offentliga prislista vid tidpunkten för sammanställningen. För exakta och aktuella priser, inklusive eventuella rabatter eller volymavtal, rekommenderas att en offert tas fram i samråd med en auktoriserad Microsoft-partner eller direkt via Microsoft.
          </p>
        </div>
      </section>

      {/* Customer Insights Pricing */}
      <section id="customer-insights-pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={MarketingIcon} alt="Customer Insights" className="h-12 w-12" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dynamics 365 Customer Insights
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Baserat på kontaktvolym
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {customerInsightsPricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
            Observera: Priserna ovan är exempelpriser baserade på Microsofts offentliga prislista vid tidpunkten för sammanställningen. För exakta och aktuella priser, inklusive eventuella rabatter eller volymavtal, rekommenderas att en offert tas fram i samråd med en auktoriserad Microsoft-partner eller direkt via Microsoft.
          </p>
        </div>
      </section>

      {/* Customer Service Pricing */}
      <section id="service-pricing" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={CustomerServiceIcon} alt="Customer Service" className="h-12 w-12" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dynamics 365 Customer Service
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {servicePricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
            Observera: Priserna ovan är exempelpriser baserade på Microsofts offentliga prislista vid tidpunkten för sammanställningen. För exakta och aktuella priser, inklusive eventuella rabatter eller volymavtal, rekommenderas att en offert tas fram i samråd med en auktoriserad Microsoft-partner eller direkt via Microsoft.
          </p>
        </div>
      </section>

      {/* Contact Center Pricing */}
      <section id="contact-center-pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={ContactCenterIcon} alt="Contact Center" className="h-12 w-12" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dynamics 365 Contact Center
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            {contactCenterPricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
            Observera: Priserna ovan är exempelpriser baserade på Microsofts offentliga prislista vid tidpunkten för sammanställningen. För exakta och aktuella priser, inklusive eventuella rabatter eller volymavtal, rekommenderas att en offert tas fram i samråd med en auktoriserad Microsoft-partner eller direkt via Microsoft.
          </p>
        </div>
      </section>

      {/* Field Service Pricing */}
      <section id="field-service-pricing" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img src={FieldServiceIcon} alt="Field Service" className="h-12 w-12" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Dynamics 365 Field Service
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            {fieldServicePricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
            Observera: Priserna ovan är exempelpriser baserade på Microsofts offentliga prislista vid tidpunkten för sammanställningen. För exakta och aktuella priser, inklusive eventuella rabatter eller volymavtal, rekommenderas att en offert tas fram i samråd med en auktoriserad Microsoft-partner eller direkt via Microsoft.
          </p>
        </div>
      </section>

      {/* Project Operations Pricing */}
      <section id="project-operations-pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Dynamics 365 Project Operations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            {projectOperationsPricing.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
            Observera: Priserna ovan är exempelpriser baserade på Microsofts offentliga prislista vid tidpunkten för sammanställningen. För exakta och aktuella priser, inklusive eventuella rabatter eller volymavtal, rekommenderas att en offert tas fram i samråd med en auktoriserad Microsoft-partner eller direkt via Microsoft.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Redo att förbättra din kundhantering?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kontakta oss för en kostnadsfri konsultation
            </p>
            <ContactFormDialog>
              <Button className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0 h-14 sm:h-16 rounded-xl" size="lg">
                Boka Gratis Konsultation
              </Button>
            </ContactFormDialog>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CRM;
