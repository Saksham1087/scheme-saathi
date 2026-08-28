import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
  type Unsubscribe,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

// ---------------------------------------------------------------------------
// Generic CRUD helpers
// ---------------------------------------------------------------------------

export interface ServiceResult<T> {
  data: T | null
  error: string | null
}

async function safeGet<T>(docRef: ReturnType<typeof doc>): Promise<ServiceResult<T>> {
  try {
    const snap = await getDoc(docRef)
    if (!snap.exists()) return { data: null, error: null }
    return { data: { id: snap.id, ...snap.data() } as T, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

async function safeGetDocs<T>(
  collRef: ReturnType<typeof collection>,
  ...constraints: QueryConstraint[]
): Promise<ServiceResult<T[]>> {
  try {
    const q = query(collRef, ...constraints)
    const snap = await getDocs(q)
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T))
    return { data: items, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

async function safeSet<T extends DocumentData>(
  docRef: ReturnType<typeof doc>,
  data: T,
): Promise<ServiceResult<void>> {
  try {
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true })
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

async function safeUpdate(
  docRef: ReturnType<typeof doc>,
  data: Partial<DocumentData>,
): Promise<ServiceResult<void>> {
  try {
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() })
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

async function safeDelete(
  docRef: ReturnType<typeof doc>,
): Promise<ServiceResult<void>> {
  try {
    await deleteDoc(docRef)
    return { data: null, error: null }
  } catch (err) {
    return { data: null, error: String(err) }
  }
}

// ---------------------------------------------------------------------------
// Real-time subscription helper
// ---------------------------------------------------------------------------

export function subscribeToQuery<T>(
  collRef: ReturnType<typeof collection>,
  callback: (items: T[]) => void,
  ...constraints: QueryConstraint[]
): Unsubscribe {
  const q = query(collRef, ...constraints)
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as T))
    callback(items)
  })
}

// ---------------------------------------------------------------------------
// Cursor-based pagination
// ---------------------------------------------------------------------------

export interface PaginatedResult<T> {
  data: T[]
  lastDoc: QueryDocumentSnapshot<DocumentData> | null
  hasMore: boolean
}

export async function paginateQuery<T>(
  collRef: ReturnType<typeof collection>,
  pageSize: number,
  cursor?: QueryDocumentSnapshot<DocumentData>,
  ...extraConstraints: QueryConstraint[]
): Promise<PaginatedResult<T>> {
  const constraints: QueryConstraint[] = [
    orderBy("createdAt", "desc"),
    firestoreLimit(pageSize + 1),
    ...extraConstraints,
  ]
  if (cursor) constraints.push(startAfter(cursor))

  const q = query(collRef, ...constraints)
  const snap = await getDocs(q)
  const docs = snap.docs
  const hasMore = docs.length > pageSize
  const data = docs.slice(0, pageSize).map((d) => ({ id: d.id, ...d.data() } as T))
  const lastDoc = hasMore ? docs[pageSize - 1] : docs[docs.length - 1] ?? null

  return { data, lastDoc, hasMore }
}

// ---------------------------------------------------------------------------
// Collection shortcuts
// ---------------------------------------------------------------------------

const col = {
  users: collection(db, "users"),
  schemes: collection(db, "schemes"),
  schemeRules: collection(db, "schemeRules"),
  partners: collection(db, "partners"),
  partnerSchemes: collection(db, "partnerSchemes"),
  recommendations: collection(db, "recommendations"),
  assessments: collection(db, "assessments"),
  categories: collection(db, "categories"),
  translations: collection(db, "translations"),
  adminUsers: collection(db, "adminUsers"),
}

const userCol = (uid: string) => ({
  savedSchemes: collection(db, "users", uid, "savedSchemes"),
  savedPartners: collection(db, "users", uid, "savedPartners"),
  calculatorHistory: collection(db, "users", uid, "calculatorHistory"),
  applicationJourneys: collection(db, "users", uid, "applicationJourneys"),
  documents: collection(db, "users", uid, "documents"),
})

// ---------------------------------------------------------------------------
// Scheme service
// ---------------------------------------------------------------------------

import type { SchemeDocument, SchemeRule } from "@/types/scheme"
import type { PartnerDocument } from "@/types/partner"
import type { UserProfile, SavedScheme, SavedPartner, ApplicationJourney, CalculatorHistory, Assessment } from "@/types/user"
import type { Recommendation } from "@/types/assessment"

export const schemeService = {
  getById: (id: string) =>
    safeGet<SchemeDocument>(doc(col.schemes, id)),

  getBySlug: (slug: string) =>
    safeGetDocs<SchemeDocument>(col.schemes, where("slug", "==", slug)),

  list: (constraints: QueryConstraint[] = []) =>
    safeGetDocs<SchemeDocument>(col.schemes, ...constraints),

  listActive: () =>
    safeGetDocs<SchemeDocument>(col.schemes, where("isActive", "==", true)),

  create: (id: string, data: Omit<SchemeDocument, "id" | "createdAt" | "updatedAt">) =>
    safeSet(doc(col.schemes, id), {
      ...data,
      createdAt: serverTimestamp(),
    }),

  update: (id: string, data: Partial<SchemeDocument>) =>
    safeUpdate(doc(col.schemes, id), data),

  delete: (id: string) => safeDelete(doc(col.schemes, id)),

  subscribe: (callback: (schemes: SchemeDocument[]) => void) =>
    subscribeToQuery<SchemeDocument>(col.schemes, callback, where("isActive", "==", true)),
}

// ---------------------------------------------------------------------------
// Scheme Rules service
// ---------------------------------------------------------------------------

export const schemeRuleService = {
  getBySchemeId: (schemeId: string) =>
    safeGetDocs<SchemeRule>(col.schemeRules, where("schemeId", "==", schemeId)),

  create: (id: string, data: Omit<SchemeRule, "id" | "createdAt" | "updatedAt">) =>
    safeSet(doc(col.schemeRules, id), {
      ...data,
      createdAt: serverTimestamp(),
    }),

  update: (id: string, data: Partial<SchemeRule>) =>
    safeUpdate(doc(col.schemeRules, id), data),

  delete: (id: string) => safeDelete(doc(col.schemeRules, id)),
}

// ---------------------------------------------------------------------------
// Partner service
// ---------------------------------------------------------------------------

export const partnerService = {
  getById: (id: string) =>
    safeGet<PartnerDocument>(doc(col.partners, id)),

  list: (constraints: QueryConstraint[] = []) =>
    safeGetDocs<PartnerDocument>(col.partners, ...constraints),

  listByState: (state: string) =>
    safeGetDocs<PartnerDocument>(
      col.partners,
      where("state", "==", state),
      where("isActive", "==", true),
    ),

  listByScheme: (schemeId: string) =>
    safeGetDocs<PartnerDocument>(
      col.partners,
      where("supportedSchemes", "array-contains", schemeId),
    ),

  create: (id: string, data: Omit<PartnerDocument, "id" | "createdAt" | "updatedAt">) =>
    safeSet(doc(col.partners, id), {
      ...data,
      createdAt: serverTimestamp(),
    }),

  update: (id: string, data: Partial<PartnerDocument>) =>
    safeUpdate(doc(col.partners, id), data),

  delete: (id: string) => safeDelete(doc(col.partners, id)),

  subscribe: (callback: (partners: PartnerDocument[]) => void) =>
    subscribeToQuery<PartnerDocument>(col.partners, callback, where("isActive", "==", true)),
}

// ---------------------------------------------------------------------------
// User profile service
// ---------------------------------------------------------------------------

export const userService = {
  getProfile: (uid: string) =>
    safeGet<UserProfile>(doc(col.users, uid)),

  upsertProfile: (uid: string, data: Partial<UserProfile>) =>
    safeSet(doc(col.users, uid), data),

  updateProfile: (uid: string, data: Partial<UserProfile>) =>
    safeUpdate(doc(col.users, uid), data),
}

// ---------------------------------------------------------------------------
// Saved schemes service
// ---------------------------------------------------------------------------

export const savedSchemeService = {
  list: (userId: string) =>
    safeGetDocs<SavedScheme>(userCol(userId).savedSchemes),

  save: (userId: string, schemeId: string) =>
    safeSet(doc(col.users, userId, "savedSchemes", schemeId), {
      userId,
      schemeId,
      savedAt: serverTimestamp(),
    }),

  remove: (userId: string, schemeId: string) =>
    safeDelete(doc(col.users, userId, "savedSchemes", schemeId)),

  subscribe: (userId: string, callback: (items: SavedScheme[]) => void) =>
    subscribeToQuery<SavedScheme>(userCol(userId).savedSchemes, callback),
}

// ---------------------------------------------------------------------------
// Saved partners service
// ---------------------------------------------------------------------------

export const savedPartnerService = {
  list: (userId: string) =>
    safeGetDocs<SavedPartner>(userCol(userId).savedPartners),

  save: (userId: string, partnerId: string) =>
    safeSet(doc(col.users, userId, "savedPartners", partnerId), {
      userId,
      partnerId,
      savedAt: serverTimestamp(),
    }),

  remove: (userId: string, partnerId: string) =>
    safeDelete(doc(col.users, userId, "savedPartners", partnerId)),

  subscribe: (userId: string, callback: (items: SavedPartner[]) => void) =>
    subscribeToQuery<SavedPartner>(userCol(userId).savedPartners, callback),
}

// ---------------------------------------------------------------------------
// Assessment service
// ---------------------------------------------------------------------------

export const assessmentService = {
  create: (data: Omit<Assessment, "id" | "createdAt">) =>
    safeSet(doc(collection(db, "assessments")), {
      ...data,
      createdAt: serverTimestamp(),
    }),

  listByUser: (userId: string) =>
    safeGetDocs<Assessment>(
      col.assessments,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    ),
}

// ---------------------------------------------------------------------------
// Recommendations service
// ---------------------------------------------------------------------------

export const recommendationService = {
  create: (data: Omit<Recommendation, "id" | "createdAt">) =>
    safeSet(doc(collection(db, "recommendations")), {
      ...data,
      createdAt: serverTimestamp(),
    }),

  listByUser: (userId: string) =>
    safeGetDocs<Recommendation>(
      col.recommendations,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    ),

  subscribe: (userId: string, callback: (items: Recommendation[]) => void) =>
    subscribeToQuery<Recommendation>(
      col.recommendations,
      callback,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    ),
}

// ---------------------------------------------------------------------------
// Application Journey service
// ---------------------------------------------------------------------------

export const applicationJourneyService = {
  create: (userId: string, data: Omit<ApplicationJourney, "id" | "createdAt" | "updatedAt">) =>
    safeSet(doc(userCol(userId).applicationJourneys), {
      ...data,
      createdAt: serverTimestamp(),
    }),

  update: (userId: string, journeyId: string, data: Partial<ApplicationJourney>) =>
    safeUpdate(doc(col.users, userId, "applicationJourneys", journeyId), data),

  list: (userId: string) =>
    safeGetDocs<ApplicationJourney>(
      userCol(userId).applicationJourneys,
      orderBy("createdAt", "desc"),
    ),

  subscribe: (userId: string, callback: (items: ApplicationJourney[]) => void) =>
    subscribeToQuery<ApplicationJourney>(
      userCol(userId).applicationJourneys,
      callback,
      orderBy("createdAt", "desc"),
    ),
}

// ---------------------------------------------------------------------------
// Calculator history service
// ---------------------------------------------------------------------------

export const calculatorHistoryService = {
  create: (userId: string, data: Omit<CalculatorHistory, "id" | "createdAt">) =>
    safeSet(doc(userCol(userId).calculatorHistory), {
      ...data,
      createdAt: serverTimestamp(),
    }),

  list: (userId: string) =>
    safeGetDocs<CalculatorHistory>(
      userCol(userId).calculatorHistory,
      orderBy("createdAt", "desc"),
    ),
}
