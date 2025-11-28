import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import { Sparkles, Zap, Brain, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Agents = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const agentVideos = [
    {
      title: "Microsoft Agents - The Future of AI",
      description: "Upptäck nästa generation av AI-automation med autonoma agenter",
      videoId: "",
    },
    {
      title: "Agents i Dynamics 365",
      description: "Se hur Agents revolutionerar affärsprocesser",
      videoId: "",
    },
    {
      title: "From Copilot to Agents",
      description: "Från AI-assistent till autonom agent - evolutionen av AI",
      videoId: "",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <header className="relative overflow-hidden mt-16 h-[400px] sm:h-[500px] md:h-[600px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070" 
            alt="AI and autonomous agents" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4 sm:mb-6">
                <Sparkles className="h-4 w-4" />
                <span>Microsoft Ignite 2025 - Det senaste inom AI</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4">
                Microsoft Agenter
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-2">
                Nästa generation av AI-automation
              </p>
              <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
                Autonoma AI-agenter som arbetar självständigt för att lösa komplexa affärsuppgifter
              </p>
              
              <ContactFormDialog>
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16"
                >
                  Lär dig mer om Agenter
                </Button>
              </ContactFormDialog>
            </div>
          </div>
        </div>
      </header>

      {/* What are Agents Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                Vad är Microsoft Agenter?
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground">
                Från Copilot till Agenter - evolutionen av AI i Dynamics 365
              </p>
            </div>

            {/* Main Concept */}
            <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 rounded-2xl p-6 sm:p-8 md:p-10 mb-8 border border-primary/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-gradient-to-br from-primary to-accent w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                    Autonoma AI-agenter som arbetar för dig
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Microsoft Agenter representerar nästa steg i AI-evolutionen. Medan Copilot fungerar som din 
                    AI-assistent som hjälper dig med uppgifter, är Agenter autonoma AI-system som kan utföra 
                    komplexa arbetsflöden självständigt, fatta beslut och koordinera med andra system - 
                    allt baserat på dina affärsregler och prioriteringar.
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison: Copilot vs Agents */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-secondary w-10 h-10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <h4 className="text-lg font-bold text-card-foreground">Copilot</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-assistent som stödjer användaren
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Hjälper med uppgifter på begäran</li>
                  <li>✓ Kräver användarinteraktion</li>
                  <li>✓ Ger förslag och rekommendationer</li>
                  <li>✓ Arbetar inom en applikation</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 border-2 border-primary/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-primary to-accent w-10 h-10 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground">Agenter</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Autonoma AI-system som arbetar självständigt
                </p>
                <ul className="space-y-2 text-sm text-foreground/90">
                  <li>✓ Utför hela arbetsflöden automatiskt</li>
                  <li>✓ Arbetar självständigt 24/7</li>
                  <li>✓ Fattar beslut baserat på affärsregler</li>
                  <li>✓ Koordinerar mellan system och team</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Capabilities Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nyckelfunktioner hos Microsoft Agenter
              </h2>
              <p className="text-lg text-muted-foreground">
                Vad gör Agenter till en spelväxlare för affärsprocesser?
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Autonom Exekvering",
                  description: "Agents arbetar självständigt utan att behöva konstant övervakning, utför komplexa uppgifter och arbetsflöden automatiskt"
                },
                {
                  icon: <Brain className="w-6 h-6" />,
                  title: "Intelligent Beslutsfattande",
                  description: "Fattar datadrivna beslut baserat på dina affärsregler, historisk data och realtidsinsikter"
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Multi-Agent Samarbete",
                  description: "Flera Agenter kan samarbeta och koordinera för att lösa komplexa affärsproblem tillsammans"
                },
                {
                  icon: <ArrowRight className="w-6 h-6" />,
                  title: "Systemintegration",
                  description: "Kopplar samman och koordinerar mellan olika affärssystem och datakällor sömlöst"
                },
                {
                  icon: <Sparkles className="w-6 h-6" />,
                  title: "Kontinuerlig Inlärning",
                  description: "Agenter lär sig och förbättras över tid genom att observera mönster och resultat"
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Proaktiv Aktion",
                  description: "Identifierar möjligheter och problem proaktivt och agerar innan de blir kritiska"
                }
              ].map((capability, index) => (
                <div key={index} className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-br from-primary to-accent w-12 h-12 rounded-lg flex items-center justify-center text-primary-foreground mb-4">
                    {capability.icon}
                  </div>
                  <h3 className="text-lg font-bold text-card-foreground mb-2">{capability.title}</h3>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                Agenter i Dynamics 365
              </h2>
              <p className="text-lg text-muted-foreground">
                Praktiska användningsområden för autonoma AI-agenter
              </p>
            </div>

            <div className="space-y-6">
              {/* Sales Agent */}
              <div className="bg-card rounded-xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-primary to-accent w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-card-foreground mb-2">Sales Agent</h3>
                    <p className="text-muted-foreground mb-4">
                      Automatiserar hela försäljningsprocessen från lead till avslut
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-card-foreground">• Leadkvalificering:</span>
                        <span className="text-muted-foreground"> Utvärderar och prioriterar leads automatiskt</span>
                      </div>
                      <div>
                        <span className="font-semibold text-card-foreground">• Uppföljning:</span>
                        <span className="text-muted-foreground"> Skickar personliga uppföljningar vid rätt tidpunkt</span>
                      </div>
                      <div>
                        <span className="font-semibold text-card-foreground">• Prisoptimering:</span>
                        <span className="text-muted-foreground"> Föreslår optimala priser baserat på data</span>
                      </div>
                      <div>
                        <span className="font-semibold text-card-foreground">• Pipeline-hantering:</span>
                        <span className="text-muted-foreground"> Uppdaterar och hanterar säljpipeline</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Service Agent */}
              <div className="bg-card rounded-xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-primary to-accent w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎧</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-card-foreground mb-2">Customer Service Agent</h3>
                    <p className="text-muted-foreground mb-4">
                      Hanterar kundsupport autonomt med intelligent eskalering
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-card-foreground">• Ärendehantering:</span>
                        <span className="text-muted-foreground"> Löser vanliga ärenden automatiskt</span>
                      </div>
                      <div>
                        <span className="font-semibold text-card-foreground">• Smart eskalering:</span>
                        <span className="text-muted-foreground"> Vidarebefordrar komplexa ärenden till rätt agent</span>
                      </div>
                      <div>
                        <span className="font-semibold text-card-foreground">• Kunskapsbas:</span>
                        <span className="text-muted-foreground"> Söker och tillämpar lösningar från historik</span>
                      </div>
                      <div>
                        <span className="font-semibold text-card-foreground">• Proaktiv service:</span>
                        <span className="text-muted-foreground"> Identifierar och löser problem innan kunden kontaktar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supply Chain Agent */}
              <div className="bg-card rounded-xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-primary to-accent w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-card-foreground mb-2">Supply Chain Agent</h3>
                    <p className="text-muted-foreground mb-4">
                      Optimerar leveranskedjan och hanterar störningar proaktivt
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-card-foreground">• Lageroptimering:</span>
                        <span className="text-muted-foreground"> Justerar lagernivåer baserat på prognoser</span>
                      </div>
                      <div>
                        <span className="font-semibold text-card-foreground">• Leverantörshantering:</span>
                        <span className="text-muted-foreground"> Kommunicerar och koordinerar med leverantörer</span>
                      </div>
                      <div>
                        <span className="font-semibold text-card-foreground">• Störningshantering:</span>
                        <span className="text-muted-foreground"> Identifierar och löser leveransproblem</span>
                      </div>
                      <div>
                        <span className="font-semibold text-card-foreground">• Beställningsautomation:</span>
                        <span className="text-muted-foreground"> Skapar och skickar beställningar automatiskt</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Finance Agent */}
              <div className="bg-card rounded-xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-primary to-accent w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-card-foreground mb-2">Finance Agent</h3>
                    <p className="text-muted-foreground mb-4">
                      Automatiserar ekonomiska processer och finansiell rapportering
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-card-foreground">• Fakturahantering:</span>
                        <span className="text-muted-foreground"> Processar och godkänner fakturor automatiskt</span>
                      </div>
                      <div>
                        <span className="font-semibold text-card-foreground">• Avstämningar:</span>
                        <span className="text-muted-foreground"> Utför konto- och bankavstämningar</span>
                      </div>
                      <div>
                        <span className="font-semibold text-card-foreground">• Budgetövervakning:</span>
                        <span className="text-muted-foreground"> Övervakar och larmar vid avvikelser</span>
                      </div>
                      <div>
                        <span className="font-semibold text-card-foreground">• Prognoser:</span>
                        <span className="text-muted-foreground"> Skapar finansiella prognoser och analyser</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Lär dig mer om Microsoft Agenter
            </h2>
            <p className="text-lg text-muted-foreground">
              Videor och demos från Microsoft Ignite
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {agentVideos.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6 italic">
            Lägg in YouTube video-ID för att visa videorna
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                Fördelar med Microsoft Agenter
              </h2>
              <p className="text-lg text-muted-foreground">
                Varför bör ditt företag satsa på autonoma AI-agenter?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Dramatiskt Ökad Produktivitet",
                  description: "Agents arbetar 24/7 utan paus och kan hantera tusentals uppgifter samtidigt, vilket frigör dina medarbetare för värdeskapande arbete",
                  stat: "10x snabbare"
                },
                {
                  title: "Minskade Kostnader",
                  description: "Automatisering av rutinuppgifter och arbetsflöden reducerar operativa kostnader betydligt",
                  stat: "40-60% besparingar"
                },
                {
                  title: "Förbättrad Noggrannhet",
                  description: "AI-agenter eliminerar mänskliga fel och säkerställer konsekvent kvalitet i alla processer",
                  stat: "99.9% noggrannhet"
                },
                {
                  title: "Snabbare Time-to-Value",
                  description: "Agents implementeras och börjar leverera värde mycket snabbare än traditionella lösningar",
                  stat: "Dagar istället för månader"
                },
                {
                  title: "Skalbarhet",
                  description: "Enkelt att skala upp eller ner baserat på affärsbehov utan att behöva anställa",
                  stat: "Obegränsad skalning"
                },
                {
                  title: "Bättre Kundupplevelse",
                  description: "Snabbare respons, proaktiv service och personaliserade interaktioner förbättrar kundnöjdheten",
                  stat: "30% högre CSAT"
                }
              ].map((benefit, index) => (
                <div key={index} className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-card-foreground">{benefit.title}</h3>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                      {benefit.stat}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-center">
                Agenter + Copilot = Perfekt Kombination
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-8">
                Det bästa av båda världarna för maximal AI-nytta
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg p-6 border border-border">
                  <h4 className="font-bold text-card-foreground mb-3">Copilot för Användaren</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Copilot hjälper dina medarbetare att arbeta smartare genom att ge förslag, 
                    automatisera uppgifter och tillhandahålla AI-insikter i realtid.
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>→ Hjälper med kreativa uppgifter</p>
                    <p>→ Kräver användarinteraktion</p>
                    <p>→ Flexibel och anpassningsbar</p>
                  </div>
                </div>
                <div className="bg-card rounded-lg p-6 border border-border">
                  <h4 className="font-bold text-card-foreground mb-3">Agenter för Processerna</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Agenter hanterar repetitiva och komplexa arbetsflöden självständigt, 
                    arbetar 24/7 och koordinerar mellan system och team.
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>→ Automatiserar hela processer</p>
                    <p>→ Arbetar autonomt</p>
                    <p>→ Skalbar och pålitlig</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Redo att utforska Microsoft Agenter?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kontakta oss för att diskutera hur autonoma AI-agenter kan transformera era affärsprocesser
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactFormDialog>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 sm:h-16">
                  Boka Gratis Konsultation
                </Button>
              </ContactFormDialog>
              <Button size="lg" variant="outline" asChild>
                <Link to="/copilot">
                  Läs om Copilot
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Agents;