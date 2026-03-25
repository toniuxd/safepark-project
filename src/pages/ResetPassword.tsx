import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageWrapper from "@/components/safepark/PageWrapper";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import { ArrowLeft, Eye, EyeOff, ShieldCheck, KeyRound } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the auth redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Also check the URL hash for recovery type
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) {
      setError(err.message);
      return;
    }

    setSuccess(true);
    // Sign out after reset so user logs in fresh
    await supabase.auth.signOut();
    setTimeout(() => navigate("/index"), 3000);
  };

  if (!isRecovery && !success) {
    return (
      <PageWrapper className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,hsl(232_90%_12%)_0%,hsl(230_80%_7%)_45%,hsl(230_85%_5%)_100%)] px-0 py-0">
        <div className="mx-auto max-w-[390px] min-h-screen flex flex-col items-center justify-center px-5">
          <div className="rounded-[34px] border border-white/5 bg-[linear-gradient(180deg,rgba(25,33,89,0.55)_0%,rgba(12,16,42,0.82)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)] space-y-6 text-center w-full">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-900/40 border border-cyan-300/20 flex items-center justify-center">
              <KeyRound className="text-cyan-300" size={28} />
            </div>
            <h1 className="text-title text-foreground">Invalid Reset Link</h1>
            <p className="text-sp-text-secondary text-sm">
              This link is invalid or has expired. Please request a new password reset.
            </p>
            <Link to="/forgot-password">
              <PillButton className="h-14 bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.35)]">
                Request New Link
              </PillButton>
            </Link>
          </div>
        </div>
      </PageWrapper>
    );
  }

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
                {success ? <ShieldCheck className="text-green-400" size={28} /> : <KeyRound className="text-cyan-300" size={28} />}
              </div>
              <h1 className="text-title text-foreground">
                {success ? "Password Updated!" : "Set New Password"}
              </h1>
              <p className="text-sp-text-secondary text-sm">
                {success
                  ? "Your password has been reset. Redirecting you to sign in…"
                  : "Enter your new password below. Make it at least 8 characters."}
              </p>
            </div>

            {!success && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">
                    New Password
                  </label>
                  <div className="relative">
                    <InputField
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 bg-black/25 border-white/10"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-text-secondary">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <InputField
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10 bg-black/25 border-white/10"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-text-secondary">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {error && <p className="text-destructive text-sm mt-1.5">{error}</p>}
                </div>

                <PillButton
                  onClick={handleReset}
                  disabled={!password || !confirmPassword || loading}
                  className="h-14 mt-2 bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                >
                  {loading ? "Updating…" : "Update Password"}
                </PillButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ResetPassword;
