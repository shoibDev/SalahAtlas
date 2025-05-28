import React from 'react';
import { Tabs } from 'expo-router';
import CustomNavBar from "@/components/CustomNavBar";

export default function TabsLayout() {
  return (
    <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={props => <CustomNavBar {...props}/>}
    >
      <Tabs.Screen name={"compass"} options={{ title: 'Compass' }} />
      <Tabs.Screen name={"index"} options={{ title: 'index' }} />
      <Tabs.Screen name={"settings"} options={{ title: 'Settings', href: null}} />
    </Tabs>
  );
}