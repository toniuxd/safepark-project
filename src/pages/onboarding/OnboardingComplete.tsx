import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import PillButton from "@/components/safepark/PillButton";
import { ArrowRight, CheckCircle } from "lucide-react";

const OnboardingComplete = () => {
  const navigate = useNavigate();
  const reset = useOnboardingStore((s) => s.reset);

  const go = () => {
    reset();
    navigate("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 flex-1 text-center py-12">
      {/* Pulsing checkmark */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-sp-blue/20 animate-ping" />
        <div className="relative w-24 h-24 rounded-full bg-sp-blue/10 flex items-center justify-center">
          <CheckCircle className="text-sp-blue" size={52} />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-title text-foreground">You're ready to park.</h1>
        <p className="text-sp-text-secondary text-sm max-w-[280px] mx-auto">
          Your account is set up. Start finding secure parking spots near you.
        </p>
      </div>

      <div className="w-full mt-4">
        <PillButton onClick={go}>
          Find Parking <ArrowRight size={18} className="inline ml-1" />
        </PillButton>
      </div>
    </div>
  );
};

export default OnboardingComplete;
