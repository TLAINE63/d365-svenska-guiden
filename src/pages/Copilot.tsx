import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import dynamicFactoryLogo from "@/assets/dynamic-factory-logo.jpg";

const Copilot = () => {
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
            <div className="flex justify-center mb-4">
              <Sparkles className="w-16 h-16 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Microsoft Copilot för Dynamics 365
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              AI-driven produktivitet inbyggd i ditt affärssystem
            </p>
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

      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
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
                  <p className="text-sm text-card-foreground">
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
            <Button className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0" size="lg">
              Boka Gratis Konsultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Copilot;
