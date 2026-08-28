import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { callChatCompletion } from '@/services/chat/chatService';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  error?: boolean;
  _read?: boolean;
}

export function FloatingChatWidget() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: t('chat.welcome'),
        timestamp: new Date(),
        _read: true,
      }]);
    }
  }, [isOpen, messages.length, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading || !user) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await callChatCompletion([
        ...conversationHistory,
        { role: 'user', content: currentInput },
      ]);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: currentInput },
        { role: 'assistant', content: response.response },
      ]);
      setUnreadCount(prev => prev + 1);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err instanceof Error ? err.message : t('chat.error');
      setError(errorMessage);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: t('chat.error'),
        timestamp: new Date(),
        error: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      setMessages(prev => prev.map(m => ({ ...m, _read: true })));
      setUnreadCount(0);
    }
    setIsOpen(!isOpen);
  };

  if (!user) {
    return null;
  }

  return (
    <div ref={widgetRef} className="fixed z-[1200] bottom-6 right-4 transition-all duration-300">
      <button
        onClick={toggleChat}
        className={`touch-target w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center transition-all duration-300 hover:bg-primary/90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isOpen ? 'rotate-45 bg-destructive' : ''}`}
        aria-label={isOpen ? t('chat.close') : t('chat.open')}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 max-w-[calc(100vw-1rem)] h-[500px] max-h-[70vh] min-h-[300px] bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/70 overflow-hidden flex flex-col animate-slide-up">
          <div className="bg-primary/90 backdrop-blur-md text-primary-foreground px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t('chat.drawerTitle')}</h3>
                <p className="text-xs opacity-80">{t('chat.subtitle')}</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="touch-target p-1 rounded-lg hover:bg-primary-foreground/20 transition-colors"
              aria-label={t('chat.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100% - 140px)' }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-2xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-secondary text-secondary-foreground rounded-tl-sm'
                  } ${msg.error ? 'bg-destructive/10 text-destructive border border-destructive/20' : ''}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <div className={`flex items-end gap-1 mt-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <time className="text-xs text-muted-foreground">
                      {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-2.5 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
              <div className="flex items-center justify-between text-sm text-destructive">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-destructive hover:underline">{t('common.dismiss')}</button>
              </div>
            </div>
          )}

          <div className="p-4 border-t border-border bg-card">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage() }} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chat.placeholder')}
                className="flex-1 px-4 py-3 border border-border rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-background"
                disabled={loading}
                aria-label={t('chat.placeholder')}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="touch-target w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 active:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={t('chat.send')}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {t('chat.poweredBy')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}