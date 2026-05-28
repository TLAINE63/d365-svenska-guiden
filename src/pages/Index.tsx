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

// Standard fallback image used by all situation cards when card.image is missing
const DEFAULT_CARD_IMAGE = selectorService;
import thomasLaine from "@/assets/thomas-laine.jpeg";
import michaelUhman from "@/assets/michael-uhman.jpg";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
const Accordion = lazy(() => import("@/components/ui/accordion").then(m => ({ default: m.Accordion })));
const AccordionContent = lazy(() => import("@/components/ui/accordion").then(m => ({ default: m.AccordionContent })));
const AccordionItem = lazy(() => import("@/components/ui/accordion").then(m => ({ default: m.AccordionItem })));
const AccordionTrigger = lazy(() => import("@/components/ui/accordion").then(m => ({ default: m.AccordionTrigger })));

// Lazy load below-fold components
const ContactFormDialog = lazy(() => import("@/components/ContactFormDialog"));
const ScrollCTA = lazy(() => import("@/components/ScrollCTA"));
const EbookBanner = lazy(() => import("@/components/EbookBanner"));

import FeaturedArticleBanner from "@/components/FeaturedArticleBanner";

import RelatedPages, { indexRelatedPages } from "@/components/RelatedPages";
import HomePartnersTeaser from "@/components/HomePartnersTeaser";
const BuyerJourneyStages = lazy(() => import("@/components/BuyerJourneyStages"));

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
    answer: "Ja. Dynamics 365 Business Central är ett starkt alternativ till Fortnox, Visma och Monitor för SMB – med bättre skalbarhet och djupare Microsoft-integration. Finance & Supply Chain Management är ett modernt alternativ till SAP S/4HANA med lägre licenspriser och inbyggd Copilot AI. Dynamics 365 Sales och Customer Service konkurrerar direkt med Salesforce och HubSpot, med fördelen att allt ligger i samma Microsoft-ekosystem som Office 365. För svenska företag med befintlig Microsoft-infrastruktur är Dynamics 365 ofta det naturligaste valet."
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
    link: "/d365sales/",
    linkText: "Utforska säljprocessen",
    image: selectorCrm,
    accent: "from-pink-500/90 to-rose-600/90",
    glow: "rgba(236,72,153,0.35)",
    eyebrow: "Försäljning",
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-white" />,
    title: "Vi vill arbeta smartare med marknad och leads",
    desc: "För er som vill utveckla segmentering, kampanjer, leadsgenerering, marketing automation och överlämningen mellan marknad och sälj med Dynamics 365 Customer Insights.",
    link: "/d365marketing/",
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
    link: "/d365customerservice/",
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
    link: "/d365fieldservice/",
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
    link: "/d365contactcenter/",
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
    link: "/aioversikt/",
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
    link: "/valjdynamics365partner/",
    linkText: "Starta partnermatchning",
    image: selectorService,
    accent: "from-orange-500/90 to-teal-600/90",
    glow: "hsl(var(--cta-orange) / 0.35)",
    eyebrow: "Partner",
  },
];




const popularGuides = [
  { text: "Business Central vs Finance & SCM — vilket passar oss?", link: "/erp/", tag: "ERP" },
  { text: "Hur väljer man rätt Dynamics 365-partner?", link: "/valjdynamics365partner/", tag: "Partner" },
  { text: "Vad kostar Dynamics 365 — licens och projekt?", link: "/businesscentral/", tag: "Kostnad" },
  { text: "Hur lång tid tar en Dynamics 365-implementation?", link: "/kunskapscenter/", tag: "Tid" },
  { text: "Den typiska upphandlingsresan — 7 stadier", link: "/kunskapscenter/upphandlingsresan/", tag: "Process" },
  { text: "Är vi redo för AI och Copilot? Gör en AI-readiness", link: "/ai-readiness/", tag: "AI" },
];

import partnerDataJson from "@/data/partnerData.json";

/* Dolt: Branschvägar-sektion
const ALL_INDUSTRY_PILLS = [
  "Tillverkning", "Grossist & distribution", "Konsulttjänster",
  "Bygg & entreprenad", "Retail & e-handel", "Fastighet & förvaltning",
  "Life Science & Medtech", "Finans & försäkring", "Energi & utilities",
  "Logistik & transport", "Offentlig sektor", "Non-profit",
  "Livsmedel & process", "Telekom & IT", "Hälsa & sjukvård", "Jordbruk & skogsbruk",
];

const PILL_TO_SLUG: Record<string, string> = {
  "Tillverkning": "tillverkning",
  "Grossist & distribution": "grossist-distribution",
  "Konsulttjänster": "konsulttjanster",
  "Bygg & entreprenad": "bygg-entreprenad",
  "Retail & e-handel": "retail-ehandel",
  "Fastighet & förvaltning": "fastighet-forvaltning",
  "Life Science & Medtech": "life-science-medtech",
  "Finans & försäkring": "finans-forsakring",
  "Energi & utilities": "energi-utilities",
  "Logistik & transport": "logistik-transport",
  "Offentlig sektor": "offentlig-sektor",
  "Non-profit": "nonprofit-organisationer",
  "Livsmedel & process": "livsmedel-processindustri",
  "Telekom & IT": "telekom-it-tjanster",
  "Hälsa & sjukvård": "halsa-sjukvard",
  "Jordbruk & skogsbruk": "jordbruk-skogsbruk",
};
*/


const publishedPartnerCount = (partnerDataJson as Array<{ is_featured?: boolean }>).filter(p => p.is_featured).length;


const Index = () => {
  
  const [kravspecOpen, setKravspecOpen] = useState(false);
  const [directionPicker, setDirectionPicker] = useState<null | "behovsanalys" | "kravspec">(null);
  const directionOptions = {
    behovsanalys: {
      title: "Vilken behovsanalys vill ni göra?",
      desc: "Välj område — så får ni rätt frågor och en rekommendation som faktiskt passar er situation.",
      options: [
        { label: "ERP / Affärssystem", sub: "Business Central eller Finance & SCM", link: "/ERPbehovsanalys/" },
        { label: "Sälj & Marknad (CRM)", sub: "Sales, Customer Insights (Marketing)", link: "/CRMbehovsanalys/" },
        { label: "Kundservice", sub: "Customer Service, Field Service, Contact Center", link: "/kundservice-behovsanalys/" },
      ],
    },
    kravspec: {
      title: "Vilken kravspec vill ni bygga?",
      desc: "Välj område — så genererar vi ett underlag som matchar rätt Dynamics 365-applikation.",
      options: [
        { label: "ERP / Affärssystem", sub: "Business Central eller Finance & SCM", link: "/kravspecifikation/" },
        { label: "Försäljning (Sales)", sub: "Dynamics 365 Sales", link: "/kravspecifikation-sales/" },
        { label: "Marknadsföring", sub: "Customer Insights – Journeys", link: "/kravspecifikation-marketing/" },
        { label: "Kundservice", sub: "Customer Service, Field Service & Contact Center", link: "/kravspecifikation-kundservice/" },
      ],
    },
  } as const;
  return <div className="min-h-screen bg-secondary/30">
      <SEOHead 
        title="Vi står på köparens sida när du väljer partner för Microsoft Dynamics 365 | d365.se"
        description="Jämför certifierade Microsoftpartners per bransch, applikation och storlek. Vi står på köparens sida när du väljer partner för Microsoft Dynamics 365."
        canonicalPath="/"
        keywords="Dynamics 365 partner Sverige, D365 partners, Microsoftpartners Dynamics 365, Microsoft partner Sverige, Dynamics 365 partners, certifierad Microsoft partner, välja Dynamics 365 partner, Dynamics 365 Sverige, d365.se"
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
      <section className="bg-gradient-to-br from-[hsl(192_48%_14%)] via-[hsl(192_46%_18%)] to-[hsl(197_42%_22%)] border-b border-primary/20 relative overflow-visible">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-14 md:pb-16 relative">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-[44px] font-semibold leading-[1.25] tracking-tight text-white mb-12 max-w-4xl">
            <span className="block mb-6">Ni väljer inte bara Dynamics 365.</span>
            <span className="block text-[hsl(180_75%_65%)] font-normal italic">
              Ni väljer partnern som ska få det att fungera.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/70 font-light leading-[1.9] mt-10 mb-14 max-w-2xl">
            Fel partner, fel omfattning eller fel lösningsval kostar ofta mer än en saknad funktion.
          </p>

          {/* 3 numbered steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 max-w-4xl">
            {[
              { n: 1, eyebrow: "Bransch", title: "Välj din bransch", desc: "Vi visar relevanta lösningar för er sektor", accent: "bg-[hsl(var(--cta-orange))]" },
              { n: 2, eyebrow: "Jämför", title: "Jämför partners", desc: "Storlek, fokus, referenser", accent: "bg-white/15" },
              { n: 3, eyebrow: "Underlag", title: "Få oberoende underlag", desc: "Innan ni går vidare i partner-dialogen", accent: "bg-white/15" },
            ].map((step) => (
              <div key={step.n} className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className={`${step.accent} text-white text-[12px] font-bold w-6 h-6 rounded-full flex items-center justify-center`}>{step.n}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">{step.eyebrow}</span>
                </div>
                <h3 className="text-[15px] sm:text-base font-semibold text-white leading-snug mb-1.5">{step.title}</h3>
                <p className="text-[12.5px] text-white/55 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90 text-base sm:text-lg h-14 sm:h-16 px-8 rounded-xl font-bold w-full sm:w-auto justify-center shadow-lg shadow-[hsl(var(--cta-orange))]/30 hover:shadow-xl hover:shadow-[hsl(var(--cta-orange))]/40 hover:-translate-y-0.5 transition-all">
            <Link to="/branscher/">Starta — välj bransch <ArrowRight className="w-5 h-5 ml-2" /></Link>
          </Button>

          {/* Trust row */}
          <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/80">
            <span>Oberoende</span>
            <span className="text-white/25">·</span>
            <span>Kostnadsfritt</span>
            <span className="text-white/25">·</span>
            <span>{publishedPartnerCount} partners</span>
            <span className="text-white/25">·</span>
            <span>16 branscher</span>
          </div>
        </div>
      </section>

      {/* Block 2 — Kunskapscenter: utvald artikel */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <FeaturedArticleBanner />
        </div>
      </section>

      {/* Block — Upphandlingsresan: 7 stadier */}
      <section className="bg-white border-b border-border">
        <Suspense fallback={null}>
          <BuyerJourneyStages compact />
        </Suspense>
      </section>







      {/* Direction picker dialog for Behovsanalys / Kravspec */}
      <Dialog open={directionPicker !== null} onOpenChange={(open) => !open && setDirectionPicker(null)}>
        <DialogContent className="sm:max-w-lg">
          {directionPicker && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl">{directionOptions[directionPicker].title}</DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">
                  {directionOptions[directionPicker].desc}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2.5 mt-2">
                {directionOptions[directionPicker].options.map((opt) => (
                  <Link
                    key={opt.link}
                    to={opt.link}
                    onClick={() => setDirectionPicker(null)}
                    className="group flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-card hover:bg-primary/5 border border-border hover:border-primary/40 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex flex-col">
                      <span className="text-[14.5px] font-semibold text-foreground">{opt.label}</span>
                      <span className="text-[12.5px] text-muted-foreground">{opt.sub}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>


      {/* Block 3 — Hitta er ingång: situationskort */}
      <section className="pt-14 sm:pt-20 pb-14 sm:pb-20 bg-[#F4F8F8] border-b border-border relative overflow-hidden">

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
            {situationCards.map((card) => {
              const cardImage = card.image || DEFAULT_CARD_IMAGE;
              return (
              <Link
                key={card.title}
                to={card.link}
                className="group relative h-full min-h-[300px] rounded-2xl overflow-hidden bg-card border border-border flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 shadow-md hover:shadow-2xl"
                style={{ ['--card-glow' as string]: card.glow }}
              >
                <div
                  className="relative h-24 min-h-24 overflow-hidden flex-shrink-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${cardImage})` }}
                >
                  <img
                    src={cardImage}
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
              );
            })}
          </div>
        </div>
      </section>


      {/* Förtroendesektion: Oberoende rådgivare + E-bok + 3 pillars */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-white border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col gap-12 lg:gap-16">
            {/* Left: Thomas Laine & Michael Uhman */}
            <div className="flex flex-col items-start">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-3">Vem står bakom d365.se</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-6">
                Vi står på köparens sida när du väljer partner för Microsoft Dynamics 365
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div className="flex items-start gap-3">
                  <img
                    src={thomasLaine}
                    alt="Thomas Laine, oberoende rådgivare inom Microsoft Dynamics 365"
                    loading="lazy"
                    width={80}
                    height={80}
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
                    width={80}
                    height={80}
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
              <div className="mt-8">
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-2">
                  Vill du ha hjälp på vägen?
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Boka en kostnadsfri rådgivning med våra experter – oberoende, konfidentiellt och utan fortsättningskrav.
                </p>
                <Link
                  to="/kontakt"
                  className="inline-flex items-center justify-center rounded-xl bg-[hsl(var(--cta-orange))] text-white px-7 py-3.5 text-[15px] font-semibold shadow-lg shadow-[hsl(var(--cta-orange))]/30 hover:shadow-xl hover:shadow-[hsl(var(--cta-orange))]/40 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Boka en kostnadsfri rådgivning
                </Link>
              </div>
            </div>

            {/* Right: E-bok banner */}
            <Suspense fallback={null}>
              <EbookBanner sourcePage="homepage" />
            </Suspense>
          </div>

        </div>
      </section>

      {/* Block 6b — Jämför partners-teaser */}
      <HomePartnersTeaser />



      {/* Block 7 — Lär dig mer */}
      <section className="py-14 sm:py-20 bg-[#F4F8F8] border-t border-border/60">

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



      {/* Block 9 — Mest lästa guider */}
      <section className="py-12 sm:py-16 bg-[#F4F8F8]">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">Mest lästa guider</h2>
          <p className="text-sm text-muted-foreground mb-5">Frågorna svenska företag söker svar på.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
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
      </section>

      {/* Block 10 — Branschvägar (dold) */}
      {/*
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-2">Branschvägar</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Vägledning per bransch</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl">Olika branscher har olika krav på Dynamics 365 — välj er och se relevant innehåll och partners.</p>
            </div>
            <Link to="/branscher/" className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">Se alla branscher →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ALL_INDUSTRY_PILLS.map((pill) => (
              <Link
                key={pill}
                to={`/branscher/${PILL_TO_SLUG[pill]}/`}
                className="group flex items-center justify-between gap-2 px-4 py-3.5 rounded-xl border border-border bg-[#F4F8F8] hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              >
                <span className="text-[14px] font-medium text-foreground">{pill}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Block 11 — Slut-CTA (BOOKEND 2): mörk teal, speglar hero, en orange CTA */}
      <section className="bg-gradient-to-br from-[hsl(192_48%_14%)] via-[hsl(192_46%_18%)] to-[hsl(197_42%_22%)] py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--cta-orange)/0.10),transparent_55%)]" />
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative text-center">
          <h2 className="text-2xl sm:text-3xl md:text-[36px] font-semibold text-white tracking-tight mb-4 leading-[1.15]">
            Redo att komma igång?
          </h2>
          <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed mb-8 max-w-xl mx-auto">
            Börja med er bransch — så guidar vi er till partners som faktiskt levererat det ni behöver. Kostnadsfritt, utan registrering.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange))]/90 text-base sm:text-lg h-14 sm:h-16 px-8 rounded-xl font-bold shadow-lg shadow-[hsl(var(--cta-orange))]/30 hover:shadow-xl hover:shadow-[hsl(var(--cta-orange))]/40 hover:-translate-y-0.5 transition-all"
          >
            <Link to="/branscher/">
              Starta — välj bransch
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Block 12 — Vanliga frågor */}
      <section id="questions" className="py-12 sm:py-16 bg-white">
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
                    <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-[hsl(var(--cta-orange))] flex-shrink-0 mt-0.5" />
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
                    <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-[hsl(var(--cta-orange))] flex-shrink-0 mt-0.5" />
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
                      → Gör gärna någon av våra kostnadsfria behovsanalyser för <Link to="/ERPbehovsanalys/" className="text-primary hover:underline font-semibold">ERP/Affärssystem</Link>, <Link to="/CRMbehovsanalys/" className="text-primary hover:underline font-semibold">Sälj & Marknad</Link> eller <Link to="/kundservice-behovsanalys/" className="text-primary hover:underline font-semibold">Kundservice</Link>.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fråga 3 */}
              <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border shadow-sm">
                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-card-foreground flex items-start gap-2 sm:gap-3">
                    <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-[hsl(var(--cta-orange))] flex-shrink-0 mt-0.5" />
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
                    <Users className="w-6 h-6 sm:w-7 sm:h-7 text-[hsl(var(--cta-orange))] flex-shrink-0 mt-0.5" />
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
                      <Link to="/valjdynamics365partner/" className="text-primary hover:underline font-semibold">
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
                    <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-[hsl(var(--cta-orange))] flex-shrink-0 mt-0.5" />
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
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-[hsl(var(--cta-orange))] flex-shrink-0 mt-0.5" />
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

      {/* Block 13 — Utforska Dynamics 365 */}
      <section className="bg-[#F4F8F8]">
        <RelatedPages pages={indexRelatedPages} heading="Utforska Microsoft Dynamics 365" />
      </section>


      </main>

      {/* Scroll-triggered CTA */}
      <Suspense fallback={null}><ScrollCTA /></Suspense>

      <Footer />
    </div>;
};
export default Index;
