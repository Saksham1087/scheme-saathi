import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import {
  type ApplicationJourney,
  type ApplicationStageKey,
  type MilestoneRecord,
  APPLICATION_STAGE_KEYS,
} from "@/types/application"
import type { LocalizedText, SchemeType } from "@/types"

export function createInitialStages(precompletedCount = 0): MilestoneRecord[] {
  const now = new Date().toISOString()
  return APPLICATION_STAGE_KEYS.map((key, index) => {
    const isCompleted = index < precompletedCount
    return {
      stageKey: key,
      order: index + 1,
      completed: isCompleted,
      completedAt: isCompleted ? now : undefined,
      notes: "",
      referenceNumber: "",
      updatedAt: Date.now(),
    }
  })
}

function calculateCurrentStage(stages: MilestoneRecord[]): {
  currentStage: ApplicationStageKey
  currentStageIndex: number
} {
  const firstIncompleteIdx = stages.findIndex((s) => !s.completed)
  if (firstIncompleteIdx === -1) {
    // All 8 completed
    return {
      currentStage: APPLICATION_STAGE_KEYS[APPLICATION_STAGE_KEYS.length - 1],
      currentStageIndex: APPLICATION_STAGE_KEYS.length - 1,
    }
  }
  return {
    currentStage: stages[firstIncompleteIdx].stageKey,
    currentStageIndex: firstIncompleteIdx,
  }
}

const DEFAULT_DEMO_JOURNEYS: ApplicationJourney[] = [
  {
    id: "journey-demo-micro-up-sca",
    userId: undefined,
    schemeId: "micro-finance",
    schemeName: {
      en: "Micro Finance Scheme",
      hi: "सूक्ष्म वित्त योजना",
    },
    schemeType: "micro",
    partnerId: "sca-up-01",
    partnerName: "UP Scheduled Castes Finance & Development Corp (UPSCFDC)",
    partnerBranch: "Lucknow SCA Regional HQ, Hazratganj",
    partnerAddress: "Navchetna Kendra, 10 Ashok Marg, Hazratganj, Lucknow, UP - 226001",
    partnerPhone: "+91-522-2287654",
    nodalOfficerName: "Shri R. K. Verma",
    nodalOfficerPhone: "+91-94150-12345",
    requestedAmount: 140000,
    acknowledgmentNumber: "UP-SCA-2026-889",
    currentStage: "docs_prepared",
    currentStageIndex: 2,
    stages: [
      {
        stageKey: "scheme_identified",
        order: 1,
        completed: true,
        completedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        notes: "Evaluated 100-pt match. Micro finance unit cost ₹1.40L with 5% interest subsidy.",
      },
      {
        stageKey: "eligibility_checked",
        order: 2,
        completed: true,
        completedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        notes: "Family income ₹2,10,000 verified. SC caste certificate authentic.",
      },
      {
        stageKey: "docs_prepared",
        order: 3,
        completed: false,
        notes: "Aadhaar, Caste Certificate, and Project Quotation prepared. Need 2 physical sets.",
      },
      {
        stageKey: "partner_selected",
        order: 4,
        completed: false,
        notes: "",
      },
      {
        stageKey: "form_filled",
        order: 5,
        completed: false,
        notes: "",
      },
      {
        stageKey: "submitted",
        order: 6,
        completed: false,
        referenceNumber: "",
        notes: "",
      },
      {
        stageKey: "under_review",
        order: 7,
        completed: false,
        notes: "",
      },
      {
        stageKey: "sanction_decision",
        order: 8,
        completed: false,
        notes: "",
      },
    ],
    notes: "Targeting setting up a digital service & general grocery point in Lucknow.",
    isSynthetic: true,
    createdAt: Date.now() - 4 * 86400000,
    updatedAt: Date.now() - 3 * 86400000,
  },
]

export interface ApplicationStoreState {
  applications: ApplicationJourney[]
  activeJourneyId: string | null

  // Selectors & Actions
  setActiveJourneyId: (id: string | null) => void
  getActiveJourney: () => ApplicationJourney | undefined
  getJourneyById: (id: string) => ApplicationJourney | undefined
  createJourney: (params: {
    schemeId: string
    schemeName: LocalizedText
    schemeType: SchemeType
    partnerId: string
    partnerName: string
    partnerBranch?: string
    partnerAddress?: string
    partnerPhone?: string
    nodalOfficerName?: string
    nodalOfficerPhone?: string
    requestedAmount: number
    acknowledgmentNumber?: string
    initialNotes?: string
    userId?: string
  }) => ApplicationJourney
  toggleMilestone: (journeyId: string, stageKey: ApplicationStageKey) => void
  setMilestoneCompleted: (
    journeyId: string,
    stageKey: ApplicationStageKey,
    completed: boolean
  ) => void
  updateMilestoneNotes: (
    journeyId: string,
    stageKey: ApplicationStageKey,
    notes: string
  ) => void
  updateAcknowledgmentNumber: (journeyId: string, ackNumber: string) => void
  updateJourneyNotes: (journeyId: string, notes: string) => void
  deleteJourney: (journeyId: string) => void
  resetJourneyToBeginning: (journeyId: string) => void
  getJourneyProgress: (journeyId: string) => {
    completedCount: number
    totalCount: number
    percentage: number
    currentStage: ApplicationStageKey
    currentStageIndex: number
  }
}

export const useApplicationStore = create<ApplicationStoreState>()(
  persist(
    (set, get) => ({
      applications: DEFAULT_DEMO_JOURNEYS,
      activeJourneyId: DEFAULT_DEMO_JOURNEYS[0].id,

      setActiveJourneyId: (id: string | null) => {
        set({ activeJourneyId: id })
      },

      getActiveJourney: () => {
        const { applications, activeJourneyId } = get()
        if (!applications.length) return undefined
        if (!activeJourneyId) return applications[0]
        return applications.find((a) => a.id === activeJourneyId) ?? applications[0]
      },

      getJourneyById: (id: string) => {
        return get().applications.find((a) => a.id === id)
      },

      createJourney: (params) => {
        const id = `journey-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        const stages = createInitialStages(1) // Stage 1 (scheme identified) pre-completed upon journey initiation
        const stageCalc = calculateCurrentStage(stages)

        const newJourney: ApplicationJourney = {
          id,
          userId: params.userId,
          schemeId: params.schemeId,
          schemeName: params.schemeName,
          schemeType: params.schemeType,
          partnerId: params.partnerId,
          partnerName: params.partnerName,
          partnerBranch: params.partnerBranch,
          partnerAddress: params.partnerAddress,
          partnerPhone: params.partnerPhone,
          nodalOfficerName: params.nodalOfficerName,
          nodalOfficerPhone: params.nodalOfficerPhone,
          requestedAmount: params.requestedAmount,
          acknowledgmentNumber: params.acknowledgmentNumber || "",
          currentStage: stageCalc.currentStage,
          currentStageIndex: stageCalc.currentStageIndex,
          stages,
          notes: params.initialNotes || "",
          isSynthetic: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }

        set((state) => ({
          applications: [newJourney, ...state.applications],
          activeJourneyId: id,
        }))

        return newJourney
      },

      toggleMilestone: (journeyId, stageKey) => {
        const { applications } = get()
        const journeyIndex = applications.findIndex((a) => a.id === journeyId)
        if (journeyIndex === -1) return

        const journey = applications[journeyIndex]
        const stageIndex = journey.stages.findIndex((s) => s.stageKey === stageKey)
        if (stageIndex === -1) return

        const currentCompleted = journey.stages[stageIndex].completed
        const nextCompleted = !currentCompleted
        const now = new Date().toISOString()

        const updatedStages = journey.stages.map((s, idx) => {
          if (idx === stageIndex) {
            return {
              ...s,
              completed: nextCompleted,
              completedAt: nextCompleted ? now : undefined,
              updatedAt: Date.now(),
            }
          }
          return s
        })

        const stageCalc = calculateCurrentStage(updatedStages)

        const updatedJourney: ApplicationJourney = {
          ...journey,
          stages: updatedStages,
          currentStage: stageCalc.currentStage,
          currentStageIndex: stageCalc.currentStageIndex,
          updatedAt: Date.now(),
        }

        const nextApps = [...applications]
        nextApps[journeyIndex] = updatedJourney
        set({ applications: nextApps })
      },

      setMilestoneCompleted: (journeyId, stageKey, completed) => {
        const { applications } = get()
        const journeyIndex = applications.findIndex((a) => a.id === journeyId)
        if (journeyIndex === -1) return

        const journey = applications[journeyIndex]
        const stageIndex = journey.stages.findIndex((s) => s.stageKey === stageKey)
        if (stageIndex === -1) return

        const now = new Date().toISOString()
        const updatedStages = journey.stages.map((s, idx) => {
          if (idx === stageIndex) {
            return {
              ...s,
              completed,
              completedAt: completed ? now : undefined,
              updatedAt: Date.now(),
            }
          }
          return s
        })

        const stageCalc = calculateCurrentStage(updatedStages)

        const updatedJourney: ApplicationJourney = {
          ...journey,
          stages: updatedStages,
          currentStage: stageCalc.currentStage,
          currentStageIndex: stageCalc.currentStageIndex,
          updatedAt: Date.now(),
        }

        const nextApps = [...applications]
        nextApps[journeyIndex] = updatedJourney
        set({ applications: nextApps })
      },

      updateMilestoneNotes: (journeyId, stageKey, notes) => {
        const { applications } = get()
        const journeyIndex = applications.findIndex((a) => a.id === journeyId)
        if (journeyIndex === -1) return

        const journey = applications[journeyIndex]
        const updatedStages = journey.stages.map((s) => {
          if (s.stageKey === stageKey) {
            return { ...s, notes, updatedAt: Date.now() }
          }
          return s
        })

        const nextApps = [...applications]
        nextApps[journeyIndex] = {
          ...journey,
          stages: updatedStages,
          updatedAt: Date.now(),
        }
        set({ applications: nextApps })
      },

      updateAcknowledgmentNumber: (journeyId, ackNumber) => {
        const { applications } = get()
        const journeyIndex = applications.findIndex((a) => a.id === journeyId)
        if (journeyIndex === -1) return

        const journey = applications[journeyIndex]
        // Also update referenceNumber on submitted stage (stage 6) if present
        const updatedStages = journey.stages.map((s) => {
          if (s.stageKey === "submitted") {
            return { ...s, referenceNumber: ackNumber, updatedAt: Date.now() }
          }
          return s
        })

        const nextApps = [...applications]
        nextApps[journeyIndex] = {
          ...journey,
          acknowledgmentNumber: ackNumber,
          stages: updatedStages,
          updatedAt: Date.now(),
        }
        set({ applications: nextApps })
      },

      updateJourneyNotes: (journeyId, notes) => {
        const { applications } = get()
        const journeyIndex = applications.findIndex((a) => a.id === journeyId)
        if (journeyIndex === -1) return

        const journey = applications[journeyIndex]
        const nextApps = [...applications]
        nextApps[journeyIndex] = {
          ...journey,
          notes,
          updatedAt: Date.now(),
        }
        set({ applications: nextApps })
      },

      deleteJourney: (journeyId) => {
        const { applications, activeJourneyId } = get()
        const remaining = applications.filter((a) => a.id !== journeyId)
        const nextActiveId =
          activeJourneyId === journeyId
            ? remaining.length > 0
              ? remaining[0].id
              : null
            : activeJourneyId

        set({
          applications: remaining,
          activeJourneyId: nextActiveId,
        })
      },

      resetJourneyToBeginning: (journeyId) => {
        const { applications } = get()
        const journeyIndex = applications.findIndex((a) => a.id === journeyId)
        if (journeyIndex === -1) return

        const journey = applications[journeyIndex]
        const freshStages = createInitialStages(1)
        const stageCalc = calculateCurrentStage(freshStages)

        const nextApps = [...applications]
        nextApps[journeyIndex] = {
          ...journey,
          stages: freshStages,
          currentStage: stageCalc.currentStage,
          currentStageIndex: stageCalc.currentStageIndex,
          acknowledgmentNumber: "",
          updatedAt: Date.now(),
        }
        set({ applications: nextApps })
      },

      getJourneyProgress: (journeyId) => {
        const journey = get().applications.find((a) => a.id === journeyId)
        if (!journey) {
          return {
            completedCount: 0,
            totalCount: APPLICATION_STAGE_KEYS.length,
            percentage: 0,
            currentStage: APPLICATION_STAGE_KEYS[0],
            currentStageIndex: 0,
          }
        }

        const totalCount = journey.stages.length || APPLICATION_STAGE_KEYS.length
        const completedCount = journey.stages.filter((s) => s.completed).length
        const percentage = Math.round((completedCount / totalCount) * 100)

        return {
          completedCount,
          totalCount,
          percentage,
          currentStage: journey.currentStage,
          currentStageIndex: journey.currentStageIndex,
        }
      },
    }),
    {
      name: "scheme-saathi-application-journeys",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        applications: state.applications,
        activeJourneyId: state.activeJourneyId,
      }),
    }
  )
)
