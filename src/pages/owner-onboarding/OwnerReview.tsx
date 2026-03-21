import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOwnerOnboardingStore } from "@/stores/useOwnerOnboardingStore";
import PillButton from "@/components/safepark/PillButton";
import { ChevronDown, ChevronUp, Pencil, CheckCircle, Clock, MapPin, DollarSign, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

const OwnerReview = () => {
  const navigate = useNavigate();
  const { lotDraft, updateLotDraft } = useOwnerOnboardingStore();
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({
    lot: true,
    hours: false,
    pricing: false,
    payout: false,
  });

  const toggle = (key: string) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  const handleSubmit = () => {
    updateLotDraft({ status: "pending" });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 flex-1 text-center py-10">
        <div className="w-20 h-20 rounded-full bg-sp-teal/20 flex items-center justify-center animate-pulse">
          <Clock size={40} className="text-sp-teal" />
        </div>
        <h2 className="text-title text-foreground">Under Review</h2>
        <p className="text-sp-text-secondary text-sm max-w-[280px]">
          Your lot listing is being reviewed. We'll notify you within 24 hours.
        </p>
        <PillButton variant="teal" onClick={() => navigate("/owner/home")}>
          Go to Dashboard →
        </PillButton>
      </div>
    );
  }

  const enabledDays = Object.entries(lotDraft.hours)
    .filter(([, v]) => v.enabled)
    .map(([k, v]) => `${k} ${v.open}–${v.close}`);

  const enabledRates = lotDraft.flatRates.filter((r) => r.enabled);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="text-center">
        <h2 className="text-foreground font-bold text-xl">Review & Submit</h2>
        <p className="text-sp-text-secondary text-sm mt-1">Make sure everything looks good.</p>
      </div>

      {/* Lot Details */}
      <Section
        title="Lot Details"
        icon={<MapPin size={16} />}
        isOpen={open.lot}
        onToggle={() => toggle("lot")}
        onEdit={() => navigate("/owner/onboarding/lot-details")}
      >
        <Row label="Name" value={lotDraft.lotName} />
        <Row label="Address" value={lotDraft.address} />
        <Row label="Spaces" value={String(lotDraft.totalSpaces)} />
        <Row label="Type" value={lotDraft.lotType || "—"} />
        <Row label="Photos" value={`${lotDraft.photos.length} uploaded`} />
      </Section>

      {/* Hours */}
      <Section
        title="Operating Hours"
        icon={<Clock size={16} />}
        isOpen={open.hours}
        onToggle={() => toggle("hours")}
        onEdit={() => navigate("/owner/onboarding/hours-pricing")}
      >
        {enabledDays.map((d) => (
          <p key={d} className="text-foreground text-sm">{d}</p>
        ))}
        {enabledDays.length === 0 && <p className="text-sp-text-secondary text-sm">No hours set</p>}
      </Section>

      {/* Pricing */}
      <Section
        title="Pricing"
        icon={<DollarSign size={16} />}
        isOpen={open.pricing}
        onToggle={() => toggle("pricing")}
        onEdit={() => navigate("/owner/onboarding/hours-pricing")}
      >
        <Row label="Hourly" value={`$${lotDraft.hourlyRate}/hr`} />
        {enabledRates.map((r) => (
          <Row key={r.duration} label={r.label} value={`$${r.price}`} />
        ))}
        {lotDraft.overstayEnabled && <Row label="Overstay Fee" value={`$${lotDraft.overstayFee}`} />}
      </Section>

      {/* Payout */}
      <Section
        title="Payout"
        icon={<Landmark size={16} />}
        isOpen={open.payout}
        onToggle={() => toggle("payout")}
        onEdit={() => navigate("/owner/onboarding/payout")}
      >
        <Row label="Method" value={lotDraft.payoutMethod === "bank" ? "Bank Account" : lotDraft.payoutMethod === "stripe" ? "Stripe" : "—"} />
        <Row label="Schedule" value={lotDraft.payoutSchedule} />
      </Section>

      <PillButton variant="teal" onClick={handleSubmit} className="mt-auto">
        <CheckCircle size={18} className="inline mr-2" />
        Submit for Approval
      </PillButton>
    </div>
  );
};

function Section({
  title,
  icon,
  isOpen,
  onToggle,
  onEdit,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-sp-surface rounded-card border border-border/50 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 p-4 text-left"
      >
        <span className="text-sp-teal">{icon}</span>
        <span className="text-foreground font-semibold text-sm flex-1">{title}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="text-sp-teal text-xs font-bold mr-2"
        >
          <Pencil size={14} />
        </button>
        {isOpen ? <ChevronUp size={16} className="text-sp-text-secondary" /> : <ChevronDown size={16} className="text-sp-text-secondary" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-1 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-sp-text-secondary">{label}</span>
      <span className="text-foreground font-medium capitalize">{value}</span>
    </div>
  );
}

export default OwnerReview;
