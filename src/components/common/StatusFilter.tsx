import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { useTheme } from '@/src/theme';

interface FilterOption {
  key: string;
  label: string;
  color: string;
  count: number;
}

interface StatusFilterProps {
  options: FilterOption[];
  activeFilter: string;
  onFilterChange: (key: string) => void;
}

export function StatusFilter({ options, activeFilter, onFilterChange }: StatusFilterProps) {
  const { spacing, colors } = useTheme();

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.button,
            {
              backgroundColor: activeFilter === option.key ? option.color : colors.surface,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: 8,
              flex: 1,
              marginLeft: index > 0 ? spacing.sm : 0,
            },
          ]}
          onPress={() => onFilterChange(option.key)}
          activeOpacity={0.7}
        >
          <ThemedText
            variant="caption"
            weight="semibold"
            style={{
              color: activeFilter === option.key ? '#FFFFFF' : colors.text,
              textAlign: 'center',
            }}
          >
            {option.label} ({option.count})
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
  },
});
