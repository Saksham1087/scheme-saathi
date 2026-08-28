import { useEffect, useState } from "react"
import { Type, Contrast } from "lucide-react"

type FontSize = "small" | "medium" | "large"

const fontSizes: { value: FontSize; label: string; className: string }[] = [
  { value: "small", label: "A", className: "text-base" },
  { value: "medium", label: "A", className: "text-lg" },
  { value: "large", label: "A", className: "text-xl" },
]

function loadFontSize(): FontSize {
  const saved = localStorage.getItem("ss-font-size")
  if (saved === "small" || saved === "medium" || saved === "large") return saved
  return "medium"
}

function loadHighContrast(): boolean {
  return localStorage.getItem("ss-high-contrast") === "true"
}

export function AccessibilityControls() {
  const [fontSize, setFontSize] = useState<FontSize>(loadFontSize)
  const [highContrast, setHighContrast] = useState<boolean>(loadHighContrast)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("font-small", "font-medium", "font-large")
    root.classList.add(`font-${fontSize}`)
    localStorage.setItem("ss-font-size", fontSize)
  }, [fontSize])

  useEffect(() => {
    document.body.classList.toggle("high-contrast", highContrast)
    localStorage.setItem("ss-high-contrast", String(highContrast))
  }, [highContrast])

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <Type className="size-3.5" aria-hidden />
        <span className="sr-only">Font size</span>
        {fontSizes.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFontSize(opt.value)}
            aria-pressed={fontSize === opt.value}
            className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
              opt.className} ${
              fontSize === opt.value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => setHighContrast(!highContrast)}
        aria-pressed={highContrast}
        className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
          highContrast
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
      >
        <Contrast className="size-3.5" />
        <span className="sr-only">High contrast</span>
      </button>
    </div>
  )
}
