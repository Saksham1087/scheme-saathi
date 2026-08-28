import { create } from "zustand"
import type {
  BusinessPresetTemplate,
  FinancingBreakdown,
  ProjectBudgetItem,
} from "@/types/planner"
import {
  BUSINESS_PRESETS,
  calculateFinancingBreakdown,
} from "@/lib/plannerPresets"

export interface PlannerState {
  items: ProjectBudgetItem[]
  activePresetId: string | null
  projectTitle: string
  projectType: string
  loanSharePct: number
  promoterMarginPct: number
  subsidyPct: number

  // Actions
  addItem: (item: Omit<ProjectBudgetItem, "id">) => void
  updateItem: (id: string, patch: Partial<Omit<ProjectBudgetItem, "id">>) => void
  removeItem: (id: string) => void
  loadPreset: (template: BusinessPresetTemplate, lang?: string) => void
  setFinancingRatios: (
    loanSharePct: number,
    promoterMarginPct: number,
    subsidyPct?: number,
  ) => void
  setProjectTitle: (title: string) => void
  setProjectType: (projectType: string) => void
  resetToDefault: () => void
  clearAll: () => void

  // Selectors
  getFinancingBreakdown: () => FinancingBreakdown
}

function buildDefaultItems(): ProjectBudgetItem[] {
  const defaultPreset = BUSINESS_PRESETS[0]
  return defaultPreset.items.map((item, index) => ({
    id: `item-${defaultPreset.id}-${index + 1}`,
    category: item.category,
    name: item.defaultName.en,
    amount: item.amount,
    notes: item.notes,
  }))
}

export const defaultPlannerState = {
  items: buildDefaultItems(),
  activePresetId: "kirana_retail",
  projectTitle: "Small Retail Kirana Shop",
  projectType: "shop",
  loanSharePct: 90,
  promoterMarginPct: 10,
  subsidyPct: 0,
}

export const usePlannerStore = create<PlannerState>()((set, get) => ({
  ...defaultPlannerState,

  addItem: (item) => {
    const newItem: ProjectBudgetItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      amount: Math.max(0, Number(item.amount) || 0),
    }
    set((state) => ({
      items: [...state.items, newItem],
    }))
  },

  updateItem: (id, patch) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== id) return item
        const updatedAmount =
          patch.amount !== undefined ? Math.max(0, Number(patch.amount) || 0) : item.amount
        return {
          ...item,
          ...patch,
          amount: updatedAmount,
        }
      }),
    }))
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
  },

  loadPreset: (template, lang = "en") => {
    const isHindi = lang.startsWith("hi")
    const newItems: ProjectBudgetItem[] = template.items.map((item, idx) => ({
      id: `item-${template.id}-${idx + 1}-${Date.now()}`,
      category: item.category,
      name: isHindi ? item.defaultName.hi : item.defaultName.en,
      amount: item.amount,
      notes: item.notes,
    }))

    set({
      items: newItems,
      activePresetId: template.id,
      projectTitle: isHindi ? template.defaultName.hi : template.defaultName.en,
      projectType: template.projectTypeKey,
      loanSharePct: template.defaultLoanSharePct,
      promoterMarginPct: template.defaultPromoterMarginPct,
      subsidyPct: template.defaultSubsidyPct || 0,
    })
  },

  setFinancingRatios: (loanSharePct, promoterMarginPct, subsidyPct = 0) => {
    set({
      loanSharePct: Math.max(0, Math.min(100, loanSharePct)),
      promoterMarginPct: Math.max(0, Math.min(100, promoterMarginPct)),
      subsidyPct: Math.max(0, Math.min(100, subsidyPct)),
    })
  },

  setProjectTitle: (projectTitle) => set({ projectTitle }),
  setProjectType: (projectType) => set({ projectType }),

  resetToDefault: () => {
    set({
      ...defaultPlannerState,
      items: buildDefaultItems(),
    })
  },

  clearAll: () => {
    set({
      items: [],
      activePresetId: null,
      projectTitle: "Custom Project Plan",
    })
  },

  getFinancingBreakdown: () => {
    const { items, loanSharePct, promoterMarginPct, subsidyPct } = get()
    return calculateFinancingBreakdown(items, loanSharePct, promoterMarginPct, subsidyPct)
  },
}))
