import { lazy, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import NoscriptSEO from "@/components/NoscriptSEO";
import { OrganizationSchema, WebSiteSchema, FAQSchema, LocalBusinessSchema } from "@/components/StructuredData";
import { Monitor, Users, Phone, HelpCircle, ArrowRight, BarChart3, Shield, Check, ChevronDown, Sparkles, BookOpen, Calendar, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import selectorErp from "@/assets/selector/erp.jpg";
import selectorCrm from "@/assets/selector/crm.jpg";
import selectorService from "@/assets/selector/service.jpg";
import selectorPartnerMatch from "@/assets/selector/partner-match.jpg";
import thomasLaine from "@/assets/thomas-laine.jpeg";
import michaelUhman from "@/assets/michael-uhman.jpg";
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
const EbookBanner = lazy(() => import("@/components/EbookBanner"));

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

const situationCards = [
  {
    icon: <Monitor className="h-5 w-5 text-white" />,
    title: "Vi ska byta eller utveckla affärssystemet",
    desc: "Utvärderar ni Business Central, Finance & Supply Chain eller ett större ERP-vägval? Här får ni hjälp att förstå skillnader, omfattning, kostnadsdrivare och vilken typ av partner som passar.",
    link: "/erp/",
    linkText: "Utforska ERP-vägen",
    image: selectorErp,
    accent: "from-blue-500/90 to-indigo-600/90",
    glow: "rgba(59,130,246,0.35)",
    eyebrow: "ERP",
  },
  {
    icon: <Users className="h-5 w-5 text-white" />,
    title: "Vi vill få bättre styrning på säljarbetet",
    desc: "För er som vill utveckla pipeline, aktivitetsstyrning, prognoser, kunddialog och uppföljning i säljorganisationen med Dynamics 365 Sales.",
    link: "/d365-sales/",
    linkText: "Utforska säljprocessen",
    image: selectorCrm,
    accent: "from-pink-500/90 to-rose-600/90",
    glow: "rgba(236,72,153,0.35)",
    eyebrow: "Sälj",
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-white" />,
    title: "Vi vill arbeta smartare med marknad och leads",
    desc: "För er som vill utveckla segmentering, kampanjer, leadsgenerering, marketing automation och överlämningen mellan marknad och sälj med Dynamics 365 Customer Insights.",
    link: "/d365-marketing/",
    linkText: "Utforska marknadsbearbetning",
    image: selectorCrm,
    accent: "from-fuchsia-500/90 to-purple-600/90",
    glow: "rgba(217,70,239,0.35)",
    eyebrow: "Marknad",
  },
  {
    icon: <HelpCircle className="h-5 w-5 text-white" />,
    title: "Vi vill få bättre kontroll på kundservice och ärenden",
    desc: "För er som vill förbättra ärendehantering, kundhistorik, SLA:er, kunskapsdatabas och serviceuppföljning med Dynamics 365 Customer Service.",
    link: "/d365-customer-service/",
    linkText: "Utforska kundservice",
    image: selectorService,
    accent: "from-teal-500/90 to-emerald-600/90",
    glow: "rgba(20,184,166,0.35)",
    eyebrow: "Kundservice",
  },
  {
    icon: <Sparkles className="h-5 w-5 text-white" />,
    title: "Vi vill styra service ute hos kund bättre",
    desc: "För er som arbetar med tekniker, installationer, underhåll, planering, arbetsorder och reservdelar — och vill få bättre kontroll över hela fältserviceflödet.",
    link: "/d365-field-service/",
    linkText: "Utforska fältservice",
    image: selectorService,
    accent: "from-cyan-500/90 to-sky-600/90",
    glow: "rgba(6,182,212,0.35)",
    eyebrow: "Fältservice",
  },
  {
    icon: <Phone className="h-5 w-5 text-white" />,
    title: "Vi vill modernisera vår kunddialog",
    desc: "För er som vill samla telefoni, chatt, ärenden, routing, AI-stöd och uppföljning i ett modernt contact center kopplat till kunddata och serviceprocesser.",
    link: "/d365-contact-center/",
    linkText: "Utforska contact center",
    image: selectorService,
    accent: "from-emerald-500/90 to-teal-700/90",
    glow: "rgba(16,185,129,0.35)",
    eyebrow: "Contact Center",
  },
  {
    icon: <Sparkles className="h-5 w-5 text-white" />,
    title: "Vi vill förstå vad AI kan göra för oss",
    desc: "För er som vill förstå Copilot, AI-agenter och automation i ERP, CRM och kundservice — och vad som faktiskt fungerar i en svensk Dynamics 365-miljö idag.",
    link: "/ai-oversikt/",
    linkText: "Utforska AI i Dynamics 365",
    image: selectorErp,
    accent: "from-violet-500/90 to-indigo-600/90",
    glow: "rgba(139,92,246,0.35)",
    eyebrow: "AI",
  },
  {
    icon: <Users className="h-5 w-5 text-white" />,
    title: "Vi vet vad vi vill - Nu behöver vi en matchande partner",
    desc: "Ni har ringat in behovet och vill jämföra partners utifrån bransch, produktområde, storlek och geografi.",
    link: "/kom-igang/",
    linkText: "Starta partnermatchning",
    image: selectorPartnerMatch,
    accent: "from-orange-500 to-teal-600",
    glow: "hsl(var(--cta-orange) / 0.35)",
    eyebrow: "Partner",
  },
];

const buyerPaths = [
  {
    step: "1",
    title: "Orientera er",
    desc: "Förstå skillnaden mellan applikationerna, vad Copilot gör, och hur Dynamics 365 ligger jämfört med alternativen.",
    link: "/kunskapscenter/",
    linkText: "Utforska kunskapscentret",
    color: "bg-gradient-to-br from-sky-500 to-blue-600",
  },
  {
    step: "2",
    title: "Bygg er kravbild",
    desc: "Gör en behovsanalys eller skapa en kravspecifikation. Få ett strukturerat underlag att ta in i partnerdialoger.",
    link: "/behovsanalys/",
    linkText: "Gör en behovsanalys",
    color: "bg-gradient-to-br from-primary to-cyan-600",
  },
  {
    step: "3",
    title: "Välj rätt partner",
    desc: "Få oberoende rekommendation på partners som matchar er bransch, storlek, geografi och valt produktområde.",
    link: "/kom-igang/",
    linkText: "Starta partnermatchning",
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
  },
];


const whyItems = [
  "Jämför partners utifrån bransch och behov",
  "Realistisk bild av kostnad och implementationstid",
  "Undvik vanliga misstag i ERP- och CRM-projekt",
  "Kostnadsfria behovsanalyser för ERP, CRM och kundservice",
  "Anpassat för svenska företag och den svenska marknaden",
];

const popularGuides = [
  { text: "Business Central vs Finance & SCM — vilket passar oss?", link: "/erp/", tag: "ERP" },
  { text: "Hur väljer man rätt Dynamics 365-partner?", link: "/valj-partner/", tag: "Partner" },
  { text: "Vad kostar Dynamics 365 — licens och projekt?", link: "/business-central/", tag: "Kostnad" },
  { text: "Hur lång tid tar en D365-implementation?", link: "/kunskapscenter/", tag: "Tid" },
  { text: "Är vi redo för AI och Copilot? Gör en AI-readiness", link: "/ai-readiness/", tag: "AI" },
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
  const [showAnalysisMenu, setShowAnalysisMenu] = useState(false);
  const [kravspecOpen, setKravspecOpen] = useState(false);
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
      <section className="bg-gradient-to-br from-[hsl(180_30%_12%)] via-[hsl(180_25%_16%)] to-[hsl(200_20%_18%)] border-b border-primary/20 relative overflow-visible">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl pt-28 sm:pt-28 md:pt-28 pb-8 sm:pb-10 md:pb-12 relative">
          {/* Full-width eyebrow heading */}
          <h1 className="text-xl sm:text-2xl md:text-[32px] font-semibold text-white/90 tracking-tight mb-4 md:mb-5 max-w-3xl text-center mx-auto">
            Sveriges oberoende guide till Microsoft Dynamics 365
          </h1>
          <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed text-center mx-auto max-w-2xl mb-8 md:mb-10">
            För dig som vill förstå skillnaden mellan lösningarna, skapa en tydligare kravbild och hitta rätt partner för ert Dynamics 365-projekt.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8 md:gap-14 items-center">
            {/* Left column */}
            <div>
              <p className="text-2xl sm:text-3xl md:text-[40px] font-semibold leading-[1.15] tracking-tight text-white mb-4">
                Hitta rätt lösning —<br className="hidden sm:block" />
                och <em className="not-italic text-[hsl(180_75%_65%)] font-normal">rätt partner</em>
              </p>
              <p className="text-base text-white/70 font-light leading-relaxed mb-8 max-w-[480px]">
                Förstå skillnaden mellan Dynamics 365-lösningarna, skapa en tydligare kravbild och hitta partners som matchar er verksamhet. Oberoende, konkret och kostnadsfritt.
              </p>
              <div className="mb-4 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90 text-base sm:text-lg h-14 sm:h-16 px-8 rounded-xl font-bold w-full sm:w-auto justify-center shadow-lg shadow-[hsl(var(--cta-orange))]/30 hover:shadow-xl hover:shadow-[hsl(var(--cta-orange))]/40 hover:-translate-y-0.5 transition-all">
                  <Link to="/kom-igang">Hitta rätt Dynamics 365-partner <ArrowRight className="w-5 h-5 ml-2" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white/5 text-white border-white/30 hover:bg-white/15 hover:text-white text-base h-14 sm:h-16 px-6 rounded-xl font-semibold w-full sm:w-auto justify-center">
                  <Link to="/behovsanalys">Gör en behovsanalys först</Link>
                </Button>
              </div>
              <p className="text-xs sm:text-[13px] text-white/60 leading-relaxed max-w-[520px]">
                Kostnadsfritt för företag som utvärderar Dynamics 365 · Ingen registrering krävs för första rekommendationen · Byggt för den svenska marknaden
              </p>
            </div>

            {/* Right column – step card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-5 sm:p-6 overflow-visible relative z-10">
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
              <div className="relative">
                <Button 
                  className="w-full mt-4 bg-white text-[hsl(180_85%_20%)] hover:bg-white/90 text-sm h-10 rounded-lg font-semibold"
                  onClick={() => setShowAnalysisMenu(prev => !prev)}
                >
                  Starta en behovsanalys <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                {showAnalysisMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[hsl(180,25%,12%)] border border-white/25 rounded-xl overflow-hidden shadow-2xl z-50 p-1">
                    <p className="text-[11px] text-white/50 px-3 pt-2 pb-1 font-medium uppercase tracking-wider">Välj område</p>
                    <Link 
                      to="/behovsanalys/" 
                      className="flex items-center gap-3 px-3 py-2.5 text-white hover:bg-white/15 transition-colors text-sm rounded-lg font-medium"
                      onClick={() => setShowAnalysisMenu(false)}
                    >
                      <Monitor className="w-4 h-4 text-[hsl(180,75%,65%)]" />
                      ERP – Affärssystem
                    </Link>
                    <Link 
                      to="/salj-marknad-behovsanalys/" 
                      className="flex items-center gap-3 px-3 py-2.5 text-white hover:bg-white/15 transition-colors text-sm rounded-lg font-medium"
                      onClick={() => setShowAnalysisMenu(false)}
                    >
                      <Users className="w-4 h-4 text-[hsl(180,75%,65%)]" />
                      Sälj & Marknad – CRM
                    </Link>
                    <Link 
                      to="/kundservice-behovsanalys/" 
                      className="flex items-center gap-3 px-3 py-2.5 text-white hover:bg-white/15 transition-colors text-sm rounded-lg font-medium"
                      onClick={() => setShowAnalysisMenu(false)}
                    >
                      <Phone className="w-4 h-4 text-[hsl(180,75%,65%)]" />
                      Kundservice
                    </Link>
                  </div>
                )}
              </div>
              <p className="text-center text-[11px] text-white/50 mt-2">Gratis · Ingen registrering krävs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Situationspicker — Vad stämmer bäst på er? */}
      <section className="pt-14 sm:pt-20 pb-14 sm:pb-20 bg-white border-b border-border relative overflow-hidden">
        {/* Subtle ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.04),transparent_55%)]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative">
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">Hitta er ingång</span>
            <h2 className="text-2xl sm:text-3xl md:text-[36px] font-semibold text-foreground tracking-tight mb-3">Vad stämmer bäst på er just nu?</h2>
            <p className="text-sm sm:text-base text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">Välj situation — så guidar vi er till rätt verktyg, kunskap och partnerförslag utifrån var ni faktiskt befinner er.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
            {situationCards.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className="group relative h-full min-h-[300px] rounded-2xl overflow-hidden bg-card border border-border flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 shadow-md hover:shadow-2xl"
                style={{ ['--card-glow' as string]: card.glow }}
              >
                <div className="relative h-24 min-h-24 overflow-hidden flex-shrink-0">
                  <img
                    src={card.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={768}
                    height={512}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} mix-blend-multiply opacity-40 group-hover:opacity-30 transition-opacity duration-300`} />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[10px] font-semibold uppercase tracking-wider text-white/90">
                    {card.eyebrow}
                  </div>
                  <div className={`absolute bottom-3 left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center shadow-lg ring-2 ring-card group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col p-4 gap-2">
                  <h3 className="text-[14px] font-semibold text-foreground leading-tight">{card.title}</h3>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed flex-1">{card.desc}</p>
                  <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary mt-auto pt-2 group-hover:gap-2.5 transition-all">
                    {card.linkText}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `0 0 60px -10px var(--card-glow)` }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tre vägar beroende på köpläge */}
      <section className="py-14 sm:py-20 bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">Köpresan i tre steg</span>
            <h2 className="text-2xl sm:text-3xl md:text-[36px] font-semibold text-foreground tracking-tight mb-3">Tre vägar — beroende på var ni står</h2>
            <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">De flesta D365-projekt går igenom samma faser. Identifiera er fas och börja där det gör mest nytta.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {buyerPaths.map((path, i) => (
              <Link
                key={path.step}
                to={path.link}
                className="group relative flex h-full min-h-[260px] flex-col bg-card border border-border rounded-2xl p-6 sm:p-7 hover:border-primary/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="grid h-full grid-rows-[48px_minmax(48px,auto)_minmax(0,1fr)_auto] items-start gap-y-4">
                  <div className={`w-12 h-12 rounded-xl ${path.color} flex items-center justify-center text-white text-lg font-bold shadow-md`}>
                    {path.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight self-start">{path.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed self-start">{path.desc}</p>
                  <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all mt-auto">
                    {path.linkText}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* Förtroendesektion: Oberoende rådgivare + E-bok + 3 pillars */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-white border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 lg:gap-12 items-center">
            {/* Left: Thomas Laine & Michael Uhman */}
            <div className="flex flex-col items-start">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">Vem står bakom d365.se</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-6">
                Oberoende vägledning från personer som kan Dynamics 365 på riktigt
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div className="flex items-start gap-3">
                  <img
                    src={thomasLaine}
                    alt="Thomas Laine, oberoende rådgivare inom Microsoft Dynamics 365"
                    loading="lazy"
                    className="w-20 h-20 rounded-full object-cover shadow-lg flex-shrink-0"
                  />
                  <div className="pt-1">
                    <p className="font-semibold text-foreground">Thomas Laine</p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Medgrundare, d365.se. Oberoende rådgivare inom Microsoft Dynamics 365, ERP, CRM och partnerlandskapet.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <img
                    src={michaelUhman}
                    alt="Michael Uhman, oberoende rådgivare inom Microsoft Dynamics 365"
                    loading="lazy"
                    className="w-20 h-20 rounded-full object-cover shadow-lg flex-shrink-0"
                  />
                  <div className="pt-1">
                    <p className="font-semibold text-foreground">Michael Uhman</p>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Medgrundare, d365.se. Oberoende rådgivare med lång erfarenhet av affärssystem, verksamhetsutveckling och Dynamics 365-relaterade beslut.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Ett Dynamics 365-val handlar sällan bara om systemfunktioner. Det handlar om rätt omfattning, rätt vägval och framför allt rätt partner. d365.se är byggt för att hjälpa svenska företag komma in i den processen med bättre struktur — innan dialogen blir för bred, för teknisk eller för säljorienterad.
              </p>
            </div>

            {/* Right: E-bok banner */}
            <Suspense fallback={null}>
              <EbookBanner sourcePage="homepage" />
            </Suspense>
          </div>

          {/* Tre pillars: Vem / Oberoende / Metod */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 pt-10 border-t border-border">
            <div className="flex flex-col">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Drivs av oberoende rådgivare</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bakom d365.se står Thomas Laine och Michael Uhman — båda med lång erfarenhet av Microsoft Dynamics 365, ERP- och CRM-projekt och det svenska partnerlandskapet.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Så fungerar oberoendet</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vi tar inget arvode för att rekommendera en specifik partner. Du som företagare betalar ingenting. Partners syns på samma villkor utifrån bransch, app, geografi och er situation.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">Så görs matchningen</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bransch och produktområde väger tyngst, sedan storlek och geografi. Ni får alltid flera alternativ — aldrig bara ett "bästa val" — så att ni själva kan jämföra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual CTA Banners — differentiated: dark/match vs light/document */}
      <section className="px-4 sm:px-6 pt-12 sm:pt-16 pb-12 sm:pb-16 bg-secondary/30">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Box 2 — Kravunderlag: ljus, dokument-look, "vad behöver vi?" */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[hsl(40_30%_98%)] to-[hsl(180_25%_95%)] border border-border shadow-2xl p-7 sm:p-9 flex flex-col">
            {/* Subtle "paper" decoration — vertical accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-primary/70 to-[hsl(var(--cta-orange))] pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            {/* Lined paper hint */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, hsl(var(--foreground)) 0, hsl(var(--foreground)) 1px, transparent 1px, transparent 28px)' }} />

            <div className="relative flex flex-col h-full">
              <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-[10.5px] font-bold uppercase tracking-[0.12em] text-primary mb-5">
                <Check className="w-3 h-3" />
                Steg 1 · Vad behöver ni?
              </div>
              <h3 className="text-2xl sm:text-[26px] md:text-[30px] font-bold text-foreground mb-3 leading-[1.15] tracking-tight">
                Kom igång med er <span className="text-primary">kravspecifikation</span>
              </h3>
              <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed mb-6">
                Få ett strukturerat underlag som hjälper er att beskriva behov, processer och prioriteringar inför dialogen med Dynamics 365-partners. Välj område och börja direkt.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-auto">
                {[
                  { label: "ERP / Affärssystem", link: "/kravspecifikation/" },
                  { label: "Försäljning", link: "/kravspecifikation-sales/" },
                  { label: "Marknadsföring", link: "/kravspecifikation-marketing/" },
                  { label: "Kundservice", link: "/kravspecifikation-kundservice/" },
                ].map((spec) => (
                  <Link
                    key={spec.link}
                    to={spec.link}
                    className="group/item flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-card hover:bg-primary/5 border border-border hover:border-primary/40 text-[14px] font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span>{spec.label}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-4 flex items-center gap-1.5">
                <Check className="w-3 h-3 text-primary" />
                Gratis · Ange e-post för PDF · Dokument du kan dela internt
              </p>
            </div>
          </div>

          {/* Box 1 — Partnermatchning: mörk, premium, "vem ska jag prata med" */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(195_45%_10%)] via-[hsl(190_40%_14%)] to-[hsl(20_55%_18%)] border border-[hsl(var(--cta-orange))]/30 shadow-2xl p-7 sm:p-9 flex flex-col">
            {/* Decorative glows */}
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[hsl(var(--cta-orange))]/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_55%)] pointer-events-none" />
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="relative flex flex-col h-full">
              <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--cta-orange))] text-[10.5px] font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-[hsl(var(--cta-orange))]/40 mb-5">
                <Sparkles className="w-3 h-3" />
                Steg 2 · Vem ska ni prata med?
              </div>
              <h3 className="text-2xl sm:text-[26px] md:text-[30px] font-bold text-white mb-3 leading-[1.15] tracking-tight">
                Hitta rätt typ av <span className="text-[hsl(var(--cta-orange))]">Dynamics 365-partner</span>
              </h3>
              <p className="text-[14px] sm:text-[15px] text-white/75 leading-relaxed mb-6">
                Svara på några frågor om er verksamhet, ert behov och er situation. På ett par minuter får ni en oberoende rekommendation om vilken typ av partner som passar bäst.
              </p>

              {/* Stats row — visuellt särskiljande */}
              <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-y border-white/10">
                <div>
                  <div className="text-2xl font-bold text-[hsl(var(--cta-orange))] leading-none">2 min</div>
                  <div className="text-[11px] text-white/60 mt-1">Tar att fylla i</div>
                </div>
                <div className="border-l border-white/10 pl-3">
                  <div className="text-2xl font-bold text-white leading-none">100%</div>
                  <div className="text-[11px] text-white/60 mt-1">Oberoende</div>
                </div>
                <div className="border-l border-white/10 pl-3">
                  <div className="text-2xl font-bold text-white leading-none">0 kr</div>
                  <div className="text-[11px] text-white/60 mt-1">Ingen registrering</div>
                </div>
              </div>

              <div className="mt-auto">
                <Button
                  asChild
                  className="w-full sm:w-auto bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange))]/90 text-white text-[15px] font-semibold h-12 px-7 rounded-xl shadow-lg shadow-[hsl(var(--cta-orange))]/40 hover:shadow-xl hover:shadow-[hsl(var(--cta-orange))]/50 hover:-translate-y-0.5 transition-all group/btn"
                >
                  <Link to="/kom-igang/">
                    Starta partnermatchning
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Lär dig mer — Kunskapsresurser */}
      <section className="py-14 sm:py-20 bg-white border-t border-border/60">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="max-w-2xl mb-10">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">
              Lär dig mer
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
              Inte redo att välja partner än? Läs på först.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Fördjupa dig i Dynamics 365 i din egen takt — produktguider, branschevent och inspelade genomgångar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Produktfördjupningar */}
            <Link
              to="/kunskapscenter/"
              className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60" />
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Produktfördjupningar</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Detaljerade genomgångar av Business Central, F&amp;SCM, Sales, Customer Service och fler appar.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-primary">
                Utforska kunskapscentret
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Events */}
            <Link
              to="/events/"
              className="group relative bg-card border border-border rounded-2xl p-6 hover:border-[hsl(var(--cta-orange))]/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--cta-orange))] to-[hsl(var(--cta-orange))]/60" />
              <div className="w-11 h-11 rounded-xl bg-[hsl(var(--cta-orange))]/10 flex items-center justify-center mb-4 group-hover:bg-[hsl(var(--cta-orange))]/15 transition-colors">
                <Calendar className="w-5 h-5 text-[hsl(var(--cta-orange))]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Events &amp; webinars</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Kommande och tidigare event från Dynamics 365-partners — frukostseminarier, demos och fördjupningar.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-[hsl(var(--cta-orange))]">
                Se alla event
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Videos — coming soon */}
            <div className="group relative bg-muted/30 border border-dashed border-border rounded-2xl p-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-muted-foreground/40 to-muted-foreground/20" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-background border border-border rounded-full px-2.5 py-1">
                  Kommer snart
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Videobibliotek</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Korta inspelade genomgångar och expertintervjuer om Dynamics 365 — publiceras löpande.
              </p>
            </div>
          </div>
        </div>
      </section>


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
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">Mest lästa guider</h2>
              <p className="text-sm text-muted-foreground mb-4">Frågorna svenska företag söker svar på.</p>
              <div className="flex flex-col gap-2">
                {popularGuides.map((g) => (
                  <Link
                    key={g.text}
                    to={g.link}
                    className="group flex items-center justify-between gap-3 bg-card border border-border rounded-[10px] px-4 py-3 text-[13px] font-medium text-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/[0.03] hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
                  >
                    <span className="flex-1">{g.text}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">{g.tag}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Branschvägar */}
      <section className="py-12 sm:py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-2">Branschvägar</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Vägledning per bransch</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl">Olika branscher har olika krav på Dynamics 365 — välj er och se relevant innehåll och partners.</p>
            </div>
            <Link to="/branschlosningar/" className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">Se alla branscher →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {industryPills.map((pill) => (
              <Link
                key={pill}
                to="/branschlosningar/"
                className="group flex items-center justify-between gap-2 px-4 py-3.5 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              >
                <span className="text-[14px] font-medium text-foreground">{pill}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
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
            <div className="bg-card border border-border rounded-[10px] p-5 sm:p-6 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
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
            <div className="bg-card border border-border rounded-[10px] p-5 sm:p-6 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
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
            <Link to="/kom-igang/">Matcha med rätt partner <ArrowRight className="w-4 h-4 ml-1" /></Link>
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
            <Suspense fallback={<div className="space-y-3 sm:space-y-4" />}>
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
            </Suspense>
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
