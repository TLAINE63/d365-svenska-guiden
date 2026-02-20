import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import ApplicationPartners from "@/components/ApplicationPartners";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import MarketingIcon from "@/assets/icons/Marketing.svg";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

// Breadcrumb items
const marketingBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Marknad & Sälj", url: "https://d365.se/d365-sales" },
  { name: "Customer Insights (Marketing)", url: "https://d365.se/d365-marketing" },
];
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Customer Insights FAQs for schema
const customerInsightsFaqs = [
  { question: "Vad är skillnaden mellan Customer Insights och Dynamics 365 Marketing?", answer: "Customer Insights är den nya generationens marknadsföringsplattform som ersätter Marketing. Den kombinerar marknadsföringsautomation med avancerad kunddata-analys och AI-drivna insikter." },
  { question: "Hur fungerar kundresor i Customer Insights?", answer: "Kundresor är visuella flöden som definierar kommunikation baserat på kundbeteende. Du kan skapa triggers, definiera villkor och automatiskt skicka e-post, SMS eller push-notiser." },
  { question: "Kan Customer Insights integreras med Dynamics 365 Sales?", answer: "Ja, leads som genereras genom kampanjer överförs automatiskt till säljteamet med full historik och scoring. Säljare ser hela kundresan i Sales-appen." },
  { question: "Vad är skillnaden på licenserna?", answer: "Customer Insights-licensen är baserad på kontaktvolym. Attach-licensen ger rabatterat pris för kunder med minst 10 Dynamics 365-användarlicenser." },
];

const D365Marketing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Dynamics 365 Customer Insights | Priser & Implementering"
        description="Komplett guide till Microsoft Dynamics 365 Customer Insights (Marketing). Marknadsföringsautomation, kundresor och AI-drivna insikter."
        canonicalPath="/d365-marketing"
        keywords="Dynamics 365 Customer Insights, Marketing, marknadsföringsautomation, kundresor, leads, AI"
        ogImage="https://d365.se/og-marketing.png"
      />
      <FAQSchema faqs={customerInsightsFaqs} />
      <ServiceSchema 
        name="Dynamics 365 Customer Insights"
        description="Kraftfull marknadsföringsautomation för personliga kundresor, leadgenerering och AI-drivna kampanjer."
      />
      <BreadcrumbSchema items={marketingBreadcrumbs} />
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[350px] sm:h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2070" 
            alt="Marketing analytics and insights" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <img src={MarketingIcon} alt="Marketing" className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Dynamics 365 Customer Insights
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-4 sm:mb-6">
                Skapa personliga kundresor med avancerad marknadsföringsautomation och AI
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <ContactFormDialog>
                  <Button 
                    size="lg"
                    className="bg-marketing hover:bg-marketing/90 text-marketing-foreground w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl"
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
              Microsoft Dynamics 365 Customer Insights
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              Marknadsföringsautomation på nästa nivå
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              Dynamics 365 Customer Insights (tidigare Marketing) är en kraftfull plattform för marknadsföringsautomation som hjälper dig att skapa personliga kundresor, generera kvalificerade leads och mäta kampanjresultat i realtid.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Med inbyggd AI och dataanalys kan du segmentera din kundbas, skapa riktade kampanjer och följa upp varje interaktion för att maximera konvertering och kundengagemang.
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Se Dynamics 365 Customer Insights i aktion
            </h2>
            <VideoCard
              title="Dynamics 365 Customer Insights"
              description="Skapa personliga kundresor med Microsoft Dynamics 365 Customer Insights / Marketing Automation"
              videoId="41lG3EHo4Lw"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              Vanliga frågor om Customer Insights
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vad är skillnaden mellan Customer Insights och Dynamics 365 Marketing?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Dynamics 365 Customer Insights är den nya generationens marknadsföringsplattform som ersätter och utökar det tidigare Dynamics 365 Marketing. Den kombinerar marknadsföringsautomation med avancerad kunddata-analys och AI-drivna insikter för att ge en komplett bild av kundens resa.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur fungerar kundresor i Customer Insights?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Kundresor i Customer Insights är visuella flöden som definierar hur och när du kommunicerar med kunder baserat på deras beteende och attribut. Du kan skapa triggers som startar resan (t.ex. webbformulär), definiera villkor och grenar, och automatiskt skicka e-post, SMS eller push-notiser vid rätt tidpunkt.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Kan Customer Insights integreras med Dynamics 365 Sales?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Ja, Customer Insights har inbyggd integration med Dynamics 365 Sales. Leads som genereras genom marknadsföringskampanjer kan automatiskt överföras till säljteamet med full historik och scoring. Säljare kan se hela kundresan och alla marknadsinteraktioner direkt i Sales-appen.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vad är skillnaden på licenserna?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Customer Insights-licensen är baserad på kontaktvolym snarare än användare. Grundlicensen ger tillgång till alla funktioner för ett visst antal kontakter. "Attach"-licensen är tillgänglig för kunder som redan har minst 10 Dynamics 365-användarlicenser och ger rabatterat pris.
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
              <img src={MarketingIcon} alt="Marketing" className="h-12 w-12" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Licenspriser
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Baserat på kontaktvolym
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {customerInsightsPricing.map((plan, index) => (
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
                    En typisk implementation av Customer Insights tar <strong>2-4 månader</strong> beroende på komplexitet och datakällor.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande setup:</strong> 6-8 veckor</li>
                    <li>• <strong>Med kundresor och automatisering:</strong> 4-6 månader</li>
                    <li>• <strong>Komplett implementation:</strong> 6-10 månader</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">💰 Kostnad</h3>
                  <p className="text-muted-foreground mb-4">
                    Implementationskostnaden beror på antalet datakällor, segmenteringsbehov och kampanjkomplexitet.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande:</strong> 150 000 - 300 000 kr</li>
                    <li>• <strong>Med automatisering:</strong> 300 000 - 600 000 kr</li>
                    <li>• <strong>Komplett med integrationer:</strong> 600 000 - 1 200 000 kr</li>
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
      <ApplicationPartners applicationFilter="Customer Insights (Marketing)" pageSource="D365 Marketing" />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-marketing">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Redo att revolutionera din marknadsföring?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8">
            Boka en kostnadsfri rådgivning med oss så hjälper vi dig skapa personliga kundresor som konverterar.
          </p>
          <ContactFormDialog>
            <Button 
              size="lg"
              className="bg-white text-marketing hover:bg-white/90 text-base sm:text-lg h-14 sm:h-16 rounded-xl"
            >
              Boka en kostnadsfri rådgivning
            </Button>
          </ContactFormDialog>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default D365Marketing;
