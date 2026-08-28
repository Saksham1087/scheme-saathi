import { Timestamp } from "firebase/firestore"

export type SchemeCategory =
  | "business"
  | "education"
  | "agriculture"
  | "transport"
  | "housing"
  | "health"
  | "social-welfare"
  | "employment"
  | "other"

export type FinancialAssistanceType = "loan" | "grant" | "subsidy" | "insurance"

export type DataSourceTier = "official" | "open-dataset" | "curated" | "synthetic"

export type EligibilityField =
  | "income"
  | "age"
  | "category"
  | "state"
  | "occupation"
  | "education"
  | "purpose"
  | "disability"
  | "gender"

export type RuleOperator =
  | "=="
  | "!="
  | "<="
  | ">="
  | "<"
  | ">"
  | "in"
  | "notIn"
  | "between"

export interface FinancialAssistance {
  type: FinancialAssistanceType
  minAmount: number
  maxAmount: number
  interestRate?: { min: number; max: number }
  moratoriumMonths?: { min: number; max: number }
  repaymentMonths?: { min: number; max: number }
  coverageMaxPct?: number
}

export interface EligibilityRule {
  field: EligibilityField
  operator: RuleOperator
  value: string | number | boolean | string[]
  unit?: string
  description?: { en: string; hi: string }
}

export interface EligibilityRuleSet {
  id: string
  schemeId: string
  rules: EligibilityRule[]
  logic: "AND" | "OR"
  description?: { en: string; hi: string }
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface RequiredDocument {
  name: string
  description: string
  mandatory: boolean
  format?: string
}

export interface Category {
  id: string
  name: { en: string; hi: string }
  icon: string
  schemeCount?: number
}

export interface SchemeDocument {
  id: string
  slug: string
  name: { en: string; hi: string; mr?: string }
  ministry: string
  department?: string
  category: SchemeCategory[]
  description: { en: string; hi: string; mr?: string }
  shortDescription: { en: string; hi: string; mr?: string }
  purpose: string
  targetBeneficiaries: string[]
  financialAssistance: FinancialAssistance
  eligibilityRules: SchemeEligibilityRules
  eligibilityRuleIds: string[]
  requiredDocuments: RequiredDocument[]
  applicationProcess?: string
  channelPartnerTypes: string[]
  officialUrl?: string
  source: DataSourceTier
  lastUpdated: string
  verified: boolean
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface SchemeEligibilityRules {
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
  customRules?: Array<{
    field: EligibilityField
    operator: RuleOperator
    value: string | number | boolean | string[]
    description?: { en: string; hi: string }
  }>
}

export interface SchemeRule {
  id: string
  schemeId: string
  rules: SchemeEligibilityRules
  weight?: Record<string, number>
  createdAt: Timestamp
  updatedAt: Timestamp
}

/** Legacy compat — minimal scheme for existing matching logic */
export interface Scheme {
  id: string
  name: { en: string; hi: string }
  description: { en: string; hi: string }
  type: "micro" | "term" | "education"
  maxProjectCost: number
  incomeCeiling: number
  coverageMaxPct: number
  rateRange: { min: number; max: number }
  tenureRangeMonths: { min: number; max: number }
  moratorium: {
    minMonths: number
    maxMonths: number
    interestAccrues: boolean
  }
  source: "seed" | "mcp"
}
