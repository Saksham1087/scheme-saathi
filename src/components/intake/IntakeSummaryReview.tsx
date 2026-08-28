import { useTranslation } from "react-i18next"
import { Pencil, MapPin, Users, User, GraduationCap, IndianRupee, Briefcase, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fmtINR } from "@/lib/format"
import type { IntakeState } from "@/stores/intakeStore"

interface IntakeSummaryReviewProps {
  data: Pick<
    IntakeState,
    | "state"
    | "category"
    | "age"
    | "gender"
    | "educationStatus"
    | "annualFamilyIncome"
    | "consentAt"
    | "projectType"
    | "projectDetails"
    | "estimatedCost"
  >
  onEditStep: (stepIndex: number) => void
}

export function IntakeSummaryReview({ data, onEditStep }: IntakeSummaryReviewProps) {
  const { t } = useTranslation()

  const summaryItems = [
    {
      stepIndex: 0,
      icon: MapPin,
      labelKey: "intake.reviewState",
      value: data.state || t("intake.notSelected"),
      badge: null,
    },
    {
      stepIndex: 1,
      icon: Users,
      labelKey: "intake.reviewCategory",
      value: data.category ? t(`categories.${data.category}`) : t("intake.notSelected"),
      badge: data.category === "sc" ? t("intake.nsfdcTarget") : null,
    },
    {
      stepIndex: 2,
      icon: User,
      labelKey: "intake.reviewDemographics",
      value: `${data.age} ${t("schemeDetails.yearsOld")}, ${data.gender ? t(`intake.gender.${data.gender}`) : ""}`,
      badge: null,
    },
    {
      stepIndex: 3,
      icon: GraduationCap,
      labelKey: "intake.reviewEducation",
      value: data.educationStatus ? t(`educationStatuses.${data.educationStatus}`) : t("intake.notSelected"),
      badge: null,
    },
    {
      stepIndex: 4,
      icon: IndianRupee,
      labelKey: "intake.reviewIncome",
      value: fmtINR(data.annualFamilyIncome),
      badge: data.consentAt ? t("intake.consentVerified") : null,
      subtext:
        data.annualFamilyIncome <= 500000
          ? t("intake.withinCeiling")
          : t("intake.aboveCeilingWarning"),
      isWarning: data.annualFamilyIncome > 500000,
    },
    {
      stepIndex: 5,
      icon: Briefcase,
      labelKey: "intake.reviewProjectType",
      value: data.projectType ? t(`projectTypes.${data.projectType}`) : t("intake.notSelected"),
      subtext: data.projectDetails ? `"${data.projectDetails}"` : undefined,
      badge: null,
    },
    {
      stepIndex: 6,
      icon: FileCheck,
      labelKey: "intake.reviewCost",
      value: fmtINR(data.estimatedCost),
      badge: null,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border shadow-sm">
        {summaryItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.labelKey}
              className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t(item.labelKey)}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {item.value}
                    </span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="text-[11px] font-medium py-0 px-1.5 h-5 bg-primary/10 text-primary border-transparent"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  {item.subtext && (
                    <p
                      className={`text-xs mt-1 truncate ${
                        item.isWarning ? "text-destructive font-medium" : "text-muted-foreground italic"
                      }`}
                    >
                      {item.subtext}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(item.stepIndex)}
                className="shrink-0 text-xs text-primary hover:text-primary hover:bg-primary/10 h-8 px-2.5"
                title={`${t("intake.edit")} ${t(item.labelKey)}`}
              >
                <Pencil className="mr-1 size-3" />
                <span>{t("intake.edit")}</span>
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
