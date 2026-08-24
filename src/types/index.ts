export type SchemeType = "micro" | "term" | "education"

export type PartnerType = "SCA" | "PSB" | "RRB" | "NBFC_MFI"

/** NPA / overdue health of a channel partner. "high" partners are deprioritized. */
export type NpaFlag = "low" | "medium" | "high"

export type EducationStatus =
  | "student"
  | "below_twelfth"
  | "twelfth"
  | "graduate"
  | "postgraduate"
  | "other"

export type ApplicantCategory = "sc" | "other"

export interface LocalizedText {
  en: string
  hi: string
}

export interface Scheme {
  id: string
  name: LocalizedText
  description: LocalizedText
  type: SchemeType
  /** rupees per year */
  maxProjectCost: number
  /** annual family income ceiling (₹5,00,000 for all current schemes) */
  incomeCeiling: number
  /** maximum share of project/course cost the scheme funds */
  coverageMaxPct: number
  rateRange: { min: number; max: number }
  tenureRangeMonths: { min: number; max: number }
  moratorium: {
    minMonths: number
    maxMonths: number
    /** true: interest accrues during moratorium and is capitalized. false: interest-free pause. */
    interestAccrues: boolean
  }
  source: "seed" | "mcp"
}

export interface MatchInput {
  projectType: string
  estimatedCost: number
  annualFamilyIncome: number
  educationStatus: EducationStatus
  category: ApplicantCategory
  state: string
}

export interface MatchReason {
  key:
    | "within_cost"
    | "income_ok"
    | "coverage_capped"
    | "student_eligible"
    | "cost_above_tier"
    | "income_exceeds"
    | "not_student"
    | "category_note"
  params?: Record<string, string | number>
}

export interface SchemeMatch {
  schemeId: string
  schemeType: SchemeType
  eligible: boolean
  rank: number
  /** recommended coverage % of cost (never above scheme cap) */
  coveragePct: number
  suggestedAmount: number
  reasons: MatchReason[]
  /** enriched scheme snapshot so Results renders without extra reads */
  schemeName: LocalizedText
  rateRange: { min: number; max: number }
  moratorium: {
    minMonths: number
    maxMonths: number
    interestAccrues: boolean
  }
  tenureRangeMonths: { min: number; max: number }
}

export interface MatchResponse {
  matches: SchemeMatch[]
  generatedAt: number
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
  /** 0–100, how much of allocated channel funds is already deployed */
  fundUtilizationPct: number
  docsRequired: LocalizedText[]
  avgProcessingDays?: number
}

export type ApplicationStatus = "submitted" | "under_review" | "disbursed"

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "disbursed",
]

export interface RoutingCheck {
  ok: boolean
  reasonKey?: "partner_not_handled" | "partner_high_npa"
}

export interface Application {
  id: string
  uid: string
  applicantName: string
  schemeId: string
  schemeType: SchemeType
  partnerId: string
  requestedAmount: number
  status: ApplicationStatus
  routingCheck: RoutingCheck
  createdAt: number
  updatedAt: number
}
