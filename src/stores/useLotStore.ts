import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  hourlyRate: number;
  distance: string;
}

interface LotState {
  lots: ParkingLot[];
  favourites: string[];
  selectedLot: ParkingLot | null;
  setSelectedLot: (lot: ParkingLot | null) => void;
  toggleFavourite: (id: string) => void;
}

export const mockLots: ParkingLot[] = [
  {
    id: "lot-1",
    name: "Neon Plaza North",
    address: "458 Broadway Ave",
    totalSpots: 120,
    availableSpots: 24,
    hourlyRate: 4,
    distance: "0.4 miles",
  },
  {
    id: "lot-2",
    name: "Underground Central",
    address: "12 Lexington St",
    totalSpots: 200,
    availableSpots: 67,
    hourlyRate: 6,
    distance: "0.8 miles",
  },
  {
    id: "lot-3",
    name: "Metropolitan Plaza",
    address: "882 Broadway, New York, NY 10003",
    totalSpots: 80,
    availableSpots: 11,
    hourlyRate: 5,
    distance: "1.2 miles",
  },
];

export const useLotStore = create<LotState>()(
  persist(
    (set) => ({
      lots: mockLots,
      favourites: ["lot-1", "lot-3"],
      selectedLot: null,
      setSelectedLot: (lot) => set({ selectedLot: lot }),
      toggleFavourite: (id) =>
        set((s) => ({
          favourites: s.favourites.includes(id)
            ? s.favourites.filter((f) => f !== id)
            : [...s.favourites, id],
        })),
    }),
    { name: "sp-lots" }
  )
);
