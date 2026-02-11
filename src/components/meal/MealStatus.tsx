/**
 * Meal Status Badge - shows registration and collection status
 */

import React from 'react';
import { Badge } from '../common/Badge';
import { isPast, isToday } from '@/src/utils/dateHelpers';

interface MealStatusProps {
  mealDate: string;
  isRegistered: boolean;
  isCollected: boolean;
}

export function MealStatus({ mealDate, isRegistered, isCollected }: MealStatusProps) {
  if (isCollected) {
    return <Badge label="Collected" variant="success" size="sm" />;
  }

  if (isRegistered) {
    if (isPast(mealDate)) {
      return <Badge label="Missed" variant="error" size="sm" />;
    }
    return <Badge label="Registered" variant="primary" size="sm" />;
  }

  if (isPast(mealDate)) {
    return <Badge label="Expired" variant="neutral" size="sm" />;
  }

  if (isToday(mealDate)) {
    return <Badge label="Available" variant="info" size="sm" />;
  }

  return <Badge label="Upcoming" variant="neutral" size="sm" />;
}
