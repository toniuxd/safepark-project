import { useState, useMemo, useEffect } from "react";
import PageWrapper from "@/components/safepark/PageWrapper";
import BottomNav from "@/components/safepark/BottomNav";
import GhostButton from "@/components/safepark/GhostButton";
import { useSessionStore, ParkingSession, SessionStatus } from "@/stores/useSessionStore";
import { Clock, Download, MapPin, Car, Timer, ChevronRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type DateFilter = "today" | "week" | "month";
type StatusFilter = "all" | SessionStatus;

const dateFilters: { key: DateFilter; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
];

const statusFilters: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "ticketed", label: "Ticketed" },
];

const statusColors: Record<SessionStatus, string> = {
  active: "bg-sp-teal/20 text-sp-teal",
  completed: "bg-sp-blue/20 text-sp-blue",
  ticketed: "bg-destructive/20 text-destructive",
};

function Countdown({ endTime }: { endTime: number }) {
  const [remaining, setRemaining] = useState(Math.max(0, endTime - Date.now()));

  useEffect(() => {
    const t = setInterval(() => {
      const r = Math.max(0, endTime - Date.now());
      setRemaining(r);
      if (r <= 0) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [endTime]);

  const hrs = Math.floor(remaining / 3600000);
  const mins = Math.floor((remaining % 3600000) / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);

  return (
    <span className="text-sp-teal font-mono text-sm font-bold tabular-nums">
      {hrs > 0 && `${hrs}h `}{String(mins).padStart(2, "0")}m {String(secs).padStart(2, "0")}s
    </span>
  );
}

const ParkingHistory = () => {
  const parkingHistory = useSessionStore((s) => s.parkingHistory);
  const [dateFilter, setDateFilter] = useState<DateFilter>("month");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [extendModal, setExtendModal] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const now = Date.now();
    let cutoff = 0;
    if (dateFilter === "today") cutoff = now - 86400000;
    else if (dateFilter === "week") cutoff = now - 86400000 * 7;
    else cutoff = now - 86400000 * 30;

    return parkingHistory.filter((s) => {
      if (s.timestamp < cutoff) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      return true;
    });
  }, [parkingHistory, dateFilter, statusFilter]);

  return (
    <>
      <PageWrapper className="pb-24 space-y-5">
        <h1 className="text-title text-foreground">Parking History</h1>

        {/* Date chips */}
        <div className="flex gap-2">
          {dateFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setDateFilter(f.key)}
              className={cn(
                "px-4 py-2 rounded-pill text-xs font-semibold transition-colors",
                dateFilter === f.key
                  ? "bg-sp-blue text-foreground"
                  : "bg-sp-surface text-sp-text-secondary border border-border"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Status chips */}
        <div className="flex gap-2">
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={cn(
                "px-3 py-1.5 rounded-pill text-xs font-semibold transition-colors",
                statusFilter === f.key
                  ? "bg-sp-teal text-foreground"
                  : "bg-sp-surface text-sp-text-secondary border border-border"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sessions */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-sp-text-secondary">
            <Inbox size={48} strokeWidth={1.2} />
            <p className="text-sm font-medium">No parking history yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                onExtend={() => setExtendModal(s.id)}
              />
            ))}
          </div>
        )}

        {/* Extend modal (UI only) */}
        {extendModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
            <div className="w-full max-w-[390px] bg-sp-surface rounded-t-[20px] p-6 space-y-4 animate-slide-up">
              <h3 className="text-foreground font-bold text-lg">Extend Duration</h3>
              {["+ 30 min — $2", "+ 1 hr — $4", "+ 2 hr — $7"].map((opt) => (
                <button
                  key={opt}
                  className="w-full bg-background border border-border rounded-card p-4 text-foreground text-sm font-medium text-left active:scale-[0.98] transition-transform"
                >
                  {opt}
                </button>
              ))}
              <GhostButton onClick={() => setExtendModal(null)}>Cancel</GhostButton>
            </div>
          </div>
        )}
      </PageWrapper>
      <BottomNav variant="user" />
    </>
  );
};

function SessionCard({
  session: s,
  onExtend,
}: {
  session: ParkingSession;
  onExtend: () => void;
}) {
  const dateStr = new Date(s.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-sp-surface rounded-card p-4 space-y-3 border border-border/50 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-card bg-background flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-sp-blue" />
          </div>
          <div>
            <p className="text-foreground font-semibold text-sm">{s.lotName}</p>
            <p className="text-sp-text-secondary text-xs">{dateStr}</p>
          </div>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold uppercase px-2 py-1 rounded-pill",
            statusColors[s.status]
          )}
        >
          {s.status}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-sp-text-secondary">
        <span className="flex items-center gap-1">
          <Timer size={12} /> {s.duration}
        </span>
        <span className="flex items-center gap-1">
          <Car size={12} /> {s.carPlate}
        </span>
        <span className="ml-auto text-foreground font-bold text-sm">
          ${s.total.toFixed(2)}
        </span>
      </div>

      {s.status === "active" && (
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-sp-teal" />
            <Countdown endTime={s.endTime} />
          </div>
          <button
            onClick={onExtend}
            className="text-sp-blue text-xs font-bold flex items-center gap-0.5"
          >
            Extend <ChevronRight size={14} />
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button className="text-sp-text-secondary hover:text-foreground transition-colors">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}

export default ParkingHistory;
