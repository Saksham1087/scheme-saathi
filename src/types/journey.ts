export type JourneyStepStatus = "pending" | "in-progress" | "completed"

export interface JourneyStep {
  id: string
  labelKey: string
  status: JourneyStepStatus
  completedAt?: string
}

export interface ApplicationJourney {
  id: string
  schemeId: string
  schemeSlug: string
  currentStep: number
  steps: JourneyStep[]
  createdAt: string
  updatedAt: string
}

export const JOURNEY_STEPS = [
  { id: "scheme-identified", labelKey: "journey.steps.identified" },
  { id: "eligibility-checked", labelKey: "journey.steps.eligibility" },
  { id: "documents-prepared", labelKey: "journey.steps.documents" },
  { id: "partner-identified", labelKey: "journey.steps.partner" },
  { id: "application-started", labelKey: "journey.steps.started" },
  { id: "application-submitted", labelKey: "journey.steps.submitted" },
  { id: "under-review", labelKey: "journey.steps.review" },
  { id: "decision", labelKey: "journey.steps.decision" },
] as const

export const MILESTONE_STEPS = ["documents-prepared", "application-submitted", "decision"] as const

export const STEP_ACTIONS: Record<string, { labelKey: string; href?: string; external?: boolean }> = {
  "eligibility-checked": { labelKey: "journey.actions.checkEligibility", href: "/recommend" },
  "documents-prepared": { labelKey: "journey.actions.prepareDocs" },
  "partner-identified": { labelKey: "journey.actions.findPartner", href: "/partners" },
  "application-started": { labelKey: "journey.actions.startApplication", external: true },
}

export function createJourney(schemeId: string, schemeSlug: string): ApplicationJourney {
  const now = new Date().toISOString()
  return {
    id: `${schemeId}-${Date.now()}`,
    schemeId,
    schemeSlug,
    currentStep: 0,
    steps: JOURNEY_STEPS.map((s, i) => ({
      ...s,
      status: i === 0 ? "completed" : "pending",
      completedAt: i === 0 ? now : undefined,
    })),
    createdAt: now,
    updatedAt: now,
  }
}
