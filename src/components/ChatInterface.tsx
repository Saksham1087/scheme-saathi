import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  createAssistant,
  getAssistantMessage,
  processUserInput,
  type ConversationState,
  type ChatMessage,
} from "@/services/ai/assistant"

export function ChatInterface() {
  const { t } = useTranslation()
  const [state, setState] = useState<ConversationState>(createAssistant)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages: ChatMessage[] = [
    ...state.history,
    ...(state.step !== "complete"
      ? [{ id: "assistant-welcome", role: "assistant" as const, content: getAssistantMessage(state, t), timestamp: new Date().toISOString() }]
      : []),
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    const { state: newState, response } = processUserInput(state, input, t)

    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
    }

    setState({
      ...newState,
      history: [...state.history, userMsg, assistantMsg],
    })
    setInput("")
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="shrink-0 size-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="size-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="shrink-0 size-8 rounded-full bg-secondary flex items-center justify-center">
                <User className="size-4" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="border-t border-border p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("assistant.placeholder")}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            disabled={state.step === "complete"}
          />
          <Button type="submit" size="sm" disabled={state.step === "complete"}>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
