import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import UserOnboarding from "./pages/UserOnboarding";
import UserHome from "./pages/UserHome";
import ParkingFlow from "./pages/ParkingFlow";
import ParkingHistory from "./pages/ParkingHistory";
import UserProfile from "./pages/UserProfile";
import TicketPayment from "./pages/TicketPayment";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerRegister from "./pages/OwnerRegister";
import OwnerOnboarding from "./pages/OwnerOnboarding";
import OwnerHome from "./pages/OwnerHome";
import OwnerEarnings from "./pages/OwnerEarnings";
import CarVerification from "./pages/CarVerification";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/onboarding/*" element={<UserOnboarding />} />
          <Route path="/home" element={<UserHome />} />
          <Route path="/parking/:lotId" element={<ParkingFlow />} />
          <Route path="/history" element={<ParkingHistory />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/ticket/:ticketId" element={<TicketPayment />} />
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/owner/register" element={<OwnerRegister />} />
          <Route path="/owner/onboarding/*" element={<OwnerOnboarding />} />
          <Route path="/owner/home" element={<OwnerHome />} />
          <Route path="/owner/earnings" element={<OwnerEarnings />} />
          <Route path="/owner/verify" element={<CarVerification />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
