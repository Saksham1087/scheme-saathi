import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ApplicationTimeline } from "@/components/ApplicationTimeline"
import { JOURNEY_STEPS, STEP_ACTIONS } from "@/types/journey"
import type { JourneyStep, JourneyStepStatus } from "@/types/journey"
import { getAllSchemes } from "@/data"

export default function Application() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const schemes = getAllSchemes()

  const scheme = schemes.find((s) => s.slug === id)

  const [steps, setSteps] = useState<JourneyStep[]>(
    JOURNEY_STEPS.map((s, i) => ({
      ...s,
      status: (i === 0 ? "completed" : "pending") as JourneyStepStatus,
    })),
  )

  const currentStep = steps.findIndex((s) => s.status !== "completed")
  const effectiveCurrent = currentStep === -1 ? steps.length - 1 : currentStep

  const handleToggleStep = (index: number) => {
    if (index > effectiveCurrent + 1) return

    setSteps((prev) =>
      prev.map((s, i) => {
        if (i < index) return { ...s, status: "completed" as const, completedAt: new Date().toISOString() }
        if (i === index) {
          const newStatus = s.status === "completed" ? "pending" : "completed"
          return {
            ...s,
            status: newStatus as JourneyStepStatus,
            completedAt: newStatus === "completed" ? new Date().toISOString() : undefined,
          }
        }
        return { ...s, status: "pending" as const, completedAt: undefined }
      }),
    )
  }

  if (!scheme) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display font-bold text-3xl">{t("journey.notFound")}</h1>
        <Button asChild className="mt-6">
          <Link to="/schemes">
            <ArrowLeft className="mr-2 size-4" />
            {t("journey.backToSchemes")}
          </Link>
        </Button>
      </main>
    )
  }

  const lang = (t("lang", { defaultValue: "en" }) as string) as "en" | "hi" | "mr"
  const name = (scheme.name as Record<string, string>)[lang] || scheme.name.en

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/schemes">
          <ArrowLeft className="mr-1.5 size-4" />
          {t("journey.backToSchemes")}
        </Link>
      </Button>

      <h1 className="font-display font-bold text-3xl tracking-tight mb-1">
        {t("journey.title")}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">{name}</p>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card>
          <CardContent className="pt-5">
            <ApplicationTimeline
              steps={steps}
              currentStep={effectiveCurrent}
              onToggleStep={handleToggleStep}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {steps[effectiveCurrent] && (
            <Card>
              <CardContent className="pt-5 space-y-3">
                <h3 className="text-sm font-semibold">
                  {t("journey.currentStep")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`journey.descriptions.${steps[effectiveCurrent].id}`)}
                </p>
                {STEP_ACTIONS[steps[effectiveCurrent].id] && (
                  <Button size="sm" asChild className="w-full">
                    {STEP_ACTIONS[steps[effectiveCurrent].id].external ? (
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        {t(STEP_ACTIONS[steps[effectiveCurrent].id].labelKey)}
                        <ExternalLink className="ml-1.5 size-3" />
                      </a>
                    ) : (
                      <Link to={STEP_ACTIONS[steps[effectiveCurrent].id].href || "#"}>
                        {t(STEP_ACTIONS[steps[effectiveCurrent].id].labelKey)}
                      </Link>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="border-success/30 bg-success/5">
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground">
                {t("journey.saveNotice")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
