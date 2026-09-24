import { Suspense, useState } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import NoscriptSEO from "@/components/NoscriptSEO";
import { OrganizationSchema, WebSiteSchema, FAQSchema } from "@/components/StructuredData";
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
  MessageCircle,
  Check,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import thomasLaine from "@/assets/thomas-laine.jpeg";
import michaelUhman from "@/assets/michael-uhman.jpg";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Accordion = lazyWithRetry(() => import("@/components/ui/accordion").then(m => ({ default: m.Accordion })));
const AccordionContent = lazyWithRetry(() => import("@/components/ui/accordion").then(m => ({ default: m.AccordionContent })));
const AccordionItem = lazyWithRetry(() => import("@/components/ui/accordion").then(m => ({ default: m.AccordionItem })));
const AccordionTrigger = lazyWithRetry(() => import("@/components/ui/accordion").then(m => ({ default: m.AccordionTrigger })));

// Lazy load below-fold components (lazyWithRetry: reload once if a stale chunk 404s after rebuild)
const ContactFormDialog = lazyWithRetry(() => import("@/components/ContactFormDialog"));

const EbookBanner = lazyWithRetry(() => import("@/components/EbookBanner"));
const ScrollCTA = lazyWithRetry(() => import("@/components/ScrollCTA"));
const HomePartnerNewsSection = lazyWithRetry(() => import("@/components/HomePartnerNewsSection"));
const HomeVerifiedPartnersGrid = lazyWithRetry(() => import("@/components/HomeVerifiedPartnersGrid"));
const HomeGuidesSection = lazyWithRetry(() => import("@/components/HomeGuidesSection"));

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
import { KNOWLEDGE_CONTENT_COUNT } from "@/data/knowledgeContentCount";
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
// Totalt kartlagda partners (partnerverifierade + grundprofiler). Håll i synk med
// market_report_stats "Identifierade partners" – live-siffran används när data finns.
const IDENTIFIED_PARTNER_COUNT_FALLBACK = 84;


// Senast granskat innehåll på startsidan. Ändras manuellt vid innehållsändringar.
const HOME_LAST_UPDATED = "2026-09-24";

const HOME_SOURCES = [
  { label: "Microsoft Learn: Dynamics 365-dokumentation", url: "https://learn.microsoft.com/sv-se/dynamics365/" },
  { label: "Microsoft: Dynamics 365-priser", url: "https://www.microsoft.com/sv-se/dynamics-365/pricing" },
  { label: "Microsoft: Business Central-priser", url: "https://www.microsoft.com/sv-se/dynamics-365/products/business-central/pricing" },
  { label: "Microsoft Licensing Guide för Dynamics 365", url: "https://go.microsoft.com/fwlink/?LinkId=866544" },
  { label: "Microsoft AppSource: partnerkatalog", url: "https://appsource.microsoft.com/sv-se/marketplace/partner-dir" },
];

const HOME_APP_TABLE = [
  { app: "Business Central Essentials", type: "ERP", fit: "Små och medelstora företag", price: "764,70 kr" },
  { app: "Business Central Premium", type: "ERP", fit: "SMB med produktion eller service", price: "1 051,40 kr" },
  { app: "Finance", type: "ERP", fit: "Större bolag, flera länder", price: "2 007,30 kr" },
  { app: "Supply Chain Management", type: "ERP", fit: "Komplex logistik och produktion", price: "2 007,30 kr" },
  { app: "Sales Professional", type: "CRM", fit: "Säljteam med standardbehov", price: "621,30 kr" },
  { app: "Sales Enterprise", type: "CRM", fit: "Större säljorganisationer", price: "1 003,70 kr" },
  { app: "Customer Service Professional", type: "CRM", fit: "Kundtjänst med ärendehantering", price: "477,90 kr" },
  { app: "Field Service", type: "CRM", fit: "Service ute hos kund", price: "1 003,70 kr" },
];

const homeFaqs = [
  { question: "Vad är Microsoft\u00a0Dynamics\u00a0365?", answer: "Microsoft\u00a0Dynamics\u00a0365 är en familj av molntjänster för affärssystem (ERP) och kundhantering (CRM). Business Central och Finance & Supply Chain Management används för ERP. Sales, Customer Service, Field Service och Customer Insights täcker CRM. Tjänsterna kan kopplas till Microsoft 365 och Copilot. Licenserna säljs oftast per användare och månad." },
  { question: "Vad kostar Business Central i Sverige, pris per användare?", answer: "Business Central Essentials kostar från 765 kr per användare och månad. Premium kostar 1 051 kr och omfattar även produktion och service. Team Members kostar cirka 77 kr per månad. Ett mindre införande kostar ofta 100 000–250 000 kr. Ett normalstort projekt landar ofta på 250 000–800 000 kr. Priset beror på integrationer, datamigrering och anpassningar." },
  { question: "Vilken Dynamics\u00a0365-lösning passar vårt företag bäst, ERP eller CRM?", answer: "Business Central passar ofta små och medelstora företag. Det täcker ekonomi, order, lager, inköp, produktion och projekt. Finance & Supply Chain Management är byggt för mer komplex ekonomi och logistik. Det används ofta i koncerner med flera bolag eller länder. Sales, Customer Service och Customer Insights täcker olika CRM-behov. Behovsanalysen hjälper er att välja vad som är värt att undersöka." },
  { question: "Hur hittar jag rätt Microsoft\u00a0Dynamics\u00a0365-partner i Sverige?", answer: "Jämför partnerns erfarenhet av er bransch och av rätt applikation. Titta också på projekt av liknande storlek. Fråga vilka konsulter som ska arbeta i projektet. Fråga hur leveransen går till och hur supporten fungerar efter start. På d365.se kan du filtrera partners efter bransch, produkt och geografi." },
  { question: "Hur lång tid tar det att införa Dynamics\u00a0365?", answer: "Ett Business Central-projekt tar ofta 2–9 månader. Finance & Supply Chain Management tar ofta 9–18 månader. Internationella utrullningar kan ta längre tid. Avgränsade CRM-projekt tar ungefär 2–6 månader. Tiden beror på omfattning, data, integrationer och hur mycket tid er egen organisation kan lägga." },
  { question: "Är Dynamics\u00a0365 ett alternativ till SAP, Salesforce eller Fortnox?", answer: "Ja, men det beror på behovet. Business Central jämförs ofta med ERP för mindre och medelstora företag. Finance & Supply Chain Management jämförs med ERP för större verksamheter. Sales och Customer Service jämförs med andra CRM-system. Befintliga Microsoft-tjänster kan förenkla integrationen. Funktion, kostnad och partnerstöd behöver ändå bedömas i varje fall." },
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
    // Inget val → direkt till hela partnerlistan (inget mellanled).
    navigate("/alla-d365-partners/");
  };


  const submitAiSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    navigate(`/fraga?q=${encodeURIComponent(trimmed)}`);
  };

  const directionOptions = {
    behovsanalys: {
      title: "Vilken behovsanalys vill du göra?",
      desc: "Välj område så får du relevanta frågor och ett första underlag för nästa steg.",
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
      eyebrow: "Vad behöver ni hjälp med?",
      icon: Users,
      title: "Vi söker rätt partner",
      desc: "Vi vet ungefär vad vi behöver och vill jämföra relevanta Dynamics\u00A0365-partners.",
      cta: "Hitta rätt partner",
      to: "/valjdynamics365partner/",
      primary: true,
    },
    {
      eyebrow: "Vad behöver ni hjälp med?",
      icon: Search,
      title: "Vi behöver specifik kompetens",
      desc: "Vi behöver exempelvis en projektledare, Solution Architect, testledare eller annan Dynamics\u00A0365-kompetens.",
      cta: "Hitta rätt kompetens",
      to: "/kompetens/",
    },
    {
      eyebrow: "Vad behöver ni hjälp med?",
      icon: ClipboardCheck,
      title: "Vi behöver ringa in behovet",
      desc: "Vi behöver först förstå verksamhetens behov och vilken lösning som passar.",
      cta: "Starta behovsanalysen",
      onClick: () => setDirectionPicker("behovsanalys"),
    },
    {
      eyebrow: "Vad behöver ni hjälp med?",
      icon: BookOpen,
      title: "Vi vill förstå mer först",
      desc: "Vi undersöker Dynamics 365, ERP, CRM, AI eller partnermarknaden.",
      cta: "Till kunskapscentret",
      to: "/kunskapscenter/",
    },
  ];


  const tools = [
    {
      icon: ClipboardCheck,
      title: "Behovsanalys",
      desc: "Få en rekommendation baserad på er verksamhet.",
      cta: "Få en rekommendation",
      onClick: () => setDirectionPicker("behovsanalys"),
    },
    {
      icon: FileText,
      title: "Kravspecifikation",
      desc: "Generera ett underlag inför partnerdialog.",
      cta: "Skapa ert underlag",
      onClick: () => setDirectionPicker("kravspec"),
    },
    {
      icon: BarChart3,
      title: "Hur redo är du?",
      desc: "Diagnostik som visar var du står i beslutsprocessen.",
      cta: "Se er beslutsmognad",
      to: "/beslutsmognad/",
    },
    {
      icon: Sparkles,
      title: "Fråga d365.se",
      desc: "Ställ frågor om Dynamics 365 och få direkta svar.",
      cta: "Få svar",
      to: "/fraga/",
    },
  ];


  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="D365 & Dynamics 365 i Sverige – guide & partnerval"
        description="D365 (Microsoft Dynamics 365) i Sverige: köparsidig guide med priskalkylator, kostnadsfri behovsanalys och jämförelse av partners per bransch."
        canonicalPath="/"
        ogImage="https://d365.se/og-erp.png"
        dateModified={HOME_LAST_UPDATED}
      />
      <OrganizationSchema />
      <WebSiteSchema />
      <FAQSchema faqs={homeFaqs} />
      <NoscriptSEO
        title="Microsoft Dynamics 365 Sverige – köparsidig guide till ERP & CRM"
        description="d365.se är en köparsidig guide till Microsoft Dynamics 365. Vi hjälper svenska företag att jämföra ERP- och CRM-lösningar. Du kan hitta en Microsoft-certifierad partner och göra en kostnadsfri behovsanalys. Business Central kostar från 765 kr per användare och månad."
        sections={[
          { heading: "Vad är Microsoft Dynamics 365?", text: "Microsoft Dynamics 365 är Microsofts molnplattform för affärssystem (ERP) och kundhantering (CRM). Business Central och Finance & Supply Chain Management används för ERP. Sales, Customer Service, Field Service och Customer Insights används för CRM." },
          { heading: "Hitta rätt Dynamics 365-partner i Sverige", text: "Rätt partner avgör om projektet lyckas. En bra partner har erfarenhet av er bransch. Den har referenskunder av liknande storlek. Den kan också den applikation ni ska införa." },
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
                Jämför <span className="whitespace-nowrap">Dynamics&nbsp;365-partners</span> utifrån era behov
              </h1>
              <p className="text-[15px] sm:text-lg text-white/80 leading-relaxed max-w-3xl mb-8">
                Jämför svenska Dynamics 365-partners utifrån bransch, lösning, erfarenhet och
                specialistkompetens innan du tar kontakt.
              </p>


              <div className="border-t border-white/10 pt-7 mb-8">
                <h2 className="text-[22px] sm:text-[28px] font-semibold text-white leading-tight mb-2">
                  Matcha er med rätt partner
                </h2>
                <p className="text-[13.5px] text-white/60 mb-4">
                  Valen är frivilliga – du kan gå vidare direkt.
                </p>

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
                  <ul className="grid gap-2 pt-4 sm:grid-cols-3" aria-label="Fakta om d365.se">
                    {[
                      `${identifiedPartnerCount} kartlagda Dynamics 365-partners`,
                      `${HERO_INDUSTRIES.length} branscher`,
                      "40+ års erfarenhet av ERP- och Dynamics-val",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] font-medium leading-snug text-white/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    type="button"
                    onClick={() => setDirectionPicker("behovsanalys")}
                    className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-white/80 hover:text-white transition-colors"
                  >
                    Vet du inte vilken lösning du behöver? Starta behovsanalysen
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
              </div>
            </div>
          </div>
        </section>

        {/* KOM IGÅNG – tidig väg för besökare som vill få en kortlista */}
        <section className="section-divider bg-secondary/40 border-b border-border py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="grid overflow-hidden rounded border border-border bg-card lg:grid-cols-[1.08fr_0.92fr]">
              <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                <span className="mb-5 inline-flex w-fit items-center gap-2 rounded border border-accent/25 bg-accent/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
                  <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                  Interaktiv guide
                </span>
                <h2 className="mb-4 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                  Några frågor, sedan en kortlista att gå vidare med
                </h2>
                <p className="mb-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  Svara på sex korta frågor om bransch, behov och ambitionsnivå. Du får ett tydligt urval av partner som passar er situation.
                </p>
                <ul className="mb-8 grid gap-3 text-[14px] font-medium text-foreground sm:grid-cols-2" aria-label="Fördelar med Kom igång-guiden">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    Kortlista baserad på era svar
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    Ingen inloggning krävs
                  </li>
                </ul>
                <Button asChild size="lg" className="h-12 w-full rounded !bg-[hsl(var(--cta-orange))] px-6 text-base font-bold !text-primary-foreground hover:!bg-[hsl(var(--cta-orange-hover))] sm:w-fit">
                  <Link to="/kom-igang/">
                    Starta Kom igång-guiden
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col justify-center bg-[hsl(var(--hero-dark))] p-6 sm:p-9 lg:p-12">
                <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--muted-dark))]">
                  Från frågor till nästa steg
                </p>
                <ol className="space-y-3">
                  {[
                    { n: "01", title: "Beskriv er situation", detail: "Bransch och nuläge" },
                    { n: "02", title: "Välj omfattning", detail: "Behov och ambitionsnivå" },
                    { n: "03", title: "Se er kortlista", detail: "Relevanta partner att jämföra" },
                  ].map((step, index) => (
                    <li
                      key={step.n}
                      className={`flex items-center gap-4 rounded border p-4 transition-transform duration-200 hover:-translate-y-0.5 ${
                        index === 0
                          ? "border-accent/50 bg-card/10"
                          : "border-white/10 bg-card/5"
                      }`}
                    >
                      <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded text-xs font-bold ${
                        index === 0 ? "bg-accent text-accent-foreground" : "bg-card/10 text-white/70"
                      }`}>
                        {step.n}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-white">{step.title}</span>
                        <span className="block text-[13px] leading-relaxed text-white/55">{step.detail}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex items-center gap-2" aria-label="Sex steg i guiden">
                  {[0, 1, 2, 3, 4, 5].map((step) => (
                    <span
                      key={step}
                      className={`h-1.5 flex-1 rounded-full ${step === 0 ? "bg-accent" : "bg-card/15"}`}
                      aria-hidden="true"
                    />
                  ))}
                  <span className="ml-2 text-xs font-medium text-white/55">6 steg</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SÅ FUNGERAR DET – processen i fyra steg */}
        <section className="section-divider py-12 sm:py-16 bg-background border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40">
                <span>
                  <span className="block text-lg sm:text-xl font-bold text-foreground tracking-tight">
                    Så hjälper d365.se dig hitta rätt Dynamics&nbsp;365-partner
                  </span>
                  <span className="mt-1 block text-[14px] text-muted-foreground leading-relaxed">
                    Jämför erfarenhet, arbetssätt och kompetens utifrån det projekt ni planerar.
                  </span>
                </span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="pt-6">
                <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: ClipboardCheck, t: "Beskriv ert behov eller välj bransch", d: "Börja med det du redan vet – resten kan du komplettera senare." },
                    { icon: Search, t: "Hitta relevanta Dynamics 365-partners", d: "Se kompetens och erfarenhet som passar er verksamhet." },
                    { icon: ArrowLeftRight, t: "Jämför upp till tre partner sida vid sida", d: "Skapa en tydlig kortlista innan du bestämmer dig." },
                    { icon: MessageCircle, t: "Kontakta endast de partner du själv väljer", d: "Du styr vilka som får ta del av din förfrågan." },
                  ].map((s, i) => (
                    <li key={s.t} className="bg-card border border-border rounded p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded bg-accent/10 text-accent">
                          <s.icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">0{i + 1}</span>
                      </div>
                      <h3 className="text-[15px] font-semibold text-foreground mb-1.5 leading-snug">{s.t}</h3>
                      <p className="text-[13.5px] text-muted-foreground leading-relaxed">{s.d}</p>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-[14px] text-muted-foreground">
                  Inga partner får tillgång till dina uppgifter innan du själv väljer att ta kontakt.
                </p>
              </div>
            </details>
          </div>
        </section>



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
                      className="bg-foreground hover:bg-foreground/90 text-background min-h-11 h-auto rounded px-4 py-2.5 font-semibold w-full justify-center whitespace-normal text-center leading-snug"
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
          <HomeVerifiedPartnersGrid onStartNeedsAnalysis={() => setDirectionPicker("behovsanalys")} />
        </Suspense>

        {/* Guideserien – välja Dynamics 365-partner */}
        <Suspense fallback={<div className="py-16" />}>
          <HomeGuidesSection />
        </Suspense>

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
                      {t.cta}
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
              aria-label="Fråga d365.se"
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
                  Få svar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </section>

        <Suspense fallback={null}>
          <HomePartnerNewsSection />
        </Suspense>

        {/* Statistik & metodik – förtroende efter köpresan, före kunskapssektionen */}
        <section className="border-b border-border bg-secondary/40 py-7 sm:py-9">
          <div className="container mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-5 px-4 sm:px-6 md:grid-cols-4">
            {[
              { n: `${identifiedPartnerCount}`, t: "Kartlagda Dynamics 365-partners", path: "/alla-d365-partners/" },
              { n: `${KNOWLEDGE_CONTENT_COUNT}`, t: "Guider, artiklar och branschinsikter", path: "/kunskapscenter/" },
              { n: `${HERO_INDUSTRIES.length}`, t: "Branscher", path: "/branscher/" },
              { n: `${FREE_TOOL_COUNT}`, t: "Kostnadsfria beslutsverktyg", path: "/kunskapscenter/" },
            ].map((s) => (
              <Link key={s.t} to={s.path} className="border-l-2 border-accent pl-4 transition-colors hover:border-[hsl(var(--cta-orange))]">
                <div className="text-xl font-bold text-foreground">{s.n}</div>
                <div className="text-xs leading-snug text-muted-foreground">{s.t}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Transparency strip – svar på "säljer du något?" */}
        <TrustBanner variant="compact" />

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

        {/* APPAR, PRISER OCH KÄLLOR */}
        <section className="section-divider py-12 sm:py-16 bg-background border-b border-border" aria-labelledby="app-table-heading">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <h2 id="app-table-heading" className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
              <span className="whitespace-nowrap">Dynamics&nbsp;365</span>-apparna i korthet
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-3xl">
              Listpris per användare och månad i SEK. Priserna kommer från Microsofts officiella prislista.
            </p>
            <div className="overflow-x-auto border border-border rounded bg-card">
              <table className="w-full text-[14px]">
                <caption className="sr-only">Dynamics 365-appar med typ, målgrupp och listpris</caption>
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold text-foreground">App</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-foreground">Typ</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-foreground">Passar för</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-foreground text-right">Från / användare / mån</th>
                  </tr>
                </thead>
                <tbody>
                  {HOME_APP_TABLE.map((r) => (
                    <tr key={r.app} className="border-t border-border">
                      <th scope="row" className="px-4 py-3 font-medium text-foreground text-left">{r.app}</th>
                      <td className="px-4 py-3 text-muted-foreground">{r.type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.fit}</td>
                      <td className="px-4 py-3 text-foreground text-right whitespace-nowrap">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-[2fr_1fr]">
              <div>
                <h3 className="text-[15px] font-semibold text-foreground mb-2">Källor</h3>
                <ul className="space-y-1.5 text-[14px]">
                  {HOME_SOURCES.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener" className="text-[hsl(var(--signature))] underline-offset-2 hover:underline">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-[13px] text-muted-foreground md:text-right self-end">
                Senast uppdaterad: <time dateTime={HOME_LAST_UPDATED}>{HOME_LAST_UPDATED}</time>
              </p>
            </div>
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
                  Ett Dynamics 365-val handlar sällan bara om systemfunktioner. Det handlar om rätt omfattning, rätt vägval och framför allt rätt partner. d365.se hjälper svenska företag in i den processen med bättre struktur. Det sker innan dialogen blir för bred, för teknisk eller för säljorienterad.
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
              Ärliga svar om pris, val, partner och AI. Varje svar får en kort video från Microsoft eller ledande experter.
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
                          <p>Microsoft Dynamics 365 är en familj av appar för affärssystem (ERP) och kundhantering (CRM). Flera appar använder Dataverse och kan kopplas ihop. Vilka integrationer som behövs beror på lösning och upplägg.</p>
                          <p>• <strong>ERP-sidan</strong> täcker ekonomi, inköp, lager, produktion, projekt och supply chain. <em>Business Central</em> passar mindre och medelstora företag. <em>Finance & Supply Chain Management</em> passar större koncerner.</p>
                          <p>• <strong>CRM-sidan</strong> täcker försäljning, marknadsföring, kundservice och fältservice.</p>
                          <p>• <strong>AI-stöd</strong> finns i flera appar via Microsoft Copilot. Funktioner och licenskrav varierar.</p>
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
                          <p>• <Link to="/businesscentral/" className="text-primary hover:underline font-semibold">Business Central ERP</Link> – Microsofts ERP-system för mindre och medelstora företag (ca 10–300 anställda). Se pris, funktioner och partners.</p>
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
                          <p>Valet av partner påverkar ofta resultatet lika mycket som valet av system.</p>
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
                          <p>Microsoft Copilot finns i flera <span className="whitespace-nowrap">Dynamics&nbsp;365-appar</span>, men funktioner och licenskrav varierar. I dag används det främst för att <strong>korta ledtider</strong> i vardagsarbetet, inte för att ersätta människor.</p>
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
</main>
      <Suspense fallback={null}><ScrollCTA /></Suspense>
      
      <Footer />
    </div>
  );
};

export default Index;
