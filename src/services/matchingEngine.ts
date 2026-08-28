import type { MatchInput, MatchResponse, Scheme, SchemeMatch, SchemeType } from "@/types"
import { getSeedSchemes, fetchSchemes } from "./schemeService"

export const INCOME_CEILING = 500_000
export const MAX_COVERAGE_PCT = 90

export const TIER_MAX_COST: Record<SchemeType, number> = {
  micro: 140_000,
  term: 5_000_000,
  education: 5_000_000,
}

const fmt = (n: number): string => new Intl.NumberFormat("en-IN").format(n)

/**
 * Pure deterministic rule engine mirroring backend logic.
 * Evaluates every available scheme against the applicant profile in < 50ms.
 */
export function evaluateMatchesLocally(
  input: MatchInput,
  schemes: Scheme[],
): SchemeMatch[] {
  const incomeOk = input.annualFamilyIncome <= INCOME_CEILING

  const results = schemes.map((scheme): SchemeMatch => {
    const reasons: SchemeMatch["reasons"] = []
    const blockers: SchemeMatch["reasons"] = []

    if (!incomeOk) {
      blockers.push({
        key: "income_exceeds",
        params: { income: fmt(input.annualFamilyIncome) },
      })
    } else {
      reasons.push({
        key: "income_ok",
        params: { income: fmt(input.annualFamilyIncome) },
      })
    }

    const costFits = input.estimatedCost <= scheme.maxProjectCost
    if (costFits) {
      reasons.push({
        key: "within_cost",
        params: { limit: fmt(scheme.maxProjectCost) },
      })
    } else {
      blockers.push({
        key: "cost_above_tier",
        params: {
          cost: fmt(input.estimatedCost),
          limit: fmt(scheme.maxProjectCost),
        },
      })
    }

    if (scheme.type === "education") {
      const isStudent =
        input.educationStatus === "student" ||
        input.projectType === "higher_education"
      if (isStudent) {
        reasons.push({
          key: "student_eligible",
        })
      } else {
        blockers.push({
          key: "not_student",
        })
      }
    }

    reasons.push({
      key: "category_note",
    })

    // Funding coverage capped at MAX_COVERAGE_PCT of cost.
    const coveragePct = Math.min(MAX_COVERAGE_PCT, scheme.coverageMaxPct || 90)
    reasons.push({
      key: "coverage_capped",
      params: { pct: coveragePct },
    })

    const eligible =
      costFits &&
      incomeOk &&
      !(
        scheme.type === "education" &&
        !(
          input.educationStatus === "student" ||
          input.projectType === "higher_education"
        )
      )

    const suggestedAmount = Math.round(
      (Math.min(input.estimatedCost, scheme.maxProjectCost) * coveragePct) / 100,
    )

    return {
      schemeId: scheme.id,
      schemeType: scheme.type,
      eligible,
      rank: 0,
      coveragePct,
      suggestedAmount,
      reasons: eligible ? reasons : [...blockers],
      schemeName: scheme.name,
      rateRange: scheme.rateRange,
      moratorium: scheme.moratorium,
      tenureRangeMonths: scheme.tenureRangeMonths,
    }
  })

  results.sort((a, b) => Number(b.eligible) - Number(a.eligible))
  results.forEach((r, i) => {
    r.rank = i + 1
  })
  return results
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
