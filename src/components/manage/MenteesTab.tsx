import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { Badge } from '@/src/components/common/Badge';
import { EmptyState } from '@/src/components/common/EmptyState';
import { PenaltyCard } from '@/src/components/penalty/PenaltyCard';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';

export function MenteesTab() {
  const { spacing, colors } = useTheme();
  const { currentUser, users, getAllPenalties } = useStore();
  const [expandedMenteeId, setExpandedMenteeId] = useState<string | null>(null);

  const mentees = users.filter(u => u.reportsTo === currentUser.id);
  const allPenalties = getAllPenalties();
  const getMenteePenalties = (menteeId: string) => allPenalties.filter(p => p.userId === menteeId && !p.cleared);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md }}>
      <View style={{ marginBottom: spacing.md }}>
        <ThemedText variant="subheading" weight="semibold">
          Your Mentees ({mentees.length})
        </ThemedText>
        <ThemedText variant="caption" color="textSecondary" style={{ marginTop: spacing.xs }}>
          Tap on a mentee to view their penalties
        </ThemedText>
      </View>

      {mentees.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="No Mentees"
          message="You don't have any mentees assigned to you yet."
        />
      ) : (
        mentees.map(mentee => {
          const menteePenalties = getMenteePenalties(mentee.id);
          const isExpanded = expandedMenteeId === mentee.id;

          return (
            <View key={mentee.id} style={{ marginBottom: spacing.md }}>
              <TouchableOpacity
                onPress={() => setExpandedMenteeId(isExpanded ? null : mentee.id)}
                activeOpacity={0.7}
              >
                <ThemedCard>
                  <View style={styles.menteeRow}>
                    <View
                      style={[
                        styles.menteeIcon,
                        {
                          backgroundColor: menteePenalties.length > 0 ? `${colors.error}15` : `${colors.success}15`,
                          marginRight: spacing.md,
                        },
                      ]}
                    >
                      <Ionicons
                        name="person"
                        size={24}
                        color={menteePenalties.length > 0 ? colors.error : colors.success}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText variant="body" weight="semibold">
                        {mentee.fullName}
                      </ThemedText>
                      <ThemedText variant="caption" color="textSecondary">
                        {mentee.email}
                      </ThemedText>
                      <View style={{ flexDirection: 'row', gap: spacing.xs, marginTop: spacing.xs }}>
                        <Badge
                          label={`${menteePenalties.length} ${menteePenalties.length === 1 ? 'Penalty' : 'Penalties'}`}
                          variant={menteePenalties.length > 0 ? 'error' : 'success'}
                          size="sm"
                        />
                      </View>
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
                  {menteePenalties.length === 0 ? (
                    <ThemedCard style={{ backgroundColor: `${colors.success}10` }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <ThemedText variant="body" color="success">
                          No active penalties. Great job!
                        </ThemedText>
                      </View>
                    </ThemedCard>
                  ) : (
                    <>
                      <ThemedText variant="caption" weight="semibold" color="textSecondary" style={{ marginBottom: spacing.sm, marginLeft: spacing.sm }}>
                        Active Penalties:
                      </ThemedText>
                      {menteePenalties.map(penalty => (
                        <PenaltyCard key={penalty.id} penalty={penalty} showClearButton />
                      ))}
                    </>
                  )}
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  menteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menteeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
