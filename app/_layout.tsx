import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider as UkhoThemeProvider, useTheme } from '@/constants/Theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootStack() {
  const { isLightMode } = useTheme();
  const navTheme = isLightMode ? DefaultTheme : DarkTheme;

  return (
    <NavigationThemeProvider value={navTheme}>
      <Stack initialRouteName="auth">
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
    <UkhoThemeProvider>
      <RootStack />
    </UkhoThemeProvider>
  );
}
