import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import { CreditCard, Wallet, ArrowRight } from "lucide-react";

const AddPayment = () => {
  const navigate = useNavigate();
  const setPaymentAdded = useOnboardingStore((s) => s.setPaymentAdded);
  const setStep = useOnboardingStore((s) => s.setStep);

  const [tab, setTab] = useState<"card" | "wallet">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [billing, setBilling] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const cardValid = cardNumber.length >= 15 && expiry.length >= 4 && cvv.length >= 3;

  const submit = () => {
    setPaymentAdded(true);
    setStep(5);
    navigate("/onboarding/complete");
  };

  return (
    <div className="flex flex-col gap-6 flex-1">
      <div>
        <h1 className="text-title text-foreground">Add Payment Method</h1>
        <p className="text-sp-text-secondary text-sm mt-1">
          Choose how you'd like to pay for secure parking.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab("card")}
          className={`flex-1 h-10 rounded-pill text-sm font-bold transition-colors ${
            tab === "card"
              ? "bg-sp-blue text-foreground"
              : "bg-transparent text-sp-text-secondary border border-border"
          }`}
        >
          CARD
        </button>
        <button
          onClick={() => setTab("wallet")}
          className={`flex-1 h-10 rounded-pill text-sm font-bold transition-colors ${
            tab === "wallet"
              ? "bg-sp-blue text-foreground"
              : "bg-transparent text-sp-text-secondary border border-border"
          }`}
        >
          DIGITAL WALLET
        </button>
      </div>

      {tab === "card" ? (
        <div className="space-y-4 flex-1">
          {/* Card visual */}
          <div className="bg-sp-surface rounded-card p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="w-10 h-7 rounded bg-border/40 flex items-center justify-center">
                <Wallet size={16} className="text-sp-text-secondary" />
              </div>
              <span className="text-sp-teal font-bold italic text-sm tracking-wide">SENTINEL</span>
            </div>
            <div className="text-sp-text-secondary text-sm tracking-[0.3em]">•••• •••• •••• ••••</div>
            <div className="flex justify-between text-xs">
              <div>
                <div className="text-sp-text-secondary">CARD HOLDER</div>
                <div className="text-foreground font-medium">YOUR NAME</div>
              </div>
              <div>
                <div className="text-sp-text-secondary">EXPIRES</div>
                <div className="text-foreground font-medium">MM/YY</div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Card Number</label>
            <div className="relative">
              <InputField placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="pr-10" />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-text-secondary" size={18} />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Expiry</label>
              <InputField placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">CVV</label>
              <InputField placeholder="•••" value={cvv} onChange={(e) => setCvv(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Billing Address</label>
            <InputField placeholder="Start typing address…" value={billing} onChange={(e) => setBilling(e.target.value)} />
          </div>

          <label className="flex items-center gap-2.5 text-sm text-sp-text-secondary cursor-pointer">
            <div
              onClick={() => setSaveCard(!saveCard)}
              className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${saveCard ? "bg-sp-blue" : "bg-border"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-foreground transition-transform ${saveCard ? "translate-x-4" : "translate-x-0"}`} />
            </div>
            Save card for future bookings
          </label>
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          <button className="w-full h-14 bg-sp-surface border border-border rounded-card flex items-center justify-center gap-3 text-foreground font-medium active:scale-[0.98] transition-transform">
            <span className="text-lg">🍎</span> Apple Pay
          </button>
          <button className="w-full h-14 bg-sp-surface border border-border rounded-card flex items-center justify-center gap-3 text-foreground font-medium active:scale-[0.98] transition-transform">
            <span className="text-lg">G</span> Google Pay
          </button>
        </div>
      )}

      <div className="space-y-3 mt-auto">
        <PillButton onClick={submit} disabled={tab === "card" && !cardValid}>
          Save & Complete <ArrowRight size={18} className="inline ml-1" />
        </PillButton>
        <button
          onClick={() => {
            setStep(5);
            navigate("/onboarding/complete");
          }}
          className="w-full text-center text-sm font-semibold text-sp-text-secondary uppercase tracking-wider"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default AddPayment;
