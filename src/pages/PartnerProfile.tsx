
import { useState, useEffect, useMemo } from "react";
import VerifiedPartnerBadge from "@/components/VerifiedPartnerBadge";

import { useParams, Link, useSearchParams, useNavigate, Navigate } from "react-router-dom";
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


// Map application names to product categories
const getProductCategory = (app: string): 'bc' | 'fsc' | 'sales' | 'service' | null => {
 if (app === "Business Central") return 'bc';
 if (["Finance", "Supply Chain Management", "Finance & SCM", "Finance & Supply Chain"].includes(app)) return 'fsc';
 if (["Sales", "Customer Insights", "Customer Insights (Marketing)", "Marketing"].includes(app)) return 'sales';
 if (["Customer Service", "Field Service", "Contact Center"].includes(app)) return 'service';
 return null;
};

// Get product display name
const getProductDisplayName = (category: 'bc' | 'fsc' | 'sales' | 'service'): string => {
 switch (category) {
 case 'bc': return 'Business Central';
 case 'fsc': return 'Finance & Supply Chain';
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
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestMode, setRequestMode] = useState<"contact" | "demo" | "quote">("quote");

  const openRequest = (mode: "contact" | "demo" | "quote") => {
    setRequestMode(mode);
    setRequestOpen(true);
  };

 // Track profile visit (one per slug per mount)
 useEffect(() => {
 if (!slug) return;
 const partnerId = (dbPartner as DatabasePartner | undefined)?.id || null;
 void trackPartnerView(slug, "profile_visit", `/partner/${slug}`, partnerId);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [slug]);

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
 <div className="container mx-auto px-4 py-10 mt-16">
 <div className="animate-pulse text-center text-muted-foreground">
 Laddar partnerinformation...
 </div>
 </div>
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

 {/* Premium Hero Header - Light theme */}
  <header className="relative overflow-hidden mt-16 text-slate-900">
  {/* Always-light background regardless of theme */}
  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
  {/* Subtle radial glow replacing the grid pattern */}
  <RadialGlow variant="light" />

  <div className="relative container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-4 sm:pb-6">
  <button
  onClick={() => window.history.back()}
  className="inline-flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-3 group text-sm font-medium bg-slate-200/50 px-3 py-1.5 rounded border border-slate-200"
  >
  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
   Tillbaka till partnerlistan
   </button>
   {/* Fördjupningstext används enbart för AI/SEO/AIO – ingen publik länk. */}

  {/* Main content - centered layout */}
  <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
  {/* Partner identity - logo OR name, not both; logo routes to partner landing page */}
  <div className="flex items-center justify-center mb-2">
  {partner.logo_url ? (
  <>
    <h1 className="sr-only">{partner.name}</h1>
    <Link
      to={slug ? `/partner/${slug}/` : "/"}
      className="w-48 h-28 sm:w-64 sm:h-32 flex items-center justify-center overflow-hidden rounded hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`Till ${partner.name}s landningssida`}
    >
      <img
      src={partner.logo_url}
      alt={`${partner.name} logotyp`}
      className="max-w-full max-h-full object-contain"
      />
    </Link>
  </>
  ) : (
  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
    {partner.name}
  </h1>
  )}
  </div>

  <div className="mb-4">
    <VerifiedPartnerBadge size="md" />
  </div>


  {/* Partnerns egen övergripande text */}
  {partner.description && (
    <p className="max-w-3xl w-full mb-4 text-base sm:text-lg text-slate-700 leading-relaxed">
      {partner.description}
    </p>
  )}




  {/* AI-generated summary – condensed checklist */}
  {(partner as any).ai_summary && (
    <div className="max-w-3xl w-full mb-4 rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3 sm:p-4 text-left">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--cta-orange))]" />
        AI-sammanfattning
      </div>
      <ul className="space-y-1.5">
        {(() => {
          const raw = String((partner as any).ai_summary || "");
          // Split by newlines, then by sentences if no newlines, and strip list markers
          let items = raw.includes("\n")
            ? raw.split(/\r?\n+/).filter(Boolean)
            : raw.split(/\.\s+/).filter(s => s.trim().length > 8).map(s => s.replace(/\.$/, ""));
          // Strippa listmarkörer (bullets, "1.", "2)" osv). VIKTIGT: matcha bara siffror
          // som följs av "." eller ")" – annars slukas siffror i företagsnamn (t.ex. "4PS").
          items = items.map(s => s.replace(/^\s*(?:[-–—•✅]+\s*|\d+[.)]\s+)/, "").trim()).filter(Boolean);
          return items.slice(0, 6).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-[hsl(var(--cta-orange))] mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ));
        })()}
      </ul>
      <p className="mt-2 text-[11px] text-slate-500">
        Genererad av d365.se utifrån partnerdata. Uppdateras löpande.
      </p>
    </div>
  )}

  {/* Lead CTA block moved under product tabs – see PartnerProductTabs */}


  <PartnerRequestDialog
    open={requestOpen}
    onOpenChange={setRequestOpen}
    partnerSlug={partner.slug}
    partnerName={partner.name}
    selectedProduct={activeTabProduct || selectedProduct}
    industry={selectedIndustry}
    mode={requestMode}
  />


  {/* Sales contact card with optional photo - per product if applicable */}
  {(() => {
   // Map URL ?product= value (or active tab label) to product_filters key(s)
   const selectedProduct = activeTabProduct || stashedParams.get('product') || '';
   const productToKeys = (p: string): Array<'bc' | 'fsc' | 'sales' | 'service' | 'crm'> => {
   const v = p.toLowerCase();
   if (v.includes('business central')) return ['bc'];
   if (v.includes('finance') || v.includes('supply')) return ['fsc'];
   // CRM / Customer Engagement tab combines sales + service
   if (v.includes('crm') || v.includes('customer engagement')) return ['sales', 'service', 'crm'];
   if (v.includes('sales') || v.includes('marketing') || v.includes('customer insights')) return ['sales', 'crm'];
   if (v.includes('service') || v.includes('contact center') || v.includes('field')) return ['service', 'crm'];
   return [];
   };
   const pf = (partner as any)?.product_filters || {};
   const keys = productToKeys(selectedProduct);
   const productContact = keys
     .map((k) => pf[k])
     .find((c) => c && (c.contactName || c.contactEmail || c.contactPhone)) || null;
   const hasProductContact = !!productContact;

  const displayName = hasProductContact ? productContact.contactName : partner?.contactPerson;
  const displayEmail = hasProductContact ? productContact.contactEmail : partner?.email;
  const displayPhone = hasProductContact ? productContact.contactPhone : partner?.phone;
  const displayPhoto = hasProductContact && productContact.contactPhotoUrl
  ? productContact.contactPhotoUrl
  : (partner as any)?.contact_photo_url;

  // Video: prefer per-product video, fall back to partner main video
  const productVideoId = extractYouTubeId(productContact?.youtubeVideoId);
  const mainVideoId = extractYouTubeId((partner as any)?.youtube_video_id);
  const displayVideoId = productVideoId || mainVideoId;

  if (!displayName && !displayEmail && !displayPhone && !displayVideoId) return null;

  return (
  <div className="mt-1 inline-flex flex-col sm:flex-row items-center gap-4 px-5 py-4 rounded bg-white/80 border border-emerald-200 max-w-2xl">
  <div className="relative shrink-0">
  {displayPhoto ? (
  <img
  src={displayPhoto}
  alt={`Foto av ${displayName || 'kontaktperson'}`}
  loading="lazy"
  className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover border-2 border-emerald-200 "
  />
  ) : (
  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
  <User className="w-8 h-8 text-emerald-600" />
  </div>
  )}
  {displayVideoId && (
  <button
  type="button"
  onClick={() => setVideoOpen(true)}
  aria-label={`Spela introduktionsvideo från ${partner.name}`}
  className="absolute inset-0 rounded bg-black/40 hover:bg-black/55 transition-colors flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
  >
  <span className="w-9 h-9 sm:w-11 sm:h-11 rounded bg-white/95 flex items-center justify-center group-hover:scale-110 transition-transform">
  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 fill-emerald-700 ml-0.5" />
  </span>
  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
  Video
  </span>
  </button>
  )}
  </div>

  <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
  {hasProductContact && selectedProduct
  ? `Din kontaktperson för ${selectedProduct} hos ${partner.name}`
  : `Din kontaktperson hos ${partner.name}`}
  </span>
  {displayName && (
  <span className="text-base font-semibold text-slate-900">
  {displayName}
  </span>
  )}
  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 mt-1">
  {displayEmail && (
  <a
  href={`mailto:${displayEmail}`}
  className="inline-flex items-center gap-1.5 text-sm text-slate-700 hover:text-emerald-700 transition-colors"
  >
  <Mail className="w-3.5 h-3.5 text-emerald-600" />
  <span className="font-medium">{displayEmail}</span>
  </a>
  )}
  {displayPhone && (
  <a
  href={`tel:${String(displayPhone).replace(/[\s\-()]/g, "")}`}
  className="inline-flex items-center gap-1.5 text-sm text-slate-700 hover:text-emerald-700 transition-colors"
  >
  <Phone className="w-3.5 h-3.5 text-emerald-600" />
  <span className="font-medium">{formatSwedishPhone(String(displayPhone))}</span>
  </a>
  )}
  </div>
  </div>
  </div>
  );
   })()}


  </div>
  </div>
 
 {/* Bottom fade to content */}
 <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
 </header>

 {/* <DecisionProfile partner={partner} /> tillfälligt dold */}

 <PartnerAiInsights partner={partner as any} />





  {/* Events Section */}
  {partner?.id && (
   <section className="py-8">
    <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
     <PartnerEventsSection partnerId={partner.id} partnerName={partner.name} />
    </div>
   </section>
  )}



  {/* Tabbed product profile */}
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



 <TrustBanner variant="compact" />


  <Footer />

  <StickyContactCTA
    partnerName={partner.name}
    onBookMeeting={() => openRequest("demo")}
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
