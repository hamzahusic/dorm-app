/**
 * Main Zustand store for the dorm dinner tracking app
 * Contains all state and actions for users, meals, registrations, penalties, and notifications
 */

import { create } from 'zustand';
import { format } from 'date-fns';
import type { User, Meal, MealRegistration, Penalty, UserRole } from '@/src/types';
import { generateAllMockData } from './mockData';

interface AppState {
  // State
  currentUser: User;
  users: User[];
  meals: Meal[];
  registrations: MealRegistration[];
  penalties: Penalty[];
  notifications: { userId: string; read: boolean }[];

  // User Actions
  setCurrentUserRole: (role: UserRole) => void;
  toggleWantsMeal: () => void;
  toggleUserActiveStatus: (userId: string) => void;
  assignMentor: (studentId: string, mentorId: string) => void;

  // Meal Actions
  createMeal: (meal: Omit<Meal, 'id' | 'createdAt'>) => void;
  updateMeal: (mealId: string, updates: Partial<Pick<Meal, 'mealName' | 'description' | 'date'>>) => void;
  deleteMeal: (mealId: string) => void;
  getMealById: (id: string) => Meal | undefined;
  getTodaysMeal: () => Meal | undefined;
  getUpcomingMeals: (limit?: number) => Meal[];

  // Registration Actions
  registerForMeal: (mealId: string) => void;
  optOutOfMeal: (mealId: string) => void;
  markAsCollected: (registrationId: string, collectedVia: 'qr_scan' | 'manual' | 'late_scan') => void;
  undoCollection: (registrationId: string) => void;
  isUserRegisteredForMeal: (userId: string, mealId: string) => boolean;
  getRegistrationStats: (mealId: string) => { total: number; collected: number; pending: number };

  // Penalty Actions
  getPenaltiesForUser: (userId: string) => Penalty[];
  clearPenalty: (penaltyId: string, clearedBy: string, reason: string) => void;
  getAllPenalties: () => Penalty[];

  // Notification Actions
  getUnreadCount: (userId: string) => number;
}

// Generate initial mock data
const mockData = generateAllMockData();

// Find a default student user
const defaultUser = mockData.users.find(u => u.role === 'student') || mockData.users[0];

export const useStore = create<AppState>((set, get) => ({
  // Initial State
  currentUser: defaultUser,
  users: mockData.users,
  meals: mockData.meals,
  registrations: mockData.registrations,
  penalties: mockData.penalties,
  notifications: mockData.notifications,

  // User Actions
  setCurrentUserRole: (role: UserRole) => {
    const newUser = get().users.find(u => u.role === role);
    if (newUser) {
      set({ currentUser: newUser });
    }
  },

  toggleWantsMeal: () => {
    set((state) => ({
      currentUser: { ...state.currentUser, wantsMeal: !state.currentUser.wantsMeal },
      users: state.users.map(u =>
        u.id === state.currentUser.id ? { ...u, wantsMeal: !u.wantsMeal } : u
      ),
    }));
  },

  toggleUserActiveStatus: (userId: string) => {
    set((state) => ({
      users: state.users.map(u =>
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      ),
      currentUser: state.currentUser.id === userId
        ? { ...state.currentUser, isActive: !state.currentUser.isActive }
        : state.currentUser,
    }));
  },

  assignMentor: (studentId: string, mentorId: string) => {
    set((state) => ({
      users: state.users.map(u =>
        u.id === studentId ? { ...u, reportsTo: mentorId } : u
      ),
      currentUser: state.currentUser.id === studentId
        ? { ...state.currentUser, reportsTo: mentorId }
        : state.currentUser,
    }));
  },

  // Meal Actions
  createMeal: (meal: Omit<Meal, 'id' | 'createdAt'>) => {
    const newMeal: Meal = {
      ...meal,
      id: `meal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      meals: [newMeal, ...state.meals].sort((a, b) => b.date.localeCompare(a.date)),
    }));
  },

  updateMeal: (mealId: string, updates: Partial<Pick<Meal, 'mealName' | 'description' | 'date'>>) => {
    set((state) => ({
      meals: state.meals.map(m =>
        m.id === mealId ? { ...m, ...updates } : m
      ).sort((a, b) => b.date.localeCompare(a.date)),
    }));
  },

  deleteMeal: (mealId: string) => {
    set((state) => ({
      meals: state.meals.filter(m => m.id !== mealId),
      registrations: state.registrations.filter(r => r.mealId !== mealId),
    }));
  },

  getMealById: (id: string) => {
    return get().meals.find(m => m.id === id);
  },

  getTodaysMeal: () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return get().meals.find(m => m.date === today);
  },

  getUpcomingMeals: (limit = 7) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return get()
      .meals.filter(m => m.date >= today)
      .slice(0, limit);
  },

  // Registration Actions
  registerForMeal: (mealId: string) => {
    const state = get();
    const existing = state.registrations.find(
      r => r.mealId === mealId && r.userId === state.currentUser.id
    );

    if (!existing) {
      const newRegistration: MealRegistration = {
        id: `registration-${Date.now()}`,
        userId: state.currentUser.id,
        mealId,
        collected: false,
        collectedAt: null,
        collectedVia: null,
        verifiedBy: null,
        registeredAt: new Date().toISOString(),
      };

      set((state) => ({
        registrations: [...state.registrations, newRegistration],
      }));
    }
  },

  optOutOfMeal: (mealId: string) => {
    set((state) => ({
      registrations: state.registrations.filter(
        r => !(r.mealId === mealId && r.userId === state.currentUser.id)
      ),
    }));
  },

  markAsCollected: (registrationId: string, collectedVia: 'qr_scan' | 'manual' | 'late_scan') => {
    const currentUser = get().currentUser;

    set((state) => ({
      registrations: state.registrations.map(r =>
        r.id === registrationId
          ? {
              ...r,
              collected: true,
              collectedAt: new Date().toISOString(),
              collectedVia,
              verifiedBy: currentUser.id,
            }
          : r
      ),
    }));
  },

  undoCollection: (registrationId: string) => {
    set((state) => ({
      registrations: state.registrations.map(r =>
        r.id === registrationId
          ? {
              ...r,
              collected: false,
              collectedAt: null,
              collectedVia: null,
              verifiedBy: null,
            }
          : r
      ),
    }));
  },

  isUserRegisteredForMeal: (userId: string, mealId: string) => {
    return get().registrations.some(r => r.userId === userId && r.mealId === mealId);
  },

  getRegistrationStats: (mealId: string) => {
    const registrations = get().registrations.filter(r => r.mealId === mealId);
    const collected = registrations.filter(r => r.collected).length;

    return {
      total: registrations.length,
      collected,
      pending: registrations.length - collected,
    };
  },

  // Penalty Actions
  getPenaltiesForUser: (userId: string) => {
    return get().penalties.filter(p => p.userId === userId);
  },

  clearPenalty: (penaltyId: string, clearedBy: string, reason: string) => {
    set((state) => ({
      penalties: state.penalties.map(p =>
        p.id === penaltyId
          ? { ...p, cleared: true, clearedBy, clearReason: reason }
          : p
      ),
    }));
  },

  getAllPenalties: () => {
    return get().penalties;
  },

  // Notification Actions
  getUnreadCount: (userId: string) => {
    return get().notifications.filter(n => n.userId === userId && !n.read).length;
  },
}));
