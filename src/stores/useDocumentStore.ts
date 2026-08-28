import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type {
  DocumentCategory,
  DocumentVerificationStatus,
  VerificationMetadata,
  UploadedFileRecord,
} from "@/types"

export interface DocumentStoreState {
  selectedSchemeId: string
  activeCategory: DocumentCategory
  searchQuery: string
  checkedDocMap: Record<string, boolean>
  docNotesMap: Record<string, string>
  digiLockerVerifications: Record<string, VerificationMetadata>
  manualUploads: Record<string, UploadedFileRecord>

  // Actions
  setSelectedSchemeId: (schemeId: string) => void
  setActiveCategory: (category: DocumentCategory) => void
  setSearchQuery: (query: string) => void
  toggleDocCheck: (docId: string) => void
  setDocChecked: (docId: string, checked: boolean) => void
  setDocNote: (docId: string, note: string) => void
  syncDigiLockerDocument: (docId: string, metadata: VerificationMetadata) => void
  unlinkDigiLockerDocument: (docId: string) => void
  uploadManualDocument: (docId: string, fileRecord: UploadedFileRecord) => void
  removeManualDocument: (docId: string) => void
  resetChecklistForScheme: (docIds: string[]) => void
  markAllCheckedForScheme: (docIds: string[]) => void
  isDocChecked: (docId: string) => boolean
  getDocNote: (docId: string) => string
  getDocVerificationStatus: (docId: string) => DocumentVerificationStatus
  getDigiLockerMetadata: (docId: string) => VerificationMetadata | undefined
  getManualUpload: (docId: string) => UploadedFileRecord | undefined
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
      digiLockerVerifications: {},
      manualUploads: {},

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

      syncDigiLockerDocument: (docId: string, metadata: VerificationMetadata) => {
        const { checkedDocMap, digiLockerVerifications } = get()
        set({
          digiLockerVerifications: {
            ...digiLockerVerifications,
            [docId]: metadata,
          },
          checkedDocMap: {
            ...checkedDocMap,
            [docId]: true,
          },
        })
      },

      unlinkDigiLockerDocument: (docId: string) => {
        const { checkedDocMap, digiLockerVerifications, manualUploads } = get()
        const nextVerifications = { ...digiLockerVerifications }
        delete nextVerifications[docId]

        const hasManual = Boolean(manualUploads[docId])
        set({
          digiLockerVerifications: nextVerifications,
          checkedDocMap: {
            ...checkedDocMap,
            [docId]: hasManual,
          },
        })
      },

      uploadManualDocument: (docId: string, fileRecord: UploadedFileRecord) => {
        const { checkedDocMap, manualUploads } = get()
        set({
          manualUploads: {
            ...manualUploads,
            [docId]: fileRecord,
          },
          checkedDocMap: {
            ...checkedDocMap,
            [docId]: true,
          },
        })
      },

      removeManualDocument: (docId: string) => {
        const { checkedDocMap, digiLockerVerifications, manualUploads } = get()
        const nextUploads = { ...manualUploads }
        delete nextUploads[docId]

        const hasDigiLocker = Boolean(digiLockerVerifications[docId])
        set({
          manualUploads: nextUploads,
          checkedDocMap: {
            ...checkedDocMap,
            [docId]: hasDigiLocker,
          },
        })
      },

      resetChecklistForScheme: (docIds: string[]) => {
        const { checkedDocMap, digiLockerVerifications, manualUploads } = get()
        const nextChecked = { ...checkedDocMap }
        const nextVerifications = { ...digiLockerVerifications }
        const nextUploads = { ...manualUploads }

        for (const id of docIds) {
          nextChecked[id] = false
          delete nextVerifications[id]
          delete nextUploads[id]
        }

        set({
          checkedDocMap: nextChecked,
          digiLockerVerifications: nextVerifications,
          manualUploads: nextUploads,
        })
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

      getDocVerificationStatus: (docId: string): DocumentVerificationStatus => {
        const state = get()
        if (state.digiLockerVerifications[docId]) {
          return "verified_digilocker"
        }
        if (state.manualUploads[docId]) {
          return "uploaded_manual"
        }
        return "pending"
      },

      getDigiLockerMetadata: (docId: string) => {
        return get().digiLockerVerifications[docId]
      },

      getManualUpload: (docId: string) => {
        return get().manualUploads[docId]
      },

      clearAllChecklistData: () => {
        set({
          checkedDocMap: {},
          docNotesMap: {},
          digiLockerVerifications: {},
          manualUploads: {},
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
        digiLockerVerifications: state.digiLockerVerifications,
        manualUploads: state.manualUploads,
      }),
    }
  )
)

