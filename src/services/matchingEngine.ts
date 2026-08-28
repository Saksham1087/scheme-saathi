import type { MatchInput, MatchReason, MatchResponse, Scheme, SchemeMatch, SchemeType, ScoreBreakdown } from "@/types"
import { getSeedSchemes, fetchSchemes } from "./schemeService"

export const INCOME_CEILING = 500_000
export const MAX_COVERAGE_PCT = 90

export const TIER_MAX_COST: Record<SchemeType, number> = {
  micro: 140_000,
  term: 5_000_000,
  education: 5_000_000,
}

const fmt = (n: number): string => new Intl.NumberFormat("en-IN").format(n)

export function calculateScoreBreakdownLocally(
  input: MatchInput,
  scheme: Scheme,
): {
  breakdown: ScoreBreakdown
  totalScore: number
  isEligible: boolean
  reasons: MatchReason[]
  blockers: MatchReason[]
} {
  const reasons: MatchReason[] = []
  const blockers: MatchReason[] = []

  // 1. Income Ceiling Fit: 20 pts
  const incomeCeiling = scheme.incomeCeiling || INCOME_CEILING
  const incomeOk = input.annualFamilyIncome <= incomeCeiling
  let incomeScore = 0
  if (incomeOk) {
    incomeScore = 20
    reasons.push({
      key: "income_ok",
      params: { income: fmt(input.annualFamilyIncome) },
    })
  } else {
    incomeScore = 0
    blockers.push({
      key: "income_exceeds",
      params: { income: fmt(input.annualFamilyIncome), ceiling: fmt(incomeCeiling) },
    })
  }

  // 2. Category / Caste Fit: 20 pts
  const isSC = input.category === "sc"
  let categoryScore = 0
  if (isSC) {
    categoryScore = 20
    reasons.push({
      key: "category_note",
    })
  } else {
    categoryScore = 0
    blockers.push({
      key: "category_mismatch",
    })
  }

  // 3. Purpose / Sector Fit: 20 pts
  let purposeScore = 0
  let purposeOk = true

  if (scheme.type === "education" || scheme.id === "education-loan" || scheme.category === "education") {
    const isStudent =
      input.educationStatus === "student" ||
      input.projectType === "higher_education"
    if (isStudent) {
      purposeScore = 20
      reasons.push({
        key: "student_eligible",
      })
    } else {
      purposeScore = 0
      purposeOk = false
      blockers.push({
        key: "not_student",
      })
    }
  } else if (scheme.id === "mahila-samriddhi" || scheme.category === "women") {
    const isFemale = input.gender === "female"
    if (isFemale) {
      if (input.projectType === "higher_education") {
        purposeScore = 10
      } else {
        purposeScore = 20
      }
      reasons.push({
        key: "category_note",
      })
    } else {
      purposeScore = 0
      purposeOk = false
      blockers.push({
        key: "female_only",
      })
    }
  } else if (scheme.id === "swachhta-udyami" || scheme.category === "sanitation") {
    if (input.projectType === "sanitation") {
      purposeScore = 20
    } else if (input.projectType === "service" || input.projectType === "other") {
      purposeScore = 10
    } else if (input.projectType === "higher_education") {
      purposeScore = 0
      purposeOk = false
      blockers.push({ key: "not_student" })
    } else {
      purposeScore = 5
    }
  } else if (scheme.id === "green-business" || scheme.category === "agriculture") {
    if (["agri", "service", "manufacturing"].includes(input.projectType)) {
      purposeScore = 20
    } else if (["shop", "artisan", "other"].includes(input.projectType)) {
      purposeScore = 10
    } else if (input.projectType === "higher_education") {
      purposeScore = 0
      purposeOk = false
      blockers.push({ key: "not_student" })
    } else {
      purposeScore = 5
    }
  } else if (scheme.id === "pm-daksh-loan" || scheme.category === "skills") {
    if (["artisan", "service", "shop", "manufacturing"].includes(input.projectType)) {
      purposeScore = 20
    } else if (input.projectType === "other") {
      purposeScore = 15
    } else if (input.projectType === "higher_education") {
      purposeScore = 0
      purposeOk = false
      blockers.push({ key: "not_student" })
    } else {
      purposeScore = 5
    }
  } else if (scheme.id === "micro-finance" || scheme.type === "micro") {
    if (["shop", "service", "artisan", "agri", "sanitation", "other"].includes(input.projectType)) {
      purposeScore = 20
    } else if (input.projectType === "manufacturing") {
      purposeScore = 15
    } else {
      purposeScore = 0
      purposeOk = false
    }
  } else {
    // Term Loan or general commercial
    if (["manufacturing", "service", "agri", "shop", "sanitation", "artisan", "other"].includes(input.projectType)) {
      purposeScore = 20
    } else {
      purposeScore = 0
      purposeOk = false
    }
  }

  // 4. Loan Amount / Project Cost Band: 20 pts
  const costFits = input.estimatedCost <= scheme.maxProjectCost
  let costScore = 0
  if (costFits) {
    costScore = 20
    reasons.push({
      key: "within_cost",
      params: { limit: fmt(scheme.maxProjectCost) },
    })
  } else {
    costScore = 0
    blockers.push({
      key: "cost_above_tier",
      params: { cost: fmt(input.estimatedCost), limit: fmt(scheme.maxProjectCost) },
    })
  }

  // 5. Age Bounds: 10 pts
  const applicantAge = typeof input.age === "number" && !isNaN(input.age) ? input.age : 28
  const minAge = scheme.eligibilityCriteria?.ageRange?.min ?? 18
  const maxAge = scheme.eligibilityCriteria?.ageRange?.max ?? (scheme.id === "pm-daksh-loan" ? 45 : 60)
  const ageOk = applicantAge >= minAge && applicantAge <= maxAge
  let ageScore = 0
  if (ageOk) {
    ageScore = 10
  } else {
    ageScore = 0
    blockers.push({
      key: "age_out_of_bounds",
      params: { min: minAge, max: maxAge, age: applicantAge },
    })
  }

  // 6. State / Location Match: 10 pts
  const states = scheme.applicableStates || ["All India"]
  const stateOk =
    !input.state ||
    states.includes("All India") ||
    states.includes(input.state)
  let stateScore = 0
  if (stateOk) {
    stateScore = 10
  } else {
    stateScore = 0
    blockers.push({
      key: "state_not_applicable",
      params: { state: input.state },
    })
  }

  // Coverage reason
  const coveragePct = Math.min(MAX_COVERAGE_PCT, scheme.coverageMaxPct || 90)
  reasons.push({
    key: "coverage_capped",
    params: { pct: coveragePct },
  })

  const breakdown: ScoreBreakdown = {
    income: incomeScore,
    category: categoryScore,
    purpose: purposeScore,
    cost: costScore,
    age: ageScore,
    state: stateScore,
  }

  const totalScore = incomeScore + categoryScore + purposeScore + costScore + ageScore + stateScore
  const isEligible = incomeOk && isSC && purposeOk && costFits && ageOk && stateOk

  return {
    breakdown,
    totalScore,
    isEligible,
    reasons,
    blockers,
  }
}

/**
 * Pure deterministic rule engine mirroring backend logic.
 * Evaluates every available scheme against the applicant profile in < 50ms.
 */
export function evaluateMatchesLocally(
  input: MatchInput,
  schemes: Scheme[],
): SchemeMatch[] {
  interface EvaluatedItem extends SchemeMatch {
    maxProjectCost: number
  }

  const results: EvaluatedItem[] = schemes.map((scheme): EvaluatedItem => {
    const { breakdown, totalScore, isEligible, reasons, blockers } = calculateScoreBreakdownLocally(input, scheme)

    const coveragePct = Math.min(MAX_COVERAGE_PCT, scheme.coverageMaxPct || 90)
    const suggestedAmount = Math.round(
      (Math.min(input.estimatedCost, scheme.maxProjectCost) * coveragePct) / 100,
    )

    return {
      schemeId: scheme.id,
      schemeType: scheme.type,
      eligible: isEligible,
      rank: 0,
      score: totalScore,
      breakdown,
      coveragePct,
      suggestedAmount,
      reasons: isEligible ? reasons : [...blockers],
      schemeName: scheme.name,
      rateRange: scheme.rateRange,
      moratorium: scheme.moratorium,
      tenureRangeMonths: scheme.tenureRangeMonths,
      maxProjectCost: scheme.maxProjectCost,
    }
  })

  results.sort((a, b) => {
    if (a.eligible !== b.eligible) {
      return Number(b.eligible) - Number(a.eligible)
    }
    if (b.score !== a.score) {
      return b.score - a.score
    }
    const diffA = Math.abs(a.maxProjectCost - input.estimatedCost)
    const diffB = Math.abs(b.maxProjectCost - input.estimatedCost)
    return diffA - diffB
  })

  results.forEach((r, i) => {
    r.rank = i + 1
  })

  return results.map(({ maxProjectCost: _maxProjectCost, ...rest }) => rest)
}

/**
 * Execute matching with instant fallback to local client-side evaluation.
 */
export async function matchApplicantProfile(input: MatchInput): Promise<MatchResponse> {
  try {
    const schemes = await fetchSchemes()
    const validSchemes = schemes.length > 0 ? schemes : getSeedSchemes()
    const matches = evaluateMatchesLocally(input, validSchemes)
    return {
      matches,
      generatedAt: Date.now(),
    }
  } catch (err) {
    console.warn("Local scheme evaluation fallback error:", err)
    const seed = getSeedSchemes()
    const matches = evaluateMatchesLocally(input, seed)
    return {
      matches,
      generatedAt: Date.now(),
    }
  }
}
