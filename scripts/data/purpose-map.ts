/**
 * Purpose mapping for scheme eligibility
 * Maps loan/project purposes to standardized values
 */

/** Standard purpose values */
export type Purpose =
  | "agriculture"
  | "dairy"
  | "poultry"
  | "fisheries"
  | "food-processing"
  | "manufacturing"
  | "service"
  | "trading"
  | "education"
  | "housing"
  | "health"
  | "transport"
  | "energy"
  | "water"
  | "environment"
  | "technology"
  | "handloom"
  | "crafts"
  | "other"

/** Purpose text patterns → standard purpose */
export const PURPOSE_MAP: Record<string, Purpose[]> = {
  // Agriculture
  "agricultur": ["agriculture"],
  "farm": ["agriculture"],
  "cultivation": ["agriculture"],
  "crop": ["agriculture"],
  "farming": ["agriculture"],
  "horticultur": ["agriculture"],
  "sericulture": ["agriculture"],
  "apiculture": ["agriculture"],
  "irrigation": ["agriculture"],
  "fertiliz": ["agriculture"],
  "seed": ["agriculture"],
  "harvest": ["agriculture"],
  "plantation": ["agriculture"],
  "organic": ["agriculture"],
  "greenhouse": ["agriculture"],
  "polyhouse": ["agriculture"],
  "nursery": ["agriculture"],

  // Dairy
  "dairy": ["dairy"],
  "milk": ["dairy"],
  "cattle": ["dairy"],
  "buffalo": ["dairy"],
  "cow": ["dairy"],
  "ghee": ["dairy"],
  "butter": ["dairy"],
  "cheese": ["dairy"],
  "yogurt": ["dairy"],
  "paneer": ["dairy"],

  // Poultry
  "poultry": ["poultry"],
  "chicken": ["poultry"],
  "hen": ["poultry"],
  "egg": ["poultry"],
  "broiler": ["poultry"],
  "layer": ["poultry"],
  "duck": ["poultry"],
  "quail": ["poultry"],
  "turkey": ["poultry"],

  // Fisheries
  "fish": ["fisheries"],
  "fisher": ["fisheries"],
  "fishing": ["fisheries"],
  "aquaculture": ["fisheries"],
  "pisciculture": ["fisheries"],
  "shrimp": ["fisheries"],
  "prawn": ["fisheries"],
  "mariculture": ["fisheries"],
  "boat": ["fisheries"],

  // Food processing - only match when clearly a purpose
  "food processing": ["food-processing"],
  "food-processing": ["food-processing"],
  "food processing unit": ["food-processing"],
  "food processing enterprise": ["food-processing"],
  "cold storage": ["food-processing"],
  "cold chain": ["food-processing"],
  "flour mill": ["food-processing"],
  "rice mill": ["food-processing"],
  "oil mill": ["food-processing"],
  "spice processing": ["food-processing"],
  "fruit processing": ["food-processing"],
  "vegetable processing": ["food-processing"],
  "meat processing": ["food-processing"],
  "bakery unit": ["food-processing"],
  "confectionery unit": ["food-processing"],

  // Manufacturing
  "manufactur": ["manufacturing"],
  "production": ["manufacturing"],
  "factory": ["manufacturing"],
  "unit": ["manufacturing"],
  "industry": ["manufacturing"],
  "industrial": ["manufacturing"],
  "plant": ["manufacturing"],
  "machinery": ["manufacturing"],
  "equipment": ["manufacturing"],
  "tool": ["manufacturing"],
  "micro enterprise": ["manufacturing"],
  "small enterprise": ["manufacturing"],

  // Service
  "service": ["service"],
  "repair": ["service"],
  "maintenance": ["service"],
  "salon": ["service"],
  "beauty": ["service"],
  "tailoring": ["service"],
  "laundry": ["service"],
  "cleaning": ["service"],
  "catering": ["service"],
  "hospitality": ["service"],
  "tourism": ["service"],
  "travel": ["service"],
  "hotel": ["service"],
  "restaurant": ["service"],
  "cafe": ["service"],
  "gym": ["service"],
  "fitness": ["service"],
  "coaching": ["service"],
  "tuition": ["service"],
  "coaching center": ["service"],

  // Trading
  "trading": ["trading"],
  "retail": ["trading"],
  "wholesale": ["trading"],
  "shop": ["trading"],
  "store": ["trading"],
  "market": ["trading"],
  "vendor": ["trading"],
  "hawking": ["trading"],
  "street vending": ["trading"],
  "ecommerce": ["trading"],
  "e-commerce": ["trading"],
  "online": ["trading"],

  // Education
  "education": ["education"],
  "study": ["education"],
  "learning": ["education"],
  "training": ["education"],
  "course": ["education"],
  "degree": ["education"],
  "diploma": ["education"],
  "school": ["education"],
  "college": ["education"],
  "university": ["education"],
  "tuition": ["education"],
  "coaching": ["education"],
  "exam": ["education"],
  "competitive": ["education"],
  "professional": ["education"],

  // Housing
  "housing": ["housing"],
  "house": ["housing"],
  "home": ["housing"],
  "residence": ["housing"],
  "dwelling": ["housing"],
  "construction": ["housing"],
  "building": ["housing"],
  "renovation": ["housing"],
  "repair": ["housing"],
  "extension": ["housing"],
  "flat": ["housing"],
  "apartment": ["housing"],
  "plot": ["housing"],
  "land": ["housing"],

  // Health
  "health": ["health"],
  "medical": ["health"],
  "hospital": ["health"],
  "treatment": ["health"],
  "surgery": ["health"],
  "medicine": ["health"],
  "pharmacy": ["health"],
  "clinic": ["health"],
  "diagnostic": ["health"],
  "pathology": ["health"],
  "ambulance": ["health"],
  "health insurance": ["health"],

  // Transport
  "transport": ["transport"],
  "vehicle": ["transport"],
  "car": ["transport"],
  "auto": ["transport"],
  "auto-rickshaw": ["transport"],
  "taxi": ["transport"],
  "bus": ["transport"],
  "truck": ["transport"],
  "two-wheeler": ["transport"],
  "motorcycle": ["transport"],
  "scooter": ["transport"],
  "e-rickshaw": ["transport"],
  "loading": ["transport"],
  "unloading": ["transport"],
  "logistics": ["transport"],
  "delivery": ["transport"],
  "courier": ["transport"],

  // Energy
  "energy": ["energy"],
  "solar": ["energy"],
  "power": ["energy"],
  "electricity": ["energy"],
  "biogas": ["energy"],
  "wind": ["energy"],
  "renewable": ["energy"],
  "biofuel": ["energy"],
  "fuel": ["energy"],
  "diesel": ["energy"],
  "petrol": ["energy"],
  "lpg": ["energy"],
  "cng": ["energy"],

  // Water - only match when clearly a purpose
  "water supply": ["water"],
  "water management": ["water"],
  "borewell": ["water"],
  "tube well": ["water"],
  "water pump": ["water"],
  "water treatment": ["water"],
  "rainwater harvesting": ["water"],
  "drip irrigation": ["water"],
  "sprinkler system": ["water"],

  // Environment - only match when clearly a purpose
  "waste management": ["environment"],
  "recycling unit": ["environment"],
  "compost unit": ["environment"],
  "vermicompost unit": ["environment"],
  "tree plantation": ["environment"],
  "afforestation": ["environment"],

  // Technology - only match when clearly a purpose
  "technology enterprise": ["technology"],
  "it enterprise": ["technology"],
  "software company": ["technology"],
  "digital enterprise": ["technology"],
  "tech startup": ["technology"],

  // Handloom
  "handloom": ["handloom"],
  "weaving": ["handloom"],
  "textile": ["handloom"],
  "fabric": ["handloom"],
  "cloth": ["handloom"],
  "yarn": ["handloom"],
  "spinning": ["handloom"],
  "dyeing": ["handloom"],
  "printing": ["handloom"],
  "embroidery": ["handloom"],
  "khadi": ["handloom"],

  // Crafts
  "craft": ["crafts"],
  "handicraft": ["crafts"],
  "artisan": ["crafts"],
  "pottery": ["crafts"],
  "ceramic": ["crafts"],
  "woodwork": ["crafts"],
  "carpentry": ["crafts"],
  "metalwork": ["crafts"],
  "jewelry": ["crafts"],
  "bamboo": ["crafts"],
  "cane": ["crafts"],
  "leather": ["crafts"],
}

/**
 * Extract purposes from text
 * Returns deduplicated array of standard purposes
 */
export function extractPurposes(text: string): Purpose[] {
  if (!text) return []

  const lower = text.toLowerCase()
  const found = new Set<Purpose>()

  for (const [pattern, purposes] of Object.entries(PURPOSE_MAP)) {
    if (lower.includes(pattern)) {
      for (const purpose of purposes) {
        found.add(purpose)
      }
    }
  }

  return [...found]
}

/**
 * Map a single purpose text to standard value
 */
export function mapPurpose(text: string): Purpose | null {
  const purposes = extractPurposes(text)
  return purposes[0] || null
}

/** Common purpose keywords for regex patterns */
export const PURPOSE_KEYWORDS = [
  "agriculture",
  "farming",
  "dairy",
  "poultry",
  "fisheries",
  "processing",
  "manufacturing",
  "service",
  "trading",
  "retail",
  "education",
  "housing",
  "health",
  "transport",
  "vehicle",
  "solar",
  "energy",
  "handloom",
  "craft",
  "business",
  "enterprise",
  "project",
]
