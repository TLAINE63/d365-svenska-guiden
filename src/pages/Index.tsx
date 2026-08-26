import { lazy, Suspense, useState } from "react";
import FunnelCTA from "@/components/FunnelCTA";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import NoscriptSEO from "@/components/NoscriptSEO";
import { OrganizationSchema, WebSiteSchema, FAQSchema, LocalBusinessSchema } from "@/components/StructuredData";
import {
  Users,
  Phone,
  HelpCircle,
  ArrowRight,
  ArrowLeftRight,
  BarChart3,
  Sparkles,
  BookOpen,
  ClipboardCheck,
  Search,
  FileText,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import thomasLaine from "@/assets/thomas-laine.jpeg";
import michaelUhman from "@/assets/michael-uhman.jpg";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Accordion = lazy(() => import("@/components/ui/accordion").then(m => ({ default: m.Accordion })));
const AccordionContent = lazy(() => import("@/components/ui/accordion").then(m => ({ default: m.AccordionContent })));
const AccordionItem = lazy(() => import("@/components/ui/accordion").then(m => ({ default: m.AccordionItem })));
const AccordionTrigger = lazy(() => import("@/components/ui/accordion").then(m => ({ default: m.AccordionTrigger })));

// Lazy load below-fold components
const ContactFormDialog = lazy(() => import("@/components/ContactFormDialog"));

const EbookBanner = lazy(() => import("@/components/EbookBanner"));
const ScrollCTA = lazy(() => import("@/components/ScrollCTA"));
const HomePartnerNewsSection = lazy(() => import("@/components/HomePartnerNewsSection"));
const HomeVerifiedPartnersGrid = lazy(() => import("@/components/HomeVerifiedPartnersGrid"));

const VideoComingSoon = () => (
  <figure className="space-y-1.5">
    <div
      role="img"
      aria-label="Video kommer inom kort"
      className="aspect-video w-full rounded-md border border-dashed border-border bg-muted/40 flex flex-col items-center justify-center text-center px-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8 text-muted-foreground/60 mb-2"
        aria-hidden="true"
      >
        <rect x="2" y="6" width="14" height="12" rx="2" />
        <path d="m22 8-6 4 6 4V8Z" />
      </svg>
      <span className="text-sm font-medium text-muted-foreground">Video kommer inom kort</span>
    </div>
  </figure>
);


import LatestArticlesStrip from "@/components/LatestArticlesStrip";
import RelatedPages, { indexRelatedPages } from "@/components/RelatedPages";
import TrustBanner from "@/components/TrustBanner";
import { STANDARD_INDUSTRIES } from "@/data/standardIndustries";
import partnerData from "@/data/partnerData.json";
import { FREE_TOOL_COUNT } from "@/data/freeTools";
import { usePartners } from "@/hooks/usePartners";
import { useBasicPartners } from "@/hooks/useBasicPartners";

// Endast branscher som har minst en publicerad (verifierad) partner.
// Använder samma logik som /branscher (product_filters medräknas).
const PRODUCT_KEYS = ["bc", "fsc", "sales", "service", "crm"] as const;
type HeroPartner = {
  is_featured?: boolean;
  industries?: string[];
  secondary_industries?: string[];
  product_filters?: Record<string, { industries?: string[]; secondaryIndustries?: string[] }>;
};
const publishedPartners = (partnerData as HeroPartner[]).filter((p) => p.is_featured);
const publishedIndustryNames = new Set<string>();
publishedPartners.forEach((p) => {
  (p.industries || []).forEach((n) => publishedIndustryNames.add(n));
  (p.secondary_industries || []).forEach((n) => publishedIndustryNames.add(n));
  const pf = p.product_filters || {};
  PRODUCT_KEYS.forEach((k) => {
    (pf?.[k]?.industries || []).forEach((n) => publishedIndustryNames.add(n));
    (pf?.[k]?.secondaryIndustries || []).forEach((n) => publishedIndustryNames.add(n));
  });
});
const HERO_INDUSTRIES = STANDARD_INDUSTRIES.filter((i) => publishedIndustryNames.has(i.name));

// Fallback som används vid SSG/innan data laddats – ersätts av live-siffror i klienten.
const VERIFIED_PARTNER_COUNT_FALLBACK = publishedPartners.length;
const IDENTIFIED_PARTNER_COUNT_FALLBACK = 83; // Totalt övriga partners i Sverige (exkl. operatören)


const homeFaqs = [
  { question: "Vad är Microsoft Dynamics 365?", answer: "Microsoft Dynamics 365 är Microsofts plattform för affärssystem (ERP) och kundrelationshantering (CRM) i molnet. Det är en familj av specialiserade affärsappar – Business Central och Finance & Supply Chain för ERP, samt Sales, Customer Service, Field Service och Customer Insights för CRM. Alla appar delar samma dataplattform, integreras sömlöst med Microsoft 365 (Outlook, Teams, Excel) och har inbyggd AI via Microsoft Copilot. Dynamics 365 faktureras per användare och månad utan egna servrar." },
  { question: "Vad kostar Business Central i Sverige – pris per användare?", answer: "Dynamics 365 Business Central kostar från 765 kr per användare och månad (Essentials-licens) eller 1 051 kr/mån (Premium-licens som inkluderar produktion och servicehantering). Teammedlemmar med begränsad åtkomst kostar från ca 77 kr/mån. Utöver licensen tillkommer implementeringskostnad – räkna med 300 000–1 500 000 kr för en fullständig implementation beroende på komplexitet. Välj en Microsoft-certifierad partner i Sverige för korrekt offert." },
  { question: "Vilken Dynamics 365-lösning passar vårt företag bäst – ERP eller CRM?", answer: "Business Central passar SMB-företag (ca 10–300 anställda) som behöver allt-i-ett ERP för ekonomi, order, lager, inköp, produktion och projekt. Finance & Supply Chain Management passar globala koncerner med komplexa produktionsflöden och flera juridiska entiteter. Dynamics 365 Sales passar säljorganisationer som vill digitalisera pipeline och kundrelationer. Customer Service passar företag med supportärenden och fälttekniker. Gör gärna vår kostnadsfria behovsanalys för en personlig rekommendation." },
  { question: "Hur hittar jag rätt Microsoft Dynamics 365-partner i Sverige?", answer: "En bra Dynamics 365-partner i Sverige bör ha dokumenterad branschkunskap inom din sektor, referenskunder av liknande storlek och djupkompetens på just den app du ska implementera. Undvik partners som 'kan allt' – de flesta är starka på antingen ERP (Business Central eller Finance & SCM) eller CRM (Sales och Customer Service). På d365.se kan du filtrera partners på bransch, produkt och geografi kostnadsfritt. Valet av partner är ofta viktigare än valet av system." },
  { question: "Hur lång tid tar det att implementera Dynamics 365?", answer: "Business Central startpaket: 2–4 månader. Fullständig Business Central-implementation: 4–9 månader. Finance & Supply Chain Management: 9–18 månader, internationella utrullningar 18–36 månader. Dynamics 365 Sales eller Customer Service: 2–6 månader. Customer Insights (Marketing Automation): 2–4 månader. Den interna resurstillgången – engagerad projektledare och nyckelanvändare – är ofta den mest kritiska framgångsfaktorn." },
  { question: "Är Dynamics 365 ett bra alternativ till SAP, Salesforce eller Fortnox?", answer: "Ja. Dynamics 365 Business Central är ett starkt alternativ till Fortnox, Visma och Monitor för SMB – med bättre skalbarhet och djupare Microsoft-integration. Finance & Supply Chain Management är ett modernt alternativ till SAP S/4HANA med lägre licenspriser och inbyggd Copilot AI. Dynamics 365 Sales och Customer Service konkurrerar direkt med Salesforce och HubSpot, med fördelen att allt ligger i samma Microsoft-ekosystem som Office 365. För svenska företag med befintlig Microsoft-infrastruktur är Dynamics 365 ofta det naturligaste valet." },
];

const Index = () => {
  const [directionPicker, setDirectionPicker] = useState<null | "behovsanalys" | "kravspec">(null);
  const [aiQuery, setAiQuery] = useState("");
  const [heroIndustry, setHeroIndustry] = useState("");
  const [heroProduct, setHeroProduct] = useState("");
  const navigate = useNavigate();

  // Dynamisk statistik – speglar vad sajten faktiskt innehåller just nu.
  const { data: verifiedPartners } = usePartners();
  const { data: basicPartners } = useBasicPartners();
  const liveIdentifiedCount =
    (verifiedPartners?.length || 0) + (basicPartners?.length || 0);
  const identifiedPartnerCount =
    liveIdentifiedCount > 0 ? liveIdentifiedCount : IDENTIFIED_PARTNER_COUNT_FALLBACK;
  const verifiedPartnerCount = verifiedPartners?.length || VERIFIED_PARTNER_COUNT_FALLBACK;

  const heroProducts: { value: string; label: string; path: string; hasPartnerFilter?: boolean }[] = [
    { value: "bc", label: "Business Central (ERP SMB)", path: "/businesscentral/", hasPartnerFilter: true },
    { value: "fscm", label: "Finance & Supply Chain (ERP Enterprise)", path: "/finance-supply-chain/", hasPartnerFilter: true },
    { value: "sales", label: "Sales (CRM)", path: "/crm/", hasPartnerFilter: true },
    { value: "cs", label: "Customer Service", path: "/d365customerservice/" },
    { value: "fs", label: "Field Service", path: "/d365fieldservice/" },
    { value: "ci", label: "Customer Insights (Marketing)", path: "/d365marketing/" },
    { value: "contact-center", label: "Contact Center", path: "/d365contactcenter/" },
    { value: "project-operations", label: "Project Operations", path: "/d365projectoperations/" },
    { value: "human-resources", label: "Human Resources", path: "/d365humanresources/" },
    { value: "commerce", label: "Commerce", path: "/d365commerce/" },
  ];

  const submitHeroFinder = () => {
    const product = heroProducts.find((x) => x.value === heroProduct);
    const industryName = heroIndustry
      ? HERO_INDUSTRIES.find((i) => i.slug === heroIndustry)?.name || ""
      : "";

    // Produkt vald → gå till produktsidans partnersektion med branschvalet förvalt.
    if (product) {
      const qs = industryName ? `?industry=${encodeURIComponent(industryName)}` : "";
      navigate(`${product.path}${qs}${product.hasPartnerFilter ? "#partners" : ""}`);
      return;
    }
    // Endast bransch vald → branschsidan.
    if (heroIndustry) {
      navigate(`/branscher/${heroIndustry}/`);
      return;
    }
    navigate("/valjdynamics365partner/");
  };


  const submitAiSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    navigate(`/AI-sok?q=${encodeURIComponent(trimmed)}`);
  };

  const directionOptions = {
    behovsanalys: {
      title: "Vilken behovsanalys vill du göra?",
      desc: "Välj område – så får du rätt frågor och en rekommendation som faktiskt passar din situation.",
      options: [
        { label: "ERP / Affärssystem", sub: "Business Central eller Finance & SCM", link: "/ERPbehovsanalys/" },
        { label: "Sälj & Marknad (CRM)", sub: "Sales, Customer Insights (Marketing)", link: "/CRMbehovsanalys/" },
        { label: "Kundservice", sub: "Customer Service, Field Service, Contact Center", link: "/kundservice-behovsanalys/" },
      ],
    },
    kravspec: {
      title: "Vilken kravspec vill du bygga?",
      desc: "Välj område – så genererar vi ett underlag som matchar rätt Dynamics 365-applikation.",
      options: [
        { label: "ERP / Affärssystem", sub: "Business Central eller Finance & SCM", link: "/kravspecifikation/" },
        { label: "Försäljning (Sales)", sub: "Dynamics 365 Sales", link: "/kravspecifikation-sales/" },
        { label: "Marknadsföring", sub: "Customer Insights – Journeys", link: "/kravspecifikation-marketing/" },
        { label: "Kundservice", sub: "Customer Service, Field Service & Contact Center", link: "/kravspecifikation-kundservice/" },
      ],
    },
  } as const;


  const situationCards = [
    {
      eyebrow: "Hitta partner",
      icon: Users,
      title: "Vi vet vad vi vill",
      desc: "Du har ringat in behovet och vill jämföra partners utifrån bransch, produkt, storlek och geografi.",
      cta: "Hitta rätt partner",
      to: "/valjdynamics365partner/",
      primary: true,
    },
    {
      eyebrow: "Förstå behov",
      icon: ClipboardCheck,
      title: "Vi behöver ringa in behovet",
      desc: "Börja med att klargöra vad verksamheten faktiskt behöver – innan du jämför system och partners.",
      cta: "Starta en behovsanalys",
      onClick: () => setDirectionPicker("behovsanalys"),
    },
    {
      eyebrow: "Läs på",
      icon: BookOpen,
      title: "Vi vill förstå mer först",
      desc: "Utforska guider, jämförelser och artiklar om Dynamics 365, ERP, CRM och AI.",
      cta: "Till kunskapscentret",
      to: "/kunskapscenter/",
    },
  ];


  const tools = [
    {
      icon: ClipboardCheck,
      title: "Behovsanalys",
      desc: "Få en rekommendation baserad på er verksamhet.",
      onClick: () => setDirectionPicker("behovsanalys"),
    },
    {
      icon: FileText,
      title: "Kravspecifikation",
      desc: "Generera ett underlag inför partnerdialog.",
      onClick: () => setDirectionPicker("kravspec"),
    },
    {
      icon: BarChart3,
      title: "Hur redo är du?",
      desc: "Diagnostik som visar var du står i beslutsprocessen.",
      to: "/beslutsmognad/",
    },
    {
      icon: Sparkles,
      title: "AI-sök",
      desc: "Ställ frågor om Dynamics 365 och få direkta svar.",
      to: "/AI-sok/",
    },
  ];


  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="D365 & Dynamics 365 i Sverige – guide & partnerval"
        description="D365 (Microsoft Dynamics 365) i Sverige: köparsidig guide med priskalkylator, kostnadsfri behovsanalys och jämförelse av partners per bransch."
        canonicalPath="/"
        ogImage="https://d365.se/og-erp.png"
      />
      <OrganizationSchema />
      <WebSiteSchema />
      <LocalBusinessSchema />
      <FAQSchema faqs={homeFaqs} />
      <NoscriptSEO
        title="Microsoft Dynamics 365 Sverige – köparsidig guide till ERP & CRM"
        description="d365.se är Sveriges köparsidiga guide till Microsoft Dynamics 365. Vi står på köparens sida och hjälper svenska företag att jämföra ERP- och CRM-lösningar, hitta rätt Microsoft-certifierad partner och göra kostnadsfria behovsanalyser. Business Central från 765 kr per användare och månad."
        sections={[
          { heading: "Vad är Microsoft Dynamics 365?", text: "Microsoft Dynamics 365 är Microsofts molnbaserade plattform för affärssystem (ERP) och kundrelationshantering (CRM). Plattformen består av specialiserade affärsapplikationer: Business Central och Finance & Supply Chain Management för ERP, samt Sales, Customer Service, Field Service, Marketing och Customer Insights för CRM." },
          { heading: "Hitta rätt Dynamics 365-partner i Sverige", text: "Att välja rätt implementeringspartner är avgörande för ett lyckat Dynamics 365-projekt. En bra partner bör ha dokumenterad branschkunskap inom din sektor, referenskunder av liknande storlek och djupkompetens på den specifika applikation du ska implementera." },
        ]}
      />
      <Navbar />

      <main>
        {/* SECTION 1 – HERO */}
        <section className="section-divider section-divider-dark bg-[hsl(var(--hero-dark))] pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 relative overflow-hidden border-b border-[hsl(var(--line-dark))]">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 border border-white/20 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white mb-6">
                <Sparkles className="w-3 h-3" />
                Upphandlingsguiden för Microsoft Dynamics 365
              </div>
              <h1 className="text-[26px] sm:text-[34px] md:text-[40px] font-bold text-white leading-[1.15] tracking-tight mb-5">
                Microsoft Dynamics 365 i Sverige – guide, kostnader och partnerval
              </h1>
              <p className="text-[15px] sm:text-lg text-white/80 leading-relaxed max-w-3xl mb-8">
                Har du valt – eller överväger – Dynamics 365? d365.se hjälper dig förstå behovet,
                välja rätt lösning och framför allt hitta rätt partner.
              </p>


              <div className="border-t border-white/10 pt-7 mb-8">
                <h2 className="text-[22px] sm:text-[28px] font-semibold text-white leading-tight mb-4">
                  Välj rätt Dynamics 365-partner
                </h2>

                {/* Hero finder: bransch + produkt → direktnavigering */}
                <div className="bg-white/[0.04] border border-white/10 rounded p-3 sm:p-4 mb-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <label className="block">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60 mb-1.5">Välj bransch</span>
                      <select
                        value={heroIndustry}
                        onChange={(e) => setHeroIndustry(e.target.value)}
                        className="w-full h-11 rounded bg-white/10 border border-white/15 text-white text-[14px] px-3 focus:outline-none focus:border-[hsl(var(--cta-orange))]"
                        aria-label="Välj bransch"
                      >
                        <option value="" className="bg-[hsl(var(--hero-dark))]">Alla branscher</option>
                        {HERO_INDUSTRIES.map((i) => (
                          <option key={i.slug} value={i.slug} className="bg-[hsl(var(--hero-dark))]">{i.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60 mb-1.5">Välj Dynamics 365-lösning</span>
                      <select
                        value={heroProduct}
                        onChange={(e) => setHeroProduct(e.target.value)}
                        className="w-full h-11 rounded bg-white/10 border border-white/15 text-white text-[14px] px-3 focus:outline-none focus:border-[hsl(var(--cta-orange))]"
                        aria-label="Välj Dynamics 365-lösning"
                      >
                        <option value="" className="bg-[hsl(var(--hero-dark))]">Alla lösningar</option>
                        {heroProducts.map((p) => (
                          <option key={p.value} value={p.value} className="bg-[hsl(var(--hero-dark))]">{p.label}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <Button
                    onClick={submitHeroFinder}
                    size="lg"
                    className="w-full sm:w-auto bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white text-base h-12 px-6 rounded font-bold hover:-translate-y-0.5 transition-all"
                  >
                    Visa matchande partners
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    type="button"
                    onClick={() => setDirectionPicker("behovsanalys")}
                    className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-white/80 hover:text-white transition-colors"
                  >
                    eller starta en kostnadsfri behovsanalys
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="hidden sm:inline text-white/25">·</span>
                  <Link
                    to="/jamfor-partners/"
                    className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-white/80 hover:text-white transition-colors"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    jämför upp till 3 partners sida vid sida
                  </Link>
                </div>
                <p className="text-[13px] text-white/55 leading-relaxed mt-4 italic">
                  Byggt på 40+ års erfarenhet av Dynamics 365 och affärssystem.
                </p>
              </div>

              {/* Trust / stats strip – unified grid with equal height and rhythm */}
              <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 auto-rows-fr">
                {[
                  { n: `${identifiedPartnerCount}`, t: "Identifierade Dynamics 365-partners i Sverige", path: "/alla-d365-partners/" },
                  { n: `${verifiedPartnerCount}`, t: "Verifierade partnerprofiler", path: "/valjdynamics365partner/" },
                  { n: `${HERO_INDUSTRIES.length}`, t: "Branscher med verifierade partners", path: "/branscher/" },
                  { n: `${FREE_TOOL_COUNT}`, t: "Kostnadsfria beslutsverktyg", path: "/kunskapscenter/" },
                  
                ].map((s) => (
                  <Link
                    key={s.t}
                    to={s.path}
                    className="bg-white/[0.04] border border-white/10 rounded px-3 sm:px-4 py-2.5 sm:py-3 min-h-[72px] flex flex-col justify-center hover:bg-white/[0.08] hover:border-white/20 transition-colors"
                  >
                    <div className="text-[15px] sm:text-[17px] font-bold text-white leading-tight">{s.n}</div>
                    <div className="text-[11px] sm:text-[12px] text-white/60 leading-tight">{s.t}</div>
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* Transparency strip – svar på "säljer du något?" */}
        <TrustBanner variant="compact" />

        {/* SECTION 3 – WHERE ARE YOU */}
        <section className="section-divider py-14 sm:py-20 bg-secondary/40 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="max-w-2xl mb-10">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--signature))] mb-3">
                Var står du?
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-foreground tracking-tight mb-3 leading-tight">
                Var står du i processen?
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Tre vanliga utgångslägen – välj det som matchar var du befinner dig idag.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {situationCards.map((c) => (
                <div
                  key={c.title}
                  className={`group relative bg-card rounded p-6 sm:p-7 flex flex-col transition-all hover:-translate-y-1 ${
                    c.primary
                      ? "border-2 border-[hsl(var(--cta-orange))]/50 shadow-[0_8px_32px_-12px_hsl(var(--cta-orange)/0.25)]"
                      : "border border-border hover:border-primary/40"
                  }`}
                >
                  <span className="inline-block text-[10.5px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--signature))] mb-4">
                    {c.eyebrow}
                  </span>
                  <div className="w-11 h-11 rounded bg-[hsl(var(--signature))]/10 flex items-center justify-center mb-4">
                    <c.icon className="w-5 h-5 text-[hsl(var(--signature))]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 leading-snug">{c.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed mb-6 flex-1">{c.desc}</p>
                  {c.to ? (
                    <Button
                      asChild
                      className={
                        c.primary
                          ? "bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white h-11 rounded font-semibold w-full justify-center"
                          : "bg-foreground hover:bg-foreground/90 text-background h-11 rounded font-semibold w-full justify-center"
                      }
                    >
                      <Link to={c.to}>
                        {c.cta}
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      onClick={c.onClick}
                      className="bg-foreground hover:bg-foreground/90 text-background h-11 rounded font-semibold w-full justify-center"
                    >
                      {c.cta}
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verifierade partners – alla publicerade profiler */}
        <Suspense fallback={<div className="py-16" />}>
          <HomeVerifiedPartnersGrid />
        </Suspense>

        {/* Compare partners CTA section – black background */}
        <section className="relative py-12 sm:py-16 md:py-20 bg-[hsl(var(--hero-dark))] overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent opacity-40" />
          <div className="relative container mx-auto px-4 sm:px-6 max-w-4xl text-center">
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-5">
              <ArrowLeftRight className="h-4 w-4" />
              Sida vid sida
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Jämför upp till tre partners innan du kontaktar dem
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Välj två till tre partners i listan och få en jämförelsevy över produktområden, branscher, geografisk närvaro, storlek och AI-mognad – så att du kan gå vidare med rätt kortlista.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white h-14 text-base sm:text-lg px-8 font-semibold transition-all rounded"
              >
                <Link to="/jamfor-partners/">
                  <ArrowLeftRight className="w-5 h-5 mr-2" />
                  Jämför partners
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* SECTION 4 – TOOLS */}
        <section className="section-divider py-14 sm:py-20 bg-secondary/40 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="max-w-2xl mb-10">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--signature))] mb-3">
                Verktyg
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-foreground tracking-tight mb-3 leading-tight">
                Fördjupa analysen
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Fyra kostnadsfria verktyg som stärker beslutet – använd ett eller alla.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tools.map((t) => {
                const inner = (
                  <>
                    <div className="w-10 h-10 rounded bg-[hsl(var(--signature))]/10 flex items-center justify-center mb-4">
                      <t.icon className="w-5 h-5 text-[hsl(var(--signature))]" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1.5">{t.title}</h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 flex-1">{t.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[hsl(var(--signature))] group-hover:gap-2 transition-all">
                      Starta
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </>
                );
                return t.to ? (
                  <Link
                    key={t.title}
                    to={t.to}
                    className="group flex flex-col bg-card border border-border rounded p-5 hover:border-[hsl(var(--signature))]/40 hover:-translate-y-1 transition-all"
                  >
                    {inner}
                  </Link>
                ) : (
                  <button
                    key={t.title}
                    type="button"
                    onClick={t.onClick}
                    className="group flex flex-col text-left bg-card border border-border rounded p-5 hover:border-[hsl(var(--signature))]/40 hover:-translate-y-1 transition-all"
                  >
                    {inner}
                  </button>
                );
              })}
            </div>

            {/* AI search inline */}
            <form
              onSubmit={(e) => { e.preventDefault(); submitAiSearch(aiQuery); }}
              className="mt-8 bg-card border border-border rounded p-4 sm:p-5"
              role="search"
              aria-label="AI-sök"
            >
              <label htmlFor="home-ai-search" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--signature))] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Ställ en fråga direkt
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="home-ai-search"
                    type="search"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="T.ex. Vad skiljer Business Central från Finance & SCM?"
                    className="w-full bg-background border border-border focus:border-[hsl(var(--signature))] outline-none rounded pl-9 pr-3 py-3 text-[15px] text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-foreground hover:bg-foreground/90 text-background font-semibold text-[14px] px-5 py-3 rounded transition-colors"
                >
                  Sök med AI
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </section>

        <Suspense fallback={null}>
          <HomePartnerNewsSection />
        </Suspense>

        {/* SECTION 5 – TRUST (hidden) */}


        {/* SECTION 6 – KNOWLEDGE / LATEST ARTICLES */}
        <section className="section-divider py-14 sm:py-20 bg-background border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div className="max-w-2xl">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--signature))] mb-3">
                  Kunskapscenter
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-foreground tracking-tight mb-3 leading-tight">
                  Guider och insikter
                </h2>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  ERP, CRM, AI och partnerval – uppdaterat löpande.
                </p>
              </div>
              <Link
                to="/kunskapscenter/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--signature))] hover:gap-2.5 transition-all whitespace-nowrap"
              >
                Se alla artiklar
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <LatestArticlesStrip />
          </div>
        </section>

        {/* SECTION 7 – FINAL CTA */}
        <section className="section-divider section-divider-dark bg-[hsl(var(--hero-dark))] py-16 sm:py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative text-center">
            <h2 className="text-2xl sm:text-3xl md:text-[36px] font-semibold text-white tracking-tight mb-4 leading-[1.15]">
              Redo att hitta rätt partner?
            </h2>
            <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed mb-8 max-w-xl mx-auto">
              Hitta rätt partner – eller boka en kostnadsfri rådgivning först.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange-hover))] text-base sm:text-lg h-14 sm:h-15 px-8 rounded font-bold hover:-translate-y-0.5 transition-all"
              >
                <Link to="/valjdynamics365partner/">
                  Hitta rätt partner
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Link
                to="/kontakt/"
                className="inline-flex items-center justify-center gap-2 text-white/85 hover:text-white border border-white/25 hover:border-white/50 rounded h-14 px-7 text-[15px] font-semibold transition-colors"
              >
                Boka rådgivning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Direction picker dialog */}
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
                      className="group flex items-center justify-between gap-3 px-4 py-3.5 rounded bg-card hover:bg-primary/5 border border-border hover:border-primary/40 transition-all"
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

        {/* Advisors / Ebook (stödinnehåll) */}
        <section className="section-divider px-4 sm:px-6 py-14 sm:py-18 bg-secondary/40 border-b border-border">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col gap-12 lg:gap-16">
              <div className="flex flex-col items-start">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--signature))] mb-3">Vem står bakom d365.se</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-6">
                  Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div className="flex items-start gap-3">
                    <img src={thomasLaine} alt="Thomas Laine, köparsidig rådgivare inom Microsoft Dynamics 365" loading="lazy" width={80} height={80} className="w-20 h-20 rounded object-cover flex-shrink-0" />
                    <div className="pt-1">
                      <p className="font-semibold text-foreground">Thomas Laine</p>
                      <p className="text-xs text-muted-foreground leading-snug">
                        Medgrundare, d365.se. Köparsidig rådgivare inom Microsoft Dynamics 365, ERP, CRM och partnerlandskapet.
                      </p>
                      <Link to="/om-thomas-laine/" className="inline-block mt-1 text-xs font-medium text-primary hover:underline">
                        Om Thomas Laine →
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <img src={michaelUhman} alt="Michael Uhman, köparsidig rådgivare inom Microsoft Dynamics 365" loading="lazy" width={80} height={80} className="w-20 h-20 rounded object-cover flex-shrink-0" />
                    <div className="pt-1">
                      <p className="font-semibold text-foreground">Michael Uhman</p>
                      <p className="text-xs text-muted-foreground leading-snug">
                        Medgrundare, d365.se. Köparsidig rådgivare med lång erfarenhet av affärssystem, verksamhetsutveckling och Dynamics 365-relaterade beslut.
                      </p>
                      <Link to="/om-michael-uhman/" className="inline-block mt-1 text-xs font-medium text-primary hover:underline">
                        Om Michael Uhman →
                      </Link>
                    </div>
                  </div>
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  Ett Dynamics 365-val handlar sällan bara om systemfunktioner. Det handlar om rätt omfattning, rätt vägval och framför allt rätt partner. d365.se är byggt för att hjälpa svenska företag komma in i den processen med bättre struktur – innan dialogen blir för bred, för teknisk eller för säljorienterad.
                </p>
                <p className="mt-3 inline-flex items-center gap-2 text-[12.5px] sm:text-[13px] text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--signature))]" />
                  AI-assisterat innehåll, granskat av erfarna Dynamics 365-rådgivare
                </p>
              </div>
              <Suspense fallback={null}>
                <EbookBanner sourcePage="homepage" />
              </Suspense>
            </div>
          </div>
        </section>




        {/* FAQ */}
        <section id="questions" className="section-divider py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">De 5 vanligaste frågorna om Dynamics 365</h2>
            <p className="text-center text-sm text-muted-foreground mb-10 max-w-2xl mx-auto">
              Ärliga svar på pris, val, partner och AI – med en kort video från Microsoft eller ledande experter per fråga.
            </p>

            <div className="max-w-4xl mx-auto">
              <Suspense fallback={<div className="space-y-3" />}>
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="item-1" className="bg-card rounded px-4 sm:px-6 border border-border">
                    <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                      <span className="text-base sm:text-lg font-bold text-card-foreground flex items-start gap-3">
                        <HelpCircle className="w-6 h-6 text-[hsl(var(--cta-orange))] flex-shrink-0 mt-0.5" />
                        <span>Vad är Microsoft Dynamics 365 – och hur fungerar det?</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="grid gap-6 lg:grid-cols-[1fr,minmax(0,340px)] lg:items-start">
                        <div className="space-y-3 text-muted-foreground">
                          <p>Microsoft Dynamics 365 är Microsofts plattform för affärssystem (ERP) och kundrelationshantering (CRM). Det är inte ett enda system, utan en familj av specialiserade affärsapplikationer som alla delar samma dataplattform och kan integreras sömlöst med varandra.</p>
                          <p>• <strong>ERP-sidan</strong> täcker ekonomi, inköp, lager, produktion, projekt och supply chain – med <em>Business Central</em> (för SMB) och <em>Finance & Supply Chain Management</em> (för större koncerner).</p>
                          <p>• <strong>CRM-sidan</strong> täcker försäljning, marknadsföring, kundservice och fältservice.</p>
                          <p>• <strong>AI är inbyggt</strong> i samtliga appar via Microsoft Copilot.</p>
                        </div>
                        <VideoComingSoon />

                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="bg-card rounded px-4 sm:px-6 border border-border">
                    <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                      <span className="text-base sm:text-lg font-bold text-card-foreground flex items-start gap-3">
                        <HelpCircle className="w-6 h-6 text-[hsl(var(--cta-orange))] flex-shrink-0 mt-0.5" />
                        <span>Vilken Dynamics 365-lösning passar vårt företag bäst?</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="grid gap-6 lg:grid-cols-[1fr,minmax(0,340px)] lg:items-start">
                        <div className="space-y-3 text-muted-foreground">
                          <p>Det beror på om du primärt behöver ett <strong>affärssystem (ERP)</strong> eller ett <strong>CRM-system</strong> – eller båda.</p>
                          <p>• <Link to="/businesscentral/" className="text-primary hover:underline font-semibold">Dynamics 365 Business Central</Link> – Microsofts ERP-system för mindre och medelstora företag (ca 10–300 anställda). Se pris, funktioner och partners.</p>
                          <p>• <strong>Finance & Supply Chain Management</strong> för större koncerner med komplexa globala flöden.</p>
                          <p>• <strong>Sales / Customer Service / Field Service</strong> för säljorganisation respektive ärende- och fälthantering.</p>
                          <p className="pt-1">
                            → Gör en kostnadsfri behovsanalys för <Link to="/ERPbehovsanalys/" className="text-primary hover:underline font-semibold">ERP</Link>, <Link to="/CRMbehovsanalys/" className="text-primary hover:underline font-semibold">Sälj & Marknad</Link> eller <Link to="/kundservice-behovsanalys/" className="text-primary hover:underline font-semibold">Kundservice</Link>.
                          </p>
                        </div>
                        <VideoComingSoon />

                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="bg-card rounded px-4 sm:px-6 border border-border">
                    <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                      <span className="text-base sm:text-lg font-bold text-card-foreground flex items-start gap-3">
                        <HelpCircle className="w-6 h-6 text-[hsl(var(--cta-orange))] flex-shrink-0 mt-0.5" />
                        <span>Vad kostar Dynamics 365 – och vad påverkar priset?</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="grid gap-6 lg:grid-cols-[1fr,minmax(0,340px)] lg:items-start">
                        <div className="space-y-3 text-muted-foreground">
                          <p>Kostnaden består av <strong>löpande licensavgifter</strong> och en engångs <strong>implementeringskostnad</strong>.</p>
                          <p>• <strong>Business Central:</strong> 765 kr/mån (Essentials) eller 1 051 kr/mån (Premium) per användare.</p>
                          <p>• <strong>Finance & Supply Chain:</strong> 2 007 kr/mån per användare.</p>
                          <p>• <strong>Sales & Customer Service:</strong> Från 478 kr/mån.</p>
                          <Suspense fallback={null}>
                            <ContactFormDialog>
                              <Button variant="link" className="mt-2 italic p-0 h-auto font-normal text-muted-foreground hover:text-primary">
                                Kontakta oss för en tydligare uppfattning av kostnader →
                              </Button>
                            </ContactFormDialog>
                          </Suspense>
                        </div>
                        <VideoComingSoon />

                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="bg-card rounded px-4 sm:px-6 border border-border">
                    <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                      <span className="text-base sm:text-lg font-bold text-card-foreground flex items-start gap-3">
                        <Users className="w-6 h-6 text-[hsl(var(--cta-orange))] flex-shrink-0 mt-0.5" />
                        <span>Hur hittar jag rätt Dynamics 365-partner?</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="grid gap-6 lg:grid-cols-[1fr,minmax(0,340px)] lg:items-start">
                        <div className="space-y-3 text-muted-foreground">
                          <p>Att välja rätt partner är minst lika viktigt som att välja rätt system.</p>
                          <p>• <strong>Branschkunskap:</strong> Välj en partner med referenskunder i din bransch.</p>
                          <p>• <strong>Applikationsfokus:</strong> Kontrollera att partnern är specialiserad på rätt app.</p>
                          <p>• <strong>Storlek och kapacitet:</strong> Matcha partnerns kapacitet med projektets storlek.</p>
                          <p className="pt-2">
                            <Link to="/valjdynamics365partner/" className="text-primary hover:underline font-semibold">
                              → Hitta rätt partner
                            </Link>
                          </p>
                        </div>
                        <VideoComingSoon />

                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="bg-card rounded px-4 sm:px-6 border border-border">
                    <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                      <span className="text-base sm:text-lg font-bold text-card-foreground flex items-start gap-3">
                        <Sparkles className="w-6 h-6 text-[hsl(var(--cta-orange))] flex-shrink-0 mt-0.5" />
                        <span>Hur gör AI och Microsoft Copilot skillnad i Dynamics 365?</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="grid gap-6 lg:grid-cols-[1fr,minmax(0,340px)] lg:items-start">
                        <div className="space-y-3 text-muted-foreground">
                          <p>Microsoft Copilot är inbyggt i samtliga Dynamics 365-appar och används i dag främst för att <strong>korta ledtider</strong> i vardagsarbetet – inte för att ersätta människor.</p>
                          <p>• <strong>Sales:</strong> Sammanfattar möten, skriver mailutkast och pekar ut affärer att prioritera.</p>
                          <p>• <strong>Customer Service:</strong> Föreslår svar och hämtar kunskapsartiklar under pågående ärende.</p>
                          <p>• <strong>Business Central & F&SCM:</strong> Automatiserar bokföring, prognoser och inköpsförslag.</p>
                          <p className="pt-1">
                            → Läs mer i vår <Link to="/ai-oversikt/" className="text-primary hover:underline font-semibold">AI-översikt</Link> eller gör en <Link to="/ai-readiness/" className="text-primary hover:underline font-semibold">AI-mognadsanalys</Link>.
                          </p>
                        </div>
                        <VideoComingSoon />

                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

              </Suspense>
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="section-divider bg-background">
          <RelatedPages pages={indexRelatedPages} heading="Utforska Microsoft Dynamics 365" />
        </section>

        {/* Transparensblocket ligger som SECTION 5 högre upp – undvik dubblering här. */}
      
<FunnelCTA stage="early" guide="erp" source="/index/" />
</main>
      <Suspense fallback={null}><ScrollCTA /></Suspense>
      
      <Footer />
    </div>
  );
};

export default Index;
