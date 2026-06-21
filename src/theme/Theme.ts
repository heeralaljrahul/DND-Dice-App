import { Appearance } from 'react-native';

export type AppThemeMode = 'light' | 'dark' | 'system';

export const ACCENT_COLORS = [
  '#ef4444', // Red
  '#10b981', // Emerald
  '#3b82f6', // Royal Blue
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#6b7280', // Monochrome
];

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  success: string;
  danger: string;
}

export function getThemeColors(mode: AppThemeMode, accentColor: string): ThemeColors {
  const isDark = mode === 'dark' || (mode === 'system' && Appearance.getColorScheme() === 'dark');

  return {
    background: isDark ? '#000000' : '#f9fafb',
    surface: isDark ? '#111827' : '#ffffff',
    text: isDark ? '#ffffff' : '#111827',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
    accent: accentColor,
    success: '#10b981', // Natural 20
    danger: '#ef4444',  // Natural 1
  };
}
