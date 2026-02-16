import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminSetup from "./pages/AdminSetup";
import Catalogue from "./pages/Catalogue";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";
import Blog from "./pages/Blog";
import Forum from "./pages/Forum";
import CourseReader from "./pages/CourseReader";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/error" element={<PaymentError />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/cours/:courseId" element={<CourseReader />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
