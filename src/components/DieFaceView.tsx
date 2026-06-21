import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  cancelAnimation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { DieType, getSides } from '../models/DieType';
import { useTheme } from '../theme/ThemeContext';

interface DieFaceViewProps {
  dieType: DieType;
  value: number;
  isRolling: boolean;
  size?: number;
}

export const DieFaceView: React.FC<DieFaceViewProps> = ({
  dieType,
  value,
  isRolling,
  size = 150,
}) => {
  const { colors } = useTheme();

  const isPercentile = dieType === 'd100';
  const sides = getSides(dieType);

  // Local state for the rapid number cycling
  const [displayValue, setDisplayValue] = useState<number>(value);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reanimated value (subtle bounce on the number)
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isRolling) {
      // 1. Start haptic
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // 2. Bounce the number
      scale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withRepeat(withTiming(1.1, { duration: 100 }), 5, true)
      );

      // 3. Start rapid number cycling
      intervalRef.current = setInterval(() => {
        if (isPercentile) {
          const t = Math.floor(Math.random() * 10);
          const u = Math.floor(Math.random() * 10);
          setDisplayValue(t === 0 && u === 0 ? 100 : t * 10 + u);
        } else {
          setDisplayValue(Math.floor(Math.random() * sides) + 1);
        }
      }, 50);
    } else {
      // Stop rolling
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Settle on actual value
      setDisplayValue(value);

      // Final pop
      cancelAnimation(scale);
      scale.value = withSequence(
        withTiming(1.15, { duration: 100 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );

      // Check for natural 20 or 1
      if (dieType === 'd20') {
        if (value === 20) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (value === 1) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRolling, value, dieType, sides, isPercentile, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // The number takes the accent colour, with crit highlights on a d20.
  let numberColor = colors.accent;
  if (dieType === 'd20' && !isRolling) {
    if (value === 20) numberColor = colors.success;
    if (value === 1) numberColor = colors.danger;
  }

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
      <Text
        style={[styles.numberText, { color: numberColor, fontSize: size * 0.7, maxWidth: size * 1.6 }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {displayValue}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontWeight: 'bold',
    fontFamily: 'System',
  },
});
