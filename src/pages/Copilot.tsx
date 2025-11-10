import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import Navbar from "@/components/Navbar";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import CopilotLogo from "@/assets/icons/Copilot.png";

const Copilot = () => {
  const copilotVideos = [
    {
      title: "Introduction to Copilot in Microsoft Dynamics 365",
      description: "Officiell introduktion till Copilot i Dynamics 365 Finance och Operations",
      videoId: "zHzrCaso-sA",
    },
    {
      title: "Dynamics 365 Sales Copilot - Review & Demo",
      description: "En omfattande genomgång av AI-genererade sammanfattningar och mötesförberedelser",
      videoId: "xCZxq6AEneE",
    },
    {
      title: "AI och Copilot för Dynamics 365 Finance & Operations",
      description: "Lär dig om AI-funktioner i Finance, Supply Chain Management och Commerce",
      videoId: "BFPg5GJJjNY",
    },
    {
      title: "Copilot-driven Onboarding Process",
      description: "Upptäck hur Copilot förbättrar introduktionsprocessen",
      videoId: "vfyzbGHIa3E",
    },
    {
      title: "Microsoft 365 Copilot for Service",
      description: "Officiell Microsoft-video om hur Copilot transformerar kundservice",
      videoId: "l7gS1y70ErE",
    },
  ];

  return (
    <div className="min-h-screen copilot-theme" style={{
      '--primary': '189 85% 42%',
      '--primary-foreground': '0 0% 100%',
      '--accent': '185 90% 50%',
      '--accent-foreground': '0 0% 100%',
      '--gradient-primary': 'linear-gradient(135deg, hsl(189 85% 42%) 0%, hsl(185 90% 50%) 100%)',
      '--gradient-hero': 'linear-gradient(135deg, hsl(189 85% 42%) 0%, hsl(185 90% 50%) 50%, hsl(180 90% 55%) 100%)',
      '--shadow-accent': '0 8px 30px hsl(185 90% 50% / 0.3)',
    } as React.CSSProperties}>
      <Navbar />
      
      {/* Header */}
      <header className="relative overflow-hidden mt-16 h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070" 
            alt="AI and technology" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center mb-4">
                <img src={CopilotLogo} alt="Copilot" className="h-12 w-12" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Microsoft Copilot för Dynamics 365
              </h1>
              <p className="text-xl md:text-2xl text-white/95 mb-6">
                AI-driven produktivitet inbyggd i ditt affärssystem
              </p>
              
              <ContactFormDialog>
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Boka gratis rådgivning
                </Button>
              </ContactFormDialog>
            </div>
          </div>
        </div>
      </header>

      {/* What is Copilot Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Vad är Copilot?
              </h2>
              <p className="text-lg text-muted-foreground">
                Din AI-assistent för smartare arbetsflöden
              </p>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-center mb-8">
                Microsoft Copilot är en AI-driven assistent som är integrerad direkt i Dynamics 365. 
                Med Copilot kan du automatisera rutinuppgifter, få intelligenta insikter och fatta snabbare beslut 
                baserade på dina affärsdata.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Videoguider
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Lär dig mer om Copilot för Dynamics 365
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {copilotVideos.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Copilot-funktioner i Dynamics 365
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Automatisk Sammanfattning",
                  description: "Få snabba sammanfattningar av leads, affärsmöjligheter och kundinteraktioner",
                  icon: "📝"
                },
                {
                  title: "E-postutkast",
                  description: "Låt Copilot skriva professionella e-postmeddelanden baserade på kontext",
                  icon: "✉️"
                },
                {
                  title: "Mötesförberedelse",
                  description: "Få förslag på diskussionspunkter och relevant information före möten",
                  icon: "📅"
                },
                {
                  title: "Intelligent Sökning",
                  description: "Ställ frågor i naturligt språk och få svar från din affärsdata",
                  icon: "🔍"
                },
                {
                  title: "Insikter och Analys",
                  description: "Upptäck trender och mönster i din data automatiskt",
                  icon: "📊"
                },
                {
                  title: "Uppgiftsautomation",
                  description: "Automatisera rutinmässiga uppgifter med AI-drivna arbetsflöden",
                  icon: "⚡"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-card rounded-lg p-6 border border-border shadow-[var(--shadow-card)]">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Fördelar med Copilot
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Spara Tid",
                  description: "Automatisera rutinuppgifter och fokusera på värdeskapande arbete"
                },
                {
                  title: "Bättre Beslut",
                  description: "Få intelligenta insikter baserade på din affärsdata"
                },
                {
                  title: "Ökad Produktivitet",
                  description: "Effektivisera arbetsflöden och minska manuellt arbete"
                },
                {
                  title: "Förbättrad Kundupplevelse",
                  description: "Leverera snabbare och mer personlig service till dina kunder"
                }
              ].map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
              <h2 className="text-2xl font-bold text-card-foreground mb-4">Prissättning</h2>
              <div className="space-y-4 mb-6">
                <p className="text-muted-foreground text-sm">
                  Copilot är inkluderat i de flesta Dynamics 365-licenser (Enterprise och Premium-nivåer). 
                  Vissa avancerade funktioner kräver separata AI-tillägg.
                </p>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-xs text-card-foreground italic">
                    <strong>Tips:</strong> Börja med grundfunktionerna i din befintliga licens och utöka gradvis 
                    baserat på användarbehov och ROI.
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
              Redo att börja använda AI?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kontakta oss för att lära dig mer om Copilot för Dynamics 365
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
              <Link to="/kontakt">Boka Gratis Konsultation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2025 Dynamic Factory</p>
            <p className="text-sm mb-3">
              Microsoft Business Applications Evangelister
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <Link to="/dataskydd" className="hover:text-foreground transition-colors">
                Dataskyddspolicy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Copilot;
