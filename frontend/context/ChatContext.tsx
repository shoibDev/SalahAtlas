// src/context/ChatContext.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { useChatHistory } from '@/hook/useChatHistory';
import { ChatMessage } from '@/types/chat';
import { useJummahChat } from '@/hook/useJummahChat';
import { useAuth } from '@/context/authContext';

interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  loadMore: () => void;
  hasMore: boolean;
  isConnected: boolean;
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

  const { token } = useAuth();

  // Use the existing WebSocket connection and subscribe to the Jummah topic
  // The connection is established by the AuthWithWebSocketHandler in the protected layout
  const { isConnected } = useJummahChat({
    visible: true,
    jummahId,
    username: 'User', // This is just for receiving messages, not sending
    token: token || '',
    onMessage: (newMsg) => {
      setMessages((prev) => [newMsg, ...prev]);
    },
  });

  return (
      <ChatContext.Provider
          value={{ messages, setMessages, loadMore, hasMore, isConnected }}
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
