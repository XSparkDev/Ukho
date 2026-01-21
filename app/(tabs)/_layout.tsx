import { Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { HapticTab } from '@/components/haptic-tab';
import { BrandColors } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: BrandColors.orange500,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Plaza',
          // Hearth/home to reflect gathering place
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="local-fire-department" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Contacts',
          // Community/kin grouping
          tabBarIcon: ({ color }) => <MaterialIcons name="groups" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="relations"
        options={{
          title: 'Connect',
          // Messaging / connection hub
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="chat-bubble-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null, // keep settings off the bottom tab bar
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          href: null, // Hide from bottom tab bar
        }}
      />
      <Tabs.Screen
        name="possible-kin"
        options={{
          href: null, // Hide from bottom tab bar
        }}
      />
    </Tabs>
  );
}
