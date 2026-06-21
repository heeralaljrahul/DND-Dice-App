import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text } from 'react-native';
import { DieFaceView } from '../components/DieFaceView';
import { DieType, RollResult, getDieName } from '../models/DieType';
import { useTheme } from '../theme/ThemeContext';

interface QuickRollScreenProps {
  selectedDie: DieType;
  setSelectedDie: (die: DieType) => void;
  currentResult: RollResult | null;
  isRolling: boolean;
  onRoll: () => void;
  onCustomSelected: () => void; // Will trigger mode change or prompt
}

const STANDARD_DICE: DieType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

export const QuickRollScreen: React.FC<QuickRollScreenProps> = ({
  selectedDie,
  setSelectedDie,
  currentResult,
  isRolling,
  onRoll,
  onCustomSelected,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.centerStage}>
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={onRoll}
          disabled={isRolling}
        >
          <DieFaceView 
            dieType={selectedDie} 
            value={currentResult?.total ?? getSidesFromDie(selectedDie)}
            components={currentResult?.components}
            isRolling={isRolling} 
            size={180} 
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {STANDARD_DICE.map(die => {
            const isSelected = typeof selectedDie === 'string' && selectedDie === die;
            return (
              <TouchableOpacity
                key={die as string}
                style={[
                  styles.dieButton,
                  isSelected && { borderBottomWidth: 3, borderBottomColor: colors.accent }
                ]}
                onPress={() => {
                  setSelectedDie(die);
                  if (!isSelected) onRoll();
                }}
              >
                <Text style={[
                  styles.dieButtonText, 
                  { color: isSelected ? colors.accent : colors.textSecondary },
                  isSelected && { fontWeight: 'bold' }
                ]}>
                  {getDieName(die)}
                </Text>
              </TouchableOpacity>
            );
          })}
          
          <TouchableOpacity
            style={[
              styles.dieButton,
              typeof selectedDie === 'object' && selectedDie.type === 'custom' && { borderBottomWidth: 3, borderBottomColor: colors.accent }
            ]}
            onPress={onCustomSelected}
          >
            <Text style={[
              styles.dieButtonText, 
              { color: typeof selectedDie === 'object' ? colors.accent : colors.textSecondary },
              typeof selectedDie === 'object' && { fontWeight: 'bold' }
            ]}>
              Custom
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
  } else {
    return dieType.sides;
  }
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
  bottomBar: {
    height: 80,
    borderTopWidth: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  dieButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  dieButtonText: {
    fontSize: 18,
  }
});
