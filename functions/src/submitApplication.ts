import { onCall, HttpsError } from "firebase-functions/v2/https"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import type { SchemeType } from "./types"

interface SubmitPayload {
  schemeId: string
  partnerId: string
  requestedAmount: number
  applicantName?: string
}

/**
 * Misrouting prevention (server side).
 * The UI blocks incompatible partners; this callable is the enforcement
 * point — an application can only be created when the partner handles the
 * matched scheme category.
 */
export const submitApplication = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Log in to submit applications")
  }
  const { schemeId, partnerId, requestedAmount, applicantName } =
    request.data as SubmitPayload
  if (!schemeId || !partnerId || typeof requestedAmount !== "number") {
    throw new HttpsError(
      "invalid-argument",
      "schemeId, partnerId and requestedAmount are required",
    )
  }

  const db = getFirestore()
  const [schemeDoc, partnerDoc] = await Promise.all([
    db.collection("schemes").doc(schemeId).get(),
    db.collection("partners").doc(partnerId).get(),
  ])
  if (!schemeDoc.exists) throw new HttpsError("not-found", `Unknown scheme ${schemeId}`)
  if (!partnerDoc.exists) throw new HttpsError("not-found", `Unknown partner ${partnerId}`)

  const scheme = schemeDoc.data() as { type: SchemeType } | undefined
  const partner = partnerDoc.data() as
    | { schemeCategories: SchemeType[]; npaFlag: string }
    | undefined

  // Hard routing validation — the misrouting fix.
  if (partner && !partner.schemeCategories.includes(scheme!.type)) {
    return {
      ok: false,
      reasonKey: "partner_not_handled",
      message: `${partnerDoc.id} does not handle ${scheme!.type} schemes`,
    }
  }

  const now = FieldValue.serverTimestamp()
  const ref = await db.collection("applications").add({
    uid: request.auth.uid,
    applicantName: applicantName ?? "",
    schemeId,
    schemeType: scheme!.type,
    partnerId,
    requestedAmount,
    status: "submitted",
    routingCheck: {
      ok: true,
      reasonKey: partner?.npaFlag === "high" ? "partner_high_npa" : null,
    },
    createdAt: now,
    updatedAt: now,
  })

  return { ok: true, applicationId: ref.id }
})
