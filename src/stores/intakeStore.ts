import { create } from "zustand"
import type { ApplicantCategory, EducationStatus, Gender, MatchInput, MatchResponse } from "@/types"

export interface IntakeState extends MatchInput {
  /** ISO timestamp captured when the user consented to demographic processing */
  consentAt: string | null
  projectDetails: string
  step: number
  maxVisitedStep: number
  match: MatchResponse | null

  setField: <K extends keyof IntakeState>(field: K, value: IntakeState[K]) => void
  setStep: (step: number) => void
  nextStep: () => boolean
  prevStep: () => void
  jumpToStep: (step: number) => void
  recordConsent: () => void
  setMatch: (match: MatchResponse | null) => void
  reset: () => void
  isStepValid: (stepIndex?: number) => boolean
  getStepError: (stepIndex?: number) => string | null
}

const defaults = {
  state: "",
  category: "sc" as ApplicantCategory,
  gender: "male" as Gender,
  age: 28,
  educationStatus: "twelfth" as EducationStatus,
  annualFamilyIncome: 250000,
  consentAt: null as string | null,
  projectType: "",
  projectDetails: "",
  estimatedCost: 300000,
  step: 0,
  maxVisitedStep: 0,
  match: null as MatchResponse | null,
}

export function validateIntakeStep(
  stepIndex: number,
  state: Partial<IntakeState>,
): { valid: boolean; errorKey: string | null } {
  switch (stepIndex) {
    case 0: // State / Location
      if (!state.state || state.state.trim() === "") {
        return { valid: false, errorKey: "intake.errors.stateRequired" }
      }
      return { valid: true, errorKey: null }

    case 1: // Category
      if (!state.category) {
        return { valid: false, errorKey: "intake.errors.categoryRequired" }
      }
      return { valid: true, errorKey: null }

    case 2: // Age & Gender
      if (
        state.age === undefined ||
        isNaN(Number(state.age)) ||
        Number(state.age) < 18 ||
        Number(state.age) > 100
      ) {
        return { valid: false, errorKey: "intake.errors.ageInvalid" }
      }
      if (!state.gender) {
        return { valid: false, errorKey: "intake.errors.genderRequired" }
      }
      return { valid: true, errorKey: null }

    case 3: // Education Level
      if (!state.educationStatus) {
        return { valid: false, errorKey: "intake.errors.educationRequired" }
      }
      return { valid: true, errorKey: null }

    case 4: // Annual Family Income & Consent
      if (
        state.annualFamilyIncome === undefined ||
        isNaN(Number(state.annualFamilyIncome)) ||
        Number(state.annualFamilyIncome) < 0
      ) {
        return { valid: false, errorKey: "intake.errors.incomeInvalid" }
      }
      if (!state.consentAt) {
        return { valid: false, errorKey: "intake.errors.consentRequired" }
      }
      return { valid: true, errorKey: null }

    case 5: // Purpose / Project Type
      if (!state.projectType || state.projectType.trim() === "") {
        return { valid: false, errorKey: "intake.errors.purposeRequired" }
      }
      return { valid: true, errorKey: null }

    case 6: // Project Cost
      if (
        state.estimatedCost === undefined ||
        isNaN(Number(state.estimatedCost)) ||
        Number(state.estimatedCost) < 10000
      ) {
        return { valid: false, errorKey: "intake.errors.costInvalid" }
      }
      return { valid: true, errorKey: null }

    default:
      return { valid: true, errorKey: null }
  }
}

export const useIntakeStore = create<IntakeState>()((set, get) => ({
  ...defaults,

  setField: (field, value) => {
    set((s) => ({
      ...s,
      [field]: value,
    }))
  },

  setStep: (step) => {
    const clamped = Math.max(0, Math.min(6, step))
    set((s) => ({
      step: clamped,
      maxVisitedStep: Math.max(s.maxVisitedStep, clamped),
    }))
  },

  nextStep: () => {
    const { step, isStepValid } = get()
    if (!isStepValid(step)) return false
    const next = Math.min(6, step + 1)
    set((s) => ({
      step: next,
      maxVisitedStep: Math.max(s.maxVisitedStep, next),
    }))
    return true
  },

  prevStep: () => {
    const { step } = get()
    set({ step: Math.max(0, step - 1) })
  },

  jumpToStep: (targetStep) => {
    const clamped = Math.max(0, Math.min(6, targetStep))
    set((s) => ({
      step: clamped,
      maxVisitedStep: Math.max(s.maxVisitedStep, clamped),
    }))
  },

  recordConsent: () => {
    set({ consentAt: new Date().toISOString() })
  },

  setMatch: (match) => set({ match }),

  reset: () => set({ ...defaults }),

  isStepValid: (stepIndex) => {
    const current = get()
    const target = stepIndex !== undefined ? stepIndex : current.step
    return validateIntakeStep(target, current).valid
  },

  getStepError: (stepIndex) => {
    const current = get()
    const target = stepIndex !== undefined ? stepIndex : current.step
    return validateIntakeStep(target, current).errorKey
  },
}))
