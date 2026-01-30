/**
 * Ukho Network Color System
 * Matches the web application's CSS variables exactly
 */

export const Colors = {
  light: {
    bgColor: '#fcfaf8',
    panelBg: 'rgba(255, 255, 255, 0.85)',
    textMain: '#1e1b1a',
    textDim: '#64748b',
    borderColor: 'rgba(0, 0, 0, 0.08)',
    cardShadow: 'rgba(0, 0, 0, 0.05)',
    icon: '#64748b',
  },
  dark: {
    bgColor: '#120b08',
    panelBg: 'rgba(35, 25, 20, 0.75)',
    textMain: '#f7f3f1',
    textDim: '#94a3b8',
    borderColor: 'rgba(245, 158, 11, 0.15)',
    cardShadow: 'rgba(0, 0, 0, 0.5)',
    icon: '#94a3b8',
  },
};

// Brand Colors (same in both themes)
export const BrandColors = {
  orange500: '#f97316',
  purple500: '#a855f7',
  emerald500: '#10b981',
  red500: '#ef4444',
  amber500: '#f59e0b',
  orange600: '#d97706',
};

// Ukho Gradient Colors
export const UkhoGradient = {
  start: '#f97316', // orange-500
  end: '#a855f7',   // purple-500
};

// Ukho Glow Shadow
export const UkhoGlow = {
  shadowColor: '#f97316',
  shadowOpacity: 0.2,
  shadowRadius: 25,
  shadowOffset: { width: 0, height: 0 },
  elevation: 8, // Android
};

