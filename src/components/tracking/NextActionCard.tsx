import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Compass,
  ArrowRight,
  FileCheck2,
  MapPin,
  Calculator,
  MessageSquare,
  ShieldAlert,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLocaleStore } from "@/stores/localeStore"
import {
  DEFAULT_MILESTONE_DEFINITIONS,
  type ApplicationJourney,
} from "@/types/application"

interface NextActionCardProps {
  journey: ApplicationJourney
}

export function NextActionCard({ journey }: NextActionCardProps) {
  const { t } = useTranslation()
  const { lang } = useLocaleStore()

  const currentDef =
    DEFAULT_MILESTONE_DEFINITIONS.find((d) => d.key === journey.currentStage) ??
    DEFAULT_MILESTONE_DEFINITIONS[0]

  const isAllComplete = journey.stages.every((s) => s.completed)

  function getActionLink() {
    switch (journey.currentStage) {
      case "scheme_identified":
        return {
          to: `/schemes/${journey.schemeId}`,
          label: t("track.actions.viewSchemeDetails"),
          icon: <Compass className="size-4" />,
        }
      case "eligibility_checked":
        return {
          to: "/find-schemes",
          label: t("track.actions.recheckEligibility"),
          icon: <CheckCircle2 className="size-4" />,
        }
      case "docs_prepared":
        return {
          to: "/documents",
          label: t("track.actions.openDocChecklist"),
          icon: <FileCheck2 className="size-4" />,
        }
      case "partner_selected":
        return {
          to: "/partners",
          label: t("track.actions.findPartnerBranches"),
          icon: <MapPin className="size-4" />,
        }
      case "form_filled":
        return {
          to: "/planner",
          label: t("track.actions.openProjectPlanner"),
          icon: <Calculator className="size-4" />,
        }
      case "submitted":
      case "under_review":
      case "sanction_decision":
      default:
        return {
          to: "/assistant",
          label: t("track.actions.askSaathiAi"),
          icon: <MessageSquare className="size-4" />,
        }
    }
  }

  const actionLink = getActionLink()

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/[0.04] via-background to-secondary/30 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Compass className="size-5" />
            </span>
            <div>
              <CardTitle className="font-display text-base sm:text-lg">
                {isAllComplete
                  ? t("track.allStagesCompletedTitle")
                  : t("track.nextActionTitle")}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {isAllComplete
                  ? t("track.allStagesCompletedSubtitle")
                  : t("track.nextActionSubtitle", {
                      stage: currentDef.shortTitle[lang] || currentDef.shortTitle.en,
                    })}
              </p>
            </div>
          </div>
          {!isAllComplete && (
            <Badge variant="outline" className="border-primary/40 text-primary font-medium text-xs">
              <CalendarCheck className="size-3 mr-1" />
              {t("track.stagePrefix", { number: currentDef.order })}:{" "}
              {currentDef.shortTitle[lang] || currentDef.shortTitle.en}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {isAllComplete ? (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-950 dark:text-emerald-200 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t("track.congratulationsTitle")}</span>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
              {t("track.congratulationsBody", {
                scheme: journey.schemeName[lang] || journey.schemeName.en,
                partner: journey.partnerName,
              })}
            </p>
          </div>
        ) : (
          <div className="rounded-lg bg-background/80 border border-border p-3.5 sm:p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground leading-snug">
              {currentDef.actionPrompt[lang] || currentDef.actionPrompt.en}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {currentDef.actionDetails[lang] || currentDef.actionDetails.en}
            </p>

            {/* Quick Action Navigation CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <Button asChild size="sm" className="h-8 text-xs font-semibold gap-1.5">
                <Link to={actionLink.to}>
                  {actionLink.icon}
                  {actionLink.label}
                  <ArrowRight className="size-3" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="sm" className="h-8 text-xs font-medium gap-1.5">
                <Link to="/assistant">
                  <MessageSquare className="size-3.5 text-primary" />
                  {t("track.askAdvisorBtn")}
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Mandatory Statutory Self-Tracking Disclaimer Box */}
        <div className="rounded-md bg-muted/60 border border-border/70 p-2.5 sm:p-3 flex items-start gap-2.5 text-muted-foreground text-xs leading-relaxed">
          <ShieldAlert className="size-4 text-primary shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-foreground block mb-0.5">
              {t("track.statutoryDisclaimerHeading")}:
            </strong>
            <p>{t("track.statutoryDisclaimer")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
