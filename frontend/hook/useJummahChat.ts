import { useEffect, useState } from 'react';
import { ChatMessage, ChatTextMessage } from '@/types/chat';
import { useWebSocket } from '@/context/WebSocketContext';
import { API_END_POINTS } from '@/constants/apiEndPoints';

/**
 * Interface for useJummahChat hook parameters
 */
interface UseJummahChatParams {
  visible: boolean;
  token: string;
  jummahId: string;
  username: string;
  onMessage: (msg: ChatMessage) => void;
}

/**
 * Hook for managing Jummah chat WebSocket connection
 * @param params - Parameters for the hook
 * @returns Object containing connection status and send function
 */
export function useJummahChat({
  visible,
  token,
  jummahId,
  username,
  onMessage,
}: UseJummahChatParams) {
  const { client, isConnected, connect, disconnect } = useWebSocket();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // We don't connect to WebSocket here anymore
  // The connection is established by the AuthWithWebSocketHandler in the protected layout
  // This prevents redundant connection attempts

  // Subscribe to Jummah topic when connected
  useEffect(() => {
    if (!isConnected || !client || !jummahId) {
      setIsSubscribed(false);
      return;
    }

    const topicEndpoint = API_END_POINTS.WS_JUMMAH_TOPIC.replace(':jummahId', jummahId);

    const subscription = client.subscribe(topicEndpoint, (message) => {
      try {
        const parsed: ChatMessage = JSON.parse(message.body);
        onMessage(parsed);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    setIsSubscribed(true);

    return () => {
      subscription.unsubscribe();
      setIsSubscribed(false);
    };
  }, [isConnected, client, jummahId, onMessage]);

  /**
   * Send a message to the Jummah chat
   * @param message - The message text to send
   */
  const send = (message: string) => {
    if (!isConnected || !client || !isSubscribed) {
      console.warn('⚠️ Cannot send — WebSocket is not connected or subscribed');
      return;
    }

    const sendEndpoint = API_END_POINTS.WS_JUMMAH_SEND.replace(':jummahId', jummahId);

    const payload: ChatTextMessage = {
      type: 'CHAT',
      sender: username,
      message,
      timestamp: new Date().toISOString(),
    };

    client.publish({
      destination: sendEndpoint,
      body: JSON.stringify(payload),
    });
  };

  return { 
    isConnected: isConnected && isSubscribed, 
    send 
  };
}
