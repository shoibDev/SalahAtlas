# WebSocket Connection Optimization

## Issue

The application was experiencing redundant WebSocket connection attempts. Specifically, when a user opened the JummahDetail page and then navigated to the JummahChat screen, the application would attempt to establish a new WebSocket connection each time, even though only one connection is needed.

## Solution

The solution was to centralize the WebSocket connection management and ensure that only one connection is established for the entire application. This was achieved by:

1. Removing the connection logic from the `useJummahChat` hook
2. Relying on the connection established by the `AuthWithWebSocketHandler` in the protected layout

## Changes Made

1. **Modified useJummahChat.ts**:
   - Removed the code that was establishing its own WebSocket connection
   - Added comments to clarify that the connection is established by the AuthWithWebSocketHandler

2. **Updated ChatContext.tsx and JummahChat.tsx**:
   - Added comments to clarify that they're using the existing WebSocket connection
   - No functional changes were needed as they were already using the hook correctly

## How It Works

1. When a user logs in, the `AuthWithWebSocketHandler` in the protected layout establishes a single WebSocket connection
2. This connection is stored in the `WebSocketContext` and made available to all components
3. The `useJummahChat` hook no longer attempts to establish its own connection, but instead uses the existing one
4. Components like `ChatContext` and `JummahChat` use the `useJummahChat` hook to subscribe to topics and send messages

## Benefits

- Reduced redundant connection attempts
- Improved performance by eliminating unnecessary WebSocket connections
- Clearer code organization with a single point of connection management
- Better user experience with fewer connection-related logs and potential issues