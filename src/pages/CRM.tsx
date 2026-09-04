import { useIndustryDeepLink } from "@/hooks/useIndustryDeepLink";
import FunnelCTA from "@/components/FunnelCTA";
import ProductHero from "@/components/ProductHero";
import PageOfferBanner from "@/components/PageOfferBanner";
import ShortAnswer from "@/components/ShortAnswer";
import RelatedPages, { crmRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RelevantVideosSection from "@/components/RelevantVideosSection";
import ProductPartnerNewsSection from "@/components/ProductPartnerNewsSection";
import UnprofiledPartnersList from "@/components/UnprofiledPartnersList";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ArrowRight, ExternalLink, FileText } from "lucide-react";
import { FilterButtons, MultiFilterButtons } from "@/components/FilterButtons";
import { SizeFilters } from "@/components/SizeFilters";
import LeadCTA from "@/components/LeadCTA";
import PartnerCard from "@/components/PartnerCard";
import SearchResultSummary from "@/components/partner/SearchResultSummary";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import SalesIcon from "@/assets/icons/Sales.svg";
import CustomerServiceIcon from "@/assets/icons/CustomerService.svg";
import MarketingIcon from "@/assets/icons/Marketing.svg";
import { crmApplications, allIndustries } from "@/data/partners";
import { usePartners } from "@/hooks/usePartners";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";
import { filterAndSortPartners, getProductIndustries, hasProduct } from "@/hooks/usePartnerFilters";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

// Breadcrumb items
const crmBreadcrumbs = [
 { name: "Hem", url: "https://d365.se" },
 { name: "Customer Engagement (CRM)", url: "https://d365.se/crm" },
];
import {
 Accordion,
 AccordionContent,
 AccordionItem,
 AccordionTrigger,
} from "@/components/ui/accordion";
import { usePartnerImpressions } from "@/hooks/usePartnerImpressions";

// CRM FAQs for schema
const crmFaqs = [
 {
 question: "CRM-system – vad är det?",
 answer: "Ett CRM-system (Customer Relationship Management) är ett system där företaget samlar allt som rör kunder och prospekt: kontakter, affärer i pipeline, offerter, aktiviteter, ärenden och kundhistorik. Syftet är att sälj, marknad och kundservice arbetar mot samma kunddata i stället för egna listor och inkorgar. Microsofts CRM heter Dynamics 365 Customer Engagement och består av Sales, Customer Service, Customer Insights (Marketing Automation), Field Service och Contact Center."
 },
 {
 question: "Vad gör en CRM-konsult?",
 answer: "En CRM-konsult kartlägger sälj- och serviceprocesser, konfigurerar CRM-systemet efter dem, sätter upp behörigheter, dashboards och automatiseringar, migrerar kunddata från gamla system, bygger integrationer mot ERP och e-post samt utbildar användarna. Rollen delas ofta upp i funktionskonsult (process och konfiguration), teknisk konsult (integration och kod) och lösningsarkitekt (helhet och dataarkitektur). Efter driftsättning är det oftast samma konsultteam som sköter förvaltning och vidareutveckling."
 },
 {
 question: "Vad kostar CRM system i Sverige – Dynamics 365 jämförelse?",
 answer: "CRM system pris Sverige 2026 (Microsofts listpris, exkl. moms): Dynamics 365 Sales Professional 621 kr/användare/mån, Sales Enterprise 1 004 kr/mån, Sales Premium 1 434 kr/mån. Customer Service Professional 478 kr/mån, Customer Service Enterprise 1 004 kr/mån, Customer Service Premium 1 864 kr/mån. Field Service 1 004 kr/mån. Contact Center (komplett) 1 051 kr/mån. Customer Insights prissätts per tenant från 16 250 kr/mån (attach-pris 9 559 kr/mån för bolag med minst 10 befintliga D365-licenser). Implementeringskostnad: standardimplementering Sales/Customer Service från 100 000–250 000 kr, större projekt 4–6 månader och 500 000–2 MSEK."
 },
 {
 question: "Dynamics 365 CRM vs Salesforce – vilket ska jag välja?",
 answer: "Dynamics 365 vs Salesforce: Dynamics 365 sticker ut genom djup inbyggd integration med Microsoft 365 (Outlook, Teams, Excel), kraftfull AI via Copilot utan extra kostnad, och möjligheten att kombinera CRM med Microsoft ERP (Business Central, Finance). Salesforce har bredare tredjepartsekosystem men kräver fler integrationer mot Microsoft-verktyg du redan betalar för. För företag med Microsoft 365-infrastruktur är TCO ofta lägre med Dynamics 365."
 },
 {
 question: "Vad är Microsoft Dynamics 365 CRM?",
 answer: "Microsoft Dynamics 365 CRM (Customer Engagement) är en svit av molnbaserade affärsapplikationer för försäljning, kundservice, marknadsföring, kontaktcenter och fältservice. Det hjälper företag att hantera kundrelationer, automatisera säljprocesser och leverera bättre kundservice med inbyggd AI via Microsoft Copilot – ingår i befintlig licens utan extra avgift."
 },
 {
 question: "Hur snabbt kan vi implementera Dynamics 365 CRM i Sverige?",
 answer: "CRM implementering Sverige: En standardimplementering av Dynamics 365 Sales eller Customer Service kan vara klar på 2–3 månader. Större implementeringar med flera applikationer, anpassade processer och integrationer tar normalt 4–6 månader. Microsoft-certifierade CRM-partners arbetar enligt Success by Design för att hålla tidsplan och budget."
 },
 {
 question: "Vilka Dynamics 365 CRM-applikationer finns tillgängliga?",
 answer: "Microsoft erbjuder dessa CRM-applikationer: Dynamics 365 Sales (sälj & pipeline), Customer Insights/Marketing (marknadsföring & kunddata), Customer Service (kundtjänst & ärenden), Field Service (fältservice & tekniker), och Contact Center (omnikanal-kundservice). Alla delar samma Dataverse-dataplattform och kan kombineras fritt."
 },
 {
 question: "Dynamics 365 CRM vs HubSpot – för vem passar vad?",
 answer: "HubSpot passar bäst för nystartade och digitalt mogna bolag (1–50 anst.) med fokus på inbound marketing och enkel säljhantering. Dynamics 365 Sales passar bättre för medelstora till stora företag (50+ anst.) som behöver djup Microsoft-integration, avancerad AI, komplexa säljprocesser och möjlighet att skala mot ERP-integration. HubSpot saknar native-integration mot Microsoft 365 utan tilläggskostnader."
 },
 {
 question: "Behöver man en Microsoft-partner för att implementera Dynamics 365 CRM?",
 answer: "Ja, Dynamics 365 CRM implementeras via Microsoft-certifierade partners med specialistkompetens (Solutions Partner for Business Applications). En erfaren partner hjälper till med konfiguration, anpassning, datamigrering och utbildning. På d365.se kan du kostnadsfritt jämföra och filtrera certifierade Dynamics 365 CRM-partners i Sverige per bransch."
 },
];

// Geography filter options
const geographyFilters = [
 { label: "Sverige", value: "Sverige" },
 { label: "Norden", value: "Norden" },
 { label: "Europa", value: "Europa" },
 { label: "Globalt", value: "Globalt" }
];

const CRM = () => {
 const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
 const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
 const [selectedGeography, setSelectedGeography] = useState<string | null>(null);
 const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);
 const [selectedRevenue, setSelectedRevenue] = useState<string | null>(null);

 // Aktiva filter följer med till jämförelsesidan
 const { setFilterContext: setCompareFilters } = usePartnerCompare();
 useEffect(() => {
  setCompareFilters({
   product: null,
   industry: selectedIndustry || null,
   geography: selectedGeography || null,
   companySize: selectedCompanySize || null,
   revenue: selectedRevenue || null,
  });
 }, [selectedIndustry, selectedGeography, selectedCompanySize, selectedRevenue, setCompareFilters]);
 
 // Fetch partners from database (only featured partners)
 const { data: partners = [], isLoading } = usePartners();

 const toggleApplication = (app: string) => {
 setSelectedApplications(prev => 
 prev.includes(app) 
 ? prev.filter(a => a !== app)
 : [...prev, app]
 );
 };

 const { skipTopScroll } = useIndustryDeepLink(setSelectedIndustry);

 useEffect(() => {
 if (!skipTopScroll) window.scrollTo(0, 0);
 }, [skipTopScroll]);


 // Filter partners for CRM (using sales and service product keys)
 const crmPartners = useMemo(() => {
 // CRM partners have either sales or service product filters
 let filtered = partners.filter(p => hasProduct(p, 'sales') || hasProduct(p, 'service'));
 
 // Apply industry filter if selected
 if (selectedIndustry) {
 filtered = filtered.filter(p => {
 const salesIndustries = p.product_filters?.sales?.industries || [];
 const serviceIndustries = p.product_filters?.service?.industries || [];
 return salesIndustries.includes(selectedIndustry) || serviceIndustries.includes(selectedIndustry);
 });
 }

 // Apply geography filter if selected
 if (selectedGeography) {
 const geographyHierarchy = ["Sverige", "Norden", "Europa", "Globalt"];
 const selectedGeoIndex = geographyHierarchy.indexOf(selectedGeography);
 filtered = filtered.filter(p => {
 const salesGeo = p.product_filters?.sales?.geography || ['Sverige'];
 const serviceGeo = p.product_filters?.service?.geography || ['Sverige'];
 const allGeo = [...salesGeo, ...serviceGeo];
 return allGeo.some(geo => geographyHierarchy.indexOf(geo) >= selectedGeoIndex);
 });
 }

 // Soft size filtering (across sales + service): empty target = match all
 if (selectedCompanySize) {
 filtered = filtered.filter(p => {
 const salesSizes = p.product_filters?.sales?.companySize || [];
 const serviceSizes = p.product_filters?.service?.companySize || [];
 const merged = [...salesSizes, ...serviceSizes];
 return merged.length === 0 || merged.includes(selectedCompanySize);
 });
 }

 if (selectedRevenue) {
 filtered = filtered.filter(p => {
 const salesRev = p.product_filters?.sales?.revenue || [];
 const serviceRev = p.product_filters?.service?.revenue || [];
 const merged = [...salesRev, ...serviceRev];
 return merged.length === 0 || merged.includes(selectedRevenue);
 });
 }
 
 return filtered.sort((a, b) => a.name.localeCompare(b.name, 'sv'));
 }, [partners, selectedIndustry, selectedGeography, selectedCompanySize, selectedRevenue]);
  usePartnerImpressions("partner_list_impression", crmPartners, { surface: "product-crm" });

 // Get available industries for CRM partners
 const crmIndustries = useMemo(() => {
 const industries = new Set<string>();
 partners.forEach(partner => {
 partner.product_filters?.sales?.industries?.forEach(ind => industries.add(ind));
 partner.product_filters?.service?.industries?.forEach(ind => industries.add(ind));
 });
 return allIndustries.filter(ind => industries.has(ind));
 }, [partners]);
 return (
 <div className="min-h-screen">
 <SEOHead 
 title="CRM Sverige – Microsoft Dynamics 365 priser | d365.se"
 description="Microsoft Dynamics 365 Sales från 621 kr/mån, Customer Service från 478 kr/mån. Jämför mot Salesforce – köparsidig vägledning vid val av Microsoft-partner."
 canonicalPath="/crm"
 keywords="CRM system Sverige pris, Dynamics 365 CRM Sverige, Microsoft CRM system, Dynamics 365 Sales pris, CRM jämförelse Sverige, Dynamics 365 vs Salesforce, Customer Service CRM, CRM implementering Sverige, Microsoft CRM partner certifierad"
 ogImage="https://d365.se/og-crm.png"
 />
 <FAQSchema faqs={crmFaqs} />
 <ServiceSchema 
 name="Microsoft Dynamics 365 CRM – Sales, Marketing & Customer Service"
 description="Molnbaserade CRM-applikationer för försäljning, marknadsföring, kundservice och fältservice med inbyggd AI via Microsoft Copilot. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
 />
 <BreadcrumbSchema items={crmBreadcrumbs} />
 <Navbar />
 <main>
 
 {/* Header */}
  <ProductHero
  icon={SalesIcon}
  eyebrow="CRM (Customer Engagement)"
  title="Dynamics 365 CRM."
  titleAccent="6 applikationer – är alla partners specialister på allt?"
  subhead="Sales, Customer Insights, Customer Service, Field Service, Contact Center och Project Operations. Få partners kan allt. Vi hjälper dig hitta dem som faktiskt levererat det du behöver."
  primary={{
    label: "Jämför CRM-partners",
    onClick: () => document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth' }),
  }}
  secondary={{ label: "Generera en kravspecifikation", to: "/kravspecifikation-sales/", icon: FileText }}
  />


 <ShortAnswer title="Vad är Microsoft Dynamics 365 Customer Engagement (CRM)?">
 <p>Microsoft Dynamics 365 Customer Engagement – i dagligt tal Dynamics 365 CRM – är Microsofts samling av molnbaserade affärsapplikationer för försäljning, marknadsföring, kundservice, fältservice och kontaktcenter.</p>
 <p>Sviten omfattar <strong>Dynamics 365 Sales</strong> för pipeline- och offerthantering, <strong>Dynamics 365 Customer Service</strong> och <strong>Contact Center</strong> för ärendehantering och omnikanal-support, <strong>Dynamics 365 Field Service</strong> för planering och utförande av arbete ute hos kund, samt <strong>Customer Insights – Journeys</strong> och <strong>Data</strong> för marknadsföring, kundresor och en enhetlig kundprofil.</p>
 <p>Alla applikationer delar samma datamodell via Dataverse och är djupt integrerade med Microsoft 365 (Outlook, Teams, Excel), Power BI, Power Automate och Azure. Det ger en sammanhängande 360°-bild av kunden och eliminerar behovet av separata system för sälj, support och marknad.</p>
 <p>Inbyggd AI via Microsoft Copilot och nya autonoma agenter automatiserar repetitiva uppgifter – sammanfattning av ärenden, nästa-bästa-åtgärd i säljdialogen, automatisk dirigering av supportärenden och AI-genererade kundresor – direkt i de flöden där medarbetarna redan arbetar.</p>
 <p>Plattformen är tillgänglig globalt med stöd för flera språk, valutor och regelverk, och kan skalas från enstaka avdelningar till stora koncerner med tusentals användare.</p>
 </ShortAnswer>


 {/* FAQ Section */}
 <section className="py-8 sm:py-12 md:py-16 bg-secondary/50">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="max-w-4xl mx-auto">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
 Vanliga frågor om Dynamics 365 Customer Engagement
 </h2>
 
 <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
 <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 ❓ Vad är Dynamics 365 Customer Engagement och vad ingår i det?
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 space-y-4">
 <p>Dynamics 365 Customer Engagement är en kraftfull samling intelligenta affärsapplikationer, noggrant utformade för att hjälpa moderna företag att bygga, vårda och stärka sina kundrelationer på ett effektivt och strukturerat sätt.</p>
 <p>Plattformen samlar flera specialiserade lösningar under ett och samma tak:</p>
 <p><strong>Sales</strong> ger säljteam de verktyg de behöver för att driva affärer framåt – från prospektering till avslut – med stöd av AI-drivna insikter och automatisering.</p>
 <p><strong>Customer Service</strong> möjliggör en snabb och personlig service som möter kundernas förväntningar, oavsett kanal eller tidpunkt.</p>
 <p><strong>Customer Insights</strong> (tidigare Marketing) hjälper marknadsföringsteam att skapa målinriktade kampanjer och djupare förstå sina kunders beteenden och behov.</p>
 <p><strong>Contact Center</strong> samlar alla kundinteraktioner på ett ställe och ger agenterna rätt information i rätt ögonblick, för en smidigare och mer enhetlig kundupplevelse.</p>
 <p><strong>Field Service</strong> säkerställer att servicetekniker ute i fält alltid har tillgång till rätt resurser, schema och kundinformation – vilket leder till snabbare lösningar och nöjdare kunder.</p>
 <p><strong>Project Operations</strong> kopplar samman projektledning, resurser och ekonomi för att ge företag full kontroll över sina leveranser och lönsamhet.</p>
 <p>Det som gör Dynamics 365 Customer Engagement verkligt kraftfullt är hur alla dessa applikationer integreras sömlöst med varandra. Resultatet är en sammanhängande helhetsbild av varje enskild kund – vilket ger medarbetare på alla nivåer möjligheten att fatta välgrundade beslut och skapa genuint värde i varje kundmöte.</p>
 </AccordionContent>
 </AccordionItem>

 <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 ❓ Hur skiljer sig Dynamics 365 CE från andra CRM-system?
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 space-y-4">
 <p>Det finns många CRM-system på marknaden, men Dynamics 365 Customer Engagement har flera egenskaper som tillsammans gör det till ett unikt och framtidssäkrat val för företag som vill mer.</p>
 <p><strong>Ett hem i Microsoft-ekosystemet</strong></p>
 <p>En av de mest påtagliga fördelarna är den djupa och naturliga integrationen med Microsofts övriga produkter. Jobbar ditt team redan i Outlook, Teams eller Office 365? Då känns Dynamics 365 CE direkt bekant. E-post, möten, dokument och kunddata flödar sömlöst mellan systemen – utan krångliga kopplingar eller manuell hantering. Det handlar inte bara om teknisk integration, utan om att skapa ett sammanhängande arbetssätt som sparar tid och minskar friktionen i vardagen.</p>
 <p><strong>AI som faktiskt hjälper dig i jobbet</strong></p>
 <p>Dynamics 365 CE kommer med Microsoft Copilot inbyggt – en AI-assistent som inte bara automatiserar repetitiva uppgifter, utan aktivt hjälper användarna att arbeta smartare. Det kan handla om att sammanfatta ett kundärende, föreslå nästa steg i en säljprocess eller analysera trender i kunddata. Det är AI som känns praktisk och relevant, inte ett funktionslager som ingen använder.</p>
 <p><strong>Anpassa utan att koda</strong></p>
 <p>Många system kräver omfattande och kostsam utveckling för att passa just ditt företags processer. Dynamics 365 CE är byggt med flexibilitet i centrum – med lågkodslösningar och kraftfulla konfigurationsverktyg kan verksamheter anpassa flöden, formulär och automatiseringar utan att vara beroende av en utvecklare för varje liten förändring. Det ger organisationen större kontroll och snabbare anpassningsförmåga.</p>
 <p><strong>CRM och ERP – äntligen i ett</strong></p>
 <p>En annan stor skillnad är möjligheten att kombinera CRM med ERP i en och samma plattform. Genom att koppla ihop Dynamics 365 CE med exempelvis Business Central eller Finance &amp; Supply Chain Management får företaget en komplett affärslösning – från första kundkontakt till faktura och leverans. Det innebär att sälj, service, ekonomi och lager kan dela samma data och samma verklighet, vilket ger en helt ny nivå av transparens och effektivitet.</p>
 <p><strong>Byggt för att växa med dig</strong></p>
 <p>Oavsett om du är ett mindre team som precis kommit igång, eller en global organisation med komplexa behov, är Dynamics 365 CE designat för att skala. Du börjar där du är och bygger ut i den takt som passar din verksamhet – utan att behöva byta system när du växer.</p>
 <p>Sammantaget är det just kombinationen av Microsoft-integration, inbyggd AI, flexibilitet, ERP-koppling och skalbarhet som gör Dynamics 365 CE till något mer än ett traditionellt CRM – det är en plattform för hela affären.</p>
 <p className="text-sm pt-2 border-t border-border">
 <strong className="text-foreground">Se publicerade jämförelser mot etablerade CRM-alternativ:</strong>
 </p>
 <ul className="text-sm grid sm:grid-cols-2 gap-x-6 gap-y-1 list-disc pl-5">
 <li><Link to="/jamfor/sales-vs-salesforce-sales-cloud/" className="text-crm hover:underline font-medium">Sales vs Salesforce Sales Cloud</Link></li>
 <li><Link to="/jamfor/sales-vs-hubspot-sales-hub/" className="text-crm hover:underline font-medium">Sales vs HubSpot Sales Hub</Link></li>
 <li><Link to="/jamfor/customer-service-vs-salesforce-service-cloud/" className="text-crm hover:underline font-medium">Customer Service vs Salesforce Service Cloud</Link></li>
 <li><Link to="/jamfor/customer-service-vs-zendesk/" className="text-crm hover:underline font-medium">Customer Service vs Zendesk</Link></li>
 <li><Link to="/jamfor/customer-service-vs-servicenow-csm/" className="text-crm hover:underline font-medium">Customer Service vs ServiceNow CSM</Link></li>
 <li><Link to="/jamfor/customer-insights-vs-salesforce-marketing-cloud/" className="text-crm hover:underline font-medium">Customer Insights vs Salesforce Marketing Cloud</Link></li>
 <li><Link to="/jamfor/field-service-vs-salesforce-field-service/" className="text-crm hover:underline font-medium">Field Service vs Salesforce Field Service</Link></li>
 <li><Link to="/jamfor/" className="text-crm hover:underline font-medium">→ Se alla jämförelser</Link></li>
 </ul>
 </AccordionContent>
 </AccordionItem>

 <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 ❓ Hur mycket kostar Dynamics 365 Customer Engagement – och vad påverkar priset?
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 space-y-4">
 <p>Det finns inget enkelt svar på vad Dynamics 365 CE kostar, eftersom priset formas av just dina unika förutsättningar. Vilka applikationer behöver du? Hur många användare ska ha tillgång? Och hur komplex är din verksamhet? Nedan går vi igenom de viktigaste kostnadskomponenterna.</p>
 <p><strong>Licenskostnad per användare</strong></p>
 <p>Licenserna prissätts per användare och månad, och varierar beroende på vilken applikation och vilken nivå du väljer. Som en riktlinje kan nämnas att:</p>
 <p>Customer Service Professional börjar på 478 kr/användare/månad – ett bra alternativ för team som vill komma igång med strukturerad kundservice. Sales Professional ligger på 621 kr/användare/månad.</p>
 <p>Sales Enterprise och Customer Service Enterprise prissätts till 1 004 kr/användare/månad, medan Sales Premium (med fulla AI- och säljverktyg) ligger på 1 434 kr/användare/månad och Customer Service Premium på 1 864 kr/användare/månad. Field Service kostar 1 004 kr/användare/månad och Contact Center 1 051 kr/användare/månad (komplett).</p>
 <p>Customer Insights (marknadsföring &amp; kunddata) prissätts per tenant från 16 250 kr/månad – med ett lägre attach-pris på 9 559 kr/månad om du redan har minst 10 Dynamics 365-licenser.</p>
 <p>Mellan dessa nivåer finns flera kombinationer, vilket gör det möjligt att sätta ihop ett licenspaket som matchar både behov och budget. Priserna är Microsofts listpris i SEK exkl. moms – faktiskt pris kan variera beroende på avtal (EA, CSP), volym och kampanjer. Se vår fullständiga <a href="/priser/" className="text-crm hover:underline font-medium">prislista</a>.</p>
 <p><strong>Implementeringskostnader</strong></p>
 <p>Utöver licenserna tillkommer kostnader för att implementera och konfigurera systemet. Här spelar &quot;scope&quot; en avgörande roll:</p>
 <p>En enskild applikation – till exempel enbart Customer Service eller Sales – brukar kosta mellan 100 000 och 250 000 kr att implementera.</p>
 <p>En komplett lösning med flera integrerade applikationer, ERP-koppling och anpassade flöden kan ligga i intervallet 800 000 kr upp till 2 miljoner kronor.</p>
 <p>Det är viktigt att se implementeringskostnaden som en investering snarare än en utgift – en välgjord implementation lägger grunden för ett system som verkligen används och skapar värde.</p>
 <p><strong>Löpande kostnader</strong></p>
 <p>Efter att systemet är på plats tillkommer vanligtvis kostnader för support, förvaltning och löpande anpassningar. Verksamheter förändras, och ett CRM-system behöver utvecklas i takt med dina processer och behov. Många väljer att teckna ett förvaltningsavtal med sin partner för att säkerställa kontinuerlig hjälp och vidareutveckling.</p>
 <p><strong>Hitta rätt paket med hjälp av en Dynamics 365-partner</strong></p>
 <p>Prisbilden kan kännas komplex, men det behöver den inte vara. En certifierad Dynamics 365-partner hjälper dig att navigera bland licenser och lösningsalternativ – och viktigast av allt, att hitta den kombination som ger mest värde för just din verksamhet och din budget.</p>
 <p>Oavsett var du befinner dig i processen är ett förutsättningslöst samtal med en partner alltid ett bra första steg.</p>
 </AccordionContent>
 </AccordionItem>

 <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 ❓ Hur snabbt kan vi komma igång med Dynamics 365 CE?
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 space-y-4">
 <p>En av de vanligaste frågorna vi får handlar om tid – när kan vi vara igång? Svaret beror på flera faktorer, men det finns tydliga riktmärken att förhålla sig till. Nedan går vi igenom vad som påverkar tidsplanen och vad du kan förvänta dig i olika scenarion.</p>
 <p><strong>Enklare implementeringar – 2 till 3 månader</strong></p>
 <p>För företag som vill börja med en enskild applikation – till exempel Sales eller Customer Service – och där behoven är relativt väldefinierade, är en implementeringstid på 2 till 3 månader en realistisk målsättning.</p>
 <p>Det är tillräckligt med tid för att konfigurera systemet, anpassa det efter dina processer, utbilda användarna och säkerställa en trygg driftsstart – utan att projektet drar ut på tiden i onödan.</p>
 <p><strong>Större och mer komplexa lösningar – 4 till 6 månader</strong></p>
 <p>När implementeringen omfattar flera applikationer, integrationer mot andra system eller mer omfattande anpassningar av processer och flöden, är en tidsplan på 4 till 6 månader mer realistisk.</p>
 <p>Det handlar inte om att projektet är långsamt – det handlar om att göra det rätt. Ju fler delar av verksamheten som berörs, desto viktigare är det att varje steg genomförs genomtänkt och med tillräcklig förankring hos de som ska använda systemet i vardagen.</p>
 <p><strong>Det börjar alltid med kravanalysen</strong></p>
 <p>Oavsett scope inleds implementeringen nästan alltid med en noggrann kravanalys. Det är ett avgörande steg som ofta underskattas, men som i praktiken lägger grunden för hela projektet.</p>
 <p>Under kravanalysen kartläggs dina processer, behov och förväntningar i detalj. Vad ska systemet lösa? Vilka integrationer behövs? Hur arbetar olika team idag – och hur vill du arbeta imorgon? Svaren på dessa frågor styr hur lösningen utformas och säkerställer att du inte bygger något som ser bra ut på papper men fungerar dåligt i verkligheten.</p>
 <p><strong>En investering i tid som lönar sig</strong></p>
 <p>Det kan vara frestande att vilja skynda på ett implementeringsprojekt, men erfarenheten visar att de implementeringar som lyckas bäst är de där man tagit sig tid att göra rätt från början. En välplanerad och välgenomförd implementation ger ett system som faktiskt används – och som skapar värde från dag ett.</p>
 <p>Vill du få en mer exakt bild av vad som gäller för just din situation? En erfaren Dynamics 365-partner kan snabbt hjälpa dig att rama in ett realistiskt och anpassat tidsperspektiv utifrån dina specifika förutsättningar.</p>
 </AccordionContent>
 </AccordionItem>

 <AccordionItem value="item-5" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 ❓ Hur anpassningsbart är systemet för vår verksamhet?
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 space-y-4">
 <p>En av de mest återkommande frågorna från företag som utvärderar ett nytt CRM-system handlar om flexibilitet – kan systemet verkligen anpassas efter hur vi arbetar, eller tvingas vi anpassa oss efter systemet? Med Dynamics 365 CE är svaret tydligt: systemet formar sig efter er verksamhet, inte tvärtom.</p>
 <p><strong>Flexibilitet som standard</strong></p>
 <p>Dynamics 365 CE är byggt från grunden för att vara anpassningsbart och branschneutralt. Oavsett om du arbetar med långa och komplexa säljcykler, volymdriven kundservice eller projektbaserade leveranser – systemet kan konfigureras för att spegla just dina processer, din terminologi och dina flöden.</p>
 <p>Det handlar inte om att välja ett system och sedan leva med dess begränsningar. Det handlar om att ta ett kraftfullt fundament och forma det till något som känns skräddarsytt för din.</p>
 <p><strong>Power Platform – anpassning utan programmering</strong></p>
 <p>En av de mest kraftfulla komponenterna i ekosystemet är Microsoft Power Platform, som ger dig möjlighet att:</p>
 <p>Bygga egna arbetsflöden och automatiseringar med Power Automate – utan att skriva en enda rad kod.</p>
 <p>Skapa skräddarsydda formulär och vyer som matchar hur era team faktiskt arbetar.</p>
 <p>Utveckla rapporter och dashboards i Power BI som ger dig precis den insikt du behöver, presenterad på det sätt som passar dig bäst.</p>
 <p>Det innebär att du inte är beroende av en utvecklare varje gång du vill justera en process eller lägga till ett nytt fält. Mycket av anpassningen kan hanteras av din egna verksamhet – vilket ger snabbhet, kontroll och lägre kostnader över tid.</p>
 <p><strong>Branschspecifika lösningar</strong></p>
 <p>Dynamics 365 CE stödjer dessutom ett brett ekosystem av branschspecifika lösningar och tillägg, vilket innebär att du inte behöver börja från noll oavsett vilken bransch du verkar i. Det finns färdiga lösningar och ramverk anpassade för bland annat:</p>
 <p>Tillverkning – med stöd för servicehantering, garantiärenden och fältservice.</p>
 <p>Detaljhandel – med fokus på kundlojalitet, köphistorik och personalisering.</p>
 <p>Hälsovård – med lösningar för patientrelationer, compliance och ärendehantering.</p>
 <p>Professionella tjänster – med verktyg för projektuppföljning, resursplanering och kundengagemang.</p>
 <p>Oavsett bransch finns det med andra ord en solid grund att bygga vidare på – snarare än att börja från ett tomt blad.</p>
 <p><strong>Vi hjälper dig hitta rätt konfiguration</strong></p>
 <p>Att ett system är flexibelt är en sak – att faktiskt nyttja den flexibiliteten på rätt sätt är en annan. En Dynamics 365-partner hjälper dig att kartlägga dina processer och behov, och sedan konfigurera systemet så att det passar din verksamhet från dag ett.</p>
 <p>Målet är alltid detsamma: ett system som känns naturligt att använda, som stödjer dina medarbetare i deras vardag och som växer med dig i takt med att verksamheten utvecklas.</p>
 <p>Vill du se hur systemet skulle kunna se ut konfigurerat för just din bransch och dina processer? Det är alltid ett bra ställe att börja samtalet.</p>
 </AccordionContent>
 </AccordionItem>

 <AccordionItem value="item-6" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 ❓ Vilken partner borde passa vår verksamhet bäst?
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6">
 Rätt partner beror på din bransch, företagsstorlek och vilka CRM-applikationer du behöver. Vi rekommenderar att du väljer en partner med erfarenhet från liknande implementeringar och som har certifieringar för de specifika Dynamics 365-applikationerna du är intresserade av. På vår <a href="/valjdynamics365partner/" className="text-crm hover:underline font-medium">partnerkatalog</a> kan du filtrera på bransch, företagsstorlek och applikationer för att hitta partners som matchar dina krav. Du kan också använda vårt verktyg för att få personliga partnerrekommendationer.
 </AccordionContent>
 </AccordionItem>
 </Accordion>
 </div>
 </div>
 </section>

 <ProductPartnerNewsSection productArea="crm" productLabel="CRM" />

 {/* Partners Section */}
 <section id="partners" className="py-8 sm:py-12 md:py-16 bg-secondary/50">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="text-center mb-8 sm:mb-10 md:mb-12">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
 CRM-partners
 </h2>
 <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto">
 Här är ett urval av partners som arbetar med Dynamics 365 Customer Engagement i Sverige. Välj de applikationer som du är mest intresserad av, vilken bransch du tillhör och din företagsstorlek (antal anställda), så filtreras listan på de Microsoftpartners som sannolikt passar dig bäst
 </p>
 </div>

 {/* Application Filter */}
 <MultiFilterButtons
 title="Filtrera på applikation"
 icon="application"
 options={crmApplications.map(app => ({ label: app, value: app }))}
 selectedValues={selectedApplications}
 onToggle={toggleApplication}
 colorScheme="crm"
 />

 {/* Industry Filter */}
 <FilterButtons
 title="Filtrera på bransch"
 icon="industry"
 options={allIndustries.map(ind => ({ label: ind, value: ind }))}
 selectedValue={selectedIndustry}
 onSelect={setSelectedIndustry}
 colorScheme="crm"
 />

 {/* Geography Filter */}
  <FilterButtons
  title="Var behöver du leverans och support? (Sverige, Norden, Europa, Globalt)"
 icon="geography"
 options={geographyFilters.map(g => ({ label: g.label, value: g.value }))}
 selectedValue={selectedGeography}
 onSelect={setSelectedGeography}
 colorScheme="crm"
 />

 {/* Optional size filters */}
 <SizeFilters
 selectedCompanySize={selectedCompanySize}
 selectedRevenue={selectedRevenue}
 onCompanySizeChange={setSelectedCompanySize}
 onRevenueChange={setSelectedRevenue}
 colorScheme="crm"
 />

 {/* Resultathuvud – användarens sökning visas en gång ovanför korten */}
 {(selectedApplications.length > 0 || selectedIndustry || selectedGeography || selectedCompanySize || selectedRevenue) && (
 <>
 <SearchResultSummary
 count={crmPartners.length}
 criteria={[
 selectedApplications.length > 0 ? selectedApplications.join(', ') : "Marknad, Sälj & Service",
 selectedIndustry,
 selectedGeography,
 selectedCompanySize ? `${selectedCompanySize} anställda` : null,
 selectedRevenue,
 ]}
 onChangeFilters={() => {
 if (typeof document !== "undefined") {
 document.getElementById("partners")?.scrollIntoView({ behavior: "smooth", block: "start" });
 }
 }}
 />
 <div className="text-center -mt-4 mb-8">
 <Button 
 variant="ghost" 
 size="sm" 
 onClick={() => {
 setSelectedApplications([]);
 setSelectedIndustry(null);
 setSelectedGeography(null);
 setSelectedCompanySize(null);
 setSelectedRevenue(null);
 }}
 className="text-muted-foreground hover:text-foreground"
 >
 Rensa alla filter
 </Button>
 </div>
 </>
 )}

 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {crmPartners.map((partner, index) => (
 <PartnerCard
 key={index}
 partner={partner}
 profileUrl={`/partner/${partner.slug}`}
 colorScheme="crm"
 productKey="crm"
 highlightedProduct={selectedApplications.length > 0 ? selectedApplications.join(', ') : undefined}
 highlightedIndustry={selectedIndustry || undefined}
 highlightedCompanySize={selectedCompanySize || undefined}
 highlightedRevenue={selectedRevenue || undefined}
 highlightedGeography={selectedGeography || undefined}
 showRandomIndicator={true}
 showBestFitOnly
 resultView
 />
 ))}
 </div>

  <UnprofiledPartnersList
  variant="teaser"
  showSeeAllLink
  industry={selectedIndustry || null}
  />


 {/* Lead CTA - shows when partners are filtered */}
 {(selectedApplications.length > 0 || selectedIndustry || selectedGeography) && (
 <div className="max-w-xl mx-auto mt-12">
 {/* Premium Contact CTA Card - same design as PartnerProfile */}
 <article className="relative rounded overflow-hidden ">
 {/* Gradient background */}
 <div className="absolute inset-0 bg-gradient-to-br from-[hsl(210_20%_12%)] via-[hsl(210_18%_16%)] to-[hsl(210_20%_12%)]" />
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/25 via-transparent to-transparent" />
 
 {/* Animated orb */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/40 to-transparent rounded animate-pulse" />
 
 <div className="relative p-6 sm:p-8">
 <div className="flex items-start gap-4 mb-6">
 <div className="p-3 rounded bg-gradient-to-br from-primary to-accent shadow-primary/30">
 <span className="text-xl">✨</span>
 </div>
 <div>
 <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
 Låt oss hjälpa dig hitta rätt partner
 </h3>
 <p className="text-white/70 text-sm sm:text-base">
 Det här var ett första steg i rätt riktning. Låt oss hjälpa dig vidare – helt kostnadsfritt.
 </p>
 </div>
 </div>
 
 {/* Filter context with glass effect */}
 <div className="mb-6 p-4 bg-white/10 rounded border border-white/20">
 <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded bg-cta-orange animate-pulse" />
 Din sökning
 </p>
 <div className="flex flex-wrap gap-2">
 <Badge className="bg-primary/40 text-white border-primary/50 py-1.5 px-3 ">
 CRM
 </Badge>
 {selectedApplications.map(app => (
 <Badge key={app} className="bg-white/20 text-white border-white/30 py-1.5 px-3 ">
 {app}
 </Badge>
 ))}
 {selectedIndustry && (
 <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 ">
 {selectedIndustry}
 </Badge>
 )}
 </div>
 </div>
 
 <LeadCTA
 sourcePage="/crm"
 selectedProduct="CRM"
 selectedProducts={selectedApplications.length > 0 ? selectedApplications : undefined}
 selectedIndustry={selectedIndustry || undefined}
 variant="inline"
 />
 </div>
 </article>
 </div>
 )}

 <div className="text-center mt-8">
 <Button asChild variant="outline" size="lg">
<Link to="/valjdynamics365partner/#alla-partners-rubrik">
  Se alla partners
 <ArrowRight className="ml-2 h-4 w-4" />
 </Link>
 </Button>
 </div>
 </div>
 </section>

 {/* CTA Section */}
 <section className="py-10 bg-background">
 <div className="container mx-auto px-4">
 <div className="max-w-3xl mx-auto text-center">
 <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
 Redo att förbättra din kundhantering?
 </h2>
 <p className="text-lg text-muted-foreground mb-8">
 Kontakta oss för en kostnadsfri konsultation
 </p>
 <ContactFormDialog>
 <Button className="bg-crm hover:bg-crm/90 text-crm-foreground h-14 sm:h-16 rounded" size="lg">
 Boka in en kostnadsfri rådgivning
 </Button>
 </ContactFormDialog>
 </div>
 </div>
 </section>

 <RelatedPages pages={crmRelatedPages} heading="Utforska vidare" />
 <section className="py-8">
   <div className="container mx-auto px-4 max-w-6xl">
     <PageOfferBanner />
   </div>
 </section>
 <RelevantVideosSection productGroups={["crm-sales", "crm-service", "customer-insights"]} title="Videor om Dynamics 365 CRM" />
 
<FunnelCTA stage="early" guide="crm" source="/crm/" />
</main>
 <Footer />
 </div>
 );
};

export default CRM;
