/**
 * Theme Context for Ukho Network
 * Manages light/dark theme state and provides theme values to components
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  const [isLightMode, setIsLightMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setIsLightMode(savedTheme === 'light');
        } else {
          // Default to light mode (as per web app)
          setIsLightMode(true);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        setIsLightMode(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(THEME_STORAGE_KEY, isLightMode ? 'light' : 'dark').catch(
        (error) => console.error('Error saving theme:', error)
      );
    }
  }, [isLightMode, isLoading]);

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

  // Don't render children until theme is loaded
  if (isLoading) {
    return null;
  }

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

