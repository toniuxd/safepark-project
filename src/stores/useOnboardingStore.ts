import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  currentStep: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  carsAdded: boolean;
  paymentAdded: boolean;
  setStep: (step: number) => void;
  setEmailVerified: (v: boolean) => void;
  setPhoneVerified: (v: boolean) => void;
  setCarsAdded: (v: boolean) => void;
  setPaymentAdded: (v: boolean) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      emailVerified: false,
      phoneVerified: false,
      carsAdded: false,
      paymentAdded: false,
      setStep: (currentStep) => set({ currentStep }),
      setEmailVerified: (emailVerified) => set({ emailVerified }),
      setPhoneVerified: (phoneVerified) => set({ phoneVerified }),
      setCarsAdded: (carsAdded) => set({ carsAdded }),
      setPaymentAdded: (paymentAdded) => set({ paymentAdded }),
      reset: () =>
        set({
          currentStep: 1,
          emailVerified: false,
          phoneVerified: false,
          carsAdded: false,
          paymentAdded: false,
        }),
    }),
    { name: "sp-onboarding" }
  )
);
