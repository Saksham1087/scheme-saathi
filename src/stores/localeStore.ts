import { create } from "zustand"

export type Lang = "en" | "hi"

interface LocaleState {
  lang: Lang
  setLang: (lang: Lang) => void
}

function initialLang(): Lang {
  const saved = localStorage.getItem("ss-lang")
  if (saved === "hi" || saved === "en") return saved
  return navigator.language.startsWith("hi") ? "hi" : "en"
}

export const useLocaleStore = create<LocaleState>()((set) => ({
  lang: initialLang(),
  setLang: (lang) => {
    localStorage.setItem("ss-lang", lang)
    document.documentElement.lang = lang
    set({ lang })
  },
}))
