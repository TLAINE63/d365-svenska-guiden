import { Button } from "@/components/ui/button";
import PricingCard from "@/components/PricingCard";
import LeadMagnetBanner from "@/components/LeadMagnetBanner";
import UrgencyBadge from "@/components/UrgencyBadge";
import VideoCard from "@/components/VideoCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormDialog from "@/components/ContactFormDialog";
import HeroCarousel from "@/components/HeroCarousel";
import CommonMistakesTeaser from "@/components/CommonMistakesTeaser";
import ScrollCTA from "@/components/ScrollCTA";
import SEOHead from "@/components/SEOHead";
import { OrganizationSchema, WebSiteSchema, FAQSchema, LocalBusinessSchema } from "@/components/StructuredData";
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

const homeFaqs = [
  { question: "Vad är Microsoft Dynamics 365?", answer: "Microsoft Dynamics 365 är en svit av affärssystem (ERP)- och CRM-appar som täcker allt från ekonomi och lager till försäljning och kundservice. Alla appar delar samma dataplattform och kan integreras sömlöst." },
  { question: "Vilken Dynamics 365-lösning passar vårt företag bäst?", answer: "Mindre företag börjar ofta med Business Central, medan större koncerner väljer Finance & Supply Chain Management. CRM-appar som Sales och Customer Service kan kombineras med båda ERP-lösningarna." },
  { question: "Vad kostar Dynamics 365?", answer: "Licenspriser varierar från ca 550 kr/mån för grundläggande licenser upp till 3500+ kr/mån för avancerade användare. Projektkostnader startar från 50 000 kr för startpaket till flera miljoner för Enterprise-implementeringar." },
  { question: "Hur lång tid tar det att implementera Dynamics 365?", answer: "Typisk implementationsresa är 3-6 månader för Business Central, 9-18 månader för Finance & SCM. För CRM beror det på omfattning men räkna med från 2 månader." },
  { question: "Hur fungerar Dynamics 365 med Microsoft 365?", answer: "Dynamics 365 integreras sömlöst med Outlook, Teams och Excel. Power Platform möjliggör egna appar och automatiseringar. AI/Copilot är inbyggd i alla affärsapplikationer." },
];
const Index = () => {
  return <div className="min-h-screen bg-background">
      <SEOHead 
        title="Microsoft Dynamics 365 – Guide till ERP & CRM i Sverige | d365.se"
        description="Oberoende guide till Microsoft Dynamics 365. Jämför Business Central, Finance & SCM, Sales och Customer Service. Transparenta priser, behovsanalyser och hjälp att välja rätt partner i Sverige."
        canonicalPath="/"
        keywords="Microsoft Dynamics 365, Dynamics 365 Business Central, Dynamics 365 Finance, ERP system Sverige, CRM system, affärssystem Microsoft, Dynamics 365 partner Sverige, Business Central pris, implementering Dynamics 365"
        ogImage="https://d365.se/og-image.png"
      />
      <OrganizationSchema />
      <WebSiteSchema />
      <LocalBusinessSchema />
      <FAQSchema faqs={homeFaqs} />
      <Navbar />
      
      <main>
      
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Partner Value Proposition */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Hitta rätt Dynamics 365‑partner – snabbare, enklare och tryggare
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              Att välja ERP- eller CRM‑system är stort. Men att välja rätt partner är ännu viktigare.
              På d365.se hjälper vi dig att förstå dina behov, jämföra alternativ och hitta en partner som passar exakt för din verksamhet – baserat på bransch, storlek, systemkrav och budget.
            </p>
            <p className="text-base sm:text-lg font-semibold text-primary">
              Oberoende. Kostnadsfritt. Kompetensdrivet.
            </p>
          </div>
        </div>
      </section>

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
                    <p>Microsoft Dynamics 365 är Microsofts plattform för affärssystem (ERP) och kundrelationshantering (CRM). Det är inte ett enda system, utan en familj av specialiserade affärsapplikationer som alla delar samma dataplattform och kan integreras sömlöst med varandra.</p>
                    <p>• <strong>ERP-sidan</strong> täcker ekonomi, inköp, lager, produktion, projekt och supply chain – med apparna <em>Business Central</em> (för SMB) och <em>Finance & Supply Chain Management</em> (för större koncerner).</p>
                    <p>• <strong>CRM-sidan</strong> täcker försäljning, marknadsföring, kundservice och fältservice – med apparna <em>Sales</em>, <em>Customer Insights</em>, <em>Customer Service</em>, <em>Field Service</em> och <em>Contact Center</em>.</p>
                    <p>• <strong>AI är inbyggt</strong> i samtliga appar via Microsoft Copilot och autonoma Agenter – inte ett tillägg utan en naturlig del av arbetsflödena.</p>
                    <p>• <strong>Flexibilitet:</strong> Du kan börja med en enda app och bygga ut steg för steg. ERP och CRM kan också köras separat om du redan har ett befintligt system på ena sidan.</p>
                    <p className="pt-1 text-sm italic">Dynamics 365 körs alltid i molnet (Microsoft Azure) och faktureras per användare och månad – inga servrar eller egna installationer krävs.</p>
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
                    <p>Det beror på om du primärt behöver ett <strong>affärssystem (ERP)</strong> eller ett <strong>CRM-system</strong> – eller båda. Här är de vanligaste scenarierna:</p>
                    <p>• <strong>Business Central</strong> passar dig om du är ett litet eller medelstort företag (10–500 anställda) och behöver ett modernt allt-i-ett affärssystem för ekonomi, lager, inköp och projekt. Vanligt i branscher som tillverkning, distribution, bygg och konsulttjänster.</p>
                    <p>• <strong>Finance & Supply Chain Management</strong> passar dig om du är en större koncern med komplexa globala flöden, flera juridiska enheter eller avancerade produktionskrav. Kräver mer av implementering och intern resurser.</p>
                    <p>• <strong>Dynamics 365 Sales</strong> passar dig om du vill digitalisera och effektivisera din säljprocess – pipeline-hantering, offerthantering och kundrelationer.</p>
                    <p>• <strong>Customer Service & Field Service</strong> passar dig om du hanterar ärenden, garantier, serviceavtal eller fälttekniker som behöver digital planering och support.</p>
                    <p>• <strong>Customer Insights</strong> passar dig om du vill arbeta datadrivet med marknadsföring, kampanjer och personalisering mot kunder.</p>
                    <p className="pt-1">
                      <Link to="/behovsanalys" className="text-primary hover:underline font-semibold">→ Gör vår kostnadsfria ERP-behovsanalys</Link> eller <Link to="/salj-marknad-behovsanalys" className="text-primary hover:underline font-semibold">CRM-behovsanalys</Link> för en personlig rekommendation.
                    </p>
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
                    <p>Kostnaden för Dynamics 365 består av två delar: <strong>löpande licensavgifter</strong> och en engångs <strong>implementeringskostnad</strong>.</p>
                    <p>• <strong>Business Central:</strong> Från ca 550 kr/mån (Essentials) till ca 780 kr/mån (Premium) per fullständig användare. Teammedlemmar med begränsad åtkomst kostar från ca 70 kr/mån.</p>
                    <p>• <strong>Finance & Supply Chain:</strong> Från ca 3 500 kr/mån per aktiv användare, med aktivitetsbaserade licenser från ca 90 kr/mån för mer begränsad åtkomst.</p>
                    <p>• <strong>Sales & Customer Service:</strong> Från ca 800–1 100 kr/mån per användare beroende på applikation och licensnivå.</p>
                    <p>• <strong>Customer Insights (Marketing):</strong> Prissätts per antal kontakter/sessions (tenant-prissättning), inte per användare – startar från ca 15 000 kr/mån.</p>
                    <p>• <strong>Projektkostnad:</strong> Implementeringen är ofta den stora posten. Räkna med allt från 50 000–150 000 kr för ett BC-startpaket till flera miljoner för ett enterprise Finance & SCM-projekt.</p>
                    <p>• <strong>Vad påverkar priset:</strong> Antal användare, grad av anpassning, integrationer mot befintliga system, utbildningsbehov och löpande support.</p>
                    <ContactFormDialog>
                      <Button variant="link" className="mt-2 italic p-0 h-auto font-normal text-muted-foreground hover:text-primary">
                        Kontakta oss så får du snabbt en tydligare uppfattning av såväl licensavgifter som projektkostnader →
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
                    <p>Implementationstiden varierar kraftigt beroende på applikation, verksamhetens komplexitet och ambitionsnivå. Här är typiska tidshorisonter:</p>
                    <p>• <strong>Business Central (startpaket):</strong> 2–4 månader. Passar dig som vill upp och rulla snabbt med standardkonfiguration och minimal anpassning.</p>
                    <p>• <strong>Business Central (fullständig implementation):</strong> 4–9 månader, ibland längre vid komplexa produktions- eller projektmiljöer.</p>
                    <p>• <strong>Finance & Supply Chain Management:</strong> 9–18 månader är vanligt, och för internationella utrullningar med flera länder räkna med 18–36 månader.</p>
                    <p>• <strong>Dynamics 365 Sales / Customer Service:</strong> 2–6 månader beroende på antal användare, integrationer och grad av processanpassning.</p>
                    <p>• <strong>Customer Insights (Marketing Automation):</strong> 2–4 månader för grundupplägg, men datakvalitetsarbete och segmenteringslogik tar ofta extra tid.</p>
                    <p>• <strong>Vad krävs internt:</strong> En engagerad projektledare, dedikerade nyckelanvändare och tid för workshops, test och utbildning. Interna resurser är ofta den mest kritiska framgångsfaktorn.</p>
                    <p>• <strong>Första affärsnyttan</strong> syns ofta redan efter 2–3 månader. Full ROI uppnås vanligtvis inom 1–2 år.</p>
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
                    <p>Integration är en av de starkaste egenskaperna i Dynamics 365, och ett av de viktigaste argumenten för att välja Microsoft-stacken:</p>
                    <p>• <strong>Microsoft 365 (Outlook, Teams, Excel):</strong> Sömlös tvåvägsynkronisering – du kan hantera kunderbjudanden, ärenden och order direkt från Outlook eller Teams utan att byta system. Exportera och analysera data i Excel med ett klick.</p>
                    <p>• <strong>Power Platform (Power Apps, Power Automate, Power BI):</strong> Bygg egna arbetsflöden, mobilappar och rapporter utan att koda. Power BI kopplar direkt mot Dynamics 365-data för realtidsdashboards.</p>
                    <p>• <strong>Befintliga affärssystem:</strong> Via standard-API:er (REST/OData) och Microsoft Dataverse kan du integrera mot e-handel, lönesystem, tullsystem, WMS, BI-verktyg och andra affärssystem. Färdiga kopplingarna finns via Marketplace för hundratals populära system.</p>
                    <p>• <strong>Azure och säkerhet:</strong> All data lagras i Microsoft Azure med enterprise-grade säkerhet, GDPR-efterlevnad och möjlighet att välja dataregion (t.ex. EU).</p>
                    <p>• <strong>AI & Copilot:</strong> Microsoft Copilot är inbyggt i alla Dynamics 365-appar och kan hjälpa med att sammanfatta ärenden, föreslå svar, skapa offerter eller förutsäga lagerbehov – beroende på vilken app du använder.</p>
                    <p>• <strong>Autonoma Agenter:</strong> Den senaste AI-innovationen låter dig sätta upp agenter som självständigt hanterar processer som leadkvalificering, ärenderouting eller leveransavvikelser utan manuell handpåläggning.</p>
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
                    <p>Att välja rätt implementationspartner är minst lika viktigt som att välja rätt system. En felaktig partner är den vanligaste orsaken till att ERP- och CRM-projekt misslyckas eller överstiger budget.</p>
                    <p>• <strong>Branschkunskap:</strong> Välj en partner som har referenskunder i din specifika bransch – inte bara generell Dynamics 365-erfarenhet. En partner som förstår tillverkningens processer är fundamentalt annorlunda mot en partner med fokus på konsultbranschen.</p>
                    <p>• <strong>Applikationsfokus:</strong> Kontrollera att partnern verkligen är specialiserad på den app du implementerar. Många partners är starka på ERP men svaga på CRM – och tvärtom. En partner som "kan allt" har ofta djupkompetens på bara en del.</p>
                    <p>• <strong>Storlek och kapacitet:</strong> En partner vars konsultkapacitet matchar ditt projekts storlek och tidplan. Risken med en för liten partner är resursbrist; med en för stor partner att du hamnar hos juniora konsulter.</p>
                    <p>• <strong>Geografisk närvaro:</strong> Lokal närvaro underlättar workshops, utbildning och löpande support – men de flesta partners levererar idag hybridprojekt med en mix av digitalt och på plats.</p>
                    <p>• <strong>Kundexempel och referenser:</strong> Be alltid om 2–3 referenskunder i liknande bransch och storlek. Hur lång tid tog projektet? Vad gick bra? Vad var utmanande?</p>
                    <p className="pt-2">
                      <Link to="/valj-partner" className="text-primary hover:underline font-semibold">
                        → Utforska partnerkatalogen och använd AI-guiden för att hitta rätt match
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
                <Link to="/business-central" aria-label="Läs mer om Business Central">
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
                <Link to="/finance-supply-chain" aria-label="Läs mer om Finance & Supply Chain Management">
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
                <Link to="/crm" aria-label="Läs mer om Dynamics 365 Marknad & Sälj">
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
                <Link to="/d365-customer-service" aria-label="Läs mer om Dynamics 365 Kundservice">
                  Läs mer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes Teaser */}
      <CommonMistakesTeaser />

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

      {/* Scroll-triggered CTA */}
      <ScrollCTA />

      <Footer />
    </div>;
};
export default Index;