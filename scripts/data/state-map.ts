/**
 * Indian States and Union Territories mapping
 * Maps abbreviations, variations, and regional groupings to standard names
 */

export const STATES: string[] = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
]

/** Standard state name → all recognized variations */
export const STATE_ALIASES: Record<string, string[]> = {
  "Andhra Pradesh": ["AP", "A.P.", "Andhra", "Andhraadesh"],
  "Arunachal Pradesh": ["AR", "Arunachal", "Arunanchal"],
  "Assam": ["AS", "Assam"],
  "Bihar": ["BR", "Bihar"],
  "Chhattisgarh": ["CG", "Chhattisgarh", "Chattisgarh"],
  "Goa": ["GA", "Goa"],
  "Gujarat": ["GJ", "Guj.", "Gujarat"],
  "Haryana": ["HR", "Haryana"],
  "Himachal Pradesh": ["HP", "Himachal"],
  "Jharkhand": ["JH", "Jharkhand"],
  "Karnataka": ["KA", "Karnataka"],
  "Kerala": ["KL", "Kerala"],
  "Madhya Pradesh": ["MP", "Madhya Pradesh"],
  "Maharashtra": ["MH", "Maharashtra"],
  "Manipur": ["MN", "Manipur"],
  "Meghalaya": ["ML", "Meghalaya"],
  "Mizoram": ["MZ", "Mizoram"],
  "Nagaland": ["NL", "Nagaland"],
  "Odisha": ["OD", "Orissa", "Odisha"],
  "Punjab": ["PB", "Punjab"],
  "Rajasthan": ["RJ", "Rajasthan"],
  "Sikkim": ["SK", "Sikkim"],
  "Tamil Nadu": ["TN", "Tamilnadu", "Tamil Nadu"],
  "Telangana": ["TS", "Telangana"],
  "Tripura": ["TR", "Tripura"],
  "Uttar Pradesh": ["UP", "Uttar Pradesh", "U.P."],
  "Uttarakhand": ["UK", "Uttarakhand", "Uttaranchal"],
  "West Bengal": ["WB", "West Bengal", "Bengal"],
  "Andaman and Nicobar": ["AN", "Andaman", "Andaman & Nicobar"],
  "Chandigarh": ["CH", "Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["DN", "DD", "Daman", "Dadra", "D & D"],
  "Delhi": ["DL", "New Delhi", "NCT", "Delhi"],
  "Jammu and Kashmir": ["JK", "J&K", "Jammu", "Kashmir"],
  "Ladakh": ["LA", "Ladakh"],
  "Lakshadweep": ["LD", "Lakshadweep"],
  "Puducherry": ["PY", "Pondicherry", "Puducherry"],
}

/** Regional groupings that expand to multiple states */
export const REGION_MAP: Record<string, string[]> = {
  "North Eastern": [
    "Assam",
    "Arunachal Pradesh",
    "Manipur",
    "Mizoram",
    "Nagaland",
    "Tripura",
    "Meghalaya",
  ],
  "North East": [
    "Assam",
    "Arunachal Pradesh",
    "Manipur",
    "Mizoram",
    "Nagaland",
    "Tripura",
    "Meghalaya",
  ],
  "NE States": [
    "Assam",
    "Arunachal Pradesh",
    "Manipur",
    "Mizoram",
    "Nagaland",
    "Tripura",
    "Meghalaya",
  ],
  "Union Territories": [
    "Andaman and Nicobar",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ],
  "UTs": [
    "Andaman and Nicobar",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ],
  "Southern States": [
    "Andhra Pradesh",
    "Karnataka",
    "Kerala",
    "Tamil Nadu",
    "Telangana",
  ],
  "Northern States": [
    "Delhi",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Ladakh",
    "Punjab",
    "Rajasthan",
    "Uttar Pradesh",
    "Uttarakhand",
  ],
  "Western States": [
    "Goa",
    "Gujarat",
    "Maharashtra",
    "Rajasthan",
  ],
  "Eastern States": [
    "Bihar",
    "Jharkhand",
    "Odisha",
    "West Bengal",
  ],
  "Central States": [
    "Chhattisgarh",
    "Madhya Pradesh",
    "Uttar Pradesh",
  ],
}

/** All India / nationwide indicators */
export const ALL_INDIA_PATTERNS = [
  "all over india",
  "across the country",
  "nationwide",
  "all india",
  "whole of india",
  "entire country",
  "pan india",
  "pan-india",
  "throughout india",
  "all states",
  "central sector",
  "government of india",
]

/**
 * Resolve a state name/abbreviation to its standard name
 * Returns null if not found
 */
export function resolveState(input: string): string | null {
  const normalized = input.trim()

  // Direct match
  if (STATES.includes(normalized)) {
    return normalized
  }

  // Check aliases
  for (const [standard, aliases] of Object.entries(STATE_ALIASES)) {
    if (aliases.some(a => a.toLowerCase() === normalized.toLowerCase())) {
      return standard
    }
  }

  // Check region mappings
  for (const [region, states] of Object.entries(REGION_MAP)) {
    if (region.toLowerCase() === normalized.toLowerCase()) {
      return states[0] // Return first state, caller should handle regions
    }
  }

  return null
}

/**
 * Check if text indicates nationwide/all-India availability
 */
export function isAllIndia(text: string): boolean {
  const lower = text.toLowerCase()
  return ALL_INDIA_PATTERNS.some(p => lower.includes(p))
}

/**
 * Check if text refers to a region group
 */
export function isRegionGroup(text: string): string | null {
  const lower = text.toLowerCase()
  for (const region of Object.keys(REGION_MAP)) {
    if (lower.includes(region.toLowerCase())) {
      return region
    }
  }
  return null
}
