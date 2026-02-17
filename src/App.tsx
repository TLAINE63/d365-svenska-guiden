import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";
import SnitcherTracking from "@/components/SnitcherTracking";
import VisitorTracking from "@/components/VisitorTracking";

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

const SalesMarketingNeedsAnalysis = lazy(() => import("./pages/SalesMarketingNeedsAnalysis"));
const CustomerServiceNeedsAnalysis = lazy(() => import("./pages/CustomerServiceNeedsAnalysis"));
const Branschlosningar = lazy(() => import("./pages/Branschlosningar"));
const D365Sales = lazy(() => import("./pages/D365Sales"));
const D365Marketing = lazy(() => import("./pages/D365Marketing"));
const D365CustomerService = lazy(() => import("./pages/D365CustomerService"));
const D365FieldService = lazy(() => import("./pages/D365FieldService"));
const D365ContactCenter = lazy(() => import("./pages/D365ContactCenter"));
const PartnerProfile = lazy(() => import("./pages/PartnerProfile"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PartnerUpdate = lazy(() => import("./pages/PartnerUpdate"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const PartnerEvents = lazy(() => import("./pages/PartnerEvents"));

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
        <ScrollToTop />
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
            
            <Route path="/salj-marknad-behovsanalys" element={<SalesMarketingNeedsAnalysis />} />
            <Route path="/kundservice-behovsanalys" element={<CustomerServiceNeedsAnalysis />} />
            <Route path="/branschlosningar" element={<Branschlosningar />} />
            <Route path="/d365-sales" element={<D365Sales />} />
            <Route path="/d365-marketing" element={<D365Marketing />} />
            <Route path="/d365-customer-service" element={<D365CustomerService />} />
            <Route path="/d365-field-service" element={<D365FieldService />} />
            <Route path="/d365-contact-center" element={<D365ContactCenter />} />
            <Route path="/partner/:slug" element={<PartnerProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/partner-admin" element={<Navigate to="/admin" replace />} />
            <Route path="/lead-admin" element={<Navigate to="/admin" replace />} />
            <Route path="/partner-update/:token" element={<PartnerUpdate />} />
            {/* Redirects for old/legacy URLs (44 st 404 i GSC) */}
            <Route path="/kontakta-oss" element={<Navigate to="/kontakt" replace />} />
            <Route path="/om-oss" element={<Navigate to="/" replace />} />
            <Route path="/våra-tjänster" element={<Navigate to="/" replace />} />
            <Route path="/vara-tjanster" element={<Navigate to="/" replace />} />
            <Route path="/nyheter" element={<Navigate to="/events" replace />} />
            <Route path="/start/f/*" element={<Navigate to="/events" replace />} />
            <Route path="/f/*" element={<Navigate to="/events" replace />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/partner-events/:token" element={<PartnerEvents />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieBanner />
        <SnitcherTracking />
        <VisitorTracking />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
