import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppThemeMode, ACCENT_COLORS, ThemeColors, getThemeColors } from './Theme';
import { useColorScheme } from 'react-native';

interface ThemeContextProps {
  mode: AppThemeMode;
  accentColor: string;
  colors: ThemeColors;
  setMode: (mode: AppThemeMode) => void;
  setAccentColor: (color: string) => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const THEME_MODE_KEY = '@DiceApp:ThemeMode';
const ACCENT_COLOR_KEY = '@DiceApp:AccentColor';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<AppThemeMode>('system');
  const [accentColor, setAccentColorState] = useState<string>(ACCENT_COLORS[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedMode = await AsyncStorage.getItem(THEME_MODE_KEY);
        const storedColor = await AsyncStorage.getItem(ACCENT_COLOR_KEY);

        if (storedMode) setModeState(storedMode as AppThemeMode);
        if (storedColor) setAccentColorState(storedColor);
      } catch (e) {
        console.error('Failed to load theme settings', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadSettings();
  }, []);

  const setMode = async (newMode: AppThemeMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(THEME_MODE_KEY, newMode);
    } catch (e) {}
  };

  const setAccentColor = async (newColor: string) => {
    setAccentColorState(newColor);
    try {
      await AsyncStorage.setItem(ACCENT_COLOR_KEY, newColor);
    } catch (e) {}
  };

  // Re-calculate colors if system mode changes and we are in system mode
  const colors = getThemeColors(mode, accentColor);

  return (
    <ThemeContext.Provider value={{ mode, accentColor, colors, setMode, setAccentColor, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
