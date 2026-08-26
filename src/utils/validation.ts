import type { SchemeCategory, FinancialAssistanceType, DataSourceTier } from "../types/scheme"

const VALID_CATEGORIES: SchemeCategory[] = [
  "business",
  "education",
  "agriculture",
  "transport",
  "housing",
  "health",
  "social-welfare",
  "employment",
  "other",
]

const VALID_FINANCIAL_TYPES: FinancialAssistanceType[] = ["loan", "grant", "subsidy", "insurance"]
const VALID_SOURCE_TIERS: DataSourceTier[] = ["official", "open-dataset", "curated", "synthetic"]

export function validateScheme(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: ["Data must be a non-null object"] }
  }

  const obj = data as Record<string, unknown>

  if (typeof obj.slug !== "string" || obj.slug.trim() === "") {
    errors.push("slug is required and must be a non-empty string")
  }

  if (!obj.name || typeof obj.name !== "object") {
    errors.push("name is required and must be an object with 'en' and 'hi' keys")
  } else {
    const name = obj.name as Record<string, unknown>
    if (typeof name.en !== "string" || name.en.trim() === "") errors.push("name.en is required")
    if (typeof name.hi !== "string" || name.hi.trim() === "") errors.push("name.hi is required")
  }

  if (typeof obj.ministry !== "string" || obj.ministry.trim() === "") {
    errors.push("ministry is required and must be a non-empty string")
  }

  if (!Array.isArray(obj.category) || obj.category.length === 0) {
    errors.push("category is required and must be a non-empty array")
  } else {
    for (const cat of obj.category) {
      if (!VALID_CATEGORIES.includes(cat as SchemeCategory)) {
        errors.push(`Invalid category: "${cat}". Must be one of: ${VALID_CATEGORIES.join(", ")}`)
      }
    }
  }

  if (!obj.description || typeof obj.description !== "object") {
    errors.push("description is required")
  } else {
    const desc = obj.description as Record<string, unknown>
    if (typeof desc.en !== "string" || desc.en.trim() === "") errors.push("description.en is required")
    if (typeof desc.hi !== "string" || desc.hi.trim() === "") errors.push("description.hi is required")
  }

  if (!obj.shortDescription || typeof obj.shortDescription !== "object") {
    errors.push("shortDescription is required")
  } else {
    const sd = obj.shortDescription as Record<string, unknown>
    if (typeof sd.en !== "string" || sd.en.trim() === "") errors.push("shortDescription.en is required")
    if (typeof sd.hi !== "string" || sd.hi.trim() === "") errors.push("shortDescription.hi is required")
  }

  if (typeof obj.purpose !== "string" || obj.purpose.trim() === "") {
    errors.push("purpose is required")
  }

  if (!Array.isArray(obj.targetBeneficiaries)) {
    errors.push("targetBeneficiaries must be an array")
  }

  if (!obj.financialAssistance || typeof obj.financialAssistance !== "object") {
    errors.push("financialAssistance is required")
  } else {
    const fa = obj.financialAssistance as Record<string, unknown>
    if (!VALID_FINANCIAL_TYPES.includes(fa.type as FinancialAssistanceType)) {
      errors.push(`Invalid financialAssistance.type: "${fa.type}". Must be one of: ${VALID_FINANCIAL_TYPES.join(", ")}`)
    }
    if (typeof fa.minAmount !== "number") errors.push("financialAssistance.minAmount must be a number")
    if (typeof fa.maxAmount !== "number") errors.push("financialAssistance.maxAmount must be a number")
  }

  if (!obj.eligibilityRules || typeof obj.eligibilityRules !== "object") {
    errors.push("eligibilityRules is required")
  }

  if (!Array.isArray(obj.requiredDocuments)) {
    errors.push("requiredDocuments must be an array of RequiredDocument objects")
  }

  if (!Array.isArray(obj.eligibilityRuleIds)) {
    errors.push("eligibilityRuleIds must be an array")
  }

  if (typeof obj.source !== "string" || !VALID_SOURCE_TIERS.includes(obj.source as DataSourceTier)) {
    errors.push(`Invalid source: "${obj.source}". Must be one of: ${VALID_SOURCE_TIERS.join(", ")}`)
  }

  if (typeof obj.lastUpdated !== "string") {
    errors.push("lastUpdated must be a string")
  }

  if (typeof obj.verified !== "boolean") {
    errors.push("verified must be a boolean")
  }

  if (typeof obj.isActive !== "boolean") {
    errors.push("isActive must be a boolean")
  }

  if (!Array.isArray(obj.channelPartnerTypes)) {
    errors.push("channelPartnerTypes must be an array")
  }

  return { valid: errors.length === 0, errors }
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function validateNoDuplicateSlugs(schemes: { slug: string }[]): boolean {
  const seen = new Set<string>()
  for (const scheme of schemes) {
    if (seen.has(scheme.slug)) {
      return false
    }
    seen.add(scheme.slug)
  }
  return true
}
