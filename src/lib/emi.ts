import type {
  AmortizationRow,
  LoanParams,
} from "@/types/calculator"

export type { AmortizationRow, LoanParams } from "@/types/calculator"

/**
 * Standard reducing-balance EMI:
 *   EMI = P × r × (1+r)^n / ((1+r)^n − 1)
 * where r = monthly rate, n = tenure in months.
 *
 * Moratorium handling is per-scheme configuration (never hardcoded):
 *  - interestAccrues = true  → monthly interest capitalizes into the balance
 *                              during moratorium; EMI runs on inflated principal.
 *  - interestAccrues = false → interest-free pause; EMI runs on unchanged
 *                              principal after the pause.
 */
export function computeLoan(params: LoanParams): {
  effectivePrincipal: number
  emi: number
  totalInterest: number
  totalPayable: number
  schedule: AmortizationRow[]
} {
  const {
    principal,
    annualRatePct,
    tenureMonths,
    moratoriumMonths,
    moratoriumInterestAccrues,
  } = params

  const r = annualRatePct / 12 / 100

  // Phase 1: moratorium
  let balance = principal
  const schedule: AmortizationRow[] = []
  let moratoriumInterestTotal = 0

  for (let m = 1; m <= moratoriumMonths; m++) {
    const interest = balance * r
    if (moratoriumInterestAccrues) {
      moratoriumInterestTotal += interest
      balance += interest
    }
    schedule.push({
      month: m,
      openingBalance: moratoriumInterestAccrues ? balance - interest : balance,
      emi: 0,
      interest: moratoriumInterestAccrues ? interest : 0,
      principalPaid: 0,
      closingBalance: balance,
      phase: "moratorium",
    })
  }

  const effectivePrincipal = balance
  const n = Math.max(1, Math.round(tenureMonths))

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
    if (principalPaid > balance || m === n) principalPaid = balance
    balance -= principalPaid
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

  return {
    effectivePrincipal,
    emi,
    totalInterest: repaymentInterest + moratoriumInterestTotal,
    totalPayable: effectivePrincipal + repaymentInterest,
    schedule,
  }
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
