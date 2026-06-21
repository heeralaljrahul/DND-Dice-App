import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { impact, ImpactFeedbackStyle } from '../utils/haptics';
import { DieFaceView } from '../components/DieFaceView';
import { DieShape } from '../components/DieShape';
import { DieType, RollResult, getDieName } from '../models/DieType';
import { useTheme } from '../theme/ThemeContext';

interface QuickRollScreenProps {
  selectedDie: DieType;
  setSelectedDie: (die: DieType) => void;
  currentResult: RollResult | null;
  isRolling: boolean;
  roll: (die: DieType, count: number) => void;
}

const STANDARD_DICE: DieType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
const MAX_QUANTITY = 20;

export const QuickRollScreen: React.FC<QuickRollScreenProps> = ({
  selectedDie,
  setSelectedDie,
  currentResult,
  isRolling,
  roll,
}) => {
  const { colors } = useTheme();
  const [quantity, setQuantity] = useState(1);

  // Inline prompt for a custom-sided die
  const [customVisible, setCustomVisible] = useState(false);
  const [customSidesInput, setCustomSidesInput] = useState('');

  const isCustom = typeof selectedDie === 'object';
  const label = `${quantity}${getDieName(selectedDie)}`;
  const breakdown =
    currentResult && currentResult.values.length > 1
      ? currentResult.values.join(' + ')
      : null;

  const adjustQuantity = (amount: number) => {
    setQuantity(prev => Math.max(1, Math.min(MAX_QUANTITY, prev + amount)));
    impact(ImpactFeedbackStyle.Light);
  };

  const selectDie = (die: DieType) => {
    setSelectedDie(die);
    roll(die, quantity);
  };

  const submitCustom = () => {
    const sides = parseInt(customSidesInput, 10);
    if (!isNaN(sides) && sides >= 2) {
      const die: DieType = { type: 'custom', sides: Math.min(sides, 1000) };
      setSelectedDie(die);
      roll(die, quantity);
    }
    setCustomVisible(false);
    setCustomSidesInput('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerStage}>
        <Text style={[styles.dieLabel, { color: colors.textSecondary }]}>{label}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => roll(selectedDie, quantity)}
          disabled={isRolling}
        >
          <DieFaceView
            dieType={selectedDie}
            value={currentResult?.total ?? getSidesFromDie(selectedDie)}
            isRolling={isRolling}
            size={200}
          />
        </TouchableOpacity>
        {breakdown && !isRolling && (
          <Text style={[styles.breakdown, { color: colors.textSecondary }]} numberOfLines={2}>
            {breakdown}
          </Text>
        )}
      </View>

      {/* Quantity stepper */}
      <View style={styles.quantityRow}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => adjustQuantity(-1)}
          disabled={quantity <= 1}
        >
          <Text style={[styles.stepText, { color: quantity <= 1 ? colors.border : colors.accent }]}>−</Text>
        </TouchableOpacity>
        <Text style={[styles.quantityText, { color: colors.text }]}>
          {quantity} {quantity === 1 ? 'die' : 'dice'}
        </Text>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => adjustQuantity(1)}
          disabled={quantity >= MAX_QUANTITY}
        >
          <Text style={[styles.stepText, { color: quantity >= MAX_QUANTITY ? colors.border : colors.accent }]}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Die selector */}
      <View style={styles.bottomBar}>
        {STANDARD_DICE.map(die => {
          const isSelected = typeof selectedDie === 'string' && selectedDie === die;
          const tint = isSelected ? colors.accent : colors.textSecondary;
          return (
            <TouchableOpacity key={die as string} style={styles.dieButton} onPress={() => selectDie(die)}>
              <DieShape dieType={die} size={32} color={tint} />
              <Text style={[styles.dieButtonText, { color: tint }]}>{getDieName(die).toUpperCase()}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.dieButton} onPress={() => setCustomVisible(true)}>
          <DieShape dieType={{ type: 'custom', sides: 0 }} size={32} color={isCustom ? colors.accent : colors.textSecondary} />
          <Text style={[styles.dieButtonText, { color: isCustom ? colors.accent : colors.textSecondary }]}>
            {isCustom ? getDieName(selectedDie).toUpperCase() : 'CUSTOM'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom sides prompt */}
      {customVisible && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[StyleSheet.absoluteFill, styles.promptOverlay]}
        >
          <View style={[styles.promptBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.promptTitle, { color: colors.text }]}>Custom Sides</Text>
            <TextInput
              style={[styles.promptInput, { color: colors.text, borderColor: colors.border }]}
              keyboardType="number-pad"
              autoFocus
              placeholder="e.g. 80"
              placeholderTextColor={colors.textSecondary}
              value={customSidesInput}
              onChangeText={setCustomSidesInput}
            />
            <View style={styles.promptActions}>
              <TouchableOpacity onPress={() => setCustomVisible(false)} style={styles.promptBtn}>
                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitCustom} style={styles.promptBtn}>
                <Text style={{ color: colors.accent, fontWeight: 'bold' }}>Roll</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
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
  breakdown: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepBtn: {
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  stepText: {
    fontSize: 30,
    fontWeight: '400',
  },
  quantityText: {
    fontSize: 17,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 6,
    paddingBottom: 24,
  },
  dieButton: {
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  dieButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  promptOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  promptBox: {
    width: '80%',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  promptInput: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  promptActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  promptBtn: {
    padding: 10,
  },
});
