import { Timestamp } from "firebase/firestore"
import type { SchemeType } from "./assessment"

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "disbursed"
  | "scheme-identified"
  | "eligibility-checked"
  | "documents-prepared"
  | "partner-identified"
  | "application-started"
  | "application-submitted"
  | "decision"

export interface RoutingCheck {
  ok: boolean
  reasonKey?: "partner_not_handled" | "partner_high_npa"
}

export interface Application {
  id: string
  uid: string
  applicantName: string
  schemeId: string
  schemeType: SchemeType
  partnerId: string
  requestedAmount: number
  status: ApplicationStatus
  routingCheck: RoutingCheck
  createdAt: number
  updatedAt: number
}

export interface ApplicationDocument {
  id: string
  userId: string
  schemeId: string
  schemeName: { en: string; hi: string }
  partnerId?: string
  partnerName?: string
  requestedAmount: number
  status: ApplicationStatus
  journeySteps: Array<{
    step: string
    label: { en: string; hi: string }
    completed: boolean
    completedAt?: Timestamp
  }>
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "disbursed",
]
