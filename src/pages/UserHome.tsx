import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/safepark/PageWrapper";
import BottomNav from "@/components/safepark/BottomNav";
import InputField from "@/components/safepark/InputField";
import PillButton from "@/components/safepark/PillButton";
import { useSessionStore } from "@/stores/useSessionStore";
import { useLotStore, mockLots } from "@/stores/useLotStore";
import { useCarStore } from "@/stores/useCarStore";
import {
  Menu,
  User,
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
    <>
      <PageWrapper className="pb-24 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Menu className="text-sp-text-secondary" size={22} />
            <span className="font-bold text-lg text-sp-teal tracking-wide uppercase">
              SafePark
            </span>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full bg-sp-surface border border-border flex items-center justify-center"
          >
            <User size={18} className="text-sp-text-secondary" />
          </button>
        </header>

        {/* Ticket Alert */}
        {activeTicket && (
          <div className="bg-destructive/15 border border-destructive/30 rounded-card p-4 flex items-center gap-3 animate-fade-in">
            <AlertTriangle className="text-sp-warning shrink-0" size={22} />
            <div className="flex-1 min-w-0">
              <p className="text-foreground text-sm font-semibold">
                Unpaid Parking Ticket: Action Required
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
        <div className="space-y-3">
          <h2 className="text-title text-foreground leading-tight">
            Find parking
            <br />
            near you
          </h2>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sp-text-secondary"
                size={18}
              />
              <InputField
                placeholder="Where are you going?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-12 h-12 bg-sp-surface border border-border rounded-input flex items-center justify-center shrink-0"
            >
              <SlidersHorizontal size={18} className="text-sp-text-secondary" />
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

        {/* Favourite Lots — horizontal scroll */}
        {favouriteLots.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
                Favourites
              </h3>
              <Heart size={14} className="text-sp-teal" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
              {favouriteLots.map((lot) => (
                <div
                  key={lot.id}
                  className="min-w-[260px] bg-sp-surface rounded-card p-4 space-y-3 shrink-0 border border-border/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-card bg-background flex items-center justify-center">
                      <Zap size={18} className="text-sp-blue" />
                    </div>
                    <span className="text-sp-teal text-xs font-semibold">
                      {lot.distance}
                    </span>
                  </div>
                  <div>
                    <p className="text-foreground font-bold">{lot.name}</p>
                    <p className="text-sp-text-secondary text-xs">{lot.address}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sp-text-secondary text-xs">
                      {lot.availableSpots}/{lot.totalSpots} spots · ${lot.hourlyRate}/hr
                    </span>
                    <button
                      onClick={() => navigate(`/parking/${lot.id}`)}
                      className="text-xs font-bold text-sp-blue"
                    >
                      Park Here →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recently Used */}
        {recentLots.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
              Recently Used
            </h3>
            <div className="space-y-2">
              {recentLots.map((s) => (
                <div
                  key={s.id}
                  className="bg-sp-surface rounded-card p-4 flex items-center gap-3 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-card bg-background flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-sp-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-semibold text-sm truncate">
                      {s.lotName}
                    </p>
                    <p className="text-sp-text-secondary text-xs truncate">
                      {s.lotAddress}
                    </p>
                  </div>
                  <span className="text-sp-teal text-sm font-bold">${s.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Lots */}
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sp-text-secondary">
            Nearby Lots
          </h3>
          <div className="space-y-2">
            {lots.map((lot) => (
              <button
                key={lot.id}
                onClick={() => navigate(`/parking/${lot.id}`)}
                className="w-full bg-sp-surface rounded-card p-4 flex items-center gap-3 border border-border/50 text-left active:scale-[0.98] transition-transform"
              >
                <div className="w-10 h-10 rounded-card bg-background flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-sp-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-semibold text-sm truncate">
                    {lot.name}
                  </p>
                  <p className="text-sp-text-secondary text-xs truncate">
                    {lot.address}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sp-teal text-sm font-bold">${lot.hourlyRate}/hr</p>
                  <p className="text-sp-text-secondary text-xs">
                    {lot.availableSpots} spots
                  </p>
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
      </PageWrapper>
      <BottomNav variant="user" />
    </>
  );
};

export default UserHome;
