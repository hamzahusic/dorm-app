/**
 * Themed Text component with typography variants
 */

import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/src/theme';

interface ThemedTextProps extends TextProps {
  variant?: 'body' | 'heading' | 'subheading' | 'caption' | 'title';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'error' | 'warning' | 'success';
}

export function ThemedText({
  variant = 'body',
  weight = 'regular',
  color = 'text',
  style,
  ...props
}: ThemedTextProps) {
  const { colors, fontSize, fontWeight } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'title':
        return { fontSize: fontSize.xxxl, fontWeight: fontWeight.bold };
      case 'heading':
        return { fontSize: fontSize.xxl, fontWeight: fontWeight.semibold };
      case 'subheading':
        return { fontSize: fontSize.lg, fontWeight: fontWeight.medium };
      case 'caption':
        return { fontSize: fontSize.sm, fontWeight: fontWeight.regular };
      default:
        return { fontSize: fontSize.base, fontWeight: fontWeight.regular };
    }
  };

  const getWeightStyle = () => {
    return { fontWeight: fontWeight[weight] };
  };

  const getColorValue = () => {
    switch (color) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'textSecondary':
        return colors.textSecondary;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'success':
        return colors.success;
      default:
        return colors.text;
    }
  };

  return (
    <Text
      style={[
        styles.base,
        getVariantStyle(),
        getWeightStyle(),
        { color: getColorValue() },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
