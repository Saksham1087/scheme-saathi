const AMOUNT_PATTERNS: Array<{ regex: RegExp; multiplier: number }> = [
  { regex: /(\d+)\s*(?:lakh|lac)/i, multiplier: 100000 },
  { regex: /(\d+)\s*(?:crore|cr)/i, multiplier: 10000000 },
  { regex: /(\d[\d,]*)/, multiplier: 1 },
]

const PURPOSE_KEYWORDS: Record<string, string> = {
  business: "business",
  shop: "business",
  education: "education",
  study: "education",
  agriculture: "agriculture",
  farming: "agriculture",
  transport: "transport",
  vehicle: "transport",
  housing: "housing",
  house: "housing",
  home: "housing",
  health: "health",
  medical: "health",
  employment: "employment",
  job: "employment",
}

export function extractAmount(text: string): number | null {
  const normalized = text.toLowerCase()
  for (const { regex, multiplier } of AMOUNT_PATTERNS) {
    const match = normalized.match(regex)
    if (match) {
      return parseInt(match[1].replace(/,/g, "")) * multiplier
    }
  }
  return null
}

export function extractPurpose(text: string): string | null {
  const normalized = text.toLowerCase()
  for (const [keyword, purpose] of Object.entries(PURPOSE_KEYWORDS)) {
    if (normalized.includes(keyword)) return purpose
  }
  return null
}

export function extractIncome(text: string): number | null {
  const normalized = text.toLowerCase()
  const amount = extractAmount(normalized)
  return amount
}

export interface ExtractedFields {
  purpose: string | null
  loanAmount: number | null
  annualIncome: number | null
}

export function extractFields(text: string): ExtractedFields {
  return {
    purpose: extractPurpose(text),
    loanAmount: extractAmount(text),
    annualIncome: extractIncome(text),
  }
}
