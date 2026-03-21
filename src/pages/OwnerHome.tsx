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
      <PageWrapper className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,hsl(232_90%_12%)_0%,hsl(230_80%_7%)_45%,hsl(230_85%_5%)_100%)] px-0 py-0 pb-24">
        <div className="mx-auto max-w-[390px] min-h-screen flex flex-col">
          <header className="h-16 px-5 flex items-center justify-between border-b border-white/5 bg-black/20">
            <span className="font-bold text-lg text-sp-teal tracking-[0.15em] uppercase">SafePark</span>
            <div className="flex items-center gap-3">
              <button className="relative text-sp-text-secondary">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full" />
              </button>
              <div className="w-9 h-9 rounded-full bg-black/25 border border-white/10 flex items-center justify-center">
                <User size={16} className="text-sp-text-secondary" />
              </div>
            </div>
          </header>

          <div className="px-5 pt-6 pb-8 flex-1">
            <div className="rounded-[34px] border border-white/5 bg-[linear-gradient(180deg,rgba(25,33,89,0.55)_0%,rgba(12,16,42,0.82)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)] space-y-5">

        {/* Stats */}
        <div className="flex gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex-1 bg-black/25 rounded-card p-3 border border-white/10 space-y-1"
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
              <div key={lot.id} className="bg-black/25 rounded-card p-4 border border-white/10 space-y-3">
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
              <div key={i} className="bg-black/25 rounded-card p-3 flex items-center gap-3 border border-white/10">
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
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* FAB */}
      <button
        onClick={() => navigate("/owner/verify")}
        className="fixed bottom-20 right-[calc(50%-195px+16px)] w-14 h-14 rounded-full bg-gradient-to-r from-cyan-300 to-cyan-400 flex items-center justify-center shadow-[0_0_24px_rgba(34,211,238,0.35)] active:scale-95 transition-transform z-40"
      >
        <ScanLine size={22} className="text-slate-900" />
      </button>

      <BottomNav variant="owner" />
    </>
  );
};

export default OwnerHome;
