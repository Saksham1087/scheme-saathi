/**
 * Validation layer for extracted eligibility data
 */

import type { ParsedEligibility, ExtractionMetadata } from "./types"
import { STATES, resolveState } from "./state-map"
import { VALID_SOCIAL_CATEGORIES } from "./category-map"

/** Validation warning */
export interface ValidationWarning {
  field: string
  message: string
  value: unknown
}

/**
 * Validate extracted eligibility data
 * Returns cleaned data and any warnings
 */
export function validateExtracted(
  extracted: ParsedEligibility,
  source: "regex" | "llm" | "manual" | "default"
): {
  cleaned: ParsedEligibility
  warnings: ValidationWarning[]
  metadata: ExtractionMetadata
} {
  const warnings: ValidationWarning[] = []
  const extractedFields: string[] = []
  const missingFields: string[] = []

  // Validate states
  const states = validateStates(extracted.states, warnings)
  if (states.length > 0) {
    extractedFields.push("states")
  } else {
    missingFields.push("states")
  }

  // Validate categories
  const categories = validateCategories(extracted.categories, warnings)
  if (categories.length > 0 && categories.length < 4) {
    extractedFields.push("categories")
  } else {
    missingFields.push("categories")
  }

  // Validate income
  const { minIncome, maxIncome } = validateIncome(
    extracted.minIncome,
    extracted.maxIncome,
    warnings
  )
  if (minIncome !== undefined || maxIncome !== undefined) {
    extractedFields.push("income")
  } else {
    missingFields.push("income")
  }

  // Validate age
  const { minAge, maxAge } = validateAge(
    extracted.minAge,
    extracted.maxAge,
    warnings
  )
  if (minAge !== undefined || maxAge !== undefined) {
    extractedFields.push("age")
  } else {
    missingFields.push("age")
  }

  // Validate occupations (just clean, no strict validation)
  const occupations = extracted.occupations.filter(o => o && o.length > 0)
  if (occupations.length > 0) {
    extractedFields.push("occupations")
  } else {
    missingFields.push("occupations")
  }

  // Validate purposes
  const purposes = extracted.purposes.filter(p => p && p.length > 0)
  if (purposes.length > 0) {
    extractedFields.push("purposes")
  } else {
    missingFields.push("purposes")
  }

  // Gender (optional)
  const gender = extracted.gender
  if (gender) {
    extractedFields.push("gender")
  }

  // Disability (optional)
  if (extracted.disabilityRequired !== undefined) {
    extractedFields.push("disabilityRequired")
  }

  // Calculate confidence
  const totalFields = 6 // states, categories, income, age, occupations, purposes
  const filledFields = [
    states.length > 0,
    categories.length > 0 && categories.length < 4,
    minIncome !== undefined || maxIncome !== undefined,
    minAge !== undefined || maxAge !== undefined,
    occupations.length > 0,
    purposes.length > 0,
  ].filter(Boolean).length

  const confidence = calculateConfidence(source, filledFields, totalFields)
  const needsReview = confidence < 0.5

  const cleaned: ParsedEligibility = {
    states,
    categories,
    minIncome,
    maxIncome,
    minAge,
    maxAge,
    occupations,
    purposes,
    education: extracted.education,
    gender,
    disabilityRequired: extracted.disabilityRequired,
    existingBusiness: extracted.existingBusiness,
  }

  const metadata: ExtractionMetadata = {
    confidence,
    source,
    extractedFields,
    missingFields,
    needsReview,
  }

  return { cleaned, warnings, metadata }
}

/**
 * Validate and normalize states
 */
function validateStates(
  states: string[],
  warnings: ValidationWarning[]
): string[] {
  if (!states || states.length === 0) {
    return []
  }

  // Check for ALL
  if (states.includes("ALL")) {
    return ["ALL"]
  }

  const validStates: string[] = []

  for (const state of states) {
    // Try to resolve
    const resolved = resolveState(state)

    if (resolved) {
      if (!validStates.includes(resolved)) {
        validStates.push(resolved)
      }
    } else if (STATES.includes(state)) {
      // Direct match
      if (!validStates.includes(state)) {
        validStates.push(state)
      }
    } else {
      warnings.push({
        field: "states",
        message: `Invalid state: ${state}`,
        value: state,
      })
    }
  }

  return validStates
}

/**
 * Validate and normalize categories
 */
function validateCategories(
  categories: string[],
  warnings: ValidationWarning[]
): string[] {
  if (!categories || categories.length === 0) {
    return ["SC", "ST", "OBC", "General"] // Default: all categories
  }

  const validCategories: string[] = []

  for (const cat of categories) {
    const upper = cat.toUpperCase().trim()

    if (VALID_SOCIAL_CATEGORIES.includes(upper as any)) {
      if (!validCategories.includes(upper)) {
        validCategories.push(upper)
      }
    } else {
      // Try to map
      const mapped = mapCategory(upper)
      if (mapped && !validCategories.includes(mapped)) {
        validCategories.push(mapped)
      } else {
        warnings.push({
          field: "categories",
          message: `Invalid category: ${cat}, mapped to General`,
          value: cat,
        })
        if (!validCategories.includes("General")) {
          validCategories.push("General")
        }
      }
    }
  }

  return validCategories.length > 0 ? validCategories : ["SC", "ST", "OBC", "General"]
}

/**
 * Map invalid category to valid one
 */
function mapCategory(cat: string): string | null {
  if (cat.includes("SC") || cat.includes("DALIT") || cat.includes("SCHEDULED CASTE")) {
    return "SC"
  }
  if (cat.includes("ST") || cat.includes("TRIBAL") || cat.includes("SCHEDULED TRIBE")) {
    return "ST"
  }
  if (cat.includes("OBC") || cat.includes("OTHER BACKWARD")) {
    return "OBC"
  }
  if (cat.includes("GENERAL") || cat.includes("OPEN") || cat.includes("UNRESERVED") || cat.includes("EWS")) {
    return "General"
  }
  return null
}

/**
 * Validate income range
 */
function validateIncome(
  minIncome: number | undefined,
  maxIncome: number | undefined,
  warnings: ValidationWarning[]
): { minIncome?: number; maxIncome?: number } {
  // If both are undefined, return empty
  if (minIncome === undefined && maxIncome === undefined) {
    return {}
  }

  // If only one is defined
  if (minIncome !== undefined && maxIncome === undefined) {
    // Check for reasonable values
    if (minIncome < 0) {
      warnings.push({
        field: "income",
        message: "Negative minIncome, setting to 0",
        value: minIncome,
      })
      return { minIncome: 0 }
    }
    return { minIncome }
  }

  if (minIncome === undefined && maxIncome !== undefined) {
    if (maxIncome < 0) {
      warnings.push({
        field: "income",
        message: "Negative maxIncome, setting to 0",
        value: maxIncome,
      })
      return { maxIncome: 0 }
    }
    return { maxIncome }
  }

  // Both defined - ensure min < max
  if (minIncome! > maxIncome!) {
    warnings.push({
      field: "income",
      message: `minIncome (${minIncome}) > maxIncome (${maxIncome}), swapping`,
      value: { minIncome, maxIncome },
    })
    return { minIncome: maxIncome, maxIncome: minIncome }
  }

  return { minIncome, maxIncome }
}

/**
 * Validate age range
 */
function validateAge(
  minAge: number | undefined,
  maxAge: number | undefined,
  warnings: ValidationWarning[]
): { minAge?: number; maxAge?: number } {
  // If both are undefined, return empty
  if (minAge === undefined && maxAge === undefined) {
    return {}
  }

  // If only one is defined
  if (minAge !== undefined && maxAge === undefined) {
    if (minAge < 0 || minAge > 120) {
      warnings.push({
        field: "age",
        message: `Unreasonable minAge: ${minAge}`,
        value: minAge,
      })
      return {}
    }
    return { minAge }
  }

  if (minAge === undefined && maxAge !== undefined) {
    if (maxAge < 0 || maxAge > 120) {
      warnings.push({
        field: "age",
        message: `Unreasonable maxAge: ${maxAge}`,
        value: maxAge,
      })
      return {}
    }
    return { maxAge }
  }

  // Both defined - ensure min < max
  if (minAge! > maxAge!) {
    warnings.push({
      field: "age",
      message: `minAge (${minAge}) > maxAge (${maxAge}), swapping`,
      value: { minAge, maxAge },
    })
    return { minAge: maxAge, maxAge: minAge }
  }

  // Check reasonable range
  if (minAge! < 0 || maxAge! > 120) {
    warnings.push({
      field: "age",
      message: `Unreasonable age range: ${minAge}-${maxAge}`,
      value: { minAge, maxAge },
    })
    return {}
  }

  return { minAge, maxAge }
}

/**
 * Calculate confidence score
 */
function calculateConfidence(
  source: "regex" | "llm" | "manual" | "default",
  filledFields: number,
  totalFields: number
): number {
  const baseConfidence: Record<string, number> = {
    regex: 0.85,
    llm: 0.9,
    manual: 0.95,
    default: 0.3,
  }

  const base = baseConfidence[source] || 0.5
  const fieldBonus = (filledFields / totalFields) * 0.15

  return Math.min(1.0, base + fieldBonus)
}

/**
 * Deduplicate schemes based on slug
 * Keeps the entry with higher confidence
 */
export function deduplicateSchemes<T extends { slug: string; extractionMetadata: ExtractionMetadata }>(
  schemes: T[]
): T[] {
  const seen = new Map<string, T>()

  for (const scheme of schemes) {
    const existing = seen.get(scheme.slug)
    if (!existing) {
      seen.set(scheme.slug, scheme)
    } else {
      // Keep the one with higher confidence
      if (scheme.extractionMetadata.confidence > existing.extractionMetadata.confidence) {
        seen.set(scheme.slug, scheme)
      }
    }
  }

  return [...seen.values()]
}
