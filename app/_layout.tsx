import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { ThemeProvider as UkhoThemeProvider, useTheme } from '@/constants/Theme';
import { ROUTES } from '@/constants/routes';

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
        <Stack.Screen name={ROUTES.MODAL} options={{ presentation: 'modal', title: 'Modal' }} />
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
