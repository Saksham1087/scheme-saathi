import { useTranslation } from "react-i18next"
import { TrendingUp, Users, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getAllSchemes } from "@/data"

export default function AdminAnalytics() {
  const { t } = useTranslation()
  const schemes = getAllSchemes()

  const stats = [
    { key: "totalSchemes", value: schemes.length, icon: FileText, color: "text-blue-500" },
    { key: "totalUsers", value: "—", icon: Users, color: "text-green-500" },
    { key: "totalApplications", value: "—", icon: TrendingUp, color: "text-purple-500" },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="font-display font-bold text-2xl">{t("admin.analytics.title")}</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.key}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t(`admin.analytics.${stat.key}`)}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`size-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
