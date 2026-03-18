import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing.tsx";
import CircuitStudio from "./pages/CircuitStudio.tsx";
import KMapPage from "./pages/KMapPage.tsx";
import TruthTablePage from "./pages/TruthTablePage.tsx";
import BooleanAlgebraPage from "./pages/BooleanAlgebraPage.tsx";
import LearnPage from "./pages/LearnPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/circuit-studio" element={<CircuitStudio />} />
          <Route path="/kmap" element={<KMapPage />} />
          <Route path="/truth-table" element={<TruthTablePage />} />
          <Route path="/boolean-algebra" element={<BooleanAlgebraPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
