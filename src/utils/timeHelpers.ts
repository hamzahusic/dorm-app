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

export function isDuringService(): boolean {
  const now = new Date();
  const currentHour = now.getHours();

  const [startHour] = MEAL_TIMES.SERVICE_START.split(':').map(Number);
  const [endHour] = MEAL_TIMES.SERVICE_END.split(':').map(Number);

  return currentHour >= startHour && currentHour < endHour;
}
