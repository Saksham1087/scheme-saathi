/**
 * Output generation for enriched scheme data
 * Generates per-category JSON files matching existing schema
 */

import * as fs from "fs"
import * as path from "path"
import type { EnrichedScheme, ExtractionMetadata, PipelineStats } from "./types"

/** Category to file mapping */
const CATEGORY_FILES: Record<string, string> = {
  "agriculture": "agriculture.json",
  "business": "business.json",
  "education": "education.json",
  "employment": "employment.json",
  "health": "health.json",
  "housing": "housing.json",
  "social-welfare": "social-welfare.json",
  "transport": "transport.json",
  "other": "other.json",
}

/**
 * Generate scheme output matching existing schema
 */
export function generateSchemeOutput(
  kaggleData: {
    scheme_name: string
    slug: string
    details: string
    benefits: string
    eligibility: string
    application: string
    documents: string
    level: string
    schemeCategory: string
    tags: string
  },
  eligibilityRules: EnrichedScheme["eligibilityRules"],
  metadata: ExtractionMetadata
): EnrichedScheme {
  // Parse documents
  const documents = parseDocuments(kaggleData.documents)

  // Parse benefits for financial assistance
  const financialAssistance = parseFinancialAssistance(kaggleData.benefits)

  // Generate short description (first 150 chars of details)
  const shortDesc = kaggleData.details.length > 150
    ? kaggleData.details.substring(0, 147) + "..."
    : kaggleData.details

  return {
    slug: kaggleData.slug,
    name: {
      en: kaggleData.scheme_name,
      hi: "", // No Hindi from Kaggle
    },
    ministry: extractMinistry(kaggleData.details),
    category: [mapCategoryFromKaggle(kaggleData.schemeCategory)],
    description: {
      en: kaggleData.details,
      hi: "",
    },
    shortDescription: {
      en: shortDesc,
      hi: "",
    },
    purpose: kaggleData.tags || "Various purposes",
    targetBeneficiaries: extractBeneficiaries(kaggleData.eligibility),
    financialAssistance,
    eligibilityRules,
    eligibilityRuleIds: [],
    requiredDocuments: documents,
    applicationProcess: kaggleData.application,
    channelPartnerTypes: extractChannelPartners(kaggleData.application),
    officialUrl: undefined,
    source: "kaggle",
    lastUpdated: new Date().toISOString().split("T")[0],
    verified: false,
    isActive: true,
    level: kaggleData.level,
    needsReview: metadata.needsReview,
    extractionMetadata: metadata,
  }
}

/**
 * Parse documents from text
 */
function parseDocuments(docText: string): Array<{
  name: string
  description: string
  mandatory: boolean
  format?: string
}> {
  if (!docText || !docText.trim()) {
    return []
  }

  const docs: Array<{
    name: string
    description: string
    mandatory: boolean
    format?: string
  }> = []

  // Split by common delimiters
  const lines = docText
    .split(/[,;.\n]/)
    .map(l => l.trim())
    .filter(l => l.length > 3)

  for (const line of lines) {
    // Check if mandatory
    const mandatory = !/optional|not\s+required|if\s+applicable/i.test(line)

    // Extract document name (first part before colon or dash)
    const nameMatch = line.match(/^([^:-]+)[:\-]/)
    const name = nameMatch ? nameMatch[1].trim() : line.substring(0, 50)

    // Determine format
    let format: string | undefined
    if (/photo|jpeg|jpg|png/i.test(line)) {
      format = "JPEG"
    } else if (/pdf/i.test(line)) {
      format = "PDF"
    }

    docs.push({
      name: name.substring(0, 100),
      description: line.substring(0, 200),
      mandatory,
      format,
    })
  }

  return docs.slice(0, 10) // Limit to 10 documents
}

/**
 * Parse financial assistance from benefits text
 */
function parseFinancialAssistance(
  benefitsText: string
): EnrichedScheme["financialAssistance"] {
  const result: EnrichedScheme["financialAssistance"] = {
    type: "grant",
    minAmount: 0,
    maxAmount: 0,
  }

  if (!benefitsText) return result

  // Extract amounts
  const amounts = benefitsText.match(/₹\s*([\d,]+(?:\.\d+)?)/g)
  if (amounts) {
    const parsedAmounts = amounts
      .map(a => parseInt(a.replace(/[₹,\s]/g, ""), 10))
      .filter(a => !isNaN(a) && a > 0)

    if (parsedAmounts.length > 0) {
      result.minAmount = Math.min(...parsedAmounts)
      result.maxAmount = Math.max(...parsedAmounts)
    }
  }

  // Determine type
  if (/subsidy|grant|incentive/i.test(benefitsText)) {
    result.type = "subsidy"
  } else if (/loan|credit|financing/i.test(benefitsText)) {
    result.type = "loan"
  } else if (/insurance|coverage|protection/i.test(benefitsText)) {
    result.type = "insurance"
  }

  // Extract interest rate
  const rateMatch = benefitsText.match(/(\d+(?:\.\d+)?)\s*%\s*(?:interest|per\s*annum|p\.?a\.?)/i)
  if (rateMatch) {
    const rate = parseFloat(rateMatch[1])
    if (rate > 0 && rate < 30) {
      result.interestRate = { min: rate, max: rate }
    }
  }

  return result
}

/**
 * Extract ministry from details text
 */
function extractMinistry(details: string): string {
  const ministryPatterns = [
    /(?:ministry|min)\s+(?:of\s+)?([^,.]+)/i,
    /(?:department|dept)\.?\s+(?:of\s+)?([^,.]+)/i,
    /(?:government|govt)\.?\s+(?:of\s+)?([^.]+)/i,
  ]

  for (const pattern of ministryPatterns) {
    const match = details.match(pattern)
    if (match) {
      return match[1].trim().substring(0, 100)
    }
  }

  return "Government of India"
}

/**
 * Extract target beneficiaries from eligibility text
 */
function extractBeneficiaries(eligibilityText: string): string[] {
  const beneficiaries: string[] = []

  const patterns = [
    /(?:for|to|available to|open to)\s+([^,.]+)/gi,
    /(?:beneficiar|target|eligible)\s*:?\s*([^,.]+)/gi,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(eligibilityText)) !== null) {
      const text = match[1].trim()
      if (text.length > 3 && text.length < 100) {
        beneficiaries.push(text)
      }
    }
  }

  return [...new Set(beneficiaries)].slice(0, 5)
}

/**
 * Extract channel partners from application text
 */
function extractChannelPartners(applicationText: string): string[] {
  const partners: string[] = []

  const patterns = [
    /(?:bank|branch|office|centre|center)/gi,
    /CSC/gi,
    /KVIC/gi,
    /DIC/gi,
    /NSIC/gi,
    /NABARD/gi,
  ]

  for (const pattern of patterns) {
    const matches = applicationText.match(pattern)
    if (matches) {
      for (const match of matches) {
        if (!partners.includes(match)) {
          partners.push(match)
        }
      }
    }
  }

  return partners.length > 0 ? partners : ["Banks", "CSC"]
}

/**
 * Map Kaggle category to app category
 */
function mapCategoryFromKaggle(kaggleCategory: string): string {
  const mapping: Record<string, string> = {
    "Agriculture": "agriculture",
    "Business & Entrepreneurship": "business",
    "Education & Learning": "education",
    "Health & Wellness": "health",
    "Housing & Shelter": "housing",
    "Social welfare & Empowerment": "social-welfare",
    "Skills & Employment": "employment",
    "Transport & Infrastructure": "transport",
    "Women and Child": "social-welfare",
    "Banking": "business",
    "Financial Services and Insurance": "business",
    "Rural & Environment": "agriculture",
    "Sports & Culture": "other",
    "Science": "other",
    "IT & Communications": "other",
    "Utility & Sanitation": "other",
    "Travel & Tourism": "other",
    "Public Safety": "other",
    "Law & Justice": "other",
  }

  // Try exact match
  if (mapping[kaggleCategory]) {
    return mapping[kaggleCategory]
  }

  // Try case-insensitive
  for (const [key, value] of Object.entries(mapping)) {
    if (key.toLowerCase() === kaggleCategory.toLowerCase()) {
      return value
    }
  }

  return "other"
}

/**
 * Write enriched schemes to category files
 */
export function writeCategoryFiles(
  schemes: EnrichedScheme[],
  outputDir: string
): void {
  // Group by category
  const byCategory: Record<string, EnrichedScheme[]> = {}

  for (const scheme of schemes) {
    for (const cat of scheme.category) {
      if (!byCategory[cat]) {
        byCategory[cat] = []
      }
      byCategory[cat].push(scheme)
    }
  }

  // Write each category file
  for (const [category, categorySchemes] of Object.entries(byCategory)) {
    const filename = CATEGORY_FILES[category] || `${category}.json`
    const filepath = path.join(outputDir, filename)

    // Remove extraction metadata for cleaner output
    const cleanSchemes = categorySchemes.map(s => {
      const { extractionMetadata, needsReview, level, ...rest } = s
      return {
        ...rest,
        level,
        needsReview,
      }
    })

    fs.writeFileSync(filepath, JSON.stringify(cleanSchemes, null, 2))
    console.log(`[Output] Written ${cleanSchemes.length} schemes to ${filename}`)
  }
}

/**
 * Write pipeline statistics
 */
export function writeStats(
  stats: PipelineStats,
  outputDir: string
): void {
  const statsPath = path.join(outputDir, "enrichment-stats.json")
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2))
  console.log(`[Output] Stats written to ${statsPath}`)
}
