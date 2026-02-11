/**
 * Themed View component with automatic dark mode support
 */

import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'surface' | 'card';
  lightBackground?: string;
  darkBackground?: string;
}

export function ThemedView({
  variant = 'default',
  lightBackground,
  darkBackground,
  style,
  ...props
}: ThemedViewProps) {
  const { colors, isDark, borderRadius } = useTheme();

  const getBackgroundColor = () => {
    if (lightBackground && !isDark) return lightBackground;
    if (darkBackground && isDark) return darkBackground;

    switch (variant) {
      case 'surface':
        return colors.surface;
      case 'card':
        return colors.card;
      default:
        return colors.background;
    }
  };

  const variantStyles = variant === 'card' ? styles.card : undefined;

  return (
    <View
      style={[
        { backgroundColor: getBackgroundColor() },
        variantStyles,
        variant === 'card' && { borderRadius: borderRadius.md },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
