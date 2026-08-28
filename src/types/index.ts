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

export type Gender = "male" | "female" | "transgender" | "other"

export interface LocalizedText {
  en: string
  hi: string
}

export type SchemeCategory =
  | "business"
  | "education"
  | "agriculture"
  | "sanitation"
  | "women"
  | "skills"
  | "micro"
  | "other"

export type SchemeSortOption =
  | "name_asc"
  | "max_amount_desc"
  | "max_amount_asc"
  | "rate_asc"
  | "income_ceiling_asc"

export interface SchemeFilterState {
  searchQuery: string
  categories: string[]
  state: string | null
  maxIncome: number | null
  amountRange: [number, number]
  purposes: string[]
  education: EducationStatus | "all" | null
  sortBy: SchemeSortOption
}

export interface EligibilityCriteriaDetails {
  targetCaste?: LocalizedText
  incomeCeiling?: number
  ageRange?: { min: number; max?: number }
  gender?: LocalizedText
  eligibleEducation?: EducationStatus[]
  educationDescription?: LocalizedText
  otherRequirements?: LocalizedText[]
}

export interface FinancialAssistanceDetails {
  coverageMaxPct: number
  promoterContributionPct?: number
  fundingPattern?: LocalizedText
  subsidyAvailable?: boolean
  subsidyDetails?: LocalizedText
}

export interface InterestRateDetails {
  min: number
  max: number
  rateDescription?: LocalizedText
  concessions?: LocalizedText
  rebates?: LocalizedText[]
}

export interface LoanLimitsDetails {
  minAmount?: number
  maxAmount: number
  unitCostLimit?: LocalizedText
  allowableExpenditure?: LocalizedText[]
}

export interface MoratoriumDetails {
  minMonths: number
  maxMonths: number
  interestAccrues: boolean
  policyDescription?: LocalizedText
}

export interface RepaymentTermsDetails {
  tenureRangeMonths: { min: number; max: number }
  repaymentFrequency?: LocalizedText
  prepaymentPenalty?: boolean
  penaltyDescription?: LocalizedText
}

export interface DocumentChecklistItem {
  name: LocalizedText
  description?: LocalizedText
  mandatory?: boolean
}

export interface DocumentCategoryGroup {
  category: LocalizedText
  items: DocumentChecklistItem[]
}

export interface ChannelPartnersDetails {
  partnerTypes: PartnerType[]
  description?: LocalizedText
}

export interface ApplicationStep {
  stepNumber: number
  title: LocalizedText
  description: LocalizedText
}

export interface Scheme {
  id: string
  name: LocalizedText
  description: LocalizedText
  type: SchemeType
  category?: SchemeCategory | string
  ministry?: LocalizedText
  department?: LocalizedText
  purpose?: LocalizedText
  purposeTags?: string[]
  applicableStates?: string[]
  eligibleEducation?: EducationStatus[]
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
  verified?: boolean
  officialUrl?: string
  lastUpdated?: string

  // 14 Standardized Section Details
  overview?: LocalizedText
  whoCanApply?: LocalizedText[]
  eligibilityCriteria?: EligibilityCriteriaDetails
  financialAssistance?: FinancialAssistanceDetails
  interestRateDetails?: InterestRateDetails
  loanLimits?: LoanLimitsDetails
  moratoriumDetails?: MoratoriumDetails
  repaymentTerms?: RepaymentTermsDetails
  requiredDocumentsList?: DocumentCategoryGroup[]
  channelPartnersInfo?: ChannelPartnersDetails
  applicationProcessSteps?: ApplicationStep[]
  officialSourceUrl?: string
  sourceLastUpdated?: string
  disclaimerText?: LocalizedText
}

export interface MatchInput {
  state: string
  category: ApplicantCategory | string
  gender: Gender | string
  age: number
  educationStatus: EducationStatus
  annualFamilyIncome: number
  projectType: string
  estimatedCost: number
  consentAt?: string | null
}

export interface ScoreBreakdown {
  income: number
  category: number
  purpose: number
  cost: number
  age: number
  state: number
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
    | "category_mismatch"
    | "female_only"
    | "age_out_of_bounds"
    | "state_not_applicable"
    | string
  params?: Record<string, string | number>
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

export interface SchemeMatch {
  schemeId: string
  schemeType: SchemeType
  eligible: boolean
  rank: number
  score: number
  breakdown: ScoreBreakdown
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
  /** alternative schemes suggested when disqualified or sub-optimal */
  alternativeSchemeIds?: string[]
  alternativeSchemes?: SchemeAlternative[]
  remedialAdvice?: LocalizedText[]
  gapBreakdown?: GapItem[]
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
