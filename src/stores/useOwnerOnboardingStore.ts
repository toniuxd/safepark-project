import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LotType = "surface" | "garage" | "street";
export type PayoutSchedule = "daily" | "weekly" | "monthly";
export type PayoutMethod = "bank" | "stripe";

export interface DayHours {
  enabled: boolean;
  open: string;
  close: string;
}

export interface FlatRate {
  label: string;
  duration: string;
  enabled: boolean;
  price: number;
}

export interface OwnerLotDraft {
  lotName: string;
  address: string;
  totalSpaces: number;
  lotType: LotType | null;
  photos: string[]; // base64 or placeholder URLs
  hours: Record<string, DayHours>;
  hourlyRate: number;
  flatRates: FlatRate[];
  overstayEnabled: boolean;
  overstayFee: number;
  payoutMethod: PayoutMethod | null;
  routingNumber: string;
  accountNumber: string;
  payoutSchedule: PayoutSchedule;
  status: "draft" | "pending" | "approved" | "rejected";
}

interface OwnerOnboardingState {
  currentStep: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  lotDraft: OwnerLotDraft;
  setStep: (step: number) => void;
  setEmailVerified: (v: boolean) => void;
  setPhoneVerified: (v: boolean) => void;
  updateLotDraft: (partial: Partial<OwnerLotDraft>) => void;
  reset: () => void;
}

const defaultDayHours = (): Record<string, DayHours> => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const h: Record<string, DayHours> = {};
  days.forEach((d) => {
    h[d] = { enabled: d !== "Sun", open: "08:00", close: "22:00" };
  });
  return h;
};

const defaultFlatRates: FlatRate[] = [
  { label: "30 min", duration: "30m", enabled: true, price: 2 },
  { label: "1 hr", duration: "1h", enabled: true, price: 4 },
  { label: "2 hr", duration: "2h", enabled: true, price: 7 },
  { label: "All Day", duration: "day", enabled: true, price: 15 },
];

const defaultLotDraft: OwnerLotDraft = {
  lotName: "",
  address: "",
  totalSpaces: 20,
  lotType: null,
  photos: [],
  hours: defaultDayHours(),
  hourlyRate: 5,
  flatRates: defaultFlatRates,
  overstayEnabled: false,
  overstayFee: 25,
  payoutMethod: null,
  routingNumber: "",
  accountNumber: "",
  payoutSchedule: "weekly",
  status: "draft",
};

export const useOwnerOnboardingStore = create<OwnerOnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      emailVerified: false,
      phoneVerified: false,
      lotDraft: { ...defaultLotDraft },
      setStep: (currentStep) => set({ currentStep }),
      setEmailVerified: (emailVerified) => set({ emailVerified }),
      setPhoneVerified: (phoneVerified) => set({ phoneVerified }),
      updateLotDraft: (partial) =>
        set((s) => ({ lotDraft: { ...s.lotDraft, ...partial } })),
      reset: () =>
        set({
          currentStep: 1,
          emailVerified: false,
          phoneVerified: false,
          lotDraft: { ...defaultLotDraft },
        }),
    }),
    { name: "sp-owner-onboarding" }
  )
);
