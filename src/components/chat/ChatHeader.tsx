import { useTranslation } from "react-i18next";
import { X, Minimize2, Maximize2, Volume2, VolumeX, RotateCcw, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ChatHeaderProps {
  isMinimized: boolean;
  onMinimize: () => void;
  onExpand: () => void;
  onClose: () => void;
  onNewConversation: () => void;
  ttsEnabled: boolean;
  onTtsToggle: () => void;
  charsRemaining?: number;
  isMobile: boolean;
}

export function ChatHeader({
  isMinimized,
  onMinimize,
  onExpand,
  onClose,
  onNewConversation,
  ttsEnabled,
  onTtsToggle,
  charsRemaining,
  isMobile,
}: ChatHeaderProps) {
  const { t } = useTranslation();
  const [showNewConvConfirm, setShowNewConvConfirm] = useState(false);

  useEffect(() => {
    setShowNewConvConfirm(false);
  }, [isMinimized]);

  if (isMinimized) {
    return (
      <div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 w-14 h-32 bg-primary rounded-l-xl flex flex-col items-center justify-center gap-2 cursor-pointer border border-border border-r-0 shadow-xl"
        onClick={onExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onExpand()}
        aria-label={t("chat.expand")}
      >
        <Bot className="size-5 text-primary-foreground" />
        <span className="text-xs font-medium text-primary-foreground whitespace-nowrap writing-mode-vertical-rl text-center">
          {t("chat.drawerTitle")}
        </span>
      </div>
    );
  }

  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="size-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-base">{t("chat.drawerTitle")}</h2>
          <p className="text-xs text-muted-foreground">{t("chat.subtitle")}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {charsRemaining !== undefined && (
          <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1">
            <Volume2 className="size-3.5" />
            {charsRemaining.toLocaleString()} {t("chat.charsLeft")}
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onTtsToggle}
          className={ttsEnabled ? "text-primary" : "text-muted-foreground"}
          aria-label={ttsEnabled ? t("chat.ttsDisable") : t("chat.ttsEnable")}
          title={ttsEnabled ? t("chat.ttsDisable") : t("chat.ttsEnable")}
        >
          {ttsEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
        </Button>

        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNewConvConfirm(true)}
            aria-label={t("chat.newConversation")}
            title={t("chat.newConversation")}
          >
            <RotateCcw className="size-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={isMinimized ? onExpand : onMinimize}
          aria-label={isMinimized ? t("chat.expand") : t("chat.minimize")}
        >
          {isMinimized ? <Maximize2 className="size-4" /> : <Minimize2 className="size-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={t("chat.close")}
        >
          <X className="size-4" />
        </Button>
      </div>

      {showNewConvConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg p-4 w-full max-w-sm mx-4 shadow-xl">
            <p className="text-sm text-center mb-4">{t("chat.newConvConfirm")}</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowNewConvConfirm(false)}>
                {t("common.cancel")}
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => { onNewConversation(); setShowNewConvConfirm(false); }}>
                {t("chat.newConversation")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}