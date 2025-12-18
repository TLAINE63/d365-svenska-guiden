import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CRM = lazy(() => import("./pages/CRM"));
const BusinessCentral = lazy(() => import("./pages/BusinessCentral"));
const FinanceSupplyChain = lazy(() => import("./pages/FinanceSupplyChain"));
const ERPOverview = lazy(() => import("./pages/ERPOverview"));
const Copilot = lazy(() => import("./pages/Copilot"));
const Agents = lazy(() => import("./pages/Agents"));
const QA = lazy(() => import("./pages/QA"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const ValjPartner = lazy(() => import("./pages/ValjPartner"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NeedsAnalysis = lazy(() => import("./pages/NeedsAnalysis"));
const CRMNeedsAnalysis = lazy(() => import("./pages/CRMNeedsAnalysis"));
const SalesMarketingNeedsAnalysis = lazy(() => import("./pages/SalesMarketingNeedsAnalysis"));
const CustomerServiceNeedsAnalysis = lazy(() => import("./pages/CustomerServiceNeedsAnalysis"));
const Branschlosningar = lazy(() => import("./pages/Branschlosningar"));
const D365Sales = lazy(() => import("./pages/D365Sales"));
const D365Marketing = lazy(() => import("./pages/D365Marketing"));
const D365CustomerService = lazy(() => import("./pages/D365CustomerService"));
const D365FieldService = lazy(() => import("./pages/D365FieldService"));
const D365ContactCenter = lazy(() => import("./pages/D365ContactCenter"));

const queryClient = new QueryClient();

// Simple loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse text-muted-foreground">Laddar...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/crm-behovsanalys" element={<CRMNeedsAnalysis />} />
            <Route path="/salj-marknad-behovsanalys" element={<SalesMarketingNeedsAnalysis />} />
            <Route path="/kundservice-behovsanalys" element={<CustomerServiceNeedsAnalysis />} />
            <Route path="/branschlosningar" element={<Branschlosningar />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
