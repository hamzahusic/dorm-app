/**
 * Create Meal Modal - Form to create a new meal
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { ThemedButton } from '@/src/components/themed/ThemedButton';
import { Header } from '@/src/components/common/Header';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { format, addDays } from 'date-fns';

export default function CreateMealModal() {
  const { spacing, colors } = useTheme();
  const { createMeal, currentUser } = useStore();

  const [mealName, setMealName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);

  // Generate next 7 days for date selection
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(date, 'EEEE, MMM d'),
    };
  });

  const handleSubmit = () => {
    if (!mealName.trim()) {
      return;
    }

    setLoading(true);

    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Create meal
    setTimeout(() => {
      createMeal({
        date: selectedDate,
        mealName: mealName.trim(),
        description: description.trim() || null,
        createdBy: currentUser.id,
      });

      setLoading(false);
      router.back();
    }, 300);
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Create New Meal" showBack />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <ThemedCard>
          <View style={{ marginBottom: spacing.lg }}>
            <ThemedText variant="body" weight="semibold" style={{ marginBottom: spacing.sm }}>
              Meal Name *
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                  borderRadius: 8,
                  padding: spacing.md,
                  fontSize: 16,
                },
              ]}
              placeholder="e.g., Grilled Chicken & Rice"
              placeholderTextColor={colors.textSecondary}
              value={mealName}
              onChangeText={setMealName}
            />
          </View>

          <View style={{ marginBottom: spacing.lg }}>
            <ThemedText variant="body" weight="semibold" style={{ marginBottom: spacing.sm }}>
              Description (Optional)
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                  borderRadius: 8,
                  padding: spacing.md,
                  fontSize: 16,
                  minHeight: 100,
                },
              ]}
              placeholder="e.g., Herb-seasoned grilled chicken with steamed vegetables and jasmine rice"
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={{ marginBottom: spacing.lg }}>
            <ThemedText variant="body" weight="semibold" style={{ marginBottom: spacing.sm }}>
              Date *
            </ThemedText>
            <View style={{ gap: spacing.sm }}>
              {dateOptions.map(option => (
                <ThemedCard
                  key={option.value}
                  style={[
                    {
                      backgroundColor: selectedDate === option.value ? `${colors.primary}15` : colors.surface,
                      borderWidth: 2,
                      borderColor: selectedDate === option.value ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <View
                    style={styles.dateOption}
                    onTouchEnd={() => setSelectedDate(option.value)}
                  >
                    <ThemedText variant="body" weight="semibold">
                      {option.label}
                    </ThemedText>
                    {selectedDate === option.value && (
                      <ThemedText variant="caption" color="primary">
                        Selected
                      </ThemedText>
                    )}
                  </View>
                </ThemedCard>
              ))}
            </View>
          </View>

          <View style={{ gap: spacing.md }}>
            <ThemedButton
              variant="primary"
              onPress={handleSubmit}
              disabled={!mealName.trim() || loading}
              loading={loading}
            >
              Create Meal
            </ThemedButton>
            <ThemedButton
              variant="outline"
              onPress={() => router.back()}
              disabled={loading}
            >
              Cancel
            </ThemedButton>
          </View>
        </ThemedCard>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
  },
  textArea: {
    textAlignVertical: 'top',
  },
  dateOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
