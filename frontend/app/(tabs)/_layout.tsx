import React from 'react';
import { Tabs } from 'expo-router';
import CustomNavBar from "@/components/CustomNavBar";

export default function _layout() {
  return (
    <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={props => <CustomNavBar {...props}/>}
    >
      <Tabs.Screen name={"compass"} options={{ title: 'Compass' }} />
      <Tabs.Screen name={"dashboard"} options={{ title: 'Dashboard' }} />
      <Tabs.Screen name={"settings"} options={{ title: 'Settings'}} />
    </Tabs>
  );
}