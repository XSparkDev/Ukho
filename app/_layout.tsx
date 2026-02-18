import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider as UkhoThemeProvider, useTheme } from '@/constants/Theme';
import { ROUTES } from '@/constants/routes';
import { BlockedUsersProvider } from '@/context/BlockedUsersContext';
import { ensureDefaultRoles } from '@/services/roleFirestoreService';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootStack() {
  const { isLightMode } = useTheme();
  const navTheme = isLightMode ? DefaultTheme : DarkTheme;

  return (
    <NavigationThemeProvider value={navTheme}>
      <Stack initialRouteName={ROUTES.AUTH}>
        <Stack.Screen name={ROUTES.AUTH} options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="requests" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="account" options={{ headerShown: false }} />
        <Stack.Screen name="preferences" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="privacy" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ headerShown: false }} />
        <Stack.Screen name="settings-search" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="blocked" options={{ headerShown: false }} />
        <Stack.Screen name={ROUTES.MODAL} options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={isLightMode ? 'dark' : 'light'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    ensureDefaultRoles().catch((e) => console.warn('Roles seed failed:', e));
  }, []);

  return (
    <SafeAreaProvider>
      <UkhoThemeProvider>
        <BlockedUsersProvider>
          <RootStack />
        </BlockedUsersProvider>
      </UkhoThemeProvider>
    </SafeAreaProvider>
  );
}
