import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl, Switch, Alert } from 'react-native';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { Header } from '@/src/components/common/Header';
import { Badge } from '@/src/components/common/Badge';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { MealCard } from '@/src/components/meal/MealCard';
import { PenaltyCard } from '@/src/components/penalty/PenaltyCard';
import { EmptyState } from '@/src/components/common/EmptyState';
import { CountdownTimer } from '@/src/components/common/CountdownTimer';
import { useStore } from '@/src/store';
import { useTheme } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import { getDayLabel } from '@/src/utils/dateHelpers';
import { isBeforeDeadline, isDuringService } from '@/src/utils/timeHelpers';
import { MEAL_TIMES } from '@/src/constants/app';

export function StudentMentorHome() {
  const { spacing, colors } = useTheme();
  const {
    currentUser,
    getTodaysMeal,
    getUpcomingMeals,
    getPenaltiesForUser,
    getUnreadCount,
    users,
    registrations,
    isUserRegisteredForMeal,
    toggleWantsMeal,
    registerForMeal,
    optOutOfMeal,
  } = useStore();

  const [refreshing, setRefreshing] = useState(false);

  const todaysMeal = getTodaysMeal();
  const upcomingMeals = getUpcomingMeals(7).filter(m => m.id !== todaysMeal?.id);
  const userPenalties = getPenaltiesForUser(currentUser.id).filter(p => !p.cleared);
  const unreadNotifications = getUnreadCount(currentUser.id);

  const isRegisteredForToday = todaysMeal ? isUserRegisteredForMeal(currentUser.id, todaysMeal.id) : false;
  const todayRegistration = todaysMeal ? registrations.find(r => r.userId === currentUser.id && r.mealId === todaysMeal.id) : null;
  const hasCollectedToday = todayRegistration?.collected ?? false;
  const canRegister = isBeforeDeadline();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleWantsMealToggle = () => {
    const newValue = !currentUser.wantsMeal;
    toggleWantsMeal();

    if (todaysMeal && canRegister) {
      if (newValue && !isRegisteredForToday) {
        registerForMeal(todaysMeal.id);
      } else if (!newValue && isRegisteredForToday) {
        optOutOfMeal(todaysMeal.id);
      }
    }

    Alert.alert(
      '✅ Preference Updated',
      newValue
        ? 'Meal registration enabled! You are now registered for today\'s meal and upcoming meals will be auto-registered.'
        : 'Meal registration disabled. You have been unregistered from today\'s meal and upcoming meals will not auto-register.',
      [{ text: 'Got it' }]
    );
  };

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
          <SectionHeader icon="restaurant" title="Today's Meal" />

          {todaysMeal ? (
            <ThemedCard
              style={{
                ...styles.heroCard,
                marginTop: spacing.md,
                borderLeftWidth: 4,
                borderLeftColor: isRegisteredForToday ? colors.success : canRegister ? colors.warning : colors.error,
              }}
            >
              {/* Registration Status Banner */}
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

              {/* Collection Status Banner */}
              {isRegisteredForToday && (
                <View
                  style={[
                    styles.statusBanner,
                    {
                      backgroundColor: hasCollectedToday ? `${colors.success}20` : `${colors.warning}20`,
                      marginBottom: spacing.md,
                      padding: spacing.sm,
                      borderRadius: 8,
                    },
                  ]}
                >
                  <View style={styles.statusRow}>
                    <Ionicons
                      name={hasCollectedToday ? 'checkmark-done-circle' : 'time'}
                      size={20}
                      color={hasCollectedToday ? colors.success : colors.warning}
                    />
                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                      {hasCollectedToday ? (
                        <>
                          <ThemedText variant="body" weight="bold" color="success">
                            ✓ Meal Collected
                          </ThemedText>
                          <ThemedText variant="caption" color="textSecondary">
                            You have collected your meal
                          </ThemedText>
                        </>
                      ) : (
                        <>
                          <ThemedText variant="body" weight="bold" color="warning">
                            Not Collected Yet
                          </ThemedText>
                          <ThemedText variant="caption" color="textSecondary">
                            Scan QR code at dinner to collect
                          </ThemedText>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              )}

              {/* Meal Info */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm }}>
                <View style={{ backgroundColor: `${colors.primary}15`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
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
            style={{
              padding: spacing.md,
              ...(userPenalties.length > 0 ? { borderLeftWidth: 4, borderLeftColor: colors.error } : {}),
            }}
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

        {/* Penalties Details */}
        {userPenalties.length > 0 && (
          <View style={{ marginBottom: spacing.xl }}>
            <SectionHeader icon="warning" title={`Active Penalties (${userPenalties.length})`} iconColor={colors.error} />
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
            <SectionHeader icon="calendar-outline" title="Upcoming Meals" />
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
                          <Badge label="Will Auto-Register" variant="info" size="sm" />
                        ) : (
                          <Badge label="Will Not Register" variant="neutral" size="sm" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
