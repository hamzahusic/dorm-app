/**
 * Color system for light and dark modes
 */

export const lightColors = {
  // Brand colors
  primary: '#2563EB', // Blue
  secondary: '#10B981', // Green
  accent: '#F59E0B', // Amber

  // Status colors
  error: '#EF4444', // Red
  warning: '#F59E0B', // Amber
  success: '#10B981', // Green
  info: '#3B82F6', // Light blue

  // Background colors
  background: '#FFFFFF',
  surface: '#F9FAFB',
  card: '#FFFFFF',

  // Text colors
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Interactive states
  hover: '#F3F4F6',
  pressed: '#E5E7EB',
  disabled: '#D1D5DB',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkColors = {
  // Brand colors (same as light for consistency)
  primary: '#2563EB',
  secondary: '#10B981',
  accent: '#F59E0B',

  // Status colors
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',

  // Background colors
  background: '#000000',
  surface: '#1F2937',
  card: '#111827',

  // Text colors
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',

  // Border colors
  border: '#374151',
  borderLight: '#1F2937',

  // Interactive states
  hover: '#374151',
  pressed: '#4B5563',
  disabled: '#4B5563',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.4)',
};

export type ColorScheme = typeof lightColors;
