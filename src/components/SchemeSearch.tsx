import { useTranslation } from "react-i18next"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SchemeSearchProps {
  value: string
  onChange: (value: string) => void
}

export function SchemeSearch({ value, onChange }: SchemeSearchProps) {
  const { t } = useTranslation()

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={t("schemes.search.placeholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-9"
        aria-label={t("schemes.search.ariaLabel")}
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          onClick={() => onChange("")}
          aria-label={t("schemes.search.clear")}
        >
          <X className="size-3.5" />
        </Button>
      )}
    </div>
  )
}
