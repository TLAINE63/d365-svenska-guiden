import { Button } from "@/components/ui/button";
import PricingCard from "@/components/PricingCard";
import LeadMagnetBanner from "@/components/LeadMagnetBanner";
import UrgencyBadge from "@/components/UrgencyBadge";
import VideoCard from "@/components/VideoCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import HeroCarousel from "@/components/HeroCarousel";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
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
      
      {/* Hero Carousel */}
      <HeroCarousel />


      {/* Quick Links Section */}
      <section id="questions" className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-10 md:mb-12">
            Vanliga frågor
          </h2>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              {/* Fråga 1 */}
              <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-card-foreground flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">❓</span>
                    <span>Vad är Microsoft Dynamics 365 – och hur fungerar det?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>• <strong>Vad Dynamics 365 är:</strong> En svit av affärssystem (ERP)- och CRM-appar som täcker allt från ekonomi och lager till försäljning och kundservice</p>
                    <p>• <strong>Hur applikationerna hänger ihop:</strong> Alla appar delar samma dataplattform och kan integreras sömlöst</p>
                    <p>• <strong>Flexibilitet:</strong> Du kan börja med en enda applikation och växa över tid, eller implementera en komplett helhetslösning från start</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fråga 2 */}
              <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-card-foreground flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">❓</span>
                    <span>Vilken Dynamics 365-lösning passar vårt företag bäst?</span>
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
              <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-card-foreground flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">❓</span>
                    <span>Vad kostar Dynamics 365 – och vad påverkar priset?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p className="italic mb-3">En av de mest sökta frågorna:</p>
                    <p>• <strong>Licenspriser per användare:</strong> Varierar från ca 550 kr/mån för grundläggande licenser upp till 3500+ kr/mån för avancerade användare (det finns även en så kallad "Tenant-prissättning", dvs per installation, som in första hand gäller Dynamics 365 Customer Insights/Marketing Automation). Titta gärna under respektive huvudrubrik för en mer detaljerad genomgång av licensavgifter.</p>
                    <p>• <strong>Vad tillkommer:</strong> Implementation, anpassningar, integration, utbildning och löpande support</p>
                    <p>• <strong>Projektbudget:</strong> Här beror det väldigt mycket på vilken applikation, hur stor verksamheten är och ambitionsnivå. Räkna med en total projektkostnad som startar från 50 000 kr (BC startpaket) till ett 10-tal miljoner (Finance & Supply Chain för internationella Enterprisebolag)</p>
                    <ContactFormDialog>
                      <Button variant="link" className="mt-4 italic p-0 h-auto font-normal text-muted-foreground hover:text-primary">
                        Kontakta oss så får du snabbt en tydligare uppfattning av såväl licensavgifter som projektkostnader
                      </Button>
                    </ContactFormDialog>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fråga 4 */}
              <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-card-foreground flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">❓</span>
                    <span>Hur lång tid tar det att implementera Dynamics 365?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p className="italic mb-3">Under respektive huvudrubrik hittar du en mer detaljerad genomgång av projektkostnader för respektive affärsapplikation</p>
                    <p>• <strong>Typisk implementationsresa:</strong> 3-6 månader för Business Central, 9-18 månader för F&SCM och för CRM är det väldigt beroende av omfattning i antal användare och vilken av CRM-applikationerna, men räkna med från 2 månader och mer</p>
                    <p>• <strong>Vad krävs internt:</strong> Engagerad projektledare, dedikerade nyckelanvändare och tid för workshop och testning</p>
                    <p>• <strong>Affärsnytta:</strong> Första fördelarna syns ofta redan efter 2-3 månader, full ROI uppnås vanligtvis inom 1-2 år</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fråga 5 */}
              <AccordionItem value="item-5" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-card-foreground flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">❓</span>
                    <span>Hur fungerar Dynamics 365 med våra befintliga system och Microsoft 365?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p className="italic mb-3">Integration är avgörande:</p>
                    <p>• <strong>Microsoft 365-integration:</strong> Sömlös integration med Outlook, Teams och Excel – arbeta direkt i de verktyg du redan använder</p>
                    <p>• <strong>Befintliga system:</strong> Enkelt att koppla samman med e-handel, lönesystem, BI-verktyg och andra affärssystem via API:er</p>
                    <p>• <strong>Power Platform:</strong> Skapa egna appar, automatisera arbetsflöden och bygga dashboards utan att behöva programmera</p>
                    <p>• <strong>AI & Agents:</strong> Inbyggd AI/Copilot i alla affärsapplikationer och där autonoma Agenter revolutionerar affärsprocesser</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fråga 6 */}
              <AccordionItem value="item-6" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-card-foreground flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">🤝</span>
                    <span>Vilka Microsoftpartners borde passa vår verksamhet bäst?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p className="italic mb-3">Att välja rätt implementationspartner är avgörande för ett lyckat projekt. Här är några viktiga faktorer:</p>
                    <p>• <strong>Branschkunskap:</strong> Välj en partner med erfarenhet från din bransch och som förstår dina specifika utmaningar</p>
                    <p>• <strong>Kompetens:</strong> Se till att partnern har certifierade konsulter inom de Dynamics 365-applikationer du behöver</p>
                    <p>• <strong>Storlek och kapacitet:</strong> En partner som matchar din företagsstorlek och kan växa med dina behov</p>
                    <p>• <strong>Geografisk närvaro:</strong> Lokal närvaro kan vara viktig för löpande support och samarbete</p>
                    <p className="pt-2">
                      <Link to="/valj-partner" className="text-primary hover:underline font-semibold">
                        → Utforska vårt partnerkatalog för att hitta rätt match för ditt företag
                      </Link>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Solution Selector Section */}
      <section id="solutions" className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Välj din lösning
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              <span className="whitespace-nowrap">Microsoft Dynamics 365</span> erbjuder lösningar för både affärssystem och kundhantering
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {/* Business Central Card */}
            <div className="bg-card rounded-lg p-4 sm:p-6 md:p-8 border border-border hover:shadow-[var(--shadow-hover)] transition-all duration-300">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <img src={BusinessCentralIcon} alt="Business Central" className="h-8 w-8 sm:h-10 sm:w-10" />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-card-foreground">Business Central</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Komplett affärssystem för mindre och medelstora företag
                </p>
              </div>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>• Hantera ekonomi och redovisning</li>
                  <li>• Order, Lager, Inköp</li>
                  <li>• Projekthantering</li>
                  <li>• Material- och Produktionsstyrning</li>
                  <li>• Serviceorder</li>
                  <li>• Inbyggd AI</li>
                </ul>
              </div>
              
              <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground text-sm">
                <Link to="/business-central">
                  Läs mer
                </Link>
              </Button>
            </div>

            {/* Finance & Supply Chain Card */}
            <div className="bg-card rounded-lg p-4 sm:p-6 md:p-8 border border-border hover:shadow-[var(--shadow-hover)] transition-all duration-300">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                  <div className="flex gap-1">
                    <img src={FinanceIcon} alt="Finance" className="h-8 w-8 sm:h-10 sm:w-10" />
                    <img src={SupplyChainIcon} alt="Supply Chain" className="h-8 w-8 sm:h-10 sm:w-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-card-foreground">Finance & SCM</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Passar för större internationella verksamheter och koncerner
                </p>
              </div>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>• Global ekonomihantering</li>
                  <li>• Avancerad tillverkning</li>
                  <li>• Komplex leveranskedja</li>
                  <li>• IoT och AI-integration</li>
                </ul>
              </div>
              
              <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground text-sm">
                <Link to="/finance-supply-chain">
                  Läs mer
                </Link>
              </Button>
            </div>

            {/* Marknad & Sälj Card */}
            <div className="bg-card rounded-lg p-4 sm:p-6 md:p-8 border border-border hover:shadow-[var(--shadow-hover)] transition-all duration-300">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                  <div className="flex gap-1">
                    <img src={SalesIcon} alt="Sales" className="h-8 w-8 sm:h-10 sm:w-10" />
                    <img src={MarketingIcon} alt="Customer Insights" className="h-8 w-8 sm:h-10 sm:w-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-card-foreground">Marknad & Sälj</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Sales och Customer Insights
                </p>
              </div>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>• Öka försäljning och hantera leads</li>
                  <li>• Automatisera marknadsföring</li>
                  <li>• AI-driven kundinsikt</li>
                  <li>• Pipeline-hantering</li>
                </ul>
              </div>
              
              <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground text-sm">
                <Link to="/crm">
                  Läs mer
                </Link>
              </Button>
            </div>

            {/* Kundservice Card */}
            <div className="bg-card rounded-lg p-4 sm:p-6 md:p-8 border border-border hover:shadow-[var(--shadow-hover)] transition-all duration-300">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                  <div className="flex gap-1">
                    <img src={CustomerServiceIcon} alt="Customer Service" className="h-8 w-8 sm:h-10 sm:w-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-card-foreground">Kundservice</h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Customer Service, Field Service, Contact Center
                </p>
              </div>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                  <li>• Förbättra kundservice och support</li>
                  <li>• Fältservice och arbetsorder</li>
                  <li>• Omnikanalskommunikation</li>
                  <li>• AI-assisterad ärendehantering</li>
                </ul>
              </div>
              
              <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground text-sm">
                <Link to="/d365-customer-service">
                  Läs mer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Microsoft Agents Section - NEW! */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                Microsoft Agenter
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-2">
                Nästa generation av AI-automation i Dynamics 365
              </p>
              <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
                Autonoma AI-agenter som arbetar självständigt 24/7 för att lösa komplexa affärsuppgifter och koordinera mellan system
              </p>
            </div>

            {/* Main Concept Card */}
            <div className="bg-card rounded-2xl p-6 sm:p-8 border-2 border-primary/20 mb-8 hover:shadow-2xl transition-all">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-primary to-accent w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xl">🤖</span>
                    </div>
                    <div>
                    <h3 className="text-xl font-bold text-card-foreground mb-2">Vad är Agenter?</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Medan <strong>Copilot</strong> fungerar som din AI-assistent som hjälper dig med uppgifter, 
                      är <strong>Agenter</strong> autonoma AI-system som kan utföra komplexa arbetsflöden självständigt, 
                      fatta beslut och koordinera med andra system - allt baserat på dina affärsregler.
                    </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-card-foreground text-sm mb-3">Exempel på Agenter:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-primary font-bold">💼</span>
                      <div>
                        <strong className="text-card-foreground">Sales Agent:</strong>
                        <span className="text-muted-foreground"> Kvalificerar leads, skickar uppföljningar, föreslår priser</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary font-bold">🎧</span>
                      <div>
                        <strong className="text-card-foreground">Service Agent:</strong>
                        <span className="text-muted-foreground"> Löser ärenden automatiskt, eskalerar vid behov</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary font-bold">📦</span>
                      <div>
                        <strong className="text-card-foreground">Supply Chain Agent:</strong>
                        <span className="text-muted-foreground"> Optimerar lager, hanterar leverantörer, löser störningar</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary font-bold">💰</span>
                      <div>
                        <strong className="text-card-foreground">Finance Agent:</strong>
                        <span className="text-muted-foreground"> Processar fakturor, utför avstämningar, skapar prognoser</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison: Copilot vs Agents */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-secondary w-10 h-10 rounded-lg flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>
                  <h4 className="text-lg font-bold text-card-foreground">Copilot</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  AI-assistent som stödjer användaren
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Hjälper med uppgifter på begäran</li>
                  <li>✓ Kräver användarinteraktion</li>
                  <li>✓ Ger förslag och rekommendationer</li>
                  <li>✓ Arbetar inom en applikation</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm rounded-xl p-6 border-2 border-primary/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-primary to-accent w-10 h-10 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⚡</span>
                  </div>
                  <h4 className="text-lg font-bold text-foreground">Agenter</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Autonoma AI-system som arbetar självständigt
                </p>
                <ul className="space-y-2 text-sm text-foreground/90 font-medium">
                  <li>✓ Utför hela arbetsflöden automatiskt</li>
                  <li>✓ Arbetar självständigt 24/7</li>
                  <li>✓ Fattar beslut baserat på affärsregler</li>
                  <li>✓ Koordinerar mellan system och team</li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                <Link to="/agents">
                  Upptäck Microsoft Agenter
                  <span className="ml-2">→</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Selection Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-amber-500/20 w-16 h-16 rounded-full flex items-center justify-center">
                <span className="text-3xl">🤝</span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Vikten av rätt implementationspartner
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
              Att välja rätt implementationspartner är ofta den viktigaste faktorn för en lyckad Dynamics 365-implementation. 
              En bra partner förstår din bransch, har beprövad erfarenhet och blir en långsiktig samarbetspartner – 
              inte bara en leverantör. Fel val kan kosta tid, pengar och frustration, medan rätt partner kan vara 
              skillnaden mellan ett projekt som levererar verkligt affärsvärde och ett som aldrig når sin fulla potential.
            </p>
            <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
              <Link to="/valj-partner" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Hitta rätt partner
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Lead Magnet Banner */}
      <div className="flex justify-center mb-4">
        <UrgencyBadge variant="consultation" />
      </div>
      <LeadMagnetBanner sourcePage="index" />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Redo att komma igång?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Boka en gratis konsultation så hjälper vi dig hitta rätt lösning för din verksamhet
          </p>
          <Button asChild size="lg" variant="secondary" className="text-sm sm:text-base md:text-lg bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(190,85%,50%)] hover:shadow-[var(--shadow-accent)] text-white border-0">
            <Link to="/kontakt">Kontakta oss idag!</Link>
          </Button>
        </div>
      </section>
      </main>

      <Footer />
    </div>;
};
export default Index;