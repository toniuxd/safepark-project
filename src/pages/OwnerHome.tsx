import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/safepark/PageWrapper";
import BottomNav from "@/components/safepark/BottomNav";
import { useLotStore } from "@/stores/useLotStore";
import {
  DollarSign,
  Car,
  ParkingCircle,
  Bell,
  User,
  ScanLine,
  AlertTriangle,
  Clock,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

/* ── Mock data ─────────────────────────────────────────── */
const mockRecentActivity = [
  { plate: "ABC-1234", duration: "2 hr", amount: 7.91, time: "12 min ago" },
  { plate: "XYZ-5678", duration: "1 hr", amount: 4.52, time: "28 min ago" },
  { plate: "JKL-9012", duration: "30 min", amount: 2.26, time: "45 min ago" },
  { plate: "MNO-3456", duration: "All Day", amount: 16.95, time: "1 hr ago" },
  { plate: "PQR-7890", duration: "2 hr", amount: 7.91, time: "1.5 hr ago" },
  { plate: "STU-2345", duration: "1 hr", amount: 4.52, time: "2 hr ago" },
  { plate: "VWX-6789", duration: "30 min", amount: 2.26, time: "3 hr ago" },
  { plate: "YZA-0123", duration: "1 hr", amount: 4.52, time: "4 hr ago" },
];

const mockAlerts = [
  { plate: "MNO-3456", lot: "Neon Plaza North", overdue: "47 min", amount: 25 },
  { plate: "PQR-7890", lot: "Underground Central", overdue: "12 min", amount: 25 },
];

const OwnerHome = () => {
  const navigate = useNavigate();
  const lots = useLotStore((s) => s.lots);
  const [lotOpen, setLotOpen] = useState<Record<string, boolean>>({
    "lot-1": true,
    "lot-2": true,
    "lot-3": false,
  });

  const totalEarnings = mockRecentActivity.reduce((a, r) => a + r.amount, 0);
  const activeCars = lots.reduce((a, l) => a + (l.totalSpots - l.availableSpots), 0);
  const openSpots = lots.reduce((a, l) => a + l.availableSpots, 0);

  const stats = [
    { label: "Today's Earnings", value: `$${totalEarnings.toFixed(0)}`, icon: <DollarSign size={18} /> },
    { label: "Active Cars", value: String(activeCars), icon: <Car size={18} /> },
    { label: "Open Spots", value: String(openSpots), icon: <ParkingCircle size={18} /> },
  ];

  return (
    <>
      <PageWrapper className="pb-24 space-y-5">
        {/* Header */}
        <header className="flex items-center justify-between">
          <span className="font-bold text-lg text-sp-teal tracking-wide uppercase">SafePark</span>
          <div className="flex items-center gap-3">
            <button className="relative text-sp-text-secondary">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-sp-surface border border-border flex items-center justify-center">
              <User size={16} className="text-sp-text-secondary" />
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="flex gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex-1 bg-sp-surface rounded-card p-3 border border-border/50 space-y-1"
            >
              <span className="text-sp-teal">{s.icon}</span>
              <p className="text-foreground font-bold text-lg leading-none">{s.value}</p>
              <p className="text-sp-text-secondary text-[10px] uppercase font-semibold tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Lot Status Cards */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">Your Lots</h3>
          {lots.map((lot) => {
            const occ = lot.totalSpots - lot.availableSpots;
            const pct = Math.round((occ / lot.totalSpots) * 100);
            const isOpen = lotOpen[lot.id] ?? true;
            return (
              <div key={lot.id} className="bg-sp-surface rounded-card p-4 border border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground font-semibold text-sm">{lot.name}</p>
                    <p className="text-sp-text-secondary text-xs">{occ}/{lot.totalSpots} occupied</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate("/owner/verify")}
                      className="text-sp-teal text-xs font-bold flex items-center gap-1"
                    >
                      <ScanLine size={14} /> Scan
                    </button>
                    <button
                      onClick={() => setLotOpen((p) => ({ ...p, [lot.id]: !isOpen }))}
                      className={cn("transition-colors", isOpen ? "text-sp-teal" : "text-sp-text-secondary")}
                    >
                      {isOpen ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-sp-teal rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-sp-text-secondary">
                  <span>{pct}% full</span>
                  <span className={isOpen ? "text-sp-teal" : "text-destructive"}>{isOpen ? "Open" : "Closed"}</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Alerts */}
        {mockAlerts.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">Overstay Alerts</h3>
            {mockAlerts.map((a, i) => (
              <div key={i} className="bg-destructive/10 border border-destructive/30 rounded-card p-4 flex items-center gap-3">
                <AlertTriangle size={20} className="text-destructive shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-semibold">{a.plate}</p>
                  <p className="text-sp-text-secondary text-xs">{a.lot} · Overdue {a.overdue}</p>
                </div>
                <span className="text-destructive font-bold text-sm">${a.amount}</span>
              </div>
            ))}
          </section>
        )}

        {/* Recent Activity */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">Recent Activity</h3>
          <div className="space-y-2">
            {mockRecentActivity.map((r, i) => (
              <div key={i} className="bg-sp-surface rounded-card p-3 flex items-center gap-3 border border-border/50">
                <div className="w-9 h-9 rounded-card bg-background flex items-center justify-center shrink-0">
                  <Car size={16} className="text-sp-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-semibold">{r.plate}</p>
                  <p className="text-sp-text-secondary text-xs">{r.duration} · {r.time}</p>
                </div>
                <span className="text-sp-teal font-bold text-sm">${r.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>
      </PageWrapper>

      {/* FAB */}
      <button
        onClick={() => navigate("/owner/verify")}
        className="fixed bottom-20 right-[calc(50%-195px+16px)] w-14 h-14 rounded-full bg-sp-teal flex items-center justify-center shadow-lg shadow-sp-teal/30 active:scale-95 transition-transform z-40"
      >
        <ScanLine size={22} className="text-foreground" />
      </button>

      <BottomNav variant="owner" />
    </>
  );
};

export default OwnerHome;
