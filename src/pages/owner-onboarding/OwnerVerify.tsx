import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOwnerOnboardingStore } from "@/stores/useOwnerOnboardingStore";
import PillButton from "@/components/safepark/PillButton";
import GhostButton from "@/components/safepark/GhostButton";
import { Mail, Phone, ShieldCheck } from "lucide-react";

type Phase = "email" | "phone" | "done";

const OwnerVerify = () => {
  const navigate = useNavigate();
  const { setStep, setEmailVerified, setPhoneVerified } = useOwnerOnboardingStore();
  const [phase, setPhase] = useState<Phase>("email");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(45);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, [phase]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus();
  };

  const filled = otp.every((d) => d !== "");

  const handleVerify = () => {
    if (phase === "email") {
      setEmailVerified(true);
      setOtp(["", "", "", "", "", ""]);
      setCountdown(45);
      setPhase("phone");
    } else {
      setPhoneVerified(true);
      setStep(2);
      navigate("/owner/onboarding/lot-details");
    }
  };

  const icon = phase === "email" ? <Mail size={28} /> : <Phone size={28} />;
  const title = phase === "email" ? "Verify Your Email" : "Verify Your Phone";
  const sub = phase === "email"
    ? "Enter the 6-digit code sent to your email."
    : "Enter the 6-digit code sent to your phone.";

  return (
    <div className="flex flex-col items-center gap-6 flex-1">
      <div className="w-14 h-14 rounded-card bg-sp-surface flex items-center justify-center text-sp-teal">
        {icon}
      </div>
      <div className="text-center">
        <h2 className="text-foreground font-bold text-xl">{title}</h2>
        <p className="text-sp-text-secondary text-sm mt-1">{sub}</p>
      </div>

      <div className="flex gap-3 justify-center">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKey(i, e)}
            className="w-12 h-14 text-center text-xl font-bold bg-sp-surface border border-border rounded-input text-foreground focus:border-sp-teal focus:ring-2 focus:ring-sp-teal outline-none transition-colors"
          />
        ))}
      </div>

      <p className="text-sp-text-secondary text-sm">
        {countdown > 0 ? (
          <>Resend in <span className="text-sp-teal font-bold">0:{String(countdown).padStart(2, "0")}</span></>
        ) : (
          <button onClick={() => setCountdown(45)} className="text-sp-teal font-bold">Resend Code</button>
        )}
      </p>

      <div className="w-full space-y-3 mt-auto">
        <PillButton variant="teal" onClick={handleVerify} disabled={!filled}>
          Verify & Continue
        </PillButton>
      </div>
    </div>
  );
};

export default OwnerVerify;
