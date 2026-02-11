/**
 * Empty State component for empty lists
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../themed/ThemedText';
import { ThemedButton } from '../themed/ThemedButton';
import { useTheme } from '@/src/theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = 'folder-open-outline', title, message, actionLabel, onAction }: EmptyStateProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <Ionicons name={icon} size={64} color={colors.textSecondary} />
      <ThemedText variant="subheading" weight="semibold" style={{ marginTop: spacing.md, textAlign: 'center' }}>
        {title}
      </ThemedText>
      <ThemedText color="textSecondary" style={{ marginTop: spacing.sm, textAlign: 'center' }}>
        {message}
      </ThemedText>
      {actionLabel && onAction && (
        <ThemedButton
          variant="primary"
          onPress={onAction}
          style={{ marginTop: spacing.lg }}
        >
          {actionLabel}
        </ThemedButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
