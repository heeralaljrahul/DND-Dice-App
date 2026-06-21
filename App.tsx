import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { useRollState } from './src/hooks/useRollState';
import { QuickRollScreen } from './src/screens/QuickRollScreen';
import { SettingsModal } from './src/components/SettingsModal';
import { StatsModal } from './src/components/StatsModal';
import { BarChartIcon, GearIcon } from './src/components/Icons';

const MainApp = () => {
  const { colors, mode } = useTheme();
  const rollState = useRollState();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  const isDark = mode === 'dark' || (mode === 'system' && colors.background === '#000000');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Minimal top bar: stats (centered) + settings (right) */}
      <View style={styles.topBar}>
        <View style={styles.sideSpacer} />
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setStatsVisible(true)}
          accessibilityLabel="Roll history"
        >
          <BarChartIcon size={26} color={colors.accent} />
        </TouchableOpacity>
        <View style={[styles.sideSpacer, styles.alignEnd]}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setSettingsVisible(true)}
            accessibilityLabel="Settings"
          >
            <GearIcon size={26} color={colors.accent} bgColor={colors.background} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <QuickRollScreen
          selectedDie={rollState.selectedDie}
          setSelectedDie={rollState.setSelectedDie}
          currentResult={rollState.currentResult}
          isRolling={rollState.isRolling}
          onRoll={rollState.rollSelected}
        />
      </View>

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
      <StatsModal
        visible={statsVisible}
        onClose={() => setStatsVisible(false)}
        history={rollState.history}
        onClear={rollState.clearHistory}
      />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sideSpacer: {
    flex: 1,
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  iconBtn: {
    padding: 6,
  },
  content: {
    flex: 1,
  },
});
