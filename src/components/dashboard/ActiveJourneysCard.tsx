import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Compass,
  ArrowRight,
  PlusCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { NewJourneyModal } from "@/components/tracking/NewJourneyModal"
import { useApplicationStore } from "@/stores/useApplicationStore"
import { useLocaleStore } from "@/stores/localeStore"
import { fmtINR } from "@/lib/format"

export function ActiveJourneysCard() {
  const { t } = useTranslation()
  const { lang } = useLocaleStore()
  const { applications } = useApplicationStore()

  return (
    <Card className="border border-border/80 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {t("dashboard.activeJourneysBadge", "Application Milestones")}
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              {applications.length}
            </Badge>
          </div>
          <CardTitle className="font-display text-lg font-bold text-foreground mt-1">
            {t("dashboard.activeJourneysTitle", "Active Application Journeys")}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {t(
              "dashboard.activeJourneysDesc",
              "Track your 8-stage physical & digital progress from pre-screening to loan disbursal."
            )}
          </CardDescription>
        </div>

        <div className="shrink-0">
          <NewJourneyModal
            triggerButton={
              <Button size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1.5 cursor-pointer">
                <PlusCircle className="size-3.5 text-primary" />
                <span>{t("dashboard.newJourneyBtn", "New Journey")}</span>
              </Button>
            }
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 p-6 text-center space-y-3 bg-muted/20">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Compass className="size-6" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm text-foreground">
                {t("dashboard.noJourneysTitle", "No active application journeys")}
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                {t(
                  "dashboard.noJourneysDesc",
                  "Start tracking an application journey to manage document submissions, nodal officer visits, and sanction status."
                )}
              </p>
            </div>
            <NewJourneyModal
              triggerButton={
                <Button size="sm" className="text-xs font-semibold gap-1.5 cursor-pointer">
                  <PlusCircle className="size-3.5" />
                  {t("dashboard.startFirstJourneyBtn", "Start Tracking a Scheme")}
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {applications.map((journey) => {
              const schemeName =
                typeof journey.schemeName === "object"
                  ? journey.schemeName[lang] || journey.schemeName.en
                  : journey.schemeName
              const completedStages = journey.stages.filter((s) => s.completed).length
              const totalStages = journey.stages.length || 8
              const progressPct = Math.round((completedStages / totalStages) * 100)

              return (
                <div
                  key={journey.id}
                  className="rounded-xl border border-border/70 bg-card p-4 space-y-3.5 transition-all hover:border-border hover:shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="secondary" className="text-[11px] font-medium uppercase">
                          {t(`schemeTypes.${journey.schemeType}`, journey.schemeType)}
                        </Badge>
                        {journey.acknowledgmentNumber ? (
                          <Badge
                            variant="outline"
                            className="text-[11px] font-mono border-primary/40 bg-primary/5 text-primary"
                          >
                            <FileText className="size-3 mr-1" />
                            {journey.acknowledgmentNumber}
                          </Badge>
                        ) : null}
                      </div>

                      <h4 className="font-display font-bold text-base text-foreground leading-snug">
                        {schemeName}
                      </h4>

                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{journey.partnerName}</span>
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className="text-[11px] text-muted-foreground block font-medium">
                        {t("dashboard.requestedAmount", "Requested Assistance")}
                      </span>
                      <span className="font-display font-bold text-base text-foreground">
                        {fmtINR(journey.requestedAmount)}
                      </span>
                    </div>
                  </div>

                  {/* 8-Stage Progress Meter */}
                  <div className="space-y-1.5 rounded-lg bg-muted/40 p-3 border border-border/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        {progressPct === 100 ? (
                          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Clock className="size-3.5 text-primary" />
                        )}
                        {t("dashboard.stageProgress", "Stage {{current}} of {{total}}: {{stageName}}", {
                          current: journey.currentStageIndex + 1,
                          total: totalStages,
                          stageName: t(
                            `track.stages.${journey.currentStage}.title`,
                            journey.currentStage.replace(/_/g, " ")
                          ),
                        })}
                      </span>
                      <span className="font-mono font-bold text-primary tabular-nums">
                        {progressPct}%
                      </span>
                    </div>
                    <Progress value={progressPct} className="h-2" />
                  </div>

                  {/* Continue Journey CTA */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3" />
                      {t("dashboard.lastUpdated", "Updated:")}{" "}
                      {new Date(journey.updatedAt).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN")}
                    </span>

                    <Button asChild size="sm" className="h-8 text-xs font-semibold gap-1 min-h-[36px]">
                      <Link to={`/application/${journey.id}`}>
                        <span>{t("dashboard.continueJourneyBtn", "Continue Journey")}</span>
                        <ArrowRight className="size-3.5 ml-0.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
