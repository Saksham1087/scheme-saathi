import { onCall, HttpsError } from "firebase-functions/v2/https"
import { getFirestore } from "firebase-admin/firestore"
import { evaluateMatches } from "./engine/rules"
import schemesSeed from "./data/schemes.seed.json"
import type { Scheme } from "./types"

/**
 * Scheme Recommender entry point.
 * Reads the `schemes` collection (MCP-synced or seeded), runs the pure rule
 * engine, returns ranked matches. The engine is a pure function — swap it for
 * an ML classifier later without touching this contract.
 */
export const matchSchemes = onCall(async (request) => {
  const input = request.data?.input
  if (!input || typeof input !== "object") {
    throw new HttpsError("invalid-argument", "input object required")
  }
  if (
    typeof input.estimatedCost !== "number" ||
    typeof input.annualFamilyIncome !== "number" ||
    !input.projectType
  ) {
    throw new HttpsError(
      "invalid-argument",
      "projectType, estimatedCost and annualFamilyIncome are required",
    )
  }

  const db = getFirestore()

  // Push cost filter into Firestore to avoid reading all 1,795 docs.
  const snap = await db
    .collection("schemes")
    .where("maxProjectCost", ">=", input.estimatedCost)
    .get()

  // Fallback: bundled seed keeps matching working even before seeding/MCP sync.
  const schemes: Scheme[] = snap.empty
    ? (schemesSeed as unknown as Scheme[])
    : snap.docs.map((d) => ({ ...(d.data() as Scheme), id: d.id }))

  const allMatches = evaluateMatches(input, schemes)

  // Cap response size — return eligible first, then top non-eligible, max 30 total.
  const eligible = allMatches.filter((m) => m.eligible).slice(0, 25)
  const ineligible = allMatches.filter((m) => !m.eligible).slice(0, 5)
  const matches = [...eligible, ...ineligible]

  return { matches, generatedAt: Date.now() }
})
