import React, { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import {
  Bot,
  Send,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Calculator,
  Building2,
  ListChecks,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatBubble } from "@/components/assistant/ChatBubble"
import { useAssistantStore } from "@/stores/useAssistantStore"
import { useLocaleStore } from "@/stores/localeStore"
import { useVoiceRecognition } from "@/lib/voice"
import { SUGGESTED_PROMPTS } from "@/lib/assistantService"
import type { SuggestedPrompt } from "@/types/assistant"

export default function AssistantPage() {
  const { t } = useTranslation()
  const { lang } = useLocaleStore()
  const {
    messages,
    isLoading,
    clearMessages,
    sendMessage,
  } = useAssistantStore()

  const [inputVal, setInputVal] = useState("")
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

  // Synchronize speech language when user switches locale
  useEffect(() => {
    voice.setLanguage(lang === "hi" ? "hi-IN" : "en-IN")
  }, [lang, voice])

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 text-xs px-2.5 py-0.5"
            >
              <Sparkles className="size-3 mr-1 text-amber-500 animate-pulse" />
              {t("assistant.pageBadge", "Grounded Scheme Intelligence")}
            </Badge>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs px-2.5 py-0.5"
            >
              <ShieldCheck className="size-3 mr-1" />
              {t("assistant.verifiedGrounding", "100% Source-Grounded")}
            </Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <span className="size-9 rounded-full bg-linear-to-tr from-amber-500 to-primary text-white flex items-center justify-center shadow-md">
              <Bot className="size-5" />
            </span>
            <span>{t("assistant.pageTitle", "Saathi AI Conversational Scheme Assistant")}</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
            {t(
              "assistant.pageSubtitle",
              "Ask detailed questions about concessional government loans, interest rates, eligibility criteria, and required documents. Responses are strictly grounded in official guidelines.",
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearMessages(lang)}
            className="cursor-pointer min-h-[40px]"
          >
            <RotateCcw className="size-4 mr-1.5 text-muted-foreground" />
            <span>{t("assistant.resetChat", "Reset Conversation")}</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Suggested Prompts & Safety Notice */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Prompts Card */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-amber-500" />
                <span>{t("assistant.suggestedPrompts", "Suggested Questions")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {SUGGESTED_PROMPTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectPrompt(item)}
                  disabled={isLoading}
                  className="w-full text-left p-2.5 rounded-lg border border-border/70 bg-card hover:bg-muted/70 transition-all duration-200 group text-xs font-medium text-foreground hover:border-primary/40 focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50 cursor-pointer flex items-start justify-between gap-2"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {lang === "hi" ? item.title.hi : item.title.en}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {lang === "hi" ? item.prompt.hi : item.prompt.en}
                    </p>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 shrink-0 mt-0.5" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* AI Safety & Statutory Grounding Policy Card */}
          <Card className="border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/10 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="size-4 text-amber-600" />
                <span>{t("assistant.safetyTitle", "Mandatory AI Safety Guardrail")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs leading-relaxed text-amber-950 dark:text-amber-200/90 space-y-2">
              <p>
                {t(
                  "assistant.safetyBody1",
                  "Saathi AI strictly refuses to hallucinate policies or fabricate loan approvals. All quotes reflect official gazetted rates under NSFDC and Ministry regulations.",
                )}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t(
                  "assistant.safetyBody2",
                  "Final loan approvals are subject to document appraisal by designated State Channelizing Agencies (SCAs) and Bank branches.",
                )}
              </p>
            </CardContent>
          </Card>

          {/* Quick Direct Tools Links */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("assistant.relatedTools", "Self-Service Tools")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs">
              <a
                href="/calculator"
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted font-medium text-foreground transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Calculator className="size-3.5 text-emerald-600" />
                  <span>{t("nav.calculator", "EMI Calculator")}</span>
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </a>
              <a
                href="/documents"
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted font-medium text-foreground transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ListChecks className="size-3.5 text-amber-600" />
                  <span>{t("nav.documents", "Document Checklist")}</span>
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </a>
              <a
                href="/partners"
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted font-medium text-foreground transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="size-3.5 text-purple-600" />
                  <span>{t("nav.partners", "Find a Partner")}</span>
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Chat Window */}
        <div className="lg:col-span-8">
          <Card className="border-border/80 shadow-md flex flex-col h-[640px]">
            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1 scroll-smooth">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}

              {/* Live Loading state */}
              {isLoading && (
                <div className="flex items-start gap-2.5 my-3">
                  <div className="size-8 rounded-full bg-linear-to-tr from-amber-500 to-primary text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Bot className="size-4.5" />
                  </div>
                  <div className="rounded-2xl rounded-tl-xs border border-border/80 bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-primary/70 animate-bounce" />
                      <span className="size-2 rounded-full bg-primary/70 animate-bounce [animation-delay:0.15s]" />
                      <span className="size-2 rounded-full bg-primary/70 animate-bounce [animation-delay:0.3s]" />
                      <span className="text-xs font-medium text-muted-foreground ml-2">
                        {t("assistant.retrieving", "Retrieving official guidelines…")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Voice Listening Active Status Bar */}
            {voice.listening && (
              <div className="bg-amber-500/10 border-t border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-900 dark:text-amber-300 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-amber-500 animate-ping" />
                  <Mic className="size-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-semibold">
                    {t("assistant.voiceListening", "Listening… Speak your question clearly")}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => voice.stop()}
                  className="h-6 px-2 text-xs font-semibold cursor-pointer text-amber-900 dark:text-amber-300"
                >
                  {t("common.stop", "Stop")}
                </Button>
              </div>
            )}

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSend}
              className="border-t border-border/80 bg-muted/20 p-3 sm:p-4 flex items-center gap-2"
            >
              {/* Voice Dictation Mic Button */}
              {voice.supported && (
                <Button
                  type="button"
                  variant={voice.listening ? "default" : "outline"}
                  size="icon"
                  onClick={toggleMic}
                  disabled={isLoading}
                  className={`size-11 rounded-full shrink-0 cursor-pointer transition-all ${
                    voice.listening
                      ? "bg-amber-600 hover:bg-amber-700 text-white animate-pulse shadow-md"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  title={
                    voice.listening
                      ? t("assistant.stopVoice", "Stop Listening")
                      : t("assistant.startVoice", "Speak your question (Hindi / English)")
                  }
                  aria-label={t("assistant.voiceDictationAria", "Voice Dictation")}
                >
                  {voice.listening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
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
                className="flex-1 h-11 rounded-full border border-border bg-background px-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50 shadow-2xs"
              />

              {/* Send Button */}
              <Button
                type="submit"
                size="icon"
                disabled={!inputVal.trim() || isLoading}
                className="size-11 rounded-full shrink-0 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 shadow-sm"
                aria-label={t("assistant.sendAria", "Send Message")}
              >
                <Send className="size-5" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
