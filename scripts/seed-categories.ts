/**
 * Seed Firestore with scheme categories.
 *
 * Emulator:   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npx tsx scripts/seed-categories.ts
 * Production: GOOGLE_APPLICATION_CREDENTIALS=path/to/sa.json npx tsx scripts/seed-categories.ts
 */
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const onEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST)

if (!getApps().length) {
  initializeApp(
    onEmulator ? undefined : { credential: cert("service-account.json") },
  )
}

const db = getFirestore()

const categories = [
  { id: "business", name: { en: "Business", hi: "व्यवसाय" }, icon: "briefcase" },
  { id: "education", name: { en: "Education", hi: "शिक्षा" }, icon: "graduation-cap" },
  { id: "agriculture", name: { en: "Agriculture", hi: "कृषि" }, icon: "sprout" },
  { id: "transport", name: { en: "Transport", hi: "परिवहन" }, icon: "truck" },
  { id: "housing", name: { en: "Housing", hi: "आवास" }, icon: "home" },
  { id: "health", name: { en: "Health", hi: "स्वास्थ्य" }, icon: "heart" },
  { id: "social-welfare", name: { en: "Social Welfare", hi: "सामाजिक कल्याण" }, icon: "users" },
  { id: "employment", name: { en: "Employment", hi: "रोजगार" }, icon: "briefcase" },
  { id: "other", name: { en: "Other", hi: "अन्य" }, icon: "layers" },
]

async function seed() {
  const batch = db.batch()

  for (const cat of categories) {
    const ref = db.collection("categories").doc(cat.id)
    batch.set(ref, cat, { merge: true })
  }

  await batch.commit()
  console.log(`✓ Seeded ${categories.length} categories`)
}

seed().catch((err) => {
  console.error("Category seeding failed:", err)
  process.exit(1)
})
