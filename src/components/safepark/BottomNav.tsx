import { Home, Clock, User, DollarSign, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const userNav: NavItem[] = [
  { label: "Home", icon: <Home size={22} />, path: "/home" },
  { label: "History", icon: <Clock size={22} />, path: "/history" },
  { label: "Profile", icon: <User size={22} />, path: "/profile" },
];

const ownerNav: NavItem[] = [
  { label: "Home", icon: <Home size={22} />, path: "/owner/home" },
  { label: "Earnings", icon: <DollarSign size={22} />, path: "/owner/earnings" },
  { label: "Verify", icon: <ShieldCheck size={22} />, path: "/owner/verify" },
  { label: "Profile", icon: <User size={22} />, path: "/profile" },
];

interface BottomNavProps {
  variant?: "user" | "owner";
}

const BottomNav = ({ variant = "user" }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const items = variant === "user" ? userNav : ownerNav;
  const activeColor = variant === "user" ? "text-sp-blue" : "text-sp-teal";

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-sp-surface border-t border-border flex justify-around items-center h-16 z-50">
      {items.map((item) => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors",
              active ? activeColor : "text-sp-text-secondary"
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
