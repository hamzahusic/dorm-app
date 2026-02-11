/**
 * Theme Provider with automatic dark mode support
 */

import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ColorScheme } from './colors';
import { spacing, Spacing } from './spacing';
import { fontSize, fontWeight, borderRadius, FontSize, FontWeight, BorderRadius } from './typography';

interface Theme {
  colors: ColorScheme;
  spacing: Spacing;
  fontSize: FontSize;
  fontWeight: FontWeight;
  borderRadius: BorderRadius;
  isDark: boolean;
}

const ThemeContext = createContext<Theme | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme: Theme = {
    colors: isDark ? darkColors : lightColors,
    spacing,
    fontSize,
    fontWeight,
    borderRadius,
    isDark,
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
