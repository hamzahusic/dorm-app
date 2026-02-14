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

export function AdminHome() {
  const { spacing, colors } = useTheme();
  const { currentUser, getTodaysMeal, getUpcomingMeals, getRegistrationStats, users, meals, getAllPenalties } = useStore();

  const [refreshing, setRefreshing] = useState(false);

  const todaysMeal = getTodaysMeal();
  const upcomingMeals = getUpcomingMeals(7).filter(m => m.id !== todaysMeal?.id);
  const todayStats = todaysMeal ? getRegistrationStats(todaysMeal.id) : null;

  const totalUsers = users.length;
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalMeals = meals.length;
  const allPenalties = getAllPenalties();
  const studentsWithSixPenalties = users.filter(u => {
    const uPenalties = allPenalties.filter(p => p.userId === u.id && !p.cleared);
    return uPenalties.length >= 6;
  }).length;

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
          <Badge label="ADMIN" variant="error" size="sm" />
        </View>

        {/* System Statistics */}
        <View style={{ marginBottom: spacing.xl }}>
          <SectionHeader icon="analytics" title="System Statistics" />

          <View style={{ marginTop: spacing.md, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            <StatCard icon="people" value={totalUsers} label="Total Users" color="primary" />
            <StatCard icon="school" value={totalStudents} label="Students" color="success" />
            <StatCard icon="restaurant" value={totalMeals} label="Total Meals" color="warning" />
            {todayStats && (
              <StatCard icon="calendar" value={todayStats.total} label="Registered Today" color="primary" />
            )}
            {studentsWithSixPenalties > 0 && (
              <StatCard
                icon="alert-circle"
                value={studentsWithSixPenalties}
                label="6+ Penalties"
                color="error"
                borderLeftColor={colors.error}
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
