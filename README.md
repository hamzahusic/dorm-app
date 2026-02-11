# Dorm Dinner Tracking App

A comprehensive React Native mobile application for managing meal registrations and tracking in a dormitory with 126 students. Built with Expo, TypeScript, and modern React Native best practices.

## 📱 Overview

This frontend-only application provides a complete meal management system with role-based access for students, mentors, staff, and administrators. It includes meal registration, QR code scanning (placeholder), penalty tracking, and comprehensive analytics.

**Backend Integration:** This app is designed to integrate with an ASP.NET + SQL Server backend (to be built separately). All data is currently mocked for development and testing.

---

## ✨ Features

### 👨‍🎓 Student Features
- View today's meal and upcoming meals (7 days)
- Register or opt-out of meals
- Track personal penalties
- View notification badges
- Haptic feedback on interactions

### 👥 Mentor Features
- View mentee statistics (registrations, penalties)
- Monitor today's meal registrations
- Clear mentee penalties
- Track mentee meal participation

### 👨‍🍳 Staff Features
- View system-wide meal statistics
- Scan QR codes for meal collection (manual mode available)
- Manage meal registrations
- Mark meals as collected
- View recent collections

### 🔐 Admin Features
- User management (activate/deactivate users)
- View and filter all users by role
- Penalty management (view, filter, clear)
- System settings overview
- Comprehensive analytics dashboard

### 🎨 UI/UX Features
- **Dark Mode:** Automatic light/dark theme based on system preference
- **Role Switcher:** Dev tool to test all user roles (floating button)
- **Responsive Design:** Works on iOS, Android, and Web
- **Haptic Feedback:** Touch feedback on key interactions
- **Empty States:** Helpful messages when no data is available
- **Loading States:** Visual feedback during operations

---

## 🏗️ Architecture

### Tech Stack
- **Framework:** Expo SDK 54 with React Native 0.81
- **Navigation:** Expo Router (file-based routing)
- **State Management:** Zustand (lightweight, no providers)
- **Styling:** Custom themed components with automatic dark mode
- **Date Utilities:** date-fns
- **HTTP Client:** Axios (for future API integration)
- **TypeScript:** Strict mode enabled

### Folder Structure
```
dorm-app/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx               # Root layout with ThemeProvider
│   ├── index.tsx                 # Redirect to home
│   ├── (tabs)/                   # Tab navigation
│   │   ├── _layout.tsx           # Role-based tab layout
│   │   ├── home.tsx              # Dashboard (all roles)
│   │   ├── scanner.tsx           # QR Scanner (student, mentor)
│   │   ├── manage.tsx            # Meal management (mentor, staff, admin)
│   │   └── admin.tsx             # Admin panel (admin only)
│   └── modal/
│       └── create-meal.tsx       # Create meal modal
├── src/
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── store/
│   │   ├── index.ts              # Zustand store
│   │   └── mockData.ts           # Mock data generator
│   ├── components/
│   │   ├── themed/               # Themed wrapper components
│   │   ├── common/               # Reusable UI components
│   │   ├── meal/                 # Meal-specific components
│   │   ├── registration/         # Registration components
│   │   ├── penalty/              # Penalty components
│   │   └── dev/                  # Development tools
│   ├── theme/
│   │   ├── colors.ts             # Color system (light/dark)
│   │   ├── spacing.ts            # Spacing constants
│   │   ├── typography.ts         # Font sizes and weights
│   │   ├── ThemeProvider.tsx     # Theme context provider
│   │   └── index.ts              # Theme exports
│   ├── constants/
│   │   └── app.ts                # App constants
│   └── utils/
│       ├── dateHelpers.ts        # Date formatting and utilities
│       ├── roleHelpers.ts        # Role-based permissions
│       └── validation.ts         # Form validation
├── assets/                       # App images and icons
└── package.json
```

### Key Design Decisions

**Why Expo Router over React Navigation?**
- Modern, file-based routing (like Next.js)
- Type-safe navigation with TypeScript
- Better code splitting and lazy loading
- Already configured in new Expo projects

**Why Zustand over Redux?**
- Lightweight (7KB vs 40KB+)
- No providers or boilerplate
- Simple hooks-based API
- Perfect for this app's complexity level

**Why Custom Components over UI Library?**
- Full control over theming and dark mode
- Smaller bundle size (no 500KB+ UI library)
- Easier to customize for specific needs
- Better performance

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- iOS Simulator (macOS) or Android Emulator
- Expo CLI (automatically installed)

### Installation

1. **Clone the repository:**
   ```bash
   cd /Users/hamza/Desktop/dorm-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on iOS:**
   ```bash
   npm run ios
   ```

5. **Run on Android:**
   ```bash
   npm run android
   ```

6. **Run on Web:**
   ```bash
   npm run web
   ```

---

## 🎭 Using the Role Switcher

The app includes a **floating button** (bottom-right corner) that allows you to test different user roles in development mode.

**How to use:**
1. Launch the app
2. Look for the floating circular button above the tab bar
3. Tap it to open the role switcher modal
4. Select a role: Student, Mentor, Staff, or Admin
5. The app will instantly update to show that role's interface

**Tab Visibility by Role:**
- **Student:** Home, Scanner tabs
- **Mentor:** Home, Scanner, Manage tabs
- **Staff:** Home, Manage tabs
- **Admin:** Home, Manage, Admin tabs

---

## 📊 Mock Data

The app generates realistic mock data on startup:

- **126 Students** with unique names and emails
- **12 Mentors** (10-11 students per mentor)
- **5 Staff Members**
- **2 Administrators**
- **37 Meals** (30 past, today, 6 future)
- **~80% Registration Rate** for meals
- **~8% No-Show Penalties**
- **Notifications** for penalty alerts

All data is stored in-memory and resets when the app reloads.

---

## 🎨 Theme System

### Automatic Dark Mode
The app automatically detects your system's color scheme and applies the appropriate theme:
- **Light Mode:** Clean whites and subtle grays
- **Dark Mode:** True black with muted colors

To test dark mode:
1. Change your device/simulator system appearance
2. App will automatically update

### Color Palette
- **Primary:** Blue (#2563EB) - Main actions
- **Secondary:** Green (#10B981) - Success states
- **Error:** Red (#EF4444) - Errors and penalties
- **Warning:** Amber (#F59E0B) - Warnings
- **Info:** Light Blue (#3B82F6) - Informational

---

## 🔌 Future Backend Integration

When the ASP.NET backend is ready:

### 1. Create API Service Layer
```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.yourdorm.com',
  timeout: 10000,
});

export const mealService = {
  getAll: () => api.get<Meal[]>('/meals'),
  create: (meal: CreateMealDto) => api.post<Meal>('/meals', meal),
  // ... more endpoints
};
```

### 2. Update Store Actions
- Make actions async
- Add loading/error states
- Replace mock data with API calls
- Implement optimistic updates

### 3. Add Authentication
- Login/logout functionality
- Token storage (AsyncStorage/SecureStore)
- Axios interceptor for auth headers
- Protected routes

### 4. Add Real-time Updates
- WebSocket/SignalR integration
- Live meal registrations
- Real-time notifications

### 5. Add QR Scanning
- Install `expo-camera`
- Implement QR code generation (backend)
- Scanner screen integration
- Session validation

---

## 🐛 Known Limitations

1. **No Real QR Scanning:** Placeholder UI only (requires `expo-camera`)
2. **No Authentication:** App starts directly (no login)
3. **No Data Persistence:** Mock data resets on reload
4. **No Real-time Updates:** Data is static (no WebSocket)
5. **No Backend API:** All data is mocked in-memory
6. **No Image Uploads:** No meal photos or user avatars
7. **No Email Notifications:** Notification system is UI-only

---

## 📝 Scripts

```bash
npm start           # Start Expo dev server
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run web         # Run on web browser
npm run lint        # Run ESLint
```

---

## 🧪 Testing the App

### Student Flow
1. Switch to **Student** role
2. View today's meal card
3. Click "Register" → Button changes to "Opt Out"
4. Click "Opt Out" → Button changes back to "Register"
5. View upcoming meals list
6. Check penalties section (some students have penalties)

### Mentor Flow
1. Switch to **Mentor** role
2. View mentee statistics (total, registered today, penalties)
3. See today's meal overview
4. View mentee penalties list
5. Clear a penalty (if any exist)

### Staff Flow
1. Switch to **Staff** role
2. View system statistics (students, registrations, collections)
3. Navigate to **Scanner** tab
4. Select a student from pending list
5. Click "Mark as Collected"
6. See student appear in recent collections

### Admin Flow
1. Switch to **Admin** role
2. View system-wide statistics
3. Navigate to **Admin** tab
4. Filter users by role
5. Activate/deactivate a user
6. View and clear penalties
7. Check system settings

### Dark Mode
1. Change system appearance to dark mode
2. App automatically updates
3. Verify all screens render correctly
4. Check color contrast and readability

---

## 🏆 Success Criteria

✅ App runs on iOS and Android without errors
✅ All 4 user roles can be switched via dev tool
✅ Role-based navigation shows correct tabs
✅ Students can register/opt-out for meals
✅ Mentors can create meals and view registrations
✅ Staff can manage collections via scanner
✅ Admins can manage users and penalties
✅ Dark mode works on all screens
✅ Mock data includes 126 students + staff
✅ TypeScript strict mode with no errors
✅ Clean, maintainable code ready for backend integration

---

## 📄 License

This project is for educational purposes.

---

## 🤝 Contributing

This is a frontend prototype designed for backend integration. When contributing:
1. Follow TypeScript strict mode
2. Use existing themed components
3. Maintain role-based access patterns
4. Add proper type definitions
5. Test on both light and dark modes

---

## 📞 Support

For questions or issues, please refer to:
- Expo Documentation: https://docs.expo.dev/
- React Native Documentation: https://reactnative.dev/
- Zustand Documentation: https://zustand-demo.pmnd.rs/

---

**Built with ❤️ using Expo, TypeScript, and React Native**
