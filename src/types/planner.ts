export type BudgetCategoryKey =
  | "equipment"
  | "rawMaterials"
  | "rent"
  | "workingCapital"
  | "licenses"
  | "contingency"

export interface ProjectBudgetItem {
  id: string
  category: BudgetCategoryKey
  name: string
  amount: number
  notes?: string
}

export interface ProjectBudgetCategory {
  key: BudgetCategoryKey
  nameKey: string
  defaultName: {
    en: string
    hi: string
  }
  descriptionKey: string
  defaultDescription: {
    en: string
    hi: string
  }
  iconName: string
  color: string
}

export interface FinancingBreakdown {
  totalProjectCost: number
  loanSharePct: number
  promoterMarginPct: number
  subsidyPct: number
  loanAmount: number
  promoterMarginAmount: number
  subsidyAmount: number
  categoryBreakdown: Record<BudgetCategoryKey, number>
}

export interface BusinessPresetItem {
  category: BudgetCategoryKey
  nameKey: string
  defaultName: {
    en: string
    hi: string
  }
  amount: number
  notes?: string
}

export interface BusinessPresetTemplate {
  id: string
  nameKey: string
  defaultName: {
    en: string
    hi: string
  }
  descriptionKey: string
  defaultDescription: {
    en: string
    hi: string
  }
  categoryTag: string
  projectTypeKey: string
  defaultLoanSharePct: number
  defaultPromoterMarginPct: number
  defaultSubsidyPct?: number
  items: BusinessPresetItem[]
}
