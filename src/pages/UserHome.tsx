import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/safepark/BottomNav";
import InputField from "@/components/safepark/InputField";
import UserHeader from "@/components/safepark/UserHeader";
import { useSessionStore } from "@/stores/useSessionStore";
import { useLotStore, mockLots } from "@/stores/useLotStore";
import { useCarStore } from "@/stores/useCarStore";
import {
  AlertTriangle,
  Search,
  SlidersHorizontal,
  Zap,
  ShieldCheck,
  MapPin,
  Car,
  Plus,
  Heart,
  Clock,
} from "lucide-react";

const UserHome = () => {
  const navigate = useNavigate();
  const activeTicket = useSessionStore((s) => s.activeTicket);
  const parkingHistory = useSessionStore((s) => s.parkingHistory);
  const { lots, favourites } = useLotStore();
  const cars = useCarStore((s) => s.cars);

  const [query, setQuery] = useState("");
  const [nearMe, setNearMe] = useState(true);

  const favouriteLots = useMemo(
    () => lots.filter((l) => favourites.includes(l.id)),
    [lots, favourites]
  );

  const recentLots = parkingHistory.slice(0, 3);

  const handleSearch = () => {
    const results = mockLots.filter((l) =>
      l.name.toLowerCase().includes(query.toLowerCase())
    );
    console.log("Search results:", results);
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-[radial-gradient(circle_at_20%_0%,hsl(232_90%_12%)_0%,hsl(230_80%_7%)_45%,hsl(230_85%_5%)_100%)] relative flex flex-col">
      {/* Map hero + header overlay */}
      <div className="relative h-[320px] shrink-0 overflow-hidden">
        {/* Dark map placeholder */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,14,40,0.95)_0%,rgba(7,11,28,0.98)_100%)]">
          {/* Faux map grid lines */}
          <svg className="w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(var(--sp-teal))" strokeWidth="0.5" />
              </pattern>
              <pattern id="roads" width="120" height="120" patternUnits="userSpaceOnUse">
                <line x1="0" y1="60" x2="120" y2="60" stroke="hsl(var(--sp-teal))" strokeWidth="1.2" />
                <line x1="60" y1="0" x2="60" y2="120" stroke="hsl(var(--sp-teal))" strokeWidth="1.2" />
                <line x1="0" y1="30" x2="120" y2="90" stroke="hsl(var(--sp-teal))" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#roads)" />
          </svg>
        </div>

        {/* Header overlay */}
        <div className="relative z-10 px-5 pt-6">
          <UserHeader />
        </div>
      </div>

      {/* Bottom sheet card */}
      <div className="relative z-10 -mt-16 flex-1 rounded-t-[28px] border border-white/5 bg-[linear-gradient(180deg,rgba(25,33,89,0.55)_0%,rgba(12,16,42,0.82)_100%)] px-5 pt-3 pb-24 space-y-5 overflow-y-auto">
        {/* Drag handle */}
        <div className="flex justify-center">
          <div className="w-10 h-1 rounded-full bg-sp-text-secondary/40" />
        </div>

        {/* Ticket Alert */}
        {activeTicket && (
          <div className="bg-destructive/15 border border-destructive/30 rounded-card p-4 flex items-center gap-3 animate-fade-in backdrop-blur-sm">
            <AlertTriangle className="text-sp-warning shrink-0" size={22} />
            <div className="flex-1 min-w-0">
              <p className="text-foreground text-sm font-semibold">
                Unpaid Parking Ticket
              </p>
              <p className="text-sp-text-secondary text-xs truncate">
                {activeTicket.plate} · {activeTicket.reason} · ${activeTicket.amount}
              </p>
            </div>
            <button
              onClick={() => navigate(`/ticket/${activeTicket.id}`)}
              className="shrink-0 bg-sp-warning/90 text-background font-bold text-xs px-4 py-2 rounded-pill"
            >
              PAY NOW
            </button>
          </div>
        )}

        {/* Search section */}
        <div className="space-y-4">
          <h2 className="text-title text-foreground leading-tight">
            Find parking
            <br />
            near you
          </h2>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sp-text-secondary"
                size={16}
              />
              <InputField
                placeholder="Where are you going?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-11 pl-9 pr-3 py-2 text-sm bg-black/25 border-white/10 rounded-[12px]"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-11 h-11 bg-black/25 border border-white/10 rounded-[12px] flex items-center justify-center shrink-0"
            >
              <SlidersHorizontal size={16} className="text-sp-text-secondary" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <div
                onClick={() => setNearMe(!nearMe)}
                className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${
                  nearMe ? "bg-sp-teal" : "bg-border"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-foreground transition-transform ${
                    nearMe ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
              <span className="uppercase text-xs font-semibold tracking-wider">
                Near me
              </span>
            </label>
            <span className="text-sp-teal text-sm font-semibold">
              {lots.reduce((a, l) => a + l.availableSpots, 0)} active spots
            </span>
          </div>
        </div>

        {/* Recently Used — horizontal scroll */}
        {recentLots.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
              Recently Used
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
              {recentLots.map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/parking/${s.lotId || s.id}`)}
                  className="min-w-[240px] bg-black/25 rounded-card p-4 space-y-3 shrink-0 border border-white/10 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-full bg-sp-teal/15 flex items-center justify-center">
                      <Zap size={18} className="text-sp-teal" />
                    </div>
                    <span className="text-sp-teal text-xs font-semibold">
                      0.4 miles
                    </span>
                  </div>
                  <div>
                    <p className="text-foreground font-bold">{s.lotName}</p>
                    <p className="text-sp-text-secondary text-xs">{s.lotAddress}</p>
                  </div>
                </div>
              ))}
              {/* Show lots as additional cards if few recent */}
              {lots.slice(0, 2).map((lot) => (
                <div
                  key={`lot-${lot.id}`}
                  onClick={() => navigate(`/parking/${lot.id}`)}
                  className="min-w-[240px] bg-black/25 rounded-card p-4 space-y-3 shrink-0 border border-white/10 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-full bg-sp-teal/15 flex items-center justify-center">
                      <ShieldCheck size={18} className="text-sp-teal" />
                    </div>
                    <span className="text-sp-teal text-xs font-semibold">
                      {lot.distance}
                    </span>
                  </div>
                  <div>
                    <p className="text-foreground font-bold">{lot.name}</p>
                    <p className="text-sp-text-secondary text-xs">{lot.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Favourite Lots */}
        {favouriteLots.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
                Favourites
              </h3>
              <Heart size={14} className="text-sp-teal" />
            </div>
            <div className="space-y-2">
              {favouriteLots.map((lot) => (
                <button
                  key={lot.id}
                  onClick={() => navigate(`/parking/${lot.id}`)}
                  className="w-full bg-black/25 rounded-card p-4 flex items-center gap-3 border border-white/10 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="w-10 h-10 rounded-full bg-sp-blue/15 flex items-center justify-center shrink-0">
                    <Zap size={18} className="text-sp-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-semibold text-sm truncate">{lot.name}</p>
                    <p className="text-sp-text-secondary text-xs truncate">{lot.address}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sp-teal text-sm font-bold">${lot.hourlyRate}/hr</p>
                    <p className="text-sp-text-secondary text-xs">{lot.availableSpots} spots</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Nearby Lots */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
            Nearby Lots
          </h3>
          <div className="space-y-2">
            {lots.map((lot) => (
              <button
                key={lot.id}
                onClick={() => navigate(`/parking/${lot.id}`)}
                className="w-full bg-black/25 rounded-card p-4 flex items-center gap-3 border border-white/10 text-left active:scale-[0.98] transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-sp-teal/15 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-sp-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-semibold text-sm truncate">{lot.name}</p>
                  <p className="text-sp-text-secondary text-xs truncate">{lot.address}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sp-teal text-sm font-bold">${lot.hourlyRate}/hr</p>
                  <p className="text-sp-text-secondary text-xs">{lot.availableSpots} spots</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* My Cars */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
            My Cars
          </h3>
          <div className="space-y-2">
            {cars.map((car, i) => (
              <div
                key={i}
                className="bg-black/25 rounded-card p-4 flex items-center gap-3 border border-white/10"
              >
                <div className="w-10 h-10 rounded-full bg-sp-blue/15 flex items-center justify-center shrink-0">
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
              </div>
            ))}
            <button
              onClick={() => navigate("/onboarding/add-car")}
              className="w-full bg-black/25 rounded-card p-4 flex items-center justify-center gap-2 border border-dashed border-white/10 text-sp-blue font-semibold text-sm active:scale-[0.98] transition-transform"
            >
              <Plus size={16} /> Add Car
            </button>
          </div>
        </section>
      </div>

      {/* FAB — Find Parking */}
      <button
        onClick={() => {
          const el = document.querySelector("input");
          el?.focus();
        }}
        className="fixed bottom-20 right-[calc(50%-195px+16px)] z-40 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-300 to-cyan-400 flex items-center justify-center shadow-[0_0_24px_rgba(34,211,238,0.35)] active:scale-95 transition-transform"
      >
        <Car size={22} className="text-slate-900" />
      </button>

      <BottomNav variant="user" />
    </div>
  );
};

export default UserHome;
