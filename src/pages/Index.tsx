import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import BigFiveSection from "@/components/BigFiveSection";
import { PlayCircle, ArrowRight } from "lucide-react";

const Index = () => {
  const erpVideos = [
    {
      title: "Introduktion till Dynamics 365 Finance",
      description: "Lär dig grunderna i D365 Finance och hur det kan transformera din ekonomihantering",
      videoId: "Uf87oOZ-ZpM",
    },
    {
      title: "Supply Chain Management Översikt",
      description: "Upptäck hur D365 Supply Chain Management optimerar din leveranskedja",
      videoId: "5OoBvP0Sty0",
    },
    {
      title: "Business Central för Små och Medelstora Företag",
      description: "Komplett affärslösning för växande företag",
      videoId: "jCYI69BFKPE",
    },
  ];

  const ceVideos = [
    {
      title: "Dynamics 365 Sales",
      description: "Maximera dina försäljningsresultat med intelligent CRM",
      videoId: "VgFo8s2KhKI",
    },
    {
      title: "Marketing Automation",
      description: "Skapa personliga kundresor med D365 Marketing",
      videoId: "6pJM3F0nB-U",
    },
    {
      title: "Customer Service och Support",
      description: "Leverera exceptionell kundservice med AI-driven insikter",
      videoId: "sWKW3Zm3HQs",
    },
    {
      title: "Dynamics 365 Contact Center",
      description: "Moderna kontaktcenterlösningar med AI och automation",
      videoId: "6pJM3F0nB-U",
    },
  ];

  const pricingPlans = [
    {
      title: "Business Central Essentials",
      description: "För små företag",
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
      popular: true,
    },
    {
      title: "Finance & Operations",
      description: "För stora organisationer",
      price: "Från 2 500 kr",
      features: [
        "Avancerad ekonomi",
        "Global Supply Chain",
        "Asset Management",
        "HR & Payroll",
        "24/7 Premium support",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-primary-foreground">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6TTAgMTZjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMlMwIDIyLjYyNyAwIDE2em0zNiAzNmMwLTYuNjI3IDUuMzczLTEyIDEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyek0wIDUyYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTJTMCA1OC42MjcgMCA1MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                <PlayCircle className="inline w-4 h-4 mr-2" />
                Videoguider & Ärliga Svar
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Allt du behöver veta om<br />Microsoft Dynamics 365
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              Ärliga svar på priser, implementering och funktioner. 80% videoinnehåll för att göra det enkelt att förstå.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" variant="secondary" className="text-lg group">
                Se Videoguider
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg border-2 border-white text-white hover:bg-white hover:text-primary">
                Prisöversikt
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </header>

      {/* Big Five Section */}
      <BigFiveSection />

      {/* ERP Videos Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ERP-Applikationer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upptäck hur Dynamics 365 Finance, Supply Chain och Business Central kan transformera din verksamhet
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {erpVideos.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Engagement Videos Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Customer Engagement
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sales, Customer Service och Marketing - allt för att bygga starkare kundrelationer
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ceVideos.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Transparenta Priser
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Inga dolda kostnader. Här är våra licenspriser (exkl. moms)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Alla priser är approximativa och kan variera beroende på din specifika konfiguration
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Pricing Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Implementeringskostnader
              </h2>
              <p className="text-lg text-muted-foreground">
                Kostnaderna för implementering varierar baserat på dina behov
              </p>
            </div>
            <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-8 space-y-6 border border-border">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-card-foreground">Grundimplementering</h3>
                  <p className="text-muted-foreground">Standarduppsättning av Business Central</p>
                  <div className="text-3xl font-bold text-primary">150 000 - 300 000 kr</div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 2-4 månaders projekt</li>
                    <li>• Standardprocesser</li>
                    <li>• Grundläggande utbildning</li>
                    <li>• Datamigration</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-card-foreground">Avancerad Implementering</h3>
                  <p className="text-muted-foreground">Anpassad lösning med integrationer</p>
                  <div className="text-3xl font-bold text-primary">500 000 - 2 000 000+ kr</div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 4-12 månaders projekt</li>
                    <li>• Anpassade processer</li>
                    <li>• Omfattande utbildning</li>
                    <li>• Flera integrationer</li>
                  </ul>
                </div>
              </div>
              <div className="pt-6 border-t border-border">
                <h4 className="font-semibold text-card-foreground mb-3">Faktorer som påverkar priset:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>• Antal användare och moduler</div>
                  <div>• Anpassningsbehov</div>
                  <div>• Datavolym och kvalitet</div>
                  <div>• Integrationer med andra system</div>
                  <div>• Utbildningsbehov</div>
                  <div>• Geografisk spridning</div>
                </div>
              </div>
              <div className="pt-6">
                <Button className="w-full md:w-auto bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] hover:opacity-90 text-primary-foreground" size="lg">
                  Boka Gratis Konsultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Vanliga Frågor
              </h2>
              <p className="text-lg text-muted-foreground">
                Svar på de vanligaste frågorna om Dynamics 365
              </p>
            </div>
            <div className="space-y-6">
              {[
                {
                  question: "Hur lång tid tar en implementering?",
                  answer: "En grundläggande Business Central-implementering tar typiskt 2-4 månader. Mer komplexa projekt med Finance & Operations kan ta 6-12 månader beroende på omfattning och anpassningsbehov.",
                },
                {
                  question: "Kan vi börja smått och växa?",
                  answer: "Absolut! Många av våra kunder börjar med Business Central Essentials och uppgraderar till Premium eller Finance & Operations när verksamheten växer. Microsoft Dynamics 365 är byggt för att skala med din verksamhet.",
                },
                {
                  question: "Vad ingår i licenspriset?",
                  answer: "Licenspriset inkluderar tillgång till systemet, kontinuerliga uppdateringar, säkerhet och grundläggande support. Implementering, anpassningar och utökad support faktureras separat.",
                },
                {
                  question: "Kan vi integrera med våra befintliga system?",
                  answer: "Ja, Dynamics 365 har utmärkta integrationsmöjligheter. Vi kan koppla ihop med de flesta moderna system via API:er, och det finns färdiga kopplingar till populära tredjepartslösningar.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-card rounded-lg p-6 shadow-[var(--shadow-card)] border border-border">
                  <h3 className="text-lg font-semibold text-card-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Redo att Komma Igång?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Boka en gratis konsultation så hjälper vi dig att hitta rätt lösning för din verksamhet
          </p>
          <Button size="lg" variant="secondary" className="text-lg">
            Kontakta Oss Idag
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2025 Dynamic Factory</p>
            <p className="text-sm">
              Vi svarar ärligt på alla frågor enligt "They Ask, You Answer"-metoden
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
