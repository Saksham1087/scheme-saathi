import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllSchemes } from "@/data"

export default function AdminSchemes() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as "en" | "hi" | "mr"
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const schemes = getAllSchemes()
  const categories = [...new Set(schemes.flatMap((s) => s.category))]

  const filtered = schemes.filter((s) => {
    const name = (s.name as Record<string, string>)[lang] || s.name.en
    if (search && !name.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter !== "all" && !s.category.includes(categoryFilter as any)) return false
    return true
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl">{t("admin.schemes.title")}</h1>
        <Button size="sm">
          <Plus className="mr-1.5 size-4" />
          {t("admin.schemes.addScheme")}
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.schemes.search")}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
        >
          <option value="all">{t("admin.schemes.allCategories")}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">{t("admin.schemes.name")}</th>
                <th className="text-left py-3 px-4 font-medium">{t("admin.schemes.category")}</th>
                <th className="text-left py-3 px-4 font-medium">{t("admin.schemes.status")}</th>
                <th className="text-left py-3 px-4 font-medium">{t("admin.schemes.source")}</th>
                <th className="text-right py-3 px-4 font-medium">{t("admin.schemes.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((scheme) => {
                const name = (scheme.name as Record<string, string>)[lang] || scheme.name.en
                return (
                  <tr key={scheme.slug} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <Link to={`/schemes/${scheme.slug}`} className="font-medium hover:text-primary">
                        {name}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {scheme.category.map((c) => (
                          <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={scheme.isActive ? "default" : "destructive"}>
                        {scheme.isActive ? t("admin.status.active") : t("admin.status.inactive")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{scheme.source}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="default" className="size-8 p-0">
                          <Eye className="size-4" />
                        </Button>
                        <Button size="sm" variant="default" className="size-8 p-0">
                          <Pencil className="size-4" />
                        </Button>
                        <Button size="sm" variant="default" className="size-8 p-0 text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
