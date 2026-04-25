import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
  sources?: Array<{
    title: string;
    source: string;
    date: string;
    link: string;
    summary: string;
  }>;
}

interface ChatHistoryContextType {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType>({
  messages: [],
  addMessage: () => {},
  clearMessages: () => {},
});

const STORAGE_KEY = "campus-cortex-chat-history";

export function ChatHistoryProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setMessages(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
      setMounted(true);
    }
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error("Failed to save chat history:", e);
      }
    }
  }, [messages, mounted]);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <ChatHistoryContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatHistoryContext.Provider>
  );
}

export const useChatHistory = () => useContext(ChatHistoryContext);
