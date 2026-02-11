/**
 * Application constants
 */

export const MEAL_TIMES = {
  REGISTRATION_DEADLINE: '14:00', // 2 PM - deadline to register
  SERVICE_START: '17:00', // 5 PM - dinner service starts
  SERVICE_END: '20:00', // 8 PM - dinner service ends
} as const;

export const PENALTY_THRESHOLDS = {
  MENTOR_NOTIFICATION: 3, // Notify mentor after 3 penalties
  ADMIN_NOTIFICATION: 6, // Notify admin after 6 penalties
} as const;

export const TOTAL_STUDENTS = 126;
export const STUDENTS_PER_MENTOR = 12;
export const TOTAL_MENTORS = Math.ceil(TOTAL_STUDENTS / STUDENTS_PER_MENTOR);
export const TOTAL_STAFF = 5;
export const TOTAL_ADMINS = 2;

export const MEAL_NAMES = [
  'Grilled Chicken & Rice',
  'Beef Stir-Fry',
  'Fish Tacos',
  'Pasta Carbonara',
  'Vegetable Curry',
  'BBQ Ribs & Cornbread',
  'Teriyaki Salmon',
  'Chicken Fajitas',
  'Beef Lasagna',
  'Thai Green Curry',
  'Roasted Turkey',
  'Shrimp Scampi',
  'Mushroom Risotto',
  'Pulled Pork Sandwich',
  'Mediterranean Bowl',
];

export const MEAL_DESCRIPTIONS = [
  'Herb-seasoned grilled chicken with steamed vegetables and jasmine rice',
  'Tender beef strips with mixed vegetables in savory sauce',
  'Crispy fish with fresh salsa and guacamole in soft tortillas',
  'Creamy pasta with pancetta and parmesan cheese',
  'Mixed vegetables in aromatic coconut curry sauce',
  'Slow-cooked ribs with homemade cornbread and coleslaw',
  'Glazed salmon with roasted vegetables and quinoa',
  'Seasoned chicken with bell peppers, onions, and warm tortillas',
  'Layers of pasta, meat sauce, and melted cheese',
  'Coconut curry with bamboo shoots and Thai basil',
  'Herb-roasted turkey with mashed potatoes and gravy',
  'Garlic butter shrimp over angel hair pasta',
  'Creamy risotto with wild mushrooms and parmesan',
  'Slow-cooked pork with BBQ sauce on a toasted bun',
  'Falafel, hummus, quinoa, and fresh vegetables with tahini dressing',
];
