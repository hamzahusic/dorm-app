/**
 * Tab Layout with role-based navigation
 * Different tabs are shown based on the current user's role
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { RoleSwitcher } from '@/src/components/dev/RoleSwitcher';

export default function TabLayout() {
  const { colors } = useTheme();
  const { currentUser } = useStore();

  // Tab visibility based on role
  const showScanner = currentUser.role === 'student' || currentUser.role === 'mentor';
  const showManage = currentUser.role === 'mentor' || currentUser.role === 'staff' || currentUser.role === 'admin';
  const showAdmin = currentUser.role === 'admin';

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            height: Platform.OS === 'ios' ? 85 : 65,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />

        <Tabs.Screen
          name="scanner"
          options={{
            title: 'Scanner',
            tabBarIcon: ({ color, size }) => <Ionicons name="qr-code" size={size} color={color} />,
            href: showScanner ? '/scanner' : null, // Hide tab if not allowed
          }}
        />

        <Tabs.Screen
          name="manage"
          options={{
            title: 'Manage',
            tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
            href: showManage ? '/manage' : null, // Hide tab if not allowed
          }}
        />

        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, size }) => <Ionicons name="shield-checkmark" size={size} color={color} />,
            href: showAdmin ? '/admin' : null, // Hide tab if not allowed
          }}
        />
      </Tabs>

      {/* Development Role Switcher */}
      {__DEV__ && <RoleSwitcher />}
    </>
  );
}
