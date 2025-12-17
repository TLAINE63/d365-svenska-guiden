import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList } from "lucide-react";
import { useEffect } from "react";
import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";

const ERPOverview = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
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
                Microsoft Dynamics 365 ERP
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-4 sm:mb-6">
                Välj rätt affärssystem för din organisation – Business Central eller Finance & Supply Chain Management
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
                    <span>Snabb implementation (3-6 månader)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">💰</span>
                    <span>Lägre licenskostnader och TCO</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🎯</span>
                    <span>Enkel att använda och lära sig</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">📊</span>
                    <span>Ekonomi, lager, inköp, försäljning i ett</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🔌</span>
                    <span>Rikt ekosystem av tillägg via Microsoft Marketplace</span>
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
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
              Få en personlig rekommendation
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Vår ERP-behovsanalys tar bara några minuter och ger dig en tydlig 
              rekommendation baserad på ditt företags specifika förutsättningar.
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ERPOverview;
