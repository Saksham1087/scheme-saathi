import { create } from "zustand"
import type { LoanParams } from "@/types/calculator"

export interface CalculatorState extends LoanParams {
  schemeId: string | null
  schemeName: string | null
  activePresetId: string | null
  patch: (fields: Partial<CalculatorState>) => void
  reset: () => void
}

export const defaultCalculatorParams: Omit<CalculatorState, "patch" | "reset"> = {
  principal: 500000,
  annualRatePct: 9,
  tenureMonths: 60,
  moratoriumMonths: 6,
  moratoriumInterestAccrues: false,
  schemeId: null,
  schemeName: null,
  activePresetId: null,
}

/**
 * Calculator inputs live in a store so the Results page can pre-fill them
 * from a matched scheme ("Calculate EMI for this scheme") and deep links can sync.
 */
export const useCalculatorStore = create<CalculatorState>()((set) => ({
  ...defaultCalculatorParams,
  patch: (fields) => set((state) => ({ ...state, ...fields })),
  reset: () => set(defaultCalculatorParams),
}))

