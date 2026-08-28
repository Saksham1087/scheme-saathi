import { useTranslation } from "react-i18next"
import {
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react"
import { ActiveJourneysCard } from "@/components/dashboard/ActiveJourneysCard"
import { SavedSchemesCard } from "@/components/dashboard/SavedSchemesCard"
import { SavedPartnersCard } from "@/components/dashboard/SavedPartnersCard"
import { RecentCalculationsCard } from "@/components/dashboard/RecentCalculationsCard"
import { DocumentStatusCard } from "@/components/dashboard/DocumentStatusCard"
import { QuickLaunchpad } from "@/components/dashboard/QuickLaunchpad"
import { useApplicationStore } from "@/stores/useApplicationStore"
import { useSavedStore } from "@/stores/useSavedStore"
import { useAuthStore } from "@/stores/authStore"

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { applications } = useApplicationStore()
  const { savedSchemeIds, savedPartnerIds, savedCalculations } = useSavedStore()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10 space-y-8">
      {/* Hero Header */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <LayoutDashboard className="size-3.5" />
                {t("dashboard.heroBadge", "Beneficiary Hub")}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-full px-2.5 py-0.5">
                <ShieldCheck className="size-3.5" />
                {t("dashboard.statutoryTracker", "Statutory Self-Tracking")}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {user?.displayName
                ? t("dashboard.welcomeNamedUser", "Welcome back, {{name}}", { name: user.displayName })
                : t("dashboard.welcomeGuest", "Unified Beneficiary Dashboard")}
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                "dashboard.heroSubtitle",
                "Your centralized hub for tracked application journeys, bookmarked schemes, channel partners, saved financial simulations, and document readiness."
              )}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-muted/40 p-3 rounded-xl border border-border/70 text-xs">
            <div className="space-y-0.5 text-center p-2 rounded-lg bg-background/60 border border-border/40">
              <span className="text-muted-foreground font-medium block">
                {t("dashboard.statJourneys", "Journeys")}
              </span>
              <span className="font-display text-lg font-bold text-primary block">
                {applications.length}
              </span>
            </div>

            <div className="space-y-0.5 text-center p-2 rounded-lg bg-background/60 border border-border/40">
              <span className="text-muted-foreground font-medium block">
                {t("dashboard.statSchemes", "Schemes")}
              </span>
              <span className="font-display text-lg font-bold text-accent block">
                {savedSchemeIds.length}
              </span>
            </div>

            <div className="space-y-0.5 text-center p-2 rounded-lg bg-background/60 border border-border/40">
              <span className="text-muted-foreground font-medium block">
                {t("dashboard.statPartners", "Partners")}
              </span>
              <span className="font-display text-lg font-bold text-emerald-600 dark:text-emerald-400 block">
                {savedPartnerIds.length}
              </span>
            </div>

            <div className="space-y-0.5 text-center p-2 rounded-lg bg-background/60 border border-border/40">
              <span className="text-muted-foreground font-medium block">
                {t("dashboard.statCalculations", "Estimates")}
              </span>
              <span className="font-display text-lg font-bold text-blue-600 dark:text-blue-400 block">
                {savedCalculations.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Active Application Journeys */}
      <section aria-labelledby="active-journeys-heading">
        <ActiveJourneysCard />
      </section>

      {/* Section 2 & 5: Saved Schemes & Document Readiness Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section aria-labelledby="saved-schemes-heading">
          <SavedSchemesCard />
        </section>

        <section aria-labelledby="document-status-heading">
          <DocumentStatusCard />
        </section>
      </div>

      {/* Section 3 & 4: Saved Partners & Recent Calculations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section aria-labelledby="saved-partners-heading">
          <SavedPartnersCard />
        </section>

        <section aria-labelledby="recent-calculations-heading">
          <RecentCalculationsCard />
        </section>
      </div>

      {/* Section 6: Quick Discovery Action Launchpad */}
      <section aria-labelledby="quick-launchpad-heading">
        <QuickLaunchpad />
      </section>
    </div>
  )
}
