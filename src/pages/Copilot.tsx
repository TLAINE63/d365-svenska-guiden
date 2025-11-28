import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import CopilotLogo from "@/assets/icons/Copilot.png";

const Copilot = () => {
  const copilotVideos = [
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
    {
      title: "Microsoft Copilot Demo",
      description: "Upptäck hur Copilot kan förbättra ditt arbetsflöde",
      videoId: "_Bs_6zkdmws",
    },
    {
      title: "Copilot i Dynamics 365",
      description: "Se hur Copilot fungerar i praktiken",
      videoId: "GMwtXDx-JUI",
    },
    {
      title: "Microsoft Copilot i Dynamics 365",
      description: "Utforska Copilot-funktioner i Dynamics 365",
      videoId: "CYejFpBXWBM",
    },
    {
      title: "Copilot för Dynamics 365",
      description: "Se hur Copilot kan transformera ditt arbete",
      videoId: "43S3_bV8ht0",
    },
    {
      title: "Copilot i Dynamics 365",
      description: "Upptäck möjligheterna med Copilot",
      videoId: "nb61yBqEY5Y",
    },
    {
      title: "Copilot för Dynamics 365",
      description: "Lär dig mer om Copilot-funktioner",
      videoId: "m8MCEZ8OBqk",
    },
    {
      title: "Copilot i Dynamics 365",
      description: "Utforska Copilot-funktioner",
      videoId: "0Bqzjar82OQ",
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
      <header className="relative overflow-hidden mt-16 h-[350px] sm:h-[450px] md:h-[550px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070" 
            alt="AI and technology" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="flex items-center mb-3 sm:mb-4">
                <img src={CopilotLogo} alt="Copilot" className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Microsoft Copilot för Dynamics 365
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-4 sm:mb-6">
                AI-driven produktivitet inbyggd i ditt affärssystem
              </p>
              
              <ContactFormDialog>
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto text-base sm:text-lg h-12 sm:h-auto"
                >
                  Boka gratis rådgivning
                </Button>
              </ContactFormDialog>
            </div>
          </div>
        </div>
      </header>

      {/* Agents Intro Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-6 sm:p-8 border-2 border-primary/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-gradient-to-br from-primary to-accent w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2">
                    Microsoft Ignite 2025
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground mb-3">
                    Från Copilot till Agents - Nästa steg i AI-evolutionen
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground mb-4">
                    Medan <strong>Copilot</strong> fungerar som din AI-assistent som hjälper dig med uppgifter, 
                    representerar <strong>Agents</strong> nästa generation - autonoma AI-system som arbetar 
                    självständigt 24/7 för att lösa komplexa affärsprocesser.
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                    <span>👤</span> Copilot
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Hjälper användaren med uppgifter</li>
                    <li>• Kräver användarinteraktion</li>
                    <li>• Ger förslag och rekommendationer</li>
                    <li>• Arbetar inom en applikation</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
                  <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                    <span>⚡</span> Agents
                  </h4>
                  <ul className="space-y-1 text-foreground/90 font-medium">
                    <li>• Utför hela arbetsflöden automatiskt</li>
                    <li>• Arbetar självständigt 24/7</li>
                    <li>• Fattar beslut baserat på affärsregler</li>
                    <li>• Koordinerar mellan system och team</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button asChild variant="outline" size="lg">
                  <Link to="/agents">
                    Läs mer om Microsoft Agents
                    <span className="ml-2">→</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Copilot Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Vad är Copilot?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Din AI-assistent för smartare arbetsflöden
              </p>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-center mb-8">
                Microsoft Copilot är en AI-driven assistent som är integrerad direkt i Dynamics 365. 
                Med Copilot kan du automatisera rutinuppgifter, få intelligenta insikter och fatta snabbare beslut 
                baserade på dina affärsdata. Copilot stödjer användaren genom att ge förslag, generera innehåll 
                och hjälpa till med analyser - medan Microsoft Agents tar det ett steg längre genom att 
                autonomt utföra hela arbetsflöden.
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
              Korta inspirationsvideos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Här har vi samlat ett antal väldigt korta videos för att ge en introduktion till olika områden
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
                <span className="whitespace-nowrap">Exempel på Copilot-funktioner i Dynamics 365</span>
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
            <ContactFormDialog>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
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

export default Copilot;
