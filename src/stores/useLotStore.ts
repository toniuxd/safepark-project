import { create } from "zustand";

interface LotState {
  lots: never[];
  selectedLot: null;
}

export const useLotStore = create<LotState>()(() => ({
  lots: [],
  selectedLot: null,
}));
