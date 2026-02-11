/**
 * Date helper functions
 */

import { format, isToday as dateFnsIsToday, isFuture as dateFnsIsFuture, isPast as dateFnsIsPast, parseISO } from 'date-fns';

export function formatDate(date: string | Date, formatStr: string = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy • h:mm a');
}

export function isToday(date: string): boolean {
  const today = format(new Date(), 'yyyy-MM-dd');
  return date === today;
}

export function isFuture(date: string): boolean {
  const today = format(new Date(), 'yyyy-MM-dd');
  return date > today;
}

export function isPast(date: string): boolean {
  const today = format(new Date(), 'yyyy-MM-dd');
  return date < today;
}

export function getDayLabel(date: string): string {
  if (isToday(date)) return 'Today';
  if (isFuture(date) && date === format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')) {
    return 'Tomorrow';
  }
  return formatDate(date, 'EEEE, MMM d');
}

export function getRelativeDay(date: string): string {
  if (isToday(date)) return 'Today';
  if (isFuture(date)) {
    const tomorrow = format(new Date(Date.now() + 86400000), 'yyyy-MM-dd');
    if (date === tomorrow) return 'Tomorrow';
    return formatDate(date);
  }
  return formatDate(date);
}
