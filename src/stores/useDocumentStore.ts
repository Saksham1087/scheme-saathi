import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { DocumentCategory } from "@/types"

export interface DocumentStoreState {
  selectedSchemeId: string
  activeCategory: DocumentCategory
  searchQuery: string
  checkedDocMap: Record<string, boolean>
  docNotesMap: Record<string, string>

  // Actions
  setSelectedSchemeId: (schemeId: string) => void
  setActiveCategory: (category: DocumentCategory) => void
  setSearchQuery: (query: string) => void
  toggleDocCheck: (docId: string) => void
  setDocChecked: (docId: string, checked: boolean) => void
  setDocNote: (docId: string, note: string) => void
  resetChecklistForScheme: (docIds: string[]) => void
  markAllCheckedForScheme: (docIds: string[]) => void
  isDocChecked: (docId: string) => boolean
  getDocNote: (docId: string) => string
  clearAllChecklistData: () => void
}

export const useDocumentStore = create<DocumentStoreState>()(
  persist(
    (set, get) => ({
      selectedSchemeId: "micro-finance",
      activeCategory: "all",
      searchQuery: "",
      checkedDocMap: {},
      docNotesMap: {},

      setSelectedSchemeId: (selectedSchemeId: string) => {
        set({ selectedSchemeId })
      },

      setActiveCategory: (activeCategory: DocumentCategory) => {
        set({ activeCategory })
      },

      setSearchQuery: (searchQuery: string) => {
        set({ searchQuery })
      },

      toggleDocCheck: (docId: string) => {
        const { checkedDocMap } = get()
        const current = Boolean(checkedDocMap[docId])
        set({
          checkedDocMap: {
            ...checkedDocMap,
            [docId]: !current,
          },
        })
      },

      setDocChecked: (docId: string, checked: boolean) => {
        const { checkedDocMap } = get()
        set({
          checkedDocMap: {
            ...checkedDocMap,
            [docId]: checked,
          },
        })
      },

      setDocNote: (docId: string, note: string) => {
        const { docNotesMap } = get()
        set({
          docNotesMap: {
            ...docNotesMap,
            [docId]: note,
          },
        })
      },

      resetChecklistForScheme: (docIds: string[]) => {
        const { checkedDocMap } = get()
        const next = { ...checkedDocMap }
        for (const id of docIds) {
          next[id] = false
        }
        set({ checkedDocMap: next })
      },

      markAllCheckedForScheme: (docIds: string[]) => {
        const { checkedDocMap } = get()
        const next = { ...checkedDocMap }
        for (const id of docIds) {
          next[id] = true
        }
        set({ checkedDocMap: next })
      },

      isDocChecked: (docId: string) => {
        return Boolean(get().checkedDocMap[docId])
      },

      getDocNote: (docId: string) => {
        return get().docNotesMap[docId] || ""
      },

      clearAllChecklistData: () => {
        set({
          checkedDocMap: {},
          docNotesMap: {},
        })
      },
    }),
    {
      name: "scheme-saathi-document-checklist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedSchemeId: state.selectedSchemeId,
        activeCategory: state.activeCategory,
        checkedDocMap: state.checkedDocMap,
        docNotesMap: state.docNotesMap,
      }),
    }
  )
)
