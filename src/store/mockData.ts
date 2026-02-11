/**
 * Mock data generator for the dorm app
 * Creates realistic test data for 126 students, mentors, staff, admins, meals, and registrations
 */

import { format, subDays, addDays } from 'date-fns';
import type { User, Meal, MealRegistration, Penalty, Notification, QRSession, UserRole } from '@/src/types';
import {
  TOTAL_STUDENTS,
  TOTAL_MENTORS,
  TOTAL_STAFF,
  TOTAL_ADMINS,
  STUDENTS_PER_MENTOR,
  MEAL_NAMES,
  MEAL_DESCRIPTIONS,
  PENALTY_THRESHOLDS,
} from '@/src/constants/app';

// Sample names for generating users
const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
];

let idCounter = 0;
function generateId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}

/**
 * Generate users: 126 students, mentors, staff, and admins
 */
export function generateUsers(): User[] {
  const users: User[] = [];

  // Generate admins first
  for (let i = 0; i < TOTAL_ADMINS; i++) {
    users.push({
      id: generateId('admin'),
      email: `admin${i + 1}@dorm.edu`,
      fullName: `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`,
      role: 'admin',
      isActive: true,
      reportsTo: null,
      wantsMeal: true,
    });
  }

  // Generate staff
  for (let i = 0; i < TOTAL_STAFF; i++) {
    users.push({
      id: generateId('staff'),
      email: `staff${i + 1}@dorm.edu`,
      fullName: `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`,
      role: 'staff',
      isActive: true,
      reportsTo: users[0].id, // Report to first admin
      wantsMeal: true,
    });
  }

  // Generate mentors
  const mentors: User[] = [];
  for (let i = 0; i < TOTAL_MENTORS; i++) {
    const mentor: User = {
      id: generateId('mentor'),
      email: `mentor${i + 1}@dorm.edu`,
      fullName: `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`,
      role: 'mentor',
      isActive: true,
      reportsTo: users[0].id, // Report to first admin
      wantsMeal: randomBoolean(0.7), // 70% want meals
    };
    mentors.push(mentor);
    users.push(mentor);
  }

  // Generate students (assign to mentors)
  for (let i = 0; i < TOTAL_STUDENTS; i++) {
    const mentorIndex = Math.floor(i / STUDENTS_PER_MENTOR);
    const assignedMentor = mentors[mentorIndex];

    users.push({
      id: generateId('student'),
      email: `student${i + 1}@dorm.edu`,
      fullName: `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`,
      role: 'student',
      isActive: randomBoolean(0.95), // 95% active
      reportsTo: assignedMentor.id,
      wantsMeal: randomBoolean(0.85), // 85% want meals by default
    });
  }

  return users;
}

/**
 * Generate meals for the last 30 days
 */
export function generateMeals(users: User[]): Meal[] {
  const meals: Meal[] = [];
  const staffUsers = users.filter(u => u.role === 'staff' || u.role === 'admin');
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    const mealIndex = i % MEAL_NAMES.length;

    meals.push({
      id: generateId('meal'),
      date: format(date, 'yyyy-MM-dd'),
      mealName: MEAL_NAMES[mealIndex],
      description: MEAL_DESCRIPTIONS[mealIndex],
      createdBy: randomItem(staffUsers).id,
      createdAt: subDays(date, 1).toISOString(), // Created day before
    });
  }

  // Add 7 future meals
  for (let i = 1; i <= 7; i++) {
    const date = addDays(today, i);
    const mealIndex = (30 + i) % MEAL_NAMES.length;

    meals.push({
      id: generateId('meal'),
      date: format(date, 'yyyy-MM-dd'),
      mealName: MEAL_NAMES[mealIndex],
      description: MEAL_DESCRIPTIONS[mealIndex],
      createdBy: randomItem(staffUsers).id,
      createdAt: new Date().toISOString(),
    });
  }

  return meals.sort((a, b) => b.date.localeCompare(a.date)); // Most recent first
}

/**
 * Generate meal registrations with ~80% registration rate
 */
export function generateRegistrations(users: User[], meals: Meal[]): MealRegistration[] {
  const registrations: MealRegistration[] = [];
  const students = users.filter(u => u.role === 'student' && u.isActive);
  const staff = users.filter(u => u.role === 'staff' || u.role === 'admin');
  const today = format(new Date(), 'yyyy-MM-dd');

  meals.forEach(meal => {
    const isPast = meal.date < today;
    const isToday = meal.date === today;
    const isFuture = meal.date > today;

    students.forEach(student => {
      // Registration probability based on wantsMeal preference
      const registrationRate = student.wantsMeal ? 0.85 : 0.4;

      if (randomBoolean(registrationRate)) {
        const registered = true;
        let collected = false;
        let collectedAt = null;
        let collectedVia: 'qr_scan' | 'manual' | 'late_scan' | null = null;
        let verifiedBy = null;

        // For past meals, some are collected
        if (isPast && randomBoolean(0.92)) { // 92% collection rate
          collected = true;
          collectedVia = randomBoolean(0.8) ? 'qr_scan' : 'manual';
          collectedAt = `${meal.date}T18:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00Z`;
          verifiedBy = randomItem(staff).id;
        }

        // For today, some early birds have collected
        if (isToday && randomBoolean(0.3)) {
          collected = true;
          collectedVia = 'qr_scan';
          const now = new Date();
          collectedAt = now.toISOString();
          verifiedBy = randomItem(staff).id;
        }

        registrations.push({
          id: generateId('registration'),
          userId: student.id,
          mealId: meal.id,
          collected,
          collectedAt,
          collectedVia,
          verifiedBy,
          registeredAt: subDays(new Date(meal.date), 1).toISOString(),
        });
      }
    });
  });

  return registrations;
}

/**
 * Generate penalties for no-shows (registered but didn't collect)
 */
export function generatePenalties(
  users: User[],
  meals: Meal[],
  registrations: MealRegistration[]
): Penalty[] {
  const penalties: Penalty[] = [];
  const today = format(new Date(), 'yyyy-MM-dd');
  const pastMeals = meals.filter(m => m.date < today);

  pastMeals.forEach(meal => {
    const mealRegistrations = registrations.filter(r => r.mealId === meal.id);

    mealRegistrations.forEach(registration => {
      // No-show penalty: registered but didn't collect
      if (!registration.collected && randomBoolean(0.08)) { // 8% no-show rate
        const user = users.find(u => u.id === registration.userId);
        if (!user) return;

        const userPenalties = penalties.filter(p => p.userId === user.id);
        const penaltyCount = userPenalties.length;

        penalties.push({
          id: generateId('penalty'),
          userId: registration.userId,
          mealId: meal.id,
          penaltyType: 'no_show',
          createdAt: `${meal.date}T20:30:00Z`, // After service ends
          notifiedMentor: penaltyCount + 1 >= PENALTY_THRESHOLDS.MENTOR_NOTIFICATION,
          notifiedAdmin: penaltyCount + 1 >= PENALTY_THRESHOLDS.ADMIN_NOTIFICATION,
          cleared: randomBoolean(0.2), // 20% cleared
          clearedBy: randomBoolean(0.2) ? users.find(u => u.role === 'admin')?.id || null : null,
          clearReason: randomBoolean(0.2) ? 'Emergency situation' : null,
        });
      }
    });
  });

  return penalties;
}

/**
 * Generate notifications for penalty alerts
 */
export function generateNotifications(users: User[], penalties: Penalty[]): Notification[] {
  const notifications: Notification[] = [];

  penalties.forEach(penalty => {
    const user = users.find(u => u.id === penalty.userId);
    if (!user) return;

    // Notification to student
    notifications.push({
      id: generateId('notification'),
      userId: user.id,
      notificationType: 'penalty_received',
      title: 'Meal No-Show Penalty',
      message: `You received a penalty for not collecting your registered meal. Please collect your meals or opt-out in advance.`,
      read: randomBoolean(0.6),
      actionUrl: `/penalties/${penalty.id}`,
      createdAt: penalty.createdAt,
    });

    // Notification to mentor if threshold reached
    if (penalty.notifiedMentor && user.reportsTo) {
      notifications.push({
        id: generateId('notification'),
        userId: user.reportsTo,
        notificationType: 'mentee_penalty_alert',
        title: 'Mentee Penalty Alert',
        message: `${user.fullName} has reached ${PENALTY_THRESHOLDS.MENTOR_NOTIFICATION} penalties. Please follow up.`,
        read: randomBoolean(0.8),
        actionUrl: `/penalties/${penalty.id}`,
        createdAt: penalty.createdAt,
      });
    }

    // Notification to admins if high threshold reached
    if (penalty.notifiedAdmin) {
      const admins = users.filter(u => u.role === 'admin');
      admins.forEach(admin => {
        notifications.push({
          id: generateId('notification'),
          userId: admin.id,
          notificationType: 'high_penalty_alert',
          title: 'High Penalty Alert',
          message: `${user.fullName} has reached ${PENALTY_THRESHOLDS.ADMIN_NOTIFICATION} penalties. Admin review required.`,
          read: randomBoolean(0.9),
          actionUrl: `/penalties/${penalty.id}`,
          createdAt: penalty.createdAt,
        });
      });
    }
  });

  return notifications;
}

/**
 * Generate active QR sessions for today's and future meals
 */
export function generateQRSessions(meals: Meal[], users: User[]): QRSession[] {
  const sessions: QRSession[] = [];
  const today = format(new Date(), 'yyyy-MM-dd');
  const activeMeals = meals.filter(m => m.date >= today).slice(0, 3); // Today + next 2 days
  const staff = users.filter(u => u.role === 'staff' || u.role === 'admin');

  activeMeals.forEach(meal => {
    if (randomBoolean(0.7)) { // 70% have active sessions
      const mealDate = new Date(meal.date);
      const expiresAt = new Date(mealDate);
      expiresAt.setHours(20, 0, 0, 0); // Expires at 8 PM

      sessions.push({
        id: generateId('qr-session'),
        mealId: meal.id,
        sessionToken: `QR-${meal.id}-${Date.now()}`,
        createdBy: randomItem(staff).id,
        expiresAt: expiresAt.toISOString(),
        isActive: meal.date === today, // Only today's session is active
        createdAt: new Date().toISOString(),
      });
    }
  });

  return sessions;
}

/**
 * Generate all mock data
 */
export function generateAllMockData() {
  const users = generateUsers();
  const meals = generateMeals(users);
  const registrations = generateRegistrations(users, meals);
  const penalties = generatePenalties(users, meals, registrations);
  const notifications = generateNotifications(users, penalties);
  const qrSessions = generateQRSessions(meals, users);

  return {
    users,
    meals,
    registrations,
    penalties,
    notifications,
    qrSessions,
  };
}
