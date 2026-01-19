import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';

import { useTheme } from '@/constants/Theme';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Ukho Layout wrapper
 * Mirrors the web Layout.tsx:
 * - Background color from theme
 * - Centered max-width content
 * - Vertical padding
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgColor }]}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 16,
  },
});



