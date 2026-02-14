/**
 * Admin Screen - User and penalty management
 */

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Header } from '@/src/components/common/Header';
import { TabSwitcher } from '@/src/components/common/TabSwitcher';
import { UsersTab } from '@/src/components/admin/UsersTab';
import { PenaltiesTab } from '@/src/components/admin/PenaltiesTab';

const TABS = [
  { key: 'users', label: 'Users' },
  { key: 'penalties', label: 'Penalties' },
];

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <ThemedView style={styles.container}>
      <Header title="Admin Panel" />
      <TabSwitcher tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'penalties' && <PenaltiesTab />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
