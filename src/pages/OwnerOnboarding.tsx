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
    <PageWrapper className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,hsl(232_90%_12%)_0%,hsl(230_80%_7%)_45%,hsl(230_85%_5%)_100%)] px-0 py-0">
      <div className="mx-auto max-w-[390px] min-h-screen flex flex-col">
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/5 bg-black/20">
          <button
            onClick={() => {
              if (stepIndex > 0) navigate(stepPaths[stepIndex - 1]);
              else navigate("/owner/register");
            }}
            className="text-sp-teal/90 hover:text-sp-teal transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="font-bold text-lg text-sp-teal tracking-[0.15em] uppercase">
            SafePark
          </span>
          <div className="w-5" />
        </div>

        <div className="px-5 pt-6 pb-8 flex-1">
          <div className="rounded-[34px] border border-white/5 bg-[linear-gradient(180deg,rgba(25,33,89,0.55)_0%,rgba(12,16,42,0.82)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)] space-y-5 min-h-full">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <StepBar total={5} current={displayStep} variant="teal" />
              </div>
              <span className="text-sp-teal font-bold text-xs uppercase tracking-widest">{displayStep}/5</span>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default OwnerOnboarding;
