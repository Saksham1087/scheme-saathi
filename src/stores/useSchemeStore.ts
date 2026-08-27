import { create } from "zustand"
import type { Scheme, SchemeSortOption, EducationStatus } from "@/types"
import { fetchSchemes } from "@/services/schemeService"

export interface SchemeState {
  schemes: Scheme[]
  loading: boolean
  error: string | null
  searchQuery: string
  selectedCategories: string[]
  selectedState: string | null
  maxIncome: number | null
  amountRange: [number, number]
  selectedPurposes: string[]
  selectedEducation: EducationStatus | "all" | null
  sortBy: SchemeSortOption

  // Actions
  loadSchemes: () => Promise<void>
  setSearchQuery: (query: string) => void
  setSelectedCategories: (categories: string[]) => void
  toggleCategory: (category: string) => void
  setSelectedState: (state: string | null) => void
  setMaxIncome: (income: number | null) => void
  setAmountRange: (range: [number, number]) => void
  setSelectedPurposes: (purposes: string[]) => void
  togglePurpose: (purpose: string) => void
  setSelectedEducation: (education: EducationStatus | "all" | null) => void
  setSortBy: (sort: SchemeSortOption) => void
  resetFilters: () => void
  removeFilter: (
    key: "search" | "category" | "state" | "income" | "amount" | "purpose" | "education",
    value?: string,
  ) => void
  getActiveFilterCount: () => number
}

export const DEFAULT_AMOUNT_RANGE: [number, number] = [0, 5000000]

export const useSchemeStore = create<SchemeState>((set, get) => ({
  schemes: [],
  loading: false,
  error: null,
  searchQuery: "",
  selectedCategories: [],
  selectedState: null,
  maxIncome: null,
  amountRange: DEFAULT_AMOUNT_RANGE,
  selectedPurposes: [],
  selectedEducation: "all",
  sortBy: "name_asc",

  loadSchemes: async () => {
    // Avoid re-fetching if already loaded unless empty
    if (get().schemes.length > 0) return
    set({ loading: true, error: null })
    try {
      const schemes = await fetchSchemes()
      set({ schemes, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load schemes",
        loading: false,
      })
    }
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setSelectedCategories: (selectedCategories) => set({ selectedCategories }),

  toggleCategory: (category) => {
    const current = get().selectedCategories
    const exists = current.includes(category)
    set({
      selectedCategories: exists
        ? current.filter((c) => c !== category)
        : [...current, category],
    })
  },

  setSelectedState: (selectedState) => set({ selectedState }),

  setMaxIncome: (maxIncome) => set({ maxIncome }),

  setAmountRange: (amountRange) => set({ amountRange }),

  setSelectedPurposes: (selectedPurposes) => set({ selectedPurposes }),

  togglePurpose: (purpose) => {
    const current = get().selectedPurposes
    const exists = current.includes(purpose)
    set({
      selectedPurposes: exists
        ? current.filter((p) => p !== purpose)
        : [...current, purpose],
    })
  },

  setSelectedEducation: (selectedEducation) => set({ selectedEducation }),

  setSortBy: (sortBy) => set({ sortBy }),

  resetFilters: () =>
    set({
      searchQuery: "",
      selectedCategories: [],
      selectedState: null,
      maxIncome: null,
      amountRange: DEFAULT_AMOUNT_RANGE,
      selectedPurposes: [],
      selectedEducation: "all",
      sortBy: "name_asc",
    }),

  removeFilter: (key, value) => {
    switch (key) {
      case "search":
        set({ searchQuery: "" })
        break
      case "category":
        if (value) {
          set({
            selectedCategories: get().selectedCategories.filter((c) => c !== value),
          })
        } else {
          set({ selectedCategories: [] })
        }
        break
      case "state":
        set({ selectedState: null })
        break
      case "income":
        set({ maxIncome: null })
        break
      case "amount":
        set({ amountRange: DEFAULT_AMOUNT_RANGE })
        break
      case "purpose":
        if (value) {
          set({
            selectedPurposes: get().selectedPurposes.filter((p) => p !== value),
          })
        } else {
          set({ selectedPurposes: [] })
        }
        break
      case "education":
        set({ selectedEducation: "all" })
        break
    }
  },

  getActiveFilterCount: () => {
    const s = get()
    let count = 0
    if (s.searchQuery.trim()) count++
    if (s.selectedCategories.length > 0) count += s.selectedCategories.length
    if (s.selectedState && s.selectedState !== "all") count++
    if (s.maxIncome !== null && s.maxIncome > 0) count++
    if (
      s.amountRange[0] > 0 ||
      s.amountRange[1] < DEFAULT_AMOUNT_RANGE[1]
    ) {
      count++
    }
    if (s.selectedPurposes.length > 0) count += s.selectedPurposes.length
    if (s.selectedEducation && s.selectedEducation !== "all") count++
    return count
  },
}))

/**
 * Pure selector helper to filter and sort schemes in < 100ms.
 */
export function filterAndSortSchemes(
  schemes: Scheme[],
  filters: {
    searchQuery: string
    selectedCategories: string[]
    selectedState: string | null
    maxIncome: number | null
    amountRange: [number, number]
    selectedPurposes: string[]
    selectedEducation: EducationStatus | "all" | null
    sortBy: SchemeSortOption
  },
  lang: "en" | "hi" = "en",
): Scheme[] {
  const queryTokens = filters.searchQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  const hasCategories = filters.selectedCategories.length > 0
  const hasState =
    Boolean(filters.selectedState) && filters.selectedState !== "all"
  const hasIncome = filters.maxIncome !== null && filters.maxIncome > 0
  const [minAmount, maxAmount] = filters.amountRange
  const hasAmountFilter =
    minAmount > 0 || maxAmount < DEFAULT_AMOUNT_RANGE[1]
  const hasPurposes = filters.selectedPurposes.length > 0

  const filtered = schemes.filter((scheme) => {
    // 1. Live Keyword Search (Multi-token match)
    if (queryTokens.length > 0) {
      const nameEn = scheme.name?.en?.toLowerCase() || ""
      const nameHi = scheme.name?.hi?.toLowerCase() || ""
      const descEn = scheme.description?.en?.toLowerCase() || ""
      const descHi = scheme.description?.hi?.toLowerCase() || ""
      const ministryEn = scheme.ministry?.en?.toLowerCase() || ""
      const ministryHi = scheme.ministry?.hi?.toLowerCase() || ""
      const deptEn = scheme.department?.en?.toLowerCase() || ""
      const deptHi = scheme.department?.hi?.toLowerCase() || ""
      const tags = scheme.purposeTags?.map((t) => t.toLowerCase()).join(" ") || ""
      const purposeEn = scheme.purpose?.en?.toLowerCase() || ""
      const purposeHi = scheme.purpose?.hi?.toLowerCase() || ""

      const searchableText = `${nameEn} ${nameHi} ${descEn} ${descHi} ${ministryEn} ${ministryHi} ${deptEn} ${deptHi} ${tags} ${purposeEn} ${purposeHi}`

      const matchesAllTokens = queryTokens.every((token) =>
        searchableText.includes(token),
      )
      if (!matchesAllTokens) return false
    }

    // 2. Category Dimension
    if (hasCategories) {
      const schemeCat = scheme.category?.toLowerCase() || ""
      const schemeType = scheme.type?.toLowerCase() || ""
      const matchesCat = filters.selectedCategories.some((cat) => {
        const c = cat.toLowerCase()
        return schemeCat === c || schemeType === c
      })
      if (!matchesCat) return false
    }

    // 3. State Dimension
    if (hasState) {
      const states = scheme.applicableStates || ["All India"]
      const isAllIndia = states.some(
        (s) => s.toLowerCase() === "all india" || s.toLowerCase() === "national",
      )
      const matchesState =
        isAllIndia ||
        states.some((s) => s.toLowerCase() === filters.selectedState?.toLowerCase())
      if (!matchesState) return false
    }

    // 4. Annual Family Income Dimension (Scheme eligibility: ceiling >= citizen income)
    if (hasIncome && filters.maxIncome) {
      if ((scheme.incomeCeiling ?? 500000) < filters.maxIncome) {
        return false
      }
    }

    // 5. Loan / Assistance Amount Range Dimension
    if (hasAmountFilter) {
      const cost = scheme.maxProjectCost ?? 0
      if (cost < minAmount) {
        return false
      }
      if (maxAmount < DEFAULT_AMOUNT_RANGE[1] && cost < maxAmount && cost < minAmount) {
        return false
      }
    }

    // 6. Purpose Dimension
    if (hasPurposes) {
      const schemeTags = scheme.purposeTags?.map((t) => t.toLowerCase()) || []
      const purposeEn = scheme.purpose?.en?.toLowerCase() || ""
      const descEn = scheme.description?.en?.toLowerCase() || ""

      const matchesPurpose = filters.selectedPurposes.some((p) => {
        const target = p.toLowerCase()
        return (
          schemeTags.some((tag) => tag.includes(target) || target.includes(tag)) ||
          purposeEn.includes(target) ||
          descEn.includes(target)
        )
      })
      if (!matchesPurpose) return false
    }

    // 7. Education Dimension
    if (filters.selectedEducation && filters.selectedEducation !== "all") {
      const eligible = scheme.eligibleEducation
      if (eligible && eligible.length > 0) {
        const matchesEdu = eligible.includes(filters.selectedEducation)
        if (!matchesEdu) return false
      }
    }

    return true
  })

  // 8. Sorting
  return [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case "name_asc": {
        const nameA = a.name?.[lang] || a.name?.en || ""
        const nameB = b.name?.[lang] || b.name?.en || ""
        return nameA.localeCompare(nameB, lang === "hi" ? "hi" : "en")
      }
      case "max_amount_desc":
        return (b.maxProjectCost ?? 0) - (a.maxProjectCost ?? 0)
      case "max_amount_asc":
        return (a.maxProjectCost ?? 0) - (b.maxProjectCost ?? 0)
      case "rate_asc":
        return (a.rateRange?.min ?? 0) - (b.rateRange?.min ?? 0)
      case "income_ceiling_asc":
        return (a.incomeCeiling ?? 0) - (b.incomeCeiling ?? 0)
      default:
        return 0
    }
  })
}
