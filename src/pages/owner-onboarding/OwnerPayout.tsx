import { useNavigate } from "react-router-dom";
import { useOwnerOnboardingStore, PayoutMethod, PayoutSchedule } from "@/stores/useOwnerOnboardingStore";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import { Landmark, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const schedules: { key: PayoutSchedule; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

const OwnerPayout = () => {
  const navigate = useNavigate();
  const { lotDraft, updateLotDraft, setStep } = useOwnerOnboardingStore();
  const { payoutMethod, routingNumber, accountNumber, payoutSchedule } = lotDraft;

  const valid =
    payoutMethod === "stripe" ||
    (payoutMethod === "bank" && routingNumber.trim().length > 0 && accountNumber.trim().length > 0);

  return (
    <div className="flex flex-col gap-5 flex-1">
      <div className="text-center">
        <h2 className="text-foreground font-bold text-xl">Payout Setup</h2>
        <p className="text-sp-text-secondary text-sm mt-1">Choose how you'd like to get paid.</p>
      </div>

      {/* Method cards */}
      <div className="space-y-3">
        <button
          onClick={() => updateLotDraft({ payoutMethod: "bank" })}
          className={cn(
            "w-full rounded-card p-5 text-left border-2 transition-colors active:scale-[0.98]",
            payoutMethod === "bank"
              ? "border-sp-teal bg-sp-teal/10"
              : "border-white/10 bg-black/25"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <Landmark size={22} className={payoutMethod === "bank" ? "text-sp-teal" : "text-sp-text-secondary"} />
            <span className="text-foreground font-bold">Bank Account</span>
          </div>
          <p className="text-sp-text-secondary text-xs">Direct deposit to your bank account.</p>
        </button>

        {payoutMethod === "bank" && (
          <div className="space-y-3 pl-2 animate-fade-in">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Routing Number</label>
              <InputField variant="teal" placeholder="021000021" value={routingNumber} onChange={(e) => updateLotDraft({ routingNumber: e.target.value })} className="bg-black/25 border-white/10" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Account Number</label>
              <InputField variant="teal" placeholder="•••• •••• 1234" value={accountNumber} onChange={(e) => updateLotDraft({ accountNumber: e.target.value })} className="bg-black/25 border-white/10" />
            </div>
          </div>
        )}

        <button
          onClick={() => updateLotDraft({ payoutMethod: "stripe" })}
          className={cn(
            "w-full rounded-card p-5 text-left border-2 transition-colors active:scale-[0.98]",
            payoutMethod === "stripe"
              ? "border-sp-teal bg-sp-teal/10"
              : "border-white/10 bg-black/25"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <CreditCard size={22} className={payoutMethod === "stripe" ? "text-sp-teal" : "text-sp-text-secondary"} />
            <span className="text-foreground font-bold">Connect Stripe</span>
          </div>
          <p className="text-sp-text-secondary text-xs">Fast payouts via Stripe Connect.</p>
          {payoutMethod === "stripe" && (
            <div className="mt-3 bg-black/25 border border-white/10 rounded-card p-3 text-center">
              <button className="text-sp-teal font-bold text-sm">Connect Stripe Account →</button>
            </div>
          )}
        </button>
      </div>

      {/* Payout schedule */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-2 block">Payout Schedule</label>
        <div className="flex gap-2">
          {schedules.map((s) => (
            <button
              key={s.key}
              onClick={() => updateLotDraft({ payoutSchedule: s.key })}
              className={cn(
                "flex-1 py-3 rounded-card text-sm font-semibold transition-colors active:scale-[0.98]",
                payoutSchedule === s.key
                  ? "bg-cyan-300 text-slate-900"
                  : "bg-black/25 text-sp-text-secondary border border-white/10"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <PillButton
        variant="teal"
        onClick={() => { setStep(5); navigate("/owner/onboarding/review"); }}
        disabled={!valid}
        className="mt-auto h-14 bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.35)]"
      >
        Save & Review →
      </PillButton>
    </div>
  );
};

export default OwnerPayout;
