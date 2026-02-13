/**
 * Themed Card component with shadow and padding
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import { ThemedView } from './ThemedView';
import { useTheme } from '@/src/theme';

interface ThemedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export function ThemedCard({ children, style }: ThemedCardProps) {
  const { spacing } = useTheme();

  return (
    <ThemedView variant="card" style={[{ padding: spacing.md }, style]}>
      {children}
    </ThemedView>
  );
}
