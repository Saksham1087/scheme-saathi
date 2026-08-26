import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowRight,
  Calculator,
  FileCheck,
  GraduationCap,
  Landmark,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Store,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { useState } from "react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const schemeCards = [
  { icon: Store, titleKey: "home.microCardTitle", bodyKey: "home.microCardBody" },
  { icon: Landmark, titleKey: "home.termCardTitle", bodyKey: "home.termCardBody" },
  {
    icon: GraduationCap,
    titleKey: "home.educationCardTitle",
    bodyKey: "home.educationCardBody",
  },
]

const ROUTE_STEPS = ["s1", "s2", "s3", "s4"] as const

const features = [
  {
    icon: FileCheck,
    titleKey: "home.features.smartMatching.title",
    descKey: "home.features.smartMatching.desc",
    to: "/recommend",
  },
  {
    icon: Calculator,
    titleKey: "home.features.calculator.title",
    descKey: "home.features.calculator.desc",
    to: "/calculator",
  },
  {
    icon: MapPin,
    titleKey: "home.features.partnerLocator.title",
    descKey: "home.features.partnerLocator.desc",
    to: "/partners",
  },
  {
    icon: MessageSquareText,
    titleKey: "home.features.voiceAssistant.title",
    descKey: "home.features.voiceAssistant.desc",
    to: "/recommend",
  },
  {
    icon: Wallet,
    titleKey: "home.features.digilocker.title",
    descKey: "home.features.digilocker.desc",
    to: "/recommend",
  },
]

const popularSchemes = [
  {
    slug: "pm-svanidhi",
    nameKey: "home.popularSchemes.svanidhi.name",
    ministryKey: "home.popularSchemes.svanidhi.ministry",
    descKey: "home.popularSchemes.svanidhi.desc",
    categoryKey: "schemeTypes.micro",
  },
  {
    slug: "mudra-yojana",
    nameKey: "home.popularSchemes.mudra.name",
    ministryKey: "home.popularSchemes.mudra.ministry",
    descKey: "home.popularSchemes.mudra.desc",
    categoryKey: "schemeTypes.micro",
  },
  {
    slug: "stand-up-india",
    nameKey: "home.popularSchemes.standUp.name",
    ministryKey: "home.popularSchemes.standUp.ministry",
    descKey: "home.popularSchemes.standUp.desc",
    categoryKey: "schemeTypes.term",
  },
  {
    slug: "post-matric-scholarship-sc",
    nameKey: "home.popularSchemes.postMatric.name",
    ministryKey: "home.popularSchemes.postMatric.ministry",
    descKey: "home.popularSchemes.postMatric.desc",
    categoryKey: "schemeTypes.education",
  },
]

const faqKeys = [
  "whoCanApply",
  "directApplication",
  "channelPartner",
  "documents",
  "trackStatus",
  "schemeCost",
] as const

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */

function HowItWorksSection() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
        {t("home.howItWorks.title")}
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {t("home.howItWorks.intro")}
      </p>
      <ol className="mt-8 grid gap-6 sm:grid-cols-4">
        {ROUTE_STEPS.map((s, i) => (
          <li key={s} className="relative flex flex-col items-start">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-display font-bold text-sm text-primary-foreground mb-3"
              aria-hidden
            >
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed">
              {t(`how.steps.${s}`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function FeatureShowcase() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
        {t("home.features.heading")}
      </h2>
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, titleKey, descKey, to }) => (
          <Card
            key={titleKey}
            className="border-border shadow-[0_2px_0_0_var(--border)] hover:shadow-[0_4px_0_0_var(--border)] transition-shadow"
          >
            <CardHeader>
              <span className="mb-3 inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-6" aria-hidden />
              </span>
              <CardTitle className="font-display text-lg">{t(titleKey)}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(descKey)}
              </p>
              <Button variant="outline" size="sm" asChild className="self-start">
                <Link to={to}>
                  {t("common.next")}
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function PopularSchemesSection() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
          {t("home.popularSchemes.heading")}
        </h2>
        <Button variant="outline" size="sm" asChild className="shrink-0">
          <Link to="/recommend">
            {t("home.popularSchemes.viewAll")}
            <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
        </Button>
      </div>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {popularSchemes.map((s) => (
          <Card key={s.slug} className="border-border">
            <CardHeader>
              <Badge variant="outline" className="w-fit text-xs font-semibold mb-1">
                {t(s.categoryKey)}
              </Badge>
              <CardTitle className="font-display text-lg">{t(s.nameKey)}</CardTitle>
              <p className="text-xs text-muted-foreground">{t(s.ministryKey)}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(s.descKey)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function FinancialLiteracySection() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
        {t("home.financialLiteracy.heading")}
      </h2>
      <div className="mt-7 grid gap-5 sm:grid-cols-3">
        {(["concessional", "moratorium", "channel"] as const).map((topic) => (
          <Card key={topic} className="border-border">
            <CardContent className="pt-6">
              <h3 className="font-display font-semibold text-base leading-snug">
                {t(`literacy.${topic}_title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`literacy.${topic}_body`)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function FAQSection() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
        {t("home.faq.heading")}
      </h2>
      <div className="mt-7 border-t border-border">
        {faqKeys.map((key, i) => {
          const isOpen = openIndex === i
          return (
            <AccordionItem key={key} open={isOpen}>
              <AccordionTrigger
                open={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                {t(`home.faq.${key}.q`)}
              </AccordionTrigger>
              <AccordionContent open={isOpen}>
                {t(`home.faq.${key}.a`)}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </div>
    </section>
  )
}

function TrustSection() {
  const { t } = useTranslation()
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="rounded-xl border border-border bg-card p-6 sm:p-10">
        <h2 className="font-display font-bold text-2xl tracking-tight">
          {t("home.trust.heading")}
        </h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div className="flex gap-3">
            <ShieldCheck className="size-5 shrink-0 mt-0.5 text-success" aria-hidden />
            <div>
              <h3 className="font-semibold text-sm">{t("home.trust.governance.title")}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {t("home.trust.governance.desc")}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <FileCheck className="size-5 shrink-0 mt-0.5 text-success" aria-hidden />
            <div>
              <h3 className="font-semibold text-sm">{t("home.trust.dataSource.title")}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {t("home.trust.dataSource.desc")}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Wallet className="size-5 shrink-0 mt-0.5 text-success" aria-hidden />
            <div>
              <h3 className="font-semibold text-sm">{t("home.trust.dataPrivacy.title")}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {t("home.trust.dataPrivacy.desc")}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Landmark className="size-5 shrink-0 mt-0.5 text-success" aria-hidden />
            <div>
              <h3 className="font-semibold text-sm">{t("home.trust.channelFinance.title")}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {t("home.trust.channelFinance.desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Home page                                                          */
/* ------------------------------------------------------------------ */

export default function Home() {
  const { t } = useTranslation()

  return (
    <main>
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
              <Link to="/recommend">
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

      <HowItWorksSection />
      <FeatureShowcase />
      <PopularSchemesSection />
      <FinancialLiteracySection />
      <FAQSection />
      <TrustSection />

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-xl bg-primary text-primary-foreground px-6 py-10 sm:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="font-display font-bold text-2xl sm:text-3xl leading-snug max-w-xl">
            {t("common.tagline")}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/recommend" className="font-semibold">
              {t("home.heroCta")}
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
