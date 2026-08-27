import React from "react"
import { useTranslation } from "react-i18next"
import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SchemeSectionCardProps {
  id: string
  sectionNumber: number
  title: string
  icon: React.ReactNode
  subtitle?: string
  isVerified?: boolean
  children: React.ReactNode
  className?: string
}

export function SchemeSectionCard({
  id,
  sectionNumber,
  title,
  icon,
  subtitle,
  isVerified = true,
  children,
  className = "",
}: SchemeSectionCardProps) {
  const { t } = useTranslation()

  return (
    <Card
      id={id}
      className={`scroll-mt-24 border-border/80 shadow-xs transition-colors hover:border-border focus-within:ring-2 focus-within:ring-primary ${className}`}
    >
      <CardHeader className="pb-3 pt-5 px-5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20">
              {sectionNumber}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-primary/90">{icon}</span>
              <CardTitle className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {title}
              </CardTitle>
            </div>
          </div>

          {!isVerified && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/80 dark:text-amber-200 text-xs font-semibold py-1 px-2.5"
            >
              <AlertCircle className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              {t("schemeDetails.unverifiedWarning", "Information not independently verified")}
            </Badge>
          )}
        </div>

        {subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 pl-10">
            {subtitle}
          </p>
        )}
      </CardHeader>

      <CardContent className="px-5 sm:px-6 pb-6 pt-2 text-sm text-foreground/90">
        {children}
      </CardContent>
    </Card>
  )
}
