import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/constants/Theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * ScreenContainer Component
 * 
 * A reusable container component for React Native screens that:
 * - Wraps content with SafeAreaView for proper safe area handling
 * - Uses flexbox layout (flex: 1) instead of fixed dimensions
 * - Applies consistent styling based on CSS conversion
 * - Integrates with the app's theme system
 * 
 * CSS Properties Converted:
 * - border-color: rgb(229, 231, 235) → borderColor: '#e5e7eb'
 * - line-height: 24px → Not directly applicable to View, but can be used in Text components
 * - font-family: System fonts are used by default in React Native
 * - width/height: Converted to flex: 1 for responsive layout
 * 
 * CSS Properties NOT Converted (and why):
 * - border-bottom/left/right/top-width: 0px → No border needed (0 width)
 * - border-style: solid → Default in React Native
 * - box-sizing: border-box → Default behavior in React Native
 * - display: block → Not applicable (React Native uses View/Text components)
 * - font-feature-settings: normal → Not directly supported in React Native
 * - font-variation-settings: normal → Not directly supported in React Native
 * - tab-size: 4 → Not applicable (no tabs in React Native views)
 * - text-size-adjust: 100% → Not needed (React Native handles text scaling)
 * - view-transition-name: root → Not supported (web-only feature)
 * - -webkit-locale: "en" → Not applicable (handled by system)
 * - -webkit-tap-highlight-color: rgba(0, 0, 0, 0) → Not needed (React Native uses Pressable/TouchableOpacity)
 */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, style }) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgColor }]}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    // Border color from CSS: rgb(229, 231, 235) = #e5e7eb
    // Note: Border width is 0px in CSS, so no border is applied
    // Using flexbox instead of fixed width (430px) and height (2618.62px)
  },
});

