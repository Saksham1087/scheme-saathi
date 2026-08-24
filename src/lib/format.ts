const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

export function fmtINR(n: number): string {
  return inr.format(Math.round(n))
}

export function fmtNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(n))
}
