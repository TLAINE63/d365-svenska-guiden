import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import NoscriptSEO from "@/components/NoscriptSEO";
import { OrganizationSchema, WebSiteSchema, FAQSchema, LocalBusinessSchema } from "@/components/StructuredData";
import { ArrowRight, Check, Monitor, Users, Phone, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Lazy load below-fold components
const LeadMagnetBanner = lazy(() => import("@/components/LeadMagnetBanner"));
const UrgencyBadge = lazy(() => import("@/components/UrgencyBadge"));
const ContactFormDialog = lazy(() => import("@/components/ContactFormDialog"));
const CommonMistakesTeaser = lazy(() => import("@/components/CommonMistakesTeaser"));
const ScrollCTA = lazy(() => import("@/components/ScrollCTA"));

const homeFaqs = [
  {
    question: "Vad är Microsoft Dynamics 365?",
    answer: "Microsoft Dynamics 365 är Microsofts plattform för affärssystem (ERP) och kundrelationshantering (CRM) i molnet. Det är en familj av specialiserade affärsappar – Business Central och Finance & Supply Chain för ERP, samt Sales, Customer Service, Field Service och Customer Insights för CRM. Alla appar delar samma dataplattform, integreras sömlöst med Microsoft 365 (Outlook, Teams, Excel) och har inbyggd AI via Microsoft Copilot. Dynamics 365 faktureras per användare och månad utan egna servrar."
  },
  {
    question: "Vad kostar Business Central i Sverige – pris per användare?",
    answer: "Dynamics 365 Business Central kostar från 765 kr per användare och månad (Essentials-licens) eller 1 051 kr/mån (Premium-licens som inkluderar produktion och servicehantering). Teammedlemmar med begränsad åtkomst kostar från ca 77 kr/mån. Utöver licensen tillkommer implementeringskostnad – räkna med 300 000–1 500 000 kr för en fullständig implementation beroende på komplexitet. Välj en Microsoft-certifierad partner i Sverige för korrekt offert."
  },
  {
    question: "Vilken Dynamics 365-lösning passar vårt företag bäst – ERP eller CRM?",
    answer: "Business Central passar SMB-företag (ca 10–300 anställda) som behöver allt-i-ett ERP för ekonomi, order, lager, inköp, produktion och projekt. Finance & Supply Chain Management passar globala koncerner med komplexa produktionsflöden och flera juridiska entiteter. Dynamics 365 Sales passar säljorganisationer som vill digitalisera pipeline och kundrelationer. Customer Service passar företag med supportärenden och fälttekniker. Gör gärna vår kostnadsfria behovsanalys för en personlig rekommendation."
  },
  {
    question: "Hur hittar jag rätt Microsoft Dynamics 365-partner i Sverige?",
    answer: "En bra Dynamics 365-partner i Sverige bör ha dokumenterad branschkunskap inom din sektor, referenskunder av liknande storlek och djupkompetens på just den app du ska implementera. Undvik partners som 'kan allt' – de flesta är starka på antingen ERP (Business Central eller Finance & SCM) eller CRM (Sales och Customer Service). På d365.se kan du filtrera partners på bransch, produkt och geografi kostnadsfritt. Valet av partner är ofta viktigare än valet av system."
  },
  {
    question: "Hur lång tid tar det att implementera Dynamics 365?",
    answer: "Business Central startpaket: 2–4 månader. Fullständig Business Central-implementation: 4–9 månader. Finance & Supply Chain Management: 9–18 månader, internationella utrullningar 18–36 månader. Dynamics 365 Sales eller Customer Service: 2–6 månader. Customer Insights (Marketing Automation): 2–4 månader. Den interna resurstillgången – engagerad projektledare och nyckelanvändare – är ofta den mest kritiska framgångsfaktorn."
  },
  {
    question: "Är Dynamics 365 ett bra alternativ till SAP, Salesforce eller Fortnox?",
    answer: "Ja. Dynamics 365 Business Central är ett starkt alternativ till Fortnox, Visma och Monitor för SMB – med bättre skalbarhet och djupare Microsoft-integration. Finance & Supply Chain Management är ett modernt alternativ till SAP S/4HANA med lägre licenspriser och inbyggd Copilot AI. Dynamics 365 Sales och Customer Service konkurrerar direkt med Salesforce och HubSpot, med fördelen att allt ligger i samma Microsoft-ekosystem som Office 365. För svenska företag med befintlig Microsoft-infrastruktur är D365 ofta det naturligaste valet."
  },
  {
    question: "Hur fungerar Microsoft Copilot AI i Dynamics 365?",
    answer: "Microsoft Copilot är inbyggt i alla Dynamics 365-appar utan extra licensavgift. I Business Central hjälper Copilot med produktbeskrivningar och bankavstämning. I Sales sammanfattar Copilot möten och skriver e-postutkast. I Customer Service föreslår Copilot svar och sammanfattar ärenden. I Finance & Supply Chain varnar Copilot för leveransrisker och avvikelser. Enligt Forresters TEI-studie (oktober 2024) kan Copilot ge 353% potentiell ROI över 3 år."
  },
];

const recognizeItems = [
  "Du har tittat på Dynamics 365 men det är svårt att förstå skillnaderna",
  "Du är osäker på Business Central vs Finance & Supply Chain",
  "Du vet inte vilka partners du kan lita på",
  "Du har redan ett system men är inte nöjd",
];

const whyItems = [
  "Jämför partners baserat på bransch och behov",
  "Få en realistisk bild av pris och tidsåtgång",
  "Undvik vanliga misstag i ERP- och CRM-projekt",
  "Vi är opartiska och oberoende",
];

const industryChips = [
  { label: "Tillverkning", emoji: "🏭" },
  { label: "Grossist", emoji: "📦" },
  { label: "Tjänster", emoji: "💼" },
  { label: "Retail / E-handel", emoji: "🛒" },
  { label: "Bygg", emoji: "🏗️" },
];

const Index = () => {
  return <div className="min-h-screen bg-background">
      <SEOHead 
        title="Dynamics 365 Sverige – Priser, partners & behovsanalys | d365.se"
        description="Oberoende guide till Dynamics 365 i Sverige. Jämför ERP & CRM, hitta certifierade partners per bransch. Kostnadsfri behovsanalys."
        canonicalPath="/"
        keywords="Dynamics 365 Sverige, Microsoft Dynamics 365, Business Central pris Sverige, Microsoft ERP CRM partner, affärssystem Sverige, Dynamics 365 partner Sverige, Business Central Sverige, SAP alternativ Sverige, CRM system Sverige, Dynamics 365 implementering, ERP system jämförelse, Microsoft partner Sverige, Dynamics 365 pris, Business Central vs SAP, Salesforce alternativ Sverige"
        ogImage="https://d365.se/og-image.png"
      />
      <OrganizationSchema />
      <WebSiteSchema />
      <LocalBusinessSchema />
      <FAQSchema faqs={homeFaqs} />
      <NoscriptSEO
        title="Dynamics 365 Sverige – Oberoende guide till ERP & CRM"
        description="d365.se är Sveriges oberoende guide till Microsoft Dynamics 365. Vi hjälper svenska företag att jämföra ERP- och CRM-lösningar, hitta rätt Microsoft-certifierad partner och göra kostnadsfria behovsanalyser. Business Central från 765 kr per användare och månad."
        sections={[
          { heading: "Vad är Microsoft Dynamics 365?", text: "Microsoft Dynamics 365 är Microsofts molnbaserade plattform för affärssystem (ERP) och kundrelationshantering (CRM). Plattformen består av specialiserade affärsapplikationer: Business Central och Finance & Supply Chain Management för ERP, samt Sales, Customer Service, Field Service, Marketing och Customer Insights för CRM." },
          { heading: "Dynamics 365 Business Central – pris och licenser i Sverige", text: "Dynamics 365 Business Central kostar från 765 kr per användare och månad med Essentials-licens, eller 1 051 kr per månad med Premium-licens som inkluderar produktion och servicehantering." },
          { heading: "Hitta rätt Dynamics 365-partner i Sverige", text: "Att välja rätt implementeringspartner är avgörande för ett lyckat Dynamics 365-projekt. En bra partner bör ha dokumenterad branschkunskap inom din sektor, referenskunder av liknande storlek och djupkompetens på den specifika applikation du ska implementera." },
          { heading: "Hur lång tid tar en Dynamics 365-implementation?", text: "Tidsramen varierar beroende på lösning och komplexitet. Business Central startpaket tar normalt 2 till 4 månader. En fullständig Business Central-implementation tar 4 till 9 månader." },
          { heading: "Dynamics 365 jämfört med SAP, Salesforce och Fortnox", text: "Dynamics 365 Business Central är ett starkt alternativ till Fortnox, Visma och Monitor för små och medelstora företag – med bättre skalbarhet och djupare Microsoft-integration." },
          { heading: "Microsoft Copilot AI i Dynamics 365", text: "Microsoft Copilot är inbyggt i alla Dynamics 365-applikationer utan extra licensavgift." },
          { heading: "Kostnadsfri behovsanalys", text: "Gör vår kostnadsfria behovsanalys för att få en personlig rekommendation om vilken Dynamics 365-lösning som passar ditt företag bäst." },
        ]}
      />
      <Navbar />
      
      <main>
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24 overflow-hidden">
        {/* Subtle skyline background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 to-muted/80" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-muted/60 to-transparent opacity-60" />
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-5 leading-tight">
            Ska du välja Dynamics 365? Börja här.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Förstå skillnaderna, undvik vanliga misstag och hitta rätt partner – baserat på din verksamhet.
          </p>
          <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white text-base sm:text-lg h-12 sm:h-14 px-10 sm:px-12 rounded-lg shadow-lg">
            <Link to="/kom-igang/">Kom igång</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Tar ca 1 minut · inga förkunskaper krävs
          </p>
        </div>
      </section>

      {/* Känner du igen dig? */}
      <section className="py-10 sm:py-14 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
            Känner du igen dig?
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {recognizeItems.map((item) => (
              <div key={item} className="flex items-start gap-3 pb-4 border-b border-border last:border-b-0">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Så guidar vi dig genom 3 steg */}
      <section className="py-10 sm:py-14 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-foreground mb-10">
            Så guidar vi dig genom 3 steg
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">1</div>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-foreground mb-3">Beskriv din verksamhet</h3>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Beskriv din verksamhet</span>
                </div>
              </div>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">2</div>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-foreground mb-3">Förstå vilka lösningar som passar</h3>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckSquare className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Få en snabb bild av vad som passar er</span>
                </div>
              </div>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">3</div>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-foreground mb-3">Vi föreslår passande partners</h3>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Se vilka partners som matchar era behov</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white text-base h-12 px-10 rounded-lg shadow-lg">
              <Link to="/kom-igang/">
                Kom igång <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Därför använder företag d365.se – branschsök */}
      <section className="py-10 sm:py-14 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
            Därför använder företag d365.se
          </h2>
          
          {/* Industry chips */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 text-muted-foreground mb-4 border-b border-border pb-3">
                <span className="text-sm">🔍</span>
                <span className="text-sm">Skriv din bransch...</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {industryChips.map((chip) => (
                  <Link
                    key={chip.label}
                    to="/branschlosningar/"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-background text-sm text-foreground hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <span>{chip.emoji}</span>
                    <span>{chip.label}</span>
                  </Link>
                ))}
              </div>
              <Link to="/branschlosningar/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Se alla branscher <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Why checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-3xl mx-auto">
            {whyItems.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm sm:text-base text-foreground">{item}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white text-base h-12 px-10 rounded-lg shadow-lg">
              <Link to="/kom-igang/">Kom igång</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Vanliga frågor */}
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
                    <p>• <strong>ERP-sidan</strong> täcker ekonomi, inköp, lager, produktion, projekt och supply chain – med applikationerna <em>Business Central</em> (för SMB) och <em>Finance & Supply Chain Management</em> (för större koncerner).</p>
                    <p>• <strong>CRM-sidan</strong> täcker försäljning, marknadsföring, kundservice och fältservice – med applikationerna <em>Sales</em>, <em>Customer Insights</em>, <em>Customer Service</em>, <em>Field Service</em> och <em>Contact Center</em>.</p>
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
                    <p>Det beror på om du primärt behöver ett <strong>affärssystem (ERP)</strong> eller ett <strong>CRM-system</strong> – eller båda.</p>
                    <p>• <strong>Business Central</strong> passar dig om du är ett litet eller medelstort företag (ca 10–300 anställda) och behöver ett modernt allt-i-ett affärssystem.</p>
                    <p>• <strong>Finance & Supply Chain Management</strong> passar dig om du är en större koncern med komplexa globala flöden.</p>
                    <p>• <strong>Dynamics 365 Sales</strong> passar dig om du vill digitalisera och effektivisera din säljprocess.</p>
                    <p>• <strong>Customer Service & Field Service</strong> passar dig om du hanterar ärenden, garantier och fälttekniker.</p>
                    <p className="pt-1">
                      → Gör gärna någon av våra kostnadsfria behovsanalyser för <Link to="/behovsanalys/" className="text-primary hover:underline font-semibold">ERP/Affärssystem</Link>, <Link to="/salj-marknad-behovsanalys/" className="text-primary hover:underline font-semibold">Sälj & Marknad</Link> eller <Link to="/kundservice-behovsanalys/" className="text-primary hover:underline font-semibold">Kundservice</Link>.
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
                    <p>Kostnaden består av <strong>löpande licensavgifter</strong> och en engångs <strong>implementeringskostnad</strong>.</p>
                    <p>• <strong>Business Central:</strong> Från ca 550 kr/mån (Essentials) till ca 780 kr/mån (Premium) per användare.</p>
                    <p>• <strong>Finance & Supply Chain:</strong> Från ca 3 500 kr/mån per aktiv användare.</p>
                    <p>• <strong>Sales & Customer Service:</strong> Från ca 800–1 100 kr/mån per användare.</p>
                    <p>• <strong>Projektkostnad:</strong> Allt från 50 000–150 000 kr för ett BC-startpaket till flera miljoner för enterprise-projekt.</p>
                    <Suspense fallback={null}>
                    <ContactFormDialog>
                      <Button variant="link" className="mt-2 italic p-0 h-auto font-normal text-muted-foreground hover:text-primary">
                        Kontakta oss så får du en tydligare uppfattning av kostnader →
                      </Button>
                    </ContactFormDialog>
                    </Suspense>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fråga 4 */}
              <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-card-foreground flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">🤝</span>
                    <span>Hur hittar jag rätt Dynamics 365-partner?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>Att välja rätt partner är minst lika viktigt som att välja rätt system.</p>
                    <p>• <strong>Branschkunskap:</strong> Välj en partner med referenskunder i din bransch.</p>
                    <p>• <strong>Applikationsfokus:</strong> Kontrollera att partnern är specialiserad på rätt app.</p>
                    <p>• <strong>Storlek och kapacitet:</strong> Matcha partnerns kapacitet med ditt projekts storlek.</p>
                    <p className="pt-2">
                      <Link to="/valj-partner/" className="text-primary hover:underline font-semibold">
                        → Utforska partnerkatalogen
                      </Link>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fråga 5 */}
              <AccordionItem value="item-5" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-card-foreground flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">⚖️</span>
                    <span>Är Dynamics 365 ett bra alternativ till SAP, Salesforce eller Fortnox?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>Ja – Dynamics 365 är ett starkt alternativ i alla tre segmenten:</p>
                    <p>• <strong>Vs Fortnox / Visma:</strong> Business Central erbjuder bättre skalbarhet och djupare Microsoft-integration.</p>
                    <p>• <strong>Vs SAP S/4HANA:</strong> Finance & SCM är ett modernt alternativ med lägre totalkostnad.</p>
                    <p>• <strong>Vs Salesforce / HubSpot:</strong> Sales och Customer Service konkurrerar direkt – med fördelen att allt ligger i samma Microsoft-ekosystem.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fråga 6 */}
              <AccordionItem value="item-6" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-card-foreground flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">🤖</span>
                    <span>Hur fungerar Microsoft Copilot AI i Dynamics 365?</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>Microsoft Copilot är inbyggt i alla Dynamics 365-appar <strong>utan extra licensavgift</strong>.</p>
                    <p>• <strong>Business Central:</strong> Produktbeskrivningar, bankavstämning och försäljningsrader.</p>
                    <p>• <strong>Sales:</strong> Mötessammanfattningar, e-postutkast och leadprioritering.</p>
                    <p>• <strong>Customer Service:</strong> Ärendesammanfattningar och svarsförslag.</p>
                    <p className="pt-1">
                      <Link to="/copilot/" className="text-primary hover:underline font-semibold">
                        → Läs mer om Copilot i Dynamics 365
                      </Link>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Common Mistakes Teaser */}
      <Suspense fallback={null}><CommonMistakesTeaser /></Suspense>

      {/* Lead Magnet Banner */}
      <div className="flex justify-center mb-4">
        <Suspense fallback={null}>
          <UrgencyBadge variant="consultation" />
        </Suspense>
      </div>
      <Suspense fallback={null}><LeadMagnetBanner sourcePage="index" /></Suspense>

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
            <Link to="/kontakt/">Kontakta oss idag!</Link>
          </Button>
        </div>
      </section>
      </main>

      {/* Scroll-triggered CTA */}
      <Suspense fallback={null}><ScrollCTA /></Suspense>

      <Footer />
    </div>;
};
export default Index;
