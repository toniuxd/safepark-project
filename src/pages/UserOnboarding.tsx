import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PageWrapper from "@/components/safepark/PageWrapper";
import StepBar from "@/components/safepark/StepBar";
import { ArrowLeft } from "lucide-react";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { useEffect } from "react";

const stepMap: Record<string, number> = {
  "/onboarding/verify-email": 1,
  "/onboarding/verify-phone": 2,
  "/onboarding/add-car": 3,
  "/onboarding/add-payment": 4,
  "/onboarding/complete": 5,
};

const UserOnboarding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentStep = stepMap[location.pathname] ?? 1;

  return (
    <PageWrapper className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-sp-text-secondary">
          <ArrowLeft size={22} />
        </button>
        <span className="font-bold text-foreground text-lg">SafePark</span>
        <div className="w-[22px]" />
      </div>
      {currentStep < 5 && <StepBar total={5} current={currentStep} />}
      <Outlet />
    </PageWrapper>
  );
};

export default UserOnboarding;
