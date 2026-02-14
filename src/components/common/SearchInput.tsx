import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChangeText, placeholder = 'Search by name or email...' }: SearchInputProps) {
  const { spacing, colors } = useTheme();

  return (
    <View style={{ position: 'relative' }}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: colors.border,
            borderRadius: 8,
            padding: spacing.md,
            paddingLeft: 42,
            fontSize: 16,
            height: 48,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
      <Ionicons
        name="search"
        size={20}
        color={colors.textSecondary}
        style={{ position: 'absolute', left: 12, top: 14 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
  },
});
