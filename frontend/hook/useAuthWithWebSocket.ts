import { useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useWebSocket } from '@/context/WebSocketContext';

/**
 * Custom hook that combines auth and websocket functionality
 * Automatically connects to WebSocket when authenticated and
 * disconnects when logging out
 */
export function useAuthWithWebSocket() {
  const auth = useAuth();
  const { connect, disconnect, isConnected } = useWebSocket();

  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (auth.isLoggedIn && auth.token) {
      console.log('Auto-connecting WebSocket from useAuthWithWebSocket hook');
      connect(auth.token);
    }
  }, [auth.isLoggedIn, auth.token, connect]);

  // Enhanced logout function that also disconnects WebSocket
  const logOutWithDisconnect = async () => {
    console.log('Logging out and disconnecting WebSocket');
    disconnect();
    await auth.logOut();
  };

  return {
    ...auth,
    logOut: logOutWithDisconnect,
    isWebSocketConnected: isConnected,
  };
}