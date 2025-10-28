import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import dynamicFactoryLogo from "@/assets/dynamic-factory-logo.jpg";

const FinanceSupplyChain = () => {
  const fscVideos = [
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
      {/* Header */}
      <header className="bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(198,80%,45%)] to-[hsl(var(--accent))] text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6TTAgMTZjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMlMwIDIyLjYyNyAwIDE2em0zNiAzNmMwLTYuNjI3IDUuMzczLTEyIDEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyek0wIDUyYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTJTMCA1OC42MjcgMCA1MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Link to="/" className="inline-block mb-4">
              <img 
                src={dynamicFactoryLogo} 
                alt="Dynamic Factory" 
                className="h-16 md:h-20 mx-auto"
              />
            </Link>
            <Link to="/" className="inline-flex items-center text-primary-foreground/90 hover:text-primary-foreground mb-4">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Tillbaka till startsidan
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Finance & Supply Chain
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              Företagslösning för större och ofta internationella organisationer
            </p>
          </div>
        </div>
      </header>

      {/* Videos Section */}
      <section className="py-20 bg-background">
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
      <section className="py-20 bg-secondary/50">
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
              {/* Finance & Supply Chain */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Finance & Supply Chain</h3>
                <p className="text-muted-foreground mb-6">
                  För större organisationer med komplexa behov
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Passar för:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Stora företag och koncerner</li>
                      <li>• Komplexa processer och många integrationer</li>
                      <li>• Globala verksamheter</li>
                      <li>• Avancerade branschspecifika behov</li>
                      <li>• Många samtidiga användare</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Styrkor:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Kraftfull funktionalitet och anpassningsbarhet</li>
                      <li>• Avancerad supply chain management</li>
                      <li>• Global finansiell hantering</li>
                      <li>• AI och avancerad analytics</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-primary">Pris: Från 2 500 kr/användare/månad</p>
                  </div>
                </div>
              </div>

              {/* Business Central */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Business Central</h3>
                <p className="text-muted-foreground mb-6">
                  För mindre och medelstora företag
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Passar för:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Mindre och medelstora företag</li>
                      <li>• Företag med enklare processer</li>
                      <li>• Snabb implementering (2-6 månader)</li>
                      <li>• Begränsad budget</li>
                      <li>• En eller få lokalisationer</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Styrkor:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Lägre kostnader och snabbare ROI</li>
                      <li>• Enklare att använda och implementera</li>
                      <li>• Inbyggd integration med Microsoft 365</li>
                      <li>• Flexibel och skalbar</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-primary">Pris: Från 700 kr/användare/månad</p>
                  </div>
                </div>
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
            <Button className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0" size="lg">
              Boka Gratis Konsultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinanceSupplyChain;
