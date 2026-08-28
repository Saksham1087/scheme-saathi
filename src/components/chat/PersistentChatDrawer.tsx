import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { useChatPersistence } from "@/hooks/useChatPersistence";
import { callChatCompletion, callTextToSpeech } from "@/services/chat/chatService";
import type { ChatMessage } from "@/services/chat/groqTypes";

const WELCOME_MESSAGE = "chat.welcome";

export function PersistentChatDrawer() {
  const { t, i18n } = useTranslation();
  const { user: currentUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [charsRemaining, setCharsRemaining] = useState(10000);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const {
    messages: persistedMessages,
    saveMessages,
    clearMessages,
    isLoaded,
  } = useChatPersistence(currentUser?.uid || null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 480;

  useEffect(() => {
    const handleOpenDrawer = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener("open-chat-drawer", handleOpenDrawer);
    return () => window.removeEventListener("open-chat-drawer", handleOpenDrawer);
  }, []);

  useEffect(() => {
    if (isLoaded && persistedMessages.length > 0) {
      setMessages(persistedMessages);
    } else if (isLoaded && persistedMessages.length === 0 && (isOpen || isMinimized)) {
      addWelcomeMessage();
    }
  }, [isLoaded, persistedMessages, isOpen, isMinimized]);

  useEffect(() => {
    const savedTts = localStorage.getItem(`scheme-sathi-tts-${currentUser?.uid}`);
    if (savedTts !== null) {
      setTtsEnabled(JSON.parse(savedTts));
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    if (ttsEnabled) {
      localStorage.setItem(`scheme-sathi-tts-${currentUser?.uid}`, "true");
    } else {
      localStorage.setItem(`scheme-sathi-tts-${currentUser?.uid}`, "false");
    }
  }, [ttsEnabled, currentUser?.uid]);

  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  const addWelcomeMessage = () => {
    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: "assistant",
      content: t(WELCOME_MESSAGE),
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMsg]);
  };

  const handleSend = useCallback(
    async (text: string) => {
      if (!currentUser || isLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const response = await callChatCompletion(
          newMessages.map((m) => ({ role: m.role, content: m.content }))
        );

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.response,
          timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...newMessages, assistantMsg];
        setMessages(updatedMessages);
        saveMessages(updatedMessages);
      } catch (error: any) {
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: error.message || t("chat.error"),
          timestamp: new Date().toISOString(),
        };
        const updatedMessages = [...newMessages, errorMsg];
        setMessages(updatedMessages);
        saveMessages(updatedMessages);
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser, isLoading, messages, saveMessages, t]
  );

  const handlePlayTts = useCallback(
    async (text: string) => {
      if (!currentUser || !ttsEnabled) return;

      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      setPlayingMessageId("loading");

      try {
        const response = await callTextToSpeech(text, i18n.language as "en" | "hi" | "mr");
        setCharsRemaining(response.charsRemaining);

        const audio = new Audio(`data:audio/mp3;base64,${response.audioBase64}`);
        currentAudioRef.current = audio;
        setPlayingMessageId("playing");

        audio.onended = () => {
          setPlayingMessageId(null);
          currentAudioRef.current = null;
        };

        audio.onerror = () => {
          setPlayingMessageId(null);
          currentAudioRef.current = null;
        };

        await audio.play();
      } catch (error) {
        console.error("TTS playback error:", error);
        setPlayingMessageId(null);
      }
    },
    [currentUser, ttsEnabled, i18n.language]
  );

  const handleStopTts = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setPlayingMessageId(null);
  }, []);

  const handleNewConversation = useCallback(() => {
    setMessages([]);
    clearMessages();
    addWelcomeMessage();
  }, [clearMessages]);

  const handleTtsToggle = useCallback(() => {
    setTtsEnabled((prev) => !prev);
  }, []);

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <button
        className={`fixed right-4 bottom-4 z-40 lg:hidden p-3 rounded-full bg-primary text-primary-foreground shadow-xl`}
        onClick={() => setIsOpen(true)}
        aria-label={t("chat.open")}
      >
        <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      <div
        className={`fixed right-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out bg-card border-l border-border shadow-2xl flex flex-col ${
          isOpen || isMinimized
            ? isMinimized
              ? "w-14"
              : isMobile
              ? "w-full max-w-[95vw]"
              : "w-[380px]"
            : "translate-x-full w-[380px]"
        }`}
        role="dialog"
        aria-label={t("chat.drawerTitle")}
      >
        <ChatHeader
          isMinimized={isMinimized}
          onMinimize={() => setIsMinimized(true)}
          onExpand={() => setIsMinimized(false)}
          onClose={() => { setIsOpen(false); setIsMinimized(false); }}
          onNewConversation={handleNewConversation}
          ttsEnabled={ttsEnabled}
          onTtsToggle={handleTtsToggle}
          charsRemaining={charsRemaining}
          isMobile={isMobile}
        />

        {!isMinimized && (
          <>
            <ChatMessageList
              messages={messages}
              isLoading={isLoading}
              ttsEnabled={ttsEnabled}
              onPlayTts={handlePlayTts}
              onStopTts={handleStopTts}
              playingMessageId={playingMessageId}
            />

            <ChatInput
              onSend={handleSend}
              disabled={isLoading || !currentUser}
              placeholder={t("chat.placeholder")}
            />
          </>
        )}
      </div>

      {(isOpen || isMinimized) && !isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => { setIsOpen(false); setIsMinimized(false); }}
          aria-hidden="true"
        />
      )}
    </>
  );
}