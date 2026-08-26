// Re-export all modular types
export * from "./scheme"
export * from "./partner"
export * from "./user"
export * from "./assessment"
export * from "./application"
export * from "./calculator"

// Legacy aliases — kept for backward compatibility with existing components
export type { SchemeType, MatchInput, MatchResponse } from "./assessment"
export type { ApplicationStatus, RoutingCheck, Application } from "./application"
export { APPLICATION_STATUS_ORDER } from "./application"

export type PartnerType = "SCA" | "PSB" | "RRB" | "NBFC_MFI"
export type NpaFlag = "low" | "medium" | "high"
export type EducationStatus =
  | "student"
  | "below_twelfth"
  | "twelfth"
  | "graduate"
  | "postgraduate"
  | "other"
export type ApplicantCategory = "sc" | "other"

export interface LocalizedText {
  en: string
  hi: string
}
