/**
 * Scanner Screen - QR code scanning for meal collection
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Camera } from 'expo-camera';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { Header } from '@/src/components/common/Header';
import { EmptyState } from '@/src/components/common/EmptyState';
import { QRScannerSection } from '@/src/components/scanner/QRScannerSection';
import { QRGeneratorSection } from '@/src/components/scanner/QRGeneratorSection';
import { ManualRegistrationSection } from '@/src/components/scanner/ManualRegistrationSection';
import { RecentCollections } from '@/src/components/scanner/RecentCollections';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';

export default function ScannerScreen() {
  const { spacing, colors } = useTheme();
  const { currentUser, getTodaysMeal, getRegistrationStats, registrations, users } = useStore();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const todaysMeal = getTodaysMeal();
  const todayStats = todaysMeal ? getRegistrationStats(todaysMeal.id) : null;

  const isStudent = currentUser.role === 'student';
  const isMentor = currentUser.role === 'mentor';
  const canManageCollections = ['mentor', 'staff', 'admin'].includes(currentUser.role);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const recentCollections = todaysMeal && !isStudent
    ? registrations
        .filter(r => r.mealId === todaysMeal.id && r.collected)
        .sort((a, b) => (b.collectedAt || '').localeCompare(a.collectedAt || ''))
        .slice(0, 10)
    : [];

  if (!todaysMeal) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Scanner" />
        <EmptyState
          icon="calendar-outline"
          title="No Meal Today"
          message="There is no meal scheduled for today. Scanner is not available."
        />
      </ThemedView>
    );
  }

  if (hasPermission === null) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Scanner" />
        <View style={styles.centerContent}>
          <ThemedText>Requesting camera permission...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (hasPermission === false) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Scanner" />
        <EmptyState
          icon="camera-outline"
          title="No Camera Access"
          message="Please grant camera permissions in your device settings to use the QR scanner."
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title="Scanner" />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        {/* Today's Meal Info */}
        <ThemedCard style={{ marginBottom: spacing.lg }}>
          <View style={styles.mealHeader}>
            <Ionicons name="restaurant" size={32} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <ThemedText variant="subheading" weight="semibold">
                {todaysMeal.mealName}
              </ThemedText>
              <ThemedText variant="caption" color="textSecondary">
                Today's Meal
              </ThemedText>
            </View>
          </View>

          {!isStudent && todayStats && (
            <View style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <ThemedText variant="title" weight="bold" color="primary">{todayStats.total}</ThemedText>
                  <ThemedText variant="caption" color="textSecondary">Registered</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText variant="title" weight="bold" color="success">{todayStats.collected}</ThemedText>
                  <ThemedText variant="caption" color="textSecondary">Collected</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText variant="title" weight="bold" color="warning">{todayStats.pending}</ThemedText>
                  <ThemedText variant="caption" color="textSecondary">Pending</ThemedText>
                </View>
              </View>
            </View>
          )}
        </ThemedCard>

        <QRScannerSection
          showCamera={showCamera}
          setShowCamera={setShowCamera}
          isStudent={isStudent}
        />

        {isMentor && (
          <QRGeneratorSection meal={todaysMeal} stats={todayStats} />
        )}

        {canManageCollections && (
          <ManualRegistrationSection meal={todaysMeal} />
        )}

        {!isStudent && (
          <RecentCollections collections={recentCollections} users={users} />
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
});
