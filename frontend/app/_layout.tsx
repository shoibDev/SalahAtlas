import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "@/context/authContext";
import { ThemeProvider } from "@/context/ThemeContext"; // <-- ✅ import your theme context

export default function RootLayout() {
  return (
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
  );
}
