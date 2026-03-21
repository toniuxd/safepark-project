import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActiveTicket {
  id: string;
  plate: string;
  reason: string;
  amount: number;
}

export interface ParkingSession {
  id: string;
  lotId: string;
  lotName: string;
  lotAddress: string;
  carPlate: string;
  carLabel: string;
  duration: string;
  subtotal: number;
  tax: number;
  total: number;
  timestamp: number;
}

export interface PaymentMethod {
  id: string;
  label: string;
  last4: string;
  type: "visa" | "mastercard" | "amex";
}

interface SessionState {
  activeSessions: ParkingSession[];
  parkingHistory: ParkingSession[];
  activeTicket: ActiveTicket | null;
  paymentMethods: PaymentMethod[];
  addSession: (session: ParkingSession) => void;
  setActiveTicket: (ticket: ActiveTicket | null) => void;
  addPaymentMethod: (pm: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      activeSessions: [],
      parkingHistory: [],
      activeTicket: null,
      paymentMethods: [
        { id: "pm-1", label: "Visa", last4: "4242", type: "visa" },
        { id: "pm-2", label: "Mastercard", last4: "8888", type: "mastercard" },
      ],
      addSession: (session) =>
        set((s) => ({
          activeSessions: [...s.activeSessions, session],
          parkingHistory: [session, ...s.parkingHistory],
        })),
      setActiveTicket: (activeTicket) => set({ activeTicket }),
      addPaymentMethod: (pm) =>
        set((s) => ({ paymentMethods: [...s.paymentMethods, pm] })),
      removePaymentMethod: (id) =>
        set((s) => ({
          paymentMethods: s.paymentMethods.filter((p) => p.id !== id),
        })),
    }),
    { name: "sp-sessions" }
  )
);
