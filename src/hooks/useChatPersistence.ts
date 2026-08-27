import { useEffect, useState, useCallback } from "react";
import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { ChatMessage } from "@/services/chat/groqTypes";

interface ChatDBSchema extends DBSchema {
  conversations: {
    key: string;
    value: {
      uid: string;
      messages: ChatMessage[];
      updatedAt: number;
      version: number;
    };
    indexes: { "by-updatedAt": number };
  };
}

const DB_NAME = "scheme-sathi-chat";
const DB_VERSION = 1;
const MAX_MESSAGES = 100;

let dbPromise: Promise<IDBPDatabase<ChatDBSchema>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ChatDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore("conversations", { keyPath: "uid" });
        store.createIndex("by-updatedAt", "updatedAt");
      },
    });
  }
  return dbPromise;
}

export function useChatPersistence(uid: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadMessages = useCallback(async () => {
    if (!uid) {
      setMessages([]);
      setIsLoaded(true);
      return;
    }

    try {
      const db = await getDB();
      const data = await db.get("conversations", uid);
      if (data?.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setMessages([]);
    } finally {
      setIsLoaded(true);
    }
  }, [uid]);

  const saveMessages = useCallback(
    async (newMessages: ChatMessage[]) => {
      if (!uid) return;

      try {
        const db = await getDB();
        const trimmed = newMessages.slice(-MAX_MESSAGES);
        await db.put("conversations", {
          uid,
          messages: trimmed,
          updatedAt: Date.now(),
          version: DB_VERSION,
        });
      } catch (error) {
        console.error("Failed to save chat history:", error);
      }
    },
    [uid]
  );

  const clearMessages = useCallback(async () => {
    if (!uid) return;

    try {
      const db = await getDB();
      await db.delete("conversations", uid);
      setMessages([]);
    } catch (error) {
      console.error("Failed to clear chat history:", error);
    }
  }, [uid]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    setMessages,
    saveMessages,
    clearMessages,
    isLoaded,
  };
}