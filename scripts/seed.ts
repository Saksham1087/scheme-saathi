/**
 * Seed emulator or production Firestore with schemes + channel partners.
 *
 * Emulator:   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npx tsx scripts/seed.ts
 * Production: GOOGLE_APPLICATION_CREDENTIALS=path/to/sa.json npx tsx scripts/seed.ts
 */
import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const here = dirname(fileURLToPath(import.meta.url))
const dataDir = resolve(here, "../functions/src/data")

const schemes = JSON.parse(
  readFileSync(resolve(dataDir, "schemes.seed.json"), "utf8"),
) as unknown[]
const partners = JSON.parse(
  readFileSync(resolve(dataDir, "partners.seed.json"), "utf8"),
) as Record<string, unknown>[]

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
  initializeApp(onEmulator ? { projectId: "scheme-saathi-demo" } : {
    credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS!),
  })
}

const db = getFirestore()

async function writeCollection(name: string, docs: Record<string, unknown>[]) {
  const batch = db.batch()
  for (const doc of docs) {
    const { id, ...rest } = doc
    batch.set(db.collection(name).doc(id as string), rest)
  }
  await batch.commit()
  console.log(`Seeded ${docs.length} documents into "${name}"`)
}

await writeCollection("schemes", schemes)
await writeCollection("partners", partners)
console.log("Seed complete.")
