import { create } from "zustand";

interface LotState {
  lots: unknown[];
  selectedLot: unknown | null;
}

export const useLotStore = create<LotState>()(() => ({
  lots: [],
  selectedLot: null,
}));
