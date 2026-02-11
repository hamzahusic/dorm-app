/**
 * Meal Card - displays meal information with action buttons
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../themed/ThemedCard';
import { ThemedText } from '../themed/ThemedText';
import { MealStatus } from './MealStatus';
import { RegistrationButton } from '../registration/RegistrationButton';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { getDayLabel } from '@/src/utils/dateHelpers';
import type { Meal } from '@/src/types';

interface MealCardProps {
  meal: Meal;
  showActions?: boolean;
  onPress?: () => void;
}

export function MealCard({ meal, showActions = true, onPress }: MealCardProps) {
  const { spacing, colors } = useTheme();
  const { currentUser, isUserRegisteredForMeal, registrations } = useStore();

  const isRegistered = isUserRegisteredForMeal(currentUser.id, meal.id);
  const registration = registrations.find(r => r.userId === currentUser.id && r.mealId === meal.id);
  const isCollected = registration?.collected || false;

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper onPress={onPress} activeOpacity={0.7} style={{ marginBottom: spacing.md }}>
      <ThemedCard>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <ThemedText variant="caption" color="textSecondary">
              {getDayLabel(meal.date)}
            </ThemedText>
            <ThemedText variant="subheading" weight="semibold" style={{ marginTop: spacing.xs }}>
              {meal.mealName}
            </ThemedText>
          </View>
          <MealStatus mealDate={meal.date} isRegistered={isRegistered} isCollected={isCollected} />
        </View>

        {meal.description && (
          <ThemedText
            color="textSecondary"
            variant="caption"
            style={{ marginTop: spacing.sm }}
            numberOfLines={2}
          >
            {meal.description}
          </ThemedText>
        )}

        {showActions && currentUser.role === 'student' && (
          <View style={{ marginTop: spacing.md }}>
            <RegistrationButton mealId={meal.id} mealDate={meal.date} />
          </View>
        )}

        {onPress && (
          <View style={[styles.viewDetails, { marginTop: spacing.md }]}>
            <ThemedText variant="caption" color="primary" weight="semibold">
              View Details
            </ThemedText>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </View>
        )}
      </ThemedCard>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  viewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
