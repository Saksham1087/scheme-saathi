import React from "react"
import { useTranslation } from "react-i18next"
import { ArrowLeft, ArrowRight, RotateCcw, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface IntakeStepCardProps {
  currentStep: number
  totalSteps: number
  title: string
  description?: string
  error?: string | null
  canAdvance: boolean
  isBusy?: boolean
  isLastStep?: boolean
  nextLabel?: string
  onNext: () => void
  onBack: () => void
  onReset?: () => void
  children: React.ReactNode
}

export function IntakeStepCard({
  currentStep,
  totalSteps,
  title,
  description,
  error,
  canAdvance,
  isBusy = false,
  isLastStep = false,
  nextLabel,
  onNext,
  onBack,
  onReset,
  children,
}: IntakeStepCardProps) {
  const { t } = useTranslation()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Don't intercept Enter inside textarea or buttons
      const target = e.target as HTMLElement
      if (target.tagName !== "TEXTAREA" && target.tagName !== "BUTTON") {
        e.preventDefault()
        if (canAdvance && !isBusy) {
          onNext()
        }
      }
    }
  }

  return (
    <Card
      className="border-border shadow-md transition-all focus-within:border-primary/50"
      onKeyDown={handleKeyDown}
    >
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {t("intake.stepOf", { current: currentStep + 1, total: totalSteps })}
          </span>
          {onReset && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
              title={t("intake.startOver")}
            >
              <RotateCcw className="mr-1 size-3.5" />
              {t("intake.startOver")}
            </Button>
          )}
        </div>
        <CardTitle className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {children}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive font-medium animate-in fade-in duration-200"
          >
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 border-t border-border pt-4 pb-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={currentStep === 0 || isBusy}
          className="min-h-[44px] min-w-[100px] gap-1.5 touch-manipulation"
        >
          <ArrowLeft className="size-4" />
          <span>{t("common.back")}</span>
        </Button>

        <Button
          type="button"
          onClick={onNext}
          disabled={!canAdvance || isBusy}
          className="min-h-[44px] min-w-[130px] gap-1.5 touch-manipulation font-semibold"
        >
          {isBusy ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>{t("intake.matching")}</span>
            </>
          ) : isLastStep ? (
            <>
              <span>{nextLabel || t("intake.findSchemesCta")}</span>
              <ArrowRight className="size-4" />
            </>
          ) : (
            <>
              <span>{nextLabel || t("common.next")}</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
