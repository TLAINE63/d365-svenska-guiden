import RelatedPages, { fscRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ArrowLeft, ArrowRight, ExternalLink, FileText } from "lucide-react";
import { FilterButtons } from "@/components/FilterButtons";
import LeadCTA from "@/components/LeadCTA";
import PartnerCard from "@/components/PartnerCard";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { allIndustries } from "@/data/partners";
import { usePartners } from "@/hooks/usePartners";
import { filterAndSortPartners, getProductIndustries } from "@/hooks/usePartnerFilters";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

// Breadcrumb items
const fscBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Affärssystem (ERP)", url: "https://d365.se/erp" },
  { name: "Finance & Supply Chain", url: "https://d365.se/finance-supply-chain" },
];
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Finance & Supply Chain FAQs for schema
const fscFaqs = [
  { question: "Vad kostar Dynamics 365 Finance och Supply Chain Management?", answer: "Dynamics 365 Finance kostar 2 007,30 kr per användare och månad. Supply Chain Management kostar lika mycket – 2 007,30 kr per användare/mån. Human Resources kostar 1 290,40 kr/mån. Implementeringskostnader för medelstora till stora organisationer varierar från 2 till 10+ miljoner kronor beroende på komplexitet, antal juridiska entiteter och anpassningsbehov." },
  { question: "Dynamics 365 Finance & SCM vs SAP S/4HANA – vilket ERP ska jag välja?", answer: "Dynamics 365 Finance & SCM är optimalt för organisationer i Microsoft-ekosystemet med ett starkt behov av Office 365/Teams-integration och lägre total ägandekostnad. SAP S/4HANA är branschledande inom tung processindustri och kemi. D365 F&SCM har fördelen av inbyggd Copilot AI, snabbare implementationstider och lägre licenspriser. För nordiska medelstora till stora tillverkningsföretag är D365 F&SCM ofta det starkare alternativet." },
  { question: "Vad är skillnaden mellan Dynamics 365 Finance & SCM och Business Central?", answer: "Business Central riktar sig till SMB-segmentet (upp till ca 300 användare) med fokus på enkelhet och lägre pris (från 765 kr/mån). Finance & SCM är enterprise-lösningen för komplexa globala organisationer med flera juridiska entiteter, avancerad tillverkning och supply chain. F&SCM har betydligt djupare funktionalitet inom ekonomi, lagerstyrning (WMS), produktionsplanering (MRP/MPS) och global compliance." },
  { question: "Hur lång tid tar det att implementera Dynamics 365 Finance & Supply Chain?", answer: "En typisk F&SCM-implementation tar 9–24 månader beroende på komplexitet. En Dynamics 365 Finance-only-implementation för en juridisk entitet kan göras på 6–9 månader. Komplett Finance + SCM med tillverkning och WMS för en global organisation tar 18–36 månader. Vi rekommenderar alltid en fasad implementation för att minimera risker och leverera värde snabbt." },
  { question: "Vilka branscher passar Dynamics 365 Finance & Supply Chain bäst för?", answer: "F&SCM är optimalt för: tillverkning (diskret och processindustri), grossist och distribution, läkemedel och life science, livsmedel och dryck, detaljhandel med komplex supply chain, offentlig sektor och statliga organisationer samt internationella koncerner med flera bolag och valutor. Lösningen har inbyggd branschfunktionalitet och ett rikt ekosystem av ISV-tillägg." },
  { question: "Hur fungerar Copilot AI i Dynamics 365 Finance & Supply Chain?", answer: "Copilot i Finance analyserar ekonomidata och identifierar avvikelser, föreslår matchning av bankposter, genererar finansiella rapporter och sammanfattar avvikelser. Copilot i Supply Chain varnar för leveransrisker, optimerar inköpsplaner, identifierar flaskhalsar i produktionen och föreslår omplaneringar vid störningar. Copilot är inkluderat utan extra kostnad i F&SCM-licensen." },
  { question: "Hur flexibelt och anpassningsbart är Dynamics 365 F&SCM?", answer: "F&SCM är mycket flexibelt och anpassas via tre nivåer: (1) Konfiguration via parameterinställningar utan kod, (2) Utökning via Power Platform och low-code, (3) Specialutveckling i X++ för komplexa anpassningar. Det finns ett rikt ISV-ekosystem med hundratals branschlösningar på Microsoft Marketplace. Alla anpassningar separeras från kärnkoden för enklare uppgradering." },
  { question: "Kan Dynamics 365 F&SCM integreras med befintliga system och tredjepartsprogram?", answer: "Ja, F&SCM har robusta integrationsmöjligheter via OData-API:er, Azure Service Bus, Logic Apps och Power Automate. Färdiga kopplingar finns för populära system som Salesforce, Shopify, Amazon och EDI-nätverk. Integration med produktionssystem (MES, SCADA), WMS-system, 3PL-providers och bankgiro/autogiro är välbeprövade scenarier." },
];

// Geography filter options
const geographyFilters = [
  { label: "Sverige", value: "Sverige" },
  { label: "Norden", value: "Norden" },
  { label: "Europa", value: "Europa" },
  { label: "Övriga världen", value: "Övriga världen" }
];

const FinanceSupplyChain = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedGeography, setSelectedGeography] = useState<string | null>(null);
  
  // Fetch partners from database (only featured partners)
  const { data: partners = [], isLoading } = usePartners();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter partners for Finance & Supply Chain
  const fscPartners = useMemo(() => {
    return filterAndSortPartners(
      partners, 
      'fsc', 
      selectedIndustry, 
      selectedGeography, 
      null, // companySize
      null // regions
    );
  }, [partners, selectedIndustry, selectedGeography]);

  // Get available industries for FSC partners
  const fscIndustries = useMemo(() => {
    return getProductIndustries(partners, 'fsc', allIndustries);
  }, [partners]);


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
      price: "2 007,30 kr",
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
      price: "2 007,30 kr",
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
      price: "1 290,40 kr",
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
      <SEOHead 
        title="Dynamics 365 Finance & Supply Chain – ERP för Enterprise | Priser & SAP-alternativ | d365.se"
        description="Guide till Microsoft Dynamics 365 Finance & Supply Chain. Priser från 2 007 kr/mån, SAP S/4HANA-alternativ, global ERP för tillverkning och distribution. Implementeringstid 9–24 mån."
        canonicalPath="/finance-supply-chain"
        keywords="Dynamics 365 Finance pris, Supply Chain Management Microsoft, SAP alternativ ERP, Dynamics 365 Finance SCM, enterprise ERP Sverige, ERP tillverkning, global ekonomihantering, Dynamics 365 vs SAP, supply chain system Microsoft, ERP grossist distribution"
        ogImage="https://d365.se/og-finance-scm.png"
      />
      <FAQSchema faqs={fscFaqs} />
      <ServiceSchema 
        name="Microsoft Dynamics 365 Finance & Supply Chain Management – Enterprise ERP"
        description="Enterprise ERP-lösning för global ekonomihantering, supply chain, tillverkning och distribution. Licenspris från 2 007,30 kr per användare och månad. SAP-alternativ med inbyggd Copilot AI. Implementationstid 9–36 månader beroende på komplexitet."
      />
      <BreadcrumbSchema items={fscBreadcrumbs} />
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
                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/95 text-slate-800 hover:bg-slate-200 w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl"
                >
                  <Link to="/kravspecifikation">
                    <FileText className="mr-2 h-5 w-5" />
                    Generera en kravspecifikation
                  </Link>
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
                  Licenspriser börjar från 2 007,30 kr/månad för Finance och 2 007,30 kr/månad för Supply Chain Management. Totalkostnaden påverkas av antal användare, vilka applikationer ni behöver, omfattning av anpassningar, integration med befintliga system samt implementeringstid. För stora organisationer kan implementeringskostnader variera från 2-10 miljoner kronor eller mer, beroende på komplexitet.
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
                  En typisk F&SCM-implementering tar 9-24 månader beroende på omfattning och komplexitet. Processen följer vanligtvis följande faser: (1) Analys och planering, (2) Design och konfiguration, (3) Datamigrering, (4) Testning och validering, (5) Utbildning, (6) Go-live och (7) Stabilisering. Kan en fasad implementering, där ni rullar ut funktionaliteten stegvis för att minimera risker, vara en variant för er?
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

      {/* Internal Link: Business Central for SMB */}
      <section className="py-12 sm:py-16 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left: Context */}
                <div className="p-6 sm:p-8">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Är Finance & SCM rätt för er?</p>
                  <h2 className="text-xl sm:text-2xl font-bold text-card-foreground mb-3">
                    Kanske passar Business Central bättre?
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    Finance & Supply Chain är optimalt för globala enterprise-organisationer med 200+ användare. 
                    Är ni ett medelstort svenskt bolag med upp till 300 användare och en enda juridisk enhet? 
                    Då är <strong>Dynamics 365 Business Central</strong> nästan alltid ett bättre val – lägre kostnad, 
                    snabbare implementation och lättare att hitta kompetenta partners.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      Pris från 765 kr/mån (vs 2 007 kr för Finance)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      Implementation 3–9 månader (vs 9–24 månader)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      Samma inbyggda Copilot AI
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      Fler specialiserade SMB-partners i Sverige
                    </li>
                  </ul>
                  <Button asChild className="bg-business-central hover:bg-business-central/90 text-white">
                    <Link to="/business-central">
                      Läs mer om Business Central
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                {/* Right: When to choose F&SCM */}
                <div className="bg-finance-supply/10 p-6 sm:p-8 border-t md:border-t-0 md:border-l border-border">
                  <p className="text-xs font-bold text-finance-supply uppercase tracking-widest mb-3">Finance & SCM passar när ni har...</p>
                  <ul className="space-y-3 text-sm text-foreground">
                    {[
                      "Flera juridiska entiteter eller bolag",
                      "Avancerad tillverkning (MRP/MPS)",
                      "Globala supply chain-flöden",
                      "200+ systemanvändare",
                      "Komplexa valutor- och compliancekrav",
                      "SAP och letar ett modernt alternativ"
                    ].map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="text-finance-supply font-bold mt-0.5">→</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/erp">
                        Jämför Business Central vs Finance &amp; SCM
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
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

          {/* Geography Filter */}
          <FilterButtons
            title="Ange vart geografiskt ni har er verksamhet och som är relevant för denna lösning (organisation, kontor/personal)"
            icon="geography"
            options={geographyFilters.map(g => ({ label: g.label, value: g.value }))}
            selectedValue={selectedGeography}
            onSelect={setSelectedGeography}
            colorScheme="finance-supply"
          />

          {/* Filter Results Summary */}
          {(selectedIndustry || selectedGeography) && (
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground">
                Visar <span className="font-semibold text-foreground">{fscPartners.length}</span> partners
                {selectedIndustry && <> inom <span className="font-semibold text-finance-supply">{selectedIndustry}</span></>}
                {(selectedIndustry && selectedGeography) && <> och</>}
                {selectedGeography && <> med täckning i <span className="font-semibold text-finance-supply">{selectedGeography}</span></>}
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

          {fscPartners.length === 0 ? (
            <div className="text-center py-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Inga partner listas med denna filtrering?</h3>
              <p className="text-muted-foreground">
                Ingen fara, kontakta oss så hjälper vi dig att hitta en eller ett par partners som passar för din verksamhet.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {fscPartners.map((partner, index) => {
                // Build profile URL with filter context
                const baseUrl = `/partner/${partner.slug}`;
                const params = new URLSearchParams();
                params.set("product", "Finance & SCM");
                if (selectedIndustry) {
                  params.set("industry", selectedIndustry);
                }
                if (selectedGeography) {
                  params.set("geography", selectedGeography);
                }
                const profileUrl = `${baseUrl}?${params.toString()}`;
                
                return (
                  <PartnerCard
                    key={index}
                    partner={partner}
                    profileUrl={profileUrl}
                    colorScheme="primary"
                    productKey="fsc"
                    highlightedProduct="Finance & SCM"
                    highlightedIndustry={selectedIndustry || undefined}
                    highlightedGeography={selectedGeography || undefined}
                    showRandomIndicator={true}
                  />
                );
              })}
            </div>
          )}

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
                        Finance & Supply Chain
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
                    sourcePage="/finance-supply-chain"
                    selectedProduct="Finance & Supply Chain"
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

      <RelatedPages pages={fscRelatedPages} heading="Utforska vidare" />
      <Footer />
    </div>
  );
};

export default FinanceSupplyChain;
