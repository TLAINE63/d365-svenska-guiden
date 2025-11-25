import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import BusinessCentralIcon from "@/assets/icons/BusinessCentral.png";
import ReleaseWaveImage from "@/assets/bc-release-wave.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BusinessCentral = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bcVideos = [
    {
      title: "Business Central för Mindre och Medelstora Företag",
      description: "Komplett affärslösning för växande företag",
      videoId: "X7B99e3mNfI",
    },
    {
      title: "Business Central - Höstrelease 2025",
      description: "Utforska funktioner och möjligheter",
      videoId: "UIL8ej7mSKQ",
    },
    {
      title: "Business Central Demo",
      description: "Automatised orderhantering med Copilot",
      videoId: "7QJeTXzZaEk",
    },
    {
      title: "Business Central Demo",
      description: "Exempel på Copilot",
      videoId: "ayXdXFyFEjY",
    },
  ];

  const bcPricingPlans = [
    {
      title: "Business Central Team Member",
      description: "För användare med begränsade behov",
      price: "88,40 kr",
      features: [
        "Läsbehörighet",
        "Grundläggande rapporter",
        "Tidrapportering",
        "Godkännanden",
        "Self-service funktioner",
      ],
    },
    {
      title: "Business Central Essentials",
      description: "För mindre företag",
      price: "884,10 kr",
      features: [
        "Ekonomihantering",
        "Försäljning & Inköp",
        "Offert- & Orderhantering",
        "Lagerhantering",
        "Projekthantering",
      ],
    },
    {
      title: "Business Central Premium",
      description: "För växande företag",
      price: "1 215,60 kr",
      features: [
        "Alla Essentials-funktioner",
        "Serviceorderhantering",
        "Tillverkning",
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
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2070" 
            alt="Business analytics and planning" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <img src={BusinessCentralIcon} alt="Business Central" className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Business Central
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-4 sm:mb-6">
                Komplett affärslösning för mindre och medelstora företag
              </p>
              
              <ContactFormDialog>
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto text-base sm:text-lg h-12 sm:h-auto"
                >
                  Boka gratis rådgivning
                </Button>
              </ContactFormDialog>
            </div>
          </div>
        </div>
      </header>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
              Vanliga frågor om Dynamics 365 Business Central
            </h2>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vad kostar Business Central – och vad påverkar priset?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Business Central har tre licensnivåer: Team Member (88,40 kr/månad), Essentials (884,10 kr/månad) och Premium (1 215,60 kr/månad). Priset påverkas av antal användare, vilka funktioner ni behöver, och om ni väljer molnbaserad eller on-premise-lösning. Till licensavgifterna tillkommer implementeringskostnader som varierar beroende på omfattning och anpassningsbehov.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Är Business Central rätt för mitt företag?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Business Central är optimerat för mindre och medelstora företag (10-300 användare) med behov av ett komplett ERP-system. Det passar särskilt bra för företag som redan använder Microsoft 365 och vill ha en integrerad lösning för ekonomi, lager, försäljning, inköp och produktion. Oavsett bransch – tillverkning, handel, tjänster eller projekt – kan Business Central anpassas till era specifika behov.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Hur lång tid tar det att implementera Business Central?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  En typisk Business Central-implementering tar 3-6 månader beroende på komplexitet och omfattning. För mindre företag med standardprocesser kan det gå snabbare (2-3 månader), medan större projekt med omfattande anpassningar och integrationer kan ta 6-12 månader. Vi rekommenderar en fasad implementering där ni får grundfunktionaliteten först och sedan bygger på med mer avancerade funktioner.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Hur fungerar Business Central med Microsoft 365 och andra system?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Business Central är byggt för att fungera sömlöst med Microsoft 365-paketet. Ni kan arbeta direkt i Outlook, Excel och Teams utan att lämna era vanliga arbetsverktyg. Systemet integreras också enkelt med andra lösningar via API:er och standardkopplingar, inklusive e-handel, CRM-system (som Dynamics 365 Sales), tidrapporteringssystem och bransspecifika tilläggslösningar.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-xl font-semibold text-card-foreground hover:no-underline py-6">
                  ❓ Hur anpassningsbart är Business Central för våra behov?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Business Central är mycket flexibelt och kan anpassas utan omfattande programmering tack vare Power Platform. Ni kan skapa egna arbetsflöden, rapporter och dashboards som passar era processer. Det finns också hundratals branschspecifika tilläggslösningar (AppSource) för exempelvis bygg, tillverkning, detaljhandel och professionella tjänster. För mer avancerade anpassningar finns möjligheten till utveckling med AL-språket.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section id="videos" className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Korta inspirationsvideos
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Här har vi samlat ett antal väldigt korta videos som kan ge en viss inblick i möjligheterna med Business Central
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {bcVideos.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section id="latest-news" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Senaste Nytt
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              2026 release wave 1 investment areas för Dynamics 365 Business Central
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-lg p-4 border border-border shadow-[var(--shadow-card)] overflow-hidden">
              <img 
                src={ReleaseWaveImage} 
                alt="Dynamics 365 Business Central 2026 release wave 1 investment areas" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Costs Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Implementationspriser för Business Central
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Få en tydlig genomgång av vad det kostar att implementera Business Central
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VideoCard
              title="Vad kostar ett Business Central-projekt?"
              description="Transparant genomgång av implementationskostnader och vad som påverkar priset"
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
                Vad kostar ett Business Central-projekt?
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-muted-foreground mb-6">
                  Det skiljer väldigt mycket mellan olika typer av ERP projekt och för att få en uppfattning om en ungefärlig kostnad och vad som driver konsultbehov finns några saker som man kan tänka över:
                </p>
                <div className="bg-card/50 rounded-lg p-6 border border-border/50">
                  <ul className="space-y-3 list-disc list-inside text-base text-card-foreground/90">
                    <li>Hur många bolag/geografiska enheter som ska in (fler bolag = mer komplexitet)</li>
                    <li>Hur många användare som ska använda systemet och deras roller</li>
                    <li>Om ni behöver lagerhantering, produktion, service, flera integrationer (CRM, e-handel, WMS)</li>
                    <li>Hur mycket data som ska migreras (antal år, många poster, många system)</li>
                    <li>Anpassningar: skräddarsydd funktionalitet, rapporter, appar</li>
                    <li>Tidsplan: ju snabbare leverans desto mer resurser krävs, vilket kan öka kostnaden</li>
                    <li>Ändringshantering & utbildning: större förändring i processer kräver mer konsulttid</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              {/* Implementation Costs */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-6">Implementeringskostnader</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start pb-3 border-b border-border">
                    <div>
                      <p className="font-semibold text-card-foreground">Grundimplementering</p>
                      <p className="text-sm text-muted-foreground">Mer eller mindre "out of the box", men med partners erfarenhet inbyggt</p>
                    </div>
                    <p className="text-primary font-bold">Från 50 tkr</p>
                  </div>
                  
                  <div className="flex justify-between items-start pb-3 border-b border-border">
                    <div>
                      <p className="font-semibold text-card-foreground">Mellanprojekt</p>
                      <p className="text-sm text-muted-foreground">Mer avancerad order-lager-inköpshantering, någon integration samt några fler användare</p>
                    </div>
                    <p className="text-primary font-bold">150-300 tkr</p>
                  </div>
                  
                  <div className="flex justify-between items-start pb-3">
                    <div>
                      <p className="font-semibold text-card-foreground">Komplext projekt</p>
                      <p className="text-sm text-muted-foreground">Flera bolag, kanske produktion, många användare, specialanpassningar och flera integrationer</p>
                    </div>
                    <p className="text-primary font-bold">300-800 tkr eller mer</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Räkna även med en viss förvaltningskostnad/supportavtal (här finns nästan lika många varianter som det finns konsultbolag), kontinuerlig användarutbildning, utbildning i nya versioner/uppdateringar samt eventuell vidareutveckling när verksamheten förändras.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* License Pricing Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Licenspriser för Business Central
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Förstå skillnaderna mellan Team Member, Essentials och Premium licenserna
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VideoCard
              title="Business Central Licenspriser Förklarade"
              description="Vilken licens passar bäst för ditt företag?"
              videoId=""
            />
            <p className="text-center text-sm text-muted-foreground mt-4 italic">
              Lägg in ditt YouTube video-ID för att visa videon
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Business Central Essentials vs Premium
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Vilken licens passar bäst för ditt företag?
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
            {bcPricingPlans.map((plan, index) => (
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
              Redo att växa med Business Central?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kontakta oss för en kostnadsfri konsultation
            </p>
            <ContactFormDialog>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
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

export default BusinessCentral;
