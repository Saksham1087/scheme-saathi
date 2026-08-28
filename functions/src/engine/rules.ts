import type { GapItem, LocalizedText, Scheme, SchemeAlternative, SchemeType, ScoreBreakdown } from "../types"

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
  alternativeSchemeIds?: string[]
  alternativeSchemes?: SchemeAlternative[]
  remedialAdvice?: LocalizedText[]
  gapBreakdown?: GapItem[]
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

export function generateGapsAndAlternatives(
  input: MatchContextInput,
  scheme: Scheme,
  allSchemes: Scheme[],
): {
  gapBreakdown: GapItem[]
  remedialAdvice: LocalizedText[]
  alternativeSchemes: SchemeAlternative[]
  alternativeSchemeIds: string[]
} {
  const gapBreakdown: GapItem[] = []
  const remedialAdvice: LocalizedText[] = []
  const incomeCeiling = scheme.incomeCeiling || INCOME_CEILING

  // 1. Cost check
  if (input.estimatedCost > scheme.maxProjectCost) {
    const gap: GapItem = {
      criterion: "cost",
      userValue: `₹${fmt(input.estimatedCost)}`,
      requiredValue: `₹${fmt(scheme.maxProjectCost)}`,
      explanation: {
        en: `Requested ₹${fmt(input.estimatedCost)} exceeds this scheme's limit of ₹${fmt(scheme.maxProjectCost)}.`,
        hi: `अनुरोधित प्रोजेक्ट लागत ₹${fmt(input.estimatedCost)} इस योजना की ₹${fmt(scheme.maxProjectCost)} सीमा से अधिक है।`,
      },
      remedialAdvice: {
        en: `For larger project costs up to ₹50.00 Lakhs, explore the Term Loan Scheme or consider phasing your project investment.`,
        hi: `₹50.00 लाख तक की बड़ी परियोजनाओं के लिए टर्म लोन योजना पर विचार करें या निवेश को चरणबद्ध करें।`,
      },
    }
    gapBreakdown.push(gap)
    remedialAdvice.push(gap.remedialAdvice!)
  }

  // 2. Income check
  if (input.annualFamilyIncome > incomeCeiling) {
    const gap: GapItem = {
      criterion: "income",
      userValue: `₹${fmt(input.annualFamilyIncome)}`,
      requiredValue: `₹${fmt(incomeCeiling)}`,
      explanation: {
        en: `Family income ₹${fmt(input.annualFamilyIncome)} exceeds the ₹${fmt(incomeCeiling)} concessional ceiling.`,
        hi: `पारिवारिक आय ₹${fmt(input.annualFamilyIncome)} रियायती योजनाओं की ₹${fmt(incomeCeiling)} सीमा से अधिक है।`,
      },
      remedialAdvice: {
        en: `Concessional SC welfare schemes have a strict income cap of ₹5.00 Lakhs. For higher household incomes, explore commercial bank Priority Sector Lending (PSL) programs like PM Mudra Scheme or Stand-Up India.`,
        hi: `रियायती एससी कल्याण योजनाओं में ₹5.00 लाख की सख्त आय सीमा है। अधिक आय वाले परिवार पीएम मुद्रा या स्टैंड-अप इंडिया जैसी प्राथमिक क्षेत्र ऋण योजनाओं का लाभ ले सकते हैं।`,
      },
    }
    gapBreakdown.push(gap)
    remedialAdvice.push(gap.remedialAdvice!)
  }

  // 3. Category check
  if (input.category !== "sc") {
    const gap: GapItem = {
      criterion: "category",
      userValue: input.category === "other" ? "General / Other" : input.category,
      requiredValue: "Scheduled Caste (SC)",
      explanation: {
        en: "This concessional scheme is reserved for Scheduled Caste (SC) applicants.",
        hi: "यह रियायती योजना केवल अनुसूचित जाति (SC) के आवेदकों के लिए आरक्षित है।",
      },
      remedialAdvice: {
        en: "General and other category applicants can explore nationwide entrepreneurship credit on the JanSamarth portal or PM Mudra Yojana.",
        hi: "सामान्य और अन्य श्रेणी के आवेदक जनसमर्थ पोर्टल या पीएम मुद्रा योजना पर राष्ट्रीय उद्यमिता ऋण का लाभ उठा सकते हैं।",
      },
    }
    gapBreakdown.push(gap)
    remedialAdvice.push(gap.remedialAdvice!)
  }

  // 4. Purpose / Education / Gender check
  if (scheme.type === "education" || scheme.id === "education-loan" || scheme.category === "education") {
    const isStudent =
      input.educationStatus === "student" ||
      input.projectType === "higher_education"
    if (!isStudent) {
      const gap: GapItem = {
        criterion: "purpose",
        userValue: input.projectType,
        requiredValue: "higher_education / student",
        explanation: {
          en: "Education Loan requires formal college/university admission offer or student status.",
          hi: "शिक्षा ऋण योजना के लिए औपचारिक कॉलेज/विश्वविद्यालय प्रवेश प्रस्ताव या छात्र स्थिति आवश्यक है।",
        },
        remedialAdvice: {
          en: "For non-student trade and skill activities, consider the PM-DAKSH Loan Scheme (up to ₹15 Lakhs) or Micro Credit Scheme.",
          hi: "गैर-छात्र व्यापार और कौशल गतिविधियों के लिए, पीएम-दक्ष ऋण योजना (₹15 लाख तक) या लघु ऋण योजना पर विचार करें।",
        },
      }
      gapBreakdown.push(gap)
      remedialAdvice.push(gap.remedialAdvice!)
    }
  } else if (scheme.id === "mahila-samriddhi" || scheme.category === "women") {
    if (input.gender !== "female") {
      const gap: GapItem = {
        criterion: "purpose",
        userValue: input.gender || "male",
        requiredValue: "female",
        explanation: {
          en: "This scheme is exclusively reserved for women entrepreneurs and SHG members.",
          hi: "यह योजना विशेष रूप से महिला उद्यमियों और स्वयं सहायता समूह सदस्यों के लिए आरक्षित है।",
        },
        remedialAdvice: {
          en: "Male applicants can apply for equivalent micro-loans up to ₹1.40 Lakh under the Micro Credit Scheme or Term Loan up to ₹50 Lakhs.",
          hi: "पुरुष आवेदक लघु ऋण योजना (₹1.40 लाख तक) या टर्म लोन (₹50 लाख तक) के तहत आवेदन कर सकते हैं।",
        },
      }
      gapBreakdown.push(gap)
      remedialAdvice.push(gap.remedialAdvice!)
    }
  }

  // 5. Age check
  const applicantAge = typeof input.age === "number" && !isNaN(input.age) ? input.age : 28
  const minAge = scheme.eligibilityCriteria?.ageRange?.min ?? 18
  const maxAge = scheme.eligibilityCriteria?.ageRange?.max ?? (scheme.id === "pm-daksh-loan" ? 45 : 60)
  if (applicantAge < minAge || applicantAge > maxAge) {
    const gap: GapItem = {
      criterion: "age",
      userValue: applicantAge,
      requiredValue: `${minAge}–${maxAge} years`,
      explanation: {
        en: `Applicant age ${applicantAge} is outside the eligible age band (${minAge}–${maxAge} years).`,
        hi: `आवेदक की आयु ${applicantAge} वर्ष पात्र आयु वर्ग (${minAge}–${maxAge} वर्ष) से बाहर है।`,
      },
      remedialAdvice: {
        en: "Consider schemes like the Term Loan Scheme or Micro Credit Scheme which accept applicants up to 60 years of age.",
        hi: "टर्म लोन योजना या लघु ऋण योजना पर विचार करें जो 60 वर्ष तक के आवेदकों को स्वीकार करती हैं।",
      },
    }
    gapBreakdown.push(gap)
    remedialAdvice.push(gap.remedialAdvice!)
  }

  // 6. State check
  const states = scheme.applicableStates || ["All India"]
  const stateOk =
    !input.state ||
    states.includes("All India") ||
    states.includes(input.state)
  if (!stateOk) {
    const gap: GapItem = {
      criterion: "state",
      userValue: input.state,
      requiredValue: states.join(", "),
      explanation: {
        en: `Scheme is not currently operational in ${input.state}.`,
        hi: `यह योजना वर्तमान में ${input.state} में उपलब्ध नहीं है।`,
      },
      remedialAdvice: {
        en: "Explore All-India operational schemes like Term Loan or Micro Credit which are active nationwide.",
        hi: "टर्म लोन या लघु ऋण जैसी अखिल भारतीय योजनाओं का पता लगाएं जो देश भर में सक्रिय हैं।",
      },
    }
    gapBreakdown.push(gap)
    remedialAdvice.push(gap.remedialAdvice!)
  }

  // Resolve 1–2 suitable alternative schemes
  const alternativeSchemes: SchemeAlternative[] = []
  const otherSchemes = allSchemes.filter((s) => s.id !== scheme.id)

  const findScheme = (id: string) => otherSchemes.find((s) => s.id === id)

  // Disqualification due to cost (> 1.40L on micro-credit or mahila-samriddhi)
  if (input.estimatedCost > scheme.maxProjectCost && (scheme.id === "micro-finance" || scheme.id === "mahila-samriddhi")) {
    const term = findScheme("term-loan")
    if (term) {
      alternativeSchemes.push({
        schemeId: term.id,
        schemeName: term.name,
        schemeType: term.type,
        maxProjectCost: term.maxProjectCost,
        rateRange: term.rateRange,
        reason: {
          en: "Term Loan Scheme finances business projects up to ₹50.00 Lakhs, fitting your capital requirement.",
          hi: "टर्म लोन योजना आपकी पूंजी आवश्यकता के अनुसार ₹50.00 लाख तक व्यावसायिक परियोजनाओं को वित्तपोषित करती है।",
        },
      })
    }
    if (input.projectType === "sanitation") {
      const suy = findScheme("swachhta-udyami")
      if (suy) {
        alternativeSchemes.push({
          schemeId: suy.id,
          schemeName: suy.name,
          schemeType: suy.type,
          maxProjectCost: suy.maxProjectCost,
          rateRange: suy.rateRange,
          reason: {
            en: "Swachhta Udyami Yojana provides up to ₹50.00 Lakhs for sanitation and cleaning enterprises.",
            hi: "स्वच्छता उद्यमी योजना स्वच्छता और सफाई उद्यमों के लिए ₹50.00 लाख तक प्रदान करती है।",
          },
        })
      }
    } else if (input.projectType === "agri") {
      const gbs = findScheme("green-business")
      if (gbs) {
        alternativeSchemes.push({
          schemeId: gbs.id,
          schemeName: gbs.name,
          schemeType: gbs.type,
          maxProjectCost: gbs.maxProjectCost,
          rateRange: gbs.rateRange,
          reason: {
            en: "Green Business Scheme provides up to ₹30.00 Lakhs for agriculture, solar, and eco-friendly projects.",
            hi: "ग्रीन बिजनेस योजना कृषि, सौर और पर्यावरण अनुकूल परियोजनाओं के लिए ₹30.00 लाख तक प्रदान करती है।",
          },
        })
      }
    }
  }

  // Disqualification on education-loan (non-student)
  if (
    (scheme.type === "education" || scheme.id === "education-loan") &&
    input.educationStatus !== "student" &&
    input.projectType !== "higher_education"
  ) {
    const daksh = findScheme("pm-daksh-loan")
    if (daksh) {
      alternativeSchemes.push({
        schemeId: daksh.id,
        schemeName: daksh.name,
        schemeType: daksh.type,
        maxProjectCost: daksh.maxProjectCost,
        rateRange: daksh.rateRange,
        reason: {
          en: "PM-DAKSH Loan Scheme offers skill development and self-employment credit up to ₹15.00 Lakhs without university admission.",
          hi: "पीएम-दक्ष ऋण योजना विश्वविद्यालय प्रवेश के बिना ₹15.00 लाख तक कौशल विकास और स्वरोजगार ऋण प्रदान करती है।",
        },
      })
    }
    const micro = findScheme("micro-finance")
    if (micro && input.estimatedCost <= micro.maxProjectCost) {
      alternativeSchemes.push({
        schemeId: micro.id,
        schemeName: micro.name,
        schemeType: micro.type,
        maxProjectCost: micro.maxProjectCost,
        rateRange: micro.rateRange,
        reason: {
          en: "Micro Credit Scheme provides collateral-free credit up to ₹1.40 Lakh for small trades and retail ventures.",
          hi: "लघु ऋण योजना छोटे व्यापार और खुदरा उद्यमों के लिए ₹1.40 लाख तक बिना गारंटी ऋण प्रदान करती है।",
        },
      })
    } else {
      const term = findScheme("term-loan")
      if (term && !alternativeSchemes.some((a) => a.schemeId === term.id)) {
        alternativeSchemes.push({
          schemeId: term.id,
          schemeName: term.name,
          schemeType: term.type,
          maxProjectCost: term.maxProjectCost,
          rateRange: term.rateRange,
          reason: {
            en: "Term Loan Scheme supports commercial and service enterprises up to ₹50.00 Lakhs.",
            hi: "टर्म लोन योजना ₹50.00 लाख तक वाणिज्यिक और सेवा उद्यमों का समर्थन करती है।",
          },
        })
      }
    }
  }

  // Disqualification on mahila-samriddhi for male applicant
  if (scheme.id === "mahila-samriddhi" && input.gender !== "female") {
    const micro = findScheme("micro-finance")
    if (micro) {
      alternativeSchemes.push({
        schemeId: micro.id,
        schemeName: micro.name,
        schemeType: micro.type,
        maxProjectCost: micro.maxProjectCost,
        rateRange: micro.rateRange,
        reason: {
          en: "Micro Credit Scheme offers identical ₹1.40 Lakh micro-finance open to all gender identities.",
          hi: "लघु ऋण योजना सभी लिंगों के लिए समान ₹1.40 लाख सूक्ष्म ऋण प्रदान करती है।",
        },
      })
    }
    const term = findScheme("term-loan")
    if (term) {
      alternativeSchemes.push({
        schemeId: term.id,
        schemeName: term.name,
        schemeType: term.type,
        maxProjectCost: term.maxProjectCost,
        rateRange: term.rateRange,
        reason: {
          en: "Term Loan Scheme offers business funding up to ₹50.00 Lakhs open to all SC applicants.",
          hi: "टर्म लोन योजना सभी एससी आवेदकों के लिए ₹50.00 लाख तक व्यावसायिक ऋण प्रदान करती है।",
        },
      })
    }
  }

  // Disqualification on pm-daksh-loan due to age (>45)
  if (scheme.id === "pm-daksh-loan" && applicantAge > 45) {
    const term = findScheme("term-loan")
    if (term) {
      alternativeSchemes.push({
        schemeId: term.id,
        schemeName: term.name,
        schemeType: term.type,
        maxProjectCost: term.maxProjectCost,
        rateRange: term.rateRange,
        reason: {
          en: "Term Loan Scheme accepts applicants up to 60 years of age with funding up to ₹50.00 Lakhs.",
          hi: "टर्म लोन योजना 60 वर्ष तक के आवेदकों को स्वीकार करती है और ₹50.00 लाख तक फंडिंग प्रदान करती है।",
        },
      })
    }
  }

  // If no alternative found yet, provide the most suitable generic alternative
  if (alternativeSchemes.length === 0 && otherSchemes.length > 0) {
    const preferredId = input.estimatedCost > 140_000 ? "term-loan" : "micro-finance"
    const fallback = findScheme(preferredId) || otherSchemes[0]
    if (fallback) {
      alternativeSchemes.push({
        schemeId: fallback.id,
        schemeName: fallback.name,
        schemeType: fallback.type,
        maxProjectCost: fallback.maxProjectCost,
        rateRange: fallback.rateRange,
        reason: {
          en: `Broad-spectrum concessional credit scheme supporting projects up to ₹${fmt(fallback.maxProjectCost)}.`,
          hi: `व्यापक रियायती ऋण योजना जो ₹${fmt(fallback.maxProjectCost)} तक की परियोजनाओं का समर्थन करती है।`,
        },
      })
    }
  }

  const alternativeSchemeIds = alternativeSchemes.map((a) => a.schemeId)

  return {
    gapBreakdown,
    remedialAdvice,
    alternativeSchemes,
    alternativeSchemeIds,
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

    let gapBreakdown: GapItem[] | undefined
    let remedialAdvice: LocalizedText[] | undefined
    let alternativeSchemes: SchemeAlternative[] | undefined
    let alternativeSchemeIds: string[] | undefined

    if (!isEligible) {
      const gaps = generateGapsAndAlternatives(input, scheme, schemes)
      gapBreakdown = gaps.gapBreakdown
      remedialAdvice = gaps.remedialAdvice
      alternativeSchemes = gaps.alternativeSchemes
      alternativeSchemeIds = gaps.alternativeSchemeIds
    }

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
      gapBreakdown,
      remedialAdvice,
      alternativeSchemes,
      alternativeSchemeIds,
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
