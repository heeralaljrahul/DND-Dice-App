import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, StatusBar, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { useRollState } from './src/hooks/useRollState';
import { QuickRollScreen } from './src/screens/QuickRollScreen';
import { CustomRollScreen } from './src/screens/CustomRollScreen';
import { SettingsModal } from './src/components/SettingsModal';
import { DieType } from './src/models/DieType';

type AppMode = 'roll' | 'custom';

const MainApp = () => {
  const { colors, mode } = useTheme();
  const rollState = useRollState();
  const [appMode, setAppMode] = useState<AppMode>('roll');
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Custom single die prompt state
  const [customPromptVisible, setCustomPromptVisible] = useState(false);
  const [customSidesInput, setCustomSidesInput] = useState('');

  const handleCustomSubmit = () => {
    const sides = parseInt(customSidesInput, 10);
    if (!isNaN(sides) && sides >= 2) {
      const die: DieType = { type: 'custom', sides: Math.min(sides, 1000) };
      rollState.setSelectedDie(die);
      rollState.rollSelected();
    }
    setCustomPromptVisible(false);
    setCustomSidesInput('');
  };

  const isDark = mode === 'dark' || (mode === 'system' && colors.background === '#000000');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Top Bar */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <View style={styles.modeToggleContainer}>
          <TouchableOpacity 
            style={[
              styles.modeToggleBtn, 
              appMode === 'roll' && { backgroundColor: colors.accent }
            ]} 
            onPress={() => setAppMode('roll')}
          >
            <Text style={[
              styles.modeToggleText, 
              { color: appMode === 'roll' ? colors.background : colors.textSecondary }
            ]}>Roll</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.modeToggleBtn, 
              appMode === 'custom' && { backgroundColor: colors.accent }
            ]} 
            onPress={() => setAppMode('custom')}
          >
            <Text style={[
              styles.modeToggleText, 
              { color: appMode === 'custom' ? colors.background : colors.textSecondary }
            ]}>Custom</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setSettingsVisible(true)}>
          <Text style={[styles.settingsIcon, { color: colors.textSecondary }]}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {appMode === 'roll' ? (
          <QuickRollScreen
            selectedDie={rollState.selectedDie}
            setSelectedDie={rollState.setSelectedDie}
            currentResult={rollState.currentResult}
            isRolling={rollState.isRolling}
            onRoll={rollState.rollSelected}
            onCustomSelected={() => setCustomPromptVisible(true)}
          />
        ) : (
          <CustomRollScreen
            onRoll={rollState.rollMultiple}
            result={rollState.customMultiResults}
            isRolling={rollState.isRolling}
          />
        )}
      </View>

      {/* Custom Inline Prompt for Quick Roll */}
      {customPromptVisible && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[StyleSheet.absoluteFill, styles.customPromptOverlay]}>
          <View style={[styles.customPromptBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.customPromptTitle, { color: colors.text }]}>Custom Sides</Text>
            <TextInput
              style={[styles.customPromptInput, { color: colors.text, borderColor: colors.border }]}
              keyboardType="number-pad"
              autoFocus
              placeholder="e.g. 80"
              placeholderTextColor={colors.textSecondary}
              value={customSidesInput}
              onChangeText={setCustomSidesInput}
            />
            <View style={styles.customPromptActions}>
              <TouchableOpacity onPress={() => setCustomPromptVisible(false)} style={styles.customPromptBtn}>
                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCustomSubmit} style={styles.customPromptBtn}>
                <Text style={{ color: colors.accent, fontWeight: 'bold' }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 2,
  },
  modeToggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  modeToggleText: {
    fontWeight: '600',
  },
  settingsIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  customPromptOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  customPromptBox: {
    width: '80%',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
  },
  customPromptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  customPromptInput: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  customPromptActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  customPromptBtn: {
    padding: 10,
  }
});
