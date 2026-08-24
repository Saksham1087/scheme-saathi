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
  const snap = await db.collection("schemes").get()

  // Fallback: bundled seed keeps matching working even before seeding/MCP sync.
  const schemes: Scheme[] = snap.empty
    ? (schemesSeed as unknown as Scheme[])
    : snap.docs.map((d) => ({ ...(d.data() as Scheme), id: d.id }))

  const matches = evaluateMatches(input, schemes)
  return { matches, generatedAt: Date.now() }
})
