import { create } from "zustand";

interface SessionState {
  activeSessions: never[];
  parkingHistory: never[];
}

export const useSessionStore = create<SessionState>()(() => ({
  activeSessions: [],
  parkingHistory: [],
}));
