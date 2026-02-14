/**
 * Home Screen - Routes to role-specific home view
 */

import React from 'react';
import { useStore } from '@/src/store';
import { StudentMentorHome } from '@/src/components/home/StudentMentorHome';
import { StaffHome } from '@/src/components/home/StaffHome';
import { AdminHome } from '@/src/components/home/AdminHome';

export default function HomeScreen() {
  const { currentUser } = useStore();

  if (currentUser.role === 'student' || currentUser.role === 'mentor') {
    return <StudentMentorHome />;
  }

  if (currentUser.role === 'staff') {
    return <StaffHome />;
  }

  if (currentUser.role === 'admin') {
    return <AdminHome />;
  }

  return null;
}
