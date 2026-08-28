/**
 * Seed Firestore with scheme data from src/data/schemes/.
 *
 * Emulator:   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npx tsx scripts/seed-schemes-v2.ts
 * Production: GOOGLE_APPLICATION_CREDENTIALS=path/to/sa.json npx tsx scripts/seed-schemes-v2.ts
 */
import { readFileSync, readdirSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore, FieldValue } from "firebase-admin/firestore"

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = resolve(here, "../src/data/schemes")

const onEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST)

if (!onEmulator && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    "Refusing to seed production without credentials.\n" +
      "Use FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 for local dev,\n" +
      "or set GOOGLE_APPLICATION_CREDENTIALS for production.",
  )
  process.exit(1)
}

if (!getApps().length) {
  initializeApp(
    onEmulator
      ? { projectId: process.env.GCLOUD_PROJECT || "scheme-saathi-demo" }
      : { credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS!) },
  )
}

const db = getFirestore()

// ---------------------------------------------------------------------------
// Load all scheme JSON files
// ---------------------------------------------------------------------------

interface SeedScheme {
  slug: string
  name: { en: string; hi: string }
  ministry: string
  category: string[]
  description: { en: string; hi: string }
  shortDescription: { en: string; hi: string }
  purpose: string
  targetBeneficiaries: string[]
  financialAssistance: Record<string, unknown>
  eligibilityRules: Record<string, unknown>
  requiredDocuments: Array<{ name: string; description: string; mandatory: boolean; format?: string }>
  applicationProcess?: string
  channelPartnerTypes: string[]
  officialUrl?: string
  source: string
  lastUpdated: string
  verified: boolean
  isActive: boolean
}

function loadAllSchemes(): SeedScheme[] {
  const files = readdirSync(dataDir).filter((f) => f.endsWith(".json") && f !== "categories.json")
  const all: SeedScheme[] = []
  for (const file of files) {
    const raw = JSON.parse(readFileSync(resolve(dataDir, file), "utf8")) as SeedScheme[]
    all.push(...raw)
    console.log(`  Loaded ${raw.length} schemes from ${file}`)
  }
  return all
}

function loadCategories(): Array<{ id: string; name: { en: string; hi: string }; icon: string }> {
  return JSON.parse(readFileSync(resolve(dataDir, "categories.json"), "utf8"))
}

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------

async function seedSchemes(schemes: SeedScheme[]) {
  const batch = db.batch()
  let count = 0

  for (const scheme of schemes) {
    const ref = db.collection("schemes").doc(scheme.slug)
    batch.set(
      ref,
      {
        ...scheme,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
    count++
  }

  await batch.commit()
  console.log(`✓ Seeded ${count} schemes`)
}

async function seedCategories() {
  const categories = loadCategories()
  const batch = db.batch()

  for (const cat of categories) {
    const ref = db.collection("categories").doc(cat.id)
    batch.set(ref, cat, { merge: true })
  }

  await batch.commit()
  console.log(`✓ Seeded ${categories.length} categories`)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Loading seed data...")
  const schemes = loadAllSchemes()

  console.log("\nSeeding schemes...")
  await seedSchemes(schemes)

  console.log("Seeding categories...")
  await seedCategories()

  console.log("\nSeed complete.")
}

main().catch((err) => {
  console.error("Seeding failed:", err)
  process.exit(1)
})
