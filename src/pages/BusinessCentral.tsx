import ProductIsvSection from "@/components/ProductIsvSection";
import ProductDeepDiveLink from "@/components/ProductDeepDiveLink";
import RelatedPages, { bcRelatedPages } from "@/components/RelatedPages";
import PageOfferBanner from "@/components/PageOfferBanner";
import { Button } from "@/components/ui/button";
import VideoCard from "@/components/VideoCard";
import PricingCard from "@/components/PricingCard";
import { Price } from "@/components/Price";
import { resolvePriceTokens } from "@/lib/productPriceFormat";
import Navbar from "@/components/Navbar";
import ShortAnswer from "@/components/ShortAnswer";
import Footer from "@/components/Footer";
import ProductPartnerNewsSection from "@/components/ProductPartnerNewsSection";
import UnprofiledPartnersList from "@/components/UnprofiledPartnersList";
import ContactFormDialog from "@/components/ContactFormDialog";
import { ArrowLeft, ArrowRight, ExternalLink, FileText } from "lucide-react";
import { FilterButtons } from "@/components/FilterButtons";
import { SizeFilters } from "@/components/SizeFilters";
import LeadCTA from "@/components/LeadCTA";
import PartnerCard from "@/components/PartnerCard";
import SearchResultSummary from "@/components/partner/SearchResultSummary";
import BuyerManual from "@/components/BuyerManual";
import CostBreakdown from "@/components/CostBreakdown";
import ComparisonQuickLinks from "@/components/ComparisonQuickLinks";
import ProductRoiCta from "@/components/ProductRoiCta";

import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
import SEOHead from "@/components/SEOHead";
import ProductHero from "@/components/ProductHero";
import StandardProductSections from "@/components/product/StandardProductSections";
import { PRODUCT_STANDARD_SECTIONS } from "@/data/productStandardSections";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

// Breadcrumb items
const bcBreadcrumbs = [
 { name: "Hem", url: "https://d365.se" },
 { name: "Affärssystem (ERP)", url: "https://d365.se/erp" },
 { name: "Business Central", url: "https://d365.se/businesscentral" },
];

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { allIndustries } from "@/data/partners";
import { usePartners } from "@/hooks/usePartners";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";
import { useIndustryDeepLink } from "@/hooks/useIndustryDeepLink";
import { filterAndSortPartners, getProductIndustries } from "@/hooks/usePartnerFilters";
import { buildPartnerProductPath } from "@/lib/partnerProductSlug";
import {
 Accordion,
 AccordionContent,
 AccordionItem,
 AccordionTrigger,
} from "@/components/ui/accordion";

// Business Central FAQs for schema – priser resolvas från product_prices via resolvePriceTokens
const bcFaqsRaw = [
 {
 question: "Vad kostar Microsoft Dynamics 365 Business Central i Sverige?",
 answer: "Business Central pris Sverige 2026: Team Member {{price:bc-team-members:exact}}, Essentials {{price:bc-essentials:exact}} och Premium {{price:bc-premium:exact}} (Microsofts officiella listpris exkl. moms). Utöver licensen tillkommer implementeringskostnader som typiskt ligger på 150 000–800 000 kr beroende på projektets omfattning, antal användare och grad av anpassning. Kostnaden påverkas också av vald partner och supportavtal."
 },
 {
 question: "Hur lång tid tar Business Central implementering i Sverige?",
 answer: "Business Central implementering tar typiskt 3–6 månader. Mindre företag med standardprocesser kan vara igång på 2–3 månader med ett startpaket. Mer komplexa projekt med många anpassningar, integrationer mot befintliga system eller flera bolag tar 6–12 månader. Microsoft-certifierade partners arbetar enligt Success by Design-metodik för att hålla tidsplan och budget."
 },
 {
 question: "Vilket företag passar Business Central bäst för?",
 answer: "Microsoft Dynamics 365 Business Central är designat för mindre och medelstora företag med 5–300 användare som behöver ett komplett molnbaserat affärssystem för ekonomi, lager, försäljning, inköp och produktion. Det är Microsofts mest populära ERP-system i Sverige och används brett inom tillverkning, grossist & distribution, konsultbolag och bygg, entreprenad & installation."
 },
 {
 question: "Vad är skillnaden mellan Business Central Essentials och Premium?",
 answer: "Business Central Essentials ({{price:bc-essentials}}) inkluderar ekonomi, lager, försäljning, inköp och projekthantering. Premium-licensen ({{price:bc-premium}}) lägger till tillverkning (MRP, kapacitetsplanering) och servicehantering (serviceorder, servicekontrakt). De flesta företag börjar med Essentials och uppgraderar vid behov. Team Member ({{price:bc-team-members}}) för användare som bara behöver läsbehörighet eller enkla godkännanden."
 },
 {
 question: "Business Central vs Fortnox – vilket ska jag välja?",
 answer: "Fortnox passar nystartade och mycket små bolag (1–10 anst.) med enkel bokföring. Business Central passar dig som vuxit ur Fortnox och behöver lager, projektstyrning, produktion eller avancerad rapportering. Viktiga skillnader: Business Central ger djupare Microsoft 365-integration (Outlook, Teams, Power BI), inbyggd Copilot AI, obegränsad skalning och globalt stöd för flera valutor och juridiska enheter – funktioner Fortnox saknar."
 },
 {
 question: "Hur fungerar Business Central med Microsoft 365 och Copilot AI?",
 answer: "Business Central integreras nativt med Outlook, Excel och Teams. Microsoft Copilot är inbyggd utan extra licensavgift och kan automatisera uppgifter, generera produktbeskrivningar, hjälpa med bankavstämning och analysera data. Det är också enkelt att koppla ihop med e-handel (inbyggd Shopify-koppling), Dynamics 365 Sales (CRM) och branschspecifika tillägg från Marketplace."
 },
 {
 question: "Behöver man en partner för att implementera Business Central?",
 answer: "Ja, Business Central implementeras alltid via Microsoft-certifierade partners (Solutions Partner for Business Applications). Valet av partner är avgörande för projektets framgång – en erfaren partner med branschkännedom halverar typiskt implementationstiden. På d365.se kan du filtrera och jämföra Business Central-partners baserat på bransch och geografi kostnadsfritt."
 },
 {
 question: "Kan Business Central hantera tillverkning och produktion?",
 answer: "Ja, med Premium-licensen ({{price:bc-premium}}) ingår tillverkning med produktionsorder, MRP (Material Requirements Planning), kapacitetsplanering, versionskontroll och kvalitetsstyrning. Det finns dessutom ett rikt ekosystem av ISV-tillägg i Marketplace för avancerad WMS, batchhantering, maskinintegration (MES) och spårbarhet – vilket gör Business Central konkurrenskraftigt mot specialiserade tillverknings-ERP."
 },
];
const bcFaqs = bcFaqsRaw.map((f) => ({ ...f, answer: resolvePriceTokens(f.answer) }));

// Geography filter options
const geographyFilters = [
 { label: "Sverige", value: "Sverige" },
 { label: "Norden", value: "Norden" },
 { label: "Europa", value: "Europa" },
 { label: "Globalt", value: "Globalt" }
];

const BusinessCentral = () => {
 const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
 const [selectedGeography, setSelectedGeography] = useState<string | null>(null);
 const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);
 const [selectedRevenue, setSelectedRevenue] = useState<string | null>(null);

 // Aktiva filter följer med till jämförelsesidan
 const { setFilterContext: setCompareFilters } = usePartnerCompare();
 useEffect(() => {
  setCompareFilters({
   product: "bc",
   industry: selectedIndustry || null,
   geography: selectedGeography || null,
   companySize: selectedCompanySize || null,
   revenue: selectedRevenue || null,
  });
 }, [selectedIndustry, selectedGeography, selectedCompanySize, selectedRevenue, setCompareFilters]);
 
 // Fetch partners from database (only featured partners)
 const { data: partners = [], isLoading } = usePartners();

 const { skipTopScroll } = useIndustryDeepLink(setSelectedIndustry);

 useEffect(() => {
 if (!skipTopScroll) window.scrollTo(0, 0);
 }, [skipTopScroll]);


 // Filter partners for Business Central (including Sweden regions)
 const bcPartners = useMemo(() => {
 return filterAndSortPartners(
 partners, 
 'bc', 
 selectedIndustry, 
 selectedGeography, 
 selectedCompanySize,
 null, // regions
 true,
 selectedRevenue
 );
 }, [partners, selectedIndustry, selectedGeography, selectedCompanySize, selectedRevenue]);

 // Get available industries for BC partners
 const bcIndustries = useMemo(() => {
 return getProductIndustries(partners, 'bc', allIndustries);
 }, [partners]);

 const bcVideos = [
 {
 title: "Business Central för Mindre och Medelstora Företag",
 description: "Komplett affärslösning för växande företag",
 videoId: "X7B99e3mNfI",
 uploadDate: "2024-08-13",
 },
 {
 title: "Business Central - Höstrelease 2025",
 description: "Utforska funktioner och möjligheter",
 videoId: "UIL8ej7mSKQ",
 uploadDate: "2025-09-16",
 },
 {
 title: "Business Central Demo",
 description: "Automatised orderhantering med Copilot",
 videoId: "7QJeTXzZaEk",
 uploadDate: "2025-09-16",
 },
 {
 title: "Business Central Demo",
 description: "Exempel på Copilot",
 videoId: "ayXdXFyFEjY",
 uploadDate: "2023-12-08",
 },
 ];

 const bcPricingPlans = [
 {
 title: "Business Central Team Member",
 description: "För användare med begränsade behov",
 productKey: "bc-team-members",
 features: [
 "Läsbehörighet",
 "Grundläggande rapporter",
 "Tidrapportering",
 "Godkännanden",
 "Self-service funktioner",
 ],
 },
 {
 title: "Business Central Essentials",
 description: "För mindre företag",
 productKey: "bc-essentials",
 features: [
 "Ekonomihantering",
 "Försäljning & Inköp",
 "Offert- & Orderhantering",
 "Lagerhantering",
 "Projekthantering",
 ],
 },
 {
 title: "Business Central Premium",
 description: "För växande företag",
 productKey: "bc-premium",
 features: [
 "Alla Essentials-funktioner",
 "Serviceorderhantering",
 "Tillverkning",
 ],
 },
 ];

 return (
 <div className="min-h-screen">
 <SEOHead 
 title="Business Central ERP – pris 2026 och partners"
 description={resolvePriceTokens("Business Central ERP: pris från {{price:bc-essentials:short}}/användare och månad, implementering 150 000–800 000 kr och 3–6 månader. Jämför funktioner mot andra ERP-system och hitta rätt partner i Sverige – kostnadsfritt.")}
 canonicalPath="/businesscentral"
 keywords="business central erp, business central affärssystem, dynamics 365 business central, erp business central, business central pris, business central licens, business central essentials, business central premium, business central partner sverige, business central implementering"
 ogImage="https://d365.se/og-business-central.png"
 />
 <FAQSchema faqs={bcFaqs} />
 <ServiceSchema 
 name="Microsoft Dynamics 365 Business Central"
 description="Molnbaserat ERP-system för mindre och medelstora företag. Inkluderar ekonomi, lager, försäljning, inköp och produktion med inbyggd Microsoft Copilot AI. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
 />
 <BreadcrumbSchema items={bcBreadcrumbs} />
 <script
   type="application/ld+json"
   dangerouslySetInnerHTML={{
     __html: JSON.stringify({
       "@context": "https://schema.org",
       "@type": "WebPage",
       "@id": "https://d365.se/businesscentral/#webpage",
       url: "https://d365.se/businesscentral/",
       name: "Dynamics 365 Business Central – pris, funktioner och partners i Sverige",
       primaryImageOfPage: {
         "@type": "ImageObject",
         "@id": "https://d365.se/businesscentral/#primaryimage",
         url: "https://d365.se/og-business-central.png",
         contentUrl: "https://d365.se/og-business-central.png",
         width: 1200,
         height: 630,
         caption: "Dynamics 365 Business Central – pris, funktioner och partners i Sverige",
       },
       image: {
         "@id": "https://d365.se/businesscentral/#primaryimage",
       },
     }),
   }}
 />
 <Navbar />

 
 {/* Hero */}
  <ProductHero
  icon={BusinessCentralIcon}
  eyebrow="Business Central"
  title="Business Central ERP – pris, funktioner och rätt partner i Sverige"
  subhead="Microsoft levererar det kraftfulla affärssystemet. Partnern bygger processerna, väljer rätt branschspecifika tillägg och designar integrationerna mot era befintliga system. Det är nyckeln till framgångsrika BC-projekt. Här jämför ni partners som faktiskt levererat Business Central i er bransch."
  primary={{
    label: "Jämför Business Central-partners",
    onClick: () => document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth' }),
  }}
  secondary={{
  label: "Generera en kravspecifikation",
  to: "/kravspecifikation/",
  icon: FileText,
  }}
  tertiary={{
  label: "Gör en estimerad TCO/ROI-kalkyl",
  to: "/businesscentral/roi-kalkylator/",
  }}
   />




 <ShortAnswer title="Vad är Business Central som ERP-system">
 <p>Dynamics 365 Business Central är Microsofts moderna molnbaserade ERP-system (affärssystem) för mindre och medelstora företag som vill samla ekonomi, inköp, lager, försäljning och produktion i en plattform – i stället för att hålla ihop en flora av separata system som inte pratar med varandra.</p>
 <p>Inbyggd AI via Microsoft Copilot och nya autonoma agenter automatiserar repetitiva uppgifter direkt i systemet. Det kan handla om orderregistrering, produktbeskrivningar, försäljnings- och kundtjänstflöden eller leverantörsavstämningar – moment som tidigare krävt manuell handpåläggning kan nu hanteras med stöd av AI inifrån affärssystemet.</p>
 <p>Genom Microsoft Marketplace finns dessutom över 7 000 certifierade tilläggsappar som ger djup branschanpassning utan kostsam specialutveckling – oavsett om ni är inom tillverkning, handel, tjänster eller bygg. Det gör att lösningen kan formas efter er verksamhet snarare än tvärtom.</p>
 <p>Business Central är tillgängligt i över 160 länder med lokaliseringar från Microsoft och partners, vilket gör det till ett tryggt val även för bolag med internationella ambitioner eller dotterbolag i flera länder.</p>
 </ShortAnswer>

 {/* Snabbfakta – svarar direkt på pris-, tids- och passformsfrågor */}
 <section className="py-10 sm:py-12 bg-background">
  <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
   <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
    Business Central ERP – snabbfakta
   </h2>
   <p className="text-muted-foreground mb-6 text-sm sm:text-base">
    Det som flest frågar om innan de jämför Business Central med andra affärssystem.
   </p>
   <div className="overflow-x-auto rounded-lg border border-border">
    <table className="w-full text-sm">
     <tbody>
      {[
       ["Typ av system", "Molnbaserat ERP (affärssystem) från Microsoft"],
       ["Passar", "5–300 användare, små och medelstora bolag"],
       ["Licenspris", resolvePriceTokens("Essentials {{price:bc-essentials:exact}}, Premium {{price:bc-premium:exact}}, Team Member {{price:bc-team-members:exact}} per användare/månad exkl. moms")],
       ["Implementeringskostnad", "Typiskt 150 000–800 000 kr beroende på omfattning"],
       ["Införandetid", "3–6 månader (2–3 månader med startpaket)"],
       ["Ingår i Premium", "Tillverkning (MRP, kapacitetsplanering) och servicehantering"],
       ["AI", "Microsoft Copilot ingår utan extra licensavgift"],
       ["Vanliga alternativ", "Dynamics 365 Finance & Supply Chain, Fortnox, Visma, Monitor"],
       ["Införs av", "Microsoft-certifierad partner – jämför partners nedan"],
      ].map(([label, value]) => (
       <tr key={label} className="border-b border-border last:border-0">
        <th scope="row" className="text-left align-top font-medium text-foreground py-3 px-4 w-[42%] bg-muted/30">
         {label}
        </th>
        <td className="py-3 px-4 text-muted-foreground">{value}</td>
       </tr>
      ))}
     </tbody>
    </table>
   </div>
   <p className="text-sm text-muted-foreground mt-4">
    Vill ni ställa Business Central mot ett större ERP-system? Läs{" "}
    <Link to="/erp/" className="text-primary underline underline-offset-2">
     jämförelsen mellan Business Central och Finance &amp; Supply Chain
    </Link>{" "}
    eller se{" "}
    <Link to="/kostnad/" className="text-primary underline underline-offset-2">
     vad ett affärssystem kostar
    </Link>.
   </p>
  </div>
 </section>



 {/* Matchningstest CTA */}
 <section className="py-10 sm:py-12 bg-[hsl(var(--hero-dark))] border-y border-primary/20">
   <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
     <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
       <div>
         <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60 mb-2">
           Matchningstest
         </p>
         <h2 className="text-xl sm:text-2xl md:text-[28px] font-semibold text-white leading-snug mb-2">
           Matchar Business Central era behov?
         </h2>
         <p className="text-white/75 text-sm sm:text-base max-w-2xl leading-relaxed">
           20–25 frågor – först generella, sedan branschspecifika. Resultatet visar vad som ingår i BC i
           standard, vad som kräver Premium, konfiguration eller ISV-tillägg, och vad som ligger utanför BC.
         </p>
       </div>
        <Link
          to="/businesscentral/matchningstest/"
          className="inline-flex items-center justify-center rounded-md px-7 py-4 text-base sm:text-lg font-semibold bg-[hsl(var(--cta-orange))] text-white hover:bg-[hsl(var(--cta-orange-hover))] transition-colors whitespace-nowrap shadow-lg shadow-black/20 hover:-translate-y-0.5 transition-transform"
        >
          Starta matchningstestet →
        </Link>
     </div>
   </div>
 </section>

 <StandardProductSections productName="Business Central" data={PRODUCT_STANDARD_SECTIONS["business-central"]} />

 {/* FAQ Section */}
 <section className="py-8 sm:py-12 md:py-16 bg-secondary/50">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="max-w-4xl mx-auto">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
 Vanliga frågor om Dynamics 365 Business Central
 </h2>
 
 <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
 <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 ❓ Vad kostar Business Central – och vad påverkar priset?
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 space-y-4">
 <p>
 Business Central har i praktiken <strong className="text-foreground">två typer av användare</strong>:
 </p>
 <ul className="list-disc pl-5 space-y-2">
 <li><strong className="text-foreground">"Vanlig" användare</strong> – Full tillgång (styrs av behörighetsroller)</li>
 <li><strong className="text-foreground">Team Member</strong> – Begränsade arbetsuppgifter</li>
 </ul>
 <p>
 Den vanliga användaren finns i två varianter:
 </p>
 <ul className="list-disc pl-5 space-y-2">
 <li><strong className="text-foreground">Essentials</strong> – Standardfunktioner för ekonomi, försäljning, inköp och lager</li>
 <li><strong className="text-foreground">Premium</strong> – Allt i Essentials plus tillverkning och serviceorderhantering</li>
 </ul>
 <div className="bg-secondary/50 rounded-lg p-4 mt-4">
 <p className="font-semibold text-foreground mb-2">💰 Licenspriser (prenumeration):</p>
 <ul className="space-y-1">
 <li>• Team Member: <strong className="text-foreground"><Price productKey="bc-team-members" mode="exact" /></strong></li>
 <li>• Essentials: <strong className="text-foreground"><Price productKey="bc-essentials" mode="exact" /></strong></li>
 <li>• Premium: <strong className="text-foreground"><Price productKey="bc-premium" mode="exact" /></strong></li>
 </ul>
 <p className="text-xs text-muted-foreground mt-2 italic">
 Microsofts officiella listpris exkl. moms vid årsvis betalning. Källa: microsoft.com/sv-se.
 </p>
 </div>
 <p className="text-sm italic">
 Till detta tillkommer implementeringskostnader som varierar beroende på omfattning, integrationer och anpassningsbehov.
 </p>
 </AccordionContent>
 </AccordionItem>

 <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 ❓ Är Business Central rätt för mitt företag?
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 space-y-4">
 <p>
 Business Central är optimerat för <strong className="text-foreground">mindre och medelstora företag</strong> (10–300 användare) med behov av ett komplett affärssystem (ERP).
 </p>
 <p className="font-semibold text-foreground">Det passar särskilt bra för företag som:</p>
 <ul className="list-disc pl-5 space-y-2">
 <li>Redan använder Microsoft 365</li>
 <li>Vill ha en integrerad lösning för ekonomi, lager, försäljning, inköp och produktion</li>
 </ul>
 <p>
 Oavsett bransch – <em>tillverkning, handel, tjänster eller projekt</em> – kan Business Central anpassas till era specifika behov.
 </p>
 </AccordionContent>
 </AccordionItem>

 <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 ❓ Hur lång tid tar det att implementera Business Central?
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 space-y-4">
 <p>
 En typisk Business Central-implementering tar <strong className="text-foreground">3–6 månader</strong> beroende på komplexitet och omfattning.
 </p>
 <div className="bg-secondary/50 rounded-lg p-4">
 <p className="font-semibold text-foreground mb-2">⏱️ Tidsuppskattningar:</p>
 <ul className="space-y-2">
 <li>• <strong className="text-foreground">Mindre företag</strong> med standardprocesser: <strong>2–3 månader</strong></li>
 <li>• <strong className="text-foreground">Större projekt</strong> med omfattande anpassningar: <strong>6–12 månader</strong></li>
 </ul>
 </div>
 <p>
 💡 <em>Vissa rekommenderar en fasad implementering där ni får grundfunktionaliteten först och sedan bygger på med mer avancerade funktioner.</em>
 </p>
 </AccordionContent>
 </AccordionItem>

 <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 ❓ Hur fungerar Business Central med Microsoft 365 och andra system?
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 space-y-4">
 <p>
 Business Central är byggt för att fungera <strong className="text-foreground">sömlöst med Microsoft 365-paketet</strong>.
 </p>
 <p className="font-semibold text-foreground">Arbeta direkt i:</p>
 <ul className="list-disc pl-5 space-y-1">
 <li>📧 Outlook</li>
 <li>📊 Excel</li>
 <li>💬 Teams</li>
 </ul>
 <p className="font-semibold text-foreground mt-4">Integreras enkelt med:</p>
 <ul className="list-disc pl-5 space-y-1">
 <li>E-handelsplattformar</li>
 <li>CRM-system (som Dynamics 365 Sales)</li>
 <li>Tidrapporteringssystem</li>
 <li>Branschspecifika tilläggslösningar</li>
 </ul>
 </AccordionContent>
 </AccordionItem>

 <AccordionItem value="item-5" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 ❓ Hur anpassningsbart är Business Central för våra behov?
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 space-y-4">
 <p>
 Business Central är <strong className="text-foreground">mycket flexibelt</strong> och kan anpassas utan omfattande programmering tack vare Power Platform.
 </p>
 <p className="font-semibold text-foreground">Ni kan enkelt:</p>
 <ul className="list-disc pl-5 space-y-1">
 <li>Skapa egna arbetsflöden</li>
 <li>Bygga rapporter och dashboards</li>
 <li>Anpassa processer efter era behov</li>
 </ul>
 <div className="bg-secondary/50 rounded-lg p-4 mt-4">
 <p className="font-semibold text-foreground mb-2">🔌 Marketplace – hundratals tillägg:</p>
 <p>Branschspecifika lösningar för bygg, tillverkning, detaljhandel och professionella tjänster.</p>
 </div>
 <p className="text-sm italic">
 För mer avancerade anpassningar finns möjligheten till utveckling med AL-språket.
 </p>
 </AccordionContent>
 </AccordionItem>

 <AccordionItem value="item-6" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 ❓ Vilken partner borde passa vår verksamhet bäst?
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 space-y-4">
 <p>
 Rätt partner beror på er <strong className="text-foreground">bransch, företagsstorlek och specifika behov</strong>.
 </p>
 <p className="font-semibold text-foreground">Vi rekommenderar att ni väljer en partner som:</p>
 <ul className="list-disc pl-5 space-y-1">
 <li>Har erfarenhet från liknande implementeringar i er bransch</li>
 <li>Har certifieringar för Business Central</li>
 </ul>
 <div className="bg-business-central/10 border border-business-central/30 rounded-lg p-4 mt-4">
 <p className="font-semibold text-foreground mb-2">🔍 Hitta rätt partner:</p>
 <p>
 På vår <a href="/valjdynamics365partner/" className="text-business-central hover:underline font-semibold">partnerkatalog</a> kan ni filtrera på bransch, företagsstorlek och applikationer för att hitta partners som matchar era krav.
 </p>
 </div>
 </AccordionContent>
 </AccordionItem>
 </Accordion>
 </div>
 </div>
 </section>


 {/* AI & Agents Section for Business Central */}
 <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="max-w-5xl mx-auto">
 <div className="text-center mb-8 sm:mb-10">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
 AI & Agenter för Business Central
 </h2>
 <p className="text-lg text-muted-foreground">
 Copilot hjälper dig, Agenter arbetar för dig
 </p>
 </div>

 <div className="space-y-6">
 {/* Copilot Features */}
 <div className="bg-card rounded p-6 sm:p-8 border border-border">
 <div className="flex items-start gap-4 mb-4">
 <div className="bg-secondary w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
 <span className="text-xl">👤</span>
 </div>
 <div>
 <h3 className="text-xl font-bold text-card-foreground mb-2">Copilot i Business Central</h3>
 <p className="text-muted-foreground mb-4">
 Din AI-assistent för dagliga uppgifter
 </p>
 </div>
 </div>
 <div className="grid sm:grid-cols-2 gap-4 text-sm">
 <div>
 <ul className="space-y-2 text-muted-foreground">
 <li>• Generera produktbeskrivningar automatiskt</li>
 <li>• Analysera banktransaktioner med AI</li>
 <li>• Skapa försäljningsrader från dokument</li>
 <li>• Intelligenta inköpsförslag</li>
 </ul>
 </div>
 <div>
 <ul className="space-y-2 text-muted-foreground">
 <li>• Hjälper med e-postutkast</li>
 <li>• Föreslår kontouppställningar</li>
 <li>• Ger insikter i realtid</li>
 <li>• Stöttar användare i arbetsflöden</li>
 </ul>
 </div>
 </div>
 </div>

 {/* Agents Features */}
 <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded p-6 sm:p-8 border-2 border-primary/30">
 <div className="flex items-start gap-4 mb-4">
 <div className="bg-gradient-to-br from-primary to-accent w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
 <span className="text-xl">⚡</span>
 </div>
 <div>
 <h3 className="text-xl font-bold text-foreground mb-2">Agenter i Business Central</h3>
 <p className="text-muted-foreground mb-4">
 Autonoma AI-system som arbetar självständigt 24/7
 </p>
 </div>
 </div>
 <div className="space-y-4">
 <div className="bg-card/50 rounded-lg p-4">
 <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
 <span>📦</span> Inventory Management Agent
 </h4>
 <p className="text-sm text-muted-foreground">
 Övervakar lagernivåer kontinuerligt, skapar automatiskt inköpsorder baserat på säkerhetslager och prognoser, 
 och förhandlar priser med leverantörer enligt dina affärsregler
 </p>
 </div>
 <div className="bg-card/50 rounded-lg p-4">
 <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
 <span>💰</span> Finance Agent
 </h4>
 <p className="text-sm text-muted-foreground">
 Automatiserar fakturahantering, utför bankavstämningar, processar betalningar och leverantörsreskontra, 
 samt identifierar och flaggar avvikelser för granskning
 </p>
 </div>
 <div className="bg-card/50 rounded-lg p-4">
 <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
 <span>📊</span> Production Planning Agent
 </h4>
 <p className="text-sm text-muted-foreground">
 Optimerar produktionsplanering baserat på order, lager och kapacitet. Schemalägger automatiskt 
 produktionsorder och koordinerar med leverantörer för material
 </p>
 </div>
 <div className="bg-card/50 rounded-lg p-4">
 <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
 <span>💼</span> Customer Service Agent
 </h4>
 <p className="text-sm text-muted-foreground">
 Hanterar kundförfrågningar om orderstatus, fakturauppgifter och leveransinformation autonomt. 
 Eskalerar komplexa ärenden till rätt person med fullständig kontext
 </p>
 </div>
 </div>
 </div>
 </div>

 <div className="mt-8 text-center">
 <Button asChild size="lg" variant="outline">
 <Link to="/agents/">
 Upptäck fler Agenter-användningsområden
 <span className="ml-2">→</span>
 </Link>
 </Button>
 </div>
 </div>
 </div>
 </section>



 {/* Pricing Section */}
 <section id="pricing" className="py-8 sm:py-12 md:py-16 bg-background">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="text-center mb-10 sm:mb-12 md:mb-16">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
 Business Central Essentials vs Premium
 </h2>
 <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
 Vilken licens passar bäst för ditt företag?
 </p>
 </div>
 <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
 {bcPricingPlans.map((plan, index) => (
 <PricingCard key={index} {...plan} />
 ))}
 </div>
 <p className="text-sm italic text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
 Observera: Priserna ovan är exempelpriser baserade på Microsofts offentliga prislista vid tidpunkten för sammanställningen. För exakta och aktuella priser, inklusive eventuella rabatter eller volymavtal, rekommenderas att en offert tas fram i samråd med en auktoriserad Microsoft-partner eller direkt via Microsoft.
 </p>
 </div>
 </section>

      <BuyerManual product="business-central" />
      <CostBreakdown product="business-central" />

      <ComparisonQuickLinks productKeys="bc" />

      {/* CTA till TCO/ROI-kalkylator i Kunskapscentret */}
      <ProductRoiCta productKey="business-central" />




      <ProductDeepDiveLink product="Business Central" label="Business Central" />

      {/* Videos Section */}
      <section id="videos" className="py-8 sm:py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Korta inspirationsvideos
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Här har vi samlat ett antal väldigt korta videos som kan ge en viss inblick i möjligheterna med Business Central
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {bcVideos.map((video, index) => (
              <VideoCard key={index} {...video} />
            ))}
          </div>
        </div>
      </section>



      <ProductPartnerNewsSection productArea="business-central" productLabel="Business Central" />

      {/* Partners Section */}
      <section id="partners" className="py-8 sm:py-12 md:py-16 bg-secondary/50">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="text-center mb-8 sm:mb-10 md:mb-12">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
 Business Central-partners
 </h2>
 <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto">
 Här är ett urval av partners som arbetar med Dynamics 365 Business Central i Sverige. Välj vilken bransch du tillhör och din företagsstorlek (antal anställda), så filtreras listan på de Microsoftpartners som sannolikt passar dig bäst
 </p>
 </div>

 {/* Industry Filter */}
 <FilterButtons
 title="Filtrera på bransch"
 icon="industry"
 options={allIndustries.map(ind => ({ label: ind, value: ind }))}
 selectedValue={selectedIndustry}
 onSelect={setSelectedIndustry}
 colorScheme="business-central"
 />

 {/* Geography Filter */}
 <FilterButtons
 title="Ange var geografiskt ni har er verksamhet och som är relevant för denna lösning (organisation, kontor/personal)"
 icon="geography"
 options={geographyFilters.map(g => ({ label: g.label, value: g.value }))}
 selectedValue={selectedGeography}
 onSelect={setSelectedGeography}
 colorScheme="business-central"
 />

 {/* Optional size filters */}
 <SizeFilters
 selectedCompanySize={selectedCompanySize}
 selectedRevenue={selectedRevenue}
 onCompanySizeChange={setSelectedCompanySize}
 onRevenueChange={setSelectedRevenue}
 colorScheme="business-central"
 />

 {/* Resultathuvud – användarens sökning visas en gång ovanför korten */}
 {(selectedIndustry || selectedGeography || selectedCompanySize || selectedRevenue) && (
 <>
 <SearchResultSummary
 count={bcPartners.length}
 criteria={[
 "Business Central",
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

 {bcPartners.length === 0 ? (
 <div className="text-center py-6">
 <h3 className="text-lg font-semibold text-foreground mb-2">Inga partner listas med denna filtrering?</h3>
 <p className="text-muted-foreground">
 Ingen fara, kontakta oss så hjälper vi dig att hitta en eller ett par partners som passar för din verksamhet.
 </p>
 </div>
 ) : (
 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {bcPartners.map((partner, index) => {
 // Build profile URL with filter context
 const basePath = buildPartnerProductPath(partner.slug, "Business Central");
 const params = new URLSearchParams();
 if (selectedIndustry) params.set("industry", selectedIndustry);
 if (selectedGeography) params.set("geography", selectedGeography);
 if (selectedCompanySize) params.set("companySize", selectedCompanySize);
 if (selectedRevenue) params.set("revenue", selectedRevenue);
 const qs = params.toString();
 const profileUrl = qs ? `${basePath}?${qs}` : basePath;
 
 return (
 <PartnerCard
 key={index}
 partner={partner}
 profileUrl={profileUrl}
 colorScheme="primary"
 productKey="bc"
 highlightedProduct="Business Central"
 highlightedIndustry={selectedIndustry || undefined}
 highlightedGeography={selectedGeography || undefined}
 highlightedCompanySize={selectedCompanySize || undefined}
 highlightedRevenue={selectedRevenue || undefined}
 showRandomIndicator={true}
 showBestFitOnly
 resultView
 />
 );
 })}
 </div>
 )}

  <UnprofiledPartnersList
  variant="teaser"
  showSeeAllLink
  productKey="bc"
  productLabel="Business Central"
  />


 {/* Lead CTA - shows when partners are filtered */}
 {selectedIndustry && (
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
 Business Central
 </Badge>
 {selectedIndustry && (
 <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 ">
 {selectedIndustry}
 </Badge>
 )}
 {selectedGeography && (
 <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 ">
 {selectedGeography}
 </Badge>
 )}
 </div>
 </div>
 
 <LeadCTA
 sourcePage="/businesscentral"
 selectedProduct="Business Central"
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
 Redo att växa med Business Central?
 </h2>
 <p className="text-lg text-muted-foreground mb-8">
 Kontakta oss för en kostnadsfri konsultation
 </p>
 <ContactFormDialog>
 <Button className="bg-business-central hover:bg-business-central/90 text-business-central-foreground h-14 sm:h-16 rounded" size="lg">
 Boka in en kostnadsfri rådgivning
 </Button>
 </ContactFormDialog>
 </div>
 </div>
      </section>






 <RelatedPages pages={bcRelatedPages} heading="Utforska vidare" />
 <section className="py-8">
   <div className="container mx-auto px-4 max-w-6xl">
     <PageOfferBanner />
   </div>
 </section>
 <ProductIsvSection product="Business Central" />

 <Footer />
 </div>
 );
};

export default BusinessCentral;
