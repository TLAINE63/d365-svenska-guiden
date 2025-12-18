import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import ApplicationPartners from "@/components/ApplicationPartners";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import FieldServiceIcon from "@/assets/icons/FieldService.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const D365FieldService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[350px] sm:h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=2070" 
            alt="Field service technician" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <img src={FieldServiceIcon} alt="Field Service" className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Dynamics 365 Field Service
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-4 sm:mb-6">
                Optimera fältservice med intelligent schemaläggning och mobilitet
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
              Microsoft Dynamics 365 Field Service
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              Intelligent fältservicehantering
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              Dynamics 365 Field Service hjälper organisationer att leverera proaktiv service på plats genom intelligent schemaläggning, resursoptimering och mobila verktyg för fälttekniker.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Med IoT-integration kan du övergå från reaktiv till prediktiv service – identifiera och lösa problem innan de uppstår. Fälttekniker får all information de behöver i mobilen, inklusive arbetsorder, kundhistorik och kunskapsartiklar.
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Se Dynamics 365 Field Service i aktion
            </h2>
            <VideoCard
              title="Dynamics 365 Field Service"
              description="Optimera fältservice med intelligent schemaläggning och mobilitet"
              videoId="OujvbnyGqDY"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              Vanliga frågor om Dynamics 365 Field Service
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur fungerar intelligent schemaläggning?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Resource Scheduling Optimization (RSO) analyserar automatiskt faktorer som teknikernas kompetens, geografisk position, restid, prioritet och SLA-krav för att skapa optimala scheman. Systemet kan omplanera i realtid vid förändringar och maximerar antalet slutförda arbetsorder per dag.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Vad innebär IoT-integration?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Med IoT Connected Field Service kan sensorer på utrustning automatiskt rapportera status och skapa arbetsorder när något avviker från det normala. Detta möjliggör prediktivt underhåll – du kan åtgärda problem innan de orsakar driftstopp, vilket sparar tid och pengar för både dig och kunden.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Hur fungerar mobilappen för fälttekniker?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Field Service Mobile-appen ger tekniker tillgång till arbetsorder, kundinformation, utrustningshistorik, reservdelslagerstatus och kunskapsartiklar – även offline. De kan uppdatera arbetsstatus, ta bilder, inhämta kundsignaturer och registrera tid och material direkt i appen.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Kan Field Service integreras med Customer Service?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Ja, Dynamics 365 Field Service integreras sömlöst med Customer Service. Ärenden som kräver platsbesök kan enkelt eskaleras till arbetsorder, och kundserviceagenter har full insyn i schemalagda och utförda fältbesök. Detta ger en komplett bild av kundinteraktioner oavsett kanal.
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
              <img src={FieldServiceIcon} alt="Field Service" className="h-12 w-12" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Licenspriser
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
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
                    En typisk implementation av Field Service tar <strong>3-5 månader</strong> beroende på antal tekniker och mobila krav.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande (10-20 tekniker):</strong> 2-3 månader</li>
                    <li>• <strong>Med schemaoptimering:</strong> 5-7 månader</li>
                    <li>• <strong>Komplett med IoT:</strong> 8-12 månader</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">💰 Kostnad</h3>
                  <p className="text-muted-foreground mb-4">
                    Implementationskostnaden beror på antal tekniker, mobilapp-anpassningar och IoT-integrationer.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande:</strong> 200 000 - 400 000 kr</li>
                    <li>• <strong>Med schemaoptimering:</strong> 400 000 - 800 000 kr</li>
                    <li>• <strong>Komplett med IoT:</strong> 800 000 - 1 800 000 kr</li>
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
      <ApplicationPartners applicationFilter="Field Service" pageSource="D365 Field Service" />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-crm">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Redo att optimera din fältservice?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8">
            Boka en kostnadsfri rådgivning med oss så hjälper vi dig effektivisera din fältserviceverksamhet.
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

export default D365FieldService;
