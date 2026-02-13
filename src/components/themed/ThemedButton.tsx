/**
 * Themed Button component with variants and loading states
 */

import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme';
import { ThemedText } from './ThemedText';

interface ThemedButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: string;
  style?: ViewStyle;
}

export function ThemedButton({
  variant = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  loading = false,
  icon,
  children,
  style,
}: ThemedButtonProps) {
  const { colors, spacing, borderRadius } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
    };

    // Size
    switch (size) {
      case 'sm':
        baseStyle.paddingVertical = spacing.sm;
        baseStyle.paddingHorizontal = spacing.md;
        break;
      case 'lg':
        baseStyle.paddingVertical = spacing.lg;
        baseStyle.paddingHorizontal = spacing.xl;
        break;
      default:
        baseStyle.paddingVertical = spacing.md;
        baseStyle.paddingHorizontal = spacing.lg;
    }

    // Variant
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = disabled ? colors.disabled : colors.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = disabled ? colors.disabled : colors.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = disabled ? colors.disabled : colors.primary;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
    }

    return baseStyle;
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;

    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return colors.primary;
      default:
        return colors.text;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'caption' as const;
      case 'lg':
        return 'subheading' as const;
      default:
        return 'body' as const;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[getButtonStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <ThemedText
            variant={getTextSize()}
            weight="semibold"
            style={[
              { color: getTextColor() },
              icon && { marginLeft: spacing.sm },
            ]}
          >
            {children}
          </ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
}
