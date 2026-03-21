import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CarEntry {
  plateNumber: string;
  make: string;
  model: string;
  year: string;
  color: string;
}

interface CarState {
  cars: CarEntry[];
  addCar: (car: CarEntry) => void;
  setCars: (cars: CarEntry[]) => void;
}

export const useCarStore = create<CarState>()(
  persist(
    (set) => ({
      cars: [],
      addCar: (car) => set((s) => ({ cars: [...s.cars, car] })),
      setCars: (cars) => set({ cars }),
    }),
    { name: "sp-cars" }
  )
);
