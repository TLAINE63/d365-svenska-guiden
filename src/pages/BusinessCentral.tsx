import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { FilterButtons } from "@/components/FilterButtons";
import LeadCTA from "@/components/LeadCTA";
import PartnerCard from "@/components/PartnerCard";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { allIndustries } from "@/data/partners";
import { usePartners } from "@/hooks/usePartners";
import { filterAndSortPartners, getProductIndustries } from "@/hooks/usePartnerFilters";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Geography filter options
const geographyFilters = [
  { label: "Sverige", value: "Sverige" },
  { label: "Norden", value: "Norden" },
  { label: "Europa", value: "Europa" },
  { label: "Övriga världen", value: "Övriga världen" }
];

const BusinessCentral = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedGeography, setSelectedGeography] = useState<string | null>(null);
  
  // Fetch partners from database (only featured partners)
  const { data: partners = [], isLoading } = usePartners();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter partners for Business Central
  const bcPartners = useMemo(() => {
    return filterAndSortPartners(partners, 'bc', selectedIndustry, selectedGeography);
  }, [partners, selectedIndustry, selectedGeography]);

  // Get available industries for BC partners
  const bcIndustries = useMemo(() => {
    return getProductIndustries(partners, 'bc', allIndustries);
  }, [partners]);

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
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <ContactFormDialog>
                  <Button 
                    size="lg"
                    className="bg-business-central hover:bg-business-central/90 text-business-central-foreground w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl"
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
                  Business Central har i praktiken två typer av användare. Antingen är man en "vanlig" användare, med tillgång till allt (styrs sedan mer detaljerat av behörighetsroller) eller så finns det även en enklare användare som kallas Team Member, där man kan utföra mer begränsade arbetsuppgifter. Den "vanliga" användaren finns i två varianter: Essentials och Premium. Med Premium får man allt i Essentials plus funktionerna inom tillverkning och serviceorderhantering. Mer detaljer om detta finns att läsa om i Microsofts licensguide för Dynamics 365. Licenspriserna, eller mer korrekt prenumerationspriset är för Team Member (88,40 kr/månad), Essentials (884,10 kr/månad) och Premium (1 215,60 kr/månad). Till detta tillkommer självklart implementeringskostnader som varierar beroende på omfattning, integrationer och anpassningsbehov.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Är Business Central rätt för mitt företag?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Business Central är optimerat för mindre och medelstora företag (10-300 användare) med behov av ett komplett affärssystem (ERP). Det passar särskilt bra för företag som redan använder Microsoft 365 och vill ha en integrerad lösning för ekonomi, lager, försäljning, inköp och produktion. Oavsett bransch – tillverkning, handel, tjänster eller projekt – kan Business Central anpassas till era specifika behov.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur lång tid tar det att implementera Business Central?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  En typisk Business Central-implementering tar 3-6 månader beroende på komplexitet och omfattning. För mindre företag med standardprocesser kan det gå snabbare (2-3 månader), medan större projekt med omfattande anpassningar och integrationer kan ta 6-12 månader. Vissa rekommenderar en fasad implementering där ni får grundfunktionaliteten först och sedan bygger på med mer avancerade funktioner.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur fungerar Business Central med Microsoft 365 och andra system?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Business Central är byggt för att fungera sömlöst med Microsoft 365-paketet. Ni kan arbeta direkt i Outlook, Excel och Teams utan att lämna era vanliga arbetsverktyg. Systemet integreras också enkelt med andra lösningar via API:er och standardkopplingar, inklusive e-handel, CRM-system (som Dynamics 365 Sales), tidrapporteringssystem och bransspecifika tilläggslösningar.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Hur anpassningsbart är Business Central för våra behov?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Business Central är mycket flexibelt och kan anpassas utan omfattande programmering tack vare Power Platform. Ni kan skapa egna arbetsflöden, rapporter och dashboards som passar era processer. Det finns också hundratals branschspecifika tilläggslösningar (AppSource) för exempelvis bygg, tillverkning, detaljhandel och professionella tjänster. För mer avancerade anpassningar finns möjligheten till utveckling med AL-språket.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  ❓ Vilken partner borde passa vår verksamhet bäst?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  Rätt partner beror på er bransch, företagsstorlek och specifika behov. Vi rekommenderar att ni väljer en partner med erfarenhet från liknande implementeringar i er bransch och som har certifieringar för Business Central. På vår <a href="/valj-partner" className="text-business-central hover:underline font-medium">partnerkatalog</a> kan ni filtrera på bransch, företagsstorlek och applikationer för att hitta partners som matchar era krav. Ni kan också använda vårt verktyg för att få personliga partnerrekommendationer.
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

      {/* AI & Agents Section for Business Central */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
                AI & Agenter för Business Central
              </h2>
              <p className="text-lg text-muted-foreground">
                Copilot hjälper dig, Agenter arbetar för dig
              </p>
            </div>

            <div className="space-y-6">
              {/* Copilot Features */}
              <div className="bg-card rounded-xl p-6 sm:p-8 border border-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-secondary w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👤</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground mb-2">Copilot i Business Central</h3>
                    <p className="text-muted-foreground mb-4">
                      Din AI-assistent för dagliga uppgifter
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Generera produktbeskrivningar automatiskt</li>
                      <li>• Analysera banktransaktioner med AI</li>
                      <li>• Skapa försäljningsrader från dokument</li>
                      <li>• Intelligenta inköpsförslag</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Hjälper med e-postutkast</li>
                      <li>• Föreslår kontouppställningar</li>
                      <li>• Ger insikter i realtid</li>
                      <li>• Stöttar användare i arbetsflöden</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Agents Features */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 sm:p-8 border-2 border-primary/30">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-to-br from-primary to-accent w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Agenter i Business Central</h3>
                  <p className="text-muted-foreground mb-4">
                    Autonoma AI-system som arbetar självständigt 24/7
                  </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                      <span>📦</span> Inventory Management Agent
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Övervakar lagernivåer kontinuerligt, skapar automatiskt inköpsorder baserat på säkerhetslager och prognoser, 
                      och förhandlar priser med leverantörer enligt dina affärsregler
                    </p>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                      <span>💰</span> Finance Agent
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Automatiserar fakturahantering, utför bankavstämningar, processar betalningar och leverantörsreskontra, 
                      samt identifierar och flaggar avvikelser för granskning
                    </p>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                      <span>📊</span> Production Planning Agent
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Optimerar produktionsplanering baserat på order, lager och kapacitet. Schemalägger automatiskt 
                      produktionsorder och koordinerar med leverantörer för material
                    </p>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                      <span>💼</span> Customer Service Agent
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Hanterar kundförfrågningar om orderstatus, fakturauppgifter och leveransinformation autonomt. 
                      Eskalerar komplexa ärenden till rätt person med fullständig kontext
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button asChild size="lg" variant="outline">
                <Link to="/agents">
                  Upptäck fler Agenter-användningsområden
                  <span className="ml-2">→</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Project Cost Section */}
      <section id="project-cost" className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                Implementeringskostnader för Business Central
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Nedan följer ett par exempel på Business Centralprojekt, mer för att du skall få en generell uppfattning. Beroende på bransch, företagsstorlek, anpassningar, integrationer m.m. så kan det skilja mycket. Det kan även skilja en del mellan olika implementationspartners beroende på erfarenhet, färdiga paketeringar osv. Testa gärna under "Välj Partner" eller gå in under menyn "Branschlösningar" för att få lite tips om partners.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-4 sm:p-6 md:p-8 border border-border">
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground mb-3 sm:mb-4">Mindre standardimplementationer</h4>
                <p className="text-sm text-muted-foreground mb-3 sm:mb-4">Standarduppsättning med begränsade anpassningar</p>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-6">150 000 - 400 000 kr</div>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>• 2-4 månaders projekt</li>
                  <li>• Standardprocesser och funktionalitet</li>
                  <li>• Grundläggande utbildning</li>
                  <li>• Datamigration från enklare system</li>
                  <li>• Få eller inga integrationer</li>
                  <li>• 5-20 användare</li>
                </ul>
              </div>
              <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-4 sm:p-6 md:p-8 border border-border">
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground mb-3 sm:mb-4">Mer avancerade implementationer</h4>
                <p className="text-sm text-muted-foreground mb-3 sm:mb-4">Anpassad lösning med integrationer och komplexitet</p>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-6">500 000 - 1 500 000 kr</div>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>• 4-8 månaders projekt</li>
                  <li>• Anpassade processer och workflows</li>
                  <li>• Omfattande utbildning</li>
                  <li>• Komplex datamigration</li>
                  <li>• Flera systemintegrationer</li>
                  <li>• 20-200 användare</li>
                </ul>
              </div>
            </div>
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

      {/* Partners Section */}
      <section id="partners" className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Business Central-partners
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto">
              Här är ett urval av partners som arbetar med Dynamics 365 Business Central i Sverige. Välj vilken bransch du tillhör och din företagsstorlek (antal anställda), så filtreras listan på de Microsoftpartners som sannolikt passar dig bäst
            </p>
          </div>

          {/* Industry Filter */}
          <FilterButtons
            title="Filtrera på bransch"
            icon="industry"
            options={allIndustries.map(ind => ({ label: ind, value: ind }))}
            selectedValue={selectedIndustry}
            onSelect={setSelectedIndustry}
            colorScheme="business-central"
          />

          {/* Geography Filter */}
          <FilterButtons
            title="Ange vart geografiskt ni har er verksamhet och som är relevant för denna lösning (organisation, kontor/personal)"
            icon="geography"
            options={geographyFilters.map(g => ({ label: g.label, value: g.value }))}
            selectedValue={selectedGeography}
            onSelect={setSelectedGeography}
            colorScheme="business-central"
          />

          {/* Filter Results Summary */}
          {(selectedIndustry || selectedGeography) && (
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground">
                Visar <span className="font-semibold text-foreground">{bcPartners.length}</span> partners
                {selectedIndustry && <> inom <span className="font-semibold text-business-central">{selectedIndustry}</span></>}
                {(selectedIndustry && selectedGeography) && <> och</>}
                {selectedGeography && <> med täckning i <span className="font-semibold text-business-central">{selectedGeography}</span></>}
              </p>
              <Button 
                variant="ghost"
                size="sm" 
                onClick={() => {
                  setSelectedIndustry(null);
                  setSelectedGeography(null);
                }}
                className="mt-2 text-muted-foreground hover:text-foreground"
              >
                Rensa alla filter
              </Button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bcPartners.map((partner, index) => {
              // Build profile URL with filter context
              const baseUrl = `/partner/${partner.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
              const params = new URLSearchParams();
              params.set("product", "Business Central");
              if (selectedIndustry) {
                params.set("industry", selectedIndustry);
              }
              const profileUrl = `${baseUrl}?${params.toString()}`;
              
              return (
              <PartnerCard
                  key={index}
                  partner={partner}
                  profileUrl={profileUrl}
                  colorScheme="primary"
                  productKey="bc"
                  highlightedProduct="Business Central"
                  highlightedIndustry={selectedIndustry || undefined}
                  showRandomIndicator={true}
                />
              );
            })}
          </div>

          {/* Lead CTA - shows when partners are filtered */}
          {selectedIndustry && (
            <div className="max-w-xl mx-auto mt-12">
              {/* Premium Contact CTA Card - same design as PartnerProfile */}
              <article className="relative rounded-3xl overflow-hidden shadow-2xl">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/25 via-transparent to-transparent" />
                
                {/* Animated orb */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/40 to-transparent rounded-full blur-3xl animate-pulse" />
                
                <div className="relative p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                      <span className="text-xl">✨</span>
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        Låt oss hjälpa dig hitta rätt partner
                      </h3>
                      <p className="text-white/70 text-sm sm:text-base">
                        Det här var ett första steg i rätt riktning. Låt oss hjälpa dig vidare – helt kostnadsfritt.
                      </p>
                    </div>
                  </div>
                  
                  {/* Filter context with glass effect */}
                  <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Din sökning
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary/40 text-white border-primary/50 py-1.5 px-3 backdrop-blur-sm">
                        Business Central
                      </Badge>
                      {selectedIndustry && (
                        <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 backdrop-blur-sm">
                          {selectedIndustry}
                        </Badge>
                      )}
                      {selectedGeography && (
                        <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 backdrop-blur-sm">
                          {selectedGeography}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <LeadCTA
                    sourcePage="/business-central"
                    selectedProduct="Business Central"
                    selectedIndustry={selectedIndustry || undefined}
                    variant="inline"
                  />
                </div>
              </article>
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/valj-partner">
                Se alla partners
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
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
              <Button className="bg-business-central hover:bg-business-central/90 text-business-central-foreground h-14 sm:h-16 rounded-xl" size="lg">
                Boka in en kostnadsfri rådgivning
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
