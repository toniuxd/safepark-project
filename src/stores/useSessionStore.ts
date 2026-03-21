import { create } from "zustand";

interface SessionState {
  activeSessions: unknown[];
  parkingHistory: unknown[];
}

export const useSessionStore = create<SessionState>()(() => ({
  activeSessions: [],
  parkingHistory: [],
}));
