/**
 * Edit Meal Modal - Form to edit an existing meal
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Platform, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { ThemedButton } from '@/src/components/themed/ThemedButton';
import { Header } from '@/src/components/common/Header';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, parseISO } from 'date-fns';

export default function EditMealModal() {
  const { spacing, colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { updateMeal, getMealById } = useStore();

  const meal = getMealById(id || '');

  const [mealName, setMealName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dateConfirmed, setDateConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pre-populate form with existing meal data
  useEffect(() => {
    if (meal) {
      setMealName(meal.mealName);
      setDescription(meal.description || '');
      setSelectedDate(meal.date);
      setDateConfirmed(true);
    }
  }, [meal]);

  // Generate next 7 days for date selection
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(date, 'EEEE, MMM d'),
    };
  });

  const handleSubmit = () => {
    if (!mealName.trim() || !selectedDate || !meal) {
      return;
    }

    setLoading(true);

    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Update meal
    setTimeout(() => {
      updateMeal(meal.id, {
        mealName: mealName.trim(),
        description: description.trim() || null,
        date: selectedDate,
      });

      setLoading(false);
      Alert.alert('Success', 'Meal updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }, 300);
  };

  if (!meal) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Edit Meal" showBack />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.md }}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <ThemedText variant="subheading" weight="semibold" style={{ marginTop: spacing.md }}>
            Meal Not Found
          </ThemedText>
          <ThemedText variant="caption" color="textSecondary" style={{ marginTop: spacing.xs, textAlign: 'center' }}>
            The meal you're trying to edit could not be found.
          </ThemedText>
          <ThemedButton
            variant="outline"
            onPress={() => router.back()}
            style={{ marginTop: spacing.lg }}
          >
            Go Back
          </ThemedButton>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title="Edit Meal" showBack />
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
              <ThemedText variant="body" weight="semibold">
                Date *
              </ThemedText>
              {dateConfirmed && (
                <TouchableOpacity
                  onPress={() => {
                    setDateConfirmed(false);
                    setSelectedDate('');
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.xs,
                    paddingVertical: spacing.xs,
                    paddingHorizontal: spacing.sm,
                    borderRadius: 6,
                    backgroundColor: `${colors.error}15`,
                  }}
                >
                  <Ionicons name="close-circle" size={16} color={colors.error} />
                  <ThemedText variant="caption" weight="semibold" color="error">
                    Change
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ gap: spacing.sm }}>
              {dateConfirmed ? (
                // Show only selected date when confirmed
                <ThemedCard
                  style={[
                    {
                      backgroundColor: `${colors.primary}15`,
                      borderWidth: 2,
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  <View style={styles.dateOption}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                      <ThemedText variant="body" weight="semibold">
                        {dateOptions.find(opt => opt.value === selectedDate)?.label || format(parseISO(selectedDate), 'EEEE, MMM d')}
                      </ThemedText>
                    </View>
                    <ThemedText variant="caption" color="primary" weight="semibold">
                      Selected
                    </ThemedText>
                  </View>
                </ThemedCard>
              ) : (
                // Show all date options
                dateOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      setSelectedDate(option.value);
                      setDateConfirmed(true);
                      if (Platform.OS !== 'web') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <ThemedCard
                      style={[
                        {
                          backgroundColor: colors.surface,
                          borderWidth: 1,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <View style={styles.dateOption}>
                        <ThemedText variant="body" weight="regular">
                          {option.label}
                        </ThemedText>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                      </View>
                    </ThemedCard>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>

          <View style={{ gap: spacing.md }}>
            <ThemedButton
              variant="primary"
              onPress={handleSubmit}
              disabled={!mealName.trim() || !selectedDate || loading}
              loading={loading}
            >
              Save Changes
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
