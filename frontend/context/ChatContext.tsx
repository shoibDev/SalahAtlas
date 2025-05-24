// src/context/ChatContext.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { useChatHistory } from '@/hook/useChatHistory';
import { ChatMessage } from '@/types/chat';

interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  loadMore: () => void;
  hasMore: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({
                               jummahId,
                               children,
                             }: {
  jummahId: string;
  children: ReactNode;
}) => {
  const {
    messages,
    setMessages,
    loadMore,
    hasMore,
  } = useChatHistory(jummahId);

  return (
      <ChatContext.Provider
          value={{ messages, setMessages, loadMore, hasMore }}
      >
        {children}
      </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within <ChatProvider>');
  return ctx;
};
