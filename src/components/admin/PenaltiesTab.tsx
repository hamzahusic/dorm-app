import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { Badge } from '@/src/components/common/Badge';
import { EmptyState } from '@/src/components/common/EmptyState';
import { StatusFilter } from '@/src/components/common/StatusFilter';
import { PenaltyCard } from '@/src/components/penalty/PenaltyCard';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';

export function PenaltiesTab() {
  const { spacing, colors } = useTheme();
  const { users, getAllPenalties, clearPenalty, currentUser } = useStore();
  const [penaltyFilter, setPenaltyFilter] = useState<'active' | 'cleared'>('active');
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const allPenalties = getAllPenalties();

  const studentsWithSixPenalties = users.filter(u => {
    const userPenalties = allPenalties.filter(p => p.userId === u.id && !p.cleared);
    return userPenalties.length >= 6;
  });

  const handleClearPenalty = (penaltyId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    clearPenalty(penaltyId, currentUser.id, 'Cleared by admin');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md }}>
      {/* Explanatory Text */}
      <ThemedCard style={{ marginBottom: spacing.md, backgroundColor: `${colors.warning}10`, padding: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Ionicons name="information-circle" size={20} color={colors.warning} />
          <ThemedText variant="caption" weight="semibold" style={{ flex: 1 }}>
            {penaltyFilter === 'active'
              ? 'Showing students who have reached 6 or more active penalties and require immediate attention.'
              : 'Showing all cleared penalties across all students.'}
          </ThemedText>
        </View>
      </ThemedCard>

      {/* Penalty Filter */}
      <View style={{ marginBottom: spacing.md }}>
        <StatusFilter
          options={[
            { key: 'active', label: 'Active', color: colors.error, count: studentsWithSixPenalties.length },
            { key: 'cleared', label: 'Cleared', color: colors.success, count: allPenalties.filter(p => p.cleared).length },
          ]}
          activeFilter={penaltyFilter}
          onFilterChange={(key) => setPenaltyFilter(key as 'active' | 'cleared')}
        />
      </View>

      {/* Active Penalties */}
      {penaltyFilter === 'active' && (
        <>
          {studentsWithSixPenalties.length === 0 ? (
            <EmptyState
              icon="shield-checkmark-outline"
              title="All Clear!"
              message="No students have reached 6 penalties. Great job!"
            />
          ) : (
            studentsWithSixPenalties.map(student => {
              const studentPenalties = allPenalties.filter(p => p.userId === student.id && !p.cleared);
              const isExpanded = expandedStudentId === student.id;

              return (
                <View key={student.id} style={{ marginBottom: spacing.md }}>
                  <TouchableOpacity
                    onPress={() => setExpandedStudentId(isExpanded ? null : student.id)}
                    activeOpacity={0.7}
                  >
                    <ThemedCard style={{ borderLeftWidth: 4, borderLeftColor: colors.error }}>
                      <View style={styles.studentRow}>
                        <View
                          style={[
                            styles.studentIcon,
                            { backgroundColor: `${colors.error}15`, marginRight: spacing.md },
                          ]}
                        >
                          <Ionicons name="alert-circle" size={24} color={colors.error} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <ThemedText variant="body" weight="semibold">
                            {student.fullName}
                          </ThemedText>
                          <ThemedText variant="caption" color="textSecondary">
                            {student.email}
                          </ThemedText>
                          <Badge
                            label={`${studentPenalties.length} Active ${studentPenalties.length === 1 ? 'Penalty' : 'Penalties'}`}
                            variant="error"
                            size="sm"
                            style={{ marginTop: spacing.xs }}
                          />
                        </View>
                        <Ionicons
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={24}
                          color={colors.textSecondary}
                        />
                      </View>
                    </ThemedCard>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={{ marginTop: spacing.sm, marginLeft: spacing.md }}>
                      <ThemedText variant="caption" weight="semibold" color="textSecondary" style={{ marginBottom: spacing.sm, marginLeft: spacing.sm }}>
                        All Penalties:
                      </ThemedText>
                      {studentPenalties.map(penalty => (
                        <PenaltyCard
                          key={penalty.id}
                          penalty={penalty}
                          showClearButton
                          onClear={handleClearPenalty}
                        />
                      ))}
                    </View>
                  )}
                </View>
              );
            })
          )}
        </>
      )}

      {/* Cleared Penalties */}
      {penaltyFilter === 'cleared' && (
        <>
          {allPenalties.filter(p => p.cleared).length === 0 ? (
            <EmptyState
              icon="shield-checkmark-outline"
              title="No Cleared Penalties"
              message="No penalties have been cleared yet."
            />
          ) : (
            allPenalties.filter(p => p.cleared).map(penalty => (
              <PenaltyCard key={penalty.id} penalty={penalty} showClearButton={false} />
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
