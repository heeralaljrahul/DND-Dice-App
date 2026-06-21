import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { DieFaceView } from '../components/DieFaceView';
import { DieShape } from '../components/DieShape';
import { DieType, RollResult, getDieName } from '../models/DieType';
import { useTheme } from '../theme/ThemeContext';

interface QuickRollScreenProps {
  selectedDie: DieType;
  setSelectedDie: (die: DieType) => void;
  currentResult: RollResult | null;
  isRolling: boolean;
  onRoll: () => void;
}

const STANDARD_DICE: DieType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

export const QuickRollScreen: React.FC<QuickRollScreenProps> = ({
  selectedDie,
  setSelectedDie,
  currentResult,
  isRolling,
  onRoll,
}) => {
  const { colors } = useTheme();
  const label = `1${getDieName(selectedDie)}`;

  return (
    <View style={styles.container}>
      <View style={styles.centerStage}>
        <Text style={[styles.dieLabel, { color: colors.textSecondary }]}>{label}</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={onRoll} disabled={isRolling}>
          <DieFaceView
            dieType={selectedDie}
            value={currentResult?.total ?? getSidesFromDie(selectedDie)}
            isRolling={isRolling}
            size={200}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        {STANDARD_DICE.map(die => {
          const isSelected = typeof selectedDie === 'string' && selectedDie === die;
          const tint = isSelected ? colors.accent : colors.textSecondary;
          return (
            <TouchableOpacity
              key={die as string}
              style={styles.dieButton}
              onPress={() => {
                setSelectedDie(die);
                onRoll();
              }}
            >
              <DieShape dieType={die} size={34} color={tint} />
              <Text style={[styles.dieButtonText, { color: tint }]}>
                {getDieName(die).toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

function getSidesFromDie(dieType: DieType): number {
  if (typeof dieType === 'string') {
    switch (dieType) {
      case 'd4': return 4;
      case 'd6': return 6;
      case 'd8': return 8;
      case 'd10': return 10;
      case 'd12': return 12;
      case 'd20': return 20;
      case 'd100': return 100;
    }
  }
  return typeof dieType === 'object' ? dieType.sides : 20;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dieLabel: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 8,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  dieButton: {
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  dieButtonText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
});
