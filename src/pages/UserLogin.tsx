import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import PageWrapper from "@/components/safepark/PageWrapper";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

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
    <PageWrapper className="flex flex-col justify-center gap-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 rounded-card bg-sp-surface flex items-center justify-center mb-4">
          <Lock className="text-sp-blue" size={28} />
        </div>
        <h1 className="text-title text-foreground">Welcome Back</h1>
        <p className="text-sp-text-secondary text-sm">Sign in to find parking near you.</p>
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
              className="pr-10"
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
              className="pr-10"
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

        {/* Remember + Forgot */}
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
          <button type="button" className="text-sm text-sp-blue">
            Forgot password?
          </button>
        </div>

        <PillButton onClick={handleLogin} disabled={!email || !password || loading}>
          {loading ? "Signing in…" : "Sign In"}
        </PillButton>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-sp-text-secondary uppercase">or continue with</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Social (UI only) */}
      <div className="flex gap-3">
        <button className="flex-1 h-[48px] rounded-card bg-sp-surface border border-border flex items-center justify-center gap-2 text-sm text-foreground active:scale-[0.98] transition-transform">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.56-2.31z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>
        <button className="flex-1 h-[48px] rounded-card bg-sp-surface border border-border flex items-center justify-center gap-2 text-sm text-foreground active:scale-[0.98] transition-transform">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </button>
      </div>

      {/* Links */}
      <div className="text-center space-y-3 text-sm">
        <p className="text-sp-text-secondary">
          Don't have an account?{" "}
          <Link to="/register" className="text-sp-blue font-semibold">
            Sign up
          </Link>
        </p>
        <Link to="/owner/login" className="text-sp-teal font-semibold block">
          Parking Lot Owner? Login here
        </Link>
      </div>
    </PageWrapper>
  );
};

export default UserLogin;
