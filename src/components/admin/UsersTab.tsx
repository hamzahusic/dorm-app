import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { ThemedButton } from '@/src/components/themed/ThemedButton';
import { Badge } from '@/src/components/common/Badge';
import { EmptyState } from '@/src/components/common/EmptyState';
import { SearchInput } from '@/src/components/common/SearchInput';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';
import { getRoleLabel } from '@/src/utils/roleHelpers';
import type { UserRole } from '@/src/types';

export function UsersTab() {
  const { spacing, colors } = useTheme();
  const { users, toggleUserActiveStatus, currentUser, assignMentor } = useStore();
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all' | 'deactivated'>('all');
  const [changingRoleUserId, setChangingRoleUserId] = useState<string | null>(null);
  const [assigningMentorStudentId, setAssigningMentorStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const mentors = users.filter(u => u.role === 'mentor');

  const filteredUsers = users.filter(u => {
    if (roleFilter === 'deactivated') {
      if (u.isActive) return false;
    } else if (roleFilter !== 'all') {
      if (u.role !== roleFilter) return false;
    }

    if (roleFilter === 'all' && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return u.fullName.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
    }

    return true;
  });

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    Alert.alert(
      'Change Role',
      `Are you sure you want to change this user's role to ${getRoleLabel(newRole)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: () => {
            Alert.alert('Success', 'Role changed successfully');
            setChangingRoleUserId(null);
          },
        },
      ]
    );
  };

  const handleAssignMentor = (studentId: string, mentorId: string) => {
    assignMentor(studentId, mentorId);
    Alert.alert('Success', 'Mentor assigned successfully');
    setAssigningMentorStudentId(null);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md }}>
      {/* Search Bar */}
      {roleFilter === 'all' && (
        <View style={{ marginBottom: spacing.md }}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* Role Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {(['all', 'student', 'mentor', 'staff', 'deactivated'] as const).map(filter => {
            const count = filter === 'deactivated'
              ? users.filter(u => !u.isActive).length
              : filter === 'all'
              ? users.length
              : users.filter(u => u.role === filter).length;

            return (
              <TouchableOpacity
                key={filter}
                onPress={() => {
                  setRoleFilter(filter);
                  setSearchQuery('');
                }}
                activeOpacity={0.7}
                style={{
                  backgroundColor: roleFilter === filter ? colors.primary : colors.surface,
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: 8,
                }}
              >
                <ThemedText
                  variant="caption"
                  weight="semibold"
                  style={{ color: roleFilter === filter ? '#FFFFFF' : colors.text }}
                >
                  {filter === 'all' ? 'All' : filter === 'deactivated' ? 'Deactivated' : getRoleLabel(filter)} ({count})
                </ThemedText>
              </TouchableOpacity>
            );
          })}
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
          <ThemedCard key={user.id} style={{ marginBottom: spacing.md, position: 'relative', overflow: 'hidden' }}>
            <View style={{ opacity: !user.isActive ? 0.4 : 1 }}>
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
                        user.role === 'admin' ? 'error'
                          : user.role === 'staff' ? 'warning'
                          : user.role === 'mentor' ? 'success'
                          : 'primary'
                      }
                      size="sm"
                    />
                    {(user.role === 'student' || user.role === 'mentor') && (
                      <Badge
                        label={user.wantsMeal ? 'Wants Meals' : 'No Meals'}
                        variant={user.wantsMeal ? 'success' : 'neutral'}
                        size="sm"
                      />
                    )}
                  </View>
                </View>
                {user.id !== currentUser.id && user.isActive && roleFilter !== 'mentor' && roleFilter !== 'student' && roleFilter !== 'staff' && (
                  <ThemedButton
                    variant="outline"
                    size="sm"
                    onPress={() => toggleUserActiveStatus(user.id)}
                  >
                    Deactivate
                  </ThemedButton>
                )}
              </View>

              {/* Action Buttons */}
              {user.isActive && (
                <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                  {roleFilter !== 'mentor' && roleFilter !== 'student' && roleFilter !== 'staff' && (
                    <ThemedButton
                      variant="outline"
                      size="sm"
                      onPress={() => setChangingRoleUserId(changingRoleUserId === user.id ? null : user.id)}
                      icon={<Ionicons name="shield" size={16} color={colors.primary} />}
                      style={{ flex: 1 }}
                    >
                      Change Role
                    </ThemedButton>
                  )}
                  {user.role === 'student' && (
                    <ThemedButton
                      variant="outline"
                      size="sm"
                      onPress={() => setAssigningMentorStudentId(assigningMentorStudentId === user.id ? null : user.id)}
                      icon={<Ionicons name="person-add" size={16} color={colors.success} />}
                      style={{ flex: 1 }}
                    >
                      Assign Mentor
                    </ThemedButton>
                  )}
                </View>
              )}

              {/* Role Change Options */}
              {changingRoleUserId === user.id && user.isActive && (
                <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
                  <ThemedText variant="caption" weight="semibold" color="textSecondary">
                    Select new role:
                  </ThemedText>
                  <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
                    {(['student', 'mentor', 'staff', 'admin'] as UserRole[]).map(role => (
                      <TouchableOpacity
                        key={role}
                        onPress={() => handleChangeRole(user.id, role)}
                        disabled={user.role === role}
                        style={{
                          backgroundColor: user.role === role ? colors.disabled : colors.primary,
                          paddingVertical: spacing.xs,
                          paddingHorizontal: spacing.sm,
                          borderRadius: 6,
                        }}
                      >
                        <ThemedText variant="caption" weight="semibold" style={{ color: '#FFFFFF' }}>
                          {getRoleLabel(role)}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Mentor Assignment Options */}
              {assigningMentorStudentId === user.id && mentors.length > 0 && user.isActive && (
                <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
                  <ThemedText variant="caption" weight="semibold" color="textSecondary">
                    Select mentor:
                  </ThemedText>
                  <View style={{ gap: spacing.xs }}>
                    {mentors.map(mentor => (
                      <TouchableOpacity
                        key={mentor.id}
                        onPress={() => handleAssignMentor(user.id, mentor.id)}
                        style={{
                          backgroundColor: user.reportsTo === mentor.id ? `${colors.success}20` : colors.surface,
                          padding: spacing.sm,
                          borderRadius: 6,
                          borderWidth: user.reportsTo === mentor.id ? 2 : 1,
                          borderColor: user.reportsTo === mentor.id ? colors.success : colors.border,
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <View>
                            <ThemedText variant="caption" weight="semibold">
                              {mentor.fullName}
                            </ThemedText>
                            <ThemedText variant="caption" color="textSecondary" style={{ fontSize: 10 }}>
                              {mentor.email}
                            </ThemedText>
                          </View>
                          {user.reportsTo === mentor.id && (
                            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {assigningMentorStudentId === user.id && mentors.length === 0 && user.isActive && (
                <View style={{ marginTop: spacing.md }}>
                  <ThemedText variant="caption" color="error">
                    No mentors available. Please create mentor accounts first.
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Inactive Overlay */}
            {!user.isActive && user.id !== currentUser.id && (
              <View style={[styles.inactiveOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md }}>
                  <View style={{ flex: 1, marginRight: spacing.md }}>
                    <ThemedText variant="body" weight="bold" style={{ marginBottom: 4, color: '#FFFFFF' }}>
                      {user.fullName} - Deactivated
                    </ThemedText>
                    <ThemedText variant="caption" style={{ fontSize: 12, color: '#FFFFFF' }}>
                      Cannot access the system
                    </ThemedText>
                  </View>
                  <ThemedButton
                    variant="primary"
                    size="sm"
                    onPress={() => toggleUserActiveStatus(user.id)}
                    icon={<Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />}
                  >
                    Activate
                  </ThemedButton>
                </View>
              </View>
            )}
          </ThemedCard>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});
