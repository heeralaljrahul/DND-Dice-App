import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { DieType, getDieName, getSides } from '../models/DieType';
import { RollResult } from '../models/DieType';
import { useTheme } from '../theme/ThemeContext';
import * as Haptics from 'expo-haptics';

interface CustomRollScreenProps {
  onRoll: (die: DieType, count: number) => void;
  result: RollResult | null;
  isRolling: boolean;
}

const STANDARD_DICE: DieType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

export const CustomRollScreen: React.FC<CustomRollScreenProps> = ({ onRoll, result, isRolling }) => {
  const { colors } = useTheme();
  
  const [selectedDie, setSelectedDie] = useState<DieType>('d20');
  const [quantity, setQuantity] = useState<number>(1);
  const [customSides, setCustomSides] = useState<string>('');

  const handleRoll = () => {
    let finalDie = selectedDie;
    if (typeof selectedDie === 'object') {
      const sides = parseInt(customSides, 10);
      if (isNaN(sides) || sides < 2) {
        // Fallback gracefully
        finalDie = { type: 'custom', sides: 2 };
      } else {
        finalDie = { type: 'custom', sides: Math.min(sides, 1000) };
      }
    }

    const safeQuantity = Math.max(1, Math.min(20, quantity));
    setQuantity(safeQuantity);

    onRoll(finalDie, safeQuantity);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const adjustQuantity = (amount: number) => {
    setQuantity(prev => Math.max(1, Math.min(20, prev + amount)));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <Text style={[styles.label, { color: colors.textSecondary }]}>DIE TYPE</Text>
      <View style={styles.diePicker}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {STANDARD_DICE.map(die => {
            const isSelected = typeof selectedDie === 'string' && selectedDie === die;
            return (
              <TouchableOpacity
                key={die as string}
                style={[
                  styles.pickerPill,
                  { backgroundColor: isSelected ? colors.accent : colors.surface, borderColor: colors.border }
                ]}
                onPress={() => setSelectedDie(die)}
              >
                <Text style={[
                  styles.pickerText,
                  { color: isSelected ? colors.background : colors.text }
                ]}>
                  {getDieName(die)}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={[
              styles.pickerPill,
              { backgroundColor: typeof selectedDie === 'object' ? colors.accent : colors.surface, borderColor: colors.border }
            ]}
            onPress={() => setSelectedDie({ type: 'custom', sides: 100 })}
          >
            <Text style={[
              styles.pickerText,
              { color: typeof selectedDie === 'object' ? colors.background : colors.text }
            ]}>
              Custom
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {typeof selectedDie === 'object' && (
        <View style={styles.customSidesContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>SIDES</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
            keyboardType="number-pad"
            value={customSides}
            onChangeText={setCustomSides}
            placeholder="e.g. 80"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      )}

      <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>QUANTITY (1-20)</Text>
      <View style={styles.stepperContainer}>
        <TouchableOpacity style={[styles.stepperBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => adjustQuantity(-1)}>
          <Text style={[styles.stepperBtnText, { color: colors.text }]}>-</Text>
        </TouchableOpacity>
        <Text style={[styles.quantityText, { color: colors.text }]}>{quantity}</Text>
        <TouchableOpacity style={[styles.stepperBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => adjustQuantity(1)}>
          <Text style={[styles.stepperBtnText, { color: colors.text }]}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.rollButton, { backgroundColor: colors.accent, opacity: isRolling ? 0.5 : 1 }]}
        onPress={handleRoll}
        disabled={isRolling}
      >
        <Text style={[styles.rollButtonText, { color: colors.background }]}>
          {isRolling ? 'Rolling...' : `Roll ${quantity} ${getDieName(selectedDie)}`}
        </Text>
      </TouchableOpacity>

      {result && (
        <View style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.resultTotal, { color: colors.text }]}>Total: {result.total}</Text>
          <View style={styles.resultValues}>
            {result.values.map((v, idx) => (
              <View key={idx} style={[styles.valuePill, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.valueText, { color: colors.text }]}>{v}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  diePicker: {
    marginBottom: 20,
  },
  pickerPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  pickerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  customSidesContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  stepperBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    fontSize: 24,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  rollButton: {
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  rollButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultCard: {
    borderRadius: 15,
    borderWidth: 1,
    padding: 20,
  },
  resultTotal: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  resultValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  valuePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '600',
  }
});
