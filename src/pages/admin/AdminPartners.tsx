import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Search, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import partnersSeed from "@seed/partners.seed.json"
import type { ChannelPartner } from "@/types"

export default function AdminPartners() {
  const { t } = useTranslation()
  const [search, setSearch] = useState("")

  const partners = partnersSeed as unknown as ChannelPartner[]
  const filtered = partners.filter((p) =>
    search && !p.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl">{t("admin.partners.title")}</h1>
        <Button size="sm">
          <Plus className="mr-1.5 size-4" />
          {t("admin.partners.addPartner")}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("admin.partners.search")}
          className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">{t("admin.partners.name")}</th>
                <th className="text-left py-3 px-4 font-medium">{t("admin.partners.type")}</th>
                <th className="text-left py-3 px-4 font-medium">{t("admin.partners.city")}</th>
                <th className="text-left py-3 px-4 font-medium">{t("admin.partners.status")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((partner) => (
                <tr key={partner.id} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{partner.name}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{t(`partners.typeNames.${partner.type}`)}</Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{partner.city}</td>
                  <td className="py-3 px-4">
                    <Badge variant={partner.npaFlag === "high" ? "destructive" : "default"}>
                      {partner.npaFlag === "high" ? t("admin.status.flagged") : t("admin.status.active")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
