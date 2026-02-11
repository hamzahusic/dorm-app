/**
 * Registration Button - Register or opt-out of a meal
 */

import React, { useState } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedButton } from '../themed/ThemedButton';
import { useStore } from '@/src/store';
import { isPast, isToday } from '@/src/utils/dateHelpers';

interface RegistrationButtonProps {
  mealId: string;
  mealDate: string;
}

export function RegistrationButton({ mealId, mealDate }: RegistrationButtonProps) {
  const [loading, setLoading] = useState(false);
  const { currentUser, isUserRegisteredForMeal, registerForMeal, optOutOfMeal } = useStore();

  const isRegistered = isUserRegisteredForMeal(currentUser.id, mealId);
  const isMealPast = isPast(mealDate);
  const isMealToday = isToday(mealDate);

  const handlePress = () => {
    setLoading(true);

    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Simulate async operation
    setTimeout(() => {
      if (isRegistered) {
        optOutOfMeal(mealId);
      } else {
        registerForMeal(mealId);
      }
      setLoading(false);
    }, 300);
  };

  if (isMealPast && !isMealToday) {
    return null; // Don't show button for past meals
  }

  return (
    <ThemedButton
      variant={isRegistered ? 'outline' : 'primary'}
      size="md"
      onPress={handlePress}
      loading={loading}
      disabled={loading}
    >
      {isRegistered ? 'Opt Out' : 'Register'}
    </ThemedButton>
  );
}
