import { lazy, Suspense } from "react";
import ChunkErrorBoundary from "@/components/ChunkErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import TrailingSlashRedirect from "@/components/TrailingSlashRedirect";
import { useDeferredLoad } from "@/hooks/useDeferredLoad";

import Index from "./pages/Index";

// Lazy load non-critical UI shell components
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));
const CookieBanner = lazy(() => import("@/components/CookieBanner"));
const SnitcherTracking = lazy(() => import("@/components/SnitcherTracking"));
const VisitorTracking = lazy(() => import("@/components/VisitorTracking"));

// Lazy load pages for code splitting
const NotFound = lazy(() => import("./pages/NotFound"));
const CRM = lazy(() => import("./pages/CRM"));
const BusinessCentral = lazy(() => import("./pages/BusinessCentral"));
const FinanceSupplyChain = lazy(() => import("./pages/FinanceSupplyChain"));
const ERPOverview = lazy(() => import("./pages/ERPOverview"));
const Affarssystem = lazy(() => import("./pages/Affarssystem"));

const Copilot = lazy(() => import("./pages/Copilot"));
const Agents = lazy(() => import("./pages/Agents"));
const AIOverview = lazy(() => import("./pages/AIOverview"));
const AIReadiness = lazy(() => import("./pages/AIReadiness"));
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
const RequirementsSpec = lazy(() => import("./pages/RequirementsSpec"));
const RequirementsSpecSales = lazy(() => import("./pages/RequirementsSpecSales"));
const RequirementsSpecMarketing = lazy(() => import("./pages/RequirementsSpecMarketing"));
const RequirementsSpecCustomerService = lazy(() => import("./pages/RequirementsSpecCustomerService"));
const Kunskapscenter = lazy(() => import("./pages/Kunskapscenter"));
const Upphandlingsresan = lazy(() => import("./pages/Upphandlingsresan"));
const Branscher = lazy(() => import("./pages/Branscher"));
const IndustryPage = lazy(() => import("./pages/IndustryPage"));
const DeepDiveArticle = lazy(() => import("./pages/DeepDiveArticle"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const KomIgang = lazy(() => import("./pages/KomIgang"));
const PartnerStats = lazy(() => import("./pages/PartnerStats"));
const PartnerAgreement = lazy(() => import("./pages/PartnerAgreement"));
const SmartSearch = lazy(() => import("./pages/SmartSearch"));
const AskAi = lazy(() => import("./pages/AskAi"));
const AiChatBubble = lazy(() => import("@/components/AiChatBubble"));

const queryClient = new QueryClient();

// Simple loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse text-muted-foreground">Laddar...</div>
  </div>
);

// Inner component to use hooks
const AppShell = () => {
  const deferredReady = useDeferredLoad(4000);

  return (
    <>
      <ScrollToTop />
      <TrailingSlashRedirect />
      
      <ChunkErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/businesscentral" element={<BusinessCentral />} />
          <Route path="/business-central" element={<Navigate to="/businesscentral" replace />} />
          <Route path="/finance-supply-chain" element={<FinanceSupplyChain />} />
          <Route path="/erp" element={<ERPOverview />} />
          <Route path="/affarssystem" element={<Affarssystem />} />
          <Route path="/affarssystem/partners" element={<Navigate to="/valj-partner/?product=Business+Central" replace />} />
          <Route path="/copilot" element={<Copilot />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/ai-oversikt" element={<AIOverview />} />
          <Route path="/ai-readiness" element={<AIReadiness />} />
          <Route path="/qa" element={<QA />} />
          <Route path="/kontakt" element={<ContactUs />} />
          
          <Route path="/valj-partner" element={<ValjPartner />} />
          <Route path="/dataskydd" element={<PrivacyPolicy />} />
          <Route path="/behovsanalys" element={<NeedsAnalysis />} />
          <Route path="/kom-igang" element={<KomIgang />} />
          
          <Route path="/salj-marknad-behovsanalys" element={<SalesMarketingNeedsAnalysis />} />
          <Route path="/kundservice-behovsanalys" element={<CustomerServiceNeedsAnalysis />} />
          <Route path="/branschlosningar" element={<Navigate to="/branscher/" replace />} />
          <Route path="/branschlosningar/*" element={<Navigate to="/branscher/" replace />} />
          <Route path="/branscher" element={<Branscher />} />
          <Route path="/branscher/:slug" element={<IndustryPage />} />
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
          <Route path="/kontakta-oss" element={<Navigate to="/kontakt/" replace />} />
          <Route path="/om-oss" element={<Navigate to="/" replace />} />
          <Route path="/våra-tjänster" element={<Navigate to="/" replace />} />
          <Route path="/vara-tjanster" element={<Navigate to="/" replace />} />
          <Route path="/nyheter" element={<Navigate to="/events/" replace />} />
          <Route path="/nyheter/f/*" element={<Navigate to="/events/" replace />} />
          <Route path="/start/f/*" element={<Navigate to="/events/" replace />} />
          <Route path="/f/*" element={<Navigate to="/events/" replace />} />
          <Route path="/dynamics-365-introduktion" element={<Navigate to="/" replace />} />
          <Route path="/dynamics-365-demos" element={<Navigate to="/" replace />} />
          <Route path="/partner" element={<Navigate to="/valj-partner/" replace />} />
          <Route path="/konfigurator" element={<Navigate to="/" replace />} />
          <Route path="/sekretesspolicy" element={<Navigate to="/dataskydd/" replace />} />
          <Route path="/start" element={<Navigate to="/" replace />} />
          <Route path="/evenemang" element={<Navigate to="/events/" replace />} />
          <Route path="/dynamics-365-customer-engagement-crm" element={<Navigate to="/crm/" replace />} />
          <Route path="/dynamics-365-erp-business-central" element={<Navigate to="/business-central/" replace />} />
          <Route path="/aktuellt" element={<Navigate to="/events/" replace />} />
          <Route path="/aktuellt/*" element={<Navigate to="/events/" replace />} />
          <Route path="/projektpaket" element={<Navigate to="/" replace />} />
          <Route path="/sok" element={<SmartSearch />} />
          <Route path="/fraga-ai" element={<AskAi />} />
          <Route path="/search" element={<Navigate to="/sok" replace />} />
          <Route path="/våratjänster" element={<Navigate to="/" replace />} />
          <Route path="/kunskapscenter" element={<Kunskapscenter />} />
          <Route path="/kunskapscenter/upphandlingsresan" element={<Upphandlingsresan />} />
          <Route path="/kunskapscenter/:productSlug/:articleSlug" element={<DeepDiveArticle />} />
          <Route path="/artiklar/:slug" element={<BlogArticle />} />
          <Route path="/events" element={<Events />} />
          <Route path="/kravspecifikation" element={<RequirementsSpec />} />
          <Route path="/kravspecifikation-sales" element={<RequirementsSpecSales />} />
          <Route path="/kravspecifikation-marketing" element={<RequirementsSpecMarketing />} />
          <Route path="/kravspecifikation-kundservice" element={<RequirementsSpecCustomerService />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/partner-events/:token" element={<PartnerEvents />} />
          {/* Hidden partner pages – not in nav, not in sitemap, noindex */}
          <Route path="/partnerstatistik" element={<PartnerStats />} />
          <Route path="/partner-statistik" element={<PartnerStats />} />
          <Route path="/avtalssida" element={<PartnerAgreement />} />
          <Route path="/partner-avtal" element={<PartnerAgreement />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </ChunkErrorBoundary>
      
      {/* Deferred non-critical components – loaded after page is idle */}
      {deferredReady && (
        <Suspense fallback={null}>
          <CookieBanner />
          <SnitcherTracking />
          <VisitorTracking />
          <AiChatBubble />
        </Suspense>
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Suspense fallback={null}>
        <Toaster />
        <Sonner />
      </Suspense>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
