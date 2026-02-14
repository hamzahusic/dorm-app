import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { useTheme } from '@/src/theme';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  color: 'primary' | 'success' | 'warning' | 'error';
  variant?: 'compact' | 'wide';
  borderLeftColor?: string;
}

export function StatCard({ icon, value, label, color, variant = 'compact', borderLeftColor }: StatCardProps) {
  const { spacing, colors } = useTheme();
  const colorValue = colors[color];

  if (variant === 'wide') {
    return (
      <ThemedCard style={{ padding: spacing.lg, ...(borderLeftColor ? { borderLeftWidth: 4, borderLeftColor } : {}) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs }}>
              <Ionicons name={icon} size={20} color={colorValue} />
              <ThemedText variant="body" weight="semibold" style={{ fontSize: 18 }}>
                {label}
              </ThemedText>
            </View>
          </View>
          <View style={[styles.wideBadge, { backgroundColor: `${colorValue}20` }]}>
            <ThemedText
              weight="bold"
              color={color}
              style={{ fontSize: 40 }}
              adjustsFontSizeToFit
              numberOfLines={1}
              minimumFontScale={0.5}
            >
              {value}
            </ThemedText>
          </View>
        </View>
      </ThemedCard>
    );
  }

  return (
    <ThemedCard style={{ flex: 1, minWidth: '47%' as any, padding: spacing.md, ...(borderLeftColor ? { borderLeftWidth: 4, borderLeftColor } : {}) }}>
      <View style={{ alignItems: 'center' }}>
        <View style={[styles.compactIcon, { backgroundColor: `${colorValue}15` }]}>
          <Ionicons name={icon} size={24} color={colorValue} />
        </View>
        <ThemedText
          weight="bold"
          color={color}
          style={{ fontSize: 32, marginTop: spacing.sm }}
          adjustsFontSizeToFit
          numberOfLines={1}
          minimumFontScale={0.5}
        >
          {value}
        </ThemedText>
        <ThemedText variant="caption" weight="semibold" style={{ marginTop: spacing.xs, textAlign: 'center' }}>
          {label}
        </ThemedText>
      </View>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  wideBadge: {
    minWidth: 80,
    maxWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  compactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
