
import { optimizedLogo } from "@/lib/optimizedLogo";
import { useState, useEffect, useMemo } from "react";
import PartnerProfileOpening from "@/components/partner/PartnerProfileOpening";
import {
  PROFILE_EXPLAINER_VERIFIED_MORE,
  PROFILE_EXPLAINER_VERIFIED_SHORT,
} from "@/data/profileModel";

import { useParams, useSearchParams, useNavigate, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustBanner from "@/components/TrustBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Building2, 
  Sparkles, 
  Briefcase, 
  CheckCircle2,
  MapPin, 
  Layers, 
  Users,
  User,
  Mail,
  Phone,
  Package,
  Play,
  ArrowLeftRight
} from "lucide-react";
import PartnerVideoModal from "@/components/PartnerVideoModal";
import { extractYouTubeId } from "@/lib/youtube";
import { formatSwedishPhone } from "@/lib/utils";
import LeadCTA from "@/components/LeadCTA";
import StickyContactCTA from "@/components/partner/StickyContactCTA";
import PartnerRequestDialog from "@/components/PartnerRequestDialog";
import PartnerEventsSection from "@/components/PartnerEventsSection";
import DecisionProfile from "@/components/partner/DecisionProfile";
import PartnerAiInsights from "@/components/partner/PartnerAiInsights";
import PartnerPublicSourcesSection from "@/components/partner/PartnerPublicSourcesSection";
import PartnerAiVisibilityCard from "@/components/PartnerAiVisibilityCard";
import PartnerDecisionOverview from "@/components/partner/PartnerDecisionOverview";
import ExtendedCompetenciesSection from "@/components/partner/ExtendedCompetenciesSection";
import PartnerProductTabs, { resolveInitialTab } from "@/components/partner/PartnerProductTabs";
import { RadialGlow } from "@/components/RadialGlow";
import type { TabKey } from "@/components/partner/types";

import { usePartner, DatabasePartner } from "@/hooks/usePartners";
import { getCumulativeGeographyDisplay } from "@/data/partners";
import {
 slugToProductName,
 productNameToSlug,
 buildPartnerProductPath,
} from "@/lib/partnerProductSlug";

import SEOHead from "@/components/SEOHead";
import { PartnerOrganizationSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { buildMetaTitle } from "@/lib/metaTitle";
import { buildMetaDescription } from "@/lib/metaDescription";
import { trackPartnerView } from "@/utils/trackPartnerView";
import { trackPartnerCardEvent, trackPartnerEvent, isReturningVisitorForPartner } from "@/utils/trackPartnerEvent";
import ShortlistButton from "@/components/ShortlistButton";
import { usePartnerCompare } from "@/contexts/PartnerCompareContext";
import PartnerDecisionActions from "@/components/partner/PartnerDecisionActions";


// Map application names to product categories
const getProductCategory = (app: string): 'bc' | 'fsc' | 'sales' | 'service' | null => {
 if (app === "Business Central") return 'bc';
 if (["Finance", "Supply Chain Management", "Finance & SCM", "Finance & Supply Chain", "F&SCM"].includes(app)) return 'fsc';
 if (["Sales", "Customer Insights", "Customer Insights (Marketing)", "Marketing"].includes(app)) return 'sales';
 if (["Customer Service", "Field Service", "Contact Center"].includes(app)) return 'service';
 return null;
};

// Get product display name
const getProductDisplayName = (category: 'bc' | 'fsc' | 'sales' | 'service'): string => {
 switch (category) {
 case 'bc': return 'Business Central';
 case 'fsc': return 'Finance & Supply Chain Management (F&O)';
 case 'sales': return 'Sälj & Marknad';
 case 'service': return 'Kundservice';
 }
};

// Get applications for a product category
const getApplicationsForCategory = (apps: string[], category: 'bc' | 'fsc' | 'sales' | 'service'): string[] => {
 return apps.filter(app => getProductCategory(app) === category);
};

// Get default applications for a category when none are in the applications array
const getDefaultApplicationsForCategory = (category: 'bc' | 'fsc' | 'sales' | 'service'): string[] => {
 switch (category) {
 case 'bc': return ['Business Central'];
 case 'fsc': return ['Finance', 'Supply Chain Management'];
 case 'sales': return ['Sales', 'Customer Insights (Marketing)'];
 case 'service': return ['Customer Service', 'Field Service', 'Contact Center'];
 }
};

interface PartnerProfileProps {
 initialData?: DatabasePartner | null;
}

const PartnerProfile = ({ initialData }: PartnerProfileProps = {}) => {
 const { slug, productSlug } = useParams<{ slug: string; productSlug?: string }>();
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();

 // Produkt från URL-subpath (/partner/:slug/:productSlug/) har högsta prioritet.
 const productFromPath = useMemo(
 () => slugToProductName(productSlug),
 [productSlug],
 );

 // Legacy: ?product=… → 301-liknande klient-redirect till nytt slug-format
 // så SEO konsolideras till en (1) canonical URL per partner+produkt.
 useEffect(() => {
 if (productFromPath) return; // redan på nya URL:en
 if (!slug) return;
 const legacyProduct = searchParams.get("product");
 if (!legacyProduct) return;
 const productSlugFromLegacy = productNameToSlug(legacyProduct);
 if (!productSlugFromLegacy) return;
 // Behåll övriga query-params (industry, companySize, geography, revenue)
 const rest = new URLSearchParams(searchParams);
 rest.delete("product");
 const restQs = rest.toString();
 const target =
 buildPartnerProductPath(slug, productSlugFromLegacy) +
 (restQs ? `?${restQs}` : "");
 navigate(target, { replace: true });
 }, [productFromPath, slug, searchParams, navigate]);

 // Filter context: URL subpath / URL query > sessionStorage (set by PartnerCard)
 const stashedParams = useMemo(() => {
 if (typeof window === "undefined" || !slug) return new URLSearchParams();
 const base = new URLSearchParams(searchParams.toString());
 if (productFromPath && !base.get("product")) {
 base.set("product", productFromPath);
 }
 if (base.toString()) return base;
 try {
 const stashed = sessionStorage.getItem(`partner-context:${slug}`);
 return stashed ? new URLSearchParams(stashed) : new URLSearchParams();
 } catch {
 return new URLSearchParams();
 }
 }, [slug, searchParams, productFromPath]);

  const selectedProduct = stashedParams.get("product") || undefined;
  const initialTabKey = useMemo<TabKey>(
    () => resolveInitialTab(productFromPath, selectedProduct),
    [productFromPath, selectedProduct],
  );
 const selectedIndustry = stashedParams.get("industry") || undefined;
 const selectedCompanySize = stashedParams.get("companySize") || undefined;
 const selectedRevenue = stashedParams.get("revenue") || undefined;
 const selectedGeography = stashedParams.get("geography") || undefined;
 const { data: dbPartner, isLoading } = usePartner(slug);
 
 // Use initialData for SSR, then hydrate with live data from DB
 const partner = dbPartner ?? initialData ?? null;

  const [videoOpen, setVideoOpen] = useState(false);
  const [activeTabProduct, setActiveTabProduct] = useState<string | null>(null);
  const [activeTabKey, setActiveTabKey] = useState<TabKey>(initialTabKey);
  const { toggle: compareToggle, isSelected: compareSelected } = usePartnerCompare();
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestMode, setRequestMode] = useState<"contact" | "demo" | "quote">("quote");

  const openRequest = (mode: "contact" | "demo" | "quote") => {
    setRequestMode(mode);
    setRequestOpen(true);
    if (slug) {
      // Kortspecifik handling: vilken CTA på partnerkortet som klickades
      trackPartnerCardEvent(
        mode === "contact" ? "klick_stall_fraga" : mode === "demo" ? "klick_boka_demo" : "klick_uppskattning_kostnad",
        { slug, id: (dbPartner as DatabasePartner | undefined)?.id || null },
        "verifierad",
        activeTabProduct || selectedProduct || null,
      );
    }
    if (slug) {
      // Nivå 4 – lead: besökaren begär kontakt/offert via profilen
      trackPartnerEvent({
        event: mode === "contact" ? "partner_contact_request" : "partner_intro_request",
        partnerSlug: slug,
        partnerId: (dbPartner as DatabasePartner | undefined)?.id || null,
        metadata: { mode },
      });
    }
  };

 // Track profile visit (one per slug per mount)
 useEffect(() => {
 if (!slug) return;
 const partnerId = (dbPartner as DatabasePartner | undefined)?.id || null;
 void trackPartnerView(slug, "profile_visit", `/partner/${slug}`, partnerId);
 // Nivå 2 – engagemang: profilbesök och återbesök
 const returning = isReturningVisitorForPartner(slug);
 trackPartnerEvent({
  event: returning ? "partner_profile_return" : "partner_profile_view",
  partnerSlug: slug,
  partnerId,
 });
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [slug]);

 // Nivå 2 – engagemang: klick på kundcase och kompetensområden (delegerat)
 const handleProfileEngagementClick = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!slug) return;
  const target = (e.target as HTMLElement)?.closest?.("[data-engagement]") as HTMLElement | null;
  if (!target) return;
  const kind = target.getAttribute("data-engagement");
  if (kind !== "case" && kind !== "competency") return;
  trackPartnerEvent({
   event: kind === "case" ? "partner_case_click" : "partner_competency_click",
   partnerSlug: slug,
   partnerId: (dbPartner as DatabasePartner | undefined)?.id || null,
   metadata: { label: (target.getAttribute("data-engagement-label") || target.textContent || "").slice(0, 120) },
  });
  if (kind === "case") {
   trackPartnerCardEvent(
    "klick_kundcase",
    { slug, id: (dbPartner as DatabasePartner | undefined)?.id || null },
    "verifierad",
    activeTabProduct || selectedProduct || null,
   );
  }
 };

 // Get product categories this partner supports
 // Get product categories this partner supports - check both applications array AND product_filters
 const getProductCategories = (): ('bc' | 'fsc' | 'sales' | 'service')[] => {
 if (!partner) return [];
 const categories = new Set<'bc' | 'fsc' | 'sales' | 'service'>();
 
 // Check applications array
 partner.applications.forEach(app => {
 const cat = getProductCategory(app);
 if (cat) categories.add(cat);
 });
 
 // Also check product_filters for categories with valid data
 const productFilters = partner?.product_filters as Record<string, unknown> | undefined;
 if (productFilters) {
 const filterCategories: ('bc' | 'fsc' | 'sales' | 'service')[] = ['bc', 'fsc', 'sales', 'service'];
 filterCategories.forEach(cat => {
 if (productFilters[cat]) {
 categories.add(cat);
 }
 });
 }
 
 return Array.from(categories);
 };

 // Get industries for a specific product
 const getIndustriesForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): { primary: string[] } => {
 const dbProductFilters = partner?.product_filters as Record<string, { industries?: string[] }> | undefined;
 
 // Try the direct key first (sales, service, bc, fsc)
 if (dbProductFilters?.[category]?.industries && dbProductFilters[category].industries.length > 0) {
 return { primary: dbProductFilters[category].industries };
 }
 
 // Legacy fallback: sales/service were previously stored under 'crm'
 if (category === 'sales' || category === 'service') {
 if (dbProductFilters?.['crm']?.industries && dbProductFilters['crm'].industries.length > 0) {
 return { primary: dbProductFilters['crm'].industries };
 }
 }
 
 // Final fallback to general industries
 const allIndustries = partner?.industries || [];
 return { primary: allIndustries.slice(0, 3) };
 };

 // Get geography for a specific product - prioritize database data, return as array
  // Normalize to only valid values: Sverige, Norden, Europa, Globalt (in this exact order)
  const getGeographyForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string[] => {
  const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
  
  // Valid geography values in display order - legacy "Internationellt" / "Övriga världen" are mapped to "Globalt"
  const geographyOrder = ["Sverige", "Norden", "Europa", "Globalt"];
  
  const normalizeAndSortGeography = (geoArray: string[]): string[] => {
  const normalized = geoArray.map(geo => 
  geo === "Internationellt" || geo === "Övriga världen" ? "Globalt" : geo
  );
 // Find the broadest geography level and include all levels up to it
 const maxIndex = Math.max(...normalized.map(geo => geographyOrder.indexOf(geo)).filter(i => i >= 0));
 if (maxIndex < 0) return [];
 // Return all levels from Sverige up to the broadest selected
 return geographyOrder.slice(0, maxIndex + 1);
 };
 
 // Check database partner's product_filters first
 const dbProductFilters = partner?.product_filters as Record<string, { geography?: string | string[] }> | undefined;
 const dbProductGeo = dbProductFilters?.[filterKey]?.geography;
 if (dbProductGeo) {
 const geoArray = Array.isArray(dbProductGeo) ? dbProductGeo : [dbProductGeo];
 return normalizeAndSortGeography(geoArray);
 }
 // Fall back to partner's geography array
 if (partner?.geography && partner.geography.length > 0) {
 return normalizeAndSortGeography(partner.geography);
 }
 return [];
 };

 // Get customer examples for a specific product - only from database
 const getCustomerExamplesForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string[] => {
 const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
 // Check database partner's product_filters
 const dbProductFilters = partner?.product_filters as Record<string, { customerExamples?: string[] }> | undefined;
 const dbCustomerExamples = dbProductFilters?.[filterKey]?.customerExamples;
 if (dbCustomerExamples && dbCustomerExamples.length > 0) return dbCustomerExamples;
 return [];
 };

 // Get product description for a specific product (with AI-generated flag)
 const getProductDescriptionForProduct = (
 category: 'bc' | 'fsc' | 'sales' | 'service',
 ): { text: string; aiGenerated: boolean } | null => {
 const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
 const dbProductFilters = partner?.product_filters as
 | Record<string, { productDescription?: string; productDescriptionAiGenerated?: boolean }>
 | undefined;
 const pf = dbProductFilters?.[filterKey] || dbProductFilters?.[category];
 const raw: unknown = (pf as any)?.productDescription;
 const text = typeof raw === "string" ? raw.trim() : Array.isArray(raw) ? (raw as unknown[]).filter((x): x is string => typeof x === "string").join("\n").trim() : "";
 if (!text) return null;
 };

 // Get per-product sales contact
 const getContactForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): { name?: string; email?: string; phone?: string } | null => {
 const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
 const dbProductFilters = partner?.product_filters as Record<string, { contactName?: string; contactEmail?: string; contactPhone?: string }> | undefined;
 const pf = dbProductFilters?.[filterKey];
 // Also check direct key
 const directPf = dbProductFilters?.[category];
 const contact = pf || directPf;
 if (contact?.contactName || contact?.contactEmail || contact?.contactPhone) {
 return { name: contact.contactName, email: contact.contactEmail, phone: contact.contactPhone };
 }
 return null;
 };

 // Sweden regions and cities functions removed - no longer displaying regions on profiles

 // Get customer case links for a specific product
 const getCustomerCaseLinksForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string[] => {
 const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
 const dbProductFilters = partner?.product_filters as Record<string, { customerCaseLinks?: string[] }> | undefined;
 return dbProductFilters?.[filterKey]?.customerCaseLinks || [];
 };

 // Get landing page URL for a specific product
 const getLandingPageUrlForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): string | null => {
 const filterKey = (category === 'sales' || category === 'service') ? 'crm' : category;
 const dbProductFilters = partner?.product_filters as Record<string, { landingPageUrl?: string }> | undefined;
 const url = dbProductFilters?.[filterKey]?.landingPageUrl || dbProductFilters?.[category]?.landingPageUrl;
 return typeof url === "string" && url.trim().length > 0 ? url.trim() : null;
 };

 // Get industry apps for a specific product category
 interface IndustryApp {
 name: string;
 url: string;
 application: string;
 industry: string;
 description: string;
 }

 const getIndustryAppsForProduct = (category: 'bc' | 'fsc' | 'sales' | 'service'): IndustryApp[] => {
 const rawApps = partner?.industry_apps;
 if (!rawApps || !Array.isArray(rawApps)) return [];
 
 // Map category to matching application names
 const categoryApps: Record<string, string[]> = {
 bc: ['Business Central'],
 fsc: ['Finance', 'Supply Chain Management'],
 sales: ['Sales', 'Customer Insights (Marketing)'],
 service: ['Customer Service', 'Field Service', 'Contact Center'],
 };
 
 const matchingApps = categoryApps[category] || [];
 return rawApps.filter((app: IndustryApp) => 
 matchingApps.includes(app.application)
 );
 };

 if (isLoading && !initialData) {
 return (
 <div className="min-h-screen bg-background">
 <Navbar />
 <main>
 <div className="container mx-auto px-4 py-10 mt-16">
 <div className="animate-pulse text-center text-muted-foreground">
 Laddar partnerinformation...
 </div>
 </div>
 </main>
 <Footer />
 </div>
 );
 }

 if (!partner) {
 // 301-liknande redirect till partnerlistan för att undvika soft-404 i Google
 return <Navigate to="/alla-d365-partners/" replace />;
 }

 const productCategories = getProductCategories();
 const hasFilters = selectedProduct || selectedIndustry || selectedCompanySize || selectedGeography;

 const seoApps = (partner.applications || []).slice(0, 3).join(", ");
 // Kortare baseTitle så hela titeln får plats inom 60 tecken utan ellipsis.
 const seoTitle = buildMetaTitle({
 baseTitle: `${partner.name} – Dynamics 365 Partner`,
 primaryKeyword: "Dynamics 365",
 }).value;
 const seoDescription = buildMetaDescription([
 partner.description,
 seoApps
 ? `${partner.name} är en Microsoft Dynamics 365-partner med fokus på ${seoApps}. Se kompetenser, referenser och kontakta dem via d365.se.`
 : undefined,
 `${partner.name} är en Microsoft Dynamics 365-partner som hjälper svenska företag med implementation, support och utveckling.`,
 ]);

 return (
 <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
 <SEOHead
 title={seoTitle}
 description={seoDescription}
 canonicalPath={buildPartnerProductPath(partner.slug, productFromPath ?? undefined)}
 keywords={[partner.name, "Dynamics 365", "Microsoft partner", ...(partner.applications || [])].join(", ")}
 ogImage={partner.logo_url || undefined}
 ogImageAlt={`${partner.name} – Microsoft Dynamics 365 Partner`}
 ogType="website"
 />
 <PartnerOrganizationSchema
 name={partner.name}
 description={partner.description}
 slug={partner.slug}
 website={partner.website}
 logoUrl={partner.logo_url || undefined}
 applications={partner.applications || []}
 />
 <BreadcrumbSchema
 items={[
 { name: "Hem", url: "https://d365.se/" },
 { name: "Välj partner", url: "https://d365.se/valjdynamics365partner/" },
 { name: partner.name, url: `https://d365.se/partner/${partner.slug}/` },
 ]}
 />


 <Navbar />
 <main>

  <div className="partner-profile-premium mt-16">
    <PartnerProfileOpening partner={partner} product={activeTabProduct || selectedProduct} industry={selectedIndustry} onIntro={() => openRequest("contact")} onVideo={() => setVideoOpen(true)} />
    <PartnerRequestDialog open={requestOpen} onOpenChange={setRequestOpen} partnerSlug={partner.slug} partnerName={partner.name} selectedProduct={activeTabProduct || selectedProduct} industry={selectedIndustry} mode={requestMode} />
    <PartnerDecisionOverview partner={partner} />

 <div className="partner-profile-continuation">
 <PartnerAiInsights partner={partner as any} />

 <PartnerPublicSourcesSection partner={partner as any} />

 {slug && <PartnerAiVisibilityCard slug={slug} partnerName={partner.name} />}

 <section className="py-6">
  <div
   className="container mx-auto px-4 sm:px-6 max-w-4xl"
   data-engagement="competency"
   onClickCapture={handleProfileEngagementClick}
  >
   <ExtendedCompetenciesSection
    competencies={(partner as any)?.extended_competencies}
    partnerName={partner?.name}
   />
  </div>
 </section>






  {/* Events Section */}
  {partner?.id && (
   <section className="py-8">
    <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
     <PartnerEventsSection partnerId={partner.id} partnerName={partner.name} />
    </div>
   </section>
  )}



  {/* Tabbed product profile */}
  <div data-engagement="case" onClickCapture={handleProfileEngagementClick}>
  <PartnerProductTabs
   partner={partner}
   initialTab={resolveInitialTab(productFromPath, selectedProduct)}
   selectedIndustry={selectedIndustry}
   selectedCompanySize={selectedCompanySize}
   selectedGeography={selectedGeography}
   selectedRevenue={selectedRevenue}
    onActiveTabChange={(tab, label) => {
      setActiveTabKey(tab);
      setActiveTabProduct(label);
    }}
   onRequest={openRequest}
    />
  </div>

 </div>
 </div>
 <TrustBanner variant="compact" />


 </main>
  <Footer />

  <StickyContactCTA
    partnerSlug={slug || ""}
    partnerName={partner.name}
    product={activeTabProduct || selectedProduct}
    industry={selectedIndustry}
    onIntro={() => openRequest("contact")}
  />


 <PartnerVideoModal
 videoId={videoOpen ? (extractYouTubeId((() => {
 const sp = stashedParams.get('product') || '';
 const v = sp.toLowerCase();
 let key: 'bc' | 'fsc' | 'sales' | 'service' | null = null;
 if (v.includes('business central')) key = 'bc';
 else if (v.includes('finance') || v.includes('supply')) key = 'fsc';
 else if (v.includes('sales') || v.includes('marketing') || v.includes('customer insights')) key = 'sales';
 else if (v.includes('service') || v.includes('contact center') || v.includes('field')) key = 'service';
 const pf = (partner as any)?.product_filters || {};
 const productVid = key ? pf[key]?.youtubeVideoId : null;
 return productVid || (partner as any)?.youtube_video_id;
 })())) : null}
 partnerName={partner.name}
 onClose={() => setVideoOpen(false)}
 />
 </div>
 );
};

export default PartnerProfile;
