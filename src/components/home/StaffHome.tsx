import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { Header } from '@/src/components/common/Header';
import { Badge } from '@/src/components/common/Badge';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { StatCard } from '@/src/components/common/StatCard';
import { MealCard } from '@/src/components/meal/MealCard';
import { useStore } from '@/src/store';
import { useTheme } from '@/src/theme';

export function StaffHome() {
  const { spacing, colors } = useTheme();
  const { currentUser, getTodaysMeal, getUpcomingMeals, getRegistrationStats } = useStore();

  const [refreshing, setRefreshing] = useState(false);

  const todaysMeal = getTodaysMeal();
  const upcomingMeals = getUpcomingMeals(7).filter(m => m.id !== todaysMeal?.id);
  const todayStats = todaysMeal ? getRegistrationStats(todaysMeal.id) : null;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Home" />
      <ScrollView
        contentContainerStyle={{ padding: spacing.md }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={{ marginBottom: spacing.lg }}>
          <ThemedText variant="heading" weight="bold" style={{ fontSize: 28, marginBottom: spacing.sm }}>
            Hi, {currentUser.fullName.split(' ')[0]}!
          </ThemedText>
          <Badge label="STAFF" variant="warning" size="sm" />
        </View>

        {/* Today's Stats */}
        <View style={{ marginBottom: spacing.xl }}>
          <SectionHeader icon="stats-chart" title="Today's Overview" />

          <View style={{ marginTop: spacing.md, gap: spacing.md }}>
            <StatCard
              icon="people"
              value={todayStats?.total || 0}
              label="Registered for Today"
              color="success"
              variant="wide"
            />
            <StatCard
              icon="checkmark-circle"
              value={todayStats?.collected || 0}
              label="Already Collected"
              color="primary"
              variant="wide"
            />
            {todayStats && todayStats.pending > 0 && (
              <StatCard
                icon="time"
                value={todayStats.pending}
                label="Still Pending"
                color="warning"
                variant="wide"
                borderLeftColor={colors.warning}
              />
            )}
          </View>
        </View>

        {/* Today's Meal */}
        {todaysMeal && (
          <View style={{ marginBottom: spacing.xl }}>
            <SectionHeader icon="restaurant" title="Today's Meal" />
            <View style={{ marginTop: spacing.md }}>
              <MealCard meal={todaysMeal} showActions={false} />
            </View>
          </View>
        )}

        {/* Upcoming Meals */}
        {upcomingMeals.length > 0 && (
          <View style={{ marginBottom: spacing.xl }}>
            <SectionHeader icon="calendar-outline" title="Upcoming Meals" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
