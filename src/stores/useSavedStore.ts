import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { SavedCalculationRecord, SavedEntityState } from "@/types/saved"

export interface SavedStoreState extends SavedEntityState {
  // Scheme bookmark actions
  saveScheme: (schemeId: string) => void
  removeScheme: (schemeId: string) => void
  toggleSavedScheme: (schemeId: string) => boolean
  isSchemeSaved: (schemeId: string) => boolean

  // Partner bookmark actions
  savePartner: (partnerId: string) => void
  removePartner: (partnerId: string) => void
  toggleSavedPartner: (partnerId: string) => boolean
  isPartnerSaved: (partnerId: string) => boolean

  // Calculations & budgets actions
  saveCalculation: (
    record: Omit<SavedCalculationRecord, "id" | "calculatedAt"> & { id?: string }
  ) => SavedCalculationRecord
  removeCalculation: (id: string) => void

  // Clear all
  clearAllSaved: () => void
}

const DEFAULT_SAVED_SCHEMES: string[] = ["micro-finance", "term-loan"]
const DEFAULT_SAVED_PARTNERS: string[] = ["sca-up-01"]
const DEFAULT_SAVED_CALCULATIONS: SavedCalculationRecord[] = [
  {
    id: "calc-demo-micro-1",
    type: "emi",
    title: "Micro Finance Loan (₹1.40L @ 5% for 3 yrs)",
    calculatedAt: Date.now() - 2 * 86400000,
    principal: 140000,
    annualRatePct: 5,
    tenureMonths: 36,
    moratoriumMonths: 6,
    moratoriumInterestAccrues: false,
    monthlyEmi: 4195,
    totalInterest: 11020,
    totalPayment: 151020,
    schemeId: "micro-finance",
    schemeName: "Micro Finance Scheme",
  },
  {
    id: "calc-demo-kirana-1",
    type: "budget",
    title: "Small Retail Kirana Shop Project Budget",
    calculatedAt: Date.now() - 1 * 86400000,
    projectTitle: "Small Retail Kirana Shop",
    projectType: "shop",
    totalProjectCost: 200000,
    loanAmount: 180000,
    promoterMargin: 20000,
    subsidyAmount: 0,
    itemCount: 4,
  },
]

export const useSavedStore = create<SavedStoreState>()(
  persist(
    (set, get) => ({
      savedSchemeIds: DEFAULT_SAVED_SCHEMES,
      savedPartnerIds: DEFAULT_SAVED_PARTNERS,
      savedCalculations: DEFAULT_SAVED_CALCULATIONS,

      saveScheme: (schemeId: string) => {
        const { savedSchemeIds } = get()
        if (!savedSchemeIds.includes(schemeId)) {
          set({ savedSchemeIds: [schemeId, ...savedSchemeIds] })
        }
      },

      removeScheme: (schemeId: string) => {
        set({
          savedSchemeIds: get().savedSchemeIds.filter((id) => id !== schemeId),
        })
      },

      toggleSavedScheme: (schemeId: string) => {
        const { savedSchemeIds } = get()
        const isSaved = savedSchemeIds.includes(schemeId)
        if (isSaved) {
          set({ savedSchemeIds: savedSchemeIds.filter((id) => id !== schemeId) })
          return false
        } else {
          set({ savedSchemeIds: [schemeId, ...savedSchemeIds] })
          return true
        }
      },

      isSchemeSaved: (schemeId: string) => {
        return get().savedSchemeIds.includes(schemeId)
      },

      savePartner: (partnerId: string) => {
        const { savedPartnerIds } = get()
        if (!savedPartnerIds.includes(partnerId)) {
          set({ savedPartnerIds: [partnerId, ...savedPartnerIds] })
        }
      },

      removePartner: (partnerId: string) => {
        set({
          savedPartnerIds: get().savedPartnerIds.filter((id) => id !== partnerId),
        })
      },

      toggleSavedPartner: (partnerId: string) => {
        const { savedPartnerIds } = get()
        const isSaved = savedPartnerIds.includes(partnerId)
        if (isSaved) {
          set({ savedPartnerIds: savedPartnerIds.filter((id) => id !== partnerId) })
          return false
        } else {
          set({ savedPartnerIds: [partnerId, ...savedPartnerIds] })
          return true
        }
      },

      isPartnerSaved: (partnerId: string) => {
        return get().savedPartnerIds.includes(partnerId)
      },

      saveCalculation: (record) => {
        const id =
          record.id ||
          `calc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        const newRecord: SavedCalculationRecord = {
          ...record,
          id,
          calculatedAt: Date.now(),
        }

        set((state) => ({
          savedCalculations: [
            newRecord,
            ...state.savedCalculations.filter((c) => c.id !== id),
          ],
        }))

        return newRecord
      },

      removeCalculation: (id: string) => {
        set({
          savedCalculations: get().savedCalculations.filter((c) => c.id !== id),
        })
      },

      clearAllSaved: () => {
        set({
          savedSchemeIds: [],
          savedPartnerIds: [],
          savedCalculations: [],
        })
      },
    }),
    {
      name: "scheme-saathi-saved-entities",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        savedSchemeIds: state.savedSchemeIds,
        savedPartnerIds: state.savedPartnerIds,
        savedCalculations: state.savedCalculations,
      }),
    }
  )
)
