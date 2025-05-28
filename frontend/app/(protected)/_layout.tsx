import { Redirect, Stack } from "expo-router"
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { WebSocketProvider } from "@/context/WebSocketContext";
import { useAuthWithWebSocket } from "@/hook/useAuthWithWebSocket";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

/**
 * Component that uses the combined auth and websocket hook
 */
function AuthWithWebSocketHandler() {
  // This hook automatically connects to WebSocket when authenticated
  // and provides an enhanced logOut function that disconnects WebSocket
  useAuthWithWebSocket();
  return null;
}

export default function ProtectedLayout() {
  const authState = useContext(AuthContext);

  if(!authState.isLoggedIn) {
    return <Redirect href={"/login"} />
  }

  return (
    <WebSocketProvider>
      <AuthWithWebSocketHandler />
      <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#0D2B35' },
            headerTintColor: '#F3E9E2',
            headerTitleStyle: { fontWeight: '600' },
          }}
      >
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      </Stack>
    </WebSocketProvider>
  )
}
