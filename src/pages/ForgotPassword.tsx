import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { backendClient as supabase } from "@/lib/backendClient";
import PageWrapper from "@/components/safepark/PageWrapper";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import { ArrowLeft, Mail, KeyRound } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  };

  return (
    <PageWrapper className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,hsl(232_90%_12%)_0%,hsl(230_80%_7%)_45%,hsl(230_85%_5%)_100%)] px-0 py-0">
      <div className="mx-auto max-w-[390px] min-h-screen flex flex-col">
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/5 bg-black/20">
          <button type="button" onClick={() => navigate("/index")} className="text-sp-teal/90 hover:text-sp-teal transition-colors">
            <ArrowLeft size={20} />
          </button>
          <span className="font-bold text-lg text-sp-teal tracking-[0.15em] uppercase">SafePark</span>
          <div className="w-5" />
        </div>

        <div className="px-5 pt-6 pb-8 flex-1">
          <div className="rounded-[34px] border border-white/5 bg-[linear-gradient(180deg,rgba(25,33,89,0.55)_0%,rgba(12,16,42,0.82)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)] space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-900/40 border border-cyan-300/20 flex items-center justify-center mb-4">
                <KeyRound className="text-cyan-300" size={28} />
              </div>
              <h1 className="text-title text-foreground">
                {sent ? "Check Your Email" : "Forgot Password?"}
              </h1>
              <p className="text-sp-text-secondary text-sm">
                {sent
                  ? `We sent a password reset link to ${email}. Check your inbox and follow the link.`
                  : "Enter your email and we'll send you a link to reset your password."}
              </p>
            </div>

            {!sent ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <InputField
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-10 bg-black/25 border-white/10"
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-text-secondary" size={18} />
                  </div>
                  {error && <p className="text-destructive text-sm mt-1.5">{error}</p>}
                </div>

                <PillButton
                  onClick={handleSubmit}
                  disabled={!email.includes("@") || loading}
                  className="h-14 mt-2 bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </PillButton>
              </div>
            ) : (
              <div className="space-y-4">
                <PillButton
                  onClick={() => setSent(false)}
                  className="h-14 bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                >
                  Try a different email
                </PillButton>
              </div>
            )}

            <p className="text-center text-sm text-sp-text-secondary">
              Remember your password?{" "}
              <Link to="/index" className="text-cyan-300 font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ForgotPassword;
