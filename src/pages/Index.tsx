import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import BigFiveSection from "@/components/BigFiveSection";
import { PlayCircle, ArrowRight } from "lucide-react";

const Index = () => {
  const erpVideos = [
    {
      title: "Introduktion till Dynamics 365 Finance",
      description: "Lär dig grunderna i Microsoft Dynamics 365 Finance och hur det kan transformera din ekonomihantering",
      videoId: "Uf87oOZ-ZpM",
    },
    {
      title: "Supply Chain Management Översikt",
      description: "Upptäck hur Microsoft Dynamics 365 Supply Chain Management optimerar din leveranskedja",
      videoId: "5OoBvP0Sty0",
    },
    {
      title: "Business Central för Mindre och Medelstora Företag",
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
      description: "Skapa personliga kundresor med Microsoft Dynamics 365 Marketing",
      videoId: "6pJM3F0nB-U",
    },
    {
      title: "Customer Service och Support",
      description: "Leverera exceptionell kundservice med AI-drivna insikter",
      videoId: "sWKW3Zm3HQs",
    },
    {
      title: "Dynamics 365 Contact Center",
      description: "Modern och innovativ kontaktcenterlösning med Omnichannel, AI och automation",
      videoId: "6pJM3F0nB-U",
    },
    {
      title: "Dynamics 365 Field Service",
      description: "Optimera fältservice med intelligent schemaläggning och mobilitet",
      videoId: "6pJM3F0nB-U",
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

  const fscPricingPlans = [
    {
      title: "Dynamics 365 Finance",
      description: "Avancerad finansiell hantering",
      price: "Från 2 200 kr",
      features: [
        "Global finansiell hantering",
        "Budgetering och prognoser",
        "Kostnadsredovisning",
        "Skattehantering",
        "Finansiell rapportering",
      ],
    },
    {
      title: "Dynamics 365 Supply Chain",
      description: "Komplett supply chain-lösning",
      price: "Från 2 200 kr",
      features: [
        "Avancerad lagerhantering",
        "Produktionsplanering",
        "Inköp och logistik",
        "Asset Management",
        "IoT Intelligence",
      ],
    },
  ];

  const crmPricingPlans = [
    {
      title: "Dynamics 365 Team Member",
      description: "För användare med begränsade behov",
      price: "75 kr",
      features: [
        "Läsbehörighet i CRM",
        "Grundläggande rapporter",
        "Enkel dataåtkomst",
        "Mobilapp-åtkomst",
        "Support via e-post",
      ],
    },
    {
      title: "Sales Professional",
      description: "För säljteam",
      price: "650 kr",
      features: [
        "Lead och opportunity management",
        "Kontakt- och kundhantering",
        "E-postintegration",
        "Mobilapp",
        "Rapporter och dashboards",
      ],
    },
    {
      title: "Sales Enterprise",
      description: "Avancerad försäljning",
      price: "950 kr",
      features: [
        "Alla Professional-funktioner",
        "Säljprognoser och AI-insikter",
        "LinkedIn Sales Navigator",
        "Anpassade arbetsflöden",
        "Avancerad automatisering",
      ],
    },
  ];

  const crmPricingPlans2 = [
    {
      title: "Customer Service Professional",
      description: "Grundläggande kundservice",
      price: "500 kr",
      features: [
        "Ärendehantering",
        "Kunskapsbas",
        "Service Level Agreements",
        "Kundportaler",
        "Mobilstöd",
      ],
    },
    {
      title: "Customer Service Enterprise",
      description: "Avancerad kundservice",
      price: "950 kr",
      features: [
        "Alla Professional-funktioner",
        "Omnichannel routing",
        "AI-driven support",
        "Unified routing",
        "Avancerad analytics",
      ],
    },
  ];

  const crmPricingPlans3 = [
    {
      title: "Field Service",
      description: "Fältservicehantering",
      price: "950 kr",
      features: [
        "Arbetsorderhantering",
        "Schemaläggning och dispatch",
        "Mobil fältapp",
        "Lagerhantering",
        "Preventivt underhåll",
      ],
    },
    {
      title: "Marketing",
      description: "Marknadsföringsautomation",
      price: "Från 15 000 kr",
      features: [
        "E-postmarknadsföring",
        "Kundresor och segmentering",
        "Event management",
        "Lead scoring",
        "Multi-channel kampanjer",
      ],
    },
    {
      title: "Marketing Attach",
      description: "Marketing-tillägg för befintliga användare",
      price: "5 300 kr",
      features: [
        "Kräver befintlig CE-licens",
        "E-postmarknadsföring",
        "Grundläggande kundresor",
        "Lead management",
        "Integration med Sales/Service",
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
                Videoguider och Q&A
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Allt du behöver veta om<br />Microsoft Dynamics 365
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              Svar på vanliga frågor så som priser, implementering och funktioner med videoinnehåll för att göra det enkelt att konsumera.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" variant="secondary" className="text-lg group bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
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

      {/* Solution Selector Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Vilken typ av lösning letar du efter?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Microsoft Dynamics 365 består av två huvudområden. Välj det som passar dina behov bäst.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* ERP/Affärssystem Card */}
            <div className="bg-card rounded-lg p-8 border-2 border-border hover:border-primary transition-all duration-300 cursor-pointer group shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)]">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-3">Affärssystem (ERP)</h3>
                <p className="text-muted-foreground mb-6">
                  Hantera ekonomi, lager, produktion och affärsprocesser
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-card-foreground">Passar för dig som vill:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Effektivisera ekonomihantering och redovisning</li>
                  <li>✓ Optimera lager och leveranskedja</li>
                  <li>✓ Hantera tillverkning och produktion</li>
                  <li>✓ Få kontroll över hela affärsverksamheten</li>
                </ul>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
                Utforska Affärssystem
              </Button>
            </div>

            {/* CRM/Customer Engagement Card */}
            <div className="bg-card rounded-lg p-8 border-2 border-border hover:border-primary transition-all duration-300 cursor-pointer group shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)]">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-3">CRM (Customer Engagement)</h3>
                <p className="text-muted-foreground mb-6">
                  Bygg starkare kundrelationer och öka försäljningen
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-card-foreground">Passar för dig som vill:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Öka försäljning och hantera leads</li>
                  <li>✓ Förbättra kundservice och support</li>
                  <li>✓ Automatisera marknadsföring</li>
                  <li>✓ Få 360° vy av dina kunder</li>
                </ul>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
                Utforska CRM-lösningar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Big Five Section */}
      <BigFiveSection />

      {/* ERP Videos Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Affärssystem (ERP)
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

      {/* Comparison Section - Business Central vs Finance & Supply Chain */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Business Central vs Finance & Supply Chain
              </h2>
              <p className="text-lg text-muted-foreground">
                Vilket ERP-system passar bäst för din organisation?
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Business Central */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Business Central</h3>
                <p className="text-muted-foreground mb-6">
                  Perfekt för mindre och medelstora företag från ett par användare upp till 300-500 användare
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

              {/* Finance & Supply Chain */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Finance & Supply Chain</h3>
                <p className="text-muted-foreground mb-6">
                  Företagslösning för större och ofta internationella organisationer med komplexa behov
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
            </div>

            {/* Key Decision Factors */}
            <div className="mt-12 bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
              <h3 className="text-xl font-bold text-card-foreground mb-6">Nyckelfaktorer vid valet</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Företagsstorlek</h4>
                  <p className="text-muted-foreground">
                    Business Central: &lt;300 användare<br />
                    Finance & Supply Chain: från 20 användare
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Komplexitet</h4>
                  <p className="text-muted-foreground">
                    Enkla till medelkomplexa processer → Business Central<br />
                    Komplexa processer → Finance & Supply Chain
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Budget</h4>
                  <p className="text-muted-foreground">
                    Begränsad budget → Business Central<br />
                    Större investeringsförmåga → Finance & Supply Chain
                  </p>
                </div>
              </div>
            </div>
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

      {/* Pricing Section - ERP/Affärssystem */}
      <section id="pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Prisöversikt - Affärssystem (ERP)
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparenta priser för alla Dynamics 365 ERP-applikationer
            </p>
          </div>

          {/* Business Central Pricing */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Business Central
              </h3>
              <p className="text-muted-foreground">
                För mindre och medelstora företag
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {bcPricingPlans.map((plan, index) => (
                <PricingCard key={index} {...plan} />
              ))}
            </div>
          </div>

          {/* Finance & Supply Chain Pricing */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Finance & Supply Chain Management
              </h3>
              <p className="text-muted-foreground">
                För stora organisationer och komplexa verksamheter
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {fscPricingPlans.map((plan, index) => (
                <PricingCard key={index} {...plan} />
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Alla priser är per användare/månad (exkl. moms) och kan variera beroende på din specifika konfiguration
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section - CRM/Customer Engagement */}
      <section id="crm-pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Prisöversikt - CRM (Customer Engagement)
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transparenta priser för alla Dynamics 365 CRM-applikationer
            </p>
          </div>

          {/* Sales Pricing */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Dynamics 365 Sales
              </h3>
              <p className="text-muted-foreground">
                För försäljningsteam och säljorganisationer
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {crmPricingPlans.map((plan, index) => (
                <PricingCard key={index} {...plan} />
              ))}
            </div>
          </div>

          {/* Customer Service Pricing */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Dynamics 365 Customer Service
              </h3>
              <p className="text-muted-foreground">
                För kundservice och supportteam
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {crmPricingPlans2.map((plan, index) => (
                <PricingCard key={index} {...plan} />
              ))}
            </div>
          </div>

          {/* Field Service & Marketing Pricing */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Field Service & Marketing
              </h3>
              <p className="text-muted-foreground">
                För fältservice och marknadsföringsautomation
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {crmPricingPlans3.map((plan, index) => (
                <PricingCard key={index} {...plan} />
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-2">
              Alla priser är per användare/månad (exkl. moms) och kan variera beroende på din specifika konfiguration
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>OBS:</strong> Marketing är prissatt per organisation och inkluderar upp till 10 000 kontakter. Marketing Attach kräver befintlig Sales/Customer Service-licens.
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Pricing Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Implementeringskostnader
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kostnaderna för implementering varierar baserat på system och omfattning
            </p>
          </div>

          {/* Business Central Implementation */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Business Central
              </h3>
              <p className="text-muted-foreground">
                Implementeringskostnader för mindre och medelstora företag
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-8 border border-border">
                <h4 className="text-xl font-semibold text-card-foreground mb-4">Mindre standardimplementationer</h4>
                <p className="text-muted-foreground mb-4">Standarduppsättning med begränsade anpassningar</p>
                <div className="text-3xl font-bold text-primary mb-6">150 000 - 400 000 kr</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 2-4 månaders projekt</li>
                  <li>• Standardprocesser och funktionalitet</li>
                  <li>• Grundläggande utbildning</li>
                  <li>• Datamigration från enklare system</li>
                  <li>• Få eller inga integrationer</li>
                  <li>• 5-20 användare</li>
                </ul>
              </div>
              <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-8 border border-border">
                <h4 className="text-xl font-semibold text-card-foreground mb-4">Mer avancerade och omfattande implementationer</h4>
                <p className="text-muted-foreground mb-4">Anpassad lösning med integrationer och komplexitet</p>
                <div className="text-3xl font-bold text-primary mb-6">500 000 - 1 500 000 kr</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 4-8 månaders projekt</li>
                  <li>• Anpassade processer och workflows</li>
                  <li>• Omfattande utbildning och change management</li>
                  <li>• Komplex datamigration</li>
                  <li>• Flera systemintegrationer</li>
                  <li>• 20-200 användare</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Finance & Supply Chain Implementation */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Finance & Supply Chain Management
              </h3>
              <p className="text-muted-foreground">
                Implementeringskostnader för stora organisationer
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-8 border border-border">
                <h4 className="text-xl font-semibold text-card-foreground mb-4">Mindre standardimplementationer</h4>
                <p className="text-muted-foreground mb-4">Grundläggande uppsättning med standardfunktionalitet</p>
                <div className="text-3xl font-bold text-primary mb-6">1 500 000 - 3 000 000 kr</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 6-9 månaders projekt</li>
                  <li>• Standardprocesser med mindre anpassningar</li>
                  <li>• Strukturerad utbildning</li>
                  <li>• Datamigration och validering</li>
                  <li>• Grundläggande integrationer</li>
                  <li>• 50-200 användare</li>
                </ul>
              </div>
              <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-8 border border-border">
                <h4 className="text-xl font-semibold text-card-foreground mb-4">Mer avancerade och omfattande implementationer</h4>
                <p className="text-muted-foreground mb-4">Globala implementationer med hög komplexitet</p>
                <div className="text-3xl font-bold text-primary mb-6">3 000 000 - 10 000 000+ kr</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 9-18+ månaders projekt</li>
                  <li>• Omfattande anpassningar och utveckling</li>
                  <li>• Global rollout och change management</li>
                  <li>• Komplex datamigration från flera system</li>
                  <li>• Många systemintegrationer och API:er</li>
                  <li>• 200-2000+ användare</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CRM Implementation */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                CRM (Customer Engagement)
              </h3>
              <p className="text-muted-foreground">
                Implementeringskostnader för Sales, Service och Marketing
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-8 border border-border">
                <h4 className="text-xl font-semibold text-card-foreground mb-4">Mindre standardimplementationer</h4>
                <p className="text-muted-foreground mb-4">En eller två CRM-applikationer med standardfunktionalitet</p>
                <div className="text-3xl font-bold text-primary mb-6">200 000 - 600 000 kr</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 2-4 månaders projekt</li>
                  <li>• Sales eller Customer Service</li>
                  <li>• Standardprocesser och formulär</li>
                  <li>• Grundläggande utbildning</li>
                  <li>• Datamigration av kontakter och affärer</li>
                  <li>• 10-50 användare</li>
                </ul>
              </div>
              <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-8 border border-border">
                <h4 className="text-xl font-semibold text-card-foreground mb-4">Mer avancerade och omfattande implementationer</h4>
                <p className="text-muted-foreground mb-4">Flera CRM-applikationer med anpassningar och integrationer</p>
                <div className="text-3xl font-bold text-primary mb-6">800 000 - 3 000 000+ kr</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 4-10 månaders projekt</li>
                  <li>• Sales + Service + Marketing/Field Service</li>
                  <li>• Anpassade processer och automatiseringar</li>
                  <li>• Omfattande utbildning och adoption</li>
                  <li>• Komplex datamigration och integration</li>
                  <li>• 50-500+ användare</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Common Factors */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-card rounded-lg shadow-[var(--shadow-card)] p-8 border border-border">
              <h4 className="text-xl font-semibold text-card-foreground mb-6 text-center">
                Faktorer som påverkar priset
              </h4>
              <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-card-foreground mb-2">Omfattning</p>
                  <ul className="space-y-1">
                    <li>• Antal användare</li>
                    <li>• Antal moduler</li>
                    <li>• Geografisk spridning</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-card-foreground mb-2">Komplexitet</p>
                  <ul className="space-y-1">
                    <li>• Anpassningsbehov</li>
                    <li>• Integrationer</li>
                    <li>• Datavolym och kvalitet</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-card-foreground mb-2">Organisation</p>
                  <ul className="space-y-1">
                    <li>• Utbildningsbehov</li>
                    <li>• Change management</li>
                    <li>• Projektorganisation</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Button className="bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0" size="lg">
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
          <Button size="lg" variant="secondary" className="text-lg bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
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
