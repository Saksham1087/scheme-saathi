/**
 * Main pipeline script for scheme data enrichment
 * 
 * Usage:
 *   npx tsx scripts/enrich-schemes.ts
 * 
 * Environment:
 *   GROQ_API_KEY - Required for LLM extraction
 *   ENRICH_MODE - "regex" (default), "llm", or "hybrid"
 */

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import type {
  KaggleScheme,
  EnrichedScheme,
  PipelineStats,
  ProgressState,
  ParsedEligibility,
} from "./data/types"
import { extractWithRegex, calculateConfidence } from "./data/regex-extractor"
import { extractWithLLM, getTokenUsage } from "./data/llm-extractor"
import { validateExtracted, deduplicateSchemes } from "./data/validator"
import { generateSchemeOutput, writeCategoryFiles, writeStats } from "./data/output-generator"

// ─── Configuration ──────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CSV_PATH = path.join(__dirname, "..", "archive", "updated_data.csv")
const OUTPUT_DIR = path.join(__dirname, "..", "src", "data", "schemes")
const PROGRESS_PATH = path.join(__dirname, "..", "archive", "enrichment-progress.json")
const ENRICH_MODE = process.env.ENRICH_MODE || "hybrid" // "regex", "llm", or "hybrid"

// ─── CSV Parsing ────────────────────────────────────────────────────

/**
 * Parse CSV file into KaggleScheme array
 */
function parseCSV(csvPath: string): KaggleScheme[] {
  console.log(`[CSV] Reading from ${csvPath}`)
  
  const content = fs.readFileSync(csvPath, "utf-8")
  const lines = content.split("\n")
  
  if (lines.length < 2) {
    throw new Error("CSV file is empty or has no data rows")
  }

  // Parse header
  const header = parseCSVLine(lines[0])
  console.log(`[CSV] Header columns: ${header.length}`)
  console.log(`[CSV] Total lines: ${lines.length - 1}`)

  const schemes: KaggleScheme[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    try {
      const values = parseCSVLine(line)
      
      if (values.length >= 8) {
        schemes.push({
          scheme_name: cleanValue(values[0]),
          slug: cleanValue(values[1]),
          details: cleanValue(values[2]),
          benefits: cleanValue(values[3]),
          eligibility: cleanValue(values[4]),
          application: cleanValue(values[5]),
          documents: cleanValue(values[6]),
          level: cleanValue(values[7]),
          schemeCategory: cleanValue(values[8] || ""),
          tags: cleanValue(values[9] || ""),
        })
      }
    } catch (error) {
      // Skip malformed lines
    }
  }

  console.log(`[CSV] Parsed ${schemes.length} schemes`)
  return schemes
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++ // Skip escaped quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

/**
 * Clean a CSV value
 */
function cleanValue(value: string): string {
  return value
    .replace(/^"|"$/g, "") // Remove surrounding quotes
    .replace(/""/g, '"') // Unescape double quotes
    .trim()
}

// ─── Progress Management ────────────────────────────────────────────

/**
 * Load progress state if exists
 */
function loadProgress(): ProgressState | null {
  if (fs.existsSync(PROGRESS_PATH)) {
    const content = fs.readFileSync(PROGRESS_PATH, "utf-8")
    return JSON.parse(content)
  }
  return null
}

/**
 * Save progress state
 */
function saveProgress(state: ProgressState): void {
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(state, null, 2))
}

// ─── Main Pipeline ──────────────────────────────────────────────────

async function main() {
  console.log("╔═══════════════════════════════════════════════════════════════╗")
  console.log("║           Scheme Data Enrichment Pipeline                    ║")
  console.log("╚═══════════════════════════════════════════════════════════════╝")
  console.log()

  // Check GROQ_API_KEY for LLM mode
  if (ENRICH_MODE !== "regex" && !process.env.GROQ_API_KEY) {
    console.error("[Error] GROQ_API_KEY required for LLM extraction")
    console.error("Set it with: export GROQ_API_KEY=your_key_here")
    process.exit(1)
  }

  console.log(`[Config] Mode: ${ENRICH_MODE}`)
  console.log(`[Config] CSV: ${CSV_PATH}`)
  console.log(`[Config] Output: ${OUTPUT_DIR}`)
  console.log()

  // Parse CSV
  const schemes = parseCSV(CSV_PATH)
  
  // Load progress
  const existingProgress = loadProgress()
  const startIndex = existingProgress?.lastProcessedIndex ?? 0
  
  if (startIndex > 0) {
    console.log(`[Progress] Resuming from index ${startIndex}`)
  }

  // Initialize stats
  const stats: PipelineStats = {
    total: schemes.length,
    processed: 0,
    regexExtracted: 0,
    llmExtracted: 0,
    defaulted: 0,
    errors: 0,
    confidenceDistribution: {
      high: 0,
      medium: 0,
      low: 0,
    },
    fieldCoverage: {
      states: 0,
      categories: 0,
      income: 0,
      age: 0,
      occupations: 0,
      purposes: 0,
    },
  }

  const enrichedSchemes: EnrichedScheme[] = []
  const warnings: Array<{ slug: string; field: string; message: string }> = []

  // Process schemes
  for (let i = startIndex; i < schemes.length; i++) {
    const scheme = schemes[i]
    
    if (i % 100 === 0) {
      console.log(`[Progress] Processing ${i + 1}/${schemes.length} (${Math.round((i / schemes.length) * 100)}%)`)
    }

    try {
      let extracted: ParsedEligibility
      let source: "regex" | "llm" | "default"

      // Phase 1: Try regex extraction
      const regexResult = extractWithRegex(scheme.eligibility)
      const regexConfidence = calculateConfidence(regexResult)

      if (regexConfidence >= 0.5 || ENRICH_MODE === "regex") {
        // Regex extracted enough
        extracted = regexResult
        source = "regex"
        stats.regexExtracted++
      } else if (ENRICH_MODE === "hybrid" || ENRICH_MODE === "llm") {
        // Phase 2: Try LLM extraction
        try {
          console.log(`[LLM] Extracting: ${scheme.slug}`)
          const llmResult = await extractWithLLM(scheme.eligibility)
          extracted = llmResult.extracted
          source = "llm"
          stats.llmExtracted++
        } catch (error) {
          console.error(`[LLM] Failed for ${scheme.slug}: ${error}`)
          extracted = regexResult
          source = "regex"
          stats.regexExtracted++
        }
      } else {
        // Default extraction
        extracted = {
          states: ["ALL"],
          categories: ["SC", "ST", "OBC", "General"],
          occupations: [],
          purposes: [],
          education: [],
        }
        source = "default"
        stats.defaulted++
      }

      // Validate
      const { cleaned, warnings: validationWarnings, metadata } = validateExtracted(extracted, source)

      // Track warnings
      for (const warning of validationWarnings) {
        warnings.push({
          slug: scheme.slug,
          field: warning.field,
          message: warning.message,
        })
      }

      // Track field coverage
      if (cleaned.states.length > 0) stats.fieldCoverage.states++
      if (cleaned.categories.length > 0 && cleaned.categories.length < 4) stats.fieldCoverage.categories++
      if (cleaned.minIncome !== undefined || cleaned.maxIncome !== undefined) stats.fieldCoverage.income++
      if (cleaned.minAge !== undefined || cleaned.maxAge !== undefined) stats.fieldCoverage.age++
      if (cleaned.occupations.length > 0) stats.fieldCoverage.occupations++
      if (cleaned.purposes.length > 0) stats.fieldCoverage.purposes++

      // Track confidence distribution
      if (metadata.confidence >= 0.8) {
        stats.confidenceDistribution.high++
      } else if (metadata.confidence >= 0.5) {
        stats.confidenceDistribution.medium++
      } else {
        stats.confidenceDistribution.low++
      }

      // Generate output
      const enriched = generateSchemeOutput(scheme, cleaned, metadata)
      enrichedSchemes.push(enriched)

      stats.processed++
    } catch (error) {
      console.error(`[Error] Failed to process ${scheme.slug}: ${error}`)
      stats.errors++
    }

    // Save progress every 100 schemes
    if (i % 100 === 0) {
      saveProgress({
        lastProcessedIndex: i,
        timestamp: new Date().toISOString(),
        stats,
      })
    }
  }

  // Deduplicate
  console.log(`\n[Dedup] Deduplicating ${enrichedSchemes.length} schemes...`)
  const deduplicated = deduplicateSchemes(enrichedSchemes)
  console.log(`[Dedup] ${deduplicated.length} unique schemes after deduplication`)

  // Write output
  console.log(`\n[Output] Writing to ${OUTPUT_DIR}`)
  writeCategoryFiles(deduplicated, OUTPUT_DIR)

  // Write stats
  writeStats(stats, OUTPUT_DIR)

  // Write warnings
  const warningsPath = path.join(path.dirname(CSV_PATH), "enrichment-warnings.json")
  fs.writeFileSync(warningsPath, JSON.stringify(warnings, null, 2))
  console.log(`[Output] Warnings written to ${warningsPath}`)

  // Print summary
  console.log("\n╔═══════════════════════════════════════════════════════════════╗")
  console.log("║                    Pipeline Complete                         ║")
  console.log("╚═══════════════════════════════════════════════════════════════╝")
  console.log()
  console.log(`Total schemes:     ${stats.total}`)
  console.log(`Processed:         ${stats.processed}`)
  console.log(`Regex extracted:   ${stats.regexExtracted}`)
  console.log(`LLM extracted:     ${stats.llmExtracted}`)
  console.log(`Defaulted:         ${stats.defaulted}`)
  console.log(`Errors:            ${stats.errors}`)
  console.log()
  console.log("Confidence Distribution:")
  console.log(`  High (>= 0.8):   ${stats.confidenceDistribution.high}`)
  console.log(`  Medium (0.5-0.8): ${stats.confidenceDistribution.medium}`)
  console.log(`  Low (< 0.5):     ${stats.confidenceDistribution.low}`)
  console.log()
  console.log("Field Coverage:")
  console.log(`  States:          ${stats.fieldCoverage.states}/${stats.processed}`)
  console.log(`  Categories:      ${stats.fieldCoverage.categories}/${stats.processed}`)
  console.log(`  Income:          ${stats.fieldCoverage.income}/${stats.processed}`)
  console.log(`  Age:             ${stats.fieldCoverage.age}/${stats.processed}`)
  console.log(`  Occupations:     ${stats.fieldCoverage.occupations}/${stats.processed}`)
  console.log(`  Purposes:        ${stats.fieldCoverage.purposes}/${stats.processed}`)

  if (ENRICH_MODE !== "regex") {
    const tokenUsage = getTokenUsage()
    console.log()
    console.log("Token Usage:")
    console.log(`  Today:           ${tokenUsage.today}/${tokenUsage.limit}`)
    console.log(`  Remaining:       ${tokenUsage.remaining}`)
  }
}

// Run the pipeline
main().catch(error => {
  console.error("[Fatal] Pipeline failed:", error)
  process.exit(1)
})
