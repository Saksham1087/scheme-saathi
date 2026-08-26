import { getAllSchemes } from "@/data"
import type { LocalScheme } from "@/data"
import type { MatchResponse, SchemeMatch, SchemeType } from "@/types/assessment"

interface IntakeInput {
  projectType: string
  estimatedCost: number
  annualFamilyIncome: number
  educationStatus: string
  category: string
  state: string
}

function mapProjectType(pt: string): string[] {
  switch (pt) {
    case "shop": return ["business"]
    case "manufacturing": return ["business"]
    case "service": return ["business"]
    case "agri": return ["agriculture"]
    case "higher_education": return ["education"]
    default: return []
  }
}

function mapSchemeType(scheme: LocalScheme): SchemeType {
  if (scheme.category.includes("education")) return "education"
  if (scheme.financialAssistance?.maxAmount && scheme.financialAssistance.maxAmount <= 500000) return "micro"
  return "term"
}

function buildMatch(scheme: LocalScheme, rank: number): SchemeMatch {
  const fa = scheme.financialAssistance
  const minAmount = fa?.minAmount || 0
  const maxAmount = fa?.maxAmount || 1000000
  const ir = fa?.interestRate
  const rm = fa?.repaymentMonths
  const mm = fa?.moratoriumMonths

  return {
    schemeId: scheme.slug,
    schemeType: mapSchemeType(scheme),
    eligible: true,
    rank,
    matchScore: Math.max(30, 100 - rank * 10),
    coveragePct: Math.min(100, Math.round((maxAmount / Math.max(maxAmount, 1)) * 100)),
    suggestedAmount: Math.min(maxAmount, Math.max(minAmount, maxAmount * 0.5)),
    reasons: [],
    schemeName: scheme.name as { en: string; hi: string },
    rateRange: { min: ir?.min || 0, max: ir?.max || 0 },
    moratorium: {
      minMonths: mm?.min || 0,
      maxMonths: mm?.max || 0,
      interestAccrues: false,
    },
    tenureRangeMonths: { min: rm?.min || 0, max: rm?.max || 0 },
  }
}

export function matchSchemesLocally(input: IntakeInput): MatchResponse {
  const schemes = getAllSchemes()
  const wantedCategories = mapProjectType(input.projectType)

  const scored = schemes.map((s) => {
    let score = 0

    if (wantedCategories.length > 0 && s.category.some((c) => wantedCategories.includes(c))) {
      score += 40
    }

    if (input.estimatedCost > 0 && s.financialAssistance) {
      if (input.estimatedCost <= s.financialAssistance.maxAmount) {
        score += 30
      } else if (input.estimatedCost <= s.financialAssistance.maxAmount * 1.5) {
        score += 15
      }
    }

    if (s.eligibilityRules?.maxIncome && input.annualFamilyIncome > 0) {
      if (input.annualFamilyIncome <= s.eligibilityRules.maxIncome) {
        score += 20
      }
    } else {
      score += 10
    }

    if (s.eligibilityRules?.categories?.includes("sc" as any) || !s.eligibilityRules?.categories?.length) {
      score += 10
    }

    return { scheme: s, score }
  })

  const matches = scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((x, i) => buildMatch(x.scheme, i + 1))

  return { matches, generatedAt: Date.now() }
}
