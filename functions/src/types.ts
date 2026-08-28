export type SchemeType = "micro" | "term" | "education"

export type PartnerType = "SCA" | "PSB" | "RRB" | "NBFC_MFI"

export type NpaFlag = "low" | "medium" | "high"

export interface LocalizedText {
  en: string
  hi: string
}

export interface ScoreBreakdown {
  income: number
  category: number
  purpose: number
  cost: number
  age: number
  state: number
}

export interface SchemeAlternative {
  schemeId: string
  schemeName: LocalizedText
  schemeType: SchemeType
  maxProjectCost: number
  rateRange: { min: number; max: number }
  reason: LocalizedText
}

export interface GapItem {
  criterion: "income" | "category" | "purpose" | "cost" | "age" | "state" | string
  userValue?: string | number
  requiredValue?: string | number
  explanation: LocalizedText
  remedialAdvice?: LocalizedText
}

export interface Scheme {
  id: string
  name: LocalizedText
  description: LocalizedText
  type: SchemeType
  category?: string
  purpose?: LocalizedText
  purposeTags?: string[]
  applicableStates?: string[]
  eligibleEducation?: string[]
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
  eligibilityCriteria?: {
    ageRange?: { min: number; max?: number }
    targetCaste?: LocalizedText
    gender?: LocalizedText
    [key: string]: any
  }
}

export interface ChannelPartner {
  id: string
  name: string
  type: PartnerType
  address: string
  city: string
  state: string
  geo: { lat: number; lng: number }
  phone: string
  schemeCategories: SchemeType[]
  npaFlag: NpaFlag
  fundUtilizationPct: number
  docsRequired: LocalizedText[]
  avgProcessingDays?: number
}

