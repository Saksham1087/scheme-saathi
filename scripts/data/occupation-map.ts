/**
 * Occupation mapping for scheme eligibility
 * Maps various occupation terms to standardized values
 */

/** Standard occupation values used in the app */
export type Occupation =
  | "Farmer"
  | "Student"
  | "Self-employed"
  | "Salaried"
  | "Unemployed"
  | "Fisherman"
  | "Artisan"
  | "Entrepreneur"
  | "Homemaker"
  | "Retired"
  | "Other"

/** Occupation text patterns → standard occupation */
export const OCCUPATION_MAP: Record<string, Occupation[]> = {
  // Agriculture
  "farmer": ["Farmer"],
  "agricultur": ["Farmer"],
  "cultivator": ["Farmer"],
  "grower": ["Farmer"],
  "planter": ["Farmer"],
  "horticultur": ["Farmer"],
  "sericulture": ["Farmer"],
  "apiculture": ["Farmer"],
  "fisherman": ["Fisherman"],
  "fisher": ["Fisherman"],
  "fishing": ["Fisherman"],
  "aquaculture": ["Fisherman"],
  "pisciculture": ["Fisherman"],
  "animal husbandry": ["Farmer"],
  "dairy": ["Farmer"],
  "poultry": ["Farmer"],
  "livestock": ["Farmer"],
  "beekeeping": ["Farmer"],
  "sheep": ["Farmer"],
  "goat": ["Farmer"],

  // Education
  "student": ["Student"],
  "pupil": ["Student"],
  "scholar": ["Student"],
  "learner": ["Student"],
  "pursuing": ["Student"],
  "studying": ["Student"],
  "enrolled": ["Student"],
  "education": ["Student"],

  // Self-employment
  "self-employed": ["Self-employed"],
  "self employed": ["Self-employed"],
  "self employed": ["Self-employed"],
  "freelance": ["Self-employed"],
  "freelancer": ["Self-employed"],
  "independent": ["Self-employed"],
  "own business": ["Self-employed"],
  "small business": ["Self-employed"],
  "micro enterprise": ["Self-employed"],
  "micro-enterprise": ["Self-employed"],
  "shopkeeper": ["Self-employed"],
  "vendor": ["Self-employed"],
  "street vendor": ["Self-employed"],
  "hawker": ["Self-employed"],
  "trader": ["Self-employed"],
  "retailer": ["Self-employed"],
  "artisan": ["Artisan"],
  "craftsman": ["Artisan"],
  "weaver": ["Artisan"],
  "carpenter": ["Artisan"],
  "mason": ["Artisan"],
  "blacksmith": ["Artisan"],
  "potter": ["Artisan"],
  "tailor": ["Artisan"],
  "barber": ["Artisan"],
  "goldsmith": ["Artisan"],
  "silversmith": ["Artisan"],
  "embroidery": ["Artisan"],
  "handloom": ["Artisan"],
  "khadi": ["Artisan"],

  // Salaried
  "salaried": ["Salaried"],
  "employee": ["Salaried"],
  "employed": ["Salaried"],
  "worker": ["Salaried"],
  "labour": ["Salaried"],
  "labor": ["Salaried"],
  "wage": ["Salaried"],
  "service": ["Salaried"],
  "government": ["Salaried"],
  "private": ["Salaried"],
  "public sector": ["Salaried"],
  "contract": ["Salaried"],
  "daily wage": ["Salaried"],

  // Unemployed
  "unemployed": ["Unemployed"],
  "jobless": ["Unemployed"],
  "seeking": ["Unemployed"],
  "looking for": ["Unemployed"],

  // Entrepreneur
  "entrepreneur": ["Entrepreneur"],
  "startup": ["Entrepreneur"],
  "business owner": ["Entrepreneur"],
  "founder": ["Entrepreneur"],
  "ceo": ["Entrepreneur"],
  "managing director": ["Entrepreneur"],

  // Homemaker
  "homemaker": ["Homemaker"],
  "housewife": ["Homemaker"],
  "house maker": ["Homemaker"],
  "home maker": ["Homemaker"],
  "domestic": ["Homemaker"],

  // Retired
  "retired": ["Retired"],
  "pensioner": ["Retired"],
  "superannuated": ["Retired"],
}

/**
 * Extract occupations from text
 * Returns deduplicated array of standard occupations
 */
export function extractOccupations(text: string): Occupation[] {
  if (!text) return []

  const lower = text.toLowerCase()
  const found = new Set<Occupation>()

  for (const [pattern, occupations] of Object.entries(OCCUPATION_MAP)) {
    if (lower.includes(pattern)) {
      for (const occ of occupations) {
        found.add(occ)
      }
    }
  }

  return [...found]
}

/**
 * Map a single occupation text to standard value
 */
export function mapOccupation(text: string): Occupation | null {
  const occupations = extractOccupations(text)
  return occupations[0] || null
}

/** Common occupation-related keywords for regex patterns */
export const OCCUPATION_KEYWORDS = [
  "farmer",
  "agricultur",
  "cultivator",
  "student",
  "self-employed",
  "self employed",
  "freelance",
  "employee",
  "salaried",
  "worker",
  "artisan",
  "entrepreneur",
  "vendor",
  "trader",
  "shopkeeper",
  "homemaker",
  "housewife",
  "unemployed",
  "retired",
  "pensioner",
  "fisherman",
  "dairy",
  "poultry",
  "weaver",
  "carpenter",
  "tailor",
]
