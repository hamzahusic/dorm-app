/**
 * Admin Screen - User and penalty management
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { ThemedButton } from '@/src/components/themed/ThemedButton';
import { Header } from '@/src/components/common/Header';
import { Badge } from '@/src/components/common/Badge';
import { PenaltyCard } from '@/src/components/penalty/PenaltyCard';
import { EmptyState } from '@/src/components/common/EmptyState';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';
import { getRoleLabel, getRoleColor } from '@/src/utils/roleHelpers';
import type { UserRole } from '@/src/types';

export default function AdminScreen() {
  const { spacing, colors } = useTheme();
  const { users, getAllPenalties, toggleUserActiveStatus, clearPenalty, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<'users' | 'penalties' | 'settings'>('users');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [penaltyFilter, setPenaltyFilter] = useState<'all' | 'active' | 'cleared'>('active');

  const allPenalties = getAllPenalties();

  const filteredUsers = users.filter(u => {
    if (roleFilter === 'all') return true;
    return u.role === roleFilter;
  });

  const filteredPenalties = allPenalties.filter(p => {
    if (penaltyFilter === 'all') return true;
    if (penaltyFilter === 'active') return !p.cleared;
    return p.cleared;
  });

  const handleClearPenalty = (penaltyId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    clearPenalty(penaltyId, currentUser.id, 'Cleared by admin');
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Admin Panel" />

      {/* Tab Switcher */}
      <View style={[styles.tabContainer, { padding: spacing.md, backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'users' ? colors.primary : 'transparent',
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: 8,
            },
          ]}
          onPress={() => setActiveTab('users')}
        >
          <ThemedText
            variant="caption"
            weight="semibold"
            style={{ color: activeTab === 'users' ? '#FFFFFF' : colors.text }}
          >
            Users
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'penalties' ? colors.primary : 'transparent',
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: 8,
            },
          ]}
          onPress={() => setActiveTab('penalties')}
        >
          <ThemedText
            variant="caption"
            weight="semibold"
            style={{ color: activeTab === 'penalties' ? '#FFFFFF' : colors.text }}
          >
            Penalties
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'settings' ? colors.primary : 'transparent',
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: 8,
            },
          ]}
          onPress={() => setActiveTab('settings')}
        >
          <ThemedText
            variant="caption"
            weight="semibold"
            style={{ color: activeTab === 'settings' ? '#FFFFFF' : colors.text }}
          >
            Settings
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <ScrollView contentContainerStyle={{ padding: spacing.md }}>
          {/* Role Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {(['all', 'student', 'mentor', 'staff', 'admin'] as const).map(role => (
                <TouchableOpacity
                  key={role}
                  onPress={() => setRoleFilter(role)}
                  style={[
                    {
                      backgroundColor: roleFilter === role ? colors.primary : colors.surface,
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.md,
                      borderRadius: 8,
                    },
                  ]}
                >
                  <ThemedText
                    variant="caption"
                    weight="semibold"
                    style={{ color: roleFilter === role ? '#FFFFFF' : colors.text }}
                  >
                    {role === 'all' ? 'All' : getRoleLabel(role)} ({users.filter(u => role === 'all' || u.role === role).length})
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Users List */}
          {filteredUsers.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title="No Users"
              message="No users found with the selected filter."
            />
          ) : (
            filteredUsers.map(user => (
              <ThemedCard key={user.id} style={{ marginBottom: spacing.md }}>
                <View style={styles.userRow}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
                      <ThemedText variant="body" weight="semibold">
                        {user.fullName}
                      </ThemedText>
                      {!user.isActive && (
                        <Badge label="Inactive" variant="error" size="sm" style={{ marginLeft: spacing.sm }} />
                      )}
                    </View>
                    <ThemedText variant="caption" color="textSecondary">
                      {user.email}
                    </ThemedText>
                    <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
                      <Badge
                        label={getRoleLabel(user.role)}
                        variant={
                          user.role === 'admin'
                            ? 'error'
                            : user.role === 'staff'
                            ? 'warning'
                            : user.role === 'mentor'
                            ? 'success'
                            : 'primary'
                        }
                        size="sm"
                      />
                      <Badge
                        label={user.wantsMeal ? 'Wants Meals' : 'No Meals'}
                        variant={user.wantsMeal ? 'success' : 'neutral'}
                        size="sm"
                      />
                    </View>
                  </View>
                  {user.id !== currentUser.id && (
                    <ThemedButton
                      variant={user.isActive ? 'outline' : 'secondary'}
                      size="sm"
                      onPress={() => toggleUserActiveStatus(user.id)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </ThemedButton>
                  )}
                </View>
              </ThemedCard>
            ))
          )}
        </ScrollView>
      )}

      {/* Penalties Tab */}
      {activeTab === 'penalties' && (
        <ScrollView contentContainerStyle={{ padding: spacing.md }}>
          {/* Penalty Filter */}
          <View style={[styles.filterContainer, { marginBottom: spacing.md }]}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                {
                  backgroundColor: penaltyFilter === 'all' ? colors.primary : colors.surface,
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: 8,
                },
              ]}
              onPress={() => setPenaltyFilter('all')}
            >
              <ThemedText
                variant="caption"
                weight="semibold"
                style={{ color: penaltyFilter === 'all' ? '#FFFFFF' : colors.text }}
              >
                All ({allPenalties.length})
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                {
                  backgroundColor: penaltyFilter === 'active' ? colors.error : colors.surface,
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: 8,
                },
              ]}
              onPress={() => setPenaltyFilter('active')}
            >
              <ThemedText
                variant="caption"
                weight="semibold"
                style={{ color: penaltyFilter === 'active' ? '#FFFFFF' : colors.text }}
              >
                Active ({allPenalties.filter(p => !p.cleared).length})
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                {
                  backgroundColor: penaltyFilter === 'cleared' ? colors.success : colors.surface,
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: 8,
                },
              ]}
              onPress={() => setPenaltyFilter('cleared')}
            >
              <ThemedText
                variant="caption"
                weight="semibold"
                style={{ color: penaltyFilter === 'cleared' ? '#FFFFFF' : colors.text }}
              >
                Cleared ({allPenalties.filter(p => p.cleared).length})
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Penalties List */}
          {filteredPenalties.length === 0 ? (
            <EmptyState
              icon="shield-checkmark-outline"
              title="No Penalties"
              message={`No ${penaltyFilter !== 'all' ? penaltyFilter : ''} penalties found.`}
            />
          ) : (
            filteredPenalties.map(penalty => (
              <PenaltyCard
                key={penalty.id}
                penalty={penalty}
                showClearButton
                onClear={handleClearPenalty}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <ScrollView contentContainerStyle={{ padding: spacing.md }}>
          <ThemedCard>
            <ThemedText variant="subheading" weight="semibold" style={{ marginBottom: spacing.md }}>
              System Settings
            </ThemedText>

            <View style={{ gap: spacing.lg }}>
              <View>
                <ThemedText variant="body" weight="semibold" style={{ marginBottom: spacing.sm }}>
                  Meal Times
                </ThemedText>
                <View style={{ gap: spacing.sm }}>
                  <View style={styles.settingRow}>
                    <ThemedText variant="caption" color="textSecondary">
                      Registration Deadline:
                    </ThemedText>
                    <ThemedText variant="caption" weight="semibold">
                      2:00 PM
                    </ThemedText>
                  </View>
                  <View style={styles.settingRow}>
                    <ThemedText variant="caption" color="textSecondary">
                      Service Start:
                    </ThemedText>
                    <ThemedText variant="caption" weight="semibold">
                      5:00 PM
                    </ThemedText>
                  </View>
                  <View style={styles.settingRow}>
                    <ThemedText variant="caption" color="textSecondary">
                      Service End:
                    </ThemedText>
                    <ThemedText variant="caption" weight="semibold">
                      8:00 PM
                    </ThemedText>
                  </View>
                </View>
              </View>

              <View>
                <ThemedText variant="body" weight="semibold" style={{ marginBottom: spacing.sm }}>
                  Penalty Thresholds
                </ThemedText>
                <View style={{ gap: spacing.sm }}>
                  <View style={styles.settingRow}>
                    <ThemedText variant="caption" color="textSecondary">
                      Mentor Notification:
                    </ThemedText>
                    <ThemedText variant="caption" weight="semibold">
                      3 penalties
                    </ThemedText>
                  </View>
                  <View style={styles.settingRow}>
                    <ThemedText variant="caption" color="textSecondary">
                      Admin Notification:
                    </ThemedText>
                    <ThemedText variant="caption" weight="semibold">
                      6 penalties
                    </ThemedText>
                  </View>
                </View>
              </View>

              <View>
                <ThemedText variant="body" weight="semibold" style={{ marginBottom: spacing.sm }}>
                  Notification Settings
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  Email and push notification settings will be available when the backend is integrated.
                </ThemedText>
              </View>
            </View>
          </ThemedCard>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
