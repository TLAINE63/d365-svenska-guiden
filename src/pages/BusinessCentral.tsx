import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import BusinessCentralIcon from "@/assets/icons/BusinessCentral.svg";

const BusinessCentral = () => {
  const bcVideos = [
    {
      title: "Business Central för Mindre och Medelstora Företag",
      description: "Komplett affärslösning för växande företag",
      videoId: "X7B99e3mNfI",
    },
    {
      title: "Din Egen Business Central Video",
      description: "Lägg in din YouTube video-ID här",
      videoId: "dQw4w9WgXcQ", // Byt ut detta mot din YouTube video-ID
    },
  ];

  const bcPricingPlans = [
    {
      title: "Business Central Team Member",
      description: "För användare med begränsade behov",
      price: "100 kr",
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
      price: "700 kr",
      features: [
        "Ekonomihantering",
        "Försäljning & Inköp",
        "Lagerhantering",
        "Projekthantering",
        "Support via e-post",
      ],
    },
    {
      title: "Business Central Premium",
      description: "För växande företag",
      price: "1 000 kr",
      features: [
        "Alla Essentials-funktioner",
        "Service Management",
        "Tillverkning",
        "Warehouse Management",
        "Prioriterad support",
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
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2070" 
            alt="Business analytics and planning" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-4">
                <img src={BusinessCentralIcon} alt="Business Central" className="h-12 w-12" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Business Central
              </h1>
              <p className="text-xl md:text-2xl text-white/95 mb-6">
                Komplett affärslösning för mindre och medelstora företag
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
              Lär dig mer om Business Central
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bcVideos.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section - Essentials vs Premium */}
      <section id="comparison" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Business Central Essentials vs Premium
              </h2>
              <p className="text-lg text-muted-foreground">
                Vilken licens passar bäst för ditt företag?
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Business Central Essentials */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Business Central Essentials</h3>
                <p className="text-muted-foreground mb-6">
                  För mindre företag med grundläggande affärsbehov
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Passar för:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Handel och tjänsteföretag</li>
                      <li>• Grundläggande lagerhantering</li>
                      <li>• Försäljning och inköp</li>
                      <li>• Ekonomi och redovisning</li>
                      <li>• 5-50 användare</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Inkluderar:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Ekonomi</li>
                      <li>• Försäljning & CRM</li>
                      <li>• Inköp</li>
                      <li>• Lager</li>
                      <li>• Projekthantering</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-primary">Pris: 700 kr/användare/månad</p>
                  </div>
                </div>
              </div>

              {/* Business Central Premium */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Business Central Premium</h3>
                <p className="text-muted-foreground mb-6">
                  För växande företag med tillverkning och avancerade behov
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Passar för:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Tillverkande företag</li>
                      <li>• Företag med service management</li>
                      <li>• Avancerad lagerhantering</li>
                      <li>• Komplexa distributionsbehov</li>
                      <li>• 10-300 användare</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Inkluderar allt i Essentials plus:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Service Management</li>
                      <li>• Tillverkning och produktionsplanering</li>
                      <li>• Warehouse Management System (WMS)</li>
                      <li>• Avancerad efterfrågeplanering</li>
                      <li>• Manufacturing execution</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-primary">Pris: 1 000 kr/användare/månad</p>
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
            {bcPricingPlans.map((plan, index) => (
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
                Vad kostar ett Business Central-projekt?
              </h2>
              <p className="text-lg text-muted-foreground">
                Ungefärliga kostnader för implementering och drift
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Implementation Costs */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-6">Implementeringskostnader</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start pb-3 border-b border-border">
                    <div>
                      <p className="font-semibold text-card-foreground">Litet projekt</p>
                      <p className="text-sm text-muted-foreground">5-10 användare, standardfunktioner</p>
                    </div>
                    <p className="text-primary font-bold">200-400k kr</p>
                  </div>
                  
                  <div className="flex justify-between items-start pb-3 border-b border-border">
                    <div>
                      <p className="font-semibold text-card-foreground">Medelstort projekt</p>
                      <p className="text-sm text-muted-foreground">10-50 användare, anpassningar</p>
                    </div>
                    <p className="text-primary font-bold">400-800k kr</p>
                  </div>
                  
                  <div className="flex justify-between items-start pb-3">
                    <div>
                      <p className="font-semibold text-card-foreground">Stort projekt</p>
                      <p className="text-sm text-muted-foreground">50+ användare, integrationer</p>
                    </div>
                    <p className="text-primary font-bold">800k-2M kr</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Inkluderar:</strong> Licensavgifter, implementering, utbildning, datamigration och projektledning
                  </p>
                </div>
              </div>

              {/* Ongoing Costs */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-6">Löpande kostnader</h3>
                
                <div className="space-y-4">
                  <div className="pb-3 border-b border-border">
                    <p className="font-semibold text-card-foreground mb-2">Licensavgifter</p>
                    <p className="text-sm text-muted-foreground mb-2">700-1 000 kr/användare/månad</p>
                    <p className="text-xs text-muted-foreground">Beroende på Essentials eller Premium</p>
                  </div>
                  
                  <div className="pb-3 border-b border-border">
                    <p className="font-semibold text-card-foreground mb-2">Support & underhåll</p>
                    <p className="text-sm text-muted-foreground mb-2">5-15% av licenskostnaden</p>
                    <p className="text-xs text-muted-foreground">Teknisk support och systemuppdateringar</p>
                  </div>
                  
                  <div className="pb-3 border-b border-border">
                    <p className="font-semibold text-card-foreground mb-2">Vidareutveckling</p>
                    <p className="text-sm text-muted-foreground mb-2">Efter behov</p>
                    <p className="text-xs text-muted-foreground">Anpassningar och nya funktioner</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-card-foreground mb-2">Utbildning</p>
                    <p className="text-sm text-muted-foreground mb-2">Efter behov</p>
                    <p className="text-xs text-muted-foreground">För nya användare och funktioner</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tips:</strong> Planera för 12-18 månaders ROI beroende på automatiseringsgrad
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
              Redo att växa med Business Central?
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

export default BusinessCentral;
