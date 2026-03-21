import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/safepark/PageWrapper";
import PillButton from "@/components/safepark/PillButton";
import UserHeader from "@/components/safepark/UserHeader";
import { useSessionStore } from "@/stores/useSessionStore";
import {
  AlertTriangle,
  MapPin,
  Car,
  Calendar,
  CreditCard,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROCESSING_FEE = 1.5;

const TicketPayment = () => {
  const navigate = useNavigate();
  const { activeTicket, paymentMethods, payTicket } = useSessionStore();
  const [selectedPm, setSelectedPm] = useState(
    paymentMethods.find((p) => p.isDefault)?.id || paymentMethods[0]?.id || ""
  );
  const [paid, setPaid] = useState(false);
  const [confirmNumber] = useState(`SP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

  if (!activeTicket) {
    return (
      <PageWrapper className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,hsl(232_90%_12%)_0%,hsl(230_80%_7%)_45%,hsl(230_85%_5%)_100%)] px-0 py-0">
        <div className="mx-auto max-w-[390px] min-h-screen flex flex-col">
          <UserHeader />
          <div className="px-5 pt-6 pb-8 flex-1 flex flex-col items-center justify-center gap-4">
            <CheckCircle size={48} className="text-sp-teal" />
            <p className="text-foreground font-bold text-lg">No outstanding tickets</p>
            <PillButton onClick={() => navigate("/home")} className="max-w-[200px] h-14 bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.35)]">
              Back to Home
            </PillButton>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const total = activeTicket.amount + PROCESSING_FEE;

  if (paid) {
    return (
      <PageWrapper className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,hsl(232_90%_12%)_0%,hsl(230_80%_7%)_45%,hsl(230_85%_5%)_100%)] px-0 py-0">
        <div className="mx-auto max-w-[390px] min-h-screen flex flex-col">
          <UserHeader />
          <div className="px-5 pt-6 pb-8 flex-1">
            <div className="rounded-[34px] border border-white/5 bg-[linear-gradient(180deg,rgba(25,33,89,0.55)_0%,rgba(12,16,42,0.82)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)] flex flex-col items-center justify-center gap-6 text-center h-full">
              <div className="w-20 h-20 rounded-full bg-sp-teal/20 flex items-center justify-center animate-pulse">
                <CheckCircle size={40} className="text-sp-teal" />
              </div>
              <div className="space-y-2">
                <h1 className="text-title text-foreground">Ticket Paid</h1>
                <p className="text-sp-text-secondary text-sm">
                  Your parking ticket has been resolved successfully.
                </p>
              </div>
              <div className="bg-black/25 rounded-card p-4 w-full space-y-2 border border-white/10">
                <p className="text-sp-text-secondary text-xs uppercase font-semibold tracking-wider">
                  Confirmation Number
                </p>
                <p className="text-foreground font-mono text-lg font-bold">{confirmNumber}</p>
                <p className="text-sp-text-secondary text-xs">
                  Amount: ${total.toFixed(2)}
                </p>
              </div>
              <PillButton onClick={() => navigate("/home")} className="h-14 bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.35)]">Back to Home</PillButton>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,hsl(232_90%_12%)_0%,hsl(230_80%_7%)_45%,hsl(230_85%_5%)_100%)] px-0 py-0">
      <div className="mx-auto max-w-[390px] min-h-screen flex flex-col">
        <UserHeader />
        <div className="px-5 pt-6 pb-8 flex-1">
          <div className="rounded-[34px] border border-white/5 bg-[linear-gradient(180deg,rgba(25,33,89,0.55)_0%,rgba(12,16,42,0.82)_100%)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)] space-y-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-card bg-black/25 border border-white/10 flex items-center justify-center"
              >
                <ArrowLeft size={18} className="text-sp-text-secondary" />
              </button>
              <h1 className="text-foreground font-bold text-lg">Pay Ticket</h1>
            </div>

      {/* Ticket Summary */}
      <div className="bg-destructive/10 border border-destructive/30 rounded-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-destructive" />
          <span className="text-destructive font-bold text-sm uppercase tracking-wider">
            Parking Ticket
          </span>
        </div>

        <div className="space-y-3">
          <InfoRow icon={<MapPin size={14} />} label="Location" value={activeTicket.lotName} />
          <InfoRow icon={<Car size={14} />} label="Plate" value={activeTicket.plate} />
          <InfoRow icon={<Calendar size={14} />} label="Date" value={activeTicket.date} />
          <InfoRow icon={<AlertTriangle size={14} />} label="Reason" value={activeTicket.reason} />
          <InfoRow icon={<Calendar size={14} />} label="Due Date" value={activeTicket.dueDate} />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-destructive/20">
          <span className="text-sp-text-secondary text-sm">Amount Due</span>
          <span className="text-destructive font-bold text-xl">${activeTicket.amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
          Payment Method
        </h3>
        <div className="space-y-2">
          {paymentMethods.map((pm) => (
            <button
              key={pm.id}
              onClick={() => setSelectedPm(pm.id)}
              className={cn(
                "w-full bg-sp-surface rounded-card p-4 flex items-center gap-3 border transition-colors text-left active:scale-[0.98] transition-transform",
                selectedPm === pm.id
                  ? "border-sp-blue"
                  : "border-border/50"
              )}
            >
              <div className="w-10 h-10 rounded-card bg-background flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-sp-teal" />
              </div>
              <div className="flex-1">
                <p className="text-foreground font-semibold text-sm">
                  {pm.label} ···· {pm.last4}
                </p>
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selectedPm === pm.id
                    ? "border-sp-blue bg-sp-blue"
                    : "border-border"
                )}
              >
                {selectedPm === pm.id && (
                  <div className="w-2 h-2 rounded-full bg-foreground" />
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Order Summary */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
          Order Summary
        </h3>
        <div className="bg-sp-surface rounded-card p-4 space-y-3 border border-border/50">
          <div className="flex justify-between text-sm">
            <span className="text-sp-text-secondary">Ticket Amount</span>
            <span className="text-foreground">${activeTicket.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-sp-text-secondary">Processing Fee</span>
            <span className="text-foreground">${PROCESSING_FEE.toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="text-foreground font-bold">Total</span>
            <span className="text-foreground font-bold text-lg">${total.toFixed(2)}</span>
          </div>
        </div>
      </section>

            <PillButton
              onClick={() => {
                payTicket(confirmNumber);
                setPaid(true);
              }}
              disabled={!selectedPm}
              className="h-14 bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-900 shadow-[0_0_24px_rgba(34,211,238,0.35)]"
            >
              Pay Now — ${total.toFixed(2)}
            </PillButton>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-sp-text-secondary mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-sp-text-secondary font-semibold">
          {label}
        </p>
        <p className="text-foreground text-sm">{value}</p>
      </div>
    </div>
  );
}

export default TicketPayment;
