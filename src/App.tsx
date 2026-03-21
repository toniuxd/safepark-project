import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import UserOnboarding from "./pages/UserOnboarding";
import VerifyEmail from "./pages/onboarding/VerifyEmail";
import VerifyPhone from "./pages/onboarding/VerifyPhone";
import AddCar from "./pages/onboarding/AddCar";
import AddPayment from "./pages/onboarding/AddPayment";
import OnboardingComplete from "./pages/onboarding/OnboardingComplete";
import UserHome from "./pages/UserHome";
import ParkingFlow from "./pages/ParkingFlow";
import ParkingHistory from "./pages/ParkingHistory";
import UserProfile from "./pages/UserProfile";
import TicketPayment from "./pages/TicketPayment";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerRegister from "./pages/OwnerRegister";
import OwnerOnboarding from "./pages/OwnerOnboarding";
import OwnerVerify from "./pages/owner-onboarding/OwnerVerify";
import OwnerLotDetails from "./pages/owner-onboarding/OwnerLotDetails";
import OwnerHoursPricing from "./pages/owner-onboarding/OwnerHoursPricing";
import OwnerPayout from "./pages/owner-onboarding/OwnerPayout";
import OwnerReview from "./pages/owner-onboarding/OwnerReview";
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
          <Route path="/" element={<Navigate to="/index" replace />} />
          <Route path="/login" element={<Navigate to="/index" replace />} />
          <Route path="/index" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/onboarding" element={<UserOnboarding />}>
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="verify-phone" element={<VerifyPhone />} />
            <Route path="add-car" element={<AddCar />} />
            <Route path="add-payment" element={<AddPayment />} />
            <Route path="complete" element={<OnboardingComplete />} />
          </Route>
          <Route path="/home" element={<UserHome />} />
          <Route path="/parking/:lotId" element={<ParkingFlow />} />
          <Route path="/history" element={<ParkingHistory />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/ticket/:ticketId" element={<TicketPayment />} />
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/owner/register" element={<OwnerRegister />} />
          <Route path="/owner/onboarding" element={<OwnerOnboarding />}>
            <Route path="verify" element={<OwnerVerify />} />
            <Route path="lot-details" element={<OwnerLotDetails />} />
            <Route path="hours-pricing" element={<OwnerHoursPricing />} />
            <Route path="payout" element={<OwnerPayout />} />
            <Route path="review" element={<OwnerReview />} />
          </Route>
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
