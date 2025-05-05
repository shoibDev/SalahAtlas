import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: useClientOnlyValue(false, true),
          }}
      >
        {/* Compass tab (LEFT) */}
        <Tabs.Screen
            name="compass"
            options={{
              title: 'Compass',
              tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
            }}
        />

        {/* Dashboard tab (CENTER) */}
        <Tabs.Screen
            name="dashboard"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
              headerRight: () => (
                  <Link href="/modal" asChild>
                    <Pressable>
                      {({ pressed }) => (
                          <FontAwesome
                              name="info-circle"
                              size={25}
                              color={Colors[colorScheme ?? 'light'].text}
                              style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                          />
                      )}
                    </Pressable>
                  </Link>
              ),
            }}
        />

        {/* Settings tab (RIGHT) */}
        <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
            }}
        />
      </Tabs>
  );
}
