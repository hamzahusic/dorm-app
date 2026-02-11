/**
 * Badge component for status indicators
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from '../themed/ThemedText';
import { useTheme } from '@/src/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'neutral', size = 'md', style }: BadgeProps) {
  const { colors, spacing, borderRadius } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      default:
        return colors.surface;
    }
  };

  const getTextColor = () => {
    return variant === 'neutral' ? colors.text : '#FFFFFF';
  };

  const getPadding = () => {
    return size === 'sm'
      ? { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }
      : { paddingHorizontal: spacing.md, paddingVertical: spacing.sm };
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: borderRadius.sm,
          ...getPadding(),
        },
        style,
      ]}
    >
      <ThemedText
        variant={size === 'sm' ? 'caption' : 'body'}
        weight="semibold"
        style={{ color: getTextColor() }}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
});
