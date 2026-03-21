import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLotStore, mockLots } from "@/stores/useLotStore";
import { useCarStore, CarEntry } from "@/stores/useCarStore";
import { useSessionStore } from "@/stores/useSessionStore";
import PageWrapper from "@/components/safepark/PageWrapper";
import PillButton from "@/components/safepark/PillButton";
import { toast } from "sonner";
import {
  Car,
  Clock,
  CreditCard,
  Trash2,
  Plus,
  ChevronRight,
  MapPin,
  ArrowRight,
  X,
} from "lucide-react";

const durations = [
  { label: "30 min", minutes: 30, rate: 2 },
  { label: "1 Hour", minutes: 60, rate: 4 },
  { label: "2 Hours", minutes: 120, rate: 7 },
  { label: "All Day", minutes: 480, rate: 15 },
];

const TAX_RATE = 0.13;

const ParkingFlow = () => {
  const { lotId } = useParams<{ lotId: string }>();
  const navigate = useNavigate();
  const lot = useMemo(
    () => mockLots.find((l) => l.id === lotId) ?? mockLots[0],
    [lotId]
  );
  const cars = useCarStore((s) => s.cars);
  const { paymentMethods, removePaymentMethod, addSession } = useSessionStore();

  const [step, setStep] = useState(0);
  const [selectedCar, setSelectedCar] = useState<number | null>(
    cars.length > 0 ? 0 : null
  );
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedPM, setSelectedPM] = useState<string>(
    paymentMethods[0]?.id ?? ""
  );

  const subtotal = durations[selectedDuration].rate;
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  const chosenCar: CarEntry | undefined =
    selectedCar !== null ? cars[selectedCar] : undefined;

  const confirm = () => {
    if (!chosenCar) return;
    const durationMs = [1800000, 3600000, 7200000, 28800000][selectedDuration];
    addSession({
      id: `sess-${Date.now()}`,
      lotId: lot.id,
      lotName: lot.name,
      lotAddress: lot.address,
      carPlate: chosenCar.plateNumber,
      carLabel: `${chosenCar.make} ${chosenCar.model}`,
      duration: durations[selectedDuration].label,
      subtotal,
      tax,
      total,
      timestamp: Date.now(),
      endTime: Date.now() + durationMs,
      status: "active",
    });
    toast.success("Parking confirmed! You're all set.");
    navigate("/home");
  };

  const cards = [
    // Card 0 — Car Selection
    <div key="car" className="space-y-4">
      <div className="flex items-center gap-2">
        <Car size={20} className="text-sp-blue" />
        <span className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
          Selected Car
        </span>
      </div>
      <div className="space-y-2">
        {cars.map((c, i) => (
          <button
            key={i}
            onClick={() => setSelectedCar(i)}
            className={`w-full bg-background rounded-card p-4 flex items-center gap-3 border transition-colors active:scale-[0.98] ${
              selectedCar === i
                ? "border-sp-blue"
                : "border-border/50"
            }`}
          >
            <div className="w-10 h-10 rounded-card bg-sp-surface flex items-center justify-center shrink-0">
              <Car size={18} className="text-sp-blue" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-foreground text-sm font-semibold">
                {c.make} {c.model}
              </p>
              <p className="text-sp-text-secondary text-xs">
                {c.plateNumber} · {c.year}
              </p>
            </div>
            <ChevronRight size={16} className="text-sp-text-secondary" />
          </button>
        ))}
        <button
          onClick={() => navigate("/onboarding/add-car")}
          className="w-full bg-background rounded-card p-4 flex items-center justify-center gap-2 border border-dashed border-border text-sp-blue font-semibold text-sm"
        >
          <Plus size={16} /> New Car
        </button>
      </div>
    </div>,

    // Card 1 — Duration
    <div key="dur" className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock size={20} className="text-sp-blue" />
        <span className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
          Duration
        </span>
      </div>
      <div className="space-y-2">
        {durations.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedDuration(i)}
            className={`w-full bg-background rounded-card p-4 flex items-center justify-between border transition-colors active:scale-[0.98] ${
              selectedDuration === i
                ? "border-sp-blue"
                : "border-border/50"
            }`}
          >
            <span className="text-foreground font-semibold text-sm">
              {d.label}
            </span>
            <span className="text-sp-teal font-bold text-sm">
              ${d.rate.toFixed(2)}
            </span>
          </button>
        ))}
      </div>
    </div>,

    // Card 2 — Payment
    <div key="pay" className="space-y-4">
      <div className="flex items-center gap-2">
        <CreditCard size={20} className="text-sp-blue" />
        <span className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
          Payment Method
        </span>
      </div>
      <div className="space-y-2">
        {paymentMethods.map((pm) => (
          <div
            key={pm.id}
            className={`w-full bg-background rounded-card p-4 flex items-center gap-3 border transition-colors ${
              selectedPM === pm.id
                ? "border-sp-blue"
                : "border-border/50"
            }`}
          >
            <button
              onClick={() => setSelectedPM(pm.id)}
              className="flex-1 flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-card bg-sp-surface flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-sp-blue" />
              </div>
              <div>
                <p className="text-foreground text-sm font-semibold">
                  {pm.label}
                </p>
                <p className="text-sp-text-secondary text-xs">
                  •••• {pm.last4}
                </p>
              </div>
            </button>
            <button
              onClick={() => removePaymentMethod(pm.id)}
              className="text-sp-text-secondary hover:text-destructive transition-colors p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button className="w-full bg-background rounded-card p-4 flex items-center justify-center gap-2 border border-dashed border-border text-sp-blue font-semibold text-sm">
          <Plus size={16} /> Add new
        </button>
      </div>
    </div>,

    // Card 3 — Confirmation
    <div key="conf" className="space-y-4">
      <h3 className="text-sp-teal font-bold text-xl">{lot.name}</h3>
      <div className="flex items-center gap-1.5 text-sp-text-secondary text-sm">
        <MapPin size={14} /> {lot.address}
      </div>

      <div className="space-y-2">
        {[
          {
            icon: <Car size={18} className="text-sp-blue" />,
            label: "SELECTED CAR",
            value: chosenCar
              ? `${chosenCar.make} ${chosenCar.model}`
              : "—",
          },
          {
            icon: <Clock size={18} className="text-sp-blue" />,
            label: "DURATION",
            value: durations[selectedDuration].label,
          },
        ].map((row, i) => (
          <div
            key={i}
            className="bg-background rounded-card p-4 flex items-center gap-3 border border-border/50"
          >
            <div className="w-10 h-10 rounded-card bg-sp-surface flex items-center justify-center shrink-0">
              {row.icon}
            </div>
            <div className="flex-1">
              <p className="text-sp-text-secondary text-xs uppercase tracking-wider">
                {row.label}
              </p>
              <p className="text-foreground font-semibold">{row.value}</p>
            </div>
            <ChevronRight size={16} className="text-sp-text-secondary" />
          </div>
        ))}

        {/* Total card */}
        <div className="bg-sp-surface/60 rounded-card p-4 flex items-center gap-3 border border-sp-teal/20">
          <div className="w-10 h-10 rounded-card bg-sp-surface flex items-center justify-center shrink-0">
            <CreditCard size={18} className="text-sp-teal" />
          </div>
          <div className="flex-1">
            <p className="text-sp-text-secondary text-xs uppercase tracking-wider">
              Total
            </p>
            <p className="text-sp-teal font-bold text-lg">
              ${total.toFixed(2)}{" "}
              <span className="text-sp-text-secondary text-xs font-normal">
                inc. tax
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>,
  ];

  const isLast = step === 3;

  return (
    <PageWrapper className="flex flex-col min-h-screen relative">
      {/* Dark map placeholder top area */}
      <div className="flex-1" />

      {/* Bottom sheet */}
      <div
        key={step}
        className="bg-card rounded-t-[24px] p-5 pb-8 space-y-5 animate-slide-up"
      >
        {/* Drag handle */}
        <div className="flex justify-center">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {cards[step]}

        <div className="space-y-3 pt-2">
          {isLast ? (
            <PillButton onClick={confirm}>
              Confirm & Pay <ArrowRight size={18} className="inline ml-1" />
            </PillButton>
          ) : (
            <PillButton
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && selectedCar === null}
            >
              Next <ArrowRight size={18} className="inline ml-1" />
            </PillButton>
          )}
          <button
            onClick={() => (step === 0 ? navigate(-1) : setStep((s) => s - 1))}
            className="w-full text-center text-sp-text-secondary text-sm font-medium"
          >
            {step === 0 ? "Cancel" : "Back"}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ParkingFlow;
