/**
 * Penalty Card - displays penalty information
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedCard } from '../themed/ThemedCard';
import { ThemedText } from '../themed/ThemedText';
import { Badge } from '../common/Badge';
import { ThemedButton } from '../themed/ThemedButton';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { formatDateTime } from '@/src/utils/dateHelpers';
import { canClearPenalties } from '@/src/utils/roleHelpers';
import type { Penalty } from '@/src/types';

interface PenaltyCardProps {
  penalty: Penalty;
  showClearButton?: boolean;
  onClear?: (penaltyId: string) => void;
}

export function PenaltyCard({ penalty, showClearButton = false, onClear }: PenaltyCardProps) {
  const { spacing, colors } = useTheme();
  const { currentUser, getMealById, users } = useStore();

  const meal = getMealById(penalty.mealId);
  const user = users.find(u => u.id === penalty.userId);

  const getPenaltyTypeLabel = () => {
    return penalty.penaltyType === 'no_show' ? 'No Show' : 'Unregistered Collection';
  };

  const getPenaltyIcon = () => {
    return penalty.penaltyType === 'no_show' ? 'close-circle' : 'warning';
  };

  const canClear = canClearPenalties(currentUser.role) && !penalty.cleared;

  return (
    <ThemedCard style={{ marginBottom: spacing.md }}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.error}15`, marginRight: spacing.md }]}>
          <Ionicons name={getPenaltyIcon()} size={24} color={colors.error} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <ThemedText variant="body" weight="semibold">
              {getPenaltyTypeLabel()}
            </ThemedText>
            {penalty.cleared ? (
              <Badge label="Cleared" variant="success" size="sm" />
            ) : (
              <Badge label="Active" variant="error" size="sm" />
            )}
          </View>
          {meal && (
            <ThemedText color="textSecondary" variant="caption" style={{ marginTop: spacing.xs }}>
              {meal.mealName}
            </ThemedText>
          )}
        </View>
      </View>

      {user && currentUser.role !== 'student' && (
        <ThemedText color="textSecondary" variant="caption" style={{ marginTop: spacing.sm }}>
          Student: {user.fullName}
        </ThemedText>
      )}

      <ThemedText color="textSecondary" variant="caption" style={{ marginTop: spacing.xs }}>
        {formatDateTime(penalty.createdAt)}
      </ThemedText>

      {penalty.cleared && penalty.clearReason && (
        <View style={[styles.clearedSection, { marginTop: spacing.md, padding: spacing.sm, backgroundColor: colors.surface, borderRadius: 8 }]}>
          <ThemedText variant="caption" weight="semibold">
            Clear Reason:
          </ThemedText>
          <ThemedText variant="caption" color="textSecondary" style={{ marginTop: spacing.xs }}>
            {penalty.clearReason}
          </ThemedText>
        </View>
      )}

      {showClearButton && canClear && onClear && (
        <ThemedButton
          variant="secondary"
          size="sm"
          onPress={() => onClear(penalty.id)}
          style={{ marginTop: spacing.md }}
        >
          Clear Penalty
        </ThemedButton>
      )}
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearedSection: {},
});
