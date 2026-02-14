import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { useTheme } from '@/src/theme';

interface Tab {
  key: string;
  label: string;
}

interface TabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function TabSwitcher({ tabs, activeTab, onTabChange }: TabSwitcherProps) {
  const { spacing, colors } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.md, backgroundColor: colors.surface }]}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === tab.key ? colors.primary : 'transparent',
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: 8,
            },
          ]}
          onPress={() => onTabChange(tab.key)}
          activeOpacity={0.7}
        >
          <ThemedText
            weight="semibold"
            style={{ color: activeTab === tab.key ? '#FFFFFF' : colors.text }}
          >
            {tab.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
});
