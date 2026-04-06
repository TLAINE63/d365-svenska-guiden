import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import NoscriptSEO from "@/components/NoscriptSEO";
import { OrganizationSchema, WebSiteSchema, FAQSchema, LocalBusinessSchema } from "@/components/StructuredData";
import { Monitor, Users, Phone, HelpCircle, ArrowRight, BarChart3, Shield, Check } from "lucide-react";
import { Link } from "react-router-dom";
const Accordion = lazy(() => import("@/components/ui/accordion").then(m => ({ default: m.Accordion })));
const AccordionContent = lazy(() => import("@/components/ui/accordion").then(m => ({ default: m.AccordionContent })));
const AccordionItem = lazy(() => import("@/components/ui/accordion").then(m => ({ default: m.AccordionItem })));
const AccordionTrigger = lazy(() => import("@/components/ui/accordion").then(m => ({ default: m.AccordionTrigger })));

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

const selectorCards = [
  {
    icon: <Monitor className="h-5 w-5 text-primary" />,
    title: "Införa nytt affärssystem",
    desc: "Byta eller uppgradera ERP — Business Central eller Finance & SCM",
    link: "/erp/",
    linkText: "Utforska ERP →",
  },
  {
    icon: <Users className="h-5 w-5 text-primary" />,
    title: "Förbättra sälj och marknad",
    desc: "Optimera sälj & CRM — Dynamics 365 Sales och Customer Insights",
    link: "/crm/",
    linkText: "Utforska CRM →",
  },
  {
    icon: <Phone className="h-5 w-5 text-primary" />,
    title: "Utveckla kundservice",
    desc: "Effektivisera support — Customer Service, Field Service, Contact Center",
    link: "/d365-customer-service/",
    linkText: "Utforska kundservice →",
  },
  {
    icon: <HelpCircle className="h-5 w-5 text-primary" />,
    title: "Jag är osäker — hjälp mig",
    desc: "Få personlig vägledning via vår kostnadsfria guide på 1 min",
    link: "/kom-igang/",
    linkText: "Starta guide →",
  },
];

const whyItems = [
  "Jämför partners utifrån bransch och behov",
  "Realistisk bild av kostnad och implementationstid",
  "Undvik vanliga misstag i ERP- och CRM-projekt",
  "Kostnadsfria behovsanalyser för ERP, CRM och kundservice",
  "Opartisk guide — vi tar inte betalt av partners",
  "Anpassat för svenska företag och den svenska marknaden",
];

const popularQuestions = [
  { text: "Vad kostar Business Central?", link: "/business-central/" },
  { text: "Hur väljer man rätt partner?", link: "/valj-partner/" },
  { text: "CRM vs ERP — vad behöver vi?", link: "/erp/" },
  { text: "Är vi redo för AI och Copilot?", link: "/copilot/" },
];

const industryPills = [
  "Tillverkning", "Grossist & distribution", "Konsulttjänster",
  "Bygg & entreprenad", "Retail & e-handel", "Fastighet & förvaltning",
  "Life Science & Medtech", "Finans & försäkring", "Energi & utilities",
  "Logistik & transport", "Offentlig sektor", "Non-profit",
];

const heroSteps = [
  { title: "Berätta om verksamheten", sub: "Bransch, storlek och nuvarande system" },
  { title: "Välj vad du vill lösa", sub: "ERP, CRM, kundservice eller kombinerat" },
  { title: "Få din rekommendation", sub: "Rätt lösning och partnertyp" },
];

const Index = () => {
  return <div className="min-h-screen bg-secondary/30">
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
      <section className="bg-gradient-to-br from-[hsl(180_30%_12%)] via-[hsl(180_25%_16%)] to-[hsl(200_20%_18%)] border-b border-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-14 md:pb-16 relative">
          {/* Full-width eyebrow heading */}
          <h1 className="text-xl sm:text-2xl md:text-[32px] font-semibold text-white/90 tracking-tight mb-8 md:mb-10 max-w-3xl">
            Sveriges oberoende guide till Microsoft Dynamics 365
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8 md:gap-14 items-center">
            {/* Left column */}
            <div>
              <p className="text-2xl sm:text-3xl md:text-[40px] font-semibold leading-[1.15] tracking-tight text-white mb-4">
                Hitta rätt lösning —<br className="hidden sm:block" />
                och <em className="not-italic text-[hsl(180_75%_65%)] font-normal">rätt partner</em>
              </p>
              <p className="text-base text-white/70 font-light leading-relaxed mb-8 max-w-[480px]">
                Jämför ERP- och CRM-system utifrån din verksamhet. Opartiskt, konkret och anpassat för svenska företag — helt gratis.
              </p>
              <div className="flex flex-wrap gap-2.5 mb-4">
                <Button asChild size="lg" className="bg-white text-[hsl(180_85%_20%)] hover:bg-white/90 text-sm h-11 px-5 rounded-lg font-semibold">
                  <Link to="/kom-igang/">Gör kostnadsfri behovsanalys <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="text-sm h-11 px-5 rounded-lg text-white border border-white/40 bg-white/5 hover:bg-white/10 hover:text-white">
                  <Link to="/valj-partner/">Jämför partners</Link>
                </Button>
              </div>
            </div>

            {/* Right column – step card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-5 sm:p-6">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(180_75%_65%)] mb-4">
                Behovsanalys — 5 minuter
              </div>
              <ul className="space-y-0">
                {heroSteps.map((step, i) => (
                  <li key={i} className={`flex gap-3 items-start py-3 ${i < heroSteps.length - 1 ? "border-b border-white/10" : ""}`}>
                    <span className="w-[22px] h-[22px] rounded-full bg-white/15 text-[hsl(180_75%_65%)] text-[11px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-[13px] font-medium text-white">{step.title}</div>
                      <div className="text-xs text-white/60">{step.sub}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full mt-4 bg-white text-[hsl(180_85%_20%)] hover:bg-white/90 text-sm h-10 rounded-lg font-semibold">
                <Link to="/kom-igang/">Starta behovsanalys <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
              <p className="text-center text-[11px] text-white/50 mt-2">Gratis · Ingen registrering krävs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Selector – Vad vill du göra? */}
      <section className="py-10 sm:py-14 bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-1.5">Vad vill du göra?</h2>
            <p className="text-sm text-muted-foreground">Välj ditt område — vi guidar dig direkt till rätt information och partners.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectorCards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className="group bg-card border border-border rounded-xl p-5 flex flex-col gap-2.5 hover:border-primary/40 hover:shadow-[var(--shadow-hover)] transition-all duration-200 shadow-[var(--shadow-card)]"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  {card.icon}
                </div>
                <div className="text-sm font-semibold text-foreground">{card.title}</div>
                <div className="text-[13px] text-muted-foreground leading-snug flex-1">{card.desc}</div>
                <div className="text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
                  {card.linkText}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Analysis CTA Banner */}
      <section className="px-4 sm:px-6 pb-10 bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-card border border-border border-l-[3px] border-l-primary rounded-xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <h3 className="text-base sm:text-[17px] font-semibold text-foreground mb-1">Vet du inte vilket system du behöver?</h3>
              <p className="text-[13px] text-muted-foreground max-w-[480px] leading-relaxed">
                Vår kostnadsfria behovsanalys tar 5 minuter och ger dig en personlig rekommendation, estimerad budgetram och vilken typ av partner som passar din verksamhet.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">Gratis</span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">Ingen registrering</span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">5 minuter</span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">Opartisk rekommendation</span>
              </div>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm h-10 px-5 rounded-lg whitespace-nowrap flex-shrink-0">
              <Link to="/kom-igang/">Starta behovsanalys <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Proof / stats */}
      <section className="py-10 sm:py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-6">Därför använder företag d365.se</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { num: "100%", label: "Oberoende — vi säljer inget system" },
              { num: "Gratis", label: "Behovsanalys och partnermatching" },
              { num: "5 min", label: "Från besök till personlig rekommendation" },
              { num: "Kravspec", label: "Skapa en kostnadsfri kravspecifikation" },
            ].map((item) => (
              <div key={item.num} className="bg-secondary/50 border border-border rounded-[10px] p-5">
                <div className="text-2xl sm:text-[28px] font-semibold text-primary tracking-tight mb-1">{item.num}</div>
                <div className="text-[13px] text-muted-foreground leading-snug">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why + Popular Questions – two columns */}
      <section className="py-10 sm:py-12 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">Vad vi hjälper dig med</h2>
              <p className="text-sm text-muted-foreground mb-4">Realistisk vägledning — anpassad för svenska företag.</p>
              <ul className="space-y-2.5">
                {whyItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="w-[18px] h-[18px] rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">Vanliga frågor just nu</h2>
              <p className="text-sm text-muted-foreground mb-4">Det svenska företag frågar oss mest.</p>
              <div className="flex flex-col gap-2">
                {popularQuestions.map((q) => (
                  <Link
                    key={q.text}
                    to={q.link}
                    className="group block bg-card border border-border rounded-[10px] px-4 py-3 text-[13px] font-medium text-foreground hover:border-primary/40 hover:text-primary transition-all"
                  >
                    {q.text} <span className="text-muted-foreground group-hover:text-primary ml-0.5 transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry pills */}
      <section className="py-10 sm:py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Välj din bransch</h2>
            <Link to="/branschlosningar/" className="text-sm font-medium text-primary hover:underline">Se alla branscher →</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {industryPills.map((pill) => (
              <Link
                key={pill}
                to="/branschlosningar/"
                className="px-4 py-2 rounded-full border border-border text-[13px] text-muted-foreground bg-card hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                {pill}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Compare section */}
      <section className="py-10 sm:py-12 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">Dynamics 365 vs alternativa system</h2>
          <p className="text-sm text-muted-foreground mb-6">Hur står sig Dynamics 365 mot de vanligaste alternativen på den svenska marknaden?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* ERP compare */}
            <div className="bg-card border border-border rounded-[10px] p-5 sm:p-6 hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[15px] font-semibold text-foreground">Business Central (ERP)</div>
                  <div className="text-xs text-muted-foreground mt-0.5">vs Fortnox, Visma, Monitor — och SAP</div>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] whitespace-nowrap">från 765 kr/mån</span>
              </div>
              <div className="h-px bg-border my-3" />
              <ul className="space-y-1.5">
                <li className="text-[13px] text-muted-foreground flex items-baseline gap-2"><span className="text-primary font-semibold text-[11px]">✓</span>Bättre skalbarhet än Fortnox för växande bolag</li>
                <li className="text-[13px] text-muted-foreground flex items-baseline gap-2"><span className="text-primary font-semibold text-[11px]">✓</span>Djupare Microsoft 365-integration (Teams, Excel, Outlook)</li>
                <li className="text-[13px] text-muted-foreground flex items-baseline gap-2"><span className="text-primary font-semibold text-[11px]">✓</span>Inbyggd AI via Microsoft Copilot utan extra kostnad</li>
                <li className="text-[13px] text-muted-foreground flex items-baseline gap-2"><span className="text-primary font-semibold text-[11px]">✓</span>Lägre TCO än SAP för medelstora nordiska bolag</li>
              </ul>
              <Link to="/erp/" className="inline-block mt-3 text-[13px] font-medium text-primary hover:underline">Jämför ERP-alternativ →</Link>
            </div>
            {/* CRM compare */}
            <div className="bg-card border border-border rounded-[10px] p-5 sm:p-6 hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[15px] font-semibold text-foreground">D365 Sales & Customer Service</div>
                  <div className="text-xs text-muted-foreground mt-0.5">vs Salesforce, HubSpot</div>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] whitespace-nowrap">från 478 kr/mån</span>
              </div>
              <div className="h-px bg-border my-3" />
              <ul className="space-y-1.5">
                <li className="text-[13px] text-muted-foreground flex items-baseline gap-2"><span className="text-primary font-semibold text-[11px]">✓</span>Samma ekosystem som Office 365 och Teams</li>
                <li className="text-[13px] text-muted-foreground flex items-baseline gap-2"><span className="text-primary font-semibold text-[11px]">✓</span>Copilot AI inbyggt i hela säljprocessen</li>
                <li className="text-[13px] text-muted-foreground flex items-baseline gap-2"><span className="text-primary font-semibold text-[11px]">✓</span>Kombinera CRM och kundservice i ett system</li>
                <li className="text-[13px] text-muted-foreground flex items-baseline gap-2"><span className="text-primary font-semibold text-[11px]">✓</span>Lägre totalkostnad med befintlig Microsoft-infrastruktur</li>
              </ul>
              <Link to="/crm/" className="inline-block mt-3 text-[13px] font-medium text-primary hover:underline">Jämför CRM-alternativ →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA band */}
      <section className="bg-primary py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary-foreground mb-1.5">Redo att komma igång?</h2>
            <p className="text-sm text-primary-foreground/65 max-w-[400px]">Börja med att beskriva din situation — kostnadsfritt och utan förpliktelser.</p>
          </div>
          <Button asChild size="lg" className="bg-card text-primary hover:bg-card/90 text-sm font-semibold h-12 px-7 rounded-lg whitespace-nowrap flex-shrink-0">
            <Link to="/kom-igang/">Starta behovsanalys <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
      </section>

      {/* Vanliga frågor */}
      <section id="questions" className="py-10 sm:py-14 bg-secondary/30">
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

      </main>

      {/* Scroll-triggered CTA */}
      <Suspense fallback={null}><ScrollCTA /></Suspense>

      <Footer />
    </div>;
};
export default Index;
