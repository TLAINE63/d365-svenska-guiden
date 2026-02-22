import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { TooltipProvider } from '@/components/ui/tooltip';

// Direct page imports (no lazy loading for SSR)
import Index from './pages/Index';
import CRM from './pages/CRM';
import BusinessCentral from './pages/BusinessCentral';
import FinanceSupplyChain from './pages/FinanceSupplyChain';
import ERPOverview from './pages/ERPOverview';
import Copilot from './pages/Copilot';
import Agents from './pages/Agents';
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
import QA from './pages/QA';

export interface PrerenderRoute {
  path: string;
  priority: string;
  changefreq: string;
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
  { path: '/behovsanalys', priority: '0.8', changefreq: 'monthly' },
  { path: '/salj-marknad-behovsanalys', priority: '0.7', changefreq: 'monthly' },
  { path: '/kundservice-behovsanalys', priority: '0.7', changefreq: 'monthly' },
  { path: '/events', priority: '0.8', changefreq: 'weekly' },
  { path: '/qa', priority: '0.6', changefreq: 'monthly' },
  { path: '/kontakt', priority: '0.7', changefreq: 'monthly' },
  { path: '/dataskydd', priority: '0.3', changefreq: 'yearly' },
];

export function render(url: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, enabled: false },
    },
  });

  const html = renderToString(
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
            <Route path="/qa" element={<QA />} />
          </Routes>
        </StaticRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

  const helmet = Helmet.renderStatic();

  return {
    html,
    head: {
      title: helmet.title.toString(),
      meta: helmet.meta.toString(),
      link: helmet.link.toString(),
      script: helmet.script.toString(),
    },
  };
}
