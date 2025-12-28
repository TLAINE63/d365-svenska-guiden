import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { FilterButtons } from "@/components/FilterButtons";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { partners, allIndustries } from "@/data/partners";
import { trackPartnerClick, buildPartnerUrl } from "@/utils/trackPartnerClick";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Company size filter options
const companySizeFilters = [
  { label: "Små- och mindre företag (1-49 anställda)", values: ["Små"] },
  { label: "Mindre/Medelstora företag (50-199)", values: ["Små", "Medelstora"] },
  { label: "Medelstora/Större företag (200-999)", values: ["Medelstora", "Stora"] },
  { label: "Större företag (1.000-5.000)", values: ["Stora"] },
  { label: "Enterprisebolag (+5.000 anställda)", values: ["Stora", "Enterprise"] }
];

const FinanceSupplyChain = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper to get the lowest industry index for a partner (for sorting by industry priority)
  const getIndustryPriority = (partner: typeof partners[0], industry: string | null): number => {
    if (!industry) return 0;
    for (let i = 0; i < partner.industries.length; i++) {
      if (partner.industries[i].toLowerCase().includes(industry.toLowerCase()) ||
          industry.toLowerCase().includes(partner.industries[i].toLowerCase())) {
        return i;
      }
    }
    return Infinity;
  };

  // Filter partners that work with Finance & SCM
  const fscPartners = useMemo(() => {
    let result = partners.filter(partner => partner.applications.includes("Finance & SCM"));
    
    if (selectedIndustry) {
      result = result.filter(partner => 
        partner.industries.some(ind => 
          ind.toLowerCase().includes(selectedIndustry.toLowerCase()) ||
          selectedIndustry.toLowerCase().includes(ind.toLowerCase()) ||
          ind === "Alla branscher"
        )
      );
    }

    if (selectedCompanySize) {
      const sizeFilter = companySizeFilters.find(f => f.label === selectedCompanySize);
      if (sizeFilter) {
        result = result.filter(partner => 
          partner.companySize.some(size => sizeFilter.values.includes(size))
        );
      }
    }
    
    // Sort by FSC ranking first, then industry priority, then alphabetically
    return result.sort((a, b) => {
      const rankA = a.rankings?.fsc ?? 999;
      const rankB = b.rankings?.fsc ?? 999;
      if (rankA !== rankB) {
        return rankA - rankB;
      }
      if (selectedIndustry) {
        const priorityA = getIndustryPriority(a, selectedIndustry);
        const priorityB = getIndustryPriority(b, selectedIndustry);
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
      }
      return a.name.localeCompare(b.name, 'sv');
    });
  }, [selectedIndustry, selectedCompanySize]);

  const fscVideos = [
    {
      title: "Introduktion till Dynamics 365 Finance",
      description: "Maximera insynen i ekonomin och lönsamheten med generativ AI och automatisering",
      videoId: "O5yecO8A_9Q",
    },
    {
      title: "Supply Chain Management Översikt",
      description: "Den flexibla, samarbetsbaserade, anslutna plattformen som drivs av Microsoft Copilot för att bättre navigera i störningar.",
      videoId: "jC1EaSrB-Ak",
    },
    {
      title: "Dynamics 365 Human Resources",
      description: "Skapa en arbetsplats där människor och verksamhet kan växa",
      videoId: "LKmtKeN2hwk",
    },
    {
      title: "Dynamics 365 Commerce",
      description: "Leverera enhetliga, personliga och smidiga köpupplevelser med flera kanaler för kunder och partners.",
      videoId: "2URyNIGX2Js",
    },
    {
      title: "Dynamics 365 Finance & Supply Chain",
      description: "Se hur Finance & Supply Chain kan optimera din verksamhet",
      videoId: "7lbGGMvL-GU",
    },
  ];

  const fscPricingPlans = [
    {
      title: "Dynamics 365 Finance",
      description: "Avancerad finansiell hantering",
      price: "2 320,70 kr",
      features: [
        "Global finansiell hantering",
        "Bokföring och rapportering",
        "Budgetering",
        "Kredithantering",
        "Fler valutor och juridiska entiteter",
      ],
    },
    {
      title: "Supply Chain Management",
      description: "Komplett supply chain-lösning",
      price: "2 320,70 kr",
      features: [
        "Lagerhantering",
        "Produktionsplanering",
        "Inköp och leverantörshantering",
        "Lagerstyrning",
        "Transport management",
      ],
    },
    {
      title: "Dynamics 365 Human Resources",
      description: "Förbättra organisatorisk smidighet, optimera HR-program och omvandla medarbetarupplevelser",
      price: "1 491,90 kr",
      features: [
        "Medarbetarhantering",
        "Rekrytering och onboarding",
        "Prestationshantering",
        "Förmånsadministration",
        "Självbetjäningsportal",
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
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2070" 
            alt="Supply chain and logistics" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                <img src={FinanceIcon} alt="Finance" className="h-10 w-10 sm:h-12 sm:w-12" />
                <img src={SupplyChainIcon} alt="Supply Chain" className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Finance & Supply Chain
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-4 sm:mb-6">
                Företagslösning för större och ofta internationella organisationer
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <ContactFormDialog>
                  <Button 
                    size="lg"
                    className="bg-finance-supply hover:bg-finance-supply/90 text-finance-supply-foreground w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl"
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

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Vanliga frågor om Finance & Supply Chain
              </h2>
            </div>
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  <span className="flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    <span>Vad är skillnaden mellan Dynamics 365 F&SCM och andra ERP-system?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pl-11">
                  Dynamics 365 Finance & Supply Chain Management skiljer sig genom sin skalbarhet för globala organisationer, djupgående integration med Microsoft-ekosystemet, kraftfulla AI- och maskininlärningsfunktioner för prediktiv analys, samt branschspecifika applikationer för tillverkning, detaljhandel och distribution. Systemet erbjuder också omfattande compliance-stöd för olika regioner och branscher.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  <span className="flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    <span>Hur mycket kostar Dynamics 365 F&SCM – och vad påverkar priset?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pl-11">
                  Licenspriser börjar från 2 320,70 kr/månad för Finance och 2 320,70 kr/månad för Supply Chain Management. Totalkostnaden påverkas av antal användare, vilka applikationer ni behöver, omfattning av anpassningar, integration med befintliga system samt implementeringstid. För stora organisationer kan implementeringskostnader variera från 2-10 miljoner kronor eller mer, beroende på komplexitet.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  <span className="flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    <span>Hur lång tid tar det att implementera F&SCM – och hur ser processen ut?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pl-11">
                  En typisk F&SCM-implementering tar 9-24 månader beroende på omfattning och komplexitet. Processen följer vanligtvis följande faser: (1) Analys och planering, (2) Design och konfiguration, (3) Datamigrering, (4) Testning och validering, (5) Utbildning, (6) Go-live och (7) Stabilisering. Vi rekommenderar en fasad implementering där ni rullar ut funktionaliteten stegvis för att minimera risker.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  <span className="flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    <span>Hur flexibelt och anpassningsbart är F&SCM för vår verksamhet?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pl-11">
                  F&SCM är mycket flexibelt och kan anpassas till komplexa affärsprocesser och branschspecifika krav. Systemet stödjer omfattande konfiguration via Power Platform, samt utveckling av specialanpassningar när det behövs. Det finns också ett rikt ekosystem av ISV-lösningar (Independent Software Vendors) för specifika branscher som tillverkning, detaljhandel, läkemedel och livsmedel.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  <span className="flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    <span>Hur fungerar F&SCM med andra Microsoft-lösningar och tredjepartssystem?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pl-11">
                  F&SCM integreras sömlöst med hela Microsoft-ekosystemet inklusive Microsoft 365, Teams, Power BI och Azure. Systemet har robusta API:er och stöd för integration med tredjepartssystem som CRM-lösningar, e-handelsplattformar, WMS-system, MES-system och IoT-enheter. Integration kan ske via Azure Logic Apps, Power Automate eller direktintegrationer via standardprotokoll.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
                  <span className="flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    <span>Vilken partner borde passa vår verksamhet bäst?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pl-11">
                  Rätt partner beror på er bransch, företagsstorlek och specifika behov. För F&SCM-implementeringar rekommenderar vi partners med erfarenhet av komplexa, globala projekt och som har relevant branschexpertis. På vår <a href="/valj-partner" className="text-finance-supply hover:underline font-medium">partnerkatalog</a> kan ni filtrera på bransch, företagsstorlek och applikationer för att hitta partners som matchar era krav. Ni kan också använda vårt verktyg för att få personliga partnerrekommendationer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>


      {/* Videos Section */}
      <section id="videos" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Videoguider
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Här kommer några korta inspirationsvideos om Dynamics 365 Finance och Supply Chain Management samt även Human Resources och Commerce
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {fscVideos.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
          </div>
        </div>
      </section>


      {/* AI & Agents Section for Finance & Supply Chain */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
                AI & Agenter för Finance & Supply Chain
              </h2>
              <p className="text-lg text-muted-foreground">
                Enterprise AI för komplex finans- och supply chain-hantering
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
                    <h3 className="text-xl font-bold text-card-foreground mb-2">Copilot för Finance & Supply Chain</h3>
                    <p className="text-muted-foreground mb-4">
                      AI-assistent för ekonomi, leveranskedja och produktion
                    </p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Avancerad ekonomisk analys och prognoser</li>
                      <li>• Identifierar avvikelser i transaktioner</li>
                      <li>• Supply chain-insikter och rekommendationer</li>
                      <li>• Prediktiva underhållsförslag</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Genererar budgetförslag</li>
                      <li>• Analyserar leverantörsprestanda</li>
                      <li>• Optimerar produktionsscheman</li>
                      <li>• Förutsäger kassaflöde</li>
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
                  <h3 className="text-xl font-bold text-foreground mb-2">Agenter för Finance & Supply Chain</h3>
                  <p className="text-muted-foreground mb-4">
                    Autonoma AI-system för enterprise-processer
                  </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                      <span>💰</span> Treasury Management Agent
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Övervakar kassaflöde globalt i realtid, optimerar likviditet mellan juridiska enheter, 
                      hanterar valutaexponering automatiskt och placerar överskottslikvid enligt policy
                    </p>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                      <span>📊</span> Financial Planning Agent
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Skapar rullande prognoser automatiskt, identifierar trender och avvikelser, 
                      distribuerar budgetar mellan kostnadsställen och varnar för budgetöverskridanden proaktivt
                    </p>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                      <span>📦</span> Supply Chain Orchestration Agent
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Optimerar hela leveranskedjan från råmaterial till slutkund, hanterar störningar proaktivt, 
                      omdirigerar transporter automatiskt och balanserar lager mellan platser baserat på efterfrågan
                    </p>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                      <span>🏭</span> Production Optimization Agent
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Schemalägger produktion för maximal effektivitet, justerar planer baserat på orderändringar och kapacitet, 
                      koordinerar med leverantörer för just-in-time leverans och minimerar stillestånd
                    </p>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                      <span>🤝</span> Vendor Management Agent
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Utvärderar leverantörsprestanda kontinuerligt, förhandlar priser och villkor automatiskt enligt ramar, 
                      diversifierar leverantörsbas för riskreducering och identifierar alternativa källor proaktivt
                    </p>
                  </div>
                  <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                      <span>🔧</span> Predictive Maintenance Agent
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Analyserar IoT-data från maskiner för att förutsäga fel, schemalägger underhåll vid optimal tidpunkt, 
                      beställer reservdelar automatiskt och minimerar oplanerade produktionsstopp
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button asChild size="lg" variant="outline">
                <Link to="/agents">
                  Utforska Agenter för Enterprise
                  <span className="ml-2">→</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* License Pricing Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Licenspriser för Finance & Supply Chain
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Förstå licensstrukturen för Finance, Supply Chain Management och Human Resources
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VideoCard
              title="Finance & Supply Chain Licenspriser"
              description="En genomgång av de olika licenserna och vad de inkluderar"
              videoId=""
            />
            <p className="text-center text-sm text-muted-foreground mt-4 italic">
              Lägg in ditt YouTube video-ID för att visa videon
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Prisöversikt
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Priser per användare och månad
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {fscPricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
          <p className="text-sm italic text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
            Observera: Priserna ovan är exempelpriser baserade på Microsofts offentliga prislista vid tidpunkten för sammanställningen. För exakta och aktuella priser, inklusive eventuella rabatter eller volymavtal, rekommenderas att en offert tas fram i samråd med en auktoriserad Microsoft-partner eller direkt via Microsoft.
          </p>
        </div>
      </section>

      {/* Implementation Costs Video Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Implementationspriser för Finance & Supply Chain
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Vad kostar det att implementera Finance & Supply Chain Management?
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <VideoCard
              title="Finance & Supply Chain-projekt: Kostnader och Genomförande"
              description="En ärlig genomgång av vad ett F&SCM-projekt innebär"
              videoId=""
            />
            <p className="text-center text-sm text-muted-foreground mt-4 italic">
              Lägg in ditt YouTube video-ID för att visa videon
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Costs Section */}
      <section id="implementation" className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Implementeringskostnader
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Kostnaderna för implementering varierar baserat på omfattning och komplexitet. Nedan följer exempel på projektkostnader för Dynamics 365 Finance & Supply Chain för att ge en känsla för omfattningen och tidsramen.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-4 sm:p-6 md:p-8 border border-border">
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground mb-3 sm:mb-4">Mindre standardimplementationer</h4>
                <p className="text-sm text-muted-foreground mb-3 sm:mb-4">Grundläggande uppsättning med standardfunktionalitet</p>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-6">1 500 000 - 3 000 000 kr</div>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>• 6-9 månaders projekt</li>
                  <li>• Standardprocesser med mindre anpassningar</li>
                  <li>• Strukturerad utbildning</li>
                  <li>• Datamigration och validering</li>
                  <li>• Grundläggande integrationer</li>
                  <li>• 50-200 användare</li>
                </ul>
              </div>
              <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-4 sm:p-6 md:p-8 border border-border">
                <h4 className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground mb-3 sm:mb-4">Mer avancerade implementationer</h4>
                <p className="text-sm text-muted-foreground mb-3 sm:mb-4">Globala implementationer med hög komplexitet</p>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-6">3 000 000 - 10 000 000+ kr</div>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>• 9-18+ månaders projekt</li>
                  <li>• Omfattande anpassningar och utveckling</li>
                  <li>• Global rollout och change management</li>
                  <li>• Komplex datamigration</li>
                  <li>• Många systemintegrationer</li>
                  <li>• 200-2000+ användare</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Common Factors */}
          <div className="max-w-4xl mx-auto mt-10 sm:mt-12 md:mt-16">
            <div className="bg-card rounded-lg p-6 sm:p-8 border border-border shadow-[var(--shadow-card)]">
              <h3 className="text-lg sm:text-xl font-bold text-card-foreground mb-4">Faktorer som påverkar kostnaden</h3>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Antal användare och bolag/juridiska enheter
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Vilka moduler som ska användas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Antal och komplexitet av integrationer
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Behov av specialanpassningar
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Datamigrering och konvertering
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Geografisk spridning och regulatoriska krav
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Finance & Supply Chain-partners
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto">
              Här är ett urval av partners som arbetar med Dynamics 365 Finance & Supply Chain i Sverige. Välj vilken bransch du tillhör och din företagsstorlek (antal anställda), så filtreras listan på de Microsoftpartners som sannolikt passar dig bäst
            </p>
          </div>

          {/* Industry Filter */}
          <FilterButtons
            title="Filtrera på bransch"
            icon="industry"
            options={allIndustries.map(ind => ({ label: ind, value: ind }))}
            selectedValue={selectedIndustry}
            onSelect={setSelectedIndustry}
            colorScheme="finance-supply"
          />

          {/* Company Size Filter */}
          <FilterButtons
            title="Hur många anställda finns på ert företag?"
            icon="employees"
            options={companySizeFilters.map(f => ({ label: f.label, value: f.label }))}
            selectedValue={selectedCompanySize}
            onSelect={setSelectedCompanySize}
            colorScheme="finance-supply"
          />

          {/* Filter Results Summary */}
          {(selectedIndustry || selectedCompanySize) && (
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground">
                Visar <span className="font-semibold text-foreground">{fscPartners.length}</span> partners
                {selectedIndustry && <> inom <span className="font-semibold text-finance-supply">{selectedIndustry}</span></>}
                {selectedIndustry && selectedCompanySize && <> och</>}
                {selectedCompanySize && <> för <span className="font-semibold text-finance-supply">{selectedCompanySize}</span></>}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSelectedIndustry(null);
                  setSelectedCompanySize(null);
                }}
                className="mt-2 text-muted-foreground hover:text-foreground"
              >
                Rensa alla filter
              </Button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {fscPartners.map((partner, index) => (
              <Card 
                key={index} 
                className="group relative border border-border/50 bg-card hover:bg-finance-supply/5 transition-all duration-300 flex flex-col shadow-md hover:shadow-xl transform hover:-translate-y-1"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-finance-supply via-accent to-finance-supply rounded-t-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-xl sm:text-2xl text-center font-bold text-foreground group-hover:text-finance-supply transition-colors leading-tight">
                    {partner.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col pt-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {partner.description}
                  </p>
                  
                  <div className="bg-finance-supply/5 rounded-lg p-3 border border-finance-supply/10">
                    <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Applikationer</p>
                    <div className="flex flex-wrap gap-1.5">
                      {partner.applications.map((app, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-finance-supply/10 text-finance-supply border-0 font-medium">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-accent/5 rounded-lg p-3 border border-accent/10">
                    <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Branscher</p>
                    <div className="flex flex-wrap gap-1.5">
                      {partner.industries.map((industry, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-accent/40 text-muted-foreground bg-transparent">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-3 border border-border/50">
                    <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Företagsstorlek</p>
                    <div className="flex flex-wrap gap-1.5">
                      {partner.companySize.map((size, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-secondary border-primary/20 text-foreground font-medium">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/50">
                    <Button asChild variant="finance-supply" className="w-full">
                      <a 
                        href={buildPartnerUrl(partner.website, partner.name, { 
                          application: 'Finance-SCM', 
                          industry: selectedIndustry || undefined 
                        })} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => trackPartnerClick(partner.name, partner.website, "Finance & Supply Chain")}
                      >
                        Besök hemsida
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Redo att transformera din verksamhet?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kontakta oss för en kostnadsfri konsultation
            </p>
            <ContactFormDialog>
              <Button className="bg-finance-supply hover:bg-finance-supply/90 text-finance-supply-foreground h-14 sm:h-16 rounded-xl" size="lg">
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

export default FinanceSupplyChain;
