import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CryptoDashboard from "./pages/demos/CryptoDashboard";
import OptMaxDemo from "./pages/demos/OptMaxDemo";
import CollabProDemo from "./pages/demos/CollabProDemo";
import NLPAnalysisDemo from "./pages/demos/NLPAnalysisDemo";
import FinancialAnalyticsDemo from "./pages/demos/FinancialAnalyticsDemo";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/demo/crypto" element={<CryptoDashboard />} />
            <Route path="/demo/optmax" element={<OptMaxDemo />} />
            <Route path="/demo/collab-pro" element={<CollabProDemo />} />
            <Route path="/demo/nlp-analysis" element={<NLPAnalysisDemo />} />
            <Route path="/demo/financial-analytics" element={<FinancialAnalyticsDemo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
