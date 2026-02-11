/**
 * Core TypeScript type definitions for the Dorm Dinner Tracking App
 */

export type UserRole = 'student' | 'mentor' | 'staff' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  reportsTo: string | null; // User ID of mentor/supervisor
  wantsMeal: boolean; // Default meal preference
}

export interface Meal {
  id: string;
  date: string; // YYYY-MM-DD
  mealName: string;
  description: string | null;
  createdBy: string; // User ID
  createdAt: string;
}

export interface MealRegistration {
  id: string;
  userId: string;
  mealId: string;
  collected: boolean;
  collectedAt: string | null;
  collectedVia: 'qr_scan' | 'manual' | 'late_scan' | null;
  verifiedBy: string | null; // User ID of staff who verified
  registeredAt: string;
}

export interface Penalty {
  id: string;
  userId: string;
  mealId: string;
  penaltyType: 'no_show' | 'unregistered_collection';
  createdAt: string;
  notifiedMentor: boolean;
  notifiedAdmin: boolean;
  cleared: boolean;
  clearedBy: string | null;
  clearReason: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  notificationType: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl: string | null;
  createdAt: string;
}

export interface QRSession {
  id: string;
  mealId: string;
  sessionToken: string;
  createdBy: string;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}
