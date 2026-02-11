/**
 * Countdown Timer - Shows time remaining until meal registration deadline
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../themed/ThemedText';
import { useTheme } from '@/src/theme';

interface CountdownTimerProps {
  targetTime: string; // HH:MM format (e.g., "14:00")
  onExpire?: () => void;
}

export function CountdownTimer({ targetTime, onExpire }: CountdownTimerProps) {
  const { spacing, colors } = useTheme();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const [targetHour, targetMinute] = targetTime.split(':').map(Number);

      const target = new Date();
      target.setHours(targetHour, targetMinute, 0, 0);

      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Deadline passed');
        onExpire?.();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s left`);
      } else {
        setTimeLeft(`${seconds}s left`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onExpire]);

  return (
    <View style={styles.container}>
      <ThemedText variant="caption" weight="semibold" color="warning">
        ⏱ {timeLeft}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
