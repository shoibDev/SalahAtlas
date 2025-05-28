# WebSocket Connection Fix

## Issue
When leaving the chat screen, users were seeing a "no underlying chat connection" error message when they returned. This was because the WebSocket connection was being disconnected when navigating away from the chat screen.

## Solution
The issue was in the `useJummahChat` hook, which was disconnecting the WebSocket connection when the `visible` prop became false or when the component unmounted. This was causing the connection to be dropped when navigating away from the chat screen.

The solution was to modify the `useJummahChat` hook to maintain the WebSocket connection even when the `visible` prop becomes false. The connection is now only disconnected when the component is unmounted, which happens when the user logs out or the app is closed.

## Changes Made
1. Modified the `useJummahChat` hook to ignore the `visible` prop for connection management purposes
2. Removed the disconnect call in the cleanup function of the first useEffect
3. Updated the dependency array to remove `visible` and `disconnect`

## How It Works
The `useJummahChat` hook now connects to the WebSocket when the token is available, regardless of the `visible` prop. The connection is maintained even when the user navigates away from the chat screen, ensuring that when they return, the connection is still active.

The `ChatContext` already had the correct implementation, setting the `visible` prop to true and maintaining the connection as long as the context exists.

## Benefits
- Users no longer see the "no underlying chat connection" error message when returning to the chat screen
- The WebSocket connection is maintained, providing a better user experience
- Real-time updates continue to work even when navigating between screens
- Reduced connection overhead by not disconnecting and reconnecting unnecessarily