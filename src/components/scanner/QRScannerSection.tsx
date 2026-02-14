import React, { useRef } from 'react';
import { View, StyleSheet, Platform, Alert, TouchableOpacity } from 'react-native';
import { CameraView } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedCard } from '@/src/components/themed/ThemedCard';
import { ThemedButton } from '@/src/components/themed/ThemedButton';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { useTheme } from '@/src/theme';
import { Ionicons } from '@expo/vector-icons';

interface QRScannerSectionProps {
  showCamera: boolean;
  setShowCamera: (show: boolean) => void;
  isStudent: boolean;
}

export function QRScannerSection({ showCamera, setShowCamera, isStudent }: QRScannerSectionProps) {
  const { spacing, colors } = useTheme();
  const [scanned, setScanned] = React.useState(false);
  const isProcessingScan = useRef(false);

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    if (isProcessingScan.current) return;
    isProcessingScan.current = true;

    setScanned(true);
    setShowCamera(false);

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    Alert.alert(
      '✅ QR Code Scanned',
      `Successfully scanned QR code and collected dinner!\n\nData: ${data}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setScanned(false);
            isProcessingScan.current = false;
          },
        },
      ]
    );
  };

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <SectionHeader icon="qr-code" title="QR Scanner" />
      <ThemedCard style={{ marginTop: spacing.md }}>
        {showCamera ? (
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
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
  );
}

const styles = StyleSheet.create({
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
  qrPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});
