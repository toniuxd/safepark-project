import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOwnerOnboardingStore } from "@/stores/useOwnerOnboardingStore";
import PageWrapper from "@/components/safepark/PageWrapper";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import StepBar from "@/components/safepark/StepBar";
import { ArrowLeft, Building2, User, AtSign, Phone, Lock, ArrowRight } from "lucide-react";

const getStrength = (pw: string) => {
  if (!pw) return { label: "", level: 0, color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "WEAK", level: 1, color: "bg-destructive" };
  if (score <= 2) return { label: "FAIR", level: 2, color: "bg-sp-warning" };
  return { label: "STRONG", level: 3, color: "bg-green-500" };
};

const OwnerRegister = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setUserType = useAuthStore((s) => s.setUserType);
  const setStep = useOwnerOnboardingStore((s) => s.setStep);

  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [ownerAgreed, setOwnerAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getStrength(password), [password]);

  const valid =
    fullName.trim().length > 0 &&
    businessName.trim().length > 0 &&
    email.includes("@") &&
    phone.trim().length > 0 &&
    password.length >= 8 &&
    agreed &&
    ownerAgreed;

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, business_name: businessName, userType: "owner" },
      },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from("profiles").update({ phone }).eq("user_id", data.user.id);
      setUser(data.user);
      setUserType("owner");
      setStep(1);
      navigate("/owner/onboarding/verify");
    }
    setLoading(false);
  };

  return (
    <PageWrapper className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate("/owner/login")} className="text-sp-text-secondary">
          <ArrowLeft size={22} />
        </button>
        <span className="font-bold text-foreground text-lg">SafePark</span>
        <span className="text-sp-teal font-bold text-xs uppercase tracking-widest">Owner</span>
      </div>

      <StepBar total={6} current={1} variant="teal" />

      <div className="flex flex-col items-center gap-2 py-1">
        <div className="w-14 h-14 rounded-card bg-sp-surface flex items-center justify-center">
          <Building2 className="text-sp-teal" size={26} />
        </div>
        <h1 className="text-title text-foreground">Owner Registration</h1>
        <p className="text-sp-text-secondary text-sm text-center">List your lot and start earning.</p>
      </div>

      <div className="space-y-3 flex-1">
        <Field label="Full Name" icon={<User size={18} />}>
          <InputField variant="teal" placeholder="Jane Smith" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pr-10" />
        </Field>
        <Field label="Business Name" icon={<Building2 size={18} />}>
          <InputField variant="teal" placeholder="Smith Parking LLC" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="pr-10" />
        </Field>
        <Field label="Email" icon={<AtSign size={18} />}>
          <InputField variant="teal" type="email" placeholder="jane@business.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pr-10" />
        </Field>
        <Field label="Phone" icon={<Phone size={18} />}>
          <InputField variant="teal" type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="pr-10" />
        </Field>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Password</label>
          <InputField variant="teal" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.level ? strength.color : "bg-border"}`} />
                ))}
              </div>
              <span className={`text-xs font-semibold ${strength.level === 1 ? "text-destructive" : strength.level === 2 ? "text-sp-warning" : "text-green-500"}`}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <label className="flex items-start gap-2.5 text-sm text-sp-text-secondary cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 mt-0.5 rounded accent-sp-teal bg-sp-surface border-border" />
          <span>
            I agree to the <span className="text-sp-teal font-semibold">Terms of Service</span> and <span className="text-sp-teal font-semibold">Privacy Policy</span>.
          </span>
        </label>
        <label className="flex items-start gap-2.5 text-sm text-sp-text-secondary cursor-pointer">
          <input type="checkbox" checked={ownerAgreed} onChange={(e) => setOwnerAgreed(e.target.checked)} className="w-4 h-4 mt-0.5 rounded accent-sp-teal bg-sp-surface border-border" />
          <span>
            I accept the <span className="text-sp-teal font-semibold">Owner Agreement</span> and listing requirements.
          </span>
        </label>

        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>

      <PillButton variant="teal" onClick={handleSubmit} disabled={!valid || loading}>
        {loading ? "Creating…" : "Next"} <ArrowRight size={18} className="inline ml-1" />
      </PillButton>

      <p className="text-center text-sm text-sp-text-secondary pb-4">
        Already have an account?{" "}
        <Link to="/owner/login" className="text-sp-teal font-semibold">Sign in</Link>
      </p>
    </PageWrapper>
  );
};

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">{label}</label>
      <div className="relative">
        {children}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-text-secondary pointer-events-none">{icon}</span>
      </div>
    </div>
  );
}

export default OwnerRegister;
