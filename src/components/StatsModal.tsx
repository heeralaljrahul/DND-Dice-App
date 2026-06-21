import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { RollHistoryEntry } from '../models/RollHistory';

interface StatsModalProps {
  visible: boolean;
  onClose: () => void;
  history: RollHistoryEntry[];
  onClear: () => void;
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export const StatsModal: React.FC<StatsModalProps> = ({ visible, onClose, history, onClear }) => {
  const { colors } = useTheme();

  const totalRolls = history.length;
  const average =
    totalRolls > 0
      ? (history.reduce((sum, e) => sum + e.total, 0) / totalRolls).toFixed(1)
      : '—';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Stats</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeButton, { color: colors.accent }]}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.accent }]}>{totalRolls}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>TOTAL ROLLS</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.accent }]}>{average}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>AVG RESULT</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>RECENT ROLLS</Text>
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {history.length === 0 ? (
            <Text style={[styles.empty, { color: colors.textSecondary }]}>
              No rolls yet. Go roll some dice!
            </Text>
          ) : (
            history.map(entry => (
              <View key={entry.id} style={[styles.row, { borderBottomColor: colors.border }]}>
                <View>
                  <Text style={[styles.rowLabel, { color: colors.text }]}>{entry.label}</Text>
                  <Text style={[styles.rowTime, { color: colors.textSecondary }]}>{timeAgo(entry.timestamp)}</Text>
                </View>
                <View style={styles.rowRight}>
                  {entry.values.length > 1 && (
                    <Text style={[styles.rowValues, { color: colors.textSecondary }]} numberOfLines={1}>
                      {entry.values.join(' + ')}
                    </Text>
                  )}
                  <Text style={[styles.rowTotal, { color: colors.accent }]}>{entry.total}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {history.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
            <Text style={[styles.clearText, { color: colors.danger }]}>Clear History</Text>
          </TouchableOpacity>
        )}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 18,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 18,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 28,
    marginBottom: 4,
    marginHorizontal: 24,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  rowTime: {
    fontSize: 12,
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    maxWidth: '55%',
  },
  rowValues: {
    fontSize: 13,
    flexShrink: 1,
  },
  rowTotal: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  clearBtn: {
    padding: 18,
    alignItems: 'center',
  },
  clearText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
