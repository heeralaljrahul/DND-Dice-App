import { useState, useCallback } from 'react';
import { DieType, RollResult, getSides } from '../models/DieType';
import { DiceRoller } from '../models/DiceRoller';

export const useRollState = () => {
  const [selectedDie, setSelectedDie] = useState<DieType>('d20');
  const [isRolling, setIsRolling] = useState(false);
  const [currentResult, setCurrentResult] = useState<RollResult | null>(null);

  // For custom mode
  const [customMultiResults, setCustomMultiResults] = useState<RollResult | null>(null);

  const rollSelected = useCallback(() => {
    if (isRolling) return; // Prevent spamming
    setIsRolling(true);

    // Keep it spinning for ~700ms
    setTimeout(() => {
      const result = DiceRoller.rollSingle(selectedDie);
      setCurrentResult(result);
      setIsRolling(false);
    }, 700);
  }, [selectedDie, isRolling]);

  const rollMultiple = useCallback((die: DieType, count: number) => {
    if (isRolling) return;
    setIsRolling(true);

    setTimeout(() => {
      const result = DiceRoller.rollMultiple(die, count);
      setCustomMultiResults(result);
      setIsRolling(false);
    }, 700);
  }, [isRolling]);

  return {
    selectedDie,
    setSelectedDie,
    isRolling,
    currentResult,
    customMultiResults,
    rollSelected,
    rollMultiple,
  };
};
