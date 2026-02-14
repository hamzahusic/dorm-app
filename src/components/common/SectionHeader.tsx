import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { useTheme } from '@/src/theme';

interface SectionHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  iconColor?: string;
}

export function SectionHeader({ icon, title, iconColor }: SectionHeaderProps) {
  const { spacing, colors } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={24} color={iconColor || colors.text} />
      <ThemedText variant="subheading" weight="semibold" style={{ marginLeft: spacing.sm }}>
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
