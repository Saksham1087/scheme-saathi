import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useIntakeStore } from "@/stores/intakeStore"

/**
 * Persist the consent timestamp + basic profile once a user logs in.
 * Sensitive intake values (income, category) are NOT copied here — they live
 * only in application documents created through submitApplication.
 */
export async function persistConsentIfAny(uid: string): Promise<void> {
  const consentAt = useIntakeStore.getState().consentAt
  if (!consentAt) return
  const ref = doc(db, "users", uid)
  const existing = await getDoc(ref)
  if (existing.exists() && existing.data().consent?.demographicAt) return
  await setDoc(
    ref,
    { consent: { demographicAt: consentAt }, updatedAt: serverTimestamp() },
    { merge: true },
  )
}
