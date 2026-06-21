import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DieType, RollResult, getDieName } from '../models/DieType';
import { DiceRoller } from '../models/DiceRoller';
import { RollHistoryEntry } from '../models/RollHistory';

const HISTORY_KEY = '@DiceApp:RollHistory';
const MAX_HISTORY = 200;

export const useRollState = () => {
  const [selectedDie, setSelectedDie] = useState<DieType>('d20');
  const [isRolling, setIsRolling] = useState(false);
  const [currentResult, setCurrentResult] = useState<RollResult | null>(null);

  // Persisted roll history (most recent first)
  const [history, setHistory] = useState<RollHistoryEntry[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY);
        if (raw) setHistory(JSON.parse(raw));
      } catch (e) {}
    };
    loadHistory();
  }, []);

  const recordRoll = useCallback((result: RollResult, count: number) => {
    const entry: RollHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      label: `${count}${getDieName(result.dieType)}`,
      total: result.total,
      values: result.values,
      timestamp: Date.now(),
    };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, MAX_HISTORY);
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  // Unified roll: count === 1 rolls a single die (percentile-aware for d100),
  // count > 1 rolls and sums multiple dice of the same type.
  const roll = useCallback(
    (die: DieType, count: number) => {
      if (isRolling) return; // Prevent spamming
      const safeCount = Math.max(1, Math.min(20, count));
      setIsRolling(true);

      // Keep it spinning for ~700ms
      setTimeout(() => {
        const result =
          safeCount === 1
            ? DiceRoller.rollSingle(die)
            : DiceRoller.rollMultiple(die, safeCount);
        setCurrentResult(result);
        recordRoll(result, safeCount);
        setIsRolling(false);
      }, 700);
    },
    [isRolling, recordRoll]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    AsyncStorage.removeItem(HISTORY_KEY).catch(() => {});
  }, []);

  return {
    selectedDie,
    setSelectedDie,
    isRolling,
    currentResult,
    roll,
    history,
    clearHistory,
  };
};
