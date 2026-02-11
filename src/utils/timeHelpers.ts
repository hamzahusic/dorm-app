/**
 * Time-based utility functions for meal deadlines and service hours
 */

import { MEAL_TIMES } from '@/src/constants/app';

export function isBeforeDeadline(): boolean {
  const now = new Date();
  const [hour, minute] = MEAL_TIMES.REGISTRATION_DEADLINE.split(':').map(Number);
  const deadline = new Date();
  deadline.setHours(hour, minute, 0, 0);

  return now < deadline;
}

export function isAfterDeadline(): boolean {
  return !isBeforeDeadline();
}

export function isDuringService(): boolean {
  const now = new Date();
  const currentHour = now.getHours();

  const [startHour] = MEAL_TIMES.SERVICE_START.split(':').map(Number);
  const [endHour] = MEAL_TIMES.SERVICE_END.split(':').map(Number);

  return currentHour >= startHour && currentHour < endHour;
}

export function getRegistrationStatus(): 'open' | 'closing-soon' | 'closed' {
  if (isAfterDeadline()) {
    return 'closed';
  }

  const now = new Date();
  const [hour, minute] = MEAL_TIMES.REGISTRATION_DEADLINE.split(':').map(Number);
  const deadline = new Date();
  deadline.setHours(hour, minute, 0, 0);

  const timeLeft = deadline.getTime() - now.getTime();
  const hoursLeft = timeLeft / (1000 * 60 * 60);

  if (hoursLeft <= 1) {
    return 'closing-soon';
  }

  return 'open';
}

export function getTimeUntilDeadline(): { hours: number; minutes: number } {
  const now = new Date();
  const [hour, minute] = MEAL_TIMES.REGISTRATION_DEADLINE.split(':').map(Number);
  const deadline = new Date();
  deadline.setHours(hour, minute, 0, 0);

  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) {
    return { hours: 0, minutes: 0 };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
}
