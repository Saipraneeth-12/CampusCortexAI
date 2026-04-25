import { createContext, useContext, useState, type ReactNode } from "react";

interface ChatMessage {
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

export function ChatHistoryProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatHistoryContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatHistoryContext.Provider>
  );
}

export const useChatHistory = () => useContext(ChatHistoryContext);
