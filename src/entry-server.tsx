import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
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
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import QA from './pages/QA';
import PartnerProfile from './pages/PartnerProfile';
import Kunskapscenter from './pages/Kunskapscenter';
import RequirementsSpec from './pages/RequirementsSpec';
import RequirementsSpecSales from './pages/RequirementsSpecSales';
import RequirementsSpecMarketing from './pages/RequirementsSpecMarketing';
import RequirementsSpecCustomerService from './pages/RequirementsSpecCustomerService';
import DeepDiveArticle from './pages/DeepDiveArticle';
import BlogArticle from './pages/BlogArticle';
import SmartSearch from './pages/SmartSearch';
import { ALL_DEEP_DIVE_ARTICLES } from './data/bcArticles';
import { BLOG_ARTICLES } from './data/blogArticles';
import partnerRoutesData from './data/partnerRoutes.json';
import partnerDataJson from './data/partnerData.json';

// Re-export so the SSG prerender plugin can emit static legacy-redirect HTML.
export { LEGACY_REDIRECTS, buildRedirectHtml } from './lib/legacy-redirects';

// Build a slug→partner lookup for SSR
const partnerDataBySlug: Record<string, typeof partnerDataJson[number]> = {};
partnerDataJson.forEach((p) => {
  if (p.slug) partnerDataBySlug[p.slug] = p;
});
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
  { path: '/erp', priority: '0.9', changefreq: 'weekly', lastmod: '2026-05-19' },
  { path: '/affarssystem', priority: '0.9', changefreq: 'weekly', lastmod: '2026-05-19' },

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
  { path: '/copilot', priority: '0.8', changefreq: 'monthly' },
  { path: '/agents', priority: '0.9', changefreq: 'monthly' },
  { path: '/aioversikt', priority: '0.7', changefreq: 'monthly' },
  { path: '/ai-readiness', priority: '0.6', changefreq: 'monthly' },
  { path: '/ERPbehovsanalys', priority: '0.8', changefreq: 'monthly' },
  { path: '/CRMbehovsanalys', priority: '0.7', changefreq: 'monthly' },
  { path: '/kundservice-behovsanalys', priority: '0.7', changefreq: 'monthly' },
  { path: '/events', priority: '0.8', changefreq: 'weekly' },
  { path: '/qa', priority: '0.6', changefreq: 'monthly' },
  { path: '/kontakt', priority: '0.7', changefreq: 'monthly' },
  { path: '/dataskydd', priority: '0.3', changefreq: 'yearly', sitemap: false },
  { path: '/kom-igang', priority: '0.8', changefreq: 'monthly' },
  { path: '/kunskapscenter', priority: '0.7', changefreq: 'weekly' },
  { path: '/kravspecifikation', priority: '0.7', changefreq: 'monthly' },
  { path: '/kravspecifikation-sales', priority: '0.7', changefreq: 'monthly' },
  { path: '/kravspecifikation-marketing', priority: '0.7', changefreq: 'monthly' },
  { path: '/kravspecifikation-kundservice', priority: '0.7', changefreq: 'monthly' },
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
              <Route path="/AIsok" element={<SmartSearch />} />
              <Route path="/sok" element={<Navigate to="/AIsok" replace />} />
              <Route path="/dataskydd" element={<PrivacyPolicy />} />
              <Route path="/ERPbehovsanalys" element={<NeedsAnalysis />} />
              <Route path="/behovsanalys" element={<Navigate to="/ERPbehovsanalys" replace />} />
              <Route path="/kom-igang" element={<KomIgang />} />
              <Route path="/CRMbehovsanalys" element={<SalesMarketingNeedsAnalysis />} />
              <Route path="/salj-marknad-behovsanalys" element={<Navigate to="/CRMbehovsanalys" replace />} />
              <Route path="/kundservice-behovsanalys" element={<CustomerServiceNeedsAnalysis />} />
              <Route path="/branschlosningar" element={<Navigate to="/branscher/" replace />} />
              <Route path="/branschlosningar/*" element={<Navigate to="/branscher/" replace />} />
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
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              <Route path="/qa" element={<QA />} />
              <Route path="/kunskapscenter" element={<Kunskapscenter />} />
              <Route path="/kunskapscenter/:productSlug/:articleSlug" element={<DeepDiveArticle />} />
              <Route path="/artiklar/:slug" element={<BlogArticle />} />
              <Route path="/kravspecifikation" element={<RequirementsSpec />} />
              <Route path="/kravspecifikation-sales" element={<RequirementsSpecSales />} />
              <Route path="/kravspecifikation-marketing" element={<RequirementsSpecMarketing />} />
              <Route path="/kravspecifikation-kundservice" element={<RequirementsSpecCustomerService />} />
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

  // ── Events: fetch published/upcoming events from Supabase REST ──────
  const eventRoutes: PrerenderRoute[] = [];
  const articleRoutes: PrerenderRoute[] = [];
  try {
    const supaUrl = process.env.VITE_SUPABASE_URL;
    const supaKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (supaUrl && supaKey) {
      const today = new Date().toISOString().split('T')[0];
      const url = `${supaUrl}/rest/v1/partner_events?select=id,title,description,event_date,updated_at,status&status=eq.approved&event_date=gte.${today}&order=event_date.asc`;
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

  return [...partnerRoutes, ...eventRoutes, ...articleRoutes];
}
