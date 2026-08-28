import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceInput } from "@/components/VoiceInput";
import { isVoiceSupported } from "@/services/voice/types";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [showVoice, setShowVoice] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supported = isVoiceSupported();

  useEffect(() => {
    setShowVoice(supported);
  }, [supported]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
    textareaRef.current?.focus();
  };

  const handleVoiceTranscript = (text: string) => {
    setInput((prev) => (prev ? `${prev} ${text}` : text));
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder || t("chat.placeholder")}
            disabled={disabled}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none min-h-[44px] max-h-[120px] pr-12"
            rows={1}
            aria-label={t("chat.placeholder")}
          />
          {showVoice && (
            <VoiceInput
              onTranscript={handleVoiceTranscript}
              disabled={disabled}
            />
          )}
        </div>

        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || disabled}
          className="h-10 w-10 rounded-xl shrink-0"
          aria-label={t("chat.send")}
        >
          {disabled ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </div>

      {disabled && (
        <p className="mt-2 text-xs text-center text-muted-foreground">{t("chat.disabled")}</p>
      )}
    </form>
  );
}