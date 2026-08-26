export type SchemeType = "micro" | "term" | "education"

export type PartnerType = "SCA" | "PSB" | "RRB" | "NBFC_MFI"

export type NpaFlag = "low" | "medium" | "high"

export interface LocalizedText {
  en: string
  hi: string
}

export interface Scheme {
  id: string
  name: LocalizedText
  description: LocalizedText
  type: SchemeType
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
  source: "seed" | "mcp" | "kaggle"
  applyUrl?: string
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
