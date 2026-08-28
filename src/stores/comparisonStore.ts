import { create } from "zustand"
import type { LocalScheme } from "@/data"

const MAX_COMPARE = 4

interface ComparisonState {
  selected: LocalScheme[]
  add: (scheme: LocalScheme) => void
  remove: (slug: string) => void
  clear: () => void
  isSelected: (slug: string) => boolean
}

export const useComparisonStore = create<ComparisonState>()((set, get) => ({
  selected: [],
  add: (scheme) => {
    const { selected } = get()
    if (selected.length >= MAX_COMPARE) return
    if (selected.some((s) => s.slug === scheme.slug)) return
    set({ selected: [...selected, scheme] })
  },
  remove: (slug) => {
    set({ selected: get().selected.filter((s) => s.slug !== slug) })
  },
  clear: () => set({ selected: [] }),
  isSelected: (slug) => get().selected.some((s) => s.slug === slug),
}))
