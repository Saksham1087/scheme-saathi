import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowRight,
  BookMarked,
  Calculator,
  FileCheck,
  MapPin,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/authStore"

function DashboardSection({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Icon className="size-4 text-primary" />
            {title}
          </CardTitle>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function EmptyState({
  message,
  ctaLabel,
  ctaHref,
}: {
  message: string
  ctaLabel: string
  ctaHref: string
}) {
  return (
    <div className="text-center py-6">
      <p className="text-sm text-muted-foreground mb-3">{message}</p>
      <Button size="sm" variant="outline" asChild>
        <Link to={ctaHref}>
          <Plus className="mr-1.5 size-3" />
          {ctaLabel}
        </Link>
      </Button>
    </div>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-display font-bold text-3xl">{t("dashboard.loginRequired")}</h1>
        <p className="mt-3 text-muted-foreground">{t("dashboard.loginPrompt")}</p>
        <Button asChild className="mt-6">
          <Link to="/login">{t("dashboard.goToLogin")}</Link>
        </Button>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl tracking-tight">
            {t("dashboard.greeting", { name: user.displayName || "there" })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link to="/recommend">
              <TrendingUp className="mr-1.5 size-4" />
              {t("dashboard.newAssessment")}
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/schemes">
              <ArrowRight className="mr-1.5 size-4" />
              {t("dashboard.browseSchemes")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recommended Schemes */}
        <DashboardSection
          title={t("dashboard.sections.recommended")}
          icon={TrendingUp}
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/schemes">{t("dashboard.viewAll")}</Link>
            </Button>
          }
        >
          <EmptyState
            message={t("dashboard.empty.recommended")}
            ctaLabel={t("dashboard.cta.takeAssessment")}
            ctaHref="/recommend"
          />
        </DashboardSection>

        {/* Saved Schemes */}
        <DashboardSection
          title={t("dashboard.sections.saved")}
          icon={BookMarked}
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/schemes">{t("dashboard.viewAll")}</Link>
            </Button>
          }
        >
          <EmptyState
            message={t("dashboard.empty.saved")}
            ctaLabel={t("dashboard.cta.exploreSchemes")}
            ctaHref="/schemes"
          />
        </DashboardSection>

        {/* Active Applications */}
        <DashboardSection
          title={t("dashboard.sections.applications")}
          icon={FileCheck}
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/schemes">{t("dashboard.viewAll")}</Link>
            </Button>
          }
        >
          <EmptyState
            message={t("dashboard.empty.applications")}
            ctaLabel={t("dashboard.cta.startApplication")}
            ctaHref="/schemes"
          />
        </DashboardSection>

        {/* Saved Partners */}
        <DashboardSection
          title={t("dashboard.sections.partners")}
          icon={MapPin}
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/partners">{t("dashboard.findPartner")}</Link>
            </Button>
          }
        >
          <EmptyState
            message={t("dashboard.empty.partners")}
            ctaLabel={t("dashboard.cta.findPartner")}
            ctaHref="/partners"
          />
        </DashboardSection>

        {/* Recent Calculations */}
        <DashboardSection
          title={t("dashboard.sections.calculations")}
          icon={Calculator}
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/calculator">{t("dashboard.newCalculation")}</Link>
            </Button>
          }
        >
          <EmptyState
            message={t("dashboard.empty.calculations")}
            ctaLabel={t("dashboard.cta.tryCalculator")}
            ctaHref="/calculator"
          />
        </DashboardSection>

        {/* Assessment History */}
        <DashboardSection
          title={t("dashboard.sections.assessments")}
          icon={Users}
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/recommend">{t("dashboard.retakeAssessment")}</Link>
            </Button>
          }
        >
          <EmptyState
            message={t("dashboard.empty.assessments")}
            ctaLabel={t("dashboard.cta.takeAssessment")}
            ctaHref="/recommend"
          />
        </DashboardSection>
      </div>
    </main>
  )
}
