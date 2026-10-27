import BasicPartnersReveal from "@/components/partner/BasicPartnersReveal";
import { useInquiry } from "@/contexts/InquiryContext";
import ContextualCta from "@/components/ContextualCta";
import { useState, useMemo, useEffect } from "react";
import { optimizedLogo } from "@/lib/optimizedLogo";
import Navbar from "@/components/Navbar";
import ShortAnswer from "@/components/ShortAnswer";
import Footer from "@/components/Footer";
import RelatedPages, { valjPartnerRelatedPages } from "@/components/RelatedPages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useSearchParams } from "react-router-dom";
import { Users, ArrowRight, ArrowLeftRight, Calendar, MessageSquare, Mail, Award, Shield, ExternalLink, Star, Loader2, List, Search, MapPin, Building2, CheckCircle2 } from "lucide-react";
import { FilterButtons, MultiFilterButtons } from "@/components/FilterButtons";
import { applicationFilterLabel } from "@/lib/applicationLabels";
import { SizeFilters } from "@/components/SizeFilters";
import thomasLainePhoto from "@/assets/thomas-laine.jpg";
import ProductHero from "@/components/ProductHero";
import PartnerGuideDialog from "@/components/PartnerGuideDialog";
import LeadCTA from "@/components/LeadCTA";
import LeadMagnetBanner from "@/components/LeadMagnetBanner";
import UrgencyBadge from "@/components/UrgencyBadge";
import PartnerCard from "@/components/PartnerCard";
import WhyTheseResults from "@/components/WhyTheseResults";
import UnprofiledPartnersList from "@/components/UnprofiledPartnersList";
import SEOHead from "@/components/SEOHead";
import { FAQSchema, ServiceSchema, BreadcrumbSchema, ItemListSchema } from "@/components/StructuredData";
import { resolvePriceTokens } from "@/lib/productPriceFormat";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";
import { appsToProductFilterKeys } from "@/lib/productFilterGroup";
import { trackPartnerEvent, trackPartnerImpression } from "@/utils/trackPartnerEvent";

// Breadcrumb items
const partnerBreadcrumbs = [
 { name: "Hem", url: "https://d365.se" },
 { name: "Välj Partner", url: "https://d365.se/valjdynamics365partner" },
];
import { allIndustries } from "@/data/partners";
import { useCoveredIndustries } from "@/hooks/useCoveredIndustries";
import { usePartners, DatabasePartner } from "@/hooks/usePartners";
import { useTrackFilterExposure } from "@/hooks/useTrackFilterExposure";
import { seededShuffle, getSessionSeed } from "@/hooks/usePartnerFilters";
import SwedenOfficeMap from "@/components/SwedenOfficeMap";
import staticPartnerData from "@/data/partnerData.json";
import { buildPartnerProductPath } from "@/lib/partnerProductSlug";
import { useBasicPartners } from "@/hooks/useBasicPartners";
import { filterBasicPartners } from "@/lib/basicPartnerMatch";
import PartnerBasicCard from "@/components/partner/PartnerBasicCard";
import VerifiedOnlyToggle from "@/components/VerifiedOnlyToggle";
import { getCardSummaryData } from "@/lib/partnerCardSummary";
import UnderlagMatchBox from "@/components/underlag/UnderlagMatchBox";
import { saveProfile, getBuyerProfile } from "@/lib/buyerProfile";
import {
 PRODUCT_TO_APP, APP_TO_PRODUCT_KEY, GEO_LABEL, widestGeo, industryNameFromSlug, industrySlugFromName,
 type CompareFilters, type ProductKey as UnderlagProductKey, type CriterionKey, deriveCompareFilters,
} from "@/lib/underlag";
import { trackUnderlagEvent } from "@/utils/trackUnderlagEvent";
import EditorialSource from "@/components/EditorialSource";
import ShortlistButton from "@/components/ShortlistButton";

// Partner FAQs for schema – priser hämtas från product_prices via resolvePriceTokens
const partnerFaqsRaw = [
 {
 question: "Hur hittar jag rätt Dynamics 365 partner i Sverige?",
 answer: "Hitta rätt Dynamics 365 partner i Sverige genom att filtrera på din bransch, vald applikation (Business Central, Sales, Customer Service m.fl.) och geografisk täckning. Välj en partner med dokumenterad erfarenhet i din bransch, relevant referensuppdrag och Microsoft-certifiering (Solutions Partner). På d365.se kan du jämföra partners kostnadsfritt och begära matchning."
 },
 {
 question: "Vad är skillnaden mellan olika Dynamics 365 partners i Sverige?",
 answer: "Business Central partner jämförelse: partners skiljer sig i storlek (10–500 konsulter), branschfokus, pris och certifieringsnivå. Stora partners som Stena/Systeam har bredare kapacitet men kan vara dyrare. Mellanstora nischade partners erbjuder ofta djupare branschkompetens och bättre tillgänglighet. Nyckelskillnader: antal certifierade konsulter, antal genomförda projekt, kundreferenser och supportmodell."
 },
 {
 question: "Vad innebär Microsoft-certifiering för Dynamics 365 partners?",
 answer: "Microsoft-certifierade partners (Solutions Partner) har genomgått Microsofts kvalitetsgranskning och uppfyller krav på antal certifierade konsulter, kundnöjdhet och genomförda projekt. Det finns fyra specialiseringar relevanta för Dynamics 365: Business Applications (ERP), Business Applications (CRM), Modern Work och Azure. En certifierad Microsoft partner ger högre trygghet vid implementering och ger kunden tillgång till Microsofts supportkanaler."
 },
 {
 question: "Hur mycket kostar ett Dynamics 365-implementeringsprojekt?",
 answer: "Implementeringskostnader varierar kraftigt: Business Central finns som snabbstart till fast pris från 50 000 kr. Ett traditionellt projekt räknat på 11 600 kr per konsultdag ligger på ca 175 000–465 000 kr för ett litet projekt, 465 000 kr–1,2 MSEK för ett medelstort och 1,2–2,9 MSEK för ett stort projekt. Finance & Supply Chain Management (F&O) för större företag kostar typiskt 2–6 MSEK (litet), 6–15 MSEK (medelstort) eller från 15 MSEK (stort). Faktorer som påverkar: antal användare, komplexitet av integrationer, befintliga system, branschspecifika krav (tjänsteföretag och grossister ligger lägst, tillverkning högst) och vald partner. Licenskostnaden tillkommer – Business Central från {{price:bc-essentials}}."
 },
 {
 question: "Har partnern erfarenhet av vår bransch?",
 answer: "Välj en partner med erfarenhet från liknande projekt och som förstår dina specifika krav inom din bransch. Många partners har branschspecifika lösningar och acceleratorer som kortar implementationstiden. Be alltid om 2–3 referensuppdrag från liknande bolag i din bransch."
 },
 {
 question: "Hur ser en bra Dynamics 365-implementationsmetodik ut?",
 answer: "Bra partners arbetar enligt beprövade metoder som Microsofts Success by Design och erbjuder tydlig projektledning, förändringsledning och utbildning. Be partnern beskriva hur de hanterar scope creep, förseningar och ändrade krav – det avslöjar deras professionalism."
 },
 {
 question: "Vilken support erbjuder Dynamics 365-partners efter implementationen?",
 answer: "Kontrollera att det finns tydlig plan för support, uppgraderingar och vidareutveckling med dedikerad supportorganisation och SLA:er. Microsoft releases 2 release waves per år – fråga hur partnern hanterar uppgraderingar och om de ingår i supportavtalet."
 },
 {
 question: "Hur transparenta är Dynamics 365-partners med kostnader?",
 answer: "Be om tydlig offert med alla kostnader specificerade – konsulttimmar, licenser, tredjepartslösningar och löpande support. Fråga specifikt hur de hanterar förändringar i projektomfattning (change requests) och om de erbjuder fast pris eller löpande räkning."
 },
];
const partnerFaqs = partnerFaqsRaw.map((f) => ({ ...f, answer: resolvePriceTokens(f.answer) }));


// All available Dynamics 365 applications for filtering
const allApplications = [
 "Business Central",
 "Finance & SCM",
 "Sales",
 "Customer Service",
 "Customer Insights (Marketing)",
 "Field Service",
 "Contact Center",
 "Project Operations",
 "Commerce",
 "Human Resources"
];

// Geography filter options
const geographyFilters = [
 { label: "Sverige", value: "Sverige" },
 { label: "Norden", value: "Norden" },
 { label: "Europa", value: "Europa" },
 { label: "Globalt", value: "Globalt" }
];

// Helper function to convert company sizes to readable categories
const getCompanySizeCategories = (sizes: string[]): string[] => {
 const categories = new Set<string>();
 
 sizes.forEach(size => {
 if (size === "1-49" || size === "50-99") {
 categories.add("SMB (1-99 anställda)");
 }
 if (size === "100-249" || size === "250-999") {
 categories.add("Mid-market (100-999)");
 }
 if (size === "1.000-4.999" || size === ">5.000") {
 categories.add("Enterprise (1.000+)");
 }
 });
 
 return Array.from(categories);
};

// Product key type matching the database structure
type ProductKey = 'bc' | 'fsc' | 'sales' | 'service';

// Map application names to product keys
const getProductKeysForApp = (app: string): ProductKey[] => {
 switch (app) {
 case "Business Central":
 return ['bc'];
 case "Finance & SCM":
 return ['fsc'];
 case "Sales":
 return ['sales'];
 case "Customer Service":
 case "Field Service":
 case "Contact Center":
 return ['service'];
 case "Customer Insights (Marketing)":
 return ['sales']; // Marketing is grouped with sales
 // Specialty products - no product key mapping, filtered via applications array
 case "Project Operations":
 case "Commerce":
 case "Human Resources":
 return []; // These are standalone products
 default:
 return [];
 }
};

// Specialty products that are filtered via applications array, not product_filters
const specialtyProducts = ["Project Operations", "Commerce", "Human Resources"];

// Helper to check if a database partner matches product filter criteria
const matchesDbProductFilter = (
 partner: DatabasePartner, 
 productKey: ProductKey,
 industry?: string,
 companySize?: string,
 geography?: string,
 _regions?: unknown,
 revenue?: string
): boolean => {
 const productFilter = partner.product_filters?.[productKey];
 if (!productFilter) return false;
 
 // Check industry filter
 if (industry && !productFilter.industries?.includes(industry)) {
 return false;
 }
 
 // Soft company size filter (empty target = match all)
 if (companySize) {
 const targets = productFilter.companySize || [];
 if (targets.length > 0 && !targets.includes(companySize)) return false;
 }

 // Soft revenue filter (empty target = match all)
 if (revenue) {
 const targets = productFilter.revenue || [];
 if (targets.length > 0 && !targets.includes(revenue)) return false;
 }
 
 // Check geography filter with hierarchy
 if (geography) {
 const partnerGeo = Array.isArray(productFilter.geography) ? productFilter.geography : (productFilter.geography ? [productFilter.geography] : ["Sverige"]);
  const geographyHierarchy = ["Sverige", "Norden", "Europa", "Globalt"];
 const selectedGeoIndex = geographyHierarchy.indexOf(geography);
 const maxPartnerGeoIndex = Math.max(...partnerGeo.map(g => geographyHierarchy.indexOf(g)));
 if (maxPartnerGeoIndex < selectedGeoIndex) {
 return false;
 }
 }
 
 return true;
};

// Helper to get product ranking from database partner
const getDbProductRanking = (partner: DatabasePartner, productKey: ProductKey): number => {
 return partner.product_filters?.[productKey]?.ranking ?? 999;
};

const ValjPartner = () => {
  const inquiry = useInquiry();
 const { data: dbPartners, isLoading } = usePartners();
 const { data: basicPartners } = useBasicPartners();
 const [searchParams, setSearchParams] = useSearchParams();
 // Underlagsfilter: ?product=fscm,sales&industry=<slug>&size=<anställda>&geo=sverige,europa
 const underlagMode = searchParams.get("underlag") === "1";
 const productParam = searchParams.get("product");
 const urlProducts = (productParam || "").split(",").filter((k): k is UnderlagProductKey => k in PRODUCT_TO_APP);
 const urlGeo = (searchParams.get("geo") || "").split(",").filter((g) => g in GEO_LABEL);
 const aiParam = searchParams.get("ai");
 const [showLeadMagnet, setShowLeadMagnet] = useState(true);
 const [guideOpen, setGuideOpen] = useState(!!aiParam);

 // Re-open guide when navigating to /valjdynamics365partner/?ai=1 from elsewhere
 // (e.g. Navbar "Så väljer du rätt Dynamics 365-partner" menu item).
 // Strip the ?ai=1 query so the URL stays clean.
 useEffect(() => {
 if (aiParam) {
 setGuideOpen(true);
 if (typeof window !== "undefined") {
 const clean = window.location.pathname + window.location.hash;
 window.history.replaceState(null, "", clean);
 }
 }
 }, [aiParam]);
 // Guider och andra ingångar kan förvälja produktområde via ?apps=Business Central
 const appsParam = searchParams.get("apps");
 const [selectedApplications, setSelectedApplications] = useState<string[]>(() =>
  urlProducts.length ? urlProducts.map((k) => PRODUCT_TO_APP[k]) : appsParam ? appsParam.split(",").map((a) => a.trim()).filter(Boolean) : []
 );

 useEffect(() => {
  if (!appsParam) return;
  setSelectedApplications(appsParam.split(",").map((a) => a.trim()).filter(Boolean));
 }, [appsParam]);
 const [selectedIndustry, setSelectedIndustry] = useState<string | null>(() => industryNameFromSlug(searchParams.get("industry")) ?? null);
 const [selectedCompanySize, setSelectedCompanySize] = useState<string | null>(() => searchParams.get("size") || null);
 const [selectedRevenue, setSelectedRevenue] = useState<string | null>(null);
 const [selectedGeography, setSelectedGeography] = useState<string | null>(() => widestGeo(urlGeo) ?? null);
 // Kriterier från underlaget (visas på korten, filtrerar aldrig bort partners).
 const [underlagCriteria] = useState<CriterionKey[]>(() => (underlagMode ? deriveCompareFilters(getBuyerProfile()).criteria : []));

 useEffect(() => {
  if (underlagMode) trackUnderlagEvent("compare_prefilled", { products: urlProducts });
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 // Ändrade filter skrivs tillbaka till URL:en och till underlaget.
 useEffect(() => {
  if (!underlagMode) return;
  const products = selectedApplications.map((a) => APP_TO_PRODUCT_KEY[a]).filter(Boolean);
  const sp = new URLSearchParams();
  if (products.length) sp.set("product", products.join(","));
  const indSlug = industrySlugFromName(selectedIndustry);
  if (indSlug) sp.set("industry", indSlug);
  if (selectedCompanySize) sp.set("size", selectedCompanySize);
  const geoKey = Object.entries(GEO_LABEL).find(([, v]) => v === selectedGeography)?.[0];
  if (geoKey) sp.set("geo", geoKey);
  sp.set("underlag", "1");
  if (sp.toString() !== searchParams.toString()) setSearchParams(sp, { replace: true });
  const PRODUCT_SCOPE: Record<UnderlagProductKey, string[]> = { fscm: ["finance", "scm"], sales: ["sales"], customer_service: ["customer_service"], field_service: ["field_service"], customer_insights: ["customer_insights"], contact_center: ["contact_center"] };
  const allProductScope = Object.values(PRODUCT_SCOPE).flat();
  const cur = (getBuyerProfile().scope.apps as string[]) || [];
  const keepOther = cur.filter((a) => !allProductScope.includes(a));
  const keepFscmSplit = cur.filter((a) => (a === "finance" || a === "scm"));
  const fromFilter = products.flatMap((k) => (k === "fscm" && keepFscmSplit.length ? keepFscmSplit : PRODUCT_SCOPE[k]));
  saveProfile({
   scope: { apps: Array.from(new Set([...keepOther, ...fromFilter])) },
   company: { industry: indSlug ?? null, employees: selectedCompanySize ?? null },
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [underlagMode, selectedApplications, selectedIndustry, selectedCompanySize, selectedGeography]);

 const underlagFilters: CompareFilters | null = underlagMode
  ? {
    product: selectedApplications.map((a) => APP_TO_PRODUCT_KEY[a]).filter(Boolean),
    industry: industrySlugFromName(selectedIndustry),
    size: selectedCompanySize ?? undefined,
    geo: (() => { const g = Object.entries(GEO_LABEL).find(([, v]) => v === selectedGeography)?.[0]; return g ? [g] : undefined; })(),
    criteria: underlagCriteria,
   }
  : null;
 const [verifiedOnly, setVerifiedOnly] = useState(false);
 const [nameQuery, setNameQuery] = useState("");

 // Publish current filters to the partner-compare context so a "Jämför"
 // navigation carries product/industry/geo/size into the compare page.
 const { setFilterContext: setCompareFilters } = usePartnerCompare();
 useEffect(() => {
  const productKeys = appsToProductFilterKeys(selectedApplications);
  setCompareFilters({
   product: productKeys.length > 0 ? productKeys.join(",") : null,
   industry: selectedIndustry || null,
   geography: selectedGeography || null,
   companySize: selectedCompanySize || null,
   revenue: selectedRevenue || null,
  });
 }, [selectedApplications, selectedIndustry, selectedGeography, selectedCompanySize, selectedRevenue, setCompareFilters]);

 // Filter to only show featured partners from database
 const partners = useMemo(() => {
 return (dbPartners || []).filter(p => p.is_featured === true);
 }, [dbPartners]);

 // Show only industries that have at least one featured partner profiled
 // against them via product_filters (same source as /branscher).
 const { covered: coveredIndustries } = useCoveredIndustries();
 const availableIndustries = useMemo(
 () => allIndustries.filter((ind) => coveredIndustries.has(ind)),
 [coveredIndustries],
 );

 const toggleApplication = (app: string) => {
 setSelectedApplications(prev => 
 prev.includes(app) 
 ? prev.filter(a => a !== app)
 : [...prev, app]
 );
 };

 // Helper to get the lowest industry index for a partner (for sorting by industry priority)
 const getIndustryPriority = (partner: DatabasePartner, industry: string | null): number => {
 if (!industry) return 0;
 for (let i = 0; i < (partner.industries || []).length; i++) {
 if ((partner.industries || [])[i].toLowerCase().includes(industry.toLowerCase()) ||
 industry.toLowerCase().includes((partner.industries || [])[i].toLowerCase())) {
 return i;
 }
 }
 return Infinity;
 };

 // Helper to determine which product ranking to use based on selected applications
 const getProductRanking = (partner: DatabasePartner): number => {
 // Determine which product type is primarily selected (excluding specialty products)
 const hasBCApp = selectedApplications.includes("Business Central");
 const hasFSCApp = selectedApplications.includes("Finance & SCM");
 const hasSalesApp = selectedApplications.some(app => 
 ["Sales", "Customer Insights (Marketing)"].includes(app)
 );
 const hasServiceApp = selectedApplications.some(app => 
 ["Customer Service", "Field Service", "Contact Center"].includes(app)
 );
 
 if (hasBCApp && !hasFSCApp && !hasSalesApp && !hasServiceApp) {
 return getDbProductRanking(partner, 'bc');
 }
 if (hasFSCApp && !hasBCApp && !hasSalesApp && !hasServiceApp) {
 return getDbProductRanking(partner, 'fsc');
 }
 if (hasSalesApp && !hasBCApp && !hasFSCApp && !hasServiceApp) {
 return getDbProductRanking(partner, 'sales');
 }
 if (hasServiceApp && !hasBCApp && !hasFSCApp && !hasSalesApp) {
 return getDbProductRanking(partner, 'service');
 }
 
 // If mixed or no specific apps selected, return lowest ranking across all
 const bcRank = getDbProductRanking(partner, 'bc');
 const fscRank = getDbProductRanking(partner, 'fsc');
 const salesRank = getDbProductRanking(partner, 'sales');
 const serviceRank = getDbProductRanking(partner, 'service');
 return Math.min(bcRank, fscRank, salesRank, serviceRank);
 };

 // Helper to build partner profile URL with filter context
 const buildPartnerProfileUrl = (partnerSlug: string) => {
 const basePath = buildPartnerProductPath(
 partnerSlug,
 selectedApplications.length > 0 ? selectedApplications[0] : undefined,
 );
 const params = new URLSearchParams();
 if (selectedIndustry) {
 params.set("industry", selectedIndustry);
 }
 const qs = params.toString();
 return qs ? `${basePath}?${qs}` : basePath;
 };

 // Filter and sort partners - only show featured partners from database
 const filteredPartners = useMemo(() => {
 // Determine which product type is selected (excluding specialty products)
 const hasBCApp = selectedApplications.includes("Business Central");
 const hasFSCApp = selectedApplications.includes("Finance & SCM");
 const hasSalesApp = selectedApplications.some(app => 
 ["Sales", "Customer Insights (Marketing)"].includes(app)
 );
 const hasServiceApp = selectedApplications.some(app => 
 ["Customer Service", "Field Service", "Contact Center"].includes(app)
 );
 
 // Check for specialty products (filtered via applications array)
 const selectedSpecialtyProducts = selectedApplications.filter(app => 
 specialtyProducts.includes(app)
 );
 
 let result: DatabasePartner[] = [];
 
 if (selectedApplications.length === 0) {
 // No application selected - show all featured partners that have any productFilter
 result = partners.filter(partner => 
 partner.product_filters?.bc || partner.product_filters?.fsc || 
 partner.product_filters?.sales || partner.product_filters?.service
 );
 } else if (selectedSpecialtyProducts.length > 0 && !hasBCApp && !hasFSCApp && !hasSalesApp && !hasServiceApp) {
 // Only specialty products selected - filter by applications array
 result = partners.filter(partner => 
 selectedSpecialtyProducts.every(app => partner.applications?.includes(app))
 );
 } else {
 // Filter based on selected applications (product_filters)
 const matchingPartners = new Set<DatabasePartner>();
 
 partners.forEach(partner => {
 let matchesProductFilter = false;
 
 if (hasBCApp && partner.product_filters?.bc) {
 if (matchesDbProductFilter(partner, 'bc', selectedIndustry || undefined, selectedCompanySize || undefined, selectedGeography || undefined, undefined, selectedRevenue || undefined)) {
 matchesProductFilter = true;
 }
 }
 if (hasFSCApp && partner.product_filters?.fsc) {
 if (matchesDbProductFilter(partner, 'fsc', selectedIndustry || undefined, selectedCompanySize || undefined, selectedGeography || undefined, undefined, selectedRevenue || undefined)) {
 matchesProductFilter = true;
 }
 }
 if (hasSalesApp && partner.product_filters?.sales) {
 if (matchesDbProductFilter(partner, 'sales', selectedIndustry || undefined, selectedCompanySize || undefined, selectedGeography || undefined, undefined, selectedRevenue || undefined)) {
 matchesProductFilter = true;
 }
 }
 if (hasServiceApp && partner.product_filters?.service) {
 if (matchesDbProductFilter(partner, 'service', selectedIndustry || undefined, selectedCompanySize || undefined, selectedGeography || undefined, undefined, selectedRevenue || undefined)) {
 matchesProductFilter = true;
 }
 }
 
 // If specialty products are also selected, partner must have them in applications
 const matchesSpecialtyProducts = selectedSpecialtyProducts.length === 0 || 
 selectedSpecialtyProducts.every(app => partner.applications?.includes(app));
 
 if (matchesProductFilter && matchesSpecialtyProducts) {
 matchingPartners.add(partner);
 }
 });
 
 result = Array.from(matchingPartners);
 }
 
 // Apply additional filters for when no apps are selected
 if (selectedApplications.length === 0) {
 if (selectedIndustry) {
 result = result.filter(partner => 
 (partner.industries || []).some(ind => ind === selectedIndustry)
 );
 }
 
 if (selectedGeography) {
 const geographyHierarchy = ["Sverige", "Norden", "Europa", "Globalt"];
 const selectedGeoIndex = geographyHierarchy.indexOf(selectedGeography);
 result = result.filter(partner => {
 // Check geography in any product filter - geography is now an array
 const getMaxGeoIndex = (geo: string | string[] | undefined) => {
 const geoArray = Array.isArray(geo) ? geo : (geo ? [geo] : ["Sverige"]);
 return Math.max(...geoArray.map(g => geographyHierarchy.indexOf(g)));
 };
 const bcGeoIdx = getMaxGeoIndex(partner.product_filters?.bc?.geography);
 const fscGeoIdx = getMaxGeoIndex(partner.product_filters?.fsc?.geography);
 const salesGeoIdx = getMaxGeoIndex(partner.product_filters?.sales?.geography);
 const serviceGeoIdx = getMaxGeoIndex(partner.product_filters?.service?.geography);
 const maxGeoIndex = Math.max(bcGeoIdx, fscGeoIdx, salesGeoIdx, serviceGeoIdx);
 return maxGeoIndex >= selectedGeoIndex;
 });
 }
 }
 
 // Avtalspartners först, sedan sessionsstabil seedad ordning inom respektive grupp
 // (samma seed som övriga partnerlistor, så ordningen hoppar inte vid filterändringar).
 const seed = getSessionSeed();
   const q = nameQuery.trim().toLowerCase();
   if (q) result = result.filter(p => p.name.toLowerCase().includes(q));
   const signed = result.filter(p => p.agreement_signed);
   const unsigned = result.filter(p => !p.agreement_signed);
   return [...seededShuffle(signed, seed), ...seededShuffle(unsigned, seed + 1)];
  }, [partners, selectedApplications, selectedIndustry, selectedCompanySize, selectedRevenue, selectedGeography, nameQuery]);

 // Track which partners get shown in filter results (admin sales summary)
 // MUST be called before any early return to preserve hook order
 useTrackFilterExposure({
 partners: filteredPartners.map((p) => ({ slug: p.slug, id: p.id })),
 pagePath: "/valjdynamics365partner",
 filterContext: {
 product: selectedApplications.join(", ") || null,
 industry: selectedIndustry,
 size: selectedCompanySize,
 geography: selectedGeography,
 },
 enabled: !isLoading,
  });

  // Partner Performance – matchningsexponering (nivå 1) och rekommendation (nivå 3)
  const matchIntent: "erp" | "crm" | null = useMemo(() => {
    const keys = appsToProductFilterKeys(selectedApplications);
    if (keys.some((k) => k === "bc" || k === "fsc")) return "erp";
    if (keys.some((k) => k === "sales" || k === "service")) return "crm";
    return null;
  }, [selectedApplications]);

  useEffect(() => {
    if (isLoading || filteredPartners.length === 0) return;
    const ctx = {
      product: selectedApplications.join(", ") || null,
      industry: selectedIndustry,
      size: selectedCompanySize,
      geography: selectedGeography,
    };
    trackPartnerImpression(
      "partner_match_impression",
      filteredPartners.map((p) => ({ slug: p.slug, id: p.id })),
      ctx,
    );
    filteredPartners.slice(0, 5).forEach((p, i) => {
      trackPartnerEvent({
        event: "partner_match_recommended",
        partnerSlug: p.slug,
        partnerId: p.id,
        intentTrack: matchIntent,
        metadata: { ...ctx, position: i + 1, total: filteredPartners.length },
      });
    });
  }, [
    isLoading,
    filteredPartners,
    matchIntent,
    selectedApplications,
    selectedIndustry,
    selectedCompanySize,
    selectedGeography,
  ]);

 // Basic-partners (observerad data) som matchar samma filter
  const filteredBasicPartners = useMemo(
   () => {
    const list = filterBasicPartners(basicPartners || [], {
     applications: selectedApplications,
     industry: selectedIndustry,
     companySize: selectedCompanySize,
     revenue: selectedRevenue,
     geography: selectedGeography,
    });
    const q = nameQuery.trim().toLowerCase();
    return q ? list.filter((p) => (p.name || "").toLowerCase().includes(q)) : list;
   },
   [basicPartners, selectedApplications, selectedIndustry, selectedCompanySize, selectedRevenue, selectedGeography, nameQuery],
  );



 if (isLoading) {
 return (
 <div className="min-h-screen bg-background flex items-center justify-center">
 <Loader2 className="h-8 w-8 animate-spin text-primary" />
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-background">
 <SEOHead 
 title="Dynamics Partners i Sverige | Jämför Microsoft Dynamics 365-partners"
 titleMaxLength={80}
 description="Hitta Dynamics partners i Sverige. Jämför kompetens, branschfokus och applikationsområden bland svenska Microsoft Dynamics 365-partners på d365.se."
 canonicalPath="/valjdynamics365partner"
 keywords="Dynamics 365 partner, Microsoft Dynamics partner, Dynamics 365 konsult, Dynamics 365 konsultbolag, Business Central partner jämförelse, Dynamics 365 implementering Sverige, ERP partner Sverige, CRM partner Sverige, Business Central konsult"
 ogImage="https://d365.se/og-partner.png"
 ogImageAlt="Jämför Dynamics 365-partners i Sverige på d365.se"
 />
 <FAQSchema faqs={partnerFaqs} />
 <ServiceSchema 
 name="Dynamics 365 Partnerval"
 description="Hjälp att välja rätt Microsoft Dynamics 365 implementeringspartner baserat på bransch, storlek och behov. Vi står på köparens sida när du väljer Microsoft Dynamics 365-partner."
 />
 <BreadcrumbSchema items={partnerBreadcrumbs} />
 <ItemListSchema
 name="Dynamics 365-partners i Sverige"
 description="Lista över Dynamics 365-partners i Sverige presenterade på d365.se."
 items={partners.map((p) => ({
 name: p.name,
 url: `https://d365.se/partner/${p.slug}`,
 }))}
 />
 <Navbar />
 <main>
 {/* Partner Guide Dialog */}
 <PartnerGuideDialog 
 open={guideOpen} 
 onOpenChange={setGuideOpen} 
 partners={partners}
 initialAiInterest={aiParam || undefined}
 />
 
  <ProductHero
  title="Hitta rätt Microsoft Dynamics partners i Sverige"
  subhead="Att välja rätt implementeringspartner är avgörande för en lyckad satsning på affärssystem och CRM. Här guidar vi dig till Dynamics partners i Sverige och hjälper dig jämföra kompetens, bransch och ansvar efter go-live."
  primary={{ label: "Guidad väg till rätt partner", onClick: () => setGuideOpen(true), icon: ArrowRight }}
  secondary={{ label: "Jämför tre partners sida vid sida", to: "/jamfor-partners/", icon: ArrowLeftRight }}
  tertiary={{ label: "Gå till partnerlistan", onClick: () => document.getElementById("hitta-partners")?.scrollIntoView({ behavior: "smooth", block: "start" }), icon: List }}
  />

  <ShortAnswer title="Vad är en Dynamics 365-partner">
 Rätt Dynamics 365-partner har bevisad erfarenhet av respektive produktområde (Business Central, Finance & Supply Chain Management (F&O), Sales, Customer Service m.fl.), din bransch och en storlek som matchar dig. På d365.se kan du jämföra Microsoft Dynamics-partners och konsultbolag för din bransch, geografi och AI-mognad – och få rekommendationer utifrån era behov via vår partnerguide.
 </ShortAnswer>

 <section className="py-8 sm:py-10" aria-labelledby="krav-pa-partner">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="max-w-4xl mx-auto">
 <h2 id="krav-pa-partner" className="text-xl sm:text-2xl font-bold text-foreground mb-3">
 Vad ska du kräva av en certifierad Dynamics partner?
 </h2>
 <p className="text-muted-foreground mb-5">
 En certifiering visar att partnern uppfyller Microsofts krav, men säger inte allt om hur projektet och förvaltningen kommer att fungera för just er. Be om belägg för de här fyra punkterna innan ni går vidare.
 </p>
 <ul className="grid gap-4 sm:grid-cols-2">
 {[
 { t: "Microsoft Solutions Partner-beteckning", d: <>Fråga om partnern har Microsofts beteckning Solutions Partner for Business Applications och kontrollera den i Microsofts partnerkatalog. Beteckningen bygger på kunder, certifierade konsulter och leveranser inom Business Applications.</> },
 { t: "Dokumenterad erfarenhet i er bransch", d: <>Be om referenskunder i er bransch och storlek, och prata med minst en av dem. Fråga vilka branschtillägg partnern själv har byggt eller levererat.</> },
 { t: "Tydliga SLA-nivåer och supportorganisation", d: <>Kontrollera vem som tar över efter driftsättning, vilka svarstider som gäller per prioritet och hur Microsofts uppdateringar hanteras. Se vår guide om <Link to="/guider/dynamics-365-support-forvaltning/" className="text-primary underline underline-offset-2">support och förvaltning</Link>.</> },
 { t: "Transparent prismodell", d: <>Begär timpriser per roll, hur förändringar i omfattningen prissätts och vad förvaltningen kostar per månad. Jämför med typiska nivåer på <Link to="/priser/" className="text-primary underline underline-offset-2">prissidan</Link>.</> },
 ].map((item) => (
 <li key={item.t} className="rounded-lg border border-border bg-card p-5">
 <p className="flex items-start gap-2 font-semibold text-foreground mb-2">
 <CheckCircle2 className="h-5 w-5 shrink-0 text-accent mt-0.5" aria-hidden />
 {item.t}
 </p>
 <p className="text-sm text-muted-foreground leading-relaxed">{item.d}</p>
 </li>
 ))}
 </ul>
 <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-5">
 <p className="font-semibold text-foreground mb-3">Visa partners per modul</p>
 <div className="flex flex-wrap gap-2">
 {[
 { label: "CRM / Sales", app: "Sales" },
 { label: "Customer Service", app: "Customer Service" },
 { label: "Business Central", app: "Business Central" },
 { label: "Finance & Supply Chain", app: "Finance & SCM" },
 ].map((m) => (
 <Button
 key={m.app}
 type="button"
 variant={selectedApplications.length === 1 && selectedApplications[0] === m.app ? "default" : "outline"}
 className="min-h-11"
 onClick={() => {
 setSelectedApplications([m.app]);
 document.getElementById("hitta-partners")?.scrollIntoView({ behavior: "smooth", block: "start" });
 }}
 >
 {m.label}
 </Button>
 ))}
 </div>
 <p className="mt-3 text-xs text-muted-foreground">Väljer modulen i filtret nedan. Ni kan sedan lägga till bransch, geografi och storlek.</p>
 </div>
 </div>
 </div>
 </section>

 <section className="py-8 sm:py-10">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="max-w-4xl mx-auto rounded-lg border border-border bg-card p-6">
 <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
 Dynamics{"\u00A0"}365 konsult eller Microsoft-partner, vad är skillnaden?
 </h2>
 <div className="space-y-3 text-muted-foreground">
 <p>Många söker en Dynamics{"\u00A0"}365 konsult när de egentligen behöver ett helt leveransteam. En Microsoft Dynamics-partner är ett bolag med avtal och kompetens hos Microsoft, och ansvarar ofta för hela införandet: projektledning, lösningsdesign, utveckling, migrering, utbildning och förvaltning. En fristående konsult bidrar oftast med en specifik roll eller expertis.</p>
 <p>För ett nytt införande eller ett partnerbyte är en partner normalt rätt startpunkt. En enskild konsult kan passa när ni redan har en fungerande lösning och behöver förstärkning inom ett avgränsat område. Fråga alltid vem som bär ansvaret om något går fel och vem som äger dokumentation, kod och administratörsåtkomst.</p>
 <p>
 Redan kund och vill se över ert upplägg? Läs om{" "}
 <a href="/guider/dynamics-365-support-forvaltning/" className="text-primary underline underline-offset-2">Dynamics{"\u00A0"}365 support och förvaltning</a>{" "}
 eller{" "}
 <a href="/guider/byta-dynamics-partner/" className="text-primary underline underline-offset-2">byte av Dynamics{"\u00A0"}365-partner</a>.
 </p>
 </div>
 </div>
 </div>
 </section>


 {/* Fem viktiga frågor Section */}
 <section className="py-8 sm:py-12 md:py-16 bg-secondary/50">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="max-w-4xl mx-auto">
 <div className="text-center mb-8 sm:mb-10 md:mb-12">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
 Fem viktiga frågor vid val av implementationspartner
 </h2>
 <p className="text-base sm:text-lg text-muted-foreground px-2 mb-4">
 Valet av implementationspartner är ofta den viktigaste faktorn för en lyckad Dynamics 365-implementation. 
 En bra partner kan vara skillnaden mellan ett framgångsrikt projekt och ett som kostar mer tid och pengar än planerat.
 </p>
 <p className="text-base sm:text-lg text-muted-foreground px-2">
 Här är fem viktiga frågor du (eller din organisation) bör ställa din själva inför valet av implementationspartner för Dynamics 365
 </p>
 </div>

 <div className="space-y-6">
 {/* Fråga 1 */}
 <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 transition-all">
 <CardHeader>
 <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
 <span className="text-2xl">✅</span>
 Har partnern erfarenhet av vår bransch och våra processer?
 </CardTitle>
 </CardHeader>
 <CardContent>
 <ul className="space-y-2 text-muted-foreground">
 <li>• Har de genomfört liknande projekt tidigare?</li>
 <li>• Förstår de våra specifika krav inom t.ex. tillverkning, tjänster, handel eller offentlig sektor?</li>
 <li>• Har de en branschspecifik lösning som passar vår verksamhet?</li>
 </ul>
 </CardContent>
 </Card>

 {/* Fråga 2 */}
 <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 transition-all">
 <CardHeader>
 <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
 <span className="text-2xl">✅</span>
 Hur ser deras implementationsmetodik ut?
 </CardTitle>
 </CardHeader>
 <CardContent>
 <ul className="space-y-2 text-muted-foreground">
 <li>• Arbetar de enligt en beprövad metod (t.ex. Microsoft's Success by Design)?</li>
 <li>• Hur hanterar de projektledning, förändringsledning och utbildning?</li>
 <li>• Erbjuder de en snabbstart eller paketerad lösning?</li>
 </ul>
 </CardContent>
 </Card>

 {/* Fråga 3 */}
 <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 transition-all">
 <CardHeader>
 <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
 <span className="text-2xl">✅</span>
 Vilken typ av support och förvaltning erbjuder de efter implementationen?
 </CardTitle>
 </CardHeader>
 <CardContent>
 <ul className="space-y-2 text-muted-foreground">
 <li>• Finns det en tydlig plan för support, uppgraderingar och vidareutveckling?</li>
 <li>• Har de en dedikerad supportorganisation?</li>
 <li>• Erbjuder de SLA:er och proaktiv förvaltning?</li>
 </ul>
 </CardContent>
 </Card>

 {/* Fråga 4 */}
 <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 transition-all">
 <CardHeader>
 <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
 <span className="text-2xl">✅</span>
 Hur transparenta är de med kostnader och tidsplan?
 </CardTitle>
 </CardHeader>
 <CardContent>
 <ul className="space-y-2 text-muted-foreground">
 <li>• Får vi en tydlig offert med alla kostnader specificerade?</li>
 <li>• Hur hanterar de förändringar i omfattning?</li>
 <li>• Har de referensprojekt med liknande budget och tidsram?</li>
 </ul>
 </CardContent>
 </Card>

 {/* Fråga 5 */}
 <Card className="border-0 bg-gradient-to-br from-card via-card to-muted/30 transition-all">
 <CardHeader>
 <CardTitle className="flex items-start gap-3 text-lg sm:text-xl">
 <span className="text-2xl">✅</span>
 Hur väl passar de vår organisationskultur och arbetssätt?
 </CardTitle>
 </CardHeader>
 <CardContent>
 <ul className="space-y-2 text-muted-foreground">
 <li>• Är de lyhörda, pedagogiska och samarbetsvilliga?</li>
 <li>• Känns de som en långsiktig partner snarare än bara en leverantör?</li>
 <li>• Har vi god personkemi med deras team?</li>
 </ul>
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 </section>

 {/* Lead Magnet Banner after Fem viktiga frågor */}
 {showLeadMagnet && (
 <section id="guide" className="px-4 py-8 bg-muted/30">
 <div className="container mx-auto max-w-6xl">
 <LeadMagnetBanner 
 sourcePage="/valjdynamics365partner" 
 onClose={() => setShowLeadMagnet(false)}
 />
 </div>
 </section>
 )}


 <section id="hitta-partners" className="py-8 sm:py-12 md:py-16 bg-background">
 <div className="container mx-auto px-4 sm:px-6">
 <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-8 sm:mb-10 md:mb-12">
              {/* Partner Map */}
              <div className="shrink-0 w-56 md:w-72">
                <SwedenOfficeMap showLegend={false} />
              </div>


 <div className="text-center md:text-left flex-1">
 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
 Så hittar du 2–4 relevanta partners att kontakta
 </h2>
 <p className="text-base sm:text-lg text-muted-foreground">
 Använd filtreringen nedan för att ta fram en första kortlista av Microsoft Dynamics 365-partners som arbetar i Sverige och som har kontor på platserna kartan visar. Tänk på att rätt partner handlar om mer än bara filter – kompetens inom applikationsområdet, branschförståelse, metodik, team och kemi väger minst lika tungt.
 </p>
 </div>
 </div>


 {/* Fritextsökning på partnernamn */}
 <div className="mx-auto mb-8 max-w-xl">
  <label htmlFor="partner-name-search" className="sr-only">Sök partner på namn</label>
  <div className="relative">
   <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
   <input
    id="partner-name-search"
    type="search"
    value={nameQuery}
    onChange={(e) => setNameQuery(e.target.value)}
    placeholder="Sök partner på namn…"
    className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
   />
  </div>
 </div>

 {underlagMode && (
  <p className="mx-auto mb-6 max-w-3xl rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-center text-sm text-foreground">
   Filtren är förifyllda från ert underlag.{" "}
   <Link to="/underlag/" className="text-primary underline">ändra</Link>
  </p>
 )}

 {/* Industry Filter */}
 <FilterButtons
 title="Filtrera på bransch (rekommenderat)"
 icon="industry"
 options={availableIndustries.map(ind => ({ label: ind, value: ind }))}
 selectedValue={selectedIndustry}
 onSelect={setSelectedIndustry}
 colorScheme="amber"
 />

 {/* Application Filter (obligatoriskt) */}
 <MultiFilterButtons
 title="Filtrera på Dynamics 365 Applikation (obligatoriskt)"
 icon="application"
 options={allApplications.map(app => ({ label: applicationFilterLabel(app), value: app }))}
 selectedValues={selectedApplications}
 onToggle={toggleApplication}
 colorScheme="amber"
 showApplicationIcons={true}
 />

 {/* Optional size filters */}
 <SizeFilters
 selectedCompanySize={selectedCompanySize}
 selectedRevenue={selectedRevenue}
 onCompanySizeChange={setSelectedCompanySize}
 onRevenueChange={setSelectedRevenue}
 colorScheme="amber"
 />

 {/* Geography Filter */}
  <FilterButtons
  title="Var behöver du leverans och support? (Sverige, Norden, Europa, Globalt)"
 icon="geography"
 options={geographyFilters.map(f => ({ label: f.label, value: f.value }))}
 selectedValue={selectedGeography}
 onSelect={setSelectedGeography}
 colorScheme="amber"
 />

 {/* Visningsfilter: endast verifierade partners */}
 <div className="flex justify-center mb-8">
  <VerifiedOnlyToggle
   checked={verifiedOnly}
   onChange={setVerifiedOnly}
   count={filteredPartners.length}
  />
 </div>

 {/* Filter Results Summary */}
 {(selectedApplications.length > 0 || selectedIndustry || selectedGeography || selectedCompanySize || selectedRevenue) && (
 <div className="text-center mb-8">
 <p className="text-sm text-muted-foreground">
 Visar <span className="font-semibold text-foreground">{filteredPartners.length}</span> partners
 {selectedApplications.length > 0 && <> som levererar <span className="font-semibold text-primary">{selectedApplications.map(applicationFilterLabel).join(', ')}</span></>}
 {selectedIndustry && <> inom <span className="font-semibold text-accent">{selectedIndustry}</span></>}
 {selectedGeography && <> i <span className="font-semibold text-accent">{selectedGeography}</span></>}
 {selectedCompanySize && <> · storlek <span className="font-semibold text-accent">{selectedCompanySize}</span></>}
 {selectedRevenue && <> · omsättning <span className="font-semibold text-accent">{selectedRevenue}</span></>}
 </p>
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
 className="mt-2 text-muted-foreground hover:text-foreground"
 >
 Rensa alla filter
 </Button>
 </div>
 )}

 {selectedApplications.length === 0 ? (
 <div className="text-center py-10 bg-muted/30 rounded border border-border/50">
 <Award className="h-12 w-12 text-primary mx-auto mb-4" />
 <h3 className="text-xl font-semibold text-foreground mb-2">
 Välj först ett produktområde
 </h3>
 <p className="text-muted-foreground max-w-lg mx-auto">
 För att visa relevanta partners behöver du välja minst en Dynamics 365-applikation ovan (t.ex. Business Central, Sales eller Customer Service). Bransch är valfritt men rekommenderat.
 </p>
 </div>
 ) : filteredPartners.length === 0 ? (
 <div className="text-center py-6 bg-muted/30 rounded border border-border/50">
 <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
 <h3 className="text-xl font-semibold text-foreground mb-2">
 Inga partner listas med denna filtrering?
 </h3>
 <p className="text-muted-foreground mb-6 max-w-md mx-auto">
 Ingen fara, kontakta oss så hjälper vi dig att hitta en eller ett par partners som passar för din verksamhet.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Button 
 variant="outline"
 onClick={() => {
 setSelectedApplications([]);
 setSelectedIndustry(null);
 setSelectedGeography(null);
 }}
 >
 Rensa alla filter
 </Button>
 <Button asChild className="bg-cta-orange hover:bg-cta-orange-hover text-white">
 <Link to="/kontakt/">
 <MessageSquare className="w-4 h-4 mr-2" />
 Kontakta oss för hjälp
 </Link>
 </Button>
 </div>
 </div>
  ) : (
   <>
    {searchParams.get("source") === "min-d365-plan" && (selectedApplications.length > 0 || selectedIndustry) && <p className="mb-4 max-w-4xl mx-auto rounded-md border border-border bg-card p-3 text-sm text-foreground">Utifrån er D365-plan visar vi partners inom {[...selectedApplications.map(applicationFilterLabel), selectedIndustry?.toLocaleLowerCase("sv")].filter(Boolean).join(" och ").replace(/Dynamics 365/g, "Dynamics\u00a0365")}. Ordningen påverkas inte av planen och ni kan ändra filtren fritt.</p>}
    <WhyTheseResults className="mb-6 max-w-4xl mx-auto" agreementPriority criteria={[...selectedApplications.map(applicationFilterLabel), selectedIndustry, selectedGeography]} />
    <div className="mb-6 max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-md border border-primary/40 bg-primary/5 p-4">
      <p className="text-sm text-foreground"><span className="font-semibold">Nästa steg:</span> spara 1–3 partners i kortlistan och jämför dem innan ni tar kontakt.</p>
      <Button asChild size="sm"><Link to="/kortlista/">Gå till kortlistan <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredPartners.map((partner, index) => {
 // Determine which product key to use for this partner
 const hasBCApp = selectedApplications.includes("Business Central");
 const hasFSCApp = selectedApplications.includes("Finance & SCM");
 const hasCRMApp = selectedApplications.some(app => 
 ["Sales", "Customer Service", "Customer Insights (Marketing)", "Field Service", "Contact Center", "Project Operations"].includes(app)
 );
 
 let productKey: 'bc' | 'fsc' | 'crm' | null = null;
 if (hasBCApp && partner.product_filters?.bc) productKey = 'bc';
 else if (hasFSCApp && partner.product_filters?.fsc) productKey = 'fsc';
 else if (hasCRMApp && (partner.product_filters?.crm || partner.product_filters?.sales || partner.product_filters?.service)) productKey = 'crm';
 else if (partner.product_filters?.bc) productKey = 'bc';
 else if (partner.product_filters?.fsc) productKey = 'fsc';
 else if (partner.product_filters?.crm || partner.product_filters?.sales || partner.product_filters?.service) productKey = 'crm';

 return (
 <div key={partner.id} className="flex flex-col gap-3">
 <PartnerCard
 partner={partner}
 profileUrl={buildPartnerProfileUrl(partner.slug)}
 colorScheme="amber"
 productKey={productKey}
 highlightedProduct={selectedApplications.length > 0 ? selectedApplications.join(", ") : undefined}
 highlightedIndustry={selectedIndustry || undefined}
 highlightedCompanySize={selectedCompanySize || undefined}
 highlightedRevenue={selectedRevenue || undefined}
 highlightedGeography={selectedGeography || undefined}
 showRandomIndicator={true}
 />
 {underlagFilters && <UnderlagMatchBox partner={partner as any} filters={underlagFilters} />}
 <div className="flex flex-wrap items-center gap-2">
  <Button variant="outline" onClick={() => inquiry.open({ partners: [{ slug: partner.slug, name: partner.name }], type: "partner", productArea: selectedApplications[0] || null })}>Be om kontakt</Button>
  <div className="min-w-[12rem]">
   <ShortlistButton entry={{ slug: partner.slug, name: partner.name, url: buildPartnerProfileUrl(partner.slug), verified: true }} cardType="verifierad" productArea={selectedApplications[0] || null} />
  </div>
 </div>
 </div>
 );
 })}
  </div>
  </>
)}

{/* Basic-partners som matchar samma filter */}
{!verifiedOnly && selectedApplications.length > 0 && filteredBasicPartners.length > 0 && (
 <div className="mt-12 border-t border-dashed border-border pt-8">
  <div className="max-w-3xl mb-6">
    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
     {underlagMode ? "Info från publika sajter" : "Profiler som matchar din filtrering"} ({filteredBasicPartners.length})
    </h3>
   <p className="text-sm text-muted-foreground">
    Grundläggande information om partnern baserad på offentligt tillgängliga uppgifter.
    Profilerna har ännu inte verifierats av partnern och innehåller därför varken
    kontaktperson, kontaktuppgifter, kundcase eller detaljerade kompetenser – och kan
    inte väljas till jämförelse. Vill du komma i kontakt med någon av dem, hör av dig
    till oss så hjälper vi till.
   </p>
  </div>
  <BasicPartnersReveal count={filteredBasicPartners.length}>
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
   {filteredBasicPartners.map((p) => (
    <PartnerBasicCard key={p.id} partner={p} variant="list" />
   ))}
  </div>
  </BasicPartnersReveal>
 </div>
)}



 {/* Lead CTA with urgency badge */}
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
 {(selectedApplications.length > 0 || selectedIndustry || selectedCompanySize || selectedGeography) && (
 <div className="mb-6 p-4 bg-white/10 rounded border border-white/20">
 <p className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded bg-cta-orange animate-pulse" />
 Din sökning
 </p>
 <div className="flex flex-wrap gap-2">
 {selectedApplications.map(app => (
 <Badge key={app} className="bg-primary/40 text-white border-primary/50 py-1.5 px-3 ">
 {applicationFilterLabel(app)}
 </Badge>
 ))}
 {selectedIndustry && (
 <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 ">
 {selectedIndustry}
 </Badge>
 )}
 {selectedCompanySize && (
 <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 ">
 {selectedCompanySize}
 </Badge>
 )}
 {selectedGeography && (
 <Badge className="bg-white/15 text-white border-white/25 py-1.5 px-3 ">
 {selectedGeography}
 </Badge>
 )}
 </div>
 </div>
 )}
 
 <LeadCTA
 sourcePage="/valjdynamics365partner"
 selectedProducts={selectedApplications.length > 0 ? selectedApplications : undefined}
 selectedIndustry={selectedIndustry || undefined}
 selectedCompanySize={selectedCompanySize || undefined}
 selectedGeography={selectedGeography || undefined}
 variant="inline"
 />
 </div>
 </article>
 </div>
 </div>
  </section>

  {/* Compare partners CTA section - black background */}
  <section className="relative py-10 sm:py-14 md:py-16 bg-[hsl(var(--hero-dark))] overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent opacity-40" />
    <div className="relative container mx-auto px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-5">
          <ArrowLeftRight className="h-4 w-4" />
          Sida vid sida
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          Jämför upp till tre partners innan du kontaktar dem
        </h2>
        <p className="text-base sm:text-lg text-white/70 mb-8 max-w-2xl mx-auto">
          Välj två till tre partners i listan ovan och få en jämförelsevy över produktområden, branscher, geografisk närvaro, storlek och AI-mognad – så att du kan gå vidare med rätt kortlista.
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
    </div>
  </section>

  {/* Statisk partnerlista för SEO/AI – renderas i HTML även utan JS */}
 <section className="py-12 bg-background border-t border-border" aria-labelledby="alla-partners-rubrik">
 <div className="container mx-auto px-4">
 <div className="max-w-5xl mx-auto">
 <h2 id="alla-partners-rubrik" className="text-2xl md:text-3xl font-bold text-foreground mb-3">
 Alla partnerverifierade profiler
 </h2>
 <p className="text-muted-foreground mb-8">
 Komplett lista i bokstavsordning över partners som har en profil på d365.se. Använd filtreringen ovan för att hitta rätt partner för din bransch och dina applikationer.
 </p>
 <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
 {[...staticPartnerData]
 .filter((p: any) => p.is_featured)
 .sort((a: any, b: any) => a.name.localeCompare(b.name, "sv"))
.map((p: any) => {
const cardSummary = getCardSummaryData(p as DatabasePartner);
const cardText = p.ai_summary || p.ai_profile?.card_ai_summary || p.positioning_statement || "";
return (
<li key={p.id}>
<Link
to={`/partner/${p.slug}/`}
aria-label={p.name}
className="group relative flex flex-col h-full p-4 rounded-lg border-2 border-primary/25 bg-card shadow-sm hover:border-primary hover:shadow-md transition-all"
>
<div className="flex items-start justify-between gap-3 mb-1">
<div className="min-w-0 flex-1">
{p.logo_url ? (
<img
src={optimizedLogo(p.logo_url)}
alt={`${p.name} logotyp`}
loading="lazy"
className="h-10 max-w-[160px] object-contain mb-2"
/>
) : null}
<h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
{p.name}
</h3>
</div>
<ArrowRight className="w-4 h-4 mt-2 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
</div>
{cardText && (
<p className="text-xs text-muted-foreground leading-snug line-clamp-2 mb-2">
{cardText}
</p>
)}
{Array.isArray(p.applications) && p.applications.length > 0 && (
<div className="flex flex-wrap gap-1 mb-3">
{p.applications.slice(0, 3).map((app: string) => (
<Badge
key={app}
variant="outline"
className="text-[10px] px-1.5 py-0 border-primary/30 text-primary bg-primary/5"
>
{app}
</Badge>
))}
</div>
)}
<div className="mt-auto pt-2 border-t border-border/60 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
<span className="inline-flex items-center gap-1">
<MapPin className="w-3 h-3" />
{cardSummary.location}
</span>
<span className="inline-flex items-center gap-1">
<Building2 className="w-3 h-3" />
{cardSummary.industry}
</span>
<span className="inline-flex items-center gap-1">
<Users className="w-3 h-3" />
{cardSummary.size}
</span>
</div>
</Link>
</li>
);
})}
 </ul>
 </div>
 </div>
 </section>

 <UnprofiledPartnersList variant="teaser" />


 {/* CTA Section */}
 <section className="py-10 bg-secondary/50">
 <div className="container mx-auto px-4">
 <div className="max-w-3xl mx-auto">
 <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
 <div className="flex-shrink-0">
 <img 
 src={thomasLainePhoto} 
 alt="Thomas Laine" 
 className="w-48 h-48 rounded object-cover object-[50%_0%] border-4 border-primary/20"
 />
 </div>
 <div className="text-center md:text-left">
 <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
 Behöver du hjälp att välja eller upphandla Dynamics partner?
 </h2>
 <p className="text-lg text-muted-foreground">
 Boka ett möte med Thomas. Rådgivningen är kostnadsfri och ingen partner deltar i samtalet.
 </p>
 </div>
 </div>
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Button asChild size="lg" className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white h-14 text-base sm:text-lg px-6 sm:px-8 font-semibold transition-all rounded">
 <Link to="/kontakt/">
 <MessageSquare className="w-5 h-5 mr-2" />
 Kontakta oss
 </Link>
 </Button>
 <Button 
 asChild
 size="lg" 
 className="bg-[hsl(var(--cta-orange))] hover:bg-[hsl(var(--cta-orange-hover))] text-white h-14 text-base sm:text-lg px-6 sm:px-8 font-semibold transition-all rounded"
 >
 <a
 href="https://outlook.office.com/bookwithme/user/027ef733216b4a968ff9253996264ec9@dynamicfactory.se/meetingtype/fvQuVhVNCUOsg-inCRUIIg2?anonymous&ismsaljsauthenabled&ep=mlink"
 target="_blank"
 rel="noopener noreferrer"
 >
 <Calendar className="w-5 h-5 mr-2" />
 Boka en kostnadsfri rådgivning
 </a>
 </Button>
 <Button asChild size="lg" className="bg-muted hover:bg-muted/80 text-muted-foreground h-14 text-base sm:text-lg px-6 sm:px-8 font-semibold transition-all rounded border border-border">
 <a href="mailto:thomas.laine@dynamicfactory.se">
 <Mail className="w-5 h-5 mr-2" />
 Emaila mig
 </a>
 </Button>
 </div>
 </div>
 </div>
 </section>

 <RelatedPages heading="Skapa underlag innan du kontaktar partners" pages={valjPartnerRelatedPages} />
 <ContextualCta source="next-step:valj-partner" heading="Vet ni vad ni ska leta efter hos en partner nu?" text="Gör kriterierna konkreta. Svara på sex frågor så får ni en kortlista att jämföra mot det ni just läst." primaryLabel="Få rekommenderad partnerlista" links={[{ label: "Jämför relevanta partners", to: "/jamfor-partners/" }, { label: "Skapa kravspecifikation", to: "/kravspecifikation/" }, { label: "Se partners per bransch", to: "/branscher/" }]} />
</main>
 <EditorialSource sourceType="Partnerguide" />
 <Footer />
 </div>
 );
};

export default ValjPartner;