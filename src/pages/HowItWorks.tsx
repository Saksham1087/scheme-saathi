import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { InfoNote } from "@/components/literacy/InfoNote"

const ROUTE_STEPS = ["s1", "s2", "s3", "s4"] as const
const GLOSSARY_TERMS = ["SCA", "PSB", "RRB", "NBFC_MFI"] as const

export default function HowItWorks() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display font-bold text-3xl tracking-tight">
        {t("how.title")}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground max-w-xl">
        {t("how.intro")}
      </p>

      {/* Routing sequence — order carries meaning here */}
      <ol className="mt-9 space-y-0 relative">
        {ROUTE_STEPS.map((s, i) => (
          <li key={s} className="relative flex gap-5 pb-8 last:pb-0">
            {i < ROUTE_STEPS.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[21px] top-11 bottom-0 border-l-2 border-dashed border-primary/30"
              />
            )}
            <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-display font-bold text-lg text-primary-foreground">
              {i + 1}
            </span>
            <p className="pt-2.5 text-base leading-relaxed">
              {t(`how.steps.${s}`)}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <InfoNote topic="channel" defaultOpen />
      </div>

      {/* Glossary */}
      <section className="mt-12">
        <h2 className="font-display font-bold text-2xl tracking-tight mb-6">
          {t("how.glossaryTitle")}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {GLOSSARY_TERMS.map((term) => (
            <Card key={term}>
              <CardContent className="pt-6">
                <h3 className="font-display font-semibold text-base leading-snug">
                  {t(`glossary.${term}_term`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`glossary.${term}_def`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
