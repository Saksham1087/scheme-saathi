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

export type DocumentVerificationStatus =
  | "verified_digilocker"
  | "uploaded_manual"
  | "pending"

export interface VerificationMetadata {
  certificateNo: string
  issuer: string
  verifiedAt: string
  docType: string
  verificationSource: "digilocker"
  issuedTo?: string
  validUntil?: string
  uri?: string
  hash?: string
  additionalFields?: Record<string, string>
}

export interface UploadedFileRecord {
  fileName: string
  fileSize: number // in bytes
  fileType: string // e.g. "application/pdf", "image/jpeg", "image/png"
  uploadedAt: string
  previewUrl?: string
}

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
  verificationStatus?: DocumentVerificationStatus
  verificationMetadata?: VerificationMetadata
  uploadedFile?: UploadedFileRecord
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

