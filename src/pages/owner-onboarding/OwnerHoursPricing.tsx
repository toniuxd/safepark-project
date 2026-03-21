import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOwnerOnboardingStore, DayHours, FlatRate } from "@/stores/useOwnerOnboardingStore";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import { Clock, DollarSign, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const OwnerHoursPricing = () => {
  const navigate = useNavigate();
  const { lotDraft, updateLotDraft, setStep } = useOwnerOnboardingStore();
  const [tab, setTab] = useState<"hours" | "pricing">("hours");

  const updateDay = (day: string, partial: Partial<DayHours>) => {
    const next = { ...lotDraft.hours, [day]: { ...lotDraft.hours[day], ...partial } };
    updateLotDraft({ hours: next });
  };

  const updateFlatRate = (idx: number, partial: Partial<FlatRate>) => {
    const next = [...lotDraft.flatRates];
    next[idx] = { ...next[idx], ...partial };
    updateLotDraft({ flatRates: next });
  };

  return (
    <div className="flex flex-col gap-5 flex-1">
      <div className="text-center">
        <h2 className="text-foreground font-bold text-xl">Hours & Pricing</h2>
        <p className="text-sp-text-secondary text-sm mt-1">Set your operating hours and rates.</p>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-black/25 rounded-card p-1 border border-white/10">
        {(["hours", "pricing"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-2.5 rounded-[10px] text-sm font-semibold transition-colors flex items-center justify-center gap-1.5",
              tab === t ? "bg-cyan-300 text-slate-900" : "text-sp-text-secondary"
            )}
          >
            {t === "hours" ? <Clock size={14} /> : <DollarSign size={14} />}
            {t === "hours" ? "Hours" : "Pricing"}
          </button>
        ))}
      </div>

      {tab === "hours" && (
        <div className="space-y-2">
          {days.map((day) => {
            const dh = lotDraft.hours[day];
            return (
              <div key={day} className="bg-black/25 rounded-card p-3 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-semibold text-sm w-10">{day}</span>
                  <button
                    onClick={() => updateDay(day, { enabled: !dh.enabled })}
                    className={cn(
                      "w-10 h-6 rounded-full flex items-center px-0.5 transition-colors",
                      dh.enabled ? "bg-sp-teal" : "bg-border"
                    )}
                  >
                    <div className={cn("w-5 h-5 rounded-full bg-foreground transition-transform", dh.enabled ? "translate-x-4" : "translate-x-0")} />
                  </button>
                </div>
                {dh.enabled && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="time"
                      value={dh.open}
                      onChange={(e) => updateDay(day, { open: e.target.value })}
                      className="flex-1 bg-black/25 border border-white/10 rounded-input px-3 py-2 text-sm text-foreground outline-none focus:border-sp-teal"
                    />
                    <span className="text-sp-text-secondary text-xs">to</span>
                    <input
                      type="time"
                      value={dh.close}
                      onChange={(e) => updateDay(day, { close: e.target.value })}
                      className="flex-1 bg-black/25 border border-white/10 rounded-input px-3 py-2 text-sm text-foreground outline-none focus:border-sp-teal"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "pricing" && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Hourly Rate ($)</label>
            <InputField
              variant="teal"
              type="number"
              min={0}
              step={0.5}
              value={lotDraft.hourlyRate}
              onChange={(e) => updateLotDraft({ hourlyRate: +e.target.value })}
              className="bg-black/25 border-white/10"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-2 block">Flat Rates</label>
            <div className="space-y-2">
              {lotDraft.flatRates.map((fr, i) => (
                <div key={fr.duration} className="bg-black/25 rounded-card p-3 border border-white/10 flex items-center gap-3">
                  <button
                    onClick={() => updateFlatRate(i, { enabled: !fr.enabled })}
                    className={cn(
                      "w-10 h-6 rounded-full flex items-center px-0.5 transition-colors shrink-0",
                      fr.enabled ? "bg-sp-teal" : "bg-border"
                    )}
                  >
                    <div className={cn("w-5 h-5 rounded-full bg-foreground transition-transform", fr.enabled ? "translate-x-4" : "translate-x-0")} />
                  </button>
                  <span className="text-foreground text-sm font-medium w-16">{fr.label}</span>
                  <div className="flex-1">
                    <InputField
                      variant="teal"
                      type="number"
                      min={0}
                      step={0.5}
                      value={fr.price}
                      onChange={(e) => updateFlatRate(i, { price: +e.target.value })}
                      disabled={!fr.enabled}
                      className="text-sm py-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black/25 rounded-card p-4 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-sp-warning" />
                <span className="text-foreground text-sm font-semibold">Overstay Fee</span>
              </div>
              <button
                onClick={() => updateLotDraft({ overstayEnabled: !lotDraft.overstayEnabled })}
                className={cn(
                  "w-10 h-6 rounded-full flex items-center px-0.5 transition-colors",
                  lotDraft.overstayEnabled ? "bg-sp-teal" : "bg-border"
                )}
              >
                <div className={cn("w-5 h-5 rounded-full bg-foreground transition-transform", lotDraft.overstayEnabled ? "translate-x-4" : "translate-x-0")} />
              </button>
            </div>
            {lotDraft.overstayEnabled && (
              <InputField
                variant="teal"
                type="number"
                min={0}
                value={lotDraft.overstayFee}
                onChange={(e) => updateLotDraft({ overstayFee: +e.target.value })}
                placeholder="Fee amount"
              />
            )}
          </div>
        </div>
      )}

      <PillButton
        variant="teal"
        onClick={() => { setStep(4); navigate("/owner/onboarding/payout"); }}
        className="mt-auto h-14 bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.35)]"
      >
        Next →
      </PillButton>
    </div>
  );
};

export default OwnerHoursPricing;
