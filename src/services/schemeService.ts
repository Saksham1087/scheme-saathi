import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Scheme } from "@/types"
import schemesSeed from "@seed/schemes.seed.json"

export function getSeedSchemes(): Scheme[] {
  return schemesSeed as unknown as Scheme[]
}

/**
 * Fetch schemes from Firestore with instant fallback to enriched seed data
 * when running offline, unauthenticated, or on network errors.
 */
export async function fetchSchemes(): Promise<Scheme[]> {
  try {
    const snap = await getDocs(collection(db, "schemes"))
    if (!snap.empty) {
      return snap.docs.map((d) => ({
        ...(d.data() as Scheme),
        id: d.id,
      }))
    }
    return getSeedSchemes()
  } catch (err) {
    console.warn("Firestore schemes fetch failed, falling back to seed data:", err)
    return getSeedSchemes()
  }
}

/**
 * Fetch a single scheme by ID from Firestore, with fallback to seed data.
 */
export async function fetchSchemeById(id: string): Promise<Scheme | null> {
  try {
    const docRef = doc(db, "schemes", id)
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      return {
        ...(snap.data() as Scheme),
        id: snap.id,
      }
    }
  } catch (err) {
    console.warn(`Firestore fetch for scheme ${id} failed, checking seed data:`, err)
  }

  const seedMatch = getSeedSchemes().find((s) => s.id === id)
  return seedMatch ?? null
}
