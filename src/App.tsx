import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DoctorDirectory from "./pages/DoctorDirectory";
import DoctorDetail from "./pages/DoctorDetail";
import PatientAuth from "./pages/PatientAuth";
import Appointments from "./pages/Appointments";
import Chatbot from "./pages/Chatbot";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<PatientAuth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<DoctorDirectory />} />
          <Route path="/doctor/:id" element={<DoctorDetail />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/admin" element={<AdminPanel />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
