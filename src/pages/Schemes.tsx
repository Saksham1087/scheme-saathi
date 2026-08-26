import { useState, useMemo, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { SchemeCard } from "@/components/SchemeCard"
import { SchemeSearch } from "@/components/SchemeSearch"
import { SchemeFilter, type FilterState } from "@/components/SchemeFilter"
import { filterSchemes } from "@/data"

const PAGE_SIZE = 12

function readFilters(params: URLSearchParams): {
  query: string
  filters: FilterState
} {
  return {
    query: params.get("q") || "",
    filters: {
      category: params.get("category") || "all",
      minAmount: params.get("minAmount") || "",
      maxAmount: params.get("maxAmount") || "",
    },
  }
}

export default function Schemes() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as "en" | "hi" | "mr"
  const [searchParams, setSearchParams] = useSearchParams()
  const { query: initialQuery, filters: initialFilters } = readFilters(searchParams)

  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const updateParams = useCallback(
    (q: string, f: FilterState) => {
      const params = new URLSearchParams()
      if (q) params.set("q", q)
      if (f.category !== "all") params.set("category", f.category)
      if (f.minAmount) params.set("minAmount", f.minAmount)
      if (f.maxAmount) params.set("maxAmount", f.maxAmount)
      setSearchParams(params, { replace: true })
    },
    [setSearchParams],
  )

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value)
      setVisibleCount(PAGE_SIZE)
      updateParams(value, filters)
    },
    [filters, updateParams],
  )

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters)
      setVisibleCount(PAGE_SIZE)
      updateParams(query, newFilters)
    },
    [query, updateParams],
  )

  const filtered = useMemo(
    () =>
      filterSchemes(
        {
          query,
          category: filters.category,
          minAmount: filters.minAmount ? Number(filters.minAmount) : undefined,
          maxAmount: filters.maxAmount ? Number(filters.maxAmount) : undefined,
        },
        lang,
      ),
    [query, filters, lang],
  )

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
        {t("schemes.title")}
      </h1>
      <p className="mt-2 text-base text-muted-foreground max-w-2xl">
        {t("schemes.subtitle")}
      </p>

      <div className="mt-6 space-y-4">
        <SchemeSearch value={query} onChange={handleQueryChange} />
        <SchemeFilter
          filters={filters}
          onChange={handleFilterChange}
          resultCount={filtered.length}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            {t("schemes.empty.title")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("schemes.empty.description")}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((scheme) => (
              <SchemeCard key={scheme.slug} scheme={scheme} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-6 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors"
              >
                {t("schemes.loadMore")}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
