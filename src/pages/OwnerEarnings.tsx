import { useState, useMemo } from "react";
import PageWrapper from "@/components/safepark/PageWrapper";
import BottomNav from "@/components/safepark/BottomNav";
import GhostButton from "@/components/safepark/GhostButton";
import { useLotStore } from "@/stores/useLotStore";
import { DollarSign, TrendingUp, Download, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type DateRange = "today" | "week" | "month" | "custom";
const dateChips: { key: DateRange; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "custom", label: "Custom" },
];

/* ── Mock data generators ──────────────────────────────── */
const genDaily = (days: number) =>
  Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      earnings: +(Math.random() * 120 + 30).toFixed(2),
    };
  });

const mockTransactions = [
  { plate: "ABC-1234", duration: "2 hr", gross: 7.91, time: "12:34 PM" },
  { plate: "XYZ-5678", duration: "1 hr", gross: 4.52, time: "11:18 AM" },
  { plate: "JKL-9012", duration: "30 min", gross: 2.26, time: "10:05 AM" },
  { plate: "MNO-3456", duration: "All Day", gross: 16.95, time: "9:00 AM" },
  { plate: "PQR-7890", duration: "2 hr", gross: 7.91, time: "Yesterday" },
  { plate: "STU-2345", duration: "1 hr", gross: 4.52, time: "Yesterday" },
];

const mockPayouts = [
  { date: "Mar 14, 2026", amount: 342.18, ref: "PAY-A82F3D" },
  { date: "Mar 7, 2026", amount: 287.54, ref: "PAY-7B1E9C" },
  { date: "Feb 28, 2026", amount: 415.02, ref: "PAY-3D6F8A" },
];

const PLATFORM_FEE = 0.1;

const OwnerEarnings = () => {
  const navigate = useNavigate();
  const lots = useLotStore((s) => s.lots);
  const [range, setRange] = useState<DateRange>("week");

  const chartDays = range === "today" ? 1 : range === "week" ? 7 : 30;
  const chartData = useMemo(() => genDaily(chartDays), [chartDays]);

  const gross = chartData.reduce((a, d) => a + d.earnings, 0);
  const fee = gross * PLATFORM_FEE;
  const net = gross - fee;

  return (
    <>
      <PageWrapper className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,hsl(232_90%_12%)_0%,hsl(230_80%_7%)_45%,hsl(230_85%_5%)_100%)] px-0 py-0 pb-24">
        <div className="mx-auto max-w-[390px] min-h-screen flex flex-col">
          <div className="h-16 px-5 flex items-center justify-between border-b border-white/5 bg-black/20">
            <button onClick={() => navigate("/owner/home")} className="text-sp-teal/90 hover:text-sp-teal transition-colors">
              <ArrowLeft size={20} />
            </button>
            <span className="font-bold text-lg text-sp-teal tracking-[0.15em] uppercase">SafePark</span>
            <div className="w-5" />
          </div>
          <div className="px-5 pt-6 pb-8 flex-1">
            <div className="rounded-[34px] border border-white/5 bg-[linear-gradient(180deg,rgba(25,33,89,0.55)_0%,rgba(12,16,42,0.82)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)] space-y-5">
              <h1 className="text-foreground font-bold text-lg">Earnings</h1>

        {/* Date chips */}
        <div className="flex gap-2">
          {dateChips.map((c) => (
            <button
              key={c.key}
              onClick={() => setRange(c.key)}
              className={cn(
                "px-3 py-2 rounded-pill text-xs font-semibold transition-colors",
                range === c.key
                  ? "bg-cyan-300 text-slate-900"
                  : "bg-black/25 text-sp-text-secondary border border-white/10"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Summary card */}
        <div className="bg-black/25 rounded-card p-5 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-sp-teal">
            <TrendingUp size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">Summary</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-sp-text-secondary">Gross</span>
              <span className="text-foreground">${gross.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-sp-text-secondary">Platform Fee (10%)</span>
              <span className="text-destructive">−${fee.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="text-foreground font-bold">Net Earnings</span>
              <span className="text-sp-teal font-bold text-xl">${net.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartDays > 1 && (
          <div className="bg-black/25 rounded-card p-4 border border-white/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary mb-3">Daily Earnings</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(216 16% 26%)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "hsl(218 11% 65%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(218 11% 65%)", fontSize: 10 }} axisLine={false} tickLine={false} width={36} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(222 47% 11%)", border: "1px solid hsl(216 16% 26%)", borderRadius: 8, color: "hsl(210 20% 98%)" }}
                  formatter={(v: number) => [`$${v.toFixed(2)}`, "Earnings"]}
                />
                <Bar dataKey="earnings" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="hsl(168 80% 40%)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Per-lot breakdown */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">Per-Lot Breakdown</h3>
          {lots.map((lot) => {
            const lotGross = +(gross / lots.length + (Math.random() * 20 - 10)).toFixed(2);
            const lotNet = +(lotGross * (1 - PLATFORM_FEE)).toFixed(2);
            return (
              <div key={lot.id} className="bg-black/25 rounded-card p-4 border border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-card bg-background flex items-center justify-center shrink-0">
                  <DollarSign size={16} className="text-sp-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-semibold text-sm truncate">{lot.name}</p>
                  <p className="text-sp-text-secondary text-xs">Gross ${lotGross} · Net ${lotNet}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Transactions */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">Transactions</h3>
          <div className="space-y-2">
            {mockTransactions.map((t, i) => {
              const tNet = +(t.gross * (1 - PLATFORM_FEE)).toFixed(2);
              return (
                <div key={i} className="bg-black/25 rounded-card p-3 flex items-center gap-3 border border-white/10">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-semibold">{t.plate}</p>
                    <p className="text-sp-text-secondary text-xs">{t.duration} · {t.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground text-sm font-bold">${t.gross.toFixed(2)}</p>
                    <p className="text-sp-teal text-xs">Net ${tNet.toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Payout History */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">Payout History</h3>
          <div className="space-y-2">
            {mockPayouts.map((p, i) => (
              <div key={i} className="bg-black/25 rounded-card p-4 flex items-center justify-between border border-white/10">
                <div>
                  <p className="text-foreground text-sm font-semibold">${p.amount.toFixed(2)}</p>
                  <p className="text-sp-text-secondary text-xs">{p.date} · {p.ref}</p>
                </div>
                <span className="text-sp-teal text-[10px] font-bold uppercase bg-sp-teal/15 px-2 py-1 rounded-pill">Paid</span>
              </div>
            ))}
          </div>
        </section>

        {/* Export buttons */}
        <div className="flex gap-3">
          <GhostButton variant="teal" className="flex items-center justify-center gap-2 text-sm border-white/15">
            <Download size={16} /> Export CSV
          </GhostButton>
          <GhostButton variant="teal" className="flex items-center justify-center gap-2 text-sm border-white/15">
            <FileText size={16} /> Export PDF
          </GhostButton>
        </div>
            </div>
          </div>
        </div>
      </PageWrapper>
      <BottomNav variant="owner" />
    </>
  );
};

export default OwnerEarnings;
