import { lazy, Suspense } from "react";
import ChunkErrorBoundary from "@/components/ChunkErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PartnerCompareProvider } from "@/contexts/PartnerCompareContext";
import PartnerCompareBar from "@/components/PartnerCompareBar";
import ScrollToTop from "@/components/ScrollToTop";
import TrailingSlashRedirect from "@/components/TrailingSlashRedirect";
import { useDeferredLoad } from "@/hooks/useDeferredLoad";

import Index from "./pages/Index";

// Lazy load non-critical UI shell components
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));
const CookieBanner = lazy(() => import("@/components/CookieBanner"));
const ExitIntentOffer = lazy(() => import("@/components/ExitIntentOffer"));
const SnitcherTracking = lazy(() => import("@/components/SnitcherTracking"));
// Besöksmätningen laddas eagerly (mycket liten) – som lazy chunk tappades
// sidvisningar från besökare som lämnade innan chunken hunnit laddas.
import VisitorTracking from "@/components/VisitorTracking";

// Lazy load pages for code splitting
const NotFound = lazy(() => import("./pages/NotFound"));
const CRM = lazy(() => import("./pages/CRM"));
const BusinessCentral = lazy(() => import("./pages/BusinessCentral"));
const FinanceSupplyChain = lazy(() => import("./pages/FinanceSupplyChain"));
const FscmMatchningstest = lazy(() => import("./pages/FscmMatchningstest"));
const BcMatchningstest = lazy(() => import("./pages/BcMatchningstest"));
const CrmMatchningstest = lazy(() => import("./pages/CrmMatchningstest"));
const CrmMatchningstestResultat = lazy(() => import("./pages/CrmMatchningstestResultat"));
const BcRoiCalculator = lazy(() => import("./pages/BcRoiCalculator"));
const SalesRoiCalculator = lazy(() => import("./pages/SalesRoiCalculator"));
const ProductRoiPage = lazy(() => import("./pages/ProductRoiPage"));
const ErpComparisonsHub = lazy(() => import("./pages/ErpComparisonsHub"));
const ErpComparisonPage = lazy(() => import("./pages/ErpComparisonPage"));
const ERPOverview = lazy(() => import("./pages/ERPOverview"));
const Affarssystem = lazy(() => import("./pages/Affarssystem"));

const Copilot = lazy(() => import("./pages/Copilot"));
const Agents = lazy(() => import("./pages/Agents"));
const AIOverview = lazy(() => import("./pages/AIOverview"));
const AIReadiness = lazy(() => import("./pages/AIReadiness"));
const QA = lazy(() => import("./pages/QA"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const OmThomasLaine = lazy(() => import("./pages/OmThomasLaine"));
const OmMichaelUhman = lazy(() => import("./pages/OmMichaelUhman"));
const ValjPartner = lazy(() => import("./pages/ValjPartner"));
const AllD365Partners = lazy(() => import("./pages/AllD365Partners"));
const PartnersPerBransch = lazy(() => import("./pages/PartnersPerBransch"));
const ProductPartnersSverige = lazy(() => import("./pages/ProductPartnersSverige"));
const PartnersSitemap = lazy(() => import("./pages/PartnersSitemap"));
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
const D365ProjectOperations = lazy(() => import("./pages/D365ProjectOperations"));
const D365Commerce = lazy(() => import("./pages/D365Commerce"));
const D365HumanResources = lazy(() => import("./pages/D365HumanResources"));
const PartnerProfile = lazy(() => import("./pages/PartnerProfile"));
const PartnerBasicProfile = lazy(() => import("./pages/PartnerBasicProfile"));
const PartnerExtendedContent = lazy(() => import("./pages/PartnerExtendedContent"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminMcpTest = lazy(() => import("./pages/AdminMcpTest"));
const AdminRelevanceTest = lazy(() => import("./pages/AdminRelevanceTest"));
const PartnerUpdate = lazy(() => import("./pages/PartnerUpdate"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const PartnerEvents = lazy(() => import("./pages/PartnerEvents"));
const RequirementsSpec = lazy(() => import("./pages/RequirementsSpec"));
const RequirementsSpecSales = lazy(() => import("./pages/RequirementsSpecSales"));
const RequirementsSpecMarketing = lazy(() => import("./pages/RequirementsSpecMarketing"));
const RequirementsSpecCustomerService = lazy(() => import("./pages/RequirementsSpecCustomerService"));
const Kunskapscenter = lazy(() => import("./pages/Kunskapscenter"));
const KunskapscenterHub = lazy(() => import("./pages/KunskapscenterHub"));
const BCTillaggKatalog = lazy(() => import("./pages/BCTillaggKatalog"));
const Upphandlingsresan = lazy(() => import("./pages/Upphandlingsresan"));
const Upphandlingsguiden = lazy(() => import("./pages/Upphandlingsguiden"));
const VideoLanding = lazy(() => import("./pages/VideoLanding"));
const Branscher = lazy(() => import("./pages/Branscher"));
const IndustryPage = lazy(() => import("./pages/IndustryPage"));
const DeepDiveArticle = lazy(() => import("./pages/DeepDiveArticle"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const KomIgang = lazy(() => import("./pages/KomIgang"));
const PartnerStats = lazy(() => import("./pages/PartnerStats"));
const PartnerAgreement = lazy(() => import("./pages/PartnerAgreement"));
const SmartSearch = lazy(() => import("./pages/SmartSearch"));
const AskAi = lazy(() => import("./pages/AskAi"));
const Beslutsmognadsindex = lazy(() => import("./pages/Beslutsmognadsindex"));
const BeslutsmognadDiagnostik = lazy(() => import("./pages/BeslutsmognadDiagnostik"));
const BeslutsmognadTack = lazy(() => import("./pages/BeslutsmognadTack"));
const TackNedladdning = lazy(() => import("./pages/TackNedladdning"));
const BeslutsmognadResultat = lazy(() => import("./pages/BeslutsmognadResultat"));
const OwnershipAndInterests = lazy(() => import("./pages/OwnershipAndInterests"));
const Friskrivning = lazy(() => import("./pages/Friskrivning"));
const Priser = lazy(() => import("./pages/Priser"));
const Kostnad = lazy(() => import("./pages/Kostnad"));
const ImplementationCalculator = lazy(() => import("./pages/ImplementationCalculator"));
const ComparePartners = lazy(() => import("./pages/ComparePartners"));
const Partnernytt = lazy(() => import("./pages/Partnernytt"));
const PartnerNewsDetail = lazy(() => import("./pages/PartnerNewsDetail"));
const IsvCompare = lazy(() => import("./pages/IsvCompare"));
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
          <Route path="/businesscentral/matchningstest" element={<BcMatchningstest />} />
          <Route path="/business-central/matchningstest" element={<Navigate to="/businesscentral/matchningstest" replace />} />
          <Route path="/businesscentral/roi-kalkylator" element={<BcRoiCalculator />} />
          <Route path="/business-central/roi-kalkylator" element={<Navigate to="/businesscentral/roi-kalkylator" replace />} />
          <Route path="/d365sales/roi-kalkylator" element={<SalesRoiCalculator />} />
          <Route path="/finance-supply-chain/roi-kalkylator" element={<ProductRoiPage productKey="finance-scm" />} />
          <Route path="/finance-supply-chain-management/roi-kalkylator" element={<Navigate to="/finance-supply-chain/roi-kalkylator" replace />} />
          <Route path="/d365customerservice/roi-kalkylator" element={<ProductRoiPage productKey="customer-service" />} />
          <Route path="/d365marketing/roi-kalkylator" element={<ProductRoiPage productKey="customer-insights" />} />
          <Route path="/d365contactcenter/roi-kalkylator" element={<ProductRoiPage productKey="contact-center" />} />
          <Route path="/d365fieldservice/roi-kalkylator" element={<ProductRoiPage productKey="field-service" />} />
          <Route path="/jamfor" element={<ErpComparisonsHub />} />
          <Route path="/jamfor/:slug" element={<ErpComparisonPage />} />
          <Route path="/finance-supply-chain" element={<FinanceSupplyChain />} />
          <Route path="/finance-supply-chain-management/matchningstest" element={<FscmMatchningstest />} />
          <Route path="/finance-supply-chain/matchningstest" element={<Navigate to="/finance-supply-chain-management/matchningstest" replace />} />
          <Route path="/d365sales/matchningstest" element={<CrmMatchningstest productKey="sales" />} />
          <Route path="/d365sales/matchningstest/resultat" element={<CrmMatchningstestResultat productKey="sales" />} />
          <Route path="/d365customerservice/matchningstest" element={<CrmMatchningstest productKey="customer-service" />} />
          <Route path="/d365customerservice/matchningstest/resultat" element={<CrmMatchningstestResultat productKey="customer-service" />} />
          <Route path="/d365marketing/matchningstest" element={<CrmMatchningstest productKey="marketing" />} />
          <Route path="/d365marketing/matchningstest/resultat" element={<CrmMatchningstestResultat productKey="marketing" />} />
          <Route path="/d365fieldservice/matchningstest" element={<CrmMatchningstest productKey="field-service" />} />
          <Route path="/d365fieldservice/matchningstest/resultat" element={<CrmMatchningstestResultat productKey="field-service" />} />
          <Route path="/d365contactcenter/matchningstest" element={<CrmMatchningstest productKey="contact-center" />} />
          <Route path="/d365contactcenter/matchningstest/resultat" element={<CrmMatchningstestResultat productKey="contact-center" />} />
          <Route path="/erp" element={<ERPOverview />} />
          <Route path="/d365projectoperations" element={<D365ProjectOperations />} />
          <Route path="/d365commerce" element={<D365Commerce />} />
          <Route path="/d365humanresources" element={<D365HumanResources />} />
          <Route path="/affarssystem" element={<Affarssystem />} />
          <Route path="/affarssystem/partners" element={<Navigate to="/business-central-partners-sverige/" replace />} />
          <Route path="/copilot" element={<Copilot />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/aioversikt" element={<AIOverview />} />
          <Route path="/ai-oversikt" element={<Navigate to="/aioversikt" replace />} />
          <Route path="/ai-readiness" element={<AIReadiness />} />
          <Route path="/qa" element={<QA />} />
          <Route path="/kontakt" element={<ContactUs />} />
          <Route path="/om-thomas-laine" element={<OmThomasLaine />} />
          <Route path="/om-michael-uhman" element={<OmMichaelUhman />} />
          
          <Route path="/valjdynamics365partner" element={<ValjPartner />} />
          <Route path="/valj-partner" element={<Navigate to="/valjdynamics365partner" replace />} />
          <Route path="/valj-partner/*" element={<Navigate to="/valjdynamics365partner" replace />} />
          <Route path="/alla-d365-partners" element={<AllD365Partners />} />
          <Route path="/partners-per-bransch" element={<PartnersPerBransch />} />
          <Route path="/partners-sitemap" element={<PartnersSitemap />} />
          <Route path="/business-central-partners-sverige" element={<ProductPartnersSverige configSlug="business-central-partners-sverige" />} />
          <Route path="/finance-supply-chain-partners-sverige" element={<ProductPartnersSverige configSlug="finance-supply-chain-partners-sverige" />} />
          <Route path="/dynamics-365-sales-partners-sverige" element={<ProductPartnersSverige configSlug="dynamics-365-sales-partners-sverige" />} />
          <Route path="/dynamics-365-marketing-partners-sverige" element={<ProductPartnersSverige configSlug="dynamics-365-marketing-partners-sverige" />} />
          <Route path="/dynamics-365-customer-service-partners-sverige" element={<ProductPartnersSverige configSlug="dynamics-365-customer-service-partners-sverige" />} />
          <Route path="/dynamics-365-field-service-partners-sverige" element={<ProductPartnersSverige configSlug="dynamics-365-field-service-partners-sverige" />} />
          <Route path="/dynamics-365-contact-center-partners-sverige" element={<ProductPartnersSverige configSlug="dynamics-365-contact-center-partners-sverige" />} />
          <Route path="/dynamics-365-ai-copilot-partners-sverige" element={<ProductPartnersSverige configSlug="dynamics-365-ai-copilot-partners-sverige" />} />
          <Route path="/dataskydd" element={<PrivacyPolicy />} />
          <Route path="/ERPbehovsanalys" element={<NeedsAnalysis />} />
          <Route path="/behovsanalys" element={<Navigate to="/ERPbehovsanalys" replace />} />
          <Route path="/kom-igang" element={<KomIgang />} />
          
          <Route path="/CRMbehovsanalys" element={<SalesMarketingNeedsAnalysis />} />
          <Route path="/salj-marknad-behovsanalys" element={<Navigate to="/CRMbehovsanalys" replace />} />
          <Route path="/kundservice-behovsanalys" element={<CustomerServiceNeedsAnalysis />} />
          <Route path="/branschlosningar" element={<Navigate to="/branscher" replace />} />
          <Route path="/branschlosningar/*" element={<Navigate to="/branscher" replace />} />
          <Route path="/branscher" element={<Branscher />} />
          <Route path="/branscher/:slug" element={<IndustryPage />} />
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
          <Route path="/partner/:slug" element={<PartnerProfile />} />
          <Route path="/partner/:slug/fordjupning" element={<PartnerExtendedContent />} />
          <Route path="/partner/:slug/fordjupning/" element={<PartnerExtendedContent />} />
          <Route path="/partner/:slug/:productSlug" element={<PartnerProfile />} />
          <Route path="/basic/:slug" element={<PartnerBasicProfile />} />
          <Route path="/basic/:slug/" element={<PartnerBasicProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/mcp-test" element={<AdminMcpTest />} />
          <Route path="/admin/relevans-test" element={<AdminRelevanceTest />} />
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
          <Route path="/partner" element={<Navigate to="/valjdynamics365partner/" replace />} />
          <Route path="/konfigurator" element={<Navigate to="/" replace />} />
          <Route path="/sekretesspolicy" element={<Navigate to="/dataskydd/" replace />} />
          <Route path="/start" element={<Navigate to="/" replace />} />
          <Route path="/evenemang" element={<Navigate to="/events/" replace />} />
          <Route path="/dynamics-365-customer-engagement-crm" element={<Navigate to="/crm/" replace />} />
          <Route path="/dynamics-365-erp-business-central" element={<Navigate to="/businesscentral/" replace />} />
          <Route path="/aktuellt" element={<Navigate to="/events/" replace />} />
          <Route path="/aktuellt/*" element={<Navigate to="/events/" replace />} />
          <Route path="/projektpaket" element={<Navigate to="/" replace />} />
          <Route path="/AI-sok" element={<SmartSearch />} />
          <Route path="/AIsok" element={<Navigate to="/AI-sok" replace />} />
          <Route path="/sok" element={<Navigate to="/AI-sok" replace />} />
          <Route path="/fraga-ai" element={<AskAi />} />
          <Route path="/search" element={<Navigate to="/AI-sok" replace />} />
          <Route path="/våratjänster" element={<Navigate to="/" replace />} />
          <Route path="/kunskapscenter" element={<Kunskapscenter />} />
          <Route path="/priser" element={<Priser />} />
          <Route path="/kostnad" element={<Kostnad />} />
          <Route path="/implementationskalkylator" element={<ImplementationCalculator />} />
          <Route path="/kostnadskalkylator" element={<Navigate to="/implementationskalkylator" replace />} />
          <Route path="/kunskapscenter/upphandlingsresan" element={<Upphandlingsresan />} />
          <Route path="/upphandlingsguiden" element={<Upphandlingsguiden />} />
          <Route path="/kunskapscenter/video/:slug" element={<VideoLanding />} />
          {/* Topical hubs – explicit slugs (registered before the generic 2-segment article route) */}
          <Route path="/kunskapscenter/business-central" element={<KunskapscenterHub slug="business-central" />} />
          <Route path="/kunskapscenter/business-central-tillagg" element={<KunskapscenterHub slug="business-central-tillagg" />} />
          <Route path="/kunskapscenter/business-central-tillagg/katalog" element={<BCTillaggKatalog />} />
          <Route path="/kunskapscenter/finance-supply-chain" element={<KunskapscenterHub slug="finance-supply-chain" />} />
          <Route path="/kunskapscenter/sales" element={<KunskapscenterHub slug="sales" />} />
          <Route path="/kunskapscenter/customer-service" element={<KunskapscenterHub slug="customer-service" />} />
          <Route path="/kunskapscenter/copilot" element={<KunskapscenterHub slug="copilot" />} />
          <Route path="/kunskapscenter/upphandling" element={<KunskapscenterHub slug="upphandling" />} />
          <Route path="/kunskapscenter/partners" element={<KunskapscenterHub slug="partners" />} />
          <Route path="/bc-ap-automation" element={<Navigate to="/kunskapscenter/business-central/tillagg-fakturahantering/" replace />} />
          <Route path="/bc-svensk-lokalisering" element={<Navigate to="/kunskapscenter/business-central/tillagg-svensk-lokalisering/" replace />} />
          <Route path="/bc-ehandel" element={<Navigate to="/kunskapscenter/business-central/tillagg-ehandel/" replace />} />
          <Route path="/bc-retail-pos" element={<Navigate to="/kunskapscenter/business-central/tillagg-retail-pos/" replace />} />
          <Route path="/bc-branschlosningar" element={<Navigate to="/kunskapscenter/business-central/tillagg-branschpaket/" replace />} />
          <Route path="/business-central-tillagg" element={<Navigate to="/kunskapscenter/business-central-tillagg/" replace />} />
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
          {/* Beslutsmognad – editorial publication (kortad från /beslutsmognadsindex) */}
          <Route path="/beslutsmognad" element={<Beslutsmognadsindex />} />
          <Route path="/beslutsmognad/diagnostik" element={<BeslutsmognadDiagnostik />} />
          <Route path="/beslutsmognad/tack" element={<BeslutsmognadTack />} />
          <Route path="/beslutsmognad/resultat" element={<BeslutsmognadResultat />} />
          <Route path="/tack-nedladdning" element={<TackNedladdning />} />
          <Route path="/beslutsmognadsindex" element={<Navigate to="/beslutsmognad" replace />} />
          <Route path="/beslutsmognadsindex/diagnostik" element={<Navigate to="/beslutsmognad/diagnostik" replace />} />
          <Route path="/beslutsmognadsindex/tack" element={<Navigate to="/beslutsmognad/tack" replace />} />
          {/* Ägande- och intresseredovisning – transparenssida */}
          <Route path="/agande-och-intressen" element={<OwnershipAndInterests />} />
          <Route path="/friskrivning" element={<Friskrivning />} />
          <Route path="/jamfor-partners" element={<ComparePartners />} />
          <Route path="/compare/:slug" element={<IsvCompare />} />
          <Route path="/partnernytt" element={<Partnernytt />} />
          <Route path="/partnernytt/artikel/:id" element={<PartnerNewsDetail />} />
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
          <ExitIntentOffer />
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
        <PartnerCompareProvider>
          <AppShell />
          <PartnerCompareBar />
          
        </PartnerCompareProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
