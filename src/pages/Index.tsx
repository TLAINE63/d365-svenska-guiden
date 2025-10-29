import { Button } from "@/components/ui/button";
import PricingCard from "@/components/PricingCard";
import BigFiveCarousel from "@/components/BigFiveCarousel";
import Navbar from "@/components/Navbar";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BusinessCentralIcon from "@/assets/icons/BusinessCentral.svg";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";
import SalesIcon from "@/assets/icons/Sales.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import MarketingIcon from "@/assets/icons/Marketing.svg";
const Index = () => {
  const bcPricingPlans = [{
    title: "Business Central Team Member",
    description: "För användare med begränsade behov",
    price: "100 kr",
    features: ["Läsbehörighet", "Grundläggande rapporter", "Tidrapportering", "Godkännanden", "Self-service funktioner"]
  }, {
    title: "Business Central Essentials",
    description: "För mindre företag",
    price: "700 kr",
    features: ["Ekonomihantering", "Försäljning & Inköp", "Lagerhantering", "Projekthantering", "Support via e-post"]
  }, {
    title: "Business Central Premium",
    description: "För växande företag",
    price: "1 000 kr",
    features: ["Alla Essentials-funktioner", "Service Management", "Tillverkning", "Warehouse Management", "Prioriterad support"]
  }];
  const fscPricingPlans = [{
    title: "Dynamics 365 Finance",
    description: "Avancerad finansiell hantering",
    price: "Från 2 200 kr",
    features: ["Global finansiell hantering", "Budgetering och prognoser", "Kostnadsredovisning", "Skattehantering", "Finansiell rapportering"]
  }, {
    title: "Dynamics 365 Supply Chain",
    description: "Komplett supply chain-lösning",
    price: "Från 2 200 kr",
    features: ["Avancerad lagerhantering", "Produktionsplanering", "Inköp och logistik", "Asset Management", "IoT Intelligence"]
  }];
  const crmPricingPlans = [{
    title: "Dynamics 365 Team Member",
    description: "För användare med begränsade behov",
    price: "75 kr",
    features: ["Läsbehörighet i CRM", "Grundläggande rapporter", "Enkel dataåtkomst", "Mobilapp-åtkomst", "Support via e-post"]
  }, {
    title: "Sales Professional",
    description: "För säljteam",
    price: "650 kr",
    features: ["Lead och opportunity management", "Kontakt- och kundhantering", "E-postintegration", "Mobilapp", "Rapporter och dashboards"]
  }, {
    title: "Sales Enterprise",
    description: "Avancerad försäljning",
    price: "950 kr",
    features: ["Alla Professional-funktioner", "Säljprognoser och AI-insikter", "LinkedIn Sales Navigator", "Anpassade arbetsflöden", "Avancerad automatisering"]
  }];
  const crmPricingPlans2 = [{
    title: "Customer Service Professional",
    description: "Grundläggande kundservice",
    price: "500 kr",
    features: ["Ärendehantering", "Kunskapsbas", "Service Level Agreements", "Kundportaler", "Mobilstöd"]
  }, {
    title: "Customer Service Enterprise",
    description: "Avancerad kundservice",
    price: "950 kr",
    features: ["Alla Professional-funktioner", "Omnichannel routing", "AI-driven support", "Unified routing", "Avancerad analytics"]
  }];
  const crmPricingPlans3 = [{
    title: "Field Service",
    description: "Fältservicehantering",
    price: "950 kr",
    features: ["Arbetsorderhantering", "Schemaläggning och dispatch", "Mobil fältapp", "Lagerhantering", "Preventivt underhåll"]
  }, {
    title: "Customer Insights",
    description: "Marknadsföringsautomation",
    price: "Från 15 000 kr",
    features: ["E-postmarknadsföring", "Kundresor och segmentering", "Event management", "Lead scoring", "Multi-channel kampanjer"]
  }, {
    title: "Customer Insights Attach",
    description: "Customer Insights-tillägg för befintliga användare",
    price: "5 300 kr",
    features: ["Kräver befintlig CE-licens", "E-postmarknadsföring", "Grundläggande kundresor", "Lead management", "Integration med Sales/Service"]
  }];
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-primary-foreground mt-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6TTAgMTZjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMlMwIDIyLjYyNyAwIDE2em0zNiAzNmMwLTYuNjI3IDUuMzczLTEyIDEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyek0wIDUyYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTJTMCA1OC42MjcgMCA1MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Allt du behöver veta om<br />Microsoft Dynamics 365
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              Svar på vanliga frågor så som priser, implementering och funktioner med videoinnehåll för att göra det enkelt att konsumera.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto pt-6 px-4">
              <Button asChild size="lg" variant="secondary" className="text-sm lg:text-base group bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0 h-auto py-3 whitespace-normal">
                <Link to="/qa#priser" className="flex items-center justify-center gap-2">
                  <span className="flex-1 text-center">Vad ingår i licenspriset?</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="text-sm lg:text-base group bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0 h-auto py-3 whitespace-normal">
                <Link to="/qa#implementering" className="text-center">
                  Hur lång tid tar en implementering?
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="text-sm lg:text-base group bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0 h-auto py-3 whitespace-normal">
                <Link to="/qa#risker" className="text-center">
                  Vilka risker finns i CRM/ERP projekt?
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="text-sm lg:text-base group bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0 h-auto py-3 whitespace-normal">
                <Link to="/qa#sales-appar" className="text-center">
                  Skillnaden mellan olika D365 Sales licensvarianter?
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="text-sm lg:text-base group bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0 h-auto py-3 whitespace-normal">
                <Link to="/qa#bc-vs-fsc" className="text-center">
                  Passar Business Central eller Finance & Supply Chain bäst?
                </Link>
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
              Microsoft Dynamics 365 erbjuder lösningar för både affärssystem och kundhantering. Välj det som passar dina behov bäst.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Business Central Card */}
            <div className="bg-card rounded-lg p-8 border-2 border-border hover:border-primary transition-all duration-300 cursor-pointer group shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)]">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-2">Business Central</h3>
                <div className="flex justify-center gap-2 mb-3">
                  <img src={BusinessCentralIcon} alt="Business Central" className="h-8 w-8" />
                </div>
                <p className="text-sm text-muted-foreground mb-3 font-medium">Komplett affärssystem för mindre och medelstora företag</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-card-foreground">Passar för dig som vill:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Hantera ekonomi och redovisning</li>
                  <li>✓ Order, Lager, Inköp</li>
                  <li>✓ Projekthantering</li>
                  <li>✓ Material- och Produktionsstyrning</li>
                  <li>✓ Serviceorder</li>
                  <li>✓ Inbyggd AI</li>
                </ul>
              </div>
              
              <Button asChild className="w-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
                <Link to="/business-central">
                  Utforska Business Central
                </Link>
              </Button>
            </div>

            {/* Finance & Supply Chain Card */}
            <div className="bg-card rounded-lg p-8 border-2 border-border hover:border-primary transition-all duration-300 cursor-pointer group shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)]">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-2">Finance & Supply Chain</h3>
                <div className="flex justify-center gap-2 mb-3">
                  <img src={FinanceIcon} alt="Finance" className="h-8 w-8" />
                  <img src={SupplyChainIcon} alt="Supply Chain" className="h-8 w-8" />
                </div>
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  Passar för större ofta internationella verksamheter och koncerner
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-card-foreground">Passar för dig som vill:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Global ekonomihantering</li>
                  <li>✓ Avancerad tillverkning</li>
                  <li>✓ Komplex leveranskedja</li>
                  <li>✓ IoT och AI-integration</li>
                </ul>
              </div>
              
              <Button asChild className="w-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
                <Link to="/finance-supply-chain">
                  Utforska Finance & SCM
                </Link>
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
                <h3 className="text-2xl font-bold text-card-foreground mb-2">CRM (Customer Engagement)</h3>
                <div className="flex justify-center gap-2 mb-3">
                  <img src={SalesIcon} alt="Sales" className="h-8 w-8" />
                  <img src={CustomerServiceIcon} alt="Customer Service" className="h-8 w-8" />
                  <img src={MarketingIcon} alt="Customer Insights" className="h-8 w-8" />
                </div>
                <p className="text-sm text-muted-foreground mb-3 font-medium">
                  Microsoft Dynamics 365 Sales, Customer Insights, Service
                </p>
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
              
              <Button asChild className="w-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
                <Link to="/crm">
                  Utforska CRM-lösningar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Big Five Carousel Section */}
      <BigFiveCarousel />

      {/* AI & Copilot Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                AI-Driven Innovation
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Microsoft Copilot i Dynamics 365
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                AI-assistenten som revolutionerar hur du arbetar med affärssystem och CRM
              </p>
            </div>

            {/* What is Copilot */}
            <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] rounded-lg p-8 md:p-12 text-primary-foreground mb-12">
              <h3 className="text-2xl font-bold mb-4">Vad är Microsoft Copilot?</h3>
              <p className="text-lg mb-6 text-primary-foreground/90">
                Microsoft Copilot är en AI-assistent som är integrerad i alla Dynamics 365-applikationer. 
                Den använder avancerad AI och naturligt språk för att automatisera uppgifter, ge intelligenta 
                insikter och hjälpa användare att arbeta mer effektivt.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h4 className="font-semibold mb-2">Naturligt Språk</h4>
                  <p className="text-sm text-primary-foreground/80">
                    Ställ frågor och ge instruktioner på vanlig svenska
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h4 className="font-semibold mb-2">Kontextmedveten</h4>
                  <p className="text-sm text-primary-foreground/80">
                    Förstår dina affärsdata och processer
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h4 className="font-semibold mb-2">Kontinuerlig Inlärning</h4>
                  <p className="text-sm text-primary-foreground/80">
                    Blir smartare ju mer du använder systemet
                  </p>
                </div>
              </div>
            </div>

            {/* Copilot by Application */}
            <div className="space-y-8">
              {/* Business Central */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
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
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
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
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
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
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
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

            {/* ROI and Getting Started */}
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-secondary/30 rounded-lg p-8">
                <h3 className="text-xl font-bold text-card-foreground mb-4">Mätbar Affärsnytta</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">Snabbare Processer</p>
                      <p className="text-sm text-muted-foreground">Upp till 40% tidsbesparning på administrativa uppgifter</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">Högre Produktivitet</p>
                      <p className="text-sm text-muted-foreground">Medarbetare kan fokusera på värdeskapande arbete</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">Bättre Insikter</p>
                      <p className="text-sm text-muted-foreground">Datadriven beslutsfattning i realtid</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-xl font-bold text-card-foreground mb-4">Kom Igång med Copilot</h3>
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
                <Button asChild className="w-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
                  <Link to="/copilot">
                    Läs mer om Copilot
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Comparison Section - Business Central Essentials vs Premium */}
      <section className="py-20 bg-secondary/50">
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
                      <li>• Handels- och tjänsteföretag</li>
                      <li>• Företag utan tillverkning</li>
                      <li>• Enklare lagerhantering</li>
                      <li>• Grundläggande projektstyrning</li>
                      <li>• 5-50 användare</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Inkluderar:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Ekonomi och redovisning</li>
                      <li>• Försäljning och inköp</li>
                      <li>• Lagerhantering (grundläggande)</li>
                      <li>• Projekthantering</li>
                      <li>• Affärsinsikter och rapporter</li>
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

            {/* Key Decision Factors */}
            <div className="mt-12 bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
              <h3 className="text-xl font-bold text-card-foreground mb-6">Nyckelfaktorer vid valet</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Verksamhetstyp</h4>
                  <p className="text-muted-foreground">
                    Handel/tjänster → Essentials<br />
                    Tillverkning/service → Premium
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Lagerhantering</h4>
                  <p className="text-muted-foreground">
                    Grundläggande lager → Essentials<br />
                    Avancerat lager/WMS → Premium
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Budget</h4>
                  <p className="text-muted-foreground">
                    Cost-effective start → Essentials<br />
                    Växande behov → Premium
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Tips:</strong> Många företag börjar med Essentials och uppgraderar till Premium när behoven växer. 
                  Uppgraderingen är enkel och du behåller all data och konfiguration.
                </p>
              </div>
            </div>
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
                      <li>• Inbyggd AI</li>
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


      {/* Comparison Section - Sales Licenses */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Dynamics 365 Sales: Professional vs Enterprise vs Premium
              </h2>
              <p className="text-lg text-muted-foreground">
                Vilken Sales-licens passar ditt säljteam bäst?
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Sales Professional */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Sales Professional</h3>
                <p className="text-muted-foreground mb-6">
                  För mindre säljteam med grundläggande CRM-behov
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Passar för:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Små till medelstora säljteam</li>
                      <li>• Standardiserade försäljningsprocesser</li>
                      <li>• Grundläggande lead-hantering</li>
                      <li>• 5-50 användare</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Funktioner:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Lead och opportunity management</li>
                      <li>• Kontakt- och kundhantering</li>
                      <li>• E-postintegration (Outlook)</li>
                      <li>• Mobilapp</li>
                      <li>• Dashboards och rapporter</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-primary">Pris: 650 kr/användare/månad</p>
                  </div>
                </div>
              </div>

              {/* Sales Enterprise */}
              <div className="bg-card rounded-lg p-8 border-2 border-primary shadow-[var(--shadow-hover)]">
                <div className="inline-block bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full mb-3">
                  Mest populär
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Sales Enterprise</h3>
                <p className="text-muted-foreground mb-6">
                  För professionella säljteam med avancerade behov
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Passar för:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Större säljorganisationer</li>
                      <li>• AI-driven försäljning</li>
                      <li>• Komplexa säljprocesser</li>
                      <li>• 20-500+ användare</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Inkluderar allt i Professional plus:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Säljprognoser och AI-insikter</li>
                      <li>• LinkedIn Sales Navigator</li>
                      <li>• Anpassade arbetsflöden</li>
                      <li>• Avancerad automatisering</li>
                      <li>• Sales insights (AI)</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-primary">Pris: 950 kr/användare/månad</p>
                  </div>
                </div>
              </div>

              {/* Sales Premium */}
              <div className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
                <h3 className="text-2xl font-bold text-card-foreground mb-4">Sales Premium</h3>
                <p className="text-muted-foreground mb-6">
                  För avancerade säljorganisationer med omfattande krav
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Passar för:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Enterprise-organisationer</li>
                      <li>• Maximal AI och automatisering</li>
                      <li>• Omfattande integrationer</li>
                      <li>• 50-1000+ användare</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Inkluderar allt i Enterprise plus:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Conversation intelligence</li>
                      <li>• Avancerad sales analytics</li>
                      <li>• Relationship intelligence</li>
                      <li>• Copilot for Sales (AI-assistent)</li>
                      <li>• Premium support</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-primary">Pris: 1 500 kr/användare/månad</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Decision Factors */}
            <div className="mt-12 bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)]">
              <h3 className="text-xl font-bold text-card-foreground mb-6">Nyckelfaktorer vid valet</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">AI och Automatisering</h4>
                  <p className="text-muted-foreground">
                    Grundläggande CRM → Professional<br />
                    AI-insikter → Enterprise<br />
                    Maximal AI → Premium
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">Teamstorlek</h4>
                  <p className="text-muted-foreground">
                    Små team (5-50) → Professional<br />
                    Medelstora (20-500) → Enterprise<br />
                    Enterprise (50+) → Premium
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-2">LinkedIn Integration</h4>
                  <p className="text-muted-foreground">
                    Ej nödvändig → Professional<br />
                    LinkedIn Sales Nav → Enterprise/Premium
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Tips:</strong> De flesta företag väljer Sales Enterprise för bästa balansen mellan funktionalitet och pris. 
                  Premium passar främst stora organisationer som vill maximera AI-drivna insikter och automatisering.
                </p>
              </div>
            </div>
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
              {bcPricingPlans.map((plan, index) => <PricingCard key={index} {...plan} />)}
            </div>
          </div>

          {/* Finance & Supply Chain Pricing */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Finance & Supply Chain Management
              </h3>
              <p className="text-muted-foreground">
                För större organisationer med komplexa verksamheter
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {fscPricingPlans.map((plan, index) => <PricingCard key={index} {...plan} />)}
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
              {crmPricingPlans.map((plan, index) => <PricingCard key={index} {...plan} />)}
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
              {crmPricingPlans2.map((plan, index) => <PricingCard key={index} {...plan} />)}
            </div>
          </div>

          {/* Field Service & Customer Insights Pricing */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Field Service & Customer Insights
              </h3>
              <p className="text-muted-foreground">
                För fältservice och marknadsföringsautomation
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {crmPricingPlans3.map((plan, index) => <PricingCard key={index} {...plan} />)}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-2">
              Alla priser är per användare/månad (exkl. moms) och kan variera beroende på din specifika konfiguration
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>OBS:</strong> Customer Insights är prissatt per organisation och inkluderar upp till 10 000 kontakter. Customer Insights Attach kräver befintlig Sales/Customer Service-licens.
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Pricing Section */}
      <section id="implementation" className="py-20 bg-secondary/50">
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
                Implementeringskostnader för Sales, Service och Customer Insights
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
                  <li>• Sales + Service + Customer Insights/Field Service</li>
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


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Redo att Komma Igång?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Boka en gratis konsultation så hjälper vi dig att hitta rätt lösning för din verksamhet
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
            <Link to="/kontakt">Kontakta Oss Idag</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2025 Dynamic Factory</p>
            <p className="text-sm">
              Microsoft Business Applications Evangelister
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;