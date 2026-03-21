import { create } from "zustand";

interface AuthState {
  user: null;
  userType: "user" | "owner" | null;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(() => ({
  user: null,
  userType: null,
  isAuthenticated: false,
}));
