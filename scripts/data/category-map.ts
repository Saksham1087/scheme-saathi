/**
 * Category mapping from Kaggle dataset categories to app categories
 * Kaggle has 19 categories, app has 8
 */

/** App's 8 categories */
export type AppCategory =
  | "business"
  | "education"
  | "agriculture"
  | "transport"
  | "housing"
  | "health"
  | "social-welfare"
  | "employment"
  | "other"

/** Valid social categories for eligibility */
export type SocialCategory = "SC" | "ST" | "OBC" | "General"

export const VALID_SOCIAL_CATEGORIES: SocialCategory[] = [
  "SC",
  "ST",
  "OBC",
  "General",
]

/** Kaggle category → App category mapping */
export const KAGGLE_TO_APP_CATEGORY: Record<string, AppCategory> = {
  // Direct matches
  "Agriculture": "agriculture",
  "Education & Learning": "education",
  "Business & Entrepreneurship": "business",
  "Health & Wellness": "health",
  "Housing & Shelter": "housing",
  "Transport & Infrastructure": "transport",

  // Merged categories
  "Social welfare & Empowerment": "social-welfare",
  "Women and Child": "social-welfare",
  "Skills & Employment": "employment",

  // Business-related merges
  "Banking": "business",
  "Financial Services and Insurance": "business",

  // Environment merges with agriculture
  "Rural & Environment": "agriculture",

  // Others
  "Sports & Culture": "other",
  "Science": "other",
  "IT & Communications": "other",
  "Utility & Sanitation": "other",
  "Travel & Tourism": "other",
  "Public Safety": "other",
  "Law & Justice": "other",
}

/**
 * Map a Kaggle category string to app category
 * Returns "other" if no mapping found
 */
export function mapKaggleCategory(kaggleCategory: string): AppCategory {
  // Try exact match
  if (KAGGLE_TO_APP_CATEGORY[kaggleCategory]) {
    return KAGGLE_TO_APP_CATEGORY[kaggleCategory]
  }

  // Try case-insensitive match
  const lower = kaggleCategory.toLowerCase()
  for (const [key, value] of Object.entries(KAGGLE_TO_APP_CATEGORY)) {
    if (key.toLowerCase() === lower) {
      return value
    }
  }

  // Try partial match
  for (const [key, value] of Object.entries(KAGGLE_TO_APP_CATEGORY)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return value
    }
  }

  return "other"
}

/**
 * Parse comma-separated Kaggle categories into app categories
 * Returns deduplicated array
 */
export function parseKaggleCategories(kaggleCategories: string): AppCategory[] {
  if (!kaggleCategories || !kaggleCategories.trim()) {
    return ["other"]
  }

  const categories = kaggleCategories
    .split(",")
    .map(c => mapKaggleCategory(c.trim()))
    .filter(c => c !== "other")

  // Deduplicate
  return [...new Set(categories.length > 0 ? categories : ["other"])]
}

/**
 * Map social category text to valid category
 */
export function mapSocialCategory(text: string): SocialCategory {
  const lower = text.toLowerCase().trim()

  if (lower.includes("sc") || lower.includes("scheduled caste") || lower.includes("dalit")) {
    return "SC"
  }
  if (lower.includes("st") || lower.includes("scheduled tribe") || lower.includes("tribal")) {
    return "ST"
  }
  if (lower.includes("obc") || lower.includes("other backward")) {
    return "OBC"
  }
  if (lower.includes("general") || lower.includes("open") || lower.includes("unreserved")) {
    return "General"
  }
  if (lower.includes("ews") || lower.includes("economically weaker")) {
    return "General" // EWS is part of General category
  }

  return "General"
}

/**
 * Check if text mentions specific social categories
 */
export function extractSocialCategories(text: string): SocialCategory[] {
  const categories: SocialCategory[] = []
  const lower = text.toLowerCase()

  if (/\b(sc|scheduled\s*caste|dalit)\b/i.test(lower)) {
    categories.push("SC")
  }
  if (/\b(st|scheduled\s*tribe|tribal)\b/i.test(lower)) {
    categories.push("ST")
  }
  if (/\b(obc|other\s*backward)\b/i.test(lower)) {
    categories.push("OBC")
  }
  if (/\b(general|open|unreserved)\b/i.test(lower)) {
    categories.push("General")
  }
  if (/\b(ews|economically\s*weaker)\b/i.test(lower)) {
    categories.push("General")
  }

  // If no specific category mentioned, return all (universal scheme)
  if (categories.length === 0) {
    return ["SC", "ST", "OBC", "General"]
  }

  return [...new Set(categories)]
}
