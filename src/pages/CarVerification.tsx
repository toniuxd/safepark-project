import { useState } from "react";
import PageWrapper from "@/components/safepark/PageWrapper";
import BottomNav from "@/components/safepark/BottomNav";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import GhostButton from "@/components/safepark/GhostButton";
import {
  ScanLine,
  Keyboard,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Car,
  X,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ResultState = "active" | "overstay" | "not-registered";

interface ScanLog {
  plate: string;
  status: ResultState;
  time: string;
}

const resultMeta: Record<ResultState, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  active: {
    label: "Active Session",
    color: "text-green-400",
    bg: "bg-green-400/15 border-green-400/30",
    icon: <CheckCircle size={20} className="text-green-400" />,
  },
  overstay: {
    label: "Overstay",
    color: "text-sp-warning",
    bg: "bg-sp-warning/15 border-sp-warning/30",
    icon: <AlertTriangle size={20} className="text-sp-warning" />,
  },
  "not-registered": {
    label: "Not Registered",
    color: "text-destructive",
    bg: "bg-destructive/15 border-destructive/30",
    icon: <XCircle size={20} className="text-destructive" />,
  },
};

const stateOrder: ResultState[] = ["active", "overstay", "not-registered"];

const CarVerification = () => {
  const [phase, setPhase] = useState<"scan" | "result">("scan");
  const [manualMode, setManualMode] = useState(false);
  const [plateInput, setPlateInput] = useState("");
  const [stateIdx, setStateIdx] = useState(0);
  const [currentPlate, setCurrentPlate] = useState("");
  const [scanLog, setScanLog] = useState<ScanLog[]>([]);
  const [ticketModal, setTicketModal] = useState(false);
  const [ticketReason, setTicketReason] = useState("Overtime parking");
  const [ticketAmount, setTicketAmount] = useState("45");

  const currentState = stateOrder[stateIdx];
  const meta = resultMeta[currentState];

  const handleSubmitPlate = (plate: string) => {
    if (!plate.trim()) return;
    setCurrentPlate(plate.toUpperCase());
    setPhase("result");
    setManualMode(false);
    setScanLog((prev) => [
      { plate: plate.toUpperCase(), status: stateOrder[stateIdx], time: "Just now" },
      ...prev.slice(0, 4),
    ]);
  };

  const handleReset = () => {
    setPhase("scan");
    setPlateInput("");
    setStateIdx((i) => (i + 1) % stateOrder.length);
  };

  return (
    <>
      <PageWrapper className="pb-24 space-y-4">
        {phase === "scan" && (
          <>
            {/* Viewfinder */}
            <div className="relative aspect-[4/3] bg-black/80 rounded-card overflow-hidden flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute inset-4">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-sp-teal rounded-tl-md" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-sp-teal rounded-tr-md" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-sp-teal rounded-bl-md" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-sp-teal rounded-br-md" />
              </div>
              <div className="text-center space-y-2 z-10">
                <ScanLine size={40} className="text-sp-teal mx-auto" />
                <p className="text-foreground text-sm font-semibold">Align plate here</p>
                <p className="text-sp-text-secondary text-xs">Position the license plate within the frame</p>
              </div>
              {/* Scan line animation */}
              <div className="absolute left-4 right-4 h-0.5 bg-sp-teal/60 animate-pulse top-1/2" />
            </div>

            {/* Manual entry */}
            {!manualMode ? (
              <button
                onClick={() => setManualMode(true)}
                className="flex items-center justify-center gap-2 text-sp-teal text-sm font-semibold w-full py-2"
              >
                <Keyboard size={16} /> Enter plate manually
              </button>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <InputField
                  variant="teal"
                  placeholder="ABC-1234"
                  value={plateInput}
                  onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                  className="text-center text-lg font-bold tracking-wider"
                  autoFocus
                />
                <PillButton variant="teal" onClick={() => handleSubmitPlate(plateInput)} disabled={!plateInput.trim()}>
                  Verify Plate
                </PillButton>
              </div>
            )}

            {/* Simulated scan button (for demo) */}
            {!manualMode && (
              <PillButton variant="teal" onClick={() => handleSubmitPlate(`TST-${Math.floor(1000 + Math.random() * 9000)}`)}>
                <ScanLine size={18} className="inline mr-2" /> Simulate Scan
              </PillButton>
            )}
          </>
        )}

        {phase === "result" && (
          <>
            {/* Result card */}
            <div className={cn("rounded-card p-5 border space-y-4 animate-slide-up", meta.bg)}>
              <div className="flex items-center gap-3">
                {meta.icon}
                <span className={cn("font-bold text-sm uppercase tracking-wider", meta.color)}>
                  {meta.label}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Car size={16} className="text-sp-text-secondary" />
                  <span className="text-foreground font-bold text-lg tracking-wider">{currentPlate}</span>
                </div>

                {currentState === "active" && (
                  <div className="space-y-1 text-sm">
                    <p className="text-sp-text-secondary">Lot: Neon Plaza North</p>
                    <p className="text-sp-text-secondary">Duration: 2 hr · Started 1:24 PM</p>
                    <p className="text-sp-text-secondary">Remaining: 1h 12m</p>
                  </div>
                )}

                {currentState === "overstay" && (
                  <div className="space-y-1 text-sm">
                    <p className="text-sp-text-secondary">Lot: Underground Central</p>
                    <p className="text-sp-warning font-semibold flex items-center gap-1">
                      <Clock size={14} /> Overdue by 47 minutes
                    </p>
                    <p className="text-sp-text-secondary">Session expired at 2:00 PM</p>
                  </div>
                )}

                {currentState === "not-registered" && (
                  <p className="text-sp-text-secondary text-sm">No active session found for this vehicle.</p>
                )}
              </div>

              <div className="flex gap-3">
                {currentState === "active" && (
                  <PillButton variant="teal" className="text-sm">
                    <CheckCircle size={16} className="inline mr-1" /> Mark OK
                  </PillButton>
                )}
                {(currentState === "overstay" || currentState === "not-registered") && (
                  <PillButton
                    variant="teal"
                    className="text-sm bg-sp-warning"
                    onClick={() => setTicketModal(true)}
                  >
                    <AlertTriangle size={16} className="inline mr-1" /> Issue Ticket
                  </PillButton>
                )}
              </div>
            </div>

            {/* Dev helper */}
            <button
              onClick={() => {
                const nextIdx = (stateIdx + 1) % stateOrder.length;
                setStateIdx(nextIdx);
                setScanLog((prev) => {
                  const updated = [...prev];
                  if (updated[0]) updated[0] = { ...updated[0], status: stateOrder[nextIdx] };
                  return updated;
                });
              }}
              className="w-full text-center text-sp-text-secondary text-xs border border-dashed border-border rounded-card py-2"
            >
              🔄 Test Next State
            </button>

            <GhostButton variant="teal" onClick={handleReset}>
              <ScanLine size={16} className="inline mr-2" /> Scan Another
            </GhostButton>
          </>
        )}

        {/* Scan Log */}
        {scanLog.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">Verification Log</h3>
            {scanLog.map((log, i) => {
              const lm = resultMeta[log.status];
              return (
                <div key={i} className="bg-sp-surface rounded-card p-3 flex items-center gap-3 border border-border/50">
                  {lm.icon}
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-semibold text-sm">{log.plate}</p>
                    <p className="text-sp-text-secondary text-xs">{log.time}</p>
                  </div>
                  <span className={cn("text-[10px] font-bold uppercase px-2 py-1 rounded-pill", lm.bg)}>
                    {lm.label}
                  </span>
                </div>
              );
            })}
          </section>
        )}
      </PageWrapper>

      {/* Ticket Modal */}
      {ticketModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
          <div className="w-full max-w-[390px] bg-sp-surface rounded-t-[20px] p-6 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground font-bold text-lg">Issue Ticket</h3>
              <button onClick={() => setTicketModal(false)} className="text-sp-text-secondary">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Plate Number</label>
              <InputField variant="teal" value={currentPlate} readOnly className="font-bold" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Reason</label>
              <select
                value={ticketReason}
                onChange={(e) => setTicketReason(e.target.value)}
                className="w-full bg-background border border-border rounded-input px-4 py-3 text-foreground text-sm outline-none focus:border-sp-teal focus:ring-2 focus:ring-sp-teal"
              >
                <option>Overtime parking</option>
                <option>No valid session</option>
                <option>Improper parking</option>
                <option>Unauthorized zone</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-1.5 block">Fine Amount ($)</label>
              <InputField
                variant="teal"
                type="number"
                value={ticketAmount}
                onChange={(e) => setTicketAmount(e.target.value)}
              />
            </div>

            <PillButton
              variant="teal"
              className="bg-sp-warning"
              onClick={() => {
                setTicketModal(false);
                handleReset();
              }}
            >
              Submit Ticket — ${ticketAmount}
            </PillButton>
          </div>
        </div>
      )}

      <BottomNav variant="owner" />
    </>
  );
};

export default CarVerification;
