import type { SchemeEligibilityRules } from "@/types/scheme"
import type { AssessmentInput } from "@/types/assessment"
import { SCORE_WEIGHTS } from "./config"

type SchemeLike = {
  eligibilityRules: SchemeEligibilityRules
  financialAssistance: {
    minAmount: number
    maxAmount: number
    interestRate?: { min: number; max: number }
  }
}

export interface ScoreBreakdown {
  field: string
  score: number
  weight: number
}

export function calculateSuitabilityScore(
  scheme: SchemeLike,
  input: AssessmentInput,
): { total: number; breakdown: ScoreBreakdown[] } {
  const breakdown: ScoreBreakdown[] = []

  breakdown.push({
    field: "income",
    score: scoreIncome(scheme, input),
    weight: SCORE_WEIGHTS.income,
  })
  breakdown.push({
    field: "category",
    score: scoreCategory(scheme, input),
    weight: SCORE_WEIGHTS.category,
  })
  breakdown.push({
    field: "purpose",
    score: scorePurpose(scheme, input),
    weight: SCORE_WEIGHTS.purpose,
  })
  breakdown.push({
    field: "loan",
    score: scoreLoan(scheme, input),
    weight: SCORE_WEIGHTS.loan,
  })
  breakdown.push({
    field: "age",
    score: scoreAge(scheme, input),
    weight: SCORE_WEIGHTS.age,
  })
  breakdown.push({
    field: "location",
    score: scoreLocation(scheme, input),
    weight: SCORE_WEIGHTS.location,
  })
  breakdown.push({
    field: "gender",
    score: scoreGender(scheme, input),
    weight: SCORE_WEIGHTS.gender,
  })
  breakdown.push({
    field: "disability",
    score: scoreDisability(scheme, input),
    weight: SCORE_WEIGHTS.disability,
  })

  const total = breakdown.reduce((sum, b) => sum + b.score * b.weight, 0)

  return { total: Math.round(total * 100), breakdown }
}

function mapCategory(cat: string | undefined): string {
  if (!cat) return "SC"
  const map: Record<string, string> = {
    sc: "SC",
    st: "ST",
    obc: "OBC",
    general: "General",
    other: "General",
  }
  return map[cat.toLowerCase()] || cat.toUpperCase()
}

function mapPurpose(purpose: string | undefined): string {
  if (!purpose) return ""
  const map: Record<string, string> = {
    agri: "agriculture",
    shop: "trading",
    higher_education: "education",
    manufacturing: "manufacturing",
    service: "service",
    other: "other",
  }
  return map[purpose.toLowerCase()] || purpose
}

function scoreIncome(scheme: SchemeLike, input: AssessmentInput): number {
  const maxIncome = scheme.eligibilityRules.maxIncome
  const minIncome = scheme.eligibilityRules.minIncome
  
  // Empty income field - penalty
  if (maxIncome === undefined && minIncome === undefined) {
    return 0.5
  }
  
  // Has income data - use existing logic
  if (maxIncome !== undefined) {
    if (input.annualFamilyIncome <= maxIncome * 0.5) return 1.0
    if (input.annualFamilyIncome <= maxIncome) return 0.8
    if (input.annualFamilyIncome <= maxIncome * 1.2) return 0.3
    return 0.0
  }
  
  // Only minIncome specified
  if (minIncome !== undefined) {
    if (input.annualFamilyIncome >= minIncome) return 1.0
    return 0.3
  }
  
  return 0.5
}

function scoreCategory(scheme: SchemeLike, input: AssessmentInput): number {
  const cats = scheme.eligibilityRules.categories
  
  // Empty categories - penalty
  if (!cats?.length) {
    return 0.2
  }
  
  const userCat = mapCategory(input.category)
  return cats.includes(userCat) ? 1.0 : 0.3
}

function scorePurpose(scheme: SchemeLike, input: AssessmentInput): number {
  const purposes = scheme.eligibilityRules.purposes
  
  // Empty purposes - penalty
  if (!purposes?.length) {
    return 0.2
  }
  
  const purpose = mapPurpose(input.purpose)
  return purposes.includes(purpose) ? 1.0 : 0.2
}

function scoreLoan(scheme: SchemeLike, input: AssessmentInput): number {
  const fa = scheme.financialAssistance
  const needed = input.requiredAssistance || input.projectCost || 0
  if (!needed) return 0.5
  if (needed >= fa.minAmount && needed <= fa.maxAmount) return 1.0
  if (needed < fa.minAmount) return 0.6
  if (needed <= fa.maxAmount * 1.2) return 0.4
  return 0.1
}

function scoreAge(scheme: SchemeLike, input: AssessmentInput): number {
  const { minAge, maxAge } = scheme.eligibilityRules
  
  // Empty age field - penalty
  if (!minAge && !maxAge) {
    return 0.5
  }
  
  const min = minAge ?? 0
  const max = maxAge ?? 120
  if (input.age >= min && input.age <= max) return 1.0
  if (input.age >= min - 5 && input.age <= max + 5) return 0.5
  return 0.0
}

function scoreLocation(scheme: SchemeLike, input: AssessmentInput): number {
  const states = scheme.eligibilityRules.states
  
  // Empty states - penalty (scheme should be ineligible but scoring still runs)
  if (!states?.length) {
    return 0.1
  }
  
  // ALL India scheme
  if (states.includes("ALL")) {
    return 1.0
  }
  
  // Specific state match
  return states.includes(input.state) ? 1.0 : 0.0
}

function scoreGender(scheme: SchemeLike, input: AssessmentInput): number {
  const requiredGender = scheme.eligibilityRules.gender
  
  // Empty gender - penalty
  if (!requiredGender) {
    return 0.3
  }
  
  if (!input.gender) return 0.5 // unknown, partial credit
  return input.gender === requiredGender ? 1.0 : 0.0
}

function scoreDisability(scheme: SchemeLike, input: AssessmentInput): number {
  const required = scheme.eligibilityRules.disabilityRequired
  
  // Empty disability - penalty
  if (required === undefined) {
    return 0.3
  }
  
  if (input.disability === undefined) return 0.5 // unknown, partial credit
  return input.disability === required ? 1.0 : 0.0
}