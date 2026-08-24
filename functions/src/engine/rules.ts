import type { LocalizedText, Scheme, SchemeType } from "../types"

/**
 * Auditable scheme tiers for the SC Channel Finance System.
 * Kept as plain data so a future ML classifier can be swapped in behind the
 * same `evaluateMatches` interface without touching callers.
 */
export const INCOME_CEILING = 500_000
export const MAX_COVERAGE_PCT = 90

export const TIER_MAX_COST: Record<SchemeType, number> = {
  micro: 140_000,
  term: 5_000_000,
  education: 5_000_000,
}

const fmt = (n: number): string => new Intl.NumberFormat("en-IN").format(n)

function reasonText(
  key: string,
  params: Record<string, string>,
): { en: string; hi: string } {
  const t: Record<string, { en: (p: Record<string, string>) => string; hi: (p: Record<string, string>) => string }> = {
    within_cost: {
      en: (p) => `Project cost is within this scheme's limit of ₹${p.limit}.`,
      hi: (p) => `प्रोजेक्ट लागत इस योजना की ₹${p.limit} सीमा के भीतर है।`,
    },
    income_ok: {
      en: () => "Family income is within the ₹5 lakh eligibility ceiling.",
      hi: () => "पारिवारिक आय ₹5 लाख की पात्रता सीमा के भीतर है।",
    },
    coverage_capped: {
      en: (p) => `Funding covers ${p.pct}% of project cost; you arrange the rest.`,
      hi: (p) => `फंडिंग प्रोजेक्ट लागत का ${p.pct}% तक; बाकी आप जुटाएँगे।`,
    },
    student_eligible: {
      en: () => "Course cost can be financed for students based on admission.",
      hi: () => "छात्रों के लिए प्रवेश के आधार पर कोर्स की लागत वित्तपोषित हो सकती है।",
    },
    cost_above_tier: {
      en: (p) => `Cost ₹${p.cost} is above this scheme's limit of ₹${p.limit}.`,
      hi: (p) => `लागत ₹${p.cost} इस योजना की ₹${p.limit} सीमा से अधिक है।`,
    },
    income_exceeds: {
      en: () =>
        "Family income exceeds the ₹5 lakh ceiling for concessional schemes.",
      hi: () =>
        "पारिवारिक आय रियायती योजनाओं की ₹5 लाख सीमा से अधिक है।",
    },
    not_student: {
      en: () => "This scheme funds education courses only.",
      hi: () => "यह योजना केवल शिक्षा कोर्स के लिए है।",
    },
    category_note: {
      en: () => "Open to SC applicants through channel finance routes.",
      hi: () => "चैनल फाइनेंस रास्तों से एससी आवेदकों के लिए खुली।",
    },
  }
  const entry = t[key]
  return entry
    ? { en: entry.en(params), hi: entry.hi(params) }
    : { en: key, hi: key }
}

export interface MatchResultItem {
  schemeId: string
  schemeType: SchemeType
  eligible: boolean
  rank: number
  coveragePct: number
  suggestedAmount: number
  reasons: Array<{ key: string; params?: Record<string, string | number>; text: LocalizedText }>
  schemeName: LocalizedText
  rateRange: Scheme["rateRange"]
  moratorium: Scheme["moratorium"]
  tenureRangeMonths: Scheme["tenureRangeMonths"]
}

export interface MatchContextInput {
  projectType: string
  estimatedCost: number
  annualFamilyIncome: number
  educationStatus: string
  category: string
  state: string
}

/**
 * Pure rule engine. Ranks every known scheme against the applicant profile.
 * Deterministic and side-effect free — trivially unit-testable, trivially
 * replaceable by an ML scorer implementing the same signature.
 */
export function evaluateMatches(
  input: MatchContextInput,
  schemes: Scheme[],
): MatchResultItem[] {
  const incomeOk = input.annualFamilyIncome <= INCOME_CEILING

  const results = schemes.map((scheme): MatchResultItem => {
    const reasons: MatchResultItem["reasons"] = []
    const blockers: MatchResultItem["reasons"] = []

    if (!incomeOk) {
      blockers.push({
        key: "income_exceeds",
        text: reasonText("income_exceeds", {}),
      })
    } else {
      reasons.push({ key: "income_ok", text: reasonText("income_ok", {}) })
    }

    const costFits = input.estimatedCost <= scheme.maxProjectCost
    if (costFits) {
      reasons.push({
        key: "within_cost",
        params: { limit: fmt(scheme.maxProjectCost) },
        text: reasonText("within_cost", { limit: fmt(scheme.maxProjectCost) }),
      })
    } else {
      blockers.push({
        key: "cost_above_tier",
        params: { cost: fmt(input.estimatedCost), limit: fmt(scheme.maxProjectCost) },
        text: reasonText("cost_above_tier", {
          cost: fmt(input.estimatedCost),
          limit: fmt(scheme.maxProjectCost),
        }),
      })
    }

    if (scheme.type === "education") {
      const isStudent =
        input.educationStatus === "student" ||
        input.projectType === "higher_education"
      if (isStudent) {
        reasons.push({
          key: "student_eligible",
          text: reasonText("student_eligible", {}),
        })
      } else {
        blockers.push({
          key: "not_student",
          text: reasonText("not_student", {}),
        })
      }
    }

    reasons.push({
      key: "category_note",
      text: reasonText("category_note", {}),
    })

    // Funding coverage capped at MAX_COVERAGE_PCT of cost.
    const coveragePct = Math.min(MAX_COVERAGE_PCT, scheme.coverageMaxPct)
    reasons.push({
      key: "coverage_capped",
      params: { pct: coveragePct },
      text: reasonText("coverage_capped", { pct: String(coveragePct) }),
    })

    const eligible = costFits && incomeOk &&
      !(scheme.type === "education" && !(
        input.educationStatus === "student" ||
        input.projectType === "higher_education"))

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
