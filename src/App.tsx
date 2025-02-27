
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Registration from "./pages/reception/Registration";
import Triage from "./pages/triage/Triage";
import Doctor from "./pages/doctor/Doctor";
import Laboratory from "./pages/laboratory/Laboratory";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reception/registration" element={<Registration />} />
            <Route path="/triage" element={<Triage />} />
            <Route path="/doctor" element={<Doctor />} />
            <Route path="/laboratory" element={<Laboratory />} />
            {/* Placeholder routes for new modules - these will be implemented later */}
            <Route path="/pharmacy" element={<NotFound />} />
            <Route path="/billing" element={<NotFound />} />
            <Route path="/records" element={<NotFound />} />
            <Route path="/management" element={<NotFound />} />
            <Route path="/emergency" element={<NotFound />} />
            <Route path="/quality" element={<NotFound />} />
            <Route path="/supply" element={<NotFound />} />
            <Route path="/setup" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
