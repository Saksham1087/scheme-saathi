/**
 * TypeScript interfaces for scheme data enrichment pipeline
 */

/** Parsed eligibility from natural language text */
export interface ParsedEligibility {
  states: string[]
  categories: string[]
  minIncome?: number
  maxIncome?: number
  minAge?: number
  maxAge?: number
  occupations: string[]
  purposes: string[]
  education: string[]
  gender?: string
  disabilityRequired?: boolean
  existingBusiness?: boolean
}

/** Metadata about how eligibility was extracted */
export interface ExtractionMetadata {
  confidence: number // 0.0 to 1.0
  source: "regex" | "llm" | "manual" | "default"
  extractedFields: string[]
  missingFields: string[]
  needsReview: boolean
}

/** Scheme from Kaggle CSV */
export interface KaggleScheme {
  scheme_name: string
  slug: string
  details: string
  benefits: string
  eligibility: string
  application: string
  documents: string
  level: string // "Central" or "State"
  schemeCategory: string
  tags: string
}

/** Enriched scheme output */
export interface EnrichedScheme {
  slug: string
  name: { en: string; hi: string }
  ministry: string
  category: string[]
  description: { en: string; hi: string }
  shortDescription: { en: string; hi: string }
  purpose: string
  targetBeneficiaries: string[]
  financialAssistance: {
    type: string
    minAmount: number
    maxAmount: number
    interestRate?: { min: number; max: number }
    moratoriumMonths?: { min: number; max: number }
    repaymentMonths?: { min: number; max: number }
  }
  eligibilityRules: {
    minIncome?: number
    maxIncome?: number
    minAge?: number
    maxAge?: number
    categories?: string[]
    states?: string[]
    districts?: string[]
    occupations?: string[]
    education?: string[]
    purposes?: string[]
    disabilityRequired?: boolean
    gender?: string
    existingBusiness?: boolean
  }
  eligibilityRuleIds: string[]
  requiredDocuments: Array<{
    name: string
    description: string
    mandatory: boolean
    format?: string
  }>
  applicationProcess?: string
  channelPartnerTypes: string[]
  officialUrl?: string
  source: string
  lastUpdated: string
  verified: boolean
  isActive: boolean
  level: string
  needsReview: boolean
  extractionMetadata: ExtractionMetadata
}

/** Pipeline statistics */
export interface PipelineStats {
  total: number
  processed: number
  regexExtracted: number
  llmExtracted: number
  defaulted: number
  errors: number
  confidenceDistribution: {
    high: number // >= 0.8
    medium: number // 0.5 - 0.79
    low: number // < 0.5
  }
  fieldCoverage: {
    states: number
    categories: number
    income: number
    age: number
    occupations: number
    purposes: number
  }
}

/** Progress state for resumable processing */
export interface ProgressState {
  lastProcessedIndex: number
  timestamp: string
  stats: PipelineStats
}
