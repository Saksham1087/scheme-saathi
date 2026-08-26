import type { SchemeEligibilityRules } from "@/types/scheme"
import type {
  AssessmentInput,
  EligibilityResult,
  Explanation,
} from "@/types/assessment"
import type { ScoreBreakdown } from "./scoring"
import { checkEligibility } from "./eligibility"
import { calculateSuitabilityScore } from "./scoring"
import { generateExplanation } from "./explanation"
import { MAX_RECOMMENDATIONS } from "./config"

type SchemeLike = {
  slug: string
  name: { en: string; hi: string; mr?: string }
  ministry: string
  category: string[]
  description: { en: string; hi: string; mr?: string }
  shortDescription: { en: string; hi: string; mr?: string }
  purpose: string
  targetBeneficiaries: string[]
  financialAssistance: {
    type: string
    minAmount: number
    maxAmount: number
    interestRate?: { min: number; max: number }
    moratoriumMonths?: { min: number; max: number }
    repaymentMonths?: { min: number; max: number }
  }
  eligibilityRules: SchemeEligibilityRules
  requiredDocuments?: Array<{ name: string; description: string; mandatory: boolean; format?: string }>
  channelPartnerTypes: string[]
  officialUrl?: string
  source: string
  lastUpdated: string
  verified: boolean
  isActive: boolean
}

export interface RecommendationResult {
  scheme: SchemeLike
  eligible: boolean
  matchScore: number
  eligibility: EligibilityResult
  scoreBreakdown: ScoreBreakdown[]
  explanations: Explanation[]
  rank: number
}

export function runRecommendation(
  schemes: SchemeLike[],
  input: AssessmentInput,
  lang: string = "en",
): RecommendationResult[] {
  const results: RecommendationResult[] = []

  for (const scheme of schemes) {
    if (!scheme.isActive) continue

    const eligibility = checkEligibility(scheme, input)

    // Skip scoring for ineligible schemes - they won't appear in results
    if (!eligibility.eligible) {
      results.push({
        scheme,
        eligible: false,
        matchScore: 0,
        eligibility,
        scoreBreakdown: [],
        explanations: [],
        rank: 0,
      })
      continue
    }

    const { total, breakdown } = calculateSuitabilityScore(scheme, input)

    const explanations = generateExplanation(
      scheme,
      input,
      eligibility.fieldResults,
      breakdown,
      lang,
    )

    results.push({
      scheme,
      eligible: true,
      matchScore: total,
      eligibility,
      scoreBreakdown: breakdown,
      explanations,
      rank: 0,
    })
  }

  // Sort eligible first, then by matchScore descending
  results.sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1
    return b.matchScore - a.matchScore
  })

  // Assign ranks
  results.forEach((r, i) => {
    r.rank = i + 1
  })

  return results.slice(0, MAX_RECOMMENDATIONS)
}

export function getNoMatchAlternatives(
  results: RecommendationResult[],
): RecommendationResult[] {
  return results
    .filter((r) => !r.eligible)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)
}