import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Easing } from 'react-native';
import 'react-native-reanimated';

import { ThemeProvider as UkhoThemeProvider, useTheme } from '@/constants/Theme';
import { ScreenTransitionConfig } from '@/constants/Animations';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootStack() {
  const { isLightMode } = useTheme();
  const navTheme = isLightMode ? DefaultTheme : DarkTheme;

  // Custom screen transition animation (fade + vertical slide)
  // expo-router uses simplified animation types
  const screenOptions = {
    headerShown: false,
    animation: 'fade_from_bottom' as const, // Built-in expo-router animation with fade + slide
    animationDuration: ScreenTransitionConfig.duration,
  };

  return (
    <NavigationThemeProvider value={navTheme}>
      <Stack initialRouteName="auth" screenOptions={screenOptions}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={isLightMode ? 'dark' : 'light'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UkhoThemeProvider>
        <RootStack />
      </UkhoThemeProvider>
    </SafeAreaProvider>
  );
}
