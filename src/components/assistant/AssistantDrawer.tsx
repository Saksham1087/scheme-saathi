import React, { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Bot,
  X,
  Minus,
  Maximize2,
  Send,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChatBubble } from "./ChatBubble"
import { useAssistantStore } from "@/stores/useAssistantStore"
import { useLocaleStore } from "@/stores/localeStore"
import { useVoiceRecognition } from "@/lib/voice"
import { SUGGESTED_PROMPTS } from "@/lib/assistantService"
import type { SuggestedPrompt } from "@/types/assistant"

export function AssistantDrawer() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useLocaleStore()
  const {
    messages,
    isLoading,
    isOpen,
    isMinimized,
    setOpen,
    toggleMinimized,
    clearMessages,
    sendMessage,
  } = useAssistantStore()

  const [inputVal, setInputVal] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Web Speech recognition for voice dictation
  const voice = useVoiceRecognition({
    initialLang: lang === "hi" ? "hi-IN" : "en-IN",
    continuous: false,
    onResult: (transcript, isFinal) => {
      setInputVal(transcript)
      if (isFinal) {
        inputRef.current?.focus()
      }
    },
  })

  // Update voice language when app locale changes
  useEffect(() => {
    voice.setLanguage(lang === "hi" ? "hi-IN" : "en-IN")
  }, [lang, voice])

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading, isOpen, isMinimized])

  // If on the dedicated /assistant page, hide the floating drawer to prevent visual duplication
  if (location.pathname === "/assistant") {
    return null
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const text = inputVal.trim()
    if (!text || isLoading) return

    setInputVal("")
    if (voice.listening) {
      voice.stop()
    }
    await sendMessage(text, lang)
  }

  const handleSelectPrompt = async (prompt: SuggestedPrompt) => {
    const text = lang === "hi" ? prompt.prompt.hi : prompt.prompt.en
    setInputVal("")
    await sendMessage(text, lang)
  }

  const toggleMic = () => {
    if (voice.listening) {
      voice.stop()
    } else {
      voice.start()
    }
  }

  return (
    <>
      {/* Floating Widget Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-24 z-40 sm:bottom-8 sm:right-32 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative flex items-center gap-2 rounded-full bg-linear-to-r from-amber-600 to-primary px-4 py-3 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-hidden focus:ring-4 focus:ring-primary/30 active:scale-95 cursor-pointer min-h-[44px]"
            aria-label={t("assistant.floatingBtnLabel", "Open Saathi AI Scheme Assistant")}
            title={t("assistant.floatingTooltip", "Ask Saathi AI about schemes, loans & interest rates")}
          >
            {/* Glowing Ring */}
            <span className="absolute -inset-1 rounded-full bg-primary/20 blur-sm group-hover:bg-primary/40 transition-all" />

            <span className="relative flex size-6 items-center justify-center">
              <Bot className="size-5 transition-transform duration-300 group-hover:scale-110" />
            </span>

            <span className="relative inline-flex items-center gap-1.5 text-xs font-bold tracking-tight">
              <span>{t("assistant.badgeName", "Saathi AI")}</span>
              <Sparkles className="size-3 text-amber-200 animate-pulse" />
            </span>
          </button>
        </div>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col rounded-2xl border border-border/80 bg-background shadow-2xl transition-all duration-300 overflow-hidden ${
            isMinimized
              ? "w-[320px] sm:w-[360px] h-14"
              : "w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh]"
          }`}
          role="dialog"
          aria-label={t("assistant.dialogAria", "Saathi AI Conversational Assistant")}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border/80 bg-muted/60 px-4 py-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-linear-to-tr from-amber-500 to-primary text-white flex items-center justify-center shadow-xs">
                <Bot className="size-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-display text-sm font-bold leading-none text-foreground">
                    Saathi AI
                  </h2>
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] py-0 px-1.5 h-4 flex items-center gap-0.5"
                  >
                    <ShieldCheck className="size-2.5" />
                    <span>{t("assistant.groundedTag", "Grounded")}</span>
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">
                  {t("assistant.headerSub", "Verified Scheme Guidance")}
                </p>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setOpen(false)
                  navigate("/assistant")
                }}
                className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                title={t("assistant.fullPage", "Open Full Page")}
                aria-label={t("assistant.fullPage", "Open Full Page")}
              >
                <Maximize2 className="size-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => clearMessages(lang)}
                className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                title={t("assistant.resetChat", "Reset Chat")}
                aria-label={t("assistant.resetChat", "Reset Chat")}
              >
                <RotateCcw className="size-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMinimized}
                className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                title={isMinimized ? "Expand" : "Minimize"}
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? <ChevronDown className="size-4 rotate-180" /> : <Minus className="size-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                title={t("common.close", "Close")}
                aria-label={t("common.close", "Close")}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Main Chat Body (Hidden if minimized) */}
          {!isMinimized && (
            <>
              {/* Message List Area */}
              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scroll-smooth">
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2.5 my-2">
                    <div className="size-7 rounded-full bg-linear-to-tr from-amber-500 to-primary text-white flex items-center justify-center shrink-0">
                      <Bot className="size-4" />
                    </div>
                    <div className="rounded-2xl rounded-tl-xs border border-border/70 bg-card px-4 py-3 shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-primary/70 animate-bounce" />
                        <span className="size-2 rounded-full bg-primary/70 animate-bounce [animation-delay:0.15s]" />
                        <span className="size-2 rounded-full bg-primary/70 animate-bounce [animation-delay:0.3s]" />
                        <span className="text-xs text-muted-foreground ml-2 font-medium">
                          {t("assistant.retrieving", "Retrieving official guidelines…")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              {showSuggestions && (
                <div className="border-t border-border/50 bg-muted/30 px-3 py-2">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                      <Sparkles className="size-3 text-amber-500" />
                      <span>{t("assistant.suggestedPrompts", "Suggested Questions:")}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSuggestions(false)}
                      className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {t("common.hide", "Hide")}
                    </button>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {SUGGESTED_PROMPTS.slice(0, 4).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectPrompt(item)}
                        disabled={isLoading}
                        className="shrink-0 px-2.5 py-1 rounded-full border border-border bg-background hover:bg-muted text-[11px] font-medium text-foreground transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {lang === "hi" ? item.title.hi : item.title.en}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Listening Banner if Speech active */}
              {voice.listening && (
                <div className="bg-amber-500/10 border-t border-amber-500/20 px-3 py-1.5 flex items-center justify-between text-xs text-amber-900 dark:text-amber-300 animate-pulse">
                  <div className="flex items-center gap-1.5">
                    <Mic className="size-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{t("assistant.voiceListening", "Listening… Speak your question")}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => voice.stop()}
                    className="h-6 px-2 text-[10px] cursor-pointer text-amber-900 dark:text-amber-300"
                  >
                    {t("common.stop", "Stop")}
                  </Button>
                </div>
              )}

              {/* Chat Input Form */}
              <form
                onSubmit={handleSend}
                className="border-t border-border/80 bg-background p-2.5 flex items-center gap-1.5"
              >
                {/* Voice Dictation Button */}
                {voice.supported && (
                  <Button
                    type="button"
                    variant={voice.listening ? "default" : "outline"}
                    size="icon"
                    onClick={toggleMic}
                    disabled={isLoading}
                    className={`size-10 rounded-full shrink-0 cursor-pointer transition-all ${
                      voice.listening
                        ? "bg-amber-600 hover:bg-amber-700 text-white animate-pulse"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                    title={
                      voice.listening
                        ? t("assistant.stopVoice", "Stop Listening")
                        : t("assistant.startVoice", "Speak your query")
                    }
                    aria-label={t("assistant.voiceDictationAria", "Voice Dictation")}
                  >
                    {voice.listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                  </Button>
                )}

                {/* Text Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={
                    voice.listening
                      ? t("assistant.speakingPlaceholder", "Listening…")
                      : t("assistant.inputPlaceholder", "Ask about schemes, loans, interest…")
                  }
                  disabled={isLoading}
                  className="flex-1 h-10 rounded-full border border-border bg-muted/30 px-3.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />

                {/* Send Button */}
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputVal.trim() || isLoading}
                  className="size-10 rounded-full shrink-0 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                  aria-label={t("assistant.sendAria", "Send Message")}
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}
