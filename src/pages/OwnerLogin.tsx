import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import PageWrapper from "@/components/safepark/PageWrapper";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import { Building2, Lock, Eye, EyeOff, Mail } from "lucide-react";

const OwnerLogin = () => {
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
      setUserType("owner");
      navigate("/owner/home");
    }
  };

  return (
    <PageWrapper className="flex flex-col justify-center gap-8">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 rounded-card bg-sp-surface flex items-center justify-center mb-4">
          <Building2 className="text-sp-teal" size={28} />
        </div>
        <h1 className="text-title text-foreground">Owner Login</h1>
        <p className="text-sp-text-secondary text-sm">Manage your parking lots and earnings.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">
            Email Address
          </label>
          <div className="relative">
            <InputField
              type="email"
              placeholder="owner@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="teal"
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
              variant="teal"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-sp-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded accent-sp-teal bg-sp-surface border-border"
            />
            Remember me
          </label>
          <button type="button" className="text-sm text-sp-teal">
            Forgot password?
          </button>
        </div>

        <PillButton variant="teal" onClick={handleLogin} disabled={!email || !password || loading}>
          {loading ? "Signing in…" : "Sign In"}
        </PillButton>
      </div>

      <div className="text-center space-y-3 text-sm">
        <p className="text-sp-text-secondary">
          Don't have an owner account?{" "}
          <Link to="/owner/register" className="text-sp-teal font-semibold">
            Register
          </Link>
        </p>
        <Link to="/login" className="text-sp-blue font-semibold block">
          ← Back to User Login
        </Link>
      </div>
    </PageWrapper>
  );
};

export default OwnerLogin;
