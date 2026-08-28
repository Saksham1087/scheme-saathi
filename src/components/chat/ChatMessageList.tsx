import { useRef, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Volume2, VolumeX, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/services/chat/groqTypes";

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  ttsEnabled: boolean;
  onPlayTts: (text: string) => void;
  onStopTts: () => void;
  playingMessageId: string | null;
}

export function ChatMessageList({
  messages,
  isLoading,
  ttsEnabled,
  onPlayTts,
  onStopTts,
  playingMessageId,
}: ChatMessageListProps) {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    setUserScrolledUp(false);
  }, []);

  useEffect(() => {
    if (!userScrolledUp) {
      scrollToBottom();
    }
  }, [messages.length, isLoading, scrollToBottom, userScrolledUp]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setUserScrolledUp(!isAtBottom);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
      onScroll={handleScroll}
    >
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <Bot className="size-12 mb-3 opacity-50" />
          <p className="text-sm">{t("chat.emptyState")}</p>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {msg.role === "assistant" && (
            <div className="shrink-0 size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="size-4 text-primary" />
            </div>
          )}

          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-secondary text-secondary-foreground rounded-bl-md"
            }`}
          >
            <div className="whitespace-pre-wrap">{msg.content}</div>
            <div className="flex items-center justify-end gap-2 mt-1.5">
              <span className="text-xs text-muted-foreground/70">{formatTime(msg.timestamp)}</span>
              {msg.role === "assistant" && ttsEnabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-xs"
                  onClick={() => {
                    if (playingMessageId === msg.id) {
                      onStopTts();
                    } else {
                      onPlayTts(msg.content);
                    }
                  }}
                  aria-label={playingMessageId === msg.id ? t("chat.stopAudio") : t("chat.playAudio")}
                >
                  {playingMessageId === msg.id ? (
                    <VolumeX className="size-4 text-primary" />
                  ) : (
                    <Volume2 className="size-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {msg.role === "user" && (
            <div className="shrink-0 size-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <User className="size-4" />
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start gap-3 animate-in fade-in">
          <div className="shrink-0 size-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="size-4 text-primary" />
          </div>
          <div className="bg-secondary rounded-2xl px-4 py-2.5 text-sm flex items-center gap-2">
            <Loader2 className="size-4 animate-spin text-primary" />
            <span className="text-muted-foreground">{t("chat.thinking")}</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}