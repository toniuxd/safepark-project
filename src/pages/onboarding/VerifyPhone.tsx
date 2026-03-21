import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import PillButton from "@/components/safepark/PillButton";
import { ArrowRight } from "lucide-react";

const VerifyPhone = () => {
  const navigate = useNavigate();
  const setPhoneVerified = useOnboardingStore((s) => s.setPhoneVerified);
  const setStep = useOnboardingStore((s) => s.setStep);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [countdown, setCountdown] = useState(45);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleChange = useCallback(
    (idx: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const next = [...otp];
      next[idx] = value.slice(-1);
      setOtp(next);
      if (value && idx < 5) refs.current[idx + 1]?.focus();
    },
    [otp]
  );

  const handleKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus();
  };

  const filled = otp.every((d) => d !== "");

  const verify = () => {
    if (filled) {
      setPhoneVerified(true);
      setStep(3);
      navigate("/onboarding/add-car");
    }
  };

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  return (
    <div className="flex flex-col gap-6 flex-1">
      <div>
        <h1 className="text-title text-foreground">Verify Your Phone</h1>
        <p className="text-sp-text-secondary text-sm mt-1">
          We sent a 6-digit code to your phone. Enter it below.
        </p>
      </div>

      <div className="flex gap-2.5 justify-center">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            className="w-12 h-14 text-center text-xl font-bold bg-sp-surface border border-border rounded-input text-foreground outline-none focus:ring-2 focus:ring-sp-blue focus:border-sp-blue transition-colors"
          />
        ))}
      </div>

      <div className="text-center text-sm text-sp-text-secondary">
        {countdown > 0 ? (
          <span>Resend in {mins}:{secs.toString().padStart(2, "0")}</span>
        ) : (
          <button onClick={() => setCountdown(45)} className="text-sp-blue font-semibold">
            Resend code
          </button>
        )}
      </div>

      <div className="mt-auto">
        <PillButton onClick={verify} disabled={!filled}>
          Verify <ArrowRight size={18} className="inline ml-1" />
        </PillButton>
      </div>
    </div>
  );
};

export default VerifyPhone;
