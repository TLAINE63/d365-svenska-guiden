import { Button } from "@/components/ui/button";
import PricingCard from "@/components/PricingCard";
import BigFiveCarousel from "@/components/BigFiveCarousel";
import Navbar from "@/components/Navbar";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BusinessCentralIcon from "@/assets/icons/BusinessCentral.svg";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";
import SalesIcon from "@/assets/icons/Sales.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import MarketingIcon from "@/assets/icons/Marketing.svg";
import BizAppsNetwork from "@/assets/biz-apps-network.png";
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Construction Banner */}
        <div className="bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] py-3 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="font-semibold">Denna sida är under konstruktion</p>
        </div>
      </div>
      
      {/* Hero Section */}
      <header className="relative overflow-hidden h-[500px] md:h-[600px]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600" 
            srcSet="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=640 640w,
                    https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1024 1024w,
                    https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600 1600w"
            sizes="100vw"
            alt="Modern business meeting" 
            className="w-full h-full object-cover"
            width="1600"
            height="1067"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  Allt du behöver veta om Microsoft Dynamics 365
                </h1>
                <p className="text-xl md:text-2xl text-white/95 mb-8">
                  Upptäck möjligheterna med Microsoftplattformen
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
        </div>
      </header>

      {/* Quick Links Section */}
      <section id="questions" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Vanliga frågor
          </h2>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {/* Fråga 1 */}
              <AccordionItem value="item-1" className="bg-card rounded-lg px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-xl font-bold text-card-foreground flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    Vad är Microsoft Dynamics 365 – och hur fungerar det?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>• <strong>Vad Dynamics 365 är:</strong> En svit av ERP- och CRM-appar som täcker allt från ekonomi och lager till försäljning och kundservice</p>
                    <p>• <strong>Hur modulerna hänger ihop:</strong> Alla appar delar samma dataplattform och kan integreras sömlöst</p>
                    <p>• <strong>Flexibilitet:</strong> Du kan börja med en enda modul och växa över tid, eller implementera en komplett helhetslösning från start</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fråga 2 */}
              <AccordionItem value="item-2" className="bg-card rounded-lg px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-xl font-bold text-card-foreground flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    Vilken Dynamics 365-lösning passar vårt företag bäst?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>Eftersom Dynamics 365 innehåller flera appar (t.ex. Business Central, F&SCM, Sales, Customer Service, Project Operations), undrar många:</p>
                    <p>• <strong>Vilken modul passar vår bransch och storlek?</strong> Mindre företag börjar ofta med Business Central, medan större koncerner väljer F&SCM</p>
                    <p>• <strong>Vad är skillnaden mellan Business Central och F&SCM?</strong> Business Central är ett allt-i-ett system för SMB, medan F&SCM är för komplexa globala verksamheter</p>
                    <p>• <strong>Kan vi kombinera flera appar?</strong> Ja, du kan kombinera exempelvis Business Central med Sales och Customer Service för en komplett lösning</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fråga 3 */}
              <AccordionItem value="item-3" className="bg-card rounded-lg px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-xl font-bold text-card-foreground flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    Vad kostar Dynamics 365 – och vad påverkar priset?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>En av de mest sökta frågorna:</p>
                    <p>• <strong>Licenspriser per användare:</strong> Varierar från ca 900 kr/mån för grundläggande licenser upp till 3000+ kr/mån för avancerade användare</p>
                    <p>• <strong>Vad tillkommer:</strong> Implementation, anpassningar, integration, utbildning och löpande support</p>
                    <p>• <strong>Budgetering:</strong> Räkna med en total projektkostnad på 200 000 - 2 000 000 kr beroende på omfattning och komplexitet</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fråga 4 */}
              <AccordionItem value="item-4" className="bg-card rounded-lg px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-xl font-bold text-card-foreground flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    Hur lång tid tar det att implementera Dynamics 365?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>• <strong>Typisk implementationsresa:</strong> 3-6 månader för Business Central, 6-18 månader för F&SCM, 2-4 månader för CRM-moduler</p>
                    <p>• <strong>Vad krävs internt:</strong> Engagerad projektledare, dedikerade nyckelanvändare och tid för workshop och testning</p>
                    <p>• <strong>Affärsnytta:</strong> Första fördelarna syns ofta redan efter 2-3 månader, full ROI uppnås vanligtvis inom 1-2 år</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fråga 5 */}
              <AccordionItem value="item-5" className="bg-card rounded-lg px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-xl font-bold text-card-foreground flex items-start gap-3">
                    <span className="text-2xl">❓</span>
                    Hur fungerar Dynamics 365 med våra befintliga system och Microsoft 365?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>Integration är avgörande:</p>
                    <p>• <strong>Microsoft 365-integration:</strong> Sömlös integration med Outlook, Teams och Excel – arbeta direkt i de verktyg du redan använder</p>
                    <p>• <strong>Befintliga system:</strong> Enkelt att koppla samman med e-handel, lönesystem, BI-verktyg och andra affärssystem via API:er</p>
                    <p>• <strong>Power Platform:</strong> Skapa egna appar, automatisera arbetsflöden och bygga dashboards utan att behöva programmera</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Solution Selector Section */}
      <section id="solutions" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Välj din lösning
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Microsoft Dynamics 365 erbjuder lösningar för både affärssystem och kundhantering
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Business Central Card */}
            <div className="bg-card rounded-lg p-8 border border-border hover:shadow-[var(--shadow-hover)] transition-all duration-300">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src={BusinessCentralIcon} alt="Business Central" className="h-10 w-10" />
                  <h3 className="text-2xl font-bold text-card-foreground">Business Central</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Komplett affärssystem för mindre och medelstora företag
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Hantera ekonomi och redovisning</li>
                  <li>• Order, Lager, Inköp</li>
                  <li>• Projekthantering</li>
                  <li>• Material- och Produktionsstyrning</li>
                  <li>• Serviceorder</li>
                  <li>• Inbyggd AI</li>
                </ul>
              </div>
              
              <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground">
                <Link to="/business-central">
                  Läs mer
                </Link>
              </Button>
            </div>

            {/* Finance & Supply Chain Card */}
            <div className="bg-card rounded-lg p-8 border border-border hover:shadow-[var(--shadow-hover)] transition-all duration-300">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src={FinanceIcon} alt="Finance" className="h-10 w-10" />
                  <img src={SupplyChainIcon} alt="Supply Chain" className="h-10 w-10" />
                  <h3 className="text-2xl font-bold text-card-foreground">Finance & Supply Chain</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Passar för större ofta internationella verksamheter och koncerner
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Global ekonomihantering</li>
                  <li>• Avancerad tillverkning</li>
                  <li>• Komplex leveranskedja</li>
                  <li>• IoT och AI-integration</li>
                </ul>
              </div>
              
              <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground">
                <Link to="/finance-supply-chain">
                  Läs mer
                </Link>
              </Button>
            </div>

            {/* CRM/Customer Engagement Card */}
            <div className="bg-card rounded-lg p-8 border border-border hover:shadow-[var(--shadow-hover)] transition-all duration-300">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src={SalesIcon} alt="Sales" className="h-10 w-10" />
                  <img src={CustomerServiceIcon} alt="Customer Service" className="h-10 w-10" />
                  <img src={MarketingIcon} alt="Customer Insights" className="h-10 w-10" />
                  <h3 className="text-2xl font-bold text-card-foreground">CRM</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Microsoft Dynamics 365 Sales, Customer Insights, Service
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Öka försäljning och hantera leads</li>
                  <li>• Förbättra kundservice och support</li>
                  <li>• Automatisera marknadsföring</li>
                  <li>• Få 360° vy av dina kunder</li>
                </ul>
              </div>
              
              <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground">
                <Link to="/crm">
                  Läs mer
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
                    Kontinuerlig förbättring via användardata och AI-modeller
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
      </main>

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