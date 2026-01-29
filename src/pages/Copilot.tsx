import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import CopilotLogo from "@/assets/icons/Copilot.png";
import SEOHead from "@/components/SEOHead";
import { ServiceSchema, FAQSchema } from "@/components/StructuredData";

// FAQ items for schema
const copilotFaqs = [
  { question: "Vad är Microsoft Copilot i Dynamics 365?", answer: "Microsoft Copilot är en AI-driven assistent integrerad i Dynamics 365 som hjälper användare automatisera rutinuppgifter, få intelligenta insikter och fatta snabbare beslut baserade på affärsdata." },
  { question: "Vad är skillnaden mellan Copilot och Agents?", answer: "Copilot fungerar som en AI-assistent som hjälper användaren med uppgifter och kräver interaktion. Agents är autonoma AI-system som arbetar självständigt 24/7 och kan utföra hela arbetsflöden automatiskt utan mänsklig inblandning." },
  { question: "Vilken ROI kan man förvänta sig av Copilot?", answer: "Enligt Forresters TEI-studie från oktober 2024 kan företag uppnå 353% potentiell ROI över 3 år, 20% reducerade driftskostnader och 18% ökad medarbetarnöjdhet." },
  { question: "I vilka Dynamics 365-applikationer finns Copilot?", answer: "Copilot finns i Business Central, Dynamics 365 Sales, Customer Service, Finance och Supply Chain Management. Varje applikation har Copilot-funktioner anpassade för sina specifika användningsområden." },
  { question: "Hur kommer jag igång med Copilot?", answer: "Vi rekommenderar att börja med en behovsanalys för att identifiera vilka arbetsflöden som ger störst nytta. Kontakta oss för en kostnadsfri AI-rådgivning där vi kan guida dig genom processen." },
];

const Copilot = () => {
  const copilotVideos = [
    {
      title: "Introduktion till Dynamics 365 Copilot",
      description: "Officiell Microsoft-video om hur Copilot fungerar i Dynamics 365",
      videoId: "GMwtXDx-JUI",
    },
    {
      title: "Copilot i Customer Service",
      description: "Se hur Copilot accelererar ärendehantering och förbättrar produktivitet",
      videoId: "bZDvvLI4WRc",
    },
    {
      title: "Copilot i Supply Chain Management",
      description: "Nya Copilot-funktioner för att förbättra produktivitet och hantera störningar",
      videoId: "XPZqmmzKgQU",
    },
    {
      title: "Microsoft 365 Copilot - Översikt",
      description: "En rundtur i Microsoft 365 Copilot-appen",
      videoId: "W-FBOUh-S0o",
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
      <SEOHead 
        title="Microsoft Copilot i Dynamics 365 | AI för affärssystem"
        description="Upptäck hur Microsoft Copilot revolutionerar Dynamics 365 med AI-drivna insikter, automatisering och produktivitetsvinster. 353% potentiell ROI."
        canonicalPath="/copilot"
        keywords="Microsoft Copilot, Dynamics 365, AI, artificiell intelligens, affärssystem, automation, ROI"
        ogImage="https://d365.se/og-copilot.png"
      />
      <ServiceSchema 
        name="Microsoft Copilot i Dynamics 365"
        description="AI-driven assistent som förbättrar produktivitet och beslutsfattande i Microsoft Dynamics 365 affärssystem."
      />
      <FAQSchema faqs={copilotFaqs} />
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
                  className="bg-copilot hover:bg-copilot/90 text-copilot-foreground w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 rounded-xl"
                >
                  Boka en kostnadsfri AI-rådgivning
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
                  <img src={CopilotLogo} alt="Copilot" className="h-8 w-8" />
                </div>
                <div>
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
                    <img src={CopilotLogo} alt="Copilot" className="h-5 w-5" /> Copilot
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
                och hjälpa till med analyser - medan Microsoft Agenter tar det ett steg längre genom att 
                autonomt utföra hela arbetsflöden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Copilot by Application */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Copilot i olika Dynamics 365-applikationer
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Se hur Copilot hjälper till i varje del av ditt affärssystem
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* Business Central */}
              <div className="bg-card rounded-lg p-6 sm:p-8 border border-border shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-card-foreground mb-2">Copilot i Business Central</h3>
                    <p className="text-muted-foreground mb-4">
                      AI-assistans för ekonomi, lager och affärsprocesser
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Funktioner:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Generera produktbeskrivningar automatiskt</li>
                      <li>• Analysera banktransaktioner med AI</li>
                      <li>• Skapa försäljningsrader från dokument</li>
                      <li>• Intelligenta inköpsförslag</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Fördelar:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• 40% snabbare dokumenthantering</li>
                      <li>• Minskad administrativ börda</li>
                      <li>• Förbättrad datakvalitet</li>
                      <li>• Snabbare beslut</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sales */}
              <div className="bg-card rounded-lg p-6 sm:p-8 border border-border shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-card-foreground mb-2">Copilot for Sales</h3>
                    <p className="text-muted-foreground mb-4">
                      Din AI-säljassistent för smarta insikter och automatisering
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Funktioner:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Automatisk sammanfattning av möten</li>
                      <li>• E-postförslag baserade på kontext</li>
                      <li>• Lead- och opportunity-analys</li>
                      <li>• Intelligent försäljningsprognos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Fördelar:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• 30% högre produktivitet</li>
                      <li>• Snabbare säljcykler</li>
                      <li>• Bättre kundengagemang</li>
                      <li>• Mer tid för försäljning</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Customer Service */}
              <div className="bg-card rounded-lg p-6 sm:p-8 border border-border shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-card-foreground mb-2">Copilot for Customer Service</h3>
                    <p className="text-muted-foreground mb-4">
                      AI-driven support för exceptionell kundservice
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Funktioner:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Automatisk ärendesammanfattning</li>
                      <li>• Föreslå lösningar baserat på historik</li>
                      <li>• Generera svar till kunder</li>
                      <li>• Sentimentanalys av kundinteraktioner</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Fördelar:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• 25% snabbare ärendehantering</li>
                      <li>• Högre kundnöjdhet (CSAT)</li>
                      <li>• Minskad handläggningstid</li>
                      <li>• Konsekvent servicekvalitet</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Finance & Supply Chain */}
              <div className="bg-card rounded-lg p-6 sm:p-8 border border-border shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-card-foreground mb-2">Copilot i Finance & Supply Chain</h3>
                    <p className="text-muted-foreground mb-4">
                      Enterprise AI för komplex finansiell och operativ hantering
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Funktioner:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Avancerad ekonomisk analys och prognoser</li>
                      <li>• Automatisk avvikelsedetektering</li>
                      <li>• Supply chain-optimering med AI</li>
                      <li>• Prediktivt underhåll</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Fördelar:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Snabbare ekonomisk rapportering</li>
                      <li>• Optimerad lagernivå</li>
                      <li>• Minskade driftstopp</li>
                      <li>• Bättre beslutsunderlag</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Section */}
            <div className="mt-10 sm:mt-12 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] rounded-lg p-6 sm:p-8 text-primary-foreground">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center">Mätbar Affärsnytta</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold mb-2">353%</div>
                  <p className="text-sm text-primary-foreground/80">Potentiell ROI över 3 år</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold mb-2">20%</div>
                  <p className="text-sm text-primary-foreground/80">Reducerade driftskostnader</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold mb-2">18%</div>
                  <p className="text-sm text-primary-foreground/80">Ökad medarbetarnöjdhet</p>
                </div>
              </div>
              <p className="text-xs text-primary-foreground/60 italic text-center mt-4">
                Källa: Forrester Total Economic Impact™ studie beställd av Microsoft, oktober 2024
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
              <Button className="bg-copilot hover:bg-copilot/90 text-copilot-foreground h-14 sm:h-16 rounded-xl" size="lg">
                Boka in en kostnadsfri rådgivning
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
