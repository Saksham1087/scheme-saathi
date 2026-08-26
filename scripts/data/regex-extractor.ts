/**
 * Regex-based extraction of eligibility fields from natural language text
 */

import type { ParsedEligibility } from "./types"
import {
  resolveState,
  isAllIndia,
  isRegionGroup,
  REGION_MAP,
  STATES,
} from "./state-map"
import { extractSocialCategories } from "./category-map"
import { extractOccupations } from "./occupation-map"
import { extractPurposes } from "./purpose-map"

// ─── Income Patterns ────────────────────────────────────────────────

const INCOME_PATTERNS = [
  // "income not exceeding ₹1,50,000"
  /income\s+(?:not\s+)?exceeding\s+₹?\s*([\d,]+)/i,
  // "annual income up to ₹1.5 lakh"
  /(?:annual\s+)?income\s+(?:up\s+to|not\s+more\s+than|less\s+than)\s+₹?\s*([\d,]+(?:\.\d+)?)\s*(?:lakh|lac)/i,
  // "income limit ₹1,50,000"
  /income\s+limit\s+₹?\s*([\d,]+)/i,
  // "income ceiling of ₹1,50,000"
  /income\s+ceiling\s+(?:of\s+)?₹?\s*([\d,]+)/i,
  // "family income below ₹1,50,000"
  /(?:family\s+)?income\s+(?:below|under|less\s+than)\s+₹?\s*([\d,]+)/i,
  // "income ₹1,50,000 per annum"
  /income\s+₹?\s*([\d,]+)\s+per\s+(?:annum|year|p\.?a\.?)/i,
  // "income of ₹1.5 lakh per annum"
  /income\s+of\s+₹?\s*([\d,]+(?:\.\d+)?)\s*(?:lakh|lac)\s+per\s+(?:annum|year)/i,
  // "₹1,50,000 per annum"
  /₹?\s*([\d,]+(?:\.\d+)?)\s*(?:lakh|lac)\s+(?:per\s+)?(?:annum|year|p\.?a\.?)/i,
  // "income should not exceed ₹1,50,000"
  /income\s+should\s+not\s+exceed\s+₹?\s*([\d,]+)/i,
  // "annual income of ₹1,50,000"
  /(?:annual\s+)?income\s+of\s+₹?\s*([\d,]+)/i,
  // "income between ₹X and ₹Y"
  /income\s+between\s+₹?\s*([\d,]+)\s+and\s+₹?\s*([\d,]+)/i,
  // "income range ₹X to ₹Y"
  /income\s+range\s+₹?\s*([\d,]+)\s+to\s+₹?\s*([\d,]+)/i,
]

const LAKH_MULTIPLIER = 100000
const CRORE_MULTIPLIER = 10000000

/**
 * Parse Indian currency format (1,50,000 or 150000)
 */
function parseIndianCurrency(amount: string): number {
  // Remove commas and parse
  const clean = amount.replace(/,/g, "")
  return parseInt(clean, 10)
}

/**
 * Extract income limits from text
 */
export function extractIncome(text: string): { minIncome?: number; maxIncome?: number } {
  const lower = text.toLowerCase()

  // Check for lakh/crore mentions
  const lakhMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac)/)
  const croreMatch = lower.match(/(\d+(?:\.\d+)?)\s*crore/)

  for (const pattern of INCOME_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      let amount = parseIndianCurrency(match[1])

      // Check if next group is in lakhs
      if (lakhMatch && !match[2]) {
        amount = Math.round(amount * LAKH_MULTIPLIER)
      }
      if (croreMatch && !match[2]) {
        amount = Math.round(amount * CRORE_MULTIPLIER)
      }

      // If there's a second capture group, it's a range
      if (match[2]) {
        let maxAmount = parseIndianCurrency(match[2])
        if (lakhMatch) {
          maxAmount = Math.round(maxAmount * LAKH_MULTIPLIER)
        }
        return { minIncome: amount, maxAmount }
      }

      // Single value = max income
      return { maxIncome: amount }
    }
  }

  // Check for simple "₹X" patterns near income-related words
  const incomeContext = lower.match(/income.*?₹\s*([\d,]+)|₹\s*([\d,]+).*?income/)
  if (incomeContext) {
    const amount = parseIndianCurrency(incomeContext[1] || incomeContext[2])
    if (amount > 0) {
      return { maxIncome: amount }
    }
  }

  return {}
}

// ─── Age Patterns ───────────────────────────────────────────────────

const AGE_PATTERNS = [
  // "age 18-45" or "age 18 to 45"
  /age\s+(?:between\s+)?(\d+)\s*[-–to]+\s*(\d+)/i,
  // "between 18 and 45 years"
  /between\s+(\d+)\s+and\s+(\d+)\s+years/i,
  // "18-45 years"
  /(\d+)\s*[-–to]+\s*(\d+)\s+years/i,
  // "above 18 years"
  /(?:above|over|more\s+than|min(?:imum)?|at\s+least)\s+(\d+)\s+years/i,
  // "below 45 years"
  /(?:below|under|less\s+than|max(?:imum)?|not\s+more\s+than)\s+(\d+)\s+years/i,
  // "minimum age 18"
  /min(?:imum)?\s+age\s+(\d+)/i,
  // "maximum age 45"
  /max(?:imum)?\s+age\s+(\d+)/i,
  // "age limit 45"
  /age\s+limit\s+(\d+)/i,
  // "aged 18-45"
  /aged\s+(\d+)\s*[-–to]+\s*(\d+)/i,
  // "18 years and above"
  /(\d+)\s+years?\s+and\s+(?:above|over)/i,
  // "not less than 18 years"
  /not\s+less\s+than\s+(\d+)\s+years/i,
  // "not more than 45 years"
  /not\s+more\s+than\s+(\d+)\s+years/i,
]

/**
 * Extract age range from text
 */
export function extractAge(text: string): { minAge?: number; maxAge?: number } {
  for (const pattern of AGE_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      const num1 = parseInt(match[1], 10)
      const num2 = match[2] ? parseInt(match[2], 10) : undefined

      if (num2 !== undefined) {
        // Range: ensure min < max
        return num1 < num2
          ? { minAge: num1, maxAge: num2 }
          : { minAge: num2, maxAge: num1 }
      }

      // Single value - determine if min or max based on context
      const context = text.substring(
        Math.max(0, (match.index || 0) - 20),
        Math.min(text.length, (match.index || 0) + match[0].length + 20)
      ).toLowerCase()

      if (/above|over|more|min|least|at\s+least/.test(context)) {
        return { minAge: num1 }
      }
      if (/below|under|less|max|not\s+more/.test(context)) {
        return { maxAge: num1 }
      }

      // Default: treat as max
      return { maxAge: num1 }
    }
  }

  return {}
}

// ─── State Extraction ───────────────────────────────────────────────

/**
 * Extract states from text
 */
export function extractStates(text: string): string[] {
  const states: string[] = []

  // Check for all India first
  if (isAllIndia(text)) {
    return ["ALL"]
  }

  // Check for regional groups
  const region = isRegionGroup(text)
  if (region && REGION_MAP[region]) {
    return REGION_MAP[region]
  }

  // Check for each known state
  for (const state of STATES) {
    // Check exact state name
    if (text.includes(state)) {
      states.push(state)
      continue
    }

    // Check common abbreviations
    const patterns = getStatePatterns(state)
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        states.push(state)
        break
      }
    }
  }

  // Also try to resolve any "of X" patterns
  const ofPattern = /(?:of|in|from|resident\s+of|native\s+of)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g
  let match
  while ((match = ofPattern.exec(text)) !== null) {
    const resolved = resolveState(match[1])
    if (resolved && !states.includes(resolved)) {
      states.push(resolved)
    }
  }

  return [...new Set(states)]
}

/**
 * Get regex patterns for a state name
 */
function getStatePatterns(state: string): RegExp[] {
  const patterns: RegExp[] = []

  // Direct name
  patterns.push(new RegExp(`\\b${escapeRegex(state)}\\b`, "i"))

  // Common abbreviations
  const abbrevs: Record<string, string[]> = {
    "Andhra Pradesh": ["AP", "A\\.P\\."],
    "Arunachal Pradesh": ["AR"],
    "Assam": ["AS"],
    "Bihar": ["BR"],
    "Chhattisgarh": ["CG"],
    "Goa": ["GA"],
    "Gujarat": ["GJ", "Guj"],
    "Haryana": ["HR"],
    "Himachal Pradesh": ["HP"],
    "Jharkhand": ["JH"],
    "Karnataka": ["KA"],
    "Kerala": ["KL"],
    "Madhya Pradesh": ["MP"],
    "Maharashtra": ["MH"],
    "Manipur": ["MN"],
    "Meghalaya": ["ML"],
    "Mizoram": ["MZ"],
    "Nagaland": ["NL"],
    "Odisha": ["OD", "Orissa"],
    "Punjab": ["PB"],
    "Rajasthan": ["RJ"],
    "Sikkim": ["SK"],
    "Tamil Nadu": ["TN"],
    "Telangana": ["TS"],
    "Tripura": ["TR"],
    "Uttar Pradesh": ["UP", "U\\.P\\."],
    "Uttarakhand": ["UK", "Uttaranchal"],
    "West Bengal": ["WB"],
    "Delhi": ["DL", "NCT"],
    "Jammu and Kashmir": ["J&K", "JK"],
    "Puducherry": ["PY", "Pondicherry"],
  }

  if (abbrevs[state]) {
    for (const abbrev of abbrevs[state]) {
      patterns.push(new RegExp(`\\b${abbrev}\\b`, "i"))
    }
  }

  return patterns
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// ─── Gender Patterns ────────────────────────────────────────────────

const GENDER_PATTERNS = [
  { pattern: /\b(?:for\s+)?(?:women|woman|female|girl|daughter|wife|mother|sister|lady|ladies)\b/i, gender: "female" },
  { pattern: /\b(?:for\s+)?(?:men|man|male|boy|son|husband|father|brother|gentleman)\b/i, gender: "male" },
  { pattern: /\bgender\s*:\s*(?:for\s+)?(male|female|women|men)\b/i, gender: "$1" },
]

/**
 * Extract gender requirement from text
 */
export function extractGender(text: string): string | undefined {
  for (const { pattern, gender } of GENDER_PATTERNS) {
    if (pattern.test(text)) {
      if (gender === "female" || gender === "women") return "female"
      if (gender === "male" || gender === "men") return "male"
    }
  }
  return undefined
}

// ─── Disability Patterns ────────────────────────────────────────────

const DISABILITY_PATTERNS = [
  /\b(?:for\s+)?(?:disabled|disability|handicap|handicapped|differently\s+abled|divyang|divyangjan|pwd|p\.w\.d\.|person\s+with\s+disability)\b/i,
  /\bdisability\s+required\b/i,
  /\bonly\s+for\s+disabled\b/i,
]

/**
 * Extract disability requirement from text
 */
export function extractDisability(text: string): boolean | undefined {
  for (const pattern of DISABILITY_PATTERNS) {
    if (pattern.test(text)) {
      return true
    }
  }
  return undefined
}

// ─── Existing Business Patterns ─────────────────────────────────────

const BUSINESS_PATTERNS = [
  { pattern: /\b(?:new|startup|first[\s-]time|newly?\s+established)\s+(?:business|enterprise|venture|entrepreneur)\b/i, existing: false },
  { pattern: /\b(?:existing|already\s+established|running)\s+(?:business|enterprise|unit)\b/i, existing: true },
  { pattern: /\bfirst[\s-]generation\s+entrepreneur\b/i, existing: false },
]

/**
 * Extract existing business requirement from text
 */
export function extractExistingBusiness(text: string): boolean | undefined {
  for (const { pattern, existing } of BUSINESS_PATTERNS) {
    if (pattern.test(text)) {
      return existing
    }
  }
  return undefined
}

// ─── Main Extraction Function ───────────────────────────────────────

/**
 * Extract all eligibility fields from text using regex
 */
export function extractWithRegex(text: string): ParsedEligibility {
  const income = extractIncome(text)
  const age = extractAge(text)
  const states = extractStates(text)
  const categories = extractSocialCategories(text)
  const occupations = extractOccupations(text)
  const purposes = extractPurposes(text)
  const gender = extractGender(text)
  const disability = extractDisability(text)
  const existingBusiness = extractExistingBusiness(text)

  // Education extraction
  const education: string[] = []
  const eduPatterns = [
    { pattern: /\b(?:class|standard)\s*(\d+)\b/i, format: (m: RegExpMatchArray) => `Class ${m[1]}` },
    { pattern: /\b(\d+)(?:th|st|nd|rd)\s+standard\b/i, format: (m: RegExpMatchArray) => `Class ${m[1]}` },
    { pattern: /\bmatric(?:ulation)?\b/i, format: () => "Matriculation" },
    { pattern: /\bsecondary\b/i, format: () => "Secondary" },
    { pattern: /\bsenior\s+secondary\b/i, format: () => "Senior Secondary" },
    { pattern: /\bgraduate\b/i, format: () => "Graduate" },
    { pattern: /\bpost[\s-]graduate\b/i, format: () => "Post-Graduate" },
    { pattern: /\bPh\.?D\.?\b/i, format: () => "Ph.D." },
    { pattern: /\bdiploma\b/i, format: () => "Diploma" },
    { pattern: /\bdegree\b/i, format: () => "Degree" },
  ]

  for (const { pattern, format } of eduPatterns) {
    const match = text.match(pattern)
    if (match) {
      education.push(format(match))
    }
  }

  return {
    states,
    categories,
    minIncome: income.minIncome,
    maxIncome: income.maxIncome,
    minAge: age.minAge,
    maxAge: age.maxAge,
    occupations,
    purposes,
    education: [...new Set(education)],
    gender,
    disabilityRequired: disability,
    existingBusiness,
  }
}

/**
 * Calculate confidence score based on extracted fields
 */
export function calculateConfidence(extracted: ParsedEligibility): number {
  let score = 0
  let total = 0

  // States (important)
  total += 2
  if (extracted.states.length > 0) score += 2

  // Categories (important)
  total += 2
  if (extracted.categories.length > 0 && extracted.categories.length < 4) {
    score += 2 // Specific categories = high value
  } else if (extracted.categories.length === 4) {
    score += 1 // All categories = less specific
  }

  // Income
  total += 1.5
  if (extracted.minIncome !== undefined || extracted.maxIncome !== undefined) {
    score += 1.5
  }

  // Age
  total += 1
  if (extracted.minAge !== undefined || extracted.maxAge !== undefined) {
    score += 1
  }

  // Occupations
  total += 1
  if (extracted.occupations.length > 0) score += 1

  // Purposes
  total += 1
  if (extracted.purposes.length > 0) score += 1

  // Gender
  total += 0.5
  if (extracted.gender) score += 0.5

  // Disability
  total += 0.5
  if (extracted.disabilityRequired !== undefined) score += 0.5

  return Math.min(1.0, score / total)
}
