import type {
  AmortizationRow,
  AnnualAmortizationRow,
  LoanParams,
} from "@/types/calculator"

export type {
  AmortizationRow,
  AnnualAmortizationRow,
  LoanParams,
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
