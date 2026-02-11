/**
 * Validation utilities for forms and data
 */

import { isPast, isToday } from './dateHelpers';
import type { Meal } from '@/src/types';

export function validateMealForm(mealName: string, date: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!mealName || mealName.trim().length === 0) {
    errors.push('Meal name is required');
  }

  if (mealName.trim().length < 3) {
    errors.push('Meal name must be at least 3 characters');
  }

  if (!date) {
    errors.push('Date is required');
  }

  if (isPast(date) && !isToday(date)) {
    errors.push('Cannot create meals for past dates');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function canRegisterForMeal(mealDate: string): { canRegister: boolean; reason?: string } {
  if (isPast(mealDate) && !isToday(mealDate)) {
    return {
      canRegister: false,
      reason: 'Cannot register for past meals',
    };
  }

  // Check registration deadline (2 PM)
  if (isToday(mealDate)) {
    const now = new Date();
    const deadlineHour = 14; // 2 PM

    if (now.getHours() >= deadlineHour) {
      return {
        canRegister: false,
        reason: 'Registration deadline has passed (2:00 PM)',
      };
    }
  }

  return {
    canRegister: true,
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUserForm(fullName: string, email: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!fullName || fullName.trim().length === 0) {
    errors.push('Full name is required');
  }

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  }

  if (!validateEmail(email)) {
    errors.push('Invalid email format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
