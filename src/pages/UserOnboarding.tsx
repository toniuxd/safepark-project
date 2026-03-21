import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PageWrapper from "@/components/safepark/PageWrapper";
import StepBar from "@/components/safepark/StepBar";
import { ArrowLeft } from "lucide-react";

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
    <PageWrapper className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,hsl(232_90%_12%)_0%,hsl(230_80%_7%)_45%,hsl(230_85%_5%)_100%)] px-0 py-0">
      <div className="mx-auto max-w-[390px] min-h-screen flex flex-col">
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/5 bg-black/20">
          <button
            onClick={() => navigate(-1)}
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
          <div className="rounded-[34px] border border-white/5 bg-[linear-gradient(180deg,rgba(25,33,89,0.55)_0%,rgba(12,16,42,0.82)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)] space-y-6 min-h-full">
            {currentStep < 5 && <StepBar total={5} current={currentStep} />}
            <Outlet />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default UserOnboarding;
