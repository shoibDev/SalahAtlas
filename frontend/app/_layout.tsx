import { Stack } from "expo-router";
import React from "react";
import * as Notifications from "expo-notifications";
import { AuthProvider } from "@/context/authContext";
import { ThemeProvider } from "@/context/ThemeContext"; // <-- ✅ import your theme context
import { NotificationProvider} from "@/context/NotificationContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Show the notification alert even when the app is in the foreground
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: false,
  }),
});

export default function RootLayout() {
  return (
      <NotificationProvider>
        <ThemeProvider>
          <AuthProvider>
            <Stack
                screenOptions={{
                  headerShown: false,
                }}
            >
              <Stack.Screen name="(protected)" />
              <Stack.Screen name="login" />
            </Stack>
          </AuthProvider>
        </ThemeProvider>
      </NotificationProvider>
  );
}
