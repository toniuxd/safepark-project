import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import PageWrapper from "@/components/safepark/PageWrapper";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Shield } from "lucide-react";

const UserLogin = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setUserType = useAuthStore((s) => s.setUserType);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data.user) {
      setUser(data.user);
      setUserType("user");
      navigate("/home");
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,hsl(232_90%_12%)_0%,hsl(230_80%_7%)_45%,hsl(230_85%_5%)_100%)] px-0 py-0">
      <div className="mx-auto max-w-[390px] min-h-screen flex flex-col">
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/5 bg-black/20">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sp-teal/90 hover:text-sp-teal transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="font-bold text-lg text-sp-teal tracking-[0.15em] uppercase">
            SafePark
          </span>
          <div className="w-5" />
        </div>

        <div className="px-5 pt-6 pb-8 flex-1">
          <div className="rounded-[34px] border border-white/5 bg-[linear-gradient(180deg,rgba(25,33,89,0.55)_0%,rgba(12,16,42,0.82)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)] space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-900/40 border border-cyan-300/20 flex items-center justify-center mb-4">
                <Shield className="text-cyan-300" size={28} />
              </div>
              <h1 className="text-title text-foreground">Welcome Back</h1>
              <p className="text-sp-text-secondary text-sm">Sign in to continue your secure parking flow.</p>
              {!isSupabaseConfigured && (
                <p className="text-amber-200/90 text-xs text-left rounded-xl bg-amber-500/10 border border-amber-400/25 p-3 mt-3">
                  Sign-in needs Supabase env on this host: set{" "}
                  <code className="text-[10px] bg-black/30 px-1 rounded">VITE_SUPABASE_URL</code> and{" "}
                  <code className="text-[10px] bg-black/30 px-1 rounded">VITE_SUPABASE_PUBLISHABLE_KEY</code>{" "}
                  (e.g. in your deployment dashboard), then redeploy.
                </p>
              )}
            </div>

            {/* Form */}
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
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <InputField
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 bg-black/25 border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-text-secondary"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error && <p className="text-destructive text-sm mt-1.5">{error}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-sp-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded accent-sp-blue bg-sp-surface border-border"
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-sp-blue">
                  Forgot password?
                </Link>
              </div>

              <PillButton
                onClick={handleLogin}
                disabled={!email || !password || loading}
                className="h-14 mt-2 bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.35)]"
              >
                {loading ? "Signing in..." : <>Sign In <ArrowRight size={18} className="inline ml-1" /></>}
              </PillButton>
            </div>

            <div className="text-center space-y-3 text-sm pt-2">
              <p className="text-sp-text-secondary">
                Don't have an account?{" "}
                <Link to="/register" className="text-cyan-300 font-semibold">
                  Sign up
                </Link>
              </p>
              <Link to="/owner/login" className="text-sp-teal font-semibold block">
                Parking Lot Owner? Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default UserLogin;
