import { create } from "zustand";

interface CarState {
  cars: unknown[];
}

export const useCarStore = create<CarState>()(() => ({
  cars: [],
}));
