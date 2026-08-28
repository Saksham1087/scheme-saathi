import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Compass,
  Calculator,
  FileSpreadsheet,
  FileCheck2,
  Landmark,
  Bot,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function QuickLaunchpad() {
  const { t } = useTranslation()

  const launchActions = [
    {
      to: "/find-schemes",
      icon: Compass,
      color: "text-primary bg-primary/10 border-primary/20",
      titleKey: "dashboard.launchpad.findSchemesTitle",
      titleDefault: "Smart Scheme Discovery",
      descKey: "dashboard.launchpad.findSchemesDesc",
      descDefault: "7-step intake to discover matched concessional loan schemes.",
    },
    {
      to: "/calculator",
      icon: Calculator,
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
      titleKey: "dashboard.launchpad.calculatorTitle",
      titleDefault: "EMI & Moratorium Tool",
      descKey: "dashboard.launchpad.calculatorDesc",
      descDefault: "Simulate monthly repayments and concessional interest subsidies.",
    },
    {
      to: "/planner",
      icon: FileSpreadsheet,
      color: "text-accent bg-accent/10 border-accent/20",
      titleKey: "dashboard.launchpad.plannerTitle",
      titleDefault: "Project Cost Planner",
      descKey: "dashboard.launchpad.plannerDesc",
      descDefault: "Itemize startup machinery, inventory, and margin money requirements.",
    },
    {
      to: "/documents",
      icon: FileCheck2,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      titleKey: "dashboard.launchpad.documentsTitle",
      titleDefault: "Document Checklist",
      descKey: "dashboard.launchpad.documentsDesc",
      descDefault: "Verify KYC, caste, and income certificates via DigiLocker.",
    },
    {
      to: "/partners",
      icon: Landmark,
      color: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
      titleKey: "dashboard.launchpad.partnersTitle",
      titleDefault: "Channel Partner Locator",
      descKey: "dashboard.launchpad.partnersDesc",
      descDefault: "Locate authorized SCAs, regional bank branches, and nodal desks.",
    },
    {
      to: "/assistant",
      icon: Bot,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
      titleKey: "dashboard.launchpad.assistantTitle",
      titleDefault: "Saathi AI Assistant",
      descKey: "dashboard.launchpad.assistantDesc",
      descDefault: "Ask questions on official scheme guidelines and eligibility criteria.",
    },
  ]

  return (
    <Card className="border border-border/80 shadow-xs">
      <CardHeader className="pb-3 space-y-1">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {t("dashboard.launchpadBadge", "Discovery Shortcuts")}
          </span>
        </div>
        <CardTitle className="font-display text-lg font-bold text-foreground">
          {t("dashboard.launchpadTitle", "Quick Portal Launchpad")}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t(
            "dashboard.launchpadDesc",
            "Jump directly into key citizen self-service tools and discovery workflows."
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {launchActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.to}
                to={action.to}
                className="group rounded-xl border border-border/70 bg-card p-3.5 flex flex-col justify-between space-y-2 transition-all hover:border-primary/50 hover:bg-primary/[0.02] hover:shadow-xs focus-visible:outline-ring"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`size-9 rounded-lg border flex items-center justify-center ${action.color}`}>
                    <Icon className="size-4.5" />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary mt-1" />
                </div>

                <div>
                  <h4 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {t(action.titleKey, action.titleDefault)}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                    {t(action.descKey, action.descDefault)}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
