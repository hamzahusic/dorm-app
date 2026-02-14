import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { ThemedButton } from '@/src/components/themed/ThemedButton';
import { Badge } from '@/src/components/common/Badge';
import { EmptyState } from '@/src/components/common/EmptyState';
import { SearchInput } from '@/src/components/common/SearchInput';
import { StatusFilter } from '@/src/components/common/StatusFilter';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';
import { getDayLabel } from '@/src/utils/dateHelpers';

export function RegistrationsTab() {
  const { spacing, colors } = useTheme();
  const { currentUser, meals, registrations, users, markAsCollected, undoCollection, getTodaysMeal } = useStore();

  const isStaff = currentUser.role === 'staff';
  const isAdmin = currentUser.role === 'admin';

  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'collected' | 'pending'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const todaysMeal = getTodaysMeal();
  const effectiveSelectedMealId = (isStaff || isAdmin) ? todaysMeal?.id || null : selectedMealId;
  const selectedMeal = effectiveSelectedMealId ? meals.find(m => m.id === effectiveSelectedMealId) : null;
  const mealRegistrations = selectedMeal
    ? registrations.filter(r => r.mealId === selectedMeal.id)
    : [];

  const filteredRegistrations = mealRegistrations.filter(r => {
    if (statusFilter === 'collected') return r.collected;
    if (statusFilter === 'pending') {
      if (r.collected) return false;
      if (searchQuery.trim()) {
        const user = users.find(u => u.id === r.userId);
        if (user) {
          const query = searchQuery.toLowerCase();
          return user.fullName.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);
        }
        return false;
      }
      return true;
    }
    return true;
  });

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md }}>
      {/* Meal Selector - Only for non-staff/admin */}
      {!isStaff && !isAdmin && (
        <View style={{ marginBottom: spacing.lg }}>
          <ThemedText variant="body" weight="semibold" style={{ marginBottom: spacing.sm }}>
            Select Meal
          </ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {meals.slice(0, 10).map(meal => (
              <TouchableOpacity
                key={meal.id}
                onPress={() => setSelectedMealId(meal.id)}
                activeOpacity={0.7}
              >
                <ThemedCard
                  style={{
                    marginRight: spacing.sm,
                    minWidth: 200,
                    backgroundColor: selectedMealId === meal.id ? `${colors.primary}15` : colors.card,
                    borderWidth: 2,
                    borderColor: selectedMealId === meal.id ? colors.primary : colors.border,
                  }}
                >
                  <ThemedText variant="caption" color="textSecondary">
                    {getDayLabel(meal.date)}
                  </ThemedText>
                  <ThemedText variant="body" weight="semibold" style={{ marginTop: spacing.xs }}>
                    {meal.mealName}
                  </ThemedText>
                  {selectedMealId === meal.id && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={{ position: 'absolute', top: 12, right: 12 }} />
                  )}
                </ThemedCard>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Staff/Admin: Today's Meal Info */}
      {(isStaff || isAdmin) && todaysMeal && (
        <View style={{ marginBottom: spacing.lg }}>
          <ThemedCard style={{ padding: spacing.md, backgroundColor: `${colors.primary}10`, borderLeftWidth: 4, borderLeftColor: colors.primary }}>
            <ThemedText variant="caption" color="textSecondary">Today's Meal</ThemedText>
            <ThemedText variant="subheading" weight="bold" style={{ marginTop: spacing.xs }}>
              {todaysMeal.mealName}
            </ThemedText>
          </ThemedCard>
        </View>
      )}

      {!selectedMeal ? (
        <EmptyState
          icon="document-text-outline"
          title={(isStaff || isAdmin) ? 'No Meal Today' : 'Select a Meal'}
          message={(isStaff || isAdmin) ? 'There is no meal scheduled for today.' : 'Choose a meal from above to view registrations.'}
        />
      ) : (
        <>
          <View style={{ marginBottom: spacing.md }}>
            <StatusFilter
              options={[
                { key: 'pending', label: 'Pending', color: colors.warning, count: mealRegistrations.filter(r => !r.collected).length },
                { key: 'collected', label: 'Collected', color: colors.success, count: mealRegistrations.filter(r => r.collected).length },
              ]}
              activeFilter={statusFilter}
              onFilterChange={(key) => setStatusFilter(key as 'collected' | 'pending')}
            />
          </View>

          {/* Search Input - Only for Pending */}
          {statusFilter === 'pending' && (
            <View style={{ marginBottom: spacing.md }}>
              <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search pending by name or email..."
              />
            </View>
          )}

          {/* Registrations List */}
          {filteredRegistrations.length === 0 ? (
            <EmptyState
              icon="person-outline"
              title="No Registrations"
              message={
                statusFilter === 'pending' && searchQuery.trim()
                  ? 'No pending registrations found matching your search.'
                  : `No ${statusFilter} registrations for this meal.`
              }
            />
          ) : (
            filteredRegistrations.map(registration => {
              const user = users.find(u => u.id === registration.userId);
              if (!user) return null;

              return (
                <ThemedCard key={registration.id} style={{ marginBottom: spacing.sm }}>
                  <View style={styles.registrationRow}>
                    <View
                      style={[
                        styles.registrationIcon,
                        {
                          backgroundColor: registration.collected ? `${colors.success}15` : `${colors.warning}15`,
                          marginRight: spacing.md,
                        },
                      ]}
                    >
                      <Ionicons
                        name={registration.collected ? 'checkmark-circle' : 'time'}
                        size={24}
                        color={registration.collected ? colors.success : colors.warning}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText variant="body" weight="semibold">
                        {user.fullName}
                      </ThemedText>
                      <ThemedText variant="caption" color="textSecondary">
                        {user.email}
                      </ThemedText>
                      {registration.collected && registration.collectedVia && (
                        <Badge
                          label={registration.collectedVia === 'qr_scan' ? 'QR Scan' : 'Manual'}
                          variant="success"
                          size="sm"
                          style={{ marginTop: spacing.xs }}
                        />
                      )}
                    </View>
                    {!registration.collected ? (
                      <ThemedButton
                        variant="secondary"
                        size="sm"
                        onPress={() => markAsCollected(registration.id, 'manual')}
                      >
                        Collect
                      </ThemedButton>
                    ) : (
                      <ThemedButton
                        variant="outline"
                        size="sm"
                        onPress={() => {
                          Alert.alert(
                            'Undo Collection',
                            `Undo collection for ${user.fullName}?`,
                            [
                              { text: 'Cancel', style: 'cancel' },
                              {
                                text: 'Undo',
                                style: 'destructive',
                                onPress: () => {
                                  undoCollection(registration.id);
                                  Alert.alert('Success', 'Collection undone successfully');
                                },
                              },
                            ]
                          );
                        }}
                        icon={<Ionicons name="arrow-undo" size={16} color={colors.error} />}
                      >
                        Undo
                      </ThemedButton>
                    )}
                  </View>
                </ThemedCard>
              );
            })
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  registrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registrationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
