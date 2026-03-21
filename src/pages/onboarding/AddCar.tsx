import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { useCarStore, CarEntry } from "@/stores/useCarStore";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import GhostButton from "@/components/safepark/GhostButton";
import { Camera, Plus, ArrowRight, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const makes = ["Toyota", "Honda", "Ford", "BMW", "Tesla"];
const models: Record<string, string[]> = {
  Toyota: ["Camry", "RAV4", "Corolla", "Highlander", "Prius"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "HR-V"],
  Ford: ["F-150", "Mustang", "Explorer", "Escape", "Bronco"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "i4"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
};
const years = ["2024", "2023", "2022", "2021", "2020"];

const emptyCar = (): CarEntry => ({ plateNumber: "", make: "", model: "", year: "", color: "" });

const AddCar = () => {
  const navigate = useNavigate();
  const setCarsAdded = useOnboardingStore((s) => s.setCarsAdded);
  const setStep = useOnboardingStore((s) => s.setStep);
  const setCars = useCarStore((s) => s.setCars);

  const [carForms, setCarForms] = useState<CarEntry[]>([emptyCar()]);
  const [platePhotoOpen, setPlatePhotoOpen] = useState(false);
  const [activeCarIndex, setActiveCarIndex] = useState(0);
  const [platePhotoPreviews, setPlatePhotoPreviews] = useState<Record<number, string>>(
    {}
  );

  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const captureInputRef = useRef<HTMLInputElement | null>(null);

  const openPhotoPopup = (carIndex: number) => {
    setActiveCarIndex(carIndex);
    setPlatePhotoOpen(true);
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    // Preview only; OCR/recognition can be added later.
    const dataUrl = await readFileAsDataUrl(file);
    setPlatePhotoPreviews((prev) => ({ ...prev, [activeCarIndex]: dataUrl }));
  };

  const removePlatePhoto = () => {
    setPlatePhotoPreviews((prev) => {
      const next = { ...prev };
      delete next[activeCarIndex];
      return next;
    });
  };

  const update = (idx: number, field: keyof CarEntry, value: string) => {
    const next = [...carForms];
    next[idx] = { ...next[idx], [field]: value };
    if (field === "make") next[idx].model = "";
    setCarForms(next);
  };

  const allValid = carForms.every(
    (c) => c.plateNumber && c.make && c.model && c.year && c.color
  );

  const save = () => {
    setCars(carForms);
    setCarsAdded(true);
    setStep(4);
    navigate("/onboarding/add-payment");
  };

  return (
    <div className="flex flex-col gap-6 flex-1">
      <div>
        <h1 className="text-title text-foreground">Add Your Car</h1>
        <p className="text-sp-text-secondary text-sm mt-1">
          Register your vehicle to ensure seamless parking access and security monitoring.
        </p>
      </div>

      {carForms.map((car, idx) => (
        <div key={idx} className="space-y-4 bg-sp-surface rounded-card p-4">
          {/* Photo zone */}
          <div
            className="border-2 border-dashed border-border rounded-card flex flex-col items-center justify-center py-6 gap-2 cursor-pointer overflow-hidden"
            onClick={() => openPhotoPopup(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openPhotoPopup(idx);
            }}
          >
            {platePhotoPreviews[idx] ? (
              <>
                <img
                  src={platePhotoPreviews[idx]}
                  alt="Plate preview"
                  className="w-full h-[140px] object-cover"
                />
                <span className="mt-2 text-sp-blue text-sm font-medium">
                  Update plate photo
                </span>
              </>
            ) : (
              <>
                <Camera className="text-sp-blue" size={28} />
                <span className="text-sp-blue text-sm font-medium">
                  Upload or take a photo of your plate
                </span>
              </>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Plate Number</label>
            <InputField placeholder="e.g. ABC-1234" value={car.plateNumber} onChange={(e) => update(idx, "plateNumber", e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Make</label>
            <select
              value={car.make}
              onChange={(e) => update(idx, "make", e.target.value)}
              className="w-full bg-sp-surface border border-border rounded-input px-4 py-3 text-base text-foreground outline-none focus:ring-2 focus:ring-sp-blue focus:border-sp-blue transition-colors appearance-none"
            >
              <option value="">Select Make</option>
              {makes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Model</label>
            <select
              value={car.model}
              onChange={(e) => update(idx, "model", e.target.value)}
              disabled={!car.make}
              className="w-full bg-sp-surface border border-border rounded-input px-4 py-3 text-base text-foreground outline-none focus:ring-2 focus:ring-sp-blue focus:border-sp-blue transition-colors appearance-none disabled:opacity-50"
            >
              <option value="">Select Model</option>
              {(models[car.make] ?? []).map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Year</label>
            <select
              value={car.year}
              onChange={(e) => update(idx, "year", e.target.value)}
              className="w-full bg-sp-surface border border-border rounded-input px-4 py-3 text-base text-foreground outline-none focus:ring-2 focus:ring-sp-blue focus:border-sp-blue transition-colors appearance-none"
            >
              <option value="">Select Year</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Color</label>
            <InputField placeholder="e.g. Midnight Black" value={car.color} onChange={(e) => update(idx, "color", e.target.value)} />
          </div>
        </div>
      ))}

      <GhostButton onClick={() => setCarForms([...carForms, emptyCar()])}>
        <Plus size={18} className="inline mr-1" /> Add Another Car
      </GhostButton>

      <PillButton onClick={save} disabled={!allValid}>
        Save & Continue <ArrowRight size={18} className="inline ml-1" />
      </PillButton>

      <Dialog open={platePhotoOpen} onOpenChange={setPlatePhotoOpen}>
        <DialogContent className="max-w-[390px]">
          <DialogHeader>
            <DialogTitle>Plate Photo</DialogTitle>
            <DialogDescription>
              Upload from your device or take a new picture.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
            <input
              ref={captureInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="bg-sp-surface border border-border/50 rounded-card p-4 h-12 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <Upload size={18} className="text-sp-teal" />
                <span className="text-sm font-semibold text-foreground">Upload</span>
              </button>
              <button
                type="button"
                onClick={() => captureInputRef.current?.click()}
                className="bg-sp-surface border border-border/50 rounded-card p-4 h-12 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <Camera size={18} className="text-sp-teal" />
                <span className="text-sm font-semibold text-foreground">Take photo</span>
              </button>
            </div>

            {platePhotoPreviews[activeCarIndex] && (
              <div className="rounded-card border border-border/50 overflow-hidden">
                <img
                  src={platePhotoPreviews[activeCarIndex]}
                  alt="Plate preview"
                  className="w-full h-[160px] object-cover"
                />
                <div className="p-3 flex justify-between items-center">
                  <span className="text-xs font-semibold text-sp-text-secondary">
                    Preview ready
                  </span>
                  <button
                    onClick={removePlatePhoto}
                    className="text-xs font-semibold text-destructive hover:opacity-80 active:scale-[0.98] transition-transform"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            <div className="pt-1">
              <p className="text-xs text-sp-text-secondary">
                Close this popup using the X button.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddCar;
