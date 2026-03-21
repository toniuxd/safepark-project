import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PageWrapper from "@/components/safepark/PageWrapper";
import StepBar from "@/components/safepark/StepBar";
import { useOwnerOnboardingStore } from "@/stores/useOwnerOnboardingStore";
import { ArrowLeft } from "lucide-react";

const stepPaths = [
  "/owner/onboarding/verify",
  "/owner/onboarding/lot-details",
  "/owner/onboarding/hours-pricing",
  "/owner/onboarding/payout",
  "/owner/onboarding/review",
];

const OwnerOnboarding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentStep = useOwnerOnboardingStore((s) => s.currentStep);

  const stepIndex = stepPaths.findIndex((p) => location.pathname.startsWith(p));
  const displayStep = stepIndex >= 0 ? stepIndex + 1 : currentStep;

  return (
    <PageWrapper className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (stepIndex > 0) navigate(stepPaths[stepIndex - 1]);
            else navigate("/owner/register");
          }}
          className="text-sp-text-secondary"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1">
          <StepBar total={5} current={displayStep} variant="teal" />
        </div>
        <span className="text-sp-teal font-bold text-xs uppercase tracking-widest">
          {displayStep}/5
        </span>
      </div>
      <Outlet />
    </PageWrapper>
  );
};

export default OwnerOnboarding;
