import RelatedPages, { erpRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList } from "lucide-react";
import { useEffect } from "react";
import LeadCTA from "@/components/LeadCTA";
import SEOHead from "@/components/SEOHead";
import { ServiceSchema, BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";

// Breadcrumb items
const erpBreadcrumbs = [
  { name: "Hem", url: "https://d365.se" },
  { name: "Affärssystem (ERP)", url: "https://d365.se/erp" },
];

// ERP FAQs for schema
const erpFaqs = [
  {
    question: "Vilket ERP system passar bäst i Sverige – jämförelse Business Central vs Finance & SCM?",
    answer: "ERP system jämförelse Sverige: Business Central är bäst för företag med 5–300 användare och omsättning under 1–2 miljarder – det täcker ekonomi, lager, försäljning och produktion i ett kostnadseffektivt molnsystem. Dynamics 365 Finance & Supply Chain Management (F&SCM) passar stora internationella koncerner med komplexa regulatoriska krav, multinationell ekonomistyrning och avancerad supply chain. Huvudskillnad: BC kostar 884 kr/mån vs F&SCM ca 3 700 kr/mån per användare."
  },
  {
    question: "Vad kostar Microsoft ERP system i Sverige?",
    answer: "Microsoft ERP pris Sverige 2025: Business Central Essentials 884 kr/användare/mån, Business Central Premium 1 216 kr/mån, Dynamics 365 Finance ca 3 700 kr/mån och Supply Chain Management ca 3 700 kr/mån. Implementeringskostnaden varierar: Business Central startpaket från 150 000 kr, F&SCM Enterprise-projekt från 1–5 MSEK. Välj rätt licens utifrån antal användare och funktionsbehov."
  },
  {
    question: "Vad är skillnaden mellan Business Central och Finance & Supply Chain?",
    answer: "Business Central är designat för SMB (5–300 användare) och täcker ekonomi, lager, försäljning och produktion (Premium). Finance & Supply Chain Management riktar sig till enterprise med krav på global juridisk struktur, avancerat MRP/MPS, WMS och komplexa internprissättningsregler. Business Central är snabbare att implementera (3–6 mån vs 9–18 mån) och har lägre total ägandekostnad för de flesta medelstora företag."
  },
  {
    question: "Hur lång tid tar ERP implementation i Sverige med Dynamics 365?",
    answer: "ERP implementation Sverige: Business Central tar typiskt 3–6 månader. Dynamics 365 Finance & Supply Chain Management kräver normalt 9–18 månader. Tidsåtgången beror på komplexitet, antal anpassningar och hur väl förberedda processer och data är. Microsoft-certifierade partners arbetar enligt Success by Design-metodik för att säkra projektleveransen."
  },
  {
    question: "Vilket Microsoft ERP-system passar mitt företag?",
    answer: "Välj Business Central om: du har 5–300 användare, omsättning under 1–2 miljarder, behov av ett komplett men lätthanterligt system. Välj Finance & SCM om: du är en global koncern med flera juridiska entiteter, komplexa regulatoriska krav, avancerad tillverkning med MRP/MPS eller global supply chain. En oberoende behovsanalys hjälper dig välja rätt – utan säljpåverkan."
  },
  {
    question: "Behöver vi en Microsoft-partner för att implementera Dynamics 365 ERP?",
    answer: "Ja, alla Dynamics 365 ERP-implementeringar görs via Microsoft-certifierade partners (Solutions Partner for Business Applications). Valet av rätt partner är lika viktigt som valet av system – en erfaren partner med branschkännedom kan halvera implementationstiden. På d365.se kan du jämföra och filtrera certifierade ERP-partners baserat på din bransch och geografi kostnadsfritt."
  },
  {
    question: "Kan Microsoft Dynamics 365 ERP integreras med befintliga system?",
    answer: "Ja, Dynamics 365 ERP integreras via REST API:er, Microsoft Power Platform (Power Automate) och ett rikt ekosystem av färdiga kopplings-appar mot vanliga system som Shopify, Magento, EDI-lösningar, lönesystem och branschspecifika applikationer. Business Central har inbyggd Shopify-integration. F&SCM har djupare enterprise-integrationsmöjligheter via Azure Integration Services."
  },
];

import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";

const ERPOverview = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="ERP system Sverige – Business Central vs Finance & SCM jämförelse"
        description="Jämför ERP system Sverige: Business Central från 884 kr/mån vs Finance & SCM från 3 700 kr/mån. Oberoende guide till val av Microsoft ERP och certifierad partner."
        canonicalPath="/erp"
        keywords="ERP system Sverige jämförelse, Microsoft ERP Sverige, Business Central vs Finance SCM, affärssystem jämförelse Sverige, Dynamics 365 ERP pris, ERP implementation Sverige, Microsoft affärssystem SMB, Dynamics 365 Finance Supply Chain, ERP system medelstora företag"
        ogImage="https://d365.se/og-erp.png"
      />
      <ServiceSchema 
        name="Microsoft Dynamics 365 ERP – Rådgivning & Partnerval"
        description="Oberoende rådgivning för val av rätt Microsoft Dynamics 365 ERP-system i Sverige. Jämför Business Central och Finance & Supply Chain Management baserat på dina krav och budget."
      />
      <FAQSchema faqs={erpFaqs} />
      <BreadcrumbSchema items={erpBreadcrumbs} />
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[350px] sm:h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2070" 
            alt="ERP system overview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                <span className="block">Microsoft Dynamics 365</span>
                <span className="block">ERP – Affärssystem</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-4 sm:mb-6">
                <span className="block">Välj rätt affärssystem för din organisation.</span>
                <span className="block">Är det Business Central eller Finance & Supply Chain Management?</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/behovsanalys">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl"
                  >
                    <ClipboardList className="mr-2 h-5 w-5" />
                    Gör en ERP Behovsanalys
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
              Vilket ERP-system passar dig?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Microsoft erbjuder två kraftfulla ERP-lösningar inom Dynamics 365-familjen. 
              Valet beror på er organisations storlek, komplexitet och framtida ambitioner.
              Nedan ser du en jämförelse som hjälper dig förstå skillnaderna.
            </p>
            
            <div className="bg-primary/10 rounded-xl p-6 sm:p-8 border border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-4">
                <ClipboardList className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Osäker på valet?</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Gör vår kostnadsfria ERP-behovsanalys för att få en personlig rekommendation 
                baserad på er verksamhet, storlek och specifika behov.
              </p>
              <Link to="/behovsanalys">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Starta behovsanalysen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                Business Central vs Finance & Supply Chain
              </h2>
              <p className="text-lg text-muted-foreground">
                Två kraftfulla ERP-system – men för olika behov
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Business Central */}
              <div className="bg-card rounded-lg p-6 sm:p-8 border border-border shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3 mb-4">
                  <img src={BusinessCentralIcon} alt="Business Central" className="h-10 w-10" />
                  <h3 className="text-xl sm:text-2xl font-bold text-card-foreground">Business Central</h3>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Perfekt för mindre och medelstora företag som behöver ett komplett, 
                  kraftfullt och användarvänligt affärssystem.
                </p>
                
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🏪</span>
                    <span>Anpassat för mindre och medelstora företag</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">⚡</span>
                    <span>Snabb implementation (vanligt med 3-6 månader)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">💰</span>
                    <span>Jämförelsevis låga licenskostnader och ofta väldigt bra TCO</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🎯</span>
                    <span>Enkel att använda och lära sig</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">📊</span>
                    <span>Ekonomi, order, lager, inköp, tillverkning/montering, serviceorder och försäljning samlat i ett rollanpassat verksamhetssystem</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🔌</span>
                    <span>Rikt ekosystem av tillägg via Microsoft Marketplace med fler än 7.000 tilläggsappar</span>
                  </li>
                </ul>
                
                <Link to="/business-central">
                  <Button variant="outline" className="w-full border-business-central text-business-central hover:bg-business-central hover:text-white">
                    Läs mer om Business Central
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Finance & Supply Chain Management */}
              <div className="bg-card rounded-lg p-6 sm:p-8 border border-border shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3 mb-4">
                  <img src={FinanceIcon} alt="Finance" className="h-10 w-10" />
                  <img src={SupplyChainIcon} alt="Supply Chain" className="h-10 w-10" />
                  <h3 className="text-xl sm:text-2xl font-bold text-card-foreground">Finance & Supply Chain</h3>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Kraftfull lösning för större, internationella organisationer med 
                  komplexa behov och höga krav.
                </p>
                
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🏢</span>
                    <span>Anpassat för större, internationella organisationer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🌍</span>
                    <span>Enterprise‑skala från start: Flerbolag, flervaluta och flerspråk med inbyggd lokalisering och regelefterlevnad för global drift</span>
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
                    <span className="text-xl">🏭</span>
                    <span>Flera branschspecifika applikationer inom bl.a. tillverkning och supply chain</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🧩</span>
                    <span>Djup integration med hela Microsoft-ekosystemet</span>
                  </li>
                </ul>
                
                <Link to="/finance-supply-chain">
                  <Button variant="outline" className="w-full border-finance-supply text-finance-supply hover:bg-finance-supply hover:text-white">
                    Läs mer om Finance & Supply Chain
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
              Första hjälpen
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Vår ERP-behovsanalys tar bara några minuter och ger dig en 
              vägledning baserad på ditt företags specifika förutsättningar.
            </p>
            <Link to="/behovsanalys">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg h-14 sm:h-16 rounded-xl px-8"
              >
                <ClipboardList className="mr-2 h-5 w-5" />
                Starta ERP Behovsanalysen
              </Button>
            </Link>
          </div>
          
          {/* Premium Contact CTA Card */}
          <div className="max-w-xl mx-auto">
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
                      Vill du prata med oss direkt?
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base">
                      Låt oss hjälpa dig hitta rätt ERP-lösning och partner – helt kostnadsfritt.
                    </p>
                  </div>
                </div>
                
                {/* Filter context with glass effect */}
                <div className="mb-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Produktområde
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary/40 text-white border-primary/50 py-1.5 px-3 backdrop-blur-sm">
                      ERP / Affärssystem
                    </Badge>
                  </div>
                </div>
                
                <LeadCTA 
                  sourcePage="/erp"
                  variant="inline" 
                  selectedProduct="ERP"
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <RelatedPages pages={erpRelatedPages} heading="Utforska vidare" />
      <Footer />
    </div>
  );
};

export default ERPOverview;
