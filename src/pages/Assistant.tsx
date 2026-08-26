import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatInterface } from "@/components/ChatInterface"

export default function Assistant() {
  const { t } = useTranslation()

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/">
          <ArrowLeft className="mr-1.5 size-4" />
          {t("common.back")}
        </Link>
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight">
            {t("assistant.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("assistant.subtitle")}
          </p>
        </div>
      </div>

      <ChatInterface />
    </main>
  )
}
