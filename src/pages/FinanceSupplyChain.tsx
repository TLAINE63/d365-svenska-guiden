import SystemvalHandoffNote from "@/components/SystemvalHandoffNote";
import PartnerSwitchCta from "@/components/PartnerSwitchCta";
import AiExamplesEntry from "@/components/ai-examples/AiExamplesEntry";
import ProductNextSteps from "@/components/product/ProductNextSteps";
import FscmDecisionGuide from "@/components/product/FscmDecisionGuide";
import BasicProfilesDirectory from "@/components/BasicProfilesDirectory";
import SourcesAndMethod from "@/components/SourcesAndMethod";
import WhyTheseResults from "@/components/WhyTheseResults";
import EditorialAssessment from "@/components/EditorialAssessment";
import SearchResultSummary from "@/components/partner/SearchResultSummary";
import ProductIsvSection from "@/components/ProductIsvSection";
import ProductDeepDiveLink from "@/components/ProductDeepDiveLink";
import RelevantVideosSection from "@/components/RelevantVideosSection";
import { useIndustryDeepLink } from "@/hooks/useIndustryDeepLink";
import ProductHero from "@/components/ProductHero";
import RelatedPages, { fscRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import PricingCard from "@/components/PricingCard";
import Navbar from "@/components/Navbar";
import ShortAnswer from "@/components/ShortAnswer";
import FactBox from "@/components/FactBox";
import { fscmSources } from "@/lib/guideSources";
import Footer from "@/components/Footer";
import ProductPartnerNewsSection from "@/components/ProductPartnerNewsSection";
import AktuelltContextSection from "@/components/aktuellt/AktuelltContextSection";
import UnprofiledPartnersList from "@/components/UnprofiledPartnersList";
import { ArrowLeft, ArrowRight, ExternalLink, FileText } from "lucide-react";
import { FilterButtons } from "@/components/FilterButtons";
import { SizeFilters } from "@/components/SizeFilters";
import LeadCTA from "@/components/LeadCTA";
import IndustryVerifiedPartnerCard from "@/components/partner/IndustryVerifiedPartnerCard";
import BuyerManual from "@/components/BuyerManual";
import CostBreakdown from "@/components/CostBreakdown";
import ComparisonQuickLinks from "@/components/ComparisonQuickLinks";
import ProductRoiCta from "@/components/ProductRoiCta";

import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import FinanceIcon from "@/assets/icons/Finance.svg";
import SupplyChainIcon from "@/assets/icons/SupplyChain.svg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { allIndustries } from "@/data/partners";
import { usePartners } from "@/hooks/usePartners";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";
import { filterAndSortPartners, getProductIndustries } from "@/hooks/usePartnerFilters";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, ServiceSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { buildPartnerProductPath } from "@/lib/partnerProductSlug";

// Breadcrumb items
const fscBreadcrumbs = [
 { name: "Hem", url: "https://d365.se" },
 { name: "Affärssystem (ERP)", url: "https://d365.se/affarssystem/" },
 { name: "Finance & Supply Chain", url: "https://d365.se/finance-supply-chain" },
];
import {
 Accordion,
 AccordionContent,
 AccordionItem,
 AccordionTrigger,
} from "@/components/ui/accordion";
import { usePartnerImpressions } from "@/hooks/usePartnerImpressions";
import EditorialSource from "@/components/EditorialSource";

// Finance & Supply Chain FAQs for schema
const fscFaqs = [
 { question: "Vad kostar Dynamics 365 Finance och Supply Chain Management?", answer: "Dynamics 365 Finance kostar 2 007,30 kr per användare och månad. Supply Chain Management kostar lika mycket – 2 007,30 kr per användare/mån. Human Resources kostar 1 290,40 kr/mån. Implementeringskostnader varierar med komplexitet, antal juridiska entiteter och anpassningsbehov: ett litet projekt ligger på 2–6 miljoner kronor, ett medelstort på 6–15 miljoner och ett stort på från 15 miljoner kronor." },
 { question: "Dynamics 365 Finance & Supply Chain Management (F&O) vs SAP S/4HANA – vilket ERP ska jag välja?", answer: "Det beror på er processkarta, ert befintliga ekosystem och tillgången på partners i er bransch. Båda är enterprise-ERP för komplexa organisationer. F&SCM ligger nära Microsoft 365, Power Platform och Azure, vilket kan förenkla integration för organisationer som redan använder dem. SAP S/4HANA har en stark position i bland annat tung processindustri. Jämför licens, införande och partnerkapacitet för just ert scope innan ni väljer." },
 { question: "Vad är skillnaden mellan Dynamics 365 Finance & Supply Chain Management (F&O) och Business Central?", answer: "Business Central riktar sig till SMB-segmentet (upp till ca 300 användare) med fokus på enkelhet och lägre pris (från 765 kr/mån). Finance & Supply Chain Management (F&O) är enterprise-lösningen för komplexa globala organisationer med flera juridiska entiteter, avancerad tillverkning och supply chain. F&SCM har betydligt djupare funktionalitet inom ekonomi, lagerstyrning (WMS), produktionsplanering (MRP/MPS) och global compliance." },
 { question: "Hur lång tid tar det att implementera Dynamics 365 Finance & Supply Chain Management (F&O)?", answer: "En typisk F&SCM-implementation tar 9–24 månader beroende på komplexitet. En Dynamics 365 Finance-only-implementation för en juridisk entitet kan göras på 6–9 månader. Komplett Finance + SCM med tillverkning och WMS för en global organisation tar 18–36 månader. Vi rekommenderar alltid en fasad implementation för att minimera risker och leverera värde snabbt." },
 { question: "Vilka branscher passar Dynamics 365 Finance & Supply Chain Management (F&O) bäst för?", answer: "F&SCM är optimalt för: tillverkning (diskret och processindustri), grossist och distribution, läkemedel och life science, livsmedel och dryck, detaljhandel med komplex supply chain, offentlig sektor och statliga organisationer samt internationella koncerner med flera bolag och valutor. Lösningen har inbyggd branschfunktionalitet och ett rikt ekosystem av ISV-tillägg." },
 { question: "Hur fungerar Copilot AI i Dynamics 365 Finance & Supply Chain Management (F&O)?", answer: "Copilot hjälper användare att sammanfatta, söka och agera på data direkt i Finance och Supply Chain Management, till exempel i inköp, leverantörshantering och ekonomiska avvikelser. Vilka funktioner som ingår och om de kräver extra licens eller kapacitet styrs av Microsofts aktuella villkor, så kontrollera det för ert scope." },
 { question: "Hur flexibelt och anpassningsbart är Dynamics 365 Finance & Supply Chain Management?", answer: "F&SCM är mycket flexibelt och anpassas via tre nivåer: (1) Konfiguration via parameterinställningar utan kod, (2) Utökning via Power Platform och low-code, (3) Specialutveckling i X++ för komplexa anpassningar. Det finns ett rikt ISV-ekosystem med hundratals branschlösningar på Microsoft Marketplace. Alla anpassningar separeras från kärnkoden för enklare uppgradering." },
 { question: "Kan Dynamics 365 Finance & Supply Chain Management integreras med befintliga system och tredjepartsprogram?", answer: "Ja, F&SCM har robusta integrationsmöjligheter via OData-API:er, Azure Service Bus, Logic Apps och Power Automate. Färdiga kopplingar finns för populära system som Salesforce, Shopify, Amazon och EDI-nätverk. Integration med produktionssystem (MES, SCADA), WMS-system, 3PL-providers och bankgiro/autogiro är välbeprövade scenarier." },
];

// Geography filter options
const geographyFilters = [
 { label: "Sverige", value: "Sverige" },
 { label: "Norden", value: "Norden" },
 { label: "Europa", value: "Europa" },
 { label: "Globalt", value: "Globalt" }
];

const FinanceSupplyChain = () => {
 const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
 const [selectedGeography, setSelectedGeography] = useState<string | null>(null);
 const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(null);
 const [selectedRevenue, setSelectedRevenue] = useState<string | null>(null);

 // Aktiva filter följer med till jämförelsesidan
 const { setFilterContext: setCompareFilters } = usePartnerCompare();
 useEffect(() => {
  setCompareFilters({
   product: "fsc",
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


 // Filter partners for Finance & Supply Chain
 const fscPartners = useMemo(() => {
 return filterAndSortPartners(
 partners, 
 'fsc', 
 selectedIndustry, 
 selectedGeography, 
 selectedCompanySize,
 null, // regions
 true,
 selectedRevenue
 );
 }, [partners, selectedIndustry, selectedGeography, selectedCompanySize, selectedRevenue]);
  usePartnerImpressions("partner_list_impression", fscPartners, { surface: "product-finance-scm" });

 // Get available industries for FSC partners
 const fscIndustries = useMemo(() => {
 return getProductIndustries(partners, 'fsc', allIndustries);
 }, [partners]);



 const fscPricingPlans = [
 {
 title: "Dynamics 365 Finance",
 description: "Avancerad finansiell hantering",
 price: "2 007,30 kr",
 features: [
 "Global finansiell hantering",
 "Bokföring och rapportering",
 "Budgetering",
 "Kredithantering",
 "Fler valutor och juridiska entiteter",
 ],
 },
 {
 title: "Supply Chain Management",
 description: "Komplett supply chain-lösning",
 price: "2 007,30 kr",
 features: [
 "Lagerhantering",
 "Produktionsplanering",
 "Inköp och leverantörshantering",
 "Lagerstyrning",
 "Transport management",
 ],
 },
 {
 title: "Dynamics 365 Human Resources",
 description: "Förbättra organisatorisk smidighet, optimera HR-program och omvandla medarbetarupplevelser",
 price: "1 290,40 kr",
 features: [
 "Medarbetarhantering",
 "Rekrytering och onboarding",
 "Prestationshantering",
 "Förmånsadministration",
 "Självbetjäningsportal",
 ],
 },
 ];

 return (
 <div className="min-h-screen">
 <SEOHead 
 title="Finance & Supply Chain (F&O) – pris & partners"
 description="Dynamics 365 Finance & Supply Chain Management för tillverkning, lager och global ekonomi: pris från 2 007 kr/mån, projektspann och svenska partners."
 canonicalPath="/finance-supply-chain"
 keywords="Dynamics 365 Finance pris, Supply Chain Management Microsoft, SAP alternativ ERP, Dynamics 365 Finance SCM, enterprise ERP Sverige, ERP tillverkning, global ekonomihantering, Dynamics 365 vs SAP, supply chain system Microsoft, ERP grossist distribution"
 ogImage="https://d365.se/og-finance-scm.png"
 ogImageAlt="Dynamics 365 Finance & Supply Chain Management – köpguide på d365.se"
 />
 <FAQSchema faqs={fscFaqs} />
 <ServiceSchema 
 name="Microsoft Dynamics 365 Finance & Supply Chain Management – Enterprise ERP"
 description="Enterprise ERP-lösning för global ekonomihantering, supply chain, tillverkning och distribution. Licenspris från 2 007,30 kr per användare och månad. SAP-alternativ med inbyggd Copilot AI. Implementationstid 9–36 månader beroende på komplexitet. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
 />
 <BreadcrumbSchema items={fscBreadcrumbs} />
 <Navbar />
 <main>
 
  {/* Header */}
  <ProductHero
  icon={FinanceIcon}
  eyebrow="Finance & Supply Chain Management"
        title="När passar Finance & Supply Chain Management (F&O)?"
  subhead="Microsoft levererar en kraftfull Enterpriseplattform. Partnern skapar branschmodellen, integrationerna mot dina befintliga system och den förändringsledning som faktiskt ger användarnytta. Det är där F&SCM-projekt blir framgångsrika - eller missar målet. Här jämför du partners som levererat F&SCM i din bransch."
  primary={{
    label: "1. Matcha produkt: gör matchningstestet",
    to: "/finance-supply-chain-management/matchningstest/",
  }}
  secondary={{ label: "2. Bygg beslutsunderlag: TCO/ROI-kalkyl", to: "/finance-supply-chain/roi-kalkylator/", icon: FileText }}
  tertiary={{
    label: "3. Matcha partner: jämför F&SCM-partners",
    to: "/finance-supply-chain-partners-sverige/",
  }}
  />
  <ShortAnswer>
 <p>Dynamics 365 Finance & Supply Chain Management är Microsofts affärssystem för större och internationella organisationer. Det passar när ni har avancerad ekonomi, flera bolag och valutor, tillverkning eller komplex logistik.</p>
 <p>Mindre organisationer med enklare processer klarar sig ofta med Business Central. Skillnaden ligger i komplexitet, inte bara i antal användare.</p>
 </ShortAnswer>
  <FactBox
   title="Snabbfakta om Finance & Supply Chain Management"
   facts={[
    { label: "Vad det är", value: "Microsofts enterprise-ERP för ekonomi, supply chain, tillverkning och lager." },
    { label: "Licenspris (lista)", value: "Finance och Supply Chain Management: 2\u00A0007,30\u00A0kr per användare och månad vardera." },
    { label: "Typiskt projekt", value: "Litet 2–6 MSEK, medelstort 6–15 MSEK, stort från 15 MSEK (d365.se:s bedömning)." },
    { label: "Typisk införandetid", value: "9–24 månader. Finance för ett bolag kan gå på 6–9 månader (d365.se:s bedömning)." },
    { label: "Passar för", value: "Flera juridiska bolag, flera valutor, tillverkning, avancerat lager (WMS) och hög regelefterlevnad." },
    { label: "Passar mindre bra för", value: "Små bolag med enkla processer och begränsad budget. Jämför då med Business Central." },
    { label: "Vanliga tillägg", value: "Commerce, Human Resources och Project Operations på samma plattform." },
    { label: "Alternativ att jämföra", value: <><Link to="/affarssystem/#comparison" className="text-primary underline underline-offset-4">Business Central</Link>, <Link to="/jamfor/fscm-vs-sap-s4hana/" className="text-primary underline underline-offset-4">SAP S/4HANA</Link>, <Link to="/jamfor/fscm-vs-infor-m3/" className="text-primary underline underline-offset-4">Infor M3</Link></> },
   ]}
   note="Priser enligt Microsofts listpris. Projektkostnad och tid är d365.se:s redaktionella spann, inte Microsoft-uppgifter. Källor längst ned på sidan."
  />
  <EditorialAssessment assessment="fscm" />
  <SystemvalHandoffNote page="fscm" />
  <FscmDecisionGuide />

 {/* FAQ Section */}
 <section className="py-8 sm:py-12 md:py-16 bg-secondary/50">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="max-w-4xl mx-auto">
 <div className="text-center mb-8 sm:mb-10 md:mb-12">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
 Vanliga frågor om Finance & Supply Chain Management (F&O)
 </h2>
 </div>
 
 <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
 <AccordionItem value="item-1" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 <span className="flex items-start gap-3">
 <span className="text-2xl">❓</span>
 <span>Vad är skillnaden mellan Dynamics 365 Finance & Supply Chain Management och andra ERP-system?</span>
 </span>
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 pl-11 space-y-3">
 <p>Dynamics 365 Finance & Supply Chain Management skiljer sig genom sin skalbarhet för globala organisationer, djupgående integration med Microsoft-ekosystemet, kraftfulla AI- och maskininlärningsfunktioner för prediktiv analys, samt branschspecifika applikationer för tillverkning, detaljhandel och distribution. Systemet erbjuder också omfattande compliance-stöd för olika regioner och branscher.</p>
 <p className="text-sm">
 <strong className="text-foreground">Se publicerade jämförelser:</strong>{" "}
 <Link to="/jamfor/fscm-vs-sap-s4hana/" className="text-primary hover:underline font-medium">F&SCM vs SAP S/4HANA</Link>
 {" · "}
 <Link to="/jamfor/fscm-vs-infor-m3/" className="text-primary hover:underline font-medium">F&SCM vs Infor M3</Link>
 {" · "}
 <Link to="/jamfor/" className="text-primary hover:underline font-medium">Alla jämförelser</Link>
 </p>
 </AccordionContent>
 </AccordionItem>
 
 <AccordionItem value="item-2" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 <span className="flex items-start gap-3">
 <span className="text-2xl">❓</span>
 <span>Hur mycket kostar Dynamics 365 Finance & Supply Chain Management – och vad påverkar priset?</span>
 </span>
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 pl-11">
 Licenspriser börjar från 2 007,30 kr/månad för Finance och 2 007,30 kr/månad för Supply Chain Management. Totalkostnaden påverkas av antal användare, vilka applikationer du behöver, omfattning av anpassningar, integration med befintliga system samt implementeringstid. Implementeringskostnaderna varierar med komplexiteten: ett litet projekt ligger på 2–6 miljoner kronor, ett medelstort på 6–15 miljoner och ett stort på från 15 miljoner kronor.{" "}
 <Link to="/priser/#finance-supply-chain" className="font-medium text-primary hover:underline">Se priser och licenser för Dynamics{"\u00A0"}365</Link>
 </AccordionContent>
 </AccordionItem>
 
 <AccordionItem value="item-3" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 <span className="flex items-start gap-3">
 <span className="text-2xl">❓</span>
 <span>Hur lång tid tar det att implementera F&SCM – och hur ser processen ut?</span>
 </span>
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 pl-11">
 En typisk F&SCM-implementering tar 9-24 månader beroende på omfattning och komplexitet. Processen följer vanligtvis följande faser: (1) Analys och planering, (2) Design och konfiguration, (3) Datamigrering, (4) Testning och validering, (5) Utbildning, (6) Go-live och (7) Stabilisering. Kan en fasad implementering, där du rullar ut funktionaliteten stegvis för att minimera risker, vara en variant för dig?
 </AccordionContent>
 </AccordionItem>
 
 <AccordionItem value="item-4" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 <span className="flex items-start gap-3">
 <span className="text-2xl">❓</span>
 <span>Hur flexibelt och anpassningsbart är F&SCM för vår verksamhet?</span>
 </span>
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 pl-11">
 F&SCM är mycket flexibelt och kan anpassas till komplexa affärsprocesser och branschspecifika krav. Systemet stödjer omfattande konfiguration via Power Platform, samt utveckling av specialanpassningar när det behövs. Det finns också ett rikt ekosystem av ISV-lösningar (Independent Software Vendors) för specifika branscher som tillverkning, detaljhandel, läkemedel och livsmedel.
 </AccordionContent>
 </AccordionItem>
 
 <AccordionItem value="item-5" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 <span className="flex items-start gap-3">
 <span className="text-2xl">❓</span>
 <span>Hur fungerar F&SCM med andra Microsoft-lösningar och tredjepartssystem?</span>
 </span>
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 pl-11">
 F&SCM integreras sömlöst med hela Microsoft-ekosystemet inklusive Microsoft 365, Teams, Power BI och Azure. Systemet har robusta API:er och stöd för integration med tredjepartssystem som CRM-lösningar, e-handelsplattformar, WMS-system, MES-system och IoT-enheter. Integration kan ske via Azure Logic Apps, Power Automate eller direktintegrationer via standardprotokoll.
 </AccordionContent>
 </AccordionItem>
 
 <AccordionItem value="item-6" className="bg-card rounded-lg px-4 sm:px-6 border border-border ">
 <AccordionTrigger className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground hover:no-underline py-4 sm:py-6">
 <span className="flex items-start gap-3">
 <span className="text-2xl">❓</span>
 <span>Vilken partner borde passa vår verksamhet bäst?</span>
 </span>
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground pb-6 pl-11">
 Rätt partner beror på din bransch, företagsstorlek och specifika behov. För F&SCM-implementeringar rekommenderar vi partners med erfarenhet av komplexa, globala projekt och som har relevant branschexpertis. På vår <a href="/valjdynamics365partner/" className="text-finance-supply hover:underline font-medium">partnerkatalog</a> kan du filtrera på bransch, företagsstorlek och applikationer för att hitta partners som matchar dina krav. Du kan också använda vårt verktyg för att få personliga partnerrekommendationer.
 </AccordionContent>
 </AccordionItem>
 </Accordion>
 </div>
 </div>
 </section>







 {/* AI & Agents Section for Finance & Supply Chain */}
 <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="max-w-5xl mx-auto">
 <div className="text-center mb-8 sm:mb-10">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
 AI & Agenter för Finance & Supply Chain Management (F&O)
 </h2>
 <p className="text-lg text-muted-foreground">
 Enterprise AI för komplex finans- och supply chain-hantering
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
 <h3 className="text-xl font-bold text-card-foreground mb-2">Copilot för Finance & Supply Chain Management (F&O)</h3>
 <p className="text-muted-foreground mb-4">
 AI-assistent för ekonomi, leveranskedja och produktion
 </p>
 </div>
 </div>
 <div className="grid sm:grid-cols-2 gap-4 text-sm">
 <div>
 <ul className="space-y-2 text-muted-foreground">
 <li>• Avancerad ekonomisk analys och prognoser</li>
 <li>• Identifierar avvikelser i transaktioner</li>
 <li>• Supply chain-insikter och rekommendationer</li>
 <li>• Prediktiva underhållsförslag</li>
 </ul>
 </div>
 <div>
 <ul className="space-y-2 text-muted-foreground">
 <li>• Genererar budgetförslag</li>
 <li>• Analyserar leverantörsprestanda</li>
 <li>• Optimerar produktionsscheman</li>
 <li>• Förutsäger kassaflöde</li>
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
 <h3 className="text-xl font-bold text-foreground mb-2">Agenter för Finance & Supply Chain Management (F&O)</h3>
 <p className="text-muted-foreground mb-4">
 Autonoma AI-system för enterprise-processer
 </p>
 </div>
 </div>
 <div className="space-y-4">
 <div className="bg-card/50 rounded-lg p-4">
 <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
 <span>💰</span> Treasury Management Agent
 </h4>
 <p className="text-sm text-muted-foreground">
 Övervakar kassaflöde globalt i realtid, optimerar likviditet mellan juridiska enheter, 
 hanterar valutaexponering automatiskt och placerar överskottslikvid enligt policy
 </p>
 </div>
 <div className="bg-card/50 rounded-lg p-4">
 <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
 <span>📊</span> Financial Planning Agent
 </h4>
 <p className="text-sm text-muted-foreground">
 Skapar rullande prognoser automatiskt, identifierar trender och avvikelser, 
 distribuerar budgetar mellan kostnadsställen och varnar för budgetöverskridanden proaktivt
 </p>
 </div>
 <div className="bg-card/50 rounded-lg p-4">
 <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
 <span>📦</span> Supply Chain Orchestration Agent
 </h4>
 <p className="text-sm text-muted-foreground">
 Optimerar hela leveranskedjan från råmaterial till slutkund, hanterar störningar proaktivt, 
 omdirigerar transporter automatiskt och balanserar lager mellan platser baserat på efterfrågan
 </p>
 </div>
 <div className="bg-card/50 rounded-lg p-4">
 <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
 <span>🏭</span> Production Optimization Agent
 </h4>
 <p className="text-sm text-muted-foreground">
 Schemalägger produktion för maximal effektivitet, justerar planer baserat på orderändringar och kapacitet, 
 koordinerar med leverantörer för just-in-time leverans och minimerar stillestånd
 </p>
 </div>
 <div className="bg-card/50 rounded-lg p-4">
 <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
 <span>🤝</span> Vendor Management Agent
 </h4>
 <p className="text-sm text-muted-foreground">
 Utvärderar leverantörsprestanda kontinuerligt, förhandlar priser och villkor automatiskt enligt ramar, 
 diversifierar leverantörsbas för riskreducering och identifierar alternativa källor proaktivt
 </p>
 </div>
 <div className="bg-card/50 rounded-lg p-4">
 <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
 <span>🔧</span> Predictive Maintenance Agent
 </h4>
 <p className="text-sm text-muted-foreground">
 Analyserar IoT-data från maskiner för att förutsäga fel, schemalägger underhåll vid optimal tidpunkt, 
 beställer reservdelar automatiskt och minimerar oplanerade produktionsstopp
 </p>
 </div>
 </div>
 </div>
 </div>

 <div className="mt-8 text-center">
 <Button asChild size="lg" variant="outline">
 <Link to="/agents/">
 Utforska Agenter för Enterprise
 <span className="ml-2">→</span>
 </Link>
 </Button>
 </div>
 </div>
 </div>
 </section>


 {/* Pricing Section */}
 <section id="pricing" className="py-10 bg-background">
 <div className="container mx-auto px-4">
 <div className="text-center mb-16">
 <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
 Licenspriser för Finance & Supply Chain Management (F&O)
 </h2>
 <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
 Priser per användare och månad
 </p>
 </div>
 <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
 {fscPricingPlans.map((plan, index) => (
 <PricingCard key={index} {...plan} />
 ))}
 </div>
 <p className="text-sm italic text-muted-foreground text-center mt-8 max-w-4xl mx-auto">
 Observera: Priserna ovan är exempelpriser baserade på Microsofts offentliga prislista vid tidpunkten för sammanställningen. För exakta och aktuella priser, inklusive eventuella rabatter eller volymavtal, rekommenderas att en offert tas fram i samråd med en auktoriserad Microsoft-partner eller direkt via Microsoft.
 </p>
 </div>
 </section>


      <BuyerManual product="finance-scm" />
      <CostBreakdown product="finance-scm" />
      <ComparisonQuickLinks productKeys="fscm" />

      <ProductRoiCta productKey="finance-scm" />

      <ProductDeepDiveLink product="Finance & Supply Chain" label="Finance & Supply Chain Management" />
      <RelevantVideosSection productGroups={["finance-scm"]} title="Videor om Finance & Supply Chain Management (F&O)" />



      <ProductIsvSection
        product="Finance & Supply Chain Management"
        limit={4}
        reviewedFscmSelection
        title="Vilka tillägg kan vara värda att undersöka?"
        description="Börja med vad standardfunktionerna täcker. Här är fyra befintliga kataloglösningar med kontrollerat stöd för Finance eller Supply Chain Management, för olika behov. Kontrollera version, integrationsansvar och kostnad med leverantören innan ni väljer."
      />

      {/* Partners Section */}
      <section id="partners" className="scroll-mt-24 py-8 sm:py-12 md:py-16 bg-background">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="text-center mb-8 sm:mb-10 md:mb-12">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
 Finance & Supply Chain Management (F&O)-partners
 </h2>
 <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto">
 Här är ett urval av partners som arbetar med Dynamics 365 Finance & Supply Chain Management (F&O) i Sverige. Välj vilken bransch du tillhör och din företagsstorlek (antal anställda), så filtreras listan på de Microsoftpartners som sannolikt passar dig bäst
 </p>
 <p className="text-sm text-muted-foreground max-w-4xl mx-auto mt-3">
 Så gör du: klicka på ett kort för att läsa mer, kryssa i <span className="font-medium text-foreground">Jämför</span> för att ställa upp till tre partner sida vid sida, eller gå vidare och kontakta de partners du själv väljer.
 </p>
 </div>

 {/* Industry Filter */}
 <FilterButtons
 title="Filtrera på bransch"
 icon="industry"
 options={allIndustries.map(ind => ({ label: ind, value: ind }))}
 selectedValue={selectedIndustry}
 onSelect={setSelectedIndustry}
 colorScheme="finance-supply"
 />

 {/* Geography Filter */}
  <FilterButtons
  title="Var behöver du leverans och support? (Sverige, Norden, Europa, Globalt)"
 icon="geography"
 options={geographyFilters.map(g => ({ label: g.label, value: g.value }))}
 selectedValue={selectedGeography}
 onSelect={setSelectedGeography}
 colorScheme="finance-supply"
 />

 {/* Optional size filters */}
 <SizeFilters
 selectedCompanySize={selectedCompanySize}
 selectedRevenue={selectedRevenue}
 onCompanySizeChange={setSelectedCompanySize}
 onRevenueChange={setSelectedRevenue}
 colorScheme="finance-supply"
 />

 {/* Resultathuvud – användarens sökning visas en gång ovanför korten */}
 {(selectedIndustry || selectedGeography || selectedCompanySize || selectedRevenue) && (
 <>
 <SearchResultSummary
  count={fscPartners.length}
  criteria={[
   "Finance & Supply Chain Management (F&O)",
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


 <WhyTheseResults agreementPriority criteria={["Finance & Supply Chain Management (F&O)", selectedIndustry, selectedGeography]} className="mb-6" />
 {fscPartners.length === 0 ? (
 <div className="text-center py-6">
 <h3 className="text-lg font-semibold text-foreground mb-2">Inga partner listas med denna filtrering?</h3>
 <p className="text-muted-foreground">
 Ingen fara, kontakta oss så hjälper vi dig att hitta en eller ett par partners som passar för din verksamhet.
 </p>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {fscPartners.map((partner, index) => {
 // Build profile URL with filter context
 const basePath = buildPartnerProductPath(partner.slug, "Finance & SCM");
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
 productKey="fsc"
 productLabel="Finance & Supply Chain Management"
 industry={selectedIndustry}
 geography={selectedGeography}
 companySize={selectedCompanySize}
 revenue={selectedRevenue}
 showCustomerExamples
 />
 );
 })}
 </div>
 )}

  <UnprofiledPartnersList
  variant="teaser"
  showSeeAllLink
  productKey="fsc"
  productLabel="Finance & Supply Chain Management (F&O)"
  industry={selectedIndustry || null}
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
 Finance & Supply Chain Management (F&O)
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
 sourcePage="/finance-supply-chain"
 selectedProduct="Finance & Supply Chain"
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

      {/* Sekundärt: relaterat från Partnernytt, långt ned på sidan. */}
      <AktuelltContextSection placement="financeSupplyChain" heading="Aktuellt inom Finance & Supply Chain Management" />
      <ProductPartnerNewsSection productArea="finance-scm" heading="Relaterat om Finance & Supply Chain Management" />
      <RelatedPages pages={fscRelatedPages} heading="Fördjupning om produktval, kostnad och partner" />
      <AiExamplesEntry apps={["finance","scm"]} label={"Se hur AI förändrar arbetet i Finance och Supply Chain Management"} source="finance-supply-chain" />
<PartnerSwitchCta />
 <ProductNextSteps product="finance-supply-chain" pageSource="Finance SCM" />
      </main>
 <BasicProfilesDirectory products={["fsc"]} />
      <SourcesAndMethod variant="product" externalSources={fscmSources} />
      <EditorialSource sourceType="Köpguide" />
 <Footer />
 </div>
 );
};

export default FinanceSupplyChain;
