/**
 * Meal List - FlatList wrapper for meals with empty state
 */

import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { MealCard } from './MealCard';
import { EmptyState } from '../common/EmptyState';
import { useTheme } from '@/src/theme';
import type { Meal } from '@/src/types';

interface MealListProps {
  meals: Meal[];
  showActions?: boolean;
  onMealPress?: (meal: Meal) => void;
  emptyTitle?: string;
  emptyMessage?: string;
}

export function MealList({
  meals,
  showActions = true,
  onMealPress,
  emptyTitle = 'No Meals',
  emptyMessage = 'There are no meals to display.',
}: MealListProps) {
  const { spacing } = useTheme();

  if (meals.length === 0) {
    return (
      <EmptyState
        icon="restaurant-outline"
        title={emptyTitle}
        message={emptyMessage}
      />
    );
  }

  return (
    <FlatList
      data={meals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MealCard
          meal={item}
          showActions={showActions}
          onPress={onMealPress ? () => onMealPress(item) : undefined}
        />
      )}
      contentContainerStyle={{ padding: spacing.md }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({});
