import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import QRCode from 'react-native-qrcode-svg';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { ThemedButton } from '@/src/components/themed/ThemedButton';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useTheme } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';
import type { Meal } from '@/src/types';

interface QRGeneratorSectionProps {
  meal: Meal;
  stats: { total: number; collected: number; pending: number } | null;
}

export function QRGeneratorSection({ meal, stats }: QRGeneratorSectionProps) {
  const { spacing, colors } = useTheme();
  const [showQRCode, setShowQRCode] = useState(false);

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <SectionHeader icon="qr-code" title="Meal QR Code" />
      <ThemedCard style={{ marginTop: spacing.md }}>
        {!showQRCode ? (
          <View style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
            <View style={[styles.qrIconContainer, { backgroundColor: `${colors.primary}15`, marginBottom: spacing.md }]}>
              <Ionicons name="qr-code-outline" size={48} color={colors.primary} />
            </View>
            <ThemedText variant="subheading" weight="semibold" style={{ marginBottom: spacing.xs, textAlign: 'center' }}>
              Generate QR Code
            </ThemedText>
            <ThemedText variant="caption" color="textSecondary" style={{ marginBottom: spacing.lg, textAlign: 'center' }}>
              Students can scan this code to collect their meal
            </ThemedText>
            <ThemedButton
              variant="primary"
              onPress={() => {
                setShowQRCode(true);
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
              }}
              icon={<Ionicons name="create-outline" size={20} color="#FFFFFF" />}
            >
              Generate QR Code
            </ThemedButton>
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
            <View style={[styles.qrCodeContainer, { backgroundColor: '#FFFFFF', padding: spacing.lg, borderRadius: 12, marginBottom: spacing.md }]}>
              <QRCode
                value={JSON.stringify({
                  mealId: meal.id,
                  mealName: meal.mealName,
                  date: meal.date,
                  timestamp: new Date().toISOString(),
                })}
                size={200}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
            </View>

            <View style={{ alignItems: 'center', marginBottom: spacing.md }}>
              <ThemedText variant="subheading" weight="bold" style={{ marginBottom: spacing.xs }}>
                {meal.mealName}
              </ThemedText>
              <ThemedText variant="caption" color="textSecondary">
                Students can scan this code to collect their meal
              </ThemedText>
            </View>

            {stats && (
              <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg }}>
                <View style={{ alignItems: 'center' }}>
                  <ThemedText variant="subheading" weight="bold" color="primary">{stats.total}</ThemedText>
                  <ThemedText variant="caption" color="textSecondary">Registered</ThemedText>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <ThemedText variant="subheading" weight="bold" color="success">{stats.collected}</ThemedText>
                  <ThemedText variant="caption" color="textSecondary">Collected</ThemedText>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <ThemedText variant="subheading" weight="bold" color="warning">{stats.pending}</ThemedText>
                  <ThemedText variant="caption" color="textSecondary">Pending</ThemedText>
                </View>
              </View>
            )}

            <ThemedButton
              variant="outline"
              onPress={() => setShowQRCode(false)}
              icon={<Ionicons name="eye-off-outline" size={20} color={colors.primary} />}
            >
              Hide QR Code
            </ThemedButton>
          </View>
        )}
      </ThemedCard>
    </View>
  );
}

const styles = StyleSheet.create({
  qrIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
