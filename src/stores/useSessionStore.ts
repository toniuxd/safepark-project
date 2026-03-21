import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SessionStatus = "active" | "completed" | "ticketed";

export interface ActiveTicket {
  id: string;
  plate: string;
  reason: string;
  amount: number;
  lotName: string;
  date: string;
  dueDate: string;
  paid: boolean;
  confirmationNumber?: string;
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
  endTime: number;
  status: SessionStatus;
}

export interface PaymentMethod {
  id: string;
  label: string;
  last4: string;
  type: "visa" | "mastercard" | "amex";
  isDefault: boolean;
}

interface SessionState {
  activeSessions: ParkingSession[];
  parkingHistory: ParkingSession[];
  activeTicket: ActiveTicket | null;
  paymentMethods: PaymentMethod[];
  addSession: (session: ParkingSession) => void;
  setActiveTicket: (ticket: ActiveTicket | null) => void;
  payTicket: (confirmationNumber: string) => void;
  addPaymentMethod: (pm: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPayment: (id: string) => void;
}

// Mock history data
const now = Date.now();
const mockHistory: ParkingSession[] = [
  {
    id: "sess-h1",
    lotId: "lot-1",
    lotName: "Downtown Central Garage",
    lotAddress: "123 Main St",
    carPlate: "ABC-1234",
    carLabel: "Toyota Camry",
    duration: "2 hr",
    subtotal: 7,
    tax: 0.91,
    total: 7.91,
    timestamp: now - 86400000 * 2,
    endTime: now - 86400000 * 2 + 7200000,
    status: "completed",
  },
  {
    id: "sess-h2",
    lotId: "lot-2",
    lotName: "Midtown Parking Plaza",
    lotAddress: "456 Oak Ave",
    carPlate: "XYZ-5678",
    carLabel: "Honda Civic",
    duration: "1 hr",
    subtotal: 4,
    tax: 0.52,
    total: 4.52,
    timestamp: now - 86400000,
    endTime: now - 86400000 + 3600000,
    status: "completed",
  },
  {
    id: "sess-h3",
    lotId: "lot-1",
    lotName: "Downtown Central Garage",
    lotAddress: "123 Main St",
    carPlate: "ABC-1234",
    carLabel: "Toyota Camry",
    duration: "All Day",
    subtotal: 15,
    tax: 1.95,
    total: 16.95,
    timestamp: now - 3600000,
    endTime: now + 14400000,
    status: "active",
  },
  {
    id: "sess-h4",
    lotId: "lot-3",
    lotName: "Airport Long-Term Lot",
    lotAddress: "789 Terminal Rd",
    carPlate: "ABC-1234",
    carLabel: "Toyota Camry",
    duration: "1 hr",
    subtotal: 4,
    tax: 0.52,
    total: 4.52,
    timestamp: now - 86400000 * 5,
    endTime: now - 86400000 * 5 + 3600000,
    status: "ticketed",
  },
];

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      activeSessions: mockHistory.filter((s) => s.status === "active"),
      parkingHistory: mockHistory,
      activeTicket: {
        id: "tkt-001",
        plate: "ABC-1234",
        reason: "Expired meter — overtime by 23 min",
        amount: 45,
        lotName: "Airport Long-Term Lot",
        date: new Date(now - 86400000 * 5).toLocaleDateString(),
        dueDate: new Date(now + 86400000 * 10).toLocaleDateString(),
        paid: false,
      },
      paymentMethods: [
        { id: "pm-1", label: "Visa", last4: "4242", type: "visa", isDefault: true },
        { id: "pm-2", label: "Mastercard", last4: "8888", type: "mastercard", isDefault: false },
      ],
      addSession: (session) =>
        set((s) => ({
          activeSessions: [...s.activeSessions, session],
          parkingHistory: [session, ...s.parkingHistory],
        })),
      setActiveTicket: (activeTicket) => set({ activeTicket }),
      payTicket: (confirmationNumber) =>
        set((s) => ({
          activeTicket: s.activeTicket
            ? { ...s.activeTicket, paid: true, confirmationNumber }
            : null,
        })),
      addPaymentMethod: (pm) =>
        set((s) => ({ paymentMethods: [...s.paymentMethods, pm] })),
      removePaymentMethod: (id) =>
        set((s) => ({
          paymentMethods: s.paymentMethods.filter((p) => p.id !== id),
        })),
      setDefaultPayment: (id) =>
        set((s) => ({
          paymentMethods: s.paymentMethods.map((p) => ({
            ...p,
            isDefault: p.id === id,
          })),
        })),
    }),
    { name: "sp-sessions" }
  )
);
