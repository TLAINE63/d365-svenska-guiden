import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import Partnerprogram from './pages/Partnerprogram';
import PartnerBasicProfile from './pages/PartnerBasicProfile';
import { normalizeBasicPartnerRow, type BasicPartner } from './hooks/useBasicPartners';

/** Filled by getDynamicRoutes() before prerendering so /basic/:slug renders real HTML. */
const BASIC_PARTNERS_BY_SLUG: Record<string, BasicPartner> = {};
import { Routes, Route, Navigate } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from '@/components/ui/tooltip';

// Direct page imports (no lazy loading for SSR)
import Index from './pages/Index';
import CRM from './pages/CRM';
import BusinessCentral from './pages/BusinessCentral';
import FinanceSupplyChain from './pages/FinanceSupplyChain';
import ERPOverview from './pages/ERPOverview';
import Affarssystem from './pages/Affarssystem';

import Copilot from './pages/Copilot';
import Agents from './pages/Agents';
import AIOverview from './pages/AIOverview';
import AIReadiness from './pages/AIReadiness';
import ContactUs from './pages/ContactUs';
import ValjPartner from './pages/ValjPartner';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NeedsAnalysis from './pages/NeedsAnalysis';
import SalesMarketingNeedsAnalysis from './pages/SalesMarketingNeedsAnalysis';
import CustomerServiceNeedsAnalysis from './pages/CustomerServiceNeedsAnalysis';
import KomIgang from './pages/KomIgang';
import Branschlosningar from './pages/Branschlosningar';
import Branscher from './pages/Branscher';
import IndustryPage from './pages/IndustryPage';
import { STANDARD_INDUSTRIES } from './data/standardIndustries';
import D365Sales from './pages/D365Sales';
import D365Marketing from './pages/D365Marketing';
import D365CustomerService from './pages/D365CustomerService';
import D365FieldService from './pages/D365FieldService';
import D365ContactCenter from './pages/D365ContactCenter';
import D365ProjectOperations from './pages/D365ProjectOperations';
import D365Commerce from './pages/D365Commerce';
import D365HumanResources from './pages/D365HumanResources';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import QA from './pages/QA';
import PartnerProfile from './pages/PartnerProfile';
import Kunskapscenter from './pages/Kunskapscenter';
import KunskapscenterHub from './pages/KunskapscenterHub';
import { KNOWLEDGE_HUBS } from './data/knowledgeHubs';
import RequirementsSpec from './pages/RequirementsSpec';
import RequirementsSpecSales from './pages/RequirementsSpecSales';
import RequirementsSpecMarketing from './pages/RequirementsSpecMarketing';
import RequirementsSpecCustomerService from './pages/RequirementsSpecCustomerService';
import DeepDiveArticle from './pages/DeepDiveArticle';
import BlogArticle from './pages/BlogArticle';
import SmartSearch from './pages/SmartSearch';
import ProductPartnersSverige from './pages/ProductPartnersSverige';
import PartnerMarketReport2026 from './pages/PartnerMarketReport2026';
import PartnersSitemap from './pages/PartnersSitemap';
import AllD365Partners from './pages/AllD365Partners';
import PartnersPerBransch from './pages/PartnersPerBransch';
import OmThomasLaine from './pages/OmThomasLaine';
import OmMichaelUhman from './pages/OmMichaelUhman';
import OwnershipAndInterests from './pages/OwnershipAndInterests';
import Priser from './pages/Priser';
import Kostnad from './pages/Kostnad';
import ImplementationCalculator from './pages/ImplementationCalculator';
import Upphandlingsresan from './pages/Upphandlingsresan';
import Upphandlingsguiden from './pages/Upphandlingsguiden';
import BcMatchningstest from './pages/BcMatchningstest';
import FscmMatchningstest from './pages/FscmMatchningstest';
import CrmMatchningstest from './pages/CrmMatchningstest';
import CrmMatchningstestResultat from './pages/CrmMatchningstestResultat';
import BcRoiCalculator from './pages/BcRoiCalculator';
import SalesRoiCalculator from './pages/SalesRoiCalculator';
import ProductRoiPage from './pages/ProductRoiPage';
import Beslutsmognadsindex from './pages/Beslutsmognadsindex';
import D365TillaggKatalog from './pages/D365TillaggKatalog';
import Partnernytt from './pages/Partnernytt';
import Friskrivning from './pages/Friskrivning';
import ComparePartners from './pages/ComparePartners';
import ErpComparisonsHub from './pages/ErpComparisonsHub';
import ErpComparisonPage from './pages/ErpComparisonPage';
import VideoLanding from './pages/VideoLanding';
import { PRODUCT_COMPARISONS } from './data/erpComparisons';
import { KNOWLEDGE_VIDEOS } from './data/knowledgeVideos';
import { PRODUCT_PARTNERS_SVERIGE } from './data/productPartnersSverige';
import { ALL_DEEP_DIVE_ARTICLES } from './data/bcArticles';
import { BLOG_ARTICLES } from './data/blogArticles';
import partnerRoutesData from './data/partnerRoutes.json';
import partnerDataJson from './data/partnerData.json';

// Re-export buildRedirectHtml; LEGACY_REDIRECTS is extended below with
// dynamic kunskapscenter redirects that map old hyphenated/d365-prefixed
// slugs (still referenced by Google Search Console) to the current
// canonical productSlug used in routes/sitemap.
import {
  LEGACY_REDIRECTS as STATIC_LEGACY_REDIRECTS,
  type LegacyRedirect,
} from './lib/legacy-redirects';
export { buildRedirectHtml } from './lib/legacy-redirects';

// Build a slug→partner lookup for SSR
const partnerDataBySlug: Record<string, typeof partnerDataJson[number]> = {};
partnerDataJson.forEach((p) => {
  if (p.slug) partnerDataBySlug[p.slug] = p;
});

// Map a raw partnerData.json entry to the DatabasePartner shape used by components
function mapPartnerForSSR(p: typeof partnerDataJson[number]): any {
  return {
    ...p,
    contactPerson: (p as any).contact_person,
    address: null,
    secondary_industries: (p as any).secondary_industries || [],
    geography: (p as any).geography || ['Sverige'],
    product_filters: ((p as any).product_filters as any) || {},
    industry_apps: ((p as any).industry_apps as any) || [],
    industry_pitches: ((p as any).industry_pitches as any) || [],
    invoice_email: (p as any).invoice_email || null,
    invoice_contact: (p as any).invoice_contact || null,
    org_number: (p as any).org_number || null,
    legal_name: (p as any).legal_name || null,
    contact_photo_url: (p as any).contact_photo_url || null,
    youtube_video_id: (p as any).youtube_video_id || null,
    activation_date: null,
    monthly_fee: null,
    cancellation_date: null,
    admin_notes: null,
    admin_contact_name: null,
    admin_contact_email: null,
    agreement_signed: (p as any).agreement_signed ?? false,
    related_party: (p as any).related_party ?? false,
  };
}

// Pre-build per-industry partner lists (filtered + mapped) for SSR injection.
// Only includes featured partners (matches usePartners behavior).
const partnersByIndustrySlug: Record<string, any[]> = {};
{
  const featured = partnerDataJson.filter((p: any) => p.is_featured !== false);
  for (const ind of STANDARD_INDUSTRIES) {
    const matches = featured.filter((p: any) => {
      const pf = p.product_filters || {};
      return (['bc', 'fsc', 'sales', 'service'] as const).some((k) => {
        const inds = (pf as any)[k]?.industries || [];
        return inds.includes(ind.name);
      });
    });
    partnersByIndustrySlug[ind.slug] = matches.map(mapPartnerForSSR);
  }
}
export interface PrerenderRoute {
  path: string;
  priority: string;
  changefreq: string;
  lastmod?: string; // ISO date YYYY-MM-DD
  meta?: { title: string; description: string };
  sitemap?: boolean;
}

export const routes: PrerenderRoute[] = [
  // Intent-separation refresh 2026-05-19: bumped lastmod on the four pillar URLs
  // so Google re-crawls the updated titles/H1/meta after the cannibalization fix.
  { path: '/', priority: '1.0', changefreq: 'weekly', lastmod: '2026-05-19' },
  { path: '/valjdynamics365partner', priority: '1.0', changefreq: 'weekly' },
  { path: '/erp', priority: '0.9', changefreq: 'weekly', lastmod: '2026-06-26' },
  // /affarssystem är konsoliderad in i /erp (301-redirect via Affarssystem.tsx)

  { path: '/businesscentral', priority: '0.9', changefreq: 'weekly', lastmod: '2026-05-19' },
  { path: '/finance-supply-chain', priority: '0.8', changefreq: 'monthly' },
  { path: '/crm', priority: '0.9', changefreq: 'monthly' },
  // /branschlosningar är ersatt av /branscher (301-redirect i App.tsx)
  { path: '/branscher', priority: '0.8', changefreq: 'monthly' },
  ...STANDARD_INDUSTRIES.map((i) => ({
    path: `/branscher/${i.slug}`,
    priority: '0.7',
    changefreq: 'monthly' as const,
  })),
  { path: '/d365sales', priority: '0.8', changefreq: 'monthly' },
  { path: '/d365marketing', priority: '0.8', changefreq: 'monthly' },
  { path: '/d365customerservice', priority: '0.8', changefreq: 'monthly' },
  { path: '/d365fieldservice', priority: '0.8', changefreq: 'monthly' },
  { path: '/d365contactcenter', priority: '0.8', changefreq: 'monthly' },
  { path: '/d365projectoperations', priority: '0.8', changefreq: 'monthly' },
  { path: '/d365commerce', priority: '0.8', changefreq: 'monthly' },
  { path: '/d365humanresources', priority: '0.8', changefreq: 'monthly' },
  { path: '/copilot', priority: '0.8', changefreq: 'monthly' },
  { path: '/agents', priority: '0.9', changefreq: 'monthly' },
  { path: '/aioversikt', priority: '0.7', changefreq: 'monthly' },
  { path: '/ai-readiness', priority: '0.6', changefreq: 'monthly' },
  { path: '/ERPbehovsanalys', priority: '0.8', changefreq: 'monthly' },
  { path: '/CRMbehovsanalys', priority: '0.7', changefreq: 'monthly' },
  { path: '/kundservice-behovsanalys', priority: '0.7', changefreq: 'monthly' },
  { path: '/beslutsmognad', priority: '0.7', changefreq: 'monthly' },
  { path: '/events', priority: '0.8', changefreq: 'weekly' },
  { path: '/qa', priority: '0.6', changefreq: 'monthly' },
  { path: '/kontakt', priority: '0.7', changefreq: 'monthly' },
  { path: '/om-thomas-laine', priority: '0.6', changefreq: 'yearly' },
  { path: '/om-michael-uhman', priority: '0.6', changefreq: 'yearly' },
  { path: '/agande-och-intressen', priority: '0.5', changefreq: 'yearly' },
  { path: '/priser', priority: '0.8', changefreq: 'monthly' },
  { path: '/kostnad', priority: '0.8', changefreq: 'monthly' },
  { path: '/implementationskalkylator', priority: '0.8', changefreq: 'monthly' },
  { path: '/dataskydd', priority: '0.3', changefreq: 'yearly', sitemap: false },
  { path: '/kom-igang', priority: '0.8', changefreq: 'monthly' },
  {
    path: '/partnerprogram',
    priority: '0.7',
    changefreq: 'monthly',
    meta: {
      title: 'För Dynamics 365-partners | Profilera er på d365.se',
      description:
        'd365.se kartlägger Sveriges Dynamics 365-partners. Se hur en profilerad partnerprofil stärker er synlighet när kunder jämför och väljer partner.',
    },
  },
  { path: '/kunskapscenter', priority: '0.7', changefreq: 'weekly' },
  ...KNOWLEDGE_HUBS.map((hub) => ({
    path: `/kunskapscenter/${hub.slug}`,
    priority: '0.7',
    changefreq: 'weekly' as const,
    meta: { title: hub.metaTitle, description: hub.metaDescription },
  })),
  {
    path: '/kunskapscenter/videor',
    priority: '0.7',
    changefreq: 'daily' as const,
    meta: {
      title: 'Videobibliotek: Dynamics 365 på YouTube',
      description:
        'Kurerat videobibliotek med Microsoft Dynamics 365-videor grupperade per produktområde och frågeställning – demo, priser, implementering, integration och nyheter.',
    },
  },
  { path: '/kunskapscenter/upphandlingsresan', priority: '0.7', changefreq: 'monthly' },
  {
    path: '/kunskapscenter/dynamics-365-tillagg',
    priority: '0.7',
    changefreq: 'weekly' as const,
    meta: {
      title: 'Dynamics 365-tillägg: katalog över ISV-lösningar',
      description:
        'Katalog över ISV- och tilläggslösningar för Dynamics 365 – Business Central, Finance & Supply Chain, Sales, Customer Service med flera. Filtrera på produkt, kategori och bransch.',
    },
  },
  { path: '/upphandlingsguiden', priority: '0.8', changefreq: 'monthly' },
  { path: '/kravspecifikation', priority: '0.7', changefreq: 'monthly' },
  { path: '/kravspecifikation-sales', priority: '0.7', changefreq: 'monthly' },
  { path: '/kravspecifikation-marketing', priority: '0.7', changefreq: 'monthly' },
  { path: '/kravspecifikation-kundservice', priority: '0.7', changefreq: 'monthly' },
  { path: '/businesscentral/matchningstest', priority: '0.6', changefreq: 'monthly' },
  { path: '/businesscentral/roi-kalkylator', priority: '0.6', changefreq: 'monthly' },
  { path: '/finance-supply-chain-management/matchningstest', priority: '0.6', changefreq: 'monthly' },
  { path: '/finance-supply-chain/roi-kalkylator', priority: '0.6', changefreq: 'monthly' },
  { path: '/d365sales/matchningstest', priority: '0.6', changefreq: 'monthly' },
  { path: '/d365sales/matchningstest/resultat', priority: '0.3', changefreq: 'monthly' },
  { path: '/d365sales/roi-kalkylator', priority: '0.6', changefreq: 'monthly' },
  { path: '/d365customerservice/matchningstest', priority: '0.6', changefreq: 'monthly' },
  { path: '/d365customerservice/matchningstest/resultat', priority: '0.3', changefreq: 'monthly' },
  { path: '/d365customerservice/roi-kalkylator', priority: '0.6', changefreq: 'monthly' },
  { path: '/d365marketing/matchningstest', priority: '0.6', changefreq: 'monthly' },
  { path: '/d365marketing/matchningstest/resultat', priority: '0.3', changefreq: 'monthly' },
  { path: '/d365marketing/roi-kalkylator', priority: '0.6', changefreq: 'monthly' },
  { path: '/d365fieldservice/matchningstest', priority: '0.6', changefreq: 'monthly' },
  { path: '/d365fieldservice/matchningstest/resultat', priority: '0.3', changefreq: 'monthly' },
  { path: '/d365fieldservice/roi-kalkylator', priority: '0.6', changefreq: 'monthly' },
  { path: '/d365contactcenter/matchningstest', priority: '0.6', changefreq: 'monthly' },
  { path: '/d365contactcenter/matchningstest/resultat', priority: '0.3', changefreq: 'monthly' },
  { path: '/d365contactcenter/roi-kalkylator', priority: '0.6', changefreq: 'monthly' },
  { path: '/partnernytt', priority: '0.7', changefreq: 'weekly' },
  { path: '/friskrivning', priority: '0.3', changefreq: 'yearly' },
  { path: '/jamfor-partners', priority: '0.7', changefreq: 'weekly' },
  { path: '/jamfor', priority: '0.7', changefreq: 'monthly' },
  ...PRODUCT_COMPARISONS.map((c) => ({
    path: `/jamfor/${c.slug}`,
    priority: '0.6',
    changefreq: 'monthly' as const,
    meta: { title: `${c.title} | d365.se`, description: c.metaDescription },
  })),
  ...KNOWLEDGE_VIDEOS.map((v) => ({
    path: `/kunskapscenter/video/${v.slug}`,
    priority: '0.6',
    changefreq: 'monthly' as const,
  })),
  { path: '/partners-sitemap', priority: '0.6', changefreq: 'weekly' },
  { path: '/alla-d365-partners', priority: '0.6', changefreq: 'monthly' },
  { path: '/partners-per-bransch', priority: '0.7', changefreq: 'weekly' },
  { path: '/AI-sok', priority: '0.3', changefreq: 'monthly', sitemap: false },
  ...PRODUCT_PARTNERS_SVERIGE.map((c) => ({
    path: `/${c.slug}`,
    priority: '0.8',
    changefreq: 'weekly' as const,
    meta: { title: c.metaTitle, description: c.metaDescription },
  })),
  // Kunskapscenter-hubbar per produktområde (annars enbart klientrenderade)
  ...[
    'business-central',
    'business-central-tillagg',
    'finance-supply-chain',
    'sales',
    'customer-service',
    'copilot',
    'upphandling',
    'partners',
  ].map((slug) => ({
    path: `/kunskapscenter/${slug}`,
    priority: '0.7',
    changefreq: 'monthly' as const,
  })),
  { path: '/fraga-ai', priority: '0.5', changefreq: 'monthly' },

  {
    path: '/rapporter/dynamics-365-partnersverige-2026',
    priority: '0.8',
    changefreq: 'monthly' as const,
    meta: {
      title: 'Svenska Dynamics 365-partnermarknaden 2026 – rapport',
      description:
        'Rapport om Dynamics 365-partners i Sverige 2026: 84 övriga partners fördelat på Business Central, F&SCM, CRM, Power Platform/AI, bransch och bolagsstorlek.',
    },
  },
  // Deep-dive article routes (generated from data)
  ...ALL_DEEP_DIVE_ARTICLES.map((a) => ({
    path: `/kunskapscenter/${a.productSlug}/${a.slug}`,
    priority: '0.6',
    changefreq: 'monthly' as const,
    meta: {
      title: `${a.title} | d365.se`,
      description: a.description,
    },
  })),
  // Blog article routes (generated from data)
  ...BLOG_ARTICLES.map((a) => ({
    path: `/artiklar/${a.slug}`,
    priority: '0.7',
    changefreq: 'monthly' as const,
    lastmod: a.publishedAt, // YYYY-MM-DD from blog data
    meta: {
      title: a.metaTitle,
      description: a.metaDescription,
    },
  })),
];

// ─── Dynamic legacy kunskapscenter redirects ───────────────────────────────
// Google Search Console still tries to crawl old kunskapscenter URLs that
// used hyphenated / d365-prefixed product slugs. The canonical slugs in the
// current routes/sitemap are e.g. `businesscentral`, `d365sales`,
// `d365customerservice`. Emit a static 301-equivalent HTML page at each
// legacy path so soft-404s in GSC get consolidated to the live URL.
const LEGACY_PRODUCT_SLUG_MAP: Record<string, string> = {
  'business-central': 'businesscentral',
  'finance-supply-chain': 'financesupplychain',
  'd365-sales': 'd365sales',
  'd365-marketing': 'd365marketing',
  'd365-customer-service': 'd365customerservice',
  'd365-field-service': 'd365fieldservice',
  'd365-contact-center': 'd365contactcenter',
};

// Hubs whose old hyphenated path should land on something sensible. Where no
// matching kunskapscenter-hub exists, point at the product landing page so
// the user (and Google) still find relevant content.
const LEGACY_HUB_REDIRECTS: LegacyRedirect[] = [
  { from: '/kunskapscenter/d365-sales',            to: '/kunskapscenter/sales',            intendedStatus: 301 },
  { from: '/kunskapscenter/d365-customer-service', to: '/kunskapscenter/customer-service', intendedStatus: 301 },
  { from: '/kunskapscenter/d365-marketing',        to: '/d365marketing',                   intendedStatus: 301 },
  { from: '/kunskapscenter/d365-field-service',    to: '/d365fieldservice',                intendedStatus: 301 },
  { from: '/kunskapscenter/d365-contact-center',   to: '/d365contactcenter',               intendedStatus: 301 },
  // /kunskapscenter/business-central/ and /finance-supply-chain/ are valid
  // hub paths (slugs match KNOWLEDGE_HUBS) – don't redirect those.
];

const DYNAMIC_ARTICLE_REDIRECTS: LegacyRedirect[] = [];
{
  const seen = new Set<string>();
  // Build reverse lookup: canonical productSlug → legacy hyphenated slug.
  const reverseMap: Record<string, string> = {};
  for (const [legacy, canonical] of Object.entries(LEGACY_PRODUCT_SLUG_MAP)) {
    reverseMap[canonical] = legacy;
  }
  for (const a of ALL_DEEP_DIVE_ARTICLES) {
    const legacyProduct = reverseMap[a.productSlug];
    if (!legacyProduct) continue;
    const from = `/kunskapscenter/${legacyProduct}/${a.slug}`;
    const to = `/kunskapscenter/${a.productSlug}/${a.slug}`;
    if (from === to || seen.has(from)) continue;
    seen.add(from);
    DYNAMIC_ARTICLE_REDIRECTS.push({ from, to, intendedStatus: 301 });
  }
}

export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  ...STATIC_LEGACY_REDIRECTS,
  ...LEGACY_HUB_REDIRECTS,
  ...DYNAMIC_ARTICLE_REDIRECTS,
];



export function render(url: string) {
  const basicMatch = url.match(/^\/basic\/([^/?#]+)/);
  const basicSlug = basicMatch ? basicMatch[1].replace(/\/$/, '') : null;
  const basicInitialData = basicSlug ? BASIC_PARTNERS_BY_SLUG[basicSlug] || null : null;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, enabled: false },
    },
  });

  const helmetContext: { helmet?: any } = {};

  // Extract partner slug from URL for SSR data injection
  const partnerMatch = url.match(/^\/partner\/([^/?#]+)/);
  const partnerSlug = partnerMatch ? partnerMatch[1].replace(/\/$/, '') : null;
  const partnerInitialData = partnerSlug ? partnerDataBySlug[partnerSlug] || null : null;

  // Extract industry slug for SSR partner-list injection on /branscher/:slug
  const industryMatch = url.match(/^\/branscher\/([^/?#]+)/);
  const industrySlug = industryMatch ? industryMatch[1].replace(/\/$/, '') : null;
  const industryInitialPartners = industrySlug
    ? partnersByIndustrySlug[industrySlug] || null
    : null;

  // Map DB fields to the shape PartnerProfile expects (DatabasePartner)
  const mappedPartnerData = partnerInitialData ? {
    ...partnerInitialData,
    contactPerson: partnerInitialData.contact_person,
    address: null as string | null,
    secondary_industries: partnerInitialData.secondary_industries || [],
    geography: partnerInitialData.geography || ['Sverige'],
    product_filters: (partnerInitialData.product_filters as any) || {},
    industry_apps: (partnerInitialData.industry_apps as any) || [],
    invoice_email: (partnerInitialData as any).invoice_email || null,
    invoice_contact: (partnerInitialData as any).invoice_contact || null,
    org_number: (partnerInitialData as any).org_number || null,
    legal_name: (partnerInitialData as any).legal_name || null,
    contact_photo_url: (partnerInitialData as any).contact_photo_url || null,
    youtube_video_id: (partnerInitialData as any).youtube_video_id || null,
    activation_date: null as string | null,
    monthly_fee: null as number | null,
    cancellation_date: null as string | null,
    admin_notes: null as string | null,
    admin_contact_name: null as string | null,
    admin_contact_email: null as string | null,
  } : null;

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <StaticRouter location={url}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/crm" element={<CRM />} />
              <Route path="/businesscentral" element={<BusinessCentral />} />
              <Route path="/business-central" element={<Navigate to="/businesscentral" replace />} />
              <Route path="/finance-supply-chain" element={<FinanceSupplyChain />} />
              <Route path="/erp" element={<ERPOverview />} />
              <Route path="/affarssystem" element={<Affarssystem />} />
              
              <Route path="/copilot" element={<Copilot />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/aioversikt" element={<AIOverview />} />
              <Route path="/ai-oversikt" element={<Navigate to="/aioversikt" replace />} />
              <Route path="/ai-readiness" element={<AIReadiness />} />
              <Route path="/kontakt" element={<ContactUs />} />
              <Route path="/valjdynamics365partner" element={<ValjPartner />} />
              <Route path="/valj-partner" element={<Navigate to="/valjdynamics365partner" replace />} />
              <Route path="/AI-sok" element={<SmartSearch />} />
              <Route path="/AIsok" element={<Navigate to="/AI-sok" replace />} />
              <Route path="/sok" element={<Navigate to="/AI-sok" replace />} />
              <Route path="/dataskydd" element={<PrivacyPolicy />} />
              <Route path="/ERPbehovsanalys" element={<NeedsAnalysis />} />
              <Route path="/behovsanalys" element={<Navigate to="/ERPbehovsanalys" replace />} />
              <Route path="/kom-igang" element={<KomIgang />} />
              <Route path="/partnerprogram" element={<Partnerprogram />} />
              <Route path="/basic/:slug" element={<PartnerBasicProfile initialData={basicInitialData} />} />
              <Route path="/CRMbehovsanalys" element={<SalesMarketingNeedsAnalysis />} />
              <Route path="/salj-marknad-behovsanalys" element={<Navigate to="/CRMbehovsanalys" replace />} />
              <Route path="/kundservice-behovsanalys" element={<CustomerServiceNeedsAnalysis />} />
              <Route path="/branschlosningar" element={<Navigate to="/branscher" replace />} />
              <Route path="/branschlosningar/*" element={<Navigate to="/branscher" replace />} />
              <Route path="/branscher" element={<Branscher />} />
              <Route path="/branscher/:slug" element={<IndustryPage initialPartners={industryInitialPartners} />} />
              <Route path="/d365sales" element={<D365Sales />} />
              <Route path="/d365-sales" element={<Navigate to="/d365sales" replace />} />
              <Route path="/d365marketing" element={<D365Marketing />} />
              <Route path="/d365-marketing" element={<Navigate to="/d365marketing" replace />} />
              <Route path="/d365customerservice" element={<D365CustomerService />} />
              <Route path="/d365-customer-service" element={<Navigate to="/d365customerservice" replace />} />
              <Route path="/d365fieldservice" element={<D365FieldService />} />
              <Route path="/d365-field-service" element={<Navigate to="/d365fieldservice" replace />} />
              <Route path="/d365contactcenter" element={<D365ContactCenter />} />
              <Route path="/d365-contact-center" element={<Navigate to="/d365contactcenter" replace />} />
              <Route path="/customer-service" element={<Navigate to="/d365customerservice" replace />} />
              <Route path="/field-service" element={<Navigate to="/d365fieldservice" replace />} />
              <Route path="/customer-insights" element={<Navigate to="/d365marketing" replace />} />
              <Route path="/ai-mognadsanalys" element={<Navigate to="/ai-readiness" replace />} />
              <Route path="/dynamics365-sales" element={<Navigate to="/d365sales" replace />} />
              <Route path="/dynamics365-customer-service" element={<Navigate to="/d365customerservice" replace />} />
              <Route path="/dynamics365-customer-insights" element={<Navigate to="/d365marketing" replace />} />
              <Route path="/dynamics365-contact-center" element={<Navigate to="/d365contactcenter" replace />} />
              <Route path="/dynamics365-field-service" element={<Navigate to="/d365fieldservice" replace />} />
              <Route path="/kravspecifikation-customer-service" element={<Navigate to="/kravspecifikation-kundservice" replace />} />
              <Route path="/d365projectoperations" element={<D365ProjectOperations />} />
              <Route path="/d365commerce" element={<D365Commerce />} />
              <Route path="/d365humanresources" element={<D365HumanResources />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              <Route path="/qa" element={<QA />} />
              <Route path="/kunskapscenter" element={<Kunskapscenter />} />
              <Route path="/priser" element={<Priser />} />
              <Route path="/kostnad" element={<Kostnad />} />
              <Route path="/implementationskalkylator" element={<ImplementationCalculator />} />
              <Route path="/kunskapscenter/upphandlingsresan" element={<Upphandlingsresan />} />
              <Route path="/upphandlingsguiden" element={<Upphandlingsguiden />} />
              <Route path="/om-thomas-laine" element={<OmThomasLaine />} />
              <Route path="/om-michael-uhman" element={<OmMichaelUhman />} />
              <Route path="/agande-och-intressen" element={<OwnershipAndInterests />} />
              {KNOWLEDGE_HUBS.map((hub) => (
                <Route
                  key={hub.slug}
                  path={`/kunskapscenter/${hub.slug}`}
                  element={<KunskapscenterHub slug={hub.slug} />}
                />
              ))}
              <Route path="/kunskapscenter/:productSlug/:articleSlug" element={<DeepDiveArticle />} />
              <Route path="/artiklar/:slug" element={<BlogArticle />} />
              <Route path="/kravspecifikation" element={<RequirementsSpec />} />
              <Route path="/kravspecifikation-sales" element={<RequirementsSpecSales />} />
              <Route path="/kravspecifikation-marketing" element={<RequirementsSpecMarketing />} />
              <Route path="/kravspecifikation-kundservice" element={<RequirementsSpecCustomerService />} />
              <Route path="/partner/:slug" element={<PartnerProfile initialData={mappedPartnerData as any} />} />
              <Route path="/partner/:slug/:productSlug" element={<PartnerProfile initialData={mappedPartnerData as any} />} />
              <Route path="/businesscentral/matchningstest" element={<BcMatchningstest />} />
              <Route path="/businesscentral/roi-kalkylator" element={<BcRoiCalculator />} />
              <Route path="/finance-supply-chain-management/matchningstest" element={<FscmMatchningstest />} />
              <Route path="/finance-supply-chain/roi-kalkylator" element={<ProductRoiPage productKey="finance-scm" />} />
              <Route path="/d365sales/matchningstest" element={<CrmMatchningstest productKey="sales" />} />
              <Route path="/d365sales/matchningstest/resultat" element={<CrmMatchningstestResultat productKey="sales" />} />
              <Route path="/d365sales/roi-kalkylator" element={<SalesRoiCalculator />} />
              <Route path="/d365customerservice/matchningstest" element={<CrmMatchningstest productKey="customer-service" />} />
              <Route path="/d365customerservice/matchningstest/resultat" element={<CrmMatchningstestResultat productKey="customer-service" />} />
              <Route path="/d365customerservice/roi-kalkylator" element={<ProductRoiPage productKey="customer-service" />} />
              <Route path="/d365marketing/matchningstest" element={<CrmMatchningstest productKey="marketing" />} />
              <Route path="/d365marketing/matchningstest/resultat" element={<CrmMatchningstestResultat productKey="marketing" />} />
              <Route path="/d365marketing/roi-kalkylator" element={<ProductRoiPage productKey="customer-insights" />} />
              <Route path="/d365fieldservice/matchningstest" element={<CrmMatchningstest productKey="field-service" />} />
              <Route path="/d365fieldservice/matchningstest/resultat" element={<CrmMatchningstestResultat productKey="field-service" />} />
              <Route path="/d365fieldservice/roi-kalkylator" element={<ProductRoiPage productKey="field-service" />} />
              <Route path="/d365contactcenter/matchningstest" element={<CrmMatchningstest productKey="contact-center" />} />
              <Route path="/d365contactcenter/matchningstest/resultat" element={<CrmMatchningstestResultat productKey="contact-center" />} />
              <Route path="/d365contactcenter/roi-kalkylator" element={<ProductRoiPage productKey="contact-center" />} />
              <Route path="/beslutsmognad" element={<Beslutsmognadsindex />} />
              <Route path="/kunskapscenter/dynamics-365-tillagg" element={<D365TillaggKatalog />} />
              <Route path="/partnernytt" element={<Partnernytt />} />
              <Route path="/friskrivning" element={<Friskrivning />} />
              <Route path="/jamfor-partners" element={<ComparePartners />} />
              <Route path="/jamfor" element={<ErpComparisonsHub />} />
              <Route path="/jamfor/:slug" element={<ErpComparisonPage />} />
              <Route path="/kunskapscenter/video/:slug" element={<VideoLanding />} />
              <Route path="/partners-sitemap" element={<PartnersSitemap />} />
              <Route path="/alla-d365-partners" element={<AllD365Partners />} />
              <Route path="/partners-per-bransch" element={<PartnersPerBransch />} />
              {PRODUCT_PARTNERS_SVERIGE.map((c) => (
                <Route
                  key={c.slug}
                  path={`/${c.slug}`}
                  element={<ProductPartnersSverige configSlug={c.slug} />}
                />
              ))}
              <Route
                path="/rapporter/dynamics-365-partnersverige-2026"
                element={<PartnerMarketReport2026 />}
              />

            </Routes>
          </StaticRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );

  const helmet = helmetContext.helmet;

  return {
    html,
    head: {
      title: helmet?.title?.toString() || '',
      meta: helmet?.meta?.toString() || '',
      link: helmet?.link?.toString() || '',
      script: helmet?.script?.toString() || '',
    },
  };
}

/**
 * Build dynamic routes (partners + events) for sitemap and prerendering.
 * Partners come from local JSON; events fetched live from Supabase REST.
 */
export async function getDynamicRoutes(): Promise<PrerenderRoute[]> {
  const partnerRoutes: PrerenderRoute[] = partnerRoutesData
    .filter((p) => p.slug && p.name)
    .map((p) => ({
      path: `/partner/${p.slug}`,
      priority: '0.7',
      changefreq: 'weekly' as const,
      meta: {
        title: `${p.name} – Dynamics 365 Partner | d365.se`,
        description:
          p.description?.slice(0, 155) ||
          `${p.name} är en Microsoft Dynamics 365-partner i Sverige. Läs mer om deras kompetenser och branschfokus.`,
      },
    }));

  console.log(`  📦 Found ${partnerRoutes.length} partner routes from local JSON`);

  // ── Basic partners: fetched live from Supabase (observed data only) ──
  const basicPartnerRoutes: PrerenderRoute[] = [];
  try {
    const supaUrl = process.env.VITE_SUPABASE_URL;
    const supaKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (supaUrl && supaKey) {
      const url = `${supaUrl}/rest/v1/partners_basic_public?select=*&order=name.asc`;
      const res = await fetch(url, {
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` },
      });
      if (res.ok) {
        const rows = (await res.json()) as Array<{
          slug: string;
          name: string;
          extended_content: string | null;
          updated_at: string | null;
        }>;
        for (const r of rows) {
          if (!r.slug || !r.name) continue;
          BASIC_PARTNERS_BY_SLUG[r.slug] = normalizeBasicPartnerRow(r);
          const desc = (r.extended_content || '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 155);
          basicPartnerRoutes.push({
            path: `/basic/${r.slug}`,
            priority: '0.4',
            changefreq: 'monthly',
            lastmod: (r.updated_at || '').slice(0, 10) || undefined,
            meta: {
              title: `${r.name} – Microsoft Dynamics 365-partner i Sverige | d365.se`,
              description:
                desc ||
                `${r.name} – observerad data om denna Microsoft Dynamics 365-partner i Sverige, sammanställd av d365.se från publika källor.`,
            },
          });
        }
        console.log(`  📦 Found ${basicPartnerRoutes.length} basic partner routes from Supabase`);
      }
    }
  } catch (err: any) {
    console.warn(`  ⚠️  Basic partners fetch error: ${err.message}`);
  }

  // ── Events: fetch published/upcoming events from Supabase REST ──────
  const eventRoutes: PrerenderRoute[] = [];
  const articleRoutes: PrerenderRoute[] = [];
  try {
    const supaUrl = process.env.VITE_SUPABASE_URL;
    const supaKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (supaUrl && supaKey) {
      const today = new Date().toISOString().split('T')[0];
      const url = `${supaUrl}/rest/v1/partner_events_public?select=id,title,description,event_date,updated_at,status&event_date=gte.${today}&order=event_date.asc`;
      const res = await fetch(url, {
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` },
      });
      if (res.ok) {
        const events = (await res.json()) as Array<{
          id: string;
          title: string;
          description: string | null;
          event_date: string;
          updated_at: string;
        }>;
        for (const ev of events) {
          eventRoutes.push({
            path: `/events/${ev.id}`,
            priority: '0.6',
            changefreq: 'weekly',
            lastmod: (ev.updated_at || ev.event_date || '').slice(0, 10) || undefined,
            meta: {
              title: `${ev.title} | Event – d365.se`,
              description:
                (ev.description || '').slice(0, 155) ||
                `${ev.title} – Microsoft Dynamics 365-event. Läs mer och anmäl dig på d365.se.`,
            },
          });
        }
        console.log(`  📦 Found ${eventRoutes.length} event routes from Supabase`);
      } else {
        console.warn(`  ⚠️  Events fetch failed: ${res.status}`);
      }

      // ── Knowledge articles: published, internal urls only ──
      const kaUrl = `${supaUrl}/rest/v1/knowledge_articles?select=title,description,url,updated_at,published_at&is_published=eq.true&url=like.%2F%25`;
      const kaRes = await fetch(kaUrl, {
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` },
      });
      if (kaRes.ok) {
        const articles = (await kaRes.json()) as Array<{
          title: string;
          description: string | null;
          url: string;
          updated_at: string;
          published_at: string | null;
        }>;
        for (const a of articles) {
          if (!a.url || !a.url.startsWith('/')) continue;
          articleRoutes.push({
            path: a.url,
            priority: '0.7',
            changefreq: 'monthly',
            lastmod: (a.updated_at || a.published_at || '').slice(0, 10) || undefined,
            meta: {
              title: `${a.title} | d365.se`,
              description:
                (a.description || '').slice(0, 155) ||
                `${a.title} – Läs mer i Kunskapscentret på d365.se.`,
            },
          });
        }
        console.log(`  📦 Found ${articleRoutes.length} knowledge article routes from Supabase`);
      } else {
        console.warn(`  ⚠️  Knowledge articles fetch failed: ${kaRes.status}`);
      }
    } else {
      console.warn('  ⚠️  Skipping dynamic routes: missing VITE_SUPABASE_URL/KEY');
    }
  } catch (err: any) {
    console.warn(`  ⚠️  Dynamic routes fetch error: ${err.message}`);
  }

  return [...partnerRoutes, ...basicPartnerRoutes, ...eventRoutes, ...articleRoutes];
}
