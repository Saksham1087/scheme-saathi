import { Timestamp } from "firebase/firestore"

export type Language = "en" | "hi" | "mr"
export type Occupation = "student" | "farmer" | "worker" | "self-employed" | "unemployed" | "other"
export type EducationLevel = "below-10th" | "10th-12th" | "graduate" | "postgraduate" | "other"

export interface UserProfile {
  uid: string
  email?: string
  displayName?: string
  photoURL?: string
  phone?: string
  language: Language
  category?: "sc" | "other"
  state?: string
  district?: string
  income?: number
  education?: EducationLevel
  occupation?: Occupation
  isCompleted: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface SavedScheme {
  id: string
  userId: string
  schemeId: string
  savedAt: Timestamp
}

export interface SavedPartner {
  id: string
  userId: string
  partnerId: string
  savedAt: Timestamp
}

export interface Assessment {
  id: string
  userId: string
  responses: Record<string, unknown>
  recommendedSchemes: string[]
  matchScores: Record<string, number>
  createdAt: Timestamp
}

export interface CalculatorHistory {
  id: string
  userId: string
  schemeId?: string
  loanParams: {
    principal: number
    annualRatePct: number
    tenureMonths: number
    moratoriumMonths: number
  }
  result: {
    emi: number
    totalInterest: number
    totalRepayment: number
  }
  createdAt: Timestamp
}

export interface ApplicationJourney {
  id: string
  userId: string
  schemeId: string
  partnerId?: string
  status:
    | "scheme-identified"
    | "eligibility-checked"
    | "documents-prepared"
    | "partner-identified"
    | "application-started"
    | "application-submitted"
    | "under-review"
    | "decision"
  checklist: Array<{
    document: string
    ready: boolean
    source?: "manual" | "digilocker"
  }>
  createdAt: Timestamp
  updatedAt: Timestamp
}
