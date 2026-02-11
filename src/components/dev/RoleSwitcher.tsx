/**
 * Development Role Switcher - Floating button to test different user roles
 * Only visible in development mode
 */

import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemedView } from '../themed/ThemedView';
import { ThemedText } from '../themed/ThemedText';
import { ThemedButton } from '../themed/ThemedButton';
import { Badge } from '../common/Badge';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import type { UserRole } from '@/src/types';

const ROLES: { role: UserRole; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { role: 'student', label: 'Student', icon: 'school', color: '#2563EB' },
  { role: 'mentor', label: 'Mentor', icon: 'people', color: '#10B981' },
  { role: 'staff', label: 'Staff', icon: 'briefcase', color: '#F59E0B' },
  { role: 'admin', label: 'Admin', icon: 'shield-checkmark', color: '#EF4444' },
];

export function RoleSwitcher() {
  const [modalVisible, setModalVisible] = useState(false);
  const { colors, spacing, borderRadius } = useTheme();
  const { currentUser, setCurrentUserRole } = useStore();

  const handleRoleChange = (role: UserRole) => {
    // Haptic feedback on role change
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setCurrentUserRole(role);
    setModalVisible(false);
  };

  const getCurrentRoleColor = () => {
    const roleData = ROLES.find(r => r.role === currentUser.role);
    return roleData?.color || colors.primary;
  };

  return (
    <>
      {/* Floating Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          styles.floatingButton,
          {
            backgroundColor: getCurrentRoleColor(),
            shadowColor: colors.shadow,
          },
        ]}
        activeOpacity={0.8}
      >
        <Ionicons name="swap-horizontal" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Role Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <ThemedView
              variant="card"
              style={[
                styles.modalContent,
                {
                  padding: spacing.lg,
                  borderRadius: borderRadius.lg,
                  maxWidth: 400,
                },
              ]}
            >
              <View style={[styles.modalHeader, { marginBottom: spacing.lg }]}>
                <ThemedText variant="heading" weight="semibold">
                  Switch User Role
                </ThemedText>
                <Badge label="DEV ONLY" variant="warning" size="sm" />
              </View>

              <View style={styles.currentRole}>
                <ThemedText color="textSecondary" variant="caption">
                  Current Role:
                </ThemedText>
                <Badge
                  label={currentUser.role.toUpperCase()}
                  variant={
                    currentUser.role === 'admin'
                      ? 'error'
                      : currentUser.role === 'staff'
                      ? 'warning'
                      : currentUser.role === 'mentor'
                      ? 'success'
                      : 'primary'
                  }
                  style={{ marginLeft: spacing.sm }}
                />
              </View>

              <ThemedText
                color="textSecondary"
                variant="caption"
                style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}
              >
                {currentUser.fullName} • {currentUser.email}
              </ThemedText>

              <View style={{ gap: spacing.md }}>
                {ROLES.map(({ role, label, icon, color }) => (
                  <TouchableOpacity
                    key={role}
                    onPress={() => handleRoleChange(role)}
                    style={[
                      styles.roleButton,
                      {
                        backgroundColor: currentUser.role === role ? `${color}15` : colors.surface,
                        borderColor: currentUser.role === role ? color : colors.border,
                        borderWidth: 2,
                        borderRadius: borderRadius.md,
                        padding: spacing.md,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.roleButtonContent}>
                      <View
                        style={[
                          styles.roleIcon,
                          {
                            backgroundColor: color,
                            borderRadius: borderRadius.sm,
                            padding: spacing.sm,
                            marginRight: spacing.md,
                          },
                        ]}
                      >
                        <Ionicons name={icon} size={24} color="#FFFFFF" />
                      </View>
                      <ThemedText variant="subheading" weight="semibold">
                        {label}
                      </ThemedText>
                    </View>
                    {currentUser.role === role && (
                      <Ionicons name="checkmark-circle" size={24} color={color} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <ThemedButton
                variant="outline"
                onPress={() => setModalVisible(false)}
                style={{ marginTop: spacing.lg }}
              >
                Close
              </ThemedButton>
            </ThemedView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 90, // Above tab bar
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentRole: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
