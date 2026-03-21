import { useNavigate } from "react-router-dom";
import { Menu, User } from "lucide-react";

const UserHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="h-16 px-5 -mx-5 flex items-center justify-between border-b border-white/5 bg-black/20">
      <div className="flex items-center gap-3">
        <Menu className="text-sp-text-secondary" size={22} />
        <span className="font-bold text-lg text-sp-teal tracking-[0.15em] uppercase">
          SafePark
        </span>
      </div>

      <button
        onClick={() => navigate("/profile")}
        className="w-11 h-11 rounded-full bg-sp-surface border-2 border-sp-teal/30 flex items-center justify-center overflow-hidden"
      >
        <User size={18} className="text-sp-text-secondary" />
      </button>
    </header>
  );
};

export default UserHeader;

