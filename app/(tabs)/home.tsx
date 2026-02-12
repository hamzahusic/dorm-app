/**
 * Home Screen - Dashboard with role-specific content
 */

import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl, Switch, Alert } from 'react-native';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { Header } from '@/src/components/common/Header';
import { Badge } from '@/src/components/common/Badge';
import { MealCard } from '@/src/components/meal/MealCard';
import { PenaltyCard } from '@/src/components/penalty/PenaltyCard';
import { EmptyState } from '@/src/components/common/EmptyState';
import { CountdownTimer } from '@/src/components/common/CountdownTimer';
import { RegistrationButton } from '@/src/components/registration/RegistrationButton';
import { useStore } from '@/src/store';
import { useTheme } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { getDayLabel, formatDate, isToday } from '@/src/utils/dateHelpers';
import { isBeforeDeadline, isDuringService, getRegistrationStatus } from '@/src/utils/timeHelpers';
import { MEAL_TIMES } from '@/src/constants/app';

export default function HomeScreen() {
  const { spacing, colors } = useTheme();
  const {
    currentUser,
    getTodaysMeal,
    getUpcomingMeals,
    getPenaltiesForUser,
    getUnreadCount,
    users,
    registrations,
    getAllPenalties,
    getRegistrationStats,
    meals,
    isUserRegisteredForMeal,
    toggleWantsMeal,
  } = useStore();

  const [refreshing, setRefreshing] = useState(false);

  const todaysMeal = getTodaysMeal();
  const upcomingMeals = getUpcomingMeals(7).filter(m => m.id !== todaysMeal?.id);
  const userPenalties = getPenaltiesForUser(currentUser.id).filter(p => !p.cleared);
  const unreadNotifications = getUnreadCount(currentUser.id);

  const isRegisteredForToday = todaysMeal ? isUserRegisteredForMeal(currentUser.id, todaysMeal.id) : false;
  const registrationStatus = getRegistrationStatus();
  const canRegister = isBeforeDeadline();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleWantsMealToggle = () => {
    const newValue = !currentUser.wantsMeal;
    toggleWantsMeal();
    Alert.alert(
      '✅ Preference Updated',
      newValue
        ? 'Meal registration enabled! Meals for the next days will be automatically registered. You still need to scan QR code at dinner time.'
        : 'Meal registration disabled. You\'ll need to manually register for each meal and scan QR code at dinner time.',
      [{ text: 'Got it' }]
    );
  };

  // STUDENT & MENTOR VIEW - Enhanced with beautiful UI
  if (currentUser.role === 'student' || currentUser.role === 'mentor') {
    return (
      <ThemedView style={styles.container}>
        <Header
          title="Home"
          rightElement={
            unreadNotifications > 0 ? (
              <View style={styles.notificationBadge}>
                <Ionicons name="notifications" size={24} color={colors.text} />
                <View style={[styles.notificationDot, { backgroundColor: colors.error }]}>
                  <ThemedText variant="caption" weight="bold" style={{ color: '#FFFFFF', fontSize: 10 }}>
                    {unreadNotifications}
                  </ThemedText>
                </View>
              </View>
            ) : undefined
          }
        />
        <ScrollView
          contentContainerStyle={{ padding: spacing.md }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={{ marginBottom: spacing.lg }}>
            <ThemedText variant="heading" weight="bold" style={{ fontSize: 28, marginBottom: spacing.sm }}>
              Hi, {currentUser.fullName.split(' ')[0]}! 👋
            </ThemedText>
            <Badge label={currentUser.role.toUpperCase()} variant="primary" size="sm" />

            {/* Register for Meals Toggle */}
            <ThemedCard style={{ marginTop: spacing.md, padding: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs }}>
                    <Ionicons name="repeat" size={20} color={colors.primary} />
                    <ThemedText variant="subheading" weight="semibold">
                      Register for Meals
                    </ThemedText>
                  </View>
                  <ThemedText variant="caption" color="textSecondary">
                    {currentUser.wantsMeal
                      ? 'Meals for the next days will be automatically registered if this is left turned on. You still need to scan QR code at dinner time.'
                      : 'You need to manually scan QR code for every meal at dinner time'}
                  </ThemedText>
                </View>
                <Switch
                  value={currentUser.wantsMeal}
                  onValueChange={handleWantsMealToggle}
                  trackColor={{ false: colors.disabled, true: colors.success }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor={colors.disabled}
                />
              </View>
            </ThemedCard>
          </View>

          {/* Today's Meal - Hero Card */}
          <View style={{ marginBottom: spacing.xl }}>
            <View style={styles.sectionHeader}>
              <Ionicons name="restaurant" size={24} color={colors.text} />
              <ThemedText variant="subheading" weight="semibold" style={{ marginLeft: spacing.sm }}>
                Today's Meal
              </ThemedText>
            </View>

            {todaysMeal ? (
              <ThemedCard
                style={[
                  styles.heroCard,
                  {
                    marginTop: spacing.md,
                    borderLeftWidth: 4,
                    borderLeftColor: isRegisteredForToday ? colors.success : canRegister ? colors.warning : colors.error,
                  },
                ]}
              >
                {/* Status Banner */}
                <View
                  style={[
                    styles.statusBanner,
                    {
                      backgroundColor: isRegisteredForToday
                        ? `${colors.success}20`
                        : canRegister
                        ? `${colors.warning}20`
                        : `${colors.error}20`,
                      marginBottom: spacing.md,
                      padding: spacing.sm,
                      borderRadius: 8,
                    },
                  ]}
                >
                  <View style={styles.statusRow}>
                    <Ionicons
                      name={isRegisteredForToday ? 'checkmark-circle' : canRegister ? 'alert-circle' : 'close-circle'}
                      size={20}
                      color={isRegisteredForToday ? colors.success : canRegister ? colors.warning : colors.error}
                    />
                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                      {isRegisteredForToday ? (
                        <>
                          <ThemedText variant="body" weight="bold" color="success">
                            ✓ You're Registered
                          </ThemedText>
                          <ThemedText variant="caption" color="textSecondary">
                            Collect between {MEAL_TIMES.SERVICE_START} - {MEAL_TIMES.SERVICE_END}
                          </ThemedText>
                        </>
                      ) : canRegister ? (
                        <>
                          <ThemedText variant="body" weight="bold" color="warning">
                            Not Registered Yet
                          </ThemedText>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                            <ThemedText variant="caption" color="textSecondary">
                              Register by {MEAL_TIMES.REGISTRATION_DEADLINE} •{' '}
                            </ThemedText>
                            <CountdownTimer targetTime={MEAL_TIMES.REGISTRATION_DEADLINE} />
                          </View>
                        </>
                      ) : (
                        <>
                          <ThemedText variant="body" weight="bold" color="error">
                            Too Late - Registration Closed
                          </ThemedText>
                          <ThemedText variant="caption" color="textSecondary">
                            You didn't register in time. Deadline was {MEAL_TIMES.REGISTRATION_DEADLINE}
                          </ThemedText>
                        </>
                      )}
                    </View>
                  </View>
                </View>

                {/* Meal Info */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm }}>
                  <View style={[styles.dateBadge, { backgroundColor: `${colors.primary}15`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }]}>
                    <ThemedText variant="caption" weight="semibold" color="primary">
                      {getDayLabel(todaysMeal.date)}
                    </ThemedText>
                  </View>
                  {isDuringService() && <Badge label="🍽️ Service Now" variant="success" size="sm" />}
                </View>

                <ThemedText variant="title" weight="bold" style={{ marginBottom: spacing.sm, fontSize: 24 }}>
                  {todaysMeal.mealName}
                </ThemedText>

                {todaysMeal.description && (
                  <ThemedText color="textSecondary" style={{ marginBottom: spacing.md, lineHeight: 20 }} numberOfLines={2}>
                    {todaysMeal.description}
                  </ThemedText>
                )}

                {/* Action Button */}
                {canRegister && <RegistrationButton mealId={todaysMeal.id} mealDate={todaysMeal.date} />}
              </ThemedCard>
            ) : (
              <EmptyState
                icon="calendar-outline"
                title="No Meal Today"
                message="There is no meal scheduled for today. Check back tomorrow!"
              />
            )}
          </View>

          {/* Penalties Summary */}
          <View style={{ marginBottom: spacing.xl }}>
            <ThemedCard
              style={[
                { padding: spacing.md },
                userPenalties.length > 0 && {
                  borderLeftWidth: 4,
                  borderLeftColor: colors.error,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs }}>
                    <Ionicons
                      name={userPenalties.length > 0 ? 'alert-circle' : 'checkmark-circle'}
                      size={20}
                      color={userPenalties.length > 0 ? colors.error : colors.success}
                    />
                    <ThemedText variant="subheading" weight="semibold">
                      Your Penalties
                    </ThemedText>
                  </View>
                  <ThemedText variant="caption" color="textSecondary">
                    {userPenalties.length === 0
                      ? 'You have a clean record. Keep it up!'
                      : `You have ${userPenalties.length} active ${userPenalties.length === 1 ? 'penalty' : 'penalties'}. Please collect your registered meals.`}
                  </ThemedText>

                  {/* Mentor Info */}
                  {currentUser.role === 'student' && currentUser.reportsTo && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm }}>
                      <Ionicons name="person-circle-outline" size={16} color={colors.primary} />
                      <ThemedText variant="caption" color="textSecondary">
                        Your mentor:{' '}
                        <ThemedText variant="caption" weight="semibold" color="primary">
                          {users.find(u => u.id === currentUser.reportsTo)?.fullName || 'Not assigned'}
                        </ThemedText>
                      </ThemedText>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.penaltyCountBadge,
                    {
                      backgroundColor: userPenalties.length > 0 ? `${colors.error}20` : `${colors.success}20`,
                    },
                  ]}
                >
                  <ThemedText
                    variant="title"
                    weight="bold"
                    color={userPenalties.length > 0 ? 'error' : 'success'}
                    style={{ fontSize: 32 }}
                  >
                    {userPenalties.length}
                  </ThemedText>
                </View>
              </View>
            </ThemedCard>
          </View>

          {/* Penalties Details (if any) */}
          {userPenalties.length > 0 && (
            <View style={{ marginBottom: spacing.xl }}>
              <View style={styles.sectionHeader}>
                <Ionicons name="warning" size={24} color={colors.error} />
                <ThemedText variant="subheading" weight="semibold" style={{ marginLeft: spacing.sm }}>
                  Active Penalties ({userPenalties.length})
                </ThemedText>
              </View>
              <View style={{ marginTop: spacing.md }}>
                {userPenalties.slice(0, 3).map(penalty => (
                  <PenaltyCard key={penalty.id} penalty={penalty} />
                ))}
                {userPenalties.length > 3 && (
                  <ThemedText variant="caption" color="textSecondary" style={{ textAlign: 'center', marginTop: spacing.sm }}>
                    +{userPenalties.length - 3} more penalties
                  </ThemedText>
                )}
              </View>
            </View>
          )}

          {/* Upcoming Meals */}
          {upcomingMeals.length > 0 && (
            <View style={{ marginBottom: spacing.xl }}>
              <View style={styles.sectionHeader}>
                <Ionicons name="calendar-outline" size={24} color={colors.text} />
                <ThemedText variant="subheading" weight="semibold" style={{ marginLeft: spacing.sm }}>
                  Upcoming Meals
                </ThemedText>
              </View>
              <View style={{ marginTop: spacing.md }}>
                {upcomingMeals.map(meal => {
                  const isReg = isUserRegisteredForMeal(currentUser.id, meal.id);
                  const willAutoRegister = !isReg && currentUser.wantsMeal;

                  return (
                    <ThemedCard key={meal.id} style={{ marginBottom: spacing.md }}>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                          <ThemedText variant="caption" color="textSecondary">
                            {getDayLabel(meal.date)}
                          </ThemedText>
                          <ThemedText variant="subheading" weight="semibold" style={{ marginTop: spacing.xs }}>
                            {meal.mealName}
                          </ThemedText>
                          {meal.description && (
                            <ThemedText variant="caption" color="textSecondary" style={{ marginTop: spacing.xs }} numberOfLines={1}>
                              {meal.description}
                            </ThemedText>
                          )}
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          {isReg ? (
                            <Badge label="✓ Registered" variant="success" size="sm" />
                          ) : willAutoRegister ? (
                            <Badge label="Will auto-register" variant="info" size="sm" />
                          ) : (
                            <Badge label="Not registered" variant="neutral" size="sm" />
                          )}
                        </View>
                      </View>
                    </ThemedCard>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    );
  }

  // STAFF VIEW
  if (currentUser.role === 'staff') {
    const todayStats = todaysMeal ? getRegistrationStats(todaysMeal.id) : null;
    const totalStudents = users.filter(u => u.role === 'student').length;

    return (
      <ThemedView style={styles.container}>
        <Header title="Home" />
        <ScrollView contentContainerStyle={{ padding: spacing.md }}>
          <View style={{ marginBottom: spacing.lg }}>
            <ThemedText variant="heading" weight="semibold">
              Staff Dashboard
            </ThemedText>
            <Badge label="STAFF" variant="warning" style={{ marginTop: spacing.sm }} />
          </View>

          <View style={{ marginBottom: spacing.xl }}>
            <View style={styles.sectionHeader}>
              <Ionicons name="stats-chart" size={24} color={colors.text} />
              <ThemedText variant="subheading" weight="semibold" style={{ marginLeft: spacing.sm }}>
                System Overview
              </ThemedText>
            </View>
            <View style={[styles.statsGrid, { marginTop: spacing.md }]}>
              <ThemedCard style={styles.statCard}>
                <ThemedText variant="xxxl" weight="bold" color="primary">
                  {totalStudents}
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  Total Students
                </ThemedText>
              </ThemedCard>
              <ThemedCard style={styles.statCard}>
                <ThemedText variant="xxxl" weight="bold" color="success">
                  {todayStats?.total || 0}
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  Registered Today
                </ThemedText>
              </ThemedCard>
              <ThemedCard style={styles.statCard}>
                <ThemedText variant="xxxl" weight="bold" color="warning">
                  {todayStats?.collected || 0}
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  Collected
                </ThemedText>
              </ThemedCard>
            </View>
          </View>

          {todaysMeal && (
            <View style={{ marginBottom: spacing.xl }}>
              <View style={styles.sectionHeader}>
                <Ionicons name="restaurant" size={24} color={colors.text} />
                <ThemedText variant="subheading" weight="semibold" style={{ marginLeft: spacing.sm }}>
                  Today's Meal
                </ThemedText>
              </View>
              <View style={{ marginTop: spacing.md }}>
                <MealCard meal={todaysMeal} showActions={false} />
                {todayStats && (
                  <ThemedCard style={{ marginTop: spacing.md }}>
                    <ThemedText variant="body" weight="semibold">
                      Collection Progress
                    </ThemedText>
                    <View style={{ marginTop: spacing.sm }}>
                      <View style={styles.progressRow}>
                        <ThemedText variant="caption" color="textSecondary">
                          Registered:
                        </ThemedText>
                        <ThemedText variant="caption" weight="semibold">
                          {todayStats.total}
                        </ThemedText>
                      </View>
                      <View style={styles.progressRow}>
                        <ThemedText variant="caption" color="textSecondary">
                          Collected:
                        </ThemedText>
                        <ThemedText variant="caption" weight="semibold" color="success">
                          {todayStats.collected}
                        </ThemedText>
                      </View>
                      <View style={styles.progressRow}>
                        <ThemedText variant="caption" color="textSecondary">
                          Pending:
                        </ThemedText>
                        <ThemedText variant="caption" weight="semibold" color="warning">
                          {todayStats.pending}
                        </ThemedText>
                      </View>
                    </View>
                  </ThemedCard>
                )}
              </View>
            </View>
          )}

          {upcomingMeals.length > 0 && (
            <View style={{ marginBottom: spacing.xl }}>
              <View style={styles.sectionHeader}>
                <Ionicons name="calendar-outline" size={24} color={colors.text} />
                <ThemedText variant="subheading" weight="semibold" style={{ marginLeft: spacing.sm }}>
                  Upcoming Meals
                </ThemedText>
              </View>
              <View style={{ marginTop: spacing.md }}>
                {upcomingMeals.slice(0, 3).map(meal => (
                  <MealCard key={meal.id} meal={meal} showActions={false} />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    );
  }

  // ADMIN VIEW
  if (currentUser.role === 'admin') {
    const totalUsers = users.length;
    const totalStudents = users.filter(u => u.role === 'student').length;
    const totalMeals = meals.length;
    const totalRegistrations = registrations.length;
    const activePenalties = getAllPenalties().filter(p => !p.cleared).length;
    const todayStats = todaysMeal ? getRegistrationStats(todaysMeal.id) : null;

    return (
      <ThemedView style={styles.container}>
        <Header title="Admin Dashboard" />
        <ScrollView contentContainerStyle={{ padding: spacing.md }}>
          <View style={{ marginBottom: spacing.lg }}>
            <ThemedText variant="heading" weight="semibold">
              System Administration
            </ThemedText>
            <Badge label="ADMIN" variant="error" style={{ marginTop: spacing.sm }} />
          </View>

          <View style={{ marginBottom: spacing.xl }}>
            <View style={styles.sectionHeader}>
              <Ionicons name="analytics" size={24} color={colors.text} />
              <ThemedText variant="subheading" weight="semibold" style={{ marginLeft: spacing.sm }}>
                System Statistics
              </ThemedText>
            </View>
            <View style={[styles.statsGrid, { marginTop: spacing.md }]}>
              <ThemedCard style={styles.statCard}>
                <ThemedText variant="xxxl" weight="bold" color="primary">
                  {totalUsers}
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  Total Users
                </ThemedText>
              </ThemedCard>
              <ThemedCard style={styles.statCard}>
                <ThemedText variant="xxxl" weight="bold" color="success">
                  {totalStudents}
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  Students
                </ThemedText>
              </ThemedCard>
              <ThemedCard style={styles.statCard}>
                <ThemedText variant="xxxl" weight="bold" color="warning">
                  {totalMeals}
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  Total Meals
                </ThemedText>
              </ThemedCard>
              <ThemedCard style={styles.statCard}>
                <ThemedText variant="xxxl" weight="bold" color="info">
                  {totalRegistrations}
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  Registrations
                </ThemedText>
              </ThemedCard>
              <ThemedCard style={styles.statCard}>
                <ThemedText variant="xxxl" weight="bold" color="error">
                  {activePenalties}
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  Active Penalties
                </ThemedText>
              </ThemedCard>
              <ThemedCard style={styles.statCard}>
                <ThemedText variant="xxxl" weight="bold" color="success">
                  {todayStats?.total || 0}
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary">
                  Today's Registrations
                </ThemedText>
              </ThemedCard>
            </View>
          </View>

          {todaysMeal && (
            <View style={{ marginBottom: spacing.xl }}>
              <View style={styles.sectionHeader}>
                <Ionicons name="restaurant" size={24} color={colors.text} />
                <ThemedText variant="subheading" weight="semibold" style={{ marginLeft: spacing.sm }}>
                  Today's Meal
                </ThemedText>
              </View>
              <View style={{ marginTop: spacing.md }}>
                <MealCard meal={todaysMeal} showActions={false} />
              </View>
            </View>
          )}

          <View style={{ marginBottom: spacing.xl }}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time-outline" size={24} color={colors.text} />
              <ThemedText variant="subheading" weight="semibold" style={{ marginLeft: spacing.sm }}>
                Recent Activity
              </ThemedText>
            </View>
            <ThemedCard style={{ marginTop: spacing.md }}>
              <ThemedText color="textSecondary" variant="caption">
                Activity feed coming soon...
              </ThemedText>
            </ThemedCard>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  heroCard: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  statusBanner: {
    elevation: 0,
  },
  dateBadge: {},
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  penaltyCountBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});
