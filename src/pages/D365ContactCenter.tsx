import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import ApplicationPartners from "@/components/ApplicationPartners";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import ContactCenterIcon from "@/assets/icons/ContactCenter.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const D365ContactCenter = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[350px] sm:h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=2070" 
            alt="Contact center agent" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <img src={ContactCenterIcon} alt="Contact Center" className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Dynamics 365 Contact Center
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-4 sm:mb-6">
                Modern och innovativ kontaktcenterlösning med Omnichannel, AI och automation
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
              Microsoft Dynamics 365 Contact Center
            </h2>
            <p className="text-xl sm:text-2xl text-foreground mb-4 sm:mb-6">
              Nästa generations kontaktcenter
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              Dynamics 365 Contact Center är en modern, AI-driven kontaktcenterlösning som samlar alla kundkommunikationskanaler i ett enhetligt gränssnitt. Med intelligent routing, realtidsanalys och sömlös integration med Microsoft Teams får ditt team verktyg för att leverera exceptionell service.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Lösningen inkluderar virtuella agenter som kan hantera enkla ärenden automatiskt, frigör mänskliga agenter för mer komplexa interaktioner, och ger chefer insyn i prestanda och kundnöjdhet i realtid.
            </p>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 text-center">
              Se Dynamics 365 Contact Center i aktion
            </h2>
            <VideoCard
              title="Dynamics 365 Contact Center"
              description="Modern och innovativ kontaktcenterlösning med Omnichannel, AI och automation"
              videoId="MYl0lN5_-L8"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              Vanliga frågor om Dynamics 365 Contact Center
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vad är skillnaden mellan Contact Center och Customer Service?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Dynamics 365 Contact Center är specifikt designat för högvolym-kontaktcenter med avancerade telefoni-funktioner, intelligent routing, virtuella agenter och real-time övervakning. Customer Service fokuserar mer på ärendehantering och kunskapsdatabaser. Contact Center kan användas tillsammans med Customer Service för en komplett lösning.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Hur fungerar virtuella agenter?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Virtuella agenter i Contact Center använder AI och naturlig språkförståelse för att automatiskt hantera vanliga kundförfrågningar via chatt eller telefon. De kan svara på frågor, guida kunder genom processer och vid behov eskalera till mänskliga agenter med full konversationshistorik. Detta minskar väntetider och frigör agenter för mer komplexa ärenden.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Vilka kanaler stöds?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Contact Center stöder telefon (inkommande och utgående), chatt, e-post, SMS, sociala medier (Facebook, Twitter) och Microsoft Teams. Alla kanaler samlas i ett enhetligt gränssnitt så att agenter kan hantera alla interaktioner från samma plats och kunder kan byta kanal utan att förlora kontext.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Hur fungerar integration med Microsoft Teams?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Contact Center integreras djupt med Microsoft Teams, vilket gör det möjligt att hantera kundsamtal direkt i Teams-gränssnittet. Agenter kan enkelt konsultera kollegor eller experter via Teams under pågående kundsamtal, och övervakning och rapportering kan göras via Teams-kanaler.
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
              <img src={ContactCenterIcon} alt="Contact Center" className="h-12 w-12" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Licenspriser
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
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
                    En typisk implementation av Contact Center tar <strong>3-6 månader</strong> beroende på kanaler och integrationer.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande telefoni:</strong> 2-3 månader</li>
                    <li>• <strong>Med chatt och e-post:</strong> 3-4 månader</li>
                    <li>• <strong>Full omnikanal med AI:</strong> 4-6 månader</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">💰 Kostnad</h3>
                  <p className="text-muted-foreground mb-4">
                    Implementationskostnaden beror på antal agenter, kanaler och AI-funktionalitet.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Grundläggande:</strong> 250 000 - 500 000 kr</li>
                    <li>• <strong>Med fler kanaler:</strong> 500 000 - 900 000 kr</li>
                    <li>• <strong>Komplett med AI-bots:</strong> 900 000 - 2 000 000 kr</li>
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
      <ApplicationPartners applicationFilter="Contact Center" pageSource="D365 Contact Center" />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-crm">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Redo att modernisera ditt kontaktcenter?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-6 sm:mb-8">
            Boka en kostnadsfri rådgivning med oss så hjälper vi dig bygga ett framtidssäkert kontaktcenter.
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

export default D365ContactCenter;
