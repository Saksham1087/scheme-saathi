import { Timestamp } from "firebase/firestore"
import type { Language } from "./user"

/** Legacy alias — used by intake store */
export type MatchInput = {
  projectType: string
  estimatedCost: number
  annualFamilyIncome: number
  educationStatus: string
  category: "sc" | "other"
  state: string
}

export type AssessmentInput = {
  state: string
  district?: string
  age: number
  gender?: string
  category?: "sc" | "other"
  annualFamilyIncome: number
  occupation: string
  education: string
  purpose: string
  projectCost?: number
  requiredAssistance?: number
  ownContribution?: number
  disability?: boolean
  existingBusiness?: boolean
  language?: Language
}

export interface MatchReason {
  key:
    | "within_cost"
    | "income_ok"
    | "coverage_capped"
    | "student_eligible"
    | "cost_above_tier"
    | "income_exceeds"
    | "not_student"
    | "category_note"
    | "age_match"
    | "location_match"
    | "purpose_match"
  params?: Record<string, string | number>
}

export type SchemeType = "micro" | "term" | "education"

export interface SchemeMatch {
  schemeId: string
  schemeType: SchemeType
  eligible: boolean
  rank: number
  matchScore: number
  coveragePct: number
  suggestedAmount: number
  reasons: MatchReason[]
  schemeName: { en: string; hi: string }
  rateRange: { min: number; max: number }
  moratorium: { minMonths: number; maxMonths: number; interestAccrues: boolean }
  tenureRangeMonths: { min: number; max: number }
  applyUrl?: string
}

export interface MatchResponse {
  matches: SchemeMatch[]
  generatedAt: number
}

export interface Recommendation {
  id: string
  userId: string
  assessmentId: string
  matches: SchemeMatch[]
  createdAt: Timestamp
}

export interface FieldResult {
  field: string
  passed: boolean
  reason: string
}

export interface EligibilityResult {
  schemeId: string
  eligible: boolean
  fieldResults: FieldResult[]
  passedFields: string[]
  failedFields: string[]
  /** Percentage of scheme rules we could check (0-100) */
  confidence: number
  /** Number of rule fields the scheme defines */
  totalRuleFields: number
  /** Number of those fields the user provided data for */
  matchedRuleFields: number
}

export interface Explanation {
  type: "acceptance" | "rejection"
  field: string
  reasonKey: string
  text: string
}
