import { create } from "zustand";
import { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  userType: "user" | "owner" | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setUserType: (type: "user" | "owner" | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  userType: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setUserType: (userType) => set({ userType }),
  logout: () => set({ user: null, userType: null, isAuthenticated: false }),
}));
