import type { LocalizedText, Scheme, SchemeType, ScoreBreakdown } from "../types"

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
      en: (p) => `Family income ${p.income ? `₹${p.income} ` : ""}is within the ₹5 lakh eligibility ceiling.`,
      hi: (p) => `पारिवारिक आय ${p.income ? `₹${p.income} ` : ""}₹5 लाख की पात्रता सीमा के भीतर है।`,
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
      en: (p) =>
        `Family income ${p.income ? `₹${p.income} ` : ""}exceeds the ₹5 lakh ceiling for concessional schemes.`,
      hi: (p) =>
        `पारिवारिक आय ${p.income ? `₹${p.income} ` : ""}रियायती योजनाओं की ₹5 लाख सीमा से अधिक है।`,
    },
    not_student: {
      en: () => "This scheme funds education courses only.",
      hi: () => "यह योजना केवल शिक्षा कोर्स के लिए है।",
    },
    category_note: {
      en: () => "Open to SC applicants through channel finance routes.",
      hi: () => "चैनल फाइनेंस रास्तों से एससी आवेदकों के लिए खुली।",
    },
    category_mismatch: {
      en: () => "This concessional scheme is reserved for Scheduled Caste (SC) applicants.",
      hi: () => "यह रियायती योजना केवल अनुसूचित जाति (SC) के आवेदकों के लिए आरक्षित है।",
    },
    female_only: {
      en: () => "This scheme is exclusively reserved for women entrepreneurs.",
      hi: () => "यह योजना विशेष रूप से महिला उद्यमियों के लिए आरक्षित है।",
    },
    age_out_of_bounds: {
      en: (p) => `Applicant age ${p.age} is outside eligible age band (${p.min}–${p.max} years).`,
      hi: (p) => `आवेदक की आयु ${p.age} वर्ष पात्र आयु वर्ग (${p.min}–${p.max} वर्ष) से बाहर है।`,
    },
    state_not_applicable: {
      en: (p) => `Scheme is not currently operational in ${p.state}.`,
      hi: (p) => `यह योजना वर्तमान में ${p.state} में उपलब्ध नहीं है।`,
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
  score: number
  breakdown: ScoreBreakdown
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
  gender?: string
  age?: number
  consentAt?: string | null
}

export function calculateScoreBreakdown(
  input: MatchContextInput,
  scheme: Scheme,
): {
  breakdown: ScoreBreakdown
  totalScore: number
  isEligible: boolean
  reasons: Array<{ key: string; params?: Record<string, string | number>; text: LocalizedText }>
  blockers: Array<{ key: string; params?: Record<string, string | number>; text: LocalizedText }>
} {
  const reasons: Array<{ key: string; params?: Record<string, string | number>; text: LocalizedText }> = []
  const blockers: Array<{ key: string; params?: Record<string, string | number>; text: LocalizedText }> = []

  // 1. Income Ceiling Fit: 20 pts
  const incomeCeiling = scheme.incomeCeiling || INCOME_CEILING
  const incomeOk = input.annualFamilyIncome <= incomeCeiling
  let incomeScore = 0
  if (incomeOk) {
    incomeScore = 20
    reasons.push({
      key: "income_ok",
      params: { income: fmt(input.annualFamilyIncome) },
      text: reasonText("income_ok", { income: fmt(input.annualFamilyIncome) }),
    })
  } else {
    incomeScore = 0
    blockers.push({
      key: "income_exceeds",
      params: { income: fmt(input.annualFamilyIncome), ceiling: fmt(incomeCeiling) },
      text: reasonText("income_exceeds", { income: fmt(input.annualFamilyIncome), ceiling: fmt(incomeCeiling) }),
    })
  }

  // 2. Category / Caste Fit: 20 pts
  const isSC = input.category === "sc"
  let categoryScore = 0
  if (isSC) {
    categoryScore = 20
    reasons.push({
      key: "category_note",
      text: reasonText("category_note", {}),
    })
  } else {
    categoryScore = 0
    blockers.push({
      key: "category_mismatch",
      text: reasonText("category_mismatch", {}),
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
        text: reasonText("student_eligible", {}),
      })
    } else {
      purposeScore = 0
      purposeOk = false
      blockers.push({
        key: "not_student",
        text: reasonText("not_student", {}),
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
        text: reasonText("category_note", {}),
      })
    } else {
      purposeScore = 0
      purposeOk = false
      blockers.push({
        key: "female_only",
        text: reasonText("female_only", {}),
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
      blockers.push({ key: "not_student", text: reasonText("not_student", {}) })
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
      blockers.push({ key: "not_student", text: reasonText("not_student", {}) })
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
      blockers.push({ key: "not_student", text: reasonText("not_student", {}) })
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
      text: reasonText("within_cost", { limit: fmt(scheme.maxProjectCost) }),
    })
  } else {
    costScore = 0
    blockers.push({
      key: "cost_above_tier",
      params: { cost: fmt(input.estimatedCost), limit: fmt(scheme.maxProjectCost) },
      text: reasonText("cost_above_tier", {
        cost: fmt(input.estimatedCost),
        limit: fmt(scheme.maxProjectCost),
      }),
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
      text: reasonText("age_out_of_bounds", { min: String(minAge), max: String(maxAge), age: String(applicantAge) }),
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
      text: reasonText("state_not_applicable", { state: input.state }),
    })
  }

  // Coverage reason
  const coveragePct = Math.min(MAX_COVERAGE_PCT, scheme.coverageMaxPct || 90)
  reasons.push({
    key: "coverage_capped",
    params: { pct: coveragePct },
    text: reasonText("coverage_capped", { pct: String(coveragePct) }),
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
 * Pure rule engine. Ranks every known scheme against the applicant profile.
 * Deterministic and side-effect free — evaluates matches in < 50ms.
 */
export function evaluateMatches(
  input: MatchContextInput,
  schemes: Scheme[],
): MatchResultItem[] {
  interface EvaluatedItem extends MatchResultItem {
    maxProjectCost: number
  }

  const results: EvaluatedItem[] = schemes.map((scheme): EvaluatedItem => {
    const { breakdown, totalScore, isEligible, reasons, blockers } = calculateScoreBreakdown(input, scheme)

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
    // Proximity to estimated cost without exceeding
    const diffA = Math.abs(a.maxProjectCost - input.estimatedCost)
    const diffB = Math.abs(b.maxProjectCost - input.estimatedCost)
    return diffA - diffB
  })

  results.forEach((r, i) => {
    r.rank = i + 1
  })

  return results.map(({ maxProjectCost: _maxProjectCost, ...rest }) => rest)
}
