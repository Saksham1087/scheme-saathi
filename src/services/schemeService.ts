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

function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output: Record<string, any> = { ...target }
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceVal = source[key]
      const targetVal = output[key]
      if (
        sourceVal &&
        typeof sourceVal === "object" &&
        !Array.isArray(sourceVal) &&
        targetVal &&
        typeof targetVal === "object" &&
        !Array.isArray(targetVal)
      ) {
        output[key] = deepMerge(targetVal, sourceVal)
      } else if (sourceVal !== undefined) {
        output[key] = sourceVal
      }
    }
  }
  return output as T
}

/**
 * Fetch a single scheme by ID from Firestore, with fallback to seed data.
 */
export async function fetchSchemeById(id: string): Promise<Scheme | null> {
  const seedMatch = getSeedSchemes().find((s) => s.id === id)
  try {
    const docRef = doc(db, "schemes", id)
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      const firestoreData = snap.data() as Scheme
      if (seedMatch) {
        return {
          ...deepMerge(seedMatch, firestoreData),
          id: snap.id,
        }
      }
      return {
        ...firestoreData,
        id: snap.id,
      }
    }
  } catch (err) {
    console.warn(`Firestore fetch for scheme ${id} failed, checking seed data:`, err)
  }

  return seedMatch ?? null
}
