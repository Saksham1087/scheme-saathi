import { create } from "zustand"
import type { LoanParams } from "@/types/calculator"

interface CalculatorState extends LoanParams {
  schemeId: string | null
  patch: (fields: Partial<CalculatorState>) => void
}

const defaults = {
  principal: 500000,
  annualRatePct: 9,
  tenureMonths: 60,
  moratoriumMonths: 6,
  moratoriumInterestAccrues: false,
  schemeId: null as string | null,
}

/**
 * Calculator inputs live in a store so the Results page can pre-fill them
 * from a matched scheme ("Calculate EMI for this scheme").
 */
export const useCalculatorStore = create<CalculatorState>()((set) => ({
  ...defaults,
  patch: (fields) => set(fields),
}))
