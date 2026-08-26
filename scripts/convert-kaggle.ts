/**
 * Convert Indian Government Schemes CSV to schemes.seed.json.
 *
 * Supports two CSV formats:
 *   1. jainamgada45/indian-government-schemes (Kaggle):
 *      scheme_name, slug, details, benefits, eligibility, application,
 *      documents, level, schemeCategory, tags
 *   2. Aryan-Pardeshi/gov-myscheme-dataset (GitHub):
 *      Scheme Name, Scheme Slug, Level, State / UT / Ministry,
 *      Application Mode, Tags / Categories, Description,
 *      Eligibility Criteria, ..., Benefits, ..., MyScheme URL
 *
 * Usage:
 *   npx tsx scripts/convert-kaggle.ts <path-to-csv>
 *
 * Output: functions/src/data/schemes.seed.json
 */
import { readFileSync, writeFileSync, copyFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(here, "../functions/src/data")
const OUT_PATH = resolve(DATA_DIR, "schemes.seed.json")
const LEGACY_PATH = resolve(DATA_DIR, "schemes.legacy.json")

// --- Simple CSV parser (handles quoted fields, escaped quotes, newlines) ---
function parseCSV(text: string): Record<string, string>[] {
  // Strip BOM
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1)
  const rows: Record<string, string>[] = []
  let i = 0
  const len = text.length

  const headers: string[] = []
  while (i < len) {
    const col = readField()
    headers.push(col)
    if (i < len && text[i] === ",") { i++; continue }
    break
  }
  if (i < len && text[i] === "\r") i++
  if (i < len && text[i] === "\n") i++

  while (i < len) {
    const row: Record<string, string> = {}
    for (let h = 0; h < headers.length; h++) {
      row[headers[h]] = readField()
      if (i < len && text[i] === ",") i++
    }
    rows.push(row)
    if (i < len && text[i] === "\r") i++
    if (i < len && text[i] === "\n") i++
  }

  function readField(): string {
    if (i >= len) return ""
    if (text[i] === '"') {
      i++
      let val = ""
      while (i < len) {
        if (text[i] === '"') {
          if (i + 1 < len && text[i + 1] === '"') {
            val += '"'
            i += 2
          } else {
            i++
            break
          }
        } else {
          val += text[i]
          i++
        }
      }
      return val
    }
    let val = ""
    while (i < len && text[i] !== "," && text[i] !== "\n" && text[i] !== "\r") {
      val += text[i]
      i++
    }
    return val
  }

  return rows
}

// --- Normalized row interface ---
interface NormalizedRow {
  name: string
  slug: string
  description: string
  benefits: string
  eligibility: string
  level: string
  category: string
  tags: string
  applyUrl: string
}

function normalizeRow(row: Record<string, string>): NormalizedRow {
  // Build a lowercase-key lookup for robust matching
  const lookup: Record<string, string> = {}
  for (const [k, v] of Object.entries(row)) {
    lookup[k.trim().toLowerCase()] = v
  }

  const hasMyschemeUrl = "myscheme url" in lookup

  if (hasMyschemeUrl) {
    // Aryan-Pardeshi format (16 columns)
    const name = (lookup["scheme name"] || "").trim()
    const slug = (lookup["scheme slug"] || "").trim()
    const description = (lookup["description"] || "").trim()
    const eligibility = (lookup["eligibility criteria"] || lookup["eligibility (general)"] || "").trim()
    const benefits = (lookup["benefits"] || "").trim()
    const level = (lookup["level"] || "").trim()
    const category = (lookup["tags / categories"] || "").trim()
    const mySchemeUrl = (lookup["myscheme url"] || "").trim()
    const officialLink = (lookup["official link"] || "").trim()

    return {
      name,
      slug,
      description,
      benefits,
      eligibility,
      level,
      category,
      tags: category,
      applyUrl: mySchemeUrl || officialLink || "",
    }
  }

  // jainamgada45 format (10 columns)
  const name = (lookup["scheme_name"] || "").trim()
  const slug = (lookup["slug"] || "").trim()
  const details = (lookup["details"] || "").trim()
  const benefits = (lookup["benefits"] || "").trim()
  const eligibility = (lookup["eligibility"] || "").trim()
  const level = (lookup["level"] || "").trim()
  const category = (lookup["schemecategory"] || "").trim()
  const tags = (lookup["tags"] || "").trim()

  return {
    name,
    slug,
    description: details,
    benefits,
    eligibility,
    level,
    category,
    tags,
    applyUrl: slug ? `https://www.myscheme.gov.in/schemes/${slug}` : "",
  }
}

// --- Helpers ---
function extractAmount(text: string): number | null {
  if (!text) return null
  const patterns = [
    /[₹Rs.]+\s*([\d,]+)/,
    /INR\s*([\d,]+)/,
    /(\d+(?:,\d{2,3})+)/,
  ]
  for (const p of patterns) {
    const m = text.match(p)
    if (m) {
      const v = parseInt(m[1].replace(/,/g, ""), 10)
      if (v >= 500) return v
    }
  }
  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*lakh/i)
  if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100_000)
  const croreMatch = text.match(/(\d+(?:\.\d+)?)\s*crore/i)
  if (croreMatch) return Math.round(parseFloat(croreMatch[1]) * 10_000_000)
  return null
}

function extractIncomeCeiling(text: string): number | null {
  if (!text) return null
  const m = text.match(
    /(?:annual|household|family)\s+income\s+(?:below|less than|not exceeding|upto|up to)?\s*[₹Rs.]*\s*([\d,]+)/i,
  )
  if (m) {
    const v = parseInt(m[1].replace(/,/g, ""), 10)
    if (v >= 10_000) return v
  }
  const lakhM = text.match(/income\s+(?:below|less than|upto|up to)\s+(\d+(?:\.\d+)?)\s*lakh/i)
  if (lakhM) return Math.round(parseFloat(lakhM[1]) * 100_000)
  return null
}

const FINANCE_KEYWORDS = [
  "loan", "credit", "finance", "financing", "interest subsidy",
  "msme", "msmes", "micro enterprise", "small enterprise", "medium enterprise",
  "entrepreneur", "startup", "business", "industry", "manufacturing",
  "advance", "fund", "capital", "investment", "subsidy",
  "sc ", "st ", "scheduled caste", "scheduled tribe", "dalit",
  "education loan", "student loan", "mudra", "stand-up",
]

const CATEGORY_KEEP = new Set([
  "business", "entrepreneurship", "finance", "banking",
  "skill", "employment", "msme", "industry",
])

function inferType(category: string, tags: string, name: string): "micro" | "term" | "education" {
  const blob = `${category} ${tags} ${name}`.toLowerCase()
  if (blob.includes("education") || blob.includes("scholar") || blob.includes("student")) return "education"
  if (blob.includes("micro") || blob.includes("msme") || blob.includes("tiny")) return "micro"
  return "term"
}

function isRelevant(row: NormalizedRow): boolean {
  const cat = row.category.toLowerCase()
  const tags = row.tags.toLowerCase()
  const name = row.name.toLowerCase()
  const desc = row.description.toLowerCase()
  const benefits = row.benefits.toLowerCase()
  const eligibility = row.eligibility.toLowerCase()
  const blob = `${cat} ${tags} ${name} ${desc} ${benefits} ${eligibility}`

  // Split comma-separated tags for individual matching
  const tagList = cat.split(/,\s*/).map(t => t.trim().toLowerCase())

  for (const c of CATEGORY_KEEP) {
    if (tagList.some(t => t.includes(c)) || cat.includes(c)) return true
  }
  for (const kw of FINANCE_KEYWORDS) {
    if (blob.includes(kw)) return true
  }
  return false
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max - 3) + "..."
}

// --- Main ---
const csvPath = process.argv[2]
if (!csvPath) {
  console.error("Usage: npx tsx scripts/convert-kaggle.ts <path-to-csv>")
  process.exit(1)
}

console.log(`Reading CSV from: ${csvPath}`)
const csv = readFileSync(csvPath, "utf-8").replace(/^\uFEFF/, "")
const rows = parseCSV(csv)
console.log(`Total rows in CSV: ${rows.length}`)
console.log(`Columns: ${Object.keys(rows[0] || {}).join(", ")}`)

// Backup existing seed
try {
  copyFileSync(OUT_PATH, LEGACY_PATH)
  console.log(`Backed up existing seed to ${LEGACY_PATH}`)
} catch { /* no existing file */ }

// Filter + convert
const schemes: unknown[] = []
let skipped = 0

for (const row of rows) {
  const norm = normalizeRow(row)
  if (!norm.name || !norm.slug) { skipped++; continue }
  if (!isRelevant(norm)) { skipped++; continue }

  const schemeType = inferType(norm.category, norm.tags, norm.name)

  const extractedCost = extractAmount(norm.benefits) || extractAmount(norm.description)
  const extractedIncome = extractIncomeCeiling(norm.eligibility)

  const defaultCost = schemeType === "micro" ? 140_000 : 5_000_000

  const description = truncate(
    [
      norm.description.slice(0, 600),
      norm.eligibility ? `Eligibility: ${norm.eligibility.slice(0, 400)}` : "",
    ]
      .filter(Boolean)
      .join(" "),
    1000,
  )

  schemes.push({
    id: `kaggle-${norm.slug}`,
    name: { en: norm.name, hi: "" },
    description: { en: description, hi: "" },
    type: schemeType,
    maxProjectCost: extractedCost || defaultCost,
    incomeCeiling: extractedIncome || 500_000,
    coverageMaxPct: 90,
    rateRange: { min: 6.5, max: 15 },
    tenureRangeMonths: { min: 12, max: 120 },
    moratorium: { minMonths: 3, maxMonths: 12, interestAccrues: false },
    source: "kaggle",
    applyUrl: norm.applyUrl,
  })
}

writeFileSync(OUT_PATH, JSON.stringify(schemes, null, 2), "utf-8")
console.log(`\nDone!`)
console.log(`  Converted: ${schemes.length} schemes`)
console.log(`  Skipped:   ${skipped} rows`)
console.log(`  Output:    ${OUT_PATH}`)
console.log(`  Legacy:    ${LEGACY_PATH}`)
