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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
                    className="bg-crm hover:bg-crm/90 text-crm-foreground w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl"
                  >
                    Boka gratis rådgivning
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
                <AccordionContent className="text-muted-foreground pb-6">
                  Professional-licensen inkluderar grundläggande ärendehantering, kunskapsdatabas och SLA-hantering. Enterprise-licensen lägger till avancerade funktioner som Microsoft Copilot för AI-stöd, multisessions-stöd för att hantera flera ärenden samtidigt, enhetlig dirigering för smart ärendetilldelning, avancerad analys och kundportaler.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Hur fungerar Copilot i Customer Service?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Microsoft Copilot i Customer Service hjälper agenter genom att analysera kundärenden och föreslå relevanta lösningar från kunskapsdatabasen. Det kan automatiskt sammanfatta långa konversationer, föreslå svar på kundförfrågningar och ge realtidscoaching för att förbättra interaktioner. Copilot lär sig kontinuerligt från framgångsrika lösningar för att bli ännu bättre.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Vilka kanaler stöds för kundkommunikation?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Dynamics 365 Customer Service stöder kommunikation via e-post, chatt, telefon, SMS och sociala medier. Med Enterprise-licensen får du tillgång till omnichannel-funktioner som samlar alla kanaler i ett enhetligt gränssnitt så att agenter kan hantera alla kundinteraktioner från samma ställe.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Kan vi skapa självbetjäningsportaler för kunder?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Ja, med Enterprise-licensen kan du skapa kundportaler där kunder kan logga in för att se sina ärenden, söka i kunskapsdatabasen och skapa nya ärenden. Detta minskar belastningen på supportteamet och ger kunderna möjlighet att lösa enklare problem själva.
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
      <section className="py-12 sm:py-16 md:py-20 bg-crm">
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
              className="bg-white text-crm hover:bg-white/90 text-base sm:text-lg h-14 sm:h-16 rounded-xl"
            >
              Boka gratis rådgivning
            </Button>
          </ContactFormDialog>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default D365CustomerService;
