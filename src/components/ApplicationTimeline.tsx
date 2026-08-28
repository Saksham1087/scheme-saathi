import { useTranslation } from "react-i18next"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import type { JourneyStep } from "@/types/journey"
import { MILESTONE_STEPS } from "@/types/journey"
import { Badge } from "@/components/ui/badge"

interface ApplicationTimelineProps {
  steps: JourneyStep[]
  currentStep: number
  onToggleStep: (stepIndex: number) => void
}

export function ApplicationTimeline({
  steps,
  currentStep,
  onToggleStep,
}: ApplicationTimelineProps) {
  const { t } = useTranslation()
  const completedCount = steps.filter((s) => s.status === "completed").length

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          {t("journey.progress", { current: completedCount, total: steps.length })}
        </span>
      </div>
      <ol className="relative">
        {steps.map((step, i) => {
          const isCompleted = step.status === "completed"
          const isCurrent = i === currentStep
          const isMilestone = (MILESTONE_STEPS as readonly string[]).includes(step.id)

          return (
            <li
              key={step.id}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {/* Vertical connector line */}
              {i < steps.length - 1 && (
                <div
                  className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${
                    isCompleted ? "bg-success" : "bg-border"
                  }`}
                />
              )}

              {/* Icon */}
              <button
                onClick={() => onToggleStep(i)}
                className="relative z-10 shrink-0"
                disabled={i > currentStep + 1}
              >
                {isCompleted ? (
                  <CheckCircle2 className="size-6 text-success" />
                ) : isCurrent ? (
                  <Clock className="size-6 text-primary animate-pulse" />
                ) : (
                  <Circle className="size-6 text-muted-foreground/40" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${
                      isCompleted
                        ? "text-success"
                        : isCurrent
                          ? "text-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {t(step.labelKey)}
                  </span>
                  {isMilestone && isCompleted && (
                    <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-success">
                      {t("journey.milestone")}
                    </Badge>
                  )}
                </div>
                {step.completedAt && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(step.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
