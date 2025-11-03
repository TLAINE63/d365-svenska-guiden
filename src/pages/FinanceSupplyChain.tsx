import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";

const FinanceSupplyChain = () => {
  const fscVideos = [
    {
      title: "Din Egen Finance & Supply Chain Video",
      description: "Lägg in din YouTube video-ID här",
      videoId: "dQw4w9WgXcQ", // Byt ut detta mot din YouTube video-ID
    },
    {
      title: "Introduktion till Dynamics 365 Finance",
      description: "Lär dig grunderna i Microsoft Dynamics 365 Finance och hur det kan transformera din ekonomihantering",
      videoId: "O5yecO8A_9Q",
    },
    {
      title: "Supply Chain Management Översikt",
      description: "Upptäck hur Microsoft Dynamics 365 Supply Chain Management optimerar din leveranskedja",
      videoId: "jC1EaSrB-Ak",
    },
  ];

  const fscPricingPlans = [
    {
      title: "Dynamics 365 Finance",
      description: "Avancerad finansiell hantering",
      price: "Från 2 200 kr",
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
      price: "Från 2 500 kr",
      features: [
        "Lagerhantering",
        "Produktionsplanering",
        "Inköp och leverantörshantering",
        "Lagerstyrning",
        "Transport management",
      ],
    },
    {
      title: "Finance + Supply Chain",
      description: "Komplett ERP-paket",
      price: "Från 3 800 kr",
      features: [
        "Alla Finance-funktioner",
        "Alla Supply Chain-funktioner",
        "Integrerad lösning",
        "Avancerad analys",
        "AI och automatisering",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2070" 
            alt="Supply chain and logistics" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <img src={FinanceIcon} alt="Finance" className="h-12 w-12" />
                <img src={SupplyChainIcon} alt="Supply Chain" className="h-12 w-12" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Finance & Supply Chain
              </h1>
              <p className="text-xl md:text-2xl text-white/95 mb-6">
                Företagslösning för större och ofta internationella organisationer
              </p>
              
              <Button 
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link to="/kontakt">Boka gratis rådgivning</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Videos Section */}
      <section id="videos" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Videoguider
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Lär dig mer om Finance och Supply Chain Management
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
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Finance & Supply Chain Management (F&SCM)</h3>
                
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
                    <span>Branschspecifika moduler och avancerad tillverkning</span>
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
                    <span>Allt-i-ett-lösning för ekonomi, lager, projekt</span>
                  </li>
                </ul>
              </div>
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
                <h3 className="text-2xl font-bold text-card-foreground mb-6">Implementeringskostnader</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start pb-3 border-b border-border">
                    <div>
                      <p className="font-semibold text-card-foreground">Mindre omfattning</p>
                      <p className="text-sm text-muted-foreground">En modul, 20-50 användare</p>
                    </div>
                    <p className="text-primary font-bold">2-4M kr</p>
                  </div>
                  
                  <div className="flex justify-between items-start pb-3 border-b border-border">
                    <div>
                      <p className="font-semibold text-card-foreground">Medelstor implementation</p>
                      <p className="text-sm text-muted-foreground">Finance + SCM, 50-200 användare</p>
                    </div>
                    <p className="text-primary font-bold">4-10M kr</p>
                  </div>
                  
                  <div className="flex justify-between items-start pb-3">
                    <div>
                      <p className="font-semibold text-card-foreground">Global implementation</p>
                      <p className="text-sm text-muted-foreground">Flera länder, 200+ användare</p>
                    </div>
                    <p className="text-primary font-bold">10-30M+ kr</p>
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
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
              <Link to="/kontakt">Boka Gratis Konsultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinanceSupplyChain;
