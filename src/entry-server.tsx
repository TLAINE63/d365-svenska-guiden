import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Helmet } from 'react-helmet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from './components/ui/tooltip';
import { Routes, Route } from 'react-router-dom';

// Eager imports for SSR (no lazy loading)
import Index from './pages/Index';
import CRM from './pages/CRM';
import BusinessCentral from './pages/BusinessCentral';
import FinanceSupplyChain from './pages/FinanceSupplyChain';
import ERPOverview from './pages/ERPOverview';
import Copilot from './pages/Copilot';
import Agents from './pages/Agents';
import QA from './pages/QA';
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
import NotFound from './pages/NotFound';

export function render(url: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
      },
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
            <Route path="/qa" element={<QA />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </StaticRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

  const helmet = Helmet.renderStatic();

  queryClient.clear();

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
