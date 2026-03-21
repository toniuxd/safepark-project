import { create } from "zustand";

interface CarState {
  cars: never[];
}

export const useCarStore = create<CarState>()(() => ({
  cars: [],
}));
