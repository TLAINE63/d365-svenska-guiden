import ProductHero from "@/components/ProductHero";
import RelatedPages, { erpRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList } from "lucide-react";
import { useEffect } from "react";
import LeadCTA from "@/components/LeadCTA";
import IndustryComparisonWidget from "@/components/IndustryComparisonWidget";
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
    answer: "ERP system jämförelse Sverige: Business Central är bäst för företag med 5–300 användare och omsättning under 1–2 miljarder – det täcker ekonomi, lager, försäljning och produktion i ett kostnadseffektivt molnsystem. Dynamics 365 Finance & Supply Chain Management (F&SCM) passar stora internationella koncerner med komplexa regulatoriska krav, multinationell ekonomistyrning och avancerad supply chain. Huvudskillnad: BC kostar 765 kr/mån vs F&SCM ca 2 007 kr/mån per användare."
  },
  {
    question: "Vad kostar Microsoft ERP system i Sverige?",
    answer: "Microsoft ERP pris Sverige 2025: Business Central Essentials 765 kr/användare/mån, Business Central Premium 1 051 kr/mån, Dynamics 365 Finance ca 2 007 kr/mån och Supply Chain Management ca 2 007 kr/mån. Implementeringskostnaden varierar: Business Central startpaket från 150 000 kr, F&SCM Enterprise-projekt från 1–5 MSEK. Välj rätt licens utifrån antal användare och funktionsbehov."
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
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="ERP – jämför Microsoft Dynamics 365 ERP-system | d365.se"
        description="ERP-jämförelse: Business Central (765 kr/mån) vs Finance & Supply Chain (2 007 kr/mån). Vi står på köparens sida när du väljer partner för Microsoft Dynamics 365."
        canonicalPath="/erp"
        keywords="erp, erp system, erp system sverige, microsoft erp, dynamics 365 erp, erp dynamics, business central vs finance scm, erp software, erp systems, dynamics 365 finance supply chain, microsoft affärssystem"
        ogImage="https://d365.se/og-erp.png"
      />
      <ServiceSchema 
        name="Microsoft Dynamics 365 ERP – jämförelse & rådgivning"
        description="Oberoende jämförelse av Microsoft Dynamics 365 ERP-system: Business Central för små och medelstora företag, Finance & Supply Chain Management för stora organisationer. Vi står på köparens sida när du väljer partner för Microsoft Dynamics 365."
      />
      <FAQSchema faqs={erpFaqs} />
      <BreadcrumbSchema items={erpBreadcrumbs} />
      <Navbar />
      
      {/* Header */}
      <ProductHero
        eyebrow="ERP"
        title="Två ERP. Två olika inriktningar."
        titleAccent="Vi guidar er rätt — innan ni väljer partner."
        subhead="Båda är fullvärdiga affärssystem. Båda heter Dynamics 365. Där börjar nyansen. Business Central är byggt för snabbare implementationer och har ett ekosystem på 7 000+ tilläggsappar som lyfter funktionaliteten långt utöver &quot;SMB-system&quot;. F&SCM är byggt med djup komplexitet i kärnan - flera entiteter, avancerad supply chain, branschvertikaler. Storleken på er verksamhet är inte det som avgör. Era processer är."
        primary={{ label: "Gör en ERP-behovsanalys", to: "/ERPbehovsanalys/", icon: ClipboardList }}
        secondary={{ label: "Jämför BC vs F&SCM", to: "/affarssystem/" }}
      />


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
            
            {/* Industry Comparison Widget */}
            <div id="branschjamforelse" className="bg-card rounded-xl p-6 sm:p-8 border border-border shadow-[var(--shadow-card)] mb-8 scroll-mt-24">
              <h3 className="text-xl font-semibold text-foreground mb-2 text-center">Branschjämförelse: Business Central vs Finance & Supply Chain Management</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">Välj din bransch, storlek och geografi för att få en skräddarsydd rekommendation</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6 max-w-3xl mx-auto">
                <strong className="text-foreground">En viktig reservation:</strong> Det är svårt att ge en helt rättvisande bild enbart utifrån dessa parametrar. Verkligheten är mer nyanserad – processernas komplexitet, befintliga systemlandskap, interna resurser och långsiktig tillväxtstrategi spelar alla in. Dessutom finns det ett brett ekosystem av tilläggsapplikationer till båda produkterna som tillför significant funktionalitet. Det gäller i synnerhet Business Central, där Microsofts AppSource-marknadsplats innehåller hundratals certifierade appar som täcker branschspecifika behov, avancerad WMS, APS, BI och mycket mer. Aktivera "Visa certifierade appar för BC" nedan för att se hur BC:s ekosystem täpper igen gapen mot F&SCM i det valda segmentet – och få en mer rättvisande helhetsbild.
              </p>
              <IndustryComparisonWidget />
            </div>

            <div className="bg-primary/10 rounded-xl p-6 sm:p-8 border border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-4">
                <ClipboardList className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Osäker på valet?</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Gör vår kostnadsfria ERP-behovsanalys för att få en personlig rekommendation 
                baserad på er verksamhet, storlek och specifika behov.
              </p>
              <Link to="/ERPbehovsanalys/">
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
                
                <Link to="/businesscentral/">
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
                
                <Link to="/finance-supply-chain/">
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
            <Link to="/ERPbehovsanalys/">
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
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(210_20%_12%)] via-[hsl(210_18%_16%)] to-[hsl(210_20%_12%)]" />
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
                    <span className="w-1.5 h-1.5 rounded-full bg-cta-orange animate-pulse" />
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
