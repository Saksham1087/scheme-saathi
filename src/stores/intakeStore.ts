import { create } from "zustand"
import type { MatchInput, MatchResponse } from "@/types"

interface IntakeState extends MatchInput {
  /** ISO timestamp captured when the user consented to demographic processing */
  consentAt: string | null
  projectDetails: string
  step: number
  match: MatchResponse | null
  setField: <K extends keyof IntakeState>(field: K, value: IntakeState[K]) => void
  setStep: (step: number) => void
  setMatch: (match: MatchResponse) => void
  reset: () => void
}

const defaults = {
  projectType: "",
  estimatedCost: 300000,
  annualFamilyIncome: 250000,
  educationStatus: "other" as const,
  category: "sc" as const,
  state: "",
  consentAt: null,
  projectDetails: "",
  step: 0,
  match: null,
}

export const useIntakeStore = create<IntakeState>()((set) => ({
  ...defaults,
  setField: (field, value) => set({ [field]: value }),
  setStep: (step) => set({ step }),
  setMatch: (match) => set({ match }),
  reset: () => set({ ...defaults }),
}))
