import type {
  AmortizationRow,
  AnnualAmortizationRow,
  LoanParams,
  MoratoriumComparisonResult,
} from "@/types/calculator"

export type {
  AmortizationRow,
  AnnualAmortizationRow,
  LoanParams,
  MoratoriumScenarioMetrics,
  MoratoriumComparisonResult,
} from "@/types/calculator"

/**
 * Standard reducing-balance EMI:
 *   EMI = P × r × (1+r)^n / ((1+r)^n − 1)
 * where r = monthly rate (annualRatePct / 12 / 100), n = tenure in months.
 *
 * Moratorium handling is per-scheme configuration (never hardcoded):
 *  - moratoriumInterestAccrues = true  → monthly interest capitalizes into the balance
 *                                        during moratorium; EMI runs on inflated principal.
 *  - moratoriumInterestAccrues = false → interest-free pause; EMI runs on unchanged
 *                                        principal after the pause.
 */
export function computeLoan(params: LoanParams): {
  effectivePrincipal: number
  emi: number
  totalInterest: number
  totalPayable: number
  schedule: AmortizationRow[]
} {
  const principal = Math.max(0, Number(params.principal) || 0)
  const annualRatePct = Math.max(0, Number(params.annualRatePct) || 0)
  const tenureMonths = Math.max(1, Math.round(Number(params.tenureMonths) || 1))
  const moratoriumMonths = Math.max(0, Math.round(Number(params.moratoriumMonths) || 0))
  const moratoriumInterestAccrues = !!params.moratoriumInterestAccrues

  const r = annualRatePct / 12 / 100

  // Phase 1: moratorium
  let balance = principal
  const schedule: AmortizationRow[] = []
  let moratoriumInterestTotal = 0

  for (let m = 1; m <= moratoriumMonths; m++) {
    const interest = balance * r
    if (moratoriumInterestAccrues && r > 0) {
      moratoriumInterestTotal += interest
      balance += interest
    }
    schedule.push({
      month: m,
      openingBalance: moratoriumInterestAccrues && r > 0 ? balance - interest : balance,
      emi: 0,
      interest: moratoriumInterestAccrues && r > 0 ? interest : 0,
      principalPaid: 0,
      closingBalance: balance,
      phase: "moratorium",
    })
  }

  const effectivePrincipal = balance
  const n = tenureMonths

  // Phase 2: EMI repayment on effectivePrincipal
  const emi =
    r === 0
      ? effectivePrincipal / n
      : (effectivePrincipal * r * Math.pow(1 + r, n)) /
        (Math.pow(1 + r, n) - 1)

  for (let m = 1; m <= n; m++) {
    const openingBalance = balance
    const interest = balance * r
    let principalPaid = emi - interest
    if (principalPaid > balance || m === n) {
      principalPaid = balance
    }
    balance = Math.max(0, balance - principalPaid)
    schedule.push({
      month: moratoriumMonths + m,
      openingBalance,
      emi: principalPaid + interest,
      interest,
      principalPaid,
      closingBalance: balance,
      phase: "repayment",
    })
  }

  const repaymentInterest = schedule
    .filter((row) => row.phase === "repayment")
    .reduce((sum, row) => sum + row.interest, 0)

  const totalInterest = repaymentInterest + moratoriumInterestTotal
  const totalPayable = effectivePrincipal + repaymentInterest

  return {
    effectivePrincipal,
    emi: Math.round(emi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayable: Math.round(totalPayable * 100) / 100,
    schedule,
  }
}

/**
 * Computes side-by-side comparative metrics for:
 * - Scenario A: Capitalizing monthly interest into principal during moratorium
 * - Scenario B: Servicing simple interest monthly during moratorium
 *
 * Highlights the "Cost of Capitalization" (net lifetime interest difference).
 */
export function computeMoratoriumComparison(params: LoanParams): MoratoriumComparisonResult {
  const principal = Math.max(0, Number(params.principal) || 0)
  const annualRatePct = Math.max(0, Number(params.annualRatePct) || 0)
  const tenureMonths = Math.max(1, Math.round(Number(params.tenureMonths) || 1))
  const moratoriumMonths = Math.max(0, Math.round(Number(params.moratoriumMonths) || 0))
  const r = annualRatePct / 12 / 100

  // ----------------------------------------------------
  // Scenario A: Capitalize Interest into Principal
  // ----------------------------------------------------
  let balanceA = principal
  const scheduleA: AmortizationRow[] = []
  let moratoriumInterestA = 0

  for (let m = 1; m <= moratoriumMonths; m++) {
    const interest = balanceA * r
    if (r > 0) {
      moratoriumInterestA += interest
      balanceA += interest
    }
    scheduleA.push({
      month: m,
      openingBalance: r > 0 ? balanceA - interest : balanceA,
      emi: 0,
      interest: r > 0 ? interest : 0,
      principalPaid: 0,
      closingBalance: balanceA,
      phase: "moratorium",
    })
  }

  const effectivePrincipalA = balanceA
  const emiA =
    r === 0
      ? effectivePrincipalA / tenureMonths
      : (effectivePrincipalA * r * Math.pow(1 + r, tenureMonths)) /
        (Math.pow(1 + r, tenureMonths) - 1)

  for (let m = 1; m <= tenureMonths; m++) {
    const openingBalance = balanceA
    const interest = balanceA * r
    let principalPaid = emiA - interest
    if (principalPaid > balanceA || m === tenureMonths) {
      principalPaid = balanceA
    }
    balanceA = Math.max(0, balanceA - principalPaid)
    scheduleA.push({
      month: moratoriumMonths + m,
      openingBalance,
      emi: principalPaid + interest,
      interest,
      principalPaid,
      closingBalance: balanceA,
      phase: "repayment",
    })
  }

  const repaymentInterestA = scheduleA
    .filter((row) => row.phase === "repayment")
    .reduce((sum, row) => sum + row.interest, 0)
  const totalInterestA = repaymentInterestA + moratoriumInterestA
  const totalPayableA = scheduleA.reduce((sum, row) => sum + row.emi, 0)

  // ----------------------------------------------------
  // Scenario B: Service Simple Interest Monthly
  // ----------------------------------------------------
  let balanceB = principal
  const scheduleB: AmortizationRow[] = []
  const monthlyInterestB = principal * r
  let moratoriumInterestB = 0

  for (let m = 1; m <= moratoriumMonths; m++) {
    const interest = monthlyInterestB
    moratoriumInterestB += interest
    scheduleB.push({
      month: m,
      openingBalance: principal,
      emi: interest, // beneficiary services simple interest monthly
      interest,
      principalPaid: 0,
      closingBalance: principal,
      phase: "moratorium",
    })
  }

  const effectivePrincipalB = principal
  const emiB =
    r === 0
      ? effectivePrincipalB / tenureMonths
      : (effectivePrincipalB * r * Math.pow(1 + r, tenureMonths)) /
        (Math.pow(1 + r, tenureMonths) - 1)

  for (let m = 1; m <= tenureMonths; m++) {
    const openingBalance = balanceB
    const interest = balanceB * r
    let principalPaid = emiB - interest
    if (principalPaid > balanceB || m === tenureMonths) {
      principalPaid = balanceB
    }
    balanceB = Math.max(0, balanceB - principalPaid)
    scheduleB.push({
      month: moratoriumMonths + m,
      openingBalance,
      emi: principalPaid + interest,
      interest,
      principalPaid,
      closingBalance: balanceB,
      phase: "repayment",
    })
  }

  const repaymentInterestB = scheduleB
    .filter((row) => row.phase === "repayment")
    .reduce((sum, row) => sum + row.interest, 0)
  const totalInterestB = repaymentInterestB + moratoriumInterestB
  const totalPayableB = scheduleB.reduce((sum, row) => sum + row.emi, 0)

  const interestDifference = Math.max(
    0,
    Math.round((totalInterestA - totalInterestB) * 100) / 100,
  )
  const emiDifference = Math.max(
    0,
    Math.round((emiA - emiB) * 100) / 100,
  )

  return {
    hasMoratorium: moratoriumMonths > 0,
    moratoriumMonths,
    tenureMonths,
    principal,
    annualRatePct,
    scenarioA: {
      scenarioKey: "capitalize",
      effectivePrincipal: Math.round(effectivePrincipalA * 100) / 100,
      moratoriumMonthlyPayment: 0,
      moratoriumTotalPaid: 0,
      postMoratoriumEmi: Math.round(emiA * 100) / 100,
      totalInterest: Math.round(totalInterestA * 100) / 100,
      totalPayable: Math.round(totalPayableA * 100) / 100,
      schedule: scheduleA,
    },
    scenarioB: {
      scenarioKey: "service",
      effectivePrincipal: Math.round(effectivePrincipalB * 100) / 100,
      moratoriumMonthlyPayment: Math.round(monthlyInterestB * 100) / 100,
      moratoriumTotalPaid: Math.round(moratoriumInterestB * 100) / 100,
      postMoratoriumEmi: Math.round(emiB * 100) / 100,
      totalInterest: Math.round(totalInterestB * 100) / 100,
      totalPayable: Math.round(totalPayableB * 100) / 100,
      schedule: scheduleB,
    },
    interestDifference,
    emiDifference,
  }
}

/**
 * Aggregates monthly amortization schedule rows into annual summary rows.
 */
export function computeAnnualSchedule(
  schedule: AmortizationRow[],
): AnnualAmortizationRow[] {
  if (!schedule || schedule.length === 0) return []

  const annualRows: AnnualAmortizationRow[] = []
  const totalMonths = schedule.length
  const totalYears = Math.ceil(totalMonths / 12)

  for (let y = 1; y <= totalYears; y++) {
    const startIndex = (y - 1) * 12
    const yearMonths = schedule.slice(startIndex, startIndex + 12)
    if (yearMonths.length === 0) continue

    const openingBalance = yearMonths[0].openingBalance
    const closingBalance = yearMonths[yearMonths.length - 1].closingBalance
    const totalEmi = yearMonths.reduce((sum, r) => sum + r.emi, 0)
    const principalPaid = yearMonths.reduce((sum, r) => sum + r.principalPaid, 0)
    const interestPaid = yearMonths.reduce((sum, r) => sum + r.interest, 0)

    annualRows.push({
      year: y,
      openingBalance,
      totalEmi,
      principalPaid,
      interestPaid,
      closingBalance,
      months: yearMonths,
    })
  }

  return annualRows
}

/** Haversine distance in km — used by partner locator distance sort. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
