import business from "./schemes/business.json"
import education from "./schemes/education.json"
import agriculture from "./schemes/agriculture.json"
import transport from "./schemes/transport.json"
import housing from "./schemes/housing.json"
import health from "./schemes/health.json"
import socialWelfare from "./schemes/social-welfare.json"
import employment from "./schemes/employment.json"
import categories from "./schemes/categories.json"
import type { SchemeDocument } from "@/types/scheme"

export type LocalScheme = Omit<SchemeDocument, "id" | "createdAt" | "updatedAt"> & {
  id: string
}

const allSchemes: LocalScheme[] = [
  ...business,
  ...education,
  ...agriculture,
  ...transport,
  ...housing,
  ...health,
  ...socialWelfare,
  ...employment,
] as unknown as LocalScheme[]

export { categories }

export function getAllSchemes(): LocalScheme[] {
  return allSchemes.filter((s) => s.isActive)
}

export function getSchemeBySlug(slug: string): LocalScheme | undefined {
  return allSchemes.find((s) => s.slug === slug && s.isActive)
}

export function searchSchemes(query: string, lang: string = "en"): LocalScheme[] {
  const q = query.toLowerCase()
  return getAllSchemes().filter((s) => {
    const name = (s.name as Record<string, string>)[lang] || s.name.en
    const desc = (s.description as Record<string, string>)[lang] || s.description.en
    const ministry = s.ministry.toLowerCase()
    const purpose = s.purpose?.toLowerCase() || ""
    return (
      name.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q) ||
      ministry.includes(q) ||
      purpose.includes(q)
    )
  })
}

export interface SchemeFilters {
  query?: string
  category?: string
  minAmount?: number
  maxAmount?: number
}

export function filterSchemes(filters: SchemeFilters, lang: string = "en"): LocalScheme[] {
  let results = getAllSchemes()

  if (filters.query) {
    const q = filters.query.toLowerCase()
    results = results.filter((s) => {
      const name = (s.name as Record<string, string>)[lang] || s.name.en
      const desc = (s.description as Record<string, string>)[lang] || s.description.en
      return (
        name.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        s.ministry.toLowerCase().includes(q) ||
        (s.purpose?.toLowerCase().includes(q) ?? false)
      )
    })
  }

  if (filters.category && filters.category !== "all") {
    results = results.filter((s) => s.category.includes(filters.category as never))
  }

  if (filters.minAmount !== undefined) {
    results = results.filter(
      (s) => s.financialAssistance.maxAmount >= filters.minAmount!,
    )
  }

  if (filters.maxAmount !== undefined) {
    results = results.filter(
      (s) => s.financialAssistance.minAmount <= filters.maxAmount!,
    )
  }

  return results
}

export type { LocalScheme as SchemeData }
