import SystemvalHandoffNote from "@/components/SystemvalHandoffNote";
import PartnerSwitchCta from "@/components/PartnerSwitchCta";
import BcDecisionGuide, { BcOptionalDeepDive, BcNextSteps } from "@/components/product/BcDecisionGuide";
import { nowrapBrand } from "@/lib/nowrapBrand";
import { trackFunnelEvent } from "@/utils/trackFunnelEvent";
import { sendEvent } from "@/lib/siteIntelligence";
import AiExamplesEntry from "@/components/ai-examples/AiExamplesEntry";
import BasicProfilesDirectory from "@/components/BasicProfilesDirectory";
import SourcesAndMethod from "@/components/SourcesAndMethod";
import WhyTheseResults from "@/components/WhyTheseResults";
import EditorialAssessment from "@/components/EditorialAssessment";
import BcSiteHandoff from "@/components/BcSiteHandoff";
import ProductIsvSection from "@/components/ProductIsvSection";
import RelevantVideosSection from "@/components/RelevantVideosSection";
import RelatedPages, { bcRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import PricingCard from "@/components/PricingCard";

import { resolvePriceTokens } from "@/lib/productPriceFormat";
import Navbar from "@/components/Navbar";
import ShortAnswer from "@/components/ShortAnswer";
import Footer from "@/components/Footer";
import ProductPartnerNewsSection from "@/components/ProductPartnerNewsSection";
import AktuelltContextSection from "@/components/aktuellt/AktuelltContextSection";
import UnprofiledPartnersList from "@/components/UnprofiledPartnersList";
import { ArrowRight } from "lucide-react";
import { FilterButtons } from "@/components/FilterButtons";
import { SizeFilters } from "@/components/SizeFilters";
import LeadCTA from "@/components/LeadCTA";
import IndustryVerifiedPartnerCard from "@/components/partner/IndustryVerifiedPartnerCard";
import SearchResultSummary from "@/components/partner/SearchResultSummary";
import CostBreakdown from "@/components/CostBreakdown";

import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import BusinessCentralIcon from "@/assets/icons/BusinessCentral-new.webp";
import SEOHead from "@/components/SEOHead";
import ProductHero from "@/components/ProductHero";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";

// Breadcrumb items
const bcBreadcrumbs = [
 { name: "Hem", url: "https://d365.se" },
 { name: "Affärssystem (ERP)", url: "https://d365.se/affarssystem/" },
 { name: "Business Central", url: "https://d365.se/businesscentral" },
];

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
import { usePartnerImpressions } from "@/hooks/usePartnerImpressions";
import EditorialSource from "@/components/EditorialSource";

// Business Central FAQs for schema – priser resolvas från product_prices via resolvePriceTokens
const bcFaqsRaw = [
 {
 question: "Vad är Business Central?",
 answer: "Microsoft Dynamics 365 Business Central är Microsofts molnbaserade affärssystem (ERP) för mindre och medelstora företag. Det samlar redovisning, kund- och leverantörsreskontra, order och fakturering, lager, inköp, projekt och – med Premium – tillverkning och service i en gemensam databas. Business Central är efterföljaren till Dynamics NAV (Navision) och integreras direkt med Outlook, Excel, Teams och Power BI. Copilot ingår i licensen."
 },
 {
 question: "Vad kostar Business Central?",
 answer: "Business Central kostar {{price:bc-essentials:exact}} för Essentials, {{price:bc-premium:exact}} för Premium och {{price:bc-team-members:exact}} för Team Member (Microsofts listpris exkl. moms). Till licensen kommer implementering: snabbstart till fast pris från 50 000 kr, annars ca 175 000–465 000 kr för ett litet projekt, 465 000 kr–1,2 MSEK för ett medelstort och 1,2–2,9 MSEK för ett stort projekt (räknat på 11 600 kr per konsultdag). Tjänsteföretag och grossister hamnar lägst, tillverkning högst. Räkna även med löpande förvaltning på 10–20 % av projektkostnaden per år."
 },
 {
 question: "Vad kostar Microsoft Dynamics 365 Business Central i Sverige?",
 answer: "Business Central pris Sverige 2026: Team Member {{price:bc-team-members:exact}}, Essentials {{price:bc-essentials:exact}} och Premium {{price:bc-premium:exact}} (Microsofts officiella listpris exkl. moms). Utöver licensen tillkommer implementeringskostnader: snabbstart till fast pris från 50 000 kr, litet projekt ca 175 000–465 000 kr, medelstort 465 000 kr–1,2 MSEK och stort 1,2–2,9 MSEK beroende på projektets omfattning, antal användare och grad av anpassning. Kostnaden påverkas också av vald partner och supportavtal."
 },
 {
 question: "Hur lång tid tar Business Central implementering i Sverige?",
 answer: "Business Central implementering tar typiskt 3–6 månader. Mindre företag med standardprocesser kan vara igång på 2–3 månader med ett startpaket. Mer komplexa projekt med många anpassningar, integrationer mot befintliga system eller flera bolag tar 6–12 månader. Microsoft-certifierade partners arbetar enligt Success by Design-metodik för att hålla tidsplan och budget."
 },
 {
 question: "Vilket företag passar Business Central bäst för?",
 answer: "Microsoft Dynamics 365 Business Central är främst avsett för mindre och medelstora företag som behöver samla ekonomi, lager, försäljning, inköp och projekt. Med Premium ingår även tillverkning och servicehantering. Passformen avgörs av processer, komplexitet, integrationer och branschkrav, inte av en absolut gräns för antal användare."
 },
 {
 question: "Vad är skillnaden mellan Business Central Essentials och Premium?",
 answer: "Business Central Essentials ({{price:bc-essentials}}) inkluderar ekonomi, lager, försäljning, inköp och projekthantering. Premium-licensen ({{price:bc-premium}}) lägger till tillverkning (MRP, kapacitetsplanering) och servicehantering (serviceorder, servicekontrakt). De flesta företag börjar med Essentials och uppgraderar vid behov. Team Member ({{price:bc-team-members}}) för användare som bara behöver läsbehörighet eller enkla godkännanden."
 },
 {
 question: "Business Central vs Fortnox – vilket ska jag välja?",
 answer: "Om behovet främst gäller bokföring och fakturering kan ett enklare ekonomisystem räcka. Business Central är värt att undersöka när ekonomi behöver hänga ihop med inköp, lager, projekt eller produktion. Jämför vilka funktioner som ingår i respektive lösning, vilka tillägg som behövs och vad hela införandet och förvaltningen kostar."
 },
 {
 question: "Hur fungerar Business Central med Microsoft 365 och Copilot AI?",
 answer: "Business Central integreras nativt med Outlook, Excel och Teams. Microsoft Copilot är inbyggd utan extra licensavgift och kan automatisera uppgifter, generera produktbeskrivningar, hjälpa med bankavstämning och analysera data. Det är också enkelt att koppla ihop med e-handel (inbyggd Shopify-koppling), Dynamics 365 Sales (CRM) och branschspecifika tillägg från Marketplace."
 },
 {
 question: "Behöver man en partner för att implementera Business Central?",
 answer: "Business Central införs normalt med hjälp av en Microsoft-partner. Jämför dokumenterad erfarenhet av era processer, bransch, projektomfattning och förvaltning. På d365.se kan du filtrera och jämföra Business Central-partners innan du själv väljer vilka du vill kontakta."
 },
 {
 question: "Kan Business Central hantera tillverkning och produktion?",
 answer: "Ja, med Premium-licensen ({{price:bc-premium}}) ingår tillverkning med produktionsorder, MRP (Material Requirements Planning), kapacitetsplanering, versionskontroll och kvalitetsstyrning. Det finns dessutom ett rikt ekosystem av ISV-tillägg i Marketplace för avancerad WMS, batchhantering, maskinintegration (MES) och spårbarhet – vilket gör Business Central konkurrenskraftigt mot specialiserade tillverknings-ERP."
 },
 {
 question: "Passar Business Central för e-handel?",
 answer: "Ja. Business Central har en inbyggd Shopify-koppling från Microsoft som synkar artiklar, priser, lagerstatus, kunder och order mellan webbshoppen och affärssystemet. För andra e-handelsplattformar – till exempel Norce, Litium eller Centra – byggs integrationen via ISV-tillägg eller av partnern. Det vanliga mönstret är att e-handeln sköter kundupplevelsen medan Business Central hanterar orderflöde, lager, priser och bokföring, så att du slipper manuell orderregistrering och dubbla artikelregister."
 },
 {
 question: "Passar Business Central för bygg, entreprenad och installation?",
 answer: "Ja, Business Central används brett i byggbranschen. Grunden i projektmodulen – projektbudget, tidrapportering, inköp mot projekt och periodiserad resultaträkning – täcker mycket av det ett entreprenadbolag behöver. Ovanpå det finns branschspecifika tillägg, till exempel 4PS Construct som är byggt direkt på Business Central, för entreprenadkalkyl, ändrings- och tilläggsarbeten (ÄTA) och serviceärenden. Välj en partner med dokumenterad byggerfarenhet – se vår översikt över partners inom bygg, entreprenad och installation."
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
 useEffect(() => {
  const main = document.getElementById("bc-buyer-journey");
  if (!main) return;
  const onClick = (event: MouseEvent) => {
   const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
   if (!(anchor instanceof HTMLAnchorElement)) return;
   const target = new URL(anchor.href, window.location.origin);
   const path = target.pathname;
   const action = target.hostname === "businesscentral.se" ? "specialist_deep_dive"
    : path.includes("matchningstest") || path.includes("kom-igang") ? "assess"
    : path.includes("roi-kalkylator") || target.hash === "#pricing" ? "cost"
    : path.includes("affarssystem") || path.includes("jamfor/") || target.hash === "#bc-jamforelse" ? "compare"
    : path.includes("kravspecifikation") ? "requirements"
    : path.includes("partners-sverige") ? "partner_discovery"
    : target.hash === "#bc-passform" ? "assess_section" : null;
   if (!action) return;
   trackFunnelEvent({ event_type: "cta_click", event_name: "bc_journey_cta", metadata: { product: "business-central", action, target: path } });
   sendEvent("cta_click", { cta_type: `bc_${action}`, page_type: "product" });
  };
  main.addEventListener("click", onClick);
  const section = document.getElementById("partners");
  const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
   if (!entries.some(entry => entry.isIntersecting)) return;
   trackFunnelEvent({ event_type: "content_view", event_name: "bc_partner_section_view", metadata: { product: "business-central" } });
   observer?.disconnect();
  });
  if (section) observer?.observe(section);
  return () => { main.removeEventListener("click", onClick); observer?.disconnect(); };
 }, []);
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
  usePartnerImpressions("partner_list_impression", bcPartners, { surface: "product-businesscentral" });

 // Get available industries for BC partners
 const bcIndustries = useMemo(() => {
 return getProductIndustries(partners, 'bc', allIndustries);
 }, [partners]);

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
 title="Business Central – pris, funktioner & partners"
 description={resolvePriceTokens("Vad kostar Dynamics 365 Business Central? Licens från {{price:bc-essentials:short}}, projekt från 50 000 kr, funktioner och svenska partners att jämföra.")}
 canonicalPath="/businesscentral"
 keywords="business central erp, business central partners, business central affärssystem, dynamics 365 business central, erp business central, business central pris, business central licens, business central essentials, business central premium, business central partner sverige, business central implementering"
 ogImage="https://d365.se/og-business-central.png"
 ogImageAlt="Dynamics 365 Business Central – köpguide på d365.se"
 />
 <FAQSchema faqs={bcFaqs} />
 <ServiceSchema 
 name="Microsoft Dynamics 365 Business Central"
 description="Molnbaserat ERP-system för mindre och medelstora företag. Inkluderar ekonomi, lager, försäljning, inköp och produktion med inbyggd Microsoft Copilot AI."
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
       name: "Dynamics 365 Business Central – pris, funktioner och partners i Sverige",
       primaryImageOfPage: {
         "@type": "ImageObject",
         "@id": "https://d365.se/businesscentral/#primaryimage",
         url: "https://d365.se/og-business-central.png",
         contentUrl: "https://d365.se/og-business-central.png",
         width: 1200,
         height: 630,
         caption: "Dynamics 365 Business Central – pris, funktioner och partners i Sverige",
       },
       image: {
         "@id": "https://d365.se/businesscentral/#primaryimage",
       },
     }),
   }}
 />
 <Navbar />
 <main id="bc-buyer-journey">

 
 {/* Hero */}
  <ProductHero
  icon={BusinessCentralIcon}
  eyebrow="Business Central"
  title="När passar Microsoft Dynamics 365 Business Central er verksamhet?"
  subhead="Förstå vad Business Central kan lösa, bedöm era behov och jämför alternativen. Här kan ni räkna på kostnaden och hitta partners med relevant erfarenhet, i den ordning som passar ert beslut."
  primary={{ label: "Passar Business Central oss?", href: "#bc-passform" }}
  secondary={{ label: "Se pris och kostnad", href: "#pricing" }}
  tertiary={{ label: "Jämför Business Central med andra affärssystem", href: "#bc-jamforelse" }}
    />
  <ShortAnswer title="Vad är Dynamics 365 Business Central?">
 <p><strong>Dynamics{"\u00A0"}365 Business Central är Microsofts molnbaserade ERP-system (affärssystem) för mindre och medelstora företag</strong> som vill samla ekonomi, inköp, lager, försäljning och produktion i en plattform – i stället för att hålla ihop en flora av separata system som inte pratar med varandra.</p>
 <p>Essentials täcker ekonomi, inköp, lager, försäljning och projekt. Premium lägger till tillverkning och servicehantering. Branschkrav kan kräva tillägg från Microsoft Marketplace. Kontrollera vad som ingår i standard och vad som behöver kompletteras innan ni väljer partner.</p>
 </ShortAnswer>
  <EditorialAssessment assessment="bc" />

      <BcSiteHandoff />
      <SystemvalHandoffNote page="bc" />
      <BcDecisionGuide />
 {/* Pricing Section */}
 <section id="pricing" className="scroll-mt-24 py-8 sm:py-12 md:py-16 bg-background">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="text-center mb-10 sm:mb-12 md:mb-16">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
 Vad kostar Business Central?
 </h2>
 <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
 Licenser: Essentials eller Premium, kompletterat med Team Member för begränsade behov.
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
 <p className="text-center mt-4 text-muted-foreground">
 Vad kostar Microsoft{"\u00A0"}Dynamics{"\u00A0"}365 utöver Business Central, till exempel Finance & Supply Chain Management eller CRM?{" "}
 <Link to="/priser/" className="font-medium text-primary hover:underline">Se priser och licenser för Dynamics{"\u00A0"}365</Link>
 </p>
 </div>
 </section>

      <CostBreakdown product="business-central" heading="Vad kostar införande och förvaltning?" />
      <section className="bg-background pb-8 sm:pb-12">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <p className="mb-4 max-w-3xl text-sm text-muted-foreground">Skilj på licenser, införande, tillägg och anpassningar, integrationer samt löpande förvaltning. Kalkylen är en uppskattning utifrån era antaganden, inte en offert.</p>
          <Button asChild className="h-auto min-h-11 whitespace-normal"><Link to="/businesscentral/roi-kalkylator/">Beräkna kostnaden <ArrowRight aria-hidden className="h-4 w-4 shrink-0" /></Link></Button>
        </div>
      </section>



  {/* Bransch- och användningsfall – svarar på vanliga sökintentioner (e-handel, bygg) */}
  <section className="py-10 sm:py-12 bg-background">
   <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
     När passar Business Central i er verksamhet?
    </h2>
    <p className="text-muted-foreground mb-8 text-sm sm:text-base">
     Två av de vanligaste användningsområdena på den svenska marknaden – och vad som krävs utöver standard.
    </p>

    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
     Business Central och e-handel
    </h3>
    <p className="text-muted-foreground mb-3 text-sm sm:text-base leading-relaxed">
     Business Central har en inbyggd koppling till Shopify från Microsoft som synkar artiklar, priser,
     lagerstatus, kunder och order mellan webbshoppen och affärssystemet. Säljer du via en annan
     e-handelsplattform – till exempel Norce, Litium eller Centra – byggs integrationen via ISV-tillägg
     från Microsoft Marketplace eller av partnern. Det vanliga mönstret är att e-handeln sköter
     kundupplevelsen medan Business Central hanterar orderflöde, lager, prissättning och bokföring, så
     att du slipper manuell orderregistrering och dubbla artikelregister.
    </p>
    <p className="text-muted-foreground mb-8 text-sm sm:text-base leading-relaxed">
     För bolag med både e-handel och fysisk försäljning blir lager- och prissynkroniseringen avgörande –
     fråga partnern om dokumenterad erfarenhet av just din plattform innan du bestämmer dig.
    </p>

    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
     Business Central för bygg, entreprenad och installation
    </h3>
    <p className="text-muted-foreground mb-3 text-sm sm:text-base leading-relaxed">
     Business Central är ett av de mest använda Microsoft-baserade affärssystemen i svensk byggbransch.
     Projektmodulen i standard täcker projektbudget, tidrapportering, inköp mot projekt och uppföljning
     per projekt. För entreprenadspecifika behov – kalkyl, ändrings- och tilläggsarbeten (ÄTA),
     serviceärenden och anläggningshantering – finns branschbyggda tillägg, till exempel 4PS Construct
     som är byggt direkt på Business Central.
    </p>
    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
     Branschkännedomen hos partnern avgör hur väl systemet speglar dina processer. Se{" "}
     <Link to="/branscher/bygg-entreprenad/" className="text-primary underline underline-offset-2">
      Dynamics 365-partners inom bygg, entreprenad och installation
     </Link>{" "}
     och jämför deras kundexempel innan du tar kontakt.
    </p>
   </div>
  </section>

   {/* FAQ Section – rendered from bcFaqs so visible content matches FAQSchema JSON-LD exactly */}
  <section className="py-8 sm:py-12 md:py-16 bg-secondary/50">
  <div className="container mx-auto px-4 sm:px-6">
  <div className="max-w-4xl mx-auto">
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
  Vanliga frågor om Dynamics 365 Business Central
  </h2>
  <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
  {bcFaqs.map((faq, idx) => (
  <AccordionItem key={idx} value={`faq-${idx}`} className="bg-card rounded-lg px-4 sm:px-6 border border-border">
  <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
  {nowrapBrand(faq.question)}
  </AccordionTrigger>
  <AccordionContent className="text-muted-foreground pb-6">
  <p style={{ whiteSpace: "pre-wrap" }} className="leading-relaxed">{nowrapBrand(faq.answer)}</p>
  </AccordionContent>
  </AccordionItem>
  ))}
  </Accordion>
  </div>
  </div>
  </section>





      <ProductIsvSection product="Business Central" />

      <section id="branschlosningar-jamfor" aria-labelledby="bransch-jamfor-rubrik" className="scroll-mt-28 py-10 sm:py-14">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="bransch-jamfor-rubrik" className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Hur jämför du branschspecifika ERP-lösningar i <span className="whitespace-nowrap">Dynamics 365</span>?</h2>
          <p className="text-[15px] sm:text-base leading-relaxed text-muted-foreground max-w-4xl">När standardfunktionaliteten i ett affärssystem inte räcker till behöver du utvärdera branschspecifika anpassningar och Microsoft-appar från AppSource (ISV-lösningar). Så gör du en strukturerad jämförelse:</p>
          <ol className="mt-5 max-w-4xl list-decimal space-y-3 pl-6 text-[15px] sm:text-base leading-relaxed text-muted-foreground marker:font-semibold marker:text-foreground">
            <li className="pl-1"><strong className="font-semibold text-foreground">Kartlägg kärnprocesserna:</strong> Identifiera vilka unika processer din bransch kräver (t.ex. spårbarhet/bäst-före i livsmedel, projektstyrning för konsulter eller avancerad lagerstyrning för grossister).</li>
            <li className="pl-1"><strong className="font-semibold text-foreground">Välj rätt grundplattform:</strong> Säkerställ om behoven bäst möts av Business Central (små till medelstora bolag) eller Finance & Supply Chain Management (större globala koncerner).</li>
            <li className="pl-1"><strong className="font-semibold text-foreground">Utvärdera färdiga branschpaket vs. egna anpassningar:</strong> Granska Microsoft AppSource och partners färdigpaketerade branschlösningar. Färdiga appar minimerar framtida uppgraderingsrisker.</li>
            <li className="pl-1"><strong className="font-semibold text-foreground">Välj en partner med dokumenterad branscherfarenhet:</strong> Det är partnerns verksamhetskunskap som avgör om lösningen skapar verklig affärsnytta.</li>
          </ol>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-8">
            <Link to="/branscher/" className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"><span>Utforska lösningar för olika branscher</span><ArrowRight aria-hidden className="h-4 w-4" /></Link>
            <Link to="/partners-per-bransch/" className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"><span>Hitta partners med expertis inom din bransch</span><ArrowRight aria-hidden className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="scroll-mt-24 py-8 sm:py-12 md:py-16 bg-secondary/50">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="text-center mb-8 sm:mb-10 md:mb-12">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
 Hitta rätt Business Central-partner
 </h2>
 <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto">
 Jämför erfarenhet av era processer, branschkompetens, införandemetod och support efter driftstart. Be om kundreferenser med liknande omfattning och kontrollera vilka tillägg och integrationer partnern föreslår, och varför.
 </p>
 <div className="mt-5"><Button asChild variant="outline" className="h-auto min-h-11 whitespace-normal"><Link to="/business-central-partners-sverige/">Hitta Business Central-partner <ArrowRight aria-hidden className="h-4 w-4 shrink-0" /></Link></Button></div>
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
  title="Var behöver du leverans och support? (Sverige, Norden, Europa, Globalt)"
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

 {/* Resultathuvud */}
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

 <WhyTheseResults agreementPriority criteria={["Business Central", selectedIndustry, selectedGeography]} className="mb-6" />
 {bcPartners.length === 0 ? (
 <div className="text-center py-6">
 <h3 className="text-lg font-semibold text-foreground mb-2">Inga partner listas med denna filtrering?</h3>
 <p className="text-muted-foreground">
 Ingen fara, kontakta oss så hjälper vi dig att hitta en eller ett par partners som passar för din verksamhet.
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {bcPartners.map((partner, index) => {
 const basePath = buildPartnerProductPath(partner.slug, "Business Central");
 const params = new URLSearchParams();
 if (selectedIndustry) params.set("industry", selectedIndustry);
 if (selectedGeography) params.set("geography", selectedGeography);
 if (selectedCompanySize) params.set("companySize", selectedCompanySize);
 if (selectedRevenue) params.set("revenue", selectedRevenue);
 const qs = params.toString();
 const profileUrl = qs ? `${basePath}?${qs}` : basePath;

 return (
 <IndustryVerifiedPartnerCard
 key={index}
 partner={partner}
 profileUrl={profileUrl}
 productKey="bc"
 productLabel="Business Central"
 industry={selectedIndustry}
 geography={selectedGeography}
 companySize={selectedCompanySize}
 revenue={selectedRevenue}
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
  industry={selectedIndustry || null}
  />

 {/* Lead CTA - shows when partners are filtered */}
 {selectedIndustry && (
 <div className="max-w-xl mx-auto mt-12">
 <article className="relative rounded overflow-hidden ">
 <div className="absolute inset-0 bg-gradient-to-br from-[hsl(210_20%_12%)] via-[hsl(210_18%_16%)] to-[hsl(210_20%_12%)]" />
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/25 via-transparent to-transparent" />
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
 Det här var ett första steg i rätt riktning. Låt oss hjälpa dig vidare, helt kostnadsfritt.
 </p>
 </div>
 </div>

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

      <RelevantVideosSection productGroups={["business-central"]} title="Videor om Business Central" />
      <AiExamplesEntry apps={["bc"]} label="Se konkreta AI-exempel för Business Central" source="businesscentral" />
      {/* Sekundärt: relaterat från Partnernytt, långt ned på sidan. */}
      <AktuelltContextSection placement="businessCentral" heading="Aktuellt inom Business Central" />
      <ProductPartnerNewsSection productArea="business-central" heading="Relaterat om Business Central" />
      <RelatedPages pages={bcRelatedPages.map(page => ({ ...page, description: page.description.replace(/Dynamics 365/g, "Dynamics\u00a0365"), href: page.href === "/affarssystem/" ? "/affarssystem/#comparison" : page.href === "/valjdynamics365partner/" ? "/business-central-partners-sverige/" : page.href }))} heading="Fördjupning om produktval, kostnad och partner" />
      <BcOptionalDeepDive />
      <BcNextSteps />
      </main>
 <BasicProfilesDirectory products={["bc"]} />
      <PartnerSwitchCta />
      <SourcesAndMethod variant="product" />
      <EditorialSource sourceType="Köpguide" />
 <Footer />
 </div>
 );
};

export default BusinessCentral;
