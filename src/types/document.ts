import type { LocalizedText, SchemeType } from "./index"

export type DocumentCategory =
  | "identity"
  | "address"
  | "caste_income"
  | "project_finance"
  | "education"
  | "statutory"
  | "all"

export type DocumentReadinessStatus = "not_started" | "in_progress" | "ready_to_apply"

export interface RequiredDocument {
  id: string
  name: LocalizedText
  description: LocalizedText
  category: DocumentCategory
  mandatory: boolean
  issuingAuthority: LocalizedText
  guidanceNotes?: LocalizedText
  alternativeDocs?: LocalizedText
  sampleDocUrl?: string
  applicableSchemes?: string[]
  digiLockerVerifiable?: boolean
}

export interface DocumentCheckState {
  documentId: string
  checked: boolean
  notes?: string
  verifiedDigiLocker?: boolean
  updatedAt?: number
}

export interface DocumentReadinessState {
  totalCount: number
  completedCount: number
  percentage: number
  status: DocumentReadinessStatus
  mandatoryTotal: number
  mandatoryCompleted: number
}

export interface SchemeDocumentConfig {
  schemeId: string
  schemeType: SchemeType
  schemeName: LocalizedText
  documents: RequiredDocument[]
  specialInstructions?: LocalizedText
}
