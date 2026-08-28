import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { toast } from "sonner"
import i18next from "i18next"

export const MAX_COMPARE_SCHEMES = 4

export interface CompareState {
  selectedSchemeIds: string[]
  highlightDifferences: boolean

  // Actions
  addScheme: (id: string) => boolean
  removeScheme: (id: string) => void
  toggleScheme: (id: string) => void
  clearAll: () => void
  setSchemes: (ids: string[]) => void
  isComparing: (id: string) => boolean
  setHighlightDifferences: (highlight: boolean) => void
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      selectedSchemeIds: [],
      highlightDifferences: false,

      addScheme: (id: string) => {
        const { selectedSchemeIds } = get()
        if (selectedSchemeIds.includes(id)) {
          return false
        }
        if (selectedSchemeIds.length >= MAX_COMPARE_SCHEMES) {
          const maxMsg = i18next.t(
            "compare.maxLimitToast",
            "You can compare up to 4 schemes simultaneously."
          )
          toast.warning(maxMsg)
          return false
        }
        set({ selectedSchemeIds: [...selectedSchemeIds, id] })
        const addedMsg = i18next.t(
          "compare.schemeAddedToast",
          "Scheme added to comparison tray."
        )
        toast.success(addedMsg)
        return true
      },

      removeScheme: (id: string) => {
        const { selectedSchemeIds } = get()
        set({
          selectedSchemeIds: selectedSchemeIds.filter((item) => item !== id),
        })
      },

      toggleScheme: (id: string) => {
        const { selectedSchemeIds, addScheme, removeScheme } = get()
        if (selectedSchemeIds.includes(id)) {
          removeScheme(id)
        } else {
          addScheme(id)
        }
      },

      clearAll: () => {
        set({ selectedSchemeIds: [] })
        const clearedMsg = i18next.t(
          "compare.clearedToast",
          "Comparison selection cleared."
        )
        toast.info(clearedMsg)
      },

      setSchemes: (ids: string[]) => {
        // Deduplicate and slice to max
        const uniqueIds = Array.from(new Set(ids)).slice(0, MAX_COMPARE_SCHEMES)
        set({ selectedSchemeIds: uniqueIds })
      },

      isComparing: (id: string) => {
        return get().selectedSchemeIds.includes(id)
      },

      setHighlightDifferences: (highlight: boolean) => {
        set({ highlightDifferences: highlight })
      },
    }),
    {
      name: "scheme-saathi-compare",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedSchemeIds: state.selectedSchemeIds,
        highlightDifferences: state.highlightDifferences,
      }),
    }
  )
)
