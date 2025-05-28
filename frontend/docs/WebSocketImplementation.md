# WebSocket Implementation

This document explains how WebSockets are implemented in the application for real-time communication.

## Overview

The application uses WebSockets to provide real-time updates and chat functionality. WebSockets are automatically connected when the user logs in and disconnected when the user logs out.

## Implementation Details

### WebSocketContext

The `WebSocketContext` provides a central place to manage WebSocket connections. It includes:

- A `connect` method that establishes a connection to the WebSocket server using the user's authentication token
- A `disconnect` method that closes the connection
- State tracking for connection status
- Error handling and automatic reconnection logic

### useAuthWithWebSocket Hook

The `useAuthWithWebSocket` hook combines authentication and WebSocket functionality:

- Automatically connects to the WebSocket when the user is authenticated
- Provides an enhanced `logOut` function that disconnects the WebSocket before logging out
- Exposes the WebSocket connection status

### Protected Layout Integration

The protected layout uses the `AuthWithWebSocketHandler` component to automatically manage WebSocket connections:

```tsx
function AuthWithWebSocketHandler() {
  // This hook automatically connects to WebSocket when authenticated
  // and provides an enhanced logOut function that disconnects WebSocket
  useAuthWithWebSocket();
  return null;
}
```

This component is included in the layout to ensure that the WebSocket is properly connected and disconnected based on the user's authentication status.

## Usage in Components

Components that need to use WebSockets can use the `useWebSocket` hook to access the WebSocket client:

```tsx
import { useWebSocket } from '@/context/WebSocketContext';

function MyComponent() {
  const { client, isConnected } = useWebSocket();
  
  // Use the client to subscribe to topics or send messages
  
  return (
    // Component JSX
  );
}
```

For components that need to handle both authentication and WebSockets, the `useAuthWithWebSocket` hook can be used:

```tsx
import { useAuthWithWebSocket } from '@/hook/useAuthWithWebSocket';

function MyComponent() {
  const { isLoggedIn, token, logOut, isWebSocketConnected } = useAuthWithWebSocket();
  
  // Use the authentication and WebSocket functionality
  
  return (
    // Component JSX
  );
}
```

## Error Handling

The WebSocket implementation includes error handling and automatic reconnection logic:

- If the connection is lost, the client will attempt to reconnect automatically
- Connection errors are logged to the console
- The connection status is tracked and exposed through the `isConnected` property