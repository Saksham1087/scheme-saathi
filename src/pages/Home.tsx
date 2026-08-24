import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowRight,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Store,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const schemeCards = [
  { icon: Store, titleKey: "home.microCardTitle", bodyKey: "home.microCardBody" },
  { icon: Landmark, titleKey: "home.termCardTitle", bodyKey: "home.termCardBody" },
  {
    icon: GraduationCap,
    titleKey: "home.educationCardTitle",
    bodyKey: "home.educationCardBody",
  },
]

export default function Home() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 31px, var(--foreground) 31px, var(--foreground) 32px)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <Badge
            variant="outline"
            className="stamp border-accent text-accent mb-6 text-xs font-bold"
          >
            SC Channel Finance
          </Badge>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight max-w-3xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            {t("home.heroBody")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/find-schemes">
                {t("home.heroCta")}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/how-it-works">{t("home.heroSecondaryCta")}</Link>
            </Button>
          </div>
          <div className="mt-10 flex items-start gap-3 max-w-xl rounded-lg border border-border bg-card p-4">
            <ShieldCheck
              className="size-5 shrink-0 mt-0.5 text-success"
              aria-hidden
            />
            <div>
              <p className="text-sm leading-relaxed">{t("home.privacyNote")}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t("home.literacyTeaser")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scheme cards */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
          {t("home.schemesHeading")}
        </h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {schemeCards.map(({ icon: Icon, titleKey, bodyKey }) => (
            <Card
              key={titleKey}
              className="border-border shadow-[0_2px_0_0_var(--border)] hover:shadow-[0_4px_0_0_var(--border)] transition-shadow"
            >
              <CardHeader>
                <span className="mb-3 inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-6" aria-hidden />
                </span>
                <CardTitle className="font-display text-lg">
                  {t(titleKey)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {t(bodyKey)}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-xl bg-primary text-primary-foreground px-6 py-10 sm:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="font-display font-bold text-2xl sm:text-3xl leading-snug max-w-xl">
            {t("common.tagline")}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/find-schemes" className="font-semibold">
              {t("home.heroCta")}
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
