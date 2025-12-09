import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CRM from "./pages/CRM";
import BusinessCentral from "./pages/BusinessCentral";
import FinanceSupplyChain from "./pages/FinanceSupplyChain";
import Copilot from "./pages/Copilot";
import Agents from "./pages/Agents";
import QA from "./pages/QA";
import ContactUs from "./pages/ContactUs";
import Partner from "./pages/Partner";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NeedsAnalysis from "./pages/NeedsAnalysis";
import CRMNeedsAnalysis from "./pages/CRMNeedsAnalysis";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/business-central" element={<BusinessCentral />} />
          <Route path="/finance-supply-chain" element={<FinanceSupplyChain />} />
          <Route path="/copilot" element={<Copilot />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/qa" element={<QA />} />
          <Route path="/kontakt" element={<ContactUs />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/dataskydd" element={<PrivacyPolicy />} />
          <Route path="/behovsanalys" element={<NeedsAnalysis />} />
          <Route path="/crm-behovsanalys" element={<CRMNeedsAnalysis />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
