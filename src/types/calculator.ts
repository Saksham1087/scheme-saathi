export interface LoanParams {
  /** loan amount in rupees */
  principal: number
  annualRatePct: number
  tenureMonths: number
  moratoriumMonths: number
  moratoriumInterestAccrues: boolean
}

export interface AmortizationRow {
  month: number
  openingBalance: number
  emi: number
  interest: number
  principalPaid: number
  closingBalance: number
  phase: "moratorium" | "repayment"
}

export interface AnnualAmortizationRow {
  year: number
  openingBalance: number
  totalEmi: number
  principalPaid: number
  interestPaid: number
  closingBalance: number
  months: AmortizationRow[]
}

export interface SchemePreset {
  id: string
  nameKey: string
  defaultName: {
    en: string
    hi: string
  }
  principal: number
  annualRatePct: number
  tenureMonths: number
  moratoriumMonths: number
  moratoriumInterestAccrues: boolean
  badge: string
  category: "micro" | "term" | "education" | "women" | "commercial"
}

export interface MoratoriumScenarioMetrics {
  scenarioKey: "capitalize" | "service"
  effectivePrincipal: number
  moratoriumMonthlyPayment: number
  moratoriumTotalPaid: number
  postMoratoriumEmi: number
  totalInterest: number
  totalPayable: number
  schedule: AmortizationRow[]
}

export interface MoratoriumComparisonResult {
  hasMoratorium: boolean
  moratoriumMonths: number
  tenureMonths: number
  principal: number
  annualRatePct: number
  scenarioA: MoratoriumScenarioMetrics
  scenarioB: MoratoriumScenarioMetrics
  interestDifference: number
  emiDifference: number
}

