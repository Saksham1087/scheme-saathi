import type { SchemeEligibilityRules } from "@/types/scheme"
import type { AssessmentInput, EligibilityResult } from "@/types/assessment"

export interface FieldResult {
  field: string
  passed: boolean
  reason: string
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

function mapOccupation(occ: string | undefined): string {
  if (!occ) return ""
  const map: Record<string, string> = {
    agriculture: "Agriculture",
    manufacturing: "Manufacturing",
    service: "Service",
    trading: "Trading",
    student: "Student",
    "self-employed": "Self-Employed",
    employed: "Employed",
    unemployed: "Unemployed",
    other: "Other",
  }
  return map[occ.toLowerCase()] || occ
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

/** Check if scheme has minimum data to be evaluated */
function hasMinimumData(rules: SchemeEligibilityRules): boolean {
  const hasStates = (rules.states?.length ?? 0) > 0
  const hasCategories = (rules.categories?.length ?? 0) > 0
  const hasPurposes = (rules.purposes?.length ?? 0) > 0
  return hasStates || hasCategories || hasPurposes
}

export function checkEligibility(
  scheme: { slug: string; eligibilityRules: SchemeEligibilityRules },
  input: AssessmentInput,
): EligibilityResult {
  const rules = scheme.eligibilityRules

  // Check minimum data requirement first
  if (!hasMinimumData(rules)) {
    const fieldResults: FieldResult[] = [{
      field: "data_completeness",
      passed: false,
      reason: "insufficient_data",
    }]
    return {
      schemeId: scheme.slug,
      eligible: false,
      fieldResults,
      passedFields: [],
      failedFields: ["data_completeness"],
      confidence: 0,
      totalRuleFields: 0,
      matchedRuleFields: 0,
    }
  }

  const fieldResults = checkAllFields(rules, input)

  const eligible = fieldResults.every((r) => r.passed)

  // Calculate confidence: how many rule fields could we actually check?
  const { total, matched } = countRuleFields(rules, input)

  return {
    schemeId: scheme.slug,
    eligible,
    fieldResults,
    passedFields: fieldResults.filter((r) => r.passed).map((r) => r.field),
    failedFields: fieldResults.filter((r) => !r.passed).map((r) => r.field),
    confidence: total > 0 ? Math.round((matched / total) * 100) : 0,
    totalRuleFields: total,
    matchedRuleFields: matched,
  }
}

/** Count how many rule fields exist and how many the user provided data for */
function countRuleFields(
  rules: SchemeEligibilityRules,
  input: AssessmentInput,
): { total: number; matched: number } {
  let total = 0
  let matched = 0

  // Income - only count if scheme has income data
  if (rules.maxIncome !== undefined || rules.minIncome !== undefined) {
    total++
    if (input.annualFamilyIncome > 0) matched++
  }
  // Category - only count if scheme has category data
  if (rules.categories?.length) {
    total++
    if (input.category) matched++
  }
  // State - only count if scheme has state data
  if (rules.states?.length) {
    total++
    if (input.state) matched++
  }
  // District - only count if scheme has district data
  if (rules.districts?.length) {
    total++
    if (input.district) matched++
  }
  // Occupation - only count if scheme has occupation data
  if (rules.occupations?.length) {
    total++
    if (input.occupation) matched++
  }
  // Education - only count if scheme has education data
  if (rules.education?.length) {
    total++
    if (input.education) matched++
  }
  // Age - only count if scheme has age data
  if (rules.minAge !== undefined || rules.maxAge !== undefined) {
    total++
    if (input.age > 0) matched++
  }
  // Purpose - only count if scheme has purpose data
  if (rules.purposes?.length) {
    total++
    if (input.purpose) matched++
  }
  // Existing business - only count if scheme has this data
  if (rules.existingBusiness !== undefined) {
    total++
    if (input.existingBusiness !== undefined) matched++
  }
  // Gender - only count if scheme has gender data
  if (rules.gender) {
    total++
    if (input.gender) matched++
  }
  // Disability - only count if scheme has disability data
  if (rules.disabilityRequired !== undefined) {
    total++
    if (input.disability !== undefined) matched++
  }

  return { total, matched }
}

function checkAllFields(
  rules: SchemeEligibilityRules,
  input: AssessmentInput,
): FieldResult[] {
  const results: FieldResult[] = []

  // Income check - only if scheme has income data
  if (rules.maxIncome !== undefined) {
    results.push({
      field: "income",
      passed: input.annualFamilyIncome <= rules.maxIncome,
      reason:
        input.annualFamilyIncome <= rules.maxIncome
          ? `income_ok`
          : `income_exceeds`,
    })
  }

  // Category check - only if scheme has category data
  if (rules.categories?.length) {
    const cat = mapCategory(input.category)
    const pass = rules.categories.includes(cat)
    results.push({
      field: "category",
      passed: pass,
      reason: pass ? "category_match" : "category_not_match",
    })
  }

  // State check - only if scheme has state data
  if (rules.states?.length) {
    // Handle ALL India schemes
    if (rules.states.includes("ALL")) {
      results.push({
        field: "state",
        passed: true,
        reason: "location_match",
      })
    } else {
      const pass = rules.states.includes(input.state)
      results.push({
        field: "state",
        passed: pass,
        reason: pass ? "location_match" : "location_not_match",
      })
    }
  }

  // District check - only if scheme has district data
  if (rules.districts?.length) {
    const pass = input.district ? rules.districts.includes(input.district) : false
    results.push({
      field: "district",
      passed: pass,
      reason: pass ? "district_match" : "district_not_match",
    })
  }

  // Occupation check - only if scheme has occupation data
  if (rules.occupations?.length) {
    const occ = mapOccupation(input.occupation)
    const pass = rules.occupations.includes(occ)
    results.push({
      field: "occupation",
      passed: pass,
      reason: pass ? "occupation_match" : "occupation_not_match",
    })
  }

  // Education check - only if scheme has education data
  if (rules.education?.length) {
    const pass = rules.education.includes(input.education)
    results.push({
      field: "education",
      passed: pass,
      reason: pass ? "education_match" : "education_not_match",
    })
  }

  // Age check - only if scheme has age data
  if (rules.minAge !== undefined || rules.maxAge !== undefined) {
    const min = rules.minAge ?? 0
    const max = rules.maxAge ?? 120
    const pass = input.age >= min && input.age <= max
    results.push({
      field: "age",
      passed: pass,
      reason: pass ? "age_match" : "age_not_match",
    })
  }

  // Purpose check - only if scheme has purpose data
  if (rules.purposes?.length) {
    const purpose = mapPurpose(input.purpose)
    const pass = rules.purposes.includes(purpose)
    results.push({
      field: "purpose",
      passed: pass,
      reason: pass ? "purpose_match" : "purpose_not_match",
    })
  }

  // Existing business check - only if scheme has this data
  if (rules.existingBusiness !== undefined) {
    const pass = (input.existingBusiness ?? false) === rules.existingBusiness
    results.push({
      field: "existingBusiness",
      passed: pass,
      reason: pass ? "existing_business_match" : "existing_business_not_match",
    })
  }

  // Gender check - only if scheme has gender data
  if (rules.gender) {
    const pass = input.gender === rules.gender
    results.push({
      field: "gender",
      passed: pass,
      reason: pass ? "gender_match" : "gender_not_match",
    })
  }

  // Disability check - only if scheme has disability data
  if (rules.disabilityRequired !== undefined) {
    const pass = (input.disability ?? false) === rules.disabilityRequired
    results.push({
      field: "disability",
      passed: pass,
      reason: pass ? "disability_match" : "disability_not_match",
    })
  }

  // Should not reach here if hasMinimumData passed, but safeguard
  if (results.length === 0) {
    results.push({ field: "default", passed: false, reason: "insufficient_data" })
  }

  return results
}