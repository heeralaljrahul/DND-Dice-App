import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ACCENT_COLORS, AppThemeMode } from '../theme/Theme';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { mode, setMode, accentColor, setAccentColor, colors } = useTheme();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeButton, { color: colors.accent }]}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {(['light', 'dark', 'system'] as AppThemeMode[]).map((m, index, arr) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.row,
                  index !== arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                ]}
                onPress={() => setMode(m)}
              >
                <Text style={[styles.rowText, { color: colors.text }]}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </Text>
                {mode === m && <Text style={{ color: colors.accent, fontWeight: 'bold' }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACCENT COLOR</Text>
          <View style={[styles.colorContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {ACCENT_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  accentColor === color && { borderWidth: 3, borderColor: colors.text }
                ]}
                onPress={() => setAccentColor(color)}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 8,
    fontWeight: '600',
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  rowText: {
    fontSize: 17,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  }
});
