import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOwnerOnboardingStore, LotType } from "@/stores/useOwnerOnboardingStore";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import { MapPin, Camera, Plus, Minus, Image } from "lucide-react";
import { cn } from "@/lib/utils";

const lotTypes: { key: LotType; label: string }[] = [
  { key: "surface", label: "Surface" },
  { key: "garage", label: "Garage" },
  { key: "street", label: "Street" },
];

const OwnerLotDetails = () => {
  const navigate = useNavigate();
  const { lotDraft, updateLotDraft, setStep } = useOwnerOnboardingStore();
  const { lotName, address, totalSpaces, lotType, photos } = lotDraft;

  const valid = lotName.trim() && address.trim() && totalSpaces > 0 && lotType && photos.length > 0;

  const handlePhotoUpload = (idx: number) => {
    // Mock: add a placeholder image string
    const next = [...photos];
    if (next[idx]) return; // already filled
    next[idx] = `photo-${idx + 1}`;
    // Ensure array has correct length
    while (next.length < 4) next.push("");
    updateLotDraft({ photos: next.filter(Boolean) });
  };

  const photoSlots = [0, 1, 2, 3];

  return (
    <div className="flex flex-col gap-5 flex-1">
      <div className="text-center">
        <h2 className="text-foreground font-bold text-xl">Lot Details</h2>
        <p className="text-sp-text-secondary text-sm mt-1">Tell us about your parking space.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Lot Name</label>
          <InputField variant="teal" placeholder="Downtown Garage" value={lotName} onChange={(e) => updateLotDraft({ lotName: e.target.value })} />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Address</label>
          <div className="relative">
            <InputField variant="teal" placeholder="123 Main St, City" value={address} onChange={(e) => updateLotDraft({ address: e.target.value })} className="pr-10" />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-text-secondary" size={18} />
          </div>
          {/* Map placeholder */}
          <div className="mt-2 h-24 rounded-card bg-sp-surface border border-border flex items-center justify-center text-sp-text-secondary text-xs">
            <MapPin size={16} className="mr-1" /> Map preview placeholder
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Total Spaces</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateLotDraft({ totalSpaces: Math.max(1, totalSpaces - 1) })}
              className="w-12 h-12 rounded-card bg-sp-surface border border-border flex items-center justify-center text-foreground active:scale-95 transition-transform"
            >
              <Minus size={18} />
            </button>
            <span className="text-foreground font-bold text-2xl tabular-nums min-w-[48px] text-center">
              {totalSpaces}
            </span>
            <button
              onClick={() => updateLotDraft({ totalSpaces: totalSpaces + 1 })}
              className="w-12 h-12 rounded-card bg-sp-surface border border-border flex items-center justify-center text-foreground active:scale-95 transition-transform"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Lot Type</label>
          <div className="flex gap-2">
            {lotTypes.map((t) => (
              <button
                key={t.key}
                onClick={() => updateLotDraft({ lotType: t.key })}
                className={cn(
                  "flex-1 py-3 rounded-card text-sm font-semibold transition-colors active:scale-[0.98]",
                  lotType === t.key
                    ? "bg-sp-teal text-foreground"
                    : "bg-sp-surface text-sp-text-secondary border border-border"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Photos</label>
          <div className="grid grid-cols-2 gap-3">
            {photoSlots.map((idx) => {
              const hasPhoto = photos[idx];
              return (
                <button
                  key={idx}
                  onClick={() => handlePhotoUpload(idx)}
                  className={cn(
                    "aspect-square rounded-card border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors active:scale-[0.98]",
                    hasPhoto
                      ? "border-sp-teal bg-sp-teal/10"
                      : "border-border bg-sp-surface hover:border-sp-teal/50"
                  )}
                >
                  {hasPhoto ? (
                    <Image size={24} className="text-sp-teal" />
                  ) : (
                    <>
                      <Camera size={20} className="text-sp-text-secondary" />
                      <span className="text-[10px] text-sp-text-secondary">Add Photo</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <PillButton
        variant="teal"
        onClick={() => { setStep(3); navigate("/owner/onboarding/hours-pricing"); }}
        disabled={!valid}
        className="mt-auto"
      >
        Next →
      </PillButton>
    </div>
  );
};

export default OwnerLotDetails;
