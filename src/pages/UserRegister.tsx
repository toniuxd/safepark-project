import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import PageWrapper from "@/components/safepark/PageWrapper";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import StepBar from "@/components/safepark/StepBar";
import { ArrowLeft, User, AtSign, Phone, Lock, ArrowRight } from "lucide-react";

const getStrength = (pw: string): { label: string; level: number; color: string } => {
  if (!pw) return { label: "", level: 0, color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "WEAK STRENGTH", level: 1, color: "bg-destructive" };
  if (score <= 2) return { label: "FAIR STRENGTH", level: 2, color: "bg-sp-warning" };
  return { label: "STRONG", level: 3, color: "bg-green-500" };
};

const UserRegister = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setUserType = useAuthStore((s) => s.setUserType);
  const setStep = useOnboardingStore((s) => s.setStep);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getStrength(password), [password]);

  const valid =
    fullName.trim().length > 0 &&
    email.includes("@") &&
    phone.trim().length > 0 &&
    password.length >= 8 &&
    agreed;

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    // Update phone in profile
    if (data.user) {
      await supabase.from("profiles").update({ phone }).eq("user_id", data.user.id);
      setUser(data.user);
      setUserType("user");
      setStep(1);
      navigate("/onboarding/verify-email");
    }
    setLoading(false);
  };

  return (
    <PageWrapper className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,hsl(232_90%_12%)_0%,hsl(230_80%_7%)_45%,hsl(230_85%_5%)_100%)] px-0 py-0">
      <div className="mx-auto max-w-[390px] min-h-screen flex flex-col">
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/5 bg-black/20">
          <button onClick={() => navigate("/login")} className="text-sp-teal/90 hover:text-sp-teal transition-colors">
            <ArrowLeft size={20} />
          </button>
          <span className="font-bold text-lg text-sp-teal tracking-[0.15em] uppercase">
            SafePark
          </span>
          <div className="w-5" />
        </div>

        <div className="px-5 pt-6 pb-8 flex-1">
          <div className="rounded-[34px] border border-white/5 bg-[linear-gradient(180deg,rgba(25,33,89,0.55)_0%,rgba(12,16,42,0.82)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)] space-y-6">
            <StepBar total={5} current={1} />

            {/* Icon */}
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-16 h-16 rounded-card bg-cyan-900/40 border border-cyan-300/20 flex items-center justify-center">
                <Lock className="text-cyan-300" size={28} />
              </div>
              <h1 className="text-title text-foreground">Create Account</h1>
              <p className="text-sp-text-secondary text-sm">Join the nocturnal security network.</p>
            </div>

            {/* Fields */}
            <div className="space-y-4 flex-1">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Full Name</label>
                <div className="relative">
                  <InputField placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pr-10 bg-black/25 border-white/10" />
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-text-secondary" size={18} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Email Address</label>
                <div className="relative">
                  <InputField type="email" placeholder="john@safepark.io" value={email} onChange={(e) => setEmail(e.target.value)} className="pr-10 bg-black/25 border-white/10" />
                  <AtSign className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-text-secondary" size={18} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Phone Number</label>
                <div className="relative">
                  <InputField type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="pr-10 bg-black/25 border-white/10" />
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-text-secondary" size={18} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Password</label>
                <div className="relative">
                  <InputField type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10 bg-black/25 border-white/10" />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-text-secondary" size={18} />
                </div>
                {/* Strength bar */}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= strength.level ? strength.color : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className={`text-xs font-semibold ${strength.level === 1 ? "text-destructive" : strength.level === 2 ? "text-sp-warning" : "text-green-500"}`}>
                        {strength.label}
                      </span>
                      <span className="text-xs text-sp-text-secondary">Min. 8 characters</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 text-sm text-sp-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded accent-sp-blue bg-sp-surface border-border"
                />
                <span>
                  I agree to the{" "}
                  <span className="text-sp-teal font-semibold">Terms of Service</span> and{" "}
                  <span className="text-sp-teal font-semibold">Privacy Policy</span>.
                </span>
              </label>

              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>

            <PillButton
              onClick={handleSubmit}
              disabled={!valid || loading}
              className="h-14 bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.35)]"
            >
              {loading ? "Creating…" : "Next"} <ArrowRight size={18} className="inline ml-1" />
            </PillButton>

            <p className="text-center text-sm text-sp-text-secondary">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-300 font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default UserRegister;
