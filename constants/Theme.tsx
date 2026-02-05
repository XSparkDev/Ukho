/**
 * Theme Context for Ukho Network
 * Manages light/dark theme state and provides theme values to components
 */

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, BrandColors } from './Colors';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  isLightMode: boolean;
  theme: typeof Colors.light;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@ukho_theme_mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useSystemColorScheme();
  // Start with default theme to prevent null render - will update when storage loads
  const [isLightMode, setIsLightMode] = useState<boolean>(true);
  const hasLoadedRef = useRef<boolean>(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setIsLightMode(savedTheme === 'light');
        }
        // If no saved theme, keep default (light mode)
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        hasLoadedRef.current = true;
      }
    };

    loadTheme();
  }, []);

  // Save theme preference when it changes (but not during initial load)
  useEffect(() => {
    if (hasLoadedRef.current) {
      AsyncStorage.setItem(THEME_STORAGE_KEY, isLightMode ? 'light' : 'dark').catch(
        (error) => console.error('Error saving theme:', error)
      );
    }
  }, [isLightMode]);

  const toggleTheme = () => {
    setIsLightMode((prev) => !prev);
  };

  const setTheme = (mode: ThemeMode) => {
    setIsLightMode(mode === 'light');
  };

  const theme = isLightMode ? Colors.light : Colors.dark;

  const value: ThemeContextType = {
    isLightMode,
    theme,
    toggleTheme,
    setTheme,
  };

  // Always render provider, but use default theme while loading
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export theme colors for direct access
export { BrandColors };

