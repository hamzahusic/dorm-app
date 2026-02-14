/**
 * Manage Screen - Meal and registration management
 */

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Header } from '@/src/components/common/Header';
import { TabSwitcher } from '@/src/components/common/TabSwitcher';
import { MealsTab } from '@/src/components/manage/MealsTab';
import { MenteesTab } from '@/src/components/manage/MenteesTab';
import { RegistrationsTab } from '@/src/components/manage/RegistrationsTab';
import { useStore } from '@/src/store';

export default function ManageScreen() {
  const { currentUser } = useStore();
  const isMentor = currentUser.role === 'mentor';
  const canEditMeals = ['mentor', 'staff', 'admin'].includes(currentUser.role);

  const [activeTab, setActiveTab] = useState('meals');

  const tabs = [
    { key: 'meals', label: 'Meals' },
    { key: isMentor ? 'mentees' : 'registrations', label: isMentor ? 'Mentees' : 'Registrations' },
  ];

  return (
    <ThemedView style={styles.container}>
      <Header title="Manage" />
      <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'meals' && <MealsTab canEditMeals={canEditMeals} />}
      {activeTab === 'mentees' && isMentor && <MenteesTab />}
      {activeTab === 'registrations' && !isMentor && <RegistrationsTab />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
