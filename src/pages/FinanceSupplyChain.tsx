import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FinanceSupplyChain = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              
              <AccordionItem value="item-2" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-lg font-semibold text-card-foreground hover:no-underline py-6">
                  <span className="flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    <span>Hur mycket kostar Dynamics 365 F&SCM – och vad påverkar priset?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pl-11">
                  Licenspriser börjar från 2 320,70 kr/månad för Finance och 2 320,70 kr/månad för Supply Chain Management. Totalkostnaden påverkas av antal användare, vilka applikationer ni behöver, omfattning av anpassningar, integration med befintliga system samt implementeringstid. För stora organisationer kan implementeringskostnader variera från 2-10 miljoner kronor eller mer, beroende på komplexitet.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-lg font-semibold text-card-foreground hover:no-underline py-6">
                  <span className="flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    <span>Hur lång tid tar det att implementera F&SCM – och hur ser processen ut?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pl-11">
                  En typisk F&SCM-implementering tar 9-24 månader beroende på omfattning och komplexitet. Processen följer vanligtvis följande faser: (1) Analys och planering, (2) Design och konfiguration, (3) Datamigrering, (4) Testning och validering, (5) Utbildning, (6) Go-live och (7) Stabilisering. Vi rekommenderar en fasad implementering där ni rullar ut funktionaliteten stegvis för att minimera risker.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-lg font-semibold text-card-foreground hover:no-underline py-6">
                  <span className="flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    <span>Hur flexibelt och anpassningsbart är F&SCM för vår verksamhet?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pl-11">
                  F&SCM är mycket flexibelt och kan anpassas till komplexa affärsprocesser och branschspecifika krav. Systemet stödjer omfattande konfiguration via Power Platform, samt utveckling av specialanpassningar när det behövs. Det finns också ett rikt ekosystem av ISV-lösningar (Independent Software Vendors) för specifika branscher som tillverkning, detaljhandel, läkemedel och livsmedel.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="bg-card rounded-lg px-6 border border-border shadow-[var(--shadow-card)]">
                <AccordionTrigger className="text-lg font-semibold text-card-foreground hover:no-underline py-6">
                  <span className="flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    <span>Hur fungerar F&SCM med andra Microsoft-lösningar och tredjepartssystem?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 pl-11">
                  F&SCM integreras sömlöst med hela Microsoft-ekosystemet inklusive Microsoft 365, Teams, Power BI och Azure. Systemet har robusta API:er och stöd för integration med tredjepartssystem som CRM-lösningar, e-handelsplattformar, WMS-system, MES-system och IoT-enheter. Integration kan ske via Azure Logic Apps, Power Automate eller direktintegrationer via standardprotokoll.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* AI & Agents Section for Finance & Supply Chain */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <span>✨</span>
                <span>Microsoft Ignite 2025 - Agenter för F&SCM</span>
              </div>
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

      {/* Comparison with Business Central */}
      <section id="comparison" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Finance & Supply Chain vs Business Central
              </h2>
              <p className="text-lg text-muted-foreground">
                Vilket ERP-system passar bäst för din organisation?
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Finance & Supply Chain Management */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Finance & Supply Chain Management</h3>
                
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🏢</span>
                    <span>Anpassat för stora och komplexa organisationer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">📊</span>
                    <span>Avancerad finansiell styrning och konsolidering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🔗</span>
                    <span>Optimerad supply chain och AI-driven logistik</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🌐</span>
                    <span>Global skalbarhet och efterlevnad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🧠</span>
                    <span>Inbyggd AI, Copilot och datadriven analys</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🧩</span>
                    <span>Djup integration med hela Microsoft-ekosystemet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🏭</span>
                    <span>Branschspecifika applikationer och avancerad tillverkning</span>
                  </li>
                </ul>
              </div>

              {/* Business Central */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Business Central</h3>
                
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-xl">💰</span>
                    <span>Lägre licens- och implementeringskostnad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">⚡</span>
                    <span>Snabb implementering (3–6 månader)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🧑‍💻</span>
                    <span>Enkel och intuitiv användarupplevelse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🔄</span>
                    <span>Sömlös integration med Microsoft 365</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">📈</span>
                    <span>Flexibel och skalbar för växande SMB</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">☁️</span>
                    <span>Molnbaserad med hög säkerhet via Azure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🧰</span>
                    <span>Allt-i-ett-lösning för ekonomi, order, lager, inköp, produktion, projekt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🛒</span>
                    <span>Marknadsplats med över 6.000 tilläggsappar</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Key Decision Factors */}
            <div className="mt-12 bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
              <h3 className="text-2xl font-bold text-card-foreground mb-6">Nyckelfaktorer vid valet</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-3">Företagsstorlek</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Business Central: &lt;300 användare</p>
                    <p>Finance & Supply Chain: från 20 användare</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-3">Komplexitet</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Enkla till medelkomplexa processer → Business Central</p>
                    <p>Medelkomplexa till Komplexa processer → Finance & Supply Chain</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-3">Budget</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Begränsad budget → Business Central</p>
                    <p>Större investeringsförmåga → Finance & Supply Chain</p>
                  </div>
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

      {/* Project Cost Section */}
      <section id="project-cost" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Vad kostar ett Finance & Supply Chain-projekt?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
                När man talar om implementering av Microsoft Dynamics 365 Finance & Supply Chain Management (ofta benämnt "F&SCM") och dess driftkostnad — utan att räkna med licenskostnader — så finns det ganska stora variationer beroende på omfattning och verksamhetens komplexitet. Här är en översikt med riktmärken och viktiga kostnadsdrivare.
              </p>
              
              <div className="max-w-3xl mx-auto">
                <h3 className="text-xl font-semibold text-foreground mb-4">Exempel på faktorer som påverkar projektkostnaden:</h3>
                <div className="bg-card/50 rounded-lg p-6 border border-border/50">
                  <ul className="space-y-3 list-disc list-inside text-base text-card-foreground/90">
                    <li>Antal användare / antal bolag / juridiska enheter</li>
                    <li>Vilka funktioner som ska användas (finans, lager, inköp, produktion, service, distribution)</li>
                    <li>Antal och komplexitet av integrationer med andra system (CRM, e-handel, WMS, TMS, legacy system)</li>
                    <li>Behov av specialanpassningar (utöver standardfunktionalitet)</li>
                    <li>Datamigration: hur många år, från hur många system, hur mycket rensning och konvertering krävs</li>
                    <li>Geografisk spridning och olika regulatoriska krav per land</li>
                    <li>Ändringshantering, utbildning, användaracceptans, projektledning</li>
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
                      <p className="font-semibold text-card-foreground">Mindre omfattning</p>
                      <p className="text-sm text-muted-foreground">En modul, 20-50 användare</p>
                    </div>
                    <p className="text-primary font-bold">2-4M</p>
                  </div>
                  
                  <div className="flex justify-between items-start pb-3 border-b border-border">
                    <div>
                      <p className="font-semibold text-card-foreground">Medelstor implementation</p>
                      <p className="text-sm text-muted-foreground">Finance + SCM, 50-200 användare</p>
                    </div>
                    <p className="text-primary font-bold">4-10M</p>
                  </div>
                  
                  <div className="flex justify-between items-start pb-3">
                    <div>
                      <p className="font-semibold text-card-foreground">Global implementation</p>
                      <p className="text-sm text-muted-foreground">Flera länder, 200+ användare</p>
                    </div>
                    <p className="text-primary font-bold">10-30M+</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Inkluderar:</strong> Implementering, utbildning, datamigration, integrationer och omfattande projektledning. Räkna även med en viss förvaltningskostnad/supportavtal (här finns nästan lika många varianter som det finns konsultbolag), kontinuerlig användarutbildning, utbildning i nya versioner/uppdateringar samt eventuell vidareutveckling när verksamheten förändras.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Redo att transformera din verksamhet?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kontakta oss för en kostnadsfri konsultation
            </p>
            <ContactFormDialog>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 sm:h-16 rounded-xl" size="lg">
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

export default FinanceSupplyChain;
