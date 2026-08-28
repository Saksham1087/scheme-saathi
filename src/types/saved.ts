export type CalculationRecordType = "emi" | "budget"

export interface SavedCalculationRecord {
  id: string
  type: CalculationRecordType
  title: string
  calculatedAt: number
  // EMI calculation fields
  principal?: number
  annualRatePct?: number
  tenureMonths?: number
  moratoriumMonths?: number
  moratoriumInterestAccrues?: boolean
  monthlyEmi?: number
  totalInterest?: number
  totalPayment?: number
  schemeId?: string | null
  schemeName?: string | null
  // Budget / Project cost fields
  projectTitle?: string
  projectType?: string
  totalProjectCost?: number
  loanAmount?: number
  promoterMargin?: number
  subsidyAmount?: number
  itemCount?: number
}

export interface SavedSchemeBookmark {
  schemeId: string
  savedAt: number
}

export interface SavedPartnerBookmark {
  partnerId: string
  savedAt: number
}

export interface SavedEntityState {
  savedSchemeIds: string[]
  savedPartnerIds: string[]
  savedCalculations: SavedCalculationRecord[]
}
