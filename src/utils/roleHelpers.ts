/**
 * Role-based permission helper functions
 */

import type { UserRole } from '@/src/types';

export function canClearPenalties(role: UserRole): boolean {
  return ['mentor', 'admin'].includes(role);
}

export function getRoleLabel(role: UserRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}
