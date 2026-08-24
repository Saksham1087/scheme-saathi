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
