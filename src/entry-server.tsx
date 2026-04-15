import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from '@/components/ui/tooltip';

// Direct page imports (no lazy loading for SSR)
import Index from './pages/Index';
import CRM from './pages/CRM';
import BusinessCentral from './pages/BusinessCentral';
import FinanceSupplyChain from './pages/FinanceSupplyChain';
import ERPOverview from './pages/ERPOverview';
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
import Branschlosningar from './pages/Branschlosningar';
import D365Sales from './pages/D365Sales';
import D365Marketing from './pages/D365Marketing';
import D365CustomerService from './pages/D365CustomerService';
import D365FieldService from './pages/D365FieldService';
import D365ContactCenter from './pages/D365ContactCenter';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import QA from './pages/QA';
import PartnerProfile from './pages/PartnerProfile';
import Kunskapscenter from './pages/Kunskapscenter';
import RequirementsSpec from './pages/RequirementsSpec';
import DeepDiveArticle from './pages/DeepDiveArticle';
import { ALL_DEEP_DIVE_ARTICLES } from './data/bcArticles';
import partnerRoutesData from './data/partnerRoutes.json';
import partnerDataJson from './data/partnerData.json';

// Build a slug→partner lookup for SSR
const partnerDataBySlug: Record<string, typeof partnerDataJson[number]> = {};
partnerDataJson.forEach((p) => {
  if (p.slug) partnerDataBySlug[p.slug] = p;
});
export interface PrerenderRoute {
  path: string;
  priority: string;
  changefreq: string;
  meta?: { title: string; description: string };
}

export const routes: PrerenderRoute[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/valj-partner', priority: '1.0', changefreq: 'weekly' },
  { path: '/erp', priority: '0.9', changefreq: 'monthly' },
  { path: '/business-central', priority: '0.9', changefreq: 'monthly' },
  { path: '/finance-supply-chain', priority: '0.8', changefreq: 'monthly' },
  { path: '/crm', priority: '0.9', changefreq: 'monthly' },
  { path: '/branschlosningar', priority: '0.9', changefreq: 'monthly' },
  { path: '/d365-sales', priority: '0.8', changefreq: 'monthly' },
  { path: '/d365-marketing', priority: '0.8', changefreq: 'monthly' },
  { path: '/d365-customer-service', priority: '0.8', changefreq: 'monthly' },
  { path: '/d365-field-service', priority: '0.8', changefreq: 'monthly' },
  { path: '/d365-contact-center', priority: '0.8', changefreq: 'monthly' },
  { path: '/copilot', priority: '0.8', changefreq: 'monthly' },
  { path: '/agents', priority: '0.9', changefreq: 'monthly' },
  { path: '/ai-oversikt', priority: '0.7', changefreq: 'monthly' },
  { path: '/ai-readiness', priority: '0.6', changefreq: 'monthly' },
  { path: '/behovsanalys', priority: '0.8', changefreq: 'monthly' },
  { path: '/salj-marknad-behovsanalys', priority: '0.7', changefreq: 'monthly' },
  { path: '/kundservice-behovsanalys', priority: '0.7', changefreq: 'monthly' },
  { path: '/events', priority: '0.8', changefreq: 'weekly' },
  { path: '/qa', priority: '0.6', changefreq: 'monthly' },
  { path: '/kontakt', priority: '0.7', changefreq: 'monthly' },
  { path: '/dataskydd', priority: '0.3', changefreq: 'yearly' },
  { path: '/kunskapscenter', priority: '0.7', changefreq: 'weekly' },
  { path: '/kravspecifikation', priority: '0.7', changefreq: 'monthly' },
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
];

export function render(url: string) {
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

  // Map DB fields to the shape PartnerProfile expects (DatabasePartner)
  const mappedPartnerData = partnerInitialData ? {
    ...partnerInitialData,
    contactPerson: partnerInitialData.contact_person,
    address: null as string | null,
    secondary_industries: partnerInitialData.secondary_industries || [],
    geography: partnerInitialData.geography || ['Sverige'],
    product_filters: (partnerInitialData.product_filters as any) || {},
    industry_apps: (partnerInitialData.industry_apps as any) || [],
    invoice_email: partnerInitialData.invoice_email || null,
    invoice_contact: partnerInitialData.invoice_contact || null,
    org_number: (partnerInitialData as any).org_number || null,
    legal_name: (partnerInitialData as any).legal_name || null,
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
              <Route path="/business-central" element={<BusinessCentral />} />
              <Route path="/finance-supply-chain" element={<FinanceSupplyChain />} />
              <Route path="/erp" element={<ERPOverview />} />
              <Route path="/copilot" element={<Copilot />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/ai-oversikt" element={<AIOverview />} />
              <Route path="/ai-readiness" element={<AIReadiness />} />
              <Route path="/kontakt" element={<ContactUs />} />
              <Route path="/valj-partner" element={<ValjPartner />} />
              <Route path="/dataskydd" element={<PrivacyPolicy />} />
              <Route path="/behovsanalys" element={<NeedsAnalysis />} />
              <Route path="/salj-marknad-behovsanalys" element={<SalesMarketingNeedsAnalysis />} />
              <Route path="/kundservice-behovsanalys" element={<CustomerServiceNeedsAnalysis />} />
              <Route path="/branschlosningar" element={<Branschlosningar />} />
              <Route path="/d365-sales" element={<D365Sales />} />
              <Route path="/d365-marketing" element={<D365Marketing />} />
              <Route path="/d365-customer-service" element={<D365CustomerService />} />
              <Route path="/d365-field-service" element={<D365FieldService />} />
              <Route path="/d365-contact-center" element={<D365ContactCenter />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              <Route path="/qa" element={<QA />} />
              <Route path="/kunskapscenter" element={<Kunskapscenter />} />
              <Route path="/kunskapscenter/:productSlug/:articleSlug" element={<DeepDiveArticle />} />
              <Route path="/kravspecifikation" element={<RequirementsSpec />} />
              <Route path="/partner/:slug" element={<PartnerProfile initialData={mappedPartnerData as any} />} />
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
 * Build partner routes from local JSON data.
 * No Supabase credentials needed at build time.
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
  return partnerRoutes;
}
