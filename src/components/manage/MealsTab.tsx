import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { ThemedButton } from '@/src/components/themed/ThemedButton';
import { Badge } from '@/src/components/common/Badge';
import { EmptyState } from '@/src/components/common/EmptyState';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';
import { getDayLabel, isPast } from '@/src/utils/dateHelpers';
import type { Meal } from '@/src/types';

interface MealsTabProps {
  canEditMeals: boolean;
}

export function MealsTab({ canEditMeals }: MealsTabProps) {
  const { spacing, colors } = useTheme();
  const { meals, getRegistrationStats, deleteMeal } = useStore();

  const upcomingMeals = meals.filter(m => !isPast(m.date));
  const pastMeals = meals.filter(m => isPast(m.date));

  const handleDeleteMeal = (meal: Meal) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteMeal(meal.id);
            Alert.alert('Success', 'Meal deleted successfully');
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md }}>
      <ThemedButton
        variant="primary"
        onPress={() => router.push('/modal/create-meal')}
        icon={<Ionicons name="add" size={20} color="#FFFFFF" />}
        style={{ marginBottom: spacing.lg }}
      >
        Create New Meal
      </ThemedButton>

      {/* Upcoming Meals */}
      <View style={{ marginBottom: spacing.xl }}>
        <ThemedText variant="subheading" weight="semibold" style={{ marginBottom: spacing.md }}>
          Upcoming Meals ({upcomingMeals.length})
        </ThemedText>
        {upcomingMeals.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="No Upcoming Meals"
            message="Create a new meal to get started."
          />
        ) : (
          upcomingMeals.map(meal => {
            const stats = getRegistrationStats(meal.id);
            return (
              <ThemedCard key={meal.id} style={{ marginBottom: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <ThemedText variant="caption" color="textSecondary">
                      {getDayLabel(meal.date)}
                    </ThemedText>
                    <ThemedText variant="subheading" weight="semibold" style={{ marginTop: spacing.xs }}>
                      {meal.mealName}
                    </ThemedText>
                    {meal.description && (
                      <ThemedText variant="caption" color="textSecondary" style={{ marginTop: spacing.xs }} numberOfLines={2}>
                        {meal.description}
                      </ThemedText>
                    )}
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <View style={{ alignItems: 'center' }}>
                    <ThemedText variant="subheading" weight="bold" color="primary">{stats.total}</ThemedText>
                    <ThemedText variant="caption" color="textSecondary">Registered</ThemedText>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <ThemedText variant="subheading" weight="bold" color="success">{stats.collected}</ThemedText>
                    <ThemedText variant="caption" color="textSecondary">Collected</ThemedText>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <ThemedText variant="subheading" weight="bold" color="warning">{stats.pending}</ThemedText>
                    <ThemedText variant="caption" color="textSecondary">Pending</ThemedText>
                  </View>
                </View>
                {canEditMeals && (
                  <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                    <ThemedButton
                      variant="outline"
                      size="sm"
                      onPress={() => router.push(`/modal/edit-meal?id=${meal.id}`)}
                      icon={<Ionicons name="pencil" size={16} color={colors.primary} />}
                    >
                      Edit
                    </ThemedButton>
                    <ThemedButton
                      variant="outline"
                      size="sm"
                      onPress={() => handleDeleteMeal(meal)}
                      icon={<Ionicons name="trash" size={16} color={colors.error} />}
                    >
                      Delete
                    </ThemedButton>
                  </View>
                )}
              </ThemedCard>
            );
          })
        )}
      </View>

      {/* Past Meals */}
      {pastMeals.length > 0 && (
        <View>
          <ThemedText variant="subheading" weight="semibold" style={{ marginBottom: spacing.md }}>
            Past Meals ({pastMeals.length})
          </ThemedText>
          {pastMeals.slice(0, 5).map(meal => {
            const stats = getRegistrationStats(meal.id);
            return (
              <ThemedCard key={meal.id} style={{ marginBottom: spacing.md }}>
                <View>
                  <ThemedText variant="caption" color="textSecondary">
                    {getDayLabel(meal.date)}
                  </ThemedText>
                  <ThemedText variant="body" weight="semibold" style={{ marginTop: spacing.xs }}>
                    {meal.mealName}
                  </ThemedText>
                  <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
                    <Badge label={`${stats.total} Registered`} variant="neutral" size="sm" />
                    <Badge label={`${stats.collected} Collected`} variant="success" size="sm" />
                  </View>
                </View>
              </ThemedCard>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
