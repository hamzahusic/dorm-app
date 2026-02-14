import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { ThemedButton } from '@/src/components/themed/ThemedButton';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { SearchInput } from '@/src/components/common/SearchInput';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';
import type { Meal, User } from '@/src/types';

interface ManualRegistrationSectionProps {
  meal: Meal;
}

export function ManualRegistrationSection({ meal }: ManualRegistrationSectionProps) {
  const { spacing, colors } = useTheme();
  const { registrations, users, markAsCollected } = useStore();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const registeredStudents = users
    .filter(u => {
      const reg = registrations.find(r => r.userId === u.id && r.mealId === meal.id);
      if (!reg || reg.collected) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return u.fullName.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
      }

      return true;
    })
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  const handleManualScan = () => {
    if (!selectedUserId) return;

    const registration = registrations.find(
      r => r.userId === selectedUserId && r.mealId === meal.id
    );

    if (registration) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      markAsCollected(registration.id, 'manual');
      setSelectedUserId(null);
    }
  };

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <SectionHeader icon="person-add" title="Manual Registration" />
      <ThemedCard style={{ marginTop: spacing.md }}>
        <View style={{ marginBottom: spacing.md }}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name or email..."
          />
        </View>

        {registeredStudents.length === 0 ? (
          <View style={{ paddingVertical: spacing.lg }}>
            <ThemedText color="textSecondary" style={{ textAlign: 'center' }}>
              {searchQuery.trim()
                ? 'No students found matching your search.'
                : 'All registered students have collected their meals.'}
            </ThemedText>
          </View>
        ) : (
          <>
            <ThemedText variant="body" weight="semibold" style={{ marginBottom: spacing.sm }}>
              Select Student ({registeredStudents.length} pending)
            </ThemedText>

            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
              {registeredStudents.map(student => (
                <TouchableOpacity
                  key={student.id}
                  onPress={() => setSelectedUserId(student.id)}
                  activeOpacity={0.7}
                >
                  <ThemedCard
                    style={{
                      ...styles.studentCard,
                      backgroundColor: selectedUserId === student.id ? `${colors.primary}15` : colors.surface,
                      borderWidth: 2,
                      borderColor: selectedUserId === student.id ? colors.primary : colors.border,
                      marginBottom: spacing.sm,
                    }}
                  >
                    <View style={styles.studentCardContent}>
                      <View style={{ flex: 1 }}>
                        <ThemedText variant="body" weight="semibold">
                          {student.fullName}
                        </ThemedText>
                        <ThemedText variant="caption" color="textSecondary">
                          {student.email}
                        </ThemedText>
                      </View>
                      {selectedUserId === student.id && (
                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                      )}
                    </View>
                  </ThemedCard>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
              <ThemedButton
                variant="primary"
                onPress={handleManualScan}
                disabled={!selectedUserId}
              >
                Mark as Collected
              </ThemedButton>
              {selectedUserId && (
                <ThemedButton
                  variant="outline"
                  onPress={() => setSelectedUserId(null)}
                  icon={<Ionicons name="close-circle" size={20} color={colors.error} />}
                >
                  Clear Selection
                </ThemedButton>
              )}
            </View>
          </>
        )}
      </ThemedCard>
    </View>
  );
}

const styles = StyleSheet.create({
  studentCard: {
    padding: 12,
  },
  studentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
