import React, { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WS_BASE_URL } from '@/constants/apiEndPoints';

/**
 * Interface for WebSocket context
 */
interface WebSocketContextType {
  client: Client | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
}

/**
 * Interface for WebSocket provider props
 */
interface WebSocketProviderProps {
  children: ReactNode;
}

// Create context with default values
const WebSocketContext = createContext<WebSocketContextType>({
  client: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
});

/**
 * WebSocket provider component
 */
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  /**
   * Connect to WebSocket server
   * @param token - Authentication token
   */
  const connect = (token: string) => {
    if (clientRef.current?.connected) {
      console.log('WebSocket already connected, skipping connection');
      return; // Already connected
    }

    try {
      console.log('Connecting to WebSocket...');
      const socket = new SockJS(WS_BASE_URL);
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          setIsConnected(true);
          console.log('✅ WebSocket connected successfully');
        },
        onDisconnect: () => {
          setIsConnected(false);
          console.log('WebSocket disconnected');
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
        },
        onWebSocketError: (event) => {
          console.error('WebSocket error:', event);
          // Attempt to reconnect after a delay
          setTimeout(() => {
            if (clientRef.current) {
              console.log('Attempting to reconnect WebSocket...');
              clientRef.current.activate();
            }
          }, 5000);
        },
      });

      client.activate();
      clientRef.current = client;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    }
  };

  /**
   * Disconnect from WebSocket server
   */
  const disconnect = () => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
      setIsConnected(false);
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        client: clientRef.current,
        isConnected,
        connect,
        disconnect,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

/**
 * Hook to use WebSocket context
 * @returns WebSocket context
 */
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
