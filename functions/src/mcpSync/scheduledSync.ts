import { onSchedule } from "firebase-functions/v2/scheduler"
import { logger } from "firebase-functions"
import { getFirestore } from "firebase-admin/firestore"
import schemesSeed from "../data/schemes.seed.json"
import type { Scheme } from "../types"

/**
 * MCP ingestion layer.
 *
 * Pulls scheme metadata from the myscheme.gov.in MCP connector on a schedule,
 * normalizes it into the Firestore `schemes` schema (source: "mcp"), and
 * silently falls back to doing nothing when the connector is unavailable —
 * seeded data stays live so the demo never breaks.
 *
 * MCP-fetched data is written with source:"mcp" and never touches the rule
 * engine constants in engine/rules.ts — eligibility rules remain auditable.
 *
 * TODO(mcp): point MCP_SCHEMES_URL at the real connector endpoint and adapt
 * `normalizeMcpEntry` to its payload shape.
 */
const MCP_SCHEMES_URL = process.env.MCP_SCHEMES_URL ?? ""

interface McpSchemePayload {
  id?: string
  name?: string | { en?: string; hi?: string }
  description?: string | { en?: string; hi?: string }
  type?: string
  maxProjectCost?: number
  incomeCeiling?: number
  coverageMaxPct?: number
  rateRange?: { min?: number; max?: number }
  tenureRangeMonths?: { min?: number; max?: number }
  moratoriumMonthsMin?: number
  moratoriumMonthsMax?: number
  moratoriumInterestAccrues?: boolean
}

function asLocalized(
  value: string | { en?: string; hi?: string } | undefined,
): { en: string; hi: string } {
  if (typeof value === "string") return { en: value, hi: value }
  return { en: value?.en ?? "", hi: value?.hi ?? "" }
}

/** Defensive normalization — unknown/invalid entries are skipped, not trusted. */
export function normalizeMcpEntry(raw: McpSchemePayload): Scheme | null {
  const VALID_TYPES = ["micro", "term", "education"]
  if (!raw.id || !raw.type || !VALID_TYPES.includes(raw.type)) return null
  if (typeof raw.maxProjectCost !== "number" || raw.maxProjectCost <= 0)
    return null

  return {
    id: raw.id,
    name: asLocalized(raw.name),
    description: asLocalized(raw.description),
    type: raw.type as Scheme["type"],
    maxProjectCost: raw.maxProjectCost,
    incomeCeiling: raw.incomeCeiling ?? 500_000,
    coverageMaxPct: Math.min(90, raw.coverageMaxPct ?? 90),
    rateRange: {
      min: raw.rateRange?.min ?? 6.5,
      max: raw.rateRange?.max ?? 15,
    },
    tenureRangeMonths: {
      min: raw.tenureRangeMonths?.min ?? 12,
      max: raw.tenureRangeMonths?.max ?? 120,
    },
    moratorium: {
      minMonths: raw.moratoriumMonthsMin ?? 3,
      maxMonths: raw.moratoriumMonthsMax ?? 12,
      interestAccrues: Boolean(raw.moratoriumInterestAccrues),
    },
    source: "mcp" as const,
  }
}

export const scheduledSync = onSchedule("every 24 hours", async () => {
  if (!MCP_SCHEMES_URL) {
    logger.info("MCP_SCHEMES_URL not configured; keeping seed data in place")
    return
  }

  try {
    const res = await fetch(MCP_SCHEMES_URL, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) throw new Error(`MCP endpoint returned ${res.status}`)
    const payload = (await res.json()) as
      | McpSchemePayload[]
      | { schemes?: McpSchemePayload[] }
    const entries = Array.isArray(payload) ? payload : (payload.schemes ?? [])

    const normalized = entries
      .map(normalizeMcpEntry)
      .filter((s): s is Scheme => s !== null)

    if (normalized.length === 0) {
      logger.warn("MCP sync produced zero valid schemes; seed data untouched")
      return
    }

    const db = getFirestore()
    const batch = db.batch()
    for (const scheme of normalized) {
      batch.set(db.collection("schemes").doc(scheme.id), scheme, {
        merge: true,
      })
    }
    await batch.commit()
    logger.info(`MCP sync wrote ${normalized.length} schemes`)
  } catch (err) {
    // Fallback path: seeded data already in Firestore keeps everything alive.
    logger.warn(
      "MCP sync failed; falling back to existing seed data",
      err instanceof Error ? err.message : err,
    )
  }
})

export { schemesSeed }
