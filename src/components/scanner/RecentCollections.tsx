import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { Badge } from '@/src/components/common/Badge';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useTheme } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { formatTime } from '@/src/utils/dateHelpers';
import type { MealRegistration, User } from '@/src/types';

interface RecentCollectionsProps {
  collections: MealRegistration[];
  users: User[];
}

export function RecentCollections({ collections, users }: RecentCollectionsProps) {
  const { spacing, colors } = useTheme();

  if (collections.length === 0) return null;

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <SectionHeader icon="time-outline" title={`Recent Collections (${collections.length})`} />
      <View style={{ marginTop: spacing.md }}>
        {collections.map(collection => {
          const user = users.find(u => u.id === collection.userId);
          if (!user) return null;

          return (
            <ThemedCard key={collection.id} style={{ marginBottom: spacing.sm }}>
              <View style={styles.collectionRow}>
                <View
                  style={[
                    styles.collectionIcon,
                    { backgroundColor: `${colors.success}15`, marginRight: spacing.md },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="body" weight="semibold">
                    {user.fullName}
                  </ThemedText>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs }}>
                    <Badge
                      label={collection.collectedVia === 'qr_scan' ? 'QR Scan' : 'Manual'}
                      variant={collection.collectedVia === 'qr_scan' ? 'success' : 'info'}
                      size="sm"
                    />
                    <ThemedText variant="caption" color="textSecondary" style={{ marginLeft: spacing.sm }}>
                      {collection.collectedAt ? formatTime(collection.collectedAt) : 'Just now'}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </ThemedCard>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  collectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
