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

  // For custom mode
  const [customMultiResults, setCustomMultiResults] = useState<RollResult | null>(null);

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

  const rollSelected = useCallback(() => {
    if (isRolling) return; // Prevent spamming
    setIsRolling(true);

    // Keep it spinning for ~700ms
    setTimeout(() => {
      const result = DiceRoller.rollSingle(selectedDie);
      setCurrentResult(result);
      recordRoll(result, 1);
      setIsRolling(false);
    }, 700);
  }, [selectedDie, isRolling, recordRoll]);

  const rollMultiple = useCallback((die: DieType, count: number) => {
    if (isRolling) return;
    setIsRolling(true);

    setTimeout(() => {
      const result = DiceRoller.rollMultiple(die, count);
      setCustomMultiResults(result);
      recordRoll(result, count);
      setIsRolling(false);
    }, 700);
  }, [isRolling, recordRoll]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    AsyncStorage.removeItem(HISTORY_KEY).catch(() => {});
  }, []);

  return {
    selectedDie,
    setSelectedDie,
    isRolling,
    currentResult,
    customMultiResults,
    rollSelected,
    rollMultiple,
    history,
    clearHistory,
  };
};
