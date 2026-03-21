import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/safepark/PageWrapper";
import BottomNav from "@/components/safepark/BottomNav";
import PillButton from "@/components/safepark/PillButton";
import GhostButton from "@/components/safepark/GhostButton";
import InputField from "@/components/safepark/InputField";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCarStore, CarEntry } from "@/stores/useCarStore";
import { useSessionStore, PaymentMethod } from "@/stores/useSessionStore";
import {
  User,
  Camera,
  Pencil,
  Trash2,
  Star,
  CreditCard,
  Car,
  Bell,
  Lock,
  LogOut,
  AlertTriangle,
  Check,
  X,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { cars, setCars } = useCarStore();
  const {
    paymentMethods,
    removePaymentMethod,
    setDefaultPayment,
  } = useSessionStore();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "Parker Smith");
  const [email] = useState(user?.email || "parker@email.com");
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "(555) 123-4567");

  const [notifications, setNotifications] = useState({
    ticketAlerts: true,
    expiryWarnings: true,
    receipts: false,
  });

  const toggleNotification = (key: keyof typeof notifications) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const deleteCar = (plate: string) => {
    setCars(cars.filter((c) => c.plateNumber !== plate));
  };

  return (
    <>
      <PageWrapper className="pb-24 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-sp-surface border-2 border-border flex items-center justify-center">
              <User size={36} className="text-sp-text-secondary" />
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-sp-blue flex items-center justify-center active:scale-95 transition-transform">
              <Camera size={14} className="text-foreground" />
            </button>
          </div>
          <p className="text-foreground font-bold text-lg">{fullName}</p>
        </div>

        {/* Editable fields */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
              Personal Info
            </h3>
            <button
              onClick={() => setEditing(!editing)}
              className="text-sp-blue text-xs font-bold flex items-center gap-1"
            >
              {editing ? <><Check size={14} /> Done</> : <><Pencil size={14} /> Edit</>}
            </button>
          </div>

          <div className="space-y-2">
            <FieldRow label="Full Name">
              {editing ? (
                <InputField value={fullName} onChange={(e) => setFullName(e.target.value)} />
              ) : (
                <p className="text-foreground text-sm py-3">{fullName}</p>
              )}
            </FieldRow>
            <FieldRow label="Email">
              <p className="text-foreground text-sm py-3">{email}</p>
            </FieldRow>
            <FieldRow label="Phone">
              {editing ? (
                <InputField value={phone} onChange={(e) => setPhone(e.target.value)} />
              ) : (
                <p className="text-foreground text-sm py-3">{phone}</p>
              )}
            </FieldRow>
          </div>
        </section>

        {/* My Cars */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
            My Cars
          </h3>
          <div className="space-y-2">
            {cars.map((car) => (
              <div
                key={car.plateNumber}
                className="bg-sp-surface rounded-card p-4 flex items-center gap-3 border border-border/50"
              >
                <div className="w-10 h-10 rounded-card bg-background flex items-center justify-center shrink-0">
                  <Car size={18} className="text-sp-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-semibold text-sm">
                    {car.make} {car.model}
                  </p>
                  <p className="text-sp-text-secondary text-xs">
                    {car.plateNumber} · {car.year} · {car.color}
                  </p>
                </div>
                <button className="text-sp-text-secondary hover:text-sp-blue transition-colors p-1">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => deleteCar(car.plateNumber)}
                  className="text-sp-text-secondary hover:text-destructive transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={() => navigate("/onboarding/add-car")}
              className="w-full bg-sp-surface rounded-card p-4 flex items-center justify-center gap-2 border border-dashed border-border text-sp-blue font-semibold text-sm active:scale-[0.98] transition-transform"
            >
              <Plus size={16} /> Add Car
            </button>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
            Payment Methods
          </h3>
          <div className="space-y-2">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="bg-sp-surface rounded-card p-4 flex items-center gap-3 border border-border/50"
              >
                <div className="w-10 h-10 rounded-card bg-background flex items-center justify-center shrink-0">
                  <CreditCard size={18} className="text-sp-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-semibold text-sm">
                    {pm.label} ···· {pm.last4}
                  </p>
                  {pm.isDefault && (
                    <span className="text-sp-teal text-[10px] font-bold uppercase">Default</span>
                  )}
                </div>
                <button
                  onClick={() => setDefaultPayment(pm.id)}
                  className={cn(
                    "p-1 transition-colors",
                    pm.isDefault ? "text-sp-warning" : "text-sp-text-secondary hover:text-sp-warning"
                  )}
                >
                  <Star size={14} fill={pm.isDefault ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => removePaymentMethod(pm.id)}
                  className="text-sp-text-secondary hover:text-destructive transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
            Notifications
          </h3>
          <div className="space-y-1">
            <ToggleRow
              label="Ticket Alerts"
              icon={<Bell size={16} />}
              checked={notifications.ticketAlerts}
              onToggle={() => toggleNotification("ticketAlerts")}
            />
            <ToggleRow
              label="Expiry Warnings"
              icon={<AlertTriangle size={16} />}
              checked={notifications.expiryWarnings}
              onToggle={() => toggleNotification("expiryWarnings")}
            />
            <ToggleRow
              label="Receipts"
              icon={<CreditCard size={16} />}
              checked={notifications.receipts}
              onToggle={() => toggleNotification("receipts")}
            />
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-3 pt-2">
          <button className="w-full bg-sp-surface rounded-card p-4 flex items-center gap-3 border border-border/50 text-foreground text-sm font-medium">
            <Lock size={16} className="text-sp-text-secondary" />
            Change Password
          </button>

          <PillButton onClick={handleLogout} className="bg-sp-surface border border-border text-foreground flex items-center justify-center gap-2">
            <LogOut size={16} /> Logout
          </PillButton>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full text-center text-destructive text-sm font-semibold py-2">
                Delete Account
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-sp-surface border-border max-w-[350px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">Delete Account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action is permanent. All your data, cars, and payment methods will be removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-background border-border text-foreground">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </PageWrapper>
      <BottomNav variant="user" />
    </>
  );
};

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-sp-surface rounded-card px-4 border border-border/50">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-sp-text-secondary pt-2 block">
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  icon,
  checked,
  onToggle,
}: {
  label: string;
  icon: React.ReactNode;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-sp-surface rounded-card p-4 flex items-center gap-3 border border-border/50">
      <span className="text-sp-text-secondary">{icon}</span>
      <span className="text-foreground text-sm font-medium flex-1">{label}</span>
      <button
        onClick={onToggle}
        className={cn(
          "w-10 h-6 rounded-full flex items-center px-0.5 transition-colors",
          checked ? "bg-sp-teal" : "bg-border"
        )}
      >
        <div
          className={cn(
            "w-5 h-5 rounded-full bg-foreground transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

export default UserProfile;
