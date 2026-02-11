/**
 * Manage Screen - Meal and registration management
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { ThemedButton } from '@/src/components/themed/ThemedButton';
import { Header } from '@/src/components/common/Header';
import { Badge } from '@/src/components/common/Badge';
import { EmptyState } from '@/src/components/common/EmptyState';
import { PenaltyCard } from '@/src/components/penalty/PenaltyCard';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';
import { getDayLabel, isPast } from '@/src/utils/dateHelpers';
import type { Meal } from '@/src/types';

export default function ManageScreen() {
  const { spacing, colors } = useTheme();
  const { currentUser, meals, getRegistrationStats, registrations, users, markAsCollected, getAllPenalties, deleteMeal } = useStore();
  const isMentor = currentUser.role === 'mentor';
  const [activeTab, setActiveTab] = useState<'meals' | 'registrations' | 'mentees'>('meals');
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'collected' | 'pending'>('all');
  const [expandedMenteeId, setExpandedMenteeId] = useState<string | null>(null);

  const upcomingMeals = meals.filter(m => !isPast(m.date));
  const pastMeals = meals.filter(m => isPast(m.date));

  // Mentor-specific data
  const mentees = isMentor ? users.filter(u => u.reportsTo === currentUser.id) : [];
  const allPenalties = getAllPenalties();
  const getMenteePenalties = (menteeId: string) => allPenalties.filter(p => p.userId === menteeId && !p.cleared);

  const selectedMeal = selectedMealId ? meals.find(m => m.id === selectedMealId) : null;
  const mealRegistrations = selectedMeal
    ? registrations.filter(r => r.mealId === selectedMeal.id)
    : [];

  const filteredRegistrations = mealRegistrations.filter(r => {
    if (statusFilter === 'collected') return r.collected;
    if (statusFilter === 'pending') return !r.collected;
    return true;
  });

  return (
    <ThemedView style={styles.container}>
      <Header title="Manage" />

      {/* Tab Switcher */}
      <View style={[styles.tabContainer, { padding: spacing.md, backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'meals' ? colors.primary : 'transparent',
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.lg,
              borderRadius: 8,
            },
          ]}
          onPress={() => setActiveTab('meals')}
        >
          <ThemedText
            weight="semibold"
            style={{ color: activeTab === 'meals' ? '#FFFFFF' : colors.text }}
          >
            Meals
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === (isMentor ? 'mentees' : 'registrations') ? colors.primary : 'transparent',
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.lg,
              borderRadius: 8,
            },
          ]}
          onPress={() => setActiveTab(isMentor ? 'mentees' : 'registrations')}
        >
          <ThemedText
            weight="semibold"
            style={{ color: activeTab === (isMentor ? 'mentees' : 'registrations') ? '#FFFFFF' : colors.text }}
          >
            {isMentor ? 'Mentees' : 'Registrations'}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Meals Tab */}
      {activeTab === 'meals' && (
        <ScrollView contentContainerStyle={{ padding: spacing.md }}>
          <ThemedButton
            variant="primary"
            onPress={() => router.push('/modal/create-meal')}
            icon={<Ionicons name="add" size={20} color="#FFFFFF" />}
            style={{ marginBottom: spacing.lg }}
          >
            Create New Meal
          </ThemedButton>

          {/* Upcoming Meals */}
          <View style={{ marginBottom: spacing.xl }}>
            <ThemedText variant="subheading" weight="semibold" style={{ marginBottom: spacing.md }}>
              Upcoming Meals ({upcomingMeals.length})
            </ThemedText>
            {upcomingMeals.length === 0 ? (
              <EmptyState
                icon="calendar-outline"
                title="No Upcoming Meals"
                message="Create a new meal to get started."
              />
            ) : (
              upcomingMeals.map(meal => {
                const stats = getRegistrationStats(meal.id);
                return (
                  <ThemedCard key={meal.id} style={{ marginBottom: spacing.md }}>
                    <View style={styles.mealCardHeader}>
                      <View style={{ flex: 1 }}>
                        <ThemedText variant="caption" color="textSecondary">
                          {getDayLabel(meal.date)}
                        </ThemedText>
                        <ThemedText variant="subheading" weight="semibold" style={{ marginTop: spacing.xs }}>
                          {meal.mealName}
                        </ThemedText>
                        {meal.description && (
                          <ThemedText variant="caption" color="textSecondary" style={{ marginTop: spacing.xs }} numberOfLines={2}>
                            {meal.description}
                          </ThemedText>
                        )}
                      </View>
                    </View>
                    <View style={[styles.statsRow, { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }]}>
                      <View style={styles.statCol}>
                        <ThemedText variant="lg" weight="bold" color="primary">
                          {stats.total}
                        </ThemedText>
                        <ThemedText variant="caption" color="textSecondary">
                          Registered
                        </ThemedText>
                      </View>
                      <View style={styles.statCol}>
                        <ThemedText variant="lg" weight="bold" color="success">
                          {stats.collected}
                        </ThemedText>
                        <ThemedText variant="caption" color="textSecondary">
                          Collected
                        </ThemedText>
                      </View>
                      <View style={styles.statCol}>
                        <ThemedText variant="lg" weight="bold" color="warning">
                          {stats.pending}
                        </ThemedText>
                        <ThemedText variant="caption" color="textSecondary">
                          Pending
                        </ThemedText>
                      </View>
                    </View>
                    {isMentor && (
                      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                        <ThemedButton
                          variant="outline"
                          size="sm"
                          onPress={() => router.push(`/modal/edit-meal?id=${meal.id}`)}
                          icon={<Ionicons name="pencil" size={16} color={colors.primary} />}
                        >
                          Edit
                        </ThemedButton>
                        <ThemedButton
                          variant="outline"
                          size="sm"
                          onPress={() => {
                            Alert.alert(
                              'Delete Meal',
                              'Are you sure you want to delete this meal? This action cannot be undone.',
                              [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                  text: 'Delete',
                                  style: 'destructive',
                                  onPress: () => {
                                    deleteMeal(meal.id);
                                    Alert.alert('Success', 'Meal deleted successfully');
                                  }
                                }
                              ]
                            );
                          }}
                          icon={<Ionicons name="trash" size={16} color={colors.error} />}
                        >
                          Delete
                        </ThemedButton>
                      </View>
                    )}
                  </ThemedCard>
                );
              })
            )}
          </View>

          {/* Past Meals */}
          {pastMeals.length > 0 && (
            <View>
              <ThemedText variant="subheading" weight="semibold" style={{ marginBottom: spacing.md }}>
                Past Meals ({pastMeals.length})
              </ThemedText>
              {pastMeals.slice(0, 5).map(meal => {
                const stats = getRegistrationStats(meal.id);
                return (
                  <ThemedCard key={meal.id} style={{ marginBottom: spacing.md }}>
                    <View>
                      <ThemedText variant="caption" color="textSecondary">
                        {getDayLabel(meal.date)}
                      </ThemedText>
                      <ThemedText variant="body" weight="semibold" style={{ marginTop: spacing.xs }}>
                        {meal.mealName}
                      </ThemedText>
                      <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
                        <Badge label={`${stats.total} Registered`} variant="neutral" size="sm" />
                        <Badge label={`${stats.collected} Collected`} variant="success" size="sm" />
                      </View>
                    </View>
                  </ThemedCard>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}

      {/* Mentees Tab (Mentors only) */}
      {activeTab === 'mentees' && isMentor && (
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

                  {/* Expanded Penalties Section */}
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
      )}

      {/* Registrations Tab */}
      {activeTab === 'registrations' && !isMentor && (
        <ScrollView contentContainerStyle={{ padding: spacing.md }}>
          {/* Meal Selector */}
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
                    style={[
                      {
                        marginRight: spacing.sm,
                        minWidth: 200,
                        backgroundColor: selectedMealId === meal.id ? `${colors.primary}15` : colors.card,
                        borderWidth: 2,
                        borderColor: selectedMealId === meal.id ? colors.primary : colors.border,
                      },
                    ]}
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

          {!selectedMeal ? (
            <EmptyState
              icon="document-text-outline"
              title="Select a Meal"
              message="Choose a meal from above to view registrations."
            />
          ) : (
            <>
              {/* Status Filter */}
              <View style={[styles.filterContainer, { marginBottom: spacing.md }]}>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor: statusFilter === 'all' ? colors.primary : colors.surface,
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.md,
                      borderRadius: 8,
                    },
                  ]}
                  onPress={() => setStatusFilter('all')}
                >
                  <ThemedText
                    variant="caption"
                    weight="semibold"
                    style={{ color: statusFilter === 'all' ? '#FFFFFF' : colors.text }}
                  >
                    All ({mealRegistrations.length})
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor: statusFilter === 'collected' ? colors.success : colors.surface,
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.md,
                      borderRadius: 8,
                    },
                  ]}
                  onPress={() => setStatusFilter('collected')}
                >
                  <ThemedText
                    variant="caption"
                    weight="semibold"
                    style={{ color: statusFilter === 'collected' ? '#FFFFFF' : colors.text }}
                  >
                    Collected ({mealRegistrations.filter(r => r.collected).length})
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor: statusFilter === 'pending' ? colors.warning : colors.surface,
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.md,
                      borderRadius: 8,
                    },
                  ]}
                  onPress={() => setStatusFilter('pending')}
                >
                  <ThemedText
                    variant="caption"
                    weight="semibold"
                    style={{ color: statusFilter === 'pending' ? '#FFFFFF' : colors.text }}
                  >
                    Pending ({mealRegistrations.filter(r => !r.collected).length})
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Registrations List */}
              {filteredRegistrations.length === 0 ? (
                <EmptyState
                  icon="person-outline"
                  title="No Registrations"
                  message={`No ${statusFilter !== 'all' ? statusFilter : ''} registrations for this meal.`}
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
                        {!registration.collected && (
                          <ThemedButton
                            variant="secondary"
                            size="sm"
                            onPress={() => markAsCollected(registration.id, 'manual')}
                          >
                            Collect
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
  mealCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCol: {
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
  },
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
