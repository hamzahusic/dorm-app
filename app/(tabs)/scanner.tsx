/**
 * Scanner Screen - QR code scanning for meal collection
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert, TouchableOpacity, TextInput } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { ThemedButton } from '@/src/components/themed/ThemedButton';
import { Header } from '@/src/components/common/Header';
import { Badge } from '@/src/components/common/Badge';
import { EmptyState } from '@/src/components/common/EmptyState';
import { useTheme } from '@/src/theme';
import { useStore } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';
import { formatTime } from '@/src/utils/dateHelpers';

export default function ScannerScreen() {
  const { spacing, colors } = useTheme();
  const {
    currentUser,
    getTodaysMeal,
    getRegistrationStats,
    registrations,
    markAsCollected,
    users,
  } = useStore();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  const todaysMeal = getTodaysMeal();
  const todayStats = todaysMeal ? getRegistrationStats(todaysMeal.id) : null;

  const isStudent = currentUser.role === 'student';
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

  const registeredStudents = todaysMeal && canManageCollections
    ? users
        .filter(u => {
          const reg = registrations.find(r => r.userId === u.id && r.mealId === todaysMeal.id);
          if (!reg || reg.collected) return false;

          // Filter by search query
          if (studentSearchQuery.trim()) {
            const query = studentSearchQuery.toLowerCase();
            return u.fullName.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
          }

          return true;
        })
        .sort((a, b) => a.fullName.localeCompare(b.fullName))
    : [];

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    if (scanned) return;

    setScanned(true);
    setShowCamera(false);

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Show success message
    Alert.alert(
      '✅ QR Code Scanned',
      `Successfully scanned QR code and collected dinner!\n\nData: ${data}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setScanned(false);
          },
        },
      ]
    );
  };

  const handleManualScan = () => {
    if (!selectedUserId || !todaysMeal) return;

    const registration = registrations.find(
      r => r.userId === selectedUserId && r.mealId === todaysMeal.id
    );

    if (registration) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      markAsCollected(registration.id, 'manual');
      setSelectedUserId(null);
    }
  };

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
        {/* Today's Meal Info - Show for all roles */}
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

          {/* Stats - Only for staff/mentors */}
          {!isStudent && todayStats && (
            <View style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border }}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <ThemedText variant="xl" weight="bold" color="primary">
                    {todayStats.total}
                  </ThemedText>
                  <ThemedText variant="caption" color="textSecondary">
                    Registered
                  </ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText variant="xl" weight="bold" color="success">
                    {todayStats.collected}
                  </ThemedText>
                  <ThemedText variant="caption" color="textSecondary">
                    Collected
                  </ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText variant="xl" weight="bold" color="warning">
                    {todayStats.pending}
                  </ThemedText>
                  <ThemedText variant="caption" color="textSecondary">
                    Pending
                  </ThemedText>
                </View>
              </View>
            </View>
          )}
        </ThemedCard>

        {/* QR Scanner - Show for all roles */}
        <View style={{ marginBottom: spacing.lg }}>
          <View style={styles.sectionHeader}>
            <Ionicons name="qr-code" size={24} color={colors.text} />
            <ThemedText variant="subheading" weight="semibold" style={{ marginLeft: spacing.sm }}>
              QR Scanner
            </ThemedText>
          </View>
          <ThemedCard style={{ marginTop: spacing.md }}>
            {showCamera ? (
              <View style={styles.cameraContainer}>
                <CameraView
                  style={styles.camera}
                  facing="back"
                  barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                  }}
                  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
                <View style={styles.cameraOverlay}>
                  <View style={styles.scanArea}>
                    <View style={[styles.corner, styles.topLeft, { borderColor: colors.primary }]} />
                    <View style={[styles.corner, styles.topRight, { borderColor: colors.primary }]} />
                    <View style={[styles.corner, styles.bottomLeft, { borderColor: colors.primary }]} />
                    <View style={[styles.corner, styles.bottomRight, { borderColor: colors.primary }]} />
                  </View>
                  <ThemedText style={styles.scanText}>
                    Position QR code within the frame
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: colors.error }]}
                  onPress={() => {
                    setShowCamera(false);
                    setScanned(false);
                  }}
                >
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code-outline" size={120} color={colors.primary} />
                <ThemedText variant="subheading" weight="semibold" style={{ marginTop: spacing.md, textAlign: 'center' }}>
                  Scan QR Code
                </ThemedText>
                <ThemedText variant="caption" color="textSecondary" style={{ marginTop: spacing.xs, textAlign: 'center' }}>
                  {isStudent
                    ? 'Scan the QR code to collect your meal'
                    : 'Scan student QR code to mark meal as collected'}
                </ThemedText>
                <ThemedButton
                  variant="primary"
                  onPress={() => setShowCamera(true)}
                  icon={<Ionicons name="camera" size={20} color="#FFFFFF" />}
                  style={{ marginTop: spacing.lg }}
                >
                  Open Camera
                </ThemedButton>
              </View>
            )}
          </ThemedCard>
        </View>

        {/* Manual Registration - Only for staff/mentors */}
        {canManageCollections && (
          <View style={{ marginBottom: spacing.lg }}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-add" size={24} color={colors.text} />
              <ThemedText variant="subheading" weight="semibold" style={{ marginLeft: spacing.sm }}>
                Manual Registration
              </ThemedText>
            </View>
            <ThemedCard style={{ marginTop: spacing.md }}>
              {/* Search Input - Always visible */}
              <View style={{ position: 'relative', marginBottom: spacing.md }}>
                <TextInput
                  style={[
                    styles.searchInput,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: colors.border,
                      borderRadius: 8,
                      padding: spacing.md,
                      paddingLeft: 42,
                      fontSize: 16,
                      height: 48,
                    },
                  ]}
                  placeholder="Search by name or email..."
                  placeholderTextColor={colors.textSecondary}
                  value={studentSearchQuery}
                  onChangeText={setStudentSearchQuery}
                />
                <Ionicons
                  name="search"
                  size={20}
                  color={colors.textSecondary}
                  style={{ position: 'absolute', left: 12, top: 14 }}
                />
              </View>

              {registeredStudents.length === 0 ? (
                <View style={{ paddingVertical: spacing.lg }}>
                  <ThemedText color="textSecondary" style={{ textAlign: 'center' }}>
                    {studentSearchQuery.trim()
                      ? 'No students found matching your search.'
                      : 'All registered students have collected their meals.'}
                  </ThemedText>
                </View>
              ) : (
                <>
                  <ThemedText variant="body" weight="semibold" style={{ marginBottom: spacing.sm }}>
                    Select Student ({registeredStudents.length} pending)
                  </ThemedText>

                  <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
                    {registeredStudents.map(student => (
                      <TouchableOpacity
                        key={student.id}
                        onPress={() => setSelectedUserId(student.id)}
                        activeOpacity={0.7}
                      >
                        <ThemedCard
                          style={[
                            styles.studentCard,
                            {
                              backgroundColor: selectedUserId === student.id ? `${colors.primary}15` : colors.surface,
                              borderWidth: 2,
                              borderColor: selectedUserId === student.id ? colors.primary : colors.border,
                              marginBottom: spacing.sm,
                            },
                          ]}
                        >
                          <View style={styles.studentCardContent}>
                            <View style={{ flex: 1 }}>
                              <ThemedText variant="body" weight="semibold">
                                {student.fullName}
                              </ThemedText>
                              <ThemedText variant="caption" color="textSecondary">
                                {student.email}
                              </ThemedText>
                            </View>
                            {selectedUserId === student.id && (
                              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                            )}
                          </View>
                        </ThemedCard>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
                    <ThemedButton
                      variant="primary"
                      onPress={handleManualScan}
                      disabled={!selectedUserId}
                    >
                      Mark as Collected
                    </ThemedButton>
                    {selectedUserId && (
                      <ThemedButton
                        variant="outline"
                        onPress={() => setSelectedUserId(null)}
                        icon={<Ionicons name="close-circle" size={20} color={colors.error} />}
                      >
                        Clear Selection
                      </ThemedButton>
                    )}
                  </View>
                </>
              )}
            </ThemedCard>
          </View>
        )}

        {/* Recent Scans - Only for staff/mentors */}
        {!isStudent && recentCollections.length > 0 && (
          <View style={{ marginBottom: spacing.lg }}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time-outline" size={24} color={colors.text} />
              <ThemedText variant="subheading" weight="semibold" style={{ marginLeft: spacing.sm }}>
                Recent Collections ({recentCollections.length})
              </ThemedText>
            </View>
            <View style={{ marginTop: spacing.md }}>
              {recentCollections.map(collection => {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  qrPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  cameraContainer: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanText: {
    position: 'absolute',
    bottom: 60,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentCard: {
    padding: 12,
  },
  studentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
  searchInput: {
    borderWidth: 1,
  },
});
