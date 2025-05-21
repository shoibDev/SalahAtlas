import {Stack} from "expo-router";
import React from "react";
import {AuthProvider} from "@/context/authContext";

export default function RootLayout() {
  return (
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
  )
}