# Dorm Dinner Tracker

A mobile app for managing daily meal registrations in a student dormitory. Students register for dinner before a daily deadline, staff scan QR codes to mark meals as collected, and admins track statistics and no-show penalties.

Built with **React Native + Expo**. Fully functional with mock data — no backend required to run.

---

## Table of Contents

- [How It Works](#how-it-works)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Backend Integration](#backend-integration)
- [Known Limitations](#known-limitations)

---

## How It Works

The dorm has 126 students who must register for dinner each day before **2:00 PM**. The flow:

1. Students open the app and register (or opt out) for the day's meal
2. At dinner time, staff scan students' QR codes to mark meals as collected
3. Students who registered but didn't show up receive a **no-show penalty**
4. Mentors can monitor their students and clear penalties
5. Admins have full visibility into registrations, penalties, and user management

All data is currently in-memory mock data. The app is designed to plug into an ASP.NET + SQL Server backend.

---

## User Roles

The app has four roles. A floating **Role Switcher** button (bottom-right, dev only) lets you switch between them instantly — no login needed.

### Student
- View today's meal and upcoming meals (7 days)
- Register or opt out before the 2 PM deadline
- View personal penalties and notification badges

### Mentor
- See all assigned students, their registration status, and penalties
- Create and manage meals
- Clear penalties for their students

### Staff
- Scan QR codes at the cafeteria to mark meals as collected
- Manual fallback mode for when the scanner doesn't work
- View recent collections and system statistics

### Admin
- Full access: user management, penalty management, meal creation
- Activate or deactivate user accounts
- System-wide analytics dashboard

**Tab visibility by role:**

| Tab | Student | Mentor | Staff | Admin |
|---|---|---|---|---|
| Home | Yes | Yes | Yes | Yes |
| Scanner | Yes | Yes | - | - |
| Manage | - | Yes | Yes | Yes |
| Admin | - | - | - | Yes |

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Language | TypeScript 5.9 (strict mode) |
| Routing | Expo Router 6 (file-based, like Next.js) |
| State Management | Zustand 5 |
| HTTP Client | Axios 1.13 (configured, not active yet) |
| Camera / QR | expo-camera, react-native-qrcode-svg |
| Animation | react-native-reanimated 4 |
| Date Handling | date-fns 4 |
| Icons | @expo/vector-icons (Ionicons) |
| Haptics | expo-haptics |

---

## Project Structure

```
dorm-app/
├── app/                        # Screens — Expo Router file-based routing
│   ├── _layout.tsx             # Root layout, wraps app in ThemeProvider
│   ├── index.tsx               # Redirects to home tab
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab bar with role-based visibility
│   │   ├── home.tsx            # Dashboard (all roles)
│   │   ├── scanner.tsx         # QR scanner (students & staff)
│   │   ├── manage.tsx          # Meal management (mentors, staff, admins)
│   │   └── admin.tsx           # Admin panel (admins only)
│   └── modal/
│       ├── create-meal.tsx     # Create meal modal
│       └── edit-meal.tsx       # Edit meal modal
│
├── src/
│   ├── types/index.ts          # All TypeScript interfaces (User, Meal, etc.)
│   │
│   ├── store/
│   │   ├── index.ts            # Zustand store — all state and actions
│   │   └── mockData.ts         # Generates realistic mock data on startup
│   │
│   ├── components/
│   │   ├── themed/             # Base components that respect the theme
│   │   ├── common/             # Reusable UI (Header, Badge, StatCard…)
│   │   ├── home/               # Role-specific home screen content
│   │   ├── meal/               # Meal card and detail components
│   │   ├── registration/       # Register / opt-out button logic
│   │   ├── penalty/            # Penalty list and management UI
│   │   ├── scanner/            # QR scanner UI
│   │   ├── manage/             # Meal & registration management tabs
│   │   ├── admin/              # Admin-only management tabs
│   │   └── dev/                # RoleSwitcher (visible in __DEV__ only)
│   │
│   ├── services/api/           # API layer — ready to connect to backend
│   │   ├── client.ts           # Axios instance with base URL config
│   │   ├── mealService.ts
│   │   ├── userService.ts
│   │   ├── registrationService.ts
│   │   └── penaltyService.ts
│   │
│   ├── theme/
│   │   ├── colors.ts           # Light and dark color palettes
│   │   ├── spacing.ts          # 8pt grid spacing constants
│   │   ├── typography.ts       # Font sizes and weights
│   │   └── ThemeProvider.tsx   # Reads system color scheme, exposes useTheme()
│   │
│   ├── constants/app.ts        # Meal times, penalty config, app-wide constants
│   │
│   └── utils/
│       ├── dateHelpers.ts      # Date formatting utilities
│       ├── timeHelpers.ts      # Deadline checks, service hours
│       ├── roleHelpers.ts      # Permission checks per role
│       └── validation.ts       # Form validation
│
├── assets/images/              # App icons and splash screen assets
├── app.json                    # Expo configuration (name, icons, plugins)
├── package.json
└── tsconfig.json               # TypeScript strict config, @/* path alias
```

---

## Getting Started

### Prerequisites

- **Node.js 18+**
- **Expo Go** app on your phone, or an iOS/Android simulator set up locally

### Install and run

```bash
# Install dependencies
npm install

# Start the dev server
npm start
```

Once the server starts:
- Press `i` — open in iOS Simulator
- Press `a` — open in Android Emulator
- Press `w` — open in browser
- Scan the QR code with **Expo Go** on your phone

No `.env` file or backend needed. The app generates all data in-memory on startup.

### Available scripts

```bash
npm start          # Start Expo dev server
npm run ios        # Open directly in iOS Simulator
npm run android    # Open directly in Android Emulator
npm run web        # Open in browser
npm run lint       # Run ESLint
```

---

## Development

### Mock data

On startup, `src/store/mockData.ts` generates:
- 126 students, 12 mentors, 5 staff, 2 admins
- 37 meals (30 past, 1 today, 6 upcoming)
- ~80% registration rate per meal
- ~8% no-show penalties
- ~92% of past registrations marked as collected

All data is in-memory and resets on every reload.

### State management

All app state lives in a single Zustand store (`src/store/index.ts`). Components access it with `useAppStore()`:

```ts
const { currentUser, registerForMeal, getTodaysMeal } = useAppStore();
```

No reducers, no providers — just a hook.

### Theme system

`ThemeProvider` reads the system color scheme and exposes a `useTheme()` hook. Every component uses this instead of hardcoded colors. Dark mode is automatic — change your device appearance and the app updates instantly.

### Role switcher

A floating button (bottom-right corner) lets you switch between all four roles without logging in. It only appears in development (`__DEV__ === true`).

---

## Backend Integration

The API service layer is scaffolded in `src/services/api/` using Axios. To connect a real backend:

**1. Set the API URL** (in `.env` or `app.json`):
```
EXPO_PUBLIC_API_URL=http://your-server/api
```

**2. Enable API mode** in `src/services/api/client.ts`:
```ts
const USE_API = true;
```

**3. Replace mock store calls** with service functions:
```ts
// Before (mock)
const meals = useAppStore(state => state.meals);

// After (real API)
const meals = await mealService.getAll();
```

**4. Add authentication** — token storage with `expo-secure-store`, Axios interceptors for auth headers, and protected routes.

**5. Add real-time updates** — WebSocket or SignalR for live registration and collection sync.

### Planned API endpoints

| Resource | Endpoints |
|---|---|
| Meals | `GET /api/meals`, `POST /api/meals`, `PUT /api/meals/:id`, `DELETE /api/meals/:id` |
| Users | `GET /api/users`, `PUT /api/users/:id` |
| Registrations | `GET /api/registrations`, `POST /api/registrations`, `PUT /api/registrations/:id` |
| Penalties | `GET /api/penalties`, `PUT /api/penalties/:id` |

---

## Known Limitations

| Limitation | Detail |
|---|---|
| No real QR scanning | Scanner UI is a placeholder; full `expo-camera` integration needed |
| No authentication | App skips login entirely — auth must be added before production |
| No data persistence | Everything resets on reload; needs backend or local storage |
| No real-time sync | Registrations don't sync between devices; needs WebSocket/SignalR |
| No push notifications | Notification system is UI-only |