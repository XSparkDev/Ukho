/**
 * Common Styles and Design Tokens for Ukho Network
 * Matches web application styling exactly
 */

import { Platform, StyleSheet } from 'react-native';
import { Colors, UkhoGlow } from './Colors';

// Border Radius Values (matching Tailwind classes)
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,      // rounded-xl
  xl: 16,      // rounded-2xl
  '2xl': 24,   // rounded-3xl
  '2.5rem': 40, // rounded-[2.5rem]
  '3rem': 48,   // rounded-[3rem]
  full: 9999,   // rounded-full
};

// Spacing Scale (4px increments - matching Tailwind)
export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

// Typography
export const Typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  // Space Grotesk will be loaded via expo-font
  spaceGrotesk: 'SpaceGrotesk',
  
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '900' as const,
  },
  
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 0.3, // tracking-[0.3em] = 0.3 * 16 = 4.8px, approximated
  },
};

// Common Shadow Styles
export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 5, // Android
  },
  cardDark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 8, // Android
  },
  ukhoGlow: UkhoGlow,
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10, // Android
  },
};

// Card base styles (borderRadius, padding, border, shadow); theme colors applied at use site
export const CardStyles = {
  base: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[4],
    borderWidth: 1,
    ...Shadows.card,
  },
};

// Glass Panel Effect Styles
export const createGlassPanelStyle = (isLight: boolean) => ({
  backgroundColor: isLight ? Colors.light.panelBg : Colors.dark.panelBg,
  borderWidth: 1,
  borderColor: isLight ? Colors.light.borderColor : Colors.dark.borderColor,
  ...Shadows.card,
});

// Common Component Styles
export const CommonStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Text Styles
  textMain: {
    color: Colors.light.textMain,
  },
  textDim: {
    color: Colors.light.textDim,
  },
  textUppercase: {
    textTransform: 'uppercase' as const,
  },
  textItalic: {
    fontStyle: 'italic' as const,
  },
  
  // Button Styles
  buttonBase: {
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[6],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Input Styles
  inputBase: {
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.xl,
    fontSize: Typography.fontSize.base,
  },
});

// Helper function to create theme-aware styles
export const createThemedStyles = (isLight: boolean) => ({
  bgColor: isLight ? Colors.light.bgColor : Colors.dark.bgColor,
  panelBg: isLight ? Colors.light.panelBg : Colors.dark.panelBg,
  textMain: isLight ? Colors.light.textMain : Colors.dark.textMain,
  textDim: isLight ? Colors.light.textDim : Colors.dark.textDim,
  borderColor: isLight ? Colors.light.borderColor : Colors.dark.borderColor,
});

