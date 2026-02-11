/**
 * Role-based permission helper functions
 */

import type { UserRole } from '@/src/types';

export function canScanQR(role: UserRole): boolean {
  return ['student', 'mentor'].includes(role);
}

export function canManageMeals(role: UserRole): boolean {
  return ['mentor', 'staff', 'admin'].includes(role);
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'admin';
}

export function canClearPenalties(role: UserRole): boolean {
  return ['mentor', 'admin'].includes(role);
}

export function canViewAllRegistrations(role: UserRole): boolean {
  return ['mentor', 'staff', 'admin'].includes(role);
}

export function canMarkAsCollected(role: UserRole): boolean {
  return ['staff', 'mentor', 'admin'].includes(role);
}

export function getRoleLabel(role: UserRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function getRoleColor(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '#EF4444'; // Red
    case 'staff':
      return '#F59E0B'; // Amber
    case 'mentor':
      return '#10B981'; // Green
    case 'student':
      return '#2563EB'; // Blue
  }
}
